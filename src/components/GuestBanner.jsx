import React from 'react';

export function GuestBanner({ onOpenAuth, onTakeTour }) {
  return (
    <div style={{
      backgroundColor: 'rgba(0, 162, 230, 0.12)',
      borderBottom: '1px solid rgba(0, 229, 255, 0.25)',
      padding: '0.45rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem',
      fontSize: '0.78rem',
      zIndex: 35,
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          padding: '2px 6px',
          borderRadius: '4px',
          backgroundColor: 'rgba(0, 229, 255, 0.2)',
          color: 'var(--color-primary-container)',
          fontWeight: 800,
          fontSize: '0.6875rem',
          letterSpacing: '0.04em'
        }}>
          GUEST DEMO MODE
        </span>
        <span style={{ color: 'var(--color-on-surface)' }}>
          Exploring Greenwood University Campus simulated smart hydro-meter telemetry.
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={onTakeTour}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-primary-container)',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>help_outline</span>
          <span>Take 7-Step Tour</span>
        </button>

        <span style={{ color: 'var(--color-outline-variant)' }}>•</span>

        <button
          onClick={() => onOpenAuth('login')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-secondary)',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600
          }}
        >
          Sign In
        </button>

        <button
          onClick={() => onOpenAuth('register')}
          className="stitch-btn stitch-btn-primary"
          style={{
            fontSize: '0.72rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px'
          }}
        >
          Create Real Account
        </button>
      </div>
    </div>
  );
}
