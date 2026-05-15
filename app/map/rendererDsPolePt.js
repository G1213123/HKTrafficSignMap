import maplibregl from 'maplibre-gl';
import { attachMarkerPopup, buildPopupContent, createMarkerElement } from './markerDom';

export const renderDsPolePt = (map, typeName, points, markersRef, activeLayersRef, showRawPoints = false) => {
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
        const scaleFactor = 1; // Doubled scale as requested
        const svgWidthMeters = 1.0 * scaleFactor;
        const svgHeightMeters = 5.0 * scaleFactor; // Symmetrical: from -2.5 to 2.5
        
        const widthPx = svgWidthMeters / metersPerPx;
        const heightPx = svgHeightMeters / metersPerPx;

        // Allow per-feature override of height using SYMBOL_SIZE (interpreted as meters)
        const rawSymbolSize = feature.properties && feature.properties.SYMBOL_SIZE;
        const parsedSymbolSize = rawSymbolSize != null ? Number(rawSymbolSize) : NaN;
        const finalHeightPx = !isNaN(parsedSymbolSize) ? (parsedSymbolSize / metersPerPx) : heightPx;

        const el = createMarkerElement({ className: 'custom-svg-icon-wrapper' });
        
        // Handle rotation if any (falling back to 0)
        let angle = (feature.properties && feature.properties.ANGLE != null) ? Number(feature.properties.ANGLE) : 0;
        // Only the height is overridden when SYMBOL_SIZE is provided; width remains unchanged
        let customStyle = `transform: rotate(${angle+90}deg); width: calc(${widthPx}px * var(--map-icon-scale, 1)); height: calc(${finalHeightPx}px * var(--map-icon-scale, 1)); pointer-events: auto;`;

        // 1. Circle: center (0,0), radius 0.5
        // 2. Line: (0,0) to (0,-2)
        // 3. Triangle: base centered at (0,-2) width 0.25, tip at (0,-2.5) -> points: (-0.125,-2), (0.125,-2), (0,-2.5)
        const svgContent = `
            <svg viewBox="-0.5 -2.5 1 5" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; display: block; overflow: visible;">
                <!-- Main shapes -->
                <circle cx="-0.15" cy="-0.375" r="0.225" fill="none" stroke="#222" stroke-width="0.05" />
                <circle cx="-0.15" cy="0.375" r="0.225" fill="none" stroke="#222" stroke-width="0.05" />
                <line x1="-0.5" y1="-1" x2="-0.5" y2="1" stroke="#222" stroke-width="0.05" />
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

        attachMarkerPopup(el, map, coords, buildPopupContent(typeName, feature.properties || {}));

        if (activeLayersRef.current.has(typeName)) {
            marker.addTo(map);
            if (rawMarker) rawMarker.addTo(map);
        }
        markersRef.current[typeName].push(marker);
        if (rawMarker) markersRef.current[typeName].push(rawMarker);
    });
};
