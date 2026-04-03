import React from 'react';

interface KickMemberModalProps {
  participantName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function KickMemberModal({ 
  participantName, 
  onCancel, 
  onConfirm 
}: KickMemberModalProps) {
  return (
    <>
      {/* Backdrop - lighter for admin overlay view */}
      <div 
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm rounded-[20px] w-[436px] p-6 font-['Poppins'] z-[70]">
        {/* Header and Message */}
        <div className="mb-7">
          <h2 className="text-[24px] font-semibold text-white mb-1.5">Kick Member</h2>
          <p className="text-[16px] text-white font-normal leading-normal">
            Are you sure you want to kick{' '}
            <span className="text-[18px] font-semibold">{participantName}</span>
            {' '}from this room
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-6">
          <button
            onClick={onCancel}
            className="flex-1 bg-transparent border border-white text-white rounded-[20px] h-[42px] text-[14px] font-normal hover:bg-white/5 transition-colors"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#ff5e5e] hover:bg-[#ff4c4c] text-white rounded-[20px] h-[42px] text-[14px] font-normal transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
    </>
  );
}