import svgPaths from "./svg-5uyq6vimux";

function Frame4() {
  return (
    <div className="content-stretch flex items-center justify-between leading-[normal] not-italic relative shrink-0 w-full">
      <p className="font-['Poppins:Medium',sans-serif] relative shrink-0 text-[16px] text-black">Notifications</p>
      <p className="decoration-solid font-['Poppins:Regular',sans-serif] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)] underline">View All</p>
    </div>
  );
}

function Fa7SolidTasks() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="fa7-solid:tasks">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
        <g id="fa7-solid:tasks">
          <rect fill="var(--fill-0, #FFD60A)" height="44" rx="5" width="44" />
          <path d={svgPaths.p9048700} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:Regular',sans-serif] items-start justify-center leading-[normal] not-italic relative shrink-0">
      <p className="relative shrink-0 text-[14px] text-black">Reminder</p>
      <div className="relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)] whitespace-nowrap">
        <p className="mb-0">Maths Study Session</p>
        <p>10PM</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full">
      <Fa7SolidTasks />
      <Frame6 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0">
      <Frame2 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)]">Reminder Notifications</p>
      <Frame />
    </div>
  );
}

function Group() {
  return (
    <div className="h-[14.004px] relative shrink-0 w-[12px]" data-name="Group">
      <div className="absolute inset-[-5.36%_-6.25%_-5.33%_-6.25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5002 15.4998">
          <g id="Group">
            <path d={svgPaths.p32c303f0} id="Vector" stroke="var(--stroke-0, white)" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p2b26e580} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.pa20fe80} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Fa7SolidTasks1() {
  return (
    <div className="bg-[#1ca4b3] content-stretch flex flex-col items-center justify-center overflow-clip py-px relative rounded-[5px] shrink-0 size-[44px]" data-name="fa7-solid:tasks">
      <Group />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:Regular',sans-serif] items-start justify-center leading-[normal] not-italic relative shrink-0">
      <p className="relative shrink-0 text-[14px] text-black">Study Plan</p>
      <div className="relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)] whitespace-nowrap">
        <p className="mb-0">Advanced Physics</p>
        <p>{`9:00 AM  -  11:00AM`}</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full">
      <Fa7SolidTasks1 />
      <Frame8 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0">
      <Frame3 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)]">Study Plan Notifications</p>
      <Frame1 />
    </div>
  );
}

export default function Notifications() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start justify-center overflow-clip p-[32px] relative rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] size-full" data-name="Notifications">
      <Frame4 />
      <Frame5 />
      <Frame7 />
    </div>
  );
}