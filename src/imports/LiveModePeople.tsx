import svgPaths from "./svg-vynhosbk1b";
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
          <path d={svgPaths.p11e7f740} id="Vector" stroke="var(--stroke-0, black)" strokeLinejoin="round" strokeWidth="2" />
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

function Group() {
  return (
    <div className="absolute inset-[8.33%_8.33%_8.34%_8.33%]" data-name="Group">
      <div className="absolute inset-[-3.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.6667 28.6667">
          <g id="Group">
            <path d={svgPaths.p1fd3cb00} id="Vector" stroke="var(--stroke-0, white)" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p2fc5af00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IconParkOutlineCloseOne() {
  return (
    <div className="overflow-clip relative shrink-0 size-[32px]" data-name="icon-park-outline:close-one">
      <Group />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-end relative shrink-0 w-full">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-white w-[357px]">People</p>
      <IconParkOutlineCloseOne />
    </div>
  );
}

function Frame26() {
  return (
    <div className="relative rounded-[200px] shrink-0 size-[30px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
        <div className="absolute bg-white inset-0 rounded-[200px]" />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgFrame427318292} />
      </div>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[172px]">
      <Frame26 />
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

function Mic() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Mic">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Mic">
          <path d={svgPaths.p3a83ea80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function MiOptionsVertical() {
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

function Frame29() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[60px]">
      <PinUnpin />
      <Mic />
      <MiOptionsVertical />
    </div>
  );
}

function Frame11() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[69px] items-center px-[24px] py-[9px] relative w-full">
          <Frame27 />
          <Frame29 />
        </div>
      </div>
    </div>
  );
}

function Frame30() {
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

function Frame31() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[172px]">
      <Frame30 />
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

function Mic1() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Mic">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Mic">
          <path d={svgPaths.p3a83ea80} fill="var(--fill-0, white)" id="Vector" />
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

function Frame32() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[60px]">
      <PinUnpin1 />
      <Mic1 />
      <MiOptionsVertical1 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[70px] items-center px-[24px] py-[9px] relative w-full">
          <Frame31 />
          <Frame32 />
        </div>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="relative rounded-[200px] shrink-0 size-[30px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
        <div className="absolute bg-white inset-0 rounded-[200px]" />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgFrame427318293} />
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[172px]">
      <Frame33 />
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

function Mic2() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Mic">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Mic">
          <path d={svgPaths.p3a83ea80} fill="var(--fill-0, white)" id="Vector" />
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

function Frame35() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[60px]">
      <PinUnpin2 />
      <Mic2 />
      <MiOptionsVertical2 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[70px] items-center px-[24px] py-[9px] relative w-full">
          <Frame34 />
          <Frame35 />
        </div>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="relative rounded-[200px] shrink-0 size-[30px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
        <div className="absolute bg-white inset-0 rounded-[200px]" />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgFrame427318294} />
      </div>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[172px]">
      <Frame36 />
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

function Mic3() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Mic">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Mic">
          <path d={svgPaths.p3a83ea80} fill="var(--fill-0, white)" id="Vector" />
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

function Frame38() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[60px]">
      <PinUnpin3 />
      <Mic3 />
      <MiOptionsVertical3 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[70px] items-center px-[24px] py-[9px] relative w-full">
          <Frame37 />
          <Frame38 />
        </div>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="relative rounded-[200px] shrink-0 size-[30px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
        <div className="absolute bg-white inset-0 rounded-[200px]" />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgFrame427318295} />
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[172px]">
      <Frame39 />
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

function Mic4() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Mic">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Mic">
          <path d={svgPaths.p3a83ea80} fill="var(--fill-0, white)" id="Vector" />
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

function Frame41() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[60px]">
      <PinUnpin4 />
      <Mic4 />
      <MiOptionsVertical4 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[70px] items-center px-[24px] py-[9px] relative w-full">
          <Frame40 />
          <Frame41 />
        </div>
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="relative rounded-[200px] shrink-0 size-[30px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
        <div className="absolute bg-white inset-0 rounded-[200px]" />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgFrame427318296} />
      </div>
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[172px]">
      <Frame42 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">Steve</p>
    </div>
  );
}

function Frame28() {
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

function Mic5() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Mic">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Mic">
          <path d={svgPaths.p3a83ea80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
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

function Frame44() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[60px]">
      <Frame28 />
      <Mic5 />
      <MiOptionsVertical5 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[70px] items-center px-[24px] py-[9px] relative w-full">
          <Frame43 />
          <Frame44 />
        </div>
      </div>
    </div>
  );
}

function Frame45() {
  return (
    <div className="relative rounded-[200px] shrink-0 size-[30px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
        <div className="absolute bg-white inset-0 rounded-[200px]" />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgFrame427318297} />
      </div>
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[172px]">
      <Frame45 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">Harry</p>
    </div>
  );
}

