/* eslint-disable no-console */
const fs = require('fs/promises');
const path = require('path');
const geojsonvt = require('geojson-vt').default;
const vtpbf = require('vt-pbf');

const BASE_DIR = path.resolve(__dirname, '..');
const WFS_DIR = path.join(BASE_DIR, 'public', 'data', 'wfs');
const MVT_DIR = path.join(BASE_DIR, 'public', 'data', 'mvt');
const MVT_METADATA_PATH = path.join(MVT_DIR, 'metadata.json');
const { spawn } = require('child_process');

const MIN_ZOOM = Number.parseInt(process.env.MVT_MIN_ZOOM || '12', 10);
const MAX_ZOOM = Number.parseInt(process.env.MVT_MAX_ZOOM || '18', 10);

// Define three detail tiers with tuned geojson-vt options:
// - low: coarse simplification for low zooms
// - mid: balanced simplification for medium zooms
// - high: minimal simplification for high zooms (preserve line detail)
const TILE_INDEX_SETS = {
  low: {
    // coarse: higher tolerance -> fewer vertices (lower zooms don't need high detail)
    tolerance: 6,
    extent: 4096,
    buffer: 64,
    lineMetrics: false,
    generateId: false,
    maxZoom: 8,
    indexMaxZoom: 6,
    indexMaxPoints: 100000,
  },
  mid: {
    // balanced simplification for medium zoom levels
    tolerance: 2,
    extent: 4096,
    buffer: 64,
    lineMetrics: false,
    generateId: false,
    maxZoom: 12,
    indexMaxZoom: 10,
    indexMaxPoints: 200000,
  },
  high: {
    // preserve detail: very small tolerance to keep all line segments at high zoom
    tolerance: 0.1,
    extent: 4096,
    buffer: 64,
    lineMetrics: false,
    generateId: false,
    maxZoom: 22,
    indexMaxZoom: 18,
    indexMaxPoints: 500000,
  },
};

function assertZoomRange(minZoom, maxZoom) {
  if (!Number.isFinite(minZoom) || !Number.isFinite(maxZoom)) {
    throw new Error('MVT zoom values must be numbers.');
  }
  if (minZoom < 0 || maxZoom > 22 || minZoom > maxZoom) {
    throw new Error(`Invalid zoom range: min=${minZoom}, max=${maxZoom}`);
  }
}

function toTileX(lon, z) {
  const n = Math.pow(2, z);
  return Math.floor(((lon + 180) / 360) * n);
}

function toTileY(lat, z) {
  const latClamped = Math.max(-85.05112878, Math.min(85.05112878, lat));
  const latRad = (latClamped * Math.PI) / 180;
  const n = Math.pow(2, z);
  return Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );
}

function updateBounds(bounds, lon, lat) {
  if (lon < bounds.minLon) bounds.minLon = lon;
  if (lon > bounds.maxLon) bounds.maxLon = lon;
  if (lat < bounds.minLat) bounds.minLat = lat;
  if (lat > bounds.maxLat) bounds.maxLat = lat;
}

function collectBoundsFromCoords(coords, bounds) {
  if (!Array.isArray(coords) || coords.length === 0) return;
  if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
    updateBounds(bounds, coords[0], coords[1]);
    return;
  }
  for (const child of coords) {
    collectBoundsFromCoords(child, bounds);
  }
}

