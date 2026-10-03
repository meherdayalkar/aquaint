import React from 'react';
import { CheckCircle2, X, Wrench, Clock, MapPin } from 'lucide-react';

export function WorkOrderToast({ workOrder, onDismiss }) {
  if (!workOrder) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      backgroundColor: 'var(--color-surface-container-high)',
      border: '1px solid rgba(0, 229, 255, 0.4)',
      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 24px rgba(0, 229, 255, 0.2)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.25rem 1.5rem',
      maxWidth: '400px',
      width: '100%',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.625rem',
      animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-container)', fontWeight: 700, fontSize: '0.9rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span>
          <span className="font-headline-sm" style={{ fontSize: '0.95rem' }}>Rapid Dispatch Dispatched!</span>
        </div>
        <button 
          onClick={onDismiss}
          style={{ background: 'transparent', border: 'none', color: 'var(--color-on-surface-variant)', cursor: 'pointer', padding: '4px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
        </button>
      </div>

      <p className="font-body-md" style={{ fontSize: '0.8125rem', color: 'var(--color-on-surface)', lineHeight: 1.4 }}>
        Hydraulic Ticket <strong className="font-mono" style={{ color: 'var(--color-primary-container)' }}>{workOrder.ticketId}</strong> logged for <strong>{workOrder.zoneName}</strong>. Squad alerted to isolate branch valve.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-on-surface-variant)', borderTop: '1px solid rgba(132, 147, 150, 0.15)', paddingTop: '0.5rem' }}>
        <span className="stitch-pill pill-error" style={{ fontSize: '0.65rem' }}>PRIORITY {workOrder.severity}</span>
        <span style={{ color: '#34d399', fontWeight: 600 }}>Plumber On-Route • ETA 8m</span>
      </div>
    </div>
  );
}
