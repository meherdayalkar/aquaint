// AQUAINT AI Engine:
// 1. Dynamic Baseline & Budgeting
// 2. Anomaly Detection (Statistical + Domain Heuristics)
// 3. Water-Waste Fingerprinting
// 4. Root-Cause AI Reasoning
// 5. Action Prioritization
// 6. What-If Predictive Simulator

import { ZONES, WATER_TARIFF_PER_THOUSAND_LITRES } from '../data/mockData.js';

// Fingerprint definitions with distinct waste shapes & characteristics
export const FINGERPRINTS = {
  PIPE_LEAK: {
    id: 'PIPE_LEAK',
    name: 'Sub-Surface / Riser Pipe Leak',
    category: 'Structural Distribution',
    severity: 'CRITICAL',
    color: '#ef4444',
    badgeClass: 'badge-danger',
    icon: 'AlertTriangle',
    characteristics: [
      'Continuous uninterrupted baseflow',
      'Persistent non-zero flow floor during minimum occupancy window (01:00 - 05:00)',
      'Stable flow coefficient variance < 8%',
      'Total absence of natural zero-flow settling points',
    ],
    recommendedAction: 'Isolate Sector Riser B-4 valve. Deploy ultrasonic acoustic leak detector along 2nd floor riser cavity.',
    typicalFixTimeHours: 4,
    easeScore: 3, // 1 to 5 (5 is easiest)
  },
  RAIN_IRRIGATION: {
    id: 'RAIN_IRRIGATION',
    name: 'Weather-Blind Over-Irrigation',
    category: 'Automation Logic Inefficiency',
    severity: 'HIGH',
    color: '#f97316',
    badgeClass: 'badge-warning',
    icon: 'CloudRain',
    characteristics: [
      'Active sprinkler flow during active precipitation (> 2.0 mm)',
      'Scheduled timer triggered regardless of soil saturation index',
      'High evaporative / runoff waste coefficient',
    ],
    recommendedAction: 'Engage rain-sensor interlock relay on Central Irrigation Controller G-02. Enable weather API automated pause.',
    typicalFixTimeHours: 1,
    easeScore: 5,
  },
  TANK_OVERFLOW: {
    id: 'TANK_OVERFLOW',
    name: 'Overhead Tank Float Valve Failure',
    category: 'Storage Infrastructure',
    severity: 'CRITICAL',
    color: '#a855f7',
    badgeClass: 'badge-purple',
    icon: 'Waves',
    characteristics: [
      'Flow sustained past standard 90-minute fill window',
      'Spike in rooftop overflow drainage channel sensor',
      'Pumping active while tank telemetry indicates 100% capacity',
      'Rapid high-volume loss directly into stormwater drains',
    ],
    recommendedAction: 'Manually disengage South Wing Booster Pump P-02. Inspect brass ball float linkage & ultrasonic level cutoff sensor.',
    typicalFixTimeHours: 2,
    easeScore: 4,
  },
  FIXTURE_RUNNING: {
    id: 'FIXTURE_RUNNING',
    name: 'Continuous Fixture / Flush Valve Failure',
    category: 'Terminal Consumption',
    severity: 'MEDIUM',
    color: '#eab308',
    badgeClass: 'badge-amber',
    icon: 'Droplets',
    characteristics: [
      'Constant 9 - 14 L/min draw in sanitary wing during low-demand periods',
      'Consistent with stuck toilet flushometer or open janitorial basin tap',
      'Local sub-meter elevated while adjacent blocks report normal diurnal dip',
    ],
    recommendedAction: 'Dispatch maintenance technician to Hostel Wing North 3rd Floor Restroom suite. Inspect urinal diaphragms and washbasin aerators.',
    typicalFixTimeHours: 1,
    easeScore: 5,
  },
  COOLING_TOWER_ANOMALY: {
    id: 'COOLING_TOWER_ANOMALY',
    name: 'HVAC Cooling Loop Evaporation / Bleed Drift',
    category: 'HVAC Thermal Loop',
    severity: 'MEDIUM',
    color: '#06b6d4',
    badgeClass: 'badge-cyan',
    icon: 'Zap',
    characteristics: [
      'Make-up water consumption exceeds wet-bulb enthalpy curve expectations',
      'Continuous conductivity bleed cycle triggered too frequently',
    ],
    recommendedAction: 'Calibrate TDS sensor and check cooling tower drift eliminator pads.',
    typicalFixTimeHours: 3,
    easeScore: 3,
  },
};

