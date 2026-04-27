import React from 'react';
import { Bell } from 'lucide-react';
import imgEllipse1 from "figma:asset/798eac6e288222603807db12d070c52d1a145785.png";
import imgHourglass1 from "figma:asset/eb624bd5f3e1c42d82f6e9570de44aa3d2f7b4b1.png";
import svgPaths from "../../../imports/svg-lhcndldprh";
import { ElmOriginLogo } from "@/app/components/ElmOriginLogo";

export function JoiningRoomLoader() {
  return (
    <div className="bg-white h-screen w-full flex font-['Poppins']">
      {/* Sidebar */}
      <div className="bg-white w-[278px] shadow-[0px_4px_18px_-1px_rgba(0,0,0,0.1)] flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="flex items-center px-8 pt-8 pb-6">
          <ElmOriginLogo size={34} wordmarkSize={20} />
        </div>

        {/* Main Menu */}
        <div className="px-8 flex flex-col gap-2">
          <p className="text-[14px] text-black/60 mb-2">Main Menu</p>
          
          <div className="bg-[#c9e5ff] h-[42px] rounded-[10px] flex items-center gap-2 px-4">
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
          </div>

          <div className="h-[42px] rounded-[10px] flex items-center gap-2 px-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d={svgPaths.p16a0cd00} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" />
            </svg>
            <span className="text-[14px] text-black/60">Mentor Support</span>
          </div>

          <div className="h-[42px] rounded-[10px] flex items-center gap-2 px-4">
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
          </div>

          <div className="h-[42px] rounded-[10px] flex items-center gap-2 px-4">
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
          </div>

          <div className="h-[42px] rounded-[10px] flex items-center gap-2 px-4">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d={svgPaths.p7213140} fill="black" fillOpacity="0.6" />
            </svg>
            <span className="text-[14px] text-black/60">Community</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-end px-10 pt-8 pb-6">
          <div className="flex items-center gap-4">
            <button className="w-[26px] h-[26px] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 h-[42px]">
              <img src={imgEllipse1} alt="" className="w-[38px] h-[38px] rounded-full" />
              <p className="text-[16px] text-black">Jack Sparrow</p>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-1">
            <p className="text-[16px] font-medium text-black">Joining room.......Please wait</p>
            <img 
              src={imgHourglass1} 
              alt="Loading" 
              className="w-[39px] h-[39px] object-cover animate-pulse" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
