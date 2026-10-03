import React from 'react';
import confetti from 'canvas-confetti';

export function OnboardingWelcomeModal({ user, onStartTour, onDismiss }) {
  React.useEffect(() => {
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
    } catch (e) {}
  }, []);

  if (!user) return null;

  return (
    <div className="modal-overlay" style={{ backdropFilter: 'blur(12px)', zIndex: 9998 }}>
      <div 
        className="stitch-card-highlight"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '2.25rem',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-surface-container)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 36px rgba(0, 229, 255, 0.2)',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 229, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          color: 'var(--color-primary-container)',
          boxShadow: '0 0 24px rgba(0, 229, 255, 0.3)'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
            celebration
          </span>
        </div>

        <span className="stitch-pill pill-primary" style={{ fontSize: '0.7rem', marginBottom: '0.75rem' }}>
          REGISTRATION COMPLETE
        </span>

        <h2 className="font-headline-sm" style={{ color: 'var(--color-on-surface)', fontSize: '1.4rem', marginTop: '0.5rem' }}>
          Welcome to AQUAINT, {user.name}!
        </h2>

        <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '0.75rem', lineHeight: 1.5 }}>
          Your enterprise water intelligence workspace is configured for <strong>Greenwood University Campus</strong>.
          Would you like to take the interactive 7-step tour to learn how to monitor telemetry, detect water waste fingerprints, and simulate conservation ROI?
        </p>

        {/* Feature Highlights Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
          margin: '1.5rem 0',
          textAlign: 'left'
        }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-container-low)', border: '1px solid rgba(132, 147, 150, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary-container)', fontSize: '0.8rem', fontWeight: 700 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>analytics</span>
              <span>Dynamic Budget</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              Weather & occupancy-adjusted consumption caps.
            </p>
          </div>

          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-container-low)', border: '1px solid rgba(132, 147, 150, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffb4ab', fontSize: '0.8rem', fontWeight: 700 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>fingerprint</span>
              <span>Waste Fingerprints</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              Automated classification of pipe leaks & overflows.
            </p>
          </div>

          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-container-low)', border: '1px solid rgba(132, 147, 150, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-secondary)', fontSize: '0.8rem', fontWeight: 700 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>tune</span>
              <span>What-If Simulator</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              Model repair ROI in Litres, rupees (₹), and CO₂.
            </p>
          </div>

          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-container-low)', border: '1px solid rgba(132, 147, 150, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '0.8rem', fontWeight: 700 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
              <span>LEED / ISO 50001</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              Executive audit briefing ready for PDF export.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button 
            className="stitch-btn stitch-btn-primary"
            onClick={onStartTour}
            style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', fontSize: '0.875rem' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>explore</span>
            <span>Start 7-Step Guided Tour (Recommended)</span>
          </button>

          <button 
            className="stitch-btn stitch-btn-secondary"
            onClick={onDismiss}
            style={{ width: '100%', padding: '0.625rem', justifyContent: 'center', fontSize: '0.8125rem' }}
          >
            <span>Skip to Dashboard</span>
          </button>
        </div>

      </div>
    </div>
  );
}
