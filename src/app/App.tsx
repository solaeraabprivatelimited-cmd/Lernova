import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { StudyRoomDashboard } from '@/app/components/dashboard/StudyRoomDashboard';
import { MentorDashboard } from '@/app/components/MentorDashboard';
import { LoginPage } from '@/app/components/LoginPage';
import { SignUpPage } from '@/app/components/SignUpPage';
import { ForgotPasswordPage } from '@/app/components/ForgotPasswordPage';
import { LandingPage } from '@/app/components/LandingPage';
import { ProtectedRoute, AppUser } from '@/app/components/ProtectedRoute';
import { auth, getCurrentUser, setCurrentUser, profile as profileApi, seed } from '@/app/lib/api';

export default function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentAppUser] = useState<AppUser | null>(getCurrentUser());
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
            setCurrentAppUser(prof);
          }
        } else {
          setCurrentAppUser(getCurrentUser());
        }
        // Seed demo data (idempotent)
        try { await seed.demo(); } catch {}
      } catch (e) {
        // No active session, stay on landing
        setCurrentAppUser(getCurrentUser());
      } finally {
        setIsRestoringSession(false);
      }
    };
    restore();
  }, []);

  const handleAuthSuccess = async () => {
    try {
      const prof = await profileApi.get();
      if (prof) {
        setCurrentUser(prof);
        setCurrentAppUser(prof);
        navigate(resolveHomeRoute(prof), { replace: true });
        return;
      }
    } catch {
      // Fall back to local user state if profile fetch fails.
    }

    const localUser = getCurrentUser() as AppUser | null;
    setCurrentAppUser(localUser);
    navigate(resolveHomeRoute(localUser), { replace: true });
  };

  const handleLogout = async () => {
    try { await auth.logout(); } catch {}
    setCurrentAppUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-white w-full overflow-x-hidden">
            <LandingPage onLogin={() => navigate('/login')} onSignUp={() => navigate('/signup')} />
          </div>
        }
      />

      <Route
        path="/login"
        element={
          <div className="min-h-screen bg-white w-full overflow-x-hidden">
            <LoginPage
              onLogin={() => {
                setCurrentAppUser(getCurrentUser());
                navigate('/dashboard', { replace: true });
              }}
              onMentorLogin={() => {
                setCurrentAppUser(getCurrentUser());
                navigate('/mentor-dashboard', { replace: true });
              }}
              onSignUp={() => navigate('/signup')}
              onForgotPassword={() => navigate('/forgot-password')}
              onBack={() => navigate('/')}
            />
          </div>
        }
      />

      <Route
        path="/signup"
        element={
          <div className="min-h-screen bg-white w-full overflow-x-hidden">
            <SignUpPage
              onSignUp={() => {
                void handleAuthSuccess();
              }}
              onLogin={() => navigate('/login')}
              onBack={() => navigate('/')}
            />
          </div>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <div className="min-h-screen bg-white w-full overflow-x-hidden">
            <ForgotPasswordPage onBack={() => navigate('/login')} />
          </div>
        }
      />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute isRestoringSession={isRestoringSession} user={currentUser} requiredRole="student">
            <div className="min-h-screen bg-white w-full overflow-x-hidden">
              <StudyRoomDashboard onLogout={handleLogout} />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/mentor-dashboard/*"
        element={
          <ProtectedRoute isRestoringSession={isRestoringSession} user={currentUser} requiredRole="mentor">
            <div className="min-h-screen bg-white w-full overflow-x-hidden">
              <MentorDashboard onLogout={handleLogout} />
            </div>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}