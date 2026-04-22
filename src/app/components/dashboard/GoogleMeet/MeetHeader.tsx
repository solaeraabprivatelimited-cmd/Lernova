/**
 * MeetHeader — Top bar with inline SVG icons
 */

import { useState, useEffect } from 'react';

interface MeetHeaderProps {
  roomName: string;
  subject?: string;
  participantCount: number;
  isConnected: boolean;
  roomCode?: string;
  onGoToDashboard?: () => void;
}

function useMeetingTimer() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function MeetHeader({ roomName, subject, participantCount, isConnected, roomCode, onGoToDashboard }: MeetHeaderProps) {
  const timer = useMeetingTimer();

  return (
    <header
      role="banner"
      style={{
        height: 56,
        flexShrink: 0,
        background: 'rgba(32,33,36,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 40,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Left — logo + room info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
        {/* Elm Orbit logo — click to go to dashboard */}
        {onGoToDashboard && (
          <button
            onClick={onGoToDashboard}
            title="Back to Dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px 4px 0',
              borderRight: '1px solid rgba(255,255,255,0.1)',
              marginRight: 4,
              flexShrink: 0,
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, #003566, #F77F00)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 11, fontFamily: 'Inter, sans-serif' }}>L</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'Righteous, sans-serif', whiteSpace: 'nowrap' }}>Elm Orbit</span>
          </button>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.2 }}>
            {roomName}
          </div>
          {subject && (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
              {subject}
            </div>
          )}
        </div>
        {roomCode && (
          <span style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.35)',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20,
            padding: '2px 10px',
            fontFamily: 'monospace',
            flexShrink: 0,
            display: 'none',
          }}>
            {roomCode}
          </span>
        )}
      </div>

      {/* Center — timer + status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        {/* Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.55)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span style={{ fontSize: 13, fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>{timer}</span>
        </div>

        {/* Connection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: isConnected ? '#34d399' : '#fbbf24' }}>
          {isConnected ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          )}
          <span style={{ fontSize: 12, fontWeight: 500 }}>
            {isConnected ? 'Connected' : 'Connecting…'}
          </span>
        </div>

        {/* Encrypted badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Encrypted</span>
        </div>
      </div>

      {/* Right — count */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontVariantNumeric: 'tabular-nums' }}>
          {participantCount} {participantCount === 1 ? 'person' : 'people'}
        </span>
      </div>
    </header>
  );
}
