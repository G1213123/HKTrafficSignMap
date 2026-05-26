import maplibregl from 'maplibre-gl';
import { getMetersPerPixel } from './mapUtils';
import { buildSvgForRefname, buildTrafficLightTooltipSvgForRefname } from './svgShapes';
import { attachMarkerPopup, buildPopupContentWithPreview, createMarkerElement } from './markerDom';

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Renders traffic light point features using either inline-built SVGs or fallback proxy images
export const renderTrafficLightPt = (map, typeName, points, markersRef, activeLayersRef, showRawPoints = false) => {
    if (!markersRef.current[typeName]) {
        markersRef.current[typeName] = [];
    }

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
        const scaleFactor = 0.5; // Doubled scale as requested
        const svgWidthMeters = 1.0 * scaleFactor;
        const svgHeightMeters = 5.0 * scaleFactor; // Symmetrical: from -2.5 to 2.5
        
        const widthPx = svgWidthMeters / metersPerPx;
        const heightPx = svgHeightMeters / metersPerPx;

        const refname = feature.properties?.REFNAME;

        const el = createMarkerElement({ className: 'custom-svg-icon-wrapper' });

        // Build inline SVG like renderTsPolePt: size by SYMBOL_SIZE (meters) -> px
        const inlineSvg = buildSvgForRefname(refname);
        if (inlineSvg) {
            el.className = 'custom-svg-icon-wrapper traffic-light-wrapper';

            // Rotation matching renderTsPolePt convention
            let angle = (feature.properties && feature.properties.ANGLE != null) ? Number(feature.properties.ANGLE) : 0;
            let customStyle = `transform: rotate(${angle + 90}deg); width: calc(${widthPx}px * var(--map-icon-scale, 1)); height: calc(${heightPx}px * var(--map-icon-scale, 1)); pointer-events: auto;`;

            el.innerHTML = `<div class="custom-svg-icon" style="${customStyle}">${inlineSvg}</div>`;
        } else {
            el.className = 'default-circle-marker';
            el.style.width = '8px';
            el.style.height = '8px';
            el.style.backgroundColor = '#ff0000';
            el.style.border = '1px solid #ffffff';
            el.style.borderRadius = '50%';
        }

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
            rawEl.title = `raw: ${refname || ''}`;
            rawMarker = new maplibregl.Marker({ element: rawEl, rotationAlignment: 'map', pitchAlignment: 'map' }).setLngLat(coords);
        }

        const previewSvg = buildTrafficLightTooltipSvgForRefname(refname);
        const previewHtml = previewSvg
            ? `
                <div style="display:flex; justify-content:center; margin: 0 0 10px 0;">
                    <div style="width: 180px; max-width: 90%; height: 120px;">${previewSvg}</div>
                </div>
                <div style="display:flex; justify-content:center; margin: 0 0 8px 0; font-size: 12px; color: #4b5563;">REFNAME: ${escapeHtml(refname || '-')}</div>
            `
            : '';

        attachMarkerPopup(el, map, coords, buildPopupContentWithPreview(typeName, feature.properties || {}, previewHtml));

        if (activeLayersRef.current.has(typeName)) {
            marker.addTo(map);
            if (rawMarker) rawMarker.addTo(map);
        }

        markersRef.current[typeName].push(marker);
        if (rawMarker) markersRef.current[typeName].push(rawMarker);
    });
};
