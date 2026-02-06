import svgPaths from "./svg-eln01vgl0n";
import imgEllipse1 from "figma:asset/798eac6e288222603807db12d070c52d1a145785.png";
import imgImage24 from "figma:asset/ee75b3f7fd75b317c92ab5dcaa912db9eddbf3e7.png";
import imgImage25 from "figma:asset/0aaa9a026db3fff583a4d805f37def4bf33531fe.png";
import imgImage26 from "figma:asset/1febea968fb6ef6c5fe4a446aa07bfe8857031ea.png";

function IconamoonArrowLeft2Light() {
  return <div className="shrink-0 size-[17px]" data-name="iconamoon:arrow-left-2-light" />;
}

function Frame16() {
  return (
    <div className="absolute content-stretch flex items-start left-[32px] top-[24px]">
      <IconamoonArrowLeft2Light />
    </div>
  );
}

function IconamoonSearchLight() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="iconamoon:search-light">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="iconamoon:search-light">
          <path d={svgPaths.p10a22f00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <IconamoonSearchLight />
      <div className="css-g0mm18 flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.6)]">
        <p className="css-ew64yg leading-[normal]">Search by Name/Subject/Exam/Language</p>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[318px] overflow-clip px-[24px] py-[12px] rounded-[12px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)] top-[189px] w-[1058px]" style={{ backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <Frame17 />
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

function Frame3() {
  return (
    <div className="content-stretch flex gap-[10px] h-[42px] items-center justify-center relative rounded-[10px] shrink-0 w-full">
      <div className="relative shrink-0 size-[38px]">
        <img alt="" className="block max-w-none size-full" height="38" src={imgEllipse1} width="38" />
      </div>
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black">Jack Sparrow</p>
    </div>
  );
}

function ProfileOverlay() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Profile Overlay">
      <Frame3 />
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

function Frame8() {
  return (
    <div className="absolute content-stretch flex flex-col items-start leading-[normal] left-[318px] not-italic pb-[6px] pt-0 px-0 top-[98px] w-[458px]">
      <p className="css-ew64yg font-['Poppins:Medium',sans-serif] relative shrink-0 text-[40px] text-black">Human Mentor</p>
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">Learn directly from real mentors who guide, motivate, and inspire.</p>
    </div>
  );
}

function TemakiRoom() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="temaki:room">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_24_94)" id="temaki:room">
          <path d={svgPaths.p3869b330} fill="var(--fill-0, black)" fillOpacity="0.6" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_24_94">
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
        <div className="content-stretch flex gap-[6px] items-center px-[16px] py-0 relative size-full">
          <TemakiRoom />
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">Study Rooms</p>
        </div>
      </div>
    </div>
  );
}

function FlowbiteChalkboardUserOutline() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="flowbite:chalkboard-user-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="flowbite:chalkboard-user-outline">
          <path d={svgPaths.p16a0cd00} id="Vector" stroke="var(--stroke-0, #003566)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#c9e5ff] h-[42px] relative rounded-[10px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[6px] items-center px-[16px] py-0 relative size-full">
          <FlowbiteChalkboardUserOutline />
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#003566] text-[14px]">Mentor Support</p>
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[12.5%]" data-name="Group">
      <div className="absolute inset-[-5.56%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20.0003">
          <g id="Group">
            <path d={svgPaths.p14deb300} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" />
            <path d={svgPaths.p58ba980} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function TablerTools() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="tabler:tools">
      <Group />
    </div>
  );
}

function Frame5() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[6px] items-center px-[16px] py-0 relative size-full">
          <TablerTools />
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">Productivity Tools</p>
        </div>
      </div>
    </div>
  );
}

function FaRegularSmileBeam() {
  return (
    <div className="h-[22px] relative shrink-0 w-[21px]" data-name="fa-regular:smile-beam">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 22">
        <g clipPath="url(#clip0_24_121)" id="fa-regular:smile-beam">
          <path d={svgPaths.p2ab57600} fill="var(--fill-0, black)" fillOpacity="0.6" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_24_121">
            <rect fill="white" height="22" width="21" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="h-[42px] relative rounded-[10px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[6px] items-center px-[16px] py-0 relative size-full">
          <FaRegularSmileBeam />
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">Emotional Wellness</p>
        </div>
      </div>
    </div>
  );
}

