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

const iconUrlCache = new Map();

export const getFirebaseAssetUrl = (assetPath) => {
    if (!assetPath) return null;

    const bucket = process.env.NEXT_PUBLIC_FIREBASE_ASSET_BUCKET || 'road-sign-factory-asset';
    const token = process.env.NEXT_PUBLIC_FIREBASE_ASSET_DOWNLOAD_TOKEN;
    if (!token) return assetPath;

    const objectName = `public${assetPath}`;
    return `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(objectName)}?alt=media&token=${encodeURIComponent(token)}`;
};

export const getIconUrl = (typeName, refname) => {
    if (!refname) return null;
    const cacheKey = `${typeName || ''}::${String(refname)}`;
    if (iconUrlCache.has(cacheKey)) return iconUrlCache.get(cacheKey);

    let iconUrl = null;

    if (typeName.includes('TRAFFIC_LIGHT')) iconUrl = getFirebaseAssetUrl(`/data/svgs/${refname}.svg`);
    else if (typeName.includes('DTAD_TS_')) iconUrl = getFirebaseAssetUrl(`/data/svgs/TS_${refname}.svg`);
    else if (typeName.includes('DTAD_RD_MARK_SYM')) iconUrl = getFirebaseAssetUrl(`/data/svgs/RM_${refname}.svg`);

    iconUrlCache.set(cacheKey, iconUrl);
    return iconUrl;
};
