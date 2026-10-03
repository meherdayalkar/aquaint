import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export function RootCauseModal({ 
  anomaly, 
  onClose, 
  onOpenSimulatorWithScenario, 
  onDispatchWorkOrder 
}) {
  const [isDispatched, setIsDispatched] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState({ 0: false, 1: false });

  if (!anomaly) return null;

  const { 
    zoneName, 
    meterId, 
    fingerprint, 
    confidenceScore, 
    severity, 
    detectedAt, 
    duration, 
    observedRate, 
    expectedRate, 
    excessRate, 
    estimatedWasteLitresDay, 
    estimatedWasteLitresMonth, 
    monthlyCostLoss, 
    evidenceSummary, 
    rootCauseTitle, 
    rootCauseExplanation, 
    recommendedAction, 
    easeOfFix,
    simulationScenarioId 
  } = anomaly;

  const toggleCheck = (idx) => {
    setCheckedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleDispatch = () => {
    setIsDispatched(true);
    if (onDispatchWorkOrder) {
      onDispatchWorkOrder(anomaly);
    }
  };

  const handleSimulate = () => {
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
    onClose();
    if (onOpenSimulatorWithScenario) {
      onOpenSimulatorWithScenario(simulationScenarioId);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '920px', borderRadius: 'var(--radius-xl)' }}
      >
        
        {/* Incident Banner Header matching Stitch */}
        <div style={{
          padding: '1.5rem 2rem',
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderBottom: '1px solid rgba(132, 147, 150, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* Top Breadcrumb & Incident Tag */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button 
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-container-low)',
                  color: 'var(--color-on-surface-variant)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8125rem'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
                <span>Back to Dashboard</span>
              </button>

              <span style={{ color: 'var(--color-surface-container-highest)' }}>/</span>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(147, 0, 10, 0.3)'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f43f5e' }} className="ping-beacon" />
                <span className="font-label-sm" style={{ color: '#ffb4ab', fontWeight: 700, letterSpacing: '0.08em' }}>
                  INCIDENT #HYD-9042-B • {severity} SEVERITY • UNRESOLVED
                </span>
              </div>
            </div>

            {/* Action Group */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button 
                className="stitch-btn stitch-btn-secondary"
                onClick={handleSimulate}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>tune</span>
                <span>Simulate Isolation in What-If</span>
              </button>

              <button 
                className={isDispatched ? "stitch-btn stitch-btn-secondary" : "stitch-btn stitch-btn-primary"}
                onClick={handleDispatch}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  {isDispatched ? 'check_circle' : 'send_and_archive'}
                </span>
                <span>{isDispatched ? 'Squad Dispatched (WO-8924)' : 'Dispatch Squad (WO-8924)'}</span>
              </button>
            </div>
          </div>

          {/* Title & Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h1 className="font-headline-md" style={{ color: 'var(--color-on-surface)', fontSize: '1.4rem' }}>
              Active Leakage Investigation: {zoneName}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: 'var(--color-on-surface-variant)' }}>
              <span style={{ color: '#ffb4ab', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span>
                Detected {duration} (at {detectedAt})
              </span>
              <span>•</span>
              <span>Greenwood University Campus</span>
              <span>•</span>
              <span className="stitch-pill pill-primary" style={{ fontSize: '0.6875rem' }}>
                Hydraulic Node: {meterId}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* 4 Key Forensic Metrics Grid matching Stitch */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            backgroundColor: 'var(--color-surface-container-low)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(132, 147, 150, 0.12)'
          }}>
            {/* Metric 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-on-surface-variant)' }}>
                <span className="font-label-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Observed Flow</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ffb4ab' }}>waves</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                <span className="font-headline-md font-mono" style={{ color: '#ffb4ab', fontWeight: 800 }}>
                  {observedRate.split(' ')[0]}
                </span>
                <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>L/min</span>
              </div>
              <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.72rem' }}>
                Learned baseline: <strong style={{ color: 'var(--color-tertiary)' }}>{expectedRate}</strong> ({excessRate})
              </p>
            </div>

            {/* Metric 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-on-surface-variant)' }}>
                <span className="font-label-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cumulative Net Loss</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>opacity</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                <span className="font-headline-md font-mono" style={{ color: 'var(--color-on-surface)', fontWeight: 800 }}>
                  {estimatedWasteLitresDay.toLocaleString()}
                </span>
                <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Litres</span>
              </div>
              <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.72rem' }}>
                Projected 24h loss: <strong style={{ color: 'var(--color-primary-container)' }}>{estimatedWasteLitresDay.toLocaleString()} L</strong>
              </p>
            </div>

            {/* Metric 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-on-surface-variant)' }}>
                <span className="font-label-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Financial Exposure</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary-fixed)' }}>account_balance</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                <span className="font-headline-md font-mono" style={{ color: 'var(--color-primary-container)', fontWeight: 800 }}>
                  ₹{Math.round(monthlyCostLoss).toLocaleString('en-IN')}
                </span>
                <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>/mo</span>
              </div>
              <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.72rem' }}>
                Run-rate: <strong style={{ color: 'var(--color-on-surface)' }}>₹{Math.round(monthlyCostLoss / 30).toLocaleString('en-IN')}/day</strong> @ ₹48/kL
              </p>
            </div>

            {/* Metric 4 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-on-surface-variant)' }}>
                <span className="font-label-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pipe Integrity Status</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ffb4ab' }}>crisis_alert</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                <span className="font-headline-md font-mono" style={{ color: '#ffb4ab', fontWeight: 800 }}>
                  Critical Risk
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--color-surface-container-high)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${confidenceScore}%`, height: '100%', backgroundColor: '#f43f5e', borderRadius: '9999px' }} />
                </div>
                <span className="font-label-sm" style={{ color: '#ffb4ab', fontWeight: 700 }}>
                  {confidenceScore}% Prob.
                </span>
              </div>
            </div>
          </div>

          {/* Section: "Why is this happening?" Natural Language Root-Cause Reasoning */}
          <div style={{
            backgroundColor: 'rgba(0, 229, 255, 0.04)',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-container)', fontSize: '20px' }}>
                auto_awesome
              </span>
              <h4 className="font-headline-sm" style={{ fontSize: '1.05rem', color: 'var(--color-on-surface)' }}>
                Why is this happening? (AI Root-Cause Inference)
              </h4>
            </div>

            <p className="font-body-md" style={{ color: 'var(--color-on-surface)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--color-primary-container)' }}>Probable Cause: </strong>
              {rootCauseExplanation}
            </p>
          </div>

          {/* AI Insight Transparency & Data Provenance Panel */}
          <div style={{
            backgroundColor: 'var(--color-surface-container-low)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            border: '1px solid rgba(132, 147, 150, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: '18px' }}>
                  info
                </span>
                <span className="font-label-sm" style={{ color: 'var(--color-on-surface)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  AI Transparency & Data Provenance
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-outline)' }}>
                ISO 50001 Guideline Adherent
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem',
              fontSize: '0.75rem',
              color: 'var(--color-on-surface-variant)'
            }}>
              <div>
                <strong style={{ color: 'var(--color-primary-container)', display: 'block' }}>📡 Sensor Telemetry:</strong>
                <span>Direct flow & pressure readings from smart meter UID: {meterId}.</span>
              </div>
              <div>
                <strong style={{ color: '#ffb4ab', display: 'block' }}>🧠 Model Inference:</strong>
                <span>Probabilistic pattern match ({confidenceScore}% confidence). Not a certified physical diagnosis.</span>
              </div>
              <div>
                <strong style={{ color: 'var(--color-tertiary)', display: 'block' }}>📊 Projected Impact:</strong>
                <span>Estimated unmitigated daily loss ({estimatedWasteLitresDay.toLocaleString()} L/day) @ ₹48/kL.</span>
              </div>
              <div>
                <strong style={{ color: '#34d399', display: 'block' }}>🧪 Calibration Context:</strong>
                <span>Evaluated against Greenwood University Campus historical diurnal envelopes.</span>
              </div>
            </div>
          </div>

          {/* Physical & Meteorological Grounding */}
          <div>
            <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Physical & Meteorological Telemetry Grounding:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              {evidenceSummary.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.625rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-container-low)',
                  border: '1px solid rgba(132, 147, 150, 0.1)',
                  fontSize: '0.8125rem'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary-container)', flexShrink: 0, marginTop: '1px' }}>
                    verified
                  </span>
                  <span style={{ color: 'var(--color-on-surface-variant)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Remediation Checklist */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Recommended Field Checklist (Plumbing Protocol):
              </span>
              <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                Ease: <strong style={{ color: 'var(--color-primary-container)' }}>{easeOfFix}</strong>
              </span>
            </div>

            <div style={{
              backgroundColor: 'var(--color-surface-container-low)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              border: '1px solid rgba(132, 147, 150, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer', fontSize: '0.84rem' }}>
                <input 
                  type="checkbox" 
                  checked={checkedSteps[0]} 
                  onChange={() => toggleCheck(0)}
                  style={{ marginTop: '3px', accentColor: 'var(--color-primary-container)' }}
                />
                <span style={{ color: checkedSteps[0] ? 'var(--color-outline)' : 'var(--color-on-surface)', textDecoration: checkedSteps[0] ? 'line-through' : 'none' }}>
                  {recommendedAction}
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer', fontSize: '0.84rem' }}>
                <input 
                  type="checkbox" 
                  checked={checkedSteps[1]} 
                  onChange={() => toggleCheck(1)}
                  style={{ marginTop: '3px', accentColor: 'var(--color-primary-container)' }}
                />
                <span style={{ color: checkedSteps[1] ? 'var(--color-outline)' : 'var(--color-on-surface)', textDecoration: checkedSteps[1] ? 'line-through' : 'none' }}>
                  Verify zero-flow baseline settling once isolation or repair is completed.
                </span>
              </label>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 2rem',
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderTop: '1px solid rgba(132, 147, 150, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <button className="stitch-btn stitch-btn-secondary" onClick={onClose}>
            Close Forensic Deck
          </button>

          <button className="stitch-btn stitch-btn-primary" onClick={handleSimulate}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>tune</span>
            <span>Simulate Fix in What-If Engine</span>
          </button>
        </div>

      </div>
    </div>
  );
}
