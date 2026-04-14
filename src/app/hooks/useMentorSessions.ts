import { useEffect, useState } from 'react';
import { mentorSessionRooms, getCurrentUser } from '@/app/lib/api';

export interface MentorSessionInfo {
  roomId: string;
  bookingId: string;
  mentorName?: string;
  studentName?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  scheduledStart: string;
  scheduledEnd: string;
  isMentor: boolean;
  isStudent: boolean;
  roomName: string;
}

/**
 * Hook to fetch active mentor sessions for current user
 * Refreshes every 10 seconds to detect new sessions or status changes
 */
export function useMentorSessions(autoRefresh = true) {
  const [sessions, setSessions] = useState<MentorSessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        setSessions([]);
        setError('Not authenticated');
        return;
      }

      const activeRooms = await mentorSessionRooms.getActiveRooms();
      
      setSessions(
        activeRooms.map(room => ({
          roomId: room.id,
          bookingId: room.bookingId,
          mentorName: room.mentorId ? 'Your Mentor' : '',
          studentName: room.studentId ? 'Student' : '',
          status: room.status,
          scheduledStart: room.scheduledStart,
          scheduledEnd: room.scheduledEnd,
          isMentor: room.mentorId === user.id,
          isStudent: room.studentId === user.id,
          roomName: room.roomName,
        }))
      );
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load sessions';
      console.error('[useMentorSessions]', err);
      setError(message);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();

    if (!autoRefresh) return;

    // Refresh every 10 seconds
    const interval = setInterval(fetchSessions, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  return {
    sessions,
    loading,
    error,
    refresh: fetchSessions,
  };
}

/**
 * Hook to get details of a specific mentor session room
 */
export function useMentorSessionRoom(roomId: string | null | undefined) {
  const [room, setRoom] = useState<MentorSessionInfo | null>(null);
  const [loading, setLoading] = useState(!!roomId);
  const [error, setError] = useState<string | null>(null);
  const [canJoin, setCanJoin] = useState(false);

  useEffect(() => {
    if (!roomId) {
      setRoom(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchRoom = async () => {
      try {
        const user = getCurrentUser();
        if (!user) {
          setError('Not authenticated');
          setCanJoin(false);
          return;
        }

        const roomData = await mentorSessionRooms.getRoomById(roomId);
        if (!roomData) {
          setError('Room not found');
          setRoom(null);
          setCanJoin(false);
          return;
        }

        const isMentor = roomData.mentorId === user.id;
        const isStudent = roomData.studentId === user.id;

        setRoom({
          roomId: roomData.id,
          bookingId: roomData.bookingId,
          status: roomData.status,
          scheduledStart: roomData.scheduledStart,
          scheduledEnd: roomData.scheduledEnd,
          isMentor,
          isStudent,
          roomName: roomData.roomName,
        });

        setCanJoin(isMentor || isStudent);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load room';
        console.error('[useMentorSessionRoom]', err);
        setError(message);
        setRoom(null);
        setCanJoin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  return { room, loading, error, canJoin };
}
