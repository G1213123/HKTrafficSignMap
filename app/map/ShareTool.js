'use client';

import React from 'react';
import html2canvas from 'html2canvas';
import proj4 from 'proj4';
import './map.css';

const escapeXml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const evaluateStyleExpression = (expression, feature, zoom) => {
    if (!Array.isArray(expression)) return expression;

    const [operator, ...args] = expression;
    if (operator === 'literal') return args[0];
    if (operator === 'to-color') return evaluateStyleExpression(args[0], feature, zoom);
    if (operator === 'rgb') return `rgb(${args.map(value => evaluateStyleExpression(value, feature, zoom)).join(',')})`;
    if (operator === 'rgba') return `rgba(${args.map(value => evaluateStyleExpression(value, feature, zoom)).join(',')})`;
    if (operator === 'zoom') return zoom;
    if (operator === 'get') return feature?.properties?.[args[0]];
    if (operator === 'has') return Object.prototype.hasOwnProperty.call(feature?.properties || {}, args[0]);
    if (operator === 'coalesce') return args.map(value => evaluateStyleExpression(value, feature, zoom)).find(value => value != null);
    if (operator === 'case') {
        for (let index = 0; index < args.length - 1; index += 2) {
            if (evaluateStyleExpression(args[index], feature, zoom)) return evaluateStyleExpression(args[index + 1], feature, zoom);
        }
        return evaluateStyleExpression(args[args.length - 1], feature, zoom);
    }
    if (operator === 'match') {
        const input = evaluateStyleExpression(args[0], feature, zoom);
        for (let index = 1; index < args.length - 1; index += 2) {
            const labels = Array.isArray(args[index]) ? args[index] : [args[index]];
            if (labels.includes(input)) return evaluateStyleExpression(args[index + 1], feature, zoom);
        }
        return evaluateStyleExpression(args[args.length - 1], feature, zoom);
    }
    if (operator === 'step') {
        const input = Number(evaluateStyleExpression(args[0], feature, zoom));
        let result = evaluateStyleExpression(args[1], feature, zoom);
        for (let index = 2; index < args.length; index += 2) {
            if (input < Number(args[index])) break;
            result = evaluateStyleExpression(args[index + 1], feature, zoom);
        }
        return result;
    }
    if (operator === 'interpolate' || operator === 'interpolate-hcl' || operator === 'interpolate-lab') {
        // args[0] is the interpolation mode; args[1] is the input expression.
        const input = Number(evaluateStyleExpression(args[1], feature, zoom));
        let result = evaluateStyleExpression(args[3], feature, zoom);
        for (let index = 4; index < args.length; index += 2) {
            const stop = Number(args[index]);
            if (input < stop) break;
            result = evaluateStyleExpression(args[index + 1], feature, zoom);
        }
        return result;
    }
    return undefined;
};

const getPaintValue = (map, layerId, property, fallback, feature = null) => {
    try {
        const styleLayer = map.getStyle()?.layers?.find(layer => layer.id === layerId);
        const paintValue = map.getPaintProperty(layerId, property) ?? styleLayer?.paint?.[property];
        const value = evaluateStyleExpression(paintValue, feature, map.getZoom());
        return typeof value === 'string' || typeof value === 'number' ? value : fallback;
    } catch (error) {
        return fallback;
    }
};

const isLayerVisible = (map, layerId) => {
    try {
        return map.getLayoutProperty(layerId, 'visibility') !== 'none';
    } catch (error) {
        return true;
    }
};

const projectCoordinate = (map, coordinate) => {
    const point = map.project(coordinate);
    return `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
};

const geometryToSvg = (map, geometry, fill, stroke, strokeWidth) => {
    if (!geometry) return '';

    const line = (coordinates, closed = false) => {
        const points = coordinates.map(coordinate => projectCoordinate(map, coordinate)).join(' ');
        return `<polyline points="${points}" fill="${closed ? fill : 'none'}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round" />`;
    };

    if (geometry.type === 'Point') {
        const [x, y] = projectCoordinate(map, geometry.coordinates).split(',');
        return `<circle cx="${x}" cy="${y}" r="${Math.max(2, Number(strokeWidth))}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    }
    if (geometry.type === 'MultiPoint') {
        return geometry.coordinates.map(point => geometryToSvg(map, { type: 'Point', coordinates: point }, fill, stroke, strokeWidth)).join('');
    }
    if (geometry.type === 'LineString') return line(geometry.coordinates);
    if (geometry.type === 'MultiLineString') return geometry.coordinates.map(coords => line(coords)).join('');
    if (geometry.type === 'Polygon') return geometry.coordinates.map(coords => line(coords, true)).join('');
    if (geometry.type === 'MultiPolygon') return geometry.coordinates.flatMap(polygon => polygon.map(coords => line(coords, true))).join('');
    return '';
};

