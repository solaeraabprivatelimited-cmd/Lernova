import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import imgEllipse1 from "figma:asset/798eac6e288222603807db12d070c52d1a145785.png";
import svgPaths from "../../../imports/svg-vn7uxip5s8";
import { JoiningRoomLoader } from "./JoiningRoomLoader";

interface JoinCustomRoomProps {
  onBack: () => void;
  onEnterRoom: (roomCodeOrLink: string) => void;
}

export function JoinCustomRoom({ onBack, onEnterRoom }: JoinCustomRoomProps) {
  const [roomInput, setRoomInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleEnterRoom = () => {
    if (roomInput.trim()) {
      setIsJoining(true);
      
      // Show loading for 3 seconds, then join room
      setTimeout(() => {
        onEnterRoom(roomInput.trim());
      }, 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && roomInput.trim()) {
      handleEnterRoom();
    }
  };

  // Show joining loader
  if (isJoining) {
    return <JoiningRoomLoader />;
  }

  return (
    <div className="bg-white h-screen w-full flex font-['Poppins']">
      {/* Sidebar */}
      <div className="bg-white w-[278px] shadow-[0px_4px_18px_-1px_rgba(0,0,0,0.1)] flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="flex items-center gap-2 px-8 pt-8 pb-6">
          <div className="w-[35px] h-[35px] relative">
            <svg viewBox="0 0 35 35" className="w-full h-full">
              <g>
                <path d={svgPaths.p3781200} fill="#003566" />
                <path d={svgPaths.p1c6f2500} stroke="#003566" strokeWidth="0.245515" fill="none" />
              </g>
              <g>
                <path d={svgPaths.p31318300} fill="#003566" />
                <path d={svgPaths.p275764f0} stroke="#003566" strokeWidth="0.23811" fill="none" />
              </g>
              <circle cx="17.5" cy="17.5" r="15.8594" stroke="#003566" strokeWidth="3.28125" fill="none" />
              <g clipPath="url(#clip0_join)">
                <path clipRule="evenodd" d={svgPaths.p2338ef00} fill="#F77F00" fillRule="evenodd" />
              </g>
              <g clipPath="url(#clip1_join)">
                <path clipRule="evenodd" d={svgPaths.p17aefc80} fill="#F77F00" fillRule="evenodd" />
              </g>
              <defs>
                <clipPath id="clip0_join">
                  <rect fill="white" height="10.5795" transform="translate(10.4914 20.704) rotate(-11.508)" width="10.5795" />
                </clipPath>
                <clipPath id="clip1_join">
                  <rect fill="white" height="10.2012" transform="translate(11.5055 10.7851) rotate(-11.508)" width="10.2012" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <span className="font-['Righteous'] text-[20.472px] text-[#003566]">Learnova</span>
        </div>

        {/* Main Menu */}
        <div className="px-8 flex flex-col gap-2">
          <p className="text-[14px] text-black/60 mb-2">Main Menu</p>
          
          <button className="bg-[#c9e5ff] h-[42px] rounded-[10px] flex items-center gap-2 px-4 text-left">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g clipPath="url(#clip0_4_117)">
                <path d={svgPaths.p12a85400} fill="#003566" />
              </g>
              <defs>
                <clipPath id="clip0_4_117">
                  <rect fill="white" height="20" width="20" />
                </clipPath>
              </defs>
            </svg>
            <span className="text-[14px] text-[#003566]">Study Rooms</span>
          </button>

          <button className="h-[42px] rounded-[10px] flex items-center gap-2 px-4 text-left hover:bg-gray-50 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d={svgPaths.p16a0cd00} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" />
            </svg>
            <span className="text-[14px] text-black/60">Mentor Support</span>
          </button>

          <button className="h-[42px] rounded-[10px] flex items-center gap-2 px-4 text-left hover:bg-gray-50 transition-colors">
            <div className="w-[24px] h-[24px] overflow-clip relative">
              <div className="absolute inset-[12.5%]">
                <div className="absolute inset-[-5.56%_-5.56%_-5.55%_-5.56%]">
                  <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                    <g>
                      <path d={svgPaths.p12587c80} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" />
                      <path d={svgPaths.p58ba980} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            <span className="text-[14px] text-black/60">Productivity Tools</span>
          </button>

          <button className="h-[42px] rounded-[10px] flex items-center gap-2 px-4 text-left hover:bg-gray-50 transition-colors">
            <svg width="21" height="22" viewBox="0 0 21 22" fill="none">
              <g clipPath="url(#clip0_4_104)">
                <path d={svgPaths.p2ab57600} fill="black" fillOpacity="0.6" />
              </g>
              <defs>
                <clipPath id="clip0_4_104">
                  <rect fill="white" height="22" width="21" />
                </clipPath>
              </defs>
            </svg>
            <span className="text-[14px] text-black/60">Emotional Wellness</span>
          </button>

          <button className="h-[42px] rounded-[10px] flex items-center gap-2 px-4 text-left hover:bg-gray-50 transition-colors">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d={svgPaths.p7213140} fill="black" fillOpacity="0.6" />
            </svg>
            <span className="text-[14px] text-black/60">Community</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-10 pt-8 pb-6">
          <div />
          <div className="flex items-center gap-4">
            <button className="w-[26px] h-[26px] flex items-center justify-center hover:opacity-70 transition-opacity">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 h-[42px]">
              <img src={imgEllipse1} alt="" className="w-[38px] h-[38px] rounded-full" />
              <p className="text-[16px] text-black">Jack Sparrow</p>
            </div>
          </div>
        </div>

        {/* Breadcrumb & Title */}
        <div className="px-20 pb-10">
          <button 
            onClick={onBack}
            className="text-[16px] text-black/70 mb-6 hover:text-black transition-colors"
          >
            &lt; Collaborative Mode
          </button>
          
          <div className="mb-12">
            <h1 className="text-[40px] font-medium text-black mb-1.5">Join Custom Room</h1>
            <p className="text-[14px] text-black/60">Enter a room code or shared link to join your session.</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-6 w-[467px]">
            <div className="flex flex-col gap-6">
              {/* Room Code / Link */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[16px] text-black">Room Code / Link</label>
                <div className="h-[39px] rounded-[10px] border border-black/40 flex items-center gap-2.5 px-2.5">
                  <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
                    <path d={svgPaths.p6efe00} fill="black" />
                    <path d={svgPaths.p1e94b00} fill="black" />
                  </svg>
                  <input
                    type="text"
                    value={roomInput}
                    onChange={(e) => setRoomInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter Room Code or Paste Room Link"
                    className="flex-1 outline-none text-[14px] text-black placeholder:text-black/60 bg-transparent"
                  />
                </div>
              </div>

              {/* Enter Room Button */}
              <div className="flex items-center w-[154px] ml-auto">
                <button
                  onClick={handleEnterRoom}
                  disabled={!roomInput.trim()}
                  className="flex-1 bg-[#003566] h-[42px] rounded-[20px] flex items-center justify-center hover:bg-[#002849] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span className="text-[14px] font-medium text-white">Enter Room</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
