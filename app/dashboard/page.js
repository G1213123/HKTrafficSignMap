"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '../components/I18nProvider';
import { onAuthStateChanged, signOut } from '../../lib/firebase/auth';
import { db } from '../../lib/firebase/clientApp';
import { collection, query, where, getDocs, orderBy, doc, getDoc, addDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
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
  }, [router, activeTab]); // Added activeTab to dependencies to refetch when switching tabs

  const fetchUserDesigns = async (uid) => {
    setLoading(true);
    try {
      const collectionName = activeTab === 'design' ? 'designs' : 'deleted';
      const designsRef = collection(db, collectionName);
      const q = query(
        designsRef, 
        where('userID', '==', uid),
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

  const handleMoveToTrash = async (designId) => {
    if (!confirm(t('Are you sure you want to move this design to trash?'))) return;
    
    setLoading(true);
    try {
      const designRef = doc(db, 'designs', designId);
      const deletedRef = doc(db, 'deleted', designId);
      const designSnap = await getDoc(designRef);
      
      if (designSnap.exists()) {
        const data = designSnap.data();
        // Copy to deleted
        await setDoc(deletedRef, data);
        // Remove from designs
        await deleteDoc(designRef);
        
        await fetchUserDesigns(user.uid);
      }
    } catch (err) {
      console.error('Error moving to trash:', err);
      alert(t('Failed to move design to trash'));
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (designId) => {
    if (!confirm(t('Are you sure you want to restore this design?'))) return;
    
    setLoading(true);
    try {
      const designRef = doc(db, 'deleted', designId);
      const designSnap = await getDoc(designRef);
      
      if (designSnap.exists()) {
        const data = designSnap.data();
        // Copy back to designs
        await setDoc(doc(db, 'designs', designId), data);
        // Remove from deleted
        await deleteDoc(designRef);
        
        await fetchUserDesigns(user.uid);
      }
    } catch (err) {
      console.error('Error restoring design:', err);
      alert(t('Failed to restore design'));
    } finally {
      setLoading(false);
    }
  };

  const handlePermanentDelete = async (designId) => {
    if (!confirm(t('Are you sure you want to permanently delete this design? This action cannot be undone.'))) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'deleted', designId));
      await fetchUserDesigns(user.uid);
    } catch (err) {
      console.error('Error permanently deleting design:', err);
      alert(t('Failed to permanently delete design'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewDesign = async () => {
    try {
      const designData = {
        title: t('Untitled Design'),
        userID: user?.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        data: '{}', // Initial empty design data
        snapshot: '', 
      };
      
      // Add a new document to the 'designs' collection
      const docRef = await addDoc(collection(db, 'designs'), designData);
      
      // Redirect to the design page with the new fileId
      router.push(`/design?userId=${user?.uid}&fileId=${docRef.id}`);
    } catch (err) {
      console.error('Error creating new design:', err);
      alert(t('Failed to create new design'));
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

          <nav className="sidebar-nav">
            <button 
              className={`nav-tab ${activeTab === 'design' ? 'active' : ''}`} 
              onClick={() => {
                setActiveTab('design');
                setShowProfile(false);
              }}
            >
              <i className="fas fa-layer-group"></i>
              {t('My Designs')}
            </button>
            <button 
              className={`nav-tab ${activeTab === 'trash' ? 'active' : ''}`} 
              onClick={() => {
                setActiveTab('trash');
                setShowProfile(false);
              }}
            >
              <i className="fas fa-trash"></i>
              {t('Trash')}
            </button>
          </nav>
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
                <button className="create-btn" style={{ cursor: 'pointer' }} onClick={handleCreateNewDesign}>
                  <i className="fas fa-plus"></i> {t('New Design')}
                </button>
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
                  <div 
                    key={design.id} 
                    className="design-card" 
                    onClick={() => {
                      if (activeTab === 'design') {
                        router.push(`/design?userId=${user?.uid}&fileId=${design.id}`);
                      }
                    }}
                    style={{ cursor: activeTab === 'design' ? 'pointer' : 'default' }}
                  >
                    <div className="card-snapshot">
                      <img 
                        src={design.snapshot || '/images/placeholder-design.svg'} 
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
                      {activeTab === 'design' ? (
                        <button className="action-btn delete" onClick={(e) => {
                          e.stopPropagation();
                          handleMoveToTrash(design.id);
                        }}>
                          <i className="fas fa-trash"></i>
                        </button>
                      ) : (
                        <div className="trash-actions" style={{ display: 'flex', gap: '5px' }}>
                          <button 
                            className="action-btn restore" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestore(design.id);
                            }}
                            title={t('Restore')}
                          >
                            <i className="fas fa-undo"></i>
                          </button>
                          <button 
                            className="action-btn perma-delete" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePermanentDelete(design.id);
                            }}
                            title={t('Permanently Delete')}
                            style={{ color: 'red' }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      )}
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
