// Mock data and synthetic smart-meter stream generator for AQUAINT

export const ZONES = [
  {
    id: 'block-b',
    name: 'Block B — Residential Hall',
    type: 'residential',
    occupancyDefault: 380,
    baseRateDay: 48, // L/min peak
    baseRateNight: 3.5, // L/min normal night baseline
    meterId: 'SM-RES-B02',
    description: '380 student residential capacity. Expects high morning/evening flow, near-zero night flow.',
    color: '#06b6d4',
  },
  {
    id: 'garden-zone-2',
    name: 'Garden Zone 2 — Central Lawns',
    type: 'irrigation',
    occupancyDefault: 15,
    baseRateDay: 0,
    baseRateNight: 0,
    scheduledTimes: ['05:30', '18:30'],
    scheduledRate: 32, // L/min during scheduled watering
    meterId: 'SM-IRR-G02',
    description: 'Automated pop-up sprayers across 4,200 sq.m of campus lawns.',
    color: '#10b981',
  },
  {
    id: 'tank-reserve-2',
    name: 'Overhead Tank 2 — South Wing',
    type: 'storage',
    capacityLitres: 45000,
    fillCycles: ['03:30', '14:00'],
    fillRate: 65, // L/min during pumping
    overflowSensorId: 'OF-SEN-T2',
    meterId: 'SM-TNK-S02',
    description: '45,000L rooftop reserve with mechanical float valve and ultrasound level transmitter.',
    color: '#8b5cf6',
  },
  {
    id: 'hostel-wing-north',
    name: 'Hostel Wing North — 3rd Floor Restrooms',
    type: 'residential_fixture',
    occupancyDefault: 120,
    baseRateDay: 22,
    baseRateNight: 1.8,
    meterId: 'SM-HST-N03',
    description: 'Shared student washrooms, dual-flush toilets, and shower battery.',
    color: '#f59e0b',
  },
  {
    id: 'block-a',
    name: 'Block A — Academic & Admin Center',
    type: 'academic',
    occupancyDefault: 650,
    baseRateDay: 38,
    baseRateNight: 0.8,
    meterId: 'SM-ACAD-A01',
    description: 'Lecture theaters, faculty offices, central cafeteria.',
    color: '#38bdf8',
  },
  {
    id: 'block-c',
    name: 'Block C — Science & Biotech Labs',
    type: 'laboratory',
    occupancyDefault: 210,
    baseRateDay: 30,
    baseRateNight: 4.2, // Continuous DI water / cooling loops
    meterId: 'SM-LAB-C01',
    description: 'Deionized water loop, chemical hoods, biology lab autoclave sinks.',
    color: '#ec4899',
  },
];

export const DEMO_SCENARIOS = {
  NORMAL: {
    id: 'NORMAL',
    name: 'Normal Operations (Baseline)',
    badge: 'Optimal',
    description: 'All 6 zones operating strictly within their expected dynamic consumption envelopes. Zero anomalies.',
    icon: 'CheckCircle',
  },
  BLOCK_B_LEAK: {
    id: 'BLOCK_B_LEAK',
    name: 'Scenario 1: Block B Nighttime Pipe Leak',
    badge: 'Critical Leak',
    targetZone: 'block-b',
    description: 'Continuous 15.2 L/min flow between 01:15 AM and 05:00 AM while residential occupancy is at 3%.',
    icon: 'AlertTriangle',
  },
  RAIN_IRRIGATION: {
    id: 'RAIN_IRRIGATION',
    name: 'Scenario 2: Irrigation During Heavy Rainfall',
    badge: 'Over-Irrigation',
    targetZone: 'garden-zone-2',
    description: 'Sprinklers activate at 05:30 AM dispensing 32 L/min while ambient sensors record 18.5 mm of downpour.',
    icon: 'CloudRain',
  },
  TANK_OVERFLOW: {
    id: 'TANK_OVERFLOW',
    name: 'Scenario 3: Tank 2 Float Valve Failure & Overflow',
    badge: 'Tank Overflow',
    targetZone: 'tank-reserve-2',
    description: 'Refill cycle fails to cut off at 95% full; tank spills 48 L/min into storm drain for 2.5 hours.',
    icon: 'Waves',
  },
  HOSTEL_FIXTURE: {
    id: 'HOSTEL_FIXTURE',
    name: 'Scenario 4: Hostel Restroom Continuous Running Tap',
    badge: 'Fixture Running',
    targetZone: 'hostel-wing-north',
    description: 'Sustained single-fixture draw of 11.2 L/min for 4+ hours during morning lecture hours.',
    icon: 'Droplets',
  },
  ALL_COMBINED: {
    id: 'ALL_COMBINED',
    name: 'Scenario 5: Multi-Zone Critical Incident (High Stress)',
    badge: 'Multiple Anomalies',
    targetZone: 'all',
    description: 'Simultaneous nocturnal leak in Block B + morning downpour irrigation waste.',
    icon: 'Zap',
  },
};

