import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { runWhatIfSimulation, calculateDynamicBudget } from '../services/aiEngine.js';
import { ZONES, WATER_TARIFF_PER_THOUSAND_LITRES } from '../data/mockData.js';

export function WhatIfSimulator({ 
  timelineData, 
  onSimulateChange,
  prefillScenario = null,
  onOpenReport 
}) {
  const [interventions, setInterventions] = useState({
    selectedZoneId: 'ALL',
    fixBlockBLeak: false,
    pauseRainIrrigation: false,
    fixTankOverflow: false,
    fixHostelFixture: false,
    irrigationAdjustmentPct: 0,
    targetReductionPct: 0,
    repairEfficiencyPct: 100,
  });

  // Prefill handling when launched from an incident investigation or root-cause card
  useEffect(() => {
    if (prefillScenario) {
      if (prefillScenario === 'BLOCK_B_LEAK') {
        setInterventions(prev => ({ ...prev, selectedZoneId: 'block-b', fixBlockBLeak: true }));
      } else if (prefillScenario === 'RAIN_IRRIGATION') {
        setInterventions(prev => ({ ...prev, selectedZoneId: 'garden-zone-2', pauseRainIrrigation: true }));
      } else if (prefillScenario === 'TANK_OVERFLOW') {
        setInterventions(prev => ({ ...prev, selectedZoneId: 'tank-reserve-2', fixTankOverflow: true }));
      } else if (prefillScenario === 'HOSTEL_FIXTURE') {
        setInterventions(prev => ({ ...prev, selectedZoneId: 'hostel-wing-north', fixHostelFixture: true }));
      }
    }
  }, [prefillScenario]);

  // Compute simulation outcomes dynamically
  const simResult = useMemo(() => {
    return runWhatIfSimulation(timelineData, interventions);
  }, [timelineData, interventions]);

  const originalBudget = useMemo(() => {
    return calculateDynamicBudget(timelineData);
  }, [timelineData]);

  // Sync simulated curve to parent and consumption charts
  useEffect(() => {
    if (onSimulateChange) {
      onSimulateChange(simResult.hasActiveInterventions ? simResult.simulatedRecords : null);
    }
  }, [simResult.hasActiveInterventions, simResult.simulatedRecords, onSimulateChange]);

  const handleToggle = (key) => {
    setInterventions(prev => {
      const nextVal = !prev[key];
      if (nextVal) {
        try {
          confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } });
        } catch (e) {}
      }
      return { ...prev, [key]: nextVal };
    });
  };

  const handleReset = () => {
    setInterventions({
      selectedZoneId: 'ALL',
      fixBlockBLeak: false,
      pauseRainIrrigation: false,
      fixTankOverflow: false,
      fixHostelFixture: false,
      irrigationAdjustmentPct: 0,
      targetReductionPct: 0,
      repairEfficiencyPct: 100,
    });
  };

  const handleSimulateAll = () => {
    setInterventions({
      selectedZoneId: 'ALL',
      fixBlockBLeak: true,
      pauseRainIrrigation: true,
      fixTankOverflow: true,
      fixHostelFixture: true,
      irrigationAdjustmentPct: -20,
      targetReductionPct: 15,
      repairEfficiencyPct: 100,
    });
    try {
      confetti({ particleCount: 85, spread: 90, origin: { y: 0.5 } });
    } catch (e) {}
  };

  const selectedZone = ZONES.find(z => z.id === interventions.selectedZoneId);
  const scopeName = selectedZone ? selectedZone.name : 'All Campus (Combined)';

  return (
    <div id="tour-simulator" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* 1. TOP CONTEXT BAR: TITLE & GLOBAL SIMULATOR CONTROLS */}
      <div 
        className="stitch-card" 
        style={{
          padding: '1.25rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: 'var(--color-surface-container)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-surface-container-high)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.25)',
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '26px', color: 'var(--color-primary-container)' }}>
              tune
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 className="font-headline-md" style={{ color: 'var(--color-on-surface)', fontSize: '1.3rem' }}>
                Interactive What-If Predictive Simulator
              </h1>
              <span className="stitch-pill pill-primary" style={{ fontSize: '0.6875rem' }}>
                DIGITAL TWIN v2.5
              </span>
            </div>
            <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              Test proactive interventions and observe dynamic model updates on consumption curves, utility bills, and carbon offsets.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="stitch-btn stitch-btn-secondary"
            onClick={handleReset}
            title="Reset all toggles, percentage targets, and scope to default"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>restart_alt</span>
            <span>Reset Controls</span>
          </button>

          <button 
            className="stitch-btn stitch-btn-primary"
            onClick={handleSimulateAll}
            title="Engage all 4 remediation fixes and 15% conservation target"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>auto_fix_high</span>
            <span>Simulate All Fixes</span>
          </button>
        </div>
      </div>

      {/* 2. ZONE SCOPING SELECTOR BAR */}
      <div 
        className="stitch-card" 
        style={{
          padding: '0.875rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          backgroundColor: 'var(--color-surface-container)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-on-surface-variant)', fontSize: '0.8125rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary-container)' }}>filter_alt</span>
          <span style={{ fontWeight: 600 }}>Simulation Scope:</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setInterventions(prev => ({ ...prev, selectedZoneId: 'ALL' }))}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: interventions.selectedZoneId === 'ALL' ? '1px solid var(--color-primary-container)' : '1px solid rgba(132, 147, 150, 0.2)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: interventions.selectedZoneId === 'ALL' ? 700 : 500,
              backgroundColor: interventions.selectedZoneId === 'ALL' ? 'var(--color-primary-container)' : 'var(--color-surface-container-high)',
              color: interventions.selectedZoneId === 'ALL' ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface)',
              transition: 'all 0.15s ease'
            }}
          >
            All Campus (Combined)
          </button>

          {ZONES.map((zone) => {
            const isSelected = interventions.selectedZoneId === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setInterventions(prev => ({ ...prev, selectedZoneId: zone.id }))}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--color-primary-container)' : '1px solid rgba(132, 147, 150, 0.2)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? 'var(--color-primary-container)' : 'var(--color-surface-container-high)',
                  color: isSelected ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface)',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: zone.color }} />
                <span>{zone.name.split('—')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CURRENT VS SIMULATED SIDE-BY-SIDE COMPARISON BANNER */}
      <div 
        className="stitch-card" 
        style={{
          padding: '1.25rem',
          backgroundColor: 'var(--color-surface-container-lowest)',
          border: '1px solid rgba(0, 229, 255, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary-container)' }}>compare_arrows</span>
            <span className="font-title-md" style={{ color: 'var(--color-on-surface)', fontSize: '0.9375rem' }}>
              Scope Baseline vs Projected Comparison: <strong style={{ color: 'var(--color-primary-container)' }}>{scopeName}</strong>
            </span>
          </div>

          <div>
            {simResult.scopeDailySavings > 0 ? (
              <span className="stitch-pill pill-tertiary" style={{ fontWeight: 700 }}>
                ✓ {simResult.scopePercentReduction}% SAVINGS IN SCOPE
              </span>
            ) : simResult.scopeNetChange < 0 ? (
              <span className="stitch-pill pill-error" style={{ fontWeight: 700 }}>
                ⚠ CONSUMPTION INCREASE
              </span>
            ) : (
              <span className="stitch-pill pill-primary">
                TELEMETRY BASELINE ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* 4-Card Comparison Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem'
        }}>
          {/* Card 1: Measured Actual */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface-container-high)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.72rem' }}>
              Current Measured Consumption
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span className="font-headline-sm font-mono" style={{ color: 'var(--color-on-surface)', fontWeight: 700 }}>
                {simResult.scopeOriginalActual.toLocaleString()}
              </span>
              <span className="font-body-sm" style={{ color: 'var(--color-outline)', fontSize: '0.75rem' }}>L/day</span>
            </div>
            <span className="font-body-sm" style={{ color: 'var(--color-outline)', fontSize: '0.7rem' }}>
              From smart-meter sensors
            </span>
          </div>

          {/* Card 2: Expected Baseline */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface-container-high)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.72rem' }}>
              Expected Diurnal Baseline
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span className="font-headline-sm font-mono" style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>
                {simResult.scopeOriginalExpected.toLocaleString()}
              </span>
              <span className="font-body-sm" style={{ color: 'var(--color-outline)', fontSize: '0.75rem' }}>L/day</span>
            </div>
            <span className="font-body-sm" style={{ color: 'var(--color-outline)', fontSize: '0.7rem' }}>
              Learned normal demand envelope
            </span>
          </div>

          {/* Card 3: Projected Post-Intervention */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(0, 229, 255, 0.08)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <span className="font-label-sm" style={{ color: 'var(--color-primary-container)', fontSize: '0.72rem', fontWeight: 600 }}>
              Simulated Projected Consumption
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span className="font-headline-sm font-mono" style={{ color: 'var(--color-primary-container)', fontWeight: 800 }}>
                {simResult.scopeSimulatedActual.toLocaleString()}
              </span>
              <span className="font-body-sm" style={{ color: 'var(--color-primary-fixed-dim)', fontSize: '0.75rem' }}>L/day</span>
            </div>
            <span className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.7rem' }}>
              After applying interventions
            </span>
          </div>

          {/* Card 4: Potential Scope Savings */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: simResult.scopeDailySavings > 0 ? 'rgba(16, 185, 129, 0.08)' : 'var(--color-surface-container-high)',
            border: simResult.scopeDailySavings > 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(132, 147, 150, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <span className="font-label-sm" style={{ color: simResult.scopeDailySavings > 0 ? '#34d399' : 'var(--color-on-surface-variant)', fontSize: '0.72rem', fontWeight: 600 }}>
              Potential Scope Daily Savings
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span className="font-headline-sm font-mono" style={{ color: simResult.scopeDailySavings > 0 ? '#34d399' : 'var(--color-on-surface)', fontWeight: 800 }}>
                {simResult.scopeDailySavings.toLocaleString()}
              </span>
              <span className="font-body-sm" style={{ color: simResult.scopeDailySavings > 0 ? '#34d399' : 'var(--color-outline)', fontSize: '0.75rem' }}>L/day</span>
            </div>
            <span className="font-body-sm" style={{ color: 'var(--color-outline)', fontSize: '0.7rem' }}>
              {simResult.scopePercentReduction > 0 ? `${simResult.scopePercentReduction}% daily reduction` : '0% variance'}
            </span>
          </div>
        </div>

        {/* Status Alert Banner */}
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: simResult.dailySavingsLitres > 0 
            ? 'rgba(16, 185, 129, 0.12)' 
            : simResult.campusNetChangeLitres < 0 
            ? 'rgba(244, 63, 94, 0.12)' 
            : 'var(--color-surface-container-high)',
          borderLeft: simResult.dailySavingsLitres > 0 
            ? '3px solid #10b981' 
            : simResult.campusNetChangeLitres < 0 
            ? '3px solid #f43f5e' 
            : '3px solid var(--color-outline)',
          fontSize: '0.8125rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span className="material-symbols-outlined" style={{ 
            fontSize: '18px', 
            color: simResult.dailySavingsLitres > 0 ? '#34d399' : simResult.campusNetChangeLitres < 0 ? '#ffb4ab' : 'var(--color-on-surface-variant)' 
          }}>
            {simResult.dailySavingsLitres > 0 ? 'check_circle' : simResult.campusNetChangeLitres < 0 ? 'warning' : 'info'}
          </span>
          <span style={{ color: 'var(--color-on-surface)' }}>
            {simResult.dailySavingsLitres > 0 
              ? `Proactive Simulation Active: Campus-wide projected daily savings of ${simResult.dailySavingsLitres.toLocaleString()} L/day (${simResult.percentReduction}% reduction).`
              : simResult.campusNetChangeLitres < 0
              ? `Caution: Simulated schedule causes net daily increase of ${Math.abs(simResult.campusNetChangeLitres).toLocaleString()} L/day above current telemetry.`
              : 'Real-Time Baseline: Zero hypothetical modifications applied. Select interventions or adjust targets below to simulate savings.'}
          </span>
        </div>
      </div>

      {/* 4. MAIN 2-COLUMN OPERATIONAL GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem'
      }}>
        
        {/* LEFT COLUMN: TARGETED REMEDIATION INTERVENTIONS & CONTROLS */}
        <div className="stitch-card-low" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="font-headline-sm" style={{ color: 'var(--color-on-surface)', fontSize: '1.1rem' }}>
                1. Targeted Remediation Interventions
              </span>
              <span className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--color-outline)' }}>
                4 REMEDIATION PATHWAYS
              </span>
            </div>
            <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              Toggle hypothetical repairs to test how hydraulic isolation impacts the overall campus footprint.
            </p>
          </div>

          {/* Interactive Toggle Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            
            {/* Fix 1: Block B Leak */}
            <div 
              onClick={() => handleToggle('fixBlockBLeak')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--radius-xl)',
                backgroundColor: interventions.fixBlockBLeak ? 'var(--color-surface-container-high)' : 'var(--color-surface-container)',
                border: interventions.fixBlockBLeak ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid rgba(132, 147, 150, 0.12)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: interventions.fixBlockBLeak ? '0 0 20px rgba(0, 229, 255, 0.1)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(147, 0, 10, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffb4ab',
                  flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>warning</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="font-title-md" style={{ color: 'var(--color-on-surface)', fontSize: '0.875rem' }}>
                      Fix Block B Sub-Surface Riser Leak
                    </span>
                    <span className="stitch-pill pill-error" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>CRITICAL</span>
                    {interventions.selectedZoneId === 'block-b' && (
                      <span className="stitch-pill pill-primary" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>PRIMARY ZONE FIX</span>
                    )}
                  </div>
                  <span className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.75rem' }}>
                    Eliminates continuous 15.4 L/min nocturnal baseflow (01:00 – 05:00)
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <div style={{
                width: '44px',
                height: '24px',
                borderRadius: '9999px',
                backgroundColor: interventions.fixBlockBLeak ? 'var(--color-primary-container)' : 'var(--color-surface-container-highest)',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                justifyContent: interventions.fixBlockBLeak ? 'flex-end' : 'flex-start',
                transition: 'all 0.2s ease',
                boxShadow: interventions.fixBlockBLeak ? '0 0 12px rgba(0, 229, 255, 0.5)' : 'none'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: interventions.fixBlockBLeak ? 'var(--color-on-primary-fixed)' : 'var(--color-outline)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                }} />
              </div>
            </div>

            {/* Fix 2: Weather Interlock */}
            <div 
              onClick={() => handleToggle('pauseRainIrrigation')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--radius-xl)',
                backgroundColor: interventions.pauseRainIrrigation ? 'var(--color-surface-container-high)' : 'var(--color-surface-container)',
                border: interventions.pauseRainIrrigation ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid rgba(132, 147, 150, 0.12)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: interventions.pauseRainIrrigation ? '0 0 20px rgba(0, 229, 255, 0.1)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-container-highest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary-fixed-dim)',
                  flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>rainy</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="font-title-md" style={{ color: 'var(--color-on-surface)', fontSize: '0.875rem' }}>
                      Weather Interlock: Pause Irrigation During Rain
                    </span>
                    {interventions.selectedZoneId === 'garden-zone-2' && (
                      <span className="stitch-pill pill-primary" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>PRIMARY ZONE FIX</span>
                    )}
                  </div>
                  <span className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.75rem' }}>
                    Cuts 32.5 L/min sprinkler runtime when rainfall &gt; 2.0mm
                  </span>
                </div>
              </div>

              <div style={{
                width: '44px',
                height: '24px',
                borderRadius: '9999px',
                backgroundColor: interventions.pauseRainIrrigation ? 'var(--color-primary-container)' : 'var(--color-surface-container-highest)',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                justifyContent: interventions.pauseRainIrrigation ? 'flex-end' : 'flex-start',
                transition: 'all 0.2s ease',
                boxShadow: interventions.pauseRainIrrigation ? '0 0 12px rgba(0, 229, 255, 0.5)' : 'none'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: interventions.pauseRainIrrigation ? 'var(--color-on-primary-fixed)' : 'var(--color-outline)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                }} />
              </div>
            </div>

            {/* Fix 3: Tank Overflow */}
            <div 
              onClick={() => handleToggle('fixTankOverflow')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--radius-xl)',
                backgroundColor: interventions.fixTankOverflow ? 'var(--color-surface-container-high)' : 'var(--color-surface-container)',
                border: interventions.fixTankOverflow ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid rgba(132, 147, 150, 0.12)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: interventions.fixTankOverflow ? '0 0 20px rgba(0, 229, 255, 0.1)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-container-highest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-secondary)',
                  flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>waves</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="font-title-md" style={{ color: 'var(--color-on-surface)', fontSize: '0.875rem' }}>
                      Repair Overhead Tank 2 Float Valve
                    </span>
                    {interventions.selectedZoneId === 'tank-reserve-2' && (
                      <span className="stitch-pill pill-primary" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>PRIMARY ZONE FIX</span>
                    )}
                  </div>
                  <span className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.75rem' }}>
                    Halts 48.0 L/min pump overrun and stormwater overflow
                  </span>
                </div>
              </div>

              <div style={{
                width: '44px',
                height: '24px',
                borderRadius: '9999px',
                backgroundColor: interventions.fixTankOverflow ? 'var(--color-primary-container)' : 'var(--color-surface-container-highest)',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                justifyContent: interventions.fixTankOverflow ? 'flex-end' : 'flex-start',
                transition: 'all 0.2s ease',
                boxShadow: interventions.fixTankOverflow ? '0 0 12px rgba(0, 229, 255, 0.5)' : 'none'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: interventions.fixTankOverflow ? 'var(--color-on-primary-fixed)' : 'var(--color-outline)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                }} />
              </div>
            </div>

            {/* Fix 4: Hostel Fixture */}
            <div 
              onClick={() => handleToggle('fixHostelFixture')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--radius-xl)',
                backgroundColor: interventions.fixHostelFixture ? 'var(--color-surface-container-high)' : 'var(--color-surface-container)',
                border: interventions.fixHostelFixture ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid rgba(132, 147, 150, 0.12)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: interventions.fixHostelFixture ? '0 0 20px rgba(0, 229, 255, 0.1)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-container-highest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-tertiary)',
                  flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>water_damage</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="font-title-md" style={{ color: 'var(--color-on-surface)', fontSize: '0.875rem' }}>
                      Service Stuck Flushometer in Hostel North
                    </span>
                    {interventions.selectedZoneId === 'hostel-wing-north' && (
                      <span className="stitch-pill pill-primary" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>PRIMARY ZONE FIX</span>
                    )}
                  </div>
                  <span className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.75rem' }}>
                    Replaces diaphragm to eliminate 11.5 L/min continuous draw
                  </span>
                </div>
              </div>

              <div style={{
                width: '44px',
                height: '24px',
                borderRadius: '9999px',
                backgroundColor: interventions.fixHostelFixture ? 'var(--color-primary-container)' : 'var(--color-surface-container-highest)',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                justifyContent: interventions.fixHostelFixture ? 'flex-end' : 'flex-start',
                transition: 'all 0.2s ease',
                boxShadow: interventions.fixHostelFixture ? '0 0 12px rgba(0, 229, 255, 0.5)' : 'none'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: interventions.fixHostelFixture ? 'var(--color-on-primary-fixed)' : 'var(--color-outline)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                }} />
              </div>
            </div>

          </div>

          {/* Remediation Execution Efficiency Slider */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-surface-container)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            border: '1px solid rgba(132, 147, 150, 0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>
                  handyman
                </span>
                <span className="font-title-md" style={{ color: 'var(--color-on-surface)', fontSize: '0.8125rem' }}>
                  Remediation Execution Efficiency
                </span>
              </div>
              <span className="font-mono" style={{ color: 'var(--color-secondary)', fontWeight: 700, fontSize: '0.8125rem' }}>
                {interventions.repairEfficiencyPct}% {interventions.repairEfficiencyPct === 100 ? '(Full Spec)' : '(Partial)'}
              </span>
            </div>

            <input 
              type="range"
              min="50"
              max="100"
              step="5"
              value={interventions.repairEfficiencyPct}
              onChange={(e) => setInterventions({ ...interventions, repairEfficiencyPct: parseInt(e.target.value) || 100 })}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--color-outline)', fontFamily: 'var(--font-mono)' }}>
              <span>50% (Temporary Patch)</span>
              <span>75% (Standard Field Fix)</span>
              <span>100% (Certified Replacement)</span>
            </div>
          </div>

          {/* Target Percentage Reduction Slider & Presets */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-surface-container)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            border: '1px solid rgba(132, 147, 150, 0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary-container)' }}>
                  trending_down
                </span>
                <span className="font-title-md" style={{ color: 'var(--color-on-surface)', fontSize: '0.875rem' }}>
                  Target Conservation Reduction Goal
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="stitch-pill pill-primary font-mono" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  {interventions.targetReductionPct}% TARGET
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.75rem' }}>Quick Presets:</span>
              {[0, 5, 10, 15, 20, 25].map(pct => (
                <button
                  key={pct}
                  onClick={() => setInterventions(prev => ({ ...prev, targetReductionPct: pct }))}
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    border: interventions.targetReductionPct === pct ? '1px solid var(--color-primary-container)' : '1px solid rgba(132, 147, 150, 0.2)',
                    backgroundColor: interventions.targetReductionPct === pct ? 'var(--color-primary-container)' : 'transparent',
                    color: interventions.targetReductionPct === pct ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {pct === 0 ? 'Off (0%)' : `${pct}%`}
                </button>
              ))}
            </div>

            <input 
              type="range"
              min="0"
              max="50"
              step="1"
              value={interventions.targetReductionPct}
              onChange={(e) => setInterventions({ ...interventions, targetReductionPct: parseInt(e.target.value) || 0 })}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--color-outline)', fontFamily: 'var(--font-mono)' }}>
              <span>0% (No policy target)</span>
              <span>15% (Institutional Conservation)</span>
              <span>50% (Max Emergency Rationing)</span>
            </div>
          </div>

          {/* Irrigation Schedule Optimization Slider */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-surface-container)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            border: '1px solid rgba(132, 147, 150, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary-fixed-dim)' }}>
                  yard
                </span>
                <span className="font-title-md" style={{ color: 'var(--color-on-surface)', fontSize: '0.8125rem' }}>
                  Campus Irrigation Schedule Optimization
                </span>
              </div>
              <span className="font-mono" style={{ color: 'var(--color-primary-container)', fontWeight: 700, fontSize: '0.8125rem' }}>
                {interventions.irrigationAdjustmentPct > 0 ? `+${interventions.irrigationAdjustmentPct}%` : `${interventions.irrigationAdjustmentPct}%`}
              </span>
            </div>

            <input 
              type="range"
              min="-50"
              max="50"
              step="5"
              value={interventions.irrigationAdjustmentPct}
              onChange={(e) => setInterventions({ ...interventions, irrigationAdjustmentPct: parseInt(e.target.value) || 0 })}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--color-outline)', fontFamily: 'var(--font-mono)' }}>
              <span>-50% (Drought Rationing)</span>
              <span>Default (0%)</span>
              <span>+50% (High Heatwave)</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE PROJECTED IMPACT & ROI */}
        <div className="stitch-card-low" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Header with Savings Tag */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="font-headline-sm" style={{ color: 'var(--color-on-surface)', fontSize: '1.1rem' }}>
                  2. Live Projected Impact &amp; ROI
                </span>
                <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Simulated outcomes recalculate immediately against utility tariff schedules (₹{WATER_TARIFF_PER_THOUSAND_LITRES.toFixed(2)} / 1,000L).
                </p>
              </div>

              {simResult.dailySavingsLitres > 0 && (
                <span className="stitch-pill pill-tertiary">
                  ✓ {simResult.percentReduction}% CAMPUS SAVINGS
                </span>
              )}
            </div>

            {/* Key Metric Blocks */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem'
            }}>
              {/* Daily Litres Saved */}
              <div style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(0, 229, 255, 0.08)',
                border: '1px solid rgba(0, 229, 255, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                <span className="font-label-sm" style={{ color: 'var(--color-primary-container)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Daily Water Recovered
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span className="font-headline-lg font-mono" style={{ color: 'var(--color-primary-container)', fontSize: '2rem', fontWeight: 800 }}>
                    {simResult.dailySavingsLitres.toLocaleString()}
                  </span>
                  <span className="font-label-md" style={{ color: 'var(--color-primary-fixed-dim)' }}>L/day</span>
                </div>
                <span className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.72rem' }}>
                  Cumulative reduction across campus
                </span>
              </div>

              {/* Monthly Bill Savings */}
              <div style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                <span className="font-label-sm" style={{ color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Monthly Bill Savings
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span className="font-headline-lg font-mono" style={{ color: '#34d399', fontSize: '2rem', fontWeight: 800 }}>
                    ₹{Math.round(simResult.monthlyFinancialSavings).toLocaleString('en-IN')}
                  </span>
                  <span className="font-label-md" style={{ color: '#34d399' }}>/month</span>
                </div>
                <span className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.72rem' }}>
                  ~{(simResult.monthlySavingsLitres).toLocaleString()} L/mo avoided
                </span>
              </div>
            </div>

            {/* Environmental & Carbon Offset Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-surface-container)',
              border: '1px solid rgba(132, 147, 150, 0.12)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-amber)' }}>
                  bolt
                </span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Pumping Energy Avoided</span>
                  <strong className="font-mono" style={{ color: 'var(--color-on-surface)', fontSize: '0.92rem' }}>
                    {simResult.pumpingEnergySavedKWh} kWh/mo
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#34d399' }}>
                  eco
                </span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>GHG Emissions Offset</span>
                  <strong className="font-mono" style={{ color: '#34d399', fontSize: '0.92rem' }}>
                    {simResult.carbonEmissionsAvoidedKg} kg CO₂e
                  </strong>
                </div>
              </div>
            </div>

            {/* Dynamic Daily Cap Recovery Gauge */}
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-surface-container)',
              border: '1px solid rgba(132, 147, 150, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--color-on-surface-variant)' }}>Dynamic Daily Budget Recovery Status:</span>
                <strong style={{ color: simResult.isBudgetRecovered ? '#34d399' : '#ffb4ab' }}>
                  {simResult.isBudgetRecovered ? 'Within Dynamic Daily Budget' : 'Exceeds Dynamic Cap'}
                </strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--color-surface-container-highest)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(100, (simResult.simulatedTotalActual / originalBudget.dailyBudgetLitres) * 100)}%`,
                    height: '100%',
                    backgroundColor: simResult.isBudgetRecovered ? '#10b981' : '#f43f5e',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-outline)' }}>
                  {Math.round((simResult.simulatedTotalActual / originalBudget.dailyBudgetLitres) * 100)}%
                </span>
              </div>
            </div>

            {/* Assumptions & Formula Transparency Note */}
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-surface-container-high)',
              fontSize: '0.72rem',
              color: 'var(--color-on-surface-variant)',
              lineHeight: 1.4
            }}>
              <span style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>Model Reference Standards: </span>
              Dynamic Daily Cap = {originalBudget.dailyBudgetLitres.toLocaleString()} L (NBC per capita baselines) • Utility Tariff = ₹{WATER_TARIFF_PER_THOUSAND_LITRES.toFixed(2)} / 1,000L • Pumping Energy Intensity = 0.45 kWh/kL • Grid Emission Factor = 0.82 kg CO₂e/kWh.
            </div>

          </div>

          {/* Action Report Generation button */}
          <button 
            className="stitch-btn stitch-btn-primary"
            onClick={onOpenReport}
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>summarize</span>
            <span>Generate Executive Conservation Plan</span>
          </button>
        </div>

      </div>

    </div>
  );
}
