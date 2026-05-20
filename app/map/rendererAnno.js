import maplibregl from 'maplibre-gl';
import * as turf from '@turf/turf';

const escapeSvgText = (value = '') => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getRawOutlineSourceId = (typeName) => `${typeName}-raw-perimeter`;
const getRawOutlineLayerId = (typeName) => `${typeName}-raw-perimeter-layer`;

const removeRawOutlineOverlay = (map, typeName) => {
    const layerId = getRawOutlineLayerId(typeName);
    const sourceId = getRawOutlineSourceId(typeName);

    if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
    }

    if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
    }
};

const buildRawOutlineFeatures = (feature) => {
    const geometries = [];

    if (feature.geometry.type === 'Polygon') {
        geometries.push(feature.geometry.coordinates);
    } else if (feature.geometry.type === 'MultiPolygon') {
        geometries.push(...feature.geometry.coordinates);
    }

    return geometries
        .map(polygonCoords => polygonCoords?.[0])
        .filter(ring => Array.isArray(ring) && ring.length >= 2)
        .map(ring => ({
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: ring
            },
            properties: {}
        }));
};

export const renderAnno = (map, typeName, annos, markersRef, activeLayersRef, showRawPoints = false) => {
    if (!markersRef.current[typeName]) {
        markersRef.current[typeName] = [];
    }

    removeRawOutlineOverlay(map, typeName);

    const rawOutlineFeatures = [];

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

        // Strip out any <fnt> tags or HTML formatting included in the text string
        let textStr = feature.properties.TextString;
        if (typeof textStr === 'string') {
            textStr = textStr.replace(/<[^>]*>?/gm, '');
        }

        const fontSizeRaw = feature.properties.FontSize || 200; // Default if not present
        const characterWidth = feature.properties.CharacterWidth / 50 || 1; // Default character width if not specified
        
        let lines = textStr.split(/\r|\n/);
        
        const lat = coords[1];
        const metersPerPx = 40075016.686 * Math.cos(lat * Math.PI / 180) / Math.pow(2, 21 + 9);
        
        
        const isCjk = /[\u4E00-\u9FFF]/.test(textStr);
        const fontMeters = fontSizeRaw * (isCjk ? 0.015 : 0.02);                 // Convert to meters
        const wrapperClass = isCjk ? 'svg-wrapper cjk' : 'svg-wrapper';
        
        const fontPx = fontMeters / metersPerPx * 10;
        const charAspect = isCjk ? 1.0 : 0.6;
        const maxChars = Math.max(...lines.map(l => l.length));

        const wPx = (maxChars * fontPx * charAspect) + 4;
        const hPx = (lines.length * fontPx * 1.2) + 4;

        el.className = 'custom-svg-icon-wrapper';

        const spanLines = lines.map(line => `<div style="white-space: pre; text-align: center;">${escapeSvgText(line)}</div>`).join('');

        el.innerHTML = `
            <div class="${wrapperClass}" style="--angle:${-angle}deg; --w:${wPx}px; --h:${hPx}px; font-size: calc(${fontPx}px * var(--map-icon-scale, 1)); color: black; font-family: ${isCjk ? "'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', sans-serif" : "sans-serif"}; font-weight: 600; line-height: ${isCjk?1.2:1}; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <div style="transform: scale(${0.75 * characterWidth}, ${isCjk ? 2 : 2}); transform-origin: center center; display: flex; flex-direction: column; align-items: center;">
                    ${spanLines}
                </div>
            </div>
        `;

        const marker = new maplibregl.Marker({
            element: el,
            rotationAlignment: 'map',
            pitchAlignment: 'map'
        }).setLngLat(coords);

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

        if (showRawPoints) {
            rawOutlineFeatures.push(...buildRawOutlineFeatures(feature));
        }
    });

    if (showRawPoints && rawOutlineFeatures.length > 0) {
        const sourceId = getRawOutlineSourceId(typeName);
        const layerId = getRawOutlineLayerId(typeName);
        const sourceData = {
            type: 'FeatureCollection',
            features: rawOutlineFeatures
        };

        if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
                type: 'geojson',
                data: sourceData
            });
        } else {
            map.getSource(sourceId).setData(sourceData);
        }

        if (!map.getLayer(layerId)) {
            map.addLayer({
                id: layerId,
                type: 'line',
                source: sourceId,
                paint: {
                    'line-color': '#ff6a00',
                    'line-width': 2,
                    'line-opacity': 0.85,
                    'line-dasharray': [2, 2]
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                }
            });
        }
    }
};
