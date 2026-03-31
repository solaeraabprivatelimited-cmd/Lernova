/**
 * Study Room Component with P2P WebRTC via LiveKit
 * Real-time messaging, presence, reactions, and peer-to-peer audio/video
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStudyRoom } from './useStudyRoom';
import { useLiveKit } from '../livekit';
import { getSupabaseClient } from '@/app/lib/api';
import { Track, Participant } from 'livekit-client';
import './StudyRoom.css';

interface StudyRoomProps {
  roomId: string;
  userId: string;
  userName?: string;
  onClose?: () => void;
}

const EMOJI_REACTIONS = ['👍', '🎉', '💪', '❤️', '🔥', '😂', '✨', '🤔'];

interface RemoteVideoTrack {
  [participantId: string]: {
    videoElement?: HTMLVideoElement;
    participant?: Participant;
  };
}

export function StudyRoom({ roomId, userId, userName = 'Anonymous', onClose }: StudyRoomProps) {
  const [messageText, setMessageText] = useState('');
  const [showReactions, setShowReactions] = useState(false);
  const [localAudioEnabled, setLocalAudioEnabled] = useState(true);
  const [localVideoEnabled, setLocalVideoEnabled] = useState(true);
  const [liveKitToken, setLiveKitToken] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefsRef = useRef<Map<string, React.RefObject<HTMLVideoElement>>>(new Map());

  // Get or create a ref for a remote participant
  const getRemoteVideoRef = (participantSid: string) => {
    if (!remoteVideoRefsRef.current.has(participantSid)) {
      remoteVideoRefsRef.current.set(participantSid, React.createRef<HTMLVideoElement>());
    }
    return remoteVideoRefsRef.current.get(participantSid)!;
  };

  const {
    room,
    messages,
    participants,
    reactions,
    loading,
    error,
    activeParticipants,
    sendMessage,
    addReaction,
    removeReaction,
    updateParticipant,
  } = useStudyRoom({ roomId, userId });

  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [liveKitRemoteParticipants, setLiveKitRemoteParticipants] = useState<Participant[]>([]);

  // Generate LiveKit token on room join
  useEffect(() => {
    if (!room) {
      console.log('⏳ Waiting for room to load...');
      return;
    }

    console.log('🔵 Starting token generation for room:', roomId);

    // Generate LiveKit token from Supabase Edge Function
    const generateToken = async () => {
      try {
        console.log('🔵 Fetching Supabase configuration...');
        const supabase = getSupabaseClient();
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        console.log('Supabase URL:', supabaseUrl);
        console.log('Has Anon Key:', !!supabaseAnonKey);

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Missing Supabase configuration');
        }

        // Get the user's session token for authentication
        console.log('🔵 Checking authentication session...');
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('User not authenticated - no session found');
        }

        console.log('✅ User authenticated, generating token...');
        const tokenEndpoint = `${supabaseUrl}/functions/v1/livekit-token`;
        console.log('🔵 Calling endpoint:', tokenEndpoint);

        const response = await fetch(tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            roomId: roomId,
            userId: userId,
            userName: userName || 'Guest',
          }),
        });

        console.log('Response status:', response.status);
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || `Failed to generate token: ${response.status}`);
        }

        const { token } = await response.json();
        console.log('🟢 Token generated successfully (length:', token.length, ')');
        console.log('Token payload (first 50 chars):', token.substring(0, 50));
        setLiveKitToken(token);
      } catch (err) {
        console.error('🔴 Failed to generate LiveKit token:', err);
        const message = err instanceof Error ? err.message : 'Failed to generate token';
        console.error('Error message:', message);
        alert(`LiveKit token generation failed: ${message}`);
      }
    };

    generateToken();
  }, [room, roomId, userId, userName]);

  // LiveKit P2P integration
  const liveKitCallbacks = useCallback(() => ({
    onRoomConnected: () => {
      setConnectionStatus('connected');
      console.log('✅ Connected to LiveKit room');
    },
    onRoomDisconnected: () => {
      setConnectionStatus('disconnected');
      console.log('❌ Disconnected from LiveKit room');
    },
    onTrackSubscribed: (track: Track, publication: any, participant: Participant) => {
      console.log('📺 Remote track subscribed:', track.kind, 'from', participant.identity);
      if (track.kind === Track.Kind.Video) {
        const videoRef = getRemoteVideoRef(participant.sid);
        if (videoRef.current && livekit.manager) {
          console.log('Attaching remote video for:', participant.identity);
          livekit.manager.attachRemoteVideoElement(videoRef.current, participant);
        }
      }
    },
    onParticipantJoined: (participant: Participant) => {
      console.log('👥 Participant joined:', participant.identity);
      getRemoteVideoRef(participant.sid); // Initialize ref
      setLiveKitRemoteParticipants((prev) => [...prev, participant]);
    },
    onParticipantLeft: (participant: Participant) => {
      console.log('👥 Participant left:', participant.identity);
      remoteVideoRefsRef.current.delete(participant.sid);
      setLiveKitRemoteParticipants((prev) => prev.filter((p) => p.sid !== participant.sid));
    },
  }), []);

  useEffect(() => {
    console.log('🔍 LiveKit state:', {
      hasToken: !!liveKitToken,
      tokenLength: liveKitToken?.length || 0,
      url: import.meta.env.VITE_LIVEKIT_URL,
      enabled: !!liveKitToken
    });
  }, [liveKitToken]);

  const livekit = useLiveKit(
    {
      url: import.meta.env.VITE_LIVEKIT_URL || 'ws://localhost:7880',
      token: liveKitToken,
    },
    !!liveKitToken, // Enable only when token is available
    liveKitCallbacks()
  );

  // Attach local video when connected
  useEffect(() => {
    if (!livekit.connected || !livekit.manager || !localVideoRef.current) {
      console.log('Local video attachment conditions not met:', {
        connected: livekit.connected,
        hasManager: !!livekit.manager,
        hasRef: !!localVideoRef.current
      });
      return;
    }

    console.log('Attempting to attach local video');
    livekit.manager.attachLocalVideoElement(localVideoRef.current);

    // Retry attachment after a delay in case tracks aren't ready yet
    const timeout = setTimeout(() => {
      if (localVideoRef.current && livekit.manager) {
        console.log('Retrying local video attachment after delay');
        livekit.manager.attachLocalVideoElement(localVideoRef.current);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [livekit.connected, livekit.manager]);

  // Attach remote videos when participants update
  useEffect(() => {
    if (!livekit.manager || liveKitRemoteParticipants.length === 0) return;

    console.log('Attaching remote videos for', liveKitRemoteParticipants.length, 'participants');
    
    liveKitRemoteParticipants.forEach((participant) => {
      const videoRef = getRemoteVideoRef(participant.sid);
      if (videoRef.current) {
        console.log('Attaching remote video for:', participant.identity);
        livekit.manager!.attachRemoteVideoElement(videoRef.current, participant);
      }
    });

    // Retry attachment after delay
    const timeout = setTimeout(() => {
      console.log('Retrying remote video attachments');
      liveKitRemoteParticipants.forEach((participant) => {
        const videoRef = getRemoteVideoRef(participant.sid);
        if (videoRef.current) {
          livekit.manager!.attachRemoteVideoElement(videoRef.current, participant);
        }
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [liveKitRemoteParticipants, livekit.manager]);

  // Handle audio toggle
  const handleToggleMute = async () => {
    const newState = !localAudioEnabled;
    setLocalAudioEnabled(newState);
    try {
      await livekit.toggleAudio(newState);
      await updateParticipant(userId, { is_muted: !newState });
    } catch (err) {
      console.error('Failed to toggle audio:', err);
      setLocalAudioEnabled(!newState); // Revert on error
    }
  };

  // Handle video toggle
  const handleToggleVideo = async () => {
    const newState = !localVideoEnabled;
    setLocalVideoEnabled(newState);
    try {
      await livekit.toggleVideo(newState);
      await updateParticipant(userId, { is_video_off: !newState });
    } catch (err) {
      console.error('Failed to toggle video:', err);
      setLocalVideoEnabled(!newState); // Revert on error
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    try {
      await sendMessage(messageText);
      setMessageText('');
    } catch (err) {
      console.error('Failed to send message:', err);
      const message = err instanceof Error ? err.message : 'Unable to send message';
      alert(`Failed to send message: ${message}`);
    }
  };

  const handleAddReaction = async (emoji: string) => {
    try {
      await addReaction(emoji);
      setShowReactions(false);
    } catch (err) {
      console.error('Failed to add reaction:', err);
    }
  };

  if (loading) {
    return (
      <div className="study-room loading">
        <div className="spinner">Loading room...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="study-room error">
        <div className="error-message">
          <h3>Error Loading Room</h3>
          <p>{error.message}</p>
          {onClose && <button onClick={onClose}>Close</button>}
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="study-room error">
        <div className="error-message">
          <h3>Room Not Found</h3>
          {onClose && <button onClick={onClose}>Close</button>}
        </div>
      </div>
    );
  }

  const reactionCounts = EMOJI_REACTIONS.reduce((acc, emoji) => {
    acc[emoji] = reactions.filter((r) => r.emoji === emoji).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="study-room">
      {/* Header */}
      <div className="study-room-header">
        <div className="room-info">
          <h2>{room.name}</h2>
          <span className={`mode-badge mode-${room.mode}`}>{room.mode}</span>
          {room.subject && <span className="subject-badge">{room.subject}</span>}
          <span className="participant-count">
            👥 {activeParticipants.length} participant{activeParticipants.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="room-actions">
          <button 
            onClick={handleToggleMute} 
            className={`control-btn ${localAudioEnabled ? 'active' : 'muted'}`}
            title={localAudioEnabled ? 'Mute audio' : 'Unmute audio'}
          >
            {localAudioEnabled ? '🎤' : '🔇'}
          </button>
          <button 
            onClick={handleToggleVideo}
            className={`control-btn ${localVideoEnabled ? 'active' : 'off'}`}
            title={localVideoEnabled ? 'Turn off video' : 'Turn on video'}
          >
            {localVideoEnabled ? '📹' : '📹❌'}
          </button>
          <button onClick={() => setShowReactions(!showReactions)} className="reactions-btn">
            😊 React
          </button>
          {connectionStatus && (
            <span className={`connection-indicator connection-${connectionStatus}`} title={connectionStatus}>
              {connectionStatus === 'connected' ? '🟢' : connectionStatus === 'connecting' ? '🟡' : '🔴'}
            </span>
          )}
          {onClose && <button onClick={onClose} className="close-btn">×</button>}
        </div>
        </div>
      </div>

      <div className="study-room-content">
        {/* Connection Status */}
        {connectionStatus !== 'connected' && (
          <div className={`connection-banner connection-${connectionStatus}`}>
            {connectionStatus === 'connecting' && '⏳ Connecting to video conference...'}
            {connectionStatus === 'disconnected' && '⚠️ Not connected to video conference'}
          </div>
        )}

        {/* Video Grid */}
        <section className="video-grid">
          {/* Local Video */}
          <div className="video-item local-video">
            <video 
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="video-stream"
            />
            <div className="video-label">
              <span className="name">You</span>
              {!localAudioEnabled && <span className="status">🔇</span>}
              {!localVideoEnabled && <span className="status">📹❌</span>}
            </div>
          </div>

          {/* Remote Participant Videos - LiveKit */}
          {liveKitRemoteParticipants.map((participant) => {
            const videoRef = getRemoteVideoRef(participant.sid);
            const dbParticipant = activeParticipants.find(p => p.user?.id === participant.identity);
            
            return (
              <div key={participant.sid} className="video-item remote-video">
                <video 
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="video-stream"
                />
                <div className="video-label">
                  <span className="name">{participant.name || 'Participant'}</span>
                  {dbParticipant?.is_muted && <span className="status">🔇</span>}
                  {dbParticipant?.is_video_off && <span className="status">📹❌</span>}
                  {dbParticipant?.permissions === 'host' && <span className="badge-host">🏠 Host</span>}
                </div>
              </div>
            );
          })}
        </section>

        {/* Participants Sidebar */}
        <aside className="participants-panel">
          <h3>Participants ({activeParticipants.length})</h3>
          <div className="participants-list">
            {activeParticipants.map((p) => (
              <div key={p.id} className={`participant-item participant-${p.permissions}`}>
                <div className="participant-avatar">
                  {p.user?.avatar_url ? (
                    <img src={p.user.avatar_url} alt={p.user?.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {p.user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  {p.is_pinned && <span className="pinned-indicator">📌</span>}
                </div>
                <div className="participant-info">
                  <p className="participant-name">{p.user?.name || 'Anonymous'}</p>
                  <div className="participant-status">
                    {p.is_muted && <span className="status-icon" title="Muted">🔇</span>}
                    {p.is_video_off && <span className="status-icon" title="Video off">📹❌</span>}
                    {p.permissions === 'host' && <span className="role-badge">Host</span>}
                    {p.permissions === 'moderator' && <span className="role-badge">Moderator</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="main-content">
          {/* Messages */}
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-state">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-item ${msg.user_id === userId ? 'own-message' : ''}`}
                  >
                    <div className="message-avatar">
                      {msg.user?.avatar_url ? (
                        <img src={msg.user.avatar_url} alt={msg.user?.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {msg.user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="message-body">
                      <div className="message-header">
                        <span className="message-author">{msg.user?.name || 'Anonymous'}</span>
                        <span className="message-time">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {msg.is_edited && <span className="edited-label">(edited)</span>}
                      </div>
                      <p className="message-content">{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Reactions Bar */}
          {Object.values(reactionCounts).some((c) => c > 0) && (
            <div className="reactions-bar">
              {EMOJI_REACTIONS.map((emoji) =>
                reactionCounts[emoji] > 0 ? (
                  <button
                    key={emoji}
                    className="reaction-badge"
                    onClick={() => {
                      const reaction = reactions.find((r) => r.emoji === emoji && r.user_id === userId);
                      if (reaction) {
                        removeReaction(reaction.id);
                      } else {
                        addReaction(emoji);
                      }
                    }}
                  >
                    {emoji} {reactionCounts[emoji]}
                  </button>
                ) : null
              )}
            </div>
          )}

          {/* Reaction Picker */}
          {showReactions && (
            <div className="reaction-picker">
              {EMOJI_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  className="reaction-emoji"
                  onClick={() => handleAddReaction(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Message Input */}
          <div className="message-input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              className="message-input"
            />
            <button onClick={handleSendMessage} className="send-btn">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
                    {p.is_video_off && <span className="status-icon">📹❌</span>}
                  </div>
                </div>
                {p.user_id === userId && (
                  <button
                    onClick={() => handleToggleMute(p.id, p.is_muted)}
                    className="mic-btn"
                    title={p.is_muted ? 'Unmute' : 'Mute'}
                  >
                    {p.is_muted ? '🔇' : '🎤'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="main-content">
          {/* Messages */}
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-state">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-item ${msg.user_id === userId ? 'own-message' : ''}`}
                  >
                    <div className="message-avatar">
                      {msg.user?.avatar_url ? (
                        <img src={msg.user.avatar_url} alt={msg.user?.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {msg.user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="message-body">
                      <div className="message-header">
                        <span className="message-author">{msg.user?.name}</span>
                        <span className="message-time">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {msg.is_edited && <span className="edited-label">(edited)</span>}
                      </div>
                      <p className="message-content">{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Reactions Bar */}
          {Object.values(reactionCounts).some((c) => c > 0) && (
            <div className="reactions-bar">
              {EMOJI_REACTIONS.map((emoji) =>
                reactionCounts[emoji] > 0 ? (
                  <button
                    key={emoji}
                    className="reaction-badge"
                    onClick={() => {
                      const reaction = reactions.find((r) => r.emoji === emoji && r.user_id === userId);
                      if (reaction) {
                        removeReaction(reaction.id);
                      } else {
                        addReaction(emoji);
                      }
                    }}
                  >
                    {emoji} {reactionCounts[emoji]}
                  </button>
                ) : null
              )}
            </div>
          )}

          {/* Reaction Picker */}
          {showReactions && (
            <div className="reaction-picker">
              {EMOJI_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  className="reaction-emoji"
                  onClick={() => handleAddReaction(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Message Input */}
          <div className="message-input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              className="message-input"
            />
            <button onClick={handleSendMessage} className="send-btn">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyRoom;
