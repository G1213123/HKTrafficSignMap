import { fetchWithRetry } from './mapUtils';
import { layersConfig } from './mapConfig';
import { renderLines } from './rendererLine';
import { renderPoints } from './rendererPoint';

export const loadLayerData = (typeName, { map, abortControllers, markersRef, activeLayersRef }) => {
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
        if (!data || !data.features || !map) return;

        const isAnno = typeName === 'csdi:DTAD_RD_MARK_ANNO';
        const nonPoints = [];
        const points = [];

        data.features.forEach(f => {
            if (f.geometry.type === 'Point' || f.geometry.type === 'MultiPoint') {
                points.push(f);
            } else {
                nonPoints.push(f);
            }
        });

        // Render Lines and Polygons
        renderLines(map, typeName, nonPoints);

        // Render Points and Markers
        renderPoints(map, typeName, points, markersRef, activeLayersRef);

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
