/**
 * ParticipantsPanel — Slide-in right sidebar participants list
 * Avatar, name, mic/cam status, host badge, role-based actions
 */

import { useMemo } from 'react';
import { X, Mic, MicOff, Video, VideoOff, Crown, Copy, Check, Pin } from 'lucide-react';
import { useState } from 'react';

interface Participant {
  id: string;
  name: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  isHost?: boolean;
  isPinned?: boolean;
}

interface ParticipantsPanelProps {
  participants: Participant[];
  currentUserId?: string;
  roomCode?: string;
  subject?: string;
  maxParticipants?: number;
  onClose: () => void;
  onTogglePinParticipant?: (id: string) => void;
  onMuteParticipant?: (id: string) => void;
  onRemoveParticipant?: (id: string) => void;
}

const AVATAR_COLORS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-pink-600',
];

function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export function ParticipantsPanel({
  participants,
  currentUserId,
  roomCode,
  subject,
  maxParticipants,
  onClose,
  onTogglePinParticipant,
  onMuteParticipant,
  onRemoveParticipant,
}: ParticipantsPanelProps) {
  const [copied, setCopied] = useState(false);

  const sorted = useMemo(
    () =>
      [...participants].sort((a, b) => {
        if (a.isHost !== b.isHost) return a.isHost ? -1 : 1;
        if (a.id === currentUserId) return -1;
        if (b.id === currentUserId) return 1;
        return a.name.localeCompare(b.name);
      }),
    [participants, currentUserId]
  );

  const handleCopyCode = async () => {
    if (!roomCode) return;
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside
      className="w-[320px] shrink-0 h-full flex flex-col bg-[#1e1f20] border-l border-white/[0.06] shadow-2xl"
      aria-label="Participants panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06] shrink-0">
        <h2 className="text-[15px] font-semibold text-white">
          People{' '}
          <span className="text-white/40 font-normal text-sm">
            ({participants.length}{maxParticipants ? `/${maxParticipants}` : ''})
          </span>
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Close participants panel"
        >
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* Room info */}
      {(roomCode || subject) && (
        <div className="px-4 py-3 border-b border-white/[0.06] space-y-2 shrink-0">
          {subject && (
            <p className="text-xs text-white/40 truncate">{subject}</p>
          )}
          {roomCode && (
            <div className="flex items-center justify-between gap-2 bg-[#2d2e30] rounded-xl px-3 py-2">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Room code</p>
                <p className="text-sm font-mono text-white/80">{roomCode}</p>
              </div>
              <button
                onClick={() => void handleCopyCode()}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                aria-label="Copy room code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-white/40" />
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-white/10">
        {sorted.map((p) => {
          const isMe = p.id === currentUserId;
          const initials = p.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

          return (
            <div
              key={p.id}
              className="group flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors"
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColor(p.name)} flex items-center justify-center shrink-0`}
              >
                <span className="text-xs font-semibold text-white">{initials}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-white truncate">
                    {p.name}
                    {isMe && <span className="text-white/40 font-normal"> (You)</span>}
                  </span>
                  {p.isHost && (
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-label="Host" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {p.audioEnabled ? (
                    <Mic className="w-3 h-3 text-emerald-400" aria-label="Mic on" />
                  ) : (
                    <MicOff className="w-3 h-3 text-red-400" aria-label="Mic off" />
                  )}
                  {p.videoEnabled ? (
                    <Video className="w-3 h-3 text-emerald-400" aria-label="Camera on" />
                  ) : (
                    <VideoOff className="w-3 h-3 text-red-400" aria-label="Camera off" />
                  )}
                </div>
              </div>

              {/* Host actions */}
              {(onTogglePinParticipant || (!isMe && (onMuteParticipant || onRemoveParticipant))) && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onTogglePinParticipant && (
                    <button
                      onClick={() => onTogglePinParticipant(p.id)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        p.isPinned ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'hover:bg-white/10'
                      }`}
                      aria-label={p.isPinned ? `Unpin ${p.name}` : `Pin ${p.name}`}
                      title={p.isPinned ? 'Unpin' : 'Pin fullscreen'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${p.isPinned ? 'text-blue-300' : 'text-white/50'}`} />
                    </button>
                  )}
                  {onMuteParticipant && p.audioEnabled && (
                    <button
                      onClick={() => onMuteParticipant(p.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                      aria-label={`Mute ${p.name}`}
                      title="Mute"
                    >
                      <Mic className="w-3.5 h-3.5 text-white/50" />
                    </button>
                  )}
                  {onRemoveParticipant && (
                    <button
                      onClick={() => onRemoveParticipant(p.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors"
                      aria-label={`Remove ${p.name}`}
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/[0.06] px-4 py-3">
        <p className="text-[11px] text-white/30 text-center">
          {participants.length === 1
            ? 'Only you in this call'
            : `${participants.length - 1} other ${participants.length === 2 ? 'person' : 'people'} in this call`}
        </p>
      </div>
    </aside>
  );
}
