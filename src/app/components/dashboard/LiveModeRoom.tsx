import React, { useState, useEffect } from 'react';
import { Bell, Mic, MicOff, Video, VideoOff, Users, Smile, MessageSquare, Timer, StickyNote, ChevronLeft, ChevronRight, Pin, BellOff, Settings } from 'lucide-react';
import imgImage15 from "figma:asset/0aa69f592fdcbc59e46001832f55ebdbca9f8cf7.png";
import imgFrame427318269 from "figma:asset/ad5368a3315b88119c1a283a49b009c3a7227d4f.png";
import imgFrame427318272 from "figma:asset/2e6af28c0e5d2548ed01b2eb2977da2ecb16db3e.png";
import imgFrame427318270 from "figma:asset/68cae3193ae9d107398f30ed207afe03ffcbc3d0.png";
import imgFrame427318273 from "figma:asset/df134df2839e995d2e6cad8c6199688e372f633b.png";
import imgFrame427318271 from "figma:asset/c06a1473b2e25c911dc67e55b8db19f784e952b0.png";
import imgFrame427318274 from "figma:asset/96561b5363ed6c4b01aedeb5a19d6daa38ce5958.png";
import { FocusTimerPanel } from "./FocusTimerPanel";
import { FocusTimerNotification } from "./FocusTimerNotification";
import { BlockNotificationsPanel } from "./BlockNotificationsPanel";
import { NotesPanel } from "./NotesPanel";
import { PeoplePanel } from "./PeoplePanel";
import { ReactionPicker } from "./ReactionPicker";
import { ReactionBurst } from "./ReactionBurst";
import { MessagesPanel } from "./MessagesPanel";
import { ModeConfigurationPanel } from "./ModeConfigurationPanel";
import { useRoom } from "../../providers/RoomContext";
import { useAuth } from "../../hooks/useAuth";

interface LiveModeRoomProps {
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
  hasNotificationsMuted?: boolean;
}

interface TimerNotification {
  id: string;
  timerName: string;
  duration: string;
}

export function LiveModeRoom({ 
  roomName = '', 
  roomId,
  subject = 'General',
  onLeaveRoom 
}: LiveModeRoomProps) {
  // Get room context data
  const roomContext = useRoom();
  const { user } = useAuth();
  
  const participants = roomContext.participants || [];
  const isHost = roomContext.isHost;
  const currentUserId = user?.id ? String(user.id) : null;
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(89); // Start at 1:29 as shown in design
  const [currentPage, setCurrentPage] = useState(1);
  const [pinnedParticipantId, setPinnedParticipantId] = useState<number | null>(null);
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const [timerNotification, setTimerNotification] = useState<TimerNotification | null>(null);
  const [showBlockNotifications, setShowBlockNotifications] = useState(false);
  const [isNotificationsBlocked, setIsNotificationsBlocked] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactionBursts, setReactionBursts] = useState<Array<{ id: string; emoji: string }>>([]);
  const [showMessages, setShowMessages] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const totalPages = 20;

  // Viewers (all participants except the host)
  const viewers = participants.slice(1);

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
    const burstId = Date.now().toString();
    console.log('Reaction sent:', emoji);
    setShowReactionPicker(false);
    setReactionBursts(prev => [...prev, { id: burstId, emoji }]);
    
    setTimeout(() => {
      setReactionBursts(prev => prev.filter(burst => burst.id !== burstId));
    }, 3500);
  };

  // Get the current page of viewers (6 per page)
  const startIndex = (currentPage - 1) * 6;
  const currentViewers = viewers.slice(startIndex, startIndex + 6);

  const handlePinParticipant = (participantId: number) => {
    if (pinnedParticipantId === participantId) {
      setPinnedParticipantId(null); // Unpin if already pinned
    } else {
      setPinnedParticipantId(participantId); // Pin the participant
    }
  };

  // Get pinned participant
  const pinnedParticipant = pinnedParticipantId !== null 
    ? participants.find(p => p.id === pinnedParticipantId) 
    : null;

  // Get grid participants (all except pinned and host, or all except host if no pin)
  const getGridParticipants = () => {
    if (pinnedParticipantId !== null) {
      // If someone is pinned, show host + all others except pinned
      return participants.filter(p => p.id !== pinnedParticipantId);
    } else {
      // If no one is pinned, show only viewers (exclude host)
      return viewers;
    }
  };

  const gridParticipants = getGridParticipants();
  const currentGridParticipants = gridParticipants.slice(startIndex, startIndex + 6);

  return (
    <div className="bg-[#1a1a1a] h-screen w-full flex flex-col font-['Poppins'] overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-start p-8 gap-6 relative">
        
        {pinnedParticipant ? (
          // Pinned Layout: Host thumbnail on left, Pinned center, Others on right
          <>
            {/* Left - Host Thumbnail */}
            <div className="relative bg-[#2a2a2a] rounded-[20px] overflow-hidden w-[174px] h-[190px] flex-shrink-0">
              {isVideoOn ? (
                <img 
                  src={participants[currentUserId].image} 
                  alt="Host" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#2a2a2a]">
                  <VideoOff className="w-8 h-8 text-white/50" />
                </div>
              )}
              
              {/* Pin Icon */}
              <button
                onClick={() => handlePinParticipant(currentUserId)}
                className="absolute top-3 left-3 bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-colors"
              >
                <Pin className="w-[18px] h-[18px] text-white" />
              </button>

              {/* Mic Icon if muted */}
              {!isMicOn && (
                <div className="absolute top-3 left-14 bg-white/10 backdrop-blur-sm rounded-full p-2">
                  <MicOff className="w-[18px] h-[18px] text-white" />
                </div>
              )}
            </div>

            {/* Center - Pinned Participant Video */}
            <div className="bg-[#c4c4c4] rounded-[20px] overflow-hidden h-full max-h-[716px] flex-1 relative flex items-center justify-center">
              {pinnedParticipant.isVideoOff ? (
                <div className="w-full h-full flex items-center justify-center">
                  <VideoOff className="w-16 h-16 text-white/50" />
                </div>
              ) : (
                <img 
                  src={pinnedParticipant.image} 
                  alt={pinnedParticipant.name} 
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Name Label */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 rounded-full px-6 py-2">
                <span className="font-['Poppins'] text-[14px] text-black font-medium">
                  {pinnedParticipant.name}
                </span>
              </div>
            </div>

            {/* Right - Other Participants Grid */}
            <div className="flex flex-col gap-6 h-full max-h-[716px] justify-start flex-shrink-0">
              {/* Pagination */}
              <div className="flex items-center justify-end gap-2">
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

              {/* Grid (2x3) */}
              <div className="grid grid-cols-2 gap-4">
                {currentGridParticipants.map((participant) => (
                  <div 
                    key={participant.id}
                    className="relative bg-[#2a2a2a] rounded-[20px] overflow-hidden w-[174px] h-[137px]"
                  >
                    {participant.isVideoOff ? (
                      <div className="w-full h-full flex items-center justify-center bg-[#2a2a2a]">
                        <VideoOff className="w-8 h-8 text-white/50" />
                      </div>
                    ) : (
                      <img 
                        src={participant.image} 
                        alt={participant.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {/* Pin Icon */}
                    <button
                      onClick={() => handlePinParticipant(participant.id)}
                      className="absolute top-3 left-3 bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-colors"
                    >
                      <Pin className="w-[18px] h-[18px] text-white" />
                    </button>

                    {/* Mute Icon */}
                    {participant.isMuted && (
                      <div className="absolute top-3 left-14 bg-white/10 backdrop-blur-sm rounded-full p-2">
                        <MicOff className="w-[18px] h-[18px] text-white" />
                      </div>
                    )}

                    {/* Silent Notification Icon */}
                    {participant.hasNotificationsMuted && (
                      <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm rounded-full p-2">
                        <BellOff className="w-[18px] h-[18px] text-white" />
                      </div>
                    )}

                    {/* Name Label */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 rounded-full px-3 py-1">
                      <span className="font-['Poppins'] text-[12px] text-black font-medium">
                        {participant.name}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Fill empty slots */}
                {Array.from({ length: Math.max(0, 6 - currentGridParticipants.length) }).map((_, index) => (
                  <div 
                    key={`empty-${index}`}
                    className="w-[174px] h-[137px]"
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          // Default Layout: Host main feed, Viewers on right
          <>
            {/* Left - Main Host Video Feed */}
            <div className="bg-[#c4c4c4] rounded-[20px] overflow-hidden h-full max-h-[716px] w-full max-w-[868px] relative flex items-center justify-center">
              {isVideoOn ? (
                <img 
                  src={imgImage15} 
                  alt="Host" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#d9d9d9]">
                  <span className="font-['Poppins'] text-[24px] text-black font-normal">Your Camera is off</span>
                </div>
              )}
            </div>

            {/* Right - Viewer Grid */}
            <div className="flex flex-col gap-6 h-full max-h-[716px] justify-start">
              {/* Pagination */}
              <div className="flex items-center justify-end gap-2">
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

              {/* Viewer Cards (2 columns x 3 rows) */}
              <div className="grid grid-cols-2 gap-4">
                {currentGridParticipants.map((viewer) => (
                  <div 
                    key={viewer.id}
                    className="relative bg-[#2a2a2a] rounded-[20px] overflow-hidden w-[174px] h-[137px]"
                  >
                    {viewer.isVideoOff ? (
                      <div className="w-full h-full flex items-center justify-center bg-[#2a2a2a]">
                        <VideoOff className="w-8 h-8 text-white/50" />
                      </div>
                    ) : (
                      <img 
                        src={viewer.image} 
                        alt={viewer.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {/* Pin Icon */}
                    <button
                      onClick={() => handlePinParticipant(viewer.id)}
                      className="absolute top-3 left-3 bg-white/10 backdrop-blur-sm rounded-full p-2 hover:bg-white/20 transition-colors"
                    >
                      <Pin className="w-[18px] h-[18px] text-white" />
                    </button>

                    {/* Mute Icon */}
                    {viewer.isMuted && (
                      <div className="absolute top-3 left-14 bg-white/10 backdrop-blur-sm rounded-full p-2">
                        <MicOff className="w-[18px] h-[18px] text-white" />
                      </div>
                    )}

                    {/* Silent Notification Icon */}
                    {viewer.hasNotificationsMuted && (
                      <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm rounded-full p-2">
                        <BellOff className="w-[18px] h-[18px] text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Fill empty slots if less than 6 viewers */}
                {Array.from({ length: Math.max(0, 6 - currentGridParticipants.length) }).map((_, index) => (
                  <div 
                    key={`empty-${index}`}
                    className="w-[174px] h-[137px]"
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-[#2a2a2a] px-8 py-4 flex items-center justify-between">
        {/* Left Side - Timer and Mode */}
        <div className="flex items-center gap-6 text-white">
          <div className="flex items-center gap-2">
            <span className="text-[14px]">Time Elapsed: {formatTime(elapsedTime)}</span>
          </div>
          <div className="h-4 w-px bg-white/30" />
          <div className="text-[14px]">
            Live Mode
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
            {isNotificationsBlocked ? (
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

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-full p-3 transition-colors"
          >
            <Settings className="w-6 h-6 text-white" />
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
          isAdmin={isHost}
          currentUserId={currentUserId}
          mode="live"
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
          currentUserName="Host"
          currentUserAvatar={participants[currentUserId].image}
        />
      )}

      {/* Mode Configuration Panel */}
      {showSettings && (
        <ModeConfigurationPanel
          mode="live"
          onClose={() => setShowSettings(false)}
          onSave={(config) => {
            console.log('Live Mode Configuration Saved:', config);
            setShowSettings(false);
          }}
        />
      )}
    </div>
  );
}