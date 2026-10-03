import React from 'react';

export function FingerprintCard({ anomaly, onSelect }) {
  const { 
    zoneName, 
    meterId, 
    fingerprint, 
    confidenceScore, 
    severity, 
    duration, 
    observedRate, 
    expectedRate, 
    excessRate, 
    estimatedWasteLitresDay, 
    monthlyCostLoss, 
    rootCauseExplanation, 
    rankLabel 
  } = anomaly;

  const renderIcon = () => {
    switch (fingerprint.id) {
      case 'PIPE_LEAK':
        return <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#ffb4ab' }}>warning</span>;
      case 'RAIN_IRRIGATION':
        return <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#fbbf24' }}>rainy</span>;
      case 'TANK_OVERFLOW':
        return <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#c084fc' }}>waves</span>;
      case 'FIXTURE_RUNNING':
        return <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#facc15' }}>water_damage</span>;
      default:
        return <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary-container)' }}>bolt</span>;
    }
  };

  return (
    <div 
      className="stitch-card"
      style={{
        borderLeft: `4px solid ${fingerprint.color}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '1.25rem'
      }}
    >
      <div>
        {/* Top Header: Rank, Zone, Confidence Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              backgroundColor: fingerprint.color,
              color: '#070b14',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.6875rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)'
            }}>
              {rankLabel || 'PRIORITY'}
            </span>

            <span className="font-title-md" style={{ color: 'var(--color-on-surface)', fontSize: '0.875rem' }}>
              {zoneName}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className={`stitch-pill ${fingerprint.badgeClass}`}>
              {fingerprint.severity}
            </span>
            <span className="font-mono" style={{
              fontSize: '0.6875rem',
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-surface-container-high)',
              color: 'var(--color-primary-container)',
              fontWeight: 700
            }}>
              {confidenceScore}% CONFIDENCE
            </span>
          </div>
        </div>

        {/* Fingerprint Classification Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface-container-high)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {renderIcon()}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-primary-container)' }}>fingerprint</span>
              <span className="font-label-sm" style={{ color: 'var(--color-primary-container)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Waveform Fingerprint:
              </span>
            </div>
            <h4 className="font-headline-sm" style={{ color: 'var(--color-on-surface)', fontSize: '1rem', marginTop: '1px' }}>
              {fingerprint.name}
            </h4>
          </div>
        </div>

        {/* Forensic Telemetry Snapshot */}
        <div style={{
          marginTop: '0.875rem',
          backgroundColor: 'var(--color-surface-container-low)',
          borderRadius: 'var(--radius-md)',
          padding: '0.625rem 0.75rem',
          border: '1px solid rgba(132, 147, 150, 0.1)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          fontSize: '0.75rem'
        }}>
          <div>
            <span style={{ color: 'var(--color-on-surface-variant)', display: 'block', fontSize: '0.6875rem' }}>Observed Flow</span>
            <strong className="font-mono" style={{ color: '#ffb4ab', fontSize: '0.8125rem' }}>{observedRate}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--color-on-surface-variant)', display: 'block', fontSize: '0.6875rem' }}>Expected Normal</span>
            <strong className="font-mono" style={{ color: 'var(--color-secondary)', fontSize: '0.8125rem' }}>{expectedRate}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--color-on-surface-variant)', display: 'block', fontSize: '0.6875rem' }}>Duration</span>
            <strong className="font-mono" style={{ color: 'var(--color-on-surface)', fontSize: '0.8125rem' }}>{duration}</strong>
          </div>
        </div>

        {/* Human-readable AI Root-Cause snippet */}
        <p style={{
          marginTop: '0.75rem',
          fontSize: '0.78rem',
          color: 'var(--color-on-surface-variant)',
          lineHeight: '1.45',
          backgroundColor: 'rgba(0, 229, 255, 0.04)',
          borderLeft: '2px solid var(--color-primary-container)',
          padding: '6px 8px',
          borderRadius: '0 4px 4px 0'
        }}>
          <strong style={{ color: 'var(--color-primary-container)' }}>Probable Cause (AI Inference): </strong>
          {rootCauseExplanation}
        </p>

        {/* Data Provenance Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-outline)', backgroundColor: 'var(--color-surface-container-high)', padding: '2px 6px', borderRadius: '4px' }}>
            📡 Telemetry: Node {meterId}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-outline)', backgroundColor: 'var(--color-surface-container-high)', padding: '2px 6px', borderRadius: '4px' }}>
            🧠 Statistical Confidence: {confidenceScore}%
          </span>
        </div>
      </div>

      {/* Footer Metrics & Action Trigger */}
      <div style={{
        borderTop: '1px solid rgba(132, 147, 150, 0.12)',
        paddingTop: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-on-surface-variant)', display: 'block' }}>Projected Daily Loss</span>
          <span className="font-mono" style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#ffb4ab' }}>
            {estimatedWasteLitresDay.toLocaleString()} L/day
          </span>
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-outline)', marginLeft: '4px' }}>
            (₹{Math.round(monthlyCostLoss).toLocaleString('en-IN')}/mo)
          </span>
        </div>

        <button 
          className="stitch-btn stitch-btn-secondary"
          onClick={() => onSelect(anomaly)}
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
        >
          <span>Root-Cause Details</span>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
