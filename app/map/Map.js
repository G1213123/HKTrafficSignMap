'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getMetersPerPixel } from './mapUtils';
import { layersConfig } from './mapConfig';
import proj4 from 'proj4';
import LayerControl from './LayerControl';
import MeasureTool from './MeasureTool';
import { loadLayerData, applyVisibilityOverlays } from './layerDataManager';
import './map.css';

export default function Map() {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const isInitializingRef = useRef(false);
    const markersRef = useRef({});
    const abortControllers = useRef({});
    const popupsRef = useRef([]);

    const [activeLayers, setActiveLayers] = useState(new Set());
    const activeLayersRef = useRef(activeLayers);
    const [mapMessage, setMapMessage] = useState('Initializing map...');
    const [mapLoaded, setMapLoaded] = useState(false);
    const [showRawPoints, setShowRawPoints] = useState(false);
    const showRawPointsRef = useRef(showRawPoints);
    const [crsInput, setCrsInput] = useState('EPSG:4326');
    const [coordInput, setCoordInput] = useState('114.1694,22.3193');
    const [panError, setPanError] = useState('');

    useEffect(() => {
        activeLayersRef.current = activeLayers;
    }, [activeLayers]);

    useEffect(() => {
        showRawPointsRef.current = showRawPoints;
    }, [showRawPoints]);

    useEffect(() => {
        try {
            const savedState = localStorage.getItem('mapState');
            if (savedState) {
                const state = JSON.parse(savedState);
                if (typeof state.showRawPoints === 'boolean') setShowRawPoints(state.showRawPoints);
            }
        } catch (e) { }
    }, []);

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
        if (mapInstanceRef.current || isInitializingRef.current) return;
        isInitializingRef.current = true;

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
                    attributionControl: false,
                    pitchWithRotate: false,
                    dragPitch: false
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
                        activeLayers: Array.from(activeLayersRef.current),
                        showRawPoints: showRawPointsRef.current
                    }));

                    if (map.getZoom() >= 16) {
                        Array.from(activeLayersRef.current).forEach(layer => {
                            loadLayerData(layer, {
                                map: mapInstanceRef.current,
                                abortControllers,
                                markersRef,
                                activeLayersRef,
                                showRawPoints: showRawPointsRef.current
                            });
                        });
                    }
                });

                map.on('click', (e) => {
                    if (window.isMeasuringActive) return;
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

    const fetchLayerData = useCallback((typeName) => {
        loadLayerData(typeName, {
            map: mapInstanceRef.current,
            abortControllers,
            markersRef,
            activeLayersRef,
            showRawPoints: showRawPointsRef.current
        });
    }, []);

    const parseAndConvertToWGS84 = (crs, coordStr) => {
        const parts = coordStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
        if (parts.length < 2) throw new Error('Enter two numbers separated by a comma');
        let x = parts[0], y = parts[1];

        if (crs === 'EPSG:3857') {
            const R = 6378137;
            const lon = (x / R) * (180 / Math.PI);
            const lat = (Math.PI / 2 - 2 * Math.atan(Math.exp(-y / R))) * (180 / Math.PI);
            return [lon, lat];
        }

        if (crs === 'EPSG:2326') {
            try {
                // Define EPSG:2326 (HK1980 Grid) for proj4 if not already defined
                proj4.defs("EPSG:2326", "+proj=tmerc +lat_0=22.3121333333333 +lon_0=114.178555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-276.959,-161.764,-0.067753,2.243648,1.158828,-1.094246 +units=m +no_defs +type=crs");
                const [lon, lat] = proj4('EPSG:2326', 'WGS84', [x, y]);
                return [lon, lat];
            } catch (err) {
                throw new Error('Failed to convert EPSG:2326: ' + err.message);
            }
        }

        // EPSG:4326 - allow either `lng,lat` or `lat,lng` by checking ranges
        if (crs === 'EPSG:4326') {
            const first = x, second = y;
            // if looks like lat,lng (lat in [-90,90] and lng outside that), swap
            if (first >= -90 && first <= 90 && (second < -90 || second > 90)) {
                return [second, first];
            }
            // otherwise assume input is lng,lat
            return [first, second];
        }

        // Default: assume WGS84 lon,lat
        return [x, y];
    };

    const handlePanTo = () => {
        setPanError('');
        if (!mapInstanceRef.current) {
            setPanError('Map not loaded');
            return;
        }
        try {
            const center = parseAndConvertToWGS84(crsInput, coordInput);
            mapInstanceRef.current.jumpTo({ center });
        } catch (e) {
            setPanError(e.message || 'Invalid coordinates');
        }
    };

    // Apply Visibility Overlays
    useEffect(() => {
        if (!mapLoaded || !mapInstanceRef.current) return;
        const map = mapInstanceRef.current;
        localStorage.setItem('mapState', JSON.stringify({
            center: map.getCenter(),
            zoom: map.getZoom(),
            activeLayers: Array.from(activeLayers),
            showRawPoints
        }));

        Object.values(layersConfig).flat().forEach(typeName => {
            const isActive = activeLayers.has(typeName);

            // Fetch missing data if activated or force refetch to apply raw points visibility
            if (isActive) {
                // If it's already there but we just toggled showRawPoints, it's easier to just re-fetch
                // or we could decouple raw points logic. For now let's just trigger fetchLayerData to redraw
                fetchLayerData(typeName);
            }
        });

        applyVisibilityOverlays({ map, activeLayers, markersRef });

    }, [activeLayers, mapLoaded, fetchLayerData, showRawPoints]);

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
            <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', padding: '8px', zIndex: 25, border: '1px solid #ccc', borderRadius: '4px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <select value={crsInput} onChange={(e) => setCrsInput(e.target.value)} style={{ padding: '4px' }}>
                    <option value="EPSG:4326">EPSG:4326</option>
                    <option value="EPSG:3857">EPSG:3857</option>
                    <option value="EPSG:2326">EPSG:2326 (HK1980 Grid)</option>
                </select>
                <input value={coordInput} onChange={(e) => setCoordInput(e.target.value)} placeholder="lng,lat or x,y" style={{ padding: '4px', minWidth: '160px' }} />
                <button onClick={handlePanTo} style={{ padding: '6px 8px' }}>Go</button>
                {panError && <div style={{ color: 'red', marginLeft: '6px' }}>{panError}</div>}
            </div>
            {mapLoaded && <MeasureTool map={mapInstanceRef.current} />}
            <LayerControl
                layersConfig={layersConfig}
                activeLayers={activeLayers}
                onToggleLayer={toggleLayer}
                onToggleGroup={toggleGroup}
                showRawPoints={showRawPoints}
                onToggleShowRawPoints={(val) => setShowRawPoints(val)}
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