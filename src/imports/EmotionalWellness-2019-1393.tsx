import svgPaths from "./svg-fui5khiao7";
import imgEllipse1 from "figma:asset/1d3b37310d86db33d00fb05038f712cfa0e01556.png";

function Frame8() {
  return (
    <div className="absolute content-stretch flex flex-col items-start leading-[normal] left-[318px] not-italic pb-[6px] top-[98px]">
      <p className="font-['Poppins:Medium',sans-serif] relative shrink-0 text-[40px] text-black">Emotional Wellness</p>
      <p className="font-['Poppins:Regular',sans-serif] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">Everything you need to manage your mental health journey</p>
    </div>
  );
}

function SiHeartLine() {
  return (
    <div className="relative shrink-0 size-[46px]" data-name="si:heart-line">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46 46">
        <g id="si:heart-line">
          <path d={svgPaths.pf3ff700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full">
      <SiHeartLine />
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-white">Mood Check-In</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
      <Frame26 />
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-white w-full whitespace-pre-wrap">Share your feelings and let AI organize, track, and understand your mood journey.</p>
    </div>
  );
}

function BitcoinIconsArrowUpFilled() {
  return (
    <div className="relative size-[22px]" data-name="bitcoin-icons:arrow-up-filled">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="bitcoin-icons:arrow-up-filled">
          <path clipRule="evenodd" d={svgPaths.p16746080} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white">Start Check-In</p>
      <div className="flex items-center justify-center relative shrink-0 size-[22px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <BitcoinIconsArrowUpFilled />
        </div>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-gradient-to-r content-stretch flex flex-col from-[#f953c6] h-[308px] items-start justify-between overflow-clip p-[24px] relative rounded-[20px] shrink-0 to-[#ff5858] via-1/2 via-[#b91d73] w-[521px]">
      <Frame19 />
      <Frame25 />
    </div>
  );
}

function MageBook() {
  return (
    <div className="relative shrink-0 size-[46px]" data-name="mage:book">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46 46">
        <g id="mage:book">
          <path d={svgPaths.p2bf7e800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full">
      <MageBook />
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-white">Wellness Resources</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
      <Frame27 />
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-white w-full whitespace-pre-wrap">Access articles, videos and inspiring stories.</p>
    </div>
  );
}

function BitcoinIconsArrowUpFilled1() {
  return (
    <div className="relative size-[22px]" data-name="bitcoin-icons:arrow-up-filled">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="bitcoin-icons:arrow-up-filled">
          <path clipRule="evenodd" d={svgPaths.p16746080} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white">Explore Resources</p>
      <div className="flex items-center justify-center relative shrink-0 size-[22px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <BitcoinIconsArrowUpFilled1 />
        </div>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-gradient-to-r content-stretch flex flex-col from-[#00c6ff] h-[308px] items-start justify-between overflow-clip p-[24px] relative rounded-[20px] shrink-0 to-[#0072ff] w-[521px]">
      <Frame20 />
      <Frame28 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[40px] items-center relative shrink-0 w-full">
      <Frame13 />
      <Frame15 />
    </div>
  );
}

function EpChatRound() {
  return (
    <div className="relative shrink-0 size-[46px]" data-name="ep:chat-round">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46 46">
        <g id="ep:chat-round">
          <path d={svgPaths.p232f3d30} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full">
      <EpChatRound />
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-white">World Chat</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
      <Frame29 />
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-white w-full whitespace-pre-wrap">Connect, share, and support each other worldwide.</p>
    </div>
  );
}

function BitcoinIconsArrowUpFilled2() {
  return (
    <div className="relative size-[22px]" data-name="bitcoin-icons:arrow-up-filled">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="bitcoin-icons:arrow-up-filled">
          <path clipRule="evenodd" d={svgPaths.p16746080} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white">Join Conversation</p>
      <div className="flex items-center justify-center relative shrink-0 size-[22px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <BitcoinIconsArrowUpFilled2 />
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-gradient-to-r content-stretch flex flex-col from-[#56ab2f] h-[308px] items-start justify-between overflow-clip p-[24px] relative rounded-[20px] shrink-0 to-[#a8e063] w-[521px]">
      <Frame21 />
      <Frame30 />
    </div>
  );
}

function HugeiconsStars() {
  return (
    <div className="relative shrink-0 size-[46px]" data-name="hugeicons:stars">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46 46">
        <g id="hugeicons:stars">
          <path d={svgPaths.p2a8f0980} id="Vector" stroke="var(--stroke-0, white)" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full">
      <HugeiconsStars />
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-white">Motivation Corner</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
      <Frame31 />
      <div className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-white w-full whitespace-pre-wrap">
        <p className="mb-0">{`Get inspired with uplifting quotes and real success `}</p>
        <p>stories.</p>
      </div>
    </div>
  );
}

function BitcoinIconsArrowUpFilled3() {
  return (
    <div className="relative size-[22px]" data-name="bitcoin-icons:arrow-up-filled">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="bitcoin-icons:arrow-up-filled">
          <path clipRule="evenodd" d={svgPaths.p16746080} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white">Find Inspiration</p>
      <div className="flex items-center justify-center relative shrink-0 size-[22px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <BitcoinIconsArrowUpFilled3 />
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="backdrop-blur-[101.25px] h-[308px] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start justify-between p-[24px] relative size-full">
        <Frame23 />
        <Frame32 />
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-gradient-to-r content-stretch flex flex-col from-[#7f00ff] h-[307.5px] items-start overflow-clip relative rounded-[20px] shrink-0 to-[#e100ff] w-[521px]">
      <Frame22 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[40px] h-[307.5px] items-center relative shrink-0 w-full">
      <Frame14 />
      <Frame16 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[25px] items-start left-[318px] top-[197px] w-[1082px]">
      <Frame17 />
      <Frame18 />
    </div>
  );
}

function SiAddFill() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="si:add-fill">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="si:add-fill">
          <path d={svgPaths.p155fb3f0} fill="var(--fill-0, black)" fillOpacity="0.6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[6px] items-center px-[16px] relative size-full">
          <SiAddFill />
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">Create Session</p>
        </div>
      </div>
    </div>
  );
}

function FlowbiteChalkboardUserOutline() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="flowbite:chalkboard-user-outline">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="flowbite:chalkboard-user-outline">
          <path d={svgPaths.p16a0cd00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[6px] items-center px-[16px] relative size-full">
          <FlowbiteChalkboardUserOutline />
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">Session Requests</p>
        </div>
      </div>
    </div>
  );
}

function TemakiRoom() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="temaki:room">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2016_148)" id="temaki:room">
          <path d={svgPaths.p12a85400} fill="var(--fill-0, black)" fillOpacity="0.6" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_2016_148">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[6px] items-center px-[16px] relative size-full">
          <TemakiRoom />
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">Create Study Room</p>
        </div>
      </div>
    </div>
  );
}

