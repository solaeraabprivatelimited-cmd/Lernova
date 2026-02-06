import svgPaths from "./svg-53gmi7yc3w";
import imgImage11 from "figma:asset/0a6d0df68b4e3d2fc770f7b30199a9f65c582ca1.png";
import imgImage15 from "figma:asset/0aa69f592fdcbc59e46001832f55ebdbca9f8cf7.png";

function Frame3() {
  return (
    <div className="bg-white h-[78px] overflow-clip relative rounded-[20px] shrink-0 w-[75px]">
      <div className="absolute h-[81px] left-[-20px] top-[-3px] w-[141.702px]" data-name="image 11">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgImage11} />
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center leading-[normal] not-italic pb-[2px] pt-0 px-0 relative shrink-0 text-nowrap text-white">
      <p className="font-['Poppins:Regular',sans-serif] relative shrink-0 text-[24px]">Lo-Fi</p>
      <p className="font-['Poppins:Light',sans-serif] relative shrink-0 text-[16px]">Music</p>
    </div>
  );
}

function MaterialSymbolsStopRounded() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="material-symbols:stop-rounded">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="material-symbols:stop-rounded">
          <path d={svgPaths.pf4bdb00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0 size-[34px]">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[20px] py-[11px] relative size-full">
          <MaterialSymbolsStopRounded />
        </div>
      </div>
    </div>
  );
}

function IconamoonPlayerNextBold() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="iconamoon:player-next-bold">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="iconamoon:player-next-bold">
          <path d={svgPaths.p3f6d7d20} id="Vector" stroke="var(--stroke-0, black)" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0 size-[34px]">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[18px] py-[15px] relative size-full">
          <IconamoonPlayerNextBold />
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[40px] items-center justify-center relative shrink-0">
      <Frame7 />
      <Frame9 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[40px] items-center justify-center relative shrink-0">
      <Frame3 />
      <Frame10 />
    </div>
  );
}

function Frame8() {
  return <div className="bg-white h-[4px] rounded-[20px] shrink-0 w-[20px]" />;
}

function MjusicFrame() {
  return (
    <div className="absolute bg-[rgba(20,19,22,0.2)] content-stretch flex gap-[24px] items-start left-[940px] opacity-0 overflow-clip pl-[32px] pr-[24px] py-[16px] rounded-[20px] top-[608px]" data-name="Mjusic Frame">
      <Frame11 />
      <Frame8 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="h-[78px] relative shrink-0 w-[75px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 75 78">
        <g id="Frame 427318238">
          <rect fill="var(--fill-0, #689A50)" height="78" rx="20" width="75" />
          <path d={svgPaths.pa6f2100} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center leading-[normal] not-italic pb-[2px] pt-0 px-0 relative shrink-0 text-nowrap text-white">
      <p className="font-['Poppins:Regular',sans-serif] relative shrink-0 text-[24px]">Timer Name</p>
      <p className="font-['Poppins:Light',sans-serif] relative shrink-0 text-[16px]">02:00 min</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <Frame12 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[40px] items-center justify-center relative shrink-0">
      <Frame6 />
      <Frame13 />
    </div>
  );
}

function AkarIconsCross() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="akar-icons:cross">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="akar-icons:cross">
          <path d="M20 20L4 4M20 4L4 20" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function MjusicFrame1() {
  return (
    <div className="absolute bg-[rgba(20,19,22,0.2)] content-stretch flex gap-[24px] items-start left-[972px] overflow-clip pl-[32px] pr-[24px] py-[16px] rounded-[20px] top-[579px]" data-name="Mjusic Frame">
      <Frame14 />
      <AkarIconsCross />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-[#c4c4c4] h-[720px] left-[32px] overflow-clip rounded-[20px] top-[62px] w-[1376px]">
      <MjusicFrame />
      <div className="absolute h-[785px] left-[-10px] top-[-13px] w-[1396px]" data-name="image 15">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage15} />
      </div>
      <MjusicFrame1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] text-nowrap">
        <span className="font-['Poppins:Medium',sans-serif] text-white">{`Time Elapsed: `}</span>00:01:29
      </p>
      <div className="flex h-[23px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[23px]">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 1">
                <line id="Line 17" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.7" x1="0.5" x2="22.5" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">Silent Mode</p>
    </div>
  );
}

