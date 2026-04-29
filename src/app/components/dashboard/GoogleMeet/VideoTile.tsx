/**
 * VideoTile — Individual participant video tile
 */

import { useRef, useEffect, useState } from 'react';
import { MicOff, VideoOff, Volume2, Pin } from 'lucide-react';

interface VideoTileProps {
  peerId: string;
  name: string;
  stream?: MediaStream | null;
  isLocal?: boolean;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  isActiveSpeaker?: boolean;
  isMirrored?: boolean;
  compact?: boolean;
  isPinned?: boolean;
  /** True while WebRTC is negotiating and no stream has arrived yet */
  isConnecting?: boolean;
}

const AVATAR_COLORS = [
  ['#7c3aed', '#6d28d9'],
  ['#2563eb', '#0891b2'],
  ['#059669', '#0d9488'],
  ['#d97706', '#b45309'],
  ['#dc2626', '#db2777'],
  ['#4f46e5', '#2563eb'],
];

function getAvatarColors(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** Animated speaking bars — three bars that bounce at different speeds */
function SpeakingWave({ size = 14 }: { size?: number }) {
  const barStyle = (delay: string): React.CSSProperties => ({
    width: Math.round(size * 0.2),
    borderRadius: 99,
    background: '#1a73e8',
    animation: `speakBar 0.9s ease-in-out ${delay} infinite alternate`,
  });

  return (
    <>
      <style>{`
        @keyframes speakBar {
          0%   { height: ${Math.round(size * 0.3)}px; opacity: 0.7; }
          100% { height: ${size}px;                   opacity: 1;   }
        }
      `}</style>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'flex-end',
          gap: Math.round(size * 0.15),
          height: size,
        }}
      >
        <div style={barStyle('0s')} />
        <div style={barStyle('0.18s')} />
        <div style={barStyle('0.36s')} />
      </div>
    </>
  );
}

export function VideoTile({
  name,
  stream,
  isLocal = false,
  audioEnabled = true,
  videoEnabled = true,
  isActiveSpeaker = false,
  isMirrored = false,
  compact = false,
  isPinned = false,
  isConnecting = false,
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setVideoReady(false);

    if (stream && videoEnabled) {
      video.srcObject = stream;

      const onReady = () => {
        setVideoReady(true);
        video.play().catch(() => {});
      };

      if (video.readyState >= 1) {
        onReady();
      } else {
        video.addEventListener('loadedmetadata', onReady, { once: true });
        const t = setTimeout(onReady, 1500);
        return () => {
          video.removeEventListener('loadedmetadata', onReady);
          clearTimeout(t);
        };
      }
    } else {
      video.srcObject = null;
      video.load();
    }
  }, [stream, videoEnabled]);

  const showVideo = videoEnabled && videoReady && !!stream;
  const initials = name.split(' ').map((w) => w[0] ?? '').join('').toUpperCase().slice(0, 2) || '?';
  const [c1, c2] = getAvatarColors(name);

  const avatarSize = compact ? 28 : 56;
  const fontSize = compact ? 11 : 22;
  const nameFontSize = compact ? 10 : 13;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#1c1c1e',
        outline: isActiveSpeaker ? '2px solid #1a73e8' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: isActiveSpeaker ? '0 0 0 4px rgba(26,115,232,0.22)' : 'none',
        transition: 'outline 0.2s, box-shadow 0.2s',
        userSelect: 'none',
      }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        muted={isLocal}
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: isMirrored ? 'scaleX(-1)' : 'none',
          opacity: showVideo ? 1 : 0,
          transition: 'opacity 0.3s',
          background: '#000',
        }}
      />

      {/* ── State 1: Connecting — peer discovered, stream not yet arrived ── */}
      {!showVideo && (isConnecting || (!stream && videoEnabled)) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: compact ? 6 : 10,
            background: '#111112',
          }}
        >
          <style>{`
            @keyframes rtcSpin {
              to { transform: rotate(360deg); }
            }
            @keyframes rtcPulse {
              0%, 100% { opacity: 0.35; }
              50%       { opacity: 0.7; }
            }
          `}</style>
          {/* Spinner ring */}
          <div style={{ position: 'relative', width: compact ? 24 : 36, height: compact ? 24 : 36 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `${compact ? 2 : 3}px solid rgba(255,255,255,0.08)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `${compact ? 2 : 3}px solid transparent`,
                borderTopColor: '#1a73e8',
                animation: 'rtcSpin 0.9s linear infinite',
              }}
            />
          </div>
          {/* Label */}
          {!compact && (
            <span
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '0.02em',
                animation: 'rtcPulse 2s ease-in-out infinite',
              }}
            >
              Connecting…
            </span>
          )}
          {/* Name pill */}
          <div
            style={{
              position: 'absolute',
              bottom: compact ? 20 : 32,
              background: 'rgba(0,0,0,0.5)',
              borderRadius: 999,
              padding: compact ? '1px 6px' : '2px 10px',
            }}
          >
            <span style={{ fontSize: compact ? 9 : 11, color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, system-ui, sans-serif' }}>
              {name}
            </span>
          </div>
        </div>
      )}

      {/* ── State 2: Camera off — avatar with gradient ── */}
      {!showVideo && !isConnecting && (!videoEnabled || !!stream) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${c1}, ${c2})`,
          }}
        >
          <div
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize,
              color: '#fff',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {initials}
          </div>
          {!videoEnabled && (
            <div
              style={{
                position: 'absolute',
                bottom: compact ? 24 : 40,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'rgba(0,0,0,0.45)',
                borderRadius: 999,
                padding: '2px 8px',
              }}
            >
              <VideoOff size={compact ? 10 : 12} color="rgba(255,255,255,0.6)" />
              {!compact && (
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Camera off
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── State 3: Stream received, video decoding ── */}
      {videoEnabled && !videoReady && !!stream && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#111112',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ position: 'relative', width: 28, height: 28 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#1a73e8', animation: 'rtcSpin 0.9s linear infinite' }} />
          </div>
        </div>
      )}

      {/* Pin badge (top-right) */}
      {isPinned && !compact && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'rgba(26,115,232,0.85)',
            borderRadius: 6,
            padding: '3px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Pin size={10} color="#fff" />
          <span style={{ fontSize: 9, color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600 }}>
            Pinned
          </span>
        </div>
      )}

      {/* Active-speaker speaking wave (top-left) */}
      {isActiveSpeaker && audioEnabled && !compact && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: 'rgba(26,115,232,0.18)',
            border: '1px solid rgba(26,115,232,0.4)',
            borderRadius: 8,
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backdropFilter: 'blur(4px)',
          }}
        >
          <Volume2 size={11} color="#1a73e8" />
          <SpeakingWave size={12} />
        </div>
      )}

      {/* Bottom name bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
          padding: compact ? '12px 8px 4px' : '24px 12px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
        }}
      >
        <span
          style={{
            fontSize: nameFontSize,
            fontWeight: 500,
            color: '#fff',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: 'Inter, system-ui, sans-serif',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {name}{isLocal ? ' (You)' : ''}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {!audioEnabled && (
            <span
              style={{
                width: compact ? 16 : 20,
                height: compact ? 16 : 20,
                borderRadius: '50%',
                background: 'rgba(234,67,53,0.88)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MicOff size={compact ? 8 : 11} color="white" />
            </span>
          )}
          {!videoEnabled && (
            <span
              style={{
                width: compact ? 16 : 20,
                height: compact ? 16 : 20,
                borderRadius: '50%',
                background: 'rgba(234,67,53,0.88)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <VideoOff size={compact ? 8 : 11} color="white" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
