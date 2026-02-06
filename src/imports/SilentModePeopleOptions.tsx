import svgPaths from "./svg-sufpe7mw4m";
import imgImage11 from "figma:asset/0a6d0df68b4e3d2fc770f7b30199a9f65c582ca1.png";
import imgImage15 from "figma:asset/0aa69f592fdcbc59e46001832f55ebdbca9f8cf7.png";
import imgFrame427318292 from "figma:asset/d0b5e8618139abd2e6c665600d3134442c6ea4a3.png";
import img2OrdinaryFemaleHappyWhite1 from "figma:asset/dde180f33f09fe30a75503b2a22438d35b60b3b1.png";
import imgFrame427318293 from "figma:asset/84cf5c8cbbf03b727968c0fddb31514f9ba3bcf7.png";
import imgFrame427318294 from "figma:asset/8368717aac03403bf2d079603a065d8e972209d1.png";
import imgFrame427318295 from "figma:asset/2df8cecedbdd17885e474b6fa95e652ced6da035.png";
import imgFrame427318296 from "figma:asset/3af14ef4ad4dbf1466eef9f3983c848d337f7fc1.png";
import imgFrame427318297 from "figma:asset/fcde4a862b2ce7137434d15ee78dd77445c06cd6.png";
import imgFrame427318298 from "figma:asset/bb7a4a6f5a0916c1a7062632b23ab182a03f4472.png";

function Frame3() {
  return (
    <div className="bg-white h-[78px] overflow-clip relative rounded-[20px] shrink-0 w-[75px]">
      <div className="absolute h-[81px] left-[-20px] top-[-3px] w-[141.702px]" data-name="image 11">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgImage11} />
      </div>
    </div>
  );
}

function Frame6() {
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

function Frame8() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[40px] items-center justify-center relative shrink-0">
      <Frame6 />
      <Frame8 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[40px] items-center justify-center relative shrink-0">
      <Frame3 />
      <Frame9 />
    </div>
  );
}

function Frame7() {
  return <div className="bg-white h-[4px] rounded-[20px] shrink-0 w-[20px]" />;
}

function MjusicFrame() {
  return (
    <div className="absolute bg-[rgba(20,19,22,0.2)] content-stretch flex gap-[24px] items-start left-[940px] opacity-0 overflow-clip pl-[32px] pr-[24px] py-[16px] rounded-[20px] top-[608px]" data-name="Mjusic Frame">
      <Frame10 />
      <Frame7 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-[#c4c4c4] h-[720px] left-[32px] overflow-clip rounded-[20px] top-[62px] w-[880px]">
      <MjusicFrame />
      <div className="absolute h-[759px] left-[-289px] top-0 w-[1349px]" data-name="image 15">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage15} />
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

function Frame21() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[calc(50%-0.5px)] top-[814px] translate-x-[-50%] w-[1373px]">
      <Frame2 />
      <SilentModeNavBar />
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

function Frame19() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-end relative shrink-0 w-full">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-white w-[357px]">People</p>
      <IconParkOutlineCloseOne />
    </div>
  );
}

function Frame27() {
  return (
    <div className="relative rounded-[200px] shrink-0 size-[30px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
        <div className="absolute bg-white inset-0 rounded-[200px]" />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgFrame427318292} />
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-center left-[24px] top-[9px] w-[172px]">
      <Frame27 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">John</p>
    </div>
  );
}

