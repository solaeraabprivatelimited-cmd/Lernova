import React, { useState, useEffect } from "react";
import { participants as participantsApi } from "@/app/lib/api";
import {
  Mic, MicOff, Video, VideoOff, Share2, Hand, Smile,
  MessageCircle, AlertCircle, Loader
} from "lucide-react";

/* ── Types ── */

interface Participant {
  roomId: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isMuted: boolean;
  handRaised: boolean;
  lastUpdated: string;
}

interface Reaction {
  userId: string;
  userName: string;
  reactionType: string;
  createdAt: string;
}

/* ── Participant Badge ── */

function ParticipantBadge({
  participant,
  onStateChange,
  isCurrentUser,
  canModify,
}: {
  participant: Participant;
  onStateChange?: (userId: string, state: any) => void;
  isCurrentUser: boolean;
  canModify: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <div className="relative group cursor-pointer"
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        {/* Avatar */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0967bd] to-[#003566] flex items-center justify-center text-white font-bold text-lg border-3 border-white dark:border-slate-700 shadow-lg">
            {participant.name.charAt(0)}
          </div>

          {/* Status Indicators */}
          <div className="absolute bottom-0 right-0 flex gap-1">
            {/* Audio Status */}
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              participant.isAudioEnabled
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}>
              {participant.isAudioEnabled ? (
                <Mic className="w-3 h-3" />
              ) : (
                <MicOff className="w-3 h-3" />
              )}
            </div>

            {/* Video Status */}
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              participant.isVideoEnabled
                ? 'bg-green-500 text-white'
                : 'bg-slate-600 text-white'
            }`}>
              {participant.isVideoEnabled ? (
                <Video className="w-3 h-3" />
              ) : (
                <VideoOff className="w-3 h-3" />
              )}
            </div>

            {/* Screen Share */}
            {participant.isScreenSharing && (
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-blue-500 text-white">
                <Share2 className="w-3 h-3" />
              </div>
            )}

            {/* Hand Raised */}
            {participant.handRaised && (
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-orange-500 text-white animate-bounce">
                <Hand className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Current User Badge */}
          {isCurrentUser && (
            <div className="absolute -top-2 -left-2 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-bold">
              You
            </div>
          )}
        </div>

        {/* Hover Menu */}
        {showMenu && (canModify || isCurrentUser) && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-800 rounded-[12px] shadow-xl border border-slate-200 dark:border-slate-700 p-2 whitespace-nowrap">
            <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 px-2 py-1 mb-2 border-b border-slate-200 dark:border-slate-700">
              {participant.name}
            </div>
            <button className="w-full text-left text-[12px] px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[8px] transition-colors flex items-center gap-2">
              {participant.isAudioEnabled ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Mute</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Unmute</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Name */}
      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center mt-2 truncate max-w-[60px]">
        {participant.name}
      </p>
    </div>
  );
}

/* ── Main Component ── */

export function ParticipantStatusPanel({
  roomId,
  currentUserId,
  isRoomHost,
}: {
  roomId: string;
  currentUserId: string;
  isRoomHost: boolean;
}) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [recentReactions, setRecentReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch participants on mount and set up polling
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const response = await participantsApi.getAllStates(roomId);
        setParticipants(response || []);
      } catch (err) {
        console.error("Failed to fetch participants:", err);
        setError("Unable to load participant list");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();

    // Poll every 5 seconds
    const interval = setInterval(fetchParticipants, 5000);
    return () => clearInterval(interval);
  }, [roomId]);

  // Fetch recent reactions every 2 seconds
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await participantsApi.getRecentReactions(roomId, 5);
        setRecentReactions(response || []);
      } catch (err) {
        console.error("Failed to fetch reactions:", err);
      }
    };

    fetchReactions();

    const interval = setInterval(fetchReactions, 2000);
    return () => clearInterval(interval);
  }, [roomId]);

  const handleStateChange = async (userId: string, stateUpdate: any) => {
    try {
      if (userId === currentUserId) {
        await participantsApi.updateState(roomId, stateUpdate);
      } else if (isRoomHost) {
        await participantsApi.updateParticipantState(roomId, userId, stateUpdate);
      }

      // Refetch after state change
      const response = await participantsApi.getAllStates(roomId);
      setParticipants(response || []);
    } catch (err) {
      console.error("Failed to update participant state:", err);
    }
  };

  const sendReaction = async (reactionType: string) => {
    try {
      await participantsApi.sendReaction(roomId, reactionType);
    } catch (err) {
      console.error("Failed to send reaction:", err);
    }
  };

  if (loading && participants.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-5 h-5 text-[#0967bd] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-[12px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[12px] font-bold text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Participants Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-4">
          <Users className="w-4 h-4 text-[#0967bd]" />
          <h3 className="text-[14px] font-bold text-[#003566] dark:text-white">
            Participants ({participants.length})
          </h3>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-5 gap-4 px-4">
          {participants.map((participant) => (
            <ParticipantBadge
              key={participant.userId}
              participant={participant}
              onStateChange={handleStateChange}
              isCurrentUser={participant.userId === currentUserId}
              canModify={isRoomHost}
            />
          ))}
        </div>
      </div>

      {/* Reaction Bar */}
      <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700 pt-4">
        <p className="text-[12px] font-bold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">
          Quick Reactions
        </p>
        <div className="flex gap-2 flex-wrap">
          {[
            { type: 'thumbsup', label: '👍', emoji: '👍' },
            { type: 'heart', label: '❤️', emoji: '❤️' },
            { type: 'laughing', label: '😂', emoji: '😂' },
            { type: 'thinking', label: '🤔', emoji: '🤔' },
            { type: 'fire', label: '🔥', emoji: '🔥' },
            { type: 'cool', label: '😎', emoji: '😎' },
          ].map(({ type, emoji }) => (
            <button
              key={type}
              onClick={() => sendReaction(type)}
              className="w-10 h-10 rounded-[10px] bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-[20px] transition-colors active:scale-75"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Reactions */}
      {recentReactions.length > 0 && (
        <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700 pt-4">
          <p className="text-[12px] font-bold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">
            Reactions in Room
          </p>
          <div className="flex flex-wrap gap-2">
            {recentReactions.map((reaction, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-slate-100 dark:bg-slate-700 text-[12px] animate-in fade-in duration-300"
              >
                <span className="text-[16px]">
                  {['thumbsup', 'heart', 'laughing', 'thinking', 'fire', 'cool'].includes(
                    reaction.reactionType
                  )
                    ? {
                        thumbsup: '👍',
                        heart: '❤️',
                        laughing: '😂',
                        thinking: '🤔',
                        fire: '🔥',
                        cool: '😎',
                      }[reaction.reactionType as any] || '👍'
                    : '👍'}
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {reaction.userName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// For use in sidebar or panel
import { Users } from "lucide-react";

export function ParticipantStatusSidebar({
  roomId,
  currentUserId,
  isRoomHost,
}: {
  roomId: string;
  currentUserId: string;
  isRoomHost: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-[16px] shadow-sm border border-slate-200 dark:border-slate-700 p-4">
      <ParticipantStatusPanel
        roomId={roomId}
        currentUserId={currentUserId}
        isRoomHost={isRoomHost}
      />
    </div>
  );
}
