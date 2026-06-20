'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '../components/I18nProvider';
import { signInWithEmailAndPassword, signInWithGoogle, sendPasswordResetEmail } from '../../lib/firebase/auth';
import './auth.css';

export default function AuthPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      await signInWithEmailAndPassword(email, password);
      router.push('/');
    } catch (err) {
      setMessage({ type: 'error', text: err.message || t('Authentication failed') });
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      await sendPasswordResetEmail(email);
      setMessage({ type: 'success', text: t('Password reset email sent!') });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || t('Error sending reset email') });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err) {
      setMessage({ type: 'error', text: err.message || t('Google sign-in failed') });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{isForgotPassword ? t('Reset Password') : t('Sign In')}</h1>
        
        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={isForgotPassword ? handleForgotPassword : handleEmailSignIn}>
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

          {!isForgotPassword && (
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
          )}

          <div className="auth-actions">
            {isForgotPassword ? (
              <button type="submit" className="auth-submit">{t('Send Reset Link')}</button>
            ) : (
<<<<<<< HEAD
              <>
                <button type="submit" className="auth-submit">{t('Sign In')}</button>
                <button 
                  type="button" 
                  className="auth-submit auth-submit-secondary" 
                  onClick={() => router.push('/design')}
                  style={{ marginTop: '10px', backgroundColor: 'var(--secondary, #6c757d)' }}
                >
                  {t('Create a Design without Signing In')}
                </button>
              </>
=======
              <button type="submit" className="auth-submit">{t('Sign In')}</button>
>>>>>>> 000c542 (feat: implement authentication pages with email/password and Google sign-in functionality. Added user registration form.)
            )}
          </div>
        </form>

        {!isForgotPassword && (
          <div className="auth-footer">
            <p>
              {t('Forgot password?')} 
              <button className="link-btn" onClick={() => setIsForgotPassword(true)}>{t('Reset it here')}</button>
            </p>            <p>
              {t('Don\'t have an account?')} 
              <Link href="/register" className="link-btn" style={{ textDecoration: 'underline', color: 'var(--primary, #007bff)', cursor: 'pointer', background: 'none', border: 'none', font: 'inherit' }}>
                {t('Register now')}
              </Link>
            </p>          </div>
        )}

        {isForgotPassword && (
          <div className="auth-footer">
            <p>
              {t('Remember your password?')} 
              <button className="link-btn" onClick={() => setIsForgotPassword(false)}>{t('Back to Sign In')}</button>
            </p>
          </div>
        )}

        <div className="auth-divider">
          <span>{t('Or')}</span>
        </div>

        <button onClick={handleGoogleSignIn} className="google-signin-btn">
          <img src="/images/google-icon.svg" alt="Google" />
          {t('Continue with Google')}
        </button>

        <div className="auth-bottom">
          <Link href="/" className="back-home">{t('← Back to Home')}</Link>
        </div>
      </div>
    </div>
  );
}
