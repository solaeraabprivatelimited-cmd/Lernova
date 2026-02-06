import svgPaths from "./svg-c7v0aohof6";
import imgImage11 from "figma:asset/0a6d0df68b4e3d2fc770f7b30199a9f65c582ca1.png";
import imgScreenshot111 from "figma:asset/a474824d07b7e42cbfd6a81ec948e9946f5e4c3e.png";

function Frame3() {
  return (
    <div className="bg-white h-[78px] overflow-clip relative rounded-[20px] shrink-0 w-[75px]">
      <div className="absolute h-[81px] left-[-20px] top-[-3px] w-[141.702px]" data-name="image 11">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgImage11} />
      </div>
    </div>
  );
}

function Frame5() {
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

function StopPlay() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0 size-[34px]" data-name="Stop-Play">
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

function Frame4() {
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

function Frame7() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <StopPlay />
      <Frame4 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[257px]">
      <Frame5 />
      <Frame7 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[32px] items-center justify-center relative shrink-0">
      <Frame3 />
      <Frame8 />
    </div>
  );
}

function Frame6() {
  return <div className="bg-white h-[4px] rounded-[20px] shrink-0 w-[20px]" />;
}

function MusicFrame() {
  return (
    <div className="absolute bg-[rgba(20,19,22,0.2)] content-stretch flex items-start justify-between left-[868px] overflow-clip pl-[32px] pr-[24px] py-[16px] rounded-[20px] top-[608px] w-[476px]" data-name="MusicFrame">
      <Frame9 />
      <Frame6 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-[#c4c4c4] h-[750px] left-[32px] overflow-clip rounded-[20px] top-[32px] w-[1376px]">
      <div className="absolute h-[777px] left-0 top-[-14px] w-[1376px]" data-name="Screenshot (11) 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-full left-0 max-w-none top-0 w-[200.84%]" src={imgScreenshot111} />
        </div>
      </div>
      <MusicFrame />
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
    <div className="h-[24.001px] relative shrink-0 w-[19.2px]" data-name="Group">
      <div className="absolute inset-[-4.17%_-5.21%_-4.16%_-5.21%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.1997 25.9995">
          <g id="Group">
            <path d={svgPaths.p139e5180} id="Vector" stroke="var(--stroke-0, white)" strokeWidth="2" />
            <path d={svgPaths.p1e52200} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function FocusTimer() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip px-[5px] py-[3px] relative rounded-[100px] shrink-0 size-[52px]" data-name="Focus Timer">
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
    <div className="content-stretch flex items-center justify-center overflow-clip relative rounded-[20px] shrink-0 size-[57px]" data-name="Background">
      <Background />
    </div>
  );
}

function MynauiMusicSolid() {
  return (
    <div className="relative shrink-0 size-[34px]" data-name="mynaui:music-solid">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
        <g id="mynaui:music-solid">
          <path d={svgPaths.p6d0300} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Music() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] content-stretch flex items-center justify-center overflow-clip relative rounded-[20px] shrink-0 size-[68px]" data-name="Music">
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

function Frame10() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[35px] top-[814px] w-[1373px]">
      <Frame2 />
      <FousModeNavBar />
      <Frame />
    </div>
  );
}

export default function Music1() {
  return (
    <div className="bg-[#141316] relative size-full" data-name="Music">
      <Frame1 />
      <Frame10 />
    </div>
  );
}