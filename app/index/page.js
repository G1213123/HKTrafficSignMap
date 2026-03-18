import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SignGallery from '../components/SignGallery';
import './gallery.css';

export const metadata = {
  title: 'Index - Road Sign Factory',
  description: 'Browse the Traffic Signs and Road Markings index.',
};

export default function SignIndexPage() {
  return (
    <>
      <Navbar />

      <section className="gallery-page" style={{ paddingTop: '120px' }}>
        <div className="container">
          <div className="page-header">
            <h1 style={{ marginBottom: '0.5rem' }}>Index</h1>
            <p className="muted">Browse, preview and download traffic signs and road markings artwork.</p>
          </div>

          <SignGallery />
        </div>
      </section>

      <Footer />
    </>
  );
}