function FluentPeopleCommunity16Regular() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="fluent:people-community-16-regular">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
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
        <div className="content-stretch flex gap-[6px] items-center px-[16px] py-0 relative size-full">
          <FluentPeopleCommunity16Regular />
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">Community</p>
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] items-start left-[32px] top-[135px] w-[214px]">
      <Frame2 />
      <Frame7 />
      <Frame5 />
      <Frame6 />
      <Frame4 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute left-0 size-[35px] top-0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 35">
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
          <g clipPath="url(#clip0_24_112)" id="streamline-sharp:star-2-solid">
            <path clipRule="evenodd" d={svgPaths.p2338ef00} fill="var(--fill-0, #F77F00)" fillRule="evenodd" id="Vector" />
          </g>
          <g clipPath="url(#clip1_24_112)" id="streamline-sharp:star-2-solid_2">
            <path clipRule="evenodd" d={svgPaths.p17aefc80} fill="var(--fill-0, #F77F00)" fillRule="evenodd" id="Vector_2" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_24_112">
            <rect fill="white" height="10.5795" transform="translate(10.4914 20.704) rotate(-11.508)" width="10.5795" />
          </clipPath>
          <clipPath id="clip1_24_112">
            <rect fill="white" height="10.2012" transform="translate(11.5055 10.7851) rotate(-11.508)" width="10.2012" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="absolute h-[35px] left-[32px] top-[32px] w-[129.037px]" data-name="Logo">
      <p className="absolute css-ew64yg font-['Righteous:Regular',sans-serif] leading-[normal] left-[calc(50%-25.28px)] not-italic text-[#003566] text-[20.472px] top-[calc(50%-12.7px)]">Learnova</p>
      <Frame10 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="overflow-clip pointer-events-auto shadow-[0px_4px_18px_-1px_rgba(0,0,0,0.1)] sticky top-0 w-[278px]" style={{ backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <Frame9 />
      <Logo />
      <p className="absolute css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] left-[32px] not-italic text-[14px] text-[rgba(0,0,0,0.6)] top-[98px]">Main Menu</p>
    </div>
  );
}

function LineMdStar() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="line-md:star">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="line-md:star">
          <path d={svgPaths.p2f8aab00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame28() {
  return (
    <div className="absolute bg-[#facc15] content-stretch flex gap-[2px] items-center justify-center left-[256px] px-[10px] py-[4px] rounded-[10px] top-[24px]">
      <LineMdStar />
      <p className="css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black">4.5</p>
    </div>
  );
}

function Picture() {
  return (
    <div className="h-[252px] overflow-clip relative rounded-tl-[20px] rounded-tr-[20px] shrink-0 w-full" data-name="Picture">
      <div className="absolute h-[285px] left-[-6px] rounded-[20px] top-[-4px] w-[429px]" data-name="image 24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[20px]">
          <img alt="" className="absolute h-[108.11%] left-0 max-w-none top-0 w-full" src={imgImage24} />
        </div>
      </div>
      <Frame28 />
    </div>
  );
}

function SimpleLineIconsGraduation() {
  return (
    <div className="h-[23px] relative shrink-0 w-[24px]" data-name="simple-line-icons:graduation">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 23">
        <g clipPath="url(#clip0_31_183)" id="simple-line-icons:graduation">
          <path d={svgPaths.p11dc3e80} fill="var(--fill-0, black)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_31_183">
            <rect fill="white" height="23" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <SimpleLineIconsGraduation />
      <p className="css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black w-[89px]">980+ Students helped</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[8.33%_8.33%_8.33%_16.67%]" data-name="Group">
      <div className="absolute inset-[-3.75%_-4.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.4997 21.5">
          <g id="Group">
            <path d={svgPaths.p2ea17f00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p16c88430} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function HugeiconsAiChemistry2() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="hugeicons:ai-chemistry-02">
      <Group1 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <HugeiconsAiChemistry2 />
      <p className="css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black w-[89px]">Maths</p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex h-[36px] items-center justify-between relative shrink-0 w-full">
      <Frame25 />
      <Frame26 />
    </div>
  );
}

function IcOutlineWorkHistory() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ic:outline-work-history">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ic:outline-work-history">
          <path d={svgPaths.pc67ba80} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p323683f0} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <IcOutlineWorkHistory />
      <p className="css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black w-[89px]">6 years</p>
    </div>
  );
}