function FlowbiteGlobeOutline() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="flowbite:globe-outline">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="flowbite:globe-outline">
          <path d={svgPaths.p39188800} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeOpacity="0.6" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[6px] items-center px-[16px] relative size-full">
          <FlowbiteGlobeOutline />
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">World Chat</p>
        </div>
      </div>
    </div>
  );
}

function FaRegularSmileBeam() {
  return (
    <div className="h-[22px] relative shrink-0 w-[21px]" data-name="fa-regular:smile-beam">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 22">
        <g clipPath="url(#clip0_2019_1418)" id="fa-regular:smile-beam">
          <path d={svgPaths.p2ab57600} fill="var(--fill-0, #003566)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_2019_1418">
            <rect fill="white" height="22" width="21" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[#c9e5ff] h-[42px] relative rounded-[10px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[6px] items-center px-[16px] relative size-full">
          <FaRegularSmileBeam />
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#003566] text-[14px]">Emotional Wellness</p>
        </div>
      </div>
    </div>
  );
}

function FluentPeopleCommunity16Regular() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="fluent:people-community-16-regular">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="fluent:people-community-16-regular">
          <path d={svgPaths.p7213140} fill="var(--fill-0, black)" fillOpacity="0.6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[6px] items-center px-[16px] relative size-full">
          <FluentPeopleCommunity16Regular />
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">Community</p>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] items-start left-[32px] top-[135px] w-[214px]">
      <Frame3 />
      <Frame7 />
      <Frame2 />
      <Frame5 />
      <Frame9 />
      <Frame4 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute left-0 size-[35px] top-0">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 35">
        <g id="Frame 26">
          <g id="Vector 10">
            <path d={svgPaths.p3781200} fill="var(--fill-0, #003566)" />
            <path d={svgPaths.p1c6f2500} stroke="var(--stroke-0, #003566)" strokeWidth="0.245515" />
          </g>
          <g id="Vector 9">
            <path d={svgPaths.p31318300} fill="var(--fill-0, #003566)" />
            <path d={svgPaths.p275764f0} stroke="var(--stroke-0, #003566)" strokeWidth="0.23811" />
          </g>
          <circle cx="17.5" cy="17.5" id="Ellipse 7" r="15.8594" stroke="var(--stroke-0, #003566)" strokeWidth="3.28125" />
          <g clipPath="url(#clip0_2015_66)" id="streamline-sharp:star-2-solid">
            <path clipRule="evenodd" d={svgPaths.p2338ef00} fill="var(--fill-0, #F77F00)" fillRule="evenodd" id="Vector" />
          </g>
          <g clipPath="url(#clip1_2015_66)" id="streamline-sharp:star-2-solid_2">
            <path clipRule="evenodd" d={svgPaths.p17aefc80} fill="var(--fill-0, #F77F00)" fillRule="evenodd" id="Vector_2" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_2015_66">
            <rect fill="white" height="10.5795" transform="translate(10.4914 20.704) rotate(-11.508)" width="10.5795" />
          </clipPath>
          <clipPath id="clip1_2015_66">
            <rect fill="white" height="10.2012" transform="translate(11.5055 10.7851) rotate(-11.508)" width="10.2012" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-white overflow-clip pointer-events-auto shadow-[0px_4px_18px_-1px_rgba(0,0,0,0.1)] sticky top-0 w-[278px]">
      <Frame6 />
      <div className="absolute h-[35px] left-[32px] top-[32px] w-[129.037px]" data-name="Logo">
        <p className="absolute font-['Righteous:Regular',sans-serif] leading-[normal] left-[calc(50%-25.28px)] not-italic text-[#003566] text-[20.472px] top-[calc(50%-12.7px)]">Learnova</p>
        <Frame11 />
      </div>
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[32px] not-italic text-[14px] text-[rgba(0,0,0,0.6)] top-[98px]">Main Menu</p>
    </div>
  );
}

