import { fetchWithRetry } from './mapUtils';
import { layersConfig } from './layerConfig';
import { renderLines } from './rendererLine';
import { renderPoints } from './rendererPoint';
import { renderTsPolePt } from './rendererTsPolePt';
import { renderDsPolePt } from './rendererDsPolePt';
import { renderTrafficLightPt } from './rendererTrafficLightPt';
import { renderAnno } from './rendererAnno';

// Renderer dispatch maps allow easy extension by typeName
const pointRenderers = {
    'csdi:DTAD_TS_POLE_PT': renderTsPolePt,
    'csdi:DTAD_DS_POLE_PT': renderDsPolePt,
    'csdi:DTAD_TRAFFIC_LIGHT_PT': renderTrafficLightPt,
};

const annoRenderers = {
    'csdi:DTAD_RD_MARK_ANNO': renderAnno,
};

const getPointRenderer = (typeName) => pointRenderers[typeName] || renderPoints;
const getAnnoRenderer = (typeName) => annoRenderers[typeName] || null;

export const loadLayerData = (typeName, { map, abortControllers, markersRef, activeLayersRef, showRawPoints = false }) => {
    if (!map || map.getZoom() < 16) return Promise.resolve();

    if (abortControllers.current[typeName]) {
        abortControllers.current[typeName].abort();
    }
    const controller = new AbortController();
    abortControllers.current[typeName] = controller;

    const bounds = map.getBounds();
    const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
    const z = Math.max(0, Math.floor(map.getZoom() || 16));
    const layerUrl = `/api/layers?typeName=${encodeURIComponent(typeName)}&bbox=${encodeURIComponent(bbox)}&format=pbf&z=${z}`;

    return fetchWithRetry(layerUrl, { signal: controller.signal }, 2).then(data => {
        if (!data || !data.features || !map) return;

        const isAnno = typeName === 'csdi:DTAD_RD_MARK_ANNO';
        const nonPoints = [];
        const points = [];
        const annos = [];

        // 0. Purge ANY old HTML markers for this layer first so renderers don't fight over cleaning it
        if (markersRef.current[typeName]) {
            markersRef.current[typeName].forEach(m => m.remove());
        }
        markersRef.current[typeName] = [];

        data.features.forEach(f => {
            if (isAnno && f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon') {
                annos.push(f);
            } else if (f.geometry.type === 'Point' || f.geometry.type === 'MultiPoint') {
                points.push(f);
            } else {
                nonPoints.push(f);
            }
        });

        // Render Lines and Polygons
        renderLines(map, typeName, nonPoints, markersRef);

        // Render Points and Markers via dispatch
        const pointRenderer = getPointRenderer(typeName);
        if (pointRenderer) {
            pointRenderer(map, typeName, points, markersRef, activeLayersRef, showRawPoints);
        }

        // Render Annotations via dispatch
        const annoRenderer = getAnnoRenderer(typeName);
        if (annoRenderer && annos.length > 0) {
            annoRenderer(map, typeName, annos, markersRef, activeLayersRef);
        }

    }).catch(err => {
        if (err.name !== 'AbortError') console.error(`Error loading ${typeName}:`, err);
    });
};

export const applyVisibilityOverlays = ({ map, activeLayers, markersRef }) => {
    Object.values(layersConfig).flat().forEach(typeName => {
        const isActive = activeLayers.has(typeName);

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
};
