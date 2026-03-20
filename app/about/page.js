import Link from 'next/link';
import './about.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'About - Road Sign Factory',
  description: 'Learn about Road Sign Factory, a professional traffic sign design tool based on Hong Kong TPDM standards.',
  keywords: 'about road sign creator, traffic sign designer, Hong Kong TPDM, professional sign design, about us',
};

export default function About() {
  return (
    <>
      <Navbar />
      
      {/* About Section */}
      <section className="about" style={{ paddingTop: '120px' }}>
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }} data-i18n="About Road Sign Factory">About Road Sign Factory</h1>
              <div className="intro-text">
                <p data-i18n="About Intro Text">Road Sign Factory provides traffic engineers, designers, and enthusiasts with a standards-compliant tool for creating professional road signage. It is a web service built and served to meet the modern needs for generating quality designs.</p>
              </div>

              <div className="about-intro-section">
                <div className="about-intro-content">
                  <h3 data-i18n="Key features:">Key features:</h3>
                  <div className="about-features">
                    <div className="about-feature">
                      <i className="fas fa-check-circle"></i>
                      <span data-i18n-html="feature_comply_tpdm_html">Comply to Hong Kong <span className="tpdm-tooltip" data-tooltip="Transport Planning and Design Manual">TPDM</span></span>
                    </div>
                    <div className="about-feature">
                      <i className="fas fa-check-circle"></i>
                      <span data-i18n="feature_export_quality">Professional Export Quality</span>
                    </div>
                    <div className="about-feature">
                      <i className="fas fa-check-circle"></i>
                      <span data-i18n="feature_no_install">No Installation Required</span>
                    </div>
                    <div className="about-feature">
                      <i className="fas fa-check-circle"></i>
                      <span data-i18n-html="feature_interactive_uiux_html">Interactive and Responsive <span className="tpdm-tooltip" data-tooltip="User Interface / User Experience">UI/UX</span></span>
                    </div>
                    <div className="about-feature">
                      <i className="fas fa-check-circle"></i>
                      <span data-i18n-html="feature_cad_html"><span className="tpdm-tooltip" data-tooltip="Computer Aided Design">CAD</span> Tool Grade Functionality</span>
                    </div>
                    <div className="about-feature">
                      <i className="fas fa-check-circle"></i>
                      <span data-i18n="feature_open_source">Open Source & Free</span>
                    </div>
                    <div className="about-feature">
                      <i className="fas fa-check-circle"></i>
                      <span data-i18n="feature_save_autosave">Save & Load with Auto-Save</span>
                    </div>
                  </div>
                </div>

                <div className="intro-image">
                  <img src="/images/about-illustration.svg" alt="Professional sign design illustration" loading="lazy" className="invert-in-dark" />
                </div>
              </div>

              <div className="timeline-section">
                <h3 data-i18n="Development Timeline">Development Timeline</h3>
                <div className="timeline-intro">
                  <p data-i18n-html="Timeline Intro Text">Traditionally, traffic signs are designed by professional engineers as a package of a roadworks project with <span className="tpdm-tooltip" data-tooltip="Computer Aided Design">CAD</span>. While <span className="tpdm-tooltip" data-tooltip="Computer Aided Design">CAD</span> is powerful in generating detailed drawings, characters and symbols must still be drawn carefully block by block, stroke by stroke. Sign making was like a renaissance of old technology <a href="https://en.wikipedia.org/wiki/Movable_type"> Movable Printing Press</a> in modern times. A need to speed up the design process within a tight project timeframe is called. This application is the result of seeking a modern and streamlined workflow for road sign design.</p>
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
                        <span className="timeline-status status-concept" data-i18n="Initial Idea">Initial Idea</span>
                      </div>
                      <div className="timeline-title" data-i18n="First Concept">First Concept</div>
                      <div className="timeline-description" data-i18n="Timeline Apr 2022 Desc">The original idea for Road Sign Factory was conceived as a solution for creating professional traffic signage with modern web technologies. The project was shelved after prototyping due to the technical difficulties encounter when prototyping.</div>
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
                        <span className="timeline-status status-research" data-i18n="TPDM Release">TPDM Release</span>
                      </div>
                      <div className="timeline-title" data-i18n="HKSAR TPDM Public Release">HKSAR TPDM Public Release</div>
                      <div className="timeline-description" data-i18n="Timeline May 2024 Desc">Transport Department of HKSAR publicly released the Traffic Signs and Road Markings Manual (TPDM), providing comprehensive standards and guidelines that became the foundation for professional traffic sign design.</div>
                    </div>
                  </div> 
                  {/* 2025 Jan - Project Restart */}
                  <div className="timeline-item">
                    <div className="timeline-icon">
                      <i className="fas fa-code"></i>
                    </div>
                    <div className="timeline-content timeline-content-dir">
                      <div className="timeline-year">January 2025
                        <span className="timeline-status status-development" data-i18n="Restart">Restart</span>
                      </div>
                      <div className="timeline-title" data-i18n="Project Revival & Development">Project Revival & Development</div>
                      <div className="timeline-description" data-i18n="Timeline Jan 2025 Desc">After a period of dormancy, the project was restarted with renewed focus and intensive development efforts to build the complete application.</div>
                    </div>
                  </div> 
                  {/* 2025 Feb - AI Boom */}
                  <div className="timeline-item">
                    <div className="timeline-icon">
                      <i className="fas fa-robot"></i>
                    </div>
                    <div className="timeline-content timeline-content-dir">
                      <div className="timeline-year">February 2025
                        <span className="timeline-status status-innovation" data-i18n="AI Boom">AI Boom</span>
                      </div>
                      <div className="timeline-title" data-i18n="AI-Powered Vibe Coding Era">AI-Powered Vibe Coding Era</div>
                      <div className="timeline-description" data-i18n="Timeline Feb 2025 Desc">The AI revolution transformed development workflows with advanced coding assistants, enabling rapid prototyping and intuitive "vibe-based" programming approaches that accelerated the project significantly.</div>
                    </div>
                  </div> 
                  {/* 2025 May - First Public Prototype */}
                  <div className="timeline-item">
                    <div className="timeline-icon">
                      <i className="fas fa-rocket"></i>
                    </div>
                    <div className="timeline-content timeline-content-dir">
                      <div className="timeline-year">May 2025
                        <span className="timeline-status status-beta" data-i18n="Public Prototype">Public Prototype</span>
                      </div>
                      <div className="timeline-title" data-i18n="First Public Release">First Public Release</div>
                      <div className="timeline-description" data-i18n="Timeline May 2025 Desc">The first public prototype was released, marking a major milestone with a functional traffic sign design tool available to users worldwide.</div>
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
                      <div className="timeline-year" data-i18n="Future">Future
                        <span className="timeline-status status-future" data-i18n="Ongoing">Ongoing</span>
                      </div>
                      <div className="timeline-title" data-i18n="Continuous Enhancement">Continuous Enhancement</div>
                      <div className="timeline-description" data-i18n-html="Timeline Future Desc">Ongoing development with regular updates, new features, and improvements based on user feedback. See our <Link href="/changelog#upcoming">planned feature list</Link>.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="about-detailed">
                <h3 data-i18n="Technical Information">Technical Information</h3>
                <p data-i18n-html="Tech Info P1">Road Sign Factory is built using modern web technologies including HTML5 Canvas, JavaScript ES6+, and responsive CSS. The application uses the <a href="https://fabricjs.com/" target="_blank" rel="noopener noreferrer">Fabric.js</a> library for advanced canvas manipulation and supports vector graphics export through SVG generation.</p>
                <p data-i18n="Tech Info P2">The application features an intelligent save system that automatically stores your work in the browser's local storage, preventing data loss. Additionally, manual save and load functionality allows you to manage multiple projects and create backups of your designs.</p>
                <p data-i18n-html="Tech Info P3">The export function supports multiple file formats including PNG (raster), SVG (vector), PDF (document), and DXF (CAD). PDF export is handled using the <a href="https://github.com/MrRio/jsPDF" target="_blank" rel="noopener noreferrer">jsPDF</a> library, which converts the canvas content to high-quality PDF documents suitable for printing and sharing. DXF export is powered by the <a href="https://github.com/tarikjabiri/js-dxf" target="_blank" rel="noopener noreferrer">dxf-writer</a> library, with the aids of <a href="http://paperjs.org/" target="_blank" rel="noopener noreferrer">paper.js</a> for path processing, enabling seamless integration with professional CAD software and engineering workflows.</p>
              </div>

              <div className="about-buttons">
                <a href="https://github.com/G1213123/TrafficSign" className="btn btn-outline" target="_blank">
                  <i className="fab fa-github"></i>
                  <span data-i18n="View on GitHub">View on GitHub</span>
                </a>
                <a href="mailto:enquiry@g1213123.info" className="btn btn-outline">
                  <i className="fas fa-envelope"></i>
                  <span data-i18n="Contact Us">Contact Us</span>
                </a>
                <a href="/design" className="btn btn-primary">
                  <i className="fas fa-play"></i>
                  <span data-i18n="Launch Application">Launch Application</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
