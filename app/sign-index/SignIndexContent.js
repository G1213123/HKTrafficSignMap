'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SignGallery from '../components/SignGallery';
import { useI18n } from '../components/I18nProvider';
import './gallery.css';

export default function SignIndexContent() {
  const { t } = useI18n();

  return (
    <>
      <Navbar />

      <section className="gallery-page" style={{ paddingTop: '120px' }}>
        <div className="container">
          <div className="page-header">
            <h1 style={{ marginBottom: '0.5rem' }}>{t('Index')}</h1>
            <p className="muted" style={{ marginBottom: '0.2rem' }}>{t('Browse, preview and download traffic signs and road markings artwork.')}</p>
            <p style={{ fontSize: '0.85rem', color: '#6c757d', margin: '0' }}>
              {t('Data provided by')} <a href="https://portal.csdi.gov.hk/" target="_blank" rel="noreferrer" style={{ color: '#0056b3', textDecoration: 'underline' }}>HKSAR CSDI Portal</a>. <a href="#data-disclaimer" style={{ color: '#0056b3', textDecoration: 'underline', cursor: 'pointer' }}>{t('View terms of use')}</a>.
            </p>
          </div>

          <SignGallery />
          
          <div id="data-disclaimer" className="csdi-disclaimer" style={{ 
            marginTop: '40px', 
            padding: '24px', 
            background: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            color: '#6c757d',
            fontSize: '0.85rem'
          }}>
            <h3 style={{ fontSize: '1rem', color: '#495057', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#0d6efd' }}></i>
              {t('Data Attribution & Terms of Use')}
            </h3>
            <p style={{ marginBottom: '12px' }}>
              {t('Traffic signs and road marking data used in this index are provided by the Government of the Hong Kong Special Administrative Region via the Common Spatial Data Infrastructure (CSDI) Portal.')}
            </p>
            <p style={{ margin: 0 }}>
              {t('The Government and relevant organisations are the owners of the intellectual property rights in the Data. You are allowed to browse, download, and use the Data provided you comply with the CSDI Portal Terms of Use. By using this data, you agree to indemnify the Government and relevant organisations against any allegations, claims of infringement, costs, losses, or damages arising directly or indirectly in relation to your use, reproduction, and/or distribution of the Data.')}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}