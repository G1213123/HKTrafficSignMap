import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 data-i18n="Road Sign Factory">Road Sign Factory</h3>
            <p data-i18n="Professional traffic sign design tool for modern web browsers.">Professional traffic sign design tool for modern web browsers.</p>
            <div className="social-links">
              <a href="https://github.com/G1213123/TrafficSign" target="_blank" rel="noreferrer" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.threads.net/@ginger_n_1213" target="_blank" rel="noreferrer" aria-label="Threads">
                <i className="fa-brands fa-threads"></i>
              </a>
              <a href="mailto:enquiry@g1213123.info" aria-label="Email">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 data-i18n="Quick Links">Quick Links</h4>
            <ul>
              <li><Link href="/" data-i18n="Home">Home</Link></li>
              <li><Link href="/getting-started" data-i18n="Getting Started">Getting Started</Link></li>
              <li><Link href="/about" data-i18n="About">About</Link></li>
              <li><Link href="/changelog" data-i18n="Changelog">Changelog</Link></li>
              <li><Link href="/sign-index" data-i18n="Sign Index">Sign Index</Link></li>
              <li><Link href="/posters" data-i18n="Posters">Posters</Link></li>
              <li><a href="https://github.com/G1213123/TrafficSign" target="_blank" rel="noreferrer" data-i18n="GitHub">GitHub</a></li>
              <li><a href="/design.html" className="footer-launch-link" data-i18n="Launch App">Launch App</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 data-i18n="Resources">Resources</h4>
            <ul>
              <li><a href="https://www.td.gov.hk/en/publications_and_press_releases/publications/tpdm/index.html" target="_blank" rel="noreferrer" data-i18n="HK TPDM Guidelines">HK TPDM Guidelines</a></li>
              <li><a href="https://www.gov.uk/government/publications/traffic-signs-manual" target="_blank" rel="noreferrer" data-i18n="UK Traffic Signs Manual">UK Traffic Signs Manual</a></li>
              <li><Link href="/changelog" data-i18n="Changelog">Changelog</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 data-i18n="Support">Support</h4>
            <p data-i18n="Help support this project:">Help support this project:</p>
            <a href="https://www.buymeacoffee.com/G1213123" target="_blank" rel="noreferrer" className="coffee-button">
              <img src="https://cdn.buymeacoffee.com/buttons/default-blue.png" alt="Buy Me A Coffee" height="32" />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <p>&copy; 2025 Road Sign Factory. Open source project.</p>
            <p className="disclaimer">This application is under development and not affiliated with government authorities. Users are responsible for ensuring compliance with local regulations.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}