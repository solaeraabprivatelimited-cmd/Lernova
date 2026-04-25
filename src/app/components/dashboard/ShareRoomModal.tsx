import React, { useEffect, useCallback, useState } from 'react';
import { toast } from 'sonner';

interface ShareRoomModalProps {
  roomName: string;
  roomCode: string;
  onClose: () => void;
}

export function ShareRoomModal({ roomName, roomCode, onClose }: ShareRoomModalProps) {
  const joinLink = `${window.location.origin}/room/${roomCode}`;
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handleClose]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCodeCopied(true);
      toast.success('Room code copied');
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      toast.error('Failed to copy — please copy manually');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinLink);
      setLinkCopied(true);
      toast.success('Join link copied to clipboard');
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast.error('Failed to copy — please copy manually');
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-2rem)] max-w-md bg-white dark:bg-[#1a1d27] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 id="share-modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">
              Room Created
            </h2>
            <p className="text-sm text-slate-500 dark:text-white/50 mt-0.5">
              Share the code or link to invite others
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wide">
              Room Name
            </label>
            <div className="flex items-center gap-2.5 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 text-sm text-slate-800 dark:text-white">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-slate-400 dark:text-white/30">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              <span className="truncate">{roomName}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wide">
              Room Code
            </label>
            <button
              onClick={copyCode}
              className="group flex items-center justify-between h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 text-sm transition-all hover:border-[#003566] dark:hover:border-[#00d4ff] hover:bg-[#003566]/5 dark:hover:bg-[#00d4ff]/5 cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-slate-400 dark:text-white/30">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span className="font-mono font-semibold text-slate-900 dark:text-white tracking-wider">
                  {roomCode}
                </span>
              </div>
              <span className="text-xs font-medium text-[#003566] dark:text-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity">
                {codeCopied ? 'Copied!' : 'Click to copy'}
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wide">
              Join Link
            </label>
            <button
              onClick={copyLink}
              className="group flex items-center justify-between h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 text-sm transition-all hover:border-[#003566] dark:hover:border-[#00d4ff] hover:bg-[#003566]/5 dark:hover:bg-[#00d4ff]/5 cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-slate-400 dark:text-white/30">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span className="text-[#003566] dark:text-[#00d4ff] truncate font-medium text-xs">
                  {joinLink}
                </span>
              </div>
              <span className="shrink-0 text-xs font-medium text-[#003566] dark:text-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                {linkCopied ? 'Copied!' : 'Copy'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={handleClose}
            className="flex-1 h-10 rounded-xl border-2 border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-white/60 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            Done
          </button>
          <button
            onClick={copyLink}
            className="flex-1 h-10 rounded-xl bg-[#003566] hover:bg-[#002849] dark:bg-[#1a73e8] dark:hover:bg-[#1765cc] text-white text-sm font-semibold transition-all"
          >
            {linkCopied ? '✓ Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </>
  );
}
