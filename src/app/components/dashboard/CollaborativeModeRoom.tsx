import React, { useState, useEffect } from 'react';
import { Bell, Mic, MicOff, Video, VideoOff, Upload, Users, Smile, MessageSquare, Timer, StickyNote, ChevronLeft, ChevronRight, Pin, BellOff } from 'lucide-react';
import imgFrame427318269 from "figma:asset/ad5368a3315b88119c1a283a49b009c3a7227d4f.png";
import imgFrame427318272 from "figma:asset/2e6af28c0e5d2548ed01b2eb2977da2ecb16db3e.png";
import imgFrame427318270 from "figma:asset/68cae3193ae9d107398f30ed207afe03ffcbc3d0.png";
import imgFrame427318273 from "figma:asset/df134df2839e995d2e6cad8c6199688e372f633b.png";
import imgFrame427318271 from "figma:asset/c06a1473b2e25c911dc67e55b8db19f784e952b0.png";
import imgFrame427318274 from "figma:asset/96561b5363ed6c4b01aedeb5a19d6daa38ce5958.png";
import imgImage15 from "figma:asset/0aa69f592fdcbc59e46001832f55ebdbca9f8cf7.png";
import { FocusTimerPanel } from "./FocusTimerPanel";
import { FocusTimerNotification } from "./FocusTimerNotification";
import { BlockNotificationsPanel } from "./BlockNotificationsPanel";
import { NotesPanel } from "./NotesPanel";
import { ScreenShareMenu } from "./ScreenShareMenu";
import { PeoplePanel } from "./PeoplePanel";
import { ReactionPicker } from "./ReactionPicker";
import { ReactionBurst } from "./ReactionBurst";
import { MessagesPanel } from "./MessagesPanel";

interface CollaborativeModeRoomProps {
  roomName?: string;
  roomId?: string;
  subject?: string;
  onLeaveRoom: () => void;
}

interface Participant {
  id: number;
  name: string;
  image: string;
  isMuted: boolean;
  isVideoOff: boolean;
}

interface TimerNotification {
  id: string;
  timerName: string;
  duration: string;
}

