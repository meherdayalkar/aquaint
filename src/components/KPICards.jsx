import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Droplet, 
  Target, 
  Flame, 
  ShieldAlert, 
  IndianRupee, 
  Sparkles,
  ArrowUpRight,
  Info
} from 'lucide-react';

export function KPICards({ 
  budgetData, 
  analysisData, 
  onOpenSimulator, 
  onSelectAnomaly 
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

  const { 
    anomalies, 
    totalEstimatedDailyLossLitres, 
    totalEstimatedMonthlyLossCost, 
    criticalCount 
  } = analysisData;

  const topAnomaly = anomalies[0];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      
      {/* Card 1: Today's Actual vs Expected Baseline */}
      <div className="stitch-card" style={{ padding: '1.25rem', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <span className="font-label-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-on-surface-variant)' }}>
              Measured vs Baseline
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
              <span className="font-headline-md font-mono" style={{ color: 'var(--color-on-surface)' }}>
                {actualConsumedToday.toLocaleString()}
              </span>
              <span className="font-label-sm" style={{ color: 'var(--color-primary-container)' }}>Litres</span>
            </div>
          </div>

          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface-container-high)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary-container)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>water_drop</span>
          </div>
        </div>

        {/* Delta vs expected */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.75rem', fontSize: '0.75rem' }}>
          {variancePercent > 5 ? (
            <span style={{ color: '#ffb4ab', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>trending_up</span>
              +{variancePercent}% Over Baseline
            </span>
          ) : variancePercent < -5 ? (
            <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>trending_down</span>
              {variancePercent}% Baseline
            </span>
          ) : (
            <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
              Optimal (±{Math.abs(variancePercent)}%)
            </span>
          )}
          <span style={{ color: 'var(--color-outline-variant)' }}>•</span>
          <span style={{ color: 'var(--color-on-surface-variant)' }}>
            Base: {expectedConsumedToday.toLocaleString()} L
          </span>
        </div>

        {/* Mini progress bar */}
        <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--color-surface-container-highest)', borderRadius: '2px', marginTop: '0.75rem', overflow: 'hidden' }}>
          <div style={{
            width: `${Math.min(100, (actualConsumedToday / (expectedConsumedToday || 1)) * 80)}%`,
            height: '100%',
            backgroundColor: variancePercent > 10 ? 'var(--color-error)' : 'var(--color-primary-container)',
            borderRadius: '2px'
          }} />
        </div>
      </div>

      {/* Card 2: Dynamic Water Budget */}
      <div className="stitch-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <span className="font-label-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-on-surface-variant)' }}>
              Dynamic Daily Cap
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
              <span className="font-headline-md font-mono" style={{ color: 'var(--color-on-surface)' }}>
                {dailyBudgetLitres.toLocaleString()}
              </span>
              <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>L Target</span>
            </div>
          </div>

          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface-container-high)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-tertiary)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>track_changes</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.75rem' }}>
          <span style={{ color: remainingBudgetLitres >= 0 ? '#34d399' : '#ffb4ab', fontWeight: 700 }}>
            {remainingBudgetLitres >= 0 
              ? `${remainingBudgetLitres.toLocaleString()} L Left` 
              : `${Math.abs(remainingBudgetLitres).toLocaleString()} L Overrun`}
          </span>
          <span className="font-mono" style={{ color: 'var(--color-on-surface-variant)' }}>
            {budgetUtilizationPercent}% Used
          </span>
        </div>

        <div style={{ 
          marginTop: '0.5rem', 
          fontSize: '0.6875rem', 
          color: 'var(--color-secondary)', 
          backgroundColor: 'var(--color-surface-container-low)',
          padding: '3px 6px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(132, 147, 150, 0.12)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          💡 {weatherAdjustmentNote}
        </div>
      </div>

      {/* Card 3: Detected Water Waste & Loss */}
      <div className="stitch-card" style={{ 
        padding: '1.25rem',
        borderColor: totalExcessLitres > 500 ? 'rgba(244, 63, 94, 0.35)' : undefined
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="font-label-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: totalExcessLitres > 500 ? '#ffb4ab' : 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                Water Loss Detected
              </span>
              {totalExcessLitres > 500 && (
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f43f5e' }} className="ping-beacon" />
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
              <span className="font-headline-md font-mono" style={{ color: totalExcessLitres > 500 ? '#ffb4ab' : 'var(--color-on-surface)' }}>
                {totalExcessLitres.toLocaleString()}
              </span>
              <span className="font-label-sm" style={{ color: totalExcessLitres > 500 ? '#ffb4ab' : 'var(--color-on-surface-variant)' }}>L Excess</span>
            </div>
          </div>

          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: totalExcessLitres > 500 ? 'rgba(147, 0, 10, 0.3)' : 'var(--color-surface-container-high)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: totalExcessLitres > 500 ? '#ffb4ab' : 'var(--color-on-surface-variant)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>crisis_alert</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--color-on-surface-variant)' }}>
            Financial: <strong style={{ color: '#ffb4ab' }}>₹{Math.round(totalEstimatedMonthlyLossCost).toLocaleString('en-IN')}/mo</strong>
          </span>
          <span className={`stitch-pill ${criticalCount > 0 ? 'pill-error' : 'pill-primary'}`} style={{ fontSize: '0.65rem' }}>
            {criticalCount > 0 ? `${criticalCount} Critical` : `${anomalies.length} Issues`}
          </span>
        </div>

        {topAnomaly && (
          <button
            onClick={() => onSelectAnomaly(topAnomaly)}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(147, 0, 10, 0.2)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              color: '#ffb4ab',
              padding: '4px 8px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.72rem',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            <span>Top: {topAnomaly.fingerprint.name}</span>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
          </button>
        )}
      </div>

      {/* Card 4: Actionable Savings Potential */}
      <div className="stitch-card" style={{ 
        padding: '1.25rem',
        borderColor: 'rgba(0, 229, 255, 0.35)',
        backgroundColor: 'var(--color-surface-container-low)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <span className="font-label-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-primary-container)', fontWeight: 700 }}>
              Recoverable Savings
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
              <span className="font-headline-md font-mono" style={{ color: 'var(--color-primary-container)' }}>
                {totalEstimatedDailyLossLitres.toLocaleString()}
              </span>
              <span className="font-label-sm" style={{ color: 'var(--color-primary-container)' }}>L/day</span>
            </div>
          </div>

          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface-container-high)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary-container)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>savings</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--color-on-surface-variant)' }}>
            Recoverable: <strong style={{ color: '#34d399' }}>₹{Math.round(totalEstimatedMonthlyLossCost).toLocaleString('en-IN')}/mo</strong>
          </span>
          <span style={{ color: 'var(--color-tertiary)', fontSize: '0.7rem' }}>
            ~{(totalEstimatedDailyLossLitres * 30).toLocaleString()} L/mo
          </span>
        </div>

        <button 
          className="stitch-btn stitch-btn-primary"
          onClick={onOpenSimulator}
          style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>tune</span>
          <span>Launch Simulator</span>
        </button>
      </div>

    </div>
  );
}
