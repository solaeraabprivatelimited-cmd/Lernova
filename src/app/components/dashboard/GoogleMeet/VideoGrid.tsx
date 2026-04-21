/**
 * VideoGrid — Responsive participant grid
 * Auto-adjusts layout for 1–16 participants, screen-share filmstrip mode
 */

import { useMemo } from 'react';
import { VideoTile } from './VideoTile';

interface Participant {
  peerId: string;
  name: string;
  stream?: MediaStream | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

interface VideoGridProps {
  localParticipant: Participant;
  remoteParticipants: Participant[];
  activeSpeakerId?: string | null;
  isScreenSharing?: boolean;
  screenShareStream?: MediaStream | null;
}

function gridClass(count: number): string {
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  if (count <= 4) return 'grid-cols-2 grid-rows-2';
  if (count <= 6) return 'grid-cols-3 grid-rows-2';
  if (count <= 9) return 'grid-cols-3 grid-rows-3';
  if (count <= 12) return 'grid-cols-4 grid-rows-3';
  return 'grid-cols-4 grid-rows-4';
}

export function VideoGrid({
  localParticipant,
  remoteParticipants,
  activeSpeakerId,
  isScreenSharing = false,
  screenShareStream,
}: VideoGridProps) {
  const all = useMemo(() => {
    const list = [localParticipant, ...remoteParticipants];
    if (!activeSpeakerId) return list;
    const idx = list.findIndex((p) => p.peerId === activeSpeakerId);
    if (idx <= 0) return list;
    const sorted = [...list];
    const [speaker] = sorted.splice(idx, 1);
    sorted.unshift(speaker);
    return sorted;
  }, [localParticipant, remoteParticipants, activeSpeakerId]);

  /* ── Screen-share layout ── */
  if (isScreenSharing) {
    return (
      <div className="flex flex-col w-full h-full bg-[#111112]">
        {/* Main shared content */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {screenShareStream ? (
            <video
              muted
              playsInline
              className="max-w-full max-h-full object-contain rounded-lg"
              ref={(v) => {
                if (v && v.srcObject !== screenShareStream) {
                  v.srcObject = screenShareStream;
                  v.play().catch((err) => {
                    console.warn('[ScreenShare] Play failed:', err);
                  });
                }
              }}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-white/40">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium">Waiting for screen share…</p>
            </div>
          )}

          {/* "You are presenting" badge */}
          {localParticipant.peerId === activeSpeakerId && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#1a73e8] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
              You are presenting
            </div>
          )}
        </div>

        {/* Filmstrip */}
        <div className="h-[88px] bg-[#1c1c1e] border-t border-white/5 flex items-center gap-2 px-3 overflow-x-auto shrink-0">
          {all.map((p) => (
            <div
              key={p.peerId}
              className="h-[68px] aspect-video shrink-0 rounded-lg overflow-hidden"
            >
              <VideoTile
                peerId={p.peerId}
                name={p.name}
                stream={p.stream}
                isLocal={p.peerId === localParticipant.peerId}
                audioEnabled={p.audioEnabled}
                videoEnabled={p.videoEnabled}
                isActiveSpeaker={p.peerId === activeSpeakerId}
                isMirrored={p.peerId === localParticipant.peerId}
                compact
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Normal grid layout ── */
  return (
    <div
      className={`grid ${gridClass(all.length)} gap-2 w-full h-full p-2 auto-rows-fr`}
      style={{ minHeight: 0 }}
    >
      {all.map((p) => (
        <div
          key={p.peerId}
          className="relative min-h-0 rounded-xl overflow-hidden"
          style={{ aspectRatio: all.length === 1 ? undefined : '16/9' }}
        >
          <VideoTile
            peerId={p.peerId}
            name={p.name}
            stream={p.stream}
            isLocal={p.peerId === localParticipant.peerId}
            audioEnabled={p.audioEnabled}
            videoEnabled={p.videoEnabled}
            isActiveSpeaker={p.peerId === activeSpeakerId}
            isMirrored={p.peerId === localParticipant.peerId}
          />
        </div>
      ))}
    </div>
  );
}
