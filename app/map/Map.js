'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-groupedlayercontrol';
import 'leaflet-groupedlayercontrol/dist/leaflet.groupedlayercontrol.min.css';
import { getLineStyles, getOffsetLatLngs } from './lineStyles';
import './map.css';

// Fix for default marker icon issues in Next.js/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function Map() {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (mapInstanceRef.current) return; // Already initialized

        // Initialize map
        const map = L.map(mapContainerRef.current).setView([22.3193, 114.1694], 14);
        mapInstanceRef.current = map;

        // Dynamic Icon Scaling
        function updateIconScale() {
            const zoom = map.getZoom();
            const scale = Math.pow(2, zoom - 21);
            map.getContainer().style.setProperty('--map-icon-scale', scale);
        }
        map.on('zoomend', updateIconScale);
        updateIconScale();

        // Tile Layers
        L.tileLayer('https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/basemap/WGS84/{z}/{x}/{y}.png', {
            maxNativeZoom: 20,
            maxZoom: 22,
            attribution: 'Map information from Lands Department'
        }).addTo(map);

        L.tileLayer('https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/label/hk/en/WGS84/{z}/{x}/{y}.png', {
            maxNativeZoom: 20,
            maxZoom: 22,
            attribution: 'Map information from Lands Department'
        }).addTo(map);

        // Scale Control
        L.control.scale({ metric: true, imperial: false }).addTo(map);

        // Configuration
        const layerApiUrl = '/api/layers';

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

        const groupedOverlays = {};
        const allLayersMap = {};

        // Layer Builder
        function getIconUrl(typeName, refname) {
            if (!refname) return null;
            if (typeName.includes('TRAFFIC_LIGHT')) return `/data/svgs/${refname}.svg`;
            if (typeName.includes('DTAD_TS_')) return `/data/svgs/TS_${refname}.svg`;
            if (typeName.includes('DTAD_RD_MARK_SYM')) return `/data/svgs/RM_${refname}.svg`;
            return null;
        }

        for (const [groupName, layerList] of Object.entries(layersConfig)) {
            groupedOverlays[groupName] = {};
            
            layerList.forEach(typeName => {
                let label = typeName.replace('csdi:', '').replace('DTAD_', '').replace(/_/g, ' ');
                
                // Road Marking Annotations line style
                const layer = L.geoJSON(null, {
                    style: function (feature) {
                        if (typeName === 'csdi:DTAD_RD_MARK_ANNO') {
                            return { opacity: 0, fillOpacity: 0, stroke: false, interactive: false };
                        }
                        let style = {color: "#000000", weight: 2, opacity: 0.8}; 
                        if (feature && feature.properties && feature.properties.LINETYPE) {
                            const styles = getLineStyles(feature.properties.LINETYPE, map);
                            if (styles.length > 0) {
                                style = { ...style, ...styles[0] };
                                if (styles[0].offset) {
                                    style.opacity = 0; 
                                }
                            }
                        }
                        return style;
                    },
                    pointToLayer: function (feature, latlng) {
                        let iconUrl = getIconUrl(typeName, feature.properties?.REFNAME);
                        if (iconUrl) {
                            let angle = (feature.properties && feature.properties.ANGLE) ? feature.properties.ANGLE : 0;
                            return L.marker(latlng, {
                                icon: L.divIcon({
                                    className: 'custom-svg-icon-wrapper', 
                                    html: `<div class="custom-svg-icon"><img src="${iconUrl}" style="transform: rotate(${-angle}deg);" /></div>`,
                                    iconSize: [0, 0],
                                    iconAnchor: [0, 0]
                                })
                            });
                        }
                        return L.circleMarker(latlng, {
                            radius: 3,
                            fillColor: "#000000",
                            color: "#ffffff",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        });
                    },
                    onEachFeature: function (feature, featureLayer) {


                        if (feature.properties) {
                            let popupContent = `<b>${label}</b><br><div class="popup-content">`;
                            for (const key in feature.properties) {
                                 if(feature.properties[key] !== null) {
                                    popupContent += `<b>${key}:</b> ${feature.properties[key]}<br>`;
                                 }
                            }
                            popupContent += '</div>';
                            featureLayer.bindPopup(popupContent);
                        }
                        if (feature.properties && feature.properties.LINETYPE) {
                            const styles = getLineStyles(feature.properties.LINETYPE, map);
                            styles.forEach((style, index) => {
                                if (index === 0 && !style.offset) return; 
                                if (feature.geometry.type === "MultiLineString" || feature.geometry.type === "LineString") {
                                    const flatten = (arr) => arr[0] instanceof L.LatLng ? [arr] : arr;
                                    const segments = flatten(featureLayer.getLatLngs());
                                    segments.forEach(segment => {
                                        let finalLatLngs = segment;
                                        if (style.offset) {
                                            finalLatLngs = getOffsetLatLngs(segment, style.offset, map);
                                        }
                                        const multiLine = L.polyline(finalLatLngs, style);
                                        multiLine.options.isCustomPart = true;
                                        multiLine.options.linetype = feature.properties.LINETYPE;
                                        multiLine.options.styleIndex = index;
                                        multiLine.options.origFeature = feature;
                                        layer.addLayer(multiLine);
                                    });
                                }
                            });
                        }
                    }
                });
                
                allLayersMap[typeName] = layer;
                groupedOverlays[groupName][label] = layer;
            });
        }

        // Add Controls
        if (L.control.groupedLayers) {
            const layerControl = L.control.groupedLayers(null, groupedOverlays, {
                collapsed: false,
                groupCheckboxes: true 
            });
            layerControl.addTo(map);
            L.DomEvent.disableScrollPropagation(layerControl.getContainer());
            L.DomEvent.disableClickPropagation(layerControl.getContainer());
        } else {
            console.warn('L.control.groupedLayers not found, falling back to L.control.layers');
            // Fallback: Flatten the groups
            const flatOverlays = {};
            for (const group in groupedOverlays) {
                for (const label in groupedOverlays[group]) {
                    flatOverlays[`${group}: ${label}`] = groupedOverlays[group][label];
                }
            }
            L.control.layers(null, flatOverlays).addTo(map);
        }

        // Persistence Logic
        function saveMapState() {
            const center = map.getCenter();
            const zoom = map.getZoom();
            const activeLayers = [];
            for (const [key, layer] of Object.entries(allLayersMap)) {
                if (map.hasLayer(layer)) activeLayers.push(key);
            }
            try {
                localStorage.setItem('mapState', JSON.stringify({
                    center: { lat: center.lat, lng: center.lng },
                    zoom: zoom,
                    activeLayers: activeLayers
                }));
            } catch (e) { }
        }

        // Restore State
        try {
            const savedState = localStorage.getItem('mapState');
            let stateRestored = false;
            if (savedState) {
                const state = JSON.parse(savedState);
                if (state.center && state.zoom) map.setView([state.center.lat, state.center.lng], state.zoom);
                if (state.activeLayers && Array.isArray(state.activeLayers)) {
                    state.activeLayers.forEach(layerKey => {
                        const layer = allLayersMap[layerKey];
                        if (layer) {
                            layer.addTo(map);
                            stateRestored = true;
                        }
                    });
                }
            }
            if (!stateRestored && allLayersMap["csdi:DTAD_TS_POLE_PT"]) {
                allLayersMap["csdi:DTAD_TS_POLE_PT"].addTo(map);
            }
        } catch (e) {
            if (allLayersMap["csdi:DTAD_TS_POLE_PT"]) allLayersMap["csdi:DTAD_TS_POLE_PT"].addTo(map);
        }

        map.on('moveend', saveMapState);
        map.on('zoomend', saveMapState);
        map.on('overlayadd', saveMapState);
        map.on('overlayremove', saveMapState);

        // Data Loading
        const abortControllers = {}; 
        async function fetchWithRetry(url, options, retries = 2) {
            let lastError;
            for (let attempt = 0; attempt <= retries; attempt++) {
                try {
                    const res = await fetch(url, options);
                    if (!res.ok) {
                        throw new Error(`HTTP ${res.status}`);
                    }
                    return await res.json();
                } catch (err) {
                    // Respect aborts immediately (e.g., user pans/zooms quickly and a new request starts)
                    if (err && err.name === 'AbortError') {
                        throw err;
                    }
                    lastError = err;
                    if (attempt < retries) {
                        // Small backoff to reduce burst failures on transient network issues
                        await new Promise(resolve => setTimeout(resolve, 200 * (attempt + 1)));
                    }
                }
            }
            throw lastError;
        }

        function loadLayer(typeName, bounds, layerInstance) {
            if (abortControllers[typeName]) abortControllers[typeName].abort();
            const controller = new AbortController();
            abortControllers[typeName] = controller;

            const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
            const wfsUrl = `${layerApiUrl}?typeName=${encodeURIComponent(typeName)}&bbox=${encodeURIComponent(bbox)}`;

            fetchWithRetry(wfsUrl, { signal: controller.signal }, 2)
                .then(data => {
                    layerInstance.clearLayers();
                    if (data && data.features && data.features.length > 0) {
                        layerInstance.addData(data);
                    }
                })
                .catch(err => {
                    if (err.name !== 'AbortError') console.error(`Error loading ${typeName}:`, err);
                });
        }

        function refreshMap() {
            if (map.getZoom() < 16) return;
            const bounds = map.getBounds();
            for (const [typeName, layerInstance] of Object.entries(allLayersMap)) {
                if (map.hasLayer(layerInstance)) {
                    loadLayer(typeName, bounds, layerInstance);
                }
            }
        }
        
        map.on('load', refreshMap);
        map.on('moveend', refreshMap);
        map.on('overlayadd', refreshMap);

        // Styles Update
        function metersToPixels(meters, latitude, zoom) {
            const metersPerPixel = (40075016.686 * Math.cos(latitude * Math.PI / 180)) / Math.pow(2, zoom + 8);
            return meters / metersPerPixel;
        }

        function updateStylesForZoom() {
            if (map.getZoom() < 16) return;
        
            document.querySelectorAll('.road-label').forEach(el => {
                const sizeMeters = parseFloat(el.getAttribute('data-size-meters'));
                const lat = parseFloat(el.getAttribute('data-lat'));
                if (!isNaN(sizeMeters) && !isNaN(lat)) {
                    const pxSize = metersToPixels(sizeMeters, lat, map.getZoom());
                    el.style.fontSize = pxSize + 'px';
                }
            });
        
            for (const layerInstance of Object.values(allLayersMap)) {
                 layerInstance.eachLayer(function(layer) {
                     if (layer.feature && layer.setStyle && !layer.options.isCustomPart) {
                         layer.setStyle(function(feature) {
                             let style = {color: "#000000", weight: 2, opacity: 0.8}; 
                             if (feature && feature.properties && feature.properties.LINETYPE) {
                                 const styles = getLineStyles(feature.properties.LINETYPE, map);
                                 if (styles.length > 0) {
                                     style = { ...style, ...styles[0] };
                                     if (styles[0].offset) style.opacity = 0;
                                 }
                             }
                             return style;
                         });
                     }
                     if (layer.options && layer.options.isCustomPart) {
                         const linetype = layer.options.linetype;
                         const idx = layer.options.styleIndex;
                         const styles = getLineStyles(linetype, map);
                         if (styles[idx]) {
                             layer.setStyle(styles[idx]);
                         }
                     }
                 });
            }
        }
        map.on('zoomend', updateStylesForZoom);

        // Zoom Info
        const zoomInfo = L.control({position: 'bottomleft'});
        zoomInfo.onAdd = function () {
            const div = L.DomUtil.create('div', 'info legend');
            div.style.background = 'white';
            div.style.padding = '5px';
            div.style.border = '1px solid #ccc';
            div.innerHTML = 'Zoom in to level 16+ to load data';
            return div;
        };
        zoomInfo.addTo(map);

        map.on('zoomend', function() {
            const div = document.querySelector('.info.legend');
            if (div) {
                if (map.getZoom() < 16) {
                    div.innerHTML = 'Zoom in to level 16+ to load data';
                    div.style.color = 'red';
                } else {
                    div.innerHTML = 'Data loading active';
                    div.style.color = 'green';
                    refreshMap();
                }
            }
        });

        // Trigger initial data load
        refreshMap();


        // Cleanup
        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    return <div ref={mapContainerRef} className="map-container" />;
}
