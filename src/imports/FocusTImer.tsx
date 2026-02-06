import svgPaths from "./svg-efd9js624b";
import imgScreenshot111 from "figma:asset/a474824d07b7e42cbfd6a81ec948e9946f5e4c3e.png";

function Frame1() {
  return (
    <div className="absolute bg-[#c4c4c4] h-[750px] left-[32px] overflow-clip rounded-[20px] top-[32px] w-[882px]">
      <div className="absolute h-[777px] left-0 top-[-14px] w-[1376px]" data-name="Screenshot (11) 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-full left-[-28.08%] max-w-none top-0 w-[200.84%]" src={imgScreenshot111} />
        </div>
      </div>
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
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">Focus Mode</p>
    </div>
  );
}

function Group() {
  return (
    <div className="h-[32.5px] relative shrink-0 w-[26px]" data-name="Group">
      <div className="absolute inset-[-3.08%_-3.85%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 34.4998">
          <g id="Group">
            <path d={svgPaths.p10d46b00} id="Vector" stroke="var(--stroke-0, white)" strokeWidth="2" />
            <path d={svgPaths.p1d38a00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function FocusTimer() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] content-stretch flex h-[68px] items-center justify-center overflow-clip relative rounded-[20px] shrink-0 w-[73px]" data-name="Focus Timer">
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
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.1348 24.0001">
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

function Background() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Background">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Background">
          <path d={svgPaths.p9fc5800} fill="var(--fill-0, white)" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p3369ec80} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_2" />
          <path d={svgPaths.pd7caa00} fill="var(--fill-0, white)" id="Vector_3" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

function Background1() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip px-[5px] py-[3px] relative rounded-[100px] shrink-0 size-[52px]" data-name="Background">
      <Background />
    </div>
  );
}

function MynauiMusicSolid() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mynaui:music-solid">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mynaui:music-solid">
          <path d={svgPaths.p26fc0380} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Music() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip px-[5px] py-[3px] relative rounded-[100px] shrink-0 size-[52px]" data-name="Music">
      <MynauiMusicSolid />
    </div>
  );
}

function FousModeNavBar() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] content-stretch flex gap-[23px] h-[52px] items-center justify-center relative rounded-[20px] shrink-0 w-[374px]" data-name="Fous Mode Nav Bar">
      <FocusTimer />
      <BlockNotifications />
      <Notes />
      <Background1 />
      <Music />
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
    <div className="absolute content-stretch flex items-center justify-between left-[35px] top-[814px] w-[1373px]">
      <Frame2 />
      <FousModeNavBar />
      <Frame />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[8.33%]" data-name="Group">
      <div className="absolute inset-[-3.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.6667 28.6667">
          <g id="Group">
            <path d={svgPaths.p1fd3cb00} id="Vector" stroke="var(--stroke-0, white)" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p89d1180} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IconParkOutlineCloseOne() {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px]" data-name="icon-park-outline:close-one">
      <Group2 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-white w-[410px]">Focus Timer</p>
      <IconParkOutlineCloseOne />
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex font-['Poppins:Regular',sans-serif] items-center justify-between leading-[normal] not-italic px-[24px] py-[16px] relative text-[16px] text-nowrap w-full">
          <p className="relative shrink-0 text-white">Label</p>
          <p className="relative shrink-0 text-[rgba(255,255,255,0.6)]">Label Name</p>
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
      <Frame3 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.6)] w-[410px]">Set Timer</p>
      <Frame12 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[rgba(255,105,105,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative w-full">
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#ff6969] text-[16px] text-nowrap">Stop</p>
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[84px]">
      <Frame4 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[rgba(80,254,0,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative w-full">
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#50fe00] text-[16px] text-nowrap">Start</p>
        </div>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[84px]">
      <Frame5 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame14 />
      <Frame16 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0 w-full">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-white w-[410px]">Recents</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:Regular',sans-serif] items-start justify-between leading-[normal] not-italic relative shrink-0 text-[rgba(255,255,255,0.6)] text-nowrap">
      <p className="relative shrink-0 text-[24px]">1:00</p>
      <p className="relative shrink-0 text-[16px]">Break</p>
    </div>
  );
}

function SolarPlayBold() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="solar:play-bold">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="solar:play-bold">
          <path d={svgPaths.p10dbe800} fill="var(--fill-0, #50FE00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[rgba(80,254,0,0.1)] relative rounded-[20px] shrink-0 size-[32px]">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative size-full">
          <SolarPlayBold />
        </div>
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[56px]">
      <Frame6 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[8.33%_12.5%_0.77%_12.5%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 16.3605">
        <g id="Group">
          <g id="Vector"></g>
          <path d={svgPaths.p13847780} fill="var(--fill-0, #FF6969)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function MingcuteDeleteLine() {
  return (
    <div className="overflow-clip relative shrink-0 size-[18px]" data-name="mingcute:delete-line">
      <Group3 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="bg-[rgba(255,105,105,0.1)] relative rounded-[20px] shrink-0 size-[32px]">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative size-full">
          <MingcuteDeleteLine />
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[56px]">
      <Frame8 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0">
      <Frame20 />
      <Frame22 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative w-full">
          <Frame21 />
          <Frame23 />
        </div>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
      <Frame9 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:Regular',sans-serif] items-start justify-between leading-[normal] not-italic relative shrink-0 text-[rgba(255,255,255,0.6)] text-nowrap">
      <p className="relative shrink-0 text-[24px]">5:00</p>
      <p className="relative shrink-0 text-[16px]">Problem Solving</p>
    </div>
  );
}

function SolarPlayBold1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="solar:play-bold">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="solar:play-bold">
          <path d={svgPaths.p10dbe800} fill="var(--fill-0, #50FE00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame10() {
  return (
    <div className="bg-[rgba(80,254,0,0.1)] relative rounded-[20px] shrink-0 size-[32px]">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative size-full">
          <SolarPlayBold1 />
        </div>
      </div>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[56px]">
      <Frame10 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[8.33%_12.5%_0.77%_12.5%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 16.3605">
        <g id="Group">
          <g id="Vector"></g>
          <path d={svgPaths.p13847780} fill="var(--fill-0, #FF6969)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function MingcuteDeleteLine1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[18px]" data-name="mingcute:delete-line">
      <Group4 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="bg-[rgba(255,105,105,0.1)] relative rounded-[20px] shrink-0 size-[32px]">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative size-full">
          <MingcuteDeleteLine1 />
        </div>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[56px]">
      <Frame11 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0">
      <Frame27 />
      <Frame28 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative w-full">
          <Frame26 />
          <Frame29 />
        </div>
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
      <Frame30 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame18 />
      <Frame19 />
      <Frame31 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] items-center justify-center left-[32px] top-[16px] w-[410px]">
      <Frame13 />
      <Frame25 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[60px] text-nowrap text-white">00 : 01 : 00</p>
      <Frame17 />
      <Frame24 />
    </div>
  );
}

function FocusTimer1() {
  return (
    <div className="absolute bg-[rgba(247,247,247,0.2)] h-[750px] left-[946px] overflow-clip rounded-[20px] top-[32px] w-[462px]" data-name="Focus Timer">
      <Frame7 />
    </div>
  );
}

export default function FocusTImer() {
  return (
    <div className="bg-[#141316] relative size-full" data-name="Focus TImer">
      <Frame1 />
      <Frame15 />
      <FocusTimer1 />
    </div>
  );
}