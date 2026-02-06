import React, { useState } from 'react';
import { Monitor, Square, FileText, Upload, X } from 'lucide-react';

interface ScreenShareMenuProps {
  onScreenShareStart?: () => void;
  onScreenShareStop?: () => void;
  isSharing?: boolean;
}

export function ScreenShareMenu({ onScreenShareStart, onScreenShareStop, isSharing = false }: ScreenShareMenuProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleOptionClick = (option: 'screen' | 'window' | 'tab') => {
    console.log(`Screen sharing: ${option}`);
    setShowMenu(false);
    onScreenShareStart?.();
  };

  const handleStopSharing = () => {
    onScreenShareStop?.();
  };

  return (
    <div className="relative">
      {/* Screen Share Button */}
      {!isSharing ? (
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className={`${
            showMenu ? 'bg-[#4a4a4a]' : 'bg-[#3a3a3a] hover:bg-[#4a4a4a]'
          } rounded-full p-3 transition-colors`}
        >
          <Upload className="w-6 h-6 text-white" />
        </button>
      ) : (
        <button 
          onClick={handleStopSharing}
          className="bg-[#22c55e] hover:bg-[#16a34a] rounded-full p-3 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Menu Overlay */}
      {showMenu && !isSharing && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 bg-[#2a2a2a] rounded-[20px] p-4 flex flex-col gap-2 font-['Poppins'] z-50 min-w-[280px]">
            {/* Header */}
            <div className="px-3 py-2">
              <h3 className="text-[16px] font-medium text-white/70">Present</h3>
            </div>

            {/* Options */}
            <button
              onClick={() => handleOptionClick('screen')}
              className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 rounded-[15px] transition-colors text-left"
            >
              <div className="bg-white/10 rounded-[10px] p-2 flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <span className="text-[16px] text-white">Your Entire Screen</span>
            </button>

            <button
              onClick={() => handleOptionClick('window')}
              className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 rounded-[15px] transition-colors text-left"
            >
              <div className="bg-white/10 rounded-[10px] p-2 flex items-center justify-center">
                <Square className="w-5 h-5 text-white" />
              </div>
              <span className="text-[16px] text-white">A Window</span>
            </button>

            <button
              onClick={() => handleOptionClick('tab')}
              className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 rounded-[15px] transition-colors text-left"
            >
              <div className="bg-white/10 rounded-[10px] p-2 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-[16px] text-white">A Tab</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}