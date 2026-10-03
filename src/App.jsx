import React, { useState, useEffect, useMemo } from 'react';
import { 
  generateHourlyTimeline, 
  DEMO_SCENARIOS 
} from './data/mockData';
import { 
  calculateDynamicBudget, 
  analyzeAnomalies 
} from './services/aiEngine';
import { authService } from './services/authService';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { GuestBanner } from './components/GuestBanner';
import { DemoControlBar } from './components/DemoControlBar';
import { CommandCenterHero } from './components/CommandCenterHero';
import { KPICards } from './components/KPICards';
import { ConsumptionChart } from './components/ConsumptionChart';
import { FingerprintCard } from './components/FingerprintCard';
import { RootCauseModal } from './components/RootCauseModal';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { ActionPriorityQueue } from './components/ActionPriorityQueue';
import { ZoneMatrix } from './components/ZoneMatrix';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { WorkOrderToast } from './components/WorkOrderToast';
import { AuthModal } from './components/AuthModal';
import { OnboardingWelcomeModal } from './components/OnboardingWelcomeModal';
import { GuidedTour } from './components/GuidedTour';

export default function App() {
  // Authentication & Guest Mode State
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [isGuest, setIsGuest] = useState(() => {
    // If user is not authenticated and has not set guest mode yet, default to guest mode for hackathon judges
    if (!authService.isAuthenticated() && !authService.isGuest()) {
      authService.setGuestMode(true);
      return true;
    }
    return authService.isGuest();
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [newlyRegisteredUser, setNewlyRegisteredUser] = useState(null);

  // Guided Tour State
  const [isTourActive, setIsTourActive] = useState(false);

  // Operational Dashboard State
  const [currentScenario, setCurrentScenario] = useState('BLOCK_B_LEAK'); // Ready for demo
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard', 'monitoring', 'leakage', 'simulator', 'zones'
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [prefillSimulatorScenario, setPrefillSimulatorScenario] = useState(null);
  const [simulatedRecords, setSimulatedRecords] = useState(null);
  const [showExecutiveReport, setShowExecutiveReport] = useState(false);
  const [activeWorkOrder, setActiveWorkOrder] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync with authService state changes & server token verification
  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      setCurrentUser(state.user);
      setIsGuest(state.isGuest);
    });

    authService.verifySession().then((verifiedUser) => {
      if (verifiedUser) {
        setCurrentUser(verifiedUser);
        setIsGuest(false);
      }
    });

    return unsubscribe;
  }, []);

  // Generate real-time dynamic data pipeline (memoized to prevent render loops)
  const timelineData = useMemo(() => generateHourlyTimeline(currentScenario), [currentScenario]);
  const budgetData = useMemo(() => calculateDynamicBudget(timelineData), [timelineData]);
  const analysisData = useMemo(() => analyzeAnomalies(timelineData), [timelineData]);

  const handleSelectScenario = (scenarioId) => {
    setCurrentScenario(scenarioId);
    setSimulatedRecords(null);
    setPrefillSimulatorScenario(null);
    setSelectedAnomaly(null);
  };

  const handleSelectAnomalyHour = (hour) => {
    const match = analysisData.anomalies.find((a) => a.affectedHours.includes(hour));
    if (match) {
      setSelectedAnomaly(match);
    } else if (analysisData.anomalies.length > 0) {
      setSelectedAnomaly(analysisData.anomalies[0]);
    }
  };

  const handleOpenSimulatorWithScenario = (scenarioId) => {
    setPrefillSimulatorScenario(scenarioId);
    setCurrentTab('simulator');
    setSelectedAnomaly(null);
  };

  const handleDispatchWorkOrder = (anomaly) => {
    const ticketId = `WO-${Math.floor(1000 + Math.random() * 9000)}`;
    setActiveWorkOrder({
      ticketId,
      zoneName: anomaly.zoneName,
      severity: anomaly.severity,
      action: anomaly.recommendedAction,
    });
  };

  const handleQuickDispatch = () => {
    const top = analysisData.anomalies[0];
    const ticketId = `WO-${Math.floor(1000 + Math.random() * 9000)}`;
    setActiveWorkOrder({
      ticketId,
      zoneName: top ? top.zoneName : 'Campus Central Main Sub-System',
      severity: top ? top.severity : 'NORMAL',
      action: top ? top.recommendedAction : 'Dispatch routine sensor calibration squad to ensure meter accuracy.',
    });
  };

  // Auth Handlers
  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const handleSuccessLogin = (user, isNewRegistration = false) => {
    setCurrentUser(user);
    setIsGuest(false);
    setShowAuthModal(false);

    if (isNewRegistration) {
      setNewlyRegisteredUser(user);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setIsGuest(false);
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  const handleContinueGuest = () => {
    authService.setGuestMode(true);
    setShowAuthModal(false);
  };

  // Tour Handlers
  const handleStartTour = () => {
    setIsTourActive(true);
  };

  const handleCompleteTour = (completed) => {
    setIsTourActive(false);
    authService.updateTourStatus(completed);
  };

  return (
    <div className="stitch-app-wrapper">
      
      {/* 1. STITCH NAVIGATION RAIL (LEFT SIDEBAR) */}
      <Sidebar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeAnomaliesCount={analysisData.anomalies.length}
        onOpenReport={() => setShowExecutiveReport(true)}
        currentUser={currentUser}
        isGuest={isGuest}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        onTriggerTour={handleStartTour}
        isOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="stitch-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 2. STITCH TOP APP BAR */}
      <Header 
        weather={timelineData.weather}
        activeAnomaliesCount={analysisData.anomalies.length}
        onOpenReport={() => setShowExecutiveReport(true)}
        onQuickDispatch={handleQuickDispatch}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onTriggerTour={handleStartTour}
        currentUser={currentUser}
        isGuest={isGuest}
        onOpenAuth={handleOpenAuth}
      />

      {/* 3. MAIN CONTENT LAYOUT */}
      <div className="stitch-main-layout">
        
        {/* Guest Demo Notice Strip (When in Guest Evaluation Mode) */}
        {isGuest && (
          <GuestBanner 
            onOpenAuth={handleOpenAuth}
            onTakeTour={handleStartTour}
          />
        )}

        {/* Scenario Injector Ribbon */}
        <DemoControlBar 
          currentScenario={currentScenario}
          onSelectScenario={handleSelectScenario}
          onTriggerAutoTour={handleStartTour}
          isAutoTouring={isTourActive}
        />

        {/* Content View Area */}
        <main className="stitch-content-container">

          {/* VIEW 1: COMMAND CENTER (Primary Executive Deck) */}
          {currentTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              
              {/* Stitch Hero Section: Total Water Measured & Active Anomaly Spotlight */}
              <CommandCenterHero 
                budgetData={budgetData}
                analysisData={analysisData}
                onSimulateIsolation={handleOpenSimulatorWithScenario}
                onInvestigateAnomaly={(anomaly) => setSelectedAnomaly(anomaly)}
              />

              {/* 4-Metric KPI Grid */}
              <KPICards 
                budgetData={budgetData}
                analysisData={analysisData}
                onOpenSimulator={() => setCurrentTab('simulator')}
                onSelectAnomaly={(anom) => setSelectedAnomaly(anom)}
              />

              {/* 24h Hydraulic Envelope Telemetry Chart */}
              <div style={{ marginBottom: '1.5rem' }}>
                <ConsumptionChart 
                  timelineData={timelineData}
                  simulatedRecords={simulatedRecords}
                  onSelectAnomalyHour={handleSelectAnomalyHour}
                />
              </div>

              {/* Split Section: Active Fingerprints (Left) & Action Priorities (Right) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '1.5rem',
                alignItems: 'start'
              }}>
                
                {/* Left: Active Water-Waste Fingerprints */}
                <div id="tour-fingerprints" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
                        Active Water-Waste Fingerprints
                      </h3>
                      <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                        Algorithmic pattern recognition of hydraulic waveforms & usage signatures.
                      </p>
                    </div>
                    <span className="stitch-pill pill-primary">
                      {analysisData.anomalies.length} CLASSIFIED
                    </span>
                  </div>

                  {analysisData.anomalies.length > 0 ? (
                    analysisData.anomalies.map((anomaly) => (
                      <FingerprintCard 
                        key={anomaly.id}
                        anomaly={anomaly}
                        onSelect={(item) => setSelectedAnomaly(item)}
                      />
                    ))
                  ) : (
                    <div className="stitch-card" style={{ padding: '2rem', textAlign: 'center' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px',
                        color: '#34d399'
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>check</span>
                      </div>
                      <h4 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>No Waste Fingerprints Detected</h4>
                      <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                        Flow curves across all residential, academic, and irrigation zones match historical diurnal envelopes.
                      </p>
                    </div>
                  )}
                </div>

                {/* Right: Algorithmic Action Priority Queue */}
                <ActionPriorityQueue 
                  anomalies={analysisData.anomalies}
                  onSelectAnomaly={(item) => setSelectedAnomaly(item)}
                  onSimulateAnomaly={handleOpenSimulatorWithScenario}
                />

              </div>

            </div>
          )}

          {/* VIEW 2: LIVE MONITORING (Full Telemetry Streams) */}
          {currentTab === 'monitoring' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 className="font-headline-md" style={{ color: 'var(--color-on-surface)' }}>
                    Live Hydraulic Monitoring & Telemetry
                  </h2>
                  <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                    High-frequency smart hydro-meter telemetry with diurnal envelope confidence bands.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="stitch-pill pill-tertiary">
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-tertiary)' }} className="ping-beacon" />
                    LIVE SENSOR STREAM
                  </span>
                </div>
              </div>

              <ConsumptionChart 
                timelineData={timelineData}
                simulatedRecords={simulatedRecords}
                onSelectAnomalyHour={handleSelectAnomalyHour}
              />

              <div style={{ marginTop: '1rem' }}>
                <ZoneMatrix 
                  timelineData={timelineData}
                  analysisData={analysisData}
                  onSelectAnomaly={(item) => setSelectedAnomaly(item)}
                  onSimulateAnomaly={handleOpenSimulatorWithScenario}
                />
              </div>
            </div>
          )}

          {/* VIEW 3: LEAKAGE INTELLIGENCE (Forensic Queue) */}
          {currentTab === 'leakage' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 className="font-headline-md" style={{ color: 'var(--color-on-surface)' }}>
                  Leakage Intelligence & Waste Fingerprints
                </h2>
                <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Autonomous pattern classification of pipe leaks, tank overflows, and irrigation anomalies.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '1.5rem',
                alignItems: 'start'
              }}>
                <div id="tour-fingerprints-leakage" data-tour="tour-fingerprints" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
                    Identified Flow Anomalies ({analysisData.anomalies.length})
                  </h3>
                  {analysisData.anomalies.map((anomaly) => (
                    <FingerprintCard 
                      key={anomaly.id}
                      anomaly={anomaly}
                      onSelect={(item) => setSelectedAnomaly(item)}
                    />
                  ))}
                  {analysisData.anomalies.length === 0 && (
                    <div className="stitch-card" style={{ padding: '2rem', textAlign: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#34d399', marginBottom: '8px' }}>check_circle</span>
                      <h4 className="font-headline-sm" style={{ color: 'var(--color-on-surface)' }}>Zero Active Leakages</h4>
                      <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>All meters conform to baseline tolerances.</p>
                    </div>
                  )}
                </div>

                <ActionPriorityQueue 
                  anomalies={analysisData.anomalies}
                  onSelectAnomaly={(item) => setSelectedAnomaly(item)}
                  onSimulateAnomaly={handleOpenSimulatorWithScenario}
                />
              </div>
            </div>
          )}

          {/* VIEW 4: WHAT-IF PREDICTIVE SIMULATOR (Digital Twin) */}
          {currentTab === 'simulator' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <WhatIfSimulator 
                timelineData={timelineData}
                onSimulateChange={setSimulatedRecords}
                prefillScenario={prefillSimulatorScenario}
                onOpenReport={() => setShowExecutiveReport(true)}
              />

              {/* Consumption Chart overlay showing the simulated curve */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 className="font-title-md" style={{ color: 'var(--color-on-surface)' }}>
                    Predicted 24h Consumption Envelope With Simulated Interventions
                  </h3>
                  <span className="font-label-sm" style={{ color: '#34d399', fontWeight: 600 }}>
                    Green dashed line indicates simulated consumption
                  </span>
                </div>
                <ConsumptionChart 
                  timelineData={timelineData}
                  simulatedRecords={simulatedRecords}
                  onSelectAnomalyHour={handleSelectAnomalyHour}
                />
              </div>
            </div>
          )}

          {/* VIEW 5: CAMPUS ZONE & SUB-METER MATRIX */}
          {currentTab === 'zones' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <ZoneMatrix 
                timelineData={timelineData}
                analysisData={analysisData}
                onSelectAnomaly={(item) => setSelectedAnomaly(item)}
                onSimulateAnomaly={handleOpenSimulatorWithScenario}
              />
            </div>
          )}

        </main>

        {/* Global Footer */}
        <footer style={{
          borderTop: '1px solid rgba(132, 147, 150, 0.12)',
          padding: '1.5rem 2rem',
          backgroundColor: 'var(--color-surface-container-lowest)',
          fontSize: '0.75rem',
          color: 'var(--color-on-surface-variant)',
          marginTop: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary-container)' }}>AQUIANT</span>
              <span>—</span>
              <span>AI Water Intelligence: Measure → Understand → Detect → Explain → Simulate → Recommend → Save</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span className="font-mono">Smart Hydro-Meter Mesh v3.1</span>
              <span>•</span>
              <span>ISO 50001 / LEED Standard</span>
            </div>
          </div>
        </footer>

      </div>

      {/* 4. INTERACTIVE 7-STEP GUIDED TOUR */}
      <GuidedTour 
        isActive={isTourActive}
        onClose={() => setIsTourActive(false)}
        onComplete={handleCompleteTour}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* 5. MODALS & NOTIFICATIONS */}
      
      {/* Personalized Welcome Modal for newly registered user */}
      {newlyRegisteredUser && (
        <OnboardingWelcomeModal 
          user={newlyRegisteredUser}
          onStartTour={() => {
            setNewlyRegisteredUser(null);
            setIsTourActive(true);
          }}
          onDismiss={() => {
            setNewlyRegisteredUser(null);
            authService.updateTourStatus(false);
          }}
        />
      )}

      {/* Authentication Modal (Sign In / Register / Guest Access) */}
      <AuthModal 
        isOpen={showAuthModal}
        initialMode={authModalMode}
        onClose={() => setShowAuthModal(false)}
        onSuccessLogin={handleSuccessLogin}
        onContinueGuest={handleContinueGuest}
      />

      {/* Forensic Root-Cause Deep-Dive Incident Modal */}
      {selectedAnomaly && (
        <RootCauseModal 
          anomaly={selectedAnomaly}
          onClose={() => setSelectedAnomaly(null)}
          onOpenSimulatorWithScenario={handleOpenSimulatorWithScenario}
          onDispatchWorkOrder={handleDispatchWorkOrder}
        />
      )}

      {/* Executive Briefing & Audit Report Modal */}
      {showExecutiveReport && (
        <ExecutiveReportModal 
          timelineData={timelineData}
          budgetData={budgetData}
          analysisData={analysisData}
          onClose={() => setShowExecutiveReport(false)}
        />
      )}

      {/* Rapid Dispatch / Plumber Squad Work Order Toast */}
      {activeWorkOrder && (
        <WorkOrderToast 
          workOrder={activeWorkOrder}
          onDismiss={() => setActiveWorkOrder(null)}
        />
      )}

    </div>
  );
}
