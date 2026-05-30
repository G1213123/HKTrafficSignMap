import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useI18n } from '../components/I18nProvider';
import { layersConfig } from './layerConfig';

const MapSidebar = ({
    activeLayers,
    onToggleLayer,
    onToggleGroup,
    onToggleAllLayers,
    elevationFilter,
    onChangeElevationFilter,
    showRawPoints,
    onToggleShowRawPoints,
    crsInput,
    setCrsInput,
    coordInput,
    setCoordInput,
    onPanTo,
    onRecenter,
    onSearchLocationSelect,
    panError
}) => {
    const { t } = useI18n();
    // Open by default on larger screens, closed on mobile
    const [open, setOpen] = useState(true);
    const [locationQuery, setLocationQuery] = useState('');
    const [locationResults, setLocationResults] = useState([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState('');
    const searchTimerRef = useRef(null);
    const searchRequestIdRef = useRef(0);
    const activeSearchControllerRef = useRef(null);

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

    useEffect(() => {
        return () => {
            if (searchTimerRef.current) {
                clearTimeout(searchTimerRef.current);
            }
            if (activeSearchControllerRef.current) {
                activeSearchControllerRef.current.abort();
            }
        };
    }, []);

    const getLocationLabel = useCallback((location) => {
        const primaryName = location?.nameZH || location?.nameEN || location?.addressZH || location?.addressEN || '';
        const secondaryName = location?.nameEN && location?.nameEN !== primaryName ? location.nameEN : '';
        const district = location?.districtZH || location?.districtEN || '';

        return [primaryName, secondaryName, district].filter(Boolean).join(' · ');
    }, []);

    const clearSearchResults = useCallback(() => {
        setLocationResults([]);
        setLocationLoading(false);
        setLocationError('');
        if (activeSearchControllerRef.current) {
            activeSearchControllerRef.current.abort();
            activeSearchControllerRef.current = null;
        }
    }, []);

    const selectLocation = useCallback((location) => {
        if (!location) return;

        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
            searchTimerRef.current = null;
        }

        setLocationQuery(getLocationLabel(location));
        clearSearchResults();

        if (onSearchLocationSelect) {
            onSearchLocationSelect(location);
        }
    }, [clearSearchResults, getLocationLabel, onSearchLocationSelect]);

    const runLocationSearch = useCallback(async (query, selectFirst = false) => {
        const trimmed = query.trim();

        if (!trimmed) {
            clearSearchResults();
            return;
        }

        const requestId = ++searchRequestIdRef.current;

        if (activeSearchControllerRef.current) {
            activeSearchControllerRef.current.abort();
        }

        const controller = new AbortController();
        activeSearchControllerRef.current = controller;
        setLocationLoading(true);
        setLocationError('');

        try {
            const response = await fetch(`https://www.map.gov.hk/gs/api/v1.0.0/locationSearch?q=${encodeURIComponent(trimmed)}`, {
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`Location search failed (${response.status})`);
            }

            const results = await response.json();
            if (requestId !== searchRequestIdRef.current) return;

            const list = Array.isArray(results) ? results : [];
            setLocationResults(list);

            if (selectFirst && list.length > 0) {
                selectLocation(list[0]);
            }
        } catch (error) {
            if (error.name === 'AbortError') return;
            if (requestId !== searchRequestIdRef.current) return;
            setLocationResults([]);
            setLocationError(error.message || t('Unable to search locations'));
        } finally {
            if (requestId === searchRequestIdRef.current) {
                setLocationLoading(false);
            }
        }
    }, [clearSearchResults, selectLocation, t]);

    const handleLocationChange = (value) => {
        setLocationQuery(value);
        setLocationError('');

        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
        }

        if (!value.trim()) {
            clearSearchResults();
            return;
        }

        searchTimerRef.current = setTimeout(() => {
            runLocationSearch(value);
        }, 450);
    };

    const handleLocationKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            runLocationSearch(locationQuery, true);
        }

        if (event.key === 'Escape') {
            clearSearchResults();
        }
    };

    return (
        <aside className={`map-sidebar ${open ? 'open' : 'closed'}`}>
            <button 
                className="sidebar-arrow-toggle" 
                onClick={() => setOpen(!open)}
                aria-label={open ? t('Close sidebar') : t('Open sidebar')}
                title={open ? t('Close Controls') : t('Open Controls')}
            >
                {open ? '◀' : '▶'}
            </button>
            <div className="sidebar-header">
                <h3>{t('Map Controls')}</h3>
            </div>

            <div className="sidebar-body">
                    <section className="sidebar-section sidebar-crs">
                        <label>{t('Search location')}</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                value={locationQuery}
                                onChange={(e) => handleLocationChange(e.target.value)}
                                onKeyDown={handleLocationKeyDown}
                                placeholder={t('Search a place in Hong Kong')}
                                autoComplete="off"
                                aria-autocomplete="list"
                                aria-expanded={locationResults.length > 0}
                            />
                            {locationLoading && (
                                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>{t('Searching...')}</div>
                            )}
                            {locationError && (
                                <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '4px' }}>{locationError}</div>
                            )}
                            {locationResults.length > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 4px)',
                                    left: 0,
                                    right: 0,
                                    zIndex: 20,
                                    background: '#fff',
                                    border: '1px solid #d0d7de',
                                    borderRadius: '8px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                    maxHeight: '280px',
                                    overflowY: 'auto'
                                }} role="listbox">
                                    {locationResults.slice(0, 8).map((location, index) => {
                                        const label = getLocationLabel(location);
                                        const address = location?.addressZH || location?.addressEN || '';
                                        const district = location?.districtZH || location?.districtEN || '';
                                        return (
                                            <button
                                                key={`${label}-${location?.x || ''}-${location?.y || ''}-${index}`}
                                                type="button"
                                                onClick={() => selectLocation(location)}
                                                style={{
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    border: 'none',
                                                    borderBottom: index < Math.min(locationResults.length, 8) - 1 ? '1px solid #f0f0f0' : 'none',
                                                    background: 'transparent',
                                                    padding: '10px 12px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <div style={{ fontWeight: 600, color: '#1f2328', fontSize: '0.9rem' }}>{label || t('Unnamed location')}</div>
                                                {(address || district) && (
                                                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>
                                                        {[address, district].filter(Boolean).join(' · ')}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <label>{t('CRS')}</label>
                        <select value={crsInput} onChange={(e) => setCrsInput(e.target.value)}>
                            <option value="EPSG:4326">{t('EPSG:4326 (WGS84)')}</option>
                            <option value="EPSG:3857">{t('EPSG:3857 (Web Mercator)')}</option>
                            <option value="EPSG:2326">{t('EPSG:2326 (HK1980 Grid)')}</option>
                        </select>
                        <label>{t('Coordinates')}</label>
                        <input value={coordInput} onChange={(e) => setCoordInput(e.target.value)} placeholder={t('lng,lat or x,y')} />
                        {panError && <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '-8px', marginBottom: '8px' }}>{panError}</div>}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <button onClick={onPanTo}>{t('Go')}</button>
                            <button onClick={onRecenter}>{t('Center HK')}</button>
                        </div>
                    </section>

                    <section className="sidebar-section">
                        <strong style={{ display: 'block', marginBottom: '8px' }}>{t('Elevation')}</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {[
                                { value: 'ALL', label: t('All') },
                                { value: 'AT-GRADE', label: t('At-grade') },
                                { value: 'A01', label: 'A01' },
                                { value: 'A02', label: 'A02' },
                            ].map(option => {
                                const isActive = elevationFilter === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => onChangeElevationFilter(option.value)}
                                        aria-pressed={isActive}
                                        style={{
                                            padding: '6px 10px',
                                            borderRadius: '999px',
                                            border: `1px solid ${isActive ? '#007bff' : '#d0d7de'}`,
                                            background: isActive ? '#e7f1ff' : '#fff',
                                            color: isActive ? '#0b5ed7' : '#333',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="sidebar-section sidebar-layers">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <strong style={{ margin: 0 }}>{t('Layers')}</strong>
                            <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', cursor: 'pointer', color: '#007bff' }}>
                                <input 
                                    type="checkbox" 
                                    checked={isAllActive} 
                                    ref={input => { if (input) input.indeterminate = isAllPartiallyActive; }} 
                                    onChange={(e) => onToggleAllLayers(e.target.checked)} 
                                    style={{ marginRight: '6px' }}
                                />
                                {t('Toggle All')}
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
                                        <span style={{ flex: 1 }}>{t(groupName)}</span>
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
                                                            <span>{t(label)}</span>
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
                                <span style={{fontWeight: 500, color: '#333'}}>{t('Show raw points')}</span>
                            </label>
                        </div>
                    </section>
                </div>
            </aside>
    );
};

export default MapSidebar;
