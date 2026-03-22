import React, { useState } from 'react';
import { auth, seed } from '../lib/api';

interface SignUpPageProps {
  onSignUp: () => void;
  onLogin: () => void;
  onBack: () => void;
}

const SIGNUP_IMG = 'https://images.unsplash.com/photo-1760473749293-c921e8ca6a4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGRlc2slMjBlZHVjYXRpb258ZW58MXx8fHwxNzcyMTE2ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

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

export function SignUpPage({ onSignUp, onLogin, onBack }: SignUpPageProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'mentor'>('user');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isUser = activeTab === 'user';

  const handleSignUp = async () => {
    setError('');
    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password.trim()) { setError('Please enter a password.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setIsLoading(true);
    try {
      await auth.register(fullName.trim(), email.trim(), password, activeTab);
      try { await seed.demo(); } catch {}
      await auth.login(email.trim(), password);
      onSignUp();
    } catch (e: any) {
      setError(e.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSignUp();
  };

  const features = [
    { icon: '&#9201;', title: 'Focus Rooms', desc: '4 study modes to match your style' },
    { icon: '&#9733;', title: 'Expert Mentors', desc: '200+ verified professionals' },
    { icon: '&#9889;', title: 'AI Assistance', desc: '24/7 instant guidance & support' },
  ];

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
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(247,127,0,0.2) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(9,103,189,0.35) 0%, transparent 70%)' }}
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
            <img src={SIGNUP_IMG} alt="Creative workspace" className="w-full h-full object-cover" />
          </div>

          {/* Feature cards */}
          <div className="flex flex-col gap-3 w-full max-w-[400px]">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 transition-all hover:bg-white/12"
              >
                <div className="w-10 h-10 rounded-[12px] bg-white/12 flex items-center justify-center text-[20px]" dangerouslySetInnerHTML={{ __html: f.icon }} />
                <div>
                  <div className="text-[14px] font-bold text-white">{f.title}</div>
                  <div className="text-[12px] text-white/50">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-[12px] text-white/30">&copy; 2026 Lernova. All rights reserved.</div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col bg-[#f8fafd] min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 pt-8 lg:px-12">
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
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-[440px] flex flex-col gap-6">

            {/* Tab switcher */}
            <div className="flex rounded-full p-1 bg-white border border-[rgba(0,53,102,0.08)] shadow-sm">
              <button
                onClick={() => { setActiveTab('user'); setError(''); }}
                className="flex-1 h-[44px] rounded-full flex items-center justify-center transition-all duration-200 text-[14px] font-semibold"
                style={{
                  background: isUser ? '#003566' : 'transparent',
                  color: isUser ? 'white' : '#5a7089',
                }}
              >
                Student
              </button>
              <button
                onClick={() => { setActiveTab('mentor'); setError(''); }}
                className="flex-1 h-[44px] rounded-full flex items-center justify-center transition-all duration-200 text-[14px] font-semibold"
                style={{
                  background: !isUser ? '#003566' : 'transparent',
                  color: !isUser ? 'white' : '#5a7089',
                }}
              >
                Mentor
              </button>
            </div>

            {/* Heading */}
            <div>
              <h1
                className="mb-2"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 'clamp(30px, 3.5vw, 40px)',
                  lineHeight: 1.1,
                  color: '#003566',
                }}
              >
                Create your account
              </h1>
              <p className="text-[15px] text-[#5a7089] leading-relaxed">
                {isUser
                  ? 'Join Lernova and start your learning journey today.'
                  : 'Register as a mentor and inspire learners worldwide.'}
              </p>
            </div>

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#0d1b2a]">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a7089]">
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="John Doe"
                  className="w-full h-[50px] pl-11 pr-4 bg-white border border-[rgba(0,53,102,0.12)] rounded-[14px] text-[14px] text-[#0d1b2a] placeholder:text-[#5a7089]/50 outline-none focus:border-[#0967bd] focus:ring-2 focus:ring-[#0967bd]/10 transition-all"
                />
              </div>
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
                  onKeyDown={handleKeyDown}
                  placeholder="you@example.com"
                  className="w-full h-[50px] pl-11 pr-4 bg-white border border-[rgba(0,53,102,0.12)] rounded-[14px] text-[14px] text-[#0d1b2a] placeholder:text-[#5a7089]/50 outline-none focus:border-[#0967bd] focus:ring-2 focus:ring-[#0967bd]/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#0d1b2a]">Password</label>
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
                  onKeyDown={handleKeyDown}
                  placeholder="Min. 6 characters"
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

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#0d1b2a]">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a7089]">
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Re-enter your password"
                  className="w-full h-[50px] pl-11 pr-12 bg-white border border-[rgba(0,53,102,0.12)] rounded-[14px] text-[14px] text-[#0d1b2a] placeholder:text-[#5a7089]/50 outline-none focus:border-[#0967bd] focus:ring-2 focus:ring-[#0967bd]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5a7089] hover:text-[#003566] transition-colors"
                >
                  <EyeIcon open={showConfirm} />
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

            {/* Sign Up button */}
            <button
              onClick={handleSignUp}
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
                  Create Account
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            {/* Login link */}
            <p className="text-center text-[14px] text-[#5a7089]">
              Already have an account?{' '}
              <button
                onClick={onLogin}
                className="font-bold text-[#003566] hover:text-[#0967bd] transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
