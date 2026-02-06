import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface PostReportNotificationProps {
  isVisible: boolean;
  participantName: string;
  onClose: () => void;
}

export function PostReportNotification({ isVisible, participantName, onClose }: PostReportNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-8 left-8 z-[60] animate-in slide-in-from-left-5 fade-in duration-300 font-['Poppins']">
      <div className="bg-white rounded-[12px] px-4 py-3 flex items-center gap-3 shadow-lg">
        {/* Text */}
        <p className="text-[14px] text-black">
          Successfully reported{' '}
          <span className="text-[#FF5E5E] font-medium">{participantName}</span>
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="size-5 flex items-center justify-center hover:opacity-70 transition-opacity shrink-0"
        >
          <X className="size-5 text-black" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
