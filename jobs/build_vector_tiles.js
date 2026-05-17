/* eslint-disable no-console */
const fs = require('fs/promises');
const path = require('path');
const geojsonvt = require('geojson-vt').default;
const vtpbf = require('vt-pbf');

const BASE_DIR = path.resolve(__dirname, '..');
const WFS_DIR = path.join(BASE_DIR, 'public', 'data', 'wfs');
const MVT_DIR = path.join(BASE_DIR, 'public', 'data', 'mvt');
const MVT_METADATA_PATH = path.join(MVT_DIR, 'metadata.json');

const MIN_ZOOM = Number.parseInt(process.env.MVT_MIN_ZOOM || '12', 10);
const MAX_ZOOM = Number.parseInt(process.env.MVT_MAX_ZOOM || '18', 10);

// Define three detail tiers with tuned geojson-vt options:
// - low: coarse simplification for low zooms
// - mid: balanced simplification for medium zooms
// - high: minimal simplification for high zooms (preserve line detail)
const TILE_INDEX_SETS = {
  low: {
    // coarse: higher tolerance -> fewer vertices
    tolerance: 10,
    extent: 4096,
    buffer: 64,
    lineMetrics: false,
    generateId: false,
    maxZoom: 8,
    indexMaxZoom: 6,
    indexMaxPoints: 100000,
  },
  mid: {
    tolerance: 3,
    extent: 4096,
    buffer: 64,
    lineMetrics: false,
    generateId: false,
    maxZoom: 12,
    indexMaxZoom: 10,
    indexMaxPoints: 200000,
  },
  high: {
    // preserve detail: small tolerance
    tolerance: 0.5,
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

  const rawText = await fs.readFile(rawPath, 'utf8');
  const featureCollection = JSON.parse(rawText);
  const features = Array.isArray(featureCollection.features)
    ? featureCollection.features
    : [];

  if (features.length === 0) {
    return { skipped: true, reason: 'empty features', layerDirName };
  }

  const typeName = typeNameFromDirName(layerDirName);
  const mvtLayerName = normalizeMvtLayerName(typeName);
  const bounds = getFeatureCollectionBounds(featureCollection);
  if (!bounds) {
    return { skipped: true, reason: 'no valid geometry bounds', layerDirName };
  }

  const outLayerDir = path.join(MVT_DIR, layerDirName);
  await removeDirContents(outLayerDir);

  const nByZoom = {};
  let tilesWritten = 0;

  // Determine split ranges for low/mid/high based on overall min/max
  const lowMax = Math.min(minZoom + 2, maxZoom);
  const midMin = lowMax + 1;
  const midMax = Math.max(midMin, Math.min(maxZoom - 1, maxZoom));
  const highMin = Math.max(midMax + 1, minZoom);

  const sets = [
    { name: 'low', zStart: minZoom, zEnd: lowMax, options: TILE_INDEX_SETS.low },
    { name: 'mid', zStart: midMin, zEnd: Math.min(maxZoom - 1, maxZoom), options: TILE_INDEX_SETS.mid },
    { name: 'high', zStart: Math.max(highMin, minZoom), zEnd: maxZoom, options: TILE_INDEX_SETS.high },
  ];

  for (const set of sets) {
    if (set.zStart > set.zEnd) continue;
    // Build an index tuned for this detail set
    const index = geojsonvt(featureCollection, set.options);

    for (let z = set.zStart; z <= set.zEnd; z += 1) {
      const maxTile = Math.pow(2, z) - 1;
      const minX = Math.max(0, Math.min(maxTile, toTileX(bounds.minLon, z)));
      const maxX = Math.max(0, Math.min(maxTile, toTileX(bounds.maxLon, z)));
      const minY = Math.max(0, Math.min(maxTile, toTileY(bounds.maxLat, z)));
      const maxY = Math.max(0, Math.min(maxTile, toTileY(bounds.minLat, z)));

      let zoomCount = 0;
      for (let x = minX; x <= maxX; x += 1) {
        for (let y = minY; y <= maxY; y += 1) {
          const tile = index.getTile(z, x, y);
          if (!tile || !tile.features || tile.features.length === 0) continue;

          const tileBuffer = vtpbf.fromGeojsonVt({ [mvtLayerName]: tile });
          const tilePath = path.join(outLayerDir, String(z), String(x), `${y}.pbf`);
          await ensureDir(path.dirname(tilePath));
          await fs.writeFile(tilePath, tileBuffer);
          zoomCount += 1;
          tilesWritten += 1;
          nByZoom[z] = (nByZoom[z] || 0) + 1;
        }
      }
    }
  }

  return {
    skipped: false,
    layerDirName,
    typeName,
    mvtLayerName,
    featureCount: features.length,
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

  const results = [];
  for (const layerDirName of layerDirs) {
    console.log(`- ${layerDirName}`);
    try {
      const res = await buildLayerTiles(layerDirName, MIN_ZOOM, MAX_ZOOM);
      if (res.skipped) {
        console.log(`  skipped: ${res.reason}`);
      } else {
        console.log(`  wrote ${res.tilesWritten} tiles from ${res.featureCount} features`);
      }
      results.push(res);
    } catch (err) {
      console.error(`  failed: ${err.message}`);
      results.push({
        skipped: true,
        layerDirName,
        reason: `error: ${err.message}`,
      });
    }
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
