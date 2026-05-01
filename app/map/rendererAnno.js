import maplibregl from 'maplibre-gl';
import * as turf from '@turf/turf';

export const renderAnno = (map, typeName, annos, markersRef, activeLayersRef) => {
    // 3. Purge old markers & Repopulate newly fetched MapLibre Point Markers
    if (!markersRef.current[typeName]) {
        markersRef.current[typeName] = [];
    }

    annos.forEach(feature => {
        if (!feature.properties.TextString) return;

        let coords;
        let polyCoords;

        try {
            if (feature.geometry.type === 'MultiPolygon') {
                polyCoords = feature.geometry.coordinates[0];
            } else {
                polyCoords = feature.geometry.coordinates;
            }

            const poly = turf.polygon(polyCoords);
            const centroid = turf.centroid(poly);
            coords = centroid.geometry.coordinates;
        } catch (e) {
            return;
        }

        if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return;

        const el = document.createElement('div');
        let angle = (feature.properties.Angle != null) ? Number(feature.properties.Angle) : 0;
        
        // Strip out any <fnt> tags or HTML formatting included in the text string (e.g. Chinese string formatting)
        let textStr = feature.properties.TextString;
        if (typeof textStr === 'string') {
            textStr = textStr.replace(/<[^>]*>?/gm, '');
        }

        const ring = polyCoords[0];
        const p0 = turf.point(ring[0]);
        const p1 = turf.point(ring[1]);
        const p2 = turf.point(ring[2]);

        const l1 = turf.distance(p0, p1, { units: 'meters' });
        const l2 = turf.distance(p1, p2, { units: 'meters' });

        const wMeters = Math.max(l1, l2);
        const hMeters = Math.min(l1, l2);

        const lat = coords[1];
        const metersPerPx = 40075016.686 * Math.cos(lat * Math.PI / 180) / Math.pow(2, 21 + 9);

        const wPx = wMeters / metersPerPx;
        const hPx = hMeters / metersPerPx;

        el.className = 'custom-svg-icon-wrapper';
        el.innerHTML = `
            <div style="transform: rotate(${-angle}deg); width: calc(${wPx}px * var(--map-icon-scale, 1)); height: calc(${hPx}px * var(--map-icon-scale, 1)); display: flex; align-items: center; justify-content: center;">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" overflow="visible">
                    <text x="50" y="50" dominant-baseline="central" text-anchor="middle" font-size="80" fill="black" font-weight="bold" font-family="sans-serif">${textStr}</text>
                </svg>
            </div>
        `;

        const marker = new maplibregl.Marker({
            element: el,
            rotationAlignment: 'map',
            pitchAlignment: 'map'
        }).setLngLat(coords);

        el.addEventListener('click', (e) => {
            if (window.isMeasuringActive) return; // Prevent popup if measuring tool is active

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
