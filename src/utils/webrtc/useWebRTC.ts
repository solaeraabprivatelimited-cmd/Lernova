/**
 * React hook for WebRTC P2P connections with Supabase Realtime signaling
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { getSupabaseClient, getCurrentUser } from '@/app/lib/api';
import { WebRTCManager } from './WebRTCManager';

interface RemoteStream {
  userId: string;
  stream: MediaStream;
  userName: string;
}

export interface UseWebRTCConfig {
  roomId: string;
  userId?: string;
  userName?: string;
  enabled?: boolean;
}

// Generate unique session ID for each WebRTC instance
const generateSessionId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function useWebRTC({ roomId, userId: providedUserId, userName: providedUserName, enabled = true }: UseWebRTCConfig) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Map<string, string>>(new Map());

  const managerRef = useRef<WebRTCManager | null>(null);
  const channelRef = useRef<any>(null);
  const participantsRef = useRef<Map<string, string>>(new Map());

  const currentUser = getCurrentUser();
  // Use provided userId or fall back to current user's ID
  const userId = providedUserId || currentUser?.id || `user-${Math.random().toString(36).substr(2, 9)}`;
  const userName = providedUserName || currentUser?.name || 'Anonymous';

  // Initialize WebRTC manager and Supabase channel
  useEffect(() => {
    if (!enabled) return;

    const initWebRTC = async () => {
      try {
        const supabase = getSupabaseClient();

        // Create Supabase Realtime channel for signaling
        const channel = supabase.channel(`webrtc-${roomId}`, {
          config: {
            broadcast: { self: false },
            presence: { key: userId },
          },
        });

        channelRef.current = channel;

        // Track participants and connect to peers
        channel.on('presence', { event: 'sync' }, async () => {
          console.log('📡 [Presence Sync] Triggered, manager state:', !!managerRef.current);
          try {
            const state = channel.presenceState();
            const manager = managerRef.current;
            
            console.log('📡 [Presence Sync] Raw state:', state);
            console.log('📡 [Presence Sync] State entries:', Object.keys(state).length);
            console.log('📡 [Presence Sync] State keys:', Object.keys(state));
            
            let totalUsers = 0;
            Object.entries(state).forEach(([key, users]: [string, any]) => {
              console.log(`📡 [Presence Sync] Processing key "${key}"`, Array.isArray(users) ? `${users.length} users` : 'not array');
              if (Array.isArray(users)) {
                console.log(`📡 [Presence Sync] Key "${key}" has ${users.length} users`);
                users.forEach((user: any, idx: number) => {
                  totalUsers++;
                  console.log(`📡 [Presence Sync] [${idx}] User: id=${user.user_id}, name=${user.user_name}, Me=${userId}, isSelf=${user.user_id === userId}`);
                  participantsRef.current.set(user.user_id, user.user_name);
                  // Connect to peer if manager is initialized and not self
                  if (manager && user.user_id !== userId) {
                    console.log(`🔌 [Presence Sync] CONNECTING to peer:`, user.user_id, '(' + user.user_name + ')');
                    manager.connectToPeer(user.user_id, user.user_name).catch(console.error);
                  }
                });
              }
            });
            console.log('📡 [Presence Sync] Total users found:', totalUsers);
            setParticipants(new Map(participantsRef.current));
          } catch (err) {
            console.error('❌ [Presence Sync] Error:', err);
          }
        });

        channel.on('presence', { event: 'join' }, async ({ newPresences }: any) => {
          console.log('📡 [Presence Join] Triggered, new presences count:', newPresences?.length || 0);
          const manager = managerRef.current;
          
          if (!Array.isArray(newPresences)) {
            console.warn('📡 [Presence Join] newPresences is not an array:', typeof newPresences);
            return;
          }
          
          console.log('📡 [Presence Join] Processing', newPresences.length, 'new presences');
          newPresences.forEach((presence: any, idx: number) => {
            console.log(`📡 [Presence Join] [${idx}] User: id=${presence.user_id}, name=${presence.user_name}, Me=${userId}, isSelf=${presence.user_id === userId}`);
            participantsRef.current.set(presence.user_id, presence.user_name);
            // Connect to new peer
            if (manager && presence.user_id !== userId) {
              console.log(`🔌 [Presence Join] CONNECTING to new peer:`, presence.user_id, '(' + presence.user_name + ')');
              manager.connectToPeer(presence.user_id, presence.user_name).catch(console.error);
            }
          });
          setParticipants(new Map(participantsRef.current));
        });

        channel.on('presence', { event: 'leave' }, ({ leftPresences }: any) => {
          leftPresences.forEach((presence: any) => {
            participantsRef.current.delete(presence.user_id);
          });
          setParticipants(new Map(participantsRef.current));
        });

        // Subscribe to channel
        const subscribePromise = new Promise<void>((resolve, reject) => {
          channel.subscribe(async (status) => {
            console.log('📡 Channel subscription status:', status);
            if (status === 'SUBSCRIBED') {
              // CRITICAL: Track presence after subscription
              console.log('📡 [TRACK] Tracking presence with userId:', userId);
              await channel.track({
                user_id: userId,
                user_name: userName,
                joined_at: new Date().toISOString(),
              }).catch((err: any) => {
                console.error('❌ [TRACK] Failed to track presence:', err);
              });
              console.log('✅ [TRACK] Presence tracked successfully');
              resolve();
            } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
              reject(new Error(`Channel subscription failed: ${status}`));
            }
          });
        });

        await Promise.race([
          subscribePromise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Channel subscription timeout')), 10000)
          ),
        ]);

        // Create WebRTC manager
        const manager = new WebRTCManager(
          {
            roomId,
            userId,
            userName,
            signalingChannel: channel,
          },
          {
            onLocalStreamReady: (stream) => {
              setLocalStream(stream);
              setIsConnected(true);
            },
            onRemoteStream: (peerId, stream) => {
              console.log('🔴 [onRemoteStream] Received stream from peer:', peerId, 'stream:', !!stream, 'tracks:', stream?.getTracks().length || 0);
              if (stream) {
                stream.getTracks().forEach(track => {
                  console.log(`🔴 [onRemoteStream] Track - kind: ${track.kind}, enabled: ${track.enabled}, state: ${track.readyState}`);
                });
              }
              setRemoteStreams((prev) => {
                const existing = prev.find(s => s.userId === peerId);
                if (existing) {
                  console.log('🔴 [onRemoteStream] Stream already exists for peer:', peerId, 'REPLACING with new stream');
                  return prev.map(s => s.userId === peerId ? { userId: peerId, stream, userName: s.userName } : s);
                }
                const peerName = participantsRef.current.get(peerId) || 'Unknown';
                console.log('🔴 [onRemoteStream] Adding new remote stream [userId:', peerId, 'userName:', peerName, ']');
                console.log('🔴 [onRemoteStream] New remoteStreams count will be:', prev.length + 1);
                return [...prev, { userId: peerId, stream, userName: peerName }];
              });
            },
            onRemoteStreamRemoved: (peerId) => {
              setRemoteStreams((prev) => prev.filter(s => s.userId !== peerId));
            },
            onError: (error) => {
              console.error('WebRTC error:', error);
              setError(error.message);
            },
          }
        );

        managerRef.current = manager;
        console.log('✅ WebRTCManager created with userId:', userId);

        // Initialize local stream
        console.log('🎥 Initializing local stream...');
        await manager.initLocalStream();

        // Announce presence to other peers
        console.log('📣 Announcing presence with userId:', userId);
        await manager.announcePresence();
        
        // Check presence state after announcement
        setTimeout(() => {
          const state = channel.presenceState();
          console.log('📡 [After announce] Presence state:', state);
          console.log('📡 [After announce] State keys:', Object.keys(state));
        }, 100);

        // Connect to existing participants (presence sync will be called after)
        setTimeout(() => {
          console.log('⏱️ [500ms timeout] Checking for existing participants, manager ready:', !!managerRef.current);
          const state = channel.presenceState();
          const presenceEntries = Object.entries(state);
          console.log('⏱️ [500ms timeout] Presence state:', state);
          console.log('⏱️ [500ms timeout] Presence state entries:', presenceEntries.length);
          
          Object.entries(state).forEach(([key, users]: [string, any]) => {
            if (Array.isArray(users)) {
              console.log(`⏱️ [500ms timeout] Key "${key}" has ${users.length} users`);
              users.forEach((user: any) => {
                console.log(`⏱️ [500ms timeout] Checking user:`, user.user_id, 'vs me:', userId, 'match:', user.user_id === userId);
                if (user.user_id !== userId && managerRef.current) {
                  console.log(`🔌 [500ms timeout] Connecting to:`, user.user_id);
                  managerRef.current.connectToPeer(user.user_id, user.user_name).catch(console.error);
                }
              });
            }
          });
        }, 500);

        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to initialize WebRTC';
        console.error('WebRTC initialization error:', errorMsg);
        setError(errorMsg);
      }
    };

    initWebRTC();

    // Cleanup on unmount
    return () => {
      console.log('🧹 [CLEANUP] Cleaning up WebRTC');
      const cleanup = async () => {
        try {
          // Disconnect from peers first
          if (managerRef.current) {
            console.log('🧹 [CLEANUP] Disconnecting from peers');
            await managerRef.current.disconnect();
          }
          
          // Then untrack presence
          if (channelRef.current) {
            console.log('🧹 [CLEANUP] Untracking presence');
            await channelRef.current.untrack();
            console.log('🧹 [CLEANUP] Presence untracked successfully');
          }
          
          // Finally unsubscribe
          if (channelRef.current) {
            console.log('🧹 [CLEANUP] Unsubscribing from channel');
            await channelRef.current.unsubscribe();
            console.log('🧹 [CLEANUP] Channel unsubscribed');
          }
        } catch (err: any) {
          console.error('❌ [CLEANUP] Error during cleanup:', err?.message || err);
        }
      };
      cleanup();
    };
  }, [enabled, roomId, userId, userName]);

  // Update audio/video states when manager changes
  useEffect(() => {
    if (managerRef.current) {
      setIsAudioOn(managerRef.current.isAudioOn());
      setIsVideoOn(managerRef.current.isVideoOn());
    }
  }, []);

  const toggleAudio = useCallback(
    (enabled: boolean) => {
      if (managerRef.current) {
        managerRef.current.toggleAudio(enabled);
        setIsAudioOn(enabled);
      }
    },
    []
  );

  const toggleVideo = useCallback(
    (enabled: boolean) => {
      if (managerRef.current) {
        managerRef.current.toggleVideo(enabled);
        setIsVideoOn(enabled);
      }
    },
    []
  );

  const disconnect = useCallback(async () => {
    if (managerRef.current) {
      await managerRef.current.disconnect();
      setLocalStream(null);
      setRemoteStreams([]);
      setIsConnected(false);
    }
    if (channelRef.current) {
      await channelRef.current.unsubscribe();
    }
  }, []);

  const reinitializeStream = useCallback(async (audioDeviceId?: string, videoDeviceId?: string) => {
    if (managerRef.current) {
      try {
        console.log('🔄 Reinitializing WebRTC stream with devices:', { audioDeviceId, videoDeviceId });
        await managerRef.current.reinitializeStream(audioDeviceId, videoDeviceId);
        // Local stream should be updated via onLocalStreamReady callback
      } catch (error) {
        console.error('Failed to reinitialize stream:', error);
        setError(error instanceof Error ? error.message : 'Failed to reinitialize stream');
      }
    }
  }, []);

  return {
    localStream,
    remoteStreams,
    isConnected,
    isAudioOn,
    isVideoOn,
    error,
    participants: Array.from(participants.entries()).map(([id, name]) => ({ id, name })),
    toggleAudio,
    toggleVideo,
    disconnect,
    reinitializeStream,
  };
}

export default useWebRTC;
