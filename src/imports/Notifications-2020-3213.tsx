import svgPaths from "./svg-01ihyd8lbh";

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[32px] text-black">Add New Payment Method</p>
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

function Frame10() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame2 />
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

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <RadixIconsPeople />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <Frame3 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center leading-[normal] not-italic relative shrink-0 tracking-[-0.2px]">
      <p className="font-['Poppins:Medium',sans-serif] relative shrink-0 text-[24px] text-black">UPI</p>
      <p className="font-['Poppins:Regular',sans-serif] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.6)]">{`Quick and instant payments via UPI ID `}</p>
    </div>
  );
}

function BitcoinIconsArrowUpFilled() {
  return (
    <div className="relative size-[22px]" data-name="bitcoin-icons:arrow-up-filled">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="bitcoin-icons:arrow-up-filled">
          <path clipRule="evenodd" d={svgPaths.p16746080} fill="var(--fill-0, #F85FA1)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[6px] items-start justify-center relative shrink-0">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#f85fa1] text-[14px] tracking-[-0.2px]">Select</p>
      <div className="flex items-center justify-center relative shrink-0 size-[22px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <BitcoinIconsArrowUpFilled />
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-center justify-center p-[32px] relative rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] shrink-0">
      <Frame5 />
      <Frame />
      <Frame8 />
    </div>
  );
}

function FamiconsCardOutline() {
  return (
    <div className="relative shrink-0 size-[27.652px]" data-name="famicons:card-outline">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.6522 27.6522">
        <g id="famicons:card-outline">
          <path d={svgPaths.p3d90b700} id="Vector" stroke="var(--stroke-0, #8A38F5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.15217" />
          <path d={svgPaths.pd0f5dc0} id="Vector_2" stroke="var(--stroke-0, #8A38F5)" strokeLinejoin="round" strokeWidth="2.16033" />
        </g>
      </svg>
    </div>
  );
}

function RadixIconsPeople1() {
  return (
    <div className="bg-[rgba(138,56,245,0.2)] content-stretch flex flex-col items-center justify-center overflow-clip py-[2.304px] relative rounded-[23.043px] shrink-0 size-[53px]" data-name="radix-icons:people">
      <FamiconsCardOutline />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <RadixIconsPeople1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center leading-[normal] not-italic relative shrink-0 tracking-[-0.2px]">
      <p className="font-['Poppins:Medium',sans-serif] relative shrink-0 text-[24px] text-black">Bank Account</p>
      <p className="font-['Poppins:Regular',sans-serif] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.6)]">Direct bank transfer to your account</p>
    </div>
  );
}

function BitcoinIconsArrowUpFilled1() {
  return (
    <div className="relative size-[22px]" data-name="bitcoin-icons:arrow-up-filled">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="bitcoin-icons:arrow-up-filled">
          <path clipRule="evenodd" d={svgPaths.p16746080} fill="var(--fill-0, #8A38F5)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[6px] items-start justify-center relative shrink-0">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#8a38f5] text-[14px] tracking-[-0.2px]">Select</p>
      <div className="flex items-center justify-center relative shrink-0 size-[22px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <BitcoinIconsArrowUpFilled1 />
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-center justify-center p-[32px] relative rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] shrink-0 w-[283px]">
      <Frame4 />
      <Frame1 />
      <Frame11 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[32px] items-start relative shrink-0">
      <Frame6 />
      <Frame7 />
    </div>
  );
}

export default function Notifications() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-center justify-center overflow-clip p-[32px] relative rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] size-full" data-name="Notifications">
      <Frame10 />
      <Frame9 />
    </div>
  );
}