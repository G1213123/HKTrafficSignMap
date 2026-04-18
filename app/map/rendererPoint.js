import maplibregl from 'maplibre-gl';
import { getIconUrl } from './mapUtils';
import { rmDimensionDict } from './mapConfig';

export const renderPoints = (map, typeName, points, markersRef, activeLayersRef) => {
    // 3. Purge old markers & Repopulate newly fetched MapLibre Point Markers
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
        if (iconUrl) {
            let angle = (feature.properties && feature.properties.ANGLE != null) ? Number(feature.properties.ANGLE) - 90 : 0;
            let customStyle = `transform: rotate(${-angle}deg);`;
            let extraClass = '';
            
            if (typeName.includes('DTAD_RD_MARK') && refname) {
                extraClass = ' rd-mark-icon';
                const dim = rmDimensionDict[refname.toString()];
                if (dim) {
                    if (dim.angleCorrection) {
                        angle -= dim.angleCorrection;
                        customStyle = `transform: rotate(${-angle}deg);`;
                    }
                    if (dim.length || dim.minLength || dim.maxLength) {
                        const lengthValue = dim.length || dim.minLength || dim.maxLength;
                        
                        // lengthValue is in millimeters. We convert to meters ( / 1000 )
                        // Then divide by the exact meters/pixel at zoom 21 for this latitude
                        const lat = coords[1];
                        // Earth circumference / 2^(zoom + 9) dynamically for MapLibre
                        const metersPerPx = 40075016.686 * Math.cos(lat * Math.PI / 180) / Math.pow(2, 21 + 9);
                        
                        const lengthPx = (lengthValue / 1000) / metersPerPx;
                        customStyle += ` height: calc(${lengthPx}px * var(--map-icon-scale, 1)); width: auto; max-width: none;`;
                    }
                }
            }
            
            el.className = 'custom-svg-icon-wrapper';
            el.innerHTML = `<div class="custom-svg-icon${extraClass}"><img src="${iconUrl}" style="${customStyle}" /></div>`;
        } else {
            el.className = 'default-circle-marker';
            el.style.width = '6px';
            el.style.height = '6px';
            el.style.backgroundColor = '#000000';
            el.style.border = '1px solid #ffffff';
            el.style.borderRadius = '50%';
        }

        const marker = new maplibregl.Marker({ element: el }).setLngLat(coords);

        el.addEventListener('click', (e) => {
            if (window.isMeasuringActive) return; // Prevent popup if measuring tool is active
            
            e.stopPropagation();
            let popupContent = `<b>${typeName.replace('csdi:DTAD_', '').replace(/_/g, ' ')}</b><br><div class="popup-content">`;
            for (const key in feature.properties) {
                if (feature.properties[key] !== null) {
                    popupContent += `<b>${key}:</b> ${feature.properties[key]}<br>`;
                }
            }
            popupContent += '</div>';

            new maplibregl.Popup({ offset: 15 })
                .setLngLat(coords)
                .setHTML(popupContent)
                .addTo(map);
        });

        if (activeLayersRef.current.has(typeName)) {
            marker.addTo(map);
        }
        markersRef.current[typeName].push(marker);
    });
};
