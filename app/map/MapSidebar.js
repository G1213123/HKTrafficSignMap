import React, { useState, useEffect } from 'react';
import { layersConfig } from './layerConfig';

const MapSidebar = ({
    activeLayers,
    onToggleLayer,
    onToggleGroup,
    onToggleAllLayers,
    showRawPoints,
    onToggleShowRawPoints,
    crsInput,
    setCrsInput,
    coordInput,
    setCoordInput,
    onPanTo,
    onRecenter,
    panError
}) => {
    // Open by default on larger screens, closed on mobile
    const [open, setOpen] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setOpen(false);
            } else {
                setOpen(true);
            }
        };
        // Initial check
        handleResize();
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate all layers state for "Toggle All" master checkbox
    const allLayers = Object.values(layersConfig).flat();
    const isAllActive = allLayers.length > 0 && allLayers.every(layer => activeLayers.has(layer));
    const isAllPartiallyActive = allLayers.some(layer => activeLayers.has(layer)) && !isAllActive;

    const [collapsedGroups, setCollapsedGroups] = useState({});

    const toggleGroupCollapse = (groupName) => {
        setCollapsedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
    };

    return (
        <aside className={`map-sidebar ${open ? 'open' : 'closed'}`}>
            <button 
                className="sidebar-arrow-toggle" 
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close sidebar" : "Open sidebar"}
                title={open ? "Close Controls" : "Open Controls"}
            >
                {open ? '◀' : '▶'}
            </button>
            <div className="sidebar-header">
                <h3>Map Controls</h3>
            </div>

            <div className="sidebar-body">
                    <section className="sidebar-section sidebar-crs">
                        <label>CRS</label>
                        <select value={crsInput} onChange={(e) => setCrsInput(e.target.value)}>
                            <option value="EPSG:4326">EPSG:4326 (WGS84)</option>
                            <option value="EPSG:3857">EPSG:3857 (Web Mercator)</option>
                            <option value="EPSG:2326">EPSG:2326 (HK1980 Grid)</option>
                        </select>
                        <label>Coordinates</label>
                        <input value={coordInput} onChange={(e) => setCoordInput(e.target.value)} placeholder="lng,lat or x,y" />
                        {panError && <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '-8px', marginBottom: '8px' }}>{panError}</div>}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <button onClick={onPanTo}>Go</button>
                            <button onClick={onRecenter}>Center HK</button>
                        </div>
                    </section>

                    <section className="sidebar-section sidebar-layers">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <strong style={{ margin: 0 }}>Layers</strong>
                            <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', cursor: 'pointer', color: '#007bff' }}>
                                <input 
                                    type="checkbox" 
                                    checked={isAllActive} 
                                    ref={input => { if (input) input.indeterminate = isAllPartiallyActive; }} 
                                    onChange={(e) => onToggleAllLayers(e.target.checked)} 
                                    style={{ marginRight: '6px' }}
                                />
                                Toggle All
                            </label>
                        </div>
                        {Object.entries(layersConfig).map(([groupName, layerList]) => {
                            const isGroupActive = layerList.every(layer => activeLayers.has(layer));
                            const isGroupPartiallyActive = layerList.some(layer => activeLayers.has(layer)) && !isGroupActive;
                            const isCollapsed = collapsedGroups[groupName];
                            return (
                                <div key={groupName} className="layer-group">
                                    <div className="layer-group-header" onClick={() => toggleGroupCollapse(groupName)}>
                                        <input 
                                            type="checkbox" 
                                            checked={isGroupActive} 
                                            ref={input => { if (input) input.indeterminate = isGroupPartiallyActive; }} 
                                            onChange={(e) => onToggleGroup(layerList, e.target.checked)} 
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <span style={{ flex: 1 }}>{groupName}</span>
                                        <span style={{ fontSize: '0.8rem', marginLeft: 'auto', userSelect: 'none', transform: isCollapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }}>
                                            ▼
                                        </span>
                                    </div>
                                    <div className={`layer-items-wrapper ${isCollapsed ? '' : 'expanded'}`}>
                                        <div className="layer-items-inner">
                                            <div className="layer-items">
                                                {layerList.map(layer => {
                                                    const label = layer.replace('csdi:', '').replace('DTAD_', '').replace(/_/g, ' ');
                                                    const isActive = activeLayers.has(layer);
                                                    return (
                                                        <label key={layer} className="layer-item">
                                                            <input type="checkbox" checked={!!isActive} onChange={() => onToggleLayer(layer)} />
                                                            <span>{label}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div style={{ marginTop: '16px' }}>
                            <label className="layer-item" style={{display: 'flex', alignItems: 'center'}}>
                                <input type="checkbox" checked={!!showRawPoints} onChange={(e) => onToggleShowRawPoints && onToggleShowRawPoints(e.target.checked)} />
                                <span style={{fontWeight: 500, color: '#333'}}>Show raw points</span>
                            </label>
                        </div>
                    </section>
                </div>
            </aside>
    );
};

export default MapSidebar;
