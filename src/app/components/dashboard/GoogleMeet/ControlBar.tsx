/**
 * ControlBar — Bottom control bar, Google Meet-style
 * Circular icon buttons, tooltips, keyboard shortcut hints, leave button
 */

import { type ComponentType } from 'react';
import {
  Mic, MicOff,
  Video, VideoOff,
  Monitor, MonitorOff,
  Hand,
  MessageSquare,
  Users,
  Settings,
  PhoneOff,
  MoreHorizontal,
} from 'lucide-react';

interface ControlBarProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  unreadChatCount?: number;
  showChat?: boolean;
  showParticipants?: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onScreenShare: () => void;
  onRaiseHand: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onToggleSettings: () => void;
  onLeaveCall: () => void;
}

interface BtnProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  badge?: number;
  pressed?: boolean;
  disabled?: boolean;
}

function Btn({ icon: Icon, label, onClick, active, danger, badge, pressed, disabled }: BtnProps) {
  const base =
    'relative flex flex-col items-center gap-1.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8] rounded-xl';

  const btnCls = [
    'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-150',
    'focus-visible:outline-none',
    danger
      ? 'bg-[#ea4335] hover:bg-[#d93025] text-white shadow-lg shadow-red-900/30'
      : active || pressed
        ? 'bg-[#1a73e8] hover:bg-[#1765cc] text-white'
        : 'bg-[#3c4043] hover:bg-[#4a4d51] text-white',
    disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95',
  ].join(' ');

  return (
    <div className={base}>
      <button
        className={btnCls}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        aria-pressed={pressed}
        title={label}
      >
        <Icon className="w-5 h-5" />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#ea4335] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </button>
      <span className="text-[10px] text-white/50 group-hover:text-white/80 transition-colors hidden sm:block leading-none">
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
  showChat,
  showParticipants,
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
    <div
      className="fixed bottom-0 inset-x-0 z-50 bg-[#202124]/95 backdrop-blur-md border-t border-white/[0.06]"
      role="toolbar"
      aria-label="Meeting controls"
    >
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">

        {/* Left group — media */}
        <div className="flex items-end gap-3 sm:gap-4">
          <Btn
            icon={audioEnabled ? Mic : MicOff}
            label={audioEnabled ? 'Mute' : 'Unmute'}
            onClick={onToggleAudio}
            active={audioEnabled}
          />
          <Btn
            icon={videoEnabled ? Video : VideoOff}
            label={videoEnabled ? 'Stop video' : 'Start video'}
            onClick={onToggleVideo}
            active={videoEnabled}
          />
          <Btn
            icon={isScreenSharing ? MonitorOff : Monitor}
            label={isScreenSharing ? 'Stop sharing' : 'Present'}
            onClick={onScreenShare}
            pressed={isScreenSharing}
          />
        </div>

        {/* Center group — interactions */}
        <div className="flex items-end gap-3 sm:gap-4">
          <Btn
            icon={Hand}
            label={isHandRaised ? 'Lower hand' : 'Raise hand'}
            onClick={onRaiseHand}
            pressed={isHandRaised}
          />
          <Btn
            icon={MessageSquare}
            label="Chat"
            onClick={onToggleChat}
            pressed={showChat}
            badge={unreadChatCount}
          />
          <Btn
            icon={Users}
            label="People"
            onClick={onToggleParticipants}
            pressed={showParticipants}
          />
          <Btn
            icon={Settings}
            label="Settings"
            onClick={onToggleSettings}
          />
          <Btn
            icon={MoreHorizontal}
            label="More"
            onClick={() => {}}
          />
        </div>

        {/* Right — leave */}
        <div className="flex items-end">
          <Btn
            icon={PhoneOff}
            label="Leave"
            onClick={onLeaveCall}
            danger
          />
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="hidden md:flex justify-center pb-2 gap-4 text-[10px] text-white/25">
        <span>
          <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">M</kbd> mic
        </span>
        <span>
          <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">V</kbd> video
        </span>
        <span>
          <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">C</kbd> chat
        </span>
      </div>
    </div>
  );
}