const getFeatureText = (feature, layer) => {
    const textField = layer.layout?.['text-field'];
    if (typeof textField !== 'string') return '';
    return textField.replace(/\{([^}]+)\}/g, (_, key) => feature.properties?.[key] ?? '');
};

const renderMapLayersToSvg = (map) => {
    const layers = map.getStyle()?.layers || [];
    return layers.map(layer => {
        if (!isLayerVisible(map, layer.id)) return '';

        const features = map.queryRenderedFeatures({ layers: [layer.id] });
        if (!features.length) return '';

        const lineColor = getPaintValue(map, layer.id, 'line-color', '#000000');
        const lineWidth = getPaintValue(map, layer.id, 'line-width', 1);
        const circleColor = getPaintValue(map, layer.id, 'circle-color', '#000000');
        const circleRadius = getPaintValue(map, layer.id, 'circle-radius', 3);

        if (layer.type === 'background') {
            return `<rect width="100%" height="100%" fill="${escapeXml(getPaintValue(map, layer.id, 'background-color', '#ffffff'))}" />`;
        }

        return features.map(feature => {
            const fill = getPaintValue(map, layer.id, 'fill-color', '#ffffff', feature);
            if (layer.type === 'fill') return geometryToSvg(map, feature.geometry, fill, getPaintValue(map, layer.id, 'fill-outline-color', fill, feature), 1);
            if (layer.type === 'line') return geometryToSvg(map, feature.geometry, 'none', lineColor, lineWidth);
            if (layer.type === 'circle') return geometryToSvg(map, feature.geometry, circleColor, getPaintValue(map, layer.id, 'circle-stroke-color', circleColor), circleRadius);
            if (layer.type === 'symbol') {
                const text = getFeatureText(feature, layer);
                if (!text || feature.geometry.type !== 'Point') return '';
                const [x, y] = projectCoordinate(map, feature.geometry.coordinates).split(',');
                return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="${escapeXml(getPaintValue(map, layer.id, 'text-color', '#222'))}">${escapeXml(text)}</text>`;
            }
            return '';
        }).join('');
    }).join('');
};

const renderMarkersToSvg = async (map) => {
    const container = map.getContainer();
    const containerRect = container.getBoundingClientRect();
    const markers = [...container.querySelectorAll('.maplibregl-marker')];

    return (await Promise.all(markers.map(async marker => {
        const rect = marker.getBoundingClientRect();
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top + rect.height / 2;
        const svg = marker.querySelector('svg');
        if (svg) {
            return `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)})"><svg x="${(-rect.width / 2).toFixed(2)}" y="${(-rect.height / 2).toFixed(2)}" width="${rect.width.toFixed(2)}" height="${rect.height.toFixed(2)}" viewBox="${escapeXml(svg.getAttribute('viewBox') || `0 0 ${svg.clientWidth} ${svg.clientHeight}`)}">${svg.innerHTML}</svg></g>`;
        }

        const image = marker.querySelector('img');
        if (image?.src) {
            const response = await fetch(image.src);
            const imageText = await response.text();
            if (imageText.trim().startsWith('<svg')) {
                return `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)})"><svg x="${(-rect.width / 2).toFixed(2)}" y="${(-rect.height / 2).toFixed(2)}" width="${rect.width.toFixed(2)}" height="${rect.height.toFixed(2)}" preserveAspectRatio="none">${imageText.replace(/^\s*<svg[^>]*>|<\/svg>\s*$/g, '')}</svg></g>`;
            }
        }

        const textElement = marker.querySelector('.ts-abv-text span, .svg-wrapper, .svg-wrapper div');
        const textContainer = marker.querySelector('.ts-abv-text');
        const computedStyle = window.getComputedStyle(textElement || marker);
        const text = textElement?.textContent?.trim() || marker.textContent?.trim();
        if (!text) return '';

        const transform = textContainer ? window.getComputedStyle(textContainer).transform : '';
        const rotationMatch = textContainer?.getAttribute('style')?.match(/rotate\(\s*([-\d.]+)deg\s*\)/i);
        const matrixMatch = transform?.match(/^matrix\(([^)]+)\)$/);
        const matrixValues = matrixMatch ? matrixMatch[1].split(',').map(Number) : [];
        const rotation = rotationMatch
            ? Number(rotationMatch[1])
            : (matrixValues.length >= 2 ? Math.atan2(matrixValues[1], matrixValues[0]) * 180 / Math.PI : 0);
        return `<text x="${x.toFixed(2)}" y="${y.toFixed(2)}" text-anchor="middle" dominant-baseline="middle" fill="${escapeXml(computedStyle.color || '#000')}" font-family="${escapeXml(computedStyle.fontFamily || 'sans-serif')}" font-size="${escapeXml(computedStyle.fontSize || '12px')}" font-weight="${escapeXml(computedStyle.fontWeight || '400')}" transform="rotate(${rotation} ${x.toFixed(2)} ${y.toFixed(2)})">${escapeXml(text)}</text>`;
    }))).join('');
};

