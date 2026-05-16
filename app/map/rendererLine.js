import * as turf from '@turf/turf';
import maplibregl from 'maplibre-gl';
import { getLineDefinition } from './lineStyles';
import { getMetersPerPixel } from './mapUtils';
import { attachMarkerPopup, buildPopupContent, createMarkerElement } from './markerDom';

const ICON_LINE_LAYERS = new Set([
    'csdi:DTAD_RD_MARK_LINE_C',
    'csdi:DTAD_LV22_LINE',
    'csdi:DTAD_TG_PATH_LINE',
    'csdi:DTAD_RAILING_LINE'
]);

const normalizeBearing = bearing => ((bearing % 360) + 360) % 360;

/**
 * Convert MM coordinates in iconGeometry to lat/lng coordinates
 * Rotates and positions geometry relative to a point with a given bearing
 * @param {Array} centerCoord - [lng, lat] center point
 * @param {number} bearingDegrees - bearing in degrees (0 = north along line)
 * @param {number} xMM - x offset in mm (perpendicular to line, positive = right)
 * @param {number} yMM - y offset in mm (along line, positive = forward)
 * @returns {Array} [lng, lat] transformed coordinate
 */
const transformMMCoordinate = (centerCoord, bearingDegrees, xMM, yMM) => {
    // Convert mm to meters
    const xMeters = xMM / 1000;
    const yMeters = yMM / 1000;
    
    if (xMeters === 0 && yMeters === 0) return centerCoord;
    
    // Bearing perpendicular to line direction (90 degrees to the right)
    const perpBearing = (bearingDegrees + 90) % 360;
    
    // Step 1: Move perpendicular to line (x offset)
    let result = turf.destination(centerCoord, xMeters, perpBearing);
    
    // Step 2: Move along line direction (y offset)
    result = turf.destination(result, yMeters, bearingDegrees);
    
    return result.geometry.coordinates;
};

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

/**
 * Create GeoJSON LineString features from iconGeometry
 * @param {Object} iconGeometry - geometry with shapes array
 * @param {Array} centerCoord - [lng, lat] center point
 * @param {number} bearing - line bearing in degrees
 * @param {Array} properties - feature properties
 * @returns {Array} Array of GeoJSON LineString features
 */
const createIconLineFeatures = (iconGeometry, centerCoord, bearing, properties) => {
    if (!iconGeometry || !iconGeometry.shapes) return [];
    
    const features = [];
    
    iconGeometry.shapes.forEach(shape => {
        if (shape.type === 'line') {
            // Transform both endpoints using rotation and position
            const coord1 = transformMMCoordinate(centerCoord, bearing, shape.x1, shape.y1);
            const coord2 = transformMMCoordinate(centerCoord, bearing, shape.x2, shape.y2);
            
            const feature = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [coord1, coord2]
                },
                properties: {
                    ...properties,
                    _iconGeometry: true,
                    _strokeWidth: shape.strokeWidth || 2
                }
            };
            
            features.push(feature);
        }
    });
    
    return features;
};

const renderIconLineMarkers = (map, typeName, features, markersRef) => {
    // Collect all icon line features from all input features
    const iconLineFeatures = [];
    
    features.forEach(feature => {
        const linetype = feature.properties && feature.properties.LINETYPE;
        if (!linetype) return;
        
        const lineDefn = getLineDefinition(typeName, linetype);
        if (!lineDefn || lineDefn.length === 0) return;
        
        const dim = lineDefn[0];
        if (!dim || !dim.iconInterval || !dim.iconGeometry) return;

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
                
                // Create line features from iconGeometry
                const iconFeatures = createIconLineFeatures(
                    dim.iconGeometry,
                    point.geometry.coordinates,
                    bearing,
                    feature.properties || {}
                );
                
                iconLineFeatures.push(...iconFeatures);
            }
        });
    });
    
    // Add icon line features as a new layer if any were created
    if (iconLineFeatures.length > 0) {
        const sourceId = `${typeName}-icon-lines`;
        const layerId = `${typeName}-icon-lines-layer`;
        
        // Create or update GeoJSON source
        if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: iconLineFeatures
                }
            });
        } else {
            map.getSource(sourceId).setData({
                type: 'FeatureCollection',
                features: iconLineFeatures
            });
        }
        
        // Create or update layer
        if (!map.getLayer(layerId)) {
            map.addLayer({
                id: layerId,
                type: 'line',
                source: sourceId,
                paint: {
                    'line-color': '#000000',
                    'line-width': [
                        'case',
                        ['has', '_strokeWidth'],
                        ['/', ['get', '_strokeWidth'], 100],  // strokeWidth in mm / 100 = reasonable pixel width
                        1
                    ],
                    'line-opacity': 0.8
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                }
            });
        }
    }
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
            const linetype = f.properties && f.properties.LINETYPE;
            const lineDefn = linetype ? getLineDefinition(typeName, linetype) : null;
            const hasIcon = isIconLineLayer && lineDefn && lineDefn.length > 0 && lineDefn[0].iconGeometry && lineDefn[0].iconInterval;
            if (hasIcon) {
                // Keep the original line feature so it can render its dash/weight
                // while also collecting the feature to generate icon line segments.
                iconLineFeatures.push(f);
                // DO NOT return here; allow the feature to continue through
                // the normal processing so the base line is also rendered.
            }
        }

        if (linetype && isLineGeometry) {

            const styles = getLineDefinition(typeName, linetype);

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
            const styles = getLineDefinition(typeName, linetype);
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
