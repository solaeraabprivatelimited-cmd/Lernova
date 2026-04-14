/**
 * Study Room API client
 * Wrapper around backend endpoints
 */

import { BASE_URL, getAccessToken, getSupabaseClient, setAccessToken } from '../../app/lib/api';
import { projectId } from '/utils/supabase/info';

const API_BASE = `${BASE_URL}/webrtc/rooms`;

interface CreateRoomRequest {
  name: string;
  mode?: 'focus' | 'silent' | 'collaborative' | 'live';
  subject?: string;
  description?: string;
  maxParticipants?: number;
}

export interface RoomParticipant {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string | null;
  connection_state?: string;
  disconnected_at?: string | null;
  is_audio_enabled?: boolean;
  is_video_enabled?: boolean;
  is_muted?: boolean;
  is_screen_sharing?: boolean;
  permissions: string;
  joined_at?: string;
  last_heartbeat?: string | null;
}

export interface Room {
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
  participants?: RoomParticipant[];
}

export interface RoomNote {
  id: string | null;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface RoomNoteEntry {
  id: string;
  room_id: string;
  user_id: string;
  heading: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface RoomChatMessage {
  id: string;
  room_id: string;
  sender_user_id: string;
  message: string;
  created_at: string;
  sender?: {
    id: string;
    name: string;
    avatar_url?: string | null;
  };
}

function normalizeRoomIdentifier(identifier: string): string {
  return identifier.trim();
}

function extractRoomIdentifier(input: string): string {
  const value = normalizeRoomIdentifier(input);
  if (!value) return value;

  const roomCodeMatch = value.match(/(?:STUDY|WEBRTC)-[A-Z0-9]+/i);
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
    .from('profiles')
    .upsert({
      id: user.id,
      name: user.name,
      avatar_url: user.avatar_url,
      role: user.role === 'mentor' ? 'mentor' : 'student',
    }, { onConflict: 'id' });

  if (error) {
    throw new Error(`Unable to sync user record for room operations: ${error.message}`);
  }

  return user.id;
}

function generateRoomCode(): string {
  return `STUDY-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function directCreateRoom(request: CreateRoomRequest): Promise<Room> {
  const supabase = getSupabaseClient();
  const userId = await ensureRelationalUserRow();

  const name = request.name.trim();
  if (!name) {
    throw new Error('Room name is required');
  }

  const subject = request.subject?.trim() ?? null;
  const description = request.description?.trim() ?? null;

  const maxParticipants = request.maxParticipants ?? 6;
  if (maxParticipants < 2 || maxParticipants > 20) {
    throw new Error('Max participants must be between 2 and 20');
  }

  const { data, error } = await supabase
    .from('webrtc_rooms')
    .insert({
      code: generateRoomCode(),
      name,
      mode: request.mode ?? 'collaborative',
      host_id: userId,
      subject,
      description,
      max_participants: maxParticipants,
      is_active: true,
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to create room');
  }

  const { error: participantErr } = await supabase.from('webrtc_participants').insert({
    room_id: data.id,
    user_id: userId,
    permissions: 'host',
    connection_state: 'connected',
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
  const isRoomCode = /^(?:STUDY|WEBRTC)-[A-Z0-9]+$/i.test(identifier);
  
  let roomMatch;
  let roomMatchError;
  
  if (isRoomCode) {
    // Query by code only
    const result = await supabase
      .from('webrtc_rooms')
      .select('id')
      .eq('code', identifier.toUpperCase())
      .maybeSingle();
    roomMatch = result.data;
    roomMatchError = result.error;
  } else {
    // Query by UUID
    const result = await supabase
      .from('webrtc_rooms')
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
    .from('webrtc_rooms')
    .select(`
      *,
      participants:webrtc_participants(
        id, user_id, is_pinned, is_muted, is_video_enabled, permissions,
        connection_state, is_audio_enabled, is_screen_sharing, joined_at,
        disconnected_at, last_heartbeat
      )
    `)
    .eq('id', roomMatch.id)
    .maybeSingle();

  if (error || !data) {
    throw new Error(error?.message ?? 'Room not found');
  }

  const participants = Array.isArray(data.participants) ? data.participants : [];
  const userIds = Array.from(
    new Set(
      participants
        .map((participant) => participant.user_id)
        .filter((id): id is string => typeof id === 'string' && id.length > 0)
    )
  );

  let userMap = new Map<string, { name: string; avatar_url: string | null }>();
  if (userIds.length > 0) {
    const { data: users } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .in('id', userIds);

    if (Array.isArray(users)) {
      userMap = new Map(
        users.map((user: { id: string; name?: string; avatar_url?: string | null }) => [
          user.id,
          {
            name: user.name || 'Participant',
            avatar_url: user.avatar_url ?? null,
          },
        ])
      );
    }
  }

  const enrichedParticipants = participants.map((participant) => {
    const linkedUser = userMap.get(participant.user_id);
    const fallbackName =
      typeof participant.user_id === 'string' && participant.user_id.length > 0
        ? participant.user_id.slice(0, 8)
        : 'Participant';
    return {
      ...participant,
      display_name: linkedUser?.name || fallbackName,
      avatar_url: linkedUser?.avatar_url ?? null,
    };
  });

  return {
    ...(data as Room),
    participants: enrichedParticipants,
  };
}

async function directListRooms(): Promise<Room[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('webrtc_rooms')
    .select(`
      *,
      participants:webrtc_participants(id, connection_state)
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
  const maxParticipants = Math.min(room.max_participants ?? 20, 20);
  const nowIso = new Date().toISOString();
  const freshnessWindowMs = 40_000;
  const nowMs = Date.now();

  const { data: activeByUserRows, error: activeByUserError } = await supabase
    .from('webrtc_participants')
    .select('id, room_id, last_heartbeat, joined_at')
    .eq('user_id', userId)
    .is('disconnected_at', null);

  if (activeByUserError) {
    throw new Error(activeByUserError.message);
  }

  const staleUserParticipantIds: string[] = [];
  const freshActiveUserRows = (activeByUserRows ?? []).filter(
    (participant: {
      id: string;
      room_id: string;
      last_heartbeat?: string | null;
      joined_at?: string | null;
    }) => {
      const heartbeatMs = participant.last_heartbeat ? Date.parse(participant.last_heartbeat) : 0;
      const joinedMs = participant.joined_at ? Date.parse(participant.joined_at) : 0;
      const latestActivityMs = Math.max(heartbeatMs, joinedMs);
      const isFresh = latestActivityMs > nowMs - freshnessWindowMs;
      if (!isFresh) {
        staleUserParticipantIds.push(participant.id);
      }
      return isFresh;
    }
  );

  if (staleUserParticipantIds.length > 0) {
    await supabase
      .from('webrtc_participants')
      .update({ disconnected_at: nowIso, connection_state: 'disconnected' })
      .in('id', staleUserParticipantIds);
  }

  const sameRoomSession = freshActiveUserRows.find((participant) => participant.room_id === room.id);
  if (sameRoomSession) {
    throw new Error('ALREADY_JOINED_THIS_ROOM: You are already active in this room.');
  }

  const otherRoomSession = freshActiveUserRows.find((participant) => participant.room_id !== room.id);
  if (otherRoomSession) {
    throw new Error('ALREADY_IN_ANOTHER_ROOM: Leave your current room before joining another one.');
  }

  const { data: existingRows, error: existingError } = await supabase
    .from('webrtc_participants')
    .select('id, disconnected_at')
    .eq('room_id', room.id)
    .eq('user_id', userId)
    .order('joined_at', { ascending: false })
    .limit(1);

  if (existingError) {
    throw new Error(existingError.message);
  }

  const existing = existingRows?.[0];

  if (existing?.disconnected_at === null) {
    throw new Error('ALREADY_JOINED_THIS_ROOM: You are already active in this room.');
  }

  if (existing?.id) {
    const { data: rejoined, error: rejoinError } = await supabase
      .from('webrtc_participants')
      .update({
        disconnected_at: null,
        left_at: null,
        connection_state: 'connecting',
        last_heartbeat: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select('*')
      .single();

    if (rejoinError) {
      throw new Error(rejoinError.message);
    }

    return rejoined;
  }

  const activeParticipantCount =
    room.participants?.filter((participant) => participant.disconnected_at == null).length ?? 0;

  if (activeParticipantCount >= maxParticipants) {
    throw new Error('Room is full. Study rooms currently support up to 20 members.');
  }

  const { data, error } = await supabase
    .from('webrtc_participants')
    .insert({
      room_id: room.id,
      user_id: userId,
      permissions: 'member',
      connection_state: 'connecting',
    })
    .select('*')
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('ALREADY_IN_ANOTHER_ROOM: Leave your current room before joining another one.');
    }
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
    .from('webrtc_participants')
    .update({ disconnected_at: now, connection_state: 'disconnected' })
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
    .from('webrtc_rooms')
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
    .from('webrtc_rooms')
    .update({ is_active: false, closed_at: new Date().toISOString() })
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
    is_video_enabled?: boolean;
    is_video_off?: boolean;
    permissions?: string;
  }
) {
  const supabase = getSupabaseClient();
  const userId = await getAuthUserId();

  const { data: participant, error: pErr } = await supabase
    .from('webrtc_participants')
    .select('room_id, user_id')
    .eq('id', participantId)
    .maybeSingle();

  if (pErr || !participant) {
    throw new Error(pErr?.message ?? 'Participant not found');
  }

  const { data: room } = await supabase
    .from('webrtc_rooms')
    .select('host_id')
    .eq('id', participant.room_id)
    .maybeSingle();

  const isHost = room?.host_id === userId;
  const isOwnParticipant = participant.user_id === userId;
  if (!isHost && !isOwnParticipant) {
    throw new Error('Permission denied');
  }

  const normalizedUpdates: Record<string, unknown> = { ...updates };
  if (updates.is_video_enabled === undefined && updates.is_video_off !== undefined) {
    normalizedUpdates.is_video_enabled = !updates.is_video_off;
  }
  delete normalizedUpdates.is_video_off;

  const { error } = await supabase
    .from('webrtc_participants')
    .update(normalizedUpdates)
    .eq('id', participantId);

  if (error) {
    throw new Error(error.message);
  }

  return { message: 'Participant updated' };
}

async function ensureDirectRoomMembership(roomIdentifier: string, userId: string) {
  const supabase = getSupabaseClient();
  const room = await directGetRoom(roomIdentifier);
  const { data: membership, error } = await supabase
    .from('webrtc_participants')
    .select('id')
    .eq('room_id', room.id)
    .eq('user_id', userId)
    .is('disconnected_at', null)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!membership?.id) {
    throw new Error('ROOM_ACCESS_DENIED: Join the room before accessing notes.');
  }

  return room.id;
}

async function directListRoomNotes(roomId: string): Promise<RoomNoteEntry[]> {
  const supabase = getSupabaseClient();
  const userId = await getAuthUserId();
  const resolvedRoomId = await ensureDirectRoomMembership(roomId, userId);

  const { data, error } = await supabase
    .from('webrtc_room_note_entries')
    .select('id, room_id, user_id, heading, body, created_at, updated_at')
    .eq('room_id', resolvedRoomId)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as RoomNoteEntry[];
}

async function directCreateRoomNote(
  roomId: string,
  input: { heading: string; body: string }
): Promise<RoomNoteEntry> {
  const supabase = getSupabaseClient();
  const userId = await getAuthUserId();
  const resolvedRoomId = await ensureDirectRoomMembership(roomId, userId);
  const heading = input.heading.trim() || 'Untitled note';
  const body = input.body ?? '';

  const { data, error } = await supabase
    .from('webrtc_room_note_entries')
    .insert({
      room_id: resolvedRoomId,
      user_id: userId,
      heading,
      body,
      updated_at: new Date().toISOString(),
    })
    .select('id, room_id, user_id, heading, body, created_at, updated_at')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to create note');
  }