/**
 * Calculate Dynamic Water Budget
 * Allocates baseline allowance factoring:
 * - Zone type standards (NBC / WHO guidelines)
 * - Real-time occupancy
 * - Ambient weather (temperature + rain mitigation)
 */
export function calculateDynamicBudget(timelineData, weatherOverride = {}) {
  const records = timelineData.records || [];
  const weather = timelineData.weather || weatherOverride;

  // Base dynamic formula:
  // Base daily per capita allowance: 135 L/person residential, 45 L/student academic
  const residentialAllowance = 380 * 135; // Block B
  const academicAllowance = 650 * 45; // Block A
  const labAllowance = 210 * 85; // Block C
  const hostelAllowance = 120 * 130; // Hostel Wing North
  
  // Landscape allowance adjusted for weather:
  // Base 3,500 L/day, increased if hot (>30C) by +15%, reduced to 0 L if rain > 2mm
  let landscapeAllowance = 3500;
  if (weather.rainfallMm > 2) {
    landscapeAllowance = 0; // Nature watered the lawn
  } else if (weather.temp > 30) {
    landscapeAllowance *= 1.2; // Extra evapotranspiration
  }

  // Storage / distribution reserve margin
  const storageMargin = 2500;

  const totalDynamicBudgetLitres = Math.round(
    residentialAllowance + academicAllowance + labAllowance + hostelAllowance + landscapeAllowance + storageMargin
  );

  // Calculate actual sum consumed today
  const actualConsumedToday = records.reduce((sum, r) => sum + r.totalActualLitres, 0);
  const expectedConsumedToday = records.reduce((sum, r) => sum + r.totalExpectedLitres, 0);
  const totalExcess = records.reduce((sum, r) => sum + r.excessLitres, 0);

  const variancePercent = expectedConsumedToday > 0 
    ? parseFloat((((actualConsumedToday - expectedConsumedToday) / expectedConsumedToday) * 100).toFixed(1))
    : 0;

  const remainingBudget = totalDynamicBudgetLitres - actualConsumedToday;
  const budgetUtilizationPercent = Math.min(150, parseFloat(((actualConsumedToday / totalDynamicBudgetLitres) * 100).toFixed(1)));

  return {
    dailyBudgetLitres: totalDynamicBudgetLitres,
    actualConsumedToday,
    expectedConsumedToday,
    totalExcessLitres: totalExcess,
    remainingBudgetLitres: remainingBudget,
    variancePercent,
    budgetUtilizationPercent,
    isOverBudget: actualConsumedToday > totalDynamicBudgetLitres,
    weatherAdjustmentNote: weather.rainfallMm > 2 
      ? `Budget optimized for ${weather.rainfallMm}mm rainfall (-3,500L landscape offset credited).`
      : weather.temp > 30 
      ? `Budget adjusted +20% on landscape due to ${weather.temp}°C ambient temperature.`
      : 'Standard climate baseline applied.',
  };
}

/**
 * Anomaly Detection & Water-Waste Fingerprint Engine
 * Scans hourly records per zone, detects deviations, classifies waste fingerprint,
 * and compiles root-cause rationale.
 */
