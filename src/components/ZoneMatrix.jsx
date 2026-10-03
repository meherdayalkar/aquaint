import React from 'react';
import { ZONES } from '../data/mockData.js';

export function ZoneMatrix({ 
  timelineData, 
  analysisData, 
  onSelectAnomaly, 
  onSimulateAnomaly 
}) {
  const records = timelineData.records || [];
  const currentHour = records.length > 0 ? records[records.length - 1] : null;

  const anomaliesByZone = {};
  analysisData.anomalies.forEach((a) => {
    anomaliesByZone[a.zoneId] = a;
  });

  return (
    <div id="tour-zone-matrix" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Section Header matching Stitch */}
      <div className="stitch-card" style={{ padding: '1.25rem 1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-surface-container-high)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary-container)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>corporate_fare</span>
            </div>
            <div>
              <h2 className="font-headline-md" style={{ color: 'var(--color-on-surface)', fontSize: '1.3rem' }}>
                Campus Zone &amp; Sub-Meter Matrix
              </h2>
              <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                Real-time localized telemetry, diurnal baseline tracking, and waste fingerprints for all 6 campus sectors.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Online Smart Meters:</span>
            <span className="stitch-pill pill-tertiary">6 / 6 OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* Grid of Zone Cards matching Stitch */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {ZONES.map((zone) => {
          let actual24h = 0;
          let expected24h = 0;
          let currentLpm = 0;

          records.forEach((r) => {
            const z = r.zones[zone.id];
            if (z) {
              actual24h += z.litres;
              expected24h += z.expectedLitres;
            }
          });

          if (currentHour && currentHour.zones[zone.id]) {
            currentLpm = currentHour.zones[zone.id].rateLpm;
          }

          const anomaly = anomaliesByZone[zone.id];
          const variance = expected24h > 0 
            ? Math.round(((actual24h - expected24h) / expected24h) * 100)
            : 0;

          return (
            <div
              key={zone.id}
              className="stitch-card"
              style={{
                borderTop: `4px solid ${anomaly ? '#f43f5e' : zone.color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                backgroundColor: 'var(--color-surface-container)'
              }}
            >
              <div>
                {/* Zone Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div>
                    <span className="font-mono font-label-sm" style={{ color: 'var(--color-outline)', letterSpacing: '0.06em' }}>
                      {zone.meterId}
                    </span>
                    <h3 className="font-headline-sm" style={{ fontSize: '1.05rem', marginTop: '2px', color: 'var(--color-on-surface)' }}>
                      {zone.name}
                    </h3>
                  </div>

                  {anomaly ? (
                    <span className="stitch-pill pill-error">
                      ANOMALY DETECTED
                    </span>
                  ) : (
                    <span className="stitch-pill pill-tertiary">
                      OPTIMAL
                    </span>
                  )}
                </div>

                <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: '0.5rem', fontSize: '0.78rem' }}>
                  {zone.description}
                </p>

                {/* Telemetry Metrics Strip */}
                <div style={{
                  marginTop: '1rem',
                  backgroundColor: 'var(--color-surface-container-low)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.875rem 1rem',
                  border: '1px solid rgba(132, 147, 150, 0.1)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem',
                  fontSize: '0.75rem'
                }}>
                  <div>
                    <span className="font-label-sm" style={{ color: 'var(--color-outline)', display: 'block' }}>24h Measured Flow</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                      <span className="font-mono font-title-md" style={{ color: anomaly ? '#ffb4ab' : 'var(--color-on-surface)', fontWeight: 800 }}>
                        {actual24h.toLocaleString()}
                      </span>
                      <span className="font-label-sm" style={{ color: 'var(--color-outline)' }}>L</span>
                    </div>
                    <span className="font-mono font-label-sm" style={{ color: variance > 10 ? '#ffb4ab' : '#34d399', fontWeight: 600 }}>
                      {variance > 0 ? `+${variance}%` : `${variance}%`} vs expected
                    </span>
                  </div>

                  <div>
                    <span className="font-label-sm" style={{ color: 'var(--color-outline)', display: 'block' }}>Current Rate</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                      <span className="font-mono font-title-md" style={{ color: 'var(--color-primary-container)', fontWeight: 800 }}>
                        {currentLpm}
                      </span>
                      <span className="font-label-sm" style={{ color: 'var(--color-outline)' }}>L/min</span>
                    </div>
                    <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      Learned diurnal band
                    </span>
                  </div>
                </div>

                {/* Anomaly Callout if Active */}
                {anomaly && (
                  <div style={{
                    marginTop: '0.75rem',
                    backgroundColor: 'rgba(147, 0, 10, 0.2)',
                    border: '1px solid rgba(244, 63, 94, 0.35)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.625rem 0.875rem',
                    fontSize: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffb4ab', fontWeight: 700 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>warning</span>
                      <span>{anomaly.rootCauseTitle}</span>
                    </div>
                    <p style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px', fontSize: '0.72rem' }}>
                      Probable waste: <strong style={{ color: '#ffb4ab' }}>{anomaly.estimatedWasteLitresDay.toLocaleString()} L/day</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{
                borderTop: '1px solid rgba(132, 147, 150, 0.12)',
                paddingTop: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <span className="font-label-sm" style={{ color: 'var(--color-outline)' }}>
                  Capacity: ~{zone.occupancyDefault} people
                </span>

                {anomaly ? (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      className="stitch-btn stitch-btn-secondary"
                      onClick={() => onSelectAnomaly(anomaly)}
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                    >
                      <span>Investigate</span>
                    </button>
                    <button 
                      className="stitch-btn stitch-btn-primary"
                      onClick={() => onSimulateAnomaly(anomaly.simulationScenarioId)}
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                    >
                      <span>Simulate</span>
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
                    <span>Nominal</span>
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
