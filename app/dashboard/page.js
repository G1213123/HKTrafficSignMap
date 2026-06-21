"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '../components/I18nProvider';
import { onAuthStateChanged, signOut } from '../../lib/firebase/auth';
import { db } from '../../lib/firebase/clientApp';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import './dashboard.css';

export default function UserDashboard() {
  const { t } = useI18n();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('design'); // 'design' or 'trash'
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (u) => {
      if (u) {
        try {
          const userDoc = await getDoc(doc(db, 'users', u.uid));
          if (userDoc.exists()) {
            setUser({ ...u, ...userDoc.data() });
          } else {
            setUser(u);
          }
        } catch (err) {
          console.error('Error fetching user metadata:', err);
          setUser(u);
        }
        fetchUserDesigns(u.uid);
      } else {
        router.push('/auth');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchUserDesigns = async (uid) => {
    setLoading(true);
    try {
      const designsRef = collection(db, 'designs');
      const q = query(
        designsRef, 
        where('userId', '==', uid),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const designsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDesigns(designsData);
    } catch (err) {
      console.error('Error fetching designs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <Link href="/" className="back-home-link">
          <i className="fas fa-arrow-left"></i> {t('Back to Home')}
        </Link>

        <div className="sidebar-user-info" onClick={() => setShowProfile(!showProfile)} style={{ cursor: 'pointer' }}>
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.username || t('User')}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>

        {!showProfile && (
          <nav className="sidebar-nav">
            <button 
              className={`nav-tab ${activeTab === 'design' ? 'active' : ''}`} 
              onClick={() => setActiveTab('design')}
            >
              <i className="fas fa-layer-group"></i>
              {t('My Designs')}
            </button>
            <button 
              className={`nav-tab ${activeTab === 'trash' ? 'active' : ''}`} 
              onClick={() => setActiveTab('trash')}
            >
              <i className="fas fa-trash"></i>
              {t('Trash')}
            </button>
          </nav>
        )}
      </aside>

      <main className="dashboard-content">
        {showProfile ? (
          <div className="profile-view">
            <div className="profile-card">
              <h1>{t('User Profile')}</h1>
              <div className="profile-info-grid">
                <div className="info-item">
                  <label>{t('Username')}</label>
                  <span>{user?.username || t('Not set')}</span>
                </div>
                <div className="info-item">
                  <label>{t('Email')}</label>
                  <span>{user?.email || t('Not set')}</span>
                </div>
                <div className="info-item">
                  <label>{t('User ID')}</label>
                  <span>{user?.uid || t('Not set')}</span>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> {t('Logout')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <header className="content-header">
              <h1>{activeTab === 'design' ? t('My Designs') : t('Trash')}</h1>
              <div className="header-actions">
                <Link href="/design" className="create-btn">
                  <i className="fas fa-plus"></i> {t('New Design')}
                </Link>
              </div>
            </header>

            <div className="designs-grid">
              {loading ? (
                <div className="loading-state">{t('Loading designs...')}</div>
              ) : designs.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-folder-open"></i>
                  <p>{t('No designs found')}</p>
                </div>
              ) : (
                designs.map((design) => (
                  <div key={design.id} className="design-card">
                    <div className="card-snapshot">
                      <img 
                        src={design.snapshotUrl || '/images/placeholder-design.svg'} 
                        alt={design.title} 
                      />
                    </div>
                    <div className="card-info">
                      <h3 className="design-title">{design.title || t('Untitled Design')}</h3>
                      <p className="design-date">
                        {design.updatedAt ? new Date(design.updatedAt.toDate()).toLocaleString() : t('Unknown date')}
                      </p>
                    </div>
                    <div className="card-actions">
                      <button className="action-btn open" onClick={() => router.push(`/design/${design.id}`)}>
                        <i className="fas fa-external-link-alt"></i>
                      </button>
                      <button className="action-btn delete" onClick={() => {/* handle delete */}}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
