import maplibregl from 'maplibre-gl';
import { getIconUrl, getThemeColor } from './mapUtils';
import { rmDimensionDict } from './layerConfig';
import { attachMarkerPopup, buildPopupContent, buildPopupContentWithPreview, createMarkerElement } from './markerDom';
import { roadMarkShapes } from './svgShapes';


export const renderPoints = (map, typeName, points, markersRef, activeLayersRef, showRawPoints = false, options = {}) => {
    const themeColor = getThemeColor(options.isDarkMode === true);

    if (!markersRef.current[typeName]) {
        markersRef.current[typeName] = [];
    }

    points.forEach(feature => {
        let coords = [...feature.geometry.coordinates];
        if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return;

        // Precompute metersPerPx for this latitude so SYMBOL_SIZE can be converted to pixels
        const lat = coords[1];
        const metersPerPx = 40075016.686 * Math.cos(lat * Math.PI / 180) / Math.pow(2, 21 + 9);

        const refname = feature.properties?.REFNAME?.replace('*', ')');
        const iconUrl = getIconUrl(typeName, refname);

        const el = createMarkerElement({ className: 'custom-svg-icon-wrapper' });

        el.className = 'default-circle-marker';
        el.style.width = '6px';
        el.style.height = '6px';
        el.style.backgroundColor = themeColor;
        el.style.border = `1px solid ${themeColor}`;
        el.style.borderRadius = '50%';


        const marker = new maplibregl.Marker({
            element: el,
            rotationAlignment: 'map',
            pitchAlignment: 'map'
        }).setLngLat(coords);

        // TODO other img preview popup like bollards
        const previewHtml = typeName.includes('DTAD_RD_MARK_SYM') && iconUrl
            ? `<div style="display:flex; justify-content:center; margin: 0 0 10px 0;"><img src="${iconUrl}" alt="${refname || ''}" style="width:75%; max-width:75%; height:auto; display:block;" /></div>`
            : '';

        attachMarkerPopup(el, map, coords, buildPopupContentWithPreview(typeName, feature.properties || {}, previewHtml));

        if (activeLayersRef.current.has(typeName)) {
            marker.addTo(map);
        }
        markersRef.current[typeName].push(marker);
    });
};
