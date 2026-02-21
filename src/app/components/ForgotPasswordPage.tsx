import React, { useState } from 'react';
import svgPaths from '../../imports/svg-4o6iei54qa';

interface ForgotPasswordPageProps {
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
            <g clipPath="url(#clip0_fp)">
              <path clipRule="evenodd" d={svgPaths.p2338ef00} fill="#F77F00" fillRule="evenodd" />
            </g>
            <g clipPath="url(#clip1_fp)">
              <path clipRule="evenodd" d={svgPaths.p17aefc80} fill="#F77F00" fillRule="evenodd" />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_fp">
              <rect fill="white" height="10.5795" transform="translate(10.4914 20.704) rotate(-11.508)" width="10.5795" />
            </clipPath>
            <clipPath id="clip1_fp">
              <rect fill="white" height="10.2012" transform="translate(11.5055 10.7851) rotate(-11.508)" width="10.2012" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <span className="font-['Righteous'] text-[#003566] text-[20px]">Learnova</span>
    </div>
  );
}

function EmailIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
      <path d={svgPaths.p629a600} fill="black" />
    </svg>
  );
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
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setStage('otp');
  };

  const handleVerifyOtp = async () => {
    setError('');
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the 6-digit code.'); return; }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setStage('reset');
  };

  const handleResetPassword = async () => {
    setError('');
    if (!newPassword.trim()) { setError('Please enter a new password.'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setStage('success');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
    if (e.key === 'Enter') handleVerifyOtp();
  };

  return (
    <div className="min-h-screen bg-white relative flex flex-col">
      {/* Top-left logo */}
      <div className="absolute top-10 left-10">
        <LearnovaLogo />
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[421px] flex flex-col gap-6">

          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#003566] font-['Poppins'] text-[14px] hover:opacity-70 transition-opacity self-start"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#003566" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Login
          </button>

          {/* ── STAGE: REQUEST ── */}
          {stage === 'request' && (
            <>
              <div className="flex flex-col gap-1 pb-1">
                <p className="font-['Poppins'] font-medium text-[36px] text-black leading-tight">Forgot Password?</p>
                <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)]">
                  Enter your email and we'll send you a reset code.
                </p>
              </div>

              <div className="flex flex-col gap-[10px] w-full">
                <label className="font-['Poppins'] text-[16px] text-black">Email</label>
                <div className="relative rounded-[10px]">
                  <div className="absolute inset-0 border border-[rgba(0,0,0,0.4)] rounded-[10px] pointer-events-none" />
                  <div className="flex gap-[10px] items-center px-[10px] h-[39px]">
                    <EmailIcon />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRequestReset()}
                      placeholder="example@mail.com"
                      className="flex-1 bg-transparent font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] placeholder:text-[rgba(0,0,0,0.4)] outline-none"
                    />
                  </div>
                </div>
              </div>

              {error && <p className="font-['Poppins'] text-[13px] text-[#cc3636] -mt-2">{error}</p>}

              <button
                onClick={handleRequestReset}
                disabled={isLoading}
                className="w-full h-[42px] bg-[#003566] hover:bg-[#00284d] disabled:opacity-70 rounded-[24px] flex items-center justify-center transition-colors"
              >
                {isLoading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <span className="font-['Poppins'] font-semibold text-[16px] text-white">Send Reset Code</span>}
              </button>
            </>
          )}

          {/* ── STAGE: OTP ── */}
          {stage === 'otp' && (
            <>
              <div className="flex flex-col gap-1 pb-1">
                <p className="font-['Poppins'] font-medium text-[36px] text-black leading-tight">Check Your Email</p>
                <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)]">
                  We sent a 6-digit code to <span className="font-semibold text-black">{email}</span>. Enter it below.
                </p>
              </div>

              {/* OTP Inputs */}
              <div className="flex gap-3 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-[52px] h-[52px] text-center border border-[rgba(0,0,0,0.4)] rounded-[10px] font-['Poppins'] text-[20px] text-black outline-none focus:border-[#003566] transition-colors"
                  />
                ))}
              </div>

              {error && <p className="font-['Poppins'] text-[13px] text-[#cc3636] text-center">{error}</p>}

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full h-[42px] bg-[#003566] hover:bg-[#00284d] disabled:opacity-70 rounded-[24px] flex items-center justify-center transition-colors"
              >
                {isLoading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <span className="font-['Poppins'] font-semibold text-[16px] text-white">Verify Code</span>}
              </button>

              <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] text-center">
                Didn't receive it?{' '}
                <button
                  onClick={() => { setOtp(['','','','','','']); setError(''); }}
                  className="text-[#003566] font-semibold hover:opacity-70 transition-opacity"
                >
                  Resend code
                </button>
              </p>
            </>
          )}

          {/* ── STAGE: RESET ── */}
          {stage === 'reset' && (
            <>
              <div className="flex flex-col gap-1 pb-1">
                <p className="font-['Poppins'] font-medium text-[36px] text-black leading-tight">Reset Password</p>
                <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)]">
                  Create a new password for your account.
                </p>
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-[10px] w-full">
                <label className="font-['Poppins'] text-[16px] text-black">New Password</label>
                <div className="relative rounded-[10px]">
                  <div className="absolute inset-0 border border-[rgba(0,0,0,0.4)] rounded-[10px] pointer-events-none" />
                  <div className="flex items-center justify-between px-[10px] py-[8px]">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="flex-1 bg-transparent font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] placeholder:text-[rgba(0,0,0,0.4)] outline-none"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="p-0.5">
                      <svg fill="none" viewBox="0 0 24 24" className="w-5 h-5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7">
                        {showNew ? (
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
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-[10px] w-full">
                <label className="font-['Poppins'] text-[16px] text-black">Confirm Password</label>
                <div className="relative rounded-[10px]">
                  <div className="absolute inset-0 border border-[rgba(0,0,0,0.4)] rounded-[10px] pointer-events-none" />
                  <div className="flex items-center justify-between px-[10px] py-[8px]">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                      placeholder="••••••••••••"
                      className="flex-1 bg-transparent font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] placeholder:text-[rgba(0,0,0,0.4)] outline-none"
                    />
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
                  </div>
                </div>
              </div>

              {error && <p className="font-['Poppins'] text-[13px] text-[#cc3636] -mt-2">{error}</p>}

              <button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full h-[42px] bg-[#003566] hover:bg-[#00284d] disabled:opacity-70 rounded-[24px] flex items-center justify-center transition-colors"
              >
                {isLoading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <span className="font-['Poppins'] font-semibold text-[16px] text-white">Reset Password</span>}
              </button>
            </>
          )}

          {/* ── STAGE: SUCCESS ── */}
          {stage === 'success' && (
            <div className="flex flex-col items-center gap-6 py-8">
              {/* Checkmark circle */}
              <div className="w-[80px] h-[80px] rounded-full bg-[#003566] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="font-['Poppins'] font-medium text-[32px] text-black leading-tight">Password Reset!</p>
                <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)]">
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
              </div>
              <button
                onClick={onBack}
                className="w-full h-[42px] bg-[#003566] hover:bg-[#00284d] rounded-[24px] flex items-center justify-center transition-colors"
              >
                <span className="font-['Poppins'] font-semibold text-[16px] text-white">Back to Login</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
