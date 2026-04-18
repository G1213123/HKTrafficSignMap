import * as turf from '@turf/turf';
import { getLineStyles } from './lineStyles';
import { getMetersPerPixel } from './mapUtils';

export const renderLines = (map, typeName, features) => {
    const isAnno = typeName === 'csdi:DTAD_RD_MARK_ANNO';
    const nonPoints = [];

    features.forEach(f => {
        const linetype = f.properties && f.properties.LINETYPE;

        if (linetype && (f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString')) {
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
                            } catch (err) {}
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
    }
};
