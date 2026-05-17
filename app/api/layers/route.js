import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import Pbf from 'pbf';
import { VectorTile } from '@mapbox/vector-tile';
import { generateSignedUrlGoogle } from '../../lib/generateSignedUrlGoogle';

const layerCache = globalThis.__layerApiCache || new Map();
globalThis.__layerApiCache = layerCache;
const DEFAULT_ZOOM = 16;
const MIN_MVT_ZOOM = Number.parseInt(process.env.MVT_MIN_ZOOM || '12', 10);
const MAX_MVT_ZOOM = Number.parseInt(process.env.MVT_MAX_ZOOM || '18', 10);

function normalizeMvtLayerName(typeName) {
  return typeName.replace(/[^A-Za-z0-9_]/g, '_');
}

function decodePbfTileToFeatureCollection(tileBuffer, typeName, x, y, z) {
  const layerName = normalizeMvtLayerName(typeName);
  const tile = new VectorTile(new Pbf(tileBuffer));
  const layer = tile.layers[layerName];

  if (!layer) {
    return { type: 'FeatureCollection', features: [] };
  }

  const features = [];
  for (let i = 0; i < layer.length; i += 1) {
    const feature = layer.feature(i);
    features.push(feature.toGeoJSON(x, y, z));
  }

  return {
    type: 'FeatureCollection',
    features,
  };
}

function getDataSource() {
  // Use local storage in development, Google Cloud Storage in production
  return process.env.NODE_ENV === 'development' ? 'local' : 'cloud';
}

function parseBbox(bboxText) {
  if (!bboxText) return null;

  const parts = bboxText
    .split(',')
    .slice(0, 4)
    .map(v => Number(v));

  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    return null;
  }

  const [south, west, north, east] = parts;
  return { minX: west, minY: south, maxX: east, maxY: north };
}

function updateBounds(bounds, x, y) {
  if (x < bounds.minX) bounds.minX = x;
  if (x > bounds.maxX) bounds.maxX = x;
  if (y < bounds.minY) bounds.minY = y;
  if (y > bounds.maxY) bounds.maxY = y;
}

function collectCoordsBounds(coords, bounds) {
  if (!Array.isArray(coords)) return;

  if (coords.length >= 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
    updateBounds(bounds, coords[0], coords[1]);
    return;
  }

  for (const child of coords) {
    collectCoordsBounds(child, bounds);
  }
}

function getFeatureBounds(feature) {
  const geometry = feature?.geometry;
  if (!geometry || !geometry.coordinates) return null;

  const bounds = {
    minX: Number.POSITIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };

  collectCoordsBounds(geometry.coordinates, bounds);

  if (!Number.isFinite(bounds.minX) || !Number.isFinite(bounds.minY)) {
    return null;
  }

  return bounds;
}

function intersects(a, b) {
  return !(a.maxX < b.minX || a.minX > b.maxX || a.maxY < b.minY || a.minY > b.maxY);
}

function filterByBbox(featureCollection, featureBoundsList, queryBounds) {
  if (!queryBounds) return featureCollection;

  const features = featureCollection.features || [];
  const filteredFeatures = [];
  for (let i = 0; i < features.length; i += 1) {
    const featureBounds = featureBoundsList[i];
    if (!featureBounds) continue;
    if (intersects(featureBounds, queryBounds)) {
      filteredFeatures.push(features[i]);
    }
  }

  return {
    ...featureCollection,
    features: filteredFeatures,
  };
}

function buildFeatureBoundsList(featureCollection) {
  const features = featureCollection.features || [];
  return features.map(feature => getFeatureBounds(feature));
}

function getTile(lon, lat, zoom) {
  const latRad = lat * Math.PI / 180;
  const n = Math.pow(2, zoom);
  const x = Math.floor((lon + 180) / 360 * n);
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
  return { x, y };
}



