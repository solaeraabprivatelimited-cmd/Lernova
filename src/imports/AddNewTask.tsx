import svgPaths from "./svg-dalfud3wlq";

function Fa7SolidTasks() {
  return (
    <div className="relative shrink-0 size-[36px]" data-name="fa7-solid:tasks">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="fa7-solid:tasks">
          <rect fill="var(--fill-0, #F77F00)" height="36" rx="5" width="36" />
          <path d={svgPaths.p3a4ec300} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full">
      <Fa7SolidTasks />
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-black">Add New Task</p>
    </div>
  );
}

function EmailTypist() {
  return (
    <div className="h-[39px] relative rounded-[10px] shrink-0 w-full" data-name="Email Typist">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.4)] border-solid inset-[-0.5px] pointer-events-none rounded-[10.5px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[10px] relative size-full">
          <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.6)]">example@ybl</p>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-[73px] items-start relative shrink-0 w-[592px]">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black">Task Name</p>
      <EmailTypist />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[42px] items-center justify-center min-h-px min-w-px relative rounded-[20px]">
      <div aria-hidden="true" className="absolute border border-[#cc3636] border-solid inset-[-0.5px] pointer-events-none rounded-[20.5px]" />
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#cc3636] text-[14px]">Cancel</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#f77f00] content-stretch flex flex-[1_0_0] h-[42px] items-center justify-center min-h-px min-w-px relative rounded-[20px]">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white">Add Task</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-[334px]">
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-end relative shrink-0 w-[592px]">
      <Frame5 />
      <Frame />
      <Frame3 />
    </div>
  );
}

export default function AddNewTask() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start justify-center overflow-clip p-[32px] relative rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] size-full" data-name="Add New Task">
      <Frame4 />
    </div>
  );
}