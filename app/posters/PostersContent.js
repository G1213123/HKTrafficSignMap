'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PosterGallery from './PosterGallery';
import { useI18n } from '../components/I18nProvider';
import './posters.css';

export default function PostersContent() {
  const { t } = useI18n();

  return (
    <>
      <Navbar />
      
      {/* Posters Section */}
      <section className="posters-section">
        <div className="posters-container">
          <h1 className="section-title">{t('Featured Posters')}</h1>
          <p className="section-subtitle">{t('Browse our collection of traffic signs posters.')}</p>

          <PosterGallery />

        </div>
      </section>

      <Footer />
    </>
  );
}