export function analyzeAnomalies(timelineData) {
  const records = timelineData.records || [];
  const weather = timelineData.weather || {};
  const anomalies = [];

  // Zone specific trackers
  const zoneStats = {};
  ZONES.forEach((z) => {
    zoneStats[z.id] = {
      actualSum: 0,
      expectedSum: 0,
      maxExceedLpm: 0,
      nightFlowSum: 0, // 01:00 - 05:00
      nightFlowExpected: 0,
      consecutiveHighHours: 0,
      anomalyHours: [],
      excessHoursData: [],
    };
  });

  // 1. Pass over hourly records
  records.forEach((r) => {
    ZONES.forEach((z) => {
      const zData = r.zones[z.id];
      if (!zData) return;

      zoneStats[z.id].actualSum += zData.litres;
      zoneStats[z.id].expectedSum += zData.expectedLitres;

      if (r.hour >= 1 && r.hour <= 5) {
        zoneStats[z.id].nightFlowSum += zData.litres;
        zoneStats[z.id].nightFlowExpected += zData.expectedLitres;
      }

      if (zData.isExcessive) {
        zoneStats[z.id].anomalyHours.push(r.hour);
        zoneStats[z.id].excessHoursData.push({
          hour: r.hour,
          timeLabel: r.timeLabel,
          actualRate: zData.rateLpm,
          expectedRate: zData.expectedRateLpm,
          excessRate: parseFloat((zData.rateLpm - zData.expectedRateLpm).toFixed(1)),
          litres: zData.litres,
          expectedLitres: zData.expectedLitres,
          excessLitres: zData.litres - zData.expectedLitres,
        });
      }
    });
  });

  // 2. Classify Zone Anomalies using Fingerprint Logic

  // Case A: Block B Nighttime Pipe Leak Check
  const bStats = zoneStats['block-b'];
  if (bStats.nightFlowSum > bStats.nightFlowExpected * 2.2 && (bStats.nightFlowSum - bStats.nightFlowExpected) > 1200) {
    const wasteLitresDay = Math.round((bStats.nightFlowSum - bStats.nightFlowExpected) * 1.25); // conservative projection
    const wasteLitresMonth = wasteLitresDay * 30;
    const monthlyCostLoss = (wasteLitresMonth / 1000) * WATER_TARIFF_PER_THOUSAND_LITRES;

    anomalies.push({
      id: 'ANOMALY-BLOCK-B-LEAK',
      zoneId: 'block-b',
      zoneName: 'Block B — Residential Hall',
      meterId: 'SM-RES-B02',
      fingerprint: FINGERPRINTS.PIPE_LEAK,
      confidenceScore: 91,
      severity: 'CRITICAL',
      detectedAt: '01:15 AM (Ongoing baseflow floor)',
      duration: '4h 15m continuous',
      observedRate: '18.9 L/min',
      expectedRate: '3.5 L/min',
      excessRate: '+15.4 L/min',
      estimatedWasteLitresDay: wasteLitresDay,
      estimatedWasteLitresMonth: wasteLitresMonth,
      monthlyCostLoss: parseFloat(monthlyCostLoss.toFixed(2)),
      affectedHours: bStats.anomalyHours,
      evidenceSummary: [
        'Flow never touched zero baseline between 01:00 AM and 05:00 AM (average 18.9 L/min vs 3.5 expected).',
        'Occupancy sensors recorded 3.2% active movement (majority of residents asleep).',
        'Standard deviation of nighttime flow was under 0.42 L/min, indicative of constant-pressure pipe aperture rather than human fixture usage.',
      ],
      rootCauseTitle: 'Sub-Meter B02 Riser Pipe Breach Detected',
      rootCauseExplanation: 
        'Water consumption in Block B is abnormal because the building has been continuously drawing water throughout the night despite near-zero active occupancy. This flat, continuous flow pattern is characteristic of a pressurized line rupture or valve seat failure rather than human taps left open.',
      recommendedAction: 'Dispatch emergency plumbing squad to Block B 2nd floor pipe shaft. Turn off isolation valve ISO-B02-N to stop hydraulic loss immediately.',
      easeOfFix: 'Moderate (Isolation valve accessible in riser shaft)',
      easeScore: 3,
      simulationScenarioId: 'BLOCK_B_LEAK',
    });
  }

  // Case B: Garden Zone 2 Rain Conflict Check
  const gStats = zoneStats['garden-zone-2'];
  if (weather.rainfallMm > 2 && gStats.actualSum > 500) {
    const wasteLitresDay = gStats.actualSum;
    const wasteLitresMonth = wasteLitresDay * 12; // estimated rain days in season
    const monthlyCostLoss = (wasteLitresMonth / 1000) * WATER_TARIFF_PER_THOUSAND_LITRES;

    anomalies.push({
      id: 'ANOMALY-GARDEN-RAIN',
      zoneId: 'garden-zone-2',
      zoneName: 'Garden Zone 2 — Central Lawns',
      meterId: 'SM-IRR-G02',
      fingerprint: FINGERPRINTS.RAIN_IRRIGATION,
      confidenceScore: 96,
      severity: 'HIGH',
      detectedAt: '05:30 AM (Timer cycle)',
      duration: '60 minutes',
      observedRate: '32.5 L/min',
      expectedRate: '0.0 L/min (Rain override active)',
      excessRate: '+32.5 L/min',
      estimatedWasteLitresDay: wasteLitresDay,
      estimatedWasteLitresMonth: wasteLitresMonth,
      monthlyCostLoss: parseFloat(monthlyCostLoss.toFixed(2)),
      affectedHours: gStats.anomalyHours,
      evidenceSummary: [
        `Precipitation station measured ${weather.rainfallMm} mm of rainfall during the 05:00-06:00 window.`,
        'Soil moisture sensors reported 92% saturation index (well above the 45% irrigation trigger).',
        'Automated timer discharged full programmed volume without meteorological interlock check.',
      ],
      rootCauseTitle: 'Precipitation Sensor Interlock Inoperative',
      rootCauseExplanation: 
        'Garden Zone 2 engaged its programmed sprinkler run while heavy precipitation was actively occurring. Soil saturation was already maximum, meaning 100% of irrigated water was lost as surface runoff into stormwater drains.',
      recommendedAction: 'Pause timer program G-02 immediately. Check optical rain-freeze sensor wiring on controller terminal 4.',
      easeOfFix: 'Easy (Software/timer toggle)',
      easeScore: 5,
      simulationScenarioId: 'RAIN_IRRIGATION',
    });
  }

  // Case C: Tank 2 Float Valve Overflow Check
  const tStats = zoneStats['tank-reserve-2'];
  if (tStats.excessHoursData.length >= 2 || (tStats.actualSum - tStats.expectedSum) > 3000) {
    const wasteLitresDay = Math.round(tStats.actualSum - tStats.expectedSum);
    const wasteLitresMonth = wasteLitresDay * 30;
    const monthlyCostLoss = (wasteLitresMonth / 1000) * WATER_TARIFF_PER_THOUSAND_LITRES;

    anomalies.push({
      id: 'ANOMALY-TANK-OVERFLOW',
      zoneId: 'tank-reserve-2',
      zoneName: 'Overhead Tank 2 — South Wing',
      meterId: 'SM-TNK-S02',
      fingerprint: FINGERPRINTS.TANK_OVERFLOW,
      confidenceScore: 89,
      severity: 'CRITICAL',
      detectedAt: '14:20 PM (Post-refill surge)',
      duration: '2h 40m continuous spill',
      observedRate: '50.5 L/min',
      expectedRate: '2.5 L/min',
      excessRate: '+48.0 L/min',
      estimatedWasteLitresDay: wasteLitresDay,
      estimatedWasteLitresMonth: wasteLitresMonth,
      monthlyCostLoss: parseFloat(monthlyCostLoss.toFixed(2)),
      affectedHours: tStats.anomalyHours,
      evidenceSummary: [
        'Inflow pump ran for 160 minutes, exceeding standard 45-minute tank replenishment duty cycle.',
        'Rooftop overflow drain line acoustic sensor triggered continuous fluid rushing audio signature.',
        'Ultrasonic level meter pegged at 101.4% capacity (spillway crest height).',
      ],
      rootCauseTitle: 'Mechanical Float Arm Jammed or Perforated Ball',
      rootCauseExplanation: 
        'Overhead Tank 2 failed to cease inflow pumping upon reaching its 45,000L capacity limit. Water is cascading through the emergency overflow manifold directly down the building stormwater stack.',
      recommendedAction: 'Cut power to South Booster Pump relay immediately. Replace mechanical float ball valve and test high-level limit switch.',
      easeOfFix: 'Moderate (Rooftop tank inspection)',
      easeScore: 4,
      simulationScenarioId: 'TANK_OVERFLOW',
    });
  }

  // Case D: Hostel Wing North Running Tap / Flushometer Check
  const hStats = zoneStats['hostel-wing-north'];
  if (hStats.excessHoursData.length >= 3 || (hStats.actualSum - hStats.expectedSum) > 1500) {
    const wasteLitresDay = Math.round(hStats.actualSum - hStats.expectedSum);
    const wasteLitresMonth = wasteLitresDay * 30;
    const monthlyCostLoss = (wasteLitresMonth / 1000) * WATER_TARIFF_PER_THOUSAND_LITRES;

    anomalies.push({
      id: 'ANOMALY-HOSTEL-FIXTURE',
      zoneId: 'hostel-wing-north',
      zoneName: 'Hostel Wing North — 3rd Floor Restrooms',
      meterId: 'SM-HST-N03',
      fingerprint: FINGERPRINTS.FIXTURE_RUNNING,
      confidenceScore: 88,
      severity: 'MEDIUM',
      detectedAt: '09:30 AM (Post-morning surge)',
      duration: '4h 10m uninterrupted',
      observedRate: '23.5 L/min',
      expectedRate: '12.0 L/min',
      excessRate: '+11.5 L/min',
      estimatedWasteLitresDay: wasteLitresDay,
      estimatedWasteLitresMonth: wasteLitresMonth,
      monthlyCostLoss: parseFloat(monthlyCostLoss.toFixed(2)),
      affectedHours: hStats.anomalyHours,
      evidenceSummary: [
        'Flow stayed rigidly elevated between 09:00 AM and 13:00 PM during class hours when hostel occupancy dropped to 18%.',
        'Flow delta matches exactly the standardized flow rate of a pressurized flushometer stuck in bypassed flow mode.',
        'Sub-meter acoustic analysis detected no valve closures during this 4-hour window.',
      ],
      rootCauseTitle: 'Sanitary Fixture Bypassed / Open Janitorial Faucet',
      rootCauseExplanation: 
        'Water consumption in Hostel Wing North is abnormal because water flow remained constant throughout mid-day lectures despite 82% of students being in academic blocks. The signature indicates a toilet flushometer valve diaphragm failure or open tap.',
      recommendedAction: 'Send campus custodial team to 3rd Floor North washroom block. Check flush valves in stalls 4 through 7.',
      easeOfFix: 'Easy (Quick washer or diaphragm swap)',
      easeScore: 5,
      simulationScenarioId: 'HOSTEL_FIXTURE',
    });
  }

  // 3. Rank Action Priorities
  const prioritizedAnomalies = rankPriorities(anomalies);

  return {
    anomalies: prioritizedAnomalies,
    totalAnomaliesCount: prioritizedAnomalies.length,
    criticalCount: prioritizedAnomalies.filter((a) => a.severity === 'CRITICAL').length,
    highCount: prioritizedAnomalies.filter((a) => a.severity === 'HIGH').length,
    totalEstimatedDailyLossLitres: prioritizedAnomalies.reduce((sum, a) => sum + a.estimatedWasteLitresDay, 0),
    totalEstimatedMonthlyLossCost: prioritizedAnomalies.reduce((sum, a) => sum + a.monthlyCostLoss, 0),
  };
}

