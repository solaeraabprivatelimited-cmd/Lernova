import React, { useState, useEffect, useCallback } from 'react';
import { roomAPI } from '@/utils/api/roomAPI';
import { toast } from 'sonner';

interface JoinRandomRoomViewProps {
  onBack: () => void;
  onJoinRoom: (roomId: string, roomName: string, subject: string) => void;
}

interface Room {
  id: string;
  code: string;
  name: string;
  subject: string;
  mode?: string;
  participant_count?: number;
  max_participants?: number;
}

const MODE_LABELS: Record<string, string> = {
  focus:         'Focus',
  silent:        'Silent',
  collaborative: 'Collab',
  live:          'Live',
};

const MODE_COLORS: Record<string, string> = {
  focus:         'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  silent:        'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white/50',
  collaborative: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  live:          'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

const SUBJECT_COLORS: Record<string, string> = {
  default:   '#6366f1',
  math:      '#0967bd',
  physics:   '#7c3aed',
  chemistry: '#059669',
  biology:   '#16a34a',
  english:   '#d97706',
  history:   '#b45309',
  computer:  '#0891b2',
  neet:      '#dc2626',
  ielts:     '#2563eb',
  java:      '#ea580c',
  python:    '#16a34a',
  social:    '#7c3aed',
  french:    '#0967bd',
  eamcet:    '#dc2626',
};

function subjectColor(subject: string) {
  const key = (subject ?? '').toLowerCase().split(' ')[0];
  return SUBJECT_COLORS[key] ?? SUBJECT_COLORS.default;
}

function SubjectBadge({ subject }: { subject: string }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white shrink-0"
      style={{ background: subjectColor(subject) }}
    >
      {subject}
    </span>
  );
}

function ModeBadge({ mode }: { mode?: string }) {
  if (!mode) return null;
  const label = MODE_LABELS[mode] ?? mode;
  const cls = MODE_COLORS[mode] ?? 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white/50';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/8 overflow-hidden animate-pulse">
      <div className="h-1.5 bg-slate-200 dark:bg-white/10" />
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-white/10" />
          <div className="h-5 w-14 rounded-full bg-slate-200 dark:bg-white/10" />
        </div>
        <div className="h-3 w-1/3 rounded bg-slate-100 dark:bg-white/5" />
        <div className="flex items-center justify-between mt-4">
          <div className="h-3 w-16 rounded bg-slate-100 dark:bg-white/5" />
          <div className="h-8 w-20 rounded-lg bg-slate-200 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export function JoinRandomRoomView({ onBack, onJoinRoom }: JoinRandomRoomViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms]             = useState<Room[]>([]);
  const [loading, setLoading]         = useState(true);
  const [fetchError, setFetchError]   = useState<string | null>(null);
  const [joiningId, setJoiningId]     = useState<string | null>(null);

  const fetchRooms = useCallback(() => {
    let active = true;
    setLoading(true);
    setFetchError(null);

    roomAPI.listRooms()
      .then((data) => {
        if (active) setRooms((data as Room[]) ?? []);
      })
      .catch((err) => {
        if (active) {
          const msg = err instanceof Error ? err.message : 'Unable to load rooms';
          setFetchError(msg);
          toast.error('Could not load rooms', { description: msg });
        }
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    const cleanup = fetchRooms();
    return cleanup;
  }, [fetchRooms]);

  const filtered = rooms.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.subject ?? '').toLowerCase().includes(q) ||
      (r.mode ?? '').toLowerCase().includes(q)
    );
  });

  const handleJoin = async (room: Room) => {
    if (joiningId) return;
    setJoiningId(room.id);
    try {
      onJoinRoom(room.code ?? room.id, room.name, room.subject ?? '');
    } catch (err) {
      toast.error('Failed to join room', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
      setJoiningId(null);
    }
  };

  return (
    <div className="px-4 sm:px-8 lg:px-16 pb-10">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Join a Room</h1>
          <p className="text-sm text-slate-500 dark:text-white/50 mt-0.5">
            Find an open study room and start learning instantly.
          </p>
        </div>
        {!loading && !fetchError && (
          <span className="text-xs font-medium text-slate-400 dark:text-white/30 pt-1 shrink-0">
            {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
          </span>
        )}
      </div>

      <div className="relative mb-8 max-w-md">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30 pointer-events-none"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, subject, or mode…"
          className="w-full h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:border-[#003566] dark:focus:border-[#00d4ff] focus:ring-2 focus:ring-[#003566]/10 dark:focus:ring-[#00d4ff]/10 transition-all"
        />
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && fetchError && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-white/70">Could not load rooms</p>
          <p className="text-xs text-slate-400 dark:text-white/30 mt-1 max-w-xs">{fetchError}</p>
          <button
            onClick={fetchRooms}
            className="mt-5 h-9 px-5 rounded-xl bg-[#003566] dark:bg-[#1a73e8] text-white text-sm font-semibold hover:bg-[#002849] dark:hover:bg-[#1765cc] transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !fetchError && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((room) => {
            const color     = subjectColor(room.subject ?? '');
            const isJoining = joiningId === room.id;
            const isFull    =
              room.max_participants != null &&
              room.participant_count != null &&
              room.participant_count >= room.max_participants;

            return (
              <div
                key={room.id}
                className="group bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-white/8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
              >
                <div className="h-1.5 w-full" style={{ background: color }} />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-tight line-clamp-2">
                      {room.name}
                    </h3>
                    <SubjectBadge subject={room.subject ?? 'General'} />
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {room.mode && <ModeBadge mode={room.mode} />}
                    <span className="text-xs font-mono text-slate-400 dark:text-white/30 truncate">
                      {room.code ?? room.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-white/40">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isFull ? 'bg-red-400' : 'bg-emerald-500 animate-pulse'
                        }`}
                      />
                      {room.participant_count != null
                        ? `${room.participant_count}${room.max_participants != null ? `/${room.max_participants}` : ''} online`
                        : 'Open'}
                    </div>

                    <button
                      onClick={() => handleJoin(room)}
                      disabled={isJoining || isFull || joiningId !== null}
                      className="h-8 px-4 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: isFull ? '#94a3b8' : color }}
                    >
                      {isFull ? 'Full' : isJoining ? 'Joining…' : 'Join'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !fetchError && rooms.length > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-slate-400 dark:text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-white/60">No rooms match your search</p>
          <p className="text-xs text-slate-400 dark:text-white/30 mt-1">Try a different subject or room name.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-xs font-medium text-[#003566] dark:text-[#00d4ff] hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      {!loading && !fetchError && rooms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-slate-400 dark:text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 9h6M9 12h6M9 15h4" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-white/60">No open rooms right now</p>
          <p className="text-xs text-slate-400 dark:text-white/30 mt-1">Be the first — create a room and invite others.</p>
        </div>
      )}
    </div>
  );
}
