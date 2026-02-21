/**
 * Learnova API Client
 * Central place for all backend API calls.
 * Reads project info from /utils/supabase/info.tsx and attaches auth tokens.
 */

import { projectId, publicAnonKey } from '/utils/supabase/info';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a0923c49`;

// ─── Supabase Auth client (singleton) ──────────────────────────────────────────
let _supabase: SupabaseClient | null = null;
export function getSupabaseClient(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );
  }
  return _supabase;
}

// ─── Auth token storage ─────────────────────────────────────────────────────────
let _accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
  if (token) {
    localStorage.setItem('learnova_token', token);
  } else {
    localStorage.removeItem('learnova_token');
    localStorage.removeItem('learnova_user');
  }
}

export function getAccessToken(): string | null {
  if (_accessToken) return _accessToken;
  _accessToken = localStorage.getItem('learnova_token');
  return _accessToken;
}

export function setCurrentUser(user: any) {
  if (user) {
    localStorage.setItem('learnova_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('learnova_user');
  }
}

export function getCurrentUser(): any | null {
  const raw = localStorage.getItem('learnova_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// ─── Core fetch wrapper ─────────────────────────────────────────────────────────
async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
  usePublicKey = false
): Promise<T> {
  const token = getAccessToken();
  const authHeader = token
    ? `Bearer ${token}`
    : `Bearer ${publicAnonKey}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
      ...(options.headers ?? {}),
    },
  });

  let body: any;
  try { body = await res.json(); } catch { body = {}; }

  if (!res.ok) {
    throw new Error(body?.error ?? `API error ${res.status}`);
  }
  return body as T;
}

// ─── AUTH ───────────────────────────────────────────────────────────────────────

export const auth = {
  /** Register a new user or mentor account */
  async register(name: string, email: string, password: string, role: 'user' | 'mentor') {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }, true);
  },

  /** Sign in using Supabase Auth directly */
  async login(email: string, password: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    const token = data.session!.access_token;
    setAccessToken(token);
    return data;
  },

  /** Send password reset email */
  async forgotPassword(email: string) {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
  },

  /** Sign out */
  async logout() {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setAccessToken(null);
    setCurrentUser(null);
  },

  /** Restore session from Supabase (on page reload) */
  async restoreSession() {
    const supabase = getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      setAccessToken(session.access_token);
      return session;
    }
    return null;
  },
};

// ─── PROFILE ────────────────────────────────────────────────────────────────────

