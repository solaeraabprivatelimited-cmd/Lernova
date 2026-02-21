import svgPaths from "./svg-89qwp7mp2e";

function CilRoom() {
  return (
    <div className="relative shrink-0 size-[27px]" data-name="cil:room">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 27">
        <g id="cil:room">
          <path d={svgPaths.p6efe00} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p1e94b00} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function EmailTypist() {
  return (
    <div className="h-[39px] relative rounded-[10px] shrink-0 w-full" data-name="Email Typist">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.4)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] relative size-full">
          <CilRoom />
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-black">Ram’s Room</p>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black">Room Name</p>
      <EmailTypist />
    </div>
  );
}

function UilSubject() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="uil:subject">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="uil:subject">
          <path d={svgPaths.p2ea8b700} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function EmailTypist1() {
  return (
    <div className="h-[39px] relative rounded-[10px] shrink-0 w-full" data-name="Email Typist">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.4)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] relative size-full">
          <UilSubject />
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-black">Maths</p>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black">Subject/Topic</p>
      <EmailTypist1 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[8.33%_12.5%]" data-name="Group">
      <div className="absolute inset-[-3.75%_-4.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.5002 21.5">
          <g id="Group">
            <path d={svgPaths.p28b4a900} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p24cceb00} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p2baa9800} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function HugeiconsSecurity() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="hugeicons:security">
      <Group />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <HugeiconsSecurity />
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.8)]">Private</p>
    </div>
  );
}

function EmailTypist2() {
  return (
    <div className="bg-[#c9e5ff] flex-[1_0_0] min-h-px min-w-px relative rounded-[10px]" data-name="Email Typist">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[10px] items-start justify-center p-[10px] relative w-full">
          <Frame4 />
          <div className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.8)] whitespace-nowrap">
            <p className="mb-0">{`Accessible only through a `}</p>
            <p>Room ID or invitation link.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[20px]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <path d={svgPaths.p39fda200} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.8)] text-left">Public</p>
    </div>
  );
}

function EmailTypist3() {
  return (
    <button className="cursor-pointer flex-[1_0_0] min-h-px min-w-px relative rounded-[10px]" data-name="Email Typist">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.4)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[10px] items-start justify-center p-[10px] relative w-full">
          <Frame5 />
          <div className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.6)] text-left whitespace-nowrap">
            <p className="mb-0">{`Open to all learners and listed `}</p>
            <p>in Join Random Room Page.</p>
          </div>
        </div>
      </div>
    </button>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full">
      <EmailTypist2 />
      <EmailTypist3 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[42px] items-center justify-center min-h-px min-w-px relative rounded-[20px]">
      <div aria-hidden="true" className="absolute border-2 border-[#003566] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#003566] text-[14px]">Share Room</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#003566] content-stretch flex flex-[1_0_0] h-[42px] items-center justify-center min-h-px min-w-px relative rounded-[20px]">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white">Launch Room</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-[299px]">
      <Frame3 />
      <Frame6 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-end relative shrink-0 w-[467px]">
      <Frame />
      <Frame2 />
      <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-[467px]" data-name="Room Type">
        <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black">Select Room Type</p>
        <Frame1 />
      </div>
      <Frame7 />
    </div>
  );
}

export default function Frame9() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start justify-center overflow-clip p-[24px] relative rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] size-full">
      <Frame8 />
    </div>
  );
}