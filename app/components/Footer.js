'use client';
import Link from 'next/link';
import { useI18n } from './I18nProvider';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 data-i18n="Road Sign Factory">{t('Road Sign Factory')}</h3>
            <p data-i18n="Professional traffic sign design tool for modern web browsers.">{t('Professional traffic sign design tool for modern web browsers.')}</p>
            <div className="social-links">
              <a href="https://github.com/G1213123/TrafficSign" target="_blank" rel="noreferrer" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.threads.net/@ginger_n_1213" target="_blank" rel="noreferrer" aria-label="Threads">
                <i className="fa-brands fa-threads"></i>
              </a>
              <a href="mailto:enquiry@roadsignfactory.hk" aria-label="Email">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <a href="mailto:enquiry@roadsignfactory.hk" style={{ color: 'var(--footer-muted)', textDecoration: 'none' }}>
                enquiry@roadsignfactory.hk
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 data-i18n="Quick Links">{t('Quick Links')}</h4>
            <ul>
              <li><Link href="/" data-i18n="Home">{t('Home')}</Link></li>
              <li><Link href="/getting-started" data-i18n="Getting Started">{t('Getting Started')}</Link></li>
              <li><Link href="/about" data-i18n="About">{t('About')}</Link></li>
              <li><Link href="/changelog" data-i18n="Changelog">{t('Changelog')}</Link></li>
              <li><Link href="/sign-index" data-i18n="Sign Index">{t('Sign Index')}</Link></li>
              <li><Link href="/posters" data-i18n="Posters">{t('Posters')}</Link></li>
              <li><a href="https://github.com/G1213123/TrafficSign" target="_blank" rel="noreferrer" data-i18n="GitHub">{t('GitHub')}</a></li>
              <li><a href="/design" className="footer-launch-link" data-i18n="Launch App">{t('Launch App')}</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 data-i18n="Resources">{t('Resources')}</h4>
            <ul>
              <li><a href="https://www.td.gov.hk/en/publications_and_press_releases/publications/tpdm/index.html" target="_blank" rel="noreferrer" data-i18n="HK TPDM Guidelines">{t('HK TPDM Guidelines')}</a></li>
              <li><a href="https://www.gov.uk/government/publications/traffic-signs-manual" target="_blank" rel="noreferrer" data-i18n="UK Traffic Signs Manual">{t('UK Traffic Signs Manual')}</a></li>
              <li><Link href="/changelog" data-i18n="Changelog">{t('Changelog')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 data-i18n="Support">{t('Support')}</h4>
            <p data-i18n="Help support this project:">{t('Help support this project:')}</p>
            <a href="https://www.buymeacoffee.com/G1213123" target="_blank" rel="noreferrer" className="coffee-button">
              <img src="https://cdn.buymeacoffee.com/buttons/default-blue.png" alt="Buy Me A Coffee" height="32" />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <p data-i18n="Footer Disclaimer 1">{t('Footer Disclaimer 1')}</p>
            <p className="disclaimer" data-i18n="Footer Disclaimer 2">{t('Footer Disclaimer 2')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}