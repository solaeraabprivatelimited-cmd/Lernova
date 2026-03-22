import React, { useState } from 'react';
import { auth, setCurrentUser, profile as profileApi } from '../lib/api';

interface LoginPageProps {
  onLogin: () => void;
  onMentorLogin: () => void;
  onSignUp: () => void;
  onForgotPassword: () => void;
  onBack: () => void;
}

const LOGIN_IMG = 'https://images.unsplash.com/photo-1589872880544-76e896b0592c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGxpYnJhcnklMjBzdHVkeWluZyUyMHRvZ2V0aGVyfGVufDF8fHx8MTc3MjExNjg3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export function LoginPage({ onLogin, onMentorLogin, onSignUp, onForgotPassword, onBack }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'mentor'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isMentor = activeTab === 'mentor';

  const handleLogin = async () => {
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password.trim()) { setError('Please enter your password.'); return; }

    setIsLoading(true);
    try {
      await auth.login(email.trim(), password);
      let actualRole: 'user' | 'mentor' = 'user';
      try {
        const prof = await profileApi.get();
        if (prof) {
          setCurrentUser(prof);
          actualRole = (prof.role === 'mentor') ? 'mentor' : 'user';
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
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Left Visual Panel ── */}
      <div
        className="hidden lg:flex w-[52%] relative overflow-hidden flex-col justify-between p-10"
        style={{ background: '#003566' }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Blob */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(9,103,189,0.35) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(247,127,0,0.15) 0%, transparent 70%)' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5 cursor-pointer" onClick={onBack}>
          <div className="w-9 h-9 rounded-[10px] bg-white/15 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 12.54L4.38 11 12 6.46 19.62 11 12 15.54zM1 17v2l11 6 11-6v-2l-11 6L1 17z" />
            </svg>
          </div>
          <span style={{ fontFamily: "'Righteous', cursive", fontSize: 20, color: 'white' }}>Lernova</span>
        </div>

        {/* Centre content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 px-6">
          {/* Image */}
          <div className="w-full max-w-[400px] aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl border border-white/10">
            <img src={LOGIN_IMG} alt="Students studying" className="w-full h-full object-cover" />
          </div>

          {/* Floating stats */}
          <div className="flex gap-4 w-full max-w-[400px]">
            <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 text-center">
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: 'white' }}>
                5K<span style={{ color: '#b7dbff' }}>+</span>
              </div>
              <div className="text-[12px] font-medium text-white/50 uppercase tracking-wider mt-1">Learners</div>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 text-center">
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: 'white' }}>
                200<span style={{ color: '#b7dbff' }}>+</span>
              </div>
              <div className="text-[12px] font-medium text-white/50 uppercase tracking-wider mt-1">Mentors</div>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 text-center">
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: 'white' }}>
                4.9<span style={{ color: '#fbbf24' }}>&#9733;</span>
              </div>
              <div className="text-[12px] font-medium text-white/50 uppercase tracking-wider mt-1">Rating</div>
            </div>
          </div>

          {/* Quote */}
          <div className="max-w-[400px] text-center">
            <p className="text-[15px] leading-relaxed text-white/60 italic">
              &ldquo;Lernova helped me build discipline and confidence. My mentor sessions have been life-changing.&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white text-[12px] font-bold">AM</div>
              <div>
                <div className="text-[13px] font-semibold text-white">Aarav Mehta</div>
                <div className="text-[11px] text-white/40">CS Student</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-[12px] text-white/30">&copy; 2026 Lernova. All rights reserved.</div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col bg-[#f8fafd] min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 pt-8 lg:px-12">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <div className="w-8 h-8 rounded-[8px] bg-[#003566] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 12.54L4.38 11 12 6.46 19.62 11 12 15.54zM1 17v2l11 6 11-6v-2l-11 6L1 17z" />
              </svg>
            </div>
            <span style={{ fontFamily: "'Righteous', cursive", fontSize: 18, color: '#003566' }}>Lernova</span>
          </div>
          <div className="lg:ml-auto" />
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[#5a7089] hover:text-[#003566] transition-colors text-[14px] font-medium group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[440px] flex flex-col gap-7">

            {/* Tab switcher */}
            <div className="flex rounded-full p-1 bg-white border border-[rgba(0,53,102,0.08)] shadow-sm">
              <button
                onClick={() => { setActiveTab('user'); setError(''); }}
                className="flex-1 h-[44px] rounded-full flex items-center justify-center transition-all duration-200 text-[14px] font-semibold"
                style={{
                  background: !isMentor ? '#003566' : 'transparent',
                  color: !isMentor ? 'white' : '#5a7089',
                }}
              >
                User Login
              </button>
              <button
                onClick={() => { setActiveTab('mentor'); setError(''); }}
                className="flex-1 h-[44px] rounded-full flex items-center justify-center transition-all duration-200 text-[14px] font-semibold"
                style={{
                  background: isMentor ? '#003566' : 'transparent',
                  color: isMentor ? 'white' : '#5a7089',
                }}
              >
                Mentor Login
              </button>
            </div>

            {/* Heading */}
            <div>
              <h1
                className="mb-2"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 'clamp(32px, 4vw, 42px)',
                  lineHeight: 1.1,
                  color: '#003566',
                }}
              >
                Welcome back
              </h1>
              <p className="text-[15px] text-[#5a7089] leading-relaxed">
                {isMentor
                  ? 'Sign in to manage your mentoring sessions and connect with learners.'
                  : 'Sign in to stay on track with your goals and keep learning.'}
              </p>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#0d1b2a]">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a7089]">
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 7l-10 6L2 7" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="you@example.com"
                  className="w-full h-[50px] pl-11 pr-4 bg-white border border-[rgba(0,53,102,0.12)] rounded-[14px] text-[14px] text-[#0d1b2a] placeholder:text-[#5a7089]/50 outline-none focus:border-[#0967bd] focus:ring-2 focus:ring-[#0967bd]/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-semibold text-[#0d1b2a]">Password</label>
                <button
                  onClick={onForgotPassword}
                  className="text-[13px] font-semibold text-[#0967bd] hover:text-[#003566] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a7089]">
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Enter your password"
                  className="w-full h-[50px] pl-11 pr-12 bg-white border border-[rgba(0,53,102,0.12)] rounded-[14px] text-[14px] text-[#0d1b2a] placeholder:text-[#5a7089]/50 outline-none focus:border-[#0967bd] focus:ring-2 focus:ring-[#0967bd]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5a7089] hover:text-[#003566] transition-colors"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 px-4 py-3 bg-[#cc3636]/8 border border-[#cc3636]/20 rounded-[12px]">
                <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0 text-[#cc3636] mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <p className="text-[13px] text-[#cc3636] leading-snug">{error}</p>
              </div>
            )}

            {/* Login button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-[52px] rounded-full flex items-center justify-center gap-2 text-[15px] font-bold text-white transition-all duration-200 shadow-lg disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #003566, #0967bd)',
                boxShadow: '0 4px 20px rgba(0,53,102,0.3)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) (e.currentTarget.style.boxShadow = '0 8px 28px rgba(9,103,189,0.4)');
                if (!isLoading) (e.currentTarget.style.transform = 'translateY(-1px)');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,53,102,0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isMentor ? 'Sign In as Mentor' : 'Sign In'}
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[rgba(0,53,102,0.08)]" />
              <span className="text-[12px] font-medium text-[#5a7089] uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-[rgba(0,53,102,0.08)]" />
            </div>

            {/* Social login placeholder */}
            <button
              className="w-full h-[50px] rounded-full flex items-center justify-center gap-3 border border-[rgba(0,53,102,0.1)] bg-white text-[14px] font-semibold text-[#0d1b2a] hover:border-[rgba(0,53,102,0.25)] hover:shadow-sm transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Sign up link */}
            <p className="text-center text-[14px] text-[#5a7089]">
              Don&apos;t have an account?{' '}
              <button
                onClick={onSignUp}
                className="font-bold text-[#003566] hover:text-[#0967bd] transition-colors"
              >
                Create one free
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
