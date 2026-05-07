import maplibregl from 'maplibre-gl';
import { getIconUrl, getMetersPerPixel } from './mapUtils';
import { buildSvgForRefname } from './svgShapes';

// Renders traffic light point features using either inline-built SVGs or fallback proxy images
export const renderTrafficLightPt = (map, typeName, points, markersRef, activeLayersRef, showRawPoints = false) => {
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

        // Try building inline SVG from shapes registry first
        const inlineSvg = buildSvgForRefname(refname);
        if (inlineSvg) {
            let angle = (feature.properties && feature.properties.ANGLE != null) ? Number(feature.properties.ANGLE) - 90 : 0;
            let customStyle = `transform: rotate(${-angle}deg);`;

            // Compute SYMBOL_SIZE height override
            const metersPerPx = getMetersPerPixel(coords[1], 21);
            const rawSymbolSize = feature.properties && feature.properties.SYMBOL_SIZE;
            const parsedSymbolSize = rawSymbolSize != null ? Number(rawSymbolSize) : NaN;
            if (!isNaN(parsedSymbolSize)) {
                const finalHeightPx = parsedSymbolSize / metersPerPx;
                customStyle += ` height: calc(${finalHeightPx}px * var(--map-icon-scale, 1)); width: auto; max-width: none;`;
            }

            el.className = 'custom-svg-icon-wrapper traffic-light-wrapper';
            const inner = document.createElement('div');
            inner.className = 'custom-svg-icon traffic-light-icon';
            inner.innerHTML = inlineSvg;
            const svgEl = inner.querySelector('svg');
            if (svgEl) {
                svgEl.setAttribute('style', customStyle);
                // Anchor transform to SVG origin (top-left)
                svgEl.style.transformOrigin = '0 0';
            }
            el.appendChild(inner);
        } else if (iconUrl) {
            // Rotation: existing code uses ANGLE - 90 then negates for transform
            let angle = (feature.properties && feature.properties.ANGLE != null) ? Number(feature.properties.ANGLE) - 90 : 0;
            let customStyle = `transform: rotate(${-angle}deg);`;

            // Compute meters per pixel and allow SYMBOL_SIZE (meters) to override height
            const metersPerPx = getMetersPerPixel(coords[1], 21);
            const rawSymbolSize = feature.properties && feature.properties.SYMBOL_SIZE;
            const parsedSymbolSize = rawSymbolSize != null ? Number(rawSymbolSize) : NaN;
            if (!isNaN(parsedSymbolSize)) {
                const finalHeightPx = parsedSymbolSize / metersPerPx;
                customStyle += ` height: calc(${finalHeightPx}px * var(--map-icon-scale, 1)); width: auto; max-width: none;`;
            }

            el.className = 'custom-svg-icon-wrapper traffic-light-wrapper';
            // Ensure image transforms around its top-left origin
            const imgStyle = `${customStyle}; transform-origin: 0 0;`;
            el.innerHTML = `<div class="custom-svg-icon traffic-light-icon"><img src="${iconUrl}" style="${imgStyle}" onerror="console.error('TrafficLight SVG load failed','${iconUrl}')"/></div>`;
        } else {
            el.className = 'default-circle-marker';
            el.style.width = '8px';
            el.style.height = '8px';
            el.style.backgroundColor = '#ff0000';
            el.style.border = '1px solid #ffffff';
            el.style.borderRadius = '50%';
        }

        // Anchor marker to top-left so SVG origin (0,0) is placed at the geo coordinate
        const marker = new maplibregl.Marker({ element: el, anchor: 'top-left', rotationAlignment: 'map', pitchAlignment: 'map' }).setLngLat(coords);

        let rawMarker = null;
        if (showRawPoints) {
            const rawEl = document.createElement('div');
            rawEl.className = 'raw-point-debug';
            rawEl.title = `raw: ${refname || ''}`;
            rawMarker = new maplibregl.Marker({ element: rawEl, rotationAlignment: 'map', pitchAlignment: 'map' }).setLngLat(coords);
        }

        el.addEventListener('click', (e) => {
            if (window.isMeasuringActive) return;
            e.stopPropagation();
            let popupContent = `<b>${typeName.replace('csdi:DTAD_', '').replace(/_/g, ' ')}</b><br><div class="popup-content">`;
            for (const key in feature.properties) {
                if (feature.properties[key] !== null) {
                    popupContent += `<b>${key}:</b> ${feature.properties[key]}<br>`;
                }
            }
            popupContent += '</div>';

            new maplibregl.Popup({ offset: 15 }).setLngLat(coords).setHTML(popupContent).addTo(map);
        });

        if (activeLayersRef.current.has(typeName)) {
            marker.addTo(map);
            if (rawMarker) rawMarker.addTo(map);
        }

        markersRef.current[typeName].push(marker);
        if (rawMarker) markersRef.current[typeName].push(rawMarker);
    });
};
