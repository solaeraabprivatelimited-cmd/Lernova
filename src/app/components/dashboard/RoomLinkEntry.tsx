import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { roomAPI, Room } from '@/utils/api/roomAPI';
import { CollaborativeModeRoom } from './CollaborativeModeRoom';

interface RoomLinkEntryProps {
  onExit: () => void;
}

export function RoomLinkEntry({ onExit }: RoomLinkEntryProps) {
  const { roomCode = '' } = useParams();
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const joinFromLink = async () => {
      if (!roomCode) {
        if (active) {
          setError('Invalid room link');
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError('');

      try {
        const loadedRoom = await roomAPI.getRoom(roomCode);
        if (active) {
          setRoom(loadedRoom);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : 'Unable to open this room link'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void joinFromLink();

    return () => {
      active = false;
    };
  }, [roomCode]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#202124] px-6 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          <p className="text-sm text-white/80">Joining room...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#202124] px-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#2b2c2f] p-6 text-center">
          <p className="text-lg font-semibold">Unable to open room</p>
          <p className="mt-2 text-sm text-white/70">{error || 'Room not found'}</p>
          <button
            onClick={onExit}
            className="mt-4 rounded-lg bg-[#8ab4f8] px-4 py-2 text-sm font-semibold text-[#202124] transition hover:bg-[#a3c2fa]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <CollaborativeModeRoom
      roomName={room.name}
      roomId={room.id}
      roomCode={room.code}
      maxParticipants={room.max_participants}
      subject={room.subject || 'General'}
      onLeaveRoom={onExit}
    />
  );
}
