import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { type OnboardingRole } from '@/app/lib/onboarding';

interface OnboardingStep {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
}

interface OnboardingWalkthroughProps {
  open: boolean;
  role: OnboardingRole;
  userName?: string | null;
  onOpenChange: (open: boolean) => void;
  onFinish: () => void;
  onStepAction: (index: number) => void;
}

const STEP_COPY: Record<OnboardingRole, OnboardingStep[]> = {
  student: [
    {
      eyebrow: 'Start Here',
      title: 'Pick a study room that matches your energy',
      description: 'Focus Mode is the fastest way to begin, while Silent, Collaborative, and Live rooms give you different ways to stay accountable.',
      ctaLabel: 'Open Study Rooms',
    },
    {
      eyebrow: 'Stay Organized',
      title: 'Build momentum with planning tools',
      description: 'Use reminders, study plans, and task tracking to turn one good session into a repeatable routine.',
      ctaLabel: 'Open Productivity Tools',
    },
    {
      eyebrow: 'Get Support',
      title: 'Reach out when you need guidance',
      description: 'AI and human mentor support are ready when you want help breaking through confusion or planning your next step.',
      ctaLabel: 'Open Mentor Support',
    },
  ],
  mentor: [
    {
      eyebrow: 'Start Here',
      title: 'Create your first available session',
      description: 'Publishing a slot is the quickest way to appear ready for bookings and give students a clear next step.',
      ctaLabel: 'Open Create Session',
    },
    {
      eyebrow: 'Stay Responsive',
      title: 'Keep an eye on incoming requests',
      description: 'Session requests are where you can accept, postpone, and manage the learner experience without losing context.',
      ctaLabel: 'Open Requests',
    },
    {
      eyebrow: 'Build Trust',
      title: 'Complete your public mentor presence',
      description: 'Your profile and community presence help students understand your style, subjects, and availability at a glance.',
      ctaLabel: 'Open Profile',
    },
  ],
};

export function OnboardingWalkthrough({
  open,
  role,
  userName,
  onOpenChange,
  onFinish,
  onStepAction,
}: OnboardingWalkthroughProps) {
  const steps = STEP_COPY[role];
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeStep = steps[activeIndex];

  React.useEffect(() => {
    if (open) {
      setActiveIndex(0);
    }
  }, [open]);

  const handleNext = () => {
    setActiveIndex((current) => Math.min(steps.length - 1, current + 1));
  };

  const handleBack = () => {
    setActiveIndex((current) => Math.max(0, current - 1));
  };

  const handleStepAction = () => {
    onStepAction(activeIndex);
  };

  const isLastStep = activeIndex === steps.length - 1;
  const safeName = userName?.trim() || (role === 'mentor' ? 'Mentor' : 'Learner');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[720px] overflow-hidden border-0 bg-transparent p-0 shadow-none">
        <div className="rounded-[28px] bg-white shadow-[0_24px_80px_rgba(0,29,61,0.24)]">
          <div
            className="relative overflow-hidden rounded-t-[28px] px-6 py-6 sm:px-8"
            style={{ background: 'linear-gradient(135deg, #001d3d 0%, #003566 48%, #0967bd 100%)' }}
          >
            <div className="absolute -top-12 right-[-32px] h-36 w-36 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-[-56px] left-[-12px] h-32 w-32 rounded-full bg-[#f77f00]/20 blur-2xl" />

            <DialogHeader className="relative z-10 text-left">
              <div className="mb-3 inline-flex w-fit items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ffd9ad]">
                First-time walkthrough
              </div>
              <DialogTitle className="text-[30px] leading-[1.05] text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Welcome to Elm Orbit, {safeName}
              </DialogTitle>
              <DialogDescription className="max-w-[540px] text-[14px] leading-relaxed text-white/75">
                A quick three-step guide so your first session feels clear instead of crowded.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-7">
            <div className="mb-6 flex gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 flex-1 rounded-full transition-all ${index === activeIndex ? 'bg-[#0967bd]' : 'bg-[#dbe7f3]'}`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_240px] md:items-start">
              <div>
                <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[#f77f00]">
                  {activeStep.eyebrow}
                </p>
                <h3 className="mb-3 text-[26px] leading-[1.1] text-[#0d1b2a]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {activeStep.title}
                </h3>
                <p className="text-[15px] leading-7 text-[#5a7089]">
                  {activeStep.description}
                </p>
              </div>

              <div className="rounded-[24px] border border-[#dbe7f3] bg-[#f8fbff] p-5">
                <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7b91a8]">
                  Step {activeIndex + 1} of {steps.length}
                </div>
                <div className="mb-4 rounded-[20px] bg-white p-4 shadow-[0_12px_30px_rgba(9,103,189,0.08)]">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#003566] text-[13px] font-bold text-white">
                      {activeIndex + 1}
                    </span>
                    <span className="text-[13px] font-semibold text-[#003566]">
                      Recommended next move
                    </span>
                  </div>
                  <p className="text-[14px] leading-6 text-[#4b6279]">
                    {activeStep.ctaLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStepAction}
                  className="w-full rounded-full bg-[#003566] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#00284c]"
                >
                  {activeStep.ctaLabel}
                </button>
              </div>
            </div>

            <DialogFooter className="mt-7 flex-col gap-3 border-t border-[#edf2f7] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onFinish}
                className="text-[14px] font-medium text-[#5a7089] transition hover:text-[#003566]"
              >
                Skip walkthrough
              </button>

              <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={activeIndex === 0}
                  className="rounded-full border border-[#d5e3f0] px-5 py-3 text-[14px] font-semibold text-[#003566] transition hover:border-[#0967bd] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>
                {isLastStep ? (
                  <button
                    type="button"
                    onClick={onFinish}
                    className="rounded-full bg-[#f77f00] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#d96c00]"
                  >
                    Finish tour
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full bg-[#0967bd] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#07579f]"
                  >
                    Next step
                  </button>
                )}
              </div>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
