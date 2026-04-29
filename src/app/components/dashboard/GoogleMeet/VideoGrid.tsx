/**
 * VideoGrid - Responsive participant grid with pin and screen-share layouts.
 */

import { useMemo } from 'react';
import { VideoTile } from './VideoTile';

interface Participant {
  peerId: string;
  name: string;
  stream?: MediaStream | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
  /** True while the WebRTC connection is being negotiated (no stream yet) */
  isConnecting?: boolean;
}

interface VideoGridProps {
  localParticipant: Participant;
  remoteParticipants: Participant[];
  activeSpeakerId?: string | null;
  isScreenSharing?: boolean;
  screenShareStream?: MediaStream | null;
  pinnedParticipantId?: string | null;
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
  pinnedParticipantId,
}: VideoGridProps) {
  const all = useMemo(() => {
    const list = [localParticipant, ...remoteParticipants];
    if (!activeSpeakerId) return list;
    const idx = list.findIndex((participant) => participant.peerId === activeSpeakerId);
    if (idx <= 0) return list;
    const sorted = [...list];
    const [speaker] = sorted.splice(idx, 1);
    sorted.unshift(speaker);
    return sorted;
  }, [localParticipant, remoteParticipants, activeSpeakerId]);

  const pinnedParticipant = useMemo(
    () => all.find((participant) => participant.peerId === pinnedParticipantId) ?? null,
    [all, pinnedParticipantId]
  );

  const otherParticipants = useMemo(
    () => all.filter((participant) => participant.peerId !== pinnedParticipantId),
    [all, pinnedParticipantId]
  );

  if (isScreenSharing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#111112' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: 8 }}>
          {screenShareStream ? (
            <video
              muted
              playsInline
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }}
              ref={(video) => {
                if (video && video.srcObject !== screenShareStream) {
                  video.srcObject = screenShareStream;
                  video.play().catch(() => {});
                }
              }}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.3)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
              <span style={{ fontSize: 13, fontFamily: 'Inter, system-ui, sans-serif' }}>Waiting for screen share...</span>
            </div>
          )}
        </div>

        <div
          style={{
            height: 88,
            background: '#1c1c1e',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 12px',
            overflowX: 'auto',
            flexShrink: 0,
          }}
        >
          {all.map((participant) => (
            <div key={participant.peerId} style={{ height: 68, aspectRatio: '16/9', flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}>
              <VideoTile
                peerId={participant.peerId}
                name={participant.name}
                stream={participant.stream}
                isLocal={participant.peerId === localParticipant.peerId}
                audioEnabled={participant.audioEnabled}
                videoEnabled={participant.videoEnabled}
                isActiveSpeaker={participant.peerId === activeSpeakerId}
                isMirrored={participant.peerId === localParticipant.peerId}
                isConnecting={participant.isConnecting}
                compact
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pinnedParticipant) {
    return (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#111112', gap: 8, padding: 8, boxSizing: 'border-box' }}>
        <div style={{ flex: 1, minWidth: 0, minHeight: 0, borderRadius: 14, overflow: 'hidden' }}>
          <VideoTile
            peerId={pinnedParticipant.peerId}
            name={pinnedParticipant.name}
            stream={pinnedParticipant.stream}
            isLocal={pinnedParticipant.peerId === localParticipant.peerId}
            audioEnabled={pinnedParticipant.audioEnabled}
            videoEnabled={pinnedParticipant.videoEnabled}
            isActiveSpeaker={pinnedParticipant.peerId === activeSpeakerId}
            isMirrored={pinnedParticipant.peerId === localParticipant.peerId}
            isConnecting={pinnedParticipant.isConnecting}
            isPinned
          />
        </div>

        <div
          style={{
            width: 220,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            overflowY: 'auto',
            minHeight: 0,
          }}
        >
          {otherParticipants.map((participant) => (
            <div key={participant.peerId} style={{ height: 120, flexShrink: 0, borderRadius: 12, overflow: 'hidden' }}>
              <VideoTile
                peerId={participant.peerId}
                name={participant.name}
                stream={participant.stream}
                isLocal={participant.peerId === localParticipant.peerId}
                audioEnabled={participant.audioEnabled}
                videoEnabled={participant.videoEnabled}
                isActiveSpeaker={participant.peerId === activeSpeakerId}
                isMirrored={participant.peerId === localParticipant.peerId}
                isConnecting={participant.isConnecting}
                compact
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

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
      {all.map((participant) => (
        <div
          key={participant.peerId}
          style={{ position: 'relative', minHeight: 0, minWidth: 0, borderRadius: 12, overflow: 'hidden' }}
        >
          <VideoTile
            peerId={participant.peerId}
            name={participant.name}
            stream={participant.stream}
            isLocal={participant.peerId === localParticipant.peerId}
            audioEnabled={participant.audioEnabled}
            videoEnabled={participant.videoEnabled}
            isActiveSpeaker={participant.peerId === activeSpeakerId}
            isMirrored={participant.peerId === localParticipant.peerId}
            isConnecting={participant.isConnecting}
          />
        </div>
      ))}
    </div>
  );
}