function JoinRoomButton() {
  return (
    <div className="bg-[#003566] content-stretch flex h-[42px] items-center justify-center relative rounded-[20px] shrink-0 w-[155px]" data-name="Join Room Button">
      <div aria-hidden="true" className="absolute border-2 border-[#003566] border-solid inset-[-1px] pointer-events-none rounded-[21px]" />
      <p className="css-ew64yg font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white">Book a Session</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-end relative shrink-0 w-[288px]">
      <p className="css-4hzbpn font-['Poppins:SemiBold',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[24px] text-black w-[min-content]">Ravi Kumar</p>
      <p className="css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.7)] w-[min-content]">Dedicated Math tutor helping students simplify complex problems and build confidence in quantitative reasoning.</p>
      <Frame27 />
      <Frame31 />
      <JoinRoomButton />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0 w-full">
      <Picture />
      <Frame29 />
    </div>
  );
}

function Card() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip pb-[24px] pt-0 px-0 relative rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] shrink-0 w-[326px]" data-name="Card" style={{ backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <Frame30 />
    </div>
  );
}

function LineMdStar1() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="line-md:star">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="line-md:star">
          <path d={svgPaths.p2f8aab00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame32() {
  return (
    <div className="absolute bg-[#facc15] content-stretch flex gap-[2px] items-center justify-center left-[256px] px-[10px] py-[4px] rounded-[10px] top-[24px]">
      <LineMdStar1 />
      <p className="css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black">4.5</p>
    </div>
  );
}

function Picture1() {
  return (
    <div className="h-[252px] overflow-clip relative rounded-tl-[20px] rounded-tr-[20px] shrink-0 w-full" data-name="Picture">
      <div className="absolute h-[267px] left-[-88px] rounded-[20px] top-0 w-[423px]" data-name="image 25">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[20px]">
          <img alt="" className="absolute h-[113.5%] left-[0.15%] max-w-none top-[-4.26%] w-full" src={imgImage25} />
        </div>
      </div>
      <Frame32 />
    </div>
  );
}

function SimpleLineIconsGraduation1() {
  return (
    <div className="h-[23px] relative shrink-0 w-[24px]" data-name="simple-line-icons:graduation">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 23">
        <g clipPath="url(#clip0_31_183)" id="simple-line-icons:graduation">
          <path d={svgPaths.p11dc3e80} fill="var(--fill-0, black)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_31_183">
            <rect fill="white" height="23" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <SimpleLineIconsGraduation1 />
      <p className="css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black w-[89px]">1,120+ Students helped</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[8.33%_8.33%_8.33%_16.67%]" data-name="Group">
      <div className="absolute inset-[-3.75%_-4.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.4997 21.5">
          <g id="Group">
            <path d={svgPaths.p2ea17f00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p16c88430} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function HugeiconsAiChemistry() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="hugeicons:ai-chemistry-02">
      <Group2 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <HugeiconsAiChemistry />
      <p className="css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black w-[89px]">Physics (IIT-JEE, NEET)</p>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex h-[36px] items-center justify-between relative shrink-0 w-full">
      <Frame33 />
      <Frame35 />
    </div>
  );
}

function IcOutlineWorkHistory1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ic:outline-work-history">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ic:outline-work-history">
          <path d={svgPaths.pc67ba80} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p323683f0} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-[288px]">
      <IcOutlineWorkHistory1 />
      <p className="css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black w-[89px]">9 years</p>
    </div>
  );
}

function JoinRoomButton1() {
  return (
    <div className="bg-[#003566] content-stretch flex h-[42px] items-center justify-center relative rounded-[20px] shrink-0 w-[155px]" data-name="Join Room Button">
      <div aria-hidden="true" className="absolute border-2 border-[#003566] border-solid inset-[-1px] pointer-events-none rounded-[21px]" />
      <p className="css-ew64yg font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white">Book a Session</p>
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-end relative shrink-0 w-[288px]">
      <p className="css-4hzbpn font-['Poppins:SemiBold',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[24px] text-black w-[min-content]">Dr. Riya Nair</p>
      <p className="css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.7)] w-[min-content]">Passionate physics educator who simplifies complex theories with visual explanations and real-world connections</p>
      <Frame36 />
      <Frame37 />
      <JoinRoomButton1 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0 w-full">
      <Picture1 />
      <Frame38 />
    </div>
  );
}

