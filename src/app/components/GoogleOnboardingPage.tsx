import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Users } from 'lucide-react';
import {
  AuthAlert,
  AuthCard,
  AuthField,
  AuthHeading,
  AuthSegmentedControl,
  AuthSubmitButton,
} from '@/app/components/auth/AuthPrimitives';
import { AuthShell } from '@/app/components/auth/AuthShell';
import { auth, profile as profileApi, setCurrentUser, getSupabaseClient } from '../lib/api';

interface GoogleOnboardingPageProps {
  onComplete: () => void;
  onCancel: () => void;
}

const ONBOARDING_IMG =
  'https://images.unsplash.com/photo-1760473749293-c921e8ca6a4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGRlc2slMjBlZHVjYXRpb258ZW58MXx8fHwxNzcyMTE2ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

export function GoogleOnboardingPage({
  onComplete,
  onCancel,
}: GoogleOnboardingPageProps) {
  const [role, setRole] = useState<'student' | 'mentor'>('student');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const isStudent = role === 'student';

  // Check if user already has a profile (returning user)
  useEffect(() => {
    const checkExistingProfile = async () => {
      try {
        const prof = await profileApi.get();
        if (prof) {
          // User already has a profile, redirect to dashboard
          setCurrentUser(prof);
          if (onComplete) {
            onComplete();
          }
          return;
        }
      } catch (_err) {
        // No existing profile, show form
      }
      // Only show form if no profile found
      setIsChecking(false);
    };
    checkExistingProfile();
  }, [onComplete]);

  const handleComplete = async () => {
    setError('');
    if (!displayName.trim()) {
      setError('Please enter your display name.');
      return;
    }

    setIsLoading(true);
    try {
      // Get current Google authenticated user
      const supabase = getSupabaseClient();
      const { data: { user: googleUser } } = await supabase.auth.getUser();
      
      if (!googleUser?.email) {
        setError('Unable to retrieve your email from Google account.');
        setIsLoading(false);
        return;
      }

      // Email uniqueness is already enforced by auth.users, so profiles trigger will handle it
      await auth.completeGoogleSignup(displayName.trim(), role);
      
      // Fetch updated profile
      try {
        const prof = await profileApi.get();
        if (prof) {
          setCurrentUser(prof);
        }
      } catch (profileErr) {
        console.log('Profile fetch failed (non-fatal):', profileErr);
      }

      if (onComplete) {
        onComplete();
      }
    } catch (e: any) {
      setError(e.message || 'Failed to complete signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      void handleComplete();
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI mentor support',
      description: "Get instant study help whenever you're stuck.",
    },
    {
      icon: Users,
      title: 'Shared focus rooms',
      description: 'Study alone or with peers in guided room modes.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified mentor access',
      description: 'Book experienced mentors as your goals evolve.',
    },
  ];

  // Hide component while checking for existing profile (prevent form flash)
  if (isChecking) {
    return null;
  }

  return (
    <AuthShell
      onBack={onCancel}
      visual={
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              <ShieldCheck className="size-3.5" />
              Complete your profile
            </span>
            <h2 className="max-w-md font-['DM_Serif_Display'] text-5xl leading-none text-white">
              Welcome to Lernova
            </h2>
            <p className="max-w-md text-sm leading-7 text-white/65">
              Choose your role and display name to get started with focused study tools and community support.
            </p>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
            <img
              src={ONBOARDING_IMG}
              alt="Learning workspace"
              className="h-[260px] w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="space-y-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4 backdrop-blur">
                <feature.icon className="mb-3 size-4 text-[#9fd0ff]" />
                <p className="text-sm font-semibold text-white">{feature.title}</p>
                <p className="mt-1 text-sm leading-6 text-white/55">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <AuthCard className="space-y-6">
        <AuthSegmentedControl
          value={role}
          onChange={(value) => {
            setRole(value as 'student' | 'mentor');
            setError('');
          }}
          options={[
            { value: 'student', label: 'Student' },
            { value: 'mentor', label: 'Mentor' },
          ]}
        />

        <AuthHeading
          title="Complete your profile"
          description={
            isStudent
              ? 'Set up your learning workspace and unlock focused study tools.'
              : 'Register your mentor profile and start building trust with learners.'
          }
        />

        <div className="space-y-4">
          <AuthField
            label="Display name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="How should we call you?"
            autoComplete="name"
          />
        </div>

        {error ? <AuthAlert>{error}</AuthAlert> : null}

        <AuthSubmitButton type="button" loading={isLoading} onClick={() => void handleComplete()}>
          <span className="inline-flex items-center gap-2">
            Get started
            <ArrowRight className="size-4" />
          </span>
        </AuthSubmitButton>
      </AuthCard>
    </AuthShell>
  );
}
