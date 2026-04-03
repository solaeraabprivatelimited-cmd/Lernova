import React, { useState } from 'react';
import { auth } from '../lib/api';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

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
    if (code.length < 6) { setError('Please enter the 6-digit code.'); return; }
    setIsLoading(true);
    try {
      // Just mark code as verified, move to reset stage
      setStage('reset');
    } catch (e: any) {
      setError(e.message || 'Failed to verify code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    if (!newPassword.trim()) { setError('Please enter a new password.'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
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
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      document.getElementById(`fp-otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`fp-otp-${index - 1}`)?.focus();
    }
    if (e.key === 'Enter') handleVerifyOtp();
  };

  // Stage icon & title config
  const stageConfig: Record<Stage, { icon: React.ReactNode; title: string; subtitle: string | React.ReactNode }> = {
    request: {
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      ),
      title: 'Forgot your password?',
      subtitle: "No worries! Enter your email and we'll send you a reset code.",
    },
    otp: {
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 7l-10 6L2 7" />
        </svg>
      ),
      title: 'Check your email',
      subtitle: (
        <>We sent a 6-digit code to <span className="font-bold text-[#003566]">{email}</span>.</>
      ),
    },
    reset: {
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: 'Set new password',
      subtitle: 'Create a strong, unique password for your account.',
    },
    success: {
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      title: 'Password reset!',
      subtitle: 'Your password has been successfully reset. You can now log in.',
    },
  };

  const cfg = stageConfig[stage];

  const PrimaryButton = ({ onClick, loading, children }: { onClick: () => void; loading: boolean; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full h-[52px] rounded-full flex items-center justify-center gap-2 text-[15px] font-bold text-white transition-all duration-200 shadow-lg disabled:opacity-60"
      style={{
        background: 'linear-gradient(135deg, #003566, #0967bd)',
        boxShadow: '0 4px 20px rgba(0,53,102,0.3)',
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.boxShadow = '0 8px 28px rgba(9,103,189,0.4)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,53,102,0.3)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: '#f8fafd',
      }}
    >
      {/* Background decorations */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(9,103,189,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(9,103,189,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
      />
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(9,103,189,0.1) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(247,127,0,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-[480px]">
        {/* Card */}
        <div className="bg-white rounded-[24px] border border-[rgba(0,53,102,0.08)] shadow-xl p-8 sm:p-10 flex flex-col gap-7">

          {/* Icon badge */}
          <div className="flex flex-col items-center gap-5">
            <div
              className="w-[64px] h-[64px] rounded-full flex items-center justify-center"
              style={{
                background: stage === 'success'
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'linear-gradient(135deg, #003566, #0967bd)',
                boxShadow: stage === 'success'
                  ? '0 4px 20px rgba(34,197,94,0.3)'
                  : '0 4px 20px rgba(0,53,102,0.25)',
              }}
            >
              {cfg.icon}
            </div>
            <div className="text-center">
              <h1
                className="mb-2"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 'clamp(26px, 4vw, 34px)',
                  lineHeight: 1.15,
                  color: '#003566',
                }}
              >
                {cfg.title}
              </h1>
              <p className="text-[14px] text-[#5a7089] leading-relaxed max-w-[340px] mx-auto">{cfg.subtitle}</p>
            </div>
          </div>

          {/* ── STAGE: REQUEST ── */}
          {stage === 'request' && (
            <>
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
                    onKeyDown={(e) => e.key === 'Enter' && handleRequestReset()}
                    placeholder="you@example.com"
                    className="w-full h-[50px] pl-11 pr-4 bg-[#f8fafd] border border-[rgba(0,53,102,0.12)] rounded-[14px] text-[14px] text-[#0d1b2a] placeholder:text-[#5a7089]/50 outline-none focus:border-[#0967bd] focus:ring-2 focus:ring-[#0967bd]/10 transition-all"
                  />
                </div>
              </div>

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

              <PrimaryButton onClick={handleRequestReset} loading={isLoading}>
                Send Reset Code
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </PrimaryButton>
            </>
          )}

          {/* ── STAGE: OTP ── */}
          {stage === 'otp' && (
            <>
              <div className="flex gap-2.5 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`fp-otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-[52px] h-[56px] text-center border border-[rgba(0,53,102,0.12)] bg-[#f8fafd] rounded-[14px] text-[22px] font-bold text-[#003566] outline-none focus:border-[#0967bd] focus:ring-2 focus:ring-[#0967bd]/10 transition-all"
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                  />
                ))}
              </div>

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

              <PrimaryButton onClick={handleVerifyOtp} loading={isLoading}>
                Verify Code
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </PrimaryButton>

              <p className="text-center text-[14px] text-[#5a7089]">
                Didn&apos;t receive it?{' '}
                <button
                  onClick={() => { setOtp(['', '', '', '', '', '']); setError(''); }}
                  className="font-bold text-[#003566] hover:text-[#0967bd] transition-colors"
                >
                  Resend code
                </button>
              </p>
            </>
          )}

          {/* ── STAGE: RESET ── */}
          {stage === 'reset' && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#0d1b2a]">New Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a7089]">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full h-[50px] pl-11 pr-12 bg-[#f8fafd] border border-[rgba(0,53,102,0.12)] rounded-[14px] text-[14px] text-[#0d1b2a] placeholder:text-[#5a7089]/50 outline-none focus:border-[#0967bd] focus:ring-2 focus:ring-[#0967bd]/10 transition-all"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5a7089] hover:text-[#003566] transition-colors">
                    <EyeIcon open={showNew} />
                  </button>
                </div>
              </div>

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
                    onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                    placeholder="Re-enter your password"
                    className="w-full h-[50px] pl-11 pr-12 bg-[#f8fafd] border border-[rgba(0,53,102,0.12)] rounded-[14px] text-[14px] text-[#0d1b2a] placeholder:text-[#5a7089]/50 outline-none focus:border-[#0967bd] focus:ring-2 focus:ring-[#0967bd]/10 transition-all"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5a7089] hover:text-[#003566] transition-colors">
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
              </div>

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

              <PrimaryButton onClick={handleResetPassword} loading={isLoading}>
                Reset Password
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </PrimaryButton>
            </>
          )}

          {/* ── STAGE: SUCCESS ── */}
          {stage === 'success' && (
            <PrimaryButton onClick={onBack} loading={false}>
              Back to Login
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </PrimaryButton>
          )}
        </div>

        {/* Back to login link (below card) */}
        {stage !== 'success' && (
          <div className="text-center mt-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#5a7089] hover:text-[#003566] transition-colors group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