  return data as RoomNoteEntry;
}

async function directUpdateRoomNote(
  roomId: string,
  noteId: string,
  input: { heading: string; body: string }
): Promise<RoomNoteEntry> {
  const supabase = getSupabaseClient();
  const userId = await getAuthUserId();
  const resolvedRoomId = await ensureDirectRoomMembership(roomId, userId);
  const heading = input.heading.trim() || 'Untitled note';
  const body = input.body ?? '';

  const { data, error } = await supabase
    .from('webrtc_room_note_entries')
    .update({
      heading,
      body,
      updated_at: new Date().toISOString(),
    })
    .eq('id', noteId)
    .eq('room_id', resolvedRoomId)
    .eq('user_id', userId)
    .select('id, room_id, user_id, heading, body, created_at, updated_at')
    .maybeSingle();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to update note');
  }

  return data as RoomNoteEntry;
}

async function directDeleteRoomNote(roomId: string, noteId: string): Promise<{ success: boolean; deleted_note_id: string }> {
  const supabase = getSupabaseClient();
  const userId = await getAuthUserId();
  const resolvedRoomId = await ensureDirectRoomMembership(roomId, userId);

  const { data, error } = await supabase
    .from('webrtc_room_note_entries')
    .delete()
    .eq('id', noteId)
    .eq('room_id', resolvedRoomId)
    .eq('user_id', userId)
    .select('id');

  if (error) {
    throw new Error(error.message);
  }
  if (!data?.length) {
    throw new Error('Note not found');
  }

  return { success: true, deleted_note_id: noteId };
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
    const normalizedRequest = {
      ...request,
      maxParticipants: Math.min(request.maxParticipants ?? 6, 20),
    };

    try {
      return await apiFetch(API_BASE, {
        method: 'POST',
        body: JSON.stringify(normalizedRequest),
      });
    } catch (error) {
      if (!shouldFallbackToDirect(error)) throw error;
      return directCreateRoom(normalizedRequest);
    }
  },

  /**
   * Get room details
   */
  getRoom: async (roomId: string): Promise<Room> => {
    const identifier = extractRoomIdentifier(roomId);
    
    // If identifier looks like a room code, use direct Supabase to avoid UUID translation issues
    if (/^(?:STUDY|WEBRTC)-[A-Z0-9]+$/i.test(identifier)) {
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
    if (/^(?:STUDY|WEBRTC)-[A-Z0-9]+$/i.test(identifier)) {
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
    if (/^(?:STUDY|WEBRTC)-[A-Z0-9]+$/i.test(identifier)) {
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
    if (/^(?:STUDY|WEBRTC)-[A-Z0-9]+$/i.test(identifier)) {
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
      last_heartbeat?: string;
      connection_state?: 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed';
      permissions?: string;
    }
  ) => {
    try {
      return await apiFetch(
        `${BASE_URL}/webrtc/participants/${participantId}`,
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

  getMyRoomNote: async (roomId: string): Promise<RoomNote> => {
    const identifier = extractRoomIdentifier(roomId);
    return apiFetch(`${API_BASE}/${identifier}/notes/me`, {
      method: 'GET',
    });
  },

  saveMyRoomNote: async (roomId: string, content: string): Promise<RoomNote> => {
    const identifier = extractRoomIdentifier(roomId);
    return apiFetch(`${API_BASE}/${identifier}/notes/me`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },

  listRoomNotes: async (roomId: string): Promise<RoomNoteEntry[]> => {
    const identifier = extractRoomIdentifier(roomId);
    try {
      return await apiFetch(`${API_BASE}/${identifier}/notes`, {
        method: 'GET',
      });
    } catch (error) {
      if (!shouldFallbackToDirect(error)) throw error;
      return directListRoomNotes(identifier);
    }
  },

  createRoomNote: async (
    roomId: string,
    input: { heading: string; body: string }
  ): Promise<RoomNoteEntry> => {
    const identifier = extractRoomIdentifier(roomId);
    try {
      return await apiFetch(`${API_BASE}/${identifier}/notes`, {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch (error) {
      if (!shouldFallbackToDirect(error)) throw error;
      return directCreateRoomNote(identifier, input);
    }
  },

  updateRoomNote: async (
    roomId: string,
    noteId: string,
    input: { heading: string; body: string }
  ): Promise<RoomNoteEntry> => {
    const identifier = extractRoomIdentifier(roomId);
    try {
      return await apiFetch(`${API_BASE}/${identifier}/notes/${noteId}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      });
    } catch (error) {
      if (!shouldFallbackToDirect(error)) throw error;
      return directUpdateRoomNote(identifier, noteId, input);
    }
  },

  deleteRoomNote: async (roomId: string, noteId: string): Promise<{ success: boolean; deleted_note_id: string }> => {
    const identifier = extractRoomIdentifier(roomId);
    try {
      return await apiFetch(`${API_BASE}/${identifier}/notes/${noteId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      if (!shouldFallbackToDirect(error)) throw error;
      return directDeleteRoomNote(identifier, noteId);
    }
  },

  getRoomChatMessages: async (
    roomId: string,
    limit = 100
  ): Promise<RoomChatMessage[]> => {
    const identifier = extractRoomIdentifier(roomId);
    const boundedLimit = Math.max(1, Math.min(limit, 200));
    return apiFetch(`${API_BASE}/${identifier}/chat?limit=${boundedLimit}`, {
      method: 'GET',
    });
  },

  sendRoomChatMessage: async (
    roomId: string,
    message: string
  ): Promise<RoomChatMessage> => {
    const identifier = extractRoomIdentifier(roomId);
    return apiFetch(`${API_BASE}/${identifier}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};
