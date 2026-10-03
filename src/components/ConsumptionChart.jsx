import React, { useState } from 'react';
import { ZONES } from '../data/mockData.js';

export function ConsumptionChart({ 
  timelineData, 
  simulatedRecords = null, 
  onSelectAnomalyHour 
}) {
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('ALL');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const records = timelineData.records || [];
  if (records.length === 0) return null;

  // Chart dimensions & scaling
  const svgWidth = 1000;
  const svgHeight = 280;
  const padding = { top: 25, right: 35, bottom: 35, left: 65 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  let maxY = 1000;
  records.forEach((r, idx) => {
    let actualVal = r.totalActualLitres;
    let expectedVal = r.totalExpectedLitres;
    let upperVal = r.baselineUpperBound;

    if (selectedZoneFilter !== 'ALL') {
      const zData = r.zones[selectedZoneFilter];
      if (zData) {
        actualVal = zData.litres;
        expectedVal = zData.expectedLitres;
        upperVal = Math.round(zData.expectedLitres * 1.25 + 50);
      }
    }

    let simVal = 0;
    if (simulatedRecords && simulatedRecords[idx]) {
      if (selectedZoneFilter === 'ALL') {
        simVal = simulatedRecords[idx].simulatedLitres || 0;
      } else if (simulatedRecords[idx].zones && simulatedRecords[idx].zones[selectedZoneFilter]) {
        simVal = simulatedRecords[idx].zones[selectedZoneFilter].litres || 0;
      }
    }
    maxY = Math.max(maxY, actualVal, expectedVal, upperVal, simVal);
  });
  maxY = Math.ceil((maxY * 1.15) / 500) * 500;

  const getX = (hour) => padding.left + (hour / 23) * graphWidth;
  const getY = (val) => padding.top + graphHeight - (val / maxY) * graphHeight;

  // Generate points
  const expectedPoints = [];
  const upperPoints = [];
  const lowerPoints = [];
  const actualPoints = [];
  const simulatedPoints = [];

  records.forEach((r, idx) => {
    let actualVal = r.totalActualLitres;
    let expectedVal = r.totalExpectedLitres;
    let upperVal = r.baselineUpperBound;
    let lowerVal = r.baselineLowerBound;

    if (selectedZoneFilter !== 'ALL') {
      const zData = r.zones[selectedZoneFilter];
      if (zData) {
        actualVal = zData.litres;
        expectedVal = zData.expectedLitres;
        upperVal = Math.round(zData.expectedLitres * 1.25 + 50);
        lowerVal = Math.round(Math.max(0, zData.expectedLitres * 0.75 - 20));
      }
    }

    const x = getX(r.hour);
    const yActual = getY(actualVal);
    const yExpected = getY(expectedVal);
    const yUpper = getY(upperVal);
    const yLower = getY(lowerVal);

    actualPoints.push({ x, y: yActual, val: actualVal, record: r });
    expectedPoints.push({ x, y: yExpected, val: expectedVal });
    upperPoints.push({ x, y: yUpper, val: upperVal });
    lowerPoints.push({ x, y: yLower, val: lowerVal });

    if (simulatedRecords && simulatedRecords[idx]) {
      let simVal = 0;
      if (selectedZoneFilter === 'ALL') {
        simVal = simulatedRecords[idx].simulatedLitres || 0;
      } else if (simulatedRecords[idx].zones && simulatedRecords[idx].zones[selectedZoneFilter]) {
        simVal = simulatedRecords[idx].zones[selectedZoneFilter].litres || 0;
      }
      simulatedPoints.push({ x, y: getY(simVal), val: simVal });
    }
  });

  const createSmoothLine = (pts) => {
    if (pts.length === 0) return '';
    return pts.reduce((acc, curr, i, arr) => {
      if (i === 0) return `M ${curr.x} ${curr.y}`;
      const prev = arr[i - 1];
      const cx = (prev.x + curr.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }, '');
  };

  const actualPath = createSmoothLine(actualPoints);
  const expectedPath = createSmoothLine(expectedPoints);
  const simPath = simulatedPoints.length > 0 ? createSmoothLine(simulatedPoints) : '';

  let bandAreaPath = '';
  if (upperPoints.length > 0 && lowerPoints.length > 0) {
    const forward = upperPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const backward = [...lowerPoints].reverse().map((p) => `L ${p.x} ${p.y}`).join(' ');
    bandAreaPath = `${forward} ${backward} Z`;
  }

  // Find breach window boundaries for highlight rect
  const breachHours = records.filter(r => {
    let actualVal = r.totalActualLitres;
    let upperVal = r.baselineUpperBound;
    if (selectedZoneFilter !== 'ALL' && r.zones[selectedZoneFilter]) {
      actualVal = r.zones[selectedZoneFilter].litres;
      upperVal = Math.round(r.zones[selectedZoneFilter].expectedLitres * 1.25 + 50);
    }
    return actualVal > upperVal;
  }).map(r => r.hour);

  const hasBreach = breachHours.length > 0;
  const breachStartHour = hasBreach ? Math.min(...breachHours) : null;
  const breachEndHour = hasBreach ? Math.max(...breachHours) : null;

  return (
    <section id="tour-consumption-chart" className="stitch-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header & Filter Pills */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
              Diurnal Hydraulic Envelope
            </h3>
            <span className="stitch-pill pill-primary" style={{ fontSize: '0.6875rem' }}>
              24h Real-Time Flow
            </span>
          </div>
          <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            Learned neural band compared against smart-meter hydro-telemetry
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flexWrap: 'wrap',
          backgroundColor: 'var(--color-surface-container-low)',
          padding: '4px',
          borderRadius: 'var(--radius-md)'
        }}>
          <button
            onClick={() => setSelectedZoneFilter('ALL')}
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: selectedZoneFilter === 'ALL' ? 700 : 500,
              backgroundColor: selectedZoneFilter === 'ALL' ? 'var(--color-primary-container)' : 'transparent',
              color: selectedZoneFilter === 'ALL' ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface-variant)',
              transition: 'all 0.15s ease'
            }}
          >
            All Campus Combined
          </button>

          {ZONES.slice(0, 5).map((z) => (
            <button
              key={z.id}
              onClick={() => setSelectedZoneFilter(z.id)}
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: selectedZoneFilter === z.id ? 700 : 500,
                backgroundColor: selectedZoneFilter === z.id ? 'var(--color-primary-container)' : 'transparent',
                color: selectedZoneFilter === z.id ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface-variant)',
                transition: 'all 0.15s ease'
              }}
            >
              {z.name.split('—')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Diagnostic Badges */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        fontSize: '0.75rem',
        color: 'var(--color-on-surface-variant)',
        borderBottom: '1px solid rgba(132, 147, 150, 0.12)',
        paddingBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: 'rgba(0, 229, 255, 0.18)', border: '1px solid rgba(0, 229, 255, 0.35)' }} />
          <span>Learned Baseline Envelope (Confidence 99.4%)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '16px', height: '3px', backgroundColor: 'var(--color-primary-container)' }} />
          <span style={{ color: 'var(--color-on-surface)', fontWeight: 600 }}>Actual Measured Flow (L/min)</span>
        </div>

        {simPath && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '16px', height: '3px', backgroundColor: '#34d399', borderTop: '2px dashed #34d399' }} />
            <span style={{ color: '#34d399', fontWeight: 600 }}>Simulated Fix Curve</span>
          </div>
        )}

        {hasBreach && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: 'rgba(244, 63, 94, 0.25)', border: '1px solid rgba(244, 63, 94, 0.5)' }} />
            <span style={{ color: '#ffb4ab', fontWeight: 600 }}>
              Nighttime Breach Window ({String(breachStartHour).padStart(2, '0')}:00 — {String(breachEndHour + 1).padStart(2, '0')}:00)
            </span>
          </div>
        )}
      </div>

      {/* SVG Chart Container */}
      <div style={{ width: '100%', position: 'relative', overflowX: 'auto' }}>
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          style={{ width: '100%', height: 'auto', display: 'block', minWidth: '700px' }}
        >
          <defs>
            <linearGradient id="stitchEnvelopeGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.02" />
            </linearGradient>

            <linearGradient id="stitchAnomalyGlow" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0.03" />
            </linearGradient>

            <filter id="stitchGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, i) => {
            const y = padding.top + graphHeight * (1 - ratio);
            return (
              <g key={i}>
                <line 
                  x1={padding.left} 
                  y1={y} 
                  x2={svgWidth - padding.right} 
                  y2={y} 
                  stroke="#2f3543" 
                  strokeDasharray="4,4" 
                  opacity="0.4"
                />
                <text 
                  x={padding.left - 10} 
                  y={y + 4} 
                  fill="var(--color-outline)" 
                  fontSize="11" 
                  fontFamily="var(--font-mono)" 
                  textAnchor="end"
                >
                  {Math.round(maxY * ratio).toLocaleString()}L
                </text>
              </g>
            );
          })}

          {/* Nocturnal Anomaly Highlight Zone */}
          {hasBreach && (
            <rect 
              x={getX(breachStartHour) - 8} 
              y={padding.top} 
              width={getX(breachEndHour) - getX(breachStartHour) + 16} 
              height={graphHeight} 
              rx="6" 
              fill="url(#stitchAnomalyGlow)" 
            />
          )}

          {/* Learned Baseline Band (Envelope) */}
          <path 
            d={bandAreaPath} 
            fill="url(#stitchEnvelopeGrad)" 
          />

          {/* Upper bound boundary */}
          <path 
            d={createSmoothLine(upperPoints)} 
            fill="none" 
            stroke="#00daf3" 
            strokeWidth="1.2" 
            strokeDasharray="3,3" 
            opacity="0.4" 
          />

          {/* Lower bound boundary */}
          <path 
            d={createSmoothLine(lowerPoints)} 
            fill="none" 
            stroke="#00daf3" 
            strokeWidth="1.0" 
            strokeDasharray="3,3" 
            opacity="0.25" 
          />

          {/* Simulated Fix Curve */}
          {simPath && (
            <path 
              d={simPath} 
              fill="none" 
              stroke="#34d399" 
              strokeWidth="2.5" 
              strokeDasharray="5,4" 
              filter="url(#stitchGlow)"
            />
          )}

          {/* Actual Measured Continuous Wave */}
          <path 
            d={actualPath} 
            fill="none" 
            stroke="#00e5ff" 
            strokeLinecap="round" 
            strokeWidth="3.2" 
            filter="url(#stitchGlow)"
          />

          {/* Anomaly Points & Hover targets */}
          {actualPoints.map((pt, i) => {
            const r = pt.record;
            let actualVal = r.totalActualLitres;
            let upperVal = r.baselineUpperBound;
            if (selectedZoneFilter !== 'ALL' && r.zones[selectedZoneFilter]) {
              actualVal = r.zones[selectedZoneFilter].litres;
              upperVal = Math.round(r.zones[selectedZoneFilter].expectedLitres * 1.25 + 50);
            }

            const isAnomaly = actualVal > upperVal;
            const isHovered = hoveredPoint && hoveredPoint.hour === r.hour;

            return (
              <g 
                key={i}
                onMouseEnter={() => setHoveredPoint({ ...pt, hour: r.hour, record: r, isAnomaly })}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => onSelectAnomalyHour && onSelectAnomalyHour(r.hour)}
                style={{ cursor: 'pointer' }}
              >
                {/* Vertical hover marker */}
                {isHovered && (
                  <line 
                    x1={pt.x} 
                    y1={padding.top} 
                    x2={pt.x} 
                    y2={padding.top + graphHeight} 
                    stroke="var(--color-primary-container)" 
                    strokeWidth="1.5" 
                    strokeDasharray="2,2" 
                  />
                )}

                {isAnomaly ? (
                  <g>
                    <circle cx={pt.x} cy={pt.y} r="14" fill="#93000a" opacity="0.35" />
                    <circle cx={pt.x} cy={pt.y} r="6" fill="#ffb4ab" className="animate-pulse" />
                    {/* Callout box for first breach point */}
                    {r.hour === breachStartHour && (
                      <g transform={`translate(${Math.max(padding.left, pt.x - 45)}, ${Math.max(10, pt.y - 40)})`}>
                        <rect width="90" height="24" rx="4" fill="#242a38" stroke="rgba(244, 63, 94, 0.4)" />
                        <text x="6" y="16" fill="#ffdad6" fontSize="10" fontFamily="var(--font-mono)" fontWeight="700">
                          Breach: {pt.val}L
                        </text>
                      </g>
                    )}
                  </g>
                ) : (
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r={isHovered ? 5 : 2.5} 
                    fill="#00e5ff" 
                  />
                )}

                {/* Hit area */}
                <rect x={pt.x - 12} y={padding.top} width="24" height={graphHeight} fill="transparent" />
              </g>
            );
          })}

          {/* Current Live Flow Beacon (at last point) */}
          {actualPoints.length > 0 && (
            <g>
              <circle cx={actualPoints[actualPoints.length - 1].x} cy={actualPoints[actualPoints.length - 1].y} r="10" fill="#00daf3" opacity="0.3" />
              <circle cx={actualPoints[actualPoints.length - 1].x} cy={actualPoints[actualPoints.length - 1].y} r="5" fill="#00e5ff" />
            </g>
          )}
        </svg>

        {/* Hover Popover */}
        {hoveredPoint && (() => {
          let hoverExpected = hoveredPoint.record.totalExpectedLitres;
          let hoverSimVal = null;
          if (selectedZoneFilter !== 'ALL' && hoveredPoint.record.zones && hoveredPoint.record.zones[selectedZoneFilter]) {
            hoverExpected = hoveredPoint.record.zones[selectedZoneFilter].expectedLitres;
          }
          if (simulatedRecords && simulatedRecords[hoveredPoint.record.hour]) {
            const simRec = simulatedRecords[hoveredPoint.record.hour];
            if (selectedZoneFilter === 'ALL') {
              hoverSimVal = simRec.simulatedLitres;
            } else if (simRec.zones && simRec.zones[selectedZoneFilter]) {
              hoverSimVal = simRec.zones[selectedZoneFilter].litres;
            }
          }
          const excessVal = hoveredPoint.val - hoverExpected;

          return (
            <div style={{
              position: 'absolute',
              left: `${Math.min(svgWidth - 220, Math.max(70, (hoveredPoint.x / svgWidth) * 100))}%`,
              top: '20px',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(13, 19, 32, 0.95)',
              border: hoveredPoint.isAnomaly ? '1px solid rgba(244, 63, 94, 0.6)' : '1px solid var(--glass-border-glow)',
              backdropFilter: 'blur(16px)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.75rem 1rem',
              pointerEvents: 'none',
              zIndex: 10,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              minWidth: '210px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(132, 147, 150, 0.15)', paddingBottom: '4px', marginBottom: '6px' }}>
                <span className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-container)' }}>
                  {hoveredPoint.record.timeLabel} {selectedZoneFilter !== 'ALL' ? `(${selectedZoneFilter})` : ''}
                </span>
                <span className={`stitch-pill ${hoveredPoint.isAnomaly ? 'pill-error' : 'pill-tertiary'}`} style={{ fontSize: '0.625rem', padding: '1px 6px' }}>
                  {hoveredPoint.isAnomaly ? 'BREACH' : 'IN BAND'}
                </span>
              </div>

              <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-on-surface-variant)' }}>Measured:</span>
                  <strong className="font-mono" style={{ color: hoveredPoint.isAnomaly ? '#ffb4ab' : 'var(--color-on-surface)' }}>
                    {hoveredPoint.val.toLocaleString()} L
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-on-surface-variant)' }}>Expected Baseline:</span>
                  <strong className="font-mono" style={{ color: 'var(--color-secondary)' }}>
                    {hoverExpected.toLocaleString()} L
                  </strong>
                </div>
                {hoverSimVal !== null && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                    <span>Simulated Flow:</span>
                    <strong className="font-mono">
                      {hoverSimVal.toLocaleString()} L
                    </strong>
                  </div>
                )}
                {hoveredPoint.isAnomaly && excessVal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffb4ab', fontWeight: 700, borderTop: '1px dashed rgba(244, 63, 94, 0.3)', paddingTop: '4px' }}>
                    <span>Excess:</span>
                    <span className="font-mono">
                      +{excessVal.toLocaleString()} L
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Time Axis Marks (Sharp HTML Typography matching Stitch) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--color-on-surface-variant)',
        fontFamily: 'var(--font-mono)',
        paddingTop: '0.25rem',
        overflowX: 'auto'
      }}>
        <span>00:00</span>
        <span style={{ color: hasBreach ? '#ffb4ab' : undefined, fontWeight: hasBreach ? 700 : 400 }}>
          {hasBreach ? `02:00 (Anomaly Active)` : '02:00'}
        </span>
        <span>04:00</span>
        <span>06:00</span>
        <span>08:00 (Wake Spike)</span>
        <span>10:00</span>
        <span>12:00</span>
        <span>14:00</span>
        <span>16:00</span>
        <span>18:00 (Evening Surge)</span>
        <span>20:00</span>
        <span style={{ color: 'var(--color-primary-container)', fontWeight: 600 }}>22:00 (Live)</span>
      </div>

    </section>
  );
}
