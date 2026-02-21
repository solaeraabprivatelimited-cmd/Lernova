import svgPaths from "./svg-rie42b8guu";

function Frame3() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.8)]">Article Title</p>
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
      <p className="font-['Poppins:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.7)] w-[533px] whitespace-pre-wrap">Article Content</p>
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

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function TdesignAttach() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="tdesign:attach">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="tdesign:attach">
          <path d={svgPaths.p350cac80} id="Vector" stroke="var(--stroke-0, #F77F00)" strokeLinecap="square" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#f77f00] text-[12px]">Attach Image, Video</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex gap-[10px] items-center justify-center left-0 p-[10px] rounded-[10px] top-0">
      <div aria-hidden="true" className="absolute border border-[#f77f00] border-solid inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)]" />
      <TdesignAttach />
      <Frame8 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="h-[40px] relative shrink-0 w-full">
      <Frame7 />
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
      <Frame9 />
      <Frame10 />
      <Frame2 />
    </div>
  );
}