/**
 * Study Room API client
 * Wrapper around backend endpoints
 */

import { BASE_URL, getAccessToken, getSupabaseClient, setAccessToken } from '../../app/lib/api';
import { projectId } from '/utils/supabase/info';

const API_BASE = `${BASE_URL}/rooms`;

interface CreateRoomRequest {
  name: string;
  mode?: 'focus' | 'silent' | 'collaborative' | 'live';
  subject?: string;
  description?: string;
  maxParticipants?: number;
}

interface Room {
  id: string;
  code: string;
  name: string;
  mode: string;
  host_id: string;
  subject?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  ends_at?: string;
  description?: string;
  max_participants: number;
  password_protected: boolean;
  host?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  participants?: Array<{
    id: string;
    user_id: string;
    is_pinned: boolean;
    is_muted: boolean;
    is_video_off: boolean;
    permissions: string;
    user?: {
      id: string;
      name: string;
      avatar_url?: string;
    };
  }>;
}

function normalizeRoomIdentifier(identifier: string): string {
  return identifier.trim();
}

function extractRoomIdentifier(input: string): string {
  const value = normalizeRoomIdentifier(input);
  if (!value) return value;

  const roomCodeMatch = value.match(/STUDY-[A-Z0-9]+/i);
  if (roomCodeMatch) {
    return roomCodeMatch[0].toUpperCase();
  }

  const slashParts = value.split('/').filter(Boolean);
  return slashParts[slashParts.length - 1] ?? value;
}

function shouldFallbackToDirect(error: unknown): boolean {
  const message = String(error instanceof Error ? error.message : error).toLowerCase();
  return (
    message.includes('401') ||
    message.includes('invalid jwt') ||
    message.includes('backend auth verification is misconfigured') ||
    message.includes('authentication expired') ||
    message.includes('failed to fetch')
  );
}

async function getAuthUserId(): Promise<string> {
  const supabase = getSupabaseClient();
  const { data: current } = await supabase.auth.getSession();
  let session = current.session;
  const expiresAtMs = (session?.expires_at ?? 0) * 1000;
  if (!session || expiresAtMs <= Date.now() + 30_000) {
    const { data: refreshed } = await supabase.auth.refreshSession();
    session = refreshed.session ?? session;
  }

  const userId = session?.user?.id ?? null;
  if (!userId) {
    throw new Error('Authentication expired. Please log in again.');
  }
  return userId;
}

async function getAuthSessionUser() {
  const supabase = getSupabaseClient();
  const { data: current } = await supabase.auth.getSession();
  let session = current.session;
  const expiresAtMs = (session?.expires_at ?? 0) * 1000;
  if (!session || expiresAtMs <= Date.now() + 30_000) {
    const { data: refreshed } = await supabase.auth.refreshSession();
    session = refreshed.session ?? session;
  }

  const user = session?.user ?? null;
  if (!user) {
    throw new Error('Authentication expired. Please log in again.');
  }

  const metadata = user.user_metadata ?? {};
  const appMetadata = user.app_metadata ?? {};

  return {
    id: user.id,
    email: user.email ?? '',
    name: metadata.name ?? metadata.full_name ?? user.email?.split('@')[0] ?? 'User',
    avatar_url: metadata.avatar_url ?? metadata.avatar ?? null,
    role: metadata.role ?? appMetadata.role ?? 'student',
  };
}

async function ensureRelationalUserRow() {
  const supabase = getSupabaseClient();
  const user = await getAuthSessionUser();

  const { error } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      role: user.role === 'mentor' ? 'mentor' : 'student',
      is_active: true,
      last_login_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) {
    throw new Error(`Unable to sync user record for room operations: ${error.message}`);
  }

  return user.id;
}

