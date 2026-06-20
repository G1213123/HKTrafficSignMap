'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from './I18nProvider';
import { signInWithGoogle, signOut, onAuthStateChanged } from '../../lib/firebase/auth';
import { setCookie, deleteCookie } from 'cookies-next';

function useUserSession() {
  useEffect(() => {
    return onAuthStateChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        await setCookie('__session', idToken);
      } else {
        await deleteCookie('__session');
      }
      // Removed window.location.reload() to prevent infinite refresh loops
    });
  }, []);
}

export default function Navbar() {
  useUserSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, locale, changeLocale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged((u) => setUser(u));
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => pathname === path ? 'active' : '';

  const handleSignIn = () => {
    router.push('/auth');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <img src="/images/favicon.ico" alt="Logo" className="nav-logo-icon" />
          <span>{t('Road Sign Factory')}</span>
        </Link>
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link href="/" className={`nav-link ${isActive('/')}`} data-i18n="Home">{t('Home')}</Link>
          <Link href="/getting-started" className={`nav-link ${isActive('/getting-started')}`} data-i18n="Getting Started">{t('Getting Started')}</Link>
          <Link href="/about" className={`nav-link ${isActive('/about')}`} data-i18n="About">{t('About')}</Link>
          <Link href="/changelog" className={`nav-link ${isActive('/changelog')}`} data-i18n="Changelog">{t('Changelog')}</Link>
          <Link href="/posters" className={`nav-link ${isActive('/posters')}`} data-i18n="Posters">{t('Posters')}</Link>
          <Link href="/sign-index" className={`nav-link ${isActive('/sign-index')}`} data-i18n="Index">{t('Index')}</Link>
          <Link href="/map" className={`nav-link ${isActive('/map')}`} data-i18n="Map">{t('Map')}</Link>
          <a href="https://github.com/G1213123/TrafficSign" className="nav-link" target="_blank" rel="noreferrer" data-i18n="GitHub">{t('GitHub')}</a>
          
          {user ? (
            <button onClick={handleSignOut} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>
              {t('Sign Out')}
            </button>
          ) : (
            <button onClick={handleSignIn} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>
              {t('Sign In')}
            </button>
          )}

          <a href="/design" className="nav-button" data-i18n="Launch App">{t('Launch App')}</a>
          <div className="nav-lang" aria-label="Language">
            <button id="lang-en" className={`lang-btn ${locale === 'en' ? 'active' : ''}`} aria-label="English" onClick={() => changeLocale('en')}>EN</button>
            <button id="lang-zh" className={`lang-btn ${locale === 'zh' ? 'active' : ''}`} aria-label="中文" onClick={() => changeLocale('zh')}>中</button>
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