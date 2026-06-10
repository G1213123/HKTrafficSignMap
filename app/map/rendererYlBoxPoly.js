import maplibregl from 'maplibre-gl';
import * as turf from '@turf/turf';
import { attachMarkerPopup, buildPopupContent, createMarkerElement } from './markerDom';

const EARTH_METERS_PER_DEGREE = 111320;
const HATCH_SPACING_METERS = 2;
const HATCH_STROKE_WIDTH_METERS = 0.25;
const POLY_FILL_COLOR = 'rgba(242, 213, 74, 0)';
const CANVAS_PADDING_METERS = 1.5;

const toRadians = degrees => degrees * Math.PI / 180;

const projectPoint = (coord, originCoord) => {
    const [lng, lat] = coord;
    const [originLng, originLat] = originCoord;
    const latMeters = EARTH_METERS_PER_DEGREE;
    const lonMeters = EARTH_METERS_PER_DEGREE * Math.cos(toRadians(originLat));

    return [
        (lng - originLng) * lonMeters,
        (lat - originLat) * latMeters,
    ];
};

const getOuterRings = (feature) => {
    if (!feature?.geometry) return [];

    if (feature.geometry.type === 'Polygon') {
        return [feature.geometry.coordinates?.[0] || []];
    }

    if (feature.geometry.type === 'MultiPolygon') {
        return (feature.geometry.coordinates || []).map(polygon => polygon?.[0] || []).filter(ring => ring.length >= 3);
    }

    return [];
};

const uniquePoints = (points) => {
    const seen = new Set();
    const result = [];

    points.forEach(([x, y]) => {
        const key = `${x.toFixed(6)},${y.toFixed(6)}`;
        if (seen.has(key)) return;
        seen.add(key);
        result.push([x, y]);
    });

    return result;
};

const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

const buildConvexHull = (points) => {
    const sorted = uniquePoints(points).sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));
    if (sorted.length <= 2) return sorted;

    const lower = [];
    for (const point of sorted) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
            lower.pop();
        }
        lower.push(point);
    }

    const upper = [];
    for (let i = sorted.length - 1; i >= 0; i -= 1) {
        const point = sorted[i];
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
            upper.pop();
        }
        upper.push(point);
    }

    lower.pop();
    upper.pop();
    return lower.concat(upper);
};

const normalizeQuarterTurn = (angle) => {
    const halfPi = Math.PI / 2;
    let normalized = angle % halfPi;
    if (normalized < 0) normalized += halfPi;
    return normalized;
};

const buildHatchLines = (centerX, centerY, lineDir, spacingDir, spacingMeters, lengthMeters, minOffset, maxOffset) => {
    const lines = [];

    for (
        let offset = Math.floor(minOffset / spacingMeters) * spacingMeters - spacingMeters;
        offset <= maxOffset + spacingMeters;
        offset += spacingMeters
    ) {
        const midX = centerX + spacingDir[0] * offset;
        const midY = centerY + spacingDir[1] * offset;
        lines.push([
            [midX - lineDir[0] * lengthMeters, midY - lineDir[1] * lengthMeters],
            [midX + lineDir[0] * lengthMeters, midY + lineDir[1] * lengthMeters],
        ]);
    }

    return lines;
};

