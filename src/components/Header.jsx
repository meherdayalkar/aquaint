import React from 'react';
import { Menu } from 'lucide-react';

export function Header({ 
  weather, 
  activeAnomaliesCount, 
  onOpenReport, 
  onQuickDispatch,
  onToggleMobileMenu,
  onTriggerTour,
  currentUser,
  isGuest,
  onOpenAuth
}) {
  return (
    <header 
      style={{
        position: 'fixed',
        top: 0,
        left: '280px',
        right: 0,
        height: '64px',
        backgroundColor: 'rgba(13, 19, 32, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(132, 147, 150, 0.12)',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        boxShadow: '0 1px 12px rgba(0, 0, 0, 0.25)'
      }}
      className="stitch-header"
    >
      {/* Left: Breadcrumbs & Telemetry Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        
        {/* Mobile menu trigger */}
        <button 
          className="stitch-mobile-toggle"
          onClick={onToggleMobileMenu}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-on-surface)',
            cursor: 'pointer',
            padding: '6px'
          }}
        >
          <Menu size={20} />
        </button>

        {/* Location Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-on-surface-variant)', fontSize: '0.8125rem' }}>
          <span>Greenwood Uni</span>
          <span style={{ color: 'var(--color-outline)' }}>/</span>
          <span style={{ color: 'var(--color-on-surface)', fontWeight: 600 }}>Campus Central</span>
        </div>

        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--color-surface-container-highest)' }} />

        {/* Weather capsule */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          backgroundColor: 'var(--color-surface-container-low)',
          border: '1px solid rgba(132, 147, 150, 0.12)',
          fontSize: '0.75rem'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-secondary)' }}>
            {weather.rainfallMm > 0 ? 'rainy' : 'wb_sunny'}
          </span>
          <span className="font-mono" style={{ color: 'var(--color-on-surface)' }}>
            {weather.temp}°C
          </span>
          <span style={{ color: 'var(--color-outline-variant)' }}>•</span>
          <span className="font-mono" style={{ color: weather.rainfallMm > 0 ? 'var(--color-primary-container)' : 'var(--color-on-surface-variant)' }}>
            {weather.rainfallMm > 0 ? `${weather.rainfallMm}mm Rain` : '0mm Precip'}
          </span>
          <span style={{ color: 'var(--color-outline-variant)' }}>•</span>
          <span style={{ color: 'var(--color-on-surface-variant)' }}>
            {weather.condition}
          </span>
        </div>

        {/* Live Anomaly Alert Beacon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          backgroundColor: activeAnomaliesCount > 0 ? 'rgba(147, 0, 10, 0.2)' : 'rgba(16, 185, 129, 0.12)',
          border: activeAnomaliesCount > 0 ? '1px solid rgba(244, 63, 94, 0.35)' : '1px solid rgba(16, 185, 129, 0.3)',
          fontSize: '0.75rem'
        }}>
          {activeAnomaliesCount > 0 ? (
            <>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f43f5e' }} className="ping-beacon" />
              <span className="font-label-sm" style={{ color: '#ffb4ab', fontWeight: 600 }}>
                {activeAnomaliesCount} ANOMAL{activeAnomaliesCount > 1 ? 'IES' : 'Y'} DETECTED
              </span>
            </>
          ) : (
            <>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span className="font-label-sm" style={{ color: '#34d399', fontWeight: 600 }}>
                ALL 6 NODES OPTIMAL
              </span>
            </>
          )}
        </div>

      </div>

      {/* Right: Operational Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        
        {/* Help / Tour button */}
        <button 
          className="stitch-btn stitch-btn-secondary"
          onClick={onTriggerTour}
          title="Start Interactive 7-Step Guided Tour"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '17px', color: 'var(--color-primary-container)' }}>help</span>
          <span>Tour</span>
        </button>

        <button 
          className="stitch-btn stitch-btn-secondary"
          onClick={onOpenReport}
          title="Download ISO / LEED Compliance Report"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
          <span>Export Report</span>
        </button>

        <button 
          className="stitch-btn stitch-btn-primary"
          onClick={onQuickDispatch}
          title="Dispatch Plumbing Rapid Squad"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>emergency_home</span>
          <span>Dispatch Squad</span>
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-surface-container-highest)', margin: '0 4px' }} />

        {/* User Avatar */}
        <button
          onClick={() => {
            if (isGuest && onOpenAuth) onOpenAuth('login');
          }}
          title={isGuest ? 'Click to Sign In / Register' : `${currentUser?.name || 'Elena Vance'} (${currentUser?.role || 'Chief Hydrologist'})`}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: isGuest ? 'var(--color-surface-container-highest)' : 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isGuest ? 'var(--color-primary-container)' : 'var(--color-on-primary)',
            fontWeight: 700,
            boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)',
            border: isGuest ? '1px dashed var(--color-primary-container)' : 'none',
            cursor: 'pointer'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            {isGuest ? 'login' : 'person'}
          </span>
        </button>
      </div>
    </header>
  );
}
