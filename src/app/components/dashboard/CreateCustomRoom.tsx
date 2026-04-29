import { useState } from 'react';
import { roomAPI } from '@/utils/api/roomAPI';
import { toast } from 'sonner';

interface CreateCustomRoomProps {
  onBack: () => void;
  onLaunchRoom: (roomData: RoomData) => void;
}

interface RoomData {
  roomName: string;
  subject: string;
  roomType: 'private' | 'public';
  roomId: string;
  roomCode: string;
  maxParticipants?: number;
  mode: string;
}

type Mode = 'focus' | 'silent' | 'collaborative' | 'live';

const MODES: { value: Mode; label: string; description: string; icon: string }[] = [
  { value: 'collaborative', label: 'Collaborative', description: 'Open discussion and teamwork.', icon: '🤝' },
  { value: 'focus',         label: 'Focus',         description: 'Deep work, minimal distraction.', icon: '🎯' },
  { value: 'silent',        label: 'Silent',        description: 'Audio off — study in silence.', icon: '🔇' },
  { value: 'live',          label: 'Live',          description: 'Real-time lecture or presentation.', icon: '📡' },
];

const inputCls =
  'w-full h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:border-[#003566] dark:focus:border-[#00d4ff] focus:ring-2 focus:ring-[#003566]/10 dark:focus:ring-[#00d4ff]/10 transition-all';

const labelCls = 'block text-sm font-medium text-slate-700 dark:text-white/80';

