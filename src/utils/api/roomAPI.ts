/**
 * Study Room API client.
 * All room data mutations go through Lernova_API; the browser only reads the
 * Supabase auth session so it can attach the user's JWT to API requests.
 */

import { BASE_URL, getAccessToken, getSupabaseClient, setAccessToken } from '../../app/lib/api';

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
  mode: 'focus' | 'silent' | 'collaborative' | 'live';
  host_id: string;
  subject?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  ends_at?: string;
  description?: string;
  max_participants?: number;
  participant_count?: number;
  password_protected?: boolean;
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

function extractRoomIdentifier(input: string): string {
  const value = input.trim();
  if (!value) return value;

  const roomCodeMatch = value.match(/(?:STUDY|WEBRTC)-[A-Z0-9]+/i);
  if (roomCodeMatch) {
    return roomCodeMatch[0].toUpperCase();
  }

  const slashParts = value.split('/').filter(Boolean);
  return slashParts[slashParts.length - 1] ?? value;
}

function decodeJwtPayload(value: string) {
  try {
    const [, payload] = value.split('.');
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

function isTokenExpired(value: string | null | undefined, minValidityMs = 0): boolean {
  if (!value) return true;
  const parts = value.split('.');
  if (parts.length !== 3) return true;
  try {
    const payload = decodeJwtPayload(value);
    const expMs = typeof payload?.exp === 'number' ? payload.exp * 1000 : 0;
    return expMs <= Date.now() + minValidityMs;
  } catch {
    return true;
  }
}

async function getApiToken(): Promise<string> {
  const supabase = getSupabaseClient();

  // Try to get existing session first
  const { data: sessionData } = await supabase.auth.getSession();
  let session = sessionData.session;

  // Refresh if missing or close to expiry (within 60 seconds)
  const expiresAtMs = (session?.expires_at ?? 0) * 1000;
  if (!session || expiresAtMs <= Date.now() + 60_000) {
    const { data: refreshed } = await supabase.auth.refreshSession();
    if (refreshed.session) {
      session = refreshed.session;
    }
  }

  const token = session?.access_token ?? getAccessToken();

  if (!token || isTokenExpired(token, 0)) {
    setAccessToken(null);
    throw new Error('Authentication expired. Please log in again.');
  }

  setAccessToken(token);
  return token;
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = await getApiToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });

  let body: any = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    let detail = body?.detail;
    let detailMsg: string | undefined;
    if (typeof detail === 'string') {
      detailMsg = detail;
    } else if (Array.isArray(detail)) {
      detailMsg = detail.map((d: any) => d?.msg ?? String(d)).join('; ');
    }
    const message = detailMsg ?? (typeof body?.error === 'string' ? body.error : (body?.error?.message ?? (body?.error ? JSON.stringify(body.error) : undefined))) ?? body?.message ?? `API error ${response.status}`;
    throw new Error(String(message));
  }

  return body as T;
}

export const roomAPI = {
  createRoom: async (request: CreateRoomRequest): Promise<Room> => {
    const normalizedRequest = {
      ...request,
      maxParticipants: Math.min(request.maxParticipants ?? 6, 20),
    };

    return apiFetch<Room>(API_BASE, {
      method: 'POST',
      body: JSON.stringify(normalizedRequest),
    });
  },

  getRoom: async (roomId: string): Promise<Room> => {
    const identifier = extractRoomIdentifier(roomId);
    return apiFetch<Room>(`${API_BASE}/${identifier}`, { method: 'GET' });
  },

  listRooms: async (): Promise<Room[]> => {
    return apiFetch<Room[]>(API_BASE, { method: 'GET' });
  },

  joinRoom: async (roomId: string) => {
    const identifier = extractRoomIdentifier(roomId);
    return apiFetch(`${API_BASE}/${identifier}/join`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  leaveRoom: async (roomId: string) => {
    const identifier = extractRoomIdentifier(roomId);
    return apiFetch(`${API_BASE}/${identifier}/leave`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  closeRoom: async (roomId: string) => {
    const identifier = extractRoomIdentifier(roomId);
    return apiFetch(`${API_BASE}/${identifier}/close`, {
      method: 'PUT',
      body: JSON.stringify({}),
    });
  },

  updateParticipant: async (
    participantId: string,
    updates: {
      is_pinned?: boolean;
      is_muted?: boolean;
      is_video_off?: boolean;
      is_video_enabled?: boolean;
      last_heartbeat?: string;
      connection_state?: 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed';
      permissions?: string;
    }
  ) => {
    return apiFetch(`${BASE_URL}/webrtc/participants/${participantId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  getMyRoomNote: async (roomId: string): Promise<RoomNote> => {
    const identifier = extractRoomIdentifier(roomId);
    return apiFetch<RoomNote>(`${API_BASE}/${identifier}/notes/me`, { method: 'GET' });
  },

  saveMyRoomNote: async (roomId: string, content: string): Promise<RoomNote> => {
    const identifier = extractRoomIdentifier(roomId);
    return apiFetch<RoomNote>(`${API_BASE}/${identifier}/notes/me`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },

  listRoomNotes: async (roomId: string): Promise<RoomNoteEntry[]> => {
    const identifier = extractRoomIdentifier(roomId);
    return apiFetch<RoomNoteEntry[]>(`${API_BASE}/${identifier}/notes`, { method: 'GET' });
  },

  createRoomNote: async (
    roomId: string,
    input: { heading: string; body: string }
  ): Promise<RoomNoteEntry> => {
    const identifier = extractRoomIdentifier(roomId);
    return apiFetch<RoomNoteEntry>(`${API_BASE}/${identifier}/notes`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  updateRoomNote: async (
    roomId: string,
    noteId: string,
    input: { heading: string; body: string }
  ): Promise<RoomNoteEntry> => {
    const identifier = extractRoomIdentifier(roomId);
    return apiFetch<RoomNoteEntry>(`${API_BASE}/${identifier}/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  deleteRoomNote: async (
    roomId: string,
    noteId: string
  ): Promise<{ success: boolean; deleted_note_id: string }> => {
    const identifier = extractRoomIdentifier(roomId);
    return apiFetch<{ success: boolean; deleted_note_id: string }>(
      `${API_BASE}/${identifier}/notes/${noteId}`,
      { method: 'DELETE' }
    );
  },

  getRoomChatMessages: async (roomId: string, limit = 100): Promise<RoomChatMessage[]> => {
    const identifier = extractRoomIdentifier(roomId);
    const boundedLimit = Math.max(1, Math.min(limit, 200));
    return apiFetch<RoomChatMessage[]>(`${API_BASE}/${identifier}/chat?limit=${boundedLimit}`, {
      method: 'GET',
    });
  },

  sendRoomChatMessage: async (roomId: string, message: string): Promise<RoomChatMessage> => {
    const identifier = extractRoomIdentifier(roomId);
    return apiFetch<RoomChatMessage>(`${API_BASE}/${identifier}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};
