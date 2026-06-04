import maplibregl from 'maplibre-gl';
import { attachMarkerPopup, buildPopupContent, buildPopupContentWithPreview, createMarkerElement } from './markerDom';
import { buildTsAbvPreviewHtml, getTsPreviewUrl } from './rendererTsAbvPt';

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const normalizeText = (value) => String(value || '').trim().toUpperCase();

const buildAbvPreviewHtmlForPole = (poleFeature, abvFeatures = []) => {
    const ggName = normalizeText(poleFeature?.properties?.GG_NAME);
    if (!ggName) return '';

    const related = abvFeatures.filter(feature => normalizeText(feature?.properties?.GG_NAME) === ggName && feature?.properties?.SIGNID !== 'TSSEPA');
    if (related.length === 0) return '';

    const previewItems = [];
    const seenKeys = new Set();

    related.forEach(feature => {
        const signId = feature?.properties?.SIGNID ? String(feature.properties.SIGNID) : '';
        const previewIcon = getTsPreviewUrl(signId);
        if (!previewIcon) return;

        const key = `${signId}::${previewIcon}`;
        if (seenKeys.has(key)) return;
        seenKeys.add(key);

        previewItems.push(`
            <div style="display:flex; justify-content:center; align-items:center; width: 100%; min-height: 132px; padding: 6px 0;">
                <div style="display:flex; flex-direction: column; align-items:center; gap: 6px; width: 100%;">
                    <img src="${previewIcon}" alt="${escapeHtml(signId)}" style="max-width: 100%; max-height: 124px; height: auto; display:block;" />
                    <div style="font-size: 12px; color: #4b5563; line-height: 1.2; text-align: center;">${escapeHtml(signId || '-')}</div>
                </div>
            </div>
        `);
    });

    if (previewItems.length === 0) return '';

    return `
        <div style="display:flex; flex-direction: column; align-items: center; justify-content:center; gap: 8px; margin: 0 0 10px 0; width: 100%;">
            ${previewItems.join('')}
        </div>
    `;
};

export const renderTsPolePt = (map, typeName, points, markersRef, activeLayersRef, showRawPoints = false, options = {}) => {
    if (!markersRef.current[typeName]) {
        markersRef.current[typeName] = [];
    }

    const abvData = options.layerDataRef?.current?.['csdi:DTAD_TS_ABV_PT'];
    const abvFeatures = Array.isArray(abvData?.features) ? abvData.features : [];

    points.forEach(feature => {
        const coords = feature.geometry.coordinates;
        if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return;
        
        const lat = coords[1];
        // Calculate meters per pixel at zoom 21 for this latitude
        const metersPerPx = 40075016.686 * Math.cos(lat * Math.PI / 180) / Math.pow(2, 21 + 9);
        
        // We use a symmetrical bounding box around the origin (0,0) 
        // to make sure MapLibre aligns the center of the marker element perfectly to the coordinates.
        // Highest point is tip of the triangle at Y = -2.5
        // Symmetrical lowest point will be Y = +2.5
        // Width will be X = -0.5 to X = +0.5 (1m)
        const scaleFactor = 1; // Doubled scale as requested
        const svgWidthMeters = 1.0 * scaleFactor;
        const svgHeightMeters = 5.0 * scaleFactor; // Symmetrical: from -2.5 to 2.5
        
        const widthPx = svgWidthMeters / metersPerPx;
        const heightPx = svgHeightMeters / metersPerPx;

        const el = createMarkerElement({ className: 'custom-svg-icon-wrapper' });
        
        // Handle rotation if any (falling back to 0)
        let angle = (feature.properties && feature.properties.ANGLE != null) ? Number(feature.properties.ANGLE) : 0;
        let customStyle = `transform: rotate(${angle+90}deg); width: calc(${widthPx}px * var(--map-icon-scale, 1)); height: calc(${heightPx}px * var(--map-icon-scale, 1)); pointer-events: auto;`;

        // 1. Circle: center (0,0), radius 0.5
        // 2. Line: (0,0) to (0,-2)
        // 3. Triangle: base centered at (0,-2) width 0.25, tip at (0,-2.5) -> points: (-0.125,-2), (0.125,-2), (0,-2.5)
        const svgContent = `
            <svg viewBox="-0.5 -2.5 1 5" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; display: block; overflow: visible;">
                <!-- Main shapes -->
                <circle cx="0" cy="0" r="0.2" fill="none" stroke="#222" stroke-width="0.05" />
                <line x1="0" y1="-0.2" x2="0" y2="-1" stroke="#222" stroke-width="0.05" />
                <polygon points="-0.2,-1 0.2,-1 0,-2" fill="#222" />
            </svg>
        `;

        el.innerHTML = `<div class="custom-svg-icon" style="${customStyle}">${svgContent}</div>`;

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
            rawEl.title = 'raw: ts pole';
            rawMarker = new maplibregl.Marker({ element: rawEl, rotationAlignment: 'map', pitchAlignment: 'map' }).setLngLat(coords);
        }

        const previewHtml = buildAbvPreviewHtmlForPole(feature, abvFeatures);
        const popupContent = previewHtml
            ? buildPopupContentWithPreview(typeName, feature.properties || {}, previewHtml)
            : buildPopupContent(typeName, feature.properties || {});

        attachMarkerPopup(el, map, coords, popupContent);

        if (activeLayersRef.current.has(typeName)) {
            marker.addTo(map);
            if (rawMarker) rawMarker.addTo(map);
        }
        markersRef.current[typeName].push(marker);
        if (rawMarker) markersRef.current[typeName].push(rawMarker);
    });
};
