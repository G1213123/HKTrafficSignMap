import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const layerCache = globalThis.__layerApiCache || new Map();
globalThis.__layerApiCache = layerCache;
const ZOOM_LEVEL = 16;

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



async function getLayerTileFromCache(typeName, x, y) {
  const filename = `${x}_${y}.json`;
  const dirName = typeName.replace(':', '_');
  const filePath = path.join(process.cwd(), 'public', 'data', 'wfs', dirName, filename);

  const cacheKey = `${typeName}_${x}_${y}`;
  try {
    const fileStat = await fs.stat(filePath);
    const mtimeMs = fileStat.mtimeMs;

    const cached = layerCache.get(cacheKey);
    if (cached && cached.mtimeMs === mtimeMs) {
      return cached.featureCollection;
    }

    const fileData = await fs.readFile(filePath, 'utf-8');
    const featureCollection = JSON.parse(fileData);

    layerCache.set(cacheKey, { mtimeMs, featureCollection });
    return featureCollection;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn(`Error reading tile ${cacheKey}:`, err);
    }
    return null;
  }
}


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const typeName = searchParams.get('typeName');
  const bboxText = searchParams.get('bbox');

  if (!typeName) {
    return NextResponse.json({ error: 'Missing typeName parameter' }, { status: 400 });
  }

  if (!/^[a-zA-Z0-9:_-]+$/.test(typeName)) {
    return NextResponse.json({ error: 'Invalid typeName parameter' }, { status: 400 });
  }

  const queryBounds = parseBbox(bboxText);
  if (bboxText && !queryBounds) {
    return NextResponse.json({ error: 'Invalid bbox parameter' }, { status: 400 });
  }

  try {
    let resultFeatures = [];
    let resultCrs = null;
    const seenIds = new Set();
    
    // If no bbox provided, we can't efficiently load a tiled map, so return empty or an error
    if (!queryBounds) {
        return NextResponse.json({ error: 'Bbox parameter required for tiled WFS API' }, { status: 400 });
    }
    
    const maxYT = getTile(queryBounds.minX, queryBounds.minY, ZOOM_LEVEL).y;
    const minXT = getTile(queryBounds.minX, queryBounds.minY, ZOOM_LEVEL).x;
    const minYT = getTile(queryBounds.maxX, queryBounds.maxY, ZOOM_LEVEL).y;
    const maxXT = getTile(queryBounds.maxX, queryBounds.maxY, ZOOM_LEVEL).x;
    
    const tilesToLoad = [];
    for (let x = minXT; x <= maxXT; x++) {
      for (let y = minYT; y <= maxYT; y++) {
        tilesToLoad.push({ x, y });
      }
    }
    
    const tilePromises = tilesToLoad.map(async tile => {
        const featureCollection = await getLayerTileFromCache(typeName, tile.x, tile.y);
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
