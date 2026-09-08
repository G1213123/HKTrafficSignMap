'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getMetersPerPixel } from './mapUtils';
import { layersConfig, layerLegendDict } from './layerConfig';
import proj4 from 'proj4';
import Navbar from '../components/Navbar';
import MapSidebar from './MapSidebar';
import MeasureTool from './MeasureTool';
import ShareTool from './ShareTool';
import { useI18n } from '../components/I18nProvider';
import { loadLayerData, renderLayerData, applyVisibilityOverlays } from './layerDataManager';
import { buildTrafficLightPreviewHtmlForRefname } from './svgShapes';
import { setRawLineSelection } from './rendererLine';
import './map.css';

const BASEMAP_LABEL_SOURCE_ID = 'geodata-basemap-labels';
const BASEMAP_LABEL_LAYER_ID = 'geodata-basemap-labels-layer';
const EPSG_2326_DEF = '+proj=tmerc +lat_0=22.3121333333333 +lon_0=114.178555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-276.959,-161.764,-0.067753,2.243648,1.158828,-1.094246 +units=m +no_defs +type=crs';

const darkModeColors = {
    "#CCEDFF": "#2A4A5A",
    "#FFFFFF": "#121212",
    "#CCECFF": "#2A495A",
    "#F4F7E8": "#2E3328",
    "#F3F5E6": "#2D3227",
    "#EDF0DF": "#2A2E25",
    "#E7EBD5": "#272C23",
    "#E1E6CC": "#242A21",
    "#E2E3E4": "#242424",
    "#DEE3C5": "#232921",
    "#D8DEBF": "#21271F",
    "#D2D9B6": "#1F251E",
    "#CBD4AE": "#1D241C",
    "#C7D1A7": "#1C231B",
    "#FFE1A9": "#121212",
    "#FED591": "#121212",
    "#DEE3F5": "#232739",
    "#9C9C9C": "#2E2E2E",
    "#C4D9AD": "#1B231A",
    "#CEE3C1": "#1D291E",
    "#BBD4EE": "#1A273A",
    "#97BDDB": "#16304A",
    "#9CCBEC": "#163A56",
    "#D9E0C8": "#21271F",
    "#C7C8B1": "#1C1D17",
    "#D2D7EB": "#1F2333",
    "#FEFEFE": "#121212",
    "#C8CDE1": "#1C1F2A",
    "#E2F7D5": "#242E21",
    "#91D1EB": "#16445A",
    "#B2B2B2": "#535353",
    "#E1E1E1": "#242424",
    "#D2D3D4": "#1F2020",
    "#A89A77": "#2E2619",
    "#BCAE8B": "#2A2419",
    "#B8B8B8": "#1C1C1C",
    "#79B5E0": "#123A56",
    "#C7C9CB": "#1C1D1E",
    "#646464": "#1A1A1A",
    "#D6D6D6": "#202020",
    "#686868": "#1C1C1C",
    "#9D2133": "#5A0F18",
    "#C4D9A3": "#1B2319",
    "#7EA7D5": "#12304A",
    "#CCCCCC": "#1E1E1E",
    "#FFD37F": "#493017",
    "#FFB012": "#472801",
    "#E2E0E2": "#242324",
    "#DCDBDD": "#212021",
    "#A0E8FF": "#1A3A56",
    "#8D8E8D": "#1A1A1A",
    "rgba(240,240,240,0)": "rgba(18,18,18,0)",
};

const lightModeColors = {
    "#CCEDFF": "#EAF8FF",
    "#FFFFFF": "#FFFFFF",
    "#CCECFF": "#EAF7FF",
    "#F4F7E8": "#FAFBF3",
    "#F3F5E6": "#FAFAF2",
    "#EDF0DF": "#F7F9F0",
    "#E7EBD5": "#F5F7EB",
    "#E1E6CC": "#F3F6E8",
    "#E2E3E4": "#F9F9F9",
    "#DEE3C5": "#F2F6E6",
    "#D8DEBF": "#F0F5E3",
    "#D2D9B6": "#EEF3E0",
    "#CBD4AE": "#ECF2DD",
    "#C7D1A7": "#EBF1DB",
    "#FFE1A9": "#FFF3DC",
    "#FED591": "#FFE9C8",
    "#DEE3F5": "#F2F5FB",
    "#9C9C9C": "#E6E6E6",
    "#C4D9AD": "#EDF6E5",
    "#CEE3C1": "#F0F8EB",
    "#BBD4EE": "#E6F2FB",
    "#97BDDB": "#D9ECF8",
    "#9CCBEC": "#DAF0FB",
    "#D9E0C8": "#F1F5E9",
    "#C7C8B1": "#E8E9DD",
    "#D2D7EB": "#EDF0FA",
    "#FEFEFE": "#FFFFFF",
    "#C8CDE1": "#E9ECF7",
    "#E2F7D5": "#F5FDF0",
    "#91D1EB": "#D6F0FA",
    "#B2B2B2": "#E8E8E8",
    "#E1E1E1": "#F7F7F7",
    "#D2D3D4": "#ECEDED",
    "#A89A77": "#E8E2D2",
    "#BCAE8B": "#F0E8D6",
    "#B8B8B8": "#EAEAEA",
    "#79B5E0": "#D2EBFA",
    "#C7C9CB": "#ECEDEE",
    "#646464": "#DADADA",
    "#D6D6D6": "#F2F2F2",
    "#686868": "#DBDBDB",
    "#9D2133": "#F5B8C0",
    "#C4D9A3": "#EDF6E3",
    "#7EA7D5": "#D6E6F7",
    "#CCCCCC": "#F0F0F0",
    "#FFD37F": "#121212",
    "#FFB012": "#121212",
    "#E2E0E2": "#F9F8F9",
    "#DCDBDD": "#F7F6F7",
    "#A0E8FF": "#E0F9FF",
    "#8D8E8D": "#E8E8E8",
    "rgba(240,240,240,0)": "rgba(255,255,255,0)"
};