function Card1() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip pb-[24px] pt-0 px-0 relative rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] shrink-0 w-[326px]" data-name="Card" style={{ backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <Frame39 />
    </div>
  );
}

function LineMdStar2() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="line-md:star">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="line-md:star">
          <path d={svgPaths.p2f8aab00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame40() {
  return (
    <div className="absolute bg-[#facc15] content-stretch flex gap-[2px] items-center justify-center left-[256px] px-[10px] py-[4px] rounded-[10px] top-[24px]">
      <LineMdStar2 />
      <p className="css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black">4.5</p>
    </div>
  );
}

function Picture2() {
  return (
    <div className="h-[252px] overflow-clip relative rounded-tl-[20px] rounded-tr-[20px] shrink-0 w-full" data-name="Picture">
      <div className="absolute h-[304px] left-[-94px] rounded-[20px] top-[-11px] w-[458px]" data-name="image 24">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" src={imgImage26} />
      </div>
      <Frame40 />
    </div>
  );
}

function SimpleLineIconsGraduation2() {
  return (
    <div className="h-[23px] relative shrink-0 w-[24px]" data-name="simple-line-icons:graduation">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 23">
        <g clipPath="url(#clip0_31_183)" id="simple-line-icons:graduation">
          <path d={svgPaths.p11dc3e80} fill="var(--fill-0, black)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_31_183">
            <rect fill="white" height="23" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <SimpleLineIconsGraduation2 />
      <p className="css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black w-[89px]">870+ Students helped</p>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[8.33%_8.33%_8.33%_16.67%]" data-name="Group">
      <div className="absolute inset-[-3.75%_-4.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.4997 21.5">
          <g id="Group">
            <path d={svgPaths.p2ea17f00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p16c88430} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function HugeiconsAiChemistry1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="hugeicons:ai-chemistry-02">
      <Group3 />
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <HugeiconsAiChemistry1 />
      <p className="css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black w-[89px]">IELTS (English)</p>
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex h-[36px] items-center justify-between relative shrink-0 w-full">
      <Frame41 />
      <Frame42 />
    </div>
  );
}

function IcOutlineWorkHistory2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ic:outline-work-history">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ic:outline-work-history">
          <path d={svgPaths.pc67ba80} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p323683f0} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-[288px]">
      <IcOutlineWorkHistory2 />
      <p className="css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black w-[89px]">5 years</p>
    </div>
  );
}

function JoinRoomButton2() {
  return (
    <div className="bg-[#003566] content-stretch flex h-[42px] items-center justify-center relative rounded-[20px] shrink-0 w-[155px]" data-name="Join Room Button">
      <div aria-hidden="true" className="absolute border-2 border-[#003566] border-solid inset-[-1px] pointer-events-none rounded-[21px]" />
      <p className="css-ew64yg font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white">Book a Session</p>
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-end relative shrink-0 w-[288px]">
      <p className="css-4hzbpn font-['Poppins:SemiBold',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[24px] text-black w-[min-content]">Sarah Thomas</p>
      <p className="css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.7)] w-[min-content]">{`Certified IELTS trainer boosting confidence & band scores with personalized strategies.`}</p>
      <Frame43 />
      <Frame44 />
      <JoinRoomButton2 />
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0 w-full">
      <Picture2 />
      <Frame45 />
    </div>
  );
}

function Card2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip pb-[24px] pt-0 px-0 relative rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] shrink-0 w-[326px]" data-name="Card" style={{ backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <Frame46 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[318px] top-[271px] w-[1058px]">
      <Card />
      <Card1 />
      <Card2 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="bg-[#e8ecf2] flex-[1_0_0] h-[50px] min-h-px min-w-px relative rounded-[4px]">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center p-[32px] relative size-full">
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black">UPI</p>
        </div>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[66px] py-[2px] relative w-full">
          <p className="css-ew64yg font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black">Bank Account</p>
        </div>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-[#c9e5ff] content-stretch flex gap-[10px] items-center justify-center relative rounded-[4px] shrink-0 w-full">
      <Frame20 />
      <Frame21 />
    </div>
  );
}

