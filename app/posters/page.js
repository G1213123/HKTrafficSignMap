import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PosterGallery from './PosterGallery';
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

          <PosterGallery />

        </div>
      </section>

      <Footer />
    </>
  );
}