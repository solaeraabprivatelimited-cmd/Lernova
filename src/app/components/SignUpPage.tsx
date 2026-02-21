import React, { useState } from 'react';
import svgPaths from '../../imports/svg-4o6iei54qa';
import { auth, seed } from '../lib/api';

interface SignUpPageProps {
  onSignUp: () => void;
  onLogin: () => void;
  onBack: () => void;
}

function LearnovaLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-[35px] h-[35px]">
        <svg fill="none" viewBox="0 0 35 35" className="w-full h-full">
          <g>
            <path d={svgPaths.p3781200} fill="#003566" />
            <path d={svgPaths.p1c6f2500} stroke="#003566" strokeWidth="0.245515" />
            <path d={svgPaths.p31318300} fill="#003566" />
            <path d={svgPaths.p275764f0} stroke="#003566" strokeWidth="0.23811" />
            <circle cx="17.5" cy="17.5" r="15.8594" stroke="#003566" strokeWidth="3.28125" />
            <g clipPath="url(#clip0_signup)">
              <path clipRule="evenodd" d={svgPaths.p2338ef00} fill="#F77F00" fillRule="evenodd" />
            </g>
            <g clipPath="url(#clip1_signup)">
              <path clipRule="evenodd" d={svgPaths.p17aefc80} fill="#F77F00" fillRule="evenodd" />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_signup">
              <rect fill="white" height="10.5795" transform="translate(10.4914 20.704) rotate(-11.508)" width="10.5795" />
            </clipPath>
            <clipPath id="clip1_signup">
              <rect fill="white" height="10.2012" transform="translate(11.5055 10.7851) rotate(-11.508)" width="10.2012" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <span className="font-['Righteous'] text-[#003566] text-[20px]">Learnova</span>
    </div>
  );
}

function PersonIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" className="w-6 h-6 shrink-0" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

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

function InputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onKeyDown,
  icon,
  rightEl,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  icon: React.ReactNode;
  rightEl?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[10px] w-full">
      <label className="font-['Poppins'] text-[16px] text-black">{label}</label>
      <div className="relative rounded-[10px]">
        <div className="absolute inset-0 border border-[rgba(0,0,0,0.4)] rounded-[10px] pointer-events-none" />
        <div className="flex items-center justify-between px-[10px] py-[8px] gap-[8px]">
          <div className="flex items-center gap-[8px] flex-1">
            {icon}
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              className="flex-1 bg-transparent font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] placeholder:text-[rgba(0,0,0,0.4)] outline-none"
            />
          </div>
          {rightEl}
        </div>
      </div>
    </div>
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
      // Seed demo data for first-time users
      try { await seed.demo(); } catch {}
      // Auto-login after registration
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

  return (
    <div className="min-h-screen bg-white relative flex flex-col">
      {/* Top-left logo */}
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

      {/* Centered form */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-[421px] flex flex-col gap-6">

          {/* Tabs */}
          <div className="flex items-start w-full">
            <button
              onClick={() => { setActiveTab('user'); setError(''); }}
              className="flex-1 h-[52px] flex items-center justify-center relative focus:outline-none"
            >
              <div className={`absolute inset-0 border-b-[3px] border-solid transition-colors ${isUser ? 'border-[#003566]' : 'border-transparent'}`} />
              <span className={`relative text-[16px] ${isUser ? "font-['Poppins'] font-semibold text-[#003566]" : "font-['Poppins'] font-medium text-[rgba(0,0,0,0.6)]"}`}>
                User Sign Up
              </span>
            </button>
            <button
              onClick={() => { setActiveTab('mentor'); setError(''); }}
              className="flex-1 h-[52px] flex items-center justify-center relative focus:outline-none"
            >
              <div className={`absolute inset-0 border-b-[1.5px] border-solid transition-colors ${!isUser ? 'border-[#003566]' : 'border-[rgba(0,0,0,0.6)]'}`} />
              <span className={`relative text-[16px] ${!isUser ? "font-['Poppins'] font-semibold text-[#003566]" : "font-['Poppins'] font-medium text-[rgba(0,0,0,0.6)]"}`}>
                Mentor Sign Up
              </span>
            </button>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-1 pb-1">
            <p className="font-['Poppins'] font-medium text-[36px] text-black leading-tight">
              Create Account
            </p>
            <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)]">
              {isUser
                ? 'Join Learnova and start your learning journey.'
                : 'Register as a mentor and inspire learners.'}
            </p>
          </div>

          {/* Full Name */}
          <InputField
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChange={setFullName}
            onKeyDown={handleKeyDown}
            icon={<PersonIcon />}
          />

          {/* Email */}
          <InputField
            label="Email"
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={setEmail}
            onKeyDown={handleKeyDown}
            icon={<EmailIcon />}
          />

          {/* Password */}
          <InputField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••••"
            value={password}
            onChange={setPassword}
            onKeyDown={handleKeyDown}
            icon={<LockIcon />}
            rightEl={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-0.5">
                <svg fill="none" viewBox="0 0 24 24" className="w-5 h-5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7">
                  {showPassword ? (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  ) : (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  )}
                </svg>
              </button>
            }
          />

          {/* Confirm Password */}
          <InputField
            label="Confirm Password"
            type={showConfirm ? 'text' : 'password'}
            placeholder="••••••••••••"
            value={confirmPassword}
            onChange={setConfirmPassword}
            onKeyDown={handleKeyDown}
            icon={<LockIcon />}
            rightEl={
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="p-0.5">
                <svg fill="none" viewBox="0 0 24 24" className="w-5 h-5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7">
                  {showConfirm ? (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  ) : (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  )}
                </svg>
              </button>
            }
          />

          {/* Error */}
          {error && (
            <p className="font-['Poppins'] text-[13px] text-[#cc3636] -mt-2">{error}</p>
          )}

          {/* Sign Up button */}
          <button
            onClick={handleSignUp}
            disabled={isLoading}
            className="w-full h-[42px] bg-[#003566] hover:bg-[#00284d] disabled:opacity-70 rounded-[24px] flex items-center justify-center transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="font-['Poppins'] font-semibold text-[16px] text-white">Create Account</span>
            )}
          </button>

          {/* Back to login */}
          <p className="font-['Poppins'] text-[16px] text-black text-right">
            Already have an account?{' '}
            <button onClick={onLogin} className="font-semibold hover:text-[#003566] transition-colors">
              Log in
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}