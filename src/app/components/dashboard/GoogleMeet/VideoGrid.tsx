/**
 * VideoGrid — Responsive participant grid with correct sizing
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

function getGridStyle(count: number): React.CSSProperties {
  if (count === 1) return { gridTemplateColumns: '1fr', gridTemplateRows: '1fr' };
  if (count === 2) return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' };
  if (count <= 4) return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' };
  if (count <= 6) return { gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr' };
  if (count <= 9) return { gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr' };
  return { gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: 'auto' };
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
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#111112' }}>
        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: 8 }}>
          {screenShareStream ? (
            <video
              muted
              playsInline
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }}
              ref={(v) => {
                if (v && v.srcObject !== screenShareStream) {
                  v.srcObject = screenShareStream;
                  v.play().catch(() => {});
                }
              }}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.3)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
              <span style={{ fontSize: 13, fontFamily: 'Inter, system-ui, sans-serif' }}>Waiting for screen share…</span>
            </div>
          )}
        </div>

        {/* Filmstrip */}
        <div style={{
          height: 88,
          background: '#1c1c1e',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 12px',
          overflowX: 'auto',
          flexShrink: 0,
        }}>
          {all.map((p) => (
            <div key={p.peerId} style={{ height: 68, aspectRatio: '16/9', flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}>
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

  /* ── Normal grid ── */
  const gridStyle = getGridStyle(all.length);

  return (
    <div
      style={{
        display: 'grid',
        ...gridStyle,
        gap: 8,
        width: '100%',
        height: '100%',
        padding: 8,
        boxSizing: 'border-box',
        minHeight: 0,
      }}
    >
      {all.map((p) => (
        <div
          key={p.peerId}
          style={{ position: 'relative', minHeight: 0, minWidth: 0, borderRadius: 12, overflow: 'hidden' }}
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
