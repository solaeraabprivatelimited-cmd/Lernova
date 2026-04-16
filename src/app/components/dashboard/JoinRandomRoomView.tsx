import { getCurrentUser } from '@/app/lib/api';
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
  { id: '1', name: 'NEET Room', subject: 'NEET', roomId: 'NEET-7K9M2' },
  { id: '2', name: 'IELTS Room', subject: 'IELTS (English)', roomId: 'IELTS-3B4N7' },
  { id: '3', name: 'Social Room', subject: 'Social', roomId: 'SOCIAL-5P8Q1' },
  { id: '4', name: 'EAMCET Room', subject: 'EAMCET', roomId: 'EAMCET-9X2W6' },
  { id: '5', name: 'French Room', subject: 'French', roomId: 'FRENCH-4L6V3' },
  { id: '6', name: 'Java Room', subject: 'Java', roomId: 'JAVA-8T5S0' },
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
    <>
      {/* Content */}
      <div className="px-4 xs:px-6 sm:px-8 lg:px-20 pb-6 sm:pb-10">
        {/* Breadcrumb */}
        <button 
          onClick={onBack}
          className="text-xs xs:text-sm sm:text-base text-black/70 dark:text-white/70 mb-4 sm:mb-6 hover:text-black dark:hover:text-white transition-colors"
        >
          &lt; Back
        </button>

        {/* Title */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-medium text-black dark:text-white mb-1.5 sm:mb-2">Join Random Room</h1>
          <p className="text-xs xs:text-sm text-black/60 dark:text-white/60">Join an open study room and start learning instantly.</p>
        </div>

        {/* Search Bar */}
        <div className="bg-black/10 dark:bg-white/10 rounded-lg sm:rounded-[20px] h-10 sm:h-[42px] flex items-center gap-2 sm:gap-3 px-3 sm:px-6 mb-6 sm:mb-12 lg:mb-16">
          <Search className="w-4 sm:w-6 h-4 sm:h-6 text-black/60 dark:text-white/60 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find study rooms by subject or topic."
            className="flex-1 outline-none text-xs sm:text-base text-black dark:text-white placeholder:text-black/60 dark:placeholder:text-white/60 bg-transparent"
          />
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-9 max-w-[1060px]">
          {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white dark:bg-[#1a1a2e] rounded-lg sm:rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] dark:shadow-[0px_4px_50px_5px_rgba(0,0,0,0.3)] p-4 sm:p-6 lg:p-8 flex flex-col items-start sm:items-end"
              >
                <h3 className="text-lg sm:text-xl lg:text-[24px] font-medium text-black dark:text-white w-full mb-2">{room.name}</h3>
                <p className="text-xs sm:text-sm lg:text-base text-black/70 dark:text-white/70 w-full mb-2">Subject: {room.subject}</p>
                <p className="text-xs sm:text-sm lg:text-base text-black/70 dark:text-white/70 w-full mb-3 sm:mb-2.5">Room ID: {room.roomId}</p>
                <button
                  onClick={() => handleJoinRoom(room)}
                  className="border border-[#003566] dark:border-[#00d4ff] rounded-lg sm:rounded-[20px] h-9 sm:h-[42px] px-4 sm:px-6 flex items-center justify-center hover:bg-[#003566] dark:hover:bg-[#00d4ff] hover:text-white dark:hover:text-black transition-all group w-full sm:w-auto"
                >
                  <span className="text-xs sm:text-sm font-medium text-[#003566] dark:text-[#00d4ff] group-hover:text-white dark:group-hover:text-black">Join Room</span>
                </button>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredRooms.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[16px] text-black/60 dark:text-white/60">No rooms found matching your search.</p>
            </div>
          )}
        </div>
      </>
    );
  }