// Participants data
const participants = [
  { id: 0, name: "Elizabeth (You)", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", isMuted: false, isVideoOff: false },
  { id: 1, name: "John", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", isMuted: true, isVideoOff: false },
  { id: 2, name: "Franklin", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop", isMuted: false, isVideoOff: false },
  { id: 3, name: "Naomi", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", isMuted: false, isVideoOff: true },
  { id: 4, name: "Zendaya", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", isMuted: false, isVideoOff: false },
  { id: 5, name: "Steve", image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop", isMuted: false, isVideoOff: false },
  { id: 6, name: "Harry", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", isMuted: false, isVideoOff: false },
];

const isAdmin = true; // Current user is admin (Elizabeth)
const currentUserId = 0; // Elizabeth's ID

export function CollaborativeModeRoom({ 
  roomName = 'Study Room', 
  roomId = '2458', 
  subject = 'General',
  onLeaveRoom 
}: CollaborativeModeRoomProps) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pinnedParticipantId, setPinnedParticipantId] = useState<number | null>(null);
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const [timerNotification, setTimerNotification] = useState<TimerNotification | null>(null);
  const [showBlockNotifications, setShowBlockNotifications] = useState(false);
  const [isNotificationsBlocked, setIsNotificationsBlocked] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [thumbnailScrollPosition, setThumbnailScrollPosition] = useState(0);
  const [showPeople, setShowPeople] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactionBursts, setReactionBursts] = useState<Array<{ id: string; emoji: string }>>([]);
  const [showMessages, setShowMessages] = useState(false);
  const totalPages = 20;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePinParticipant = (participantId: number) => {
    setPinnedParticipantId(pinnedParticipantId === participantId ? null : participantId);
  };

  const handleTimerComplete = (label: string, duration: number) => {
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    const formattedDuration = secs === 0 ? `${mins.toString().padStart(2, '0')}:00 min` : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} min`;
    
    setTimerNotification({
      id: Date.now().toString(),
      timerName: label,
      duration: formattedDuration
    });

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      setTimerNotification(null);
    }, 10000);
  };

  const handleReactionSelect = (emoji: string) => {
    // Create a unique ID for this burst
    const burstId = Date.now().toString();
    
    // Log the reaction (in production, this would broadcast to other participants)
    console.log('Reaction sent:', emoji);
    
    // Close the reaction picker
    setShowReactionPicker(false);
    
    // Add a reaction burst
    setReactionBursts(prev => [...prev, { id: burstId, emoji }]);
    
    // Remove the burst after 3.5 seconds (max animation duration)
    setTimeout(() => {
      setReactionBursts(prev => prev.filter(burst => burst.id !== burstId));
    }, 3500);
  };

  const pinnedParticipant = pinnedParticipantId ? participants.find(p => p.id === pinnedParticipantId) : null;
  const otherParticipants = pinnedParticipant 
    ? participants.filter(p => p.id !== pinnedParticipantId)
    : participants.slice(1); // Exclude first participant if no one is pinned

  return (
    <div className="bg-[#1a1a1a] h-screen w-full flex flex-col font-['Poppins'] overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-8 gap-6 relative">
        {isScreenSharing ? (
          // Screen Share Layout
          <div className="w-full h-full flex flex-col relative">
            {/* Top Participant Thumbnails */}
            <div className="flex items-center justify-center gap-6 mb-6 relative">
              {/* Navigation */}
              <button 
                onClick={() => setThumbnailScrollPosition(prev => Math.max(0, prev - 1))}
                disabled={thumbnailScrollPosition === 0}
                className="text-white hover:opacity-70 disabled:opacity-30 transition-opacity"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              {/* Participant Thumbnails */}
              <div className="flex gap-6 overflow-hidden">
                {participants.slice(thumbnailScrollPosition, thumbnailScrollPosition + 6).map((participant) => (
                  <div 
                    key={participant.id}
                    className="relative bg-[#2a2a2a] rounded-[20px] overflow-hidden w-[144px] h-[138px] flex-shrink-0"
                  >
                    <img 
                      src={participant.image} 
                      alt={participant.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Pin Icon */}
                    <button
                      onClick={() => handlePinParticipant(participant.id)}
                      className="absolute top-2 left-2 bg-white/10 backdrop-blur-sm rounded-full p-1.5 hover:bg-white/20 transition-colors"
                    >
                      <Pin className="w-[14px] h-[14px] text-white" />
                    </button>
                    {/* Mute Icon */}
                    {participant.isMuted && (
                      <div className="absolute top-2 right-2 bg-white/10 backdrop-blur-sm rounded-full p-1.5">
                        <MicOff className="w-[14px] h-[14px] text-white" />
                      </div>
                    )}
                    {/* Name Badge */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1">
                      <span className="text-[10px] text-black font-medium">{participant.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setThumbnailScrollPosition(prev => Math.min(participants.length - 6, prev + 1))}
                disabled={thumbnailScrollPosition >= participants.length - 6}
                className="text-white hover:opacity-70 disabled:opacity-30 transition-opacity"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* Page Indicator */}
              <div className="absolute top-0 right-8 text-white text-[14px]">
                {currentPage}/{totalPages}
              </div>
            </div>

            {/* Main Screen Share Area */}
            <div className="flex-1 bg-[#c4c4c4] rounded-[20px] overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1688236551531-370fdaf09984?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5kb3dzJTIwZGVza3RvcCUyMGNvbXB1dGVyJTIwc2NyZWVufGVufDF8fHx8MTc2ODEwNjczN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                alt="Screen share" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Picture-in-Picture Presenter Video */}
            <div className="absolute bottom-8 right-8 bg-[#c4c4c4] rounded-[13px] overflow-hidden w-[179px] h-[147px]">
              <img 
                src={imgImage15} 
                alt="Presenter" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : pinnedParticipant ? (
          // Pinned Layout
          <>
            {/* Left - Single Small Participant */}
            <div className="relative">
              <div className="bg-[#2a2a2a] rounded-[20px] overflow-hidden w-[160px] h-[217px] relative">
                <img 
                  src={participants[0].image} 
                  alt={participants[0].name}
                  className="w-full h-full object-cover"
                />
                {/* Pin Icon */}
                <button
                  onClick={() => handlePinParticipant(participants[0].id)}
                  className="absolute top-3 left-3 bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-colors"
                >
                  <Pin className="w-[18px] h-[18px] text-white" />
                </button>
                {/* Mute Icon */}
                {participants[0].isMuted && (
                  <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm rounded-full p-2">
                    <MicOff className="w-[18px] h-[18px] text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Center - Large Pinned Participant */}
            <div className="bg-[#2a2a2a] rounded-[20px] overflow-hidden h-full max-h-[716px] w-full max-w-[626px] relative">
              <img 
                src={pinnedParticipant.image} 
                alt={pinnedParticipant.name}
                className="w-full h-full object-cover"
              />
              {/* Pin Icon */}
              <button
                onClick={() => handlePinParticipant(pinnedParticipant.id)}
                className="absolute top-3 left-3 bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-colors"
              >
                <Pin className="w-[18px] h-[18px] text-white" />
              </button>
              {/* Name Badge */}
              <div className="absolute bottom-4 right-4 bg-white rounded-full px-4 py-1.5">
                <span className="text-[14px] text-black font-medium">{pinnedParticipant.name}</span>
              </div>
            </div>

            {/* Right - 2x3 Grid of Participants */}
            <div className="flex flex-col gap-4">
              {/* Pagination */}
              <div className="flex items-center justify-end gap-2 mb-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="text-white hover:opacity-70 disabled:opacity-30 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-white text-[14px]">{currentPage}/{totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="text-white hover:opacity-70 disabled:opacity-30 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Participant Cards */}
              <div className="grid grid-cols-2 gap-4">
                {otherParticipants.slice(0, 6).map((participant) => (
                  <div 
                    key={participant.id}
                    className="relative bg-[#2a2a2a] rounded-[20px] overflow-hidden w-[174px] h-[137px]"
                  >
                    <img 
                      src={participant.image} 
                      alt={participant.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Pin Icon */}
                    <button
                      onClick={() => handlePinParticipant(participant.id)}
                      className="absolute top-3 left-3 bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-colors"
                    >
                      <Pin className="w-[18px] h-[18px] text-white" />
                    </button>
                    {/* Video Off Icon */}
                    {participant.isVideoOff && (
                      <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm rounded-full p-2">
                        <VideoOff className="w-[18px] h-[18px] text-white" />
                      </div>
                    )}
                    {/* Mute Icon */}
                    {participant.isMuted && !participant.isVideoOff && (
                      <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm rounded-full p-2">
                        <MicOff className="w-[18px] h-[18px] text-white" />
                      </div>
                    )}
                    {/* Name Badge */}
                    <div className="absolute bottom-3 right-3 bg-white rounded-full px-3 py-1">
                      <span className="text-[12px] text-black font-medium">{participant.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Default Layout (No Pin)
          <>
            {/* Main Video Feed */}
            <div className="bg-[#c4c4c4] rounded-[20px] overflow-hidden h-full max-h-[716px] w-full max-w-[868px] relative flex items-center justify-center">
              {isVideoOn ? (
                <img 
                  src={imgImage15} 
                  alt="Main participant" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[32px] text-black font-normal">Your Camera is off</span>
                </div>
              )}
            </div>

            {/* Participant Grid */}
            <div className="flex flex-col gap-4">
              {/* Pagination */}
              <div className="flex items-center justify-end gap-2 mb-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="text-white hover:opacity-70 disabled:opacity-30 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-white text-[14px]">{currentPage}/{totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="text-white hover:opacity-70 disabled:opacity-30 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Participant Cards */}
              <div className="grid grid-cols-2 gap-4">
                {participants.slice(0, 6).map((participant) => (
                  <div 
                    key={participant.id}
                    className="relative bg-[#2a2a2a] rounded-[20px] overflow-hidden w-[174px] h-[137px]"
                  >
                    <img 
                      src={participant.image} 
                      alt={participant.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Pin Icon */}
                    <button
                      onClick={() => handlePinParticipant(participant.id)}
                      className="absolute top-3 left-3 bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-colors"
                    >
                      <Pin className="w-[18px] h-[18px] text-white" />
                    </button>
                    {/* Mute Icon */}
                    {participant.isMuted && (
                      <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm rounded-full p-2">
                        <MicOff className="w-[18px] h-[18px] text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-[#2a2a2a] px-8 py-4 flex items-center justify-between">
        {/* Left Side - Timer and Room Info */}
        <div className="flex items-center gap-6 text-white">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            <span className="text-[14px]">Time Elapsed: {formatTime(elapsedTime)}</span>
          </div>
          <div className="text-[14px]">
            Room ID: {roomId}
          </div>
        </div>

        {/* Center - Controls */}
        <div className="flex items-center gap-4">
          {/* Timer Button */}
          <button 
            onClick={() => setShowFocusTimer(!showFocusTimer)}
            className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-full p-3 transition-colors"
          >
            <Timer className="w-6 h-6 text-white" />
          </button>

          {/* Bell Button */}
          <button 
            onClick={() => setShowBlockNotifications(!showBlockNotifications)}
            className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-full p-3 transition-colors"
          >
            {showBlockNotifications ? (
              <BellOff className="w-6 h-6 text-white" />
            ) : (
              <Bell className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Notes Button */}
          <button 
            onClick={() => setShowNotes(!showNotes)}
            className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-full p-3 transition-colors"
          >
            <StickyNote className="w-6 h-6 text-white" />
          </button>

          {/* Video Button */}
          <button 
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`${
              isVideoOn ? 'bg-[#3a3a3a] hover:bg-[#4a4a4a]' : 'bg-red-600 hover:bg-red-700'
            } rounded-full p-3 transition-colors`}
          >
            {isVideoOn ? (
              <Video className="w-6 h-6 text-white" />
            ) : (
              <VideoOff className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Mic Button */}
          <button 
            onClick={() => setIsMicOn(!isMicOn)}
            className={`${
              isMicOn ? 'bg-[#3a3a3a] hover:bg-[#4a4a4a]' : 'bg-red-600 hover:bg-red-700'
            } rounded-full p-3 transition-colors`}
          >
            {isMicOn ? (
              <Mic className="w-6 h-6 text-white" />
            ) : (
              <MicOff className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Screen Share Button */}
          <ScreenShareMenu 
            isSharing={isScreenSharing}
            onScreenShareStart={() => setIsScreenSharing(true)}
            onScreenShareStop={() => setIsScreenSharing(false)}
          />

          {/* People Button */}
          <button 
            onClick={() => setShowPeople(!showPeople)}
            className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-full p-3 transition-colors"
          >
            <Users className="w-6 h-6 text-white" />
          </button>

          {/* Emoji Button */}
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-full p-3 transition-colors"
          >
            <Smile className="w-6 h-6 text-white" />
          </button>

          {/* Chat Button */}
          <button
            onClick={() => setShowMessages(!showMessages)}
            className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-full p-3 transition-colors"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Right Side - Leave Room */}
        <button
          onClick={onLeaveRoom}
          className="bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-[20px] px-6 h-[42px] text-[14px] font-medium transition-colors"
        >
          Leave Room
        </button>
      </div>

      {/* Focus Timer Panel */}
      {showFocusTimer && (
        <FocusTimerPanel
          onClose={() => setShowFocusTimer(false)}
          onTimerComplete={handleTimerComplete}
        />
      )}

      {/* Focus Timer Notification */}
      {timerNotification && (
        <FocusTimerNotification
          timerName={timerNotification.timerName}
          duration={timerNotification.duration}
          onDismiss={() => setTimerNotification(null)}
        />
      )}

      {/* Block Notifications Panel */}
      {showBlockNotifications && (
        <BlockNotificationsPanel
          onClose={() => setShowBlockNotifications(false)}
          isBlocked={isNotificationsBlocked}
          onToggle={() => setIsNotificationsBlocked(!isNotificationsBlocked)}
        />
      )}

      {/* Notes Panel */}
      {showNotes && (
        <NotesPanel
          onClose={() => setShowNotes(false)}
        />
      )}

      {/* People Panel */}
      {showPeople && (
        <PeoplePanel
          onClose={() => setShowPeople(false)}
          participants={participants}
          onPinParticipant={handlePinParticipant}
          pinnedParticipantId={pinnedParticipantId}
          isAdmin={isAdmin}
          currentUserId={currentUserId}
        />
      )}

      {/* Reaction Picker */}
      {showReactionPicker && (
        <ReactionPicker
          onClose={() => setShowReactionPicker(false)}
          onReactionSelect={handleReactionSelect}
        />
      )}

      {/* Reaction Bursts */}
      {reactionBursts.map(burst => (
        <ReactionBurst
          key={burst.id}
          emoji={burst.emoji}
        />
      ))}

      {/* Messages Panel */}
      {showMessages && (
        <MessagesPanel
          onClose={() => setShowMessages(false)}
          currentUserId={currentUserId}
          currentUserName="You"
          currentUserAvatar={participants[currentUserId].image}
        />
      )}
    </div>
  );
}