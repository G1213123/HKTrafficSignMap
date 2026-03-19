'use client';

import { useState } from 'react';

const POSTERS = [
  {
    id: 1,
    title: "Central Kowloon Bypass Eastbound",
    description: "A map of directional signs in Central Kowloon Bypass Eastbound.",
    imageUrl: "/images/CKB EB.png",
    alt: "Poster 1 Preview"
  },
  {
    id: 2,
    title: "Central Kowloon Bypass Westbound",
    description: "A map of directional signs in Central Kowloon Bypass Westbound.",
    imageUrl: "/images/CKB WB.png",
    alt: "Poster 2 Preview"
  }
];

export default function PosterGallery() {
  const [selectedPoster, setSelectedPoster] = useState(null);

  const openPoster = (poster) => {
    setSelectedPoster(poster);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closePoster = () => {
    setSelectedPoster(null);
    document.body.style.overflow = ''; // Restore scrolling
  };

  return (
    <>
      <div className="posters-grid">
        {POSTERS.map((poster) => (
          <div key={poster.id} className="poster-card">
            <div className="poster-preview" onClick={() => openPoster(poster)} style={{ cursor: 'pointer' }}>
              <img src={poster.imageUrl} alt={poster.alt} loading="lazy" />
              <div className="poster-zoom-hint">
                <i className="fas fa-search-plus"></i>
              </div>
            </div>
            <div className="poster-info">
              <h3 className="poster-title" data-i18n={poster.title}>{poster.title}</h3>
              <p className="poster-description" data-i18n={poster.description}>{poster.description}</p>
              <div className="poster-actions">
                <a href={poster.imageUrl} download className="btn-download" data-i18n="Download Full Size" onClick={(e) => e.stopPropagation()}>
                  <i className="fas fa-download"></i> <span data-i18n="Download">Download</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal/Lightbox */}
      {selectedPoster && (
        <div className="poster-modal" onClick={closePoster}>
          <div className="poster-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="poster-modal-header">
                <h3 className="poster-modal-title">{selectedPoster.title}</h3>
                <button className="poster-modal-close" onClick={closePoster}>&times;</button>
            </div>
            <div className="poster-modal-body">
                <img src={selectedPoster.imageUrl} alt={selectedPoster.alt} className="poster-modal-image" />
            </div>
            <div className="poster-modal-footer">
                <a href={selectedPoster.imageUrl} download className="btn-download-modal">
                    <i className="fas fa-download"></i> Download Original
                </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
