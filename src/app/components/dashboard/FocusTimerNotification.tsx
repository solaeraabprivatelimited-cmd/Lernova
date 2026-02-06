import React from 'react';
import { X, Check } from 'lucide-react';

interface FocusTimerNotificationProps {
  timerName: string;
  duration: string;
  onDismiss: () => void;
}

export function FocusTimerNotification({ timerName, duration, onDismiss }: FocusTimerNotificationProps) {
  return (
    <div className="absolute right-[32px] top-[579px] bg-[rgba(20,19,22,0.2)] backdrop-blur-md rounded-[20px] pl-8 pr-6 py-4 flex items-center gap-6 font-['Poppins'] z-50 animate-slide-in-right">
      {/* Green Checkmark Icon */}
      <div className="bg-[#689A50] rounded-[20px] w-[75px] h-[78px] flex items-center justify-center shrink-0">
        <Check className="w-12 h-12 text-white stroke-[3]" />
      </div>

      {/* Timer Info */}
      <div className="flex flex-col justify-center">
        <p className="text-[24px] text-white font-normal leading-normal">{timerName}</p>
        <p className="text-[16px] text-white font-light leading-normal">{duration}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={onDismiss}
        className="text-white hover:opacity-70 transition-opacity shrink-0"
      >
        <X className="w-6 h-6 stroke-[2]" />
      </button>
    </div>
  );
}