'use client';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useI18n } from '../components/I18nProvider';
import './changelog.css';

export default function ChangelogContent() {
  const { t } = useI18n();

  return (
    <>
      <Navbar />
      
      {/* Main Content */}
      <main>
        <section className="changelog-section" style={{ paddingTop: '120px' }}>
          <div className="container">
            <div className="changelog-content">
              {/* Introduction */}
              <div className="changelog-intro">
                <h1>{t('Release History')}</h1>
                <p>{t('Changelog Intro Text')}</p>
              </div>

              {/* Changelog Entries */}
              <div className="changelog-entries">
                
                {/* Version 1.4.0 Release */}
                <article className="changelog-entry major">
                    <div className="changelog-header major">
                        <h3 className="version-tag version-major">Version 1.4.0</h3>
                        <time className="release-date">January 2026</time>
                    </div>
                    <div className="changelog-body">
                        <h4>Street Name Plate, Roundabout & Performance Boost</h4>
                        <p>Added Street Name Plate feature, enhanced roundabout design tools, a new history system, and significant performance improvements.</p>

                        <div className="changelog-note warning" role="note" aria-label="Compatibility notice">
                            <i className="fas fa-triangle-exclamation" aria-hidden="true"></i>
                            <strong>Compatibility:</strong> Project JSON saved in 1.4.0 is not backward compatible with older versions due to format changes in roundabouts.
                        </div>

                        <div className="changelog-categories">
                            <div className="category-section">
                                <h5><i className="fas fa-road"></i> Street Name Plate, Roundabouts & Road Maps</h5>
                                <ul>
                                    <li><strong>Street Name Plates:</strong> Added support for displaying street names on signage with customizable fonts and layouts.</li>
                                    <li><strong>Advanced Roundabouts:</strong> Introduced Spiral, Oval, and Double roundabout types with precise geometry controls.</li>
                                    <li><strong>Side Road Logic:</strong> Enhanced side road attachment logic with better constraints and scaling for complex intersections.</li>
                                    <li><strong>New Symbol:</strong> Added new "Cable Car", "JTIS" and "Tunnel Closed" symbols with improved visual representation.</li>
                                </ul>
                            </div>

                            <div className="category-section">
                                <h5><i className="fas fa-history"></i> Core System & Performance</h5>
                                <ul>
                                    <li><strong>Smart History:</strong> Completely overhauled Undo/Redo system with a detailed action history panel.</li>
                                    <li><strong>Fast Loading:</strong> Optimized font loading system to prioritize critical assets, significantly reducing initial load time.</li>
                                    <li>Smoother upgrade path for existing sign files with legacy roundabout structures.</li>
                                </ul>
                            </div>

                            <div className="category-section">
                                <h5><i className="fas fa-file-export"></i> Export & Content</h5>
                                <ul>
                                    <li>Improved DXF export accuracy for complex path offsets and route angles.</li>
                                    <li>Added "Tunnel Closed" symbol hints.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Version 1.3.0 Release */}
                <article className="changelog-entry major">
                  <div className="changelog-header major">
                    <h3 className="version-tag version-major">Version 1.3.0</h3>
                    <time className="release-date">September 2025</time>
                  </div>
                  <div className="changelog-body">
                    <h4>Internationalization, Text Styling, and Editor Refinements</h4>
                    <p>Expanded language support, new text styling controls, and improvements to border/divider workflows and overall reliability.</p>

                    <div className="changelog-note warning" role="note" aria-label="Compatibility notice">
                      <i className="fas fa-triangle-exclamation" aria-hidden="true"></i>
                      <strong>Compatibility:</strong> Project JSON saved in 1.3.0 is not backward compatible with older versions due to format changes.
                    </div>

                    <div className="changelog-categories">
                      <div className="category-section">
                        <h5><i className="fas fa-language"></i> Internationalization</h5>
                        <ul>
                          <li>Added i18n support across sidebar components and landing pages</li>
                          <li>Introduced language preferences for users</li>
                        </ul>
                      </div>

                      <div className="category-section">
                        <h5><i className="fas fa-border-all"></i> Border & Divider</h5>
                        <ul>
                          <li>Added fixed width/height inputs and improved padding logic for borders</li>
                          <li>Improved movement locking, coordinate calculations, and resize performance</li>
                          <li>Enhanced divider assignment, hover mode, and compartment overlays</li>
                          <li>Relocate underline from divider panel to toggle for text objects</li>
                        </ul>
                      </div>
                      
                      {/* ... truncated minor sections/categories for brevity slightly, keeping main structure ... */}
                      <div className="category-section">
                        <h5><i className="fas fa-question-circle"></i> Hints & UX</h5>
                        <ul>
                            <li>Emphasis styling for prompt keywords with improved handling</li>
                            <li>Updated hints for text, border color, message color, and dividers</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>
                
                {/* ... other versions ... */}
                {/* Version 1.2.0 */}
                <article className="changelog-entry major">
                    <div className="changelog-header major">
                        <h3 className="version-tag version-major">Version 1.2.0</h3>
                        <time className="release-date">June 2025</time>
                    </div>
                    <div className="changelog-body">
                        <h4>Website Structure Overhaul & Documentation</h4>
                        <p>Major website restructuring with new landing page, comprehensive documentation, and critical bug fixes for drawing functionality and autosave system.</p>
                        <div className="changelog-categories">
                            <div className="category-section">
                                <h5><i className="fas fa-home"></i> Website Structure</h5>
                                <ul>
                                    <li>Renamed app.html to design.html and updated all references</li>
                                    <li>Created new homepage with enhanced navigation and visual design</li>
                                    <li>Added About page with project timeline and detailed information</li>
                                    <li>Added Getting Started guide with dynamic JSON loading and tutorials</li>
                                    <li>Added changelog page with structured release history</li>
                                    <li>Implemented common fade-in animation system across all pages</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Future Updates */}
                <article className="changelog-entry upcoming" id="upcoming">
                  <div className="changelog-header">
                    <h3 className="version-tag version-beta">{t('Upcoming Features')}</h3>
                    <time className="release-date">{t('In Development')}</time>
                  </div>
                  <div className="changelog-body">
                    <h4>{t('Future Improvements')}</h4>
                    <p>{t("We're continuously working on improving Road Sign Factory. Here are some features and improvements we're considering for future releases.")}</p>

                    <div className="changelog-categories">
                      <div className="category-section">
                        <h5><i className="fas fa-plus-circle"></i> {t('Planned Features')}</h5>
                        <ul>
                          <li>{t('Language support for traditional Chinese')}</li>
                          <li>{t('Hint for sign creation best practices')}</li>
                          <li>{t('Extended symbol and template libraries')}</li>
                          <li>{t('Export DXF function optimized for font character')}</li>
                          <li>{t('Redo and Undo function optimization')}</li>
                          <li>{t('Unit tests and integration tests')}</li>
                          <li>{t('Documentation of codebase')}</li>
                          <li>{t('AI tools to assist with sign design')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              {/* Call to Action */}
              <div className="changelog-cta">
                <h3>{t('Stay Updated')}</h3>
                <p>{t('Stay Updated Description')}</p>
                <div className="cta-buttons">
                  <a href="https://github.com/G1213123/TrafficSign" target="_blank" className="btn btn-primary">
                    <i className="fab fa-github"></i> <span>{t('Follow on GitHub')}</span>
                  </a>
                  <Link href="/design" className="btn btn-secondary">
                    <i className="fas fa-rocket"></i> <span>{t('Try the App')}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}