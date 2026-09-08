import maplibregl from 'maplibre-gl';
import { attachMarkerPopup, buildPopupContentWithPreview, createMarkerElement } from './markerDom';
import { getThemeColor } from './mapUtils';

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const normalizeTsSignId = (signId) => {
    const raw = String(signId || '').trim();
    if (!raw) return '';
    return raw.replace(/^TS[_-]?/i, '');
};

export const getTsPreviewUrl = (signId) => {
    const normalized = normalizeTsSignId(signId);
    if (!normalized) return null;
    return `/api/proxy?asset=${encodeURIComponent(`/data/svgs/TS_${normalized}.svg`)}`;
};

export const buildTsAbvPreviewHtml = (signId) => {
    const previewIcon = getTsPreviewUrl(signId);
    return previewIcon
        ? `<div style="display:flex; justify-content:center; margin: 0 0 10px 0;"><img src="${previewIcon}" alt="${escapeHtml(signId || '')}" style="width:75%; max-width:75%; height:auto; display:block;" /></div>`
        : '';
};

const normalizeText = (value) => String(value || '').trim().toUpperCase();

const normalizeAngle = (angle) => ((Number(angle) % 360) + 360) % 360;

export const getUprightTsAbvAngle = (angle, mapBearing = 0, symbolOffset = 0) => {
    const textAngle = Number(angle) + Number(symbolOffset);
    const screenAngle = normalizeAngle(textAngle - Number(mapBearing));
    const flipForReadability = screenAngle > 90 && screenAngle < 270;
    return textAngle + (flipForReadability ? 180 : 0);
};

const distanceInMeters = (from, to) => {
    const latRadians = (from[1] * Math.PI) / 180;
    const metersPerDegreeLat = 111320;
    const metersPerDegreeLng = metersPerDegreeLat * Math.cos(latRadians);
    const deltaLng = (to[0] - from[0]) * metersPerDegreeLng;
    const deltaLat = (to[1] - from[1]) * metersPerDegreeLat;
    return Math.hypot(deltaLng, deltaLat);
};

const offsetAlongPoleDirection = (poleCoords, angle, distance) => {
    const angleRadians = ((Number(-angle) ) * Math.PI) / 180;
    const latRadians = (poleCoords[1] * Math.PI) / 180;
    const metersPerDegreeLat = 111320;
    const metersPerDegreeLng = metersPerDegreeLat * Math.cos(latRadians);

    return [
        poleCoords[0] + (Math.cos(angleRadians) * distance) / metersPerDegreeLng,
        poleCoords[1] + (Math.sin(angleRadians) * distance) / metersPerDegreeLat,
    ];
};

const getAttachedAbvPosition = (feature, points, poleFeatures) => {
    const originalCoords = feature.geometry.coordinates;
    const originalAngle = feature.properties?.ANGLE != null ? feature.properties.ANGLE : feature.properties?.Angle;
    const fallback = {
        coords: originalCoords,
        angle: Number.isFinite(Number(originalAngle)) ? Number(originalAngle) : 0,
    };
    const ggName = normalizeText(feature.properties?.GG_NAME);
    if (!ggName || !Array.isArray(poleFeatures) || poleFeatures.length === 0) return fallback;

    const matchingPoles = poleFeatures.filter((pole) => (
        normalizeText(pole.properties?.GG_NAME) === ggName
        && pole.geometry?.type === 'Point'
        && Array.isArray(pole.geometry.coordinates)
    ));
    if (matchingPoles.length === 0) return fallback;

    const pole = matchingPoles.reduce((nearest, candidate) => {
        if (!nearest) return candidate;
        return distanceInMeters(candidate.geometry.coordinates, originalCoords)
            < distanceInMeters(nearest.geometry.coordinates, originalCoords)
            ? candidate
            : nearest;
    }, null);
    const poleCoords = pole.geometry.coordinates;
    const matchingPoints = points
        .filter((candidate) => normalizeText(candidate.properties?.GG_NAME) === ggName)
        .sort((first, second) => (
            distanceInMeters(poleCoords, first.geometry.coordinates)
            - distanceInMeters(poleCoords, second.geometry.coordinates)
        ));
    const stackIndex = Math.max(0, matchingPoints.indexOf(feature));
    const firstDistance = 3.5;
    const separatorDistance = 1.5;
    const separatorCount = matchingPoints
        .slice(0, stackIndex + 1)
        .filter((point) => String(point.properties?.SIGNID || '').trim().toUpperCase() === 'TSSEPA')
        .length;
    const offsetDistance = firstDistance * (stackIndex + 1)
        - (firstDistance - separatorDistance) * separatorCount;
    const rawPoleAngle = pole.properties?.ANGLE != null
        ? pole.properties.ANGLE
        : pole.properties?.Angle;
    const poleAngle = Number.isFinite(Number(rawPoleAngle)) ? Number(rawPoleAngle) : 0;

    return {
        coords: offsetAlongPoleDirection(poleCoords, poleAngle, offsetDistance),
        angle: poleAngle,
    };
};

