import * as turf from '@turf/turf';
import maplibregl from 'maplibre-gl';
import { getLineStyles } from './lineStyles';
import { getMetersPerPixel } from './mapUtils';
import { lineIconDefinitionDict } from './layerConfig';
import { attachMarkerPopup, buildPopupContent, createMarkerElement } from './markerDom';

const ICON_LINE_LAYERS = new Set([
    'csdi:DTAD_RD_MARK_LINE_C',
    'csdi:DTAD_LV22_LINE',
    'csdi:DTAD_TG_PATH_LINE',
    'csdi:DTAD_RAILING_LINE'
]);

const normalizeBearing = bearing => ((bearing % 360) + 360) % 360;

const getLineBearingAtDistance = (line, distance, totalLength) => {
    if (totalLength <= 0) return 0;

    const sampleDistance = Math.min(1, totalLength / 20);
    const fromDistance = Math.max(0, distance - sampleDistance);
    const toDistance = Math.min(totalLength, distance + sampleDistance);

    if (fromDistance === toDistance) return 0;

    const fromPoint = turf.along(line, fromDistance, { units: 'meters' });
    const toPoint = turf.along(line, toDistance, { units: 'meters' });
    return normalizeBearing(turf.bearing(fromPoint, toPoint));
};

const createIconMarker = (svg, sizePxAtZoom21) => {
    return createMarkerElement({
        className: 'icon-line-marker',
        width: `calc(${sizePxAtZoom21}px * var(--map-icon-scale, 1))`,
        height: `calc(${sizePxAtZoom21}px * var(--map-icon-scale, 1))`,
        innerHTML: svg,
    });
};

const getLineIconDefinition = (typeName, properties = {}) => {
    const layerDefs = lineIconDefinitionDict[typeName];
    if (!layerDefs) return null;

    const candidates = [
        properties.LINETYPE,
        properties.REFNAME,
        properties.TYPE,
        properties.SUBTYPE
    ].filter(v => v !== undefined && v !== null && v !== '');

    for (const rawCandidate of candidates) {
        const candidate = String(rawCandidate);
        if (layerDefs[candidate]) return layerDefs[candidate];
        const upper = candidate.toUpperCase();
        if (layerDefs[upper]) return layerDefs[upper];
    }

    return layerDefs.__default || null;
};

const renderIconLineMarkers = (map, typeName, features, markersRef) => {
    if (!markersRef.current[typeName]) {
        markersRef.current[typeName] = [];
    }

    features.forEach(feature => {
        const dim = getLineIconDefinition(typeName, feature.properties || {});

        if (!dim || !dim.iconSvg || !dim.iconInterval) return;

        const coordsList = feature.geometry.type === 'LineString' ? [feature.geometry.coordinates] : feature.geometry.coordinates;

        coordsList.forEach(lineCoords => {
            if (!lineCoords || lineCoords.length < 2) return;

            const line = turf.lineString(lineCoords);
            const totalLength = turf.length(line, { units: 'meters' });
            const interval = Math.max(1, Number(dim.iconInterval) / 1000);
            const startDistance = Math.min(interval / 2, totalLength / 2);

            for (let distance = startDistance; distance < totalLength; distance += interval) {
                const point = turf.along(line, distance, { units: 'meters' });
                const bearing = getLineBearingAtDistance(line, distance, totalLength);
                
                // Get strictly zoom 21 size and apply Map.js CSS dynamic modifier
                const lat = point.geometry.coordinates[1];
                const metersPerPxAtZoom21 = 40075016.686 * Math.cos(lat * Math.PI / 180) / Math.pow(2, 21 + 9);
                const sizePxAtZoom21 = (Number(dim.iconSize) || 120) / 1000 / metersPerPxAtZoom21;
                const markerElement = createIconMarker(dim.iconSvg, sizePxAtZoom21);
                attachMarkerPopup(markerElement, map, point.geometry.coordinates, buildPopupContent(typeName, feature.properties || {}));

                const marker = new maplibregl.Marker({
                    element: markerElement,
                    anchor: 'center',
                    rotationAlignment: 'map',
                    pitchAlignment: 'map'
                })
                    .setLngLat(point.geometry.coordinates)
                    .setRotation(bearing)
                    .addTo(map);

                markersRef.current[typeName].push(marker);
            }

        });
    });
};

