export default function MentorNotification() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start justify-center overflow-clip p-[32px] relative rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] size-full" data-name="Mentor Notification">
      <div className="content-stretch flex items-center justify-between leading-[normal] not-italic relative shrink-0 w-full">
        <p className="font-['Poppins:Medium',sans-serif] relative shrink-0 text-[16px] text-black">Notifications</p>
        <p className="decoration-solid font-['Poppins:Regular',sans-serif] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)] underline">View All</p>
      </div>
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
        <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.7)]">No avialable Notifications</p>
      </div>
    </div>
  );
}