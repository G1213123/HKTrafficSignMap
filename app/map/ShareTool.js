'use client';

import React from 'react';
import html2canvas from 'html2canvas';
import proj4 from 'proj4';
import './map.css';

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
            </div>
        </div>
    );
}
