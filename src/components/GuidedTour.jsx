import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export function GuidedTour({ 
  isActive, 
  onClose, 
  onComplete, 
  currentTab, 
  setCurrentTab 
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const popoverRef = useRef(null);
  const hasScrolledRef = useRef(false);

  const steps = [
    {
      stepNumber: 1,
      title: 'Welcome to AQUAINT',
      badge: 'AI WATER INTELLIGENCE',
      targetId: 'tour-welcome-card',
      tab: 'dashboard',
      description: 'AQUAINT is an intelligent water-consumption analysis platform for campus buildings, hostels, and commercial facilities. It receives smart-meter telemetry, learns what "normal" usage looks like, flags unusual flow signatures, pinpoints probable causes, and simulates water-saving interventions.',
      primaryBtnText: 'Start Tour',
      icon: 'water_drop'
    },
    {
      stepNumber: 2,
      title: 'Water Intelligence Dashboard',
      badge: 'STEP 2 OF 7 • MEASURE',
      targetId: 'tour-dashboard-hero',
      tab: 'dashboard',
      description: 'The Command Center compares real-time consumption against your dynamic daily budget. Rather than using static limits, AQUAINT recalculates allowances dynamically based on outdoor temperature, rainfall events, and student occupancy schedules.',
      primaryBtnText: 'Next: Telemetry',
      icon: 'grid_view'
    },
    {
      stepNumber: 3,
      title: 'Telemetry & Hydraulic Envelope',
      badge: 'STEP 3 OF 7 • UNDERSTAND',
      targetId: 'tour-consumption-chart',
      tab: 'monitoring',
      description: 'The 24-hour hydraulic chart plots measured flow against learned diurnal confidence bands. Shaded blue envelopes represent historical normal patterns. Red breach markers highlight anomalous flow—such as continuous nocturnal baseflows between 01:00 AM and 05:00 AM when campus occupancy is under 3%.',
      primaryBtnText: 'Next: Zone Matrix',
      icon: 'monitoring'
    },
    {
      stepNumber: 4,
      title: 'Campus Zone Criticality Matrix',
      badge: 'STEP 4 OF 7 • DETECT',
      targetId: 'tour-zone-matrix',
      tab: 'zones',
      description: 'Drill down into individual sectors: Residential Hostel Blocks, Academic Wings, Dining Commons, Cooling Towers, and Landscape Irrigation. Compare real-time sub-meter consumption, static line pressures, and pipe integrity scores across all 6 campus nodes.',
      primaryBtnText: 'Next: AI Insights',
      icon: 'corporate_fare'
    },
    {
      stepNumber: 5,
      title: 'AI Insights & Water-Waste Fingerprints',
      badge: 'STEP 5 OF 7 • EXPLAIN',
      targetId: 'tour-fingerprints',
      tab: 'leakage',
      description: 'AQUAINT classifies abnormal hydraulic waveforms into distinct waste fingerprints: pipe ruptures, rooftop tank overflows, stuck flushometer fixtures, and weather-blind irrigation. Each insight provides a probabilistic cause, supporting physical evidence, and exact isolation valve coordinates.',
      primaryBtnText: 'Next: What-If Simulator',
      icon: 'fingerprint'
    },
    {
      stepNumber: 6,
      title: 'Digital Twin What-If Simulator',
      badge: 'STEP 6 OF 7 • SIMULATE',
      targetId: 'tour-simulator',
      tab: 'simulator',
      description: 'Test corrective interventions before dispatching maintenance teams! Toggle remediation actions—such as isolating the Block B branch line or delaying irrigation during rainstorms—and observe real-time projected returns: Litres saved/day, rupees (₹) recovered/month, pumping kWh saved, and CO₂ avoided.',
      primaryBtnText: 'Next: Action Priority',
      icon: 'tune'
    },
    {
      stepNumber: 7,
      title: 'Action Priority & Conservation',
      badge: 'STEP 7 OF 7 • SAVE',
      targetId: 'tour-action-priority',
      tab: 'dashboard',
      description: 'Prioritize repairs using algorithmic scoring based on financial exposure, waste severity, and ease of fix. Dispatch rapid plumbing squads with one click or export ISO 50001 / LEED compliant audit reports for campus executives. You are now ready to explore AQUAINT!',
      primaryBtnText: 'Finish Tour & Explore',
      icon: 'verified'
    }
  ];

  const currentStep = steps[currentStepIndex];

  // Reset scroll tracker on step switch
  useEffect(() => {
    hasScrolledRef.current = false;
  }, [currentStepIndex]);

  // Navigate tab if step requires it
  useEffect(() => {
    if (!isActive) return;

    if (currentStep.tab && currentTab !== currentStep.tab) {
      setCurrentTab(currentStep.tab);
    }
  }, [currentStepIndex, isActive, currentStep.tab, currentTab, setCurrentTab]);

  // Recalculate target element position
  useEffect(() => {
    if (!isActive) return;

    const findTargetEl = () => {
      if (!currentStep.targetId) return null;
      let el = document.getElementById(currentStep.targetId);
      if (!el && currentStep.targetId === 'tour-fingerprints') {
        el = document.getElementById('tour-fingerprints-leakage') || document.querySelector('[data-tour="tour-fingerprints"]');
      }
      return el;
    };

    const updateRect = (allowScroll = false) => {
      const el = findTargetEl();
      if (el) {
        const rect = el.getBoundingClientRect();
        // Check if element is rendered with dimensions
        if (rect.width > 0 && rect.height > 0) {
          setTargetRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            bottom: rect.bottom,
            right: rect.right
          });

          // Smoothly scroll target into view if outside (only once per step transition)
          if (allowScroll && !hasScrolledRef.current) {
            hasScrolledRef.current = true;
            if (rect.top < 70 || rect.bottom > window.innerHeight - 70) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
          return true;
        }
      }
      setTargetRect(null);
      return false;
    };

    // Staggered measurements to handle React tab mounting & layout stabilization
    updateRect(true);
    const t1 = setTimeout(() => updateRect(true), 60);
    const t2 = setTimeout(() => updateRect(true), 200);
    const t3 = setTimeout(() => updateRect(false), 500);

    const onScrollOrResize = () => updateRect(false);
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    window.addEventListener('scroll', onScrollOrResize, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize);
    };
  }, [currentStepIndex, currentTab, isActive, currentStep.targetId]);

  if (!isActive) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Completed last step!
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}
      if (onComplete) onComplete(true);
      if (onClose) onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSkip = () => {
    if (onComplete) onComplete(false); // skipped
    if (onClose) onClose();
  };

  // Compute popover position styles
  const getPopoverStyle = () => {
    const isMobile = window.innerWidth <= 768;

    // Mobile: bottom docked or centered modal if Step 1
    if (isMobile) {
      if (!targetRect) {
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '440px',
          zIndex: 10002
        };
      }
      return {
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        right: '16px',
        width: 'calc(100% - 32px)',
        maxWidth: '460px',
        margin: '0 auto',
        zIndex: 10002
      };
    }

    // Step 1 or centered desktop modal when target is not localized
    if (!targetRect) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '460px',
        maxWidth: '90vw',
        zIndex: 10002
      };
    }

    // Desktop positioning near target element
    const popoverWidth = 440;
    const estimatedHeight = 310;
    const spacing = 18;
    const minLeft = window.innerWidth > 900 ? 280 : 16; // clear left sidebar

    // Determine vertical placement: below or above
    let top;
    const spaceBelow = window.innerHeight - targetRect.bottom;
    const spaceAbove = targetRect.top;

    if (spaceBelow >= estimatedHeight + spacing + 16) {
      // Place below target
      top = targetRect.bottom + spacing;
    } else if (spaceAbove >= estimatedHeight + spacing + 70) {
      // Place above target
      top = targetRect.top - estimatedHeight - spacing;
    } else {
      // Target is tall (e.g. charts or matrices spanning viewport)
      // Anchor near bottom of viewport
      top = Math.max(70, window.innerHeight - estimatedHeight - 24);
    }

    // Determine horizontal placement: center relative to target
    let left = targetRect.left + (targetRect.width - popoverWidth) / 2;

    // Boundary constraints
    if (left + popoverWidth > window.innerWidth - 24) {
      left = window.innerWidth - popoverWidth - 24;
    }
    if (left < minLeft) {
      left = minLeft;
    }

    return {
      position: 'fixed',
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
      width: `${popoverWidth}px`,
      maxWidth: 'calc(100vw - 32px)',
      zIndex: 10002
    };
  };

  return (
    <>
      {/* Non-blurry Dimmed Overlay with Clean Spotlight Cutout */}
      <svg
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 10000,
          pointerEvents: 'auto',
          transition: 'opacity 0.25s ease'
        }}
        onClick={handleSkip}
        aria-hidden="true"
      >
        <defs>
          <mask id="tour-spotlight-mask">
            {/* White reveals the dark overlay across whole screen */}
            <rect x="0" y="0" width="100%" height="100%" fill="#ffffff" />
            {/* Black cutout creates 100% transparent clear aperture over target */}
            {targetRect && (
              <rect
                x={Math.max(0, targetRect.left - 8)}
                y={Math.max(0, targetRect.top - 8)}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="14"
                ry="14"
                fill="#000000"
              />
            )}
          </mask>
        </defs>
        {/* Crisp, subtle semi-transparent dark overlay: NO BLUR */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(6, 11, 24, 0.65)"
          mask="url(#tour-spotlight-mask)"
        />
      </svg>

      {/* Target element spotlight frame & glowing cyan border */}
      {targetRect && (
        <div
          className="tour-spotlight-frame"
          style={{
            position: 'fixed',
            top: `${targetRect.top - 8}px`,
            left: `${targetRect.left - 8}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`,
            borderRadius: '14px',
            border: '2px solid rgba(0, 229, 255, 0.95)',
            pointerEvents: 'none',
            zIndex: 10001,
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      )}

      {/* Tour Step Card Popover */}
      <div 
        ref={popoverRef}
        className="stitch-card-highlight"
        style={{
          ...getPopoverStyle(),
          backgroundColor: '#111b2b',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(0, 229, 255, 0.28)',
          border: '1px solid rgba(0, 229, 255, 0.45)',
          animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Step Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 229, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary-container)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                {currentStep.icon}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="stitch-pill pill-primary" style={{ fontSize: '0.65rem', alignSelf: 'flex-start' }}>
                {currentStep.badge}
              </span>
              <h3 className="font-headline-sm" style={{ color: 'var(--color-on-surface)', fontSize: '1.05rem', marginTop: '2px' }}>
                {currentStep.title}
              </h3>
            </div>
          </div>

          <button
            onClick={handleSkip}
            title="Exit Tour"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-on-surface-variant)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>

        {/* Step Progress Bar */}
        <div style={{
          width: '100%',
          height: '4px',
          borderRadius: '9999px',
          backgroundColor: 'var(--color-surface-container-highest)',
          margin: '0.75rem 0',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
            height: '100%',
            backgroundColor: 'var(--color-primary-container)',
            transition: 'width 0.25s ease'
          }} />
        </div>

        {/* Step Description */}
        <p className="font-body-md" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.8125rem', lineHeight: 1.5, margin: '0.75rem 0 1.25rem' }}>
          {currentStep.description}
        </p>

        {/* Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(132, 147, 150, 0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="font-label-sm" style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.75rem' }}>
              Step {currentStep.stepNumber} of {steps.length}
            </span>
            <span style={{ color: 'var(--color-outline-variant)' }}>•</span>
            <button
              onClick={handleSkip}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-on-surface-variant)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                textDecoration: 'underline'
              }}
            >
              Skip
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentStepIndex > 0 && (
              <button
                className="stitch-btn stitch-btn-secondary"
                onClick={handlePrev}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
              >
                Previous
              </button>
            )}

            <button
              className="stitch-btn stitch-btn-primary"
              onClick={handleNext}
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.78rem' }}
            >
              <span>{currentStep.primaryBtnText}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                {currentStepIndex === steps.length - 1 ? 'check' : 'arrow_forward'}
              </span>
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
