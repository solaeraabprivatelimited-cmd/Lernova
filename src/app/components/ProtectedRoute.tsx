import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export type UserRole = 'student' | 'mentor';

export interface AppUser {
  role?: UserRole;
  [key: string]: unknown;
}

interface ProtectedRouteProps {
  isRestoringSession: boolean;
  user: AppUser | null;
  requiredRole?: UserRole | UserRole[];
  children: React.ReactNode;
  fallbackPath?: string;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-[3px] border-[#003566] border-t-transparent rounded-full animate-spin" />
        <p className="font-['Poppins'] text-[14px] text-black/50">Loading Learnova...</p>
      </div>
    </div>
  );
}

function resolveHomeRoute(user: AppUser | null): string {
  if (user?.role === 'mentor') {
    return '/mentor-dashboard';
  }
  return '/dashboard';
}

export function ProtectedRoute({
  isRestoringSession,
  user,
  requiredRole,
  children,
  fallbackPath = '/login',
}: ProtectedRouteProps) {
  const location = useLocation();

  // Show loading during session restoration
  if (isRestoringSession) {
    return <LoadingScreen />;
  }

  // Redirect to login if no user
  if (!user) {
    return <Navigate to={fallbackPath} replace state={{ from: location.pathname }} />;
  }

  // Check role if required
  if (requiredRole) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (user.role && !requiredRoles.includes(user.role)) {
      // User doesn't have required role, redirect to their home
      return <Navigate to={resolveHomeRoute(user)} replace />;
    }
  }

  return <>{children}</>;
}

/**
 * Hook to check if user has required role(s).
 * Returns null if no user, otherwise boolean.
 */
export function useHasRole(user: AppUser | null, requiredRoles?: UserRole | UserRole[]): boolean {
  if (!user || !requiredRoles) {
    return !!user;
  }

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(user.role as UserRole);
}

/**
 * Hook to resolve the home route for a user based on their role.
 */
export function useHomeRoute(user: AppUser | null): string {
  return resolveHomeRoute(user);
}
