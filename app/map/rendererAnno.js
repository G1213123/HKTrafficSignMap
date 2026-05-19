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

const wrapEnglishText = (text, maxCharsPerLine) => {
    const words = String(text || '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter(Boolean);

    if (words.length === 0) return [];

    const lines = [];
    let currentLine = '';

    const pushCurrentLine = () => {
        if (currentLine) {
            lines.push(currentLine);
            currentLine = '';
        }
    };

    const appendWord = (word) => {
        if (!currentLine) {
            currentLine = word;
            return;
        }

        if ((currentLine.length + word.length + 0.5) <= maxCharsPerLine) {
            currentLine += ' ' + word;
            return;
        }

        pushCurrentLine();
        currentLine = word;
    };

    words.forEach(word => {
        if (word.length <= 6) {
            appendWord(word);
            return;
        }

        if (currentLine && (currentLine.length + word.length + 0.5) > maxCharsPerLine) {
            pushCurrentLine();
        }

        let remaining = word;
        while (remaining.length > maxCharsPerLine) {
            const chunk = remaining.slice(0, maxCharsPerLine);
            if (currentLine) pushCurrentLine();
            lines.push(chunk);
            remaining = remaining.slice(maxCharsPerLine);
        }

        if (remaining.length > 0) {
            appendWord(remaining);
        }
    });

    pushCurrentLine();
    return lines;
};

export const renderAnno = (map, typeName, annos, markersRef, activeLayersRef, showRawPoints = false) => {
    // 3. Purge old markers & Repopulate newly fetched MapLibre Point Markers
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

        const wMeters = Math.min(l1, l2);
        const hMeters = Math.max(l1, l2);

        const lat = coords[1];
        const metersPerPx = 40075016.686 * Math.cos(lat * Math.PI / 180) / Math.pow(2, 21 + 9);

        const wPx = wMeters / metersPerPx;
        const hPx = hMeters / metersPerPx;

        el.className = 'custom-svg-icon-wrapper';
        // Detect CJK characters and add a class so CSS can select a different font
        const isCjk = /[\u4E00-\u9FFF]/.test(textStr);
        const isEnglish = /^[A-Za-z0-9\s\-.,'()/]+$/.test(textStr);
        const wrapperClass = isCjk ? 'svg-wrapper cjk' : 'svg-wrapper';
        const cjkLines = isCjk
            ? textStr.split(/\s+/).map(part => part.trim()).filter(Boolean)
            : [];

        // Calculate line wrapping using meters, then convert the longest line back to SVG width units.
        let linesToRender = [textStr];
        if (isCjk && cjkLines.length > 1) {
            linesToRender = cjkLines;
        } else if (isEnglish) {
            const englishCharWidthMeters = 0.5;
            const maxCharsPerLine = Math.max(1, Math.floor(wMeters / englishCharWidthMeters));
            linesToRender = wrapEnglishText(textStr, maxCharsPerLine);
        }
        const longestLineLength = Math.max(...linesToRender.map(l => l.length));
        const charWidthEstimate = isEnglish ? 0.5 : (feature.properties.CharacterWidth * 1.25); // meters for English, SVG units for CJK
        const textLengthSvg = isEnglish
            ? ((longestLineLength * charWidthEstimate) / Math.max(wMeters, 0.000001)) * 100
            : ((longestLineLength * charWidthEstimate));

        const textSvg = isCjk
            ? (() => {
                const lineStep = 80;
                const startY = feature.properties.FontSize * 10 || 60 ;
                const tspans = cjkLines
                    .map((line, idx) => idx === 0
                        ? `<tspan x="0" y="${startY}">${escapeSvgText(line)}</tspan>`
                        : `<tspan x="0" dy="${lineStep}">${escapeSvgText(line)}</tspan>`)
                    .join('');
                return `<text transform="scale(1, ${1/cjkLines.length})" text-anchor="middle" font-size="${feature.properties.FontSize * 10 || 60}" fill="black" stroke="none" textLength="100" lengthAdjust="spacingAndGlyphs">${tspans}</text>`;
            })()
            : isEnglish 
                ? (() => {
                    const lineStep = feature.properties.FontSize * 7.5 || 40;
                    const startY = feature.properties.FontSize * 10 || 60;
                    const tspans = linesToRender
                        .map((line, idx) => idx === 0
                            ? `<tspan x="0" y="${startY}">${escapeSvgText(line)}</tspan>`
                            : `<tspan x="0" dy="${lineStep}">${escapeSvgText(line)}</tspan>`)
                        .join('');
                    return `<text transform="scale(1, ${1/linesToRender.length})" text-anchor="middle" font-size="${feature.properties.FontSize * 15 || 60}" fill="black" stroke="none">${tspans}</text>`;
                })()
                : `<text transform="scale(0.5, 1.5)" x="100" y="25" dominant-baseline="central" text-anchor="middle" font-size="${feature.properties.FontSize * 10 || 60}" fill="black" stroke="none" textLength="100" lengthAdjust="spacingAndGlyphs">${escapeSvgText(textStr)}</text>`;
        // Set CSS variables for dynamic sizing/rotation and let globals.css provide the styling
        el.innerHTML = `
            <div class="${wrapperClass}" style="--angle:${-angle}deg; --w:${wPx}px; --h:${hPx}px;">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" overflow="visible">
                    ${textSvg}
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
