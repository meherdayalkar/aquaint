import React from 'react';

export function ActionPriorityQueue({ 
  anomalies, 
  onSelectAnomaly, 
  onSimulateAnomaly 
}) {
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="stitch-card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 0.75rem',
          color: '#34d399'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>verified</span>
        </div>
        <h3 className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
          Zero Active Plumbing Emergencies
        </h3>
        <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px', maxWidth: '400px', margin: '4px auto 0' }}>
          All campus zones are strictly adhering to their learned diurnal baselines. No waste fingerprints detected.
        </p>
      </div>
    );
  }

  const getRankBadgeStyle = (rank) => {
    switch (rank) {
      case 1:
        return { bg: 'linear-gradient(135deg, #93000a 0%, #f43f5e 100%)', text: '#ffffff' };
      case 2:
        return { bg: 'linear-gradient(135deg, #d97706 0%, #f97316 100%)', text: '#ffffff' };
      case 3:
        return { bg: 'linear-gradient(135deg, #ca8a04 0%, #eab308 100%)', text: '#070b14' };
      default:
        return { bg: 'var(--color-surface-container-high)', text: 'var(--color-primary-container)' };
    }
  };

  return (
    <div id="tour-action-priority" className="stitch-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-container)', fontSize: '20px' }}>
              format_list_numbered
            </span>
            <h3 className="font-headline-sm" style={{ color: 'var(--color-on-surface)', fontSize: '1.05rem' }}>
              Algorithmic Action Priority Queue
            </h3>
          </div>
          <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.75rem' }}>
            Ranked by multi-factor score: Water Wasted (40%) + Cost Loss (25%) + Severity (20%) + Ease of Fix (15%).
          </p>
        </div>

        <span className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--color-outline)' }}>
          {anomalies.length} ACTIONABLE ITEMS
        </span>
      </div>

      {/* Ranked Queue Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {anomalies.map((item) => {
          const rankColors = getRankBadgeStyle(item.rank);

          return (
            <div 
              key={item.id}
              style={{
                backgroundColor: 'var(--color-surface-container-low)',
                border: item.rank === 1 ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(132, 147, 150, 0.12)',
                borderRadius: 'var(--radius-xl)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                transition: 'all 0.15s ease',
                boxShadow: item.rank === 1 ? '0 4px 16px rgba(147, 0, 10, 0.2)' : 'none'
              }}
            >
              
              {/* Left Column: Priority Rank Badge & Description */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 280px' }}>
                <div style={{
                  background: rankColors.bg,
                  color: rankColors.text,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                  flexShrink: 0
                }}>
                  {item.rankLabel}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <h4 className="font-title-md" style={{ color: 'var(--color-on-surface)', fontSize: '0.9rem' }}>
                      {item.fingerprint.name}
                    </h4>
                    <span style={{ color: 'var(--color-surface-container-highest)' }}>•</span>
                    <span className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.78rem' }}>
                      {item.zoneName.split('—')[0]}
                    </span>
                  </div>

                  <span className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.72rem', marginTop: '1px' }}>
                    {item.rootCauseTitle} ({item.confidenceScore}% confidence)
                  </span>
                </div>
              </div>

              {/* Middle Column: Waste & Savings Impact */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: 'var(--color-surface-container-lowest)',
                padding: '0.5rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(132, 147, 150, 0.08)'
              }}>
                <div>
                  <span className="font-label-sm" style={{ color: 'var(--color-outline)', display: 'block', fontSize: '0.65rem' }}>Estimated Waste</span>
                  <span className="font-mono" style={{ fontSize: '0.875rem', fontWeight: 800, color: '#ffb4ab' }}>
                    {item.estimatedWasteLitresDay.toLocaleString()} L/day
                  </span>
                </div>

                <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-surface-container-highest)' }} />

                <div>
                  <span className="font-label-sm" style={{ color: 'var(--color-outline)', display: 'block', fontSize: '0.65rem' }}>Potential Saving</span>
                  <span className="font-mono" style={{ fontSize: '0.875rem', fontWeight: 800, color: '#34d399' }}>
                    {(item.estimatedWasteLitresMonth).toLocaleString()} L/mo
                  </span>
                </div>

                <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-surface-container-highest)' }} />

                <div>
                  <span className="font-label-sm" style={{ color: 'var(--color-outline)', display: 'block', fontSize: '0.65rem' }}>Ease of Fix</span>
                  <span className="font-body-sm" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary-container)' }}>
                    {item.easeOfFix.split('(')[0]}
                  </span>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button 
                  className="stitch-btn stitch-btn-secondary"
                  onClick={() => onSelectAnomaly(item)}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                >
                  <span>Forensics</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>open_in_new</span>
                </button>

                <button 
                  className="stitch-btn stitch-btn-primary"
                  onClick={() => onSimulateAnomaly(item.simulationScenarioId)}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>tune</span>
                  <span>Simulate Fix</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