const computeMinimumBoundingBox = (points) => {
    if (points.length === 0) {
        return null;
    }

    if (points.length === 1) {
        const [[x, y]] = points;
        return {
            angle: 0,
            minX: x,
            maxX: x,
            minY: y,
            maxY: y,
        };
    }

    const hull = buildConvexHull(points);
    if (hull.length < 2) {
        const xs = points.map(point => point[0]);
        const ys = points.map(point => point[1]);
        return {
            angle: 0,
            minX: Math.min(...xs),
            maxX: Math.max(...xs),
            minY: Math.min(...ys),
            maxY: Math.max(...ys),
        };
    }

    const candidateAngles = new Set();
    for (let i = 0; i < hull.length; i += 1) {
        const a = hull[i];
        const b = hull[(i + 1) % hull.length];
        const angle = normalizeQuarterTurn(Math.atan2(b[1] - a[1], b[0] - a[0]));
        candidateAngles.add(angle.toFixed(8));
    }

    let best = null;

    for (const angleText of candidateAngles) {
        const angle = Number(angleText);
        const cos = Math.cos(-angle);
        const sin = Math.sin(-angle);

        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;

        for (const [x, y] of points) {
            const rx = x * cos - y * sin;
            const ry = x * sin + y * cos;
            if (rx < minX) minX = rx;
            if (rx > maxX) maxX = rx;
            if (ry < minY) minY = ry;
            if (ry > maxY) maxY = ry;
        }

        const width = maxX - minX;
        const height = maxY - minY;
        const area = width * height;

        if (!best || area < best.area) {
            best = { angle, minX, minY, maxX, maxY, width, height, area };
        }
    }

    return best;
};

const ringToPath = (ring) => {
    if (!ring || ring.length < 3) return '';

    const parts = ring.map(([x, y]) => `${x.toFixed(3)} ${y.toFixed(3)}`);
    return parts;
};

const buildCanvasGeometry = (feature) => {
    const centroid = turf.centroid(feature).geometry.coordinates;
    const projectedPoints = [];
    const projectedRings = [];

    for (const ring of getOuterRings(feature)) {
        if (!ring || ring.length < 3) continue;

        const projectedRing = ring
            .filter(coord => Array.isArray(coord) && coord.length >= 2)
            .map(coord => projectPoint(coord, centroid));

        if (projectedRing.length < 3) continue;
        projectedPoints.push(...projectedRing);
        projectedRings.push(projectedRing);
    }

    const bbox = computeMinimumBoundingBox(projectedPoints);
    if (!bbox) {
        return null;
    }

    const rotation = -bbox.angle;

    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);

    const rotatedRings = projectedRings.map(ring => ring.map(([x, y]) => {
        const rx = x * cos - y * sin;
        const ry = x * sin + y * cos;
        return [rx, ry];
    })).filter(ring => ring.length >= 3);

    const rotatedPoints = rotatedRings.flat();
    if (rotatedPoints.length === 0) {
        return null;
    }

    let minRX = Number.POSITIVE_INFINITY;
    let minRY = Number.POSITIVE_INFINITY;
    let maxRX = Number.NEGATIVE_INFINITY;
    let maxRY = Number.NEGATIVE_INFINITY;
    for (const [x, y] of rotatedPoints) {
        if (x < minRX) minRX = x;
        if (x > maxRX) maxRX = x;
        if (y < minRY) minRY = y;
        if (y > maxRY) maxRY = y;
    }

    const paddedMinX = minRX - CANVAS_PADDING_METERS;
    const paddedMinY = minRY - CANVAS_PADDING_METERS;
    const paddedMaxX = maxRX + CANVAS_PADDING_METERS;
    const paddedMaxY = maxRY + CANVAS_PADDING_METERS;

    const rectCenterX = (bbox.minX + bbox.maxX) / 2;
    const rectCenterY = (bbox.minY + bbox.maxY) / 2;
    const rectCorners = [
        [bbox.minX, bbox.minY],
        [bbox.maxX, bbox.minY],
        [bbox.maxX, bbox.maxY],
        [bbox.minX, bbox.maxY],
    ];

    const diagonalAngle = -Math.atan2(bbox.height, bbox.width);
    const diagonalDir = [Math.cos(diagonalAngle), Math.sin(diagonalAngle)];
    const perpendicularDir = [-Math.sin(diagonalAngle), Math.cos(diagonalAngle)];
    const diagonalLength = Math.hypot(bbox.width, bbox.height) * 1.4;
    const rectPerpExtents = rectCorners.map(([x, y]) => x * perpendicularDir[0] + y * perpendicularDir[1]);
    const minPerp = Math.min(...rectPerpExtents);
    const maxPerp = Math.max(...rectPerpExtents);
    const rectDiagExtents = rectCorners.map(([x, y]) => x * diagonalDir[0] + y * diagonalDir[1]);
    const minDiag = Math.min(...rectDiagExtents);
    const maxDiag = Math.max(...rectDiagExtents);
    let hatchLines = buildHatchLines(rectCenterX, rectCenterY, diagonalDir, perpendicularDir, HATCH_SPACING_METERS, diagonalLength, minPerp, maxPerp);
    let hatchLinesPerpendicular = buildHatchLines(rectCenterX, rectCenterY, perpendicularDir, diagonalDir, HATCH_SPACING_METERS, diagonalLength, minDiag, maxDiag);

    // rotate hatch lines into the same rotated frame used for rotatedRings
    const rotatePoint = ([x, y]) => {
        const rx = x * cos - y * sin;
        const ry = x * sin + y * cos;
        return [rx, ry];
    };

    hatchLines = hatchLines.map(([s, e]) => [rotatePoint(s), rotatePoint(e)]);
    hatchLinesPerpendicular = hatchLinesPerpendicular.map(([s, e]) => [rotatePoint(s), rotatePoint(e)]);

    const canvasWidthMeters = Math.max(1, paddedMaxX - paddedMinX);
    const canvasHeightMeters = Math.max(1, paddedMaxY - paddedMinY);
    const outlinePath = rotatedRings.map(ring => ringToPath(ring)).filter(Boolean);

    return {
        centroid,
        widthMeters: canvasWidthMeters,
        heightMeters: canvasHeightMeters,
        originX: paddedMinX,
        originY: paddedMinY,
        bbox,
        rotation,
        outlinePath,
        hatchLines,
        hatchLinesPerpendicular,
        rectCorners,
    };
};