export default function ShareTool({ map, t }) {
    if (!map) return null;

    const exportCurrentMapToImage = async () => {
        const exportTarget = map.getContainer()?.closest('.map-main') || document.querySelector('.map-main');
        if (!exportTarget) return;

        try {
            map.triggerRepaint();
            await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

            const canvas = await html2canvas(exportTarget, {
                backgroundColor: '#ffffff',
                useCORS: true,
                allowTaint: true,
                scale: Math.min(window.devicePixelRatio || 2, 3),
                logging: false,
                width: exportTarget.clientWidth,
                height: exportTarget.clientHeight,
                scrollX: 0,
                scrollY: 0,
                ignoreElements: (element) => {
                    if (!element || typeof element.matches !== 'function') return false;
                    return (
                        element.matches('.map-right-toolbar') ||
                        element.matches('.map-tool-container') ||
                        element.matches('.map-measure-container') ||
                        element.matches('.map-legend-toggle-group') ||
                        element.matches('.map-basemap-toggle-group') ||
                        element.matches('.map-label-toggle-group') ||
                        element.matches('.map-geolocate-btn') ||
                        element.matches('.map-info-btn') ||
                        element.matches('.map-info-legend') ||
                        element.matches('.coord-show-box') ||
                        element.matches('.map-legend-stack') ||
                        element.matches('.map-basemap-selector-panel')
                    );
                },
            });

            const link = document.createElement('a');
            link.download = `hk-traffic-map-${new Date().toISOString().slice(0, 10)}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Failed to export map image:', error);
            alert(t('Failed to export map image'));
        }
    };

    const exportCurrentMapToSvg = async () => {
        try {
            const canvas = map.getCanvas();
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><g>${renderMapLayersToSvg(map)}${await renderMarkersToSvg(map)}</g></svg>`;
            const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `hk-traffic-map-${new Date().toISOString().slice(0, 10)}.svg`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to export map SVG:', error);
            alert(t('Failed to export map SVG'));
        }
    };

    const copyCurrentLocationToUrl = () => {
        const center = map.getCenter();
        const zoom = map.getZoom();

        try {
            // Define EPSG:2326 (HK1980 Grid) for proj4
            const EPSG_2326_DEF = '+proj=tmerc +lat_0=22.3121333333333 +lon_0=114.178555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-276.959,-161.764,-0.067753,2.243648,1.158828,-1.094246 +units=m +no_defs +type=crs';
            proj4.defs('EPSG:2326', EPSG_2326_DEF);

            const [x, y] = proj4('WGS84', 'EPSG:2326', [center.lng, center.lat]);

            const params = new URLSearchParams();
            params.set('x', x.toFixed(3));
            params.set('y', y.toFixed(3));
            params.set('z', Math.round(zoom));

            const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

            navigator.clipboard.writeText(shareUrl).then(() => {
                alert(t('Share link copied to clipboard!'));
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        } catch (e) {
            console.error('Error generating share link:', e);
        }
    };

    return (
        <div className="map-tool-container">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px', background: '#fff', padding: '4px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', border: '1px solid #ddd' }}>

                <button
                    type="button"
                    className="map-share-btn"
                    onClick={copyCurrentLocationToUrl}
                    title={t('Share current location')}
                    aria-label={t('Share current location')}
                    style={{
                        width: '32px', height: '32px', padding: 0, background:  'white', 
                        color:  'black', border: '1px solid #ccc', 
                        borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    🔗
                </button>

                <button
                    type="button"
                    className="map-export-btn"
                    onClick={exportCurrentMapToImage}
                    title={t('Export current map as image')}
                    aria-label={t('Export current map as image')}
                    style={{
                        width: '32px', height: '32px', padding: 0, background: 'white',
                        color: 'black', border: '1px solid #ccc',
                        borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    ⤓
                </button>

                <button
                    type="button"
                    className="map-export-btn"
                    onClick={exportCurrentMapToSvg}
                    title={t('Export current map as SVG')}
                    aria-label={t('Export current map as SVG')}
                    style={{
                        width: '32px', height: '32px', padding: 0, background: 'white',
                        color: 'black', border: '1px solid #ccc',
                        borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    SVG
                </button>
            </div>
        </div>
    );
}