function Frame47() {
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

function Mic6() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Mic">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Mic">
          <path d={svgPaths.p3a83ea80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
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

function Frame48() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[60px]">
      <Frame47 />
      <Mic6 />
      <MiOptionsVertical6 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[70px] items-center px-[24px] py-[9px] relative w-full">
          <Frame46 />
          <Frame48 />
        </div>
      </div>
    </div>
  );
}

function Frame49() {
  return (
    <div className="relative rounded-[200px] shrink-0 size-[30px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[200px]">
        <div className="absolute bg-white inset-0 rounded-[200px]" />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[200px] size-full" src={imgFrame427318298} />
      </div>
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[172px]">
      <Frame49 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">Ron</p>
    </div>
  );
}

function Frame51() {
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

function Mic7() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Mic">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Mic">
          <path d={svgPaths.p3a83ea80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
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

function Frame52() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[60px]">
      <Frame51 />
      <Mic7 />
      <MiOptionsVertical7 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[70px] items-center px-[24px] py-[9px] relative w-full">
          <Frame50 />
          <Frame52 />
        </div>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[386px]">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.6)] text-nowrap">In Room</p>
      <Frame11 />
      <Frame13 />
      <Frame14 />
      <Frame15 />
      <Frame16 />
      <Frame17 />
      <Frame19 />
      <Frame12 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] items-start left-[32px] top-[40px] w-[399px]">
      <Frame18 />
      <Frame21 />
    </div>
  );
}

function Frame23() {
  return <div className="absolute bg-[rgba(152,152,152,0.2)] h-[190px] left-0 rounded-[20px] top-1/2 translate-y-[-50%] w-[6px]" />;
}

function Frame24() {
  return <div className="absolute bg-white h-[57px] left-0 rounded-[20px] top-[calc(50%-68.5px)] translate-y-[-50%] w-[6px]" />;
}

function Frame25() {
  return (
    <div className="absolute h-[190px] left-[432px] overflow-clip rounded-[20px] top-1/2 translate-y-[-50%] w-[6px]">
      <Frame23 />
      <Frame24 />
    </div>
  );
}

function People() {
  return (
    <div className="absolute bg-[rgba(247,247,247,0.2)] h-[722px] left-[946px] overflow-clip rounded-[20px] top-[62px] w-[462px]" data-name="People">
      <Frame22 />
      <Frame25 />
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
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">Live Mode</p>
    </div>
  );
}

function Group1() {
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
    <div className="content-stretch flex h-[52px] items-center justify-center overflow-clip px-[5px] py-[3px] relative rounded-[100px] shrink-0 w-[41px]" data-name="Block Notifications">
      <SvgRepoIconCarrier />
    </div>
  );
}

function Group2() {
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

function Mic8() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Mic">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Mic">
          <path d={svgPaths.p3a83ea80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function FluentShareScreenStart24Regular() {
  return (
    <div className="relative shrink-0 size-[34px]" data-name="fluent:share-screen-start-24-regular">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
        <g id="fluent:share-screen-start-24-regular">
          <path d={svgPaths.p217cdb00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function IonPeople() {
  return (
    <div className="relative shrink-0 size-[70px]" data-name="ion:people">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70 70">
        <g id="ion:people">
          <rect fill="var(--fill-0, white)" fillOpacity="0.1" height="70" rx="20" width="70" />
          <path d={svgPaths.p1eafa800} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame53() {
  return (
    <div className="relative shrink-0 size-[27px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 27">
        <g id="Frame 427318327">
          <path d={svgPaths.p9476e00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function GrommetIconsChat() {
  return (
    <div className="relative size-[24px]" data-name="grommet-icons:chat">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_10_6543)" id="grommet-icons:chat">
          <path d={svgPaths.p2cd963a0} id="Vector" stroke="var(--stroke-0, white)" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_10_6543">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function CollaborativeModeRoomNavBar() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] content-stretch flex gap-[32px] h-[52px] items-center justify-center relative rounded-[20px] shrink-0 w-[618px]" data-name="Collaborative Mode Room Nav Bar">
      <Group1 />
      <BlockNotifications />
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Group2 />
        </div>
      </div>
      <VideoIcon />
      <Mic8 />
      <FluentShareScreenStart24Regular />
      <IonPeople />
      <Frame53 />
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <GrommetIconsChat />
        </div>
      </div>
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

function Frame20() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[calc(50%-0.5px)] top-[814px] translate-x-[-50%] w-[1373px]">
      <Frame2 />
      <CollaborativeModeRoomNavBar />
      <Frame />
    </div>
  );
}

export default function LiveModePeople() {
  return (
    <div className="bg-[#141316] relative size-full" data-name="Live Mode - People">
      <Frame1 />
      <People />
      <Frame20 />
    </div>
  );
}