import React, { useState } from 'react';
import { authService } from '../services/authService';

export function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = 'login', 
  onSuccessLogin,
  onContinueGuest 
}) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Campus Hydrologist');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setMode('login');
    setEmail('elena.vance@greenwood.edu');
    setPassword('Password123!');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'register') {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setErrorMessage('Please enter your full name (minimum 2 characters).');
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setErrorMessage('Please provide a valid email address.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('You must acknowledge the terms to register an account.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await authService.register(fullName, email, password, role);
        setSuccessMessage('Account created successfully! Welcome to AQUAINT.');
        setTimeout(() => {
          setIsLoading(false);
          if (onSuccessLogin) onSuccessLogin(res.user, true); // true indicates brand new registration
        }, 600);
      } catch (err) {
        setIsLoading(false);
        setErrorMessage(err.message || 'Registration failed. Please try again.');
      }

    } else {
      // Login
      if (!email.trim() || !password) {
        setErrorMessage('Please enter both email and password.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await authService.login(email.trim(), password, rememberMe);
        setSuccessMessage('Authentication verified! Loading workspace...');
        setTimeout(() => {
          setIsLoading(false);
          if (onSuccessLogin) onSuccessLogin(res.user, false);
        }, 500);
      } catch (err) {
        setIsLoading(false);
        setErrorMessage(err.message || 'Invalid email or password.');
      }
    }
  };

  const handleGuestClick = () => {
    authService.setGuestMode(true);
    if (onContinueGuest) {
      onContinueGuest();
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setForgotSent(true);
  };

  return (
    <div className="modal-overlay" style={{ backdropFilter: 'blur(16px)', zIndex: 9999 }}>
      <div 
        className="stitch-card-highlight"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-surface-container)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.75), 0 0 40px rgba(0, 229, 255, 0.15)',
          position: 'relative'
        }}
      >
        {/* Close Button if closeable */}
        {onClose && (
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-on-surface-variant)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        )}

        {/* Brand Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-surface-container-high)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px rgba(0, 229, 255, 0.3)',
            marginBottom: '0.75rem'
          }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-container)', fontSize: '28px' }}>
              water_drop
            </span>
          </div>

          <h2 className="font-headline-sm" style={{ color: 'var(--color-on-surface)', fontSize: '1.35rem' }}>
            {mode === 'login' ? 'Sign in to AQUAINT' : 'Create AQUAINT Account'}
          </h2>
          <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
            {mode === 'login' 
              ? 'Access autonomous hydraulic telemetry & AI water insights'
              : 'Register to monitor campus consumption & simulate savings'}
          </p>
        </div>

        {/* 1-Click Guest Exploration Banner for Hackathon Judges */}
        <div style={{
          backgroundColor: 'rgba(0, 229, 255, 0.08)',
          border: '1px solid rgba(0, 229, 255, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.875rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-container)', fontSize: '22px' }}>
              science
            </span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="font-label-sm" style={{ color: 'var(--color-on-surface)', fontWeight: 700 }}>
                Hackathon Evaluation?
              </span>
              <span className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.75rem' }}>
                Instant access to all demo sensors & scenarios
              </span>
            </div>
          </div>

          <button 
            type="button"
            className="stitch-btn stitch-btn-primary"
            onClick={handleGuestClick}
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem', whiteSpace: 'nowrap' }}
          >
            <span>Explore Demo</span>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_forward</span>
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--color-surface-container-low)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.25rem',
          border: '1px solid rgba(132, 147, 150, 0.12)'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: mode === 'login' ? 'var(--color-primary-container)' : 'transparent',
              color: mode === 'login' ? 'var(--color-on-primary-container)' : 'var(--color-on-surface-variant)',
              fontWeight: 700,
              fontSize: '0.8125rem',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: mode === 'register' ? 'var(--color-primary-container)' : 'transparent',
              color: mode === 'register' ? 'var(--color-on-primary-container)' : 'var(--color-on-surface-variant)',
              fontWeight: 700,
              fontSize: '0.8125rem',
              transition: 'all 0.15s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Alerts / Error feedback */}
        {errorMessage && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(147, 0, 10, 0.25)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: 'var(--radius-md)',
            color: '#ffb4ab',
            fontSize: '0.8125rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: 'var(--radius-md)',
            color: '#34d399',
            fontSize: '0.8125rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Forgot password sub-view */}
        {showForgotPassword ? (
          <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              Enter your registered email address and we'll send password recovery instructions.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label className="font-label-sm" style={{ color: 'var(--color-on-surface)' }}>Email Address</label>
              <input 
                type="email"
                required
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder="name@greenwood.edu"
                style={{
                  padding: '0.625rem 0.875rem',
                  backgroundColor: 'var(--color-surface-container-high)',
                  border: '1px solid rgba(132, 147, 150, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-on-surface)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            {forgotSent ? (
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem' }}>
                ✓ Recovery instructions dispatched! Check your inbox.
              </div>
            ) : (
              <button type="submit" className="stitch-btn stitch-btn-primary" style={{ width: '100%' }}>
                Send Recovery Link
              </button>
            )}

            <button 
              type="button" 
              onClick={() => { setShowForgotPassword(false); setForgotSent(false); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-container)', cursor: 'pointer', fontSize: '0.8125rem' }}
            >
              ← Back to Sign In
            </button>
          </form>
        ) : (
          /* Main Auth Form */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Registration: Full Name */}
            {mode === 'register' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="font-label-sm" style={{ color: 'var(--color-on-surface)' }}>Full Name</label>
                <input 
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Jordan Hayes"
                  style={{
                    padding: '0.625rem 0.875rem',
                    backgroundColor: 'var(--color-surface-container-high)',
                    border: '1px solid rgba(132, 147, 150, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-on-surface)',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
            )}

            {/* Email Address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label className="font-label-sm" style={{ color: 'var(--color-on-surface)' }}>Email Address</label>
              <input 
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@greenwood.edu"
                style={{
                  padding: '0.625rem 0.875rem',
                  backgroundColor: 'var(--color-surface-container-high)',
                  border: '1px solid rgba(132, 147, 150, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-on-surface)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Registration: Role */}
            {mode === 'register' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="font-label-sm" style={{ color: 'var(--color-on-surface)' }}>Campus Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  style={{
                    padding: '0.625rem 0.875rem',
                    backgroundColor: 'var(--color-surface-container-high)',
                    border: '1px solid rgba(132, 147, 150, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-on-surface)',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                >
                  <option value="Chief Hydrologist">Chief Hydrologist</option>
                  <option value="Campus Hydrologist">Campus Hydrologist</option>
                  <option value="Facility Manager">Facility Manager</option>
                  <option value="Sustainability Lead">Sustainability Lead</option>
                  <option value="Student / Guest Auditor">Student / Guest Auditor</option>
                </select>
              </div>
            )}

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label className="font-label-sm" style={{ color: 'var(--color-on-surface)' }}>Password</label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => setShowForgotPassword(true)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-container)', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  style={{
                    width: '100%',
                    padding: '0.625rem 2.5rem 0.625rem 0.875rem',
                    backgroundColor: 'var(--color-surface-container-high)',
                    border: '1px solid rgba(132, 147, 150, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-on-surface)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-on-surface-variant)',
                    cursor: 'pointer'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password on Register */}
            {mode === 'register' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="font-label-sm" style={{ color: 'var(--color-on-surface)' }}>Confirm Password</label>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  style={{
                    padding: '0.625rem 0.875rem',
                    backgroundColor: 'var(--color-surface-container-high)',
                    border: '1px solid rgba(132, 147, 150, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-on-surface)',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
            )}

            {/* Remember Me / Terms */}
            {mode === 'login' ? (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8125rem', color: 'var(--color-on-surface-variant)' }}>
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span>Remember me on this workstation</span>
              </label>
            ) : (
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>
                <input 
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  style={{ marginTop: '2px' }}
                />
                <span>I agree to AQUAINT telemetry data management and ISO 50001 compliance standards.</span>
              </label>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="stitch-btn stitch-btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                justifyContent: 'center',
                marginTop: '0.5rem',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined spin-animation" style={{ fontSize: '18px' }}>progress_activity</span>
                  <span>Verifying Credentials...</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>login</span>
                  <span>Sign In</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
                  <span>Complete Registration</span>
                </>
              )}
            </button>

            {/* Quick Demo Pre-fill option */}
            {mode === 'login' && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-secondary)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  ⚡ Auto-fill Demo Account (Elena Vance)
                </button>
              </div>
            )}

          </form>
        )}

      </div>
    </div>
  );
}
