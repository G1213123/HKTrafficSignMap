'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getMetersPerPixel } from './mapUtils';
import { layersConfig } from './mapConfig';
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

    useEffect(() => {
        activeLayersRef.current = activeLayers;
    }, [activeLayers]);

    useEffect(() => {
        try {
            const savedState = localStorage.getItem('mapState');
            if (savedState) {
                const state = JSON.parse(savedState);
                if (typeof state.showRawPoints === 'boolean') setShowRawPoints(state.showRawPoints);
            }
        } catch (e) {}
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
                        showRawPoints
                    }));
                    
                    if (map.getZoom() >= 16) {
                        Array.from(activeLayersRef.current).forEach(layer => fetchLayerData(layer));
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
            showRawPoints
        });
    }, [showRawPoints]);

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

            // Fetch missing data if activated
            if (isActive && (!markersRef.current[typeName] && !map.getSource(typeName))) {
                fetchLayerData(typeName);
            }
        });

        applyVisibilityOverlays({ map, activeLayers, markersRef });

    }, [activeLayers, mapLoaded, fetchLayerData]);

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