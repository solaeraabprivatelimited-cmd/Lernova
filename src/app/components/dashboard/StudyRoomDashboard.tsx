import { FocusMode } from "./FocusMode";
import { SilentModeView } from "./SilentModeView";
import { CollaborativeModeView } from "./CollaborativeModeView";
import { LiveModeView } from "./LiveModeView";
import { MentorSupport } from "@/app/components/MentorSupport";
import { AiMentorHome } from "@/app/components/AiMentorHome";
import { AiMentorVoiceChat } from "@/app/components/AiMentorVoiceChat";
import { AiMentorChat } from "@/app/components/AiMentorChat";
import { HumanMentorHome } from "@/app/components/HumanMentorHome";
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

function IconStudyRooms({ active }: { active?: boolean }) {
  return (
    <div className="size-[20px] shrink-0">
      <svg className="block size-full" fill="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_4_117_local)">
          <path d={svgPaths.p12a85400} fill={active ? "#003566" : "rgba(0,0,0,0.6)"} />
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

function IconMentorSupport({ active }: { active?: boolean }) {
  return (
    <div className="size-[24px] shrink-0">
      <svg className="block size-full" fill="none" viewBox="0 0 24 24">
        <path 
            d={svgPaths.p16a0cd00} 
            stroke={active ? "#003566" : "black"} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeOpacity={active ? "1" : "0.6"} 
            strokeWidth="2" 
        />
      </svg>
    </div>
  );
}

function IconProductivityTools() {
  return (
    <div className="size-[24px] shrink-0 flex items-center justify-center">
       <svg className="block size-[20px]" fill="none" viewBox="0 0 20 20">
          <path d={svgPaths.p12587c80} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" />
          <path d={svgPaths.p58ba980} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" />
        </svg>
    </div>
  );
}

function IconEmotionalWellness() {
  return (
    <div className="w-[21px] h-[22px] shrink-0">
      <svg className="block size-full" fill="none" viewBox="0 0 21 22">
        <g clipPath="url(#clip0_4_104_local)">
          <path d={svgPaths.p2ab57600} fill="black" fillOpacity="0.6" />
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

function IconCommunity() {
  return (
    <div className="size-[22px] shrink-0">
      <svg className="block size-full" fill="none" viewBox="0 0 22 22">
        <path d={svgPaths.p7213140} fill="black" fillOpacity="0.6" />
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
  onClick
}: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean,
  onClick?: () => void
}) => {
  return (
    <div 
        onClick={onClick}
        className={`w-full h-[42px] rounded-[10px] flex items-center px-4 gap-[10px] cursor-pointer transition-colors ${active ? 'bg-[#c9e5ff]' : 'hover:bg-gray-100'}`}
    >
      {icon}
      <span className={`font-['Poppins'] text-[14px] ${active ? 'text-[#003566]' : 'text-black/60'}`}>
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
  onClick
}: { 
  title: string, 
  description: string, 
  imageSrc: string, 
  overlayGradient?: string,
  onClick?: () => void
}) => {
  return (
    <div 
      onClick={onClick}
      className="relative w-full h-[307px] rounded-[20px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
         <ImageWithFallback src={imageSrc} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      
      {/* Overlay */}
      <div 
        className="absolute inset-0" 
        style={{ 
          background: overlayGradient || "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)" 
        }} 
      />
      
      {/* Content */}
      <div className="absolute top-6 left-6 right-6 text-white z-10">
        <h3 className="font-['Poppins'] font-semibold text-[20px] mb-1 text-shadow-sm shadow-black/30">
          {title}
        </h3>
        <p className="font-['Poppins'] text-[12px] opacity-90 text-shadow-sm shadow-black/30 max-w-[90%]">
          {description}
        </p>
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
        icon={<IconProductivityTools />} 
        label="Productivity Tools" 
        active={activeSection === "Productivity Tools"}
        onClick={() => onNavigate("Productivity Tools")}
      />
      <SidebarItem 
        icon={<IconEmotionalWellness />} 
        label="Emotional Wellness" 
        active={activeSection === "Emotional Wellness"}
        onClick={() => onNavigate("Emotional Wellness")}
      />
      <SidebarItem 
        icon={<IconCommunity />} 
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

  const modes = [
    {
      title: "Focus Mode",
      description: "Eliminate distractions and dive deep into your study flow.",
      image: imgImage7,
      gradient: "linear-gradient(-14.91deg, rgba(0, 0, 0, 0) 53.28%, rgba(0, 0, 0, 0.6) 73.54%)"
    },
    {
      title: "Silent Mode",
      description: "Study quietly with others — no noise, just focus.",
      image: imgImage8,
      gradient: "linear-gradient(-11.91deg, rgba(0, 0, 0, 0) 51.27%, rgba(0, 0, 0, 0.5) 63.44%)"
    },
    {
      title: "Collaborative Mode",
      description: "Work together, share ideas, and grow as a team.",
      image: imgGeminiGeneratedImage4Hg50Q4Hg50Q4Hg51,
      gradient: "linear-gradient(-6.92deg, rgba(0, 0, 0, 0) 44.45%, rgba(0, 0, 0, 0.6) 61.07%)"
    },
    {
      title: "Live Mode",
      description: "Connect with active learners from across the world.",
      image: imgImage9,
      gradient: "linear-gradient(-6.8deg, rgba(0, 0, 0, 0) 46.43%, rgba(0, 0, 0, 0.5) 76.34%)"
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

  return (
    <div className="flex w-full min-h-screen bg-white font-['Poppins']">
      {/* Desktop Sidebar */}
      <aside className="w-[280px] shrink-0 bg-white border-r border-gray-100 flex-col p-8 sticky top-0 h-screen z-20 hidden lg:flex">
        <SidebarContent 
            activeSection={activeSection} 
            onNavigate={(section) => setActiveSection(section)} 
            onLogout={onLogout}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-24 px-4 md:px-12 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
            {/* Mobile Menu Trigger & Logo */}
            <div className="flex items-center gap-4 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 -ml-2 hover:bg-gray-100 rounded-md">
                    <Menu className="size-6 text-[#003566]" />
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
              
              <div className="flex items-center gap-2">
                 <LogoIcon />
                 <span className="font-['Righteous'] text-[#003566] text-[18px]">Learnova</span>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6 ml-auto">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                    <IconBell />
                    {/* Notification dot */}
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                    <div className="size-[32px] md:size-[38px] rounded-full overflow-hidden border border-gray-200">
                        <ImageWithFallback src={imgEllipse1} alt="User" className="size-full object-cover" />
                    </div>
                    <span className="hidden sm:block text-[16px] text-black font-medium">Jack Sparrow</span>
                </div>
            </div>
        </header>

        {/* Dashboard Content Area */}
        <div className="p-4 md:p-8 lg:p-12 max-w-[1200px] w-full mx-auto">
            {activeSection === "Study Rooms" && (
                <>
                    <div className="mb-8 md:mb-10">
                        <h1 className="text-[28px] md:text-[32px] lg:text-[40px] font-medium text-black mb-1">Study Rooms</h1>
                        <p className="text-[14px] text-black/60">Choose the way you want to study.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {modes.map((mode, idx) => (
                            <StudyModeCard 
                                key={idx}
                                title={mode.title}
                                description={mode.description}
                                imageSrc={mode.image}
                                overlayGradient={mode.gradient}
                                onClick={() => {
                                  if (mode.title === "Focus Mode") setActiveMode("Focus Mode");
                                  if (mode.title === "Silent Mode") setActiveMode("Silent Mode");
                                  if (mode.title === "Collaborative Mode") setActiveMode("Collaborative Mode");
                                  if (mode.title === "Live Mode") setActiveMode("Live Mode");
                                }}
                            />
                        ))}
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

            {/* If section is not one of the main ones and not handled above, show coming soon */}
            {activeSection !== "Study Rooms" && activeSection !== "Mentor Support" && activeSection !== "Human Mentor" && !activeSection.startsWith("AI Mentor") && (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                    <h2 className="text-2xl font-semibold text-gray-400 mb-2">Coming Soon</h2>
                    <p className="text-gray-400">The {activeSection} feature is currently under development.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