function CommunicationBell() {
  return (
    <div className="absolute inset-[12.5%_16.67%]" data-name="Communication / Bell">
      <div className="absolute inset-[-5.17%_-5.82%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.3505 21.5167">
          <g id="Communication / Bell">
            <path d={svgPaths.p13baf700} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.01667" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function SvgRepoIconCarrier() {
  return (
    <div className="absolute contents inset-[12.5%_16.67%]" data-name="SVGRepo_iconCarrier">
      <CommunicationBell />
    </div>
  );
}

function Frame() {
  return (
    <div className="overflow-clip relative shrink-0 size-[26px]" data-name="Frame">
      <SvgRepoIconCarrier />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[10px] h-[42px] items-center justify-center relative rounded-[10px] shrink-0 w-full">
      <div className="relative shrink-0 size-[38px]">
        <img alt="" className="absolute block max-w-none size-full" height="38" src={imgEllipse1} width="38" />
      </div>
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black">Jack Sparrow</p>
    </div>
  );
}

function ProfileOverlay() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Profile Overlay">
      <Frame10 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-center justify-center right-[40px] top-[32px] w-[216px]">
      <Frame />
      <ProfileOverlay />
    </div>
  );
}

export default function EmotionalWellness() {
  return (
    <div className="bg-white relative size-full" data-name="Emotional Wellness">
      <Frame8 />
      <Frame24 />
      <div className="absolute bottom-0 h-[900px] left-0 pointer-events-none top-0">
        <Frame1 />
      </div>
      <Frame12 />
    </div>
  );
}