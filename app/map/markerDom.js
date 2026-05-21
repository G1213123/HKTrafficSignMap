import maplibregl from 'maplibre-gl';

export const createMarkerElement = ({ className, width, height, innerHTML, title, cursor = 'pointer' }) => {
    const el = document.createElement('div');
    if (className) el.className = className;
    if (width != null) el.style.width = width;
    if (height != null) el.style.height = height;
    if (title) el.title = title;
    if (cursor) el.style.cursor = cursor;
    if (innerHTML != null) el.innerHTML = innerHTML;
    return el;
};

export const attachMarkerPopup = (el, map, coords, popupContent, isMeasuringActive = () => window.isMeasuringActive) => {
    const setHoverCursor = () => {
        if (map?.getCanvas) map.getCanvas().style.cursor = 'pointer';
    };

    const clearHoverCursor = () => {
        if (map?.getCanvas) map.getCanvas().style.cursor = '';
    };

    el.addEventListener('mouseenter', setHoverCursor);
    el.addEventListener('mouseleave', clearHoverCursor);
    el.addEventListener('click', (e) => {
        if (isMeasuringActive()) return;

        e.stopPropagation();
        new maplibregl.Popup({ offset: 15 })
            .setLngLat(coords)
            .setHTML(popupContent)
            .addTo(map);
    });
};

export const buildPopupContent = (typeName, properties) => {
    let popupContent = `<b>${typeName.replace('csdi:DTAD_', '').replace(/_/g, ' ')}</b><br><div class="popup-content">`;
    for (const key in properties) {
        if (properties[key] !== null) {
            popupContent += `<b>${key}:</b> ${properties[key]}<br>`;
        }
    }
    popupContent += '</div>';
    return popupContent;
};

export const buildPopupContentWithPreview = (typeName, properties, previewHtml) => {
    const baseContent = buildPopupContent(typeName, properties);
    if (!previewHtml) return baseContent;
    return `${previewHtml}${baseContent}`;
};