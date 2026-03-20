 'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <img src="/images/favicon.ico" alt="Logo" className="nav-logo-icon" />
          <span>Road Sign Factory</span>
        </Link>
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link href="/" className={`nav-link ${isActive('/')}`} data-i18n="Home">Home</Link>
          <Link href="/getting-started" className={`nav-link ${isActive('/getting-started')}`} data-i18n="Getting Started">Getting Started</Link>
          <Link href="/about" className={`nav-link ${isActive('/about')}`} data-i18n="About">About</Link>
          <Link href="/changelog" className={`nav-link ${isActive('/changelog')}`} data-i18n="Changelog">Changelog</Link>
          <Link href="/posters" className={`nav-link ${isActive('/posters')}`} data-i18n="Posters">Posters</Link>
          <Link href="/sign-index" className={`nav-link ${isActive('/sign-index')}`} data-i18n="Index">Index</Link>
          <a href="https://github.com/G1213123/TrafficSign" className="nav-link" target="_blank" rel="noreferrer" data-i18n="GitHub">GitHub</a>
          <a href="/design.html" className="nav-button" data-i18n="Launch App">Launch App</a>
          <div className="nav-lang" aria-label="Language">
            <button id="lang-en" className="lang-btn" aria-label="English">EN</button>
            <button id="lang-zh" className="lang-btn" aria-label="中文">中</button>
          </div>
        </div>
        <div className="nav-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}