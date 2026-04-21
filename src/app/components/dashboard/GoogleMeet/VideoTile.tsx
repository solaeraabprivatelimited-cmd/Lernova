/**
 * VideoTile - Individual participant video container
 * Displays video stream with name label and status indicators
 */

import React, { useRef, useEffect, useState } from 'react';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface VideoTileProps {
  peerId: string;
  name: string;
  stream?: MediaStream;
  isLocal?: boolean;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  isActiveSpeaker?: boolean;
  isMirrored?: boolean;
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
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (stream) {
      video.srcObject = stream;
      video.play().catch((err) => console.warn('[VideoTile] Play error:', err));
    }

    const handleLoadedMetadata = () => {
      setVideoLoaded(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, [stream]);

  const hasVideo = videoEnabled && videoLoaded;

  return (
    <div
      className={`relative w-full h-full bg-black rounded-xl overflow-hidden transition-all duration-300 ${
        isActiveSpeaker ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        muted={isLocal}
        playsInline
        className={`w-full h-full object-cover ${isMirrored && isLocal ? 'scale-x-[-1]' : ''}`}
        style={{ display: hasVideo ? 'block' : 'none' }}
      />

      {/* Placeholder - No Video */}
      {!hasVideo && (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-lg font-semibold text-white">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Name Label - Bottom Left */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white truncate">{name}</span>
          <div className="flex items-center gap-1">
            {!audioEnabled && <MicOff className="w-4 h-4 text-white/80" />}
            {!videoEnabled && <VideoOff className="w-4 h-4 text-white/80" />}
          </div>
        </div>
      </div>

      {/* Status Badge - Top Right (Optional) */}
      {isLocal && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600 rounded-full text-xs font-medium text-white">
          You
        </div>
      )}
    </div>
  );
}