function PinUnpin() {
  return (
    <div className="relative shrink-0 size-[25px]" data-name="Pin, Unpin">
      <div className="absolute inset-[-2.06%_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25.5157">
          <g id="Pin, Unpin">
            <path d={svgPaths.p34a33200} id="Vector" stroke="var(--stroke-0, #FF5E5E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <line id="Line 18" stroke="var(--stroke-0, #FF5E5E)" strokeLinecap="round" x1="0.706932" x2="22.9843" y1="0.500001" y2="21.8088" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function MiOptionsVertical() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mi:options-vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mi:options-vertical">
          <path d={svgPaths.p3ea7c880} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame30() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-center left-[302px] top-[11.5px] w-[60px]">
      <PinUnpin />
      <MiOptionsVertical />
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute bg-[#ff5e5e] content-stretch flex h-[38px] items-center justify-center left-[204px] overflow-clip px-0 py-[12px] rounded-[20px] top-[51px] w-[163px]">
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white">Report</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[105px] overflow-clip relative rounded-[20px] shrink-0 w-[386px]">
      <Frame28 />
      <Frame30 />
      <Frame11 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="bg-white overflow-clip relative rounded-[200px] shrink-0 size-[30px]">
      <div className="absolute h-[25px] left-[-2px] top-[5px] w-[34px]" data-name="2 - Ordinary Female - Happy - White 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[136.36%] left-[-0.02%] max-w-none top-[-36.36%] w-[100.04%]" src={img2OrdinaryFemaleHappyWhite1} />
        </div>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[172px]">
      <Frame31 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">Elizabeth</p>
    </div>
  );
}

function PinUnpin1() {
  return (
    <div className="relative shrink-0 size-[25px]" data-name="Pin, Unpin">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25">
        <g id="Pin, Unpin">
          <path d={svgPaths.p2c6f3a00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function MiOptionsVertical1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mi:options-vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mi:options-vertical">
          <path d={svgPaths.p3ea7c880} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[60px]">
      <PinUnpin1 />
      <MiOptionsVertical1 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[9px] relative w-full">
          <Frame32 />
          <Frame33 />
        </div>
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="relative rounded-[200px] shrink-0 size-[30px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
        <div className="absolute bg-white inset-0 rounded-[200px]" />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgFrame427318293} />
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[172px]">
      <Frame34 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">Franklin</p>
    </div>
  );
}

function PinUnpin2() {
  return (
    <div className="relative shrink-0 size-[25px]" data-name="Pin, Unpin">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25">
        <g id="Pin, Unpin">
          <path d={svgPaths.p2c6f3a00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function MiOptionsVertical2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mi:options-vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mi:options-vertical">
          <path d={svgPaths.p3ea7c880} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[60px]">
      <PinUnpin2 />
      <MiOptionsVertical2 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[9px] relative w-full">
          <Frame35 />
          <Frame36 />
        </div>
      </div>
    </div>
  );
}

function Frame37() {
  return (
    <div className="relative rounded-[200px] shrink-0 size-[30px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
        <div className="absolute bg-white inset-0 rounded-[200px]" />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgFrame427318294} />
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[172px]">
      <Frame37 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">Naomi</p>
    </div>
  );
}

function PinUnpin3() {
  return (
    <div className="relative shrink-0 size-[25px]" data-name="Pin, Unpin">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25">
        <g id="Pin, Unpin">
          <path d={svgPaths.p2c6f3a00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function MiOptionsVertical3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mi:options-vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mi:options-vertical">
          <path d={svgPaths.p3ea7c880} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[60px]">
      <PinUnpin3 />
      <MiOptionsVertical3 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[9px] relative w-full">
          <Frame38 />
          <Frame39 />
        </div>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="relative rounded-[200px] shrink-0 size-[30px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
        <div className="absolute bg-white inset-0 rounded-[200px]" />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgFrame427318295} />
      </div>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[172px]">
      <Frame40 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">Zendaya</p>
    </div>
  );
}

function PinUnpin4() {
  return (
    <div className="relative shrink-0 size-[25px]" data-name="Pin, Unpin">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25">
        <g id="Pin, Unpin">
          <path d={svgPaths.p2c6f3a00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function MiOptionsVertical4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mi:options-vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mi:options-vertical">
          <path d={svgPaths.p3ea7c880} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[60px]">
      <PinUnpin4 />
      <MiOptionsVertical4 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[9px] relative w-full">
          <Frame41 />
          <Frame42 />
        </div>
      </div>
    </div>
  );
}

function Frame43() {
  return (
    <div className="relative rounded-[200px] shrink-0 size-[30px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
        <div className="absolute bg-white inset-0 rounded-[200px]" />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgFrame427318296} />
      </div>
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[172px]">
      <Frame43 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">Steve</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <div className="absolute inset-[-3.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5 21.5">
          <g id="Frame 427318294">
            <path d={svgPaths.p24cd00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function MiOptionsVertical5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mi:options-vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mi:options-vertical">
          <path d={svgPaths.p3ea7c880} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[60px]">
      <Frame29 />
      <MiOptionsVertical5 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[9px] relative w-full">
          <Frame44 />
          <Frame45 />
        </div>
      </div>
    </div>
  );
}

function Frame46() {
  return (
    <div className="relative rounded-[200px] shrink-0 size-[30px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
        <div className="absolute bg-white inset-0 rounded-[200px]" />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgFrame427318297} />
      </div>
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[172px]">
      <Frame46 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">Harry</p>
    </div>
  );
}

function Frame48() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <div className="absolute inset-[-3.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5 21.5">
          <g id="Frame 427318294">
            <path d={svgPaths.p24cd00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function MiOptionsVertical6() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mi:options-vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mi:options-vertical">
          <path d={svgPaths.p3ea7c880} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[60px]">
      <Frame48 />
      <MiOptionsVertical6 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[9px] relative w-full">
          <Frame47 />
          <Frame49 />
        </div>
      </div>
    </div>
  );
}

function Frame50() {
  return (
    <div className="relative rounded-[200px] shrink-0 size-[30px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
        <div className="absolute bg-white inset-0 rounded-[200px]" />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgFrame427318298} />
      </div>
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[172px]">
      <Frame50 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">Ron</p>
    </div>
  );
}

function Frame52() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <div className="absolute inset-[-3.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5 21.5">
          <g id="Frame 427318294">
            <path d={svgPaths.p24cd00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function MiOptionsVertical7() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mi:options-vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mi:options-vertical">
          <path d={svgPaths.p3ea7c880} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[60px]">
      <Frame52 />
      <MiOptionsVertical7 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[9px] relative w-full">
          <Frame51 />
          <Frame53 />
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[386px]">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.6)] text-nowrap">In Room</p>
      <Frame12 />
      <Frame14 />
      <Frame15 />
      <Frame16 />
      <Frame17 />
      <Frame18 />
      <Frame20 />
      <Frame13 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] items-start left-[32px] top-[40px] w-[399px]">
      <Frame19 />
      <Frame22 />
    </div>
  );
}

function Frame24() {
  return <div className="absolute bg-[rgba(152,152,152,0.2)] h-[190px] left-0 rounded-[20px] top-1/2 translate-y-[-50%] w-[6px]" />;
}

function Frame25() {
  return <div className="absolute bg-white h-[57px] left-0 rounded-[20px] top-[calc(50%-68.5px)] translate-y-[-50%] w-[6px]" />;
}

function Frame26() {
  return (
    <div className="absolute h-[190px] left-[432px] overflow-clip rounded-[20px] top-1/2 translate-y-[-50%] w-[6px]">
      <Frame24 />
      <Frame25 />
    </div>
  );
}

function People() {
  return (
    <div className="absolute bg-[rgba(247,247,247,0.2)] h-[722px] left-[946px] overflow-clip rounded-[20px] top-[62px] w-[462px]" data-name="People">
      <Frame23 />
      <Frame26 />
    </div>
  );
}

export default function SilentModePeopleOptions() {
  return (
    <div className="bg-[#141316] relative size-full" data-name="Silent Mode - People - Options">
      <Frame1 />
      <Frame21 />
      <People />
    </div>
  );
}