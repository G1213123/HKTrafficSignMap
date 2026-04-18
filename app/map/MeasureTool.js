import React, { useState, useEffect, useRef } from 'react';
import * as turf from '@turf/turf';
import { Ruler, Trash2, StopCircle } from 'lucide-react';

const MeasureTool = ({ map }) => {
    const [isMeasuring, setIsMeasuring] = useState(false);
    const [points, setPoints] = useState([]);
    const [measurement, setMeasurement] = useState(null);
    
    // Use refs for map event handlers to access current state
    const isMeasuringRef = useRef(isMeasuring);
    const pointsRef = useRef(points);

    useEffect(() => {
        isMeasuringRef.current = isMeasuring;
        pointsRef.current = points;
    }, [isMeasuring, points]);

    useEffect(() => {
        if (!map) return;

        // Initialize sources and layers for measuring
        if (!map.getSource('measure-geojson')) {
            map.addSource('measure-geojson', {
                type: 'geojson',
                data: { type: 'FeatureCollection', features: [] }
            });

            // Add line layer
            map.addLayer({
                id: 'measure-lines',
                type: 'line',
                source: 'measure-geojson',
                filter: ['==', '$type', 'LineString'],
                layout: { 'line-cap': 'round', 'line-join': 'round' },
                paint: { 'line-color': '#000', 'line-width': 2.5, 'line-dasharray': [2, 2] }
            });

            // Add points layer
            map.addLayer({
                id: 'measure-points',
                type: 'circle',
                source: 'measure-geojson',
                filter: ['==', '$type', 'Point'],
                paint: { 'circle-radius': 5, 'circle-color': '#fff', 'circle-stroke-color': '#000', 'circle-stroke-width': 2 }
            });

            // Add polygon fill layer
            map.addLayer({
                id: 'measure-polygons',
                type: 'fill',
                source: 'measure-geojson',
                filter: ['==', '$type', 'Polygon'],
                paint: { 'fill-color': '#000', 'fill-opacity': 0.1 }
            });
        }

        const updateMeasureSource = (newPoints, currentMousePos = null) => {
            if (!map.getSource('measure-geojson')) return;
            
            const features = [];
            
            // Draw points
            newPoints.forEach(p => {
                features.push(turf.point(p));
            });

            const drawPoints = currentMousePos ? [...newPoints, currentMousePos] : [...newPoints];

            // Draw line/polygon
            if (drawPoints.length > 1) {
                // If 3 or more points and closed, we can show polygon area (closed loop visual)
                if (drawPoints.length >= 3) {
                    const polyCoords = [...drawPoints, drawPoints[0]];
                    features.push(turf.polygon([polyCoords]));
                }
                features.push(turf.lineString(drawPoints));
            }

            map.getSource('measure-geojson').setData({
                type: 'FeatureCollection',
                features: features
            });
        };

        const calculateMeasurements = (coords) => {
            if (coords.length < 2) return null;
            
            let length = 0;
            let area = 0;
            let angle = null;

            const line = turf.lineString(coords);
            length = turf.length(line, { units: 'meters' });

            if (coords.length >= 3) {
                const polyCoords = [...coords, coords[0]];
                const polygon = turf.polygon([polyCoords]);
                area = turf.area(polygon); // in square meters

                // Calculate angle between last 3 points
                if (coords.length === 3) {
                    const pt1 = turf.point(coords[0]);
                    const pt2 = turf.point(coords[1]); // vertex
                    const pt3 = turf.point(coords[2]);
                    
                    const bearing1 = turf.bearing(pt2, pt1);
                    const bearing2 = turf.bearing(pt2, pt3);
                    let a = Math.abs(bearing1 - bearing2);
                    if (a > 180) a = 360 - a;
                    angle = a;
                }
            }

            return { length, area, angle };
        };

        const onClick = (e) => {
            if (!isMeasuringRef.current) return;
            
            const coords = [e.lngLat.lng, e.lngLat.lat];
            const newPoints = [...pointsRef.current, coords];
            
            setPoints(newPoints);
            setMeasurement(calculateMeasurements(newPoints));
            updateMeasureSource(newPoints);
        };

        const onMouseMove = (e) => {
            if (!isMeasuringRef.current) return;
            map.getCanvas().style.cursor = 'crosshair';
            
            if (pointsRef.current.length > 0) {
                const currentPos = [e.lngLat.lng, e.lngLat.lat];
                updateMeasureSource(pointsRef.current, currentPos);
                
                // Live preview calc
                const previewPoints = [...pointsRef.current, currentPos];
                setMeasurement(calculateMeasurements(previewPoints));
            }
        };

        const onContextMenu = (e) => {
            if (!isMeasuringRef.current) return;
            e.preventDefault();
            // Undo last point on right click
            const newPoints = pointsRef.current.slice(0, -1);
            setPoints(newPoints);
            setMeasurement(calculateMeasurements(newPoints));
            updateMeasureSource(newPoints);
        };

        map.on('click', onClick);
        map.on('mousemove', onMouseMove);
        map.on('contextmenu', onContextMenu);

        return () => {
            map.off('click', onClick);
            map.off('mousemove', onMouseMove);
            map.off('contextmenu', onContextMenu);
            if (!isMeasuringRef.current && map) {
                map.getCanvas().style.cursor = '';
            }
        };
    }, [map]);

    // Handle disabling
    useEffect(() => {
        if (!isMeasuring && map && map.getSource('measure-geojson')) {
            map.getCanvas().style.cursor = '';
            // Only clear active live preview, keep final lines until manually cleared
        }
        
        // Window level override to stop popup from showing while measuring
        window.isMeasuringActive = isMeasuring;
        
    }, [isMeasuring, map]);

    const clearMeasurement = () => {
        setPoints([]);
        setMeasurement(null);
        if (map && map.getSource('measure-geojson')) {
            map.getSource('measure-geojson').setData({
                type: 'FeatureCollection',
                features: []
            });
        }
    };

    return (
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMeasuring(!isMeasuring);
                    }}
                    title="Measure Tool"
                    style={{
                        padding: '8px', background: isMeasuring ? '#2563eb' : 'white', 
                        color: isMeasuring ? 'white' : 'black', border: '1px solid #ccc', 
                        borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    <Ruler size={20} />
                </button>

                {(points.length > 0 || isMeasuring) && (
                    <button 
                        onClick={clearMeasurement}
                        title="Clear Measurement"
                        style={{
                            padding: '8px', background: 'white', color: 'black', 
                            border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                    >
                        <Trash2 size={20} />
                    </button>
                )}
            </div>

            {(isMeasuring || measurement) && (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)', padding: '10px', 
                    borderRadius: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    fontSize: '13px', color: '#000', minWidth: '150px',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    <strong style={{ display: 'block', marginBottom: '5px', borderBottom: '1px solid #eee', paddingBottom: '3px' }}>
                        {isMeasuring ? 'Measuring...' : 'Measurement Result'}
                    </strong>
                    {isMeasuring && <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>Click map to add points.<br/>Right-click to undo.</div>}
                    
                    {measurement ? (
                        <>
                            <div><b>Length:</b> {measurement.length > 1000 ? (measurement.length / 1000).toFixed(2) + ' km' : measurement.length.toFixed(2) + ' m'}</div>
                            {points.length >= 3 && (
                                <>
                                    {measurement.area > 0 && <div><b>Area:</b> {measurement.area > 10000 ? (measurement.area / 1000000).toFixed(3) + ' sq km' : measurement.area.toFixed(2) + ' sq m'}</div>}
                                    {points.length === 3 && measurement.angle !== null && <div><b>Angle:</b> {measurement.angle.toFixed(1)}°</div>}
                                </>
                            )}
                        </>
                    ) : (
                        <div style={{ fontStyle: 'italic', color: '#666' }}>Click to start</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MeasureTool;