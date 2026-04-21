/**
 * VideoTile — Individual participant video tile
 * Google Meet-style with avatar fallback, name label, status indicators, active speaker glow
 */

import { useRef, useEffect, useState } from 'react';
import { MicOff, VideoOff } from 'lucide-react';

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
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-pink-600',
  'from-indigo-500 to-blue-600',
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function VideoTile({
  peerId,
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
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setVideoReady(false);
    setVideoError(false);

    if (stream && videoEnabled) {
      video.srcObject = stream;
      
      // Wait for loadedmetadata before playing
      const handleLoadedMetadata = () => {
        setVideoReady(true);
        video.play().catch(() => {
          setVideoError(true);
        });
      };
      
      // Use 'loadedmetadata' event instead of calling play immediately
      const metadataListener = () => handleLoadedMetadata();
      video.addEventListener('loadedmetadata', metadataListener, { once: true });
      
      // Timeout fallback in case loadedmetadata doesn't fire
      const timeout = setTimeout(() => {
        setVideoReady(true);
        video.play().catch(() => {
          setVideoError(true);
        });
      }, 2000);
      
      return () => {
        video.removeEventListener('loadedmetadata', metadataListener);
        clearTimeout(timeout);
      };
    } else {
      video.srcObject = null;
    }
  }, [stream, videoEnabled]);

  const showVideo = videoEnabled && videoReady && !videoError && !!stream;
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const avatarColor = getAvatarColor(name);

  return (
    <div
      className={[
        'relative w-full h-full rounded-xl overflow-hidden bg-[#1c1c1e] select-none',
        'transition-all duration-300',
        isActiveSpeaker
          ? 'ring-2 ring-[#1a73e8] shadow-[0_0_0_2px_rgba(26,115,232,0.4)]'
          : 'ring-1 ring-white/5',
      ].join(' ')}
      aria-label={`${name}${isLocal ? ' (You)' : ''}`}
    >
      {/* Video element — always mounted, hidden when no video */}
      <video
        ref={videoRef}
        muted={isLocal}
        playsInline
        onError={() => {
          console.warn('[VideoTile] Video error for', name);
          setVideoError(true);
        }}
        onEnded={() => setVideoReady(false)}
        className={[
          'absolute inset-0 w-full h-full object-cover',
          isMirrored ? 'scale-x-[-1]' : '',
          showVideo ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-300',
        ].join(' ')}
      />

      {/* Avatar fallback */}
      {!showVideo && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${avatarColor}`}
        >
          <div
            className={[
              'rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-semibold text-white',
              compact ? 'w-8 h-8 text-xs' : 'w-16 h-16 text-2xl',
            ].join(' ')}
          >
            {initials}
          </div>
        </div>
      )}

      {/* Loading skeleton overlay */}
      {videoEnabled && !videoReady && !videoError && !!stream && (
        <div className="absolute inset-0 bg-[#1c1c1e] animate-pulse" />
      )}

      {/* Bottom gradient + name label */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-8 pb-2 px-3">
        <div className="flex items-center justify-between gap-2">
          <span
            className={[
              'font-medium text-white truncate drop-shadow-sm',
              compact ? 'text-[10px]' : 'text-sm',
            ].join(' ')}
          >
            {name}
            {isLocal && (
              <span className="ml-1.5 text-white/60 font-normal">(You)</span>
            )}
          </span>

          {/* Status icons */}
          <div className="flex items-center gap-1 shrink-0">
            {!audioEnabled && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/90">
                <MicOff className="w-2.5 h-2.5 text-white" />
              </span>
            )}
            {!videoEnabled && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/90">
                <VideoOff className="w-2.5 h-2.5 text-white" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Active speaker pulse ring */}
      {isActiveSpeaker && (
        <div className="absolute inset-0 rounded-xl ring-2 ring-[#1a73e8] animate-pulse pointer-events-none" />
      )}
    </div>
  );
}
