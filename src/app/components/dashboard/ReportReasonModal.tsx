import React, { useState } from 'react';

interface ReportReasonModalProps {
  participantId: number;
  participantName: string;
  onCancel: () => void;
  onSubmit: (reason: string, description: string) => void;
  isAdmin?: boolean;
  mode?: 'collaborative' | 'live'; // Add mode prop
}

export function ReportReasonModal({ 
  participantId,
  participantName, 
  onCancel, 
  onSubmit,
  isAdmin = false,
  mode = 'collaborative'
}: ReportReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('inappropriate');
  const [description, setDescription] = useState('');

  const reasons = [
    { id: 'inappropriate', label: 'Inappropriate visuals or gestures' },
    { id: 'disturbing', label: 'Camera showing disturbing or distracting content' },
    { id: 'misleading', label: 'Using unrelated or misleading video feed' },
    { id: 'other', label: 'Other' },
  ];

  const handleSubmit = () => {
    onSubmit(selectedReason, description);
  };

  return (
    <>
      {/* Backdrop - different transparency based on mode */}
      <div 
        className={`fixed inset-0 z-[60] ${
          mode === 'live' 
            ? 'bg-black/40' 
            : isAdmin ? 'bg-black/50' : 'bg-black/60'
        }`}
        onClick={onCancel}
      />

      {/* Modal */}
      <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[20px] font-['Poppins'] z-[70] ${
        mode === 'live'
          ? 'bg-white/10 backdrop-blur-md w-[436px] p-6'
          : 'bg-[#2a2a2a]/95 backdrop-blur-sm w-[420px] p-8'
      }`}>
        {/* Header */}
        <div className={mode === 'live' ? 'mb-[26px]' : 'mb-6'}>
          <h2 className={`font-semibold text-white ${
            mode === 'live' ? 'text-[16px] mb-[6px]' : 'text-[24px] mb-2'
          }`}>
            Report User
          </h2>
          <p className={`text-white leading-relaxed ${
            mode === 'live' ? 'text-[12px] opacity-80' : 'text-[14px] opacity-70'
          }`}>
            Help us maintain a {mode === 'live' ? 'clam' : 'calm'} and distraction-free study environment
          </p>
        </div>

        {/* Reason Options */}
        <div className={`space-y-[15px] ${mode === 'live' ? 'mb-[26px]' : 'mb-6'}`}>
          {reasons.map((reason) => (
            <label
              key={reason.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                {/* Radio Button */}
                <input
                  type="radio"
                  name="reason"
                  value={reason.id}
                  checked={selectedReason === reason.id}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="sr-only"
                />
                {mode === 'live' ? (
                  // Live Mode: Custom SVG-style radio button
                  <div className="w-[18px] h-[18px] rounded-full relative flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 18 18">
                      <circle cx="9" cy="9" r="9" fill="#D9D9D9" />
                      {selectedReason === reason.id && (
                        <circle cx="9" cy="9" r="4" fill="#003566" />
                      )}
                    </svg>
                  </div>
                ) : (
                  // Collaborative Mode: Original radio button
                  <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                    selectedReason === reason.id
                      ? 'border-[#ff6b6b] bg-transparent'
                      : 'border-white/40 bg-transparent'
                  }`}>
                    {selectedReason === reason.id && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#ff6b6b]" />
                    )}
                  </div>
                )}
              </div>
              <span className={`transition-colors ${
                mode === 'live'
                  ? 'text-[14px] text-white font-normal'
                  : selectedReason === reason.id
                    ? 'text-[14px] text-white font-medium'
                    : 'text-[14px] text-white/80 font-normal'
              }`}>
                {reason.label}
              </span>
            </label>
          ))}
        </div>

        {/* Description Text Area */}
        <div className={mode === 'live' ? 'mb-[26px]' : 'mb-6'}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue briefly"
            className={`w-full resize-none focus:outline-none transition-colors ${
              mode === 'live'
                ? 'h-[127px] bg-[#d9d9d9] border-0 rounded-[20px] px-4 py-4 text-[12px] text-black/70 placeholder:text-black/70'
                : 'h-[100px] bg-white/10 border border-white/20 rounded-[15px] px-4 py-3 text-[14px] text-white placeholder:text-white/40 focus:border-white/40'
            }`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onCancel}
            className={`transition-colors ${
              mode === 'live'
                ? 'w-[156px] h-[42px] bg-transparent border border-white text-white rounded-[20px] text-[14px] font-normal hover:bg-white/10'
                : 'flex-1 bg-transparent border border-white/30 text-white rounded-full py-3 text-[16px] font-medium hover:bg-white/5'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`transition-colors ${
              mode === 'live'
                ? 'w-[156px] h-[42px] bg-[#ff5e5e] hover:bg-[#ff4545] text-white rounded-[20px] text-[14px] font-normal shadow-lg'
                : 'flex-1 bg-[#ff6b6b] hover:bg-[#ff5252] text-white rounded-full py-3 text-[16px] font-semibold shadow-lg shadow-[#ff6b6b]/20'
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}