/**
 * Multi-Factor Action Prioritization Algorithm
 * Computes:
 * PriorityScore = (Normalized Waste * 0.40) + (Cost * 0.25) + (Severity * 0.20) + (Ease * 0.15)
 */
function rankPriorities(anomalies) {
  if (anomalies.length === 0) return [];

  const severityWeights = { CRITICAL: 100, HIGH: 70, MEDIUM: 45, LOW: 20 };
  const maxWaste = Math.max(...anomalies.map((a) => a.estimatedWasteLitresDay), 1);
  const maxCost = Math.max(...anomalies.map((a) => a.monthlyCostLoss), 1);

  return anomalies
    .map((a) => {
      const wasteScore = (a.estimatedWasteLitresDay / maxWaste) * 100;
      const severityScore = severityWeights[a.severity] || 50;
      const easeScore = (a.easeScore / 5) * 100;
      const costScore = (a.monthlyCostLoss / maxCost) * 100;

      const compositeScore = Math.round(
        wasteScore * 0.40 + costScore * 0.25 + severityScore * 0.20 + easeScore * 0.15
      );

      return {
        ...a,
        priorityScore: compositeScore,
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .map((a, index) => ({
      ...a,
      rank: index + 1,
      rankLabel: `Priority ${index + 1}`,
    }));
}

/**
 * What-If Simulator Engine
 * Calculates projected savings when user simulates specific interventions.
 *
 * Supports:
 * - Zone Scoping: 'ALL' or individual zone ID ('block-b', 'garden-zone-2', 'tank-reserve-2', etc.)
 * - Targeted Remediation Interventions (Block B nocturnal leak, Rain sensor irrigation interlock, Tank 2 float valve, Hostel flushometer)
 * - Proactive Target Reduction (e.g. 15% reduction from baseline/actual)
 * - Implementation / Repair Efficiency Factor (50% to 100%)
 * - Irrigation Schedule Optimization (-50% to +50%)
 * - Per-zone and campus-level hourly resolution
 * - Monetary impact (₹ / month at ₹48/kL), Pumping Energy Avoidance (0.45 kWh/kL), GHG emissions offset (0.82 kg CO2/kWh)
 * - Dynamic Daily Budget envelope recovery check
 */
export function runWhatIfSimulation(timelineData, interventions = {}) {
  const records = timelineData.records || [];
  const weather = timelineData.weather || {};
  const selectedZoneId = interventions.selectedZoneId || 'ALL';

  // Input Sanitization & Bounds
  const repairEff = Math.min(1, Math.max(0.5, (interventions.repairEfficiencyPct !== undefined ? interventions.repairEfficiencyPct : 100) / 100));
  const targetReductionPct = Math.min(50, Math.max(0, Number(interventions.targetReductionPct) || 0));
  const targetRedFactor = targetReductionPct / 100;
  const irrigationAdjPct = Math.min(50, Math.max(-50, Number(interventions.irrigationAdjustmentPct) || 0));
  const irrigationAdjFactor = irrigationAdjPct / 100;

  let originalTotalActual = 0;
  let simulatedTotalActual = 0;
  let scopeOriginalActual = 0;
  let scopeOriginalExpected = 0;
  let scopeSimulatedActual = 0;

  const simulatedRecords = [];

  records.forEach((record) => {
    const origCampusActual = record.totalActualLitres;
    originalTotalActual += origCampusActual;

    const hour = record.hour;
    const simZones = {};
    let hourSimCampusTotal = 0;

    ZONES.forEach((zone) => {
      const zData = record.zones ? record.zones[zone.id] : null;
      if (!zData) return;

      const origLitres = zData.litres;
      const expLitres = zData.expectedLitres;
      let simLitres = origLitres;

      // 1. Targeted Fix: Block B Sub-Surface Riser Leak
      if (interventions.fixBlockBLeak && zone.id === 'block-b') {
        if (hour >= 1 && hour <= 5) {
          // If leak excess is present, remove excess scaled by efficiency
          if (origLitres > expLitres) {
            const leakExcess = origLitres - expLitres;
            simLitres -= Math.round(leakExcess * repairEff);
          } else {
            // Proactive simulated pipe relining / pressure reduction in Block B
            simLitres = Math.max(expLitres, simLitres - Math.round(15.4 * 60 * repairEff));
          }
        }
      }

      // 2. Targeted Fix: Weather-Interlock Rain Irrigation Pause
      if (interventions.pauseRainIrrigation && zone.id === 'garden-zone-2') {
        // Active during rain (rainfall > 2mm) or scheduled watering
        if (weather.rainfallMm > 2 && (hour === 5 || hour === 18)) {
          const rainWaste = origLitres > 0 ? origLitres : Math.round(32.5 * 60);
          simLitres = Math.max(0, simLitres - Math.round(rainWaste * repairEff));
        } else if (interventions.pauseRainIrrigation && (hour === 5 || hour === 18) && origLitres > expLitres) {
          simLitres = Math.max(expLitres, simLitres - Math.round((origLitres - expLitres) * repairEff));
        }
      }

      // 3. Targeted Fix: Repair Overhead Tank 2 Float Valve
      if (interventions.fixTankOverflow && zone.id === 'tank-reserve-2') {
        if (hour >= 14 && hour <= 16) {
          if (origLitres > expLitres) {
            const overflow = origLitres - expLitres;
            simLitres -= Math.round(overflow * repairEff);
          } else {
            // Proactive overflow prevention
            simLitres = Math.max(expLitres, simLitres - Math.round(48.0 * 60 * repairEff));
          }
        }
      }

      // 4. Targeted Fix: Service Stuck Flushometer in Hostel North
      if (interventions.fixHostelFixture && zone.id === 'hostel-wing-north') {
        if (hour >= 9 && hour <= 13) {
          if (origLitres > expLitres) {
            const fixtureWaste = origLitres - expLitres;
            simLitres -= Math.round(fixtureWaste * repairEff);
          } else {
            simLitres = Math.max(expLitres, simLitres - Math.round(11.5 * 60 * repairEff));
          }
        }
      }

      // 5. Irrigation Schedule Optimization (-50% to +50%)
      if (zone.id === 'garden-zone-2' && irrigationAdjFactor !== 0) {
        if (hour === 5 || hour === 18) {
          const baseSprinkler = expLitres > 0 ? expLitres : Math.round(28 * 60);
          simLitres = Math.max(0, simLitres + Math.round(baseSprinkler * irrigationAdjFactor));
        }
      }

      // 6. Proactive Target Percentage Reduction (e.g. 15% reduction)
      if (targetRedFactor > 0) {
        if (selectedZoneId === 'ALL' || selectedZoneId === zone.id) {
          const reductionLitres = Math.round(simLitres * targetRedFactor);
          simLitres = Math.max(0, simLitres - reductionLitres);
        }
      }

      simLitres = Math.max(0, Math.round(simLitres));
      const simRateLpm = parseFloat((simLitres / 60).toFixed(1));

      simZones[zone.id] = {
        ...zData,
        litres: simLitres,
        rateLpm: simRateLpm,
        isExcessive: simLitres > expLitres * 1.35 && (simLitres - expLitres) > 250,
      };

      hourSimCampusTotal += simLitres;

      // Accumulate scope stats
      if (selectedZoneId !== 'ALL' && zone.id === selectedZoneId) {
        scopeOriginalActual += origLitres;
        scopeOriginalExpected += expLitres;
        scopeSimulatedActual += simLitres;
      }
    });

    simulatedTotalActual += hourSimCampusTotal;

    if (selectedZoneId === 'ALL') {
      scopeOriginalActual += origCampusActual;
      scopeOriginalExpected += record.totalExpectedLitres;
      scopeSimulatedActual += hourSimCampusTotal;
    }

    simulatedRecords.push({
      ...record,
      zones: simZones,
      simulatedLitres: hourSimCampusTotal,
      simulatedSavings: Math.max(0, origCampusActual - hourSimCampusTotal),
    });
  });

  // Calculate scope-specific savings
  const scopeDailySavings = Math.max(0, scopeOriginalActual - scopeSimulatedActual);
  const scopeNetChange = scopeOriginalActual - scopeSimulatedActual; // Positive = saved, negative = increased
  const scopePercentReduction = scopeOriginalActual > 0
    ? parseFloat(((scopeDailySavings / scopeOriginalActual) * 100).toFixed(1))
    : 0;

  // Campus-wide savings
  const dailySavingsLitres = Math.max(0, originalTotalActual - simulatedTotalActual);
  const campusNetChangeLitres = originalTotalActual - simulatedTotalActual;
  const monthlySavingsLitres = dailySavingsLitres * 30;
  const monthlyFinancialSavings = parseFloat(((monthlySavingsLitres / 1000) * WATER_TARIFF_PER_THOUSAND_LITRES).toFixed(2));

  // Ecological metrics:
  // Water pumping energy = ~0.45 kWh per 1,000 Litres
  const pumpingEnergySavedKWh = parseFloat(((monthlySavingsLitres / 1000) * 0.45).toFixed(1));
  // Grid carbon intensity = ~0.82 kg CO2 per kWh
  const carbonEmissionsAvoidedKg = parseFloat((pumpingEnergySavedKWh * 0.82).toFixed(1));

  // Dynamic budget status after intervention
  const originalBudget = calculateDynamicBudget(timelineData);
  const newActualConsumed = simulatedTotalActual;
  const newVariancePercent = originalBudget.expectedConsumedToday > 0
    ? parseFloat((((newActualConsumed - originalBudget.expectedConsumedToday) / originalBudget.expectedConsumedToday) * 100).toFixed(1))
    : 0;

  const hasActiveInterventions = Boolean(
    interventions.fixBlockBLeak ||
    interventions.pauseRainIrrigation ||
    interventions.fixTankOverflow ||
    interventions.fixHostelFixture ||
    irrigationAdjPct !== 0 ||
    targetReductionPct !== 0
  );

  return {
    simulatedRecords,
    // Campus-wide metrics
    originalTotalActual,
    simulatedTotalActual,
    dailySavingsLitres,
    campusNetChangeLitres,
    monthlySavingsLitres,
    monthlyFinancialSavings,
    pumpingEnergySavedKWh,
    carbonEmissionsAvoidedKg,
    percentReduction: originalTotalActual > 0
      ? parseFloat(((dailySavingsLitres / originalTotalActual) * 100).toFixed(1))
      : 0,
    newVariancePercent,
    isBudgetRecovered: newActualConsumed <= originalBudget.dailyBudgetLitres,

    // Scope-specific metrics (Current Zone or Campus)
    selectedZoneId,
    scopeOriginalActual,
    scopeOriginalExpected,
    scopeSimulatedActual,
    scopeDailySavings,
    scopeNetChange,
    scopePercentReduction,
    hasActiveInterventions,
  };
}
