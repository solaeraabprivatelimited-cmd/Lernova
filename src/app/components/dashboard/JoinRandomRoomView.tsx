import React, { useState, useEffect } from 'react';
import { roomAPI } from '@/utils/api/roomAPI';

interface JoinRandomRoomViewProps {
  onBack: () => void;
  onJoinRoom: (roomId: string, roomName: string, subject: string) => void;
}

interface Room {
  id: string;
  code: string;
  name: string;
  subject: string;
  participantCount?: number;
}

const SUBJECT_COLORS: Record<string, string> = {
  default:  '#6366f1',
  math:     '#0967bd',
  physics:  '#7c3aed',
  chemistry:'#059669',
  biology:  '#16a34a',
  english:  '#d97706',
  history:  '#b45309',
  computer: '#0891b2',
  neet:     '#dc2626',
  ielts:    '#2563eb',
  java:     '#ea580c',
  python:   '#16a34a',
  social:   '#7c3aed',
  french:   '#0967bd',
  eamcet:   '#dc2626',
};

function subjectColor(subject: string) {
  const key = subject.toLowerCase().split(' ')[0];
  return SUBJECT_COLORS[key] ?? SUBJECT_COLORS.default;
}

function SubjectBadge({ subject }: { subject: string }) {
  const color = subjectColor(subject);
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
      style={{ background: color }}
    >
      {subject}
    </span>
  );
}

export function JoinRandomRoomView({ onBack, onJoinRoom }: JoinRandomRoomViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    roomAPI.listRooms?.()
      .then((data: Room[]) => {
        if (active) setRooms(data ?? []);
      })
      .catch(() => {
        // Fallback to static rooms if API not available
        if (active) setRooms([
          { id: '1', code: 'NEET-7K9M2',    name: 'NEET Room',    subject: 'NEET' },
          { id: '2', code: 'IELTS-3B4N7',   name: 'IELTS Room',   subject: 'IELTS' },
          { id: '3', code: 'SOCIAL-5P8Q1',  name: 'Social Room',  subject: 'Social' },
          { id: '4', code: 'EAMCET-9X2W6',  name: 'EAMCET Room',  subject: 'EAMCET' },
          { id: '5', code: 'FRENCH-4L6V3',  name: 'French Room',  subject: 'French' },
          { id: '6', code: 'JAVA-8T5S0',    name: 'Java Room',    subject: 'Java' },
        ]);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = rooms.filter((r) => {
    const q = searchQuery.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q);
  });

  const handleJoin = (room: Room) => {
    setJoiningId(room.id);
    onJoinRoom(room.code ?? room.id, room.name, room.subject);
  };

  return (
    <div className="px-4 sm:px-8 lg:px-16 pb-10">
      {/* Back */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">Join Random Room</h1>
        <p className="text-sm text-slate-500 dark:text-white/50">Find an open study room and start learning instantly.</p>
      </div>

      {/* Search */}
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
          placeholder="Search by subject or room name…"
          className="w-full h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:border-[#003566] dark:focus:border-[#00d4ff] focus:ring-2 focus:ring-[#003566]/10 dark:focus:ring-[#00d4ff]/10 transition-all"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {/* Room Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((room) => {
            const color = subjectColor(room.subject);
            const isJoining = joiningId === room.id;
            return (
              <div
                key={room.id}
                className="group bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-white/8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
              >
                {/* Color accent bar */}
                <div className="h-1.5 w-full" style={{ background: color }} />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-tight">{room.name}</h3>
                    <SubjectBadge subject={room.subject} />
                  </div>

                  <p className="text-xs font-mono text-slate-400 dark:text-white/30 mb-4">
                    {room.code ?? room.id}
                  </p>

                  <div className="flex items-center justify-between">
                    {room.participantCount != null && (
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-white/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {room.participantCount} online
                      </span>
                    )}
                    <button
                      onClick={() => handleJoin(room)}
                      disabled={isJoining}
                      className="ml-auto h-8 px-4 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-50"
                      style={{ background: color }}
                    >
                      {isJoining ? 'Joining…' : 'Join Room'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-slate-400 dark:text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-white/60">No rooms found</p>
          <p className="text-xs text-slate-400 dark:text-white/30 mt-1">Try a different subject or search term.</p>
        </div>
      )}
    </div>
  );
}
