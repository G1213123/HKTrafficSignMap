'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as turf from '@turf/turf';
import { getLineStyles } from './lineStyles';
import './map.css';
import rmDimensions from '../../public/data/rm_dimension.json';

// Build lookup dictionary for road marking physical dimensions
const rmDimensionDict = {};
if (Array.isArray(rmDimensions)) {
    rmDimensions.forEach(item => {
        rmDimensionDict[item.signNumber] = item;
    });
}

const layersConfig = {
    "Traffic Signs": [
        "csdi:DTAD_TS_POLE_PT", "csdi:DTAD_TS_PLATE_LINE", "csdi:DTAD_TS_MISC_LINE", 
        "csdi:DTAD_TS_ABV_LINE", "csdi:DTAD_TS_POLE_LINE", "csdi:DTAD_TS_FILLED", 
        "csdi:DTAD_TS_ABV_PT", "csdi:DTAD_TS_ABV_ANNO"
    ],
    "Directional Signs": [
        "csdi:DTAD_DS_POLE_PT", "csdi:DTAD_DS_POLE_LINE", "csdi:DTAD_DS_PLATE_LINE", 
        "csdi:DTAD_DS_MISC_LINE", "csdi:DTAD_DS_POLE_LINE_C", "csdi:DTAD_DS_FILLED"
    ],
    "Pedestrian Signs": [
        "csdi:DTAD_PS_POLE_PT", "csdi:DTAD_PS_POLE_LINE", "csdi:DTAD_PS_PLATE_LINE", 
        "csdi:DTAD_PS_MISC_LINE", "csdi:DTAD_PS_FILLED", "csdi:DTAD_PS_ANNO"
    ],
    "Traffic Lights": [
        "csdi:DTAD_TRAFFIC_LIGHT_PT", "csdi:DTAD_TRAFFIC_LIGHT_LINE", "csdi:DTAD_TRAFFIC_LIGHT_FILLED"
    ],
    "Road Markings": [
        "csdi:DTAD_RD_MARK_ANNO", "csdi:DTAD_RD_MARK_SYM_PT", "csdi:DTAD_RD_MARK_SYM_LINE",
        "csdi:DTAD_RD_MARK_LINE_C", "csdi:DTAD_RD_MARK_LINE", "csdi:DTAD_CROSSING_LINE",
        "csdi:DTAD_YL_BOX_LINE", "csdi:DTAD_YL_BOX_POLY", "csdi:DTAD_TW_STRIP_LINE",
        "csdi:DTAD_TY_BAR_LINE", "csdi:DTAD_RD_AL_LINE", "csdi:DTAD_RST_ZONE_LINE",
        "csdi:DTAD_LV38_LINE", "csdi:DTAD_LV30_LINE", "csdi:DTAD_LV24_LINE",
        "csdi:DTAD_LV23_LINE", "csdi:DTAD_LV22_LINE", "csdi:DTAD_LV21_LINE",
        "csdi:DTAD_LV22_FILLED"
    ],
    "Railings": [ "csdi:DTAD_RAILING_LINE" ],
    "Miscellaneous": [
        "csdi:DTAD_GIPOLE_PT", "csdi:DTAD_MISC_PT", "csdi:DTAD_CYC_PT",
        "csdi:UNKNOWN_LINE", "csdi:DTAD_TG_PATH_LINE", "csdi:DTAD_PED_REFUGE_LINE",
        "csdi:DTAD_RUN_IN_OUT_LINE", "csdi:DTAD_DROP_KERB_LINE"
    ]
};

// Extracted Helper for converting style configuration to MapLibre

function getMetersPerPixel(lat, zoom) {
    const earthCircumference = 40075016.686;
    return earthCircumference * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom + 8);
}

