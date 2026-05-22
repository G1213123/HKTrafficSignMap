export function getMetersPerPixel(lat, zoom) {
    const earthCircumference = 40075016.686;
    // MapLibre uses 512px tiles, so base zoom is 2^(zoom + 9)
    return earthCircumference * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom + 9);
}

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
            lastError = err;
            if (attempt < retries) await new Promise(resolve => setTimeout(resolve, 200 * (attempt + 1)));
        }
    }
    throw lastError;
};

const iconUrlCache = new Map();

export const getIconUrl = (typeName, refname) => {
    if (!refname) return null;
    const cacheKey = `${typeName || ''}::${String(refname)}`;
    if (iconUrlCache.has(cacheKey)) return iconUrlCache.get(cacheKey);

    const getProxyUrl = (assetPath) => `/api/proxy?asset=${encodeURIComponent(assetPath)}`;
    let iconUrl = null;

    if (typeName.includes('TRAFFIC_LIGHT')) iconUrl = getProxyUrl(`/data/svgs/${refname}.svg`);
    else if (typeName.includes('DTAD_TS_')) iconUrl = getProxyUrl(`/data/svgs/TS_${refname}.svg`);
    else if (typeName.includes('DTAD_RD_MARK_SYM')) iconUrl = getProxyUrl(`/data/svgs/RM_${refname}.svg`);

    iconUrlCache.set(cacheKey, iconUrl);
    return iconUrl;
};
