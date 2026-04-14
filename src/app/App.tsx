import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { LandingPage } from '@/app/components/LandingPage';
import { ProtectedRoute, AppUser } from '@/app/components/ProtectedRoute';
import { RouteLoader } from '@/app/components/RouteLoader';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { Toaster } from '@/app/components/ui/sonner';
import { auth, getCurrentUser, setCurrentUser, profile as profileApi } from '@/app/lib/api';

const StudyRoomDashboard = React.lazy(async () => {
  const module = await import('@/app/components/dashboard/StudyRoomDashboard');
  return { default: module.StudyRoomDashboard };
});

const MentorDashboard = React.lazy(async () => {
  const module = await import('@/app/components/MentorDashboard');
  return { default: module.MentorDashboard };
});

const LoginPage = React.lazy(async () => {
  const module = await import('@/app/components/LoginPage');
  return { default: module.LoginPage };
});

const SignUpPage = React.lazy(async () => {
  const module = await import('@/app/components/SignUpPage');
  return { default: module.SignUpPage };
});

const ForgotPasswordPage = React.lazy(async () => {
  const module = await import('@/app/components/ForgotPasswordPage');
  return { default: module.ForgotPasswordPage };
});

const RoomLinkEntry = React.lazy(async () => {
  const module = await import('@/app/components/dashboard/RoomLinkEntry');
  return { default: module.RoomLinkEntry };
});

const GoogleOnboardingPage = React.lazy(async () => {
  const module = await import('@/app/components/GoogleOnboardingPage');
  return { default: module.GoogleOnboardingPage };
});

function resolveHomeRoute(user: AppUser | null): string {
  if (user?.role === 'mentor') {
    return '/mentor-dashboard';
  }
  return '/dashboard';
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentAppUser] = useState<AppUser | null>(getCurrentUser());
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  // On mount: try to restore a previous session
  useEffect(() => {
    let isMounted = true; // Track if component is still mounted
    let hasRun = false;   // Prevent double-run in Strict Mode

    const restore = async () => {
      if (hasRun) return; // Guard against React Strict Mode double-call
      hasRun = true;

      try {
        const session = await auth.restoreSession();
        if (!isMounted) return; // Abort if component unmounted

        if (session) {
          try {
            const prof = await profileApi.get();
            if (!isMounted) return;
            if (prof) {
              setCurrentUser(prof);
              setCurrentAppUser(prof);
            }
          } catch {
            // Keep the session-backed local user if profile endpoint fails.
            if (isMounted) setCurrentAppUser(getCurrentUser());
          }
        } else {
          if (isMounted) {
            setCurrentUser(null);
            setCurrentAppUser(null);
          }
        }
      } catch (e) {
        // No active session, stay on landing
        if (isMounted) {
          setCurrentUser(null);
          setCurrentAppUser(null);
        }
      } finally {
        if (isMounted) {
          setIsRestoringSession(false);
        }
      }
    };

    restore();

    // Cleanup: mark component as unmounted to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - runs once on mount

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

  const renderAppShell = (children: React.ReactNode, className = '') => (
    <div className={`min-h-screen w-full overflow-x-hidden bg-background text-foreground ${className}`}>
      {children}
    </div>
  );

  const showFloatingThemeToggle = /^(\/dashboard|\/mentor-dashboard|\/room\/)/.test(location.pathname);

  return (
    <>
      {showFloatingThemeToggle ? (
<<<<<<< HEAD
        <ThemeToggle
          className="fixed right-5 bottom-5 z-[70] rounded-full shadow-lg shadow-black/10 dark:shadow-black/40"
        />
=======
        <ThemeToggle className="fixed right-4 bottom-4 z-[70] rounded-full" />
>>>>>>> 0b7861d653f816432b14d75f478e1158f1bb1909
      ) : null}
      <Toaster closeButton position="top-right" richColors />

      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route
            path="/"
            element={
              isRestoringSession ? (
                <RouteLoader />
              ) : currentUser ? (
                <Navigate to={resolveHomeRoute(currentUser)} replace />
              ) : (
                renderAppShell(
                  <LandingPage onLogin={() => navigate('/login')} onSignUp={() => navigate('/signup')} />,
                )
              )
            }
          />

          <Route
            path="/login"
            element={renderAppShell(
              <LoginPage
                onLogin={() => {
                  void handleAuthSuccess();
                }}
                onMentorLogin={() => {
                  void handleAuthSuccess();
                }}
                onSignUp={() => navigate('/signup')}
                onForgotPassword={() => navigate('/forgot-password')}
                onBack={() => navigate('/')}
              />,
            )}
          />

          <Route
            path="/signup"
            element={renderAppShell(
              <SignUpPage
                onSignUp={() => {
                  void handleAuthSuccess();
                }}
                onLogin={() => navigate('/login')}
                onBack={() => navigate('/')}
              />,
            )}
          />

          <Route
            path="/forgot-password"
            element={renderAppShell(<ForgotPasswordPage onBack={() => navigate('/login')} />)}
          />

          <Route
            path="/onboarding/google"
            element={renderAppShell(
              <GoogleOnboardingPage
                onComplete={() => {
                  const prof = async () => {
                    try {
                      const p = await profileApi.get();
                      if (p) {
                        setCurrentUser(p);
                        setCurrentAppUser(p);
                        navigate(resolveHomeRoute(p), { replace: true });
                      }
                    } catch {
                      navigate(resolveHomeRoute(currentUser), { replace: true });
                    }
                  };
                  void prof();
                }}
                onCancel={() => navigate('/login', { replace: true })}
              />,
            )}
          />

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute isRestoringSession={isRestoringSession} user={currentUser} requiredRole="student">
                {renderAppShell(<StudyRoomDashboard onLogout={handleLogout} />)}
              </ProtectedRoute>
            }
          />

          <Route
            path="/mentor-dashboard/*"
            element={
              <ProtectedRoute isRestoringSession={isRestoringSession} user={currentUser} requiredRole="mentor">
                {renderAppShell(<MentorDashboard onLogout={handleLogout} />)}
              </ProtectedRoute>
            }
          />

          <Route
            path="/room/:roomCode"
            element={
              <ProtectedRoute isRestoringSession={isRestoringSession} user={currentUser}>
                {renderAppShell(
                  <RoomLinkEntry onExit={() => navigate(resolveHomeRoute(currentUser), { replace: true })} />,
                )}
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
