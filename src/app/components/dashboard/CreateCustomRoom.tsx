import { useState } from 'react';
import svgPaths from "../../../imports/svg-r9h2tu6cre";
import { roomAPI } from '@/utils/api/roomAPI';

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
}

const inputCls =
  'w-full h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:border-[#003566] dark:focus:border-[#00d4ff] focus:ring-2 focus:ring-[#003566]/10 dark:focus:ring-[#00d4ff]/10 transition-all';

const labelCls = 'block text-sm font-medium text-slate-700 dark:text-white/80 mb-1.5';

export function CreateCustomRoom({ onBack, onLaunchRoom }: CreateCustomRoomProps) {
  const [roomName, setRoomName] = useState('');
  const [subject, setSubject] = useState('');
  const [roomType, setRoomType] = useState<'private' | 'public'>('private');
  const [maxParticipants, setMaxParticipants] = useState(6);
  const [isLaunching, setIsLaunching] = useState(false);
  const [error, setError] = useState('');

  const handleLaunchRoom = async () => {
    if (!roomName.trim() || !subject.trim()) return;
    setError('');
    setIsLaunching(true);
    try {
      const createdRoom = await roomAPI.createRoom({
        name: roomName.trim(),
        subject: subject.trim(),
        mode: 'collaborative',
        description: `${roomType} study room`,
        maxParticipants,
      });
      onLaunchRoom({
        roomName: createdRoom.name,
        subject: createdRoom.subject || subject,
        roomType,
        roomId: createdRoom.id,
        roomCode: createdRoom.code,
        maxParticipants: createdRoom.max_participants,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room. Please try again.');
    } finally {
      setIsLaunching(false);
    }
  };

  const canLaunch = roomName.trim().length > 0 && subject.trim().length > 0 && !isLaunching;

  return (
    <div className="px-4 sm:px-8 lg:px-16 pb-10 max-w-2xl">
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
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">Create Custom Room</h1>
        <p className="text-sm text-slate-500 dark:text-white/50">Build your own space to learn your way.</p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-white/8 shadow-sm p-6 sm:p-8 space-y-6">

        {/* Room Name */}
        <div>
          <label className={labelCls}>Room Name</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="e.g. Physics Study Group"
            className={inputCls}
          />
        </div>

        {/* Subject */}
        <div>
          <label className={labelCls}>Subject / Topic</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Quantum Mechanics"
            className={inputCls}
          />
        </div>

        {/* Max Participants */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelCls.replace('mb-1.5', '')}>Max Participants</label>
            <span className="text-sm font-semibold text-[#003566] dark:text-[#00d4ff]">{maxParticipants}</span>
          </div>
          <input
            type="range"
            min="2"
            max="20"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#003566] dark:accent-[#00d4ff] bg-slate-200 dark:bg-white/10"
          />
          <p className="text-xs text-slate-400 dark:text-white/30 mt-1.5">2–20 participants (recommended: 4–8)</p>
        </div>

        {/* Room Type */}
        <div>
          <label className={labelCls}>Room Type</label>
          <div className="grid grid-cols-2 gap-3">
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
                  <span className="text-sm font-semibold text-slate-900 dark:text-white capitalize">{type}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-white/40 leading-relaxed">
                  {type === 'private'
                    ? 'Invite-only via room code or link.'
                    : 'Listed publicly in Join Random Room.'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Room Code Preview */}
        <div>
          <label className={labelCls}>Room Code (generated on launch)</label>
          <div className="h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3.5 flex items-center">
            <span className="text-sm font-mono text-slate-400 dark:text-white/30">STUDY-XXXXXX</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-white/30 mt-1.5">Share this code after launching so others can join.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
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
              <span className="inline-flex items-center gap-2">
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
