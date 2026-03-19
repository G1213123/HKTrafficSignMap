'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { DemoCanvas } from './demo/demo-canvas';
// import './homepage.css'; - Moved to layout.js for global scope

export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showMigrationNotice, setShowMigrationNotice] = useState(true);
    const [activeRouletteIndex, setActiveRouletteIndex] = useState(-1);
    const [resumeDelay, setResumeDelay] = useState(0);

    // Hero Preview Roulette State
    const [activeHeroIndex, setActiveHeroIndex] = useState(0);
    const heroImages = [
        "/images/hero-preview.svg",
        "/images/hero-preview2.svg",
        "/images/hero-preview3.svg",
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveHeroIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000); // 5 seconds per slide
        return () => clearInterval(timer);
    }, []);

    const rouletteItems = [
      { src: "/images/diverge.svg", title: "Diverge Sign", id: "diverge" },
      { src: "/images/flag.svg", title: "Flag Sign", id: "flag" },
      { src: "/images/gantry.svg", title: "Gantry Sign", id: "gantry" },
      { src: "/images/lane.svg", title: "Lane Sign", id: "lane" },
      { src: "/images/roundabout.svg", title: "Roundabout Sign", id: "roundabout" },
      { src: "/images/spiral.svg", title: "Spiral Sign", id: "spiral" },
      { src: "/images/stack.svg", title: "Stack Sign", id: "stack" },
    ];


    useEffect(() => {
        if (activeRouletteIndex >= 0) {
            // Calculate delay for seamless resume: (index % 7) / 7 * 60s
            // We use negative delay to start animation from that point
            const delay = ((activeRouletteIndex % 7) / 7) * 60;
            setResumeDelay(delay);

            const timer = setTimeout(() => {
                setActiveRouletteIndex(-1);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [activeRouletteIndex]);

    // Demo state
    const [demoStage, setDemoStage] = useState(0);
    const [executedStages, setExecutedStages] = useState(new Set());
    const demoStages = ['symbol', 'text', 'snap', 'border'];

    // Initialize Demo Canvas
    useEffect(() => {
        const initCanvas = () => {
            if (typeof window !== 'undefined' && window.fabric) {
                DemoCanvas.init();
            } else {
                setTimeout(initCanvas, 100);
            }
        };
        initCanvas();

        return () => {
            // Cleanup on unmount
            if (typeof window !== 'undefined' && window.fabric) {
                DemoCanvas.reset();
            }
        };
    }, []);

    const executeDemoAction = (type) => {
        switch (type) {
            case 'symbol':
                DemoCanvas.createSymbol();
                break;
            case 'text':
                DemoCanvas.createText();
                break;
            case 'snap':
                DemoCanvas.simulateSnap();
                break;
            case 'border':
                DemoCanvas.createBorder();
                break;
        }
    };

    const handleDemoClick = (type) => {
        if (type === 'reset') {
            DemoCanvas.reset();
            setDemoStage(0);
            setExecutedStages(new Set());
            return;
        }

        const requestedStageIndex = demoStages.indexOf(type);

        // If requesting a stage that's already completed, re-execute it
        if (requestedStageIndex < demoStage) {
            executeDemoAction(type);
            return;
        }

        // If requesting the current stage, execute it and advance
        if (requestedStageIndex === demoStage) {
            executeDemoAction(type);

            const newExecuted = new Set(executedStages);
            newExecuted.add(type);
            setExecutedStages(newExecuted);

            // Advance stage
            // Special case for border/snap interaction from original code:
            // If we are at 'border' stage, and we have objects, try automated snap? 
            // For now, simple progression
            setDemoStage(prev => prev + 1);
        }
    };

    const getButtonClass = (type) => {
        if (type === 'reset') return 'demo-btn';

        const stageIndex = demoStages.indexOf(type);
        let classes = 'demo-btn';

        if (stageIndex < demoStage) {
            classes += ' completed';
        } else if (stageIndex === demoStage) {
            if (executedStages.has(type)) {
                classes += ' active';
            } else {
                classes += ' current';
            }
        } else {
            classes += ' disabled';
        }
        return classes;
    };

    useEffect(() => {
        const stats = document.querySelectorAll('.stat-number');
        const animateCounter = (element, target) => {
            let count = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    element.textContent = target + (target === 100 ? '%' : '+');
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(count) + (target === 100 ? '%' : '+');
                }
            }, 20);
        };

        // Simple intersection observer for stats
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetText = entry.target.textContent || '0';
                    const target = parseInt(targetText.replace(/[^0-9]/g, ''));
                    if (!isNaN(target)) {
                        animateCounter(entry.target, target);
                        observer.unobserve(entry.target);
                    }
                }
            });
        });

        stats.forEach(stat => observer.observe(stat));

        // Cleanup
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Migration Notice Logic
        const currentDomain = window.location.hostname;
        const newDomain = 'roadsignfactory.hk';

        // Only show if not on new domain (mock logic for localhost)
        if (currentDomain === newDomain) {
            setShowMigrationNotice(false);
        } else {
            const timer = setTimeout(() => {
                setShowMigrationNotice(false);
            }, 5000);
            return () => clearTimeout(timer);
        }

        // Scroll effect for navbar
        const handleScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                    navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.boxShadow = 'none';
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {showMigrationNotice && (
                <div id="migrationNotice" className="migration-notice" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setShowMigrationNotice(false);
                    }
                }}>
                    <div className="migration-content">
                        <button className="migration-close" onClick={() => setShowMigrationNotice(false)}>&times;</button>
                        <img src="/images/diversion-sign.svg" alt="Diversion Sign" className="migration-sign" onError={(e) => e.target.style.display = 'none'} />
                        <div className="migration-title">Site Migration Notice</div>
                        <div className="migration-text">
                            We're moving from <strong>g1213123.info</strong> to <strong><a href="https://roadsignfactory.hk" target="_blank" className="migration-link">roadsignfactory.hk</a></strong><br />
                            Please update your bookmarks to ensure continued access to our services.
                        </div>
                    </div>
                </div>
            )}

            <Navbar />

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-container">
                    <div className="hero-content">
                        <div className="development-notice">
                            <i className="fas fa-info-circle"></i>
                            <span> <strong>Development Version</strong> - This application is under active development. Please report any issues on <a href="https://github.com/G1213123/TrafficSign" target="_blank">GitHub</a>. </span>
                        </div>
                        <h1 className="hero-title">
                            Professional Sign Design Tool
                        </h1>
                        <p className="hero-subtitle">
                            Create, customize, and export professional signs online. Built with Hong Kong <span className="tpdm-tooltip" data-tooltip="Transport Planning and Design Manual">TPDM</span> standards for precision and compliance.
                        </p>

                        {/* Buttons Container */}
                        <div className="hero-buttons">
                            {/* Primary Action Group (Launch + Version) */}
                            <div className="primary-action-group">
                                <a href="/design.html" className="btn btn-primary">
                                    <i className="fas fa-play"></i>
                                    Launch Application
                                </a>
                                <div className="version-display">
                                    <span className="version-number">
                                        v1.0.0
                                    </span>
                                    <span className="version-label">Current Build</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Stats */}
                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-number">10+</span>
                                <span className="stat-label">Sign Templates</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">30+</span>
                                <span className="stat-label">Symbols</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">200+</span>
                                <span className="stat-label">Destination Names</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">100%</span>
                                <span className="stat-label">Web-Based</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-preview">
                            <div 
                                className="hero-slider-track"
                                style={{ transform: `translateX(-${activeHeroIndex * 50}%)` }}
                            >
                                {heroImages.map((src, index) => (
                                    <div key={index} className="hero-slide">
                                        <img src={src} alt={`Traffic Sign Designer Preview ${index + 1}`} className="preview-image" onError={(e) => e.target.style.display = 'none'} />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="preview-overlay">
                                <a href="/design.html" className="preview-launch">
                                    <i className="fas fa-external-link-alt"></i>
                                    Open Full App
                                </a>
                            </div>
                        </div>

                        <div className="hero-dots">
                            {heroImages.map((_, index) => (
                                <div 
                                    key={index}
                                    className={`hero-dot ${activeHeroIndex === index ? 'active' : ''}`}
                                    onClick={() => setActiveHeroIndex(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features">
                <div className="container">
                    <h2 className="section-title">Professional Design Features</h2>
                    <p className="section-subtitle">Comprehensive tools for creating standards-compliant traffic signs</p>

                    <div className="features-grid">

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-font"></i>
                            </div>
                            <h3>Destination Text</h3>
                            <p>Choose destinations from a comprehensive list of common districts, or type in names with authentic fonts.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-shapes"></i>
                            </div>
                            <h3>Symbol Library</h3>
                            <p>Access a comprehensive library of traffic symbols and glyphs. No hassle for drawing points and shapes.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-vector-square"></i>
                            </div>
                            <h3>Vector Graphics</h3>
                            <p>Create scalable signs using vector graphics that maintain quality at any size.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-file-export"></i>
                            </div>
                            <h3>Multiple Export Formats</h3>
                            <p>Export your designs as PNG, SVG, DXF, or PDF for professional use.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-ruler"></i>
                            </div>
                            <h3>Precision Tools</h3>
                            <p>Built-in measurement tools and grid system for accurate sign dimensions.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-save"></i>
                            </div>
                            <h3>Save & Load</h3>
                            <p>Automatic save to browser storage and manual save/load functionality to preserve your work.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="demo">
                <div className="container">
                    <h2 className="section-title">See It In Action</h2>
                    <p className="section-subtitle">Interactive demonstration of key features</p>

                    <div className="demo-container">
                        <div className="main-demo-canvas" id="main-demo-canvas">
                            <div className="demo-sign-canvas">
                                <canvas id="demo-canvas"></canvas>
                                <div className="demo-placeholder-overlay" id="demo-placeholder-overlay">
                                    <div className="demo-placeholder-text">Click any button below to see the feature in action</div>
                                </div>
                                {/* Demo Cursor Box for Snap Prompts */}
                                <div id="demo-cursor-box-container" className="demo-cursor-box-container">
                                    <div id="demo-cursor-text-box" className="demo-cursor-text-box">Snap prompt</div>
                                    <input type="text" id="demo-cursor-answer-box" className="demo-cursor-answer-box" defaultValue="0" />
                                </div>
                            </div>
                        </div>

                        {/* Demo Controls */}
                        <div className="demo-controls">
                            <button
                                className={getButtonClass('symbol')}
                                onClick={() => handleDemoClick('symbol')}
                                data-demo="symbol"
                            >
                                <i className="fas fa-plus-circle"></i>
                                <span>Add Symbol</span>
                            </button>
                            <button
                                className={getButtonClass('text')}
                                onClick={() => handleDemoClick('text')}
                                data-demo="text"
                            >
                                <i className="fas fa-font"></i>
                                <span>Add Text</span>
                            </button>
                            <button
                                className={getButtonClass('snap')}
                                onClick={() => handleDemoClick('snap')}
                                data-demo="snap"
                            >
                                <i className="fas fa-arrows-alt"></i>
                                <span>Drag &amp; Snap</span>
                            </button>
                            <button
                                className={getButtonClass('border')}
                                onClick={() => handleDemoClick('border')}
                                data-demo="border"
                            >
                                <i className="fas fa-border-style"></i>
                                <span>Add Border</span>
                            </button>
                            <button
                                className="demo-btn"
                                onClick={() => handleDemoClick('reset')}
                                data-demo="reset"
                            >
                                <i className="fas fa-undo"></i>
                                <span>Reset</span>
                            </button>
                        </div>
                    </div>
                </div>

            </section>

            {/* SVG Gallery Roulette Section */}
            <section id="gallery" className="svg-gallery">
                <div className="container">
                    <h2 className="section-title" data-i18n="Example Signs Gallery">Example Signs Gallery</h2>
                    <p className="section-subtitle" data-i18n="Browse through various traffic sign examples">Browse through various traffic sign examples</p>
                    <div className="roulette-container">
                        <div className="roulette-track-container">
                            <div 
                                className="roulette-track" 
                                id="roulette-track"
                                style={activeRouletteIndex >= 0 ? { 
                                    animation: 'none', 
                                    transform: `translateX(calc(-${activeRouletteIndex} * (100% / 14)))` 
                                } : {
                                    animationDelay: `-${resumeDelay}s`
                                }}
                            >
                                {/* First set of SVG items */}
                                {rouletteItems.map((item, index) => (
                                    <div 
                                        key={`first-${item.id}`} 
                                        className={`roulette-item ${activeRouletteIndex === index ? 'active' : ''}`}
                                        onClick={() => setActiveRouletteIndex(index)}
                                    >
                                        <img src={item.src} alt={item.title} />
                                        <div className="item-title" data-i18n={item.title}>{item.title}</div>
                                    </div>
                                ))}
                                
                                {/* Duplicate set for seamless loop */}
                                {rouletteItems.map((item, index) => (
                                    <div 
                                        key={`second-${item.id}`} 
                                        className="roulette-item"
                                        onClick={() => setActiveRouletteIndex(index)}
                                    >
                                        <img src={item.src} alt={item.title} />
                                        <div className="item-title" data-i18n={item.title}>{item.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="roulette-indicators" id="roulette-indicators">
                        {rouletteItems.map((item, index) => (
                            <div 
                                key={`indicator-${item.id}`}
                                className={`roulette-dot ${activeRouletteIndex === index ? 'active' : ''}`}
                                onClick={() => setActiveRouletteIndex(index)}
                                title={item.title}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
