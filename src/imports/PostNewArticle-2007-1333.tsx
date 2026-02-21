import svgPaths from "./svg-ao7iptlbn4";
import imgImage28 from "figma:asset/605a593a8aec5bcd93a6caef17da90dbf55364dc.png";

function Frame3() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.8)]">Mental Health</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-white relative rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)] shrink-0 w-full">
      <div className="content-stretch flex items-start p-[16px] relative w-full">
        <Frame3 />
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Poppins:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.7)] w-[533px] whitespace-pre-wrap">In the middle of exams or daily stress, remember—it’s okay to pause. A few deep breaths, a quick walk, or journaling your thoughts can help you reset. Mental health isn’t about being happy all the time; it’s about giving yourself space to recharge and feel. 💬💙</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-white h-[222px] relative rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)] shrink-0 w-full">
      <div className="content-stretch flex items-start p-[16px] relative size-full">
        <Frame6 />
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function CharmCross() {
  return (
    <div className="absolute left-[90px] size-[13px] top-[7px]" data-name="charm:cross">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
        <g id="charm:cross">
          <rect fill="var(--fill-0, white)" height="13" rx="6.5" width="13" />
          <path d={svgPaths.p11434fc0} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.850136" />
        </g>
      </svg>
    </div>
  );
}

function Pic() {
  return (
    <div className="h-[113px] overflow-clip relative rounded-[20px] shrink-0 w-[112px]" data-name="Pic">
      <div className="absolute h-[113px] left-[-41px] top-0 w-[194px]" data-name="image 28">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage28} />
      </div>
      <CharmCross />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[12.5%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.25 35.25">
        <g id="Group">
          <path d={svgPaths.p2e367c00} fill="var(--fill-0, #F77F00)" fillOpacity="0.2" id="Vector" />
          <path d={svgPaths.pa4ae8c0} id="Vector_2" stroke="var(--stroke-0, #F77F00)" strokeLinecap="square" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function LetsIconsAddDuotone() {
  return (
    <div className="overflow-clip relative shrink-0 size-[47px]" data-name="lets-icons:add-duotone">
      <Group />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Pic />
      <LetsIconsAddDuotone />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[42px] items-center justify-center min-h-px min-w-px relative rounded-[20px]">
      <div aria-hidden="true" className="absolute border border-[#cc3636] border-solid inset-[-0.5px] pointer-events-none rounded-[20.5px]" />
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#cc3636] text-[14px]">Cancel</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#003566] content-stretch flex flex-[1_0_0] h-[42px] items-center justify-center min-h-px min-w-px relative rounded-[20px]">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white">Post Article</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[337px]">
      <Frame />
      <Frame1 />
    </div>
  );
}

export default function PostNewArticle() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-end p-[24px] relative rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] size-full" data-name="Post New Article">
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[24px] text-black w-[min-content] whitespace-pre-wrap">Post New Article</p>
      <Frame7 />
      <Frame8 />
      <Frame2 />
    </div>
  );
}