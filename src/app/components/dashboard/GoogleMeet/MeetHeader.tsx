/**
 * MeetHeader — Top bar: room name, meeting timer, connection status
 */

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Clock, Shield } from 'lucide-react';

interface MeetHeaderProps {
  roomName: string;
  subject?: string;
  participantCount: number;
  isConnected: boolean;
  roomCode?: string;
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
}: MeetHeaderProps) {
  const timer = useMeetingTimer();

  return (
    <header
      className="h-14 shrink-0 bg-[#202124]/95 backdrop-blur-md border-b border-white/[0.06] px-4 flex items-center justify-between z-40"
      role="banner"
    >
      {/* Left — room info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="text-[15px] font-semibold text-white truncate leading-tight">
            {roomName}
          </h1>
          {subject && (
            <p className="text-[11px] text-white/50 truncate leading-tight mt-0.5">{subject}</p>
          )}
        </div>

        {roomCode && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-white/40 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 font-mono shrink-0">
            {roomCode}
          </span>
        )}
      </div>

      {/* Center — timer + status */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-white/60">
          <Clock className="w-3.5 h-3.5" aria-hidden />
          <span className="font-mono text-[13px] tabular-nums">{timer}</span>
        </div>

        <div
          className={[
            'flex items-center gap-1.5 text-[12px] font-medium',
            isConnected ? 'text-emerald-400' : 'text-amber-400',
          ].join(' ')}
          aria-live="polite"
          aria-label={isConnected ? 'Connected' : 'Connecting'}
        >
          {isConnected ? (
            <Wifi className="w-3.5 h-3.5" aria-hidden />
          ) : (
            <WifiOff className="w-3.5 h-3.5 animate-pulse" aria-hidden />
          )}
          <span className="hidden sm:inline">
            {isConnected ? 'Connected' : 'Connecting…'}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-white/30 text-[12px]">
          <Shield className="w-3.5 h-3.5" aria-hidden />
          <span>Encrypted</span>
        </div>
      </div>

      {/* Right — participant count */}
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-white/50 tabular-nums">
          {participantCount} {participantCount === 1 ? 'person' : 'people'}
        </span>
      </div>
    </header>
  );
}