async function getLayerTileFromCache(typeName, z, x, y) {
  const filename = `${y}.pbf`;
  const dirName = typeName.replace(':', '_');
  const cacheKey = `${typeName}_${z}_${x}_${y}`;
  const dataSource = getDataSource();

  // In development, try local first. In production, go straight to cloud.
  if (dataSource === 'local') {
    try {
      const filePath = path.join(process.cwd(), 'public', 'data', 'mvt', dirName, String(z), String(x), filename);
      const fileStat = await fs.stat(filePath);
      const mtimeMs = fileStat.mtimeMs;

      const cached = layerCache.get(cacheKey);
      if (cached && cached.mtimeMs === mtimeMs) {
        return cached.featureCollection;
      }

      const fileData = await fs.readFile(filePath);
      const featureCollection = decodePbfTileToFeatureCollection(fileData, typeName, x, y, z);

      layerCache.set(cacheKey, { mtimeMs, featureCollection });
      return featureCollection;
    } catch (err) {
      console.warn(`Error reading local tile ${cacheKey}:`, err);
      return null;
    }
  }

  // In production (cloud mode), fetch from Google Cloud Storage using a signed URL (no public fallback)
  try {
    const bucketName = process.env.GCS_BUCKET_NAME || 'road-sign-factory-asset';
    const objectName = `public/data/mvt/${dirName}/${z}/${x}/${filename}`;

    try {
      const signedUrl = await generateSignedUrlGoogle({ bucketName, objectName });
      const response = await fetch(signedUrl);
      if (response.ok) {
        const tileArrayBuffer = await response.arrayBuffer();
        const featureCollection = decodePbfTileToFeatureCollection(
          Buffer.from(tileArrayBuffer),
          typeName,
          x,
          y,
          z,
        );
        layerCache.set(cacheKey, { mtimeMs: Date.now(), featureCollection });
        return featureCollection;
      }
      console.warn(`Cloud fetch returned ${response.status} for tile ${cacheKey}`);
      return null;
    } catch (signErr) {
      console.error(`Signing or fetch failed for tile ${cacheKey}:`, signErr);
      return null;
    }
  } catch (cloudErr) {
    console.warn(`Error fetching from cloud for tile ${cacheKey}:`, cloudErr);
    return null;
  }
}


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const typeName = searchParams.get('typeName');
  const bboxText = searchParams.get('bbox');
  const format = (searchParams.get('format') || 'pbf').toLowerCase();

  if (!typeName) {
    return NextResponse.json({ error: 'Missing typeName parameter' }, { status: 400 });
  }

  if (!/^[a-zA-Z0-9:_-]+$/.test(typeName)) {
    return NextResponse.json({ error: 'Invalid typeName parameter' }, { status: 400 });
  }

  if (format !== 'pbf') {
    return NextResponse.json({ error: 'Invalid format parameter. Expected format=pbf' }, { status: 400 });
  }

  const queryBounds = parseBbox(bboxText);
  if (bboxText && !queryBounds) {
    return NextResponse.json({ error: 'Invalid bbox parameter' }, { status: 400 });
  }

  // Determine tile zoom to use for fetching vector tiles. Allow client to request a zoom
  // via `z` query param; otherwise use server default. Validate against build config.
  let z = DEFAULT_ZOOM;
  const zText = searchParams.get('z');
  if (zText) {
    const parsed = Number(zText);
    if (!Number.isInteger(parsed) || parsed < MIN_MVT_ZOOM || parsed > MAX_MVT_ZOOM) {
      return NextResponse.json({ error: `Invalid z parameter; expected integer between ${MIN_MVT_ZOOM} and ${MAX_MVT_ZOOM}` }, { status: 400 });
    }
    z = parsed;
  }

  try {
    let resultFeatures = [];
    let resultCrs = null;
    const seenIds = new Set();
    
    // If no bbox provided, we can't efficiently load a tiled map, so return empty or an error
    if (!queryBounds) {
        return NextResponse.json({ error: 'Bbox parameter required for tiled WFS API' }, { status: 400 });
    }
    
    const maxYT = getTile(queryBounds.minX, queryBounds.minY, z).y;
    const minXT = getTile(queryBounds.minX, queryBounds.minY, z).x;
    const minYT = getTile(queryBounds.maxX, queryBounds.maxY, z).y;
    const maxXT = getTile(queryBounds.maxX, queryBounds.maxY, z).x;
    
    const tilesToLoad = [];
    for (let x = minXT; x <= maxXT; x++) {
      for (let y = minYT; y <= maxYT; y++) {
        tilesToLoad.push({ x, y });
      }
    }
    
    const tilePromises = tilesToLoad.map(async tile => {
      const featureCollection = await getLayerTileFromCache(typeName, z, tile.x, tile.y);
        if (!featureCollection) return;
        
        if (!resultCrs && featureCollection.crs) {
            resultCrs = featureCollection.crs;
        }
        
        const filteredCollection = filterByBbox(featureCollection, buildFeatureBoundsList(featureCollection), queryBounds);
        
        for (const feature of filteredCollection.features) {
            const id = feature.id || JSON.stringify(feature);
            if (!seenIds.has(id)) {
                seenIds.add(id);
                resultFeatures.push(feature);
            }
        }
    });
    
    await Promise.all(tilePromises);

    const result = {
        type: 'FeatureCollection',
        features: resultFeatures
    };
    if (resultCrs) {
        result.crs = resultCrs;
    }

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return NextResponse.json(
        { error: `Layer cache not found for ${typeName}` },
        { status: 404 }
      );
    }

    console.error('Layer API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
