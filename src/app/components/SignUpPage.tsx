import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  BookOpenText,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  AuthAlert,
  AuthCard,
  AuthField,
  AuthHeading,
  AuthOtpInput,
  AuthSegmentedControl,
  AuthSubmitButton,
} from '@/app/components/auth/AuthPrimitives';
import { AuthShell } from '@/app/components/auth/AuthShell';
import { Button } from '@/app/components/ui/button';
import { auth } from '../lib/api';
import { markOnboardingPending } from '../lib/onboarding';
import { getSupabaseClient } from '../lib/api';

interface SignUpPageProps {
  onSignUp: () => void;
  onLogin: () => void;
  onBack: () => void;
}

const SIGNUP_IMG =
  'https://images.unsplash.com/photo-1760473749293-c921e8ca6a4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGRlc2slMjBlZHVjYXRpb258ZW58MXx8fHwxNzcyMTE2ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

export function SignUpPage({ onSignUp, onLogin, onBack }: SignUpPageProps) {
  const [stage, setStage] = useState<'form' | 'otp' | 'success'>('form');
  const [activeTab, setActiveTab] = useState<'student' | 'mentor'>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isStudent = activeTab === 'student';

  const handleSendOtp = async () => {
    setError('');
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await auth.requestSignupOtp(fullName.trim(), email.trim(), activeTab);
      setStage('otp');
      setOtp(['', '', '', '', '', '']);
    } catch (e: any) {
      setError(e.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setIsLoading(true);
    try {
      await auth.verifySignupOtp(email, otpCode, password);
      markOnboardingPending(activeTab);
      toast.success('Account created successfully! 🎉', {
        description: `Welcome${activeTab === 'mentor' ? ', mentor' : ''} - let's get you started!`,
      });
      if (onSignUp) {
        onSignUp();
      } else {
        setStage('success');
      }
    } catch (e: any) {
      setError(e.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && Number.isNaN(Number(value))) {
      return;
    }

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < 5) {
      document.getElementById(`signup-otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`signup-otp-${index - 1}`)?.focus();
      return;
    }

    if (e.key === 'Enter') {
      void handleVerifyOtp();
    }
  };

  // Auto-fill OTP from clipboard paste
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (stage !== 'otp') return;
      
      const activeEl = document.activeElement;
      if (!(activeEl instanceof HTMLInputElement)) return;
      if (!activeEl.id.startsWith('signup-otp-')) return;
      
      e.preventDefault();
      try {
        const pastedText = await navigator.clipboard.readText();
        const digits = pastedText.replace(/\D/g, '').slice(0, 6);
        
        if (digits.length > 0) {
          const newOtp = ['', '', '', '', '', ''];
          for (let i = 0; i < digits.length && i < 6; i++) {
            newOtp[i] = digits[i];
          }
          setOtp(newOtp);
          toast.success('OTP auto-filled!', { duration: 2000 });
          
          // Auto-submit if complete
          if (digits.length === 6) {
            setTimeout(() => void handleVerifyOtp(), 200);
          }
        }
      } catch (err) {
        console.error('Clipboard paste error:', err);
      }
    };

    document.addEventListener('paste', handlePaste as EventListener);
    return () => document.removeEventListener('paste', handlePaste as EventListener);
  }, [stage, otp]);

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (stage === 'otp' && otp.every(digit => digit !== '') && !isLoading) {
      const timer = setTimeout(() => void handleVerifyOtp(), 300);
      return () => clearTimeout(timer);
    }
  }, [otp, stage, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      void handleSendOtp();
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      const supabase = getSupabaseClient();
      
      // Get current user after Google OAuth flow initiates
      // Note: This will redirect to Google's login, so we check before that
      // First, get any existing profile with this email if they're coming back
      
      // The actual email check will happen in GoogleOnboardingPage after redirect
      // But we can add a pre-check here if needed by getting current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser?.email) {
        // Check if email already has a profile
        const { data: existingProfiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', currentUser.email)
          .limit(1);

        if (existingProfiles && existingProfiles.length > 0) {
          setError('This email is already registered. Please sign in with your password instead.');
          setIsGoogleLoading(false);
          return;
        }
      }
      
      await auth.signInWithGoogle();
    } catch (e: any) {
      setError(e.message || 'Google sign-up failed. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI mentor support',
      description: 'Get instant study help whenever you’re stuck.',
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

  return (
    <AuthShell
      onBack={onBack}
      visual={
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              <ShieldCheck className="size-3.5" />
              Thoughtful onboarding
            </span>
            <h2 className="max-w-md font-['DM_Serif_Display'] text-5xl leading-none text-white">
              Build a calmer, smarter study setup from day one.
            </h2>
            <p className="max-w-md text-sm leading-7 text-white/65">
              Choose the role that fits you, verify once, and we’ll tailor the product around how you learn or mentor.
            </p>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
            <img
              src={SIGNUP_IMG}
              alt="Creative learning workspace"
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
        {stage === 'form' ? (
          <>
            <AuthSegmentedControl
              value={activeTab}
              onChange={(value) => {
                setActiveTab(value);
                setError('');
              }}
              options={[
                { value: 'student', label: 'Student' },
                { value: 'mentor', label: 'Mentor' },
              ]}
            />

            <AuthHeading
              title="Create your account"
              description={
                isStudent
                  ? 'Set up your learning workspace and unlock focused study tools.'
                  : 'Register your mentor profile and start building trust with learners.'
              }
            />

            <div className="space-y-4">
              <AuthField
                label="Full name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="John Doe"
                autoComplete="name"
                icon={<UserRound className="size-4" />}
              />
              <AuthField
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="you@example.com"
                autoComplete="email"
                icon={<Mail className="size-4" />}
              />
              <AuthField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                icon={<LockKeyhole className="size-4" />}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                }
              />
              <AuthField
                label="Confirm password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                icon={<LockKeyhole className="size-4" />}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((value) => !value)}
                    className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showConfirm ? 'Hide password confirmation' : 'Show password confirmation'}
                  >
                    {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                }
              />
            </div>

            {error ? <AuthAlert>{error}</AuthAlert> : null}

            <AuthSubmitButton type="button" loading={isLoading} onClick={() => void handleSendOtp()}>
              <span className="inline-flex items-center gap-2">
                Continue
                <ArrowRight className="size-4" />
              </span>
            </AuthSubmitButton>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button
              type="button"
              disabled={isGoogleLoading}
              onClick={() => void handleGoogleSignUp()}
              className="h-11 w-full rounded-lg !bg-blue-600 !text-white hover:!bg-blue-700 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BookOpenText className="size-4" />
              {isGoogleLoading ? 'Signing up...' : 'Continue with Google'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onLogin}
                className="font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Sign in
              </button>
            </p>
          </>
        ) : null}

        {stage === 'otp' ? (
          <>
            <AuthHeading
              title="Verify your email"
              description={
                <>
                  We sent a 6-digit confirmation code to{' '}
                  <strong className="text-foreground">{email}</strong>.
                </>
              }
            />

            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <AuthOtpInput
                  key={index}
                  id={`signup-otp-${index}`}
                  value={digit}
                  onChange={(value) => handleOtpChange(index, value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                />
              ))}
            </div>

            {error ? <AuthAlert>{error}</AuthAlert> : null}

            <AuthSubmitButton
              type="button"
              loading={isLoading}
              disabled={isLoading || otp.join('').length !== 6}
              onClick={() => void handleVerifyOtp()}
            >
              <span className="inline-flex items-center gap-2">
                {otp.every(d => d !== '') && !isLoading ? 'Auto-verifying...' : 'Verify and continue'}
                <ArrowRight className="size-4" />
              </span>
            </AuthSubmitButton>

            <Button
              type="button"
              variant="ghost"
              className="w-full rounded-full text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setStage('form')}
            >
              Back to details
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-2">
              <span>💡 Tip: Copy the code from email and paste it here for instant auto-fill</span>
            </div>
          </>
        ) : null}

        {stage === 'success' ? (
          <>
            <AuthHeading
              title="You’re all set"
              description="Your account is ready. Head to login and start using Elm Orbit."
            />
            <AuthSubmitButton type="button" onClick={onLogin}>
              <span className="inline-flex items-center gap-2">
                Go to login
                <ArrowRight className="size-4" />
              </span>
            </AuthSubmitButton>
          </>
        ) : null}
      </AuthCard>
    </AuthShell>
  );
}
