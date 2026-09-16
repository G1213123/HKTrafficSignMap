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
            return await res.json();
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