const removePreviousMapLayers = (map, typeName) => {
    const layers = map?.getStyle?.()?.layers || [];
    const layerIdsToRemove = layers
        .filter(layer => layer.source === typeName)
        .map(layer => layer.id)
        .reverse();

    layerIdsToRemove.forEach(layerId => {
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
    });

    if (map.getSource(typeName)) {
        map.removeSource(typeName);
    }
};

const unionPolygons = (polygons) => {
    if (polygons.length === 0) return null;

    const polygonsCollection = turf.featureCollection(polygons.map(poly => poly.geometry.type === 'Polygon' ? turf.polygon(poly.geometry.coordinates) : turf.multiPolygon(poly.geometry.coordinates)));
    let union = polygonsCollection.features.length > 1 ? turf.union(polygonsCollection) : polygonsCollection.features[0];

    return {
        type: 'Feature',
        geometry: union.geometry,
        properties: {},
    };
};

export const renderYlBoxPoly = (map, typeName, features, markersRef, activeLayersRef, showRawPoints = false, options = {}) => {
    // Use a single GeoJSON source named by `typeName` and three layers:
    // - polygon fill/outline
    // - diagonal hatch lines
    // - perpendicular hatch lines
    removePreviousMapLayers(map, typeName);

    const processedFeatures = []

    const geojson = { type: 'FeatureCollection', features: [] };
    let sampleLat = 0;

    features.forEach(feature => {
        if (processedFeatures.includes(feature)) return;
        processedFeatures.push(feature);

        const sameFeatures = features.filter(f => f.properties?.FEATUREID === feature.properties?.FEATUREID).map(f => turf.feature(f.geometry));
        const unioned = unionPolygons(sameFeatures);

        const geom = buildCanvasGeometry(unioned);
        if (!geom) return;

        // add original polygon geometry (preserve properties)
        geojson.features.push({
            type: 'Feature',
            geometry: unioned.geometry,
            properties: feature.properties || {},
        });

        // convert hatch line endpoints (meters relative to centroid) back to lon/lat
        const origin = geom.centroid;
        sampleLat = origin[1];
        const lonMeters = EARTH_METERS_PER_DEGREE * Math.cos(toRadians(origin[1]));
        const latMeters = EARTH_METERS_PER_DEGREE;
        const toLonLat = ([mx, my]) => [origin[0] + mx / lonMeters, origin[1] + my / latMeters];

        const polyFeature = { type: 'Feature', geometry: unioned.geometry, properties: feature.properties || {} };

        const addClippedLineFeatures = (s, e, hatchType) => {
            const a = toLonLat(s);
            const b = toLonLat(e);
            const line = turf.lineString([a, b]);

            // Split the line by polygon boundary; keep only segments whose midpoint lies inside
            let segments = null;
            try {
                segments = turf.lineSplit(line, polyFeature);
            } catch (err) {
                segments = null;
            }

            if (segments && segments.features && segments.features.length) {
                for (const seg of segments.features) {
                    const coords = seg.geometry.coordinates;
                    if (!coords || coords.length < 2) continue;
                    const midpoint = turf.midpoint(turf.point(coords[0]), turf.point(coords[coords.length - 1]));
                    if (turf.booleanPointInPolygon(midpoint, polyFeature)) {
                        geojson.features.push({
                            type: 'Feature',
                            geometry: { type: 'LineString', coordinates: coords },
                            properties: { _hatch: hatchType, ...(feature.properties || {}) },
                        });
                    }
                }
            } else {
                // no split result: test midpoint of whole line
                const midpoint = turf.midpoint(turf.point(a), turf.point(b));
                if (turf.booleanPointInPolygon(midpoint, polyFeature)) {
                    geojson.features.push({
                        type: 'Feature',
                        geometry: { type: 'LineString', coordinates: [a, b] },
                        properties: { _hatch: hatchType, ...(feature.properties || {}) },
                    });
                }
            }
        };

        geom.hatchLines.forEach(([s, e]) => addClippedLineFeatures(s, e, 'diag'));
        geom.hatchLinesPerpendicular.forEach(([s, e]) => addClippedLineFeatures(s, e, 'perp'));
    });

    if (geojson.features.length === 0) return;

    // ensure no existing source/layers conflict
    if (map.getSource(typeName)) {
        try { map.removeSource(typeName); } catch (e) { /* ignore */ }
    }

    map.addSource(typeName, { type: 'geojson', data: geojson });

    const zoom = typeof map.getZoom === 'function' ? map.getZoom() : 0;
    const metersPerPx = 156543.03392 * Math.cos(sampleLat * Math.PI / 180) / Math.pow(2, zoom);
    const lineWidthPx = Math.max(1, HATCH_STROKE_WIDTH_METERS / metersPerPx);

    // polygon fill (transparent) and outline
    if (!map.getLayer(`${typeName}-fill`)) {
        map.addLayer({
            id: `${typeName}-fill`,
            type: 'fill',
            source: typeName,
            filter: ['==', ['geometry-type'], 'Polygon'],
            paint: {
                'fill-color': '#ffef00',
                'fill-opacity': 0,
            },
        });
    }

    if (!map.getLayer(`${typeName}-outline`)) {
        map.addLayer({
            id: `${typeName}-outline`,
            type: 'line',
            source: typeName,
            filter: ['==', ['geometry-type'], 'Polygon'],
            paint: {
                'line-color': '#ffef00',
                'line-width': lineWidthPx,
            },
        });
    }

    // diagonal hatch layer
    if (!map.getLayer(`${typeName}-hatch`)) {
        map.addLayer({
            id: `${typeName}-hatch`,
            type: 'line',
            source: typeName,
            filter: ['==', ['get', '_hatch'], 'diag'],
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
                'line-color': '#ffef00',
                'line-width': lineWidthPx,
                'line-opacity': 0.95,
            },
        });
    }

    // perpendicular hatch layer
    if (!map.getLayer(`${typeName}-hatch-perp`)) {
        map.addLayer({
            id: `${typeName}-hatch-perp`,
            type: 'line',
            source: typeName,
            filter: ['==', ['get', '_hatch'], 'perp'],
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
                'line-color': '#ffef00',
                'line-width': lineWidthPx,
                'line-opacity': 0.95,
            },
        });
    }

    // track that this type is active as a layer (no markers used)
    markersRef.current[typeName] = markersRef.current[typeName] || [];
};