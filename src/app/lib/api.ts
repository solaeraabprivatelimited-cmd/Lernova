/**
 * Learnova API Client
 * Central place for all backend API calls.
 * Reads project info from /utils/supabase/info.tsx and attaches auth tokens.
 */

import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const BASE_URL = `https://${projectId}.supabase.co/functions/v1/server`;

function createPublicFunctionHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    apikey: publicAnonKey,
    Authorization: `Bearer ${publicAnonKey}`,
  };
}

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

// ─── Auth token storage (✅ SECURE: Using sessionStorage instead of localStorage) ───
import {
  setAccessTokenSecurely,
  getAccessTokenSecurely,
  clearSecureSession as clearSecureSessionUtil,
  setUserDataSecurely,
  getUserDataSecurely,
} from './secure-token-storage';

let _accessToken: string | null = null;

const EXPECTED_JWT_ISS_PREFIX = `https://${projectId}.supabase.co/auth/v1`;

function decodeJwtPayload(token: string): any | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

function isProjectJwt(token: string | null | undefined, minValidityMs = 0): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3 || parts.some((p) => p.length === 0)) return false;

  const payload = decodeJwtPayload(token);
  const expMs = typeof payload?.exp === 'number' ? payload.exp * 1000 : 0;
  const iss = typeof payload?.iss === 'string' ? payload.iss : '';

  if (!iss.startsWith(EXPECTED_JWT_ISS_PREFIX)) return false;
  return expMs > Date.now() + minValidityMs;
}

/**
 * ✅ SECURE: Set access token in sessionStorage
 * sessionStorage is cleared when browser tab closes (safer than localStorage)
 */
export function setAccessToken(token: string | null) {
  const normalizedToken = isProjectJwt(token) ? token! : null;
  _accessToken = normalizedToken;
  if (normalizedToken) {
    setAccessTokenSecurely(normalizedToken);
  } else {
    setAccessTokenSecurely(null);
    setUserDataSecurely(null);
  }
}

/**
 * ✅ SECURE: Get access token from sessionStorage
 * Returns null if token is expired or invalid
 */
export function getAccessToken(): string | null {
  if (_accessToken) {
    if (!isProjectJwt(_accessToken)) {
      _accessToken = null;
      setAccessTokenSecurely(null);
      return null;
    }
    return _accessToken;
  }
  _accessToken = getAccessTokenSecurely();
  if (_accessToken && !isProjectJwt(_accessToken)) {
    _accessToken = null;
    setAccessTokenSecurely(null);
  }
  return _accessToken;
}

// Auto-sync _accessToken whenever Supabase silently refreshes the JWT.
// This replaces the per-request getSession() call in apiFetch, which was slow
// (an async round-trip on every API call) and unnecessary.
_supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.access_token && session.access_token !== _accessToken) {
    setAccessToken(session.access_token);
  }
  if (session?.user) {
    setCurrentUser(mapSessionUser(session));
  } else {
    setAccessToken(null);
    setCurrentUser(null);
  }
});

/**
 * ✅ SECURE: Set current user data in sessionStorage
 * Only stores non-sensitive metadata (id, email, name, role)
 */
export function setCurrentUser(user: any) {
  if (user) {
    setUserDataSecurely({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } else {
    setUserDataSecurely(null);
  }
}

/**
 * ✅ SECURE: Get current user data from sessionStorage
 */
export function getCurrentUser(): any | null {
  return getUserDataSecurely();
}

function mapSessionUser(session: any) {
  const user = session?.user;
  if (!user) return null;

  const metadata = user.user_metadata ?? {};
  const appMetadata = user.app_metadata ?? {};

  return {
    id: user.id,
    email: user.email ?? null,
    name: metadata.name ?? metadata.full_name ?? user.email ?? 'User',
    role: metadata.role ?? appMetadata.role ?? 'student',
    avatar: metadata.avatar ?? metadata.avatar_url ?? null,
    avatar_url: metadata.avatar_url ?? metadata.avatar ?? null,
  };
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

function toDatabaseLocalTimestamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function parseDatabaseDateTime(value: string | null | undefined): Date | null {
  if (!value || typeof value !== 'string') return null;

  const normalized = value.trim().replace(' ', 'T');
  const hasTimezone = /[zZ]$|[+-]\d{2}:\d{2}$/.test(normalized);
  const candidate = hasTimezone ? normalized : normalized;
  const date = new Date(candidate);

  if (!Number.isNaN(date.getTime()) && hasTimezone) {
    return date;
  }

  const localMatch = normalized.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d+))?$/,
  );
  if (!localMatch) {
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const [, year, month, day, hours, minutes, seconds = '0', fraction = '0'] = localMatch;
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds),
    Number(fraction.slice(0, 3).padEnd(3, '0')),
  );
}

async function hasValidSupabaseUserToken(supabase: SupabaseClient, token: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.getUser(token);
    return !error && !!data?.user;
  } catch {
    return false;
  }
}

// ─── Core fetch wrapper ─────────────────────────────────────────────────────────
async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
  usePublicKey = false
): Promise<T> {
  const supabase = getSupabaseClient();
  let activeToken: string | null = null;

  let authHeader: string | null = usePublicKey ? `Bearer ${publicAnonKey}` : null;
  if (!usePublicKey) {
    const { data: current } = await supabase.auth.getSession();
    let session = current.session;
    const expiresAtMs = (session?.expires_at ?? 0) * 1000;

    // Refresh session if missing or near expiry.
    if (!session || expiresAtMs <= Date.now() + 30_000) {
      const { data: refreshed } = await supabase.auth.refreshSession();
      session = refreshed.session ?? session;
    }

    const sessionToken = session?.access_token ?? null;
    const cachedToken = getAccessToken();
    const token = isProjectJwt(sessionToken, 30_000)
      ? sessionToken
      : (isProjectJwt(cachedToken, 30_000) ? cachedToken : null);

    if (token) {
      setAccessToken(token);
      activeToken = token;
      authHeader = `Bearer ${token}`;
    } else {
      setAccessToken(null);
      setCurrentUser(null);
      throw new Error('Authentication expired. Please log in again.');
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
      // Send API key as fallback for Supabase Edge Functions auth
      'apikey': publicAnonKey,
      ...(options.headers ?? {}),
    },
  });

  let body: any;
  try { body = await res.json(); } catch { body = {}; }

  if (res.status === 401 && !usePublicKey) {
    const message = String(body?.message ?? body?.error ?? '').toLowerCase();
    if (activeToken && message.includes('invalid jwt')) {
      const { data: verified, error: verifyErr } = await supabase.auth.getUser(activeToken);
      if (!verifyErr && verified?.user) {
        throw new Error('Backend auth verification is misconfigured. Your session token is valid in Supabase Auth, but Edge Function validation rejects it. Check function secrets SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the deployed project.');
      }
    }

    // Retry once after forced refresh when token is invalid/expired.
    const { data: refreshed } = await supabase.auth.refreshSession();
    const retryToken = refreshed.session?.access_token ?? null;

    if (isProjectJwt(retryToken, 30_000)) {
      setAccessToken(retryToken);
      const retryRes = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${retryToken}`,
          ...(options.headers ?? {}),
        },
      });

      let retryBody: any;
      try { retryBody = await retryRes.json(); } catch { retryBody = {}; }
      if (retryRes.ok) {
        return retryBody as T;
      }
      const message = retryBody?.error ?? retryBody?.message ?? `API error ${retryRes.status}`;
      throw new Error(message);
    }

    setAccessToken(null);
    setCurrentUser(null);
    throw new Error('Authentication expired. Please log in again.');
  }

  if (!res.ok) {
    // Handle both our server's { error: "..." } and Supabase gateway's { message: "..." }
    const message = body?.error ?? body?.message ?? `API error ${res.status}`;
    throw new Error(message);
  }
  return body as T;
}

// ─── AUTH ───────────────────────────────────────────────────────────────────────

export const auth = {
  /** Step 1: Send OTP for signup */
  async requestSignupOtp(name: string, email: string, role: 'student' | 'mentor') {
    const response = await fetch('https://evtvzmherkrahjsxdddi.supabase.co/functions/v1/send-signup-otp', {
      method: 'POST',
      headers: createPublicFunctionHeaders(),
      body: JSON.stringify({ email, name, role }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send OTP');
    }
    
    return response.json();
  },

  /** Step 2: Verify OTP and create account */
  async verifySignupOtp(email: string, otp: string, password: string) {
    const response = await fetch('https://evtvzmherkrahjsxdddi.supabase.co/functions/v1/verify-auth-otp', {
      method: 'POST',
      headers: createPublicFunctionHeaders(),
      body: JSON.stringify({ email, otp, password, type: 'signup' }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Invalid or expired OTP');
    }
    
    const data = await response.json();
    
    // After user is created, sign them in to get a session
    if (data.user) {
      const supabase = getSupabaseClient();
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: data.user.email,
        password,
      });

      if (loginError) {
        throw new Error(loginError.message);
      }

      if (loginData.session) {
        setAccessToken(loginData.session.access_token);
        setCurrentUser(mapSessionUser(loginData.session));
      }
    }
    
    return data;
  },

  /** Sign in using Supabase Auth directly */
  async login(email: string, password: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    const token = data.session!.access_token;
    setAccessToken(token);
    setCurrentUser(mapSessionUser(data.session));
    return data;
  },

  /** Step 1: Request password reset (send code) */
  async requestPasswordResetCode(email: string) {
    const response = await fetch('https://evtvzmherkrahjsxdddi.supabase.co/functions/v1/send-password-reset-code', {
      method: 'POST',
      headers: createPublicFunctionHeaders(),
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send reset code');
    }
    
    return response.json();
  },

  /** Step 2: Verify reset code and update password */
  async verifyPasswordResetCode(email: string, code: string, newPassword: string) {
    const response = await fetch('https://evtvzmherkrahjsxdddi.supabase.co/functions/v1/verify-auth-otp', {
      method: 'POST',
      headers: createPublicFunctionHeaders(),
      body: JSON.stringify({ email, otp: code, newPassword, type: 'password_reset' }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Invalid or expired code');
    }
    
    return response.json();
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
    const { data: current } = await supabase.auth.getSession();
    let session = current.session;
    const expiresAtMs = (session?.expires_at ?? 0) * 1000;
    if (!session || expiresAtMs <= Date.now() + 30_000) {
      const { data: refreshed } = await supabase.auth.refreshSession();
      session = refreshed.session ?? session;
    }

    if (session?.access_token) {
      const valid = await hasValidSupabaseUserToken(supabase, session.access_token);
      if (valid) {
        setAccessToken(session.access_token);
        setCurrentUser(mapSessionUser(session));
        return session;
      }
    }

    try { await supabase.auth.signOut({ scope: 'local' }); } catch {}
    setAccessToken(null);
    setCurrentUser(null);
    return null;
  },
};

// ─── PROFILE ────────────────────────────────────────────────────────────────────

async function getCurrentSessionUser() {
  const supabase = getSupabaseClient();
  const { data: current } = await supabase.auth.getSession();
  let session = current.session;
  const expiresAtMs = (session?.expires_at ?? 0) * 1000;
  if (!session || expiresAtMs <= Date.now() + 30_000) {
    const { data: refreshed } = await supabase.auth.refreshSession();
    session = refreshed.session ?? session;
  }
  return session?.user ?? null;
}

async function getProfileDirect() {
  const supabase = getSupabaseClient();
  const user = await getCurrentSessionUser();
  if (!user) return getCurrentUser();

  const base = {
    id: user.id,
    email: user.email ?? null,
    name: user.user_metadata?.name ?? user.user_metadata?.full_name ?? user.email ?? 'User',
    role: user.user_metadata?.role ?? user.app_metadata?.role ?? 'student',
    avatar: user.user_metadata?.avatar ?? user.user_metadata?.avatar_url ?? null,
    avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.avatar ?? null,
  };

  const { data: profileRow } = await supabase
    .from('profiles')
    .select('id, name, avatar_url, role, bio')
    .eq('id', user.id)
    .maybeSingle();

  const { data: subjectRows } = await supabase
    .from('subjects')
    .select('subject')
    .eq('profile_id', user.id);

  const merged = {
    ...base,
    ...(profileRow ? {
      id: profileRow.id,
      name: profileRow.name ?? base.name,
      role: profileRow.role ?? base.role,
      avatar: profileRow.avatar_url ?? base.avatar,
      avatar_url: profileRow.avatar_url ?? base.avatar_url,
      bio: profileRow.bio ?? '',
    } : {}),
    subjects: (subjectRows ?? []).map((row: any) => row.subject).filter(Boolean),
  };

  setCurrentUser(merged);
  return merged;
}

export const profile = {
  get: async () => {
    try {
      return await getProfileDirect();
    } catch {
      return getCurrentUser();
    }
  },
  update: async (data: Record<string, any>) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const updates: Record<string, any> = {};
    if (typeof data.name === 'string') updates.name = data.name;
    if (typeof data.bio === 'string') updates.bio = data.bio;
    if (typeof data.role === 'string') updates.role = data.role;
    if (typeof data.avatar === 'string') updates.avatar_url = data.avatar;
    if (typeof data.avatar_url === 'string') updates.avatar_url = data.avatar_url;

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...updates }, { onConflict: 'id' });
      if (error) throw new Error(error.message);
    }

    if (Array.isArray(data.subjects)) {
      const cleanedSubjects = [...new Set(data.subjects.filter((s: any) => typeof s === 'string').map((s: string) => s.trim()).filter(Boolean))];
      await supabase.from('subjects').delete().eq('profile_id', user.id);
      if (cleanedSubjects.length > 0) {
        const { error: insertErr } = await supabase
          .from('subjects')
          .insert(cleanedSubjects.map((subject: string) => ({ profile_id: user.id, subject })));
        if (insertErr) throw new Error(insertErr.message);
      }
    }

    return profile.get();
  },
};

// ─── NOTES ──────────────────────────────────────────────────────────────────────

export const notes = {
  list: async () => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notes')
      .select('id, title, content, updated_at, created_at')
      .eq('profile_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row: any) => ({
      id: row.id,
      title: row.title ?? 'Untitled Note',
      content: row.content ?? '',
      updatedAt: row.updated_at ?? row.created_at ?? null,
      createdAt: row.created_at ?? null,
    }));
  },
  create: async (title: string, content: string) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const { data, error } = await supabase
      .from('notes')
      .insert({
        profile_id: user.id,
        title,
        content,
      })
      .select('id, title, content, updated_at, created_at')
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      title: data.title ?? 'Untitled Note',
      content: data.content ?? '',
      updatedAt: data.updated_at ?? data.created_at ?? null,
      createdAt: data.created_at ?? null,
    };
  },
  update: async (id: string, data: { title?: string; content?: string }) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (typeof data.title === 'string') updates.title = data.title;
    if (typeof data.content === 'string') updates.content = data.content;

    const { data: updated, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .eq('profile_id', user.id)
      .select('id, title, content, updated_at, created_at')
      .single();

    if (error) throw new Error(error.message);

    return {
      id: updated.id,
      title: updated.title ?? 'Untitled Note',
      content: updated.content ?? '',
      updatedAt: updated.updated_at ?? updated.created_at ?? null,
      createdAt: updated.created_at ?? null,
    };
  },
  delete: async (id: string) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('profile_id', user.id);

    if (error) throw new Error(error.message);
  },
};

// ─── TASKS ──────────────────────────────────────────────────────────────────────

export const tasks = {
  list: async () => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('planner_tasks')
      .select('id, title, description, due_date, priority, status, created_at')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row: any) => ({
      id: row.id,
      title: row.title ?? 'Task',
      description: row.description ?? '',
      dueDate: row.due_date ?? '',
      priority: row.priority ?? 'low',
      completed: row.status === 'completed',
    }));
  },
  create: async (data: { title: string; description?: string; dueDate?: string; priority?: 'high' | 'medium' | 'low' }) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const { data: created, error } = await supabase
      .from('planner_tasks')
      .insert({
        profile_id: user.id,
        title: data.title,
        description: data.description || null,
        due_date: data.dueDate || null,
        priority: data.priority || 'low',
        status: 'incomplete',
      })
      .select('id, title, description, due_date, priority, status')
      .single();

    if (error) throw new Error(error.message);

    return {
      id: created.id,
      title: created.title,
      description: created.description ?? '',
      dueDate: created.due_date ?? '',
      priority: created.priority ?? 'low',
      completed: created.status === 'completed',
    };
  },
  update: async (id: string, data: Record<string, any>) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof data.title === 'string') updates.title = data.title;
    if (typeof data.description === 'string') updates.description = data.description;
    if (typeof data.dueDate === 'string') updates.due_date = data.dueDate || null;
    if (typeof data.priority === 'string') updates.priority = data.priority;
    if (typeof data.completed === 'boolean') {
      updates.status = data.completed ? 'completed' : 'incomplete';
      updates.completed_at = data.completed ? new Date().toISOString() : null;
    }

    const { data: updated, error } = await supabase
      .from('planner_tasks')
      .update(updates)
      .eq('id', id)
      .eq('profile_id', user.id)
      .select('id, title, description, due_date, priority, status')
      .single();

    if (error) throw new Error(error.message);

    return {
      id: updated.id,
      title: updated.title,
      description: updated.description ?? '',
      dueDate: updated.due_date ?? '',
      priority: updated.priority ?? 'low',
      completed: updated.status === 'completed',
    };
  },
  delete: async (id: string) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const { error } = await supabase
      .from('planner_tasks')
      .delete()
      .eq('id', id)
      .eq('profile_id', user.id);

    if (error) throw new Error(error.message);
  },
};

// ─── REMINDERS ──────────────────────────────────────────────────────────────────

export const reminders = {
  list: async () => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('planner_reminders')
      .select('id, title, frequency, reminder_date, reminder_time, status, created_at')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row: any) => ({
      id: row.id,
      title: row.title ?? 'Reminder',
      frequency: row.frequency ?? 'Daily',
      reminderDate: row.reminder_date ?? '',
      reminderTime: row.reminder_time ?? '',
      completed: row.status === 'completed',
    }));
  },
  create: async (data: { title: string; frequency?: string; reminderDate?: string; reminderTime?: string }) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const { data: created, error } = await supabase
      .from('planner_reminders')
      .insert({
        profile_id: user.id,
        title: data.title,
        frequency: data.frequency || 'Daily',
        reminder_date: data.reminderDate || null,
        reminder_time: data.reminderTime || null,
        status: 'active',
      })
      .select('id, title, frequency, reminder_date, reminder_time, status')
      .single();

    if (error) throw new Error(error.message);

    return {
      id: created.id,
      title: created.title,
      frequency: created.frequency ?? 'Daily',
      reminderDate: created.reminder_date ?? '',
      reminderTime: created.reminder_time ?? '',
      completed: created.status === 'completed',
    };
  },
  update: async (id: string, data: Record<string, any>) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof data.title === 'string') updates.title = data.title;
    if (typeof data.frequency === 'string') updates.frequency = data.frequency;
    if (typeof data.reminderDate === 'string') updates.reminder_date = data.reminderDate || null;
    if (typeof data.reminderTime === 'string') updates.reminder_time = data.reminderTime || null;
    if (typeof data.completed === 'boolean') {
      updates.status = data.completed ? 'completed' : 'active';
      updates.completed_at = data.completed ? new Date().toISOString() : null;
    }

    const { data: updated, error } = await supabase
      .from('planner_reminders')
      .update(updates)
      .eq('id', id)
      .eq('profile_id', user.id)
      .select('id, title, frequency, reminder_date, reminder_time, status')
      .single();

    if (error) throw new Error(error.message);

    return {
      id: updated.id,
      title: updated.title,
      frequency: updated.frequency ?? 'Daily',
      reminderDate: updated.reminder_date ?? '',
      reminderTime: updated.reminder_time ?? '',
      completed: updated.status === 'completed',
    };
  },
  delete: async (id: string) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const { error } = await supabase
      .from('planner_reminders')
      .delete()
      .eq('id', id)
      .eq('profile_id', user.id);

    if (error) throw new Error(error.message);
  },
};

// ─── STUDY PLANS ────────────────────────────────────────────────────────────────

export const studyPlans = {
  list: async () => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('study_plans')
      .select('id, title, description, subjects, start_date, end_date, start_time, end_time, reminder, priority, progress_percent, status, created_at')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row: any) => ({
      id: row.id,
      subject: row.title ?? row.subjects?.[0] ?? 'Study Plan',
      goal: row.description ?? '',
      startDate: row.start_date ?? '',
      endDate: row.end_date ?? '',
      startTime: row.start_time ?? '',
      endTime: row.end_time ?? '',
      timeStr: row.start_time && row.end_time ? `${row.start_time} - ${row.end_time}` : 'TBD',
      reminder: row.reminder ?? '',
      priority: row.priority ?? 'low',
      progress: Number(row.progress_percent ?? 0),
      completed: row.status === 'completed',
    }));
  },
  create: async (data: {
    subject: string; goal?: string; startDate?: string; endDate?: string;
    startTime?: string; endTime?: string; reminder?: string; priority?: 'high' | 'medium' | 'low';
  }) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const { data: created, error } = await supabase
      .from('study_plans')
      .insert({
        profile_id: user.id,
        title: data.subject,
        description: data.goal || null,
        goals: data.goal ? [data.goal] : [],
        subjects: data.subject ? [data.subject] : [],
        start_date: data.startDate || new Date().toISOString().slice(0, 10),
        end_date: data.endDate || data.startDate || new Date().toISOString().slice(0, 10),
        start_time: data.startTime || null,
        end_time: data.endTime || null,
        reminder: data.reminder || null,
        priority: data.priority || 'low',
        progress_percent: 0,
        status: 'active',
      })
      .select('id, title, description, start_date, end_date, start_time, end_time, reminder, priority, progress_percent, status')
      .single();

    if (error) throw new Error(error.message);

    return {
      id: created.id,
      subject: created.title,
      goal: created.description ?? '',
      startDate: created.start_date ?? '',
      endDate: created.end_date ?? '',
      startTime: created.start_time ?? '',
      endTime: created.end_time ?? '',
      timeStr: created.start_time && created.end_time ? `${created.start_time} - ${created.end_time}` : 'TBD',
      reminder: created.reminder ?? '',
      priority: created.priority ?? 'low',
      progress: Number(created.progress_percent ?? 0),
      completed: created.status === 'completed',
    };
  },
  update: async (id: string, data: Record<string, any>) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof data.subject === 'string') {
      updates.title = data.subject;
      updates.subjects = [data.subject];
    }
    if (typeof data.goal === 'string') {
      updates.description = data.goal;
      updates.goals = data.goal ? [data.goal] : [];
    }
    if (typeof data.startDate === 'string') updates.start_date = data.startDate;
    if (typeof data.endDate === 'string') updates.end_date = data.endDate;
    if (typeof data.startTime === 'string') updates.start_time = data.startTime || null;
    if (typeof data.endTime === 'string') updates.end_time = data.endTime || null;
    if (typeof data.reminder === 'string') updates.reminder = data.reminder || null;
    if (typeof data.priority === 'string') updates.priority = data.priority;
    if (typeof data.progress === 'number') updates.progress_percent = Math.max(0, Math.min(100, Math.round(data.progress)));
    if (typeof data.completed === 'boolean') {
      updates.status = data.completed ? 'completed' : 'active';
      if (data.completed) updates.progress_percent = 100;
    }

    const { data: updated, error } = await supabase
      .from('study_plans')
      .update(updates)
      .eq('id', id)
      .eq('profile_id', user.id)
      .select('id, title, description, start_date, end_date, start_time, end_time, reminder, priority, progress_percent, status')
      .single();

    if (error) throw new Error(error.message);
    return updated;
  },
  delete: async (id: string) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const { error } = await supabase
      .from('study_plans')
      .delete()
      .eq('id', id)
      .eq('profile_id', user.id);

    if (error) throw new Error(error.message);
  },
};

// ─── MOOD CHECK-INS ─────────────────────────────────────────────────────────────

export const moodCheckins = {
  list: async () => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('mood_checkins')
      .select('id, mood, note, created_at')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row: any) => ({
      id: row.id,
      mood: row.mood,
      note: row.note ?? '',
      createdAt: row.created_at,
    }));
  },
  create: async (data: { mood: string; note?: string }) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const { data: created, error } = await supabase
      .from('mood_checkins')
      .insert({
        profile_id: user.id,
        mood: data.mood,
        note: data.note || null,
      })
      .select('id, mood, note, created_at')
      .single();

    if (error) throw new Error(error.message);

    return {
      id: created.id,
      mood: created.mood,
      note: created.note ?? '',
      createdAt: created.created_at,
    };
  },
};

// ─── WORLD CHAT ─────────────────────────────────────────────────────────────────

export const worldChat = {
  getMessages: async () => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) return [];

    const { data: messages, error: messagesError } = await supabase
      .from('world_chat_messages')
      .select('id, user_id, content, created_at')
      .order('created_at', { ascending: true })
      .limit(200);

    if (messagesError) throw new Error(messagesError.message);

    const senderIds = [...new Set((messages ?? []).map((row: any) => row.user_id).filter(Boolean))];
    let usersById = new Map<string, { name: string; avatar_url: string | null }>();

    if (senderIds.length > 0) {
      const { data: userRows, error: usersError } = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .in('id', senderIds);

      if (usersError) throw new Error(usersError.message);
      usersById = new Map((userRows ?? []).map((row: any) => [row.id, {
        name: row.name ?? 'User',
        avatar_url: row.avatar_url ?? null,
      }]));
    }

    return (messages ?? []).map((row: any) => {
      const sender = usersById.get(row.user_id);
      return {
        id: row.id,
        senderId: row.user_id,
        sender: sender?.name ?? 'User',
        avatar: sender?.avatar_url ?? null,
        text: row.content ?? '',
        time: row.created_at,
      };
    });
  },
  sendMessage: async (text: string, senderName?: string, senderAvatar?: string) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const { data, error } = await supabase
      .from('world_chat_messages')
      .insert({
        user_id: user.id,
        content: text,
      })
      .select('id, user_id, content, created_at')
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      senderId: data.user_id,
      sender: senderName ?? user.user_metadata?.name ?? user.email ?? 'You',
      avatar: senderAvatar ?? user.user_metadata?.avatar_url ?? user.user_metadata?.avatar ?? null,
      text: data.content ?? '',
      time: data.created_at,
    };
  },
  reportMessage: async (data: {
    messageId: string;
    reportedUserId: string;
    reason: string;
    description?: string;
  }) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const normalizedReason = data.reason.toLowerCase();
    const reportType =
      normalizedReason.includes('disturb') || normalizedReason.includes('inappropriate')
        ? 'inappropriate'
        : normalizedReason.includes('misleading')
          ? 'spam'
          : normalizedReason === 'other'
            ? 'other'
            : 'harmful';

    const { data: inserted, error } = await supabase
      .from('reports')
      .insert({
        reporter_id: user.id,
        reported_id: data.reportedUserId,
        report_type: reportType,
        reason: data.reason,
        context: data.description || null,
        related_content_id: data.messageId,
        related_content_type: 'world_chat_message',
        status: 'open',
      })
      .select('id')
      .single();

    if (error) throw new Error(error.message);
    return inserted;
  },
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

export const motivationPosts = {
  list: async () => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) return [];

    const { data: posts, error: postsError } = await supabase
      .from('motivation_posts')
      .select('id, user_id, ui_type, title, content, image_url, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (postsError) throw new Error(postsError.message);

    const authorIds = [...new Set((posts ?? []).map((row: any) => row.user_id).filter(Boolean))];
    let usersById = new Map<string, { name: string; avatar_url: string | null }>();

    if (authorIds.length > 0) {
      const { data: userRows, error: usersError } = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .in('id', authorIds);

      if (usersError) throw new Error(usersError.message);

      usersById = new Map(
        (userRows ?? []).map((row: any) => [
          row.id,
          {
            name: row.name ?? 'Community Member',
            avatar_url: row.avatar_url ?? null,
          },
        ]),
      );
    }

    return (posts ?? []).map((row: any) => {
      const author = usersById.get(row.user_id);
      return {
        id: row.id,
        type: row.ui_type === 'story' ? 'story' : 'quote',
        title: row.title ?? (row.ui_type === 'story' ? 'Motivational Story' : 'Motivational Quote'),
        content: row.content ?? '',
        imageUrl: row.image_url ?? null,
        author: author?.name ?? 'Community Member',
        authorAvatar: author?.avatar_url ?? null,
        createdAt: row.created_at,
      };
    });
  },
  create: async (data: {
    type: 'quote' | 'story';
    title: string;
    content: string;
    imageUrl?: string | null;
  }) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const mappedType = data.type === 'story' ? 'reflection' : 'encouragement';

    const { data: inserted, error } = await supabase
      .from('motivation_posts')
      .insert({
        user_id: user.id,
        type: mappedType,
        ui_type: data.type,
        title: data.title,
        content: data.content,
        image_url: data.imageUrl ?? null,
      })
      .select('id, user_id, ui_type, title, content, image_url, created_at')
      .single();

    if (error) throw new Error(error.message);

    const currentUser = getCurrentUser();
    return {
      id: inserted.id,
      type: inserted.ui_type === 'story' ? 'story' : 'quote',
      title: inserted.title ?? data.title,
      content: inserted.content ?? data.content,
      imageUrl: inserted.image_url ?? null,
      author: currentUser?.name ?? user.user_metadata?.name ?? 'You',
      authorAvatar:
        currentUser?.avatar ??
        currentUser?.avatar_url ??
        user.user_metadata?.avatar_url ??
        null,
      createdAt: inserted.created_at,
    };
  },
};

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
  list: async () => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('id, type, title, content, is_read, created_at, action_url')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row: any) => ({
      id: row.id,
      title: row.title ?? 'Notification',
      message: row.content ?? '',
      read: Boolean(row.is_read),
      createdAt: row.created_at,
      actionUrl: row.action_url ?? null,
      category: row.type?.includes('withdraw')
        ? 'Withdraw Notifications'
        : row.type?.includes('session')
          ? 'Session Updates'
          : 'System and Platform Alerts',
    }));
  },
  create: async (data: {
    type: string;
    title: string;
    content: string;
    relatedId?: string | null;
    actionUrl?: string | null;
  }) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const { data: inserted, error } = await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: data.type,
        title: data.title,
        content: data.content,
        related_id: data.relatedId ?? null,
        action_url: data.actionUrl ?? null,
      })
      .select('id')
      .single();

    if (error) throw new Error(error.message);
    return inserted;
  },
  subscribe: async (onChange: (items: any[]) => void) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) return () => {};

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          try {
            const items = await notifications.list();
            onChange(items);
          } catch (error) {
            console.log('Notifications subscription refresh error:', error);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
  markRead: async (id: string) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
  },
  markAllRead: async () => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) throw new Error(error.message);
  },
};

// ─── MENTORS ────────────────────────────────────────────────────────────────────

export const mentors = {
  list: async () => {
    const supabase = getSupabaseClient();

    const { data: mentorProfiles, error: mentorProfilesError } = await supabase
      .from('mentor_profiles')
      .select('user_id, bio, rating, session_count, total_hours, hourly_rate, specializations, verified')
      .order('verified', { ascending: false })
      .order('rating', { ascending: false });

    if (mentorProfilesError) throw new Error(mentorProfilesError.message);

    const mentorIds = (mentorProfiles ?? []).map((row: any) => row.user_id).filter(Boolean);
    if (mentorIds.length === 0) return [];

    const { data: userRows, error: usersError } = await supabase
      .from('users')
      .select('id, name, avatar_url, role')
      .in('id', mentorIds)
      .eq('role', 'mentor');

    if (usersError) throw new Error(usersError.message);

    const { data: sessionRows, error: sessionsError } = await supabase
      .from('mentor_sessions')
      .select('id, mentor_id, scheduled_at, duration_mins, status')
      .in('mentor_id', mentorIds)
      .eq('status', 'pending')
      .gte('scheduled_at', toDatabaseLocalTimestamp(new Date()))
      .order('scheduled_at', { ascending: true });

    if (sessionsError) throw new Error(sessionsError.message);

    const usersById = new Map((userRows ?? []).map((row: any) => [row.id, row]));
    const sessionsByMentor = new Map<string, Array<{ id: string; scheduledAt: string; durationMins: number }>>();

    for (const row of sessionRows ?? []) {
      if (!row?.mentor_id || !row?.scheduled_at || !row?.id) continue;
      const existing = sessionsByMentor.get(row.mentor_id) ?? [];
      existing.push({
        id: row.id,
        scheduledAt: row.scheduled_at,
        durationMins: Math.max(30, Number(row.duration_mins) || 60),
      });
      sessionsByMentor.set(row.mentor_id, existing);
    }

    return (mentorProfiles ?? [])
      .map((profile: any) => {
        const user = usersById.get(profile.user_id);
        if (!user) return null;
        const availableSlots = sessionsByMentor.get(profile.user_id) ?? [];

        return {
          id: profile.user_id,
          name: user.name ?? 'Mentor',
          avatarUrl: user.avatar_url ?? null,
          bio: profile.bio ?? '',
          rating: profile.rating == null ? null : Number(profile.rating),
          sessionCount: Number(profile.session_count ?? 0),
          totalHours: Number(profile.total_hours ?? 0),
          hourlyRate: Number(profile.hourly_rate ?? 0),
          specializations: Array.isArray(profile.specializations) ? profile.specializations.filter(Boolean) : [],
          verified: Boolean(profile.verified),
          availableSlots,
          availableSessionCount: availableSlots.length,
          isAvailable: availableSlots.length > 0,
        };
      })
      .filter(Boolean);
  },
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

// ─── MENTOR DASHBOARD STATS ───────────────────────────────────────────────────

export const mentorDashboard = {
  getStats: async () => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const mentorName =
      user.user_metadata?.name ??
      user.user_metadata?.full_name ??
      user.email?.split('@')[0] ??
      'Mentor';

    const [
      totalSessionsResult,
      completedSessionsResult,
      paymentsResult,
      mentorProfileResult,
      bookingStatsResult,
    ] = await Promise.all([
      supabase
        .from('mentor_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('mentor_id', user.id),
      supabase
        .from('mentor_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('mentor_id', user.id)
        .eq('status', 'completed'),
      supabase
        .from('payments')
        .select('amount')
        .eq('mentor_id', user.id)
        .eq('status', 'completed'),
      supabase
        .from('mentor_profiles')
        .select('rating')
        .eq('user_id', user.id)
        .maybeSingle(),
      supabase
        .from('mentor_bookings')
        .select('id, booking_price, status, mentor_id, mentor_name')
        .or(`mentor_id.eq.${user.id},mentor_name.eq.${mentorName}`),
    ]);

    if (totalSessionsResult.error) throw new Error(totalSessionsResult.error.message);
    if (completedSessionsResult.error) throw new Error(completedSessionsResult.error.message);
    if (paymentsResult.error) throw new Error(paymentsResult.error.message);
    if (mentorProfileResult.error) throw new Error(mentorProfileResult.error.message);
    if (bookingStatsResult.error) throw new Error(bookingStatsResult.error.message);

    const grossPaise = (paymentsResult.data ?? []).reduce((sum: number, row: any) => {
      return sum + Math.max(0, Number(row?.amount) || 0);
    }, 0);
    const bookingRows = bookingStatsResult.data ?? [];
    const bookingCount = bookingRows.length;
    const bookingEarnings = bookingRows.reduce((sum: number, row: any) => {
      if (row?.status === 'cancelled') return sum;
      return sum + Math.max(0, Number(row?.booking_price) || 0);
    }, 0);

    const dbSessionCount = Number(totalSessionsResult.count ?? 0);
    const completedSessions = Number(completedSessionsResult.count ?? 0);
    const totalSessions = dbSessionCount > 0 ? dbSessionCount : bookingCount;
    const totalEarnings = grossPaise > 0 ? grossPaise / 100 : bookingEarnings;
    const averageRating = mentorProfileResult.data?.rating == null
      ? null
      : Number(mentorProfileResult.data.rating);

    return {
      totalSessions,
      completedSessions,
      totalEarnings,
      averageRating,
    };
  },
  listActiveSessions: async () => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const mentorName =
      user.user_metadata?.name ??
      user.user_metadata?.full_name ??
      user.email?.split('@')[0] ??
      'Mentor';

    const [sessionsResult, mentorProfileResult] = await Promise.all([
      supabase
        .from('mentor_sessions')
        .select('id, topic, scheduled_at, duration_mins, status, student_id')
        .eq('mentor_id', user.id)
        .in('status', ['pending', 'confirmed', 'ongoing'])
        .order('scheduled_at', { ascending: true }),
      supabase
        .from('mentor_profiles')
        .select('hourly_rate')
        .eq('user_id', user.id)
        .maybeSingle(),
    ]);

    if (sessionsResult.error) throw new Error(sessionsResult.error.message);
    if (mentorProfileResult.error) throw new Error(mentorProfileResult.error.message);

    const hourlyRate = mentorProfileResult.data?.hourly_rate == null
      ? null
      : Number(mentorProfileResult.data.hourly_rate);
    const sessionRows = (sessionsResult.data ?? []).filter((row: any) => {
      const scheduledAt = parseDatabaseDateTime(row?.scheduled_at);
      const isFuture = scheduledAt !== null && scheduledAt.getTime() >= Date.now();
      if (row?.status === 'pending' && !row?.student_id) {
        return isFuture;
      }
      return true;
    });

    if (sessionRows.length > 0) {
      return sessionRows.map((row: any) => ({
        id: row.id,
        mentorName,
        topic: row.topic ?? null,
        scheduledAt: row.scheduled_at,
        durationHours: Math.max(0.5, Math.round(((Number(row.duration_mins) || 60) / 60) * 10) / 10),
        hourlyRate,
        status: row.status,
        readOnly: Boolean(row.student_id),
      }));
    }

    const { data: bookingRows, error: bookingError } = await supabase
      .from('mentor_bookings')
      .select('id, mentor_subject, selected_date_time, duration, booking_price, status, mentor_id, mentor_name')
      .or(`mentor_id.eq.${user.id},mentor_name.eq.${mentorName}`)
      .in('status', ['pending', 'confirmed'])
      .order('created_at', { ascending: true });

    if (bookingError) throw new Error(bookingError.message);

    return (bookingRows ?? []).map((row: any) => ({
      id: row.id,
      mentorName,
      topic: row.mentor_subject ?? null,
      scheduledAt: row.selected_date_time,
      durationHours: Math.max(0.5, Number.parseFloat(String(row.duration ?? '').replace(/[^\d.]/g, '')) || 1),
      hourlyRate: row.booking_price == null ? hourlyRate : Math.round(Number(row.booking_price) * 100),
      status: row.status,
      readOnly: true,
    }));
  },
  createAvailabilitySessions: async (payload: {
    hourlyRatePaise: number;
    durationHours: number;
    scheduledAts: string[];
  }) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const durationMins = Math.max(30, Math.round((payload.durationHours || 1) * 60));
    const safeRate = Math.max(0, Math.round(payload.hourlyRatePaise || 0));
    const rows = payload.scheduledAts
      .filter(Boolean)
      .map((scheduledAt) => ({
        mentor_id: user.id,
        student_id: null,
        status: 'pending',
        topic: null,
        scheduled_at: scheduledAt,
        duration_mins: durationMins,
      }));

    if (rows.length === 0) throw new Error('Add at least one valid session slot.');

    const { error: profileError } = await supabase
      .from('mentor_profiles')
      .upsert({ user_id: user.id, hourly_rate: safeRate }, { onConflict: 'user_id' });

    if (profileError) throw new Error(profileError.message);

    const { data, error } = await supabase
      .from('mentor_sessions')
      .insert(rows)
      .select('id, topic, scheduled_at, duration_mins, status, student_id');

    if (error) throw new Error(error.message);
    return data ?? [];
  },
  updateAvailabilitySession: async (sessionId: string, payload: {
    hourlyRatePaise: number;
    durationHours: number;
    scheduledAt: string;
  }) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const durationMins = Math.max(30, Math.round((payload.durationHours || 1) * 60));
    const safeRate = Math.max(0, Math.round(payload.hourlyRatePaise || 0));

    const { error: profileError } = await supabase
      .from('mentor_profiles')
      .upsert({ user_id: user.id, hourly_rate: safeRate }, { onConflict: 'user_id' });

    if (profileError) throw new Error(profileError.message);

    const { data, error } = await supabase
      .from('mentor_sessions')
      .update({
        scheduled_at: payload.scheduledAt,
        duration_mins: durationMins,
      })
      .eq('id', sessionId)
      .eq('mentor_id', user.id)
      .is('student_id', null)
      .eq('status', 'pending')
      .select('id, topic, scheduled_at, duration_mins, status, student_id')
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
  deleteAvailabilitySession: async (sessionId: string) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const { error } = await supabase
      .from('mentor_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('mentor_id', user.id)
      .is('student_id', null)
      .eq('status', 'pending');

    if (error) throw new Error(error.message);
  },
  listSessionRequests: async () => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const mentorName =
      user.user_metadata?.name ??
      user.user_metadata?.full_name ??
      user.email?.split('@')[0] ??
      'Mentor';

    const { data: bookingRows, error: bookingError } = await supabase
      .from('mentor_bookings')
      .select('id, student_id, mentor_subject, selected_date_time, duration, booking_price, status, created_at, mentor_id, mentor_name')
      .or(`mentor_id.eq.${user.id},mentor_name.eq.${mentorName}`)
      .order('created_at', { ascending: false });

    if (bookingError) throw new Error(bookingError.message);

    const studentIds = [...new Set((bookingRows ?? []).map((row: any) => row.student_id).filter(Boolean))];
    let studentsById = new Map<string, string>();

    if (studentIds.length > 0) {
      const { data: studentRows, error: studentError } = await supabase
        .from('users')
        .select('id, name')
        .in('id', studentIds);

      if (studentError) throw new Error(studentError.message);
      studentsById = new Map((studentRows ?? []).map((row: any) => [row.id, row.name ?? 'Student']));
    }

    return (bookingRows ?? []).map((row: any) => ({
      id: row.id,
      student: studentsById.get(row.student_id) ?? 'Student',
      datetime: row.selected_date_time,
      hours: Math.max(1, Number.parseFloat(String(row.duration ?? '').replace(/[^\d.]/g, '')) || 1),
      status: row.status,
      subject: row.mentor_subject ?? null,
      createdAt: row.created_at,
    }));
  },
  postponeBooking: async (bookingId: string) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.rpc('postpone_mentor_booking_and_notify', {
      p_booking_id: bookingId,
    });

    if (error) throw new Error(error.message);
  },
  acceptBooking: async (bookingId: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.rpc('accept_mentor_booking_and_notify', {
      p_booking_id: bookingId,
    });

    if (error) throw new Error(error.message);
    return data;
  },
};

// ─── STUDY SESSIONS (focus timer) ───────────────────────────────────────────────

export const studySessions = {
  list: async () => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('focus_sessions')
      .select('id, duration_mins, completed_at, created_at, breaks_taken, notes, room_id')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row: any) => ({
      id: row.id,
      userId: user.id,
      mode: 'focus',
      durationMinutes: row.duration_mins,
      completedPomodoros: row.breaks_taken ?? 0,
      timestamp: row.completed_at ?? row.created_at,
      roomId: row.room_id ?? null,
      notes: row.notes ?? null,
    }));
  },
  record: async (mode: string, durationMinutes: number, completedPomodoros = 0) => {
    const supabase = getSupabaseClient();
    const user = await getCurrentSessionUser();
    if (!user) throw new Error('Authentication expired. Please log in again.');

    const metadata = user.user_metadata ?? {};
    const appMetadata = user.app_metadata ?? {};
    const role = metadata.role ?? appMetadata.role ?? 'student';
    const displayName = metadata.name ?? metadata.full_name ?? user.email?.split('@')[0] ?? 'User';

    // Ensure users table row exists for foreign key integrity.
    const { error: userSyncErr } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email ?? '',
        name: displayName,
        avatar_url: metadata.avatar_url ?? metadata.avatar ?? null,
        role: role === 'mentor' ? 'mentor' : 'student',
        is_active: true,
        last_login_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    if (userSyncErr) throw new Error(userSyncErr.message);

    const durationMins = Math.max(1, Math.round(Number(durationMinutes) || 0));
    const notes = JSON.stringify({ mode, completedPomodoros });

    const { data, error } = await supabase
      .from('focus_sessions')
      .insert({
        user_id: user.id,
        duration_mins: durationMins,
        completed_at: new Date().toISOString(),
        breaks_taken: Math.max(0, Math.round(Number(completedPomodoros) || 0)),
        notes,
      })
      .select('id, duration_mins, completed_at, created_at, breaks_taken, notes, room_id')
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      userId: user.id,
      mode,
      durationMinutes: data.duration_mins,
      completedPomodoros: data.breaks_taken ?? 0,
      timestamp: data.completed_at ?? data.created_at,
      roomId: data.room_id ?? null,
      notes: data.notes ?? null,
    };
  },
  summary: async () => {
    const sessions = await studySessions.list();
    const totalMinutes = (sessions ?? []).reduce((sum, session) => {
      const mins = typeof session?.durationMinutes === 'number' ? session.durationMinutes : Number(session?.durationMinutes ?? 0);
      return sum + (Number.isFinite(mins) ? mins : 0);
    }, 0);
    const totalHours = totalMinutes / 60;
    return {
      totalSessions: (sessions ?? []).length,
      totalMinutes,
      totalHours,
      sessions: sessions ?? [],
    };
  },
};

// ─── SEED ───────────────────────────────────────────────────────────────────────

export const seed = {
  demo: () => apiFetch('/seed/demo', { method: 'POST' }, true),
};



