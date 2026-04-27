/**
 * MeetHeader - Top bar with room metadata and sharing controls.
 */

import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  Clock,
  Copy,
  Check,
  Users,
  Wifi,
  WifiOff,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { ElmOriginLogo } from "@/app/components/ElmOriginLogo";

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

export function MeetHeader({
  roomName,
  subject,
  participantCount,
  isConnected,
  roomCode,
  onGoToDashboard,
}: MeetHeaderProps) {
  const timer = useMeetingTimer();
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const roomLink =
    roomCode && typeof window !== 'undefined'
      ? `${window.location.origin}/room/${roomCode}`
      : '';

  const handleCopyRoomCode = async () => {
    if (!roomCode) return;
    try {
      await navigator.clipboard.writeText(roomCode);
      setCodeCopied(true);
    } catch {
      /* silent */
    }
    window.setTimeout(() => setCodeCopied(false), 1800);
  };

  const handleCopyRoomLink = async () => {
    if (!roomLink) return;
    try {
      await navigator.clipboard.writeText(roomLink);
      setLinkCopied(true);
    } catch {
      /* silent */
    }
    window.setTimeout(() => setLinkCopied(false), 1800);
  };

  return (
    <header
      role="banner"
      style={{
        flexShrink: 0,
        background: 'rgba(32,33,36,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        zIndex: 40,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* ── Left: logo / back + room info ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
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
              padding: '4px 12px 4px 6px',
              borderRight: '1px solid rgba(255,255,255,0.1)',
              marginRight: 4,
              flexShrink: 0,
              borderRadius: 8,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
          >
            <ChevronLeft size={15} style={{ color: 'rgba(255,255,255,0.45)', flexShrink: 0 }} />
            <ElmOriginLogo light size={26} wordmarkSize={13} />
          </button>
        )}

        {/* Room name + subject + code/link chips */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>

          {/* Name + subject row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#fff',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
              }}
            >
              {roomName}
            </span>

            {subject && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.45)',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 999,
                  padding: '2px 8px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <BookOpen size={10} style={{ flexShrink: 0 }} />
                {subject}
              </span>
            )}
          </div>

          {/* Code + link chips */}
          {roomCode && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              {/* Room code chip */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 999,
                  padding: '3px 6px 3px 10px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  Code
                </span>
                <span style={{ fontSize: 11, color: '#fff', fontFamily: 'monospace' }}>{roomCode}</span>
                <button
                  onClick={() => void handleCopyRoomCode()}
                  title={codeCopied ? 'Copied!' : 'Copy room code'}
                  style={{
                    border: 'none',
                    background: codeCopied ? 'rgba(52,211,153,0.15)' : 'rgba(138,180,248,0.12)',
                    color: codeCopied ? '#34d399' : '#8ab4f8',
                    cursor: 'pointer',
                    padding: '3px 6px',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  {codeCopied
                    ? <Check size={11} />
                    : <Copy size={11} />}
                  <span style={{ fontSize: 10, fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {codeCopied ? 'Copied' : 'Copy'}
                  </span>
                </button>
              </div>

              {/* Room link chip */}
              {roomLink && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    minWidth: 0,
                    maxWidth: '100%',
                    borderRadius: 999,
                    padding: '3px 6px 3px 10px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.05)',
                  }}
                >
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Link
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.72)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: 220,
                    }}
                  >
                    {roomLink}
                  </span>
                  <button
                    onClick={() => void handleCopyRoomLink()}
                    title={linkCopied ? 'Copied!' : 'Copy room link'}
                    style={{
                      border: 'none',
                      background: linkCopied ? 'rgba(52,211,153,0.15)' : 'rgba(138,180,248,0.12)',
                      color: linkCopied ? '#34d399' : '#8ab4f8',
                      cursor: 'pointer',
                      padding: '3px 6px',
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      flexShrink: 0,
                      transition: 'background 0.2s, color 0.2s',
                    }}
                  >
                    {linkCopied
                      ? <Check size={11} />
                      : <Copy size={11} />}
                    <span style={{ fontSize: 10, fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {linkCopied ? 'Copied' : 'Copy'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: status indicators + participant count ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>

        {/* Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.5)' }}>
          <Clock size={13} />
          <span style={{ fontSize: 13, fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>{timer}</span>
        </div>

        {/* Connection status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: isConnected ? '#34d399' : '#fbbf24' }}>
          {isConnected
            ? <Wifi size={14} />
            : <WifiOff size={14} />}
          <span style={{ fontSize: 12, fontWeight: 500 }}>
            {isConnected ? 'Connected' : 'Connecting…'}
          </span>
        </div>

        {/* Encrypted */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.22)', fontSize: 12 }}>
          <ShieldCheck size={13} />
          <span>Encrypted</span>
        </div>

        {/* Participant count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
          <Users size={13} />
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            {participantCount} {participantCount === 1 ? 'person' : 'people'}
          </span>
        </div>
      </div>
    </header>
  );
}