function getFeatureCollectionBounds(featureCollection) {
  const bounds = {
    minLon: Number.POSITIVE_INFINITY,
    minLat: Number.POSITIVE_INFINITY,
    maxLon: Number.NEGATIVE_INFINITY,
    maxLat: Number.NEGATIVE_INFINITY,
  };

  const features = Array.isArray(featureCollection.features)
    ? featureCollection.features
    : [];

  for (const feature of features) {
    const geom = feature && feature.geometry;
    if (!geom || !geom.coordinates) continue;
    collectBoundsFromCoords(geom.coordinates, bounds);
  }

  if (!Number.isFinite(bounds.minLon) || !Number.isFinite(bounds.minLat)) {
    return null;
  }

  return bounds;
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function normalizeMvtLayerName(typeName) {
  return typeName.replace(/[^A-Za-z0-9_]/g, '_');
}

function typeNameFromDirName(dirName) {
  const sep = dirName.indexOf('_');
  if (sep === -1) return dirName;
  return `${dirName.slice(0, sep)}:${dirName.slice(sep + 1)}`;
}

async function listLayerDirs() {
  const entries = await fs.readdir(WFS_DIR, { withFileTypes: true });
  return entries
    .filter((d) => d.isDirectory() && d.name.startsWith('csdi_'))
    .map((d) => d.name)
    .sort();
}

async function removeDirContents(dirPath) {
  const exists = await fileExists(dirPath);
  if (!exists) return;
  await fs.rm(dirPath, { recursive: true, force: true });
}

async function buildLayerTiles(layerDirName, minZoom, maxZoom) {
  const rawPath = path.join(WFS_DIR, layerDirName, 'raw.json');
  const hasRaw = await fileExists(rawPath);
  if (!hasRaw) {
    return { skipped: true, reason: 'missing raw.json', layerDirName };
  }

  let rawText = await fs.readFile(rawPath, 'utf8');
  let featureCollection = JSON.parse(rawText);
  rawText = null; // Clear memory after parsing
  let features = Array.isArray(featureCollection.features) ? featureCollection.features : [];
  const featureCount = features.length;

  if (featureCount === 0) {
    featureCollection = null;
    features = null;
    return { skipped: true, reason: 'empty features', layerDirName };
  }

  // Log feature types for debugging line loss issues
  const featureTypes = {};
  features.forEach((f) => {
    const geomType = f && f.geometry && f.geometry.type ? f.geometry.type : 'unknown';
    featureTypes[geomType] = (featureTypes[geomType] || 0) + 1;
  });
  console.log(`  Feature types: ${JSON.stringify(featureTypes)}`);

  const typeName = typeNameFromDirName(layerDirName);
  const mvtLayerName = normalizeMvtLayerName(typeName);
  const bounds = getFeatureCollectionBounds(featureCollection);
  if (!bounds) {
    console.log(`  ERROR: No valid geometry bounds found for ${layerDirName}. Feature details:`, featureTypes);
    featureCollection = null;
    features = null;
    return { skipped: true, reason: 'no valid geometry bounds', layerDirName };
  }

  const outLayerDir = path.join(MVT_DIR, layerDirName);
  await removeDirContents(outLayerDir);

  const nByZoom = {};
  let tilesWritten = 0;

  // Build a single high-detail index once and reuse for all zooms to reduce memory spikes
  const indexOptions = Object.assign({}, TILE_INDEX_SETS.high);

  // Prepare index input and release raw references to lower peak memory
  const indexInput = { type: 'FeatureCollection', features: featureCollection.features };
  featureCollection = null;
  features = null;

  // Only build tiles at zoom 18 to reduce processing and memory usage
  const zTarget = 18;

  // Use on-disk per-tile NDJSON buffering to avoid large in-memory maps
  const tmpLayerDir = path.join(outLayerDir, 'tmp', String(zTarget));
  await ensureDir(tmpLayerDir);

  function getFeatureBounds(feature) {
    const geom = feature && feature.geometry;
    if (!geom || !geom.coordinates) return null;
    const bounds = { minLon: Infinity, minLat: Infinity, maxLon: -Infinity, maxLat: -Infinity };

    function collect(coords) {
      if (!Array.isArray(coords)) return;
      if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
        const lon = coords[0];
        const lat = coords[1];
        if (lon < bounds.minLon) bounds.minLon = lon;
        if (lon > bounds.maxLon) bounds.maxLon = lon;
        if (lat < bounds.minLat) bounds.minLat = lat;
        if (lat > bounds.maxLat) bounds.maxLat = lat;
        return;
      }
      for (const c of coords) collect(c);
    }

    collect(geom.coordinates);
    if (!isFinite(bounds.minLon)) return null;
    return bounds;
  }

  // Stream features into per-tile NDJSON files at zTarget
  for (const feature of indexInput.features) {
    const fb = getFeatureBounds(feature);
    if (!fb) continue;
    const minX = toTileX(fb.minLon, zTarget);
    const maxX = toTileX(fb.maxLon, zTarget);
    const minY = toTileY(fb.maxLat, zTarget);
    const maxY = toTileY(fb.minLat, zTarget);

    for (let x = minX; x <= maxX; x += 1) {
      for (let y = minY; y <= maxY; y += 1) {
        const filePath = path.join(tmpLayerDir, `${x}_${y}.ndjson`);
        // Append feature as one JSON line
        try {
          await fs.appendFile(filePath, `${JSON.stringify(feature)}\n`, 'utf8');
        } catch (e) {
          // ignore write errors per tile to keep going
        }
      }
    }
  }

  // Free the large feature array to help GC
  try { indexInput.features = null; } catch (e) {}

  // Read each per-tile NDJSON file, build a tiny index, and emit the pbf
  const tmpFiles = await fs.readdir(tmpLayerDir).catch(() => []);
  for (const fname of tmpFiles) {
    if (!fname.endsWith('.ndjson')) continue;
    const [xStr, yWithExt] = fname.split('_');
    const yStr = (yWithExt || '').replace('.ndjson', '');
    const x = Number(xStr);
    const y = Number(yStr);
    const filePath = path.join(tmpLayerDir, fname);
    const fileText = await fs.readFile(filePath, 'utf8').catch(() => '');
    const lines = fileText.split('\n').filter(Boolean);
    const tileFeatures = lines.map((l) => {
      try { return JSON.parse(l); } catch (e) { return null; }
    }).filter(Boolean);

    if (tileFeatures.length === 0) {
      await fs.unlink(filePath).catch(() => {});
      continue;
    }

    const smallCollection = { type: 'FeatureCollection', features: tileFeatures };
    const smallIndex = geojsonvt(smallCollection, { tolerance: indexOptions.tolerance, extent: indexOptions.extent, buffer: indexOptions.buffer, maxZoom: zTarget, indexMaxZoom: zTarget });
    const tile = smallIndex.getTile(zTarget, x, y);
    if (!tile || !tile.features || tile.features.length === 0) {
      await fs.unlink(filePath).catch(() => {});
      continue;
    }

    const tileBuffer = vtpbf.fromGeojsonVt({ [mvtLayerName]: tile });
    const tilePath = path.join(outLayerDir, String(zTarget), String(x), `${y}.pbf`);
    await ensureDir(path.dirname(tilePath));
    await fs.writeFile(tilePath, tileBuffer);
    tilesWritten += 1;
    nByZoom[zTarget] = (nByZoom[zTarget] || 0) + 1;

    // delete the temp file to free disk and reduce later reads
    await fs.unlink(filePath).catch(() => {});
  }

  // remove tmp dir if empty
  try { await fs.rmdir(tmpLayerDir); } catch (e) {}

  console.log(`  Zoom ${zTarget}: wrote ${nByZoom[zTarget] || 0} tiles from ${featureCount} features`);

  return {
    skipped: false,
    layerDirName,
    typeName,
    mvtLayerName,
    featureCount,
    featureTypes,
    bounds,
    minZoom,
    maxZoom,
    tilesWritten,
    tilesByZoom: nByZoom,
    outputDir: path.relative(BASE_DIR, outLayerDir).replace(/\\/g, '/'),
  };
}

