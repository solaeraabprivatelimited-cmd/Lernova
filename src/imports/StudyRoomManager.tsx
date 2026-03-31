/**
 * Create/Join Study Room Component
 * Example usage of the room API and realtime features
 */

import React, { useState, useEffect } from 'react';
import { roomAPI } from '../../utils/api/roomAPI';
import { StudyRoom } from '../../utils/supabase/StudyRoom';
import { getCurrentUser } from '../../app/lib/api';

interface Room {
  id: string;
  code: string;
  name: string;
  mode: string;
  subject?: string;
  is_active: boolean;
  host?: { name: string };
  participants?: any[];
}

export function StudyRoomManager() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState('');

  const currentUser = getCurrentUser();
  const userId = currentUser?.id;

  const [formData, setFormData] = useState({
    name: '',
    mode: 'collaborative' as const,
    subject: '',
    description: '',
  });

  useEffect(() => {
    loadRooms();
    const interval = setInterval(loadRooms, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await roomAPI.listRooms();
      setRooms(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Room name is required');
      return;
    }

    try {
      setLoading(true);
      const newRoom = await roomAPI.createRoom({
        name: formData.name,
        mode: formData.mode,
        subject: formData.subject || undefined,
        description: formData.description || undefined,
      });

      setRooms((prev) => [newRoom, ...prev]);
      setActiveRoomId(newRoom.id);
      setFormData({ name: '', mode: 'collaborative', subject: '', description: '' });
      setShowCreateForm(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      await roomAPI.joinRoom(roomId);
      setActiveRoomId(roomId);
      setJoinCode('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room');
    }
  };

  const handleLeaveRoom = async () => {
    if (!activeRoomId) return;
    try {
      await roomAPI.leaveRoom(activeRoomId);
      setActiveRoomId(null);
      loadRooms(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave room');
    }
  };

  if (!userId) {
    return (
      <div className="study-room-manager">
        <div className="error-banner">
          <p>Please log in to use Study Rooms</p>
        </div>
      </div>
    );
  }

  if (activeRoomId) {
    return (
      <StudyRoom
        roomId={activeRoomId}
        userId={userId}
        onClose={handleLeaveRoom}
      />
    );
  }

  return (
    <div className="study-room-manager">
      <div className="manager-header">
        <h1>Study Rooms</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-room-btn"
        >
          {showCreateForm ? '✕ Cancel' : '+ Create Room'}
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {showCreateForm && (
        <form onSubmit={handleCreateRoom} className="create-room-form">
          <h2>Create a Study Room</h2>

          <div className="form-group">
            <label htmlFor="name">Room Name *</label>
            <input
              id="name"
              type="text"
              placeholder="e.g., Biology Study Group"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mode">Study Mode</label>
            <select
              id="mode"
              value={formData.mode}
              onChange={(e) =>
                setFormData({ ...formData, mode: e.target.value as any })
              }
            >
              <option value="focus">🎯 Focus (silent, no chat)</option>
              <option value="silent">🤐 Silent (timed focus)</option>
              <option value="collaborative">👥 Collaborative (full chat)</option>
              <option value="live">🔴 Live (video enabled)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject (Optional)</label>
            <input
              id="subject"
              type="text"
              placeholder="e.g., Mathematics, Biology"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              placeholder="Add details about the room..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Room'}
          </button>
        </form>
      )}

      <div className="join-room-section">
        <h3>Join Room by Code</h3>
        <div className="join-input-group">
          <input
            type="text"
            placeholder="Enter room code (e.g., STUDY-ABC123)"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          />
          <button
            onClick={() => {
              const room = rooms.find((r) => r.code === joinCode);
              if (room) {
                handleJoinRoom(room.id);
              } else {
                setError('Room code not found');
              }
            }}
            disabled={!joinCode.trim()}
          >
            Join
          </button>
        </div>
      </div>

      <div className="rooms-grid">
        <h2>Active Rooms ({rooms.filter((r) => r.is_active).length})</h2>

        {loading && <div className="loading-message">Loading rooms...</div>}

        {rooms.filter((r) => r.is_active).length === 0 && !loading && (
          <div className="empty-state">
            <p>No active rooms. Create one to get started!</p>
          </div>
        )}

        <div className="rooms-list">
          {rooms
            .filter((r) => r.is_active)
            .map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-card-header">
                  <h3>{room.name}</h3>
                  <span className={`mode-badge mode-${room.mode}`}>
                    {room.mode}
                  </span>
                </div>

                {room.subject && (
                  <p className="room-subject">📚 {room.subject}</p>
                )}

                <div className="room-meta">
                  <span className="host">
                    Hosted by <strong>{room.host?.name}</strong>
                  </span>
                  <span className="participants">
                    👥 {room.participants?.length || 0} participants
                  </span>
                </div>

                <div className="room-code">Code: <code>{room.code}</code></div>

                <button
                  onClick={() => handleJoinRoom(room.id)}
                  className="join-btn"
                >
                  Join Room
                </button>
              </div>
            ))}
        </div>
      </div>

      <style>{`
        .study-room-manager {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .manager-header h1 {
          margin: 0;
          font-size: 32px;
        }

        .create-room-btn {
          padding: 12px 24px;
          background: var(--primary, #003566);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .create-room-btn:hover {
          background: #004d8c;
        }

        .error-banner {
          background: #ffebee;
          color: #c62828;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .error-banner button {
          background: transparent;
          color: #c62828;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }

        .create-room-form {
          background: #f5f5f5;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 32px;
        }

        .create-room-form h2 {
          margin-top: 0;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 14px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-family: inherit;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary, #003566);
          box-shadow: 0 0 0 3px rgba(0, 53, 102, 0.1);
        }

        .submit-btn {
          background: var(--primary, #003566);
          color: white;
          padding: 12px 32px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #004d8c;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .join-room-section {
          background: var(--primary-light, #c9e5ff);
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 32px;
        }

        .join-room-section h3 {
          margin-top: 0;
          color: var(--primary, #003566);
        }

        .join-input-group {
          display: flex;
          gap: 12px;
        }

        .join-input-group input {
          flex: 1;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .join-input-group button {
          padding: 12px 24px;
          background: var(--primary, #003566);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          white-space: nowrap;
        }

        .join-input-group button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .rooms-grid {
          margin-top: 32px;
        }

        .rooms-grid h2 {
          margin-bottom: 16px;
        }

        .loading-message {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #999;
        }

        .rooms-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .room-card {
          background: white;
          border: 1px solid #eee;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s;
        }

        .room-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          border-color: var(--primary, #003566);
        }

        .room-card-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 12px;
          gap: 12px;
        }

        .room-card-header h3 {
          margin: 0;
          font-size: 18px;
        }

        .mode-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .mode-focus { background: #ffe0b2; color: #e65100; }
        .mode-silent { background: #e1bee7; color: #6a1b9a; }
        .mode-collaborative { background: #bbdefb; color: #0d47a1; }
        .mode-live { background: #f8bbd0; color: #880e4f; }

        .room-subject {
          margin: 8px 0;
          color: #666;
          font-size: 14px;
        }

        .room-meta {
          display: flex;
          gap: 16px;
          margin: 12px 0;
          font-size: 13px;
          color: #666;
        }

        .room-code {
          background: #f5f5f5;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          margin: 12px 0;
        }

        .room-code code {
          font-weight: 600;
          color: var(--primary, #003566);
        }

        .join-btn {
          width: 100%;
          padding: 12px;
          background: var(--primary, #003566);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          margin-top: 12px;
          transition: all 0.2s;
        }

        .join-btn:hover {
          background: #004d8c;
        }
      `}</style>
    </div>
  );
}

export default StudyRoomManager;
