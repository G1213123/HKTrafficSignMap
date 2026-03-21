'use client';
import Link from 'next/link';
import './about.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useI18n } from '../components/I18nProvider';

export default function AboutContent() {
  const { t } = useI18n();

  return (
    <>
      <Navbar />
      
      {/* About Section */}
      <section className="about" style={{ paddingTop: '120px' }}>
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>{t('About Road Sign Factory')}</h1>
              <div className="intro-text">
                <p>{t('About Intro Text')}</p>
              </div>

              <div className="about-intro-section">
                <div className="about-intro-content">
                  <h3>{t('Key features:')}</h3>
                  <div className="about-features">
                    <div className="about-feature">
                      <i className="fas fa-check-circle"></i>
                      <span dangerouslySetInnerHTML={{ __html: t('feature_comply_tpdm_html') }}></span>
                    </div>
                    <div className="about-feature">
                      <i className="fas fa-check-circle"></i>
                      <span>{t('feature_export_quality')}</span>
                    </div>
                    <div className="about-feature">
                      <i className="fas fa-check-circle"></i>
                      <span>{t('feature_no_install')}</span>
                    </div>
                    <div className="about-feature">
                      <i className="fas fa-check-circle"></i>
                      <span dangerouslySetInnerHTML={{ __html: t('feature_interactive_uiux_html') }}></span>
                    </div>
                    <div className="about-feature">
                      <i className="fas fa-check-circle"></i>
                      <span dangerouslySetInnerHTML={{ __html: t('feature_cad_html') }}></span>
                    </div>
                    <div className="about-feature">
                      <i className="fas fa-check-circle"></i>
                      <span>{t('feature_open_source')}</span>
                    </div>
                    <div className="about-feature">
                      <i className="fas fa-check-circle"></i>
                      <span>{t('feature_save_autosave')}</span>
                    </div>
                  </div>
                </div>

                <div className="intro-image">
                  <img src="/images/about-illustration.svg" alt="Professional sign design illustration" loading="lazy" className="invert-in-dark" />
                </div>
              </div>

              <div className="timeline-section">
                <h3>{t('Development Timeline')}</h3>
                <div className="timeline-intro">
                  <p dangerouslySetInnerHTML={{ __html: t('Timeline Intro Text') }}></p>
                  <div className="timeline-image">
                    <img src="/images/timeline-banner.png" alt="Traditional engineering drawing for traffic sign" loading="lazy" />
                  </div>
                </div>
                <div className="timeline"> 
                  {/* 2022 - Initial Idea */}
                  <div className="timeline-item">
                    <div className="timeline-icon">
                      <i className="fas fa-lightbulb"></i>
                    </div>
                    <div className="timeline-content timeline-content-dir">
                      <div className="timeline-year">April 2022
                        <span className="timeline-status status-concept">{t('Initial Idea')}</span>
                      </div>
                      <div className="timeline-title">{t('First Concept')}</div>
                      <div className="timeline-description">{t('Timeline Apr 2022 Desc')}</div>
                      <div className="timeline-image" data-tooltip="Early concept sketches and planning documents showing the initial vision for a web-based traffic sign design tool">
                        <img src="/images/timeline-apr2024.png" alt="2022 Initial Concept - Early sketches and planning documents" loading="lazy" />
                      </div>
                    </div>
                  </div> 
                  {/* 2024 - Research & Planning */}
                  <div className="timeline-item">
                    <div className="timeline-icon">
                      <i className="fas fa-search"></i>
                    </div>
                    <div className="timeline-content timeline-content-dir">
                      <div className="timeline-year">May 2024
                        <span className="timeline-status status-research">{t('TPDM Release')}</span>
                      </div>
                      <div className="timeline-title">{t('HKSAR TPDM Public Release')}</div>
                      <div className="timeline-description">{t('Timeline May 2024 Desc')}</div>
                    </div>
                  </div> 
                  {/* 2025 Jan - Project Restart */}
                  <div className="timeline-item">
                    <div className="timeline-icon">
                      <i className="fas fa-code"></i>
                    </div>
                    <div className="timeline-content timeline-content-dir">
                      <div className="timeline-year">January 2025
                        <span className="timeline-status status-development">{t('Restart')}</span>
                      </div>
                      <div className="timeline-title">{t('Project Revival & Development')}</div>
                      <div className="timeline-description">{t('Timeline Jan 2025 Desc')}</div>
                    </div>
                  </div> 
                  {/* 2025 Feb - AI Boom */}
                  <div className="timeline-item">
                    <div className="timeline-icon">
                      <i className="fas fa-robot"></i>
                    </div>
                    <div className="timeline-content timeline-content-dir">
                      <div className="timeline-year">February 2025
                        <span className="timeline-status status-innovation">{t('AI Boom')}</span>
                      </div>
                      <div className="timeline-title">{t('AI-Powered Vibe Coding Era')}</div>
                      <div className="timeline-description">{t('Timeline Feb 2025 Desc')}</div>
                    </div>
                  </div> 
                  {/* 2025 May - First Public Prototype */}
                  <div className="timeline-item">
                    <div className="timeline-icon">
                      <i className="fas fa-rocket"></i>
                    </div>
                    <div className="timeline-content timeline-content-dir">
                      <div className="timeline-year">May 2025
                        <span className="timeline-status status-beta">{t('Public Prototype')}</span>
                      </div>
                      <div className="timeline-title">{t('First Public Release')}</div>
                      <div className="timeline-description">{t('Timeline May 2025 Desc')}</div>
                      <div className="timeline-image" data-tooltip="First public prototype interface showing the basic sign design functionality, symbol library, and export features">
                        <img src="/images/timeline-may2025.png" alt="May 2025 Prototype - First public release interface screenshot" loading="lazy" />
                      </div>
                    </div>
                  </div> 
                  {/* Future - Continuous Enhancement */}
                  <div className="timeline-item">
                    <div className="timeline-icon">
                      <i className="fas fa-infinity"></i>
                    </div>
                    <div className="timeline-content timeline-content-dir">
                      <div className="timeline-year">{t('Future')}
                        <span className="timeline-status status-future">{t('Ongoing')}</span>
                      </div>
                      <div className="timeline-title">{t('Continuous Enhancement')}</div>
                      <div className="timeline-description" dangerouslySetInnerHTML={{ __html: t('Timeline Future Desc') }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="about-detailed">
                <h3>{t('Technical Information')}</h3>
                <p dangerouslySetInnerHTML={{ __html: t('Tech Info P1') }}></p>
                <p>{t('Tech Info P2')}</p>
                <p dangerouslySetInnerHTML={{ __html: t('Tech Info P3') }}></p>
              </div>

              <div className="about-buttons">
                <a href="https://github.com/G1213123/TrafficSign" className="btn btn-outline" target="_blank">
                  <i className="fab fa-github"></i>
                  <span>{t('View on GitHub')}</span>
                </a>
                <a href="mailto:enquiry@g1213123.info" className="btn btn-outline">
                  <i className="fas fa-envelope"></i>
                  <span>{t('Contact Us')}</span>
                </a>
                <Link href="/design" className="btn btn-primary">
                  <i className="fas fa-play"></i>
                  <span>{t('Launch Application')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}