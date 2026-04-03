import React, { useState, useEffect } from 'react';
import svgPaths from "../../../imports/svg-nb8x00a2v8";
import svgPathsPinned from "../../../imports/svg-orgwtqgm0j";
import imgFrame427318269 from "figma:asset/ad5368a3315b88119c1a283a49b009c3a7227d4f.png";
import imgFrame427318272 from "figma:asset/2e6af28c0e5d2548ed01b2eb2977da2ecb16db3e.png";
import imgFrame427318270 from "figma:asset/68cae3193ae9d107398f30ed207afe03ffcbc3d0.png";
import imgFrame427318273 from "figma:asset/df134df2839e995d2e6cad8c6199688e372f633b.png";
import imgFrame427318271 from "figma:asset/c06a1473b2e25c911dc67e55b8db19f784e952b0.png";
import imgFrame427318274 from "figma:asset/96561b5363ed6c4b01aedeb5a19d6daa38ce5958.png";
import imgImage15 from "figma:asset/0aa69f592fdcbc59e46001832f55ebdbca9f8cf7.png";
import { FocusTimerPanel } from "./FocusTimerPanel";
import { TimerNotification } from "./TimerNotification";
import { BlockNotificationsPanel } from "./BlockNotificationsPanel";
import { NotesPanel } from "./NotesPanel";
import { PeoplePanel } from "./PeoplePanel";
import { ReactionBar } from "./ReactionBar";
import { FloatingReactions } from "./FloatingReactions";