// Custom Layer Panel Component Overlying MapLibre
const LayerControl = ({ activeLayers, onToggleLayer, onToggleGroup }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="layer-control-panel" style={{
            position: 'absolute', top: 10, right: 10, zIndex: 10,
            background: 'rgba(255, 255, 255, 0.95)', padding: collapsed ? '10px' : '15px', 
            borderRadius: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            maxHeight: '80vh', overflowY: 'auto', minWidth: '200px',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: collapsed ? '0' : '10px' }}>
                <strong style={{ fontSize: '14px' }}>Map Overlays</strong>
                <button 
                    onClick={() => setCollapsed(!collapsed)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}
                >
                    {collapsed ? '▼' : '▲'}
                </button>
            </div>
            {!collapsed && Object.entries(layersConfig).map(([groupName, layerList]) => {
                const isGroupActive = layerList.every(layer => activeLayers.has(layer));
                const isGroupPartiallyActive = layerList.some(layer => activeLayers.has(layer)) && !isGroupActive;
                
                return (
                    <div key={groupName} className="layer-group" style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>
                            <input 
                                type="checkbox" 
                                checked={isGroupActive} 
                                ref={input => { if (input) input.indeterminate = isGroupPartiallyActive; }}
                                onChange={(e) => onToggleGroup(layerList, e.target.checked)} 
                                style={{ marginRight: '6px' }} 
                            />
                            <strong style={{ fontSize: '13px' }}>
                                {groupName}
                            </strong>
                        </div>
                        {layerList.map(layer => {
                            const label = layer.replace('csdi:', '').replace('DTAD_', '').replace(/_/g, ' ');
                            const isActive = activeLayers.has(layer);
                            return (
                                <label key={layer} style={{ display: 'flex', alignItems: 'center', fontSize: '12px', cursor: 'pointer', margin: '4px 0', paddingLeft: '18px' }}>
                                    <input type="checkbox" checked={isActive} onChange={() => onToggleLayer(layer)} style={{ marginRight: '6px' }} />
                                    {label}
                                </label>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default function Map() {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});
    const abortControllers = useRef({});
    const popupsRef = useRef([]);

    const [activeLayers, setActiveLayers] = useState(new Set());
    const activeLayersRef = useRef(activeLayers);
    const [mapMessage, setMapMessage] = useState('Initializing map...');
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        activeLayersRef.current = activeLayers;
    }, [activeLayers]);

    // Initial Active layer config loading
    useEffect(() => {
        try {
            const savedState = localStorage.getItem('mapState');
            if (savedState) {
                const state = JSON.parse(savedState);
                if (state.activeLayers && Array.isArray(state.activeLayers)) {
                    setActiveLayers(new Set(state.activeLayers));
                }
            } else {
                setActiveLayers(new Set(["csdi:DTAD_TS_POLE_PT"])); // Default load
            }
        } catch (e) {
            setActiveLayers(new Set(["csdi:DTAD_TS_POLE_PT"]));
        }
    }, []);

    // Initialize Map
    useEffect(() => {
        if (mapInstanceRef.current) return;

        let initialCenter = [114.1694, 22.3193];
        let initialZoom = 14;

        try {
            const savedState = localStorage.getItem('mapState');
            if (savedState) {
                const state = JSON.parse(savedState);
                if (state.center) initialCenter = [state.center.lng, state.center.lat];
                if (state.zoom) initialZoom = state.zoom;
            }
        } catch (e) { }

        // Fetch and patch the Vector Map Style dynamically
        fetch('https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/basemap/WGS84/resources/styles/root.json')
            .then(res => res.json())
            .then(styleData => {
                // GeoData API uses an ArcGIS-style tilejson which maplibre doesn't parse natively,
                // so we manually override the source to explicitly provide the tile URL format.
                if (styleData.sources && styleData.sources.esri) {
                    delete styleData.sources.esri.url;
                    styleData.sources.esri.tiles = [
                        'https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/basemap/WGS84/tile/{z}/{y}/{x}.pbf'
                    ];
                    // Restrict zoom limits to force overzoom/underzoom from available vector tiles
                    styleData.sources.esri.minzoom = 9;
                    styleData.sources.esri.maxzoom = 15;
                }
                // Fix relative fonts/sprites paths
                styleData.sprite = 'https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/basemap/WGS84/resources/sprites/sprite';
                styleData.glyphs = 'https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/basemap/WGS84/resources/fonts/{fontstack}/{range}.pbf';

                if (!mapContainerRef.current) return;

                const map = new maplibregl.Map({
                    container: mapContainerRef.current,
                    style: styleData,
                    center: initialCenter,
                    zoom: initialZoom,
                    maxZoom: 22,
                    attributionControl: false
                });
                
                map.addControl(new maplibregl.AttributionControl({ customAttribution: 'Map information from Lands Department' }));
                map.addControl(new maplibregl.ScaleControl({ maxWidth: 200, unit: 'metric' }));

                map.on('load', () => {
                    mapInstanceRef.current = map;
                    setMapLoaded(true);
                    updateScaleIndicator();
                });

                // Dynamic Icon Scaling CSS Variable
                const updateScaleIndicator = () => {
                    const zoom = map.getZoom();
                    const scale = Math.pow(2, zoom - 21);
                    if (mapContainerRef.current) {
                        mapContainerRef.current.style.setProperty('--map-icon-scale', scale);
                    }
                    
                    // Labels scaling
                    document.querySelectorAll('.road-label').forEach(el => {
                        const sizeMeters = parseFloat(el.getAttribute('data-size-meters'));
                        const lat = parseFloat(el.getAttribute('data-lat'));
                        if (!isNaN(sizeMeters) && !isNaN(lat)) {
                            const pxSize = sizeMeters / getMetersPerPixel(lat, zoom);
                            el.style.fontSize = pxSize + 'px';
                        }
                    });

                    if (zoom < 16) {
                        setMapMessage('Zoom in to level 16+ to load data');
                    } else {
                        setMapMessage('Data loading/active');
                    }
                };

                map.on('zoom', updateScaleIndicator);
                map.on('moveend', () => {
                    if (!mapInstanceRef.current) return;
                    const c = map.getCenter();
                    localStorage.setItem('mapState', JSON.stringify({
                        center: { lat: c.lat, lng: c.lng },
                        zoom: map.getZoom(),
                        activeLayers: Array.from(activeLayersRef.current)
                    }));
                    
                    if (map.getZoom() >= 16) {
                        Array.from(activeLayersRef.current).forEach(layer => loadLayerData(layer));
                    }
                });

                map.on('click', (e) => {
                    // Intersect Line/Polygon clicks
                    const features = map.queryRenderedFeatures(e.point);
                    const clickableGeoJSONs = features.filter(f => f.source && f.source.startsWith('csdi:'));
                    
                    if (clickableGeoJSONs.length > 0) {
                        const feature = clickableGeoJSONs[0];
                        let label = feature.source.replace('csdi:DTAD_', '').replace(/_/g, ' ');
                        let popupContent = `<b>${label}</b><br><div class="popup-content">`;
                        for (const key in feature.properties) {
                            if (feature.properties[key] !== null) {
                                popupContent += `<b>${key}:</b> ${feature.properties[key]}<br>`;
                            }
                        }
                        popupContent += '</div>';

                        new maplibregl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML(popupContent)
                            .addTo(map);
                    }
                });

                map.on('mousemove', (e) => {
                    const features = map.queryRenderedFeatures(e.point);
                    const isClickable = features.some(f => f.source && f.source.startsWith('csdi:'));
                    map.getCanvas().style.cursor = isClickable ? 'pointer' : '';
                });
            })
            .catch(e => console.error("Error loading Vector Map Style:", e));

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Network Request Abort utility
    const fetchWithRetry = async (url, options, retries = 2) => {
        let lastError;
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const res = await fetch(url, options);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return await res.json();
            } catch (err) {
                if (err && err.name === 'AbortError') throw err;
                lastError = err;
                if (attempt < retries) await new Promise(resolve => setTimeout(resolve, 200 * (attempt + 1)));
            }
        }
        throw lastError;
    };

    const getIconUrl = (typeName, refname) => {
        if (!refname) return null;
        if (typeName.includes('TRAFFIC_LIGHT')) return `/data/svgs/${refname}.svg`;
        if (typeName.includes('DTAD_TS_')) return `/data/svgs/TS_${refname}.svg`;
        if (typeName.includes('DTAD_RD_MARK_SYM')) return `/data/svgs/RM_${refname}.svg`;
        return null;
    };

    const loadLayerData = useCallback((typeName) => {
        const map = mapInstanceRef.current;
        if (!map || map.getZoom() < 16) return;

        if (abortControllers.current[typeName]) {
            abortControllers.current[typeName].abort();
        }
        const controller = new AbortController();
        abortControllers.current[typeName] = controller;

        const bounds = map.getBounds();
        const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
        const wfsUrl = `/api/layers?typeName=${encodeURIComponent(typeName)}&bbox=${encodeURIComponent(bbox)}`;

        fetchWithRetry(wfsUrl, { signal: controller.signal }, 2).then(data => {
            if (!data || !data.features || !mapInstanceRef.current) return;

            const isAnno = typeName === 'csdi:DTAD_RD_MARK_ANNO';
            const nonPoints = [];
            const points = [];

            data.features.forEach(f => {
                if (f.geometry.type === 'Point' || f.geometry.type === 'MultiPoint') {
                    points.push(f);
                } else {
                    const linetype = f.properties && f.properties.LINETYPE;
                    let hasCustomSegments = false;

                    if (linetype && (f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString')) {
                        const styles = getLineStyles(linetype);
                        
                        if (styles && styles.length > 0) {
                            styles.forEach((styleConfig, idx) => {
                                const clonedFeature = JSON.parse(JSON.stringify(f));
                                clonedFeature.properties._styleIndex = idx; // Differentiate identical linestyles
                                
                                if (styleConfig.dashMeters && Array.isArray(styleConfig.dashMeters)) {
                                    hasCustomSegments = true;
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

                                // Dash array removed -> Replaced by Turf.js geographical slicing above!

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

            // 3. Purge old markers & Repopulate newly fetched MapLibre Point Markers
            if (markersRef.current[typeName]) {
                markersRef.current[typeName].forEach(m => m.remove());
            }
            markersRef.current[typeName] = [];

            points.forEach(feature => {
                const coords = feature.geometry.coordinates;
                if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return;
                
                const refname = feature.properties?.REFNAME;
                const iconUrl = getIconUrl(typeName, refname);
                
                const el = document.createElement('div');
                if (iconUrl) {
                    let angle = (feature.properties && feature.properties.ANGLE != null) ? Number(feature.properties.ANGLE) - 90 : 0;
                    let customStyle = `transform: rotate(${-angle}deg);`;
                    let extraClass = '';
                    
                    if (typeName.includes('DTAD_RD_MARK') && refname) {
                        extraClass = ' rd-mark-icon';
                        const dim = rmDimensionDict[refname.toString()];
                        if (dim) {
                            if (dim.angleCorrection) {
                                angle -= dim.angleCorrection;
                                customStyle = `transform: rotate(${-angle}deg);`;
                            }
                            if (dim.length || dim.minLength || dim.maxLength) {
                                const lengthValue = dim.length || dim.minLength || dim.maxLength;
                                const lengthPx = lengthValue / 69.05;
                                customStyle += ` height: calc(${lengthPx}px * var(--map-icon-scale, 1)); width: auto; max-width: none;`;
                            }
                        }
                    }
                    
                    el.className = 'custom-svg-icon-wrapper';
                    el.innerHTML = `<div class="custom-svg-icon${extraClass}"><img src="${iconUrl}" style="${customStyle}" /></div>`;
                } else {
                    el.className = 'default-circle-marker';
                    el.style.width = '6px';
                    el.style.height = '6px';
                    el.style.backgroundColor = '#000000';
                    el.style.border = '1px solid #ffffff';
                    el.style.borderRadius = '50%';
                }

                const marker = new maplibregl.Marker({ element: el }).setLngLat(coords);

                el.addEventListener('click', (e) => {
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

        }).catch(err => {
            if (err.name !== 'AbortError') console.error(`Error loading ${typeName}:`, err);
        });
    }, []);

    // Apply Visibility Overlays
    useEffect(() => {
        if (!mapLoaded || !mapInstanceRef.current) return;
        const map = mapInstanceRef.current;
        localStorage.setItem('mapState', JSON.stringify({
            center: map.getCenter(),
            zoom: map.getZoom(),
            activeLayers: Array.from(activeLayers)
        }));

        Object.values(layersConfig).flat().forEach(typeName => {
            const isActive = activeLayers.has(typeName);

            // Fetch missing data if activated
            if (isActive && (!markersRef.current[typeName] && !map.getSource(typeName))) {
                loadLayerData(typeName);
            }

            // Sync MapLibre layer visibility 
            if (map.getStyle()) {
                const layers = map.getStyle().layers;
                layers.forEach(l => {
                    if (l.source === typeName) {
                        map.setLayoutProperty(l.id, 'visibility', isActive ? 'visible' : 'none');
                    }
                });
            }

            // Toggle POI Marker DOM nodes
            if (markersRef.current[typeName]) {
                markersRef.current[typeName].forEach(m => {
                    if (isActive) m.addTo(map);
                    else m.remove();
                });
            }
        });
    }, [activeLayers, mapLoaded, loadLayerData]);

    const toggleLayer = (layerName) => {
        setActiveLayers(prev => {
            const next = new Set(prev);
            if (next.has(layerName)) next.delete(layerName);
            else next.add(layerName);
            return next;
        });
    };

    const toggleGroup = (layerList, targetState) => {
        setActiveLayers(prev => {
            const next = new Set(prev);
            layerList.forEach(layer => {
                if (targetState) next.add(layer);
                else next.delete(layer);
            });
            return next;
        });
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div ref={mapContainerRef} className="map-container" />
            <LayerControl 
                layersConfig={layersConfig} 
                activeLayers={activeLayers} 
                onToggleLayer={toggleLayer} 
                onToggleGroup={toggleGroup}
            />
            <div className="info legend" style={{
                position: 'absolute', bottom: '20px', left: '10px',
                background: 'white', padding: '5px 10px', border: '1px solid #ccc',
                zIndex: 10, color: mapMessage.includes('Zoom in') ? 'red' : 'green',
                borderRadius: '4px', fontSize: '13px', pointerEvents: 'none'
            }}>
                {mapMessage}
            </div>
        </div>
    );
}
``