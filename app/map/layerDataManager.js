import { fetchWithRetry } from './mapUtils';
import { layersConfig } from './layerConfig';
import { renderLines } from './rendererLine';
import { renderPoints } from './rendererPoint';
import { renderRdMarkPoints } from './rendererRdMarkPoint';
import { renderTsPolePt } from './rendererTsPolePt';
import { renderTsAbvPt } from './rendererTsAbvPt';
import { renderDsPolePt } from './rendererDsPolePt';
import { renderTrafficLightPt } from './rendererTrafficLightPt';
import { renderAnno } from './rendererAnno';
import { renderYlBoxPoly } from './rendererYlBoxPoly';

// Renderer dispatch maps allow easy extension by typeName
const pointRenderers = {
    'csdi:DTAD_RD_MARK_SYM_PT': renderRdMarkPoints,
    'csdi:DTAD_TS_POLE_PT': renderTsPolePt,
    'csdi:DTAD_TS_ABV_PT': renderTsAbvPt,
    'csdi:DTAD_DS_POLE_PT': renderDsPolePt,
    'csdi:DTAD_TRAFFIC_LIGHT_PT': renderTrafficLightPt,
};

const annoRenderers = {
    'csdi:DTAD_RD_MARK_ANNO': renderAnno,
    'csdi:DTAD_TS_ABV_ANNO': renderAnno,
};

const polyRenderers = {
    'csdi:DTAD_YL_BOX_POLY': renderYlBoxPoly,
};

const getPointRenderer = (typeName) => pointRenderers[typeName] || renderPoints; // Default to generic point renderer if no specific one is found
const getAnnoRenderer = (typeName) => annoRenderers[typeName] || null;
const getPolyRenderer = (typeName) => polyRenderers[typeName] || null;

const normalizeElevationValue = (value) => {
    if (value === null || value === undefined || String(value).trim() === '') return 'AT-GRADE';
    return String(value).trim().toUpperCase();
};

const matchesElevationFilter = (feature, elevationFilter) => {
    if (!elevationFilter || elevationFilter === 'ALL') return true;
    return normalizeElevationValue(feature?.properties?.ELEVATION) === elevationFilter;
};

export const renderLayerData = (typeName, data, { map, markersRef, activeLayersRef, showRawPoints = false, showTsAbvSymbols = false, elevationFilter = 'ALL', layerDataRef = null, isDarkMode = false }) => {
    if (!data || !data.features || !map) return;

    const polyRenderer = getPolyRenderer(typeName);
    if (polyRenderer) {
        if (markersRef.current[typeName]) {
            markersRef.current[typeName].forEach(m => m.remove());
        }
        markersRef.current[typeName] = [];

        const filteredFeatures = data.features.filter(f => matchesElevationFilter(f, elevationFilter));
        polyRenderer(map, typeName, filteredFeatures, markersRef, activeLayersRef, showRawPoints, { layerDataRef, isDarkMode });
        return;
    }

    const isAnno = typeName.includes('ANNO');
    const nonPoints = [];
    const points = [];
    const annos = [];

    if (markersRef.current[typeName]) {
        markersRef.current[typeName].forEach(m => m.remove());
    }
    markersRef.current[typeName] = [];

    const filteredFeatures = data.features.filter(f => matchesElevationFilter(f, elevationFilter));

    filteredFeatures.forEach(f => {
        if (isAnno && f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon') {
            annos.push(f);
        } else if (f.geometry.type === 'Point' || f.geometry.type === 'MultiPoint') {
            points.push(f);
        } else {
            nonPoints.push(f);
        }
    });

    renderLines(map, typeName, nonPoints, markersRef, { isDarkMode, layerDataRef });

    const pointRenderer = getPointRenderer(typeName);
    if (pointRenderer) {
        pointRenderer(map, typeName, points, markersRef, activeLayersRef, showRawPoints, { layerDataRef, isDarkMode, showTsAbvSymbols });
    }

    const annoRenderer = getAnnoRenderer(typeName);
    if (annoRenderer && annos.length > 0) {
        annoRenderer(map, typeName, annos, markersRef, activeLayersRef, showRawPoints, { layerDataRef, isDarkMode });
    }
};

export const loadLayerData = (typeName, { map, abortControllers, markersRef, activeLayersRef, showRawPoints = false, elevationFilter = 'ALL', buildDate = '' }) => {
    if (!map || map.getZoom() < 16) return Promise.resolve();

    if (abortControllers.current[typeName]) {
        abortControllers.current[typeName].abort();
    }
    const controller = new AbortController();
    abortControllers.current[typeName] = controller;

    const bounds = map.getBounds();
    const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
    // WFS only supports zoom level 18 - force all requests to zoom 18
    const z = 18;
    const layerUrl = `/api/layers?typeName=${encodeURIComponent(typeName)}&bbox=${encodeURIComponent(bbox)}&format=pbf&z=${z}${buildDate ? `&buildDate=${encodeURIComponent(buildDate)}` : ''}`;

    return fetchWithRetry(layerUrl, { signal: controller.signal }, 2).then(data => {
        if (!data || !data.features || !map) return;
        return data;

    }).catch(err => {
        if (err.name !== 'AbortError') console.error(`Error loading ${typeName}:`, err);
    });
};

export const applyVisibilityOverlays = ({ map, activeLayers, markersRef }) => {
    Object.values(layersConfig).flat().forEach(typeName => {
        const isActive = activeLayers.has(typeName);
        const rawOutlineLayerId = `${typeName}-raw-perimeter-layer`;
        const rawLineLayerId = `${typeName}-raw-line-layer`;
        const iconLineSourceId = `${typeName}-icon-lines`;
        const iconLineLayerId = `${typeName}-icon-lines-layer`;
        const iconLineLayerLinesId = `${iconLineLayerId}-lines`;

        // Sync MapLibre layer visibility 
        if (map.getStyle()) {
            const layers = map.getStyle().layers;
            layers.forEach(l => {
                if (l.source === typeName) {
                    map.setLayoutProperty(l.id, 'visibility', isActive ? 'visible' : 'none');
                }
                if (l.source === iconLineSourceId) {
                    map.setLayoutProperty(l.id, 'visibility', isActive ? 'visible' : 'none');
                }
                if (l.id === rawOutlineLayerId) {
                    map.setLayoutProperty(l.id, 'visibility', isActive ? 'visible' : 'none');
                }
                if (l.id === rawLineLayerId) {
                    map.setLayoutProperty(l.id, 'visibility', isActive ? 'visible' : 'none');
                }
                if (l.id === iconLineLayerId || l.id === iconLineLayerLinesId) {
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
};
