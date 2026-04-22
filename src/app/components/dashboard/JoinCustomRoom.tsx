import React, { useState } from 'react';

interface JoinCustomRoomProps {
  onBack: () => void;
  onEnterRoom: (roomCodeOrLink: string) => Promise<void>;
}

export function JoinCustomRoom({ onBack, onEnterRoom }: JoinCustomRoomProps) {
  const [roomInput, setRoomInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  const handleEnterRoom = async () => {
    const val = roomInput.trim();
    if (!val) return;
    setError('');
    setIsJoining(true);
    try {
      await onEnterRoom(val);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to join room. Check the code and try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') void handleEnterRoom();
  };

  return (
    <div className="px-4 sm:px-8 lg:px-16 pb-10 max-w-lg">
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
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">Join Custom Room</h1>
        <p className="text-sm text-slate-500 dark:text-white/50">Paste a room code like <span className="font-mono font-medium text-slate-700 dark:text-white/70">STUDY-AB12CD</span> or a share link.</p>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-white/8 shadow-sm p-6 sm:p-8 space-y-5">

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-white/80 mb-1.5">
            Room Code or Link
          </label>
          <input
            type="text"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="STUDY-AB12CD"
            autoFocus
            className="w-full h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3.5 text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:border-[#003566] dark:focus:border-[#00d4ff] focus:ring-2 focus:ring-[#003566]/10 dark:focus:ring-[#00d4ff]/10 transition-all"
          />
          <p className="text-xs text-slate-400 dark:text-white/30 mt-1.5">
            Rooms support up to 20 participants with end-to-end encrypted audio and video.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          onClick={() => void handleEnterRoom()}
          disabled={!roomInput.trim() || isJoining}
          className="w-full h-11 rounded-xl bg-[#003566] hover:bg-[#002849] dark:bg-[#1a73e8] dark:hover:bg-[#1765cc] text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {isJoining ? (
            <span className="inline-flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Joining…
            </span>
          ) : 'Enter Room'}
        </button>
      </div>
    </div>
  );
}
