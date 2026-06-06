import * as turf from '@turf/turf';
import maplibregl from 'maplibre-gl';
import { getLineDefinition } from './lineStyles';
import { getMetersPerPixel, getThemeColor } from './mapUtils';
import { attachMarkerPopup, buildPopupContent, createMarkerElement } from './markerDom';

const ICON_LINE_LAYERS = new Set([
    'csdi:DTAD_RD_MARK_LINE_C',
    'csdi:DTAD_LV22_LINE',
    'csdi:DTAD_TG_PATH_LINE',
    'csdi:DTAD_RAILING_LINE',
    'csdi:DTAD_RST_ZONE_LINE',
    'csdi:DTAD_YL_BOX_LINE',
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
const transformMMCoordinate = (centerCoord, bearingDegrees, xMeters, yMeters) => {
    // Icon geometry coordinates are now expressed in meters.
    if ((xMeters === 0 || xMeters === undefined) && (yMeters === 0 || yMeters === undefined)) return centerCoord;

    // Bearing perpendicular to line direction (90 degrees to the right)
    const perpBearing = normalizeBearing(bearingDegrees + 90);

    // Step 1: Move perpendicular to line (x offset) using meters
    let result = turf.destination(centerCoord, xMeters, perpBearing, { units: 'meters' });

    // Step 2: Move along line direction (y offset)
    result = turf.destination(result, yMeters, bearingDegrees, { units: 'meters' });

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

const renderSvgIconMarkers = (map, typeName, feature, lineDefn, markersRef) => {
    const svgStyle = lineDefn.find(def => def && def.iconSvg && def.iconInterval);
    if (!svgStyle || !svgStyle.iconInterval || !svgStyle.iconSvg) return;

    const coordsList = feature.geometry.type === 'LineString' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    const interval = Math.max(1, Number(svgStyle.iconInterval));
    const sizePxAtZoom21 = Number(svgStyle.iconSize || 500);

    coordsList.forEach(lineCoords => {
        if (!lineCoords || lineCoords.length < 2) return;

        const line = turf.lineString(lineCoords);
        const totalLength = turf.length(line, { units: 'meters' });
        let startDistance = 0;
        if (svgStyle.startDistance !== undefined && svgStyle.startDistance !== null) {
            startDistance = Number(svgStyle.startDistance);
        }
        startDistance = Math.max(0, Math.min(startDistance, totalLength));

        for (let distance = startDistance; distance < totalLength; distance += interval) {
            const point = turf.along(line, distance, { units: 'meters' });
            const bearing = getLineBearingAtDistance(line, distance, totalLength);
            const el = createIconMarker(svgStyle.iconSvg, sizePxAtZoom21);
            const marker = new maplibregl.Marker({
                element: el,
                rotationAlignment: 'map',
                pitchAlignment: 'map',
                rotation: bearing,
                anchor: 'center',
            }).setLngLat(point.geometry.coordinates);

            attachMarkerPopup(el, map, point.geometry.coordinates, buildPopupContent(typeName, feature.properties || {}));
            markersRef.current[typeName].push(marker);
        }
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
        if (shape.type === 'circle') {
            // Circle: create a Point feature at the transformed center
            const centerOffset = transformMMCoordinate(centerCoord, bearing, shape.x || 0, shape.y || 0);
            const feature = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: centerOffset
                },
                properties: {
                    ...properties,
                    _iconGeometry: true,
                    _circleRadius: shape.radius || 0.1,
                    _strokeWidth: shape.strokeWidth || 0.02
                }
            };
            features.push(feature);
        } else if (shape.type === 'line') {
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

const renderIconLineMarkers = (map, typeName, features, markersRef, themeColor) => {
    // Collect all icon line features from all input features
    const iconLineFeatures = [];
    
    features.forEach(feature => {
        let linetype = feature.properties && feature.properties.LINETYPE;
        if (!linetype) {
            linetype = 'DEFAULT';
        }
        
        const lineDefn = getLineDefinition(typeName, linetype ,themeColor);
        if (!lineDefn || lineDefn.length === 0) return;

                const dim = lineDefn.find(def => def && def.iconGeometry && def.iconInterval)
                    || lineDefn.find(def => def && def.iconSvg && def.iconInterval);
                if (!dim || !dim.iconInterval) {
                    return;
                }

                if (dim.iconSvg && !dim.iconGeometry) {
                    renderSvgIconMarkers(map, typeName, feature, lineDefn, markersRef);
                    return;
                }

        const coordsList = feature.geometry.type === 'LineString' ? [feature.geometry.coordinates] : feature.geometry.coordinates;

        coordsList.forEach(lineCoords => {
            if (!lineCoords || lineCoords.length < 2) return;

            const line = turf.lineString(lineCoords);
            const totalLength = turf.length(line, { units: 'meters' });
            // `iconInterval` and `startDistance` in `lineStyles` are now in meters.
            const interval = Math.max(1, Number(dim.iconInterval));

            // startDistance for icon entries: optional, in meters. Default to 0.
            let startDistance = 0;
            if (dim.startDistance !== undefined && dim.startDistance !== null) {
                startDistance = Number(dim.startDistance);
            }
            // Clamp
            startDistance = Math.max(0, Math.min(startDistance, totalLength));

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

    const sourceId = `${typeName}-icon-lines`;
    const layerId = `${typeName}-icon-lines-layer`;
    const lineLayerId = `${layerId}-lines`;

    if (iconLineFeatures.length === 0) {
        if (map.getLayer(lineLayerId)) {
            map.removeLayer(lineLayerId);
        }
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
        if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }
        return;
    }
    
    // Add icon line features as a new layer if any were created
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

    // Create or update layer (handles both line and circle features)
    if (!map.getLayer(layerId)) {
        // Circle layer for Point features
        map.addLayer({
            id: layerId,
            type: 'circle',
            source: sourceId,
            filter: ['==', ['geometry-type'], 'Point'],
            paint: {
                'circle-radius': [
                    'case',
                    ['has', '_circleRadius'],
                    ['*', ['get', '_circleRadius'], 100],
                    5
                ],
                'circle-color': themeColor,
                'circle-opacity': 0.8,
                'circle-stroke-width': [
                    'case',
                    ['has', '_strokeWidth'],
                    ['/', ['get', '_strokeWidth'], 100],
                    0.5
                ],
                'circle-stroke-color': themeColor
            }
        });
        // Line layer for LineString features
        map.addLayer({
            id: lineLayerId,
            type: 'line',
            source: sourceId,
            filter: ['!=', ['geometry-type'], 'Point'],
            paint: {
                'line-color': themeColor,
                'line-width': [
                    'case',
                    ['has', '_strokeWidth'],
                    ['/', ['get', '_strokeWidth'], 100],
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
};

export const renderLines = (map, typeName, features, markersRef = { current: {} }, options = {}) => {
    const isAnno = typeName === 'csdi:DTAD_RD_MARK_ANNO';
    const isIconLineLayer = ICON_LINE_LAYERS.has(typeName);
    const nonPoints = [];
    const iconLineFeatures = [];
    const themeColor = getThemeColor(options.isDarkMode === true);

    if (!markersRef.current) markersRef.current = {};
    if (!markersRef.current[typeName]) markersRef.current[typeName] = [];

    features.forEach(f => {
        const linetype = f.properties && (f.properties.LINETYPE || f.properties.REFNAME); // ROADCLASS is fallback for older data without LINETYPE
        const isLineGeometry = f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString';

        if (isLineGeometry) {
            const linetype = f.properties && (f.properties.LINETYPE || f.properties.REFNAME);
            const lineDefn = linetype ? getLineDefinition(typeName, linetype, themeColor) : getLineDefinition(typeName, 'DEFAULT', themeColor);
            const hasIcon = isIconLineLayer && lineDefn && lineDefn.some(def => def && ((def.iconGeometry && def.iconInterval) || (def.iconSvg && def.iconInterval)));
            if (hasIcon) {
                // Route this feature to icon renderer, while allowing non-icon
                // style entries of the same linetype to continue below.
                iconLineFeatures.push(f);
            }
        }

        if (linetype && isLineGeometry) {

            const styles = getLineDefinition(typeName, linetype, themeColor);

            if (styles && styles.length > 0) {
                styles.forEach((styleConfig, idx) => {
                    // Icon geometry is rendered by renderIconLineMarkers only.
                    // Do not emit a base line feature for this style entry.
                    if ((styleConfig.iconGeometry && styleConfig.iconInterval) || (styleConfig.iconSvg && styleConfig.iconInterval)) return;

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
                                // Allow per-style startDistance for dash/solid entries.
                                // Here startDistance is expected in meters (same units
                                // as dashMeters). Default to 0.
                                let currentLen = 0;
                                if (styleConfig.startDistance !== undefined && styleConfig.startDistance !== null) {
                                    currentLen = Number(styleConfig.startDistance);
                                }
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

    renderIconLineMarkers(map, typeName, iconLineFeatures, markersRef, themeColor);

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
        let hasMissingLinetype = false;
        nonPoints.forEach(f => {
            const linetype = f.properties && f.properties.LINETYPE;
            if (linetype) {
                uniqueLinetypes.add(linetype);
            } else {
                hasMissingLinetype = true;
            }
        });

        uniqueLinetypes.forEach(linetype => {
            const styles = getLineDefinition(typeName, linetype, themeColor);
            styles.forEach((styleConfig, idx) => {
                if ((styleConfig.iconGeometry && styleConfig.iconInterval) || (styleConfig.iconSvg && styleConfig.iconInterval)) return;

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
                            'line-color': styleConfig.color || themeColor,
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

        if (hasMissingLinetype) {
            if (typeName === 'csdi:DTAD_YL_BOX_LINE') {
                const defaultStyles = getLineDefinition(typeName, 'DEFAULT', themeColor);

                defaultStyles.forEach((styleConfig, idx) => {
                    const fallbackLayerId = `line-style-${typeName.replace(':', '-')}-fallback-default-${idx}`;

                    if (!map.getLayer(fallbackLayerId)) {
                        const paintProps = {
                            'line-color': styleConfig.color || '#ffef00',
                            'line-width': styleConfig.weight || 2,
                            'line-opacity': styleConfig.opacity !== undefined ? styleConfig.opacity : 0.8,
                        };

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
                            id: fallbackLayerId,
                            type: 'line',
                            source: typeName,
                            filter: ['!', ['has', 'LINETYPE']],
                            paint: paintProps,
                            layout: { 'line-join': 'round', 'line-cap': 'round' }
                        });
                    }
                });

                return;
            }

            const fallbackLayerId = `line-style-${typeName.replace(':', '-')}-fallback-no-linetype`;

            if (!map.getLayer(fallbackLayerId)) {
                map.addLayer({
                    id: fallbackLayerId,
                    type: 'line',
                    source: typeName,
                    filter: ['!', ['has', 'LINETYPE']],
                    paint: {
                        'line-color': themeColor,
                        'line-width': 2,
                        'line-opacity': 0.85
                    },
                    layout: { 'line-join': 'round', 'line-cap': 'round' }
                });
            }
        }

    }
};
