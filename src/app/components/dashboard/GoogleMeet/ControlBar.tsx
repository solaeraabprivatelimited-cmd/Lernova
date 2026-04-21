/**
 * ControlBar - Primary interaction zone for media controls
 * Center-aligned with mic, camera, screen share, chat, participants, and leave buttons
 */

import React from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MessageCircle,
  Users,
  Hand,
  Phone,
  Settings,
} from 'lucide-react';

interface ControlBarProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  unreadChatCount?: number;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onScreenShare: () => void;
  onRaiseHand: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onToggleSettings: () => void;
  onLeaveCall: () => void;
}

/**
 * Control Button Component
 */
function ControlButton({
  icon: Icon,
  label,
  isActive = false,
  isDanger = false,
  onClick,
  badge,
  disabled = false,
}: {
  icon: React.ComponentType<{ className: string }>;
  label: string;
  isActive?: boolean;
  isDanger?: boolean;
  onClick: () => void;
  badge?: number;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
          isDanger
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : isActive
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={label}
        aria-label={label}
      >
        <Icon className="w-5 h-5" />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </button>
      <span className="text-xs text-black/70 dark:text-white/70 hidden sm:block">
        {label}
      </span>
    </div>
  );
}

export function ControlBar({
  audioEnabled,
  videoEnabled,
  isScreenSharing,
  isHandRaised,
  unreadChatCount = 0,
  onToggleAudio,
  onToggleVideo,
  onScreenShare,
  onRaiseHand,
  onToggleChat,
  onToggleParticipants,
  onToggleSettings,
  onLeaveCall,
}: ControlBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#202124] border-t border-black/5 dark:border-white/10 px-4 py-4 sm:py-6">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-4 sm:gap-6">
        {/* Left Group - Media Controls */}
        <div className="flex items-end gap-4 sm:gap-6">
          <ControlButton
            icon={audioEnabled ? Mic : MicOff}
            label={audioEnabled ? 'Mute' : 'Unmute'}
            isActive={audioEnabled}
            onClick={onToggleAudio}
          />

          <ControlButton
            icon={videoEnabled ? Video : VideoOff}
            label={videoEnabled ? 'Stop Video' : 'Start Video'}
            isActive={videoEnabled}
            onClick={onToggleVideo}
          />

          <ControlButton
            icon={Monitor}
            label="Share Screen"
            isActive={isScreenSharing}
            onClick={onScreenShare}
          />
        </div>

        {/* Right Group - Interaction Controls */}
        <div className="flex items-end gap-4 sm:gap-6">
          <ControlButton
            icon={Hand}
            label={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
            isActive={isHandRaised}
            onClick={onRaiseHand}
          />

          <ControlButton
            icon={MessageCircle}
            label="Chat"
            onClick={onToggleChat}
            badge={unreadChatCount}
          />

          <ControlButton
            icon={Users}
            label="Participants"
            onClick={onToggleParticipants}
          />

          <ControlButton
            icon={Settings}
            label="Settings"
            onClick={onToggleSettings}
          />
        </div>

        {/* Leave Call - Danger Zone */}
        <div className="flex items-end">
          <ControlButton
            icon={Phone}
            label="Leave"
            isDanger={true}
            onClick={onLeaveCall}
          />
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="text-center mt-3 text-xs text-black/50 dark:text-white/50 hidden md:block">
        <p>Tip: Press <kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">M</kbd> for mic, <kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">V</kbd> for video</p>
      </div>
    </div>
  );
}
