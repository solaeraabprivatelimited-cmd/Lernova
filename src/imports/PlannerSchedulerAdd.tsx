import svgPaths from "./svg-dk21kzz75f";

function Fa7SolidTasks() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="fa7-solid:tasks">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="fa7-solid:tasks">
          <rect fill="var(--fill-0, #F77F00)" height="24" rx="5" width="24" />
          <path d={svgPaths.p27706680} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full">
      <Fa7SolidTasks />
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-black">Add New Task</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0">
      <Frame1 />
    </div>
  );
}

function Fa7SolidTasks1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="fa7-solid:tasks">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="fa7-solid:tasks">
          <rect fill="var(--fill-0, #FFD60A)" height="24" rx="5" width="24" />
          <path d={svgPaths.p67f3e80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <Fa7SolidTasks1 />
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-black">Add Smart Reminder</p>
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

function Fa7SolidTasks2() {
  return (
    <div className="bg-[#1ca4b3] content-stretch flex flex-col items-center justify-center overflow-clip py-px relative rounded-[5px] shrink-0 size-[24px]" data-name="fa7-solid:tasks">
      <Group />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <Fa7SolidTasks2 />
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-black">Create Study Plan</p>
    </div>
  );
}

export default function PlannerSchedulerAdd() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start justify-center overflow-clip p-[32px] relative rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] size-full" data-name="Planner/Scheduler - Add">
      <Frame />
      <Frame2 />
      <Frame3 />
    </div>
  );
}