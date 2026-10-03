import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  AlertTriangle, 
  Sliders, 
  Building2, 
  FileText, 
  Settings, 
  User, 
  Droplet,
  ChevronDown
} from 'lucide-react';

export function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  activeAnomaliesCount, 
  onOpenReport,
  currentUser,
  isGuest,
  onLogout,
  onOpenAuth,
  onTriggerTour,
  isOpen = true,
  onCloseMobile 
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Command Center',
      icon: 'grid_view',
      badge: null,
    },
    {
      id: 'monitoring',
      label: 'Live Monitoring',
      icon: 'waves',
      badge: 'LIVE',
      badgeClass: 'pill-tertiary',
    },
    {
      id: 'leakage',
      label: 'Leakage Intelligence',
      icon: 'warning',
      badge: activeAnomaliesCount > 0 ? activeAnomaliesCount : null,
      badgeClass: 'pill-error',
    },
    {
      id: 'simulator',
      label: 'What-If Simulator',
      icon: 'tune',
      badge: null,
    },
    {
      id: 'zones',
      label: 'Zone Criticality Matrix',
      icon: 'corporate_fare',
      badge: '6 NODES',
      badgeClass: 'pill-primary',
    },
    {
      id: 'briefing',
      label: 'Executive Briefing',
      icon: 'summarize',
      badge: null,
      action: onOpenReport,
    },
    {
      id: 'tour_trigger',
      label: 'Guided 7-Step Tour',
      icon: 'explore',
      badge: 'INTERACTIVE',
      badgeClass: 'pill-tertiary',
      action: onTriggerTour,
    }
  ];

  const displayName = isGuest ? 'Guest Explorer' : (currentUser?.name || 'Elena Vance');
  const displayRole = isGuest ? 'Simulated Access' : (currentUser?.role || 'Chief Hydrologist');

  return (
    <aside 
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '280px',
        backgroundColor: 'var(--color-surface-container-low)',
        borderRight: '1px solid rgba(132, 147, 150, 0.12)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        transition: 'transform 0.25s ease'
      }}
      className={`stitch-sidebar ${isOpen ? 'open' : ''}`}
    >
      {/* Top Branding & Navigation */}
      <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '1.5rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
        
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-surface-container-high)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 229, 255, 0.25)'
            }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-container)', fontSize: '22px' }}>
                water_drop
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="font-headline-sm" style={{ color: 'var(--color-on-surface)', lineHeight: 1 }}>
                AQUIANT
              </span>
              <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '3px' }}>
                Water Intelligence
              </span>
            </div>
          </div>

          <span className="font-label-sm" style={{
            padding: '2px 8px',
            borderRadius: '9999px',
            backgroundColor: isGuest ? 'rgba(0, 229, 255, 0.15)' : 'var(--color-surface-container-high)',
            color: isGuest ? 'var(--color-primary-container)' : 'var(--color-primary)',
            fontWeight: 700
          }}>
            {isGuest ? 'DEMO' : 'ENTERPRISE'}
          </span>
        </div>

        {/* Navigation List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setCurrentTab(item.id);
                  }
                  if (onCloseMobile) onCloseMobile();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-lg)',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--color-primary-container)' : 'transparent',
                  color: isActive ? 'var(--color-on-primary-container)' : 'var(--color-on-surface-variant)',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface-container-high)';
                    e.currentTarget.style.color = 'var(--color-on-surface)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-on-surface-variant)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {item.icon}
                  </span>
                  <span className="font-body-md" style={{ fontSize: '0.875rem' }}>
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span className={`stitch-pill ${item.badgeClass || 'pill-primary'}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status & Profile Block */}
      <div style={{
        padding: '1.25rem',
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderTop: '1px solid rgba(132, 147, 150, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {/* Active Grid Card */}
        <div style={{
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface-container-low)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          border: '1px solid rgba(132, 147, 150, 0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Active Grid
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: '15px', color: 'var(--color-outline)' }}>
              unfold_more
            </span>
          </div>
          <span className="font-title-md" style={{ color: 'var(--color-on-surface)', fontSize: '0.9rem' }}>
            Campus Central
          </span>
          <span className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.75rem' }}>
            6 Smart Hydro-Meters
          </span>
        </div>

        {/* Telemetry Mesh health indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.4rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface-container-low)',
          border: '1px solid rgba(132, 147, 150, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-tertiary-container)' }} className="ping-beacon" />
            <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Mesh Telemetry</span>
          </div>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>
            99.8%
          </span>
        </div>

        {/* Profile row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: isGuest ? 'var(--color-surface-container-highest)' : 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isGuest ? 'var(--color-primary-container)' : 'var(--color-on-primary)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {isGuest ? 'person_outline' : 'person'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="font-title-md" style={{ color: 'var(--color-on-surface)', fontSize: '0.8125rem', lineHeight: 1.2 }}>
                {displayName}
              </span>
              <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.6875rem' }}>
                {displayRole}
              </span>
            </div>
          </div>

          {isGuest ? (
            <button 
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-primary-container)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
              title="Sign In / Register"
              onClick={() => onOpenAuth('login')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>login</span>
            </button>
          ) : (
            <button 
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-on-surface-variant)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
              title="Sign Out"
              onClick={onLogout}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
            </button>
          )}
        </div>

      </div>
    </aside>
  );
}
