import maplibregl from 'maplibre-gl';

export const renderTsPolePt = (map, typeName, points, markersRef, activeLayersRef) => {
    if (markersRef.current[typeName]) {
        markersRef.current[typeName].forEach(m => m.remove());
    }
    markersRef.current[typeName] = [];

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

        const el = document.createElement('div');
        el.className = 'custom-svg-icon-wrapper';
        
        // Handle rotation if any (falling back to 0)
        let angle = (feature.properties && feature.properties.ANGLE != null) ? Number(feature.properties.ANGLE) : 0;
        let customStyle = `transform: rotate(${-angle}deg); width: calc(${widthPx}px * var(--map-icon-scale, 1)); height: calc(${heightPx}px * var(--map-icon-scale, 1)); pointer-events: auto;`;

        // 1. Circle: center (0,0), radius 0.5
        // 2. Line: (0,0) to (0,-2)
        // 3. Triangle: base centered at (0,-2) width 0.25, tip at (0,-2.5) -> points: (-0.125,-2), (0.125,-2), (0,-2.5)
        const svgContent = `
            <svg viewBox="-0.5 -2.5 1 5" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; display: block; overflow: visible;">
                <!-- Main shapes -->
                <circle cx="0" cy="0" r="0.2" fill="none" stroke="#222" stroke-width="0.05" />
                <line x1="0" y1="-0.2" x2="0" y2="-1" stroke="#222" stroke-width="0.05" />
                <polygon points="-0.125,-1 0.125,-1 0,-1.5" fill="#222" />
            </svg>
        `;

        el.innerHTML = `<div class="custom-svg-icon" style="${customStyle}">${svgContent}</div>`;

        const marker = new maplibregl.Marker({
            element: el,
            rotationAlignment: 'map',
            pitchAlignment: 'map',
            anchor: 'center'
        }).setLngLat(coords);

        // Optional popup info mimicking rendererPoint
        el.addEventListener('click', (e) => {
            if (window.isMeasuringActive) return;
            e.stopPropagation();
            let popupContent = `<b>${typeName.replace('csdi:DTAD_', '').replace(/_/g, ' ')}</b><br><div class="popup-content">`;
            for (const key in feature.properties) {
                if (feature.properties[key] !== null) {
                    popupContent += `<b>${key}:</b> ${feature.properties[key]}<br>`;
                }
            }
            popupContent += '</div>';

            new maplibregl.Popup({ offset: 15 })
                .setLngLat(coords)
                .setHTML(popupContent)
                .addTo(map);
        });

        if (activeLayersRef.current.has(typeName)) {
            marker.addTo(map);
        }
        markersRef.current[typeName].push(marker);
    });
};
