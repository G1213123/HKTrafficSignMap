import maplibregl from 'maplibre-gl';
import { getMetersPerPixel } from './mapUtils';
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

        const el = document.createElement('div');

        // Build inline SVG like renderTsPolePt: size by SYMBOL_SIZE (meters) -> px
        const inlineSvg = buildSvgForRefname(refname);
        if (inlineSvg) {
            // parse svg to extract viewBox width/height
            const parser = new DOMParser();
            const doc = parser.parseFromString(inlineSvg, 'image/svg+xml');
            const svgElDoc = doc.documentElement;
            let vbW = 0, vbH = 0;
            try {
                if (svgElDoc && svgElDoc.viewBox && typeof svgElDoc.viewBox.baseVal !== 'undefined') {
                    vbW = svgElDoc.viewBox.baseVal.width;
                    vbH = svgElDoc.viewBox.baseVal.height;
                }
            } catch (e) {
                vbW = 0; vbH = 0;
            }

            const lat = coords[1];
            const metersPerPx = getMetersPerPixel(lat, 21);
            const rawSymbolSize = feature.properties && feature.properties.SYMBOL_SIZE;
            const parsedSymbolSize = rawSymbolSize != null ? Number(rawSymbolSize) : NaN;
            const finalHeightPx = !isNaN(parsedSymbolSize) ? parsedSymbolSize / metersPerPx : 30; // default 30px
            const finalWidthPx = (vbH > 0) ? (vbW / vbH) * finalHeightPx : finalHeightPx;

            // Rotation matching renderTsPolePt convention
            let angle = (feature.properties && feature.properties.ANGLE != null) ? Number(feature.properties.ANGLE) : 0;
            let customStyle = `transform: rotate(${angle + 90}deg); width: calc(${finalWidthPx}px * var(--map-icon-scale, 1)); height: calc(${finalHeightPx}px * var(--map-icon-scale, 1)); pointer-events: auto;`;

            el.className = 'custom-svg-icon-wrapper traffic-light-wrapper';
            const inner = document.createElement('div');
            inner.className = 'custom-svg-icon traffic-light-icon';
            inner.innerHTML = inlineSvg;
            const svgEl = inner.querySelector('svg');
            if (svgEl) {
                svgEl.setAttribute('style', 'width:100%;height:100%;display:block;overflow:visible;');
                svgEl.style.transformOrigin = 'center center';
            }
            inner.setAttribute('style', customStyle);
            el.appendChild(inner);
        } else {
            el.className = 'default-circle-marker';
            el.style.width = '8px';
            el.style.height = '8px';
            el.style.backgroundColor = '#ff0000';
            el.style.border = '1px solid #ffffff';
            el.style.borderRadius = '50%';
        }

        const marker = new maplibregl.Marker({ element: el, rotationAlignment: 'map', pitchAlignment: 'map', anchor: 'center' }).setLngLat(coords);

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
