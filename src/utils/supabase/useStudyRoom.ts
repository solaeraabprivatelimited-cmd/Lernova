/**
 * React hook for managing Study Room state with realtime subscriptions
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getSupabaseClient } from '../../app/lib/api';
import {
  subscribeToRoomMessages,
  subscribeToRoomParticipants,
  subscribeToRoomPresence,
  subscribeToRoomReactions,
  subscribeToRoomUpdates,
  RoomMessage,
  RoomParticipant,
  RoomPresenceUser,
  RoomReaction,
  StudyRoom,
} from './realtime';

interface UseStudyRoomOptions {
  roomId: string;
  userId: string;
  onError?: (error: Error) => void;
}

export function useStudyRoom({ roomId, userId, onError }: UseStudyRoomOptions) {
  const supabase = getSupabaseClient();
  const participantIdRef = useRef<string | null>(null);
  
  // State
  const [room, setRoom] = useState<StudyRoom | null>(null);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [reactions, setReactions] = useState<RoomReaction[]>([]);
  const [presenceUsers, setPresenceUsers] = useState<RoomPresenceUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const upsertById = useCallback(<T extends { id: string }>(prev: T[], next: T): T[] => {
    const existingIdx = prev.findIndex((item) => item.id === next.id);
    if (existingIdx === -1) {
      return [...prev, next];
    }

    const cloned = [...prev];
    cloned[existingIdx] = next;
    return cloned;
  }, []);

  const ensureActiveParticipant = useCallback(async (): Promise<string> => {
    const { data: activeParticipant, error: activeErr } = await supabase
      .from('room_participants')
      .select('id')
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .is('left_at', null)
      .maybeSingle();

    if (activeErr) {
      throw activeErr;
    }
    if (activeParticipant?.id) {
      return activeParticipant.id;
    }

    const { data: previousParticipant, error: previousErr } = await supabase
      .from('room_participants')
      .select('id, permissions')
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .order('joined_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (previousErr) {
      throw previousErr;
    }

    if (previousParticipant?.id) {
      const { error: reactivateErr } = await supabase
        .from('room_participants')
        .update({
          left_at: null,
          joined_at: new Date().toISOString(),
          permissions: previousParticipant.permissions ?? 'member',
        })
        .eq('id', previousParticipant.id);

      if (reactivateErr) {
        throw reactivateErr;
      }

      return previousParticipant.id;
    }

    const { data: inserted, error: joinErr } = await supabase
      .from('room_participants')
      .insert({
        room_id: roomId,
        user_id: userId,
        permissions: 'member',
      })
      .select('id')
      .single();

    if (joinErr || !inserted?.id) {
      throw joinErr ?? new Error('Unable to join room as participant');
    }

    return inserted.id;
  }, [roomId, supabase, userId]);

  const markCurrentUserLeft = useCallback(async () => {
    const participantId = participantIdRef.current;
    const now = new Date().toISOString();

    if (participantId) {
      await supabase
        .from('room_participants')
        .update({ left_at: now })
        .eq('id', participantId)
        .is('left_at', null);
      return;
    }

    await supabase
      .from('room_participants')
      .update({ left_at: now })
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .is('left_at', null);
  }, [roomId, supabase, userId]);

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      participantIdRef.current = await ensureActiveParticipant();
      
      // Fetch room details
      const { data: roomData, error: roomErr } = await supabase
        .from('study_rooms')
        .select(`
          *,
          host:users(id, name, avatar_url)
        `)
        .eq('id', roomId)
        .maybeSingle();

      if (roomErr) throw roomErr;
      if (roomData) setRoom(roomData as StudyRoom);

      // Fetch messages
      const { data: messagesData, error: messagesErr } = await supabase
        .from('room_messages')
        .select(`
          *,
          user:users(id, name, avatar_url)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (messagesErr) throw messagesErr;
      setMessages((messagesData || []) as RoomMessage[]);

      // Fetch participants
      const { data: participantsData, error: participantsErr } = await supabase
        .from('room_participants')
        .select(`
          *,
          user:users(id, name, avatar_url)
        `)
        .eq('room_id', roomId)
        .is('left_at', null)
        .order('joined_at', { ascending: true });

      if (participantsErr) throw participantsErr;
      setParticipants((participantsData || []) as RoomParticipant[]);

      // Fetch reactions
      const { data: reactionsData, error: reactionsErr } = await supabase
        .from('room_reactions')
        .select(`
          *,
          user:users(id, name)
        `)
        .eq('room_id', roomId);

      if (reactionsErr) throw reactionsErr;
      setReactions((reactionsData || []) as RoomReaction[]);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [ensureActiveParticipant, roomId, supabase, onError]);

  // Subscribe to realtime updates
  useEffect(() => {
    fetchInitialData();

    const unsubscribes: (() => void)[] = [];

    // Subscribe to messages
    unsubscribes.push(
      subscribeToRoomMessages(
        roomId,
        (newMessage) => {
          setMessages((prev) => {
            const merged = upsertById(prev, newMessage);
            return merged.sort((a, b) =>
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
          });
        },
        (updatedMessage) => {
          setMessages((prev) => upsertById(prev, updatedMessage));
        },
        (deletedMessage) => {
          setMessages((prev) => prev.filter((m) => m.id !== deletedMessage.id));
        }
      )
    );

    // Subscribe to participants
    unsubscribes.push(
      subscribeToRoomParticipants(
        roomId,
        (newParticipant) => {
          setParticipants((prev) => upsertById(prev, newParticipant));
        },
        (updatedParticipant) => {
          setParticipants((prev) => upsertById(prev, updatedParticipant));
        },
        (deletedParticipant) => {
          setParticipants((prev) => prev.filter((p) => p.id !== deletedParticipant.id));
        }
      )
    );

    // Subscribe to reactions
    unsubscribes.push(
      subscribeToRoomReactions(
        roomId,
        (newReaction) => {
          setReactions((prev) => upsertById(prev, newReaction));
        },
        (deletedReaction) => {
          setReactions((prev) => prev.filter((r) => r.id !== deletedReaction.id));
        }
      )
    );

    unsubscribes.push(
      subscribeToRoomPresence(
        roomId,
        {
          user_id: userId,
          online_at: new Date().toISOString(),
        },
        (onlineUsers) => {
          setPresenceUsers(onlineUsers);
        }
      )
    );

    // Subscribe to room updates
    unsubscribes.push(
      subscribeToRoomUpdates(
        roomId,
        (updatedRoom) => {
          setRoom(updatedRoom);
        }
      )
    );

    return () => {
      unsubscribes.forEach((unsub) => unsub());
      void markCurrentUserLeft();
    };
  }, [roomId, userId, fetchInitialData, markCurrentUserLeft, upsertById]);

  // Action handlers
  const sendMessage = useCallback(
    async (content: string) => {
      try {
        const trimmedContent = content.trim();
        if (!trimmedContent) {
          return;
        }

        const { error } = await supabase.from('room_messages').insert({
          room_id: roomId,
          user_id: userId,
          content: trimmedContent,
          message_type: 'text',
        });
        if (error) throw error;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
        throw error;
      }
    },
    [roomId, userId, supabase, onError]
  );

  const removeReaction = useCallback(
    async (reactionId: string) => {
      try {
        const { error } = await supabase
          .from('room_reactions')
          .delete()
          .eq('id', reactionId);
        if (error) throw error;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      }
    },
    [supabase, onError]
  );

  const addReaction = useCallback(
    async (emoji: string) => {
      try {
        console.log('[addReaction] Starting...', { emoji, roomId, userId });
        
        const existing = reactions.find((reaction) => reaction.user_id === userId && reaction.emoji === emoji);
        if (existing) {
          console.log('[addReaction] User already has this reaction, removing it');
          await removeReaction(existing.id);
          return;
        }

        console.log('[addReaction] Inserting reaction into DB');
        const { data, error } = await supabase.from('room_reactions').insert({
          room_id: roomId,
          user_id: userId,
          emoji,
        });
        
        console.log('[addReaction] Insert response:', { data, error });
        
        if (error) {
          console.error('[addReaction] Error inserting reaction:', error);
          if ((error as { code?: string }).code === '23505') {
            console.log('[addReaction] Unique constraint violation, ignoring');
            return;
          }
          throw error;
        }
        
        console.log('[addReaction] Reaction inserted successfully');
      } catch (err) {
        console.error('[addReaction] Exception caught:', err);
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
        throw error;
      }
    },
    [reactions, removeReaction, roomId, userId, supabase, onError]
  );

  const updateParticipant = useCallback(
    async (participantId: string, updates: Partial<RoomParticipant>) => {
      try {
        const { error } = await supabase
          .from('room_participants')
          .update(updates)
          .eq('id', participantId);
        if (error) throw error;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      }
    },
    [supabase, onError]
  );

  const removeParticipant = useCallback(
    async (participantId: string) => {
      try {
        const now = new Date().toISOString();
        const { error } = await supabase
          .from('room_participants')
          .update({ left_at: now })
          .eq('id', participantId);
        if (error) throw error;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      }
    },
    [supabase, onError]
  );

  const getActiveParticipants = useCallback(() => {
    const onlineIds = new Set(presenceUsers.map((presenceUser) => presenceUser.user_id));

    return participants.filter((participant) => {
      if (participant.left_at) {
        return false;
      }

      if (onlineIds.size === 0) {
        return true;
      }

      return onlineIds.has(participant.user_id);
    });
  }, [participants, presenceUsers]);

  return {
    // State
    room,
    messages,
    participants,
    reactions,
    loading,
    error,
    activeParticipants: getActiveParticipants(),

    // Actions
    sendMessage,
    addReaction,
    removeReaction,
    updateParticipant,
    removeParticipant,
    refetch: fetchInitialData,
  };
}
