import React, { Suspense, useState } from 'react';
import { Bell, Plus, Users, Zap } from 'lucide-react';
import imgImage17 from "figma:asset/1dab6d19afb3878b8ebec0d7a0fc2a196c946a7c.png";
import imgImage18 from "figma:asset/4c03b875da24497740f219b6c1322d1ce76023cb.png";
import imgImage19 from "figma:asset/97aed589e8ee3b4f317112befff4385af448de2f.png";
import imgEllipse1 from "figma:asset/798eac6e288222603807db12d070c52d1a145785.png";
import { roomAPI } from "@/utils/api/roomAPI";
import { RouteLoader } from "@/app/components/RouteLoader";
import { CreateCustomRoom } from "./CreateCustomRoom";
import { JoinCustomRoom } from "./JoinCustomRoom";
import { JoinRandomRoomView } from "./JoinRandomRoomView";

const CollaborativeModeRoomGoogleMeet = React.lazy(async () => {
  const module = await import("./GoogleMeet/CollaborativeModeRoomGoogleMeet");
  return { default: module.CollaborativeModeRoomGoogleMeet };
});

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
  roomCode?: string;
  maxParticipants?: number;
}

type ViewType = 'selection' | 'create-room' | 'join-room' | 'join-random' | 'in-room';

export function CollaborativeModeView({}: CollaborativeModeViewProps) {
  const [view, setView] = useState<ViewType>('selection');
  const [currentRoom, setCurrentRoom] = useState<RoomData | null>(null);

  const handleLaunchRoom = (roomData: RoomData) => {
    setCurrentRoom(roomData);
    setView('in-room');
  };

  const handleEnterRoom = async (roomCodeOrLink: string) => {
    try {
      const room = await roomAPI.getRoom(roomCodeOrLink);
      setCurrentRoom({
        roomName: room.name,
        subject: room.subject || 'General',
        roomType: 'private',
        roomId: room.id,
        roomCode: room.code,
        maxParticipants: room.max_participants,
      });
      setView('in-room');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to join room';
      alert(message);
    }
  };

  const handleJoinRandomRoom = (roomId: string, roomName: string, subject: string) => {
    setCurrentRoom({
      roomName,
      subject,
      roomType: 'public',
      roomId,
      maxParticipants: 20,
    });
    setView('in-room');
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setView('selection');
  };

  // Modern navbar component
  const TopNavbar = () => (
    <div className="bg-white dark:bg-[#1a1a2e] border-b border-black/10 dark:border-white/10 sticky top-0 z-40">
      <div className="flex items-center justify-between px-3 xs:px-4 sm:px-6 h-14 sm:h-16">
        {/* Left: Logo & Branding (clickable) */}
        <button
          className="flex items-center gap-1.5 xs:gap-2 min-w-0 focus:outline-none"
          onClick={() => window.location.assign('/dashboard')}
          title="Go to Dashboard"
        >
          <div className="w-7 xs:w-8 h-7 xs:h-8 rounded-full border-2 border-[#003566] flex items-center justify-center bg-gradient-to-br from-[#003566] to-[#F77F00] shrink-0">
            <span className="text-white font-bold text-xs">L</span>
          </div>
          <p className="font-['Righteous'] text-sm xs:text-base text-[#003566] dark:text-[#00d4ff] truncate">Elm Orbit</p>
        </button>

        {/* Center: Simple status */}
        {view !== 'in-room' && (
          <div className="text-xs xs:text-sm text-black/60 dark:text-white/60 hidden sm:block">
            {view === 'selection' && 'Browse Rooms'}
            {view === 'create-room' && 'Create Room'}
            {view === 'join-room' && 'Join Custom Room'}
            {view === 'join-random' && 'Join Random Room'}
          </div>
        )}

        {/* Right: Notification & Profile */}
        <div className="flex items-center gap-3 xs:gap-4 shrink-0">
          <button className="relative p-1.5 xs:p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors">
            <Bell className="w-4 xs:w-5 h-4 xs:h-5 text-black dark:text-white" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={imgEllipse1} alt="Profile" className="w-6 xs:w-8 h-6 xs:h-8 rounded-full" />
          </button>
        </div>
      </div>
    </div>
  );

  if (view === 'in-room' && currentRoom) {
    return (
      <Suspense fallback={<RouteLoader label="Loading collaborative room..." />}>
        <CollaborativeModeRoomGoogleMeet
          roomName={currentRoom.roomName}
          roomId={currentRoom.roomId}
          roomCode={currentRoom.roomCode}
          maxParticipants={currentRoom.maxParticipants}
          subject={currentRoom.subject}
          onLeaveRoom={handleLeaveRoom}
        />
      </Suspense>
    );
  }

  if (view === 'create-room') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-[#0f0f1e] dark:to-[#1a1a2e]">
        <TopNavbar />
        <div className="flex-1 pt-6 sm:pt-8">
          <CreateCustomRoom 
            onBack={() => setView('selection')}
            onLaunchRoom={handleLaunchRoom}
          />
        </div>
      </div>
    );
  }

  if (view === 'join-room') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-[#0f0f1e] dark:to-[#1a1a2e]">
        <TopNavbar />
        <div className="flex-1 pt-6 sm:pt-8">
          <JoinCustomRoom 
            onBack={() => setView('selection')}
            onEnterRoom={handleEnterRoom}
          />
        </div>
      </div>
    );
  }

  if (view === 'join-random') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-[#0f0f1e] dark:to-[#1a1a2e]">
        <TopNavbar />
        <div className="flex-1 pt-6 sm:pt-8">
          <JoinRandomRoomView 
            onBack={() => setView('selection')}
            onJoinRoom={handleJoinRandomRoom}
          />
        </div>
      </div>
    );
  }

  // Main Selection View
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-[#0f0f1e] dark:via-[#1a1a2e] dark:to-[#0f0f1e]">
      <TopNavbar />

      {/* Hero Section */}
      <div className="px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 pt-6 sm:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 mb-3 xs:mb-4 px-3 xs:px-4 py-2 bg-[#c9e5ff] dark:bg-[#003566] rounded-full">
              <Zap className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-[#003566] dark:text-[#00d4ff]" />
              <span className="text-xs xs:text-sm font-medium text-[#003566] dark:text-white">Collaborative Learning</span>
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-black dark:text-white mb-2 xs:mb-4">Study Together</h1>
            <p className="text-base xs:text-lg sm:text-xl text-black/70 dark:text-white/70">Choose how you want to study with others</p>
          </div>

          {/* Room Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Create Custom Room */}
            <div className="group bg-white dark:bg-[#1a1a2e] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-black/5 dark:border-white/10">
              <div className="relative h-48 bg-gradient-to-br from-[#502616] to-[#8B4513] overflow-hidden">
                <img 
                  src={imgImage17} 
                  alt="Create Custom Room" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-70"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
              
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#c9e5ff] dark:bg-[#003566] flex items-center justify-center">
                    <Plus className="w-6 h-6 text-[#502616] dark:text-[#00d4ff]" />
                  </div>
                  <h3 className="text-2xl font-bold text-black dark:text-white">Create Custom</h3>
                </div>
                
                <p className="text-black/70 dark:text-white/70 leading-relaxed">
                  Start a focused group for any subject. Set a topic, share the link, and invite your peers to collaborate in real time.
                </p>
                
                <button
                  onClick={() => setView('create-room')}
                  className="w-full bg-[#502616] hover:bg-[#402010] dark:bg-[#F77F00] dark:hover:bg-[#E07000] text-white font-medium py-3 rounded-lg transition-all duration-200 group-hover:gap-2 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Room
                </button>
              </div>
            </div>

            {/* Join Custom Room */}
            <div className="group bg-white dark:bg-[#1a1a2e] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-black/5 dark:border-white/10">
              <div className="relative h-48 bg-gradient-to-br from-[#303c70] to-[#1a2545] overflow-hidden">
                <img 
                  src={imgImage18} 
                  alt="Join Custom Room" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-70"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
              
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#303c70] dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-black dark:text-white">Join Custom</h3>
                </div>
                
                <p className="text-black/70 dark:text-white/70 leading-relaxed">
                  Enter a room code shared by a friend or mentor to join their study session instantly.
                </p>
                
                <button
                  onClick={() => setView('join-room')}
                  className="w-full bg-[#303c70] hover:bg-[#252e5a] dark:bg-[#00d4ff] dark:hover:bg-[#00b8cc] text-white dark:text-black font-medium py-3 rounded-lg transition-all duration-200 group-hover:gap-2 flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Join Room
                </button>
              </div>
            </div>

            {/* Join Random Room */}
            <div className="group bg-white dark:bg-[#1a1a2e] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-black/5 dark:border-white/10">
              <div className="relative h-48 bg-gradient-to-br from-[#F77F00] to-[#D97E35] overflow-hidden">
                <img 
                  src={imgImage19} 
                  alt="Join Random Room" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-70"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
              
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-[#F77F00] dark:text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-black dark:text-white">Join Random</h3>
                </div>
                
                <p className="text-black/70 dark:text-white/70 leading-relaxed">
                  Dive into open study rooms and connect with learners studying the same topics. Expand your learning network.
                </p>
                
                <button
                  onClick={() => setView('join-random')}
                  className="w-full bg-[#F77F00] hover:bg-[#E07000] dark:bg-[#FF6B6B] dark:hover:bg-[#FF5252] text-white font-medium py-3 rounded-lg transition-all duration-200 group-hover:gap-2 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Join Random
                </button>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20 pt-16 border-t border-black/10 dark:border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#c9e5ff] dark:bg-[#003566]">
                    <Users className="w-6 h-6 text-[#003566] dark:text-[#00d4ff]" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-black dark:text-white mb-1">Connect</h4>
                  <p className="text-black/70 dark:text-white/70">Find study partners and learn together in real time</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Zap className="w-6 h-6 text-[#303c70] dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-black dark:text-white mb-1">Collaborate</h4>
                  <p className="text-black/70 dark:text-white/70">Share screens, notes, and resources instantly</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900">
                    <Plus className="w-6 h-6 text-[#F77F00] dark:text-orange-400" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-black dark:text-white mb-1">Grow</h4>
                  <p className="text-black/70 dark:text-white/70">Build a community and improve learning outcomes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
