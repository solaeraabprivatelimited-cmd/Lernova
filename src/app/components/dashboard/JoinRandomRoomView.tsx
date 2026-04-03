import React, { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import imgEllipse1 from "figma:asset/798eac6e288222603807db12d070c52d1a145785.png";
import svgPaths from "../../../imports/svg-h22dxe978i";
import { JoiningRoomLoader } from "./JoiningRoomLoader";

interface JoinRandomRoomViewProps {
  onBack: () => void;
  onJoinRoom: (roomId: string, roomName: string, subject: string) => void;
}

interface Room {
  id: string;
  name: string;
  subject: string;
  roomId: string;
}

const availableRooms: Room[] = [
  { id: '1', name: 'NEET Room', subject: 'NEET', roomId: '2456' },
  { id: '2', name: 'IELTS Room', subject: 'IELTS (English)', roomId: '2456' },
  { id: '3', name: 'Social Room', subject: 'Social', roomId: '2456' },
  { id: '4', name: 'EAMCET Room', subject: 'EAMCET', roomId: '2456' },
  { id: '5', name: 'French Room', subject: 'French', roomId: '2456' },
  { id: '6', name: 'Java Room', subject: 'Java', roomId: '2456' },
];

export function JoinRandomRoomView({ onBack, onJoinRoom }: JoinRandomRoomViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const filteredRooms = availableRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinRoom = (room: Room) => {
    setIsJoining(true);
    
    // Show loading for 3 seconds, then join room
    setTimeout(() => {
      onJoinRoom(room.roomId, room.name, room.subject);
    }, 3000);
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
              <g clipPath="url(#clip0_random)">
                <path clipRule="evenodd" d={svgPaths.p2338ef00} fill="#F77F00" fillRule="evenodd" />
              </g>
              <g clipPath="url(#clip1_random)">
                <path clipRule="evenodd" d={svgPaths.p17aefc80} fill="#F77F00" fillRule="evenodd" />
              </g>
              <defs>
                <clipPath id="clip0_random">
                  <rect fill="white" height="10.5795" transform="translate(10.4914 20.704) rotate(-11.508)" width="10.5795" />
                </clipPath>
                <clipPath id="clip1_random">
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

        {/* Content */}
        <div className="px-20 pb-10">
          {/* Breadcrumb */}
          <button 
            onClick={onBack}
            className="text-[16px] text-black/70 mb-6 hover:text-black transition-colors"
          >
            &lt; Collaborative Mode
          </button>

          {/* Title */}
          <div className="mb-10">
            <h1 className="text-[40px] font-medium text-black mb-1.5">Join Random Room</h1>
            <p className="text-[14px] text-black/60">Join an open study room and start learning instantly.</p>
          </div>

          {/* Search Bar */}
          <div className="bg-black/10 rounded-[20px] h-[42px] flex items-center gap-3 px-6 mb-[66px]">
            <Search className="w-6 h-6 text-black/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find study rooms by subject or topic."
              className="flex-1 outline-none text-[16px] text-black placeholder:text-black/60 bg-transparent"
            />
          </div>

          {/* Room Cards Grid */}
          <div className="grid grid-cols-3 gap-9 max-w-[1060px]">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-8 flex flex-col items-end"
              >
                <h3 className="text-[24px] font-medium text-black w-full mb-2.5">{room.name}</h3>
                <p className="text-[16px] text-black/70 w-full mb-2.5">Subject: {room.subject}</p>
                <p className="text-[16px] text-black/70 w-full mb-2.5">Room ID: {room.roomId}</p>
                <button
                  onClick={() => handleJoinRoom(room)}
                  className="border border-[#003566] rounded-[20px] h-[42px] px-6 flex items-center justify-center hover:bg-[#003566] hover:text-white transition-all group"
                >
                  <span className="text-[14px] font-medium text-[#003566] group-hover:text-white">Join Room</span>
                </button>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredRooms.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[16px] text-black/60">No rooms found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}