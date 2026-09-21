import Pbf from 'pbf';
import { VectorTile } from '@mapbox/vector-tile';

export const getMvtUrl = (path) => getFirebaseAssetUrl(`/data/mvt/${path}`);

const normalizeMvtLayerName = (typeName) => typeName.replace(/[^A-Za-z0-9_]/g, '_');

const getTile = (longitude, latitude, zoom) => {
    const latitudeRadians = latitude * Math.PI / 180;
    const tileCount = Math.pow(2, zoom);
    return {
        x: Math.floor((longitude + 180) / 360 * tileCount),
        y: Math.floor((1 - Math.log(Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians)) / Math.PI) / 2 * tileCount),
    };
};

const decodePbfTile = (buffer, typeName, x, y, z) => {
    const layer = new VectorTile(new Pbf(buffer)).layers[normalizeMvtLayerName(typeName)];
    if (!layer) return [];

    return Array.from({ length: layer.length }, (_, index) => layer.feature(index).toGeoJSON(x, y, z));
};

export const fetchMvtLayerData = async (typeName, bounds, buildDate, options = {}) => {
    const z = 18;
    const southWest = getTile(bounds.getWest(), bounds.getSouth(), z);
    const northEast = getTile(bounds.getEast(), bounds.getNorth(), z);
    const layerPath = normalizeMvtLayerName(typeName);
    const tileRequests = [];

    for (let x = southWest.x; x <= northEast.x; x += 1) {
        for (let y = northEast.y; y <= southWest.y; y += 1) {
            const path = `${buildDate ? `${buildDate}/` : ''}${layerPath}/${z}/${x}/${y}.pbf`;
            tileRequests.push(getMvtUrl(path)
                .then(url => fetchWithRetry(url, { ...options, responseType: 'arrayBuffer' }, 2))
                .then(buffer => decodePbfTile(buffer, typeName, x, y, z))
                .catch(error => {
                    if (error.name === 'AbortError') throw error;
                    return [];
                }));
        }
    }

    const features = (await Promise.all(tileRequests)).flat();
    return { type: 'FeatureCollection', features };
};

export function getMetersPerPixel(lat, zoom) {
    const earthCircumference = 40075016.686;
    // MapLibre uses 512px tiles, so base zoom is 2^(zoom + 9)
    return earthCircumference * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom + 9);
}

export function  getThemeColor(isDarkMode) {return isDarkMode ? '#ffffff' : '#000000';}

// Network Request Abort utility
export const fetchWithRetry = async (url, options, retries = 2) => {
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const res = await fetch(url, options);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return options?.responseType === 'arrayBuffer' ? await res.arrayBuffer() : await res.json();
        } catch (err) {
            if (err && err.name === 'AbortError') throw err;
            const status = Number.parseInt(String(err?.message || '').replace(/^HTTP\s+/, ''), 10);
            const retryable = !Number.isFinite(status) || status === 408 || status === 429 || status >= 500;
            if (!retryable) throw err;
            lastError = err;
            if (attempt < retries) await new Promise(resolve => setTimeout(resolve, 200 * (attempt + 1)));
        }
    }
    throw lastError;
};

import { getDownloadURL, ref } from 'firebase/storage';
import { assetStorage } from '../../lib/firebase/clientApp';

const assetUrlCache = new Map();

export const getFirebaseAssetUrl = async (assetPath) => {
    if (!assetPath) return null;

    if (!assetUrlCache.has(assetPath)) {
        const objectName = `public${assetPath}`;
        const urlPromise = getDownloadURL(ref(assetStorage, objectName)).catch(error => {
            assetUrlCache.delete(assetPath);
            throw error;
        });
        assetUrlCache.set(assetPath, urlPromise);
    }

    return assetUrlCache.get(assetPath);
};

export const getIconUrl = async (typeName, refname) => {
    if (!refname) return null;
    const cacheKey = `${typeName || ''}::${String(refname)}`;
    if (assetUrlCache.has(cacheKey)) return assetUrlCache.get(cacheKey);

    let iconUrl = null;

    if (typeName.includes('TRAFFIC_LIGHT')) iconUrl = getFirebaseAssetUrl(`/data/svgs/${refname}.svg`);
    else if (typeName.includes('DTAD_TS_')) iconUrl = getFirebaseAssetUrl(`/data/svgs/TS_${refname}.svg`);
    else if (typeName.includes('DTAD_RD_MARK_SYM')) iconUrl = getFirebaseAssetUrl(`/data/svgs/RM_${refname}.svg`);

    return iconUrl;
};
