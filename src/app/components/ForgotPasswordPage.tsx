import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';

import {
  AuthAlert,
  AuthCard,
  AuthField,
  AuthHeading,
  AuthOtpInput,
  AuthSubmitButton,
} from '@/app/components/auth/AuthPrimitives';
import { AuthShell } from '@/app/components/auth/AuthShell';
import { Button } from '@/app/components/ui/button';
import { auth } from '../lib/api';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

type Stage = 'request' | 'otp' | 'reset' | 'success';

export function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const [stage, setStage] = useState<Stage>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestReset = async () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      await auth.requestPasswordResetCode(email.trim());
      setStage('otp');
    } catch (e: any) {
      setError(e.message || 'Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the 6-digit code.');
      return;
    }

    setIsLoading(true);
    try {
      setStage('reset');
    } catch (e: any) {
      setError(e.message || 'Failed to verify code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    if (!newPassword.trim()) {
      setError('Please enter a new password.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const code = otp.join('');
      await auth.verifyPasswordResetCode(email, code, newPassword);
      setStage('success');
    } catch (e: any) {
      setError(e.message || 'Failed to reset password. Please try again.');
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
      document.getElementById(`reset-otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`reset-otp-${index - 1}`)?.focus();
    }

    if (e.key === 'Enter') {
      void handleVerifyOtp();
    }
  };

  return (
    <AuthShell
      onBack={onBack}
      visual={
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              <ShieldCheck className="size-3.5" />
              Secure recovery
            </span>
            <h2 className="max-w-md font-['DM_Serif_Display'] text-5xl leading-none text-white">
              Reset access without losing your momentum.
            </h2>
            <p className="max-w-md text-sm leading-7 text-white/65">
              We keep the flow simple: verify once, set a new password, and get back into your workspace quickly.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/8 p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">What happens next</p>
            <div className="mt-5 space-y-4">
              {[
                'Send a one-time code to your email address.',
                'Verify the code in six quick taps.',
                'Choose a new password and return to Learnova.',
              ].map((step, index) => (
                <div key={step} className="flex gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-white/65">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <AuthCard className="space-y-6">
        {stage === 'request' ? (
          <>
            <AuthHeading
              title="Forgot your password?"
              description="Enter the email linked to your account and we’ll send you a reset code."
            />
            <AuthField
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void handleRequestReset();
                }
              }}
              placeholder="you@example.com"
              autoComplete="email"
              icon={<Mail className="size-4" />}
            />
            {error ? <AuthAlert>{error}</AuthAlert> : null}
            <AuthSubmitButton type="button" loading={isLoading} onClick={() => void handleRequestReset()}>
              <span className="inline-flex items-center gap-2">
                Send reset code
                <ArrowRight className="size-4" />
              </span>
            </AuthSubmitButton>
          </>
        ) : null}

        {stage === 'otp' ? (
          <>
            <AuthHeading
              title="Check your email"
              description={
                <>
                  We sent a 6-digit code to <strong className="text-foreground">{email}</strong>.
                </>
              }
            />
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <AuthOtpInput
                  key={index}
                  id={`reset-otp-${index}`}
                  value={digit}
                  onChange={(value) => handleOtpChange(index, value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                />
              ))}
            </div>
            {error ? <AuthAlert>{error}</AuthAlert> : null}
            <AuthSubmitButton type="button" loading={isLoading} onClick={() => void handleVerifyOtp()}>
              <span className="inline-flex items-center gap-2">
                Verify code
                <ArrowRight className="size-4" />
              </span>
            </AuthSubmitButton>
            <Button
              type="button"
              variant="ghost"
              className="w-full rounded-full text-sm text-muted-foreground hover:text-foreground"
              onClick={() => {
                setOtp(['', '', '', '', '', '']);
                setError('');
              }}
            >
              Resend code
            </Button>
          </>
        ) : null}

        {stage === 'reset' ? (
          <>
            <AuthHeading
              title="Set a new password"
              description="Choose something strong, memorable, and different from your previous password."
            />
            <div className="space-y-4">
              <AuthField
                label="New password"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                icon={<LockKeyhole className="size-4" />}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowNew((value) => !value)}
                    className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showNew ? 'Hide password' : 'Show password'}
                  >
                    {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                }
              />
              <AuthField
                label="Confirm password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    void handleResetPassword();
                  }
                }}
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
            <AuthSubmitButton type="button" loading={isLoading} onClick={() => void handleResetPassword()}>
              <span className="inline-flex items-center gap-2">
                Reset password
                <ArrowRight className="size-4" />
              </span>
            </AuthSubmitButton>
          </>
        ) : null}

        {stage === 'success' ? (
          <>
            <AuthHeading
              title="Password reset complete"
              description="Your password is updated. Return to login and continue where you left off."
            />
            <AuthSubmitButton type="button" onClick={onBack}>
              <span className="inline-flex items-center gap-2">
                Back to login
                <ArrowRight className="size-4" />
              </span>
            </AuthSubmitButton>
          </>
        ) : null}
      </AuthCard>
    </AuthShell>
  );
}
