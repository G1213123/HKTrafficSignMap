import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SignGallery from '../components/SignGallery';
import './gallery.css';

export const metadata = {
  title: 'Gallery - Road Sign Factory',
  description: 'Browse the traffic sign gallery.',
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />

      <section className="gallery-page" style={{ paddingTop: '120px' }}>
        <div className="container">
          <div className="page-header">
            <h1 style={{ marginBottom: '0.5rem' }}>Traffic Sign Gallery</h1>
            <p className="muted">Browse, preview and download sign artwork.</p>
          </div>

          <SignGallery />
        </div>
      </section>

      <Footer />
    </>
  );
}
