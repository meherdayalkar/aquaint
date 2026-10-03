import React from 'react';

export function CommandCenterHero({ 
  budgetData, 
  analysisData, 
  onSimulateIsolation, 
  onInvestigateAnomaly 
}) {
  const { 
    dailyBudgetLitres, 
    actualConsumedToday, 
    expectedConsumedToday, 
    totalExcessLitres, 
    remainingBudgetLitres, 
    variancePercent, 
    budgetUtilizationPercent,
    isOverBudget,
    weatherAdjustmentNote 
  } = budgetData;

  const { anomalies, totalEstimatedDailyLossLitres, totalEstimatedMonthlyLossCost, criticalCount } = analysisData;
  const topAnomaly = anomalies[0];

  return (
    <div id="tour-dashboard-hero" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
      
      {/* 1. EXECUTIVE HEADER & PRIMARY INSIGHT */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-tertiary-container)' }} />
            <span className="font-label-sm" style={{ color: 'var(--color-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Executive Telemetry Deck
            </span>
          </div>
          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            Greenwood University Campus • 6 Smart Meter Nodes
          </p>
        </div>

        {/* Diagnostic Status Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--color-surface-container-low)',
            color: 'var(--color-on-surface-variant)',
            fontSize: '0.75rem'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isOverBudget ? 'var(--color-error)' : 'var(--color-tertiary-container)' }} />
            <span>{budgetUtilizationPercent}% dynamic budget utilized</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--color-surface-container-low)',
            color: 'var(--color-on-surface-variant)',
            fontSize: '0.75rem'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px', color: 'var(--color-tertiary)' }}>verified_user</span>
            <span>0 false alarms</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: anomalies.length > 0 ? 'rgba(147, 0, 10, 0.25)' : 'rgba(16, 185, 129, 0.15)',
            border: anomalies.length > 0 ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(16, 185, 129, 0.3)',
            color: anomalies.length > 0 ? '#ffb4ab' : '#34d399',
            fontSize: '0.75rem',
            fontWeight: 600
          }}>
            {anomalies.length > 0 ? (
              <>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f43f5e' }} className="ping-beacon" />
                <span>{anomalies.length} verified anomal{anomalies.length > 1 ? 'ies' : 'y'}</span>
              </>
            ) : (
              <>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span>All telemetry nominal</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. CORE METRIC DOMINANCE BLOCK */}
      <div 
        className="stitch-card-highlight"
        style={{
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 1 }}>
          <span className="font-label-md" style={{ color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Total Water Measured Today
          </span>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="font-display-xl font-mono" style={{ color: 'var(--color-primary-container)' }}>
              {actualConsumedToday.toLocaleString()}
            </span>
            <span className="font-headline-md" style={{ color: 'var(--color-on-surface-variant)', fontWeight: 400 }}>
              Litres
            </span>
          </div>

          <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
            <span style={{ color: isOverBudget ? '#ffb4ab' : 'var(--color-tertiary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {isOverBudget ? 'error' : 'check_circle'}
              </span>
              {isOverBudget 
                ? `${Math.abs(remainingBudgetLitres).toLocaleString()} L over dynamic cap` 
                : `${remainingBudgetLitres.toLocaleString()} L under dynamic daily budget`}
            </span>
            <span style={{ color: 'var(--color-outline-variant)' }}>•</span>
            <span>{dailyBudgetLitres.toLocaleString()} L target envelope</span>
            <span style={{ color: 'var(--color-outline-variant)' }}>•</span>
            <span style={{ color: variancePercent > 5 ? '#ffb4ab' : '#34d399' }}>
              {variancePercent > 0 ? `+${variancePercent}%` : `${variancePercent}%`} vs baseline
            </span>
          </p>
        </div>

        {/* Metric micro-gauge sparkline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 1, minWidth: '260px', flex: '0 1 300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>
            <span>Hydraulic Envelope Utilization</span>
            <span style={{ color: 'var(--color-primary-container)', fontWeight: 700 }}>
              {budgetUtilizationPercent}%
            </span>
          </div>

          <div style={{ width: '100%', height: '8px', borderRadius: '9999px', backgroundColor: 'var(--color-surface-container-highest)', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, budgetUtilizationPercent)}%`,
              height: '100%',
              borderRadius: '9999px',
              background: isOverBudget 
                ? 'linear-gradient(90deg, #00e5ff 0%, #f43f5e 100%)' 
                : 'linear-gradient(90deg, #00a2e6 0%, #00e5ff 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6875rem', color: 'var(--color-on-surface-variant)', opacity: 0.8 }}>
            <span>0 L</span>
            <span>{dailyBudgetLitres.toLocaleString()} L Dynamic Cap</span>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE ANOMALY & INTELLIGENCE SPOTLIGHT */}
      {topAnomaly ? (
        <section className="stitch-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderColor: 'rgba(244, 63, 94, 0.35)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(147, 0, 10, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#ffb4ab' }}>warning</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="stitch-pill pill-error" style={{ fontSize: '0.7rem' }}>
                    ANOMALY DETECTED • {topAnomaly.severity} SEVERITY
                  </span>
                  <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Node UID: {topAnomaly.meterId}
                  </span>
                </div>
                <h2 className="font-headline-sm" style={{ color: 'var(--color-on-surface)', marginTop: '2px' }}>
                  {topAnomaly.zoneName}
                </h2>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button 
                className="stitch-btn stitch-btn-secondary"
                onClick={() => onSimulateIsolation(topAnomaly.simulationScenarioId)}
              >
                Simulate Isolation
              </button>

              <button 
                className="stitch-btn stitch-btn-primary"
                onClick={() => onInvestigateAnomaly(topAnomaly)}
              >
                <span>Investigate Anomaly</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Telemetry Strip (4 metric boxes) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            paddingTop: '0.25rem'
          }}>
            <div style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Observed Flow Rate
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span className="font-title-md font-mono" style={{ color: '#ffb4ab', fontWeight: 800, fontSize: '1.25rem' }}>
                  {topAnomaly.observedRate.split(' ')[0]}
                </span>
                <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>L/min</span>
              </div>
              <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                Baseline: {topAnomaly.expectedRate}
              </span>
            </div>

            <div style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Duration In Breach
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span className="font-title-md font-mono" style={{ color: 'var(--color-on-surface)', fontWeight: 800, fontSize: '1.25rem' }}>
                  {topAnomaly.duration.split(' ')[0]}
                </span>
                <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Continuous</span>
              </div>
              <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                Began {topAnomaly.detectedAt.split('(')[0]}
              </span>
            </div>

            <div style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Projected Volume Loss
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span className="font-title-md font-mono" style={{ color: '#ffb4ab', fontWeight: 800, fontSize: '1.25rem' }}>
                  {topAnomaly.estimatedWasteLitresDay.toLocaleString()}
                </span>
                <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>L/day</span>
              </div>
              <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                ~{Math.round((topAnomaly.estimatedWasteLitresDay / actualConsumedToday) * 100)}% of campus intake
              </span>
            </div>

            <div style={{ padding: '0.875rem 1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface-container-low)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Financial Exposure
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span className="font-title-md font-mono" style={{ color: 'var(--color-on-surface)', fontWeight: 800, fontSize: '1.25rem' }}>
                  ₹{Math.round(topAnomaly.monthlyCostLoss).toLocaleString('en-IN')}
                </span>
                <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>/mo</span>
              </div>
              <span className="font-label-sm" style={{ color: '#34d399' }}>
                Isolation saves ₹{Math.round(topAnomaly.monthlyCostLoss / 30).toLocaleString('en-IN')}/day
              </span>
            </div>
          </div>
        </section>
      ) : (
        <section className="stitch-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.75rem', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>verified</span>
            </div>
            <div>
              <h3 className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
                All 6 Campus Zones Operating In Optimal Hydraulic Envelope
              </h3>
              <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                Zero active pipe ruptures, unmitigated tank overflows, or weather-blind irrigation triggers detected.
              </p>
            </div>
          </div>

          <span className="stitch-pill pill-tertiary">100% NOMINAL</span>
        </section>
      )}

    </div>
  );
}
