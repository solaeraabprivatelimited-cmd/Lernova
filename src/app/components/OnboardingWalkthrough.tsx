import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { type OnboardingRole } from '@/app/lib/onboarding';
import { getCurrentUser, getSupabaseClient } from '@/app/lib/api';
import { toast } from 'sonner';

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
      eyebrow: 'Take Care',
      title: 'Connect with others in World Chat',
      description: 'Join our supportive community in World Chat to share experiences, get inspired, and support fellow learners on their journey.',
      ctaLabel: 'Open World Chat',
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
  const [educationDetails, setEducationDetails] = React.useState('');
  const [qualificationsText, setQualificationsText] = React.useState('');
  const [savingMentorDetails, setSavingMentorDetails] = React.useState(false);
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

  const handleSaveMentorDetails = async () => {
    const user = getCurrentUser();
    if (!user?.id) {
      toast.error('Please sign in again before saving mentor details.');
      return;
    }

    const qualifications = qualificationsText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    setSavingMentorDetails(true);
    try {
      const supabase = getSupabaseClient();
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          education_details: educationDetails.trim(),
          qualifications,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      const mentorDetails = {
        education_details: educationDetails.trim(),
        qualifications,
      };
      const { data: existingMentorProfile, error: existingMentorProfileError } = await supabase
        .from('mentor_profiles')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingMentorProfileError) throw existingMentorProfileError;

      const { error: mentorProfileError } = existingMentorProfile
        ? await supabase
            .from('mentor_profiles')
            .update(mentorDetails)
            .eq('user_id', user.id)
        : await supabase
            .from('mentor_profiles')
            .insert({
              user_id: user.id,
              ...mentorDetails,
              hourly_rate: 1,
            });

      if (mentorProfileError) throw mentorProfileError;
      toast.success('Mentor details saved.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save mentor details.');
    } finally {
      setSavingMentorDetails(false);
    }
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
                Welcome to Elm Origin, {safeName}
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
                {role === 'mentor' && activeIndex === 2 && (
                  <div className="mt-5 grid gap-3">
                    <textarea
                      value={educationDetails}
                      onChange={(event) => setEducationDetails(event.target.value)}
                      placeholder="Education details"
                      className="min-h-[82px] rounded-[16px] border border-[#d5e3f0] bg-white px-4 py-3 text-[14px] text-[#0d1b2a] outline-none transition focus:border-[#0967bd]"
                    />
                    <textarea
                      value={qualificationsText}
                      onChange={(event) => setQualificationsText(event.target.value)}
                      placeholder="Qualifications, one per line"
                      className="min-h-[82px] rounded-[16px] border border-[#d5e3f0] bg-white px-4 py-3 text-[14px] text-[#0d1b2a] outline-none transition focus:border-[#0967bd]"
                    />
                    <button
                      type="button"
                      onClick={handleSaveMentorDetails}
                      disabled={savingMentorDetails}
                      className="w-fit rounded-full bg-[#003566] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#00284c] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingMentorDetails ? 'Saving...' : 'Save mentor details'}
                    </button>
                  </div>
                )}
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