// Generate 24 hourly timestamps for the current day: 00:00 to 23:00
export function generateHourlyTimeline(scenarioId = 'NORMAL', weatherOverride = {}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const isRainScenario = scenarioId === 'RAIN_IRRIGATION' || scenarioId === 'ALL_COMBINED';
  
  const weather = {
    temp: weatherOverride.temp || (isRainScenario ? 22.4 : 31.2),
    rainfallMm: weatherOverride.rainfallMm !== undefined 
      ? weatherOverride.rainfallMm 
      : (isRainScenario ? 18.5 : 0),
    humidity: isRainScenario ? 94 : 58,
    condition: isRainScenario ? 'Heavy Rain / Thunderstorm' : 'Clear & Warm',
  };

  const records = hours.map((hour) => {
    const timeLabel = `${String(hour).padStart(2, '0')}:00`;
    
    // Occupancy curve across campus (0 to 1 scale)
    let campusOccupancyRatio;
    if (hour >= 0 && hour <= 5) campusOccupancyRatio = 0.04;
    else if (hour === 6) campusOccupancyRatio = 0.25;
    else if (hour >= 7 && hour <= 9) campusOccupancyRatio = 0.85;
    else if (hour >= 10 && hour <= 16) campusOccupancyRatio = 0.95;
    else if (hour >= 17 && hour <= 20) campusOccupancyRatio = 0.70;
    else if (hour >= 21 && hour <= 23) campusOccupancyRatio = 0.20;
    else campusOccupancyRatio = 0.50;

    // Per-zone consumption for this hour
    const zoneData = {};
    let totalActualLitres = 0;
    let totalExpectedLitres = 0;

    ZONES.forEach((zone) => {
      let expectedRate = 0; // L/min
      let actualRate = 0;

      // Normal baseline model
      if (zone.id === 'block-b') {
        if (hour >= 1 && hour <= 5) {
          expectedRate = zone.baseRateNight + Math.sin(hour) * 0.4;
        } else if (hour >= 6 && hour <= 9) {
          expectedRate = 38 + (hour - 6) * 5;
        } else if (hour >= 10 && hour <= 16) {
          expectedRate = 18;
        } else if (hour >= 17 && hour <= 22) {
          expectedRate = 44 + Math.sin(hour) * 6;
        } else {
          expectedRate = 12;
        }
        actualRate = expectedRate + (Math.random() * 2 - 1);

        // Inject Scenario 1 / All Combined
        if ((scenarioId === 'BLOCK_B_LEAK' || scenarioId === 'ALL_COMBINED') && hour >= 1 && hour <= 5) {
          actualRate = expectedRate + 15.4; // 15.4 L/min persistent leak
        }
      } 
      else if (zone.id === 'garden-zone-2') {
        // Scheduled watering at 05:00 and 18:00
        const isScheduled = hour === 5 || hour === 18;
        expectedRate = isScheduled ? 28 : 0;
        
        // If it rains, intelligent expected rate should drop to 0
        if (weather.rainfallMm > 2) {
          expectedRate = 0; // Smart expectation
        }

        actualRate = expectedRate;

        // Inject Scenario 2 (Irrigating despite rain)
        if (isRainScenario && hour === 5) {
          actualRate = 32.5; // Dumb timer turned sprinklers on in downpour
        } else if (!isRainScenario && isScheduled) {
          actualRate = 28 + (Math.random() * 2 - 1);
        }
      }
      else if (zone.id === 'tank-reserve-2') {
        // Fill cycles at 03:00 and 14:00
        const isRefill = hour === 3 || hour === 14;
        expectedRate = isRefill ? 45 : 2.5;
        actualRate = expectedRate + (Math.random() * 1.5);

        // Inject Scenario 3 (Tank 2 overflow)
        if (scenarioId === 'TANK_OVERFLOW' && (hour === 14 || hour === 15 || hour === 16)) {
          actualRate = expectedRate + 48.0; // Float failure: continuous spillage
        }
      }
      else if (zone.id === 'hostel-wing-north') {
        if (hour >= 1 && hour <= 5) {
          expectedRate = 1.5;
        } else if (hour >= 7 && hour <= 9) {
          expectedRate = 26;
        } else if (hour >= 10 && hour <= 17) {
          expectedRate = 12;
        } else {
          expectedRate = 18;
        }
        actualRate = expectedRate + (Math.random() * 1.5 - 0.7);

        // Inject Scenario 4 (Tap left running 09:00 - 13:00)
        if (scenarioId === 'HOSTEL_FIXTURE' && hour >= 9 && hour <= 13) {
          actualRate = expectedRate + 11.5; // Stuck flushometer or open basin tap
        }
      }
      else if (zone.id === 'block-a') {
        if (hour >= 8 && hour <= 18) {
          expectedRate = 32 + Math.sin(hour / 2) * 8;
        } else {
          expectedRate = 1.8;
        }
        actualRate = expectedRate + (Math.random() * 2 - 1);
      }
      else if (zone.id === 'block-c') {
        if (hour >= 8 && hour <= 17) {
          expectedRate = 28 + Math.cos(hour) * 4;
        } else {
          expectedRate = 4.2;
        }
        actualRate = expectedRate + (Math.random() * 1.5 - 0.75);
      }

      // Convert flow rate (L/min) to hourly litres (x 60)
      const expectedLitres = Math.round(Math.max(0, expectedRate) * 60);
      const actualLitres = Math.round(Math.max(0, actualRate) * 60);

      zoneData[zone.id] = {
        rateLpm: parseFloat(actualRate.toFixed(1)),
        expectedRateLpm: parseFloat(expectedRate.toFixed(1)),
        litres: actualLitres,
        expectedLitres: expectedLitres,
        isExcessive: actualLitres > expectedLitres * 1.35 && actualLitres - expectedLitres > 250,
      };

      totalActualLitres += actualLitres;
      totalExpectedLitres += expectedLitres;
    });

    const isTotalAnomaly = totalActualLitres > totalExpectedLitres * 1.25 && (totalActualLitres - totalExpectedLitres) > 500;

    return {
      hour,
      timeLabel,
      occupancyRatio: parseFloat(campusOccupancyRatio.toFixed(2)),
      weather,
      zones: zoneData,
      totalActualLitres,
      totalExpectedLitres,
      // Upper confidence band (1.15x expected + 200L margin)
      baselineUpperBound: Math.round(totalExpectedLitres * 1.15 + 200),
      baselineLowerBound: Math.round(Math.max(0, totalExpectedLitres * 0.85 - 100)),
      isAnomaly: isTotalAnomaly,
      excessLitres: Math.max(0, totalActualLitres - totalExpectedLitres),
    };
  });

  return {
    records,
    weather,
    scenarioId,
  };
}

export const WATER_TARIFF_PER_THOUSAND_LITRES = 48.00; // ₹48.00 per 1,000 Litres (standard Indian commercial/institutional utility tariff)
