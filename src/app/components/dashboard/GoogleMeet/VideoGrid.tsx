/**
 * VideoGrid - Responsive grid for participant videos
 * Automatically adjusts layout based on participant count
 */

import React, { useMemo } from 'react';
import { VideoTile } from './VideoTile';

interface Participant {
  peerId: string;
  name: string;
  stream?: MediaStream;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

interface VideoGridProps {
  localParticipant: {
    peerId: string;
    name: string;
    stream?: MediaStream;
    audioEnabled: boolean;
    videoEnabled: boolean;
  };
  remoteParticipants: Participant[];
  activeSpeakerId?: string;
  isScreenSharing?: boolean;
}

/**
 * Calculate grid layout based on participant count
 */
function calculateGridLayout(count: number): string {
  // Grid templates for different participant counts
  const templates: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 grid-rows-2',
    5: 'grid-cols-3 grid-rows-2',
    6: 'grid-cols-3 grid-rows-2',
    7: 'grid-cols-4 grid-rows-2',
    8: 'grid-cols-4 grid-rows-2',
    9: 'grid-cols-3 grid-rows-3',
  };

  if (count <= 1) return templates[1];
  if (count > 9) return 'grid-cols-4 grid-rows-auto'; // Fallback for large meetings

  return templates[Math.min(count, 9)] || templates[9];
}

export function VideoGrid({
  localParticipant,
  remoteParticipants,
  activeSpeakerId,
  isScreenSharing = false,
}: VideoGridProps) {
  const allParticipants = [localParticipant, ...remoteParticipants];
  const gridLayout = useMemo(() => calculateGridLayout(allParticipants.length), [allParticipants.length]);

  // Reorder participants: active speaker first, then local, then others
  const orderedParticipants = useMemo(() => {
    const sorted = [...allParticipants];

    // Sort: active speaker first
    if (activeSpeakerId) {
      const activeSpeaker = sorted.find((p) => p.peerId === activeSpeakerId);
      if (activeSpeaker) {
        sorted.splice(sorted.indexOf(activeSpeaker), 1);
        sorted.unshift(activeSpeaker);
      }
    }

    return sorted;
  }, [allParticipants, activeSpeakerId]);

  if (isScreenSharing) {
    // Screen share mode: show shared content with participant filmstrip
    return (
      <div className="w-full h-full flex flex-col bg-black">
        {/* Shared Content Area (would be populated by screen share stream) */}
        <div className="flex-1 flex items-center justify-center bg-gray-900">
          <p className="text-white/50">Screen sharing content</p>
        </div>

        {/* Filmstrip Bottom */}
        <div className="h-24 bg-gray-950 border-t border-white/10 overflow-x-auto flex gap-2 p-2">
          {orderedParticipants.map((participant) => (
            <div
              key={participant.peerId}
              className="h-full aspect-video flex-shrink-0 rounded-lg overflow-hidden bg-gray-800"
            >
              <VideoTile
                peerId={participant.peerId}
                name={participant.name}
                stream={participant.stream}
                isLocal={participant.peerId === localParticipant.peerId}
                audioEnabled={participant.audioEnabled}
                videoEnabled={participant.videoEnabled}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`grid ${gridLayout} gap-3 w-full h-full auto-rows-fr p-3`}>
      {orderedParticipants.map((participant) => (
        <div
          key={participant.peerId}
          className="relative bg-black rounded-xl overflow-hidden min-h-0"
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
          />
        </div>
      ))}
    </div>
  );
}
