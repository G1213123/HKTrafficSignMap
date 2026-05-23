import maplibregl from 'maplibre-gl';
import { getIconUrl } from './mapUtils';
import { rmDimensionDict } from './layerConfig';
import { attachMarkerPopup, buildPopupContent, createMarkerElement } from './markerDom';

export const renderPoints = (map, typeName, points, markersRef, activeLayersRef, showRawPoints = false) => {
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

        if (iconUrl) {
            let angle = (feature.properties && feature.properties.ANGLE != null) ? Number(feature.properties.ANGLE) - 90 : 0;
            let customStyle = `transform: rotate(${-angle}deg);`;
            let extraClass = '';
            let dimScale = 1;

            if (typeName.includes('DTAD_RD_MARK') && refname) {
                extraClass = ' rd-mark-icon';
                const dim = rmDimensionDict[refname.toString()];
                if (dim) {
                    if (dim.angleCorrection) {
                        angle -= dim.angleCorrection;
                        customStyle = `transform: rotate(${-angle}deg);`;
                    }
                    if (dim.offset) {
                        // Offset is defined in SVG local space in millimeters. X is right, Y is down.
                        const localX_m = dim.offset.x / 1000;
                        const localY_m = dim.offset.y / 1000;

                        // Apply the rotation to the offset to get screen-space global offset
                        // Visual clockwise rotation is -angle degrees
                        const rotRad = (-angle) * Math.PI / 180;

                        // Screen space: X right, Y down
                        const screenOffsetX_m = localX_m * Math.cos(rotRad) - localY_m * Math.sin(rotRad);
                        const screenOffsetY_m = localX_m * Math.sin(rotRad) + localY_m * Math.cos(rotRad);

                        // Map geographic space: X is East (right), Y is North (up).
                        // So geographic Y is inverse of screen Y.
                        const latMetersPerDegree = 111320;
                        const lonMetersPerDegree = 111320 * Math.cos(coords[1] * Math.PI / 180);

                        coords[0] += screenOffsetX_m / lonMetersPerDegree;
                        coords[1] += (-screenOffsetY_m) / latMetersPerDegree;
                    }
                    if (dim.length || dim.minLength || dim.maxLength) {
                        const lengthValue = dim.length || dim.minLength || dim.maxLength;

                        // lengthValue is in millimeters. We convert to meters ( / 1000 )
                        // Then divide by the exact meters/pixel at zoom 21 for this latitude
                        const lengthPx = (lengthValue / 1000) / metersPerPx;
                        customStyle += ` height: calc(${lengthPx}px * var(--map-icon-scale, 1)); width: auto; max-width: none;`;
                    } 
                    if (dim.symbolSizeScale) {
                        dimScale = dim.symbolSizeScale;
                    }
                }
            }

            // Allow per-feature override of height using SYMBOL_SIZE (interpreted as meters)
            //const rawSymbolSize = feature.properties && feature.properties.SYMBOL_SIZE * dimScale;
            //const parsedSymbolSize = rawSymbolSize != null ? Number(rawSymbolSize) : NaN;
            //if (!isNaN(parsedSymbolSize)) {
            //    const finalHeightPx = parsedSymbolSize / metersPerPx / 2;
            //    customStyle += ` height: calc(${finalHeightPx}px * var(--map-icon-scale, 1)); width: auto; max-width: none;`;
            //}
//
            el.innerHTML = `<div class="custom-svg-icon${extraClass}"><img src="${iconUrl}" style="${customStyle}" /></div>`;
        } else {
            el.className = 'default-circle-marker';
            el.style.width = '6px';
            el.style.height = '6px';
            el.style.backgroundColor = '#000000';
            el.style.border = '1px solid #ffffff';
            el.style.borderRadius = '50%';
        }

        const marker = new maplibregl.Marker({
            element: el,
            rotationAlignment: 'map',
            pitchAlignment: 'map'
        }).setLngLat(coords);

        // Optional debug: also plot the raw point as a small dot
        let rawMarker = null;
        if (showRawPoints) {
            const rawEl = document.createElement('div');
            rawEl.className = 'raw-point-debug';
            rawEl.title = `raw: ${refname || ''}`;
            rawMarker = new maplibregl.Marker({ element: rawEl, rotationAlignment: 'map', pitchAlignment: 'map' }).setLngLat([...feature.geometry.coordinates]);
        }

        attachMarkerPopup(el, map, coords, buildPopupContent(typeName, feature.properties || {}));

        if (activeLayersRef.current.has(typeName)) {
            marker.addTo(map);
            if (rawMarker) rawMarker.addTo(map);
        }
        markersRef.current[typeName].push(marker);
        if (rawMarker) markersRef.current[typeName].push(rawMarker);
    });
};
