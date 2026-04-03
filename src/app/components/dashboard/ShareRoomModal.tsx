import React from 'react';
import svgPaths from "../../../imports/svg-kcct7ihsaj";

interface ShareRoomModalProps {
  roomName: string;
  roomCode: string;
  onClose: () => void;
}

export function ShareRoomModal({ roomName, roomCode, onClose }: ShareRoomModalProps) {
  const joinLink = `learnova.com/room/${roomCode}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(joinLink);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed left-1/2 top-[273px] -translate-x-1/2 translate-x-[123.5px] z-50 bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-2.5">
        {/* Header */}
        <div className="flex items-start justify-between w-[467px]">
          <h2 className="text-[24px] font-medium text-black">Share Your Room</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <div className="w-8 h-8 overflow-clip relative">
              <div className="absolute inset-[8.33%]">
                <div className="absolute inset-[-3.75%]">
                  <svg className="block size-full" fill="none" viewBox="0 0 28.6667 28.6667">
                    <g>
                      <path d={svgPaths.p1fd3cb00} stroke="#FF6969" strokeLinejoin="round" strokeWidth="2" />
                      <path d={svgPaths.p89d1180} stroke="#FF6969" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-6 w-[467px]">
          {/* Room Name */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[16px] text-black">Room Name</label>
            <div className="h-[39px] rounded-[10px] border border-black/40 flex items-center gap-2.5 px-2.5">
              <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
                <path d={svgPaths.p6efe00} fill="black" />
                <path d={svgPaths.p1e94b00} fill="black" />
              </svg>
              <p className="text-[14px] text-black">{roomName}</p>
            </div>
          </div>

          {/* Room Code */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[16px] text-black">Room Code</label>
            <div className="h-[39px] rounded-[10px] border border-black/40 flex items-center gap-2.5 px-2.5">
              <div className="w-[20px] h-[20px] overflow-clip relative">
                <div className="absolute inset-[3.83%_3.74%_3.82%_3.73%]">
                  <div className="absolute inset-[-4.06%_-4.05%_-4.05%_-4.05%]">
                    <svg className="block size-full" fill="none" viewBox="0 0 20.0064 19.9685">
                      <g>
                        <path d={svgPaths.p13b8b400} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                        <path d={svgPaths.p2cf36200} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                        <path d={svgPaths.p267f9b00} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-[14px] font-medium text-black">{roomCode}</p>
            </div>
          </div>

          {/* Join Link */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[16px] text-black">Join Link</label>
            <div className="h-[39px] rounded-[10px] border border-black/40 flex items-center gap-2.5 px-2.5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d={svgPaths.p1ef1e900} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <p className="text-[14px] font-medium text-[#003566]">{joinLink}</p>
            </div>
          </div>

          {/* Copy Link Button */}
          <div className="flex items-center w-[149px] ml-auto">
            <button
              onClick={handleCopyLink}
              className="flex-1 bg-[#003566] h-[42px] rounded-[20px] flex items-center justify-center hover:bg-[#002849] transition-colors"
            >
              <span className="text-[14px] font-medium text-white">Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
