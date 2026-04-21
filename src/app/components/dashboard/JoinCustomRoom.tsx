import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import imgEllipse1 from "figma:asset/798eac6e288222603807db12d070c52d1a145785.png";
import svgPaths from "../../../imports/svg-vn7uxip5s8";

interface JoinCustomRoomProps {
  onBack: () => void;
  onEnterRoom: (roomCodeOrLink: string) => Promise<void>;
}

export function JoinCustomRoom({ onBack, onEnterRoom }: JoinCustomRoomProps) {
  const [roomInput, setRoomInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleEnterRoom = () => {
    if (roomInput.trim()) {
      setIsJoining(true);
      onEnterRoom(roomInput.trim()).finally(() => {
        setIsJoining(false);
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && roomInput.trim()) {
      handleEnterRoom();
    }
  };

  return (
    <>
      {/* Breadcrumb & Title */}
      <div className="px-4 xs:px-6 sm:px-8 lg:px-20 pb-6 sm:pb-10">
        <button 
          onClick={onBack}
          className="text-xs xs:text-sm sm:text-base text-black/70 dark:text-white/70 mb-4 sm:mb-6 hover:text-black dark:hover:text-white transition-colors"
        >
          &lt; Back
        </button>
          
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-medium text-black dark:text-white mb-1.5 sm:mb-2">Join Custom Room</h1>
          <p className="text-xs xs:text-sm text-black/60 dark:text-white/60">Paste a room code like STUDY-AB12CD or drop in the share link.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#1a1a2e] rounded-xl sm:rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-4 sm:p-6 w-full sm:w-[467px]">
          <div className="flex flex-col gap-6">
            {/* Room Code / Link */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs xs:text-sm md:text-base lg:text-[16px] text-black dark:text-white">Room Code / Link</label>
              <div className="h-9 xs:h-10 md:h-[39px] rounded-lg md:rounded-[10px] border border-black/40 dark:border-white/20 dark:bg-white/5 flex items-center gap-2.5 px-2.5">
                <svg width="24" height="24" viewBox="0 0 27 27" fill="none" className="xs:w-[27] xs:h-[27]">
                  <path d={svgPaths.p6efe00} fill="currentColor" className="text-black dark:text-white" />
                  <path d={svgPaths.p1e94b00} fill="currentColor" className="text-black dark:text-white" />
                </svg>
                <input
                  type="text"
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="STUDY-AB12CD"
                  className="flex-1 outline-none text-xs xs:text-sm md:text-base text-black dark:text-white placeholder:text-black/60 dark:placeholder:text-white/60 bg-transparent"
                />
              </div>
              <p className="text-xs text-black/60 dark:text-white/60">Study rooms support up to 20 live participants with end-to-end encrypted audio and video.</p>
            </div>

            {/* Enter Room Button */}
            <div className="flex items-center w-full xs:w-auto">
              <button
                onClick={handleEnterRoom}
                disabled={!roomInput.trim()}
                className="flex-1 xs:flex-none bg-[#003566] h-9 xs:h-10 md:h-[42px] px-4 xs:px-6 rounded-lg xs:rounded-[20px] flex items-center justify-center hover:bg-[#002849] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span className="text-xs xs:text-sm md:text-base font-medium text-white">Enter Room</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