export const renderTsAbvPt = (map, typeName, points, markersRef, activeLayersRef, showRawPoints = false, options = {}) => {
    const themeColor = getThemeColor(options.isDarkMode === true);
    const poleData = options.layerDataRef?.current?.['csdi:DTAD_TS_POLE_PT'];
    const poleFeatures = Array.isArray(poleData?.features) ? poleData.features : [];

    if (!markersRef.current[typeName]) {
        markersRef.current[typeName] = [];
    }

    points.forEach(feature => {
        const signId = feature.properties?.SIGNID ? String(feature.properties.SIGNID) : '';
        const isSeparator = signId.trim().toUpperCase() === 'TSSEPA';

        const attachedPosition = getAttachedAbvPosition(feature, points, poleFeatures);
        const coords = attachedPosition.coords;
        if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return;

        const angle = attachedPosition.angle;
        const symbolOffset = options.showTsAbvSymbols ? -90 : 0;
        const textAngle = getUprightTsAbvAngle(angle, map.getBearing(), symbolOffset);

        const el = createMarkerElement({ className: 'custom-svg-icon-wrapper ts-abv-text-wrapper', width: '0px', height: '0px' });
        const previewIcon = !isSeparator && options.showTsAbvSymbols ? getTsPreviewUrl(signId) : null;
        const text = isSeparator ? '/' : (signId ? escapeHtml(signId) : 'TS');
        const markerContent = previewIcon
            ? `<img src="${previewIcon}" alt="${escapeHtml(signId)}" style="width: calc(30px * var(--map-icon-scale, 1) * var(--ts-abv-symbol-scale, 1)); height: calc(30px * var(--map-icon-scale, 1) * var(--ts-abv-symbol-scale, 1)); object-fit: contain; display: block; transform: rotate(180deg);" />`
            : text;
        const contentTransform = previewIcon ? 'translate(-50%, 0%)' : 'translate(-50%, -50%)';
        const contentTransformOrigin = previewIcon ? 'top center' : 'center center';
        el.innerHTML = `
            <div class="custom-svg-icon ts-abv-text" style="position: absolute; left: 0%; top: 0%; transform: ${contentTransform} rotate(${textAngle}deg)${previewIcon ? ' translateY(-50%)' : ''}; transform-origin: ${contentTransformOrigin}; pointer-events: auto; width: max-content; height: max-content; overflow: visible; display: flex; align-items: center; justify-content: center;">
                <span style="display: inline-block; font-family: 'PT Sans Narrow', 'PT Sans', Arial, sans-serif; font-size: calc(30px * var(--map-icon-scale, 1)); font-weight: 100; color: ${themeColor}; text-align: center; white-space: nowrap; line-height: 1;">${markerContent}</span>
            </div>
        `;

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
            rawEl.title = `raw: ${signId || ''}`;
            rawMarker = new maplibregl.Marker({ element: rawEl, rotationAlignment: 'map', pitchAlignment: 'map' }).setLngLat(coords);
        }

        if (!isSeparator) {
            const previewHtml = buildTsAbvPreviewHtml(signId);
            attachMarkerPopup(el, map, coords, buildPopupContentWithPreview(typeName, feature.properties || {}, previewHtml));
        }

        if (activeLayersRef.current.has(typeName)) {
            marker.addTo(map);
            if (rawMarker) rawMarker.addTo(map);
        }
        markersRef.current[typeName].push(marker);
        if (rawMarker) markersRef.current[typeName].push(rawMarker);
    });
};