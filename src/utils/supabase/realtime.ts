/**
 * Supabase Realtime utilities for Study Rooms
 * Handles subscriptions for presence, messages, and reactions
 */

import { getSupabaseClient } from '../../app/lib/api';

export interface RoomMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  message_type: 'text' | 'image' | 'file' | 'system';
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface RoomReaction {
  id: string;
  room_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface RoomParticipant {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  left_at?: string;
  is_pinned: boolean;
  is_muted: boolean;
  is_video_off: boolean;
  permissions: 'host' | 'moderator' | 'member';
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface StudyRoom {
  id: string;
  code: string;
  name: string;
  mode: 'focus' | 'silent' | 'collaborative' | 'live';
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
}

export interface RoomPresenceUser {
  user_id: string;
  name?: string;
  avatar_url?: string;
  online_at: string;
}

async function loadMessageById(messageId: string): Promise<RoomMessage | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('room_messages')
    .select(`
      *,
      user:users(id, name, avatar_url)
    `)
    .eq('id', messageId)
    .maybeSingle();
  if (error) return null;
  return (data as RoomMessage | null) ?? null;
}

async function loadReactionById(reactionId: string): Promise<RoomReaction | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('room_reactions')
    .select(`
      *,
      user:users(id, name)
    `)
    .eq('id', reactionId)
    .maybeSingle();
  if (error) return null;
  return (data as RoomReaction | null) ?? null;
}

async function loadParticipantById(participantId: string): Promise<RoomParticipant | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('room_participants')
    .select(`
      *,
      user:users(id, name, avatar_url)
    `)
    .eq('id', participantId)
    .maybeSingle();
  if (error) return null;
  return (data as RoomParticipant | null) ?? null;
}

/**
 * Subscribe to room messages with realtime updates
 */
export function subscribeToRoomMessages(
  roomId: string,
  onInsert: (message: RoomMessage) => void,
  onUpdate: (message: RoomMessage) => void,
  onDelete: (message: RoomMessage) => void
) {
  const supabase = getSupabaseClient();

  const subscription = supabase
    .channel(`room_messages:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'room_messages',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        const inserted = payload.new as RoomMessage;
        void loadMessageById(inserted.id).then((full) => {
          onInsert(full ?? inserted);
        });
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'room_messages',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        const updated = payload.new as RoomMessage;
        void loadMessageById(updated.id).then((full) => {
          onUpdate(full ?? updated);
        });
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'room_messages',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        onDelete(payload.old as RoomMessage);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}

/**
 * Subscribe to room reactions with realtime updates
 */
export function subscribeToRoomReactions(
  roomId: string,
  onInsert: (reaction: RoomReaction) => void,
  onDelete: (reaction: RoomReaction) => void
) {
  const supabase = getSupabaseClient();

  console.log(`[Realtime] Subscribing to reactions for room: ${roomId}`);

  const subscription = supabase
    .channel(`room_reactions:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'room_reactions',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        console.log('[Realtime] INSERT reaction event received:', payload);
        const inserted = payload.new as RoomReaction;
        void loadReactionById(inserted.id).then((full) => {
          console.log('[Realtime] Loaded full reaction:', full);
          onInsert(full ?? inserted);
        });
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'room_reactions',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        console.log('[Realtime] DELETE reaction event received:', payload);
        onDelete(payload.old as RoomReaction);
      }
    )
    .subscribe((status) => {
      console.log(`[Realtime] Subscription status for reactions: ${status}`);
    });

  return () => {
    console.log(`[Realtime] Unsubscribing from reactions for room: ${roomId}`);
    supabase.removeChannel(subscription);
  };
}

/**
 * Subscribe to room participants (presence) with realtime updates
 */
export function subscribeToRoomParticipants(
  roomId: string,
  onInsert: (participant: RoomParticipant) => void,
  onUpdate: (participant: RoomParticipant) => void,
  onDelete: (participant: RoomParticipant) => void
) {
  const supabase = getSupabaseClient();

  const subscription = supabase
    .channel(`room_participants:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'room_participants',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        const inserted = payload.new as RoomParticipant;
        void loadParticipantById(inserted.id).then((full) => {
          onInsert(full ?? inserted);
        });
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'room_participants',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        const updated = payload.new as RoomParticipant;
        void loadParticipantById(updated.id).then((full) => {
          onUpdate(full ?? updated);
        });
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'room_participants',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        onDelete(payload.old as RoomParticipant);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}

/**
 * Subscribe to room updates (e.g., room closed, mode changed)
 */
export function subscribeToRoomUpdates(
  roomId: string,
  onUpdate: (room: StudyRoom) => void
) {
  const supabase = getSupabaseClient();

  const subscription = supabase
    .channel(`study_rooms:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'study_rooms',
        filter: `id=eq.${roomId}`,
      },
      (payload) => {
        onUpdate(payload.new as StudyRoom);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}

/**
 * Subscribe to ephemeral online presence (who is currently connected to this room).
 */
export function subscribeToRoomPresence(
  roomId: string,
  currentUser: RoomPresenceUser,
  onSync: (onlineUsers: RoomPresenceUser[]) => void
) {
  const supabase = getSupabaseClient();
  const channel = supabase.channel(`room_presence:${roomId}`, {
    config: {
      presence: {
        key: currentUser.user_id,
      },
    },
  });

  const emitPresenceSnapshot = () => {
    const state = channel.presenceState<RoomPresenceUser>();
    const flattened = Object.values(state).flat();
    const byUserId = new Map<string, RoomPresenceUser>();

    for (const entry of flattened) {
      const previous = byUserId.get(entry.user_id);
      if (!previous || previous.online_at < entry.online_at) {
        byUserId.set(entry.user_id, entry);
      }
    }

    onSync(Array.from(byUserId.values()));
  };

  channel
    .on('presence', { event: 'sync' }, emitPresenceSnapshot)
    .on('presence', { event: 'join' }, emitPresenceSnapshot)
    .on('presence', { event: 'leave' }, emitPresenceSnapshot)
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        void channel.track(currentUser);
      }
    });

  return () => {
    void channel.untrack();
    supabase.removeChannel(channel);
  };
}
