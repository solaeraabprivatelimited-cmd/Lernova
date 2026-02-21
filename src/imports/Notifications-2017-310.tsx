import svgPaths from "./svg-eubd98mb3p";

function Group() {
  return (
    <div className="h-[52.639px] relative shrink-0 w-[55px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 55 52.6395">
        <g id="Group">
          <path d={svgPaths.p33c598c0} fill="var(--fill-0, #70AF53)" id="Vector" />
          <path d={svgPaths.p1fb25640} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[10.94%]" data-name="Group">
      <div className="absolute inset-[-4.27%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.4375 25.4375">
          <g id="Group">
            <path d={svgPaths.p1fa5e980} id="Vector" stroke="var(--stroke-0, #FF5E5E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p2b2fdd00} id="Vector_2" stroke="var(--stroke-0, #FF5E5E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function CharmCircleCross() {
  return (
    <div className="overflow-clip relative shrink-0 size-[30px]" data-name="charm:circle-cross">
      <Group1 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black">Session Successfully Posted</p>
      <CharmCircleCross />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center relative shrink-0">
      <Group />
      <Frame />
    </div>
  );
}

export default function Notifications() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start justify-center overflow-clip p-[32px] relative rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] size-full" data-name="Notifications">
      <Frame1 />
    </div>
  );
}