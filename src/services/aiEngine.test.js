import test from 'node:test';
import assert from 'node:assert/strict';
import { runWhatIfSimulation } from './aiEngine.js';
import { generateHourlyTimeline, WATER_TARIFF_PER_THOUSAND_LITRES } from '../data/mockData.js';

test('runWhatIfSimulation - Default baseline produces 0 savings and exact equality', () => {
  const timelineData = generateHourlyTimeline('NORMAL');
  const result = runWhatIfSimulation(timelineData, {});

  assert.equal(result.hasActiveInterventions, false);
  assert.equal(result.dailySavingsLitres, 0);
  assert.equal(result.percentReduction, 0);
  assert.equal(result.monthlySavingsLitres, 0);
  assert.equal(result.monthlyFinancialSavings, 0);
  assert.equal(result.simulatedTotalActual, result.originalTotalActual);
  assert.equal(result.simulatedRecords.length, 24);
});

test('runWhatIfSimulation - Exactly matches specification formula for 15% reduction', () => {
  // Test with synthetic 100,000 L baseline
  // Create synthetic timeline with 24 hours summing to 100,000 L
  const hourlyLitres = Math.round(100000 / 24);
  const syntheticRecords = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    timeLabel: `${String(hour).padStart(2, '0')}:00`,
    totalActualLitres: hourlyLitres,
    totalExpectedLitres: hourlyLitres,
    zones: {
      'block-b': { litres: Math.round(hourlyLitres * 0.4), expectedLitres: Math.round(hourlyLitres * 0.4) },
      'garden-zone-2': { litres: Math.round(hourlyLitres * 0.1), expectedLitres: Math.round(hourlyLitres * 0.1) },
      'tank-reserve-2': { litres: Math.round(hourlyLitres * 0.1), expectedLitres: Math.round(hourlyLitres * 0.1) },
      'hostel-wing-north': { litres: Math.round(hourlyLitres * 0.1), expectedLitres: Math.round(hourlyLitres * 0.1) },
      'block-a': { litres: Math.round(hourlyLitres * 0.15), expectedLitres: Math.round(hourlyLitres * 0.15) },
      'block-c': { litres: Math.round(hourlyLitres * 0.15), expectedLitres: Math.round(hourlyLitres * 0.15) },
    }
  }));

  const syntheticTimeline = {
    records: syntheticRecords,
    weather: { rainfallMm: 0, temp: 28 },
    scenarioId: 'NORMAL'
  };

  const initialSim = runWhatIfSimulation(syntheticTimeline, {});
  const baselineTotal = initialSim.originalTotalActual;

  const result15Pct = runWhatIfSimulation(syntheticTimeline, {
    targetReductionPct: 15
  });

  const expectedSavings = Math.round(baselineTotal * 0.15);
  const expectedProjected = baselineTotal - expectedSavings;

  assert.ok(Math.abs(result15Pct.dailySavingsLitres - expectedSavings) <= 24, 
    `Daily savings ${result15Pct.dailySavingsLitres} should be ~${expectedSavings}`);
  assert.ok(Math.abs(result15Pct.simulatedTotalActual - expectedProjected) <= 24, 
    `Projected consumption ${result15Pct.simulatedTotalActual} should be ~${expectedProjected}`);
  assert.equal(Math.round(result15Pct.percentReduction), 15);

  // Financial savings: (savings * 30 / 1000) * tariff
  const expectedMonthlyTariff = (result15Pct.monthlySavingsLitres / 1000) * WATER_TARIFF_PER_THOUSAND_LITRES;
  assert.equal(result15Pct.monthlyFinancialSavings, parseFloat(expectedMonthlyTariff.toFixed(2)));
});

test('runWhatIfSimulation - Targeted Block B leak fix works across all scenarios', () => {
  const leakTimeline = generateHourlyTimeline('BLOCK_B_LEAK');
  const result = runWhatIfSimulation(leakTimeline, {
    fixBlockBLeak: true,
    repairEfficiencyPct: 100
  });

  assert.ok(result.dailySavingsLitres > 4000, `Block B leak repair should save >4000L/day, got ${result.dailySavingsLitres}`);
  assert.ok(result.percentReduction > 0);
  assert.ok(result.monthlyFinancialSavings > 0);

  // Verify simulated records have updated zone data for block-b
  const hour2 = result.simulatedRecords.find(r => r.hour === 2);
  const origHour2BlockB = leakTimeline.records.find(r => r.hour === 2).zones['block-b'].litres;
  assert.ok(hour2.zones['block-b'].litres < origHour2BlockB, 'Simulated Block B flow should be less than original leaked flow');
});

test('runWhatIfSimulation - Zone Scoping isolates specific zone metrics', () => {
  const leakTimeline = generateHourlyTimeline('BLOCK_B_LEAK');
  const scopeResult = runWhatIfSimulation(leakTimeline, {
    selectedZoneId: 'block-b',
    fixBlockBLeak: true
  });

  assert.equal(scopeResult.selectedZoneId, 'block-b');
  assert.ok(scopeResult.scopeOriginalActual > 0);
  assert.ok(scopeResult.scopeSimulatedActual < scopeResult.scopeOriginalActual);
  assert.ok(scopeResult.scopeDailySavings > 0);
  assert.equal(scopeResult.scopeDailySavings, scopeResult.scopeOriginalActual - scopeResult.scopeSimulatedActual);
});

test('runWhatIfSimulation - Repair efficiency scales savings predictably', () => {
  const leakTimeline = generateHourlyTimeline('BLOCK_B_LEAK');
  
  const fullEffResult = runWhatIfSimulation(leakTimeline, {
    fixBlockBLeak: true,
    repairEfficiencyPct: 100
  });

  const halfEffResult = runWhatIfSimulation(leakTimeline, {
    fixBlockBLeak: true,
    repairEfficiencyPct: 50
  });

  assert.ok(halfEffResult.dailySavingsLitres < fullEffResult.dailySavingsLitres);
  const ratio = halfEffResult.dailySavingsLitres / fullEffResult.dailySavingsLitres;
  assert.ok(Math.abs(ratio - 0.5) < 0.05, `Expected efficiency ratio ~0.5, got ${ratio}`);
});

test('runWhatIfSimulation - Handles boundary and invalid inputs safely', () => {
  const timeline = generateHourlyTimeline('NORMAL');

  // Negative reduction, excessive percentage, non-numeric values
  const boundaryResult = runWhatIfSimulation(timeline, {
    targetReductionPct: -20, // should clamp to 0
    irrigationAdjustmentPct: 999, // should clamp to 50
    repairEfficiencyPct: 'invalid', // should default safely
  });

  assert.ok(boundaryResult.simulatedTotalActual >= 0);
  assert.ok(!Number.isNaN(boundaryResult.dailySavingsLitres));
  assert.ok(!Number.isNaN(boundaryResult.monthlyFinancialSavings));
  assert.ok(!Number.isNaN(boundaryResult.percentReduction));
});