function generateRoomCode(): string {
  return `STUDY-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;
}

async function directCreateRoom(request: CreateRoomRequest): Promise<Room> {
  const supabase = getSupabaseClient();
  const userId = await ensureRelationalUserRow();

  const { data, error } = await supabase
    .from('study_rooms')
    .insert({
      code: generateRoomCode(),
      name: request.name,
      mode: request.mode ?? 'collaborative',
      host_id: userId,
      subject: request.subject ?? null,
      description: request.description ?? null,
      max_participants: request.maxParticipants ?? 50,
      is_active: true,
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to create room');
  }

  const { error: participantErr } = await supabase.from('room_participants').insert({
    room_id: data.id,
    user_id: userId,
    permissions: 'host',
  });
  if (participantErr) {
    throw new Error(`Room created but failed to add host as participant: ${participantErr.message}`);
  }

  return data as Room;
}

async function directGetRoom(roomId: string): Promise<Room> {
  const supabase = getSupabaseClient();
  const identifier = extractRoomIdentifier(roomId);

  // Check if identifier is a room code format
  const isRoomCode = /^STUDY-[A-Z0-9]+$/i.test(identifier);
  
  let roomMatch;
  let roomMatchError;
  
  if (isRoomCode) {
    // Query by code only
    const result = await supabase
      .from('study_rooms')
      .select('id')
      .eq('code', identifier.toUpperCase())
      .maybeSingle();
    roomMatch = result.data;
    roomMatchError = result.error;
  } else {
    // Query by UUID
    const result = await supabase
      .from('study_rooms')
      .select('id')
      .eq('id', identifier)
      .maybeSingle();
    roomMatch = result.data;
    roomMatchError = result.error;
  }

  if (roomMatchError || !roomMatch?.id) {
    throw new Error(roomMatchError?.message ?? 'Room not found');
  }

  const { data, error } = await supabase
    .from('study_rooms')
    .select(`
      *,
      host:users(id, name, avatar_url),
      participants:room_participants(
        id, user_id, is_pinned, is_muted, is_video_off, permissions,
        user:users(id, name, avatar_url)
      )
    `)
    .eq('id', roomMatch.id)
    .maybeSingle();

  if (error || !data) {
    throw new Error(error?.message ?? 'Room not found');
  }

  return data as Room;
}

async function directListRooms(): Promise<Room[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('study_rooms')
    .select(`
      *,
      host:users(id, name, avatar_url),
      participants:room_participants(id)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Room[];
}

async function directJoinRoom(roomId: string) {
  const supabase = getSupabaseClient();
  const userId = await ensureRelationalUserRow();
  const room = await directGetRoom(roomId);

  const { data: existing } = await supabase
    .from('room_participants')
    .select('id')
    .eq('room_id', room.id)
    .eq('user_id', userId)
    .is('left_at', null)
    .maybeSingle();

  if (existing) {
    return { message: 'Already in room' };
  }

  const { data, error } = await supabase
    .from('room_participants')
    .insert({
      room_id: room.id,
      user_id: userId,
      permissions: 'member',
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function directLeaveRoom(roomId: string) {
  const supabase = getSupabaseClient();
  const userId = await getAuthUserId();
  const now = new Date().toISOString();
  const room = await directGetRoom(roomId);

  const { error } = await supabase
    .from('room_participants')
    .update({ left_at: now })
    .eq('room_id', room.id)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return { message: 'Left room' };
}

async function directCloseRoom(roomId: string) {
  const supabase = getSupabaseClient();
  const userId = await getAuthUserId();
  const roomRecord = await directGetRoom(roomId);

  const { data: room, error: roomErr } = await supabase
    .from('study_rooms')
    .select('host_id')
    .eq('id', roomRecord.id)
    .maybeSingle();

  if (roomErr || !room) {
    throw new Error(roomErr?.message ?? 'Room not found');
  }
  if (room.host_id !== userId) {
    throw new Error('Only host can close room');
  }

  const { error } = await supabase
    .from('study_rooms')
    .update({ is_active: false })
    .eq('id', roomRecord.id);

  if (error) {
    throw new Error(error.message);
  }

  return { message: 'Room closed' };
}

async function directUpdateParticipant(
  participantId: string,
  updates: {
    is_pinned?: boolean;
    is_muted?: boolean;
    is_video_off?: boolean;
    permissions?: string;
  }
) {
  const supabase = getSupabaseClient();
  const userId = await getAuthUserId();

  const { data: participant, error: pErr } = await supabase
    .from('room_participants')
    .select('room_id, user_id')
    .eq('id', participantId)
    .maybeSingle();

  if (pErr || !participant) {
    throw new Error(pErr?.message ?? 'Participant not found');
  }

  const { data: room } = await supabase
    .from('study_rooms')
    .select('host_id')
    .eq('id', participant.room_id)
    .maybeSingle();

  const isHost = room?.host_id === userId;
  const isOwnParticipant = participant.user_id === userId;
  if (!isHost && !isOwnParticipant) {
    throw new Error('Permission denied');
  }

  const { error } = await supabase
    .from('room_participants')
    .update(updates)
    .eq('id', participantId);

  if (error) {
    throw new Error(error.message);
  }

  return { message: 'Participant updated' };
}

async function apiFetch(url: string, options: RequestInit = {}) {
  const supabase = getSupabaseClient();
  const expectedIssPrefix = `https://${projectId}.supabase.co/auth/v1`;

  const decodeJwtPayload = (value: string) => {
    try {
      const [, payload] = value.split('.');
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
      return null;
    }
  };

  const isUsableJwt = (value: string | null | undefined, minValidityMs = 0) => {
    if (!value) return false;
    const parts = value.split('.');
    if (parts.length !== 3 || parts.some((p) => p.length === 0)) {
      return false;
    }

    const payload = decodeJwtPayload(value);
    const expMs = typeof payload?.exp === 'number' ? payload.exp * 1000 : 0;
    const iss = typeof payload?.iss === 'string' ? payload.iss : '';
    return iss.startsWith(expectedIssPrefix) && expMs > Date.now() + minValidityMs;
  };

  // Prefer the live Supabase session token first.
  const { data: sessionData } = await supabase.auth.getSession();
  let session = sessionData.session;

  // Refresh if session is missing/near-expiry to avoid sending stale JWTs.
  const expiresAtMs = (session?.expires_at ?? 0) * 1000;
  const isExpiredOrNearExpiry = !session || expiresAtMs <= Date.now() + 30_000;
  if (isExpiredOrNearExpiry) {
    const { data: refreshed } = await supabase.auth.refreshSession();
    session = refreshed.session ?? session;
  }

  let token = session?.access_token ?? null;

  // Only fall back to the local cache when it still looks like a valid JWT for this project.
  if (!isUsableJwt(token, 30_000)) {
    const cached = getAccessToken();
    token = isUsableJwt(cached, 30_000) ? cached : null;
  }

  // Keep API token cache aligned with current session.
  if (isUsableJwt(token, 30_000) && token !== getAccessToken()) {
    setAccessToken(token);
  }

  // Do not send requests with stale/invalid cached tokens.
  if (!isUsableJwt(token, 30_000)) {
    setAccessToken(null);
    throw new Error('Authentication expired. Please log in again.');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  } as Record<string, string>;

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If JWT is stale/invalid, refresh from session once and retry.
  if (response.status === 401) {
    let body: any = null;
    try {
      body = await response.clone().json();
    } catch {
      body = null;
    }

    const isInvalidJwt = typeof body?.message === 'string' && body.message.toLowerCase().includes('invalid jwt');
    if (isInvalidJwt) {
      if (token) {
        const { data: verified, error: verifyErr } = await supabase.auth.getUser(token);
        if (!verifyErr && verified?.user) {
          throw new Error('Backend auth verification is misconfigured. Your session token is valid in Supabase Auth, but Edge Function validation rejects it. Check function secrets SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the deployed project.');
        }
      }

      const { data: refreshed } = await supabase.auth.refreshSession();
      const refreshedToken = refreshed.session?.access_token ?? null;
      if (isUsableJwt(refreshedToken, 30_000)) {
        setAccessToken(refreshedToken);
        response = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${refreshedToken}`,
          },
        });
      }
    }
  }

  if (!response.ok) {
    const error = await response.text().catch(() => response.statusText);
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

export const roomAPI = {
  /**
   * Create a new study room
   */
  createRoom: async (request: CreateRoomRequest): Promise<Room> => {
    try {
      return await apiFetch(API_BASE, {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error) {
      if (!shouldFallbackToDirect(error)) throw error;
      return directCreateRoom(request);
    }
  },

  /**
   * Get room details
   */
  getRoom: async (roomId: string): Promise<Room> => {
    const identifier = extractRoomIdentifier(roomId);
    
    // If identifier looks like a room code, use direct Supabase to avoid UUID translation issues
    if (/^STUDY-[A-Z0-9]+$/i.test(identifier)) {
      return directGetRoom(identifier);
    }
    
    try {
      return await apiFetch(`${API_BASE}/${identifier}`, {
        method: 'GET',
      });
    } catch (error) {
      if (!shouldFallbackToDirect(error)) throw error;
      return directGetRoom(identifier);
    }
  },

  /**
   * Get all active rooms
   */
  listRooms: async (): Promise<Room[]> => {
    try {
      return await apiFetch(API_BASE, {
        method: 'GET',
      });
    } catch (error) {
      if (!shouldFallbackToDirect(error)) throw error;
      return directListRooms();
    }
  },

  /**
   * Join a room
   */
  joinRoom: async (roomId: string) => {
    const identifier = extractRoomIdentifier(roomId);
    
    // If identifier looks like a room code, use direct Supabase to avoid UUID translation issues
    if (/^STUDY-[A-Z0-9]+$/i.test(identifier)) {
      return directJoinRoom(identifier);
    }
    
    try {
      return await apiFetch(`${API_BASE}/${identifier}/join`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
    } catch (error) {
      if (!shouldFallbackToDirect(error)) throw error;
      return directJoinRoom(identifier);
    }
  },

  /**
   * Leave a room
   */
  leaveRoom: async (roomId: string) => {
    const identifier = extractRoomIdentifier(roomId);
    
    // If identifier looks like a room code, use direct Supabase to avoid UUID translation issues
    if (/^STUDY-[A-Z0-9]+$/i.test(identifier)) {
      return directLeaveRoom(identifier);
    }
    
    try {
      return await apiFetch(`${API_BASE}/${identifier}/leave`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
    } catch (error) {
      if (!shouldFallbackToDirect(error)) throw error;
      return directLeaveRoom(identifier);
    }
  },

  /**
   * Close a room (host only)
   */
  closeRoom: async (roomId: string) => {
    const identifier = extractRoomIdentifier(roomId);
    
    // If identifier looks like a room code, use direct Supabase to avoid UUID translation issues
    if (/^STUDY-[A-Z0-9]+$/i.test(identifier)) {
      return directCloseRoom(identifier);
    }
    
    try {
      return await apiFetch(`${API_BASE}/${identifier}/close`, {
        method: 'PUT',
        body: JSON.stringify({}),
      });
    } catch (error) {
      if (!shouldFallbackToDirect(error)) throw error;
      return directCloseRoom(identifier);
    }
  },

  /**
   * Update participant settings
   */
  updateParticipant: async (
    participantId: string,
    updates: {
      is_pinned?: boolean;
      is_muted?: boolean;
      is_video_off?: boolean;
      permissions?: string;
    }
  ) => {
    try {
      return await apiFetch(
        `${BASE_URL}/participants/${participantId}`,
        {
          method: 'PUT',
          body: JSON.stringify(updates),
        }
      );
    } catch (error) {
      if (!shouldFallbackToDirect(error)) throw error;
      return directUpdateParticipant(participantId, updates);
    }
  },
};
