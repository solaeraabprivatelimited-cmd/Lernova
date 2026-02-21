import svgPaths from "./svg-i7uh1o2nwx";

function Frame10() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center leading-[normal] not-italic relative shrink-0">
      <p className="font-['Poppins:Regular',sans-serif] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">{`< Back`}</p>
      <p className="font-['Poppins:Medium',sans-serif] relative shrink-0 text-[32px] text-black">Add UPI</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[611px]">
      <Frame10 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[10.94%]" data-name="Group">
      <div className="absolute inset-[-3.56%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.125 30.125">
          <g id="Group">
            <path d={svgPaths.p361eb80} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.pbf6e7f0} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function CharmCircleCross() {
  return (
    <div className="overflow-clip relative shrink-0 size-[36px]" data-name="charm:circle-cross">
      <Group />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Frame1 />
      <CharmCircleCross />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[11.46%_23.95%_11.46%_23.96%]" data-name="Group">
      <div className="absolute inset-[-4.05%_-6.01%_-4.06%_-5.99%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.1304 23.0435">
          <g id="Group">
            <path d={svgPaths.p3674de00} id="Vector" stroke="var(--stroke-0, #F85FA1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.72826" />
            <path d="M6.91195 18.1481H9.2163" id="Vector_2" stroke="var(--stroke-0, #F85FA1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.72826" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ProiconsPhone() {
  return (
    <div className="overflow-clip relative shrink-0 size-[27.652px]" data-name="proicons:phone">
      <Group1 />
    </div>
  );
}

function RadixIconsPeople() {
  return (
    <div className="bg-[rgba(248,95,161,0.2)] content-stretch flex flex-col items-center justify-center overflow-clip py-[2.304px] relative rounded-[23.043px] shrink-0 size-[53px]" data-name="radix-icons:people">
      <ProiconsPhone />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <RadixIconsPeople />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <Frame2 />
    </div>
  );
}

function EmailTypist() {
  return (
    <div className="h-[39px] relative rounded-[10px] shrink-0 w-full" data-name="Email Typist">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.4)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[10px] relative size-full">
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">yourname@upi</p>
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-black w-full whitespace-pre-wrap">UPI ID</p>
      <EmailTypist />
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#e4e4e4] content-stretch flex h-[42px] items-center justify-center px-[24px] py-[10px] relative rounded-[20px] shrink-0">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.6)]">Cancel</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#f96faa] content-stretch flex h-[42px] items-center justify-center px-[24px] py-[10px] relative rounded-[20px] shrink-0">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-white">Add UPI</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0 w-full">
      <Frame3 />
      <Frame />
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start justify-center p-[32px] relative rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] shrink-0 w-[663px]">
      <Frame5 />
      <Frame9 />
      <Frame4 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[663px]">
      <Frame6 />
    </div>
  );
}

export default function Upi() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-center justify-center overflow-clip p-[32px] relative rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] size-full" data-name="UPI">
      <Frame8 />
      <Frame7 />
    </div>
  );
}