function Group() {
  return (
    <div className="h-[33.997px] relative shrink-0 w-[27.2px]" data-name="Group">
      <div className="absolute inset-[-2.94%_-3.68%_-2.95%_-3.68%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.2001 35.9986">
          <g id="Group">
            <path d={svgPaths.p2a72d100} id="Vector" stroke="var(--stroke-0, white)" strokeWidth="2" />
            <path d={svgPaths.p21c5e120} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function FocusTimer() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] content-stretch flex items-center justify-center overflow-clip relative rounded-[20px] shrink-0 size-[74px]" data-name="Focus Timer">
      <Group />
    </div>
  );
}

function SvgRepoIconCarrier() {
  return (
    <div className="h-[23.998px] relative shrink-0 w-[20.325px]" data-name="SVGRepo_iconCarrier">
      <div className="absolute inset-[-3.33%_-3.97%_-3.34%_-3.98%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.9412 25.6">
          <g id="SVGRepo_iconCarrier">
            <path d={svgPaths.p32c67b00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            <path d={svgPaths.p18aa6100} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function BlockNotifications() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip px-[5px] py-[3px] relative rounded-[100px] shrink-0 size-[52px]" data-name="Block Notifications">
      <SvgRepoIconCarrier />
    </div>
  );
}

function Group1() {
  return (
    <div className="h-[24px] relative w-[23.135px]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.1349 24.0001">
        <g id="Group">
          <path d={svgPaths.p2763bd80} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p5f88300} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p60d6b00} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.p2c508000} fill="var(--fill-0, white)" id="Vector_4" />
          <path d={svgPaths.p306e2c80} fill="var(--fill-0, white)" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}

function Notes() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip px-[5px] py-[3px] relative rounded-[100px] shrink-0 size-[52px]" data-name="Notes">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Group1 />
        </div>
      </div>
    </div>
  );
}

function VideoIcon() {
  return (
    <div className="h-[34px] relative shrink-0 w-[40px]" data-name="Video Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 34">
        <g id="Video Icon">
          <path d={svgPaths.p5d72180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function IonPeople() {
  return (
    <div className="relative shrink-0 size-[27px]" data-name="ion:people">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 27">
        <g id="ion:people">
          <path d={svgPaths.p160d7f00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Fa7RegularSmileBeam() {
  return (
    <div className="h-[52px] relative shrink-0 w-[50px]" data-name="fa7-regular:smile-beam">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 52">
        <g id="fa7-regular:smile-beam">
          <path d={svgPaths.p10299000} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function SilentModeNavBar() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] content-stretch flex gap-[24px] h-[52px] items-center justify-center relative rounded-[20px] shrink-0 w-[451px]" data-name="Silent Mode Nav Bar">
      <FocusTimer />
      <BlockNotifications />
      <Notes />
      <VideoIcon />
      <IonPeople />
      <Fa7RegularSmileBeam />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#cc3636] content-stretch flex h-[42px] items-center justify-center px-[20px] py-[16px] relative rounded-[24px] shrink-0 w-[149px]">
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">Leave Room</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[calc(50%-0.5px)] top-[814px] translate-x-[-50%] w-[1373px]">
      <Frame2 />
      <SilentModeNavBar />
      <Frame />
    </div>
  );
}

export default function SilentModeFocusTimerNotification() {
  return (
    <div className="bg-[#141316] relative size-full" data-name="Silent Mode - Focus Timer Notification">
      <Frame1 />
      <Frame15 />
    </div>
  );
}