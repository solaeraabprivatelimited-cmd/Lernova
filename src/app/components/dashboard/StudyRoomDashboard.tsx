import { FocusMode } from "./FocusMode";
import { SilentModeView } from "./SilentModeView";
import { CollaborativeModeView } from "./CollaborativeModeView";
import { LiveModeView } from "./LiveModeView";
import { MentorSupport } from "@/app/components/MentorSupport";
import { AiMentorHome } from "@/app/components/AiMentorHome";
import { AiMentorVoiceChat } from "@/app/components/AiMentorVoiceChat";
import { AiMentorChat } from "@/app/components/AiMentorChat";
import { HumanMentorHome } from "@/app/components/HumanMentorHome";
import { ProductivityToolsView } from "./ProductivityToolsView";
import { EmotionalWellnessView } from "./EmotionalWellnessView";
import { CommunityView } from "./CommunityView";
import { NotificationsPopup } from "./NotificationsPopup";
import { ProfilePopup } from "./ProfilePopup";
import { UserProfileSettings } from "./UserProfileSettings";
import React from 'react';
import svgPaths from '@/imports/svg-87v94e0bse';
import imgEllipse1 from "figma:asset/798eac6e288222603807db12d070c52d1a145785.png";
import imgImage7 from "figma:asset/0212989c3ffa08119e6582c26d9f347c2e8a406d.png";
import imgImage8 from "figma:asset/8643ef745dc740dbe68627d062699360ad50fd60.png";
import imgGeminiGeneratedImage4Hg50Q4Hg50Q4Hg51 from "figma:asset/ec6f13f5c7ac6761a2610bea1df244d79d48dd2b.png";
import imgImage9 from "figma:asset/a8edce0ddd1121ba27a502e71878a023f16660b8.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/app/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";

// --- Icons Components based on Figma Import ---