async function main() {
  assertZoomRange(MIN_ZOOM, MAX_ZOOM);
  await ensureDir(MVT_DIR);

  const startedAt = new Date().toISOString();
  const layerDirs = await listLayerDirs();
  console.log(`Building vector tiles for ${layerDirs.length} layer directories...`);
  console.log(`Zoom range: ${MIN_ZOOM}-${MAX_ZOOM}`);

  // CLI single-layer mode: if script called with `--single <layerDir>` process just that layer
  const singleArgIndex = process.argv.indexOf('--single');
  if (singleArgIndex !== -1 && process.argv.length > singleArgIndex + 1) {
    const singleLayer = process.argv[singleArgIndex + 1];
    console.log(`Running single-layer build for ${singleLayer}`);
    const res = await buildLayerTiles(singleLayer, MIN_ZOOM, MAX_ZOOM);
    console.log(res.skipped ? `skipped: ${res.reason}` : `wrote ${res.tilesWritten} tiles from ${res.featureCount} features`);
    return;
  }

  const results = [];

  // Process each layer in a fresh Node process to bound memory per-layer
  for (const layerDirName of layerDirs) {
    console.log(`- ${layerDirName}`);
    // Spawn a child process that runs this script in single-layer mode
    const args = [
      `--max-old-space-size=${Math.max(2048, Number(process.env.BUILD_MVT_MEM) || 7168)}`,
      path.join('jobs', 'build_vector_tiles.js'),
      '--single',
      layerDirName,
    ];

    const node = process.execPath; // path to node
    await new Promise((resolve) => {
      const child = spawn(node, args, { cwd: BASE_DIR, stdio: 'inherit' });
      child.on('close', (code) => {
        if (code !== 0) {
          console.error(`  child process for ${layerDirName} exited with ${code}`);
          results.push({ skipped: true, layerDirName, reason: `child exit ${code}` });
        } else {
          // Success - the child already printed summary
          results.push({ skipped: false, layerDirName });
        }
        resolve();
      });
    });
  }

  const metadata = {
    generatedAt: new Date().toISOString(),
    startedAt,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    sourceRoot: path.relative(BASE_DIR, WFS_DIR).replace(/\\/g, '/'),
    outputRoot: path.relative(BASE_DIR, MVT_DIR).replace(/\\/g, '/'),
    layers: results,
  };

  await fs.writeFile(MVT_METADATA_PATH, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
  console.log(`Metadata written: ${path.relative(BASE_DIR, MVT_METADATA_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
