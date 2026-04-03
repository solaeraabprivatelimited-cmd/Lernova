/**
 * React hook for managing room notes with auto-save
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getSupabaseClient } from '../../app/lib/api';

export interface RoomNote {
  id: string;
  user_id: string;
  room_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  is_shared: boolean;
}

interface UseRoomNotesOptions {
  roomId: string;
  userId: string;
  onError?: (error: Error) => void;
}

const AUTO_SAVE_DELAY = 1000; // Save after 1 second of inactivity

export function useRoomNotes({ roomId, userId, onError }: UseRoomNotesOptions) {
  const supabase = getSupabaseClient();
  const [notes, setNotes] = useState<RoomNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const pendingSavesRef = useRef<Set<string>>(new Set());

  // Load notes on mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchErr } = await supabase
          .from('notes')
          .select('*')
          .eq('room_id', roomId)
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (fetchErr) throw fetchErr;

        setNotes((data as RoomNote[]) || []);
        console.log('[useRoomNotes] Loaded notes:', data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [roomId, userId, supabase, onError]);

  // Fetch notes for the room (for manual refetch)
  const fetchRoomNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from('notes')
        .select('*')
        .eq('room_id', roomId)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (fetchErr) throw fetchErr;

      setNotes((data as RoomNote[]) || []);
      console.log('[useRoomNotes] Loaded notes:', data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [roomId, userId, supabase, onError]);

  // Create a new note
  const createNote = useCallback(
    async (title: string = 'Untitled', content: string = '') => {
      try {
        const { data, error: insertErr } = await supabase
          .from('notes')
          .insert({
            room_id: roomId,
            user_id: userId,
            title,
            content,
            is_shared: false,
            is_pinned: false,
          })
          .select()
          .single();

        if (insertErr) throw insertErr;

        setNotes((prev) => [data as RoomNote, ...prev]);
        return data as RoomNote;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
        throw error;
      }
    },
    [roomId, userId, supabase, onError]
  );

  // Auto-save note with debouncing
  const autoSaveNote = useCallback(
    (noteId: string, updates: Partial<RoomNote>) => {
      // Clear existing timer for this note
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Mark as pending
      pendingSavesRef.current.add(noteId);

      // Set new timer
      autoSaveTimerRef.current = setTimeout(async () => {
        try {
          console.log('[useRoomNotes] Auto-saving note:', { noteId, updates });

          const { error: updateErr } = await supabase
            .from('notes')
            .update({
              ...updates,
              updated_at: new Date().toISOString(),
            })
            .eq('id', noteId);

          if (updateErr) throw updateErr;

          // Update local state
          setNotes((prev) =>
            prev.map((note) =>
              note.id === noteId
                ? { ...note, ...updates, updated_at: new Date().toISOString() }
                : note
            )
          );

          console.log('[useRoomNotes] Auto-saved successfully');

          // Remove from pending
          pendingSavesRef.current.delete(noteId);
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          console.error('[useRoomNotes] Auto-save failed:', error);
          setError(error);
          onError?.(error);
        }
      }, AUTO_SAVE_DELAY);
    },
    [supabase, onError]
  );

  // Update note content (with auto-save)
  const updateNoteContent = useCallback(
    (noteId: string, content: string) => {
      // Update local state immediately for better UX
      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteId ? { ...note, content } : note
        )
      );

      // Auto-save after delay
      autoSaveNote(noteId, { content });
    },
    [autoSaveNote]
  );

  // Update note title (with auto-save)
  const updateNoteTitle = useCallback(
    (noteId: string, title: string) => {
      // Update local state immediately
      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteId ? { ...note, title } : note
        )
      );

      // Auto-save after delay
      autoSaveNote(noteId, { title });
    },
    [autoSaveNote]
  );

  // Toggle pin status
  const togglePinNote = useCallback(
    async (noteId: string, isPinned: boolean) => {
      try {
        const { error: updateErr } = await supabase
          .from('notes')
          .update({ is_pinned: isPinned })
          .eq('id', noteId);

        if (updateErr) throw updateErr;

        setNotes((prev) =>
          prev.map((note) =>
            note.id === noteId ? { ...note, is_pinned: isPinned } : note
          )
        );
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      }
    },
    [supabase, onError]
  );

  // Toggle share status
  const toggleShareNote = useCallback(
    async (noteId: string, isShared: boolean) => {
      try {
        const { error: updateErr } = await supabase
          .from('notes')
          .update({ is_shared: isShared })
          .eq('id', noteId);

        if (updateErr) throw updateErr;

        setNotes((prev) =>
          prev.map((note) =>
            note.id === noteId ? { ...note, is_shared: isShared } : note
          )
        );
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      }
    },
    [supabase, onError]
  );

  // Delete note
  const deleteNote = useCallback(
    async (noteId: string) => {
      try {
        const { error: deleteErr } = await supabase
          .from('notes')
          .delete()
          .eq('id', noteId);

        if (deleteErr) throw deleteErr;

        setNotes((prev) => prev.filter((note) => note.id !== noteId));
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      }
    },
    [supabase, onError]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNoteContent,
    updateNoteTitle,
    togglePinNote,
    toggleShareNote,
    deleteNote,
    refetch: fetchRoomNotes,
    hasPendingSaves: pendingSavesRef.current.size > 0,
  };
}
