export default function PostMotivationalQuoteStory() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-end p-[24px] relative rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] size-full" data-name="Post Motivational Quote/Story">
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[24px] text-black w-[min-content] whitespace-pre-wrap">Post Motivational Quote/Story</p>
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
        <div className="bg-white relative rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Email Typist">
          <div className="content-stretch flex items-start justify-between p-[16px] relative w-full">
            <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.8)]">Post Type</p>
            <button className="block cursor-pointer relative shrink-0 size-[24px]" data-name="Arrow">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <g id="Arrow">
                  <path d="M7 10L12 15L17 10" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.5" />
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
        <div className="content-stretch flex h-[42px] items-center justify-center relative rounded-[20px] shrink-0 w-[160.5px]">
          <div aria-hidden="true" className="absolute border border-[#cc3636] border-solid inset-[-0.5px] pointer-events-none rounded-[20.5px]" />
          <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#cc3636] text-[14px]">Cancel</p>
        </div>
        <div className="bg-[#a6a6a6] content-stretch flex h-[42px] items-center justify-center relative rounded-[20px] shrink-0 w-[160.5px]">
          <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white">Post</p>
        </div>
      </div>
    </div>
  );
}