import React, { useState, useEffect } from 'react';
import { StudyRoomDashboard } from '@/app/components/dashboard/StudyRoomDashboard';
import { MentorDashboard } from '@/app/components/MentorDashboard';
import { LoginPage } from '@/app/components/LoginPage';
import { SignUpPage } from '@/app/components/SignUpPage';
import { ForgotPasswordPage } from '@/app/components/ForgotPasswordPage';

// Landing Page Components
import { Navbar } from '@/app/components/Navbar';
import { Hero } from '@/app/components/Hero';
import { StudyRooms } from '@/app/components/StudyRooms';
import { MentorSupport } from '@/app/components/MentorSupport';
import { Testimonials } from '@/app/components/Testimonials';
import { Footer } from '@/app/components/Footer';
import { auth, getCurrentUser, setCurrentUser, profile as profileApi, seed } from '@/app/lib/api';

type AppView = 'landing' | 'login' | 'signup' | 'forgot-password' | 'dashboard' | 'mentor-dashboard';

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  // On mount: try to restore a previous session
  useEffect(() => {
    const restore = async () => {
      try {
        const session = await auth.restoreSession();
        if (session) {
          const prof = await profileApi.get();
          if (prof) {
            setCurrentUser(prof);
            if (prof.role === 'mentor') {
              setView('mentor-dashboard');
            } else {
              setView('dashboard');
            }
          }
        }
        // Seed demo data (idempotent)
        try { await seed.demo(); } catch {}
      } catch (e) {
        // No active session, stay on landing
      } finally {
        setIsRestoringSession(false);
      }
    };
    restore();
  }, []);

  const handleLogout = async () => {
    try { await auth.logout(); } catch {}
    setView('login');
  };

  // Show a brief loading screen while restoring session
  if (isRestoringSession) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-[#003566] border-t-transparent rounded-full animate-spin" />
          <p className="font-['Poppins'] text-[14px] text-black/50">Loading Learnova...</p>
        </div>
      </div>
    );
  }

  // ── Mentor Dashboard ───────────────────────────────────────
  if (view === 'mentor-dashboard') {
    return (
      <div className="min-h-screen bg-white w-full overflow-x-hidden">
        <MentorDashboard onLogout={handleLogout} />
      </div>
    );
  }

  // ── User Dashboard ─────────────────────────────────────────
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-white w-full overflow-x-hidden">
        <StudyRoomDashboard onLogout={handleLogout} />
      </div>
    );
  }

  // ── Login ──────────────────────────────────────────────────
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-white w-full overflow-x-hidden">
        <LoginPage
          onLogin={() => setView('dashboard')}
          onMentorLogin={() => setView('mentor-dashboard')}
          onSignUp={() => setView('signup')}
          onForgotPassword={() => setView('forgot-password')}
          onBack={() => setView('landing')}
        />
      </div>
    );
  }

  // ── Sign Up ────────────────────────────────────────────────
  if (view === 'signup') {
    return (
      <div className="min-h-screen bg-white w-full overflow-x-hidden">
        <SignUpPage
          onSignUp={() => setView('dashboard')}
          onLogin={() => setView('login')}
          onBack={() => setView('landing')}
        />
      </div>
    );
  }

  // ── Forgot Password ────────────────────────────────────────
  if (view === 'forgot-password') {
    return (
      <div className="min-h-screen bg-white w-full overflow-x-hidden">
        <ForgotPasswordPage onBack={() => setView('login')} />
      </div>
    );
  }

  // ── Landing Page ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <Navbar onLogin={() => setView('login')} />
      <Hero />
      <div id="study-rooms"><StudyRooms /></div>
      <div id="mentor-support"><MentorSupport /></div>
      <div id="testimonials"><Testimonials /></div>
      <Footer />
    </div>
  );
}