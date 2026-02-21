import svgPaths from "./svg-l2kj1bdhcf";

function Frame15() {
  return (
    <div className="content-stretch flex items-center justify-between not-italic relative shrink-0 w-full">
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] relative shrink-0 text-[16px] text-black">Notifications</p>
      <button className="block cursor-pointer font-['Poppins:Regular',sans-serif] leading-[0] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)] text-left whitespace-nowrap">
        <p className="decoration-solid leading-[normal] underline">View Less</p>
      </button>
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

function Frame18() {
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

function Frame8() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full">
      <Fa7SolidTasks />
      <Frame18 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0">
      <Frame8 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[299px]">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)]">Reminder Notifications</p>
      <Frame1 />
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

function Frame20() {
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

function Frame9() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full">
      <Fa7SolidTasks1 />
      <Frame20 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0">
      <Frame9 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[299px]">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)]">Study Plan Notifications</p>
      <Frame2 />
    </div>
  );
}

function Fa7SolidTasks2() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="fa7-solid:tasks">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
        <g id="fa7-solid:tasks">
          <rect fill="var(--fill-0, #8A38F5)" height="44" rx="5" width="44" />
          <path d={svgPaths.p9048700} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame22() {
  return (
    <div className="font-['Poppins:Regular',sans-serif] h-[75px] not-italic relative shrink-0 w-[192px]">
      <p className="absolute leading-[normal] left-0 text-[14px] text-black top-0">Session Reminder</p>
      <p className="absolute leading-[normal] left-0 text-[12px] text-[rgba(0,0,0,0.7)] top-[21px]">Your Session Starts in 10 Minutes</p>
      <p className="absolute leading-[0] left-0 text-[12px] text-[rgba(0,0,0,0.7)] top-[39px]">
        <span className="leading-[normal] text-black">Mentor Name:</span>
        <span className="leading-[normal] text-[rgba(0,0,0,0.9)]">{` `}</span>
        <span className="leading-[normal]">Ravi Kumar</span>
      </p>
      <p className="absolute leading-[0] left-0 text-[12px] text-[rgba(0,0,0,0.7)] top-[57px]">
        <span className="leading-[normal] text-black">Time:</span>
        <span className="leading-[normal]">{` 5:00PM - 6:00Pm`}</span>
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#8a38f5] content-stretch flex h-[30px] items-center justify-center relative rounded-[20px] shrink-0 w-full">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-white">Join Session</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-[245px]">
      <Frame22 />
      <Frame />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full">
      <Fa7SolidTasks2 />
      <Frame21 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full">
      <Frame10 />
    </div>
  );
}

function MdiReschedule() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mdi:reschedule">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mdi:reschedule">
          <path d={svgPaths.p39f39c00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Fa7SolidTasks3() {
  return (
    <div className="bg-[#dc2626] content-stretch flex flex-col items-center justify-center overflow-clip py-px relative rounded-[5px] shrink-0 size-[44px]" data-name="fa7-solid:tasks">
      <MdiReschedule />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:Regular',sans-serif] items-start justify-center leading-[normal] not-italic relative shrink-0">
      <p className="relative shrink-0 text-[14px] text-black">Session Rescheduled</p>
      <div className="relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)] whitespace-nowrap">
        <p className="mb-0">New Date and Time:</p>
        <p>{`18-10-2025  |  9:00PM - 10:00PM`}</p>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <Fa7SolidTasks3 />
      <Frame23 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame11 />
    </div>
  );
}

function QlementineIconsCheckTick() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="qlementine-icons:check-tick-16">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="qlementine-icons:check-tick-16">
          <path clipRule="evenodd" d={svgPaths.p31927700} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Fa7SolidTasks4() {
  return (
    <div className="bg-[#34b161] content-stretch flex flex-col items-center justify-center overflow-clip py-px relative rounded-[5px] shrink-0 size-[44px]" data-name="fa7-solid:tasks">
      <QlementineIconsCheckTick />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:Regular',sans-serif] items-start justify-center leading-[normal] not-italic relative shrink-0">
      <p className="relative shrink-0 text-[14px] text-black">Session Booked</p>
      <p className="relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)]">{`18-10-2025  |  9:00PM - 10:00PM`}</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <Fa7SolidTasks4 />
      <Frame24 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame12 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)]">Human-Mentor Session Updates</p>
      <Frame3 />
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function IxMaintenanceFilled() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ix:maintenance-filled">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ix:maintenance-filled">
          <path clipRule="evenodd" d={svgPaths.p326a720} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Fa7SolidTasks5() {
  return (
    <div className="bg-[#f77f00] content-stretch flex flex-col items-center justify-center overflow-clip py-px relative rounded-[5px] shrink-0 size-[44px]" data-name="fa7-solid:tasks">
      <IxMaintenanceFilled />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col font-['Poppins:Regular',sans-serif] items-start justify-center leading-[normal] min-h-px min-w-px not-italic relative">
      <p className="relative shrink-0 text-[14px] text-black">Server Maintenance</p>
      <p className="min-w-full relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)] w-[min-content] whitespace-pre-wrap">Scheduled server maintenance is ongoing. Some features may be temporarily unavailable.</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <Fa7SolidTasks5 />
      <Frame26 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame13 />
    </div>
  );
}

function MaterialSymbolsRocketOutline() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="material-symbols:rocket-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="material-symbols:rocket-outline">
          <path d={svgPaths.p1d676580} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Fa7SolidTasks6() {
  return (
    <div className="bg-[#3451b1] content-stretch flex flex-col items-center justify-center overflow-clip py-px relative rounded-[5px] shrink-0 size-[44px]" data-name="fa7-solid:tasks">
      <MaterialSymbolsRocketOutline />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col font-['Poppins:Regular',sans-serif] items-start justify-center leading-[normal] min-h-px min-w-px not-italic relative">
      <p className="relative shrink-0 text-[14px] text-black">New Feature Release</p>
      <p className="min-w-full relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)] w-[min-content] whitespace-pre-wrap">A new update is available! Check out the latest features and improvements.</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <Fa7SolidTasks6 />
      <Frame27 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame14 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[299px]">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)] w-[163px] whitespace-pre-wrap">System and Platform Alerts</p>
      <Frame6 />
      <Frame7 />
    </div>
  );
}

export default function Notifications() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start justify-center overflow-clip p-[32px] relative rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] size-full" data-name="Notifications">
      <Frame15 />
      <Frame16 />
      <Frame19 />
      <Frame17 />
      <Frame25 />
    </div>
  );
}