import maplibregl from 'maplibre-gl';
import { attachMarkerPopup, buildPopupContentWithPreview, createMarkerElement } from './markerDom';

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const normalizeTsSignId = (signId) => {
    const raw = String(signId || '').trim();
    if (!raw) return '';
    return raw.replace(/^TS[_-]?/i, '');
};

export const getTsPreviewUrl = (signId) => {
    const normalized = normalizeTsSignId(signId);
    if (!normalized) return null;
    return `/api/proxy?asset=${encodeURIComponent(`/data/svgs/TS_${normalized}.svg`)}`;
};

export const buildTsAbvPreviewHtml = (signId) => {
    const previewIcon = getTsPreviewUrl(signId);
    return previewIcon
        ? `<div style="display:flex; justify-content:center; margin: 0 0 10px 0;"><img src="${previewIcon}" alt="${escapeHtml(signId || '')}" style="width:75%; max-width:75%; height:auto; display:block;" /></div>`
        : '';
};

export const renderTsAbvPt = (map, typeName, points, markersRef, activeLayersRef, showRawPoints = false) => {
    if (!markersRef.current[typeName]) {
        markersRef.current[typeName] = [];
    }

    points.forEach(feature => {
        const coords = feature.geometry.coordinates;
        if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return;

        const signId = feature.properties?.SIGNID ? String(feature.properties.SIGNID) : '';
        const isSeparator = signId.trim().toUpperCase() === 'TSSEPA';
        const angle = (feature.properties?.ANGLE != null)
            ? Number(feature.properties.ANGLE)
            : (feature.properties?.Angle != null ? Number(feature.properties.Angle) : 0);

        const el = createMarkerElement({ className: 'custom-svg-icon-wrapper ts-abv-text-wrapper', width: '0px', height: '0px' });
        const text = isSeparator ? '/' : (signId ? escapeHtml(signId) : 'TS');
        el.innerHTML = `
            <div class="custom-svg-icon ts-abv-text" style="position: absolute; left: 0%; top: 0%; transform: translate(-50%, -50%) rotate(${angle}deg); transform-origin: center center; pointer-events: auto; width: max-content; height: max-content; overflow: visible; display: flex; align-items: center; justify-content: center;">
                <span style="display: inline-block; font-family: 'PT Sans Narrow', 'PT Sans', Arial, sans-serif; font-size: calc(30px * var(--map-icon-scale, 1)); font-weight: 100; color: #111; text-align: center; white-space: nowrap; line-height: 1;">${text}</span>
            </div>
        `;

        const marker = new maplibregl.Marker({
            element: el,
            rotationAlignment: 'map',
            pitchAlignment: 'map',
            anchor: 'center'
        }).setLngLat(coords);

        let rawMarker = null;
        if (showRawPoints) {
            const rawEl = document.createElement('div');
            rawEl.className = 'raw-point-debug';
            rawEl.title = `raw: ${signId || ''}`;
            rawMarker = new maplibregl.Marker({ element: rawEl, rotationAlignment: 'map', pitchAlignment: 'map' }).setLngLat(coords);
        }

        if (!isSeparator) {
            const previewHtml = buildTsAbvPreviewHtml(signId);
            attachMarkerPopup(el, map, coords, buildPopupContentWithPreview(typeName, feature.properties || {}, previewHtml));
        }

        if (activeLayersRef.current.has(typeName)) {
            marker.addTo(map);
            if (rawMarker) rawMarker.addTo(map);
        }
        markersRef.current[typeName].push(marker);
        if (rawMarker) markersRef.current[typeName].push(rawMarker);
    });
};