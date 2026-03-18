import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './posters.css';

export const metadata = {
  title: 'Posters - Road Sign Factory',
  description: 'Download high-quality traffic sign posters created with Road Sign Factory.',
  keywords: 'traffic sign posters, road sign downloads, Hong Kong traffic signs, vector signs',
};

export default function Posters() {
  return (
    <>
      <Navbar />
      
      {/* Posters Section */}
      <section className="posters-section">
        <div className="posters-container">
          <h1 className="section-title" data-i18n="Featured Posters">Featured Posters</h1>
          <p className="section-subtitle" data-i18n="Browse our collection of traffic signs posters.">Browse our collection of traffic signs posters.</p>

          <div className="posters-grid">
            {/* Poster 1 */}
            <div className="poster-card">
              <div className="poster-preview">
                <img src="/images/CKB EB.png" alt="Poster 1 Preview" />
              </div>
              <div className="poster-info">
                <h3 className="poster-title" data-i18n="Central Kowloon Bypass Eastbound">Central Kowloon Bypass Eastbound</h3>
                <p className="poster-description" data-i18n="A map of directional signs in Central Kowloon Bypass Eastbound.">A map of directional signs in Central Kowloon Bypass Eastbound.</p>
                <div className="poster-actions">
                  <a href="/images/CKB EB.png" download className="btn-download" data-i18n="Download Full Size">
                    <i className="fas fa-download"></i> <span data-i18n="Download">Download</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Poster 2 */}
            <div className="poster-card">
              <div className="poster-preview">
                <img src="/images/CKB WB.png" alt="Poster 2 Preview" />
              </div>
              <div className="poster-info">
                <h3 className="poster-title" data-i18n="Central Kowloon Bypass Westbound">Central Kowloon Bypass Westbound</h3>
                <p className="poster-description" data-i18n="A map of directional signs in Central Kowloon Bypass Westbound.">A map of directional signs in Central Kowloon Bypass Westbound.</p>
                <div className="poster-actions">
                  <a href="/images/CKB WB.png" download className="btn-download" data-i18n="Download Full Size">
                    <i className="fas fa-download"></i> <span data-i18n="Download">Download</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}