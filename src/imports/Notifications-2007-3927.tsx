import svgPaths from "./svg-cmbk1wuz0q";

function Frame4() {
  return (
    <div className="content-stretch flex items-center justify-between leading-[normal] not-italic relative shrink-0 w-full">
      <p className="font-['Poppins:Medium',sans-serif] relative shrink-0 text-[16px] text-black">Notifications</p>
      <p className="decoration-solid font-['Poppins:Regular',sans-serif] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)] underline">View All</p>
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

function Fa7SolidTasks() {
  return (
    <div className="bg-[#f77f00] content-stretch flex flex-col items-center justify-center overflow-clip py-px relative rounded-[5px] shrink-0 size-[44px]" data-name="fa7-solid:tasks">
      <IxMaintenanceFilled />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col font-['Poppins:Regular',sans-serif] items-start justify-center leading-[normal] min-h-px min-w-px not-italic relative">
      <p className="relative shrink-0 text-[14px] text-black">Server Maintenance</p>
      <p className="min-w-full relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)] w-[min-content] whitespace-pre-wrap">Scheduled server maintenance is ongoing. Some features may be temporarily unavailable.</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <Fa7SolidTasks />
      <Frame6 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame2 />
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

function Fa7SolidTasks1() {
  return (
    <div className="bg-[#3451b1] content-stretch flex flex-col items-center justify-center overflow-clip py-px relative rounded-[5px] shrink-0 size-[44px]" data-name="fa7-solid:tasks">
      <MaterialSymbolsRocketOutline />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col font-['Poppins:Regular',sans-serif] items-start justify-center leading-[normal] min-h-px min-w-px not-italic relative">
      <p className="relative shrink-0 text-[14px] text-black">New Feature Release</p>
      <p className="min-w-full relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)] w-[min-content] whitespace-pre-wrap">A new update is available! Check out the latest features and improvements.</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <Fa7SolidTasks1 />
      <Frame7 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame3 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)] w-[163px] whitespace-pre-wrap">System and Platform Alerts</p>
      <Frame />
      <Frame1 />
    </div>
  );
}

export default function Notifications() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start justify-center overflow-clip p-[32px] relative rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] size-full" data-name="Notifications">
      <Frame4 />
      <Frame5 />
    </div>
  );
}