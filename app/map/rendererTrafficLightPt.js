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

        const lat = coords[1];
        // Calculate meters per pixel at zoom 21 for this latitude
        const metersPerPx = 40075016.686 * Math.cos(lat * Math.PI / 180) / Math.pow(2, 21 + 9);
        
        // We use a symmetrical bounding box around the origin (0,0) 
        // to make sure MapLibre aligns the center of the marker element perfectly to the coordinates.
        // Highest point is tip of the triangle at Y = -2.5
        // Symmetrical lowest point will be Y = +2.5
        // Width will be X = -0.5 to X = +0.5 (1m)
        const scaleFactor = 0.5; // Doubled scale as requested
        const svgWidthMeters = 1.0 * scaleFactor;
        const svgHeightMeters = 5.0 * scaleFactor; // Symmetrical: from -2.5 to 2.5
        
        const widthPx = svgWidthMeters / metersPerPx;
        const heightPx = svgHeightMeters / metersPerPx;

        const refname = feature.properties?.REFNAME;

        const el = document.createElement('div');
        el.className = 'custom-svg-icon-wrapper';

        // Build inline SVG like renderTsPolePt: size by SYMBOL_SIZE (meters) -> px
        const inlineSvg = buildSvgForRefname(refname);
        if (inlineSvg) {
            // parse svg to extract viewBox width/height
            //const parser = new DOMParser();
            //const doc = parser.parseFromString(inlineSvg, 'image/svg+xml');
            //const svgElDoc = doc.documentElement;
            //let vbW = 0, vbH = 0;
            //try {
            //    if (svgElDoc && svgElDoc.viewBox && typeof svgElDoc.viewBox.baseVal !== 'undefined') {
            //        vbW = svgElDoc.viewBox.baseVal.width;
            //        vbH = svgElDoc.viewBox.baseVal.height;
            //    }
            //} catch (e) {
            //    vbW = 0; vbH = 0;
            //}

            el.className = 'custom-svg-icon-wrapper traffic-light-wrapper';

            // Rotation matching renderTsPolePt convention
            let angle = (feature.properties && feature.properties.ANGLE != null) ? Number(feature.properties.ANGLE) : 0;
            let customStyle = `transform: rotate(${angle + 90}deg); width: calc(${widthPx}px * var(--map-icon-scale, 1)); height: calc(${heightPx}px * var(--map-icon-scale, 1)); pointer-events: auto;`;

            //const inner = document.createElement('div');
            //inner.className = 'custom-svg-icon traffic-light-icon';
            el.innerHTML =  `<div class="custom-svg-icon" style="${customStyle}">${inlineSvg}</div>`;
;
            //const svgEl = inner.querySelector('svg');
            //if (svgEl) {
            //    svgEl.setAttribute('style', 'width:100%;height:100%;display:block;overflow:visible;');
            //    svgEl.style.transformOrigin = 'center center';
            //}
            //inner.setAttribute('style', customStyle);
            //el.appendChild(inner);
        } else {
            el.className = 'default-circle-marker';
            el.style.width = '8px';
            el.style.height = '8px';
            el.style.backgroundColor = '#ff0000';
            el.style.border = '1px solid #ffffff';
            el.style.borderRadius = '50%';
        }

        const marker = new maplibregl.Marker({ 
            element: el, 
            rotationAlignment: 'map', 
            pitchAlignment: 'map', 
            anchor: 'center' 
        }).setLngLat(coords);

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