export const renderLines = (map, typeName, features, markersRef = { current: {} }) => {
    const isAnno = typeName === 'csdi:DTAD_RD_MARK_ANNO';
    const isIconLineLayer = ICON_LINE_LAYERS.has(typeName);
    const nonPoints = [];
    const iconLineFeatures = [];

    if (!markersRef.current) markersRef.current = {};
    if (!markersRef.current[typeName]) markersRef.current[typeName] = [];

    features.forEach(f => {
        const linetype = f.properties && f.properties.LINETYPE;
        const isLineGeometry = f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString';

        if (isLineGeometry) {
            const iconDim = isIconLineLayer ? getLineIconDefinition(typeName, f.properties || {}) : null;
            if (iconDim && iconDim.iconSvg && iconDim.iconInterval) {
                iconLineFeatures.push(f);
                return; // Stop here so it doesn't render as a normal line
            }
        }

        if (linetype && isLineGeometry) {

            const styles = getLineStyles(linetype);

            if (styles && styles.length > 0) {
                styles.forEach((styleConfig, idx) => {
                    const clonedFeature = JSON.parse(JSON.stringify(f));
                    clonedFeature.properties._styleIndex = idx; // Differentiate identical linestyles

                    if (styleConfig.dashMeters && Array.isArray(styleConfig.dashMeters)) {
                        let newLines = [];
                        const coordsList = f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates;

                        coordsList.forEach(lineCoords => {
                            if (lineCoords.length < 2) return;
                            try {
                                const line = turf.lineString(lineCoords);
                                const totalLength = turf.length(line, { units: 'meters' });
                                let currentLen = 0;
                                let isDash = true; // start with a dash
                                const dashLen = styleConfig.dashMeters[0];
                                const gapLen = styleConfig.dashMeters[1] || dashLen;

                                while (currentLen < totalLength) {
                                    const step = isDash ? dashLen : gapLen;
                                    const endLen = Math.min(currentLen + step, totalLength);

                                    if (isDash) {
                                        const sliced = turf.lineSliceAlong(line, currentLen, endLen, { units: 'meters' });
                                        newLines.push(sliced.geometry.coordinates);
                                    }

                                    currentLen += step;
                                    isDash = !isDash;
                                }
                            } catch (err) { }
                        });

                        clonedFeature.geometry = {
                            type: 'MultiLineString',
                            coordinates: newLines
                        };
                    }
                    nonPoints.push(clonedFeature);
                });
            } else {
                nonPoints.push(f);
            }
        } else {
            nonPoints.push(f);
        }
    });

    if (iconLineFeatures.length > 0) {
        renderIconLineMarkers(map, typeName, iconLineFeatures, markersRef);
    }

    // 1. Install GeoJSON Source for Paths and Polygons
    const sourceData = { type: 'FeatureCollection', features: nonPoints };
    if (!map.getSource(typeName)) {
        map.addSource(typeName, { type: 'geojson', data: sourceData });
    } else {
        map.getSource(typeName).setData(sourceData);
    }

    // 2. Discover Linestyles explicitly and apply un-data-drivabble parameters
    if (nonPoints.length > 0) {
        const uniqueLinetypes = new Set();
        nonPoints.forEach(f => {
            if (f.properties && f.properties.LINETYPE) uniqueLinetypes.add(f.properties.LINETYPE);
        });

        uniqueLinetypes.forEach(linetype => {
            const styles = getLineStyles(linetype);
            styles.forEach((styleConfig, idx) => {
                const layerId = `line-style-${typeName.replace(':', '-')}-${linetype.replace(/[^A-Za-z0-9]/g, '_')}-${idx}`;

                if (!map.getLayer(layerId)) {
                    if (isAnno) {
                        map.addLayer({
                            id: layerId,
                            type: 'line',
                            source: typeName,
                            filter: ['all', ['==', ['get', 'LINETYPE'], linetype], ['==', ['get', '_styleIndex'], idx]],
                            paint: { 'line-opacity': 0 }
                        });
                    } else {
                        const paintProps = {
                            'line-color': styleConfig.color || '#000000',
                            'line-width': styleConfig.weight || 2,
                            'line-opacity': styleConfig.opacity !== undefined ? styleConfig.opacity : 0.8
                        };

                        // MapLibre geographical explicit zoom expression layout injection
                        if (styleConfig.offset && styleConfig.offset !== 0) {
                            const metersPerPx20 = getMetersPerPixel(22.3193, 20);
                            const basePx = styleConfig.offset / metersPerPx20;
                            paintProps['line-offset'] = [
                                'interpolate',
                                ['exponential', 2],
                                ['zoom'],
                                12, basePx * Math.pow(2, 12 - 20),
                                22, basePx * Math.pow(2, 22 - 20)
                            ];
                        }

                        map.addLayer({
                            id: layerId,
                            type: 'line',
                            source: typeName,
                            filter: ['all', ['==', ['get', 'LINETYPE'], linetype], ['==', ['get', '_styleIndex'], idx]],
                            paint: paintProps,
                            layout: { 'line-join': 'round', 'line-cap': 'round' }
                        });
                    }
                }
            });
        });

        // Fallback rendering
        if (!map.getLayer(`${typeName}-poly-fill`)) {
            map.addLayer({
                id: `${typeName}-poly-fill`,
                type: 'fill',
                source: typeName,
                filter: ['==', ['geometry-type'], 'Polygon'],
                paint: {
                    'fill-color': '#000000',
                    'fill-opacity': 0.8
                }
            });
        }

        if (!map.getLayer(`${typeName}-line-fallback`)) {
            map.addLayer({
                id: `${typeName}-line-fallback`,
                type: 'line',
                source: typeName,
                filter: [
                    'all',
                    ['any', ['==', ['geometry-type'], 'LineString'], ['==', ['geometry-type'], 'MultiLineString']],
                    ['!', ['has', '_styleIndex']]
                ],
                paint: {
                    'line-color': '#000000', // Default fallback color
                    'line-width': 2,
                    'line-opacity': 0.8
                }
            });
        }
    }
};
