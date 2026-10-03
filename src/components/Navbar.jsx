import React from 'react';
import { 
  Droplet, 
  Activity, 
  CloudRain, 
  Sun, 
  Sliders, 
  LayoutDashboard, 
  Building2, 
  FileText,
  ShieldAlert
} from 'lucide-react';

export function Navbar({ 
  currentTab, 
  setCurrentTab, 
  weather, 
  activeAnomaliesCount, 
  onOpenReport 
}) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #00f2fe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
            position: 'relative'
          }}>
            <Droplet size={24} color="#070b14" strokeWidth={2.4} fill="#070b14" />
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.35rem', 
                fontWeight: 800, 
                letterSpacing: '-0.03em', 
                background: 'linear-gradient(to right, #ffffff, #7dd3fc, #00f2fe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                AQUAINT
              </span>
              <span style={{
                fontSize: '0.68rem',
                padding: '2px 7px',
                borderRadius: '999px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--blue-sky)',
                fontWeight: 700,
                border: '1px solid rgba(56, 189, 248, 0.3)',
                letterSpacing: '0.05em'
              }}>
                AI WATER INTEL
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={12} />
              <span>Campus Facility — Greenwood University (6 Smart Meters)</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 24, 44, 0.7)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <button 
            className={`btn btn-sm ${currentTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentTab('dashboard')}
            style={{ border: 'none' }}
          >
            <LayoutDashboard size={15} />
            <span>Telemetry Dashboard</span>
          </button>

          <button 
            className={`btn btn-sm ${currentTab === 'simulator' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentTab('simulator')}
            style={{ border: 'none' }}
          >
            <Sliders size={15} />
            <span>What-If Simulator</span>
          </button>

          <button 
            className={`btn btn-sm ${currentTab === 'zones' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentTab('zones')}
            style={{ border: 'none' }}
          >
            <Building2 size={15} />
            <span>Zone Matrix</span>
          </button>
        </nav>

        {/* Live Status and Context Widgets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Weather pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '10px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem'
          }}>
            {weather.rainfallMm > 0 ? (
              <CloudRain size={16} color="#38bdf8" />
            ) : (
              <Sun size={16} color="#f59e0b" />
            )}
            <span style={{ fontWeight: 600 }}>{weather.temp}°C</span>
            <span style={{ color: 'var(--text-dim)' }}>|</span>
            <span style={{ color: weather.rainfallMm > 0 ? '#38bdf8' : 'var(--text-muted)' }}>
              {weather.rainfallMm > 0 ? `${weather.rainfallMm}mm Rain` : '0mm Rain'}
            </span>
          </div>

          {/* Anomaly Health status pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '10px',
            background: activeAnomaliesCount > 0 ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)',
            border: activeAnomaliesCount > 0 ? '1px solid rgba(244, 63, 94, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)',
            fontSize: '0.78rem'
          }}>
            <span className={activeAnomaliesCount > 0 ? 'pulse-indicator pulse-danger' : 'pulse-indicator'} />
            <span style={{ 
              fontWeight: 700, 
              color: activeAnomaliesCount > 0 ? '#fb7185' : '#34d399',
              fontFamily: 'var(--font-mono)' 
            }}>
              {activeAnomaliesCount > 0 
                ? `${activeAnomaliesCount} ANOMAL${activeAnomaliesCount > 1 ? 'IES' : 'Y'} DETECTED` 
                : 'ALL ZONES OPTIMAL'}
            </span>
          </div>

          {/* Export / Report button */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenReport}
            title="Generate AI Intelligence Briefing"
          >
            <FileText size={15} />
            <span>Briefing</span>
          </button>

        </div>

      </div>
    </header>
  );
}
