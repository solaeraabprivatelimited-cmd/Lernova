import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import imgImage17 from "figma:asset/1dab6d19afb3878b8ebec0d7a0fc2a196c946a7c.png";
import imgImage18 from "figma:asset/4c03b875da24497740f219b6c1322d1ce76023cb.png";
import imgImage19 from "figma:asset/97aed589e8ee3b4f317112befff4385af448de2f.png";
import imgEllipse1 from "figma:asset/798eac6e288222603807db12d070c52d1a145785.png";
import { CreateCustomRoom } from "./CreateCustomRoom";
import { JoinCustomRoom } from "./JoinCustomRoom";
import { JoinRandomRoomView } from "./JoinRandomRoomView";
import { CollaborativeModeRoom } from "./CollaborativeModeRoom";

interface CollaborativeModeViewProps {
  onCreateRoom?: () => void;
  onJoinRoom?: () => void;
  onJoinRandomRoom?: () => void;
  onLeave: () => void;
}

interface RoomData {
  roomName: string;
  subject: string;
  roomType: 'private' | 'public';
  roomId: string;
}

type ViewType = 'selection' | 'create-room' | 'join-room' | 'join-random' | 'in-room';

export function CollaborativeModeView({ 
  onCreateRoom, 
  onJoinRoom, 
  onJoinRandomRoom,
  onLeave 
}: CollaborativeModeViewProps) {
  const [view, setView] = useState<ViewType>('selection');
  const [currentRoom, setCurrentRoom] = useState<RoomData | null>(null);

  const handleLaunchRoom = (roomData: RoomData) => {
    console.log('Launching room:', roomData);
    setCurrentRoom(roomData);
    setView('in-room');
  };

  const handleEnterRoom = (roomIdOrLink: string) => {
    console.log('Entering room:', roomIdOrLink);
    // Create room data from the ID/link
    setCurrentRoom({
      roomName: 'Custom Room',
      subject: 'General',
      roomType: 'private',
      roomId: roomIdOrLink
    });
    setView('in-room');
  };

  const handleJoinRandomRoom = (roomId: string, roomName: string, subject: string) => {
    console.log('Joining random room:', { roomId, roomName, subject });
    setCurrentRoom({
      roomName,
      subject,
      roomType: 'public',
      roomId
    });
    setView('in-room');
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setView('selection');
  };

  if (view === 'in-room' && currentRoom) {
    return (
      <CollaborativeModeRoom
        roomName={currentRoom.roomName}
        roomId={currentRoom.roomId}
        subject={currentRoom.subject}
        onLeaveRoom={handleLeaveRoom}
      />
    );
  }

  if (view === 'create-room') {
    return (
      <CreateCustomRoom 
        onBack={() => setView('selection')}
        onLaunchRoom={handleLaunchRoom}
      />
    );
  }

  if (view === 'join-room') {
    return (
      <JoinCustomRoom 
        onBack={() => setView('selection')}
        onEnterRoom={handleEnterRoom}
      />
    );
  }

  if (view === 'join-random') {
    return (
      <JoinRandomRoomView 
        onBack={() => setView('selection')}
        onJoinRoom={handleJoinRandomRoom}
      />
    );
  }

  return (
    <div className="bg-white h-screen w-full flex font-['Poppins']">
      {/* Sidebar */}
      <div className="bg-white w-[278px] shadow-[0px_4px_18px_-1px_rgba(0,0,0,0.1)] flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="flex items-center gap-2 px-8 pt-8 pb-6">
          <div className="w-[35px] h-[35px] relative">
            <div className="absolute inset-0 rounded-full border-[3.28px] border-[#003566]" />
            <div className="absolute top-[4px] left-[4px] w-[27px] h-[27px]">
              <svg viewBox="0 0 35 35" className="w-full h-full">
                <circle cx="13.5" cy="13.5" r="3" fill="#F77F00" />
                <circle cx="13.5" cy="21.5" r="3" fill="#F77F00" />
              </svg>
            </div>
          </div>
          <span className="font-['Righteous'] text-[20.472px] text-[#003566]">Learnova</span>
        </div>

        {/* Main Menu */}
        <div className="px-8 flex flex-col gap-2">
          <p className="text-[14px] text-black/60 mb-2">Main Menu</p>
          
          <button className="bg-[#c9e5ff] h-[42px] rounded-[10px] flex items-center gap-2 px-4 text-left">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="8" width="7" height="7" fill="#003566"/>
              <rect x="11" y="8" width="7" height="7" fill="#003566"/>
              <rect x="2" y="2" width="16" height="4" fill="#003566"/>
            </svg>
            <span className="text-[14px] text-[#003566]">Study Rooms</span>
          </button>

          <button className="h-[42px] rounded-[10px] flex items-center gap-2 px-4 text-left hover:bg-gray-50 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 14L12 18M6 10L6 18M18 10L18 18M4 6L20 6M3 22L21 22M6 6L6 4C6 3.44772 6.44772 3 7 3L17 3C17.5523 3 18 3.44772 18 4L18 6" stroke="black" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[14px] text-black/60">Mentor Support</span>
          </button>

          <button className="h-[42px] rounded-[10px] flex items-center gap-2 px-4 text-left hover:bg-gray-50 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14.7 6.3C15.1 5.9 15.1 5.3 14.7 4.9C14.3 4.5 13.7 4.5 13.3 4.9L8.7 9.3C8.3 9.7 8.3 10.3 8.7 10.7L13.3 15.1C13.7 15.5 14.3 15.5 14.7 15.1C15.1 14.7 15.1 14.1 14.7 13.7L11.4 10L14.7 6.3Z" fill="black" fillOpacity="0.6"/>
              <path d="M8 3L16 3C17.1 3 18 3.9 18 5L18 19C18 20.1 17.1 21 16 21L8 21C6.9 21 6 20.1 6 19L6 5C6 3.9 6.9 3 8 3Z" stroke="black" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[14px] text-black/60">Productivity Tools</span>
          </button>

          <button className="h-[42px] rounded-[10px] flex items-center gap-2 px-4 text-left hover:bg-gray-50 transition-colors">
            <svg width="22" height="22" viewBox="0 0 21 22" fill="none">
              <circle cx="10.5" cy="11" r="9" stroke="black" strokeOpacity="0.6" strokeWidth="1.5"/>
              <path d="M7 9C7.5 8 8.5 7.5 10.5 7.5C12.5 7.5 13.5 8 14 9" stroke="black" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6 14C7 16 9 17 10.5 17C12 17 14 16 15 14" stroke="black" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[14px] text-black/60">Emotional Wellness</span>
          </button>

          <button className="h-[42px] rounded-[10px] flex items-center gap-2 px-4 text-left hover:bg-gray-50 transition-colors">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 11C12.933 11 14.5 9.433 14.5 7.5C14.5 5.567 12.933 4 11 4C9.067 4 7.5 5.567 7.5 7.5C7.5 9.433 9.067 11 11 11Z" stroke="black" strokeOpacity="0.6" strokeWidth="1.5"/>
              <path d="M5 18C5 15.239 7.239 13 10 13H12C14.761 13 17 15.239 17 18" stroke="black" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round"/>
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
            onClick={onLeave}
            className="text-[16px] text-black/70 mb-6 hover:text-black transition-colors"
          >
            &lt; Study Rooms
          </button>
          
          <div className="mb-12">
            <h1 className="text-[40px] font-medium text-black mb-1.5">Collaborative Mode</h1>
            <p className="text-[14px] text-black/60">Select a room type that fits your study style.</p>
          </div>

          {/* Room Cards */}
          <div className="flex gap-8 flex-wrap">
            {/* Create Custom Room */}
            <div className="bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-8 w-[327px]">
              <div className="flex flex-col gap-5">
                <div className="bg-[#e0e0e0] h-[187px] rounded-[20px] overflow-hidden relative">
                  <img 
                    src={imgImage17} 
                    alt="Create Custom Room" 
                    className="absolute w-[288px] h-[288px] object-cover left-[-13px] top-[-71px]"
                  />
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-[24px] font-medium text-black">Create Custom Room</h3>
                  <p className="text-[16px] text-black/70 leading-relaxed h-[103px]">
                    Start a focused group for any subject. Set a topic, share the link, and invite your peers to collaborate in real time.
                  </p>
                  <button
                    onClick={() => setView('create-room')}
                    className="bg-[#502616] hover:bg-[#402010] active:scale-95 h-[42px] rounded-[20px] text-[14px] font-medium text-white transition-all mt-2.5"
                  >
                    Create Custom Room
                  </button>
                </div>
              </div>
            </div>

            {/* Join Custom Room */}
            <div className="bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-8 w-[327px]">
              <div className="flex flex-col gap-2.5">
                <div className="bg-[#e0e0e0] h-[187px] rounded-[20px] overflow-hidden relative">
                  <img 
                    src={imgImage18} 
                    alt="Join Custom Room" 
                    className="absolute w-[281px] h-[281px] object-cover left-[-10px] top-[-49px]"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-[24px] font-medium text-black">Join Custom Room</h3>
                  <p className="text-[16px] text-black/70 leading-relaxed h-[103px]">
                    Enter a room ID shared by a friend or mentor to join their study session instantly.
                  </p>
                  <button
                    onClick={() => setView('join-room')}
                    className="bg-[#303c70] hover:bg-[#252e5a] active:scale-95 h-[42px] rounded-[20px] text-[14px] font-medium text-white transition-all w-[179px]"
                  >
                    Join Custom Room
                  </button>
                </div>
              </div>
            </div>

            {/* Join Random Room */}
            <div className="bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-8 w-[327px]">
              <div className="flex flex-col gap-5">
                <div className="bg-[#e0e0e0] h-[187px] rounded-[20px] overflow-hidden relative">
                  <img 
                    src={imgImage19} 
                    alt="Join Random Room" 
                    className="absolute w-[263px] h-[263px] object-cover left-0 top-[-38px]"
                  />
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-[24px] font-medium text-black">Join Random Room</h3>
                  <p className="text-[16px] text-black/70 leading-relaxed h-[103px]">
                    Discover active study rooms, connect with motivated learners, and grow through collective learning experiences.
                  </p>
                  <button
                    onClick={() => setView('join-random')}
                    className="bg-[#08091b] hover:bg-[#050610] active:scale-95 h-[42px] rounded-[20px] text-[14px] font-medium text-white transition-all w-[200px]"
                  >
                    Join Random Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}