function EmailTypist() {
  return (
    <div className="h-[39px] relative rounded-[10px] shrink-0 w-full" data-name="Email Typist">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.4)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[10px] py-0 relative size-full">
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">Enter your name</p>
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-[73px] items-start relative shrink-0 w-full">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black">Account Holder Name</p>
      <EmailTypist />
    </div>
  );
}

function EmailTypist1() {
  return (
    <div className="h-[39px] relative rounded-[10px] shrink-0 w-full" data-name="Email Typist">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.4)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[10px] py-0 relative size-full">
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">Enter your bank name</p>
        </div>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-[73px] items-start relative shrink-0 w-full">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black">Bank Name</p>
      <EmailTypist1 />
    </div>
  );
}

function EmailTypist2() {
  return (
    <div className="h-[39px] relative rounded-[10px] shrink-0 w-full" data-name="Email Typist">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.4)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[10px] py-0 relative size-full">
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">Enter your bank account number</p>
        </div>
      </div>
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-[73px] items-start relative shrink-0 w-full">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black">Account Number</p>
      <EmailTypist2 />
    </div>
  );
}

function EmailTypist3() {
  return (
    <div className="h-[39px] relative rounded-[10px] shrink-0 w-full" data-name="Email Typist">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.4)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[10px] py-0 relative size-full">
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">Re-enter your bank account number</p>
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-[73px] items-start relative shrink-0 w-full">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black">Re-Enter Account Number</p>
      <EmailTypist3 />
    </div>
  );
}

function EmailTypist4() {
  return (
    <div className="h-[39px] relative rounded-[10px] shrink-0 w-full" data-name="Email Typist">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.4)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[10px] py-0 relative size-full">
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">Enter your bank IFSC code</p>
        </div>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-[73px] items-start relative shrink-0 w-full">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black">Bank IFSC Code</p>
      <EmailTypist4 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[10px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex font-['Poppins:SemiBold',sans-serif] items-center justify-between leading-[normal] not-italic px-[24px] py-[10px] relative text-black w-full">
          <p className="css-ew64yg relative shrink-0 text-[16px]">{`Amount: `}</p>
          <p className="css-ew64yg relative shrink-0 text-[32px]">₹500</p>
        </div>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[42px] items-center justify-center min-h-px min-w-px relative rounded-[20px]">
      <div aria-hidden="true" className="absolute border border-[#cc3636] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <p className="css-ew64yg font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#cc3636] text-[14px]">Cancel</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[#003566] content-stretch flex flex-[1_0_0] h-[42px] items-center justify-center min-h-px min-w-px relative rounded-[20px]">
      <p className="css-ew64yg font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white">Pay and Confirm</p>
    </div>
  );
}

function CancelPayAndConfirm() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-[383px]" data-name="cancel, pay and confirm">
      <Frame13 />
      <Frame14 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-end p-[24px] relative shrink-0 w-[640px]">
      <p className="css-4hzbpn font-['Poppins:SemiBold',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[24px] text-black w-[min-content]">Choose Mode of Payment</p>
      <Frame19 />
      <Frame11 />
      <Frame24 />
      <Frame47 />
      <Frame22 />
      <Frame23 />
      <Frame34 />
      <CancelPayAndConfirm />
    </div>
  );
}

function Payment() {
  return (
    <div className="absolute bg-white content-stretch flex items-start left-1/2 overflow-clip p-[32px] rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%]" data-name="Payment">
      <Frame48 />
    </div>
  );
}

export default function HumanMentorPayAndConfirmBankAccount() {
  return (
    <div className="relative size-full" data-name="Human Mentor - PAY and CONFIRM (Bank Account)" style={{ backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <Frame16 />
      <Frame15 />
      <Frame12 />
      <Frame8 />
      <div className="absolute bottom-0 h-[900px] left-0 pointer-events-none top-0">
        <Frame1 />
      </div>
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[normal] left-[318px] not-italic text-[14px] text-[rgba(0,0,0,0.6)] top-[77px]">{`< Mentor Support`}</p>
      <Frame18 />
      <Payment />
    </div>
  );
}