// Pin Icon Component
function PinIcon() {
  return (
    <div className="relative shrink-0 size-[34px] cursor-pointer hover:opacity-70 transition-opacity">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
        <rect fill="white" fillOpacity="0.1" height="34" rx="17" width="34" />
        <path d={svgPaths.p20138d00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

// Unpin Icon Component (crossed-out pin)
function UnpinIcon() {
  return (
    <div className="relative shrink-0 size-[47px] cursor-pointer hover:opacity-70 transition-opacity bg-[rgba(255,255,255,0.4)] rounded-[20px] flex items-center justify-center">
      <div className="relative size-[27px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 27.557">
          <path d={svgPathsPinned.p3494c00} stroke="#FF5E5E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.62" />
          <line stroke="#FF5E5E" strokeLinecap="round" strokeWidth="1.08" x1="0.763487" x2="24.823" y1="0.540001" y2="23.5535" />
        </svg>
      </div>
    </div>
  );
}

// Camera Off Icon Component
function CameraOffIcon() {
  return (
    <div className="relative shrink-0 size-[34px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
        <rect fill="white" fillOpacity="0.6" height="34" rx="17" width="34" />
        <g transform="translate(7, 9)">
          <path d="M1 11.4545L1 6.54545C1 5.69162 1.69162 5 2.54545 5L11.7273 5C12.5811 5 13.2727 5.69162 13.2727 6.54545L13.2727 11.4545C13.2727 12.3084 12.5811 13 11.7273 13L2.54545 13C1.69162 13 1 12.3084 1 11.4545Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
          <path d="M13.2727 8.22727L16.8182 6.54545L16.8182 11.4545L13.2727 9.77273" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
          <line stroke="black" strokeLinecap="round" strokeWidth="1.6" x1="2" x2="17" y1="4" y2="14" />
        </g>
      </svg>
    </div>
  );
}

// Participant Tile Component
function ParticipantTile({ 
  image, 
  name, 
  isPinned, 
  onTogglePin,
  showCameraOff 
}: { 
  image: string; 
  name: string;
  isPinned: boolean; 
  onTogglePin: () => void;
  showCameraOff?: boolean;
}) {
  return (
    <div className="relative h-[217px] w-[225px] overflow-clip rounded-[20px] shrink-0">
      <img alt="" className="absolute inset-0 size-full object-cover pointer-events-none rounded-[20px]" src={image} />
      <div className="absolute top-[12px] left-[12px] z-10 flex gap-2">
        {showCameraOff && <CameraOffIcon />}
        <button onClick={onTogglePin} className={`transition-transform ${isPinned ? 'scale-110' : ''}`}>
          <PinIcon />
        </button>
      </div>
      <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white px-4 py-1 rounded-[20px] border border-black/60">
          <p className="text-[10px] text-black font-['Poppins']">{name}</p>
        </div>
      </div>
    </div>
  );
}

// Small Participant Tile for Pinned View
function SmallParticipantTile({ 
  image, 
  name, 
  onPin,
  showCameraOff 
}: { 
  image: string; 
  name: string;
  onPin: () => void;
  showCameraOff?: boolean;
}) {
  return (
    <div className="relative h-[217px] w-[225px] overflow-clip rounded-[20px] shrink-0">
      <img alt="" className="absolute inset-0 size-full object-cover pointer-events-none rounded-[20px]" src={image} />
      <div className="absolute top-[12px] left-[12px] z-10 flex gap-2">
        {showCameraOff && <CameraOffIcon />}
        <button onClick={onPin} className="hover:scale-110 transition-transform">
          <PinIcon />
        </button>
      </div>
      <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white px-3 py-0.5 rounded-[20px] border border-black/60">
          <p className="text-[10px] text-black font-['Poppins']">{name}</p>
        </div>
      </div>
    </div>
  );
}

// Footer Icons
function TimerIcon() {
  return (
    <div className="h-[24px] w-[19.2px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 26">
        <path d={svgPaths.p139e5180} stroke="white" strokeWidth="2" />
        <path d={svgPaths.p1e52200} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </div>
  );
}

function BellIcon() {
  return (
    <div className="h-[24px] w-[20.325px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 26">
        <path d={svgPaths.p32c67b00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        <path d={svgPaths.p18aa6100} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
      </svg>
    </div>
  );
}

function NotesIcon() {
  return (
    <div className="h-[24px] w-[23.135px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths.p2763bd80} fill="white" />
        <path d={svgPaths.p5f88300} fill="white" />
        <path d={svgPaths.p60d6b00} fill="white" />
        <path d={svgPaths.p2c508000} fill="white" />
        <path d={svgPaths.p306e2c80} fill="white" />
      </svg>
    </div>
  );
}

function VideoIcon() {
  return (
    <div className="h-[34px] w-[40px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 34">
        <path d={svgPaths.p5d72180} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
      </svg>
    </div>
  );
}

function PeopleIcon() {
  return (
    <div className="size-[27px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 27">
        <path d={svgPaths.p160d7f00} fill="white" />
      </svg>
    </div>
  );
}

function EmojiIcon() {
  return (
    <div className="h-[52px] w-[50px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 52">
        <path d={svgPaths.p10299000} fill="white" />
      </svg>
    </div>
  );
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <div className={`size-[30px] ${direction === 'left' ? 'rotate-180 scale-y-[-100%]' : ''}`}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <path d={svgPaths.p247d2080} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" strokeWidth="2.5" />
      </svg>
    </div>
  );
}

interface SilentModeViewProps {
  onLeave: () => void;
  onBackToFocus?: () => void; // Optional callback to go back to Focus Mode
  onReportSubmitted?: (participantName: string) => void; // Callback when a report is submitted
}

export function SilentModeView({ onLeave, onBackToFocus, onReportSubmitted }: SilentModeViewProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 20;
  
  const [pinnedParticipant, setPinnedParticipant] = useState<number | null>(null);
  const [isTimerPanelOpen, setIsTimerPanelOpen] = useState(false);
  const [isBlockNotificationsPanelOpen, setIsBlockNotificationsPanelOpen] = useState(false);
  const [isNotesPanelOpen, setIsNotesPanelOpen] = useState(false);
  const [isPeoplePanelOpen, setIsPeoplePanelOpen] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isReactionBarVisible, setIsReactionBarVisible] = useState(false);
  const [reactions, setReactions] = useState<{ emoji: string; timestamp: number }[]>([]);
  const [timerNotification, setTimerNotification] = useState<{
    visible: boolean;
    name: string;
    duration: string;
  }>({
    visible: false,
    name: "",
    duration: ""
  });

  // Participant images and names
  const participants = [
    { id: 0, image: imgFrame427318269, name: "John", isMuted: false, isVideoOff: false },
    { id: 1, image: imgFrame427318272, name: "Elizabeth", isMuted: true, isVideoOff: false },
    { id: 2, image: imgFrame427318270, name: "Florelein", isMuted: false, isVideoOff: true },
    { id: 3, image: imgFrame427318273, name: "Zendaya", isMuted: false, isVideoOff: false },
    { id: 4, image: imgFrame427318271, name: "Naomi", isMuted: true, isVideoOff: false },
    { id: 5, image: imgFrame427318274, name: "Rahul", isMuted: false, isVideoOff: false }
  ];

  // Timer for elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins.toString().padStart(2, '0')}:00 min`;
  };

  const handleTimerStart = (name: string, duration: number) => {
    setTimerNotification({
      visible: true,
      name: name,
      duration: formatDuration(duration)
    });
  };

  const handleCloseNotification = () => {
    setTimerNotification(prev => ({ ...prev, visible: false }));
  };

  const togglePin = (index: number) => {
    if (pinnedParticipant === index) {
      // Unpin if already pinned
      setPinnedParticipant(null);
    } else {
      // Pin the selected participant
      setPinnedParticipant(index);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleReactionSelect = (emoji: string) => {
    console.log('Reaction selected:', emoji);
    // Here you would typically send the reaction to other participants
    setReactions(prev => [...prev, { emoji, timestamp: Date.now() }]);
    setIsReactionBarVisible(false);
  };

  // If someone is pinned, show the pinned layout
  if (pinnedParticipant !== null) {
    const pinned = participants[pinnedParticipant];
    const others = participants.filter((_, idx) => idx !== pinnedParticipant);
    
    return (
      <div className="fixed inset-0 z-50 bg-[#141316] font-['Poppins'] overflow-hidden">
        {/* Main Content - Pinned View */}
        <div className="h-full w-full flex gap-4 p-8 pb-[120px]">
          
          {/* Left Column - Small Tiles (First participant) */}
          <div className="flex flex-col gap-6 justify-start">
            <SmallParticipantTile 
              image={others[0].image}
              name={others[0].name}
              onPin={() => togglePin(participants.findIndex(p => p.name === others[0].name))}
            />
          </div>

          {/* Center - Large Pinned Participant */}
          <div className="flex-1 bg-[#c4c4c4] rounded-[20px] overflow-hidden relative">
            <img 
              alt="Pinned Participant" 
              className="absolute inset-0 size-full object-cover pointer-events-none" 
              src={pinned.image} 
            />
            {/* Unpin Button */}
            <div className="absolute top-[18px] left-[18px] z-10">
              <button onClick={() => setPinnedParticipant(null)}>
                <UnpinIcon />
              </button>
            </div>
            {/* Participant Name */}
            <div className="absolute bottom-[32px] left-1/2 -translate-x-1/2 z-10">
              <div className="bg-white px-6 py-2 rounded-[20px] border border-black/60">
                <p className="text-[16px] text-black font-['Poppins']">{pinned.name}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Small Tiles (Remaining participants) */}
          <div className="flex flex-col gap-6 justify-start">
            {others.slice(1).map((participant, idx) => (
              <SmallParticipantTile 
                key={idx}
                image={participant.image}
                name={participant.name}
                onPin={() => togglePin(participants.findIndex(p => p.name === participant.name))}
              />
            ))}
          </div>
        </div>

        {/* Page Navigation - Top Right */}
        <div className="absolute top-6 right-6 flex items-center gap-2 text-white z-20">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="disabled:opacity-30 hover:opacity-80 transition-opacity"
          >
            <ArrowIcon direction="left" />
          </button>
          <p className="text-[16px]">
            <span className="text-white font-medium">{currentPage}</span>
            <span className="text-[rgba(255,255,255,0.7)]">/{totalPages}</span>
          </p>
          <button 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="disabled:opacity-30 hover:opacity-80 transition-opacity"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-12 pb-6 pt-4">
          
          {/* Left: Time Elapsed & Mode */}
          <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/5">
            <p className="text-[16px] text-[rgba(255,255,255,0.7)]">
              <span className="font-medium text-white">Time Elapsed: </span>
              {formatElapsedTime(timeElapsed)}
            </p>
            <div className="h-[20px] w-[1px] bg-white/30" />
            <p className="font-medium text-[16px] text-white">Silent Mode</p>
          </div>

          {/* Center: Navigation Icons */}
          <div className="hidden md:flex bg-[rgba(255,255,255,0.1)] backdrop-blur-xl gap-6 px-8 py-2 h-[52px] items-center justify-center rounded-[20px] border border-white/10">
            <button 
              onClick={() => setIsTimerPanelOpen(!isTimerPanelOpen)}
              className={`flex items-center justify-center size-[52px] rounded-full transition-all ${isTimerPanelOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <TimerIcon />
            </button>
            <button 
              onClick={() => setIsBlockNotificationsPanelOpen(!isBlockNotificationsPanelOpen)}
              className={`flex items-center justify-center size-[52px] rounded-full transition-all ${isBlockNotificationsPanelOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <BellIcon />
            </button>
            <button 
              onClick={() => setIsNotesPanelOpen(!isNotesPanelOpen)}
              className={`flex items-center justify-center size-[52px] rounded-full transition-all ${isNotesPanelOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <div className="scale-y-[-100%]">
                <NotesIcon />
              </div>
            </button>
            <button 
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className={`flex items-center justify-center size-[52px] rounded-full transition-all ${!isVideoEnabled ? 'bg-[#cc3636]/80' : 'hover:bg-white/10'}`}
            >
              <VideoIcon />
            </button>
            <button 
              onClick={() => setIsPeoplePanelOpen(!isPeoplePanelOpen)}
              className={`flex items-center justify-center size-[52px] rounded-full transition-all ${isPeoplePanelOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <PeopleIcon />
            </button>
            <button 
              onClick={() => setIsReactionBarVisible(!isReactionBarVisible)}
              className={`flex items-center justify-center size-[52px] rounded-full transition-all scale-[0.8] ${isReactionBarVisible ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <EmojiIcon />
            </button>
          </div>

          {/* Right: Leave Room Button */}
          <button 
            onClick={onLeave}
            className="bg-[#cc3636] hover:bg-[#b32e2e] active:scale-95 px-6 py-3 h-[42px] rounded-[24px] transition-all"
          >
            <p className="font-semibold text-[16px] text-white whitespace-nowrap">Leave Room</p>
          </button>
        </div>

        {/* Reaction Bar */}
        <ReactionBar isVisible={isReactionBarVisible} onReactionSelect={handleReactionSelect} />

        {/* Focus Timer Panel */}
        <FocusTimerPanel isOpen={isTimerPanelOpen} onClose={() => setIsTimerPanelOpen(false)} onTimerStart={handleTimerStart} />
        {/* Block Notifications Panel */}
        <BlockNotificationsPanel isOpen={isBlockNotificationsPanelOpen} onClose={() => setIsBlockNotificationsPanelOpen(false)} />
        {/* Timer Notification */}
        <TimerNotification 
          visible={timerNotification.visible} 
          name={timerNotification.name} 
          duration={timerNotification.duration} 
          onClose={handleCloseNotification} 
        />
        {/* Notes Panel */}
        <NotesPanel isOpen={isNotesPanelOpen} onClose={() => setIsNotesPanelOpen(false)} />
        {/* People Panel */}
        {isPeoplePanelOpen && (
          <PeoplePanel 
            onClose={() => setIsPeoplePanelOpen(false)}
            participants={participants}
            onPinParticipant={togglePin}
            pinnedParticipantId={pinnedParticipant}
            mode="live"
          />
        )}
        
        {/* Floating Reactions */}
        <FloatingReactions reactions={reactions} />
      </div>
    );
  }

  // Default Grid View (No one pinned)
  return (
    <div className="fixed inset-0 z-50 bg-[#141316] font-['Poppins'] overflow-hidden">
      {/* Main Content Grid */}
      <div className="h-full w-full flex flex-col md:flex-row gap-6 p-4 md:p-8 pb-[120px]">
        
        {/* Left: Main Video Feed */}
        <div className="flex-1 bg-[#c4c4c4] rounded-[20px] overflow-hidden relative min-h-[400px] md:min-h-0">
          {isVideoEnabled ? (
            <img 
              alt="Main Feed" 
              className="absolute inset-0 size-full object-cover pointer-events-none" 
              src={imgImage15} 
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#c4c4c4]">
              <p className="text-[32px] text-black font-['Poppins']">Your Camera is off</p>
            </div>
          )}
        </div>

        {/* Right: Participant Grid */}
        <div className="flex flex-col gap-8 w-full md:w-auto">
          {/* Row 1 */}
          <div className="flex gap-6 justify-center md:justify-start flex-wrap">
            <ParticipantTile 
              image={participants[0].image} 
              name={participants[0].name}
              isPinned={false}
              onTogglePin={() => togglePin(0)}
              showCameraOff={!isVideoEnabled}
            />
            <ParticipantTile 
              image={participants[1].image} 
              name={participants[1].name}
              isPinned={false}
              onTogglePin={() => togglePin(1)}
              showCameraOff={!isVideoEnabled}
            />
          </div>

          {/* Row 2 */}
          <div className="flex gap-6 justify-center md:justify-start flex-wrap">
            <ParticipantTile 
              image={participants[2].image} 
              name={participants[2].name}
              isPinned={false}
              onTogglePin={() => togglePin(2)}
              showCameraOff={!isVideoEnabled}
            />
            <ParticipantTile 
              image={participants[3].image} 
              name={participants[3].name}
              isPinned={false}
              onTogglePin={() => togglePin(3)}
              showCameraOff={!isVideoEnabled}
            />
          </div>

          {/* Row 3 */}
          <div className="flex gap-6 justify-center md:justify-start flex-wrap">
            <ParticipantTile 
              image={participants[4].image} 
              name={participants[4].name}
              isPinned={false}
              onTogglePin={() => togglePin(4)}
              showCameraOff={!isVideoEnabled}
            />
            <ParticipantTile 
              image={participants[5].image} 
              name={participants[5].name}
              isPinned={false}
              onTogglePin={() => togglePin(5)}
              showCameraOff={!isVideoEnabled}
            />
          </div>
        </div>
      </div>

      {/* Page Navigation - Top Right */}
      <div className="absolute top-6 right-6 flex items-center gap-2 text-white z-20">
        <button 
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="disabled:opacity-30 hover:opacity-80 transition-opacity"
        >
          <ArrowIcon direction="left" />
        </button>
        <p className="text-[16px]">
          <span className="text-white font-medium">{currentPage}</span>
          <span className="text-[rgba(255,255,255,0.7)]">/{totalPages}</span>
        </p>
        <button 
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="disabled:opacity-30 hover:opacity-80 transition-opacity"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-12 pb-6 pt-4">
        
        {/* Left: Time Elapsed & Mode */}
        <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/5">
          <p className="text-[16px] text-[rgba(255,255,255,0.7)]">
            <span className="font-medium text-white">Time Elapsed: </span>
            {formatElapsedTime(timeElapsed)}
          </p>
          <div className="h-[20px] w-[1px] bg-white/30" />
          <p className="font-medium text-[16px] text-white">Silent Mode</p>
        </div>

        {/* Center: Navigation Icons */}
        <div className="hidden md:flex bg-[rgba(255,255,255,0.1)] backdrop-blur-xl gap-6 px-8 py-2 h-[52px] items-center justify-center rounded-[20px] border border-white/10">
          <button 
            onClick={() => setIsTimerPanelOpen(!isTimerPanelOpen)}
            className={`flex items-center justify-center size-[52px] rounded-full transition-all ${isTimerPanelOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <TimerIcon />
          </button>
          <button 
            onClick={() => setIsBlockNotificationsPanelOpen(!isBlockNotificationsPanelOpen)}
            className={`flex items-center justify-center size-[52px] rounded-full transition-all ${isBlockNotificationsPanelOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <BellIcon />
          </button>
          <button 
            onClick={() => setIsNotesPanelOpen(!isNotesPanelOpen)}
            className={`flex items-center justify-center size-[52px] rounded-full transition-all ${isNotesPanelOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <div className="scale-y-[-100%]">
              <NotesIcon />
            </div>
          </button>
          <button 
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
            className={`flex items-center justify-center size-[52px] rounded-full transition-all ${!isVideoEnabled ? 'bg-[#cc3636]/80' : 'hover:bg-white/10'}`}
          >
            <VideoIcon />
          </button>
          <button 
            onClick={() => setIsPeoplePanelOpen(!isPeoplePanelOpen)}
            className={`flex items-center justify-center size-[52px] rounded-full transition-all ${isPeoplePanelOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <PeopleIcon />
          </button>
          <button 
            onClick={() => setIsReactionBarVisible(!isReactionBarVisible)}
            className={`flex items-center justify-center size-[52px] rounded-full transition-all scale-[0.8] ${isReactionBarVisible ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <EmojiIcon />
          </button>
        </div>

        {/* Right: Leave Room Button */}
        <button 
          onClick={onLeave}
          className="bg-[#cc3636] hover:bg-[#b32e2e] active:scale-95 px-6 py-3 h-[42px] rounded-[24px] transition-all"
        >
          <p className="font-semibold text-[16px] text-white whitespace-nowrap">Leave Room</p>
        </button>
      </div>

      {/* Reaction Bar */}
      <ReactionBar isVisible={isReactionBarVisible} onReactionSelect={handleReactionSelect} />

      {/* Focus Timer Panel */}
      <FocusTimerPanel isOpen={isTimerPanelOpen} onClose={() => setIsTimerPanelOpen(false)} onTimerStart={handleTimerStart} />
      {/* Timer Notification */}
      <TimerNotification 
        visible={timerNotification.visible} 
        name={timerNotification.name} 
        duration={timerNotification.duration} 
        onClose={handleCloseNotification} 
      />
      {/* Notes Panel */}
      <NotesPanel isOpen={isNotesPanelOpen} onClose={() => setIsNotesPanelOpen(false)} />
      {/* People Panel */}
      {isPeoplePanelOpen && (
        <PeoplePanel 
          onClose={() => setIsPeoplePanelOpen(false)}
          participants={participants}
          onPinParticipant={togglePin}
          pinnedParticipantId={pinnedParticipant}
          mode="live"
        />
      )}
    </div>
  );
}