export const profile = {
  get: () => apiFetch('/profile'),
  update: (data: Record<string, any>) => apiFetch('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── NOTES ──────────────────────────────────────────────────────────────────────

export const notes = {
  list: () => apiFetch('/notes'),
  create: (title: string, content: string) =>
    apiFetch('/notes', { method: 'POST', body: JSON.stringify({ title, content }) }),
  update: (id: string, data: { title?: string; content?: string }) =>
    apiFetch(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/notes/${id}`, { method: 'DELETE' }),
};

// ─── TASKS ──────────────────────────────────────────────────────────────────────

export const tasks = {
  list: () => apiFetch('/tasks'),
  create: (title: string) =>
    apiFetch('/tasks', { method: 'POST', body: JSON.stringify({ title }) }),
  update: (id: string, data: { title?: string; completed?: boolean }) =>
    apiFetch(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/tasks/${id}`, { method: 'DELETE' }),
};

// ─── REMINDERS ──────────────────────────────────────────────────────────────────

export const reminders = {
  list: () => apiFetch('/reminders'),
  create: (data: { title: string; frequency?: string; reminderDate?: string; reminderTime?: string }) =>
    apiFetch('/reminders', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, any>) =>
    apiFetch(`/reminders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/reminders/${id}`, { method: 'DELETE' }),
};

// ─── STUDY PLANS ────────────────────────────────────────────────────────────────

export const studyPlans = {
  list: () => apiFetch('/study-plans'),
  create: (data: {
    subject: string; goal?: string; startDate?: string; endDate?: string;
    startTime?: string; endTime?: string; reminder?: string; priority?: 'high' | 'medium' | 'low';
  }) => apiFetch('/study-plans', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, any>) =>
    apiFetch(`/study-plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`/study-plans/${id}`, { method: 'DELETE' }),
};

// ─── MOOD CHECK-INS ─────────────────────────────────────────────────────────────

export const moodCheckins = {
  list: () => apiFetch('/mood-checkins'),
  create: (mood: string, emoji: string, note?: string) =>
    apiFetch('/mood-checkins', { method: 'POST', body: JSON.stringify({ mood, emoji, note }) }),
};

// ─── WORLD CHAT ─────────────────────────────────────────────────────────────────

export const worldChat = {
  getMessages: () => apiFetch('/world-chat'),
  sendMessage: (text: string, senderName: string, senderAvatar?: string) =>
    apiFetch('/world-chat', { method: 'POST', body: JSON.stringify({ text, senderName, senderAvatar }) }),
};

// ─── COMMUNITY EVENTS ───────────────────────────────────────────────────────────

export const community = {
  getEvents: () => apiFetch('/community/events'),
  createEvent: (data: {
    title: string; description: string; details?: string[];
    eventDate?: string; isUpcoming?: boolean;
  }) => apiFetch('/community/events', { method: 'POST', body: JSON.stringify(data) }),
  deleteEvent: (id: string) => apiFetch(`/community/events/${id}`, { method: 'DELETE' }),
};

// ─── SESSIONS ───────────────────────────────────────────────────────────────────

export const sessions = {
  list: () => apiFetch('/sessions'),
  create: (data: { subject: string; date: string; time: string; duration?: number; price?: number; notes?: string }) =>
    apiFetch('/sessions', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, any>) =>
    apiFetch(`/sessions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  cancel: (id: string) => apiFetch(`/sessions/${id}`, { method: 'DELETE' }),
};

// ─── SESSION REQUESTS ────────────────────────────────────────────────────────────

export const sessionRequests = {
  list: () => apiFetch('/session-requests'),
  create: (data: {
    mentorId: string; subject: string; message?: string;
    preferredDate?: string; preferredTime?: string; paymentMethod?: string;
  }) => apiFetch('/session-requests', { method: 'POST', body: JSON.stringify(data) }),
  respond: (id: string, status: 'accepted' | 'declined') =>
    apiFetch(`/session-requests/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────────

export const notifications = {
  list: () => apiFetch('/notifications'),
  markRead: (id: string) => apiFetch(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead: () => apiFetch('/notifications/read-all', { method: 'PUT' }),
};

// ─── MENTORS ────────────────────────────────────────────────────────────────────

export const mentors = {
  list: () => apiFetch('/mentors'),
};

// ─── MENTOR EARNINGS ────────────────────────────────────────────────────────────

export const earnings = {
  get: () => apiFetch('/earnings'),
  record: (amount: number, sessionId?: string, description?: string) =>
    apiFetch('/earnings/record', { method: 'POST', body: JSON.stringify({ amount, sessionId, description }) }),
};

// ─── WITHDRAWALS ────────────────────────────────────────────────────────────────

export const withdrawals = {
  list: () => apiFetch('/withdrawals'),
  create: (amount: number, method: string, accountDetails?: Record<string, any>) =>
    apiFetch('/withdrawals', { method: 'POST', body: JSON.stringify({ amount, method, accountDetails }) }),
};

// ─── PAYMENT MODES ──────────────────────────────────────────────────────────────

export const paymentModes = {
  list: () => apiFetch('/payment-modes'),
  add: (data: { type: string; accountNumber?: string; bankName?: string; ifscCode?: string; upiId?: string; primary?: boolean }) =>
    apiFetch('/payment-modes', { method: 'POST', body: JSON.stringify(data) }),
  remove: (id: string) => apiFetch(`/payment-modes/${id}`, { method: 'DELETE' }),
};

// ─── PERFORMANCE ────────────────────────────────────────────────────────────────

export const performance = {
  get: () => apiFetch('/performance'),
};

// ─── STUDY SESSIONS (focus timer) ───────────────────────────────────────────────

export const studySessions = {
  list: () => apiFetch('/study-sessions'),
  record: (mode: string, durationMinutes: number, completedPomodoros?: number) =>
    apiFetch('/study-sessions', { method: 'POST', body: JSON.stringify({ mode, durationMinutes, completedPomodoros }) }),
};

// ─── SEED ───────────────────────────────────────────────────────────────────────

export const seed = {
  demo: () => apiFetch('/seed/demo', { method: 'POST' }, true),
};
