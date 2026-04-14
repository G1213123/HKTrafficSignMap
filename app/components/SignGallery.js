'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from './I18nProvider';

// Lazy image component that only sets src when in view
const LazyImage = ({ src, alt, className, style }) => {
  const [inView, setInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading when 50px away
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
  }, []);

  return (
    <div ref={imgRef} className="sign-image-wrapper" style={style}>
      {inView ? (
        <img
          src={src}
          alt={alt}
          className={className}
        />
      ) : (
        <div className={className} style={{ background: '#f0f0f0' }}></div> // Placeholder
      )}
    </div>
  );
};

export default function SignGallery() {
  const { t } = useI18n();
  const [signs, setSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSign, setSelectedSign] = useState(null);
  const [gridWidth, setGridWidth] = useState(200); // Default card width
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedSignId, setHighlightedSignId] = useState(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [supersededSet, setSupersededSet] = useState(new Set());
  const downloadRef = useRef(null);
  const [viewMode, setViewMode] = useState('signs'); // 'signs' | 'roadmarking'
  const [roadMarkings, setRoadMarkings] = useState(null);
  const [rmLoading, setRmLoading] = useState(false);
  const [rmDimensions, setRmDimensions] = useState({});
  const headerRef = useRef(null);

  useEffect(() => {
    // Make gallery header sticky and offset by navbar height
    const applyHeaderOffset = () => {
      const headerEl = headerRef.current;
      const navbar = document.querySelector('.navbar');
      const navHeight = navbar ? navbar.offsetHeight : 71; // Default to ~71px if not loaded
      if (headerEl) {
        headerEl.style.position = 'sticky';
        headerEl.style.top = `${navHeight}px`;
        headerEl.style.zIndex = '900'; // Make sure it's above other elements but below navbar (1000)
        headerEl.style.background = headerEl.style.background || 'var(--background, #fff)';
      }
    };

    applyHeaderOffset();
    window.addEventListener('resize', applyHeaderOffset);
    window.addEventListener('load', applyHeaderOffset);
    return () => {
      window.removeEventListener('resize', applyHeaderOffset);
      window.removeEventListener('load', applyHeaderOffset);
    };
  }, []);

  // Lazy-load road marking dataset when switching to that view
  // useEffect(() => {
  //   if (viewMode !== 'roadmarking' || roadMarkings !== null) return;
  //   setRmLoading(true);
  //   fetch('/data/roadmarkings.json')
  //     .then(res => res.json())
  //     .then(data => {
  //       const processedRm = (data || []).map(rm => ({
  //         ...rm,
  //         imageUrl: `/data/svgs/${rm.filename}?v=${rm.mtime || ''}`
  //       }));
  //       setRoadMarkings(processedRm);
  //       setRmLoading(false);
  //     })
  //     .catch(() => {
  //       setRoadMarkings([]);
  //       setRmLoading(false);
  //     });
  // }, [viewMode, roadMarkings]);

  // Handle deep linking for Road Markings once loaded
  // useEffect(() => {
  //   if (!roadMarkings || roadMarkings.length === 0) return;
    
  //   if (typeof window !== 'undefined' && !selectedSign) {
  //     const params = new URLSearchParams(window.location.search);
  //     const signParam = params.get('sign');
  //     if (signParam) {
  //       const targetRm = roadMarkings.find(rm => String(rm.signNumber || rm.id) === signParam);
  //       if (targetRm) {
  //         setSelectedSign(targetRm);
  //         document.body.style.overflow = 'hidden';
  //       }
  //     }
  //   }
  //   // Only run when roadMarkings data becomes available
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [roadMarkings]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDownload = (format) => {
    if (!selectedSign) return;

    const imageUrl = selectedSign.imageUrl;
    // Proxy URL to bypass CORS and force download behavior
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(imageUrl)}`;

    // Remove query params for filename
    const filename = `TrafficSign_${selectedSign.signNumber}`;

    if (format === 'svg') {
      const link = document.createElement('a');
      link.href = proxyUrl;
      link.download = `${filename}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowDownloadMenu(false);
    } else if (format === 'jpg') {

      const width = 2000;
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const aspect = img.width / img.height;
        canvas.width = width;
        canvas.height = width / aspect;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const link = document.createElement('a');
        link.download = `${filename}.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 0.9);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowDownloadMenu(false);
      };
      img.src = proxyUrl;
    }
  };

  const handleGoto = (e) => {
    e.preventDefault();
    const signNum = e.target.elements.signNumber.value.trim();
    if (!signNum) return;

    const navigateToItem = (item, type) => {
      // Clear search to show the sign if it was hidden
      if (searchQuery) setSearchQuery('');
      
      const id = item.filename || item.id;
      setHighlightedSignId(id);
      
      // If we need to switch views
      if (type === 'signs' && viewMode !== 'signs') {
        setViewMode('signs');
      } else if (type === 'roadmarking' && viewMode !== 'roadmarking') {
        setViewMode('roadmarking');
      }

      // Wait for render cycle if search was cleared or view changed
      setTimeout(() => {
        const element = document.getElementById(`sign-${id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Remove highlight after animation (2.4s)
          setTimeout(() => setHighlightedSignId(null), 2500);
        }
      }, 150);
    };

    // Find in both lists
    const targetSign = signs.find(s => s.signNumber.toString() === signNum);
    const targetRm = roadMarkings ? roadMarkings.find(rm => String(rm.signNumber || rm.id) === signNum) : null;

    // Prioritize current view
    if (viewMode === 'signs') {
      if (targetSign) {
        navigateToItem(targetSign, 'signs');
      } else if (targetRm) {
        navigateToItem(targetRm, 'roadmarking');
      } else {
        alert('Sign or Road Marking not found!');
      }
    } else { // roadmarking
      if (targetRm) {
        navigateToItem(targetRm, 'roadmarking');
      } else if (targetSign) {
        navigateToItem(targetSign, 'signs');
      } else {
        alert('Sign or Road Marking not found!');
      }
    }
  };

  useEffect(() => {
    Promise.all([
      fetch('/data/signs.json').then(res => res.json()),
      fetch('/data/descriptions.json').then(res => res.json()).catch(() => ({})), // Fail gracefully
      fetch('/data/superseded.json').then(res => res.json()).catch(() => ([])), // Optional list of superseded sign numbers
      fetch('/data/roadmarkings.json').then(res => res.json()).catch(() => ([])), // Load road markings initially
      fetch('/data/rm_dimension.json').then(res => res.json()).catch(() => ([])) // Load dimensions
    ])
      .then(([signsData, descriptionsData, supersededData, rmData, dimData]) => {
        const supSet = new Set((supersededData || []).map(String));
        
        // Process Dimensions into a map
        const dimMap = (dimData || []).reduce((acc, item) => {
          if (item && item.signNumber) {
            acc[item.signNumber] = item;
          }
          return acc;
        }, {});
        setRmDimensions(dimMap);

        // Construct imageUrl since JSON only has filename and mtime
        const svgBaseUrl = 'https://storage.googleapis.com/road-sign-factory-static/public/data/svgs';
        const processedSigns = signsData.map(sign => ({
          ...sign,
          imageUrl: `${svgBaseUrl}/${sign.filename}?v=${sign.mtime}`,
          description: descriptionsData[sign.signNumber] || sign.description || '',
          superseded: supSet.has(String(sign.signNumber))
        }));

        // Process Road Markings
        const processedRm = (rmData || []).map(rm => ({
          ...rm,
          imageUrl: `${svgBaseUrl}/${rm.filename}?v=${rm.mtime || ''}`,
          description: descriptionsData[rm.signNumber] || descriptionsData[rm.id] || rm.description || '',
          superseded: supSet.has(String(rm.signNumber || rm.id))
        }));
        
        setSigns(processedSigns);
        setRoadMarkings(processedRm);
        setSupersededSet(supSet);
        setLoading(false);

        // Check if there is a 'sign' URL parameter to open immediately
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const signParam = params.get('sign');
          if (signParam) {
            const targetSign = processedSigns.find(s => s.signNumber.toString() === signParam);
            if (targetSign) {
              setSelectedSign(targetSign);
              document.body.style.overflow = 'hidden';
            } else {
              // Try switching to road markings to see if it exists there
              const targetRm = processedRm.find(rm => String(rm.signNumber || rm.id) === signParam);
              if (targetRm) {
                 setViewMode('roadmarking');
                 setSelectedSign(targetRm);
                 document.body.style.overflow = 'hidden';
              }
            }
          }
        }
      })
      .catch(err => {
        console.error('Failed to load signs or descriptions:', err);
        setLoading(false);
      });
  }, []);

  const openModal = (sign) => {
    setSelectedSign(sign);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedSign(null);
    setShowDownloadMenu(false);
    document.body.style.overflow = 'auto';
  };

  const openRandomSign = () => {
    if (signs.length > 0) {
      const randomIndex = Math.floor(Math.random() * signs.length);
      openModal(signs[randomIndex]);
    }
  };

  // Close download menu when clicking outside the download container
  useEffect(() => {
    if (!showDownloadMenu) return;
    const onDocClick = (e) => {
      if (downloadRef.current && !downloadRef.current.contains(e.target)) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [showDownloadMenu]);

  if (loading) {
    return <div className="text-center p-4">Loading signs data...</div>;
  }

  // Filter signs based on search query
  const filteredSigns = signs.filter(sign => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      (sign.signNumber || '').toString().toLowerCase().includes(lowerQuery) ||
      (sign.filename || '').toLowerCase().includes(lowerQuery) ||
      (sign.description && (sign.description || '').toLowerCase().includes(lowerQuery))
    );
  });

  const groupCollection = (list) => {
    return list.reduce((acc, item) => {
      const match = (item.signNumber || item.id || '').toString().match(/^(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        // Logic adjusted: 101-200 => 100 series, 201-300 => 200 series
        const seriesStart = Math.floor((num - 1) / 100) * 100;
        const key = `${seriesStart + 1} - ${seriesStart + 100}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
      } else {
        if (!acc['Others']) acc['Others'] = [];
        acc['Others'].push(item);
      }
      return acc;
    }, {});
  };

  const groupedSigns = groupCollection(filteredSigns);

  const filteredRoadMarkings = (roadMarkings || []).filter(rm => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      (rm.signNumber || rm.id || '').toString().toLowerCase().includes(lowerQuery) ||
      (rm.filename || '').toLowerCase().includes(lowerQuery) ||
      (rm.description || rm.name || '').toLowerCase().includes(lowerQuery)
    );
  });

  const groupedRoadMarkings = groupCollection(filteredRoadMarkings);

  const currentGrouped = viewMode === 'signs' ? groupedSigns : groupedRoadMarkings;

  const sortedCategories = Object.keys(currentGrouped).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    if (a === 'Others') return 1;
    if (b === 'Others') return -1;
    return a.localeCompare(b);
  });

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="dark-rm-matrix" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="
               0  0 -1  0  1
              -1  1 -1  0  1
              -1  0  0  0  1
               0  0  0  1  0" 
            />
          </filter>
        </defs>
      </svg>
      <div className="gallery-header" ref={headerRef}>
          <div className="view-tabs">
            <button className={`view-tab ${viewMode === 'signs' ? 'active' : ''}`} onClick={() => setViewMode('signs')}>
              {t('Traffic Signs')} <span className="tab-count">{filteredSigns.length}</span>
            </button>
            <button className={`view-tab ${viewMode === 'roadmarking' ? 'active' : ''}`} onClick={() => setViewMode('roadmarking')}>
              {t('Road Marking')} <span className="tab-count">{roadMarkings ? roadMarkings.length : 0}</span>
            </button>
          </div>
        <div className="gallery-controls">

          <div className="gallery-controls-group">
            <input
              type="text"
              placeholder={t('Search...')}
              value={searchQuery}
              onChange={handleSearch}
              style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <form onSubmit={handleGoto} className="gallery-controls-group">
            <input
              name="signNumber"
              type="text"
              placeholder={t('Go to #')}
              style={{ width: '80px', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }}>{t('Go')}</button>
          </form>

          <div className="gallery-controls-group hide-on-mobile">
            <label htmlFor="grid-size-slider">{t('Size:')}</label>
            <input
              id="grid-size-slider"
              type="range"
              min="100"
              max="400"
              value={gridWidth}
              onChange={(e) => setGridWidth(Number(e.target.value))}
            />
          </div>

          <button onClick={openRandomSign} className="btn btn-primary hide-on-mobile">
            {t('Shuffle 🔀')}
          </button>
        </div>
        
      </div>

      <div className="gallery-container">
        {/* Sidebar Navigation */}
        <nav className="sidebar">
          <h3>{t('Categories')}</h3>
          <ul>
            {sortedCategories.map(category => (
              <li key={category}>
                <a href={`#category-${category.replace(/\s+/g, '-')}`}>{t(category)}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content Area */}
        <div className="main-content">
          {viewMode === 'signs' ? (
            sortedCategories.map(category => (
              <div key={category} id={`category-${category.replace(/\s+/g, '-')}`} className="category-section">
                <h2 className="category-title">{t(category)}</h2>
                <div
                  className="catalogue-grid"
                  style={{
                    gridTemplateColumns: `repeat(auto-fill, minmax(${gridWidth}px, 1fr))`,
                    gap: `${Math.max(0.5, gridWidth / 150)}rem`
                  }}
                >
                  {groupedSigns[category].map((sign) => (
                    <div
                      key={sign.filename}
                      id={`sign-${sign.filename}`}
                      className={`sign-card ${highlightedSignId === sign.filename ? 'highlight-flash' : ''} ${sign.superseded ? 'superseded' : ''}`}
                      onClick={() => openModal(sign)}
                    >
                      <LazyImage
                        src={sign.imageUrl}
                        alt={`Traffic Sign ${sign.signNumber}`}
                        className="sign-image"
                        style={{
                          padding: `${Math.max(0.2, gridWidth / 200)}rem`,
                          aspectRatio: '1.6/1'
                        }}
                      />
                      {sign.superseded && (
                        <span className="superseded-badge">Superseded</span>
                      )}
                      <div className="sign-info">
                        <div className="sign-number" style={{ fontSize: `${Math.max(0.8, gridWidth / 200)}rem` }}>{sign.signNumber}</div>
                        <div className="sign-name" style={{ fontSize: `${Math.max(0.7, gridWidth / 250)}rem` }}>{sign.description || sign.filename}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            rmLoading ? (
              <div className="text-center p-4">Loading road marking data...</div>
            ) : (sortedCategories.length > 0) ? (
              sortedCategories.map(category => (
                <div key={category} id={`category-${category.replace(/\s+/g, '-')}`} className="category-section">
                  <h2 className="category-title">{t(category)}</h2>
                  <div
                    className="catalogue-grid"
                    style={{
                      gridTemplateColumns: `repeat(auto-fill, minmax(${gridWidth}px, 1fr))`,
                      gap: `${Math.max(0.5, gridWidth / 150)}rem`
                    }}
                  >
                    {groupedRoadMarkings[category].map((rm) => (
                      <div key={rm.id || rm.filename} id={`sign-${rm.filename || rm.id}`} className={`sign-card rm-card ${highlightedSignId === (rm.filename || rm.id) ? 'highlight-flash' : ''}`} onClick={() => openModal(rm)}>
                        <LazyImage src={rm.imageUrl || ''} alt={rm.name || rm.id || 'Road Marking'} className="sign-image rm-image" style={{ padding: `${Math.max(0.2, gridWidth / 200)}rem`, aspectRatio: '1.6/1' }} />
                        <div className="sign-info">
                          <div className="sign-number" style={{ fontSize: `${Math.max(0.8, gridWidth / 200)}rem` }}>{rm.signNumber || rm.id || ''}</div>
                          <div className="sign-name" style={{ fontSize: `${Math.max(0.7, gridWidth / 250)}rem` }}>{rm.description || rm.name || rm.filename || ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4">
                {roadMarkings ? 'No matching road markings found.' : 'Road marking dataset not available yet.'}
              </div>
            )
          )}
        </div>
      </div>

      {selectedSign && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>

            <div className="modal-body">
              <div className="modal-image-container">
                <img
                  src={selectedSign.imageUrl}
                  alt={`${(selectedSign.filename || '').startsWith('RM') ? t('Road Marking') : t('Traffic Sign')} ${selectedSign.signNumber || selectedSign.id}`}
                  className="modal-image"
                />
                {selectedSign.superseded && (
                  <div className="superseded-stamp" aria-hidden="true">Superseded</div>
                )}
              </div>

              <div className="modal-details">
                <h2 className="modal-title">{(selectedSign.filename || '').startsWith('RM') ? t('Road Marking') : t('Traffic Sign')} {selectedSign.signNumber}</h2>

                <div className="modal-info-section">
                  <h3>{t('Description')}</h3>
                  <p>{selectedSign.description || t('No description available.')}</p>

                  <h3>{t('Reference No.')}</h3>
                  <p>{(selectedSign.filename || '').startsWith('RM') ? 'RM ' + selectedSign.signNumber : 'TS ' + selectedSign.signNumber}</p>

                  {/* Road Marking Dimensions */}
                  {(selectedSign.filename || '').startsWith('RM') && rmDimensions[selectedSign.signNumber] && (
                    <div className="rm-dimensions mt-4">
                      <h3>{t('Dimensions')}</h3>
                      <div className="dimension-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(() => {
                          const dimensions = rmDimensions[selectedSign.signNumber];
                          const keys = Object.keys(dimensions).filter(key => !['signNumber', 'filename', 'mtime', 'id', 'angleCorrection'].includes(key));
                          
                          // Convert to array of entries for easier processing
                          const entries = keys.map(key => ({ key, value: dimensions[key] }));
                          
                          // Helper for title case
                          const toTitleCase = (str) => str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();

                          // Process entries to group min/max pairs (and module)
                          const processedItems = [];
                          const processedKeys = new Set();
                          
                          // Sort entries to make sure we process deterministically (e.g. min/max order shouldn't matter for pairing)
                          // But we want to preserve developer intent if possible.
                          // Let's just iterate through the entries.

                          // Wait, my previous logic was inside .map so it wouldn't work as expected if I want to skip handled keys.
                          // I need to iterate and push to a result array.
                          
                          for (const entry of entries) {
                            if (processedKeys.has(entry.key)) continue;

                            // Special case: module
                            if (entry.key.toLowerCase().includes('module') && Array.isArray(entry.value) && entry.value.length >= 2) {
                                processedItems.push({
                                    type: 'single',
                                    label: toTitleCase(entry.key),
                                    value: `${entry.value[0]} ${t('Mark')}, ${entry.value[1]} ${t('Gap')}`
                                });
                                processedKeys.add(entry.key);
                                continue;
                            }

                            // Check for min/max pairs
                            let pairKey = null;
                            if (entry.key.startsWith('min')) {
                                const base = entry.key.substring(3);
                                pairKey = `max${base}`;
                            } else if (entry.key.startsWith('max')) {
                                const base = entry.key.substring(3);
                                pairKey = `min${base}`;
                            }

                            if (pairKey) {
                                const pairEntry = entries.find(e => e.key === pairKey);
                                if (pairEntry && !processedKeys.has(pairKey)) {
                                    // Found a pair!
                                    // Determine order: typically min then max
                                    const isMin = entry.key.startsWith('min');
                                    const item1 = isMin ? entry : pairEntry;
                                    const item2 = isMin ? pairEntry : entry;
                                    
                                    processedItems.push({
                                        type: 'pair',
                                        items: [
                                            { label: toTitleCase(item1.key), value: item1.value },
                                            { label: toTitleCase(item2.key), value: item2.value }
                                        ]
                                    });
                                    processedKeys.add(entry.key);
                                    processedKeys.add(pairEntry.key);
                                    continue;
                                }
                            }

                            // Default single row
                            processedItems.push({
                                type: 'single',
                                label: toTitleCase(entry.key),
                                value: Array.isArray(entry.value) ? entry.value.join(', ') : String(entry.value)
                            });
                            processedKeys.add(entry.key);
                          }

                          return processedItems.map((item, index) => {
                            if (item.type === 'pair') {
                                return (
                                    <div key={index} className="dimension-row" style={{ display: 'flex', gap: '16px' }}>
                                        {item.items.map((subItem, idx) => (
                                            <div key={idx} className="dimension-pair-item" style={{ flex: 1, display: 'flex', gap: '4px' }}>
                                                <span className="dim-label" style={{ fontWeight: 'bold' }}>{t(subItem.label)}:</span>
                                                <span>{subItem.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            }
                            return (
                                <div key={index} className="dimension-row" style={{ display: 'flex', gap: '4px' }}>
                                    <span className="dim-label" style={{ fontWeight: 'bold' }}>{t(item.label)}:</span>
                                    <span>{item.value}</span>
                                </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button className="btn btn-primary" onClick={() => {
                    navigator.clipboard.writeText(window.location.host + window.location.pathname + '?sign=' + selectedSign.signNumber);
                    alert('Link copied to clipboard');
                  }}>Share</button>

                  <div className="download-container" ref={downloadRef}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                    >
                      Download ▼
                    </button>
                    {showDownloadMenu && (
                      <div className="download-menu">
                        <button className="download-item" onClick={() => handleDownload('svg')}>
                          SVG (Vector)
                        </button>
                        <button className="download-item" onClick={() => handleDownload('jpg')}>
                          JPG (Image)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to top button - visible mainly on mobile */}
      <button 
        className="back-to-top" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </>
  );
}
