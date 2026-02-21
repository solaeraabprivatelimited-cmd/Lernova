import React, { useState } from 'react';
import svgPaths from '../../imports/svg-4o6iei54qa';
import { auth, setCurrentUser, profile as profileApi } from '../lib/api';

interface LoginPageProps {
  onLogin: () => void;
  onMentorLogin: () => void;
  onSignUp: () => void;
  onForgotPassword: () => void;
  onBack: () => void;
}

// ─── Logo ────────────────────────────────────────────────────────────────────

function LearnovaLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-[35px] h-[35px]">
        <svg fill="none" preserveAspectRatio="none" viewBox="0 0 35 35" className="w-full h-full">
          <g id="Frame 26">
            <g id="Vector 10">
              <path d={svgPaths.p3781200} fill="#003566" />
              <path d={svgPaths.p1c6f2500} stroke="#003566" strokeWidth="0.245515" />
            </g>
            <g id="Vector 9">
              <path d={svgPaths.p31318300} fill="#003566" />
              <path d={svgPaths.p275764f0} stroke="#003566" strokeWidth="0.23811" />
            </g>
            <circle cx="17.5" cy="17.5" r="15.8594" stroke="#003566" strokeWidth="3.28125" />
            <g clipPath="url(#clip0_login)">
              <path clipRule="evenodd" d={svgPaths.p2338ef00} fill="#F77F00" fillRule="evenodd" />
            </g>
            <g clipPath="url(#clip1_login)">
              <path clipRule="evenodd" d={svgPaths.p17aefc80} fill="#F77F00" fillRule="evenodd" />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_login">
              <rect fill="white" height="10.5795" transform="translate(10.4914 20.704) rotate(-11.508)" width="10.5795" />
            </clipPath>
            <clipPath id="clip1_login">
              <rect fill="white" height="10.2012" transform="translate(11.5055 10.7851) rotate(-11.508)" width="10.2012" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <span className="font-['Righteous'] text-[#003566] text-[20px]">Learnova</span>
    </div>
  );
}

// ─── Field Icons ─────────────────────────────────────────────────────────────

function EmailIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
      <path d={svgPaths.p629a600} fill="black" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
      <path clipRule="evenodd" d={svgPaths.p33a04860} fill="black" fillRule="evenodd" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg fill="none" viewBox="0 0 24 24" className="w-5 h-5" stroke="black" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg fill="none" viewBox="0 0 21.0844 20" className="w-5 h-5">
      <path d={svgPaths.p4dca300} stroke="black" strokeLinecap="round" strokeLinejoin="round"
        strokeOpacity="0.7" strokeWidth="2" />
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function LoginPage({ onLogin, onMentorLogin, onSignUp, onForgotPassword, onBack }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'mentor'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isMentor = activeTab === 'mentor';

  const handleLogin = async (tabAtClick: 'user' | 'mentor') => {
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password.trim()) { setError('Please enter your password.'); return; }

    setIsLoading(true);
    try {
      const data = await auth.login(email.trim(), password);
      // Fetch the profile to confirm the role
      const prof = await profileApi.get();
      setCurrentUser(prof);
      const actualRole = prof?.role ?? 'user';
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

  const onClickLogin = () => handleLogin(activeTab);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin(activeTab);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Logo – top-left */}
      <div className="absolute top-10 left-10">
        <LearnovaLogo />
      </div>

      {/* Back to Home – top-right */}
      <div className="absolute top-10 right-10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-[6px] text-[rgba(0,0,0,0.5)] hover:text-[#003566] transition-colors group"
        >
          <svg className="w-[18px] h-[18px] transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className="font-['Poppins'] text-[14px]">Back to Home</span>
        </button>
      </div>

      {/* Centred form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[421px] flex flex-col gap-6">

          {/* ── Tab switcher ───────────────────────────────────── */}
          <div className="flex items-start w-full border-b border-[rgba(0,0,0,0.15)]">
            {/* User Login tab */}
            <button
              onClick={() => { setActiveTab('user'); setError(''); }}
              className="flex-1 h-[52px] flex items-center justify-center relative focus:outline-none"
            >
              {!isMentor && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#003566] rounded-t-full" />
              )}
              <span className={`font-['Poppins'] text-[16px] transition-colors ${!isMentor ? 'font-semibold text-[#003566]' : 'font-medium text-[rgba(0,0,0,0.5)]'}`}>
                User Login
              </span>
            </button>

            {/* Mentor Login tab */}
            <button
              onClick={() => { setActiveTab('mentor'); setError(''); }}
              className="flex-1 h-[52px] flex items-center justify-center relative focus:outline-none"
            >
              {isMentor && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#003566] rounded-t-full" />
              )}
              <span className={`font-['Poppins'] text-[16px] transition-colors ${isMentor ? 'font-semibold text-[#003566]' : 'font-medium text-[rgba(0,0,0,0.5)]'}`}>
                Mentor Login
              </span>
            </button>
          </div>

          {/* ── Heading ────────────────────────────────────────── */}
          <div className="flex flex-col gap-1">
            <p className="font-['Poppins'] font-medium text-[40px] text-black leading-tight">
              {isMentor ? 'Mentor Login' : 'User Login'}
            </p>
            <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)]">
              {isMentor
                ? 'Sign in to manage your mentoring sessions.'
                : 'Sign in to stay on track with your goals.'}
            </p>
          </div>

          {/* ── Email ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-[10px]">
            <label className="font-['Poppins'] text-[16px] text-black">Email</label>
            <div className="relative rounded-[10px] border border-[rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-[10px] px-[10px] h-[39px]">
                <EmailIcon />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="example@mail.com"
                  className="flex-1 bg-transparent font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.7)] placeholder:text-[rgba(0,0,0,0.35)] outline-none"
                />
              </div>
            </div>
          </div>

          {/* ── Password ───────────────────────────────────────── */}
          <div className="flex flex-col gap-[10px]">
            <label className="font-['Poppins'] text-[16px] text-black">Password</label>
            <div className="relative rounded-[10px] border border-[rgba(0,0,0,0.4)]">
              <div className="flex items-center justify-between px-[10px] h-[39px]">
                <div className="flex items-center gap-[5px] flex-1">
                  <LockIcon />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="••••••••••••"
                    className="flex-1 bg-transparent font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.7)] placeholder:text-[rgba(0,0,0,0.35)] outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="p-1 flex-shrink-0"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Error ──────────────────────────────────────────── */}
          {error && (
            <p className="font-['Poppins'] text-[13px] text-[#cc3636] -mt-2">{error}</p>
          )}

          {/* ── Forgot Password ─────────────────────────────────── */}
          <div className="flex justify-end -mt-2">
            <button
              onClick={onForgotPassword}
              className="font-['Poppins'] text-[16px] text-black hover:text-[#003566] transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* ── Login button ───────────────────────────────────── */}
          <button
            onClick={onClickLogin}
            disabled={isLoading}
            className="w-full h-[42px] bg-[#003566] hover:bg-[#00284d] disabled:opacity-70 rounded-[24px] flex items-center justify-center transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="font-['Poppins'] font-semibold text-[16px] text-white">
                {isMentor ? 'Login as Mentor' : 'Login'}
              </span>
            )}
          </button>

          {/* ── Sign-up link ───────────────────────────────────── */}
          <p className="font-['Poppins'] text-[16px] text-black text-right">
            Don't have an account?{' '}
            <button
              onClick={onSignUp}
              className="font-semibold hover:text-[#003566] transition-colors"
            >
              Sign up
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}