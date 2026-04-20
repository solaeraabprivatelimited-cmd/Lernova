/**
 * ════════════════════════════════════════════════════════════════════════════════
 * useAuth Hook - Global Auth State
 * ════════════════════════════════════════════════════════════════════════════════
 */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { apiClient } from '@/app/lib/api';

export interface User {
  id: string;
  email: string;
  role: 'student' | 'mentor' | 'admin';
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  oauthLogin: (provider: string, code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from session/JWT on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Verify token is valid by calling API
        const response = await apiClient.get<{ user: User }>('/auth/me');
        setUser(response.data.user);
      } catch {
        // Token invalid, clear storage
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiClient.post<{
        access_token: string;
        refresh_token: string;
        user: User;
      }>('/auth/login', { email, password });

      sessionStorage.setItem('access_token', response.data.access_token);
      sessionStorage.setItem('refresh_token', response.data.refresh_token);
      setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      const response = await apiClient.post<{
        access_token: string;
        refresh_token: string;
        user: User;
      }>('/auth/signup', { email, password, name });

      sessionStorage.setItem('access_token', response.data.access_token);
      sessionStorage.setItem('refresh_token', response.data.refresh_token);
      setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    setUser(null);
  }, []);

  const oauthLogin = useCallback(async (provider: string, code: string) => {
    try {
      const response = await apiClient.post<{
        access_token: string;
        refresh_token: string;
        user: User;
      }>('/auth/oauth', { provider, code });

      sessionStorage.setItem('access_token', response.data.access_token);
      sessionStorage.setItem('refresh_token', response.data.refresh_token);
      setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        oauthLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
