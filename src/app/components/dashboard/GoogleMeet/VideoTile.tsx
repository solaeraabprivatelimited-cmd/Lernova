/**
 * VideoTile — Individual participant video tile
 */

import { useRef, useEffect, useState } from 'react';

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

function MicOffIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="2" x2="22" y2="22" />
      <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
      <path d="M5 10v2a7 7 0 0 0 12 5" />
      <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function VideoOffIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.66 6H14a2 2 0 0 1 2 2v2.34l1 1L22 8v8" />
      <path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l10 10Z" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
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
        // Fallback: mark ready after 1.5s regardless
        const t = setTimeout(onReady, 1500);
        return () => {
          video.removeEventListener('loadedmetadata', onReady);
          clearTimeout(t);
        };
      }
    } else {
      video.srcObject = null;
      video.load(); // clears the last frame
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
        boxShadow: isActiveSpeaker ? '0 0 0 4px rgba(26,115,232,0.25)' : 'none',
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

      {/* Avatar fallback */}
      {!showVideo && (
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
        </div>
      )}

      {/* Loading pulse */}
      {videoEnabled && !videoReady && !!stream && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#1c1c1e',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
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
            <span style={{
              width: 18, height: 18, borderRadius: '50%',
              background: 'rgba(234,67,53,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MicOffIcon size={10} />
            </span>
          )}
          {!videoEnabled && (
            <span style={{
              width: 18, height: 18, borderRadius: '50%',
              background: 'rgba(234,67,53,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <VideoOffIcon size={10} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
