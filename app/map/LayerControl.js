import React, { useState } from 'react';
import { layersConfig } from './mapConfig';

const LayerControl = ({ activeLayers, onToggleLayer, onToggleGroup, showRawPoints, onToggleShowRawPoints }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="layer-control-panel" style={{
            position: 'absolute', top: 10, right: 10, zIndex: 10,
            background: 'rgba(255, 255, 255, 0.95)', padding: collapsed ? '10px' : '15px', 
            borderRadius: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            maxHeight: '80vh', overflowY: 'auto', minWidth: '200px',
            fontFamily: 'system-ui, sans-serif', color: '#000000'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: collapsed ? '0' : '10px' }}>
                <strong style={{ fontSize: '14px' }}>Map Overlays</strong>
                <button 
                    onClick={() => setCollapsed(!collapsed)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}
                >
                    {collapsed ? '▼' : '▲'}
                </button>
            </div>
            {!collapsed && Object.entries(layersConfig).map(([groupName, layerList]) => {
                const isGroupActive = layerList.every(layer => activeLayers.has(layer));
                const isGroupPartiallyActive = layerList.some(layer => activeLayers.has(layer)) && !isGroupActive;
                
                return (
                    <div key={groupName} className="layer-group" style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>
                            <input 
                                type="checkbox" 
                                checked={isGroupActive} 
                                ref={input => { if (input) input.indeterminate = isGroupPartiallyActive; }}
                                onChange={(e) => onToggleGroup(layerList, e.target.checked)} 
                                style={{ marginRight: '6px' }} 
                            />
                            <strong style={{ fontSize: '13px' }}>
                                {groupName}
                            </strong>
                        </div>
                        {layerList.map(layer => {
                            const label = layer.replace('csdi:', '').replace('DTAD_', '').replace(/_/g, ' ');
                            const isActive = activeLayers.has(layer);
                            return (
                                <label key={layer} style={{ display: 'flex', alignItems: 'center', fontSize: '12px', cursor: 'pointer', margin: '4px 0', paddingLeft: '18px' }}>
                                    <input type="checkbox" checked={isActive} onChange={() => onToggleLayer(layer)} style={{ marginRight: '6px' }} />
                                    {label}
                                </label>
                            );
                        })}
                    </div>
                );
            })}
            <div style={{ marginTop: '8px', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={!!showRawPoints} onChange={(e) => onToggleShowRawPoints && onToggleShowRawPoints(e.target.checked)} style={{ marginRight: '8px' }} />
                    Show raw points (debug)
                </label>
            </div>
        </div>
    );
};

export default LayerControl;
