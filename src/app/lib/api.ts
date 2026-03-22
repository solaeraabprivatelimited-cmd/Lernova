/**
 * Learnova API Client
 * Central place for all backend API calls.
 * Reads project info from /utils/supabase/info.tsx and attaches auth tokens.
 */

import { projectId, publicAnonKey } from '/utils/supabase/info';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a0923c49`;

// ─── Supabase Auth client (true singleton) ──────────────────────────────────────
//
// Strategy: Create the client EXACTLY ONCE per JavaScript runtime, regardless of
// how many times this module is re-evaluated (e.g., Vite/Figma Make HMR).
//
//  1. `import.meta.hot.data` — Vite's official HMR state bag. The `.dispose()`
//     callback fires just before the module is replaced, saving the live client
//     into `hot.data` so the incoming module evaluation can pick it up.
//  2. `globalThis.__learnova_sb` — cross-reload fallback for environments where
//     `import.meta.hot` is unavailable (production, non-Vite runtimes).
//  3. Module-level `const` — fast in-module reference; never calls `createClient`
//     if either of the above already holds a client.

const _HOT_KEY  = 'supabaseClient';
const _GLOB_KEY = '__learnova_sb__';

function _getOrCreateClient(): SupabaseClient {
  // Check Vite HMR data bag first (fastest path during hot reloads)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hot = (import.meta as any).hot;
  if (hot?.data?.[_HOT_KEY]) return hot.data[_HOT_KEY] as SupabaseClient;

  // Check globalThis (survives across module re-evaluations in same JS context)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((globalThis as any)[_GLOB_KEY]) return (globalThis as any)[_GLOB_KEY] as SupabaseClient;

  // First time ever — create the client
  // Use a custom storageKey so our GoTrueClient gets its own storage namespace,
  // separate from the default `sb-<project>-auth-token` key used by
  // `figma:foundry-client-api` (which creates its own client at entrypoint load
  // time). Two clients sharing the SAME storage key trigger the "Multiple
  // GoTrueClient instances" warning; different keys each start at instanceID=0.
  const client = createClient(`https://${projectId}.supabase.co`, publicAnonKey, {
    auth: { storageKey: 'learnova_auth_v1' },
  });

  // Persist in globalThis so any future evaluations skip createClient
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any)[_GLOB_KEY] = client;
  return client;
}

// Eagerly evaluated — runs once per module load, NOT lazily
const _supabase: SupabaseClient = _getOrCreateClient();

// Register Vite HMR dispose hook: save the live client so the next module
// evaluation can recover it instead of calling createClient again.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((import.meta as any).hot) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (import.meta as any).hot.dispose((data: any) => {
    data[_HOT_KEY] = _supabase;
  });
}

export function getSupabaseClient(): SupabaseClient {
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

// Auto-sync _accessToken whenever Supabase silently refreshes the JWT.
// This replaces the per-request getSession() call in apiFetch, which was slow
// (an async round-trip on every API call) and unnecessary.
_supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.access_token && session.access_token !== _accessToken) {
    setAccessToken(session.access_token);
  }
});

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
  // _accessToken is kept fresh by the onAuthStateChange listener above.
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
    // Handle both our server's { error: "..." } and Supabase gateway's { message: "..." }
    const message = body?.error ?? body?.message ?? `API error ${res.status}`;
    throw new Error(message);
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