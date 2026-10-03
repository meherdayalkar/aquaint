import React from 'react';
import { DEMO_SCENARIOS } from '../data/mockData';

export function DemoControlBar({ 
  currentScenario, 
  onSelectScenario, 
  onTriggerAutoTour, 
  isAutoTouring 
}) {
  return (
    <div style={{
      width: '100%',
      padding: '0.625rem 2rem',
      backgroundColor: 'rgba(8, 14, 27, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(132, 147, 150, 0.12)',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      zIndex: 35
    }}>
      
      {/* Left: Scenario Suite Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-fixed-dim)', fontSize: '18px' }}>
            science
          </span>
          <span className="font-label-sm" style={{ color: 'var(--color-primary-fixed)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Scenario Suite
          </span>
        </div>

        {/* Scenario Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          
          {/* Normal */}
          <button
            onClick={() => onSelectScenario('NORMAL')}
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              border: currentScenario === 'NORMAL' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(132, 147, 150, 0.15)',
              backgroundColor: currentScenario === 'NORMAL' ? 'rgba(16, 185, 129, 0.2)' : 'var(--color-surface-container-high)',
              color: currentScenario === 'NORMAL' ? '#34d399' : 'var(--color-on-surface-variant)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: currentScenario === 'NORMAL' ? 700 : 500,
              transition: 'all 0.15s ease'
            }}
          >
            Normal Baseline
          </button>

          {/* Block B Leak */}
          <button
            onClick={() => onSelectScenario('BLOCK_B_LEAK')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              border: currentScenario === 'BLOCK_B_LEAK' ? '1px solid rgba(244, 63, 94, 0.5)' : '1px solid rgba(132, 147, 150, 0.15)',
              backgroundColor: currentScenario === 'BLOCK_B_LEAK' ? 'rgba(147, 0, 10, 0.35)' : 'var(--color-surface-container-high)',
              color: currentScenario === 'BLOCK_B_LEAK' ? '#ffb4ab' : 'var(--color-on-surface-variant)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: currentScenario === 'BLOCK_B_LEAK' ? 700 : 500,
              transition: 'all 0.15s ease'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>warning</span>
            <span>1: Block B Leak</span>
          </button>

          {/* Rain Irrigation */}
          <button
            onClick={() => onSelectScenario('RAIN_IRRIGATION')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              border: currentScenario === 'RAIN_IRRIGATION' ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(132, 147, 150, 0.15)',
              backgroundColor: currentScenario === 'RAIN_IRRIGATION' ? 'rgba(245, 158, 11, 0.25)' : 'var(--color-surface-container-high)',
              color: currentScenario === 'RAIN_IRRIGATION' ? '#fbbf24' : 'var(--color-on-surface-variant)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: currentScenario === 'RAIN_IRRIGATION' ? 700 : 500,
              transition: 'all 0.15s ease'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>rainy</span>
            <span>2: Rain Irrigation</span>
          </button>

          {/* Tank Overflow */}
          <button
            onClick={() => onSelectScenario('TANK_OVERFLOW')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              border: currentScenario === 'TANK_OVERFLOW' ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid rgba(132, 147, 150, 0.15)',
              backgroundColor: currentScenario === 'TANK_OVERFLOW' ? 'rgba(168, 85, 247, 0.25)' : 'var(--color-surface-container-high)',
              color: currentScenario === 'TANK_OVERFLOW' ? '#c084fc' : 'var(--color-on-surface-variant)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: currentScenario === 'TANK_OVERFLOW' ? 700 : 500,
              transition: 'all 0.15s ease'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>waves</span>
            <span>3: Tank Overflow</span>
          </button>

          {/* Hostel Tap */}
          <button
            onClick={() => onSelectScenario('HOSTEL_FIXTURE')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              border: currentScenario === 'HOSTEL_FIXTURE' ? '1px solid rgba(234, 179, 8, 0.5)' : '1px solid rgba(132, 147, 150, 0.15)',
              backgroundColor: currentScenario === 'HOSTEL_FIXTURE' ? 'rgba(234, 179, 8, 0.25)' : 'var(--color-surface-container-high)',
              color: currentScenario === 'HOSTEL_FIXTURE' ? '#facc15' : 'var(--color-on-surface-variant)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: currentScenario === 'HOSTEL_FIXTURE' ? 700 : 500,
              transition: 'all 0.15s ease'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>water_damage</span>
            <span>4: Hostel Tap</span>
          </button>

          {/* Multi Incident */}
          <button
            onClick={() => onSelectScenario('ALL_COMBINED')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              border: currentScenario === 'ALL_COMBINED' ? '1px solid rgba(0, 229, 255, 0.5)' : '1px solid rgba(132, 147, 150, 0.15)',
              backgroundColor: currentScenario === 'ALL_COMBINED' ? 'rgba(0, 229, 255, 0.2)' : 'var(--color-surface-container-high)',
              color: currentScenario === 'ALL_COMBINED' ? 'var(--color-primary-container)' : 'var(--color-on-surface-variant)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: currentScenario === 'ALL_COMBINED' ? 700 : 500,
              transition: 'all 0.15s ease'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>bolt</span>
            <span>5: Multi-Incident</span>
          </button>
        </div>
      </div>

      {/* Right: 7-Step Journey Breadcrumbs & Tour Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem' }} className="font-mono">
          <span style={{ color: 'var(--color-primary-fixed)' }}>Measure</span>
          <span style={{ color: 'var(--color-outline-variant)' }}>→</span>
          <span style={{ color: 'var(--color-on-surface-variant)' }}>Understand</span>
          <span style={{ color: 'var(--color-outline-variant)' }}>→</span>
          <span style={{ color: '#ffb4ab' }}>Detect</span>
          <span style={{ color: 'var(--color-outline-variant)' }}>→</span>
          <span style={{ color: 'var(--color-on-surface-variant)' }}>Explain</span>
          <span style={{ color: 'var(--color-outline-variant)' }}>→</span>
          <span style={{ color: 'var(--color-on-surface-variant)' }}>Simulate</span>
          <span style={{ color: 'var(--color-outline-variant)' }}>→</span>
          <span style={{ color: 'var(--color-on-surface-variant)' }}>Recommend</span>
          <span style={{ color: 'var(--color-outline-variant)' }}>→</span>
          <span style={{ color: '#34d399' }}>Save</span>
        </div>

        <button 
          onClick={onTriggerAutoTour}
          className="stitch-btn stitch-btn-primary"
          style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            {isAutoTouring ? 'pause' : 'play_arrow'}
          </span>
          <span>{isAutoTouring ? 'Tour Playing...' : 'Start 7-Step Tour'}</span>
        </button>
      </div>

    </div>
  );
}
