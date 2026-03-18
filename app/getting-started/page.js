'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './getting-started.css';

export default function GettingStarted() {
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [expandedJson, setExpandedJson] = useState({});
  const [copiedStates, setCopiedStates] = useState({});

  const toggleJsonDisplay = (id) => {
    setExpandedJson(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyJsonToClipboard = (elementId, jsonId) => {
    // Mock copy functionality since we don't have the actual JSON data loaded yet
    // In a real app, you'd fetch the JSON or have it available
    const codeElement = document.getElementById(elementId);
    if (codeElement) {
        navigator.clipboard.writeText(codeElement.innerText).then(() => {
            setCopiedStates(prev => ({ ...prev, [jsonId]: true }));
            setTimeout(() => {
                setCopiedStates(prev => ({ ...prev, [jsonId]: false }));
            }, 2000);
        });
    }
  };

  const TutorialBlock = ({ id, videoSrc, imageSrc, title, description, jsonId, jsonFile }) => {
    const isHovered = activeTutorial === id;
    
    return (
      <div className="tutorial-section" style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }} data-i18n={`Example of ${title}`}>Example of {title}</h3>
        </div>
        <div className="tutorial-grid">
          {/* Video Column */}
          <div>
            <div 
              className={`video-placeholder ${isHovered ? 'active' : ''}`}
              data-tutorial={id}
              onMouseEnter={() => setActiveTutorial(id)}
              onMouseLeave={() => setActiveTutorial(null)}
            >
              <video controls style={{ width: '100%', maxWidth: '500px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                <source src={videoSrc} type="video/mp4" />
                <p data-i18n="Your browser does not support the video tag.">Your browser does not support the video tag.</p>
              </video>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p><strong>{title} Tutorial</strong></p>
              </div>
            </div>
          </div>
          
          {/* Image Column */}
          <div>
            <div 
              className={`image-placeholder ${isHovered ? 'active' : ''}`}
              data-example={id}
              onMouseEnter={() => setActiveTutorial(id)}
              onMouseLeave={() => setActiveTutorial(null)}
            >
              <img src={imageSrc} alt={`${title} example`} />
              <p><strong>{title} Example</strong></p>
            </div>
          </div>
        </div>

        {/* JSON Display Box */}
        <div className="json-display-container">
          <div className="json-display-header" onClick={() => toggleJsonDisplay(jsonId)}>
            <div className="json-display-title">
              <i className="fas fa-code"></i>
              <span data-i18n="View JSON Template">View JSON Template</span>
            </div>
            <button className="json-display-toggle">
              <i className={`fas fa-chevron-down ${expandedJson[jsonId] ? 'fa-rotate-180' : ''}`} id={`${jsonId}-icon`}></i>
              <span data-i18n="Show Code">Show Code</span>
            </button>
          </div>
          <div className={`json-display-content ${expandedJson[jsonId] ? 'expanded' : ''}`} id={jsonId}>
            <div className="json-display-description">
              <i className="fas fa-info-circle"></i>
              <strong data-i18n="How to use:">How to use:</strong> <span data-i18n="Copy the JSON code below and paste it into the Road Sign Factory app using the Import function to load this example sign.">Copy the JSON code below and paste it into the Road Sign Factory app using the Import function to load this example sign.</span>
            </div>
            <div className="json-code-container">
              <button 
                className={`copy-json-btn ${copiedStates[jsonId] ? 'copied' : ''}`} 
                onClick={() => copyJsonToClipboard(`${jsonId}-code`, jsonId)}
              >
                <i className="fas fa-copy"></i>
                <span>{copiedStates[jsonId] ? 'Copied!' : 'Copy All'}</span>
              </button>
              <pre className="json-code" id={`${jsonId}-code`} data-json-file={jsonFile}>
                <div className="json-loading">
                   {/* Placeholder for actual JSON content which would optionally be fetched */}
                   {"{ \n  \"type\": \"sign\", \n  \"version\": \"1.0.0\", \n  \"elements\": [] \n}"} 
                </div>
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="getting-started-hero">
        <div className="container">
          <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }} data-i18n="Getting Started Guide">Getting Started Guide</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }} data-i18n="Learn how to create professional traffic signs with our powerful design tool">Learn how to create professional traffic signs with our powerful design tool</p>
          <a href="/design.html" className="btn btn-outline" style={{ background: 'white', color: 'var(--primary-color)' }}>
            <i className="fas fa-play"></i>
            <span data-i18n="Launch Application">Launch Application</span>
          </a>
        </div>
      </section>

      {/* Main Content */}
      <section className="getting-started-content">
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="section-title" data-i18n="Welcome to Road Sign Factory">Welcome to Road Sign Factory</h2>
            <p className="section-subtitle" data-i18n="Follow our step-by-step tutorials to master traffic sign design">Follow our step-by-step tutorials to master traffic sign design</p>
          </div>

          {/* 4-Step Visual Guide (simplified structure compared to original huge HTML block, using Grid) */}
          <div style={{ marginBottom: '5rem' }}>
            <div className="steps-grid">
               {/* Step 1 */}
               <div className="step-card" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0.12) 100%)', borderColor: 'rgba(37, 99, 235, 0.2)' }}>
                  <div className="step-number" style={{ background: 'var(--primary-color)' }}>1</div>
                  <h3>Launch Application</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Open the Road Sign Factory application and explore the intuitive side panel interface and grid canvas designed for precision and ease of use.</p>
                  <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                     <img src="/images/getting-start-1.png" alt="Launch Application" style={{ width: '100%', maxWidth: '200px', objectFit: 'contain', borderRadius: '16px', border: '2px solid rgba(37, 99, 235, 0.3)' }} />
                  </div>
               </div>
               
               {/* Step 2 */}
               <div className="step-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.12) 100%)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                  <div className="step-number" style={{ background: 'var(--success-color)' }}>2</div>
                  <h3>Choose Template</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Select from our comprehensive template library or start from scratch. Add text, routes, symbols, and shapes using our powerful editing tools.</p>
                  <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                     <img src="/images/getting-start-2.png" alt="Choose Template" style={{ width: '100%', maxWidth: '200px', objectFit: 'contain', borderRadius: '16px', border: '2px solid rgba(16, 185, 129, 0.3)' }} />
                  </div>
               </div>

               {/* Step 3 */}
               <div className="step-card" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.12) 100%)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                  <div className="step-number" style={{ background: 'var(--accent-color)' }}>3</div>
                  <h3>Snap & Lock Shape</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Use precision controls and snapping features to position elements accurately. Lock shapes in place to prevent accidental movement during design.</p>
                  <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                     <img src="/images/getting-start-3.png" alt="Snap & Lock Shape" style={{ width: '100%', maxWidth: '200px', objectFit: 'contain', borderRadius: '16px', border: '2px solid rgba(245, 158, 11, 0.3)' }} />
                  </div>
               </div>

               {/* Step 4 */}
               <div className="step-card" style={{ background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08) 0%, rgba(139, 69, 19, 0.12) 100%)', borderColor: 'rgba(139, 69, 19, 0.2)' }}>
                  <div className="step-number" style={{ background: '#8b4513' }}>4</div>
                  <h3>Frame with Border</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Add professional borders with auto-calculated padding and styling. Choose from various border types to frame your content perfectly.</p>
                  <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                     <img src="/images/getting-start-4.png" alt="Frame with Border" style={{ width: '100%', maxWidth: '200px', objectFit: 'contain', borderRadius: '16px', border: '2px solid rgba(139, 69, 19, 0.3)' }} />
                  </div>
               </div>
               
               {/* Step 5 */}
               <div className="step-card" style={{ background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(147, 51, 234, 0.12) 100%)', borderColor: 'rgba(147, 51, 234, 0.2)' }}>
                  <div className="step-number" style={{ background: '#9333ea' }}>5</div>
                  <h3>Save Design</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Save your design locally to browser storage for quick access, or export as JSON file format for backup and sharing with others.</p>
                  <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                     <img src="/images/getting-start-5.png" alt="Save Design" style={{ width: '100%', maxWidth: '200px', objectFit: 'contain', borderRadius: '16px', border: '2px solid rgba(147, 51, 234, 0.3)' }} />
                  </div>
               </div>

               {/* Step 6 */}
               <div className="step-card" style={{ background: 'linear-gradient(135deg, rgba(100, 116, 139, 0.08) 0%, rgba(100, 116, 139, 0.12) 100%)', borderColor: 'rgba(100, 116, 139, 0.2)' }}>
                  <div className="step-number" style={{ background: 'var(--secondary-color)' }}>6</div>
                  <h3>Export & Share</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Export your finished sign in common file formats (PNG, PDF, SVG, DXF) ready for professional printing, sharing, and installation.</p>
                  <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                     <img src="/images/getting-start-6.png" alt="Export & Share" style={{ width: '100%', maxWidth: '200px', objectFit: 'contain', borderRadius: '16px', border: '2px solid rgba(100, 116, 139, 0.3)' }} />
                  </div>
               </div>
            </div>
          </div>

          {/* Tutorials */}
          <TutorialBlock 
             id="3"
             title="Flag Sign"
             videoSrc="/images/example-video-3.mp4"
             imageSrc="/images/example-sign-3.svg"
             jsonId="json-flag"
             jsonFile="example-sign-3.json"
          />

          <TutorialBlock 
             id="1"
             title="Diverging Sign"
             videoSrc="/images/example-video-1.mp4"
             imageSrc="/images/example-sign-1.svg"
             jsonId="json-diverge"
             jsonFile="example-sign-1.json"
          />

          <TutorialBlock 
             id="2"
             title="Roundabout Sign"
             videoSrc="/images/example-video-2.mp4"
             imageSrc="/images/example-sign-2.svg"
             jsonId="json-roundabout"
             jsonFile="example-sign-2.json"
          />

          {/* Call to Action */}
          <div style={{ textAlign: 'center', marginTop: '5rem', padding: '3rem 2rem', background: 'var(--background-alt)', borderRadius: 'var(--border-radius)' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }} data-i18n="Ready to Create Your Own Signs?">Ready to Create Your Own Signs?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              <span data-i18n="You've seen the tutorials and examples - now it's time to put your knowledge into practice! Launch the application and start designing professional traffic signs.">You've seen the tutorials and examples - now it's time to put your knowledge into practice! Launch the application and start designing professional traffic signs.</span>
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/design.html" className="btn btn-primary btn-large">
                <i className="fas fa-play"></i>
                <span data-i18n="Launch Application">Launch Application</span>
              </a>
              <Link href="/about" className="btn btn-outline">
                <i className="fas fa-info-circle"></i>
                <span data-i18n="Learn More">Learn More</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}