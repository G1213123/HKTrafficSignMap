'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '../components/I18nProvider';
import { createUserWithEmailAndPassword } from '../../lib/firebase/auth';
import '../auth/auth.css';

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: t('Passwords do not match') });
      return;
    }

    try {
      await createUserWithEmailAndPassword(email, password);
      setMessage({ type: 'success', text: t('Account created successfully! Please sign in.') });
      setTimeout(() => {
        router.push('/auth');
      }, 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || t('Registration failed') });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{t('Create Account')}</h1>
        
        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>{t('User Name')}</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label>{t('Email')}</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="email@example.com"
            />
          </div>

          <div className="form-group">
            <label>{t('Password')}</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="********"
            />
          </div>

          <div className="form-group">
            <label>{t('Confirm Password')}</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              placeholder="********"
            />
          </div>

          <div className="auth-actions">
            <button type="submit" className="auth-submit">{t('Register')}</button>
          </div>
        </form>

        <div className="auth-footer">
          <p>
            {t('Already have an account?')} 
            <Link href="/auth" className="link-btn" style={{ textDecoration: 'underline', color: 'var(--primary, #007bff)', cursor: 'pointer', background: 'none', border: 'none', font: 'inherit' }}>
              {t('Sign In')}
            </Link>
          </p>
        </div>

        <div className="auth-bottom">
          <Link href="/" className="back-home">{t('← Back to Home')}</Link>
        </div>
      </div>
    </div>
  );
}