function LogoIcon() {
  return (
    <div className="size-[35px] relative">
      <svg className="block size-full" fill="none" viewBox="0 0 35 35">
        <g id="Frame 26">
          <g id="Vector 10">
            <path d={svgPaths.p3781200} fill="#003566" />
            <path d={svgPaths.p1c6f2500} stroke="#003566" strokeWidth="0.245515" />
          </g>
          <g id="Vector 9">
            <path d={svgPaths.p31318300} fill="#003566" />
            <path d={svgPaths.p275764f0} stroke="#003566" strokeWidth="0.23811" />
          </g>
          <circle cx="17.5" cy="17.5" id="Ellipse 7" r="15.8594" stroke="#003566" strokeWidth="3.28125" />
          <g clipPath="url(#clip0_1_784_local)">
            <path clipRule="evenodd" d={svgPaths.p2338ef00} fill="#F77F00" fillRule="evenodd" />
          </g>
          <g clipPath="url(#clip1_1_784_local)">
            <path clipRule="evenodd" d={svgPaths.p17aefc80} fill="#F77F00" fillRule="evenodd" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_784_local">
            <rect fill="white" height="10.5795" transform="translate(10.4914 20.704) rotate(-11.508)" width="10.5795" />
          </clipPath>
          <clipPath id="clip1_1_784_local">
            <rect fill="white" height="10.2012" transform="translate(11.5055 10.7851) rotate(-11.508)" width="10.2012" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function LogoIconLight() {
  return (
    <div className="size-[35px] relative">
      <svg className="block size-full" fill="none" viewBox="0 0 35 35">
        <g>
          <g>
            <path d={svgPaths.p3781200} fill="white" />
            <path d={svgPaths.p1c6f2500} stroke="white" strokeWidth="0.245515" />
          </g>
          <g>
            <path d={svgPaths.p31318300} fill="white" />
            <path d={svgPaths.p275764f0} stroke="white" strokeWidth="0.23811" />
          </g>
          <circle cx="17.5" cy="17.5" r="15.8594" stroke="white" strokeWidth="3.28125" />
          <g clipPath="url(#clip0_light)">
            <path clipRule="evenodd" d={svgPaths.p2338ef00} fill="#F77F00" fillRule="evenodd" />
          </g>
          <g clipPath="url(#clip1_light)">
            <path clipRule="evenodd" d={svgPaths.p17aefc80} fill="#F77F00" fillRule="evenodd" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_light">
            <rect fill="white" height="10.5795" transform="translate(10.4914 20.704) rotate(-11.508)" width="10.5795" />
          </clipPath>
          <clipPath id="clip1_light">
            <rect fill="white" height="10.2012" transform="translate(11.5055 10.7851) rotate(-11.508)" width="10.2012" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconStudyRooms({ active, light }: { active?: boolean; light?: boolean }) {
  return (
    <div className="size-[20px] shrink-0">
      <svg className="block size-full" fill="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_4_117_local)">
          <path d={svgPaths.p12a85400} fill={light ? (active ? "white" : "rgba(255,255,255,0.5)") : (active ? "#003566" : "rgba(0,0,0,0.6)")} />
        </g>
        <defs>
          <clipPath id="clip0_4_117_local">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconMentorSupport({ active, light }: { active?: boolean; light?: boolean }) {
  return (
    <div className="size-[24px] shrink-0">
      <svg className="block size-full" fill="none" viewBox="0 0 24 24">
        <path 
            d={svgPaths.p16a0cd00} 
            stroke={light ? "white" : (active ? "#003566" : "black")} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeOpacity={light ? (active ? "1" : "0.5") : (active ? "1" : "0.6")} 
            strokeWidth="2" 
        />
      </svg>
    </div>
  );
}

function IconProductivityTools({ active, light }: { active?: boolean; light?: boolean }) {
  return (
    <div className="size-[24px] shrink-0 flex items-center justify-center">
       <svg className="block size-[20px]" fill="none" viewBox="0 0 20 20">
          <path d={svgPaths.p12587c80} stroke={light ? "white" : (active ? "#003566" : "black")} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={light ? (active ? "1" : "0.5") : (active ? "1" : "0.6")} strokeWidth="2" />
          <path d={svgPaths.p58ba980} stroke={light ? "white" : (active ? "#003566" : "black")} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={light ? (active ? "1" : "0.5") : (active ? "1" : "0.6")} strokeWidth="2" />
        </svg>
    </div>
  );
}

function IconEmotionalWellness({ active, light }: { active?: boolean; light?: boolean }) {
  return (
    <div className="w-[21px] h-[22px] shrink-0">
      <svg className="block size-full" fill="none" viewBox="0 0 21 22">
        <g clipPath="url(#clip0_4_104_local)">
          <path d={svgPaths.p2ab57600} fill={light ? "white" : (active ? "#003566" : "black")} fillOpacity={light ? (active ? "1" : "0.5") : (active ? "1" : "0.6")} />
        </g>
        <defs>
          <clipPath id="clip0_4_104_local">
            <rect fill="white" height="22" width="21" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconCommunity({ active, light }: { active?: boolean; light?: boolean }) {
  return (
    <div className="size-[22px] shrink-0">
      <svg className="block size-full" fill="none" viewBox="0 0 22 22">
        <path d={svgPaths.p7213140} fill={light ? "white" : (active ? "#003566" : "black")} fillOpacity={light ? (active ? "1" : "0.5") : (active ? "1" : "0.6")} />
      </svg>
    </div>
  );
}

function IconBell() {
  return (
    <div className="size-[26px] shrink-0 flex items-center justify-center">
       <svg className="block w-[19px] h-[21px]" fill="none" viewBox="0 0 19.3505 21.5167">
          <path d={svgPaths.p13baf700} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.01667" />
        </svg>
    </div>
  );
}

// --- Main Components ---

const SidebarItem = ({ 
  icon, 
  label, 
  active = false,
  onClick,
  variant = "light"
}: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean,
  onClick?: () => void,
  variant?: "light" | "dark"
}) => {
  const isDark = variant === "dark";
  return (
    <div 
        onClick={onClick}
        className={`w-full h-[44px] rounded-[12px] flex items-center px-4 gap-[12px] cursor-pointer transition-all duration-200 group relative ${
          isDark
            ? (active 
                ? 'bg-white/[0.12] shadow-[0_0_12px_rgba(255,255,255,0.05)]' 
                : 'hover:bg-white/[0.06]')
            : (active 
                ? 'bg-[#c9e5ff]' 
                : 'hover:bg-gray-100')
        }`}
    >
      {/* Active indicator bar */}
      {active && isDark && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[20px] rounded-r-full bg-[#f77f00]" />
      )}
      <div className={`transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className={`text-[14px] font-medium transition-colors duration-200 ${
        isDark
          ? (active ? 'text-white font-semibold' : 'text-white/50 group-hover:text-white/70')
          : (active ? 'text-[#003566]' : 'text-black/60')
      }`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {label}
      </span>
    </div>
  );
};

const StudyModeCard = ({ 
  title, 
  description, 
  imageSrc, 
  overlayGradient,
  onClick,
  tag,
  liveCount,
  iconSvg,
  accentColor,
  number,
}: { 
  title: string, 
  description: string, 
  imageSrc: string, 
  overlayGradient?: string,
  onClick?: () => void,
  tag?: string,
  liveCount?: number,
  iconSvg?: React.ReactNode,
  accentColor?: string,
  number?: string,
}) => {
  return (
    <div 
      onClick={onClick}
      className="relative w-full rounded-[20px] overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      style={{ minHeight: 220 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
         <ImageWithFallback src={imageSrc} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 transition-opacity duration-300" 
        style={{ 
          background: overlayGradient || "linear-gradient(180deg, rgba(0,53,102,0.1) 0%, rgba(0,53,102,0.85) 100%)" 
        }} 
      />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {tag && (
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                style={{ background: 'rgba(247,127,0,0.25)', color: '#f77f00', border: '1px solid rgba(247,127,0,0.3)' }}>
                {tag}
              </span>
            )}
          </div>
          {liveCount != null && liveCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/10">
              <span className="w-[6px] h-[6px] rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-[11px] font-semibold text-white">{liveCount} online</span>
            </div>
          )}
        </div>

        {/* Bottom content */}
        <div>
          {number && (
            <span className="text-[48px] font-bold leading-none text-white/10 block mb-1"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              {number}
            </span>
          )}
          <div className="flex items-center gap-3 mb-2">
            {iconSvg && (
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                style={{ background: accentColor || 'rgba(255,255,255,0.15)' }}>
                {iconSvg}
              </div>
            )}
            <h3 className="font-semibold text-[20px] text-white leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {title}
            </h3>
          </div>
          <p className="text-[13px] text-white/70 leading-relaxed max-w-[90%]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {description}
          </p>
          {/* Enter button */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-bold transition-all"
              style={{ background: accentColor || '#0967bd', color: 'white' }}>
              Enter Room
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarContent = ({ 
  activeSection, 
  onNavigate,
  onLogout
}: { 
  activeSection: string, 
  onNavigate: (section: string) => void,
  onLogout?: () => void
}) => (
  <div className="flex flex-col h-full">
    {/* Logo */}
    <div className="flex items-center gap-3 mb-12">
       <LogoIcon />
       <span className="font-['Righteous'] text-[#003566] text-[20px]">Learnova</span>
    </div>

    {/* Menu Label */}
    <div className="mb-4">
      <p className="text-[14px] text-black/60 pl-4">Main Menu</p>
    </div>

    {/* Menu Items */}
    <div className="flex flex-col gap-2 flex-1">
      <SidebarItem 
        icon={<IconStudyRooms active={activeSection === "Study Rooms"} />} 
        label="Study Rooms" 
        active={activeSection === "Study Rooms"}
        onClick={() => onNavigate("Study Rooms")}
      />
      <SidebarItem 
        icon={<IconMentorSupport active={activeSection === "Mentor Support" || activeSection.startsWith("AI Mentor") || activeSection === "Human Mentor"} />} 
        label="Mentor Support" 
        active={activeSection === "Mentor Support" || activeSection.startsWith("AI Mentor") || activeSection === "Human Mentor"}
        onClick={() => onNavigate("Mentor Support")}
      />
      <SidebarItem 
        icon={<IconProductivityTools active={activeSection === "Productivity Tools"} />} 
        label="Productivity Tools" 
        active={activeSection === "Productivity Tools"}
        onClick={() => onNavigate("Productivity Tools")}
      />
      <SidebarItem 
        icon={<IconEmotionalWellness active={activeSection === "Emotional Wellness"} />} 
        label="Emotional Wellness" 
        active={activeSection === "Emotional Wellness"}
        onClick={() => onNavigate("Emotional Wellness")}
      />
      <SidebarItem 
        icon={<IconCommunity active={activeSection === "Community"} />} 
        label="Community" 
        active={activeSection === "Community"}
        onClick={() => onNavigate("Community")}
      />
    </div>
    
    {/* Logout Button */}
    <div className="mt-auto pt-4 border-t border-gray-100">
      <SidebarItem 
        icon={<LogOut size={20} className="text-black/60" />} 
        label="Log Out" 
        onClick={onLogout}
      />
    </div>
  </div>
);

export function StudyRoomDashboard({ onLogout }: { onLogout?: () => void }) {
  const [activeMode, setActiveMode] = React.useState<string | null>(null);
  const [activeSection, setActiveSection] = React.useState("Study Rooms");
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);

  const modes = [
    {
      title: "Focus Mode",
      description: "Pomodoro timers, ambient sounds, and note tools. Your personal distraction-free study sanctuary.",
      image: imgImage7,
      gradient: "linear-gradient(180deg, rgba(0,53,102,0.05) 0%, rgba(0,53,102,0.88) 100%)",
      tag: "Most Popular",
      liveCount: 128,
      accentColor: "#f77f00",
      number: "01",
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
        </svg>
      ),
    },
    {
      title: "Silent Mode",
      description: "Study with peers for shared accountability — no noise, just presence and mutual motivation.",
      image: imgImage8,
      gradient: "linear-gradient(180deg, rgba(0,20,60,0.05) 0%, rgba(0,20,60,0.85) 100%)",
      liveCount: 56,
      accentColor: "#0967bd",
      number: "02",
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      ),
    },
    {
      title: "Collaborative Mode",
      description: "Work together with your study group — share notes, ideas, and resources in real time.",
      image: imgGeminiGeneratedImage4Hg50Q4Hg50Q4Hg51,
      gradient: "linear-gradient(180deg, rgba(0,30,70,0.05) 0%, rgba(0,30,70,0.88) 100%)",
      liveCount: 34,
      accentColor: "#7c3aed",
      number: "03",
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      ),
    },
    {
      title: "Live Mode",
      description: "Interactive study jams or mentor-led live sessions with real-time video and Q&A.",
      image: imgImage9,
      gradient: "linear-gradient(180deg, rgba(0,10,40,0.05) 0%, rgba(0,10,40,0.88) 100%)",
      liveCount: 12,
      accentColor: "#e63946",
      number: "04",
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
        </svg>
      ),
    }
  ];

  if (activeMode === "Focus Mode") {
    return <FocusMode onLeave={() => setActiveMode(null)} />;
  }

  if (activeMode === "Silent Mode") {
    return <SilentModeView onLeave={() => setActiveMode(null)} />;
  }

  if (activeMode === "Collaborative Mode") {
    return <CollaborativeModeView onLeave={() => setActiveMode(null)} />;
  }

  if (activeMode === "Live Mode") {
    return <LiveModeView onLeave={() => setActiveMode(null)} />;
  }

  // --- Router Logic for AI Mentor ---
  
  if (activeSection === "AI Mentor") {
    return (
      <AiMentorHome 
        onBack={() => setActiveSection("Mentor Support")} 
        onVoiceMode={() => setActiveSection("AI Mentor Voice")}
        onChatMode={() => setActiveSection("AI Mentor Chat")}
      />
    );
  }

  if (activeSection === "AI Mentor Voice") {
    return (
      <AiMentorVoiceChat 
        onBack={() => setActiveSection("Mentor Support")}
        onTextMode={() => setActiveSection("AI Mentor Chat")}
      />
    );
  }

  if (activeSection === "AI Mentor Chat") {
    return (
      <AiMentorChat
        onBack={() => setActiveSection("Mentor Support")}
        onVoiceMode={() => setActiveSection("AI Mentor Voice")}
      />
    );
  }

  // Profile Settings full-screen
  if (activeSection === "Profile Settings") {
    return (
      <div className="flex w-full min-h-screen bg-white font-['Poppins']">
        <UserProfileSettings onBack={() => setActiveSection("Study Rooms")} />
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-white font-['Poppins']">
      {/* Desktop Sidebar */}
      <aside
        className="w-[280px] shrink-0 flex-col sticky top-0 h-screen z-20 hidden lg:flex overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #001d3d 0%, #003566 50%, #001d3d 100%)',
        }}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative flex flex-col h-full p-7">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <LogoIconLight />
            <span className="font-['Righteous'] text-white text-[20px]">Learnova</span>
          </div>

          {/* Menu Label */}
          <div className="mb-4 pl-4">
            <p className="text-[11px] font-semibold text-white/25 uppercase tracking-[0.15em]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Main Menu
            </p>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col gap-1.5 flex-1">
            <SidebarItem
              icon={<IconStudyRooms active={activeSection === "Study Rooms"} light />}
              label="Study Rooms"
              active={activeSection === "Study Rooms"}
              onClick={() => setActiveSection("Study Rooms")}
              variant="dark"
            />
            <SidebarItem
              icon={<IconMentorSupport active={activeSection === "Mentor Support" || activeSection.startsWith("AI Mentor") || activeSection === "Human Mentor"} light />}
              label="Mentor Support"
              active={activeSection === "Mentor Support" || activeSection.startsWith("AI Mentor") || activeSection === "Human Mentor"}
              onClick={() => setActiveSection("Mentor Support")}
              variant="dark"
            />
            <SidebarItem
              icon={<IconProductivityTools active={activeSection === "Productivity Tools"} light />}
              label="Productivity Tools"
              active={activeSection === "Productivity Tools"}
              onClick={() => setActiveSection("Productivity Tools")}
              variant="dark"
            />
            <SidebarItem
              icon={<IconEmotionalWellness active={activeSection === "Emotional Wellness"} light />}
              label="Emotional Wellness"
              active={activeSection === "Emotional Wellness"}
              onClick={() => setActiveSection("Emotional Wellness")}
              variant="dark"
            />
            <SidebarItem
              icon={<IconCommunity active={activeSection === "Community"} light />}
              label="Community"
              active={activeSection === "Community"}
              onClick={() => setActiveSection("Community")}
              variant="dark"
            />
          </div>

          {/* Bottom section */}
          <div className="mt-auto flex flex-col gap-3">
            {/* Mini user card */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-[14px] bg-white/[0.06] border border-white/[0.06]">
              <div className="size-[32px] rounded-full overflow-hidden border border-white/[0.15] shrink-0">
                <ImageWithFallback src={imgEllipse1} alt="User" className="size-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white/80 truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Jack Sparrow</p>
                <p className="text-[11px] text-white/30">Student</p>
              </div>
            </div>

            {/* Logout */}
            <div className="border-t border-white/[0.06] pt-3">
              <SidebarItem
                icon={<LogOut size={18} className="text-white/50" />}
                label="Log Out"
                onClick={onLogout}
                variant="dark"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        

        {/* Dashboard Content Area */}
        <div className="flex-1 overflow-y-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {/* ── Integrated Top Bar ── */}
          <div className="sticky top-0 z-10 px-6 md:px-10 lg:px-12 py-4 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
            <div className="flex items-center justify-between max-w-[1200px] mx-auto">
              {/* Left: Greeting */}
              <div className="flex items-center gap-4 lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="p-2 -ml-2 hover:bg-gray-100 rounded-[12px] transition-colors cursor-pointer">
                      <Menu className="size-5 text-[#003566]" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px] p-8 bg-white">
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <SheetDescription className="sr-only">Mobile navigation menu</SheetDescription>
                    <SidebarContent
                      activeSection={activeSection}
                      onNavigate={(section) => setActiveSection(section)}
                      onLogout={onLogout}
                    />
                  </SheetContent>
                </Sheet>
              </div>

              <div className="hidden lg:block">
                <h2 className="text-[18px] font-bold text-[#003566]">
                  {activeSection === "Study Rooms" ? "Dashboard" : activeSection}
                </h2>
              </div>

              {/* Right: Search, Notifications, Profile */}
              <div className="flex items-center gap-2 md:gap-3 ml-auto">
                {/* Search */}
                <div className="hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-[14px] bg-[#f5f7fa] border border-transparent hover:border-[#e2e8f0] transition-all w-[240px] group">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 text-[#94a3b8] group-focus-within:text-[#0967bd] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search rooms, tools..."
                    className="bg-transparent text-[13px] text-[#334155] placeholder:text-[#94a3b8] outline-none w-full"
                  />
                </div>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications((prev) => !prev);
                      setShowProfile(false);
                    }}
                    className="relative w-10 h-10 rounded-[12px] bg-[#f5f7fa] hover:bg-[#edf2f7] flex items-center justify-center transition-all cursor-pointer"
                  >
                    <IconBell />
                    <span className="absolute top-2 right-2.5 size-2 bg-[#e63946] rounded-full border-[1.5px] border-white" />
                  </button>
                  <NotificationsPopup
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                  />
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-[#e2e8f0] hidden sm:block" />

                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowProfile((prev) => !prev);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity pl-1"
                  >
                    <div className="size-[36px] rounded-[12px] overflow-hidden border-2 border-[#e2e8f0] hover:border-[#0967bd] transition-colors">
                      <ImageWithFallback src={imgEllipse1} alt="User" className="size-full object-cover" />
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-[13px] font-semibold text-[#1e293b] leading-tight">Jack Sparrow</span>
                      <span className="text-[11px] text-[#94a3b8] leading-tight">Student</span>
                    </div>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#94a3b8] hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <ProfilePopup
                    isOpen={showProfile}
                    onClose={() => setShowProfile(false)}
                    onProfileSettings={() => setActiveSection("Profile Settings")}
                    onLogout={() => onLogout?.()}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Page Content ── */}
          <div className="px-6 md:px-10 lg:px-12 py-6 md:py-8 max-w-[1200px] w-full mx-auto">
            {activeSection === "Study Rooms" && (
              <>
                {/* ── Welcome Hero Banner ── */}
                <div className="relative rounded-[24px] overflow-hidden mb-8 md:mb-10"
                  style={{ background: 'linear-gradient(135deg, #001d3d 0%, #003566 50%, #0967bd 100%)' }}>
                  {/* Decorative circles */}
                  <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full opacity-[0.06]"
                    style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />
                  <div className="absolute -bottom-10 -left-10 w-[200px] h-[200px] rounded-full opacity-[0.04]"
                    style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />

                  <div className="relative z-10 px-6 md:px-10 py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Left content */}
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                        style={{ background: 'rgba(247,127,0,0.15)', border: '1px solid rgba(247,127,0,0.25)' }}>
                        <span className="w-[6px] h-[6px] rounded-full bg-[#22c55e] animate-pulse" />
                        <span className="text-[12px] font-semibold text-[#f77f00]">230 learners studying now</span>
                      </div>
                      <h1 className="text-[28px] md:text-[36px] lg:text-[40px] text-white mb-3 leading-[1.1]"
                        style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Your Study<br className="hidden md:block" /> Command Center
                      </h1>
                      <p className="text-[14px] md:text-[15px] text-white/50 max-w-[420px] leading-relaxed">
                        Four distinct room modes tailored to every learning style — pick the one that fits your vibe today.
                      </p>
                    </div>

                    {/* Right: Quick stats */}
                    <div className="flex gap-3 shrink-0">
                      {[
                        { value: "4", label: "Modes", icon: "◆" },
                        { value: "100+", label: "Rooms", icon: "◈" },
                        { value: "5K+", label: "Users", icon: "◉" },
                      ].map((stat) => (
                        <div key={stat.label}
                          className="flex flex-col items-center px-5 py-4 rounded-[18px] min-w-[80px]"
                          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                          <span className="text-[24px] font-bold text-white leading-none mb-1"
                            style={{ fontFamily: "'DM Serif Display', serif" }}>
                            {stat.value}
                          </span>
                          <span className="text-[10px] font-semibold text-white/35 uppercase tracking-[0.12em]">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Section Label ── */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-5 rounded-full bg-[#f77f00]" />
                    <h2 className="text-[16px] font-bold text-[#003566]">Choose Your Room</h2>
                  </div>
                  <span className="text-[12px] font-medium text-[#94a3b8]">{modes.length} available</span>
                </div>

                {/* ── Featured Mode (Focus) — Large Hero Card ── */}
                <div
                  onClick={() => setActiveMode("Focus Mode")}
                  className="relative w-full rounded-[22px] overflow-hidden mb-5 cursor-pointer group transition-all duration-300 hover:shadow-2xl"
                  style={{ minHeight: 280 }}
                >
                  <div className="absolute inset-0">
                    <ImageWithFallback src={modes[0].image} alt={modes[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="absolute inset-0" style={{ background: modes[0].gradient }} />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-7 md:p-9" style={{ minHeight: 280 }}>
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
                          style={{ background: 'rgba(247,127,0,0.2)', color: '#f77f00', border: '1px solid rgba(247,127,0,0.25)', backdropFilter: 'blur(8px)' }}>
                          ★ Most Popular
                        </span>
                        <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-white/70"
                          style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                          Featured
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <span className="w-[6px] h-[6px] rounded-full bg-[#22c55e] animate-pulse" />
                        <span className="text-[11px] font-semibold text-white">{modes[0].liveCount} online</span>
                      </div>
                    </div>

                    {/* Bottom content */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                      <div className="flex-1">
                        <span className="text-[56px] md:text-[72px] font-bold leading-none text-white/[0.06] block -mb-3"
                          style={{ fontFamily: "'DM Serif Display', serif" }}>01</span>
                        <div className="flex items-center gap-3.5 mb-2.5">
                          <div className="w-11 h-11 rounded-[14px] flex items-center justify-center"
                            style={{ background: modes[0].accentColor }}>
                            {modes[0].iconSvg}
                          </div>
                          <h3 className="font-bold text-[24px] md:text-[28px] text-white leading-tight"
                            style={{ fontFamily: "'DM Serif Display', serif" }}>
                            {modes[0].title}
                          </h3>
                        </div>
                        <p className="text-[14px] text-white/60 leading-relaxed max-w-[500px]">
                          {modes[0].description}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                        <span className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-[14px] font-bold shadow-xl transition-transform"
                          style={{ background: modes[0].accentColor, color: 'white', boxShadow: `0 8px 30px ${modes[0].accentColor}60` }}>
                          Enter Room
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Other 3 Modes — Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {modes.slice(1).map((mode, idx) => (
                    <div
                      key={mode.title}
                      onClick={() => setActiveMode(mode.title)}
                      className="relative rounded-[20px] overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      style={{ minHeight: 240 }}
                    >
                      <div className="absolute inset-0">
                        <ImageWithFallback src={mode.image} alt={mode.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <div className="absolute inset-0" style={{ background: mode.gradient }} />

                      <div className="relative z-10 h-full flex flex-col justify-between p-5" style={{ minHeight: 240 }}>
                        {/* Top */}
                        <div className="flex items-start justify-between">
                          <span className="text-[40px] font-bold leading-none text-white/[0.07]"
                            style={{ fontFamily: "'DM Serif Display', serif" }}>
                            {mode.number}
                          </span>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                            <span className="w-[5px] h-[5px] rounded-full bg-[#22c55e] animate-pulse" />
                            <span className="text-[10px] font-semibold text-white">{mode.liveCount}</span>
                          </div>
                        </div>

                        {/* Bottom */}
                        <div>
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-9 h-9 rounded-[11px] flex items-center justify-center"
                              style={{ background: mode.accentColor }}>
                              {mode.iconSvg}
                            </div>
                            <h3 className="font-bold text-[18px] text-white leading-tight">
                              {mode.title}
                            </h3>
                          </div>
                          <p className="text-[12px] text-white/55 leading-relaxed line-clamp-2 mb-3">
                            {mode.description}
                          </p>
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold"
                              style={{ background: mode.accentColor, color: 'white' }}>
                              Enter Room
                              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Pro Tip Banner ── */}
                <div className="rounded-[20px] overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #001d3d 0%, #003566 60%, #0967bd 100%)' }}>
                  <div className="relative px-6 md:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* Decorative */}
                    <div className="absolute right-0 top-0 w-[200px] h-full opacity-[0.04]"
                      style={{ background: 'radial-gradient(ellipse at 100% 50%, white, transparent 70%)' }} />

                    <div className="w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(247,127,0,0.15)', border: '1px solid rgba(247,127,0,0.2)' }}>
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#f77f00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1 relative z-10">
                      <p className="text-[15px] font-bold text-white mb-1">
                        New to Learnova?
                      </p>
                      <p className="text-[13px] text-white/45 leading-relaxed">
                        Start with <strong className="text-[#f77f00] font-semibold">Focus Mode</strong> — it's the most popular choice for deep, distraction-free study sessions with built-in Pomodoro timers.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveMode("Focus Mode")}
                      className="relative z-10 group/btn inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-bold text-[#003566] bg-white hover:bg-[#f77f00] hover:text-white transition-all duration-300 shrink-0 shadow-lg hover:shadow-xl cursor-pointer"
                    >
                      Try Focus Mode
                      <svg viewBox="0 0 24 24" className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeSection === "Mentor Support" && (
              <MentorSupport
                onStartAiMentor={() => setActiveSection("AI Mentor")}
                onStartHumanMentor={() => setActiveSection("Human Mentor")}
              />
            )}

            {activeSection === "Human Mentor" && (
              <HumanMentorHome onBack={() => setActiveSection("Mentor Support")} />
            )}

            {activeSection === "Productivity Tools" && (
              <ProductivityToolsView />
            )}

            {activeSection === "Emotional Wellness" && (
              <EmotionalWellnessView />
            )}

            {activeSection === "Community" && (
              <CommunityView />
            )}

            {/* Coming soon fallback */}
            {activeSection !== "Study Rooms" && activeSection !== "Mentor Support" && activeSection !== "Human Mentor" && activeSection !== "Productivity Tools" && activeSection !== "Emotional Wellness" && activeSection !== "Community" && !activeSection.startsWith("AI Mentor") && (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <div className="w-16 h-16 rounded-[20px] bg-[#f5f7fa] flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h2 className="text-[20px] font-bold text-[#1e293b] mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>Coming Soon</h2>
                <p className="text-[14px] text-[#94a3b8] max-w-[320px]">The <span className="font-semibold text-[#64748b]">{activeSection}</span> feature is currently under development.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}