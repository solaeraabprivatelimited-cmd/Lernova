import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface ReportSuccessNotificationProps {
  onClose: () => void;
}

export function ReportSuccessNotification({ onClose }: ReportSuccessNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-[#2a2a2a]/95 backdrop-blur-sm rounded-full px-6 py-4 flex items-center gap-3 shadow-2xl z-[80] font-['Poppins'] animate-in fade-in slide-in-from-top-4 duration-300">
      <CheckCircle className="w-5 h-5 text-green-400" />
      <p className="text-[14px] text-white font-medium">
        Report submitted successfully
      </p>
    </div>
  );
}
