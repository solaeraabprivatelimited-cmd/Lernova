import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpenText,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  Sparkles,
  Users,
} from 'lucide-react';

import {
  AuthAlert,
  AuthCard,
  AuthField,
  AuthHeading,
  AuthSegmentedControl,
  AuthSubmitButton,
} from '@/app/components/auth/AuthPrimitives';
import { AuthShell } from '@/app/components/auth/AuthShell';
import { Button } from '@/app/components/ui/button';
import { SkeletonAuthPage } from '@/app/components/skeletons/PageSkeletons';
import { auth, profile as profileApi, setCurrentUser } from '../lib/api';

interface LoginPageProps {
  onLogin: () => void;
  onMentorLogin: () => void;
  onSignUp: () => void;
  onForgotPassword: () => void;
  onBack: () => void;
}

const LOGIN_IMG =
  'https://images.unsplash.com/photo-1589872880544-76e896b0592c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGxpYnJhcnklMjBzdHVkeWluZyUyMHRvZ2V0aGVyfGVufDF8fHx8MTc3MjExNjg3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

export function LoginPage({
  onLogin,
  onMentorLogin,
  onSignUp,
  onForgotPassword,
  onBack,
}: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'student' | 'mentor'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isMentor = activeTab === 'mentor';

  const handleLogin = async () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await auth.login(email.trim(), password);
      let actualRole: 'student' | 'mentor' = 'student';

      try {
        const prof = await profileApi.get();
        if (prof) {
          setCurrentUser(prof);
          actualRole = prof.role === 'mentor' ? 'mentor' : 'student';
        }
      } catch (profileErr: any) {
        console.log('Login: profile fetch failed (non-fatal):', profileErr.message);
      }

      if (actualRole === 'mentor') {
        onMentorLogin();
      } else {
        onLogin();
      }
    } catch (e: any) {
      setError(e.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      void handleLogin();
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      await auth.signInWithGoogle();
    } catch (e: any) {
      setError(e.message || 'Google sign-in failed. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  const stats = [
    { value: '5K+', label: 'Active learners', icon: Users },
    { value: '200+', label: 'Verified mentors', icon: GraduationCap },
    { value: '24/7', label: 'AI guidance', icon: Sparkles },
  ];

  return (
    <AuthShell
      onBack={onBack}
      visual={
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/20 dark:border-white/10 bg-slate-900/8 dark:bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 dark:text-white/70">
              <Sparkles className="size-3.5" />
              Productive learning starts here
            </span>
            <h2 className="max-w-md font-semibold tracking-tight text-5xl leading-none text-slate-900 dark:text-white">
              Step back into your study rhythm.
            </h2>
            <p className="max-w-md text-sm leading-7 text-slate-600 dark:text-white/65">
              Join focused rooms, mentor sessions, and calmer study workflows from the same polished workspace.
            </p>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-slate-900/15 dark:border-white/10 bg-slate-900/5 dark:bg-white/5 shadow-2xl backdrop-blur">
            <img
              src={LOGIN_IMG}
              alt="Students collaborating in a library"
              className="h-[280px] w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[22px] border border-slate-900/15 dark:border-white/10 bg-slate-900/5 dark:bg-white/8 px-4 py-4 backdrop-blur">
                <stat.icon className="mb-3 size-4 text-blue-600 dark:text-[#9fd0ff]" />
                <p className="font-semibold tracking-tight text-3xl text-slate-900 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-600 dark:text-white/45">{stat.label}</p>
              </div>
            ))}
          </div>

          <blockquote className="rounded-[24px] border border-slate-900/15 dark:border-white/10 bg-slate-900/5 dark:bg-white/8 px-5 py-4 text-sm leading-7 text-slate-700 dark:text-white/70 backdrop-blur">
            "Elm Origin helped me turn irregular effort into a routine I could actually sustain."
          </blockquote>
        </div>
      }
    >
      <AuthCard className="space-y-6">
        <AuthSegmentedControl
          value={activeTab}
          onChange={(value) => {
            setActiveTab(value);
            setError('');
          }}
          options={[
            { value: 'student', label: 'Student login' },
            { value: 'mentor', label: 'Mentor login' },
          ]}
        />

        <AuthHeading
          title="Welcome back"
          description={
            isMentor
              ? 'Sign in to manage sessions, requests, and your mentor workspace.'
              : 'Pick up where you left off and head back into your focus flow.'
          }
        />

        <div className="space-y-4">
          <AuthField
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="you@example.com"
            icon={<Mail className="size-4" />}
            autoComplete="email"
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Password</span>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <AuthField
              label=""
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Enter your password"
              icon={<LockKeyhole className="size-4" />}
              autoComplete="current-password"
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="rounded-full p-1 text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              }
            />
          </div>
        </div>

        {error ? <AuthAlert>{error}</AuthAlert> : null}

        <AuthSubmitButton type="button" loading={isLoading} onClick={() => void handleLogin()}>
          <span className="inline-flex items-center gap-2">
            {isMentor ? 'Sign in as mentor' : 'Sign in'}
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
          onClick={() => void handleGoogleSignIn()}
          className="h-11 w-full rounded-xl !bg-blue-600 !text-white hover:!bg-blue-700 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BookOpenText className="size-4" />
          {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account? {' '}
          <button
            type="button"
            onClick={onSignUp}
            className="font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Create one free
          </button>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
