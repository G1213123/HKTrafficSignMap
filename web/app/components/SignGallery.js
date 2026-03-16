'use client';

import { useState, useEffect, useRef } from 'react';

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
  useEffect(() => {
    if (viewMode !== 'roadmarking' || roadMarkings !== null) return;
    setRmLoading(true);
    fetch('/data/roadmarkings.json')
      .then(res => res.json())
      .then(data => {
        setRoadMarkings(data || []);
        setRmLoading(false);
      })
      .catch(() => {
        setRoadMarkings([]);
        setRmLoading(false);
      });
  }, [viewMode, roadMarkings]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDownload = (format) => {
    if (!selectedSign) return;

    const imageUrl = selectedSign.imageUrl;

    // Remove query params for filename
    const filename = `TrafficSign_${selectedSign.signNumber}`;

    if (format === 'svg') {
      const link = document.createElement('a');
      link.href = selectedSign.imageUrl; // Use the URL with query params
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
      img.src = selectedSign.imageUrl;
    }
  };

  const handleGoto = (e) => {
    e.preventDefault();
    const signNum = e.target.elements.signNumber.value.trim();
    if (!signNum) return;

    // Find sign
    const targetSign = signs.find(s => s.signNumber.toString() === signNum);

    if (targetSign) {
      // Clear search to show the sign if it was hidden
      if (searchQuery) setSearchQuery('');

      setHighlightedSignId(targetSign.filename);

      // Wait for render cycle if search was cleared and list re-rendered
      setTimeout(() => {
        const element = document.getElementById(`sign-${targetSign.filename}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Remove highlight after animation (2.4s)
          setTimeout(() => setHighlightedSignId(null), 2500);
        }
      }, 100);
    } else {
      alert('Sign not found!');
    }
  };

  useEffect(() => {
    Promise.all([
      fetch('/data/signs.json').then(res => res.json()),
      fetch('/data/descriptions.json').then(res => res.json()).catch(() => ({})), // Fail gracefully
      fetch('/data/superseded.json').then(res => res.json()).catch(() => ([])) // Optional list of superseded sign numbers
    ])
      .then(([signsData, descriptionsData, supersededData]) => {
        const supSet = new Set((supersededData || []).map(String));
        // Construct imageUrl since JSON only has filename and mtime
        const processedSigns = signsData.map(sign => ({
          ...sign,
          imageUrl: `/data/svgs/${sign.filename}?v=${sign.mtime}`,
          description: descriptionsData[sign.signNumber] || sign.description || '',
          superseded: supSet.has(String(sign.signNumber))
        }));
        setSigns(processedSigns);
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
      sign.signNumber.toString().toLowerCase().includes(lowerQuery) ||
      sign.filename.toLowerCase().includes(lowerQuery) ||
      (sign.description && sign.description.toLowerCase().includes(lowerQuery))
    );
  });

  // Group signs by hundred series
  const groupedSigns = filteredSigns.reduce((acc, sign) => {
    const match = sign.signNumber.toString().match(/^(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      // Logic adjusted: 101-200 => 100 series, 201-300 => 200 series
      // Formula: floor((num - 1) / 100) * 100 + 1 (if starting at 101)
      const seriesStart = Math.floor((num - 1) / 100) * 100;
      const key = `${seriesStart + 1} - ${seriesStart + 100}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(sign);
    } else {
      if (!acc['Others']) acc['Others'] = [];
      acc['Others'].push(sign);
    }
    return acc;
  }, {});

  const sortedCategories = Object.keys(groupedSigns).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    if (a === 'Others') return 1;
    if (b === 'Others') return -1;
    return a.localeCompare(b);
  });

  return (
    <>
      <div className="gallery-header" ref={headerRef}>
          <div className="view-tabs">
            <button className={`view-tab ${viewMode === 'signs' ? 'active' : ''}`} onClick={() => setViewMode('signs')}>
              Signs <span className="tab-count">{filteredSigns.length}</span>
            </button>
            <button className={`view-tab ${viewMode === 'roadmarking' ? 'active' : ''}`} onClick={() => setViewMode('roadmarking')}>
              Road Marking <span className="tab-count">{roadMarkings ? roadMarkings.length : 0}</span>
            </button>
          </div>
        <div className="gallery-controls">

          <div className="gallery-controls-group">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <form onSubmit={handleGoto} className="gallery-controls-group">
            <input
              name="signNumber"
              type="text"
              placeholder="Go to #"
              style={{ width: '80px', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }}>Go</button>
          </form>

          <div className="gallery-controls-group hide-on-mobile">
            <label htmlFor="grid-size-slider">Size:</label>
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
            Shuffle 🔀
          </button>
        </div>
        
      </div>

      <div className="gallery-container">
        {/* Sidebar Navigation */}
        <nav className="sidebar">
          <h3>Categories</h3>
          <ul>
            {sortedCategories.map(category => (
              <li key={category}>
                <a href={`#category-${category.replace(/\s+/g, '-')}`}>{category}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content Area */}
        <div className="main-content">
          {viewMode === 'signs' ? (
            sortedCategories.map(category => (
              <div key={category} id={`category-${category.replace(/\s+/g, '-')}`} className="category-section">
                <h2 className="category-title">{category}</h2>
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
            ) : (roadMarkings && roadMarkings.length > 0) ? (
              <div className="category-section">
                <h2 className="category-title">Road Markings</h2>
                <div
                  className="catalogue-grid"
                  style={{
                    gridTemplateColumns: `repeat(auto-fill, minmax(${gridWidth}px, 1fr))`,
                    gap: `${Math.max(0.5, gridWidth / 150)}rem`
                  }}
                >
                  {roadMarkings.map((rm) => (
                    <div key={rm.id || rm.filename} className="sign-card">
                      <LazyImage src={rm.imageUrl || ''} alt={rm.name || rm.id || 'Road Marking'} className="sign-image" style={{ padding: `${Math.max(0.2, gridWidth / 200)}rem`, aspectRatio: '1.6/1' }} />
                      <div className="sign-info">
                        <div className="sign-number" style={{ fontSize: `${Math.max(0.8, gridWidth / 200)}rem` }}>{rm.id || ''}</div>
                        <div className="sign-name" style={{ fontSize: `${Math.max(0.7, gridWidth / 250)}rem` }}>{rm.name || rm.filename || ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-4">Road marking dataset not available yet.</div>
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
                  alt={`Traffic Sign ${selectedSign.signNumber}`}
                  className="modal-image"
                />
                {selectedSign.superseded && (
                  <div className="superseded-stamp" aria-hidden="true">Superseded</div>
                )}
              </div>

              <div className="modal-details">
                <h2 className="modal-title">Traffic Sign {selectedSign.signNumber}</h2>
                <p className="modal-subtitle">{selectedSign.filename}</p>

                <div className="modal-info-section">
                  <h3>Description</h3>
                  <p>{selectedSign.description || 'No description available.'}</p>

                  <h3>Reference No.</h3>
                  <p>{selectedSign.signNumber}</p>
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