export function CreateCustomRoom({ onBack, onLaunchRoom }: CreateCustomRoomProps) {
  const [roomName, setRoomName]               = useState('');
  const [subject, setSubject]                 = useState('');
  const [mode, setMode]                       = useState<Mode>('collaborative');
  const [roomType, setRoomType]               = useState<'private' | 'public'>('private');
  const [maxParticipants, setMaxParticipants] = useState(6);
  const [isLaunching, setIsLaunching]         = useState(false);
  const [error, setError]                     = useState('');

  const nameLen    = roomName.trim().length;
  const subjectLen = subject.trim().length;
  const canLaunch  = nameLen >= 1 && subjectLen >= 1 && !isLaunching;

  const handleLaunchRoom = async () => {
    if (!canLaunch) return;
    setError('');
    setIsLaunching(true);

    const doCreate = async () => {
      const createdRoom = await roomAPI.createRoom({
        name:            roomName.trim(),
        subject:         subject.trim(),
        mode,
        description:     undefined,
        maxParticipants,
      });
      toast.success('Room created!', { description: `Code: ${createdRoom.code}` });
      onLaunchRoom({
        roomName:        createdRoom.name,
        subject:         createdRoom.subject ?? subject.trim(),
        roomType,
        roomId:          createdRoom.id,
        roomCode:        createdRoom.code,
        maxParticipants: createdRoom.max_participants,
        mode:            createdRoom.mode,
      });
    };

    try {
      await doCreate();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create room. Please try again.';

      // If stuck in a previous room (e.g. tab was closed without leaving),
      // force-clear all active participant records then retry once automatically.
      if (/ALREADY_IN|already.*(in|joined).*room/i.test(msg)) {
        try {
          await roomAPI.forceLeaveAllRooms();
          await doCreate();
          return; // retry succeeded — don't fall through to setError
        } catch (retryErr) {
          const retryMsg = retryErr instanceof Error ? retryErr.message : msg;
          setError(retryMsg);
          toast.error('Room creation failed', { description: retryMsg });
          return;
        }
      }

      setError(msg);
      toast.error('Room creation failed', { description: msg });
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="px-4 sm:px-8 lg:px-16 pb-10 max-w-2xl">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
          Create a Room
        </h1>
        <p className="text-sm text-slate-500 dark:text-white/50">
          Build your own space to learn your way.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-white/8 shadow-sm p-6 sm:p-8 space-y-6">

        {/* Room Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelCls}>Room Name</label>
            <span className={`text-xs ${nameLen > 240 ? 'text-red-500' : 'text-slate-400 dark:text-white/30'}`}>
              {nameLen}/255
            </span>
          </div>
          <input
            type="text"
            value={roomName}
            maxLength={255}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="e.g. Physics Study Group"
            className={inputCls}
          />
        </div>

        {/* Subject */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelCls}>Subject / Topic</label>
            <span className={`text-xs ${subjectLen > 240 ? 'text-red-500' : 'text-slate-400 dark:text-white/30'}`}>
              {subjectLen}/255
            </span>
          </div>
          <input
            type="text"
            value={subject}
            maxLength={255}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Quantum Mechanics"
            className={inputCls}
          />
        </div>

        {/* Room Mode */}
        <div>
          <label className={`${labelCls} mb-2`}>Room Mode</label>
          <div className="grid grid-cols-2 gap-2.5 mt-2">
            {MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMode(m.value)}
                className={[
                  'rounded-xl p-3.5 text-left border-2 transition-all',
                  mode === m.value
                    ? 'border-[#003566] dark:border-[#00d4ff] bg-[#003566]/5 dark:bg-[#00d4ff]/5'
                    : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20',
                ].join(' ')}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base leading-none">{m.icon}</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{m.label}</span>
                  {mode === m.value && (
                    <span className="ml-auto w-4 h-4 rounded-full bg-[#003566] dark:bg-[#00d4ff] flex items-center justify-center shrink-0">
                      <svg width="8" height="6" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1.5 4L3.5 6L8.5 1.5" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-white/40 leading-relaxed pl-6">
                  {m.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Max Participants */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelCls}>Max Participants</label>
            <span className="text-sm font-semibold text-[#003566] dark:text-[#00d4ff] tabular-nums">
              {maxParticipants}
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="20"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#003566] dark:accent-[#00d4ff] bg-slate-200 dark:bg-white/10"
          />
          <p className="text-xs text-slate-400 dark:text-white/30 mt-1.5">
            2–20 participants · recommended: 4–8
          </p>
        </div>

        {/* Visibility */}
        <div>
          <label className={`${labelCls} mb-2 block`}>Visibility</label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {(['private', 'public'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setRoomType(type)}
                className={[
                  'rounded-xl p-4 text-left border-2 transition-all',
                  roomType === type
                    ? 'border-[#003566] dark:border-[#00d4ff] bg-[#003566]/5 dark:bg-[#00d4ff]/5'
                    : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20',
                ].join(' ')}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={[
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                    roomType === type
                      ? 'border-[#003566] dark:border-[#00d4ff]'
                      : 'border-slate-300 dark:border-white/30',
                  ].join(' ')}>
                    {roomType === type && (
                      <div className="w-2 h-2 rounded-full bg-[#003566] dark:bg-[#00d4ff]" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                    {type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-white/40 leading-relaxed">
                  {type === 'private'
                    ? 'Invite-only via room code or link.'
                    : 'Listed publicly in Join a Room.'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Room Code Preview */}
        <div>
          <label className={`${labelCls} mb-1.5 block`}>Room Code (generated on launch)</label>
          <div className="h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3.5 flex items-center">
            <span className="text-sm font-mono text-slate-400 dark:text-white/30 tracking-widest">
              STUDY-XXXXXX
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-white/30 mt-1.5">
            Share this code after launching so others can join.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 px-4 py-3 text-sm text-red-600 dark:text-red-400 flex items-start gap-2.5">
            <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 h-11 rounded-xl border-2 border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-white/60 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLaunchRoom}
            disabled={!canLaunch}
            className="flex-1 h-11 rounded-xl bg-[#003566] hover:bg-[#002849] dark:bg-[#1a73e8] dark:hover:bg-[#1765cc] text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isLaunching ? (
              <span className="inline-flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating…
              </span>
            ) : 'Launch Room'}
          </button>
        </div>
      </div>
    </div>
  );
}
