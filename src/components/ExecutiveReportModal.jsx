import React from 'react';

export function ExecutiveReportModal({ 
  timelineData, 
  budgetData, 
  analysisData, 
  onClose 
}) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportObj = {
      platform: 'AQUIANT AI Water Intelligence — Enterprise Edition',
      facility: 'Greenwood University Campus',
      generatedAt: new Date().toISOString(),
      budget: budgetData,
      anomalies: analysisData.anomalies,
      dailySummary: {
        totalActualLitres: budgetData.actualConsumedToday,
        totalExpectedLitres: budgetData.expectedConsumedToday,
        totalExcessLitres: budgetData.totalExcessLitres,
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aquaint-executive-report-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '880px', borderRadius: 'var(--radius-xl)' }}
      >
        
        {/* Header matching Stitch */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid rgba(132, 147, 150, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-surface-container-lowest)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-surface-container-high)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary-container)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>summarize</span>
            </div>
            <div>
              <h3 className="font-headline-sm" style={{ color: 'var(--color-on-surface)', fontSize: '1.25rem' }}>
                Executive Water Intelligence Briefing
              </h3>
              <span className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                Automated ISO 50001 / LEED Water Management Compliance Audit
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-on-surface-variant)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>close</span>
          </button>
        </div>

        {/* Report Content */}
        <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: 'var(--color-surface)' }}>
          
          {/* Metadata Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(132, 147, 150, 0.12)',
            paddingBottom: '0.75rem',
            fontSize: '0.8125rem',
            color: 'var(--color-outline)',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div><strong>Facility:</strong> Greenwood Campus Central (6 Smart Meters)</div>
            <div><strong>Audit Timeframe:</strong> Today (Continuous Diurnal Stream)</div>
            <div><strong>Inference Engine:</strong> AQUAINT Hybrid AI v2.4 (L4-OS)</div>
          </div>

          {/* Metric Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ backgroundColor: 'var(--color-surface-container-low)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(132, 147, 150, 0.1)' }}>
              <span className="font-label-sm" style={{ color: 'var(--color-outline)' }}>Actual Measured</span>
              <div className="font-mono font-headline-md" style={{ color: 'var(--color-on-surface)', marginTop: '2px', fontWeight: 800 }}>
                {budgetData.actualConsumedToday.toLocaleString()} L
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface-container-low)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(132, 147, 150, 0.1)' }}>
              <span className="font-label-sm" style={{ color: 'var(--color-outline)' }}>Dynamic Target</span>
              <div className="font-mono font-headline-md" style={{ color: 'var(--color-primary-container)', marginTop: '2px', fontWeight: 800 }}>
                {budgetData.dailyBudgetLitres.toLocaleString()} L
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface-container-low)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(132, 147, 150, 0.1)' }}>
              <span className="font-label-sm" style={{ color: 'var(--color-outline)' }}>Waste Volume Detected</span>
              <div className="font-mono font-headline-md" style={{ color: '#ffb4ab', marginTop: '2px', fontWeight: 800 }}>
                {budgetData.totalExcessLitres.toLocaleString()} L
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface-container-low)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(132, 147, 150, 0.1)' }}>
              <span className="font-label-sm" style={{ color: 'var(--color-outline)' }}>Recoverable Financial Run-Rate</span>
              <div className="font-mono font-headline-md" style={{ color: '#34d399', marginTop: '2px', fontWeight: 800 }}>
                ₹{Math.round(analysisData.totalEstimatedMonthlyLossCost).toLocaleString('en-IN')}/mo
              </div>
            </div>
          </div>

          {/* Remediation Priorities */}
          <div>
            <h4 className="font-headline-sm" style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--color-on-surface)' }}>
              Prioritized Remediation Directives
            </h4>

            {analysisData.anomalies.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {analysisData.anomalies.map((item, idx) => (
                  <div key={idx} style={{
                    backgroundColor: 'var(--color-surface-container)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem 1.25rem',
                    border: '1px solid rgba(132, 147, 150, 0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '0.8125rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: 'var(--color-primary-container)' }}>
                        {item.rankLabel}: {item.fingerprint.name} ({item.zoneName})
                      </strong>
                      <span className="stitch-pill pill-error">
                        {item.confidenceScore}% Confidence
                      </span>
                    </div>

                    <p style={{ color: 'var(--color-on-surface-variant)' }}>
                      <strong>Diagnosis:</strong> {item.rootCauseExplanation}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-outline)', fontSize: '0.75rem', borderTop: '1px dashed rgba(132, 147, 150, 0.15)', paddingTop: '6px', marginTop: '4px' }}>
                      <span>Directive: {item.recommendedAction}</span>
                      <strong style={{ color: '#34d399' }}>Saves: {item.estimatedWasteLitresDay.toLocaleString()} L/day</strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', color: '#34d399', fontSize: '0.8125rem' }}>
                ✓ No active hydraulic anomalies detected. Campus operations fully optimized.
              </div>
            )}
          </div>

          {/* Environmental Carbon Contribution */}
          <div style={{
            backgroundColor: 'rgba(0, 229, 255, 0.04)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            fontSize: '0.8125rem',
            lineHeight: 1.5
          }}>
            <h5 className="font-title-md" style={{ color: 'var(--color-primary-fixed)', fontSize: '0.9rem', marginBottom: '2px' }}>
              Sustainability &amp; Scope-2 GHG Offsets
            </h5>
            <p style={{ color: 'var(--color-on-surface-variant)' }}>
              Remediating active waste fingerprints reduces electrical grid pumping load by approximately{' '}
              <strong style={{ color: 'var(--color-on-surface)' }}>
                {((analysisData.totalEstimatedDailyLossLitres * 30 / 1000) * 0.45).toFixed(1)} kWh/month
              </strong>{' '}
              and eliminates{' '}
              <strong style={{ color: '#34d399' }}>
                {(((analysisData.totalEstimatedDailyLossLitres * 30 / 1000) * 0.45) * 0.82).toFixed(1)} kg CO₂e
              </strong>{' '}
              in campus carbon footprint.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '1.25rem 2rem',
          borderTop: '1px solid rgba(132, 147, 150, 0.12)',
          backgroundColor: 'var(--color-surface-container-lowest)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <button className="stitch-btn stitch-btn-secondary" onClick={onClose}>
            Close
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="stitch-btn stitch-btn-secondary" onClick={handleDownloadJSON}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
              <span>Export Telemetry JSON</span>
            </button>

            <button className="stitch-btn stitch-btn-primary" onClick={handlePrint}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>print</span>
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
