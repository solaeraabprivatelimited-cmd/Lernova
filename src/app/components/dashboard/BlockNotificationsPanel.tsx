import React from 'react';
import { X } from 'lucide-react';

interface BlockNotificationsPanelProps {
  onClose: () => void;
  isBlocked: boolean;
  onToggle: () => void;
}

export function BlockNotificationsPanel({ onClose, isBlocked, onToggle }: BlockNotificationsPanelProps) {
  return (
    <div className="absolute right-8 top-[62px] bg-black/40 backdrop-blur-lg rounded-[20px] w-[462px] h-[722px] p-8 flex flex-col gap-6 font-['Poppins'] overflow-y-auto z-[75]" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-[24px] font-medium text-white">Block Notifications</h2>
        <button
          onClick={onClose}
          type="button"
          className="w-[32px] h-[32px] flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer relative z-50"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-4">
        <p className="text-[16px] text-white/80 leading-relaxed">
          When enabled, all notifications from this study room will be silenced. You won't receive any audio or visual alerts during your session.
        </p>
      </div>

      {/* Toggle Button */}
      <div className="flex items-center justify-between bg-white/10 rounded-[20px] px-6 py-5">
        <span className="text-[18px] text-white">
          {isBlocked ? 'Notifications Blocked' : 'Block All Notifications'}
        </span>
        <button
          onClick={onToggle}
          className={`relative w-[60px] h-[32px] rounded-full transition-colors ${
            isBlocked ? 'bg-[#50fe00]' : 'bg-white/20'
          }`}
        >
          <div
            className={`absolute top-1 w-[24px] h-[24px] rounded-full bg-white transition-transform ${
              isBlocked ? 'translate-x-[32px]' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-3 flex-1">
        <h3 className="text-[18px] font-medium text-white">What gets blocked:</h3>
        <ul className="flex flex-col gap-2 text-[14px] text-white/70">
          <li className="flex items-start gap-2">
            <span className="text-white/50">•</span>
            <span>Chat messages and mentions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white/50">•</span>
            <span>Participant join/leave notifications</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white/50">•</span>
            <span>Reaction notifications</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white/50">•</span>
            <span>Screen sharing alerts</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white/50">•</span>
            <span>Timer completion alerts</span>
          </li>
        </ul>

        <div className="mt-4 bg-[#689A50]/20 border border-[#689A50]/40 rounded-[15px] px-4 py-3">
          <p className="text-[13px] text-white/80">
            <span className="font-medium">Note:</span> Focus Timer notifications will still appear but without sound. You can close this panel and notifications will remain blocked.
          </p>
        </div>
      </div>
    </div>
  );
}