const isBasemapDarkMode = (basemapMode) => {
    const prefersDarkMode = typeof window !== 'undefined'
        && window.matchMedia
        && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return basemapMode === 'dark';
};

const normalizeBasemapStyle = (styleData, basemapMode) => {
    const style = JSON.parse(JSON.stringify(styleData));
    const isDarkMode = isBasemapDarkMode(basemapMode);
    const theme = isDarkMode ? darkModeColors : lightModeColors;
    const layers = Array.isArray(style.layers) ? style.layers : [];

    const matchesAny = (value, patterns) => patterns.some((pattern) => pattern.test(value));

    const remapThemeColors = (value) => {
        if (Array.isArray(value)) return value.map(remapThemeColors);
        if (typeof value === 'string') return theme[value] || value;
        return value;
    };

    const mapLayerPaint = (layer) => {
        const layerKey = `${layer.id || ''} ${layer['source-layer'] || ''}`.toLowerCase();
        const paint = layer.paint ? { ...layer.paint } : {};


        if ('fill-pattern' in paint) {
            delete paint['fill-pattern'];
        }

        // if (layer.type === 'background') {
        //     paint['background-color'] = theme.background;
        // }

        Object.keys(paint).forEach(property => {
            if (property.endsWith('-color') || property === 'fill-pattern') {
                paint[property] = remapThemeColors(paint[property]);
            }
        });

        layer.paint = paint;
    };

    layers.forEach(mapLayerPaint);

    if (!layers.some((layer) => layer.type === 'background')) {
        style.layers = [
            {
                id: 'plain-basemap-background',
                type: 'background',
                paint: { 'background-color': theme['#FFFFFF'] }
            },
            ...layers
        ];
    }

    return style;
};

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export default function Map() {
    const { locale, t } = useI18n();
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const isInitializingRef = useRef(false);
    const markersRef = useRef({});
    const abortControllers = useRef({});
    const popupsRef = useRef([]);

    const [activeLayers, setActiveLayers] = useState(new Set());
    const activeLayersRef = useRef(activeLayers);
    const [mapMessage, setMapMessage] = useState(t('Initializing map...'));
    const [pendingFetches, setPendingFetches] = useState(0);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [showInfoOverlay, setShowInfoOverlay] = useState(false);
    const [showLegend, setShowLegend] = useState(false);
    const [openLegendSubmenu, setOpenLegendSubmenu] = useState(null);
    const [basemapStyleMode, setBasemapStyleMode] = useState(null);
    const [showBasemapSelector, setShowBasemapSelector] = useState(false);
    const [showLabels, setShowLabels] = useState(true);
    const [showRawPoints, setShowRawPoints] = useState(false);
    const [showTsAbvSymbols, setShowTsAbvSymbols] = useState(false);
    const [tsAbvSymbolScale, setTsAbvSymbolScale] = useState(5);
    const [geolocInProgress, setGeolocInProgress] = useState(false);
    const showRawPointsRef = useRef(showRawPoints);
    const showTsAbvSymbolsRef = useRef(showTsAbvSymbols);
    const [mvtBuildDate, setMvtBuildDate] = useState('');
    const mvtBuildDateRef = useRef(mvtBuildDate);
    const [mvtManifestReady, setMvtManifestReady] = useState(false);
    const mvtManifestReadyRef = useRef(mvtManifestReady);
    const [availableBuilds, setAvailableBuilds] = useState([]);
    const [selectedBuildDate, setSelectedBuildDate] = useState('');
    const [elevationFilter, setElevationFilter] = useState('ALL');
    const elevationFilterRef = useRef(elevationFilter);
    const layerDataRef = useRef({});
    const [crsInput, setCrsInput] = useState('EPSG:4326');
    const [coordInput, setCoordInput] = useState('114.1694,22.3193');
    const [panError, setPanError] = useState('');
    const [cursorCoordsHK, setCursorCoordsHK] = useState(null);
    const isLocalDataSource = typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_DATA_SOURCE === 'local';
    const dataLoadMinZoom = isLocalDataSource ? 16 : 18;
    const isDarkMode = isBasemapDarkMode(basemapStyleMode);
    const legendEntries = Object.entries(layerLegendDict).filter(([layerName, entry]) => {
        return entry?.showInLegend && activeLayers.has(layerName);
    });

    const renderLegendSwatch = (entry, options = {}) => {
        const compact = options.compact === true;

        if (entry.kind === 'icon' && entry.previewSvg) {
            return (
                <span className={compact ? 'map-legend-icon map-legend-icon--compact' : 'map-legend-icon'}>
                    <span
                        className={compact ? 'map-legend-icon-svg map-legend-icon-svg--compact' : 'map-legend-icon-svg'}
                        aria-hidden="true"
                        dangerouslySetInnerHTML={{ __html: entry.previewSvg }}
                    />
                </span>
            );
        }

        return (
            <span className={compact ? 'map-legend-line map-legend-line--compact' : 'map-legend-line'} aria-hidden="true">
                <svg viewBox="0 0 80 24" preserveAspectRatio="none" role="presentation">
                    <line
                        x1="4"
                        y1="12"
                        x2="76"
                        y2="12"
                        stroke={entry.color || '#111111'}
                        strokeWidth={entry.width || 3}
                        strokeLinecap="round"
                        strokeDasharray={entry.dashArray || undefined}
                    />
                </svg>
            </span>
        );
    };

    const renderLegendSubmenuItems = (entry) => {
        if (!Array.isArray(entry.subLegend) || entry.subLegend.length === 0) return null;

        return (
            <div className="map-legend-submenu-list">
                {entry.subLegend.map((subEntry) => (
                    <div className="map-legend-submenu-item" key={subEntry.key || subEntry.label}>
                        {renderLegendSwatch(subEntry, { compact: true })}
                        <div className="map-legend-text">
                            <strong>{t(subEntry.label || subEntry.key)}</strong>
                            <span>{subEntry.key || subEntry.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const ensureEpsg2326Definition = () => {
        proj4.defs('EPSG:2326', EPSG_2326_DEF);
    };

    const convertEpsg2326ToWgs84 = (x, y) => {
        ensureEpsg2326Definition();
        return proj4('EPSG:2326', 'WGS84', [x, y]);
    };

    const syncBasemapLabels = useCallback((map, forceShowLabels) => {
        if (!map) return;

        const lang = locale === 'zh' ? 'tc' : 'en';
        const labelTiles = [
            `https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/label/hk/${lang}/WGS84/{z}/{x}/{y}.png`
        ];

        if (map.getLayer(BASEMAP_LABEL_LAYER_ID)) {
            map.removeLayer(BASEMAP_LABEL_LAYER_ID);
        }
        if (map.getSource(BASEMAP_LABEL_SOURCE_ID)) {
            map.removeSource(BASEMAP_LABEL_SOURCE_ID);
        }

        const shouldShow = forceShowLabels !== undefined ? forceShowLabels : showLabels;
        if (!shouldShow) return;
        map.addSource(BASEMAP_LABEL_SOURCE_ID, {
            type: 'raster',
            tiles: labelTiles,
            tileSize: 256,
            minzoom: 0,
            maxzoom: 22,
        });

        map.addLayer({
            id: BASEMAP_LABEL_LAYER_ID,
            type: 'raster',
            source: BASEMAP_LABEL_SOURCE_ID,
            paint: {
                'raster-opacity': 1,
            },
        });
    }, [locale, showLabels]);

    useEffect(() => {
        activeLayersRef.current = activeLayers;
    }, [activeLayers]);

    useEffect(() => {
        showRawPointsRef.current = showRawPoints;
    }, [showRawPoints]);

    useEffect(() => {
        showTsAbvSymbolsRef.current = showTsAbvSymbols;
    }, [showTsAbvSymbols]);

    useEffect(() => {
        if (mapContainerRef.current) {
            mapContainerRef.current.style.setProperty('--ts-abv-symbol-scale', tsAbvSymbolScale);
        }
    }, [mapLoaded, tsAbvSymbolScale]);

    useEffect(() => {
        mvtBuildDateRef.current = mvtBuildDate;
    }, [mvtBuildDate]);

    useEffect(() => {
        mvtManifestReadyRef.current = mvtManifestReady;
    }, [mvtManifestReady]);

    useEffect(() => {
        elevationFilterRef.current = elevationFilter;
    }, [elevationFilter]);

    useEffect(() => {
        let cancelled = false;

        fetch('/api/mvt-manifest')
            .then(res => (res.ok ? res.json() : null))
            .then(manifest => {
                if (cancelled || !manifest) return;
                const latestBuildDate = manifest.latestBuildDate || '';
                setMvtBuildDate(latestBuildDate);
                setSelectedBuildDate(latestBuildDate);
                if (manifest.builds) {
                    setAvailableBuilds(manifest.builds);
                }
            })
            .catch(err => console.warn('Failed to load MVT manifest:', err))
            .finally(() => {
                if (!cancelled) setMvtManifestReady(true);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        try {
            const savedState = localStorage.getItem('mapState');
            if (savedState) {
                const state = JSON.parse(savedState);
                if (typeof state.showRawPoints === 'boolean') setShowRawPoints(state.showRawPoints);
                if (typeof state.showTsAbvSymbols === 'boolean') setShowTsAbvSymbols(state.showTsAbvSymbols);
                if (typeof state.tsAbvSymbolScale === 'number') setTsAbvSymbolScale(Math.min(2, Math.max(0.5, state.tsAbvSymbolScale)));
                if (typeof state.elevationFilter === 'string') setElevationFilter(state.elevationFilter);
                if (typeof state.basemapStyleMode === 'string') setBasemapStyleMode(state.basemapStyleMode);
                if (typeof state.showLabels === 'boolean') setShowLabels(state.showLabels);
                else setBasemapStyleMode('default');
            } else {
                setBasemapStyleMode('default');
            }
        } catch (e) {
            setBasemapStyleMode('default');
        }
    }, []);

    useEffect(() => {
        if (!mapLoaded || !mapInstanceRef.current) return;

        const params = new URLSearchParams(window.location.search);
        const x = params.get('x');
        const y = params.get('y');

        if (x && y) {
            try {
                const [lng, lat] = convertEpsg2326ToWgs84(parseFloat(x), parseFloat(y));
                const z = params.get('z');
                const targetZoom = z ? Math.min(parseFloat(z), 22) : 18;

                mapInstanceRef.current.flyTo({
                    center: [lng, lat],
                    zoom: targetZoom,
                    essential: true
                });
            } catch (err) {
                console.error('Failed to center map to EPSG:2326 coordinates:', err);
            }
        }
    }, [mapLoaded]);

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
        if (basemapStyleMode === null) return;
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

                const themedStyle = basemapStyleMode === 'default'
                    ? styleData
                    : normalizeBasemapStyle(styleData, basemapStyleMode);

                if (!mapContainerRef.current) return;

                const map = new maplibregl.Map({
                    container: mapContainerRef.current,
                    style: themedStyle,
                    center: initialCenter,
                    zoom: initialZoom,
                    maxZoom: 22,
                    maxBounds: [[113.60, 22.00], [114.70, 22.80]], // Looser Hong Kong bounds [minLng, minLat], [maxLng, maxLat]
                    attributionControl: false,
                    pitchWithRotate: false,
                    dragPitch: false
                });

                map.addControl(new maplibregl.AttributionControl({ customAttribution: 'Map information from Lands Department' }), 'bottom-right');
                // Add a single navigation control
                map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true, visualizePitch: true }), 'top-right');
                map.addControl(new maplibregl.ScaleControl({ maxWidth: 200, unit: 'metric' }), 'bottom-right');

                map.on('mousemove', (e) => {
                    try {
                        ensureEpsg2326Definition();
                        const [x, y] = proj4('WGS84', 'EPSG:2326', [e.lngLat.lng, e.lngLat.lat]);
                        setCursorCoordsHK({ x: x.toFixed(2), y: y.toFixed(2) });
                    } catch (err) { }
                });

                map.on('load', () => {
                    mapInstanceRef.current = map;
                    setMapLoaded(true);
                    if (showLabels) {
                        syncBasemapLabels(map);
                    }
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

                    if (zoom < dataLoadMinZoom) {
                        setMapMessage(t('Zoom in to level {{zoom}}+ to load data').replace('{{zoom}}', dataLoadMinZoom));
                    } else {
                        setMapMessage(''); // Let the render handle Data Active / Data Loading display
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
                        showRawPoints: showRawPointsRef.current,
                        elevationFilter: elevationFilterRef.current
                    }));

                    if (map.getZoom() >= dataLoadMinZoom && mvtManifestReadyRef.current) {
                        Array.from(activeLayersRef.current).forEach(layer => {
                            setPendingFetches(prev => prev + 1);
                            loadLayerData(layer, {
                                map: mapInstanceRef.current,
                                abortControllers,
                                markersRef,
                                activeLayersRef,
                                showRawPoints: showRawPointsRef.current,
                                elevationFilter: elevationFilterRef.current,
                                buildDate: mvtBuildDateRef.current,
                            })?.then((data) => {
                                if (data) {
                                    layerDataRef.current[layer] = data;
                                    if (mapInstanceRef.current && activeLayersRef.current.has(layer)) {
                                        renderLayerData(layer, data, {
                                            map: mapInstanceRef.current,
                                            markersRef,
                                            activeLayersRef,
                                            showRawPoints: showRawPointsRef.current,
                                            showTsAbvSymbols: showTsAbvSymbolsRef.current,
                                            elevationFilter: elevationFilterRef.current,
                                            layerDataRef,
                                            isDarkMode: isDarkMode,
                                        });
                                        applyVisibilityOverlays({ map: mapInstanceRef.current, activeLayers: activeLayersRef.current, markersRef });
                                    }
                                }
                            })?.finally(() => setPendingFetches(prev => Math.max(0, prev - 1)));
                        });
                    }
                });

                map.on('click', (e) => {
                    if (window.isMeasuringActive) return;
                    // Intersect Line/Polygon clicks
                    const features = map.queryRenderedFeatures(e.point);
                    const clickableGeoJSONs = features.filter(f => f.source && f.source.startsWith('csdi:'));

                    if (clickableGeoJSONs.length > 0) {
                        const feature = clickableGeoJSONs.find(f => !f.source.includes('-raw-') && !f.source.includes('-icon-lines')) || clickableGeoJSONs[0];
                        if (feature.geometry?.type === 'LineString' || feature.geometry?.type === 'MultiLineString') {
                            const typeName = feature.source;
                            setRawLineSelection(
                                map,
                                typeName,
                                feature.properties?._rawFeatureId,
                                showRawPointsRef.current
                            );
                        }
                        let label = feature.source.replace('csdi:DTAD_', '').replace(/_/g, ' ');
                        const refname = feature.properties?.REFNAME;
                        const previewHtml = feature.source.includes('TRAFFIC_LIGHT') && refname
                            ? buildTrafficLightPreviewHtmlForRefname(refname)
                            : '';
                        let popupContent = `<b>${label}</b><br><div class="popup-content">`;
                        if (previewHtml) {
                            popupContent = `${previewHtml}${popupContent}`;
                        }
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
            isInitializingRef.current = false;
            setMapLoaded(false);
        };
    }, [basemapStyleMode]);

    useEffect(() => {
        if (!mapLoaded || !mapInstanceRef.current) return;
        if (showLabels) {
            syncBasemapLabels(mapInstanceRef.current);
        }
    }, [mapLoaded, syncBasemapLabels, showLabels]);

    const fetchLayerData = useCallback((typeName) => {
        setPendingFetches(prev => prev + 1);
        loadLayerData(typeName, {
            map: mapInstanceRef.current,
            abortControllers,
            markersRef,
            activeLayersRef,
            showRawPoints: showRawPointsRef.current,
            elevationFilter: elevationFilterRef.current,
            buildDate: mvtBuildDateRef.current,
        })?.then((data) => {
            if (data) {
                layerDataRef.current[typeName] = data;
                if (mapInstanceRef.current && activeLayersRef.current.has(typeName)) {
                    renderLayerData(typeName, data, {
                        map: mapInstanceRef.current,
                        markersRef,
                        activeLayersRef,
                        showRawPoints: showRawPointsRef.current,
                        showTsAbvSymbols: showTsAbvSymbolsRef.current,
                        elevationFilter: elevationFilterRef.current,
                        layerDataRef,
                        isDarkMode: isDarkMode,
                    });
                    applyVisibilityOverlays({ map: mapInstanceRef.current, activeLayers: activeLayersRef.current, markersRef });
                }
            }
        })?.finally(() => setPendingFetches(prev => Math.max(0, prev - 1)));
    }, []);

    const prefetchLayerData = useCallback((typeName) => {
        if (!mapInstanceRef.current) return;
        if (layerDataRef.current[typeName]) return;

        loadLayerData(typeName, {
            map: mapInstanceRef.current,
            abortControllers,
            markersRef,
            activeLayersRef,
            showRawPoints: showRawPointsRef.current,
            elevationFilter: elevationFilterRef.current,
            buildDate: mvtBuildDateRef.current,
        })?.then((data) => {
            if (data) {
                layerDataRef.current[typeName] = data;
            }
        });
    }, []);

    const rerenderCachedLayers = useCallback(() => {
        if (!mapLoaded || !mapInstanceRef.current) return;

        const map = mapInstanceRef.current;
        Object.values(layersConfig).flat().forEach(typeName => {
            if (!activeLayersRef.current.has(typeName)) return;
            const data = layerDataRef.current[typeName];
            if (!data) return;

            renderLayerData(typeName, data, {
                map,
                markersRef,
                activeLayersRef,
                showRawPoints: showRawPointsRef.current,
                showTsAbvSymbols: showTsAbvSymbolsRef.current,
                elevationFilter: elevationFilterRef.current,
                layerDataRef,
                isDarkMode: isDarkMode,
            });
        });

        applyVisibilityOverlays({ map, activeLayers: activeLayersRef.current, markersRef });
    }, [mapLoaded]);

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

    const recenterHK = () => {
        if (!mapInstanceRef.current) return;
        // Default Hong Kong center (preserve current zoom)
        const hkCenter = [114.1694, 22.3193];
        try {
            mapInstanceRef.current.jumpTo({ center: hkCenter });
        } catch (e) {
            console.warn('Failed to recenter map:', e);
        }
    };

    const handleSearchLocationSelect = (location) => {
        if (!mapInstanceRef.current || !location) return;

        const x = Number(location.x);
        const y = Number(location.y);

        if (Number.isNaN(x) || Number.isNaN(y)) {
            setPanError(t('Invalid location coordinates'));
            return;
        }

        try {
            const [longitude, latitude] = convertEpsg2326ToWgs84(x, y);
            setPanError('');
            setCrsInput('EPSG:4326');
            setCoordInput(`${longitude.toFixed(6)},${latitude.toFixed(6)}`);

            const map = mapInstanceRef.current;
            const targetZoom = Math.max(map.getZoom(), 16);
            map.easeTo({ center: [longitude, latitude], zoom: targetZoom });
        } catch (error) {
            setPanError(error.message || t('Failed to center map'));
        }
    };

    const panToMyLocation = () => {
        if (!mapInstanceRef.current) {
            setMapMessage(t('Map not ready'));
            return;
        }
        if (!('geolocation' in navigator)) {
            setMapMessage(t('Geolocation not supported'));
            return;
        }

        setGeolocInProgress(true);
        setMapMessage(t('Locating...'));

        navigator.geolocation.getCurrentPosition((pos) => {
            try {
                const { latitude, longitude } = pos.coords;
                const map = mapInstanceRef.current;
                const targetZoom = Math.max(map.getZoom(), 16);
                map.easeTo({ center: [longitude, latitude], zoom: targetZoom });
                setMapMessage('');
            } catch (err) {
                console.error('Error centering map to GPS:', err);
                setMapMessage(t('Failed to center to GPS'));
            } finally {
                setGeolocInProgress(false);
            }
        }, (err) => {
            console.warn('Geolocation error:', err);
            setMapMessage(err.message || t('Geolocation error'));
            setGeolocInProgress(false);
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    };

    // Apply Visibility Overlays
    useEffect(() => {
        if (!mapLoaded || !mapInstanceRef.current || !mvtManifestReady) return;
        const map = mapInstanceRef.current;
        localStorage.setItem('mapState', JSON.stringify({
            center: map.getCenter(),
            zoom: map.getZoom(),
            activeLayers: Array.from(activeLayers),
            showRawPoints,
            showTsAbvSymbols,
            tsAbvSymbolScale,
            elevationFilter,
            basemapStyleMode,
            showLabels
        }));

        Object.values(layersConfig).flat().forEach(typeName => {
            const isActive = activeLayers.has(typeName);

            // Fetch missing data if activated or force refetch to apply raw points visibility
            if (isActive) {
                const hasCachedData = !!layerDataRef.current[typeName];
                if (!hasCachedData) {
                    // Only fetch data when zoom threshold is met for data loading
                    if (map.getZoom() >= dataLoadMinZoom) {
                        fetchLayerData(typeName);
                    }
                }

                if (typeName === 'csdi:DTAD_TS_POLE_PT') {
                    prefetchLayerData('csdi:DTAD_TS_ABV_PT');
                }
            }
        });

        applyVisibilityOverlays({ map, activeLayers, markersRef });

    }, [activeLayers, mapLoaded, fetchLayerData, prefetchLayerData, showRawPoints, showTsAbvSymbols, mvtBuildDate, mvtManifestReady, basemapStyleMode]);

    useEffect(() => {
        rerenderCachedLayers();
    }, [elevationFilter, showRawPoints, showTsAbvSymbols, rerenderCachedLayers]);

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

    const toggleAllLayers = (targetState) => {
        setActiveLayers(prev => {
            const next = new Set(prev);
            const allLayers = Object.values(layersConfig).flat();
            allLayers.forEach(layer => {
                if (targetState) next.add(layer);
                else next.delete(layer);
            });
            return next;
        });
    };

    const changeElevationFilter = (value) => {
        setElevationFilter(value);
    }

    const handleSelectBuild = (date) => {
        setSelectedBuildDate(date);
        setMvtBuildDate(date);
        mvtBuildDateRef.current = date;
        
        // Clear existing layer data and markers to force reload
        layerDataRef.current = {};
        Object.values(markersRef.current).forEach(marker => marker.remove());
        markersRef.current = {};
        
        // Trigger a map move or zoom to fire the 'moveend' event and reload data
        if (mapInstanceRef.current) {
            const center = mapInstanceRef.current.getCenter();
            const zoom = mapInstanceRef.current.getZoom();
            mapInstanceRef.current.jumpTo({ center, zoom });
        }
    };

    return (
        <div className="map-root" style={{ width: '100%', height: '100%' }}>
            <Navbar />
            <div className="map-layout">
                <MapSidebar
                    headerTitle={t('Traffic Aids Map')}
                    activeLayers={activeLayers}
                    onToggleLayer={toggleLayer}
                    onToggleGroup={toggleGroup}
                    onToggleAllLayers={toggleAllLayers}
                    elevationFilter={elevationFilter}
                    onChangeElevationFilter={changeElevationFilter}
                    showRawPoints={showRawPoints}
                    onToggleShowRawPoints={(val) => setShowRawPoints(val)}
                    crsInput={crsInput}
                    setCrsInput={setCrsInput}
                    coordInput={coordInput}
                    setCoordInput={setCoordInput}
                    onPanTo={handlePanTo}
                    onRecenter={recenterHK}
                    onSearchLocationSelect={handleSearchLocationSelect}
                    panError={panError}
                    availableBuilds={availableBuilds}
                    selectedBuildDate={selectedBuildDate}
                    onSelectBuild={handleSelectBuild}
                />

                <main className="map-main">
                    <div ref={mapContainerRef} className="map-container" />
                    <div
                        className={`map-legend-toggle-group${showTsAbvSymbols ? ' map-legend-toggle-group--ts-symbols' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setShowLegend(prev => !prev); }}
                    >
                        <button
                            type="button"
                            className={showLegend ? 'map-legend-toggle-button map-legend-toggle-button--active' : 'map-legend-toggle-button'}
                            title={t('Legend')}
                            aria-label={t('Legend')}
                        >
                            <span style={{ fontSize: '18px', lineHeight: 1 }}>≡</span>
                        </button>
                    </div>
                    <div className={`map-basemap-toggle-group${showTsAbvSymbols ? ' map-basemap-toggle-group--ts-symbols' : ''}`}>
                        <button
                            type="button"
                            className={showBasemapSelector ? 'map-basemap-toggle-button map-basemap-toggle-button--active' : 'map-basemap-toggle-button'}
                            title={t('Basemap style')}
                            aria-label={t('Basemap style')}
                            onClick={(e) => { e.stopPropagation(); setShowBasemapSelector(prev => !prev); }}
                        >
                            <span style={{ fontSize: '14px', lineHeight: 1 }}>◫</span>
                        </button>
                        {showBasemapSelector && (
                            <div className="map-basemap-selector-panel" role="menu" aria-label={t('Basemap style options')}>
                                {[
                                    ['default', t('Default')],
                                    ['light', t('Light')],
                                    ['dark', t('Dark')]
                                ].map(([mode, label]) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        className={basemapStyleMode === mode ? 'map-basemap-selector-item map-basemap-selector-item--active' : 'map-basemap-selector-item'}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setBasemapStyleMode(mode);
                                            setShowBasemapSelector(false);
                                        }}
                                    >
                                        <span>{label}</span>
                                        {basemapStyleMode === mode ? <span aria-hidden="true">✓</span> : null}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="map-label-toggle-group">
                        <select
                            className="map-label-toggle"
                            value={showLabels ? 'show' : 'hide'}
                            onChange={(e) => {
                                e.stopPropagation();
                                const newValue = e.target.value === 'show';
                                setShowLabels(newValue);
                                syncBasemapLabels(mapInstanceRef.current, newValue);
                            }}
                        >
                            <option value="show">{t('Show labels')}</option>
                            <option value="hide">{t('Hide labels')}</option>
                        </select>
                        <label className="map-ts-symbol-switch">
                            <input
                                type="checkbox"
                                checked={showTsAbvSymbols}
                                onChange={(e) => setShowTsAbvSymbols(e.target.checked)}
                            />
                            <span className="map-ts-symbol-switch-track" aria-hidden="true"><span /></span>
                            <span>{t('TS symbols')}</span>
                        </label>
                        {showTsAbvSymbols && (
                            <label className="map-ts-symbol-size">
                                <span>{t('Symbol size')}</span>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="10"
                                    step="0.1"
                                    value={tsAbvSymbolScale}
                                    onChange={(e) => setTsAbvSymbolScale(Number(e.target.value))}
                                    aria-label={t('TS symbol size')}
                                />
                                <output>{Math.round(tsAbvSymbolScale)}</output>
                            </label>
                        )}
                    </div>

                    <div className="map-right-toolbar">
                        <ShareTool
                            map={mapInstanceRef.current}
                            t={t}
                        />
                        <MeasureTool
                            map={mapInstanceRef.current}
                        />
                    </div>

                    <div className="info legend map-info-legend" style={{
                        position: 'absolute', bottom: '20px', left: '10px',
                        background: 'white', padding: '5px 10px', border: '1px solid #ccc',
                        zIndex: 10, color: (mapMessage.includes('Zoom in') || mapMessage.includes('縮放')) ? 'red' : 'green',
                        borderRadius: '4px', fontSize: '13px', pointerEvents: 'none',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                        {mapMessage ? (
                            mapMessage
                        ) : pendingFetches > 0 ? (
                            <>
                                <span className="spinner" style={{
                                    width: '12px', height: '12px', border: '2px solid #ccc',
                                    borderTopColor: '#333', borderRadius: '50%', animation: 'spin 1s linear infinite'
                                }} />
                                <span>{t('Data loading...')}</span>
                            </>
                        ) : (
                            <span>{t('Data active')}</span>
                        )}
                    </div>
                    {cursorCoordsHK && (
                        <div className="coord-show-box" style={{
                            position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                            background: 'rgba(255,255,255,0.9)', padding: '4px 10px', border: '1px solid #ddd',
                            zIndex: 10, fontSize: '13px', borderRadius: '4px', pointerEvents: 'none',
                            fontFamily: 'monospace', color: '#333', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}>
                            EPSG:2326  E: {cursorCoordsHK.x}  N: {cursorCoordsHK.y}
                        </div>
                    )}

                    <div
                        className="map-geolocate-btn"
                        onClick={(e) => { e.stopPropagation(); panToMyLocation(); }}
                        style={{
                            position: 'absolute', bottom: '120px', right: '10px',
                            width: '32px', height: '32px', background: 'white',
                            borderRadius: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            cursor: 'pointer', zIndex: 11, fontSize: '16px', color: '#333'
                        }}
                        title={t('Center map on my GPS location')}
                    >
                        {geolocInProgress ? (
                            <span style={{ width: '16px', height: '16px', border: '2px solid #ccc', borderTopColor: '#333', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                        ) : (
                            <span style={{ fontSize: '18px' }}>📍</span>
                        )}
                    </div>

                    {showLegend && (
                        <div className="map-legend-stack">
                            <div className="map-legend-panel">
                                <div className="map-legend-header">
                                    <h3>{t('Layer Legend')}</h3>
                                    <button type="button" onClick={() => setShowLegend(false)} aria-label={t('Close legend')}>
                                        &times;
                                    </button>
                                </div>
                                <div className="map-legend-list">
                                    {legendEntries.length > 0 ? legendEntries.map(([layerName, entry]) => {
                                        const hasSubLegend = Array.isArray(entry.subLegend) && entry.subLegend.length > 0;
                                        const isSubLegendOpen = openLegendSubmenu === layerName;

                                        return (
                                            <div className={hasSubLegend ? 'map-legend-item map-legend-item--with-submenu' : 'map-legend-item'} key={layerName}>
                                                <div className="map-legend-item-main">
                                                    {renderLegendSwatch(entry)}
                                                    <div className="map-legend-text">
                                                        <strong>{t(entry.label || layerName)}</strong>
                                                        <span>{layerName.replace('csdi:', '').replace('DTAD_', '').replace(/_/g, ' ')}</span>
                                                    </div>
                                                </div>
                                                {hasSubLegend ? (
                                                    <div className="map-legend-submenu-shell">
                                                        <button
                                                            type="button"
                                                            className="map-legend-submenu-button"
                                                            onClick={() => setOpenLegendSubmenu(prev => (prev === layerName ? null : layerName))}
                                                            aria-expanded={isSubLegendOpen}
                                                            aria-controls={`legend-submenu-${layerName}`}
                                                        >
                                                            <span>{t(isSubLegendOpen ? 'Show less' : 'Show more')}</span>
                                                            <span className={isSubLegendOpen ? 'map-legend-submenu-arrow map-legend-submenu-arrow--open' : 'map-legend-submenu-arrow'} aria-hidden="true">▾</span>
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </div>
                                        );
                                    }) : (
                                        <div className="map-legend-empty">{t('No legend items are configured for the active layers.')}</div>
                                    )}
                                </div>
                            </div>

                            {openLegendSubmenu && layerLegendDict[openLegendSubmenu]?.subLegend?.length ? (
                                <div className="map-legend-side-panel" id={`legend-submenu-${openLegendSubmenu}`}>
                                    <div className="map-legend-side-panel-header">
                                        <h3>{t(layerLegendDict[openLegendSubmenu].subLegendLabel || 'Variants')}</h3>
                                    </div>
                                    {renderLegendSubmenuItems(layerLegendDict[openLegendSubmenu])}
                                </div>
                            ) : null}
                        </div>
                    )}

                    <div
                        className="map-info-btn"
                        onClick={(e) => { e.stopPropagation(); setShowInfoOverlay(true); }}
                        style={{
                            position: 'absolute', bottom: '80px', right: '10px',
                            width: '29px', height: '29px', background: 'white',
                            borderRadius: '4px', boxShadow: '0 0 0 2px rgba(0,0,0,0.1)',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            cursor: 'pointer', zIndex: 10, fontWeight: 'bold', fontFamily: 'serif',
                            fontSize: '16px', color: '#333'
                        }}
                        title={t('About Map Data')}
                    >
                        i
                    </div>

                    {showInfoOverlay && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
                            justifyContent: 'center', alignItems: 'center'
                        }}>
                            <div style={{
                                background: 'white', padding: '20px 30px', borderRadius: '8px',
                                maxWidth: '500px', width: '90%', maxHeight: '90%', overflowY: 'auto',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)', position: 'relative'
                            }}>
                                <button
                                    onClick={() => setShowInfoOverlay(false)}
                                    style={{
                                        position: 'absolute', top: '15px', right: '15px',
                                        background: 'none', border: 'none', fontSize: '20px',
                                        cursor: 'pointer', color: '#555'
                                    }}
                                >
                                    &times;
                                </button>
                                <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>{t('Map Information & Open Data')}</h3>

                                <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#444' }}>
                                    {t('Map open data intro')}
                                </p>
                                <ul style={{ fontSize: '14px', lineHeight: '1.5', color: '#444', paddingLeft: '20px' }}>
                                    <li style={{ marginBottom: '8px' }}>
                                        <strong>{t('Base Map & Vector Map Styles')}:</strong> {t('Lands Department Open Map Data (GeoData Store API).')}
                                    </li>
                                    <li style={{ marginBottom: '8px' }}>
                                        <strong>{t('Traffic Signs & Road Markings')}:</strong> {t('Transport Department (via CSDI Portal).')}
                                    </li>
                                </ul>

                                <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

                                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{t('Disclaimer & Legal Notice')}</h4>
                                <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#666', textAlign: 'justify' }}>
                                    {t('Map disclaimer paragraph 1')} <br /><br />
                                    <strong>{t('No Warranty of Accuracy:')}</strong> {t('Map disclaimer paragraph 2')}<br /><br />
                                    <strong>{t('Limitation of Liability:')}</strong> {t('Map disclaimer paragraph 3')}
                                </p>
                                <div style={{ marginTop: '14px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{t('Contact Us')}</h4>
                                    <p style={{ fontSize: '13px', color: '#444', margin: 0 }}>
                                        <a href="mailto:enquiry@roadsignfactory.hk" aria-label="Email" style={{ color: '#0d6efd', textDecoration: 'none' }}>enquiry@roadsignfactory.hk</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
``