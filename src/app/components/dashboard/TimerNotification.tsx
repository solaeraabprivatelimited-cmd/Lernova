import React from 'react';
import svgPaths from "../../../imports/svg-53gmi7yc3w";
import { X } from 'lucide-react';

interface TimerNotificationProps {
  visible: boolean;
  name: string;
  duration: string;
  onClose: () => void;
}

export function TimerNotification({ visible, name, duration, onClose }: TimerNotificationProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-[140px] right-8 z-40 animate-in slide-in-from-right-5 fade-in duration-300">
      <div className="bg-[rgba(20,19,22,0.2)] backdrop-blur-lg rounded-[20px] px-8 py-4 flex items-center gap-6">
        {/* Timer Icon with Green Background */}
        <div className="h-[78px] w-[75px] shrink-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 75 78">
            <rect fill="#689A50" height="78" rx="20" width="75" />
            <path d={svgPaths.pa6f2100} fill="white" />
          </svg>
        </div>

        {/* Timer Info */}
        <div className="flex flex-col items-start justify-center text-white">
          <p className="text-[24px] font-['Poppins'] whitespace-nowrap">{name}</p>
          <p className="text-[16px] font-['Poppins'] font-light text-white/80">{duration}</p>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          <X className="size-6 text-white" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}