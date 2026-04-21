/**
 * ParticipantsPanel - Side panel showing participants list with status
 */

import React, { useMemo } from 'react';
import { X, Mic, MicOff, Video, VideoOff, Crown } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  isHost?: boolean;
}

interface ParticipantsPanelProps {
  participants: Participant[];
  currentUserId?: string;
  onClose: () => void;
  onMuteParticipant?: (participantId: string) => void;
  onRemoveParticipant?: (participantId: string) => void;
}

export function ParticipantsPanel({
  participants,
  currentUserId,
  onClose,
  onMuteParticipant,
  onRemoveParticipant,
}: ParticipantsPanelProps) {
  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => {
      // Host first
      if (a.isHost !== b.isHost) return a.isHost ? -1 : 1;
      // Current user second
      if (a.id === currentUserId) return -1;
      if (b.id === currentUserId) return 1;
      // Then alphabetical
      return a.name.localeCompare(b.name);
    });
  }, [participants, currentUserId]);

  return (
    <div className="w-80 max-w-full h-full bg-white dark:bg-[#1a1a2e] border-l border-black/5 dark:border-white/10 flex flex-col shadow-lg">
      {/* Header */}
      <div className="border-b border-black/5 dark:border-white/10 px-4 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-black dark:text-white">
          Participants ({participants.length})
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Close participants panel"
        >
          <X className="w-5 h-5 text-black/60 dark:text-white/60" />
        </button>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {sortedParticipants.map((participant) => (
            <div
              key={participant.id}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-white">
                  {participant.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Participant Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-black dark:text-white truncate">
                    {participant.name}
                  </p>
                  {participant.isHost && (
                    <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" title="Host" />
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {participant.audioEnabled ? (
                    <Mic className="w-3.5 h-3.5 text-green-600 dark:text-green-400" title="Audio on" />
                  ) : (
                    <MicOff className="w-3.5 h-3.5 text-red-600 dark:text-red-400" title="Audio off" />
                  )}
                  {participant.videoEnabled ? (
                    <Video className="w-3.5 h-3.5 text-green-600 dark:text-green-400" title="Video on" />
                  ) : (
                    <VideoOff className="w-3.5 h-3.5 text-red-600 dark:text-red-400" title="Video off" />
                  )}
                </div>
              </div>

              {/* Actions (visible on hover) */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onMuteParticipant && participant.audioEnabled && (
                  <button
                    onClick={() => onMuteParticipant(participant.id)}
                    className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    title="Mute participant"
                    aria-label={`Mute ${participant.name}`}
                  >
                    <Mic className="w-4 h-4 text-black/60 dark:text-white/60" />
                  </button>
                )}
                {onRemoveParticipant && (
                  <button
                    onClick={() => onRemoveParticipant(participant.id)}
                    className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    title="Remove participant"
                    aria-label={`Remove ${participant.name}`}
                  >
                    <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-black/5 dark:border-white/10 px-4 py-3 text-xs text-black/60 dark:text-white/60">
        <p>
          You're in this meeting with {Math.max(0, participants.length - 1)}{' '}
          {participants.length === 1 ? 'other person' : 'other people'}
        </p>
      </div>
    </div>
  );
}
