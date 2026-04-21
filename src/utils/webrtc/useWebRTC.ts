/**
 * useWebRTC - React hook for WebRTC peer connections
 * 
 * Manages:
 * - Peer connections lifecycle
 * - Media streams
 * - Signaling via backend
 * - Error handling and recovery
 * - Connection state
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { BASE_URL, getSupabaseClient } from '../../app/lib/api';
import { roomAPI } from '../api/roomAPI';
import WebRTCManager, { WebRTCDiagnosticsReport } from './WebRTCManager';

interface UseWebRTCOptions {
  roomId: string;
  userId: string;
  enableVideo?: boolean;
  enableAudio?: boolean;
  onError?: (error: Error) => void;
  onTrackStateChange?: () => void;  // Called when remote track state changes (mute/unmute)
  autoStart?: boolean;
}

interface PeerState {
  peerId: string;
  connectionState: 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed';
  stream?: MediaStream;
}

type SignalType = 'offer' | 'answer' | 'candidate';

function normalizeSignalPayload(payload: unknown) {
  if (typeof payload !== 'string') {
    return payload;
  }

  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
}

function shouldCreateOffer(localUserId: string, remoteUserId: string) {
  return localUserId.trim().toLowerCase() < remoteUserId.trim().toLowerCase();
}

/**
 * Get valid access token from Supabase session
 */
async function getValidAccessToken(): Promise<string | null> {
  try {
    const supabase = getSupabaseClient();
    const { data: sessionData } = await supabase.auth.getSession();
    let session = sessionData?.session;

    if (!session) {
      console.warn('[useWebRTC] No active session');
      return null;
    }

    // Check if token is near expiry (less than 30 seconds left)
    const expiresAtMs = (session?.expires_at ?? 0) * 1000;
    if (expiresAtMs <= Date.now() + 30_000) {
      console.log('[useWebRTC] Token refreshing...');
      const { data: refreshed, error } = await supabase.auth.refreshSession();
      if (error || !refreshed.session) {
        console.error('[useWebRTC] Token refresh failed:', error?.message);
        return null;
      }
      session = refreshed.session;
    }

    if (!session.access_token) {
      console.error('[useWebRTC] No access token in session');
      return null;
    }

    console.log('[useWebRTC] Ready');
    return session.access_token;
  } catch (err) {
    console.error('[useWebRTC] Error getting token:', err);
    return null;
  }
}

export function useWebRTC({
  roomId,
  userId,
  enableVideo = true,
  enableAudio = true,
  onError,
  onTrackStateChange,
  // autoStart = false, // Reserved for future use
}: UseWebRTCOptions) {
  const managerRef = useRef<WebRTCManager | null>(null);
  const initiatedPeersRef = useRef<Set<string>>(new Set());
  const initiatedPeerTimestampsRef = useRef<Map<string, number>>(new Map());
  const knownPeersRef = useRef<Set<string>>(new Set());
  const peerConnectionStateRef = useRef<Map<string, PeerState['connectionState']>>(new Map());
  const processedSignalIdsRef = useRef<Set<string>>(new Set());

  // State
  const [initialized, setInitialized] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Map<string, PeerState>>(new Map());
  const [error, setError] = useState<Error | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [diagnostics, setDiagnostics] = useState<WebRTCDiagnosticsReport | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const sendSignal = useCallback(
    async (signal: {
      toUserId: string;
      signalType: SignalType;
      payload: unknown;
    }) => {
      const token = await getValidAccessToken();
      if (!token) {
        throw new Error('Authentication required for WebRTC signaling');
      }

      const response = await fetch(`${BASE_URL}/webrtc/signal/${signal.toUserId}?roomId=${roomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: signal.signalType,
          data: signal.payload,
        }),
      });

      if (!response.ok) {
        const details = await response.text().catch(() => response.statusText);
        throw new Error(`Signal ${signal.signalType} failed (${response.status}): ${details}`);
      }
    },
    [roomId, userId]
  );

  const createAndSendOffer = useCallback(
    async (peerId: string) => {
      if (!managerRef.current || !initialized) {
        throw new Error('Manager not initialized');
      }

      initiatedPeersRef.current.add(peerId);
      initiatedPeerTimestampsRef.current.set(peerId, Date.now());
      setPeers((prev) => {
        const updated = new Map(prev);
        updated.set(peerId, { peerId, connectionState: 'connecting' });
        return updated;
      });

      const offer = await managerRef.current.createOffer(peerId);
      await sendSignal({
        toUserId: peerId,
        signalType: 'offer',
        payload: offer,
      });
    },
    [initialized, sendSignal]
  );

  // Initialize WebRTC manager
  useEffect(() => {
    if (!roomId || !userId) {
      setInitialized(false);
      setLocalStream(null);
      setPeers(new Map());
      setIsScreenSharing(false);
      initiatedPeersRef.current.clear();
      initiatedPeerTimestampsRef.current.clear();
      knownPeersRef.current.clear();
      peerConnectionStateRef.current.clear();
      processedSignalIdsRef.current.clear();
      return;
    }

    let cancelled = false;

    const initManager = async () => {
      try {
        setInitialized(false);
        setError(null);
        setPeers(new Map());

        const manager = new WebRTCManager({
          enableVideo,
          enableAudio,
        });

        // Setup event handlers
        manager.on('stream-received', (peerId: string, stream: MediaStream) => {
          // Stream from peer
          peerConnectionStateRef.current.set(peerId, 'connected');
          setPeers((prev) => {
            const updated = new Map(prev);
            const peerState = updated.get(peerId) || { peerId, connectionState: 'connected' };
            peerState.stream = stream;
            updated.set(peerId, peerState);
            return updated;
          });
          // Notify component of track state change (for mute/unmute UI updates)
          onTrackStateChange?.();
        });

        manager.on('peer-connected', (peerId: string) => {
          // Peer connected
          peerConnectionStateRef.current.set(peerId, 'connected');
          setPeers((prev) => {
            const updated = new Map(prev);
            const peerState = updated.get(peerId) || { peerId, connectionState: 'connected' };
            peerState.connectionState = 'connected';
            updated.set(peerId, peerState);
            return updated;
          });
        });

        manager.on('peer-disconnected', (peerId: string) => {
          // Peer disconnected
          initiatedPeersRef.current.delete(peerId);
          initiatedPeerTimestampsRef.current.delete(peerId);
          knownPeersRef.current.delete(peerId);
          peerConnectionStateRef.current.delete(peerId);
          setPeers((prev) => {
            const updated = new Map(prev);
            updated.delete(peerId);
            return updated;
          });
        });

        manager.on('connection-state-change', (peerId: string, state: any) => {
          peerConnectionStateRef.current.set(peerId, state);
          setPeers((prev) => {
            const updated = new Map(prev);
            const peerState = updated.get(peerId) || { peerId, connectionState: state };
            peerState.connectionState = state;
            updated.set(peerId, peerState);
            return updated;
          });
        });

        manager.on('ice-candidate', (peerId: string, candidate: RTCIceCandidateInit) => {
          (async () => {
            try {
              await sendSignal({
                toUserId: peerId,
                signalType: 'candidate',
                payload: candidate,
              });
            } catch (err) {
              console.warn('[useWebRTC] Failed to send ICE candidate:', err);
            }
          })();
        });

        manager.on('local-stream-updated', (stream: MediaStream) => {
          setLocalStream(stream);
        });

        manager.on('local-track-state-changed', async (trackKind: 'audio' | 'video', enabled: boolean) => {
          // Track state changed, updating UI
          // Send new offers to all connected peers to notify them of track state changes
          const peersMap = new Map(peers);
          for (const [peerId] of peersMap) {
            try {
              await createAndSendOffer(peerId);
            } catch (error) {
              console.warn(`[useWebRTC] Failed to send renegotiation offer to ${peerId}:`, error);
            }
          }
        });

        manager.on('metrics', (metrics: any) => {
          setMetrics(metrics);
        });

        manager.on('error', (error: Error, context?: string) => {
          console.error('[useWebRTC] Error:', context, error);
          setError(error);
          onError?.(error);
        });

        // Initialize local media
        try {
          const stream = await manager.initializeLocalMedia();
          if (cancelled) {
            manager.closeAll();
            return;
          }
          setLocalStream(stream);
        } catch (mediaErr) {
          // Camera/mic denied or unavailable — continue without local media
          console.warn('[useWebRTC] Media access failed, continuing without local stream:', mediaErr);
          if (cancelled) {
            manager.closeAll();
            return;
          }
          setLocalStream(null);
          const err = mediaErr instanceof Error ? mediaErr : new Error(String(mediaErr));
          onError?.(err);
        }

        managerRef.current = manager;
        setInitialized(true);
        setError(null);

        console.log('[useWebRTC] Initialized');
      } catch (err) {
        if (cancelled) return;
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('[useWebRTC] Initialization error:', error);
        setError(error);
        onError?.(error);
      }
    };

    initManager();

    return () => {
      cancelled = true;
      if (managerRef.current) {
        managerRef.current.closeAll();
        managerRef.current = null;
      }
      setInitialized(false);
      setLocalStream(null);
      setPeers(new Map());
      setIsScreenSharing(false);
      initiatedPeersRef.current.clear();
      initiatedPeerTimestampsRef.current.clear();
      knownPeersRef.current.clear();
      peerConnectionStateRef.current.clear();
      processedSignalIdsRef.current.clear();
    };
  }, [enableVideo, enableAudio, onError, onTrackStateChange, roomId, userId, sendSignal]);

  useEffect(() => {
    if (!initialized || !managerRef.current || !userId || !roomId) return;

    const rosterInterval = 2000; // Reduced from 3000 for faster peer discovery
    let timer: NodeJS.Timeout | null = null;
    let active = true;

    const syncRoomRoster = async () => {
      if (!active || !managerRef.current) return;

      try {
        const room = await roomAPI.getRoom(roomId);
        const remotePeerIds = (room.participants ?? [])
          .filter((participant) => participant.user_id && participant.user_id !== userId)
          .filter((participant) => participant.disconnected_at == null)
          .map((participant) => participant.user_id);

        knownPeersRef.current = new Set(remotePeerIds);

        setPeers((prev) => {
          const updated = new Map(prev);

          remotePeerIds.forEach((peerId) => {
            if (!updated.has(peerId)) {
              updated.set(peerId, { peerId, connectionState: 'new' });
            }
          });

          // Remove peers that are no longer in the room (regardless of connection state)
          Array.from(updated.keys()).forEach((peerId) => {
            if (!remotePeerIds.includes(peerId)) {
              // Peer left room
              updated.delete(peerId);
              initiatedPeersRef.current.delete(peerId);
              initiatedPeerTimestampsRef.current.delete(peerId);
              peerConnectionStateRef.current.delete(peerId);
              // Close peer connection
              if (managerRef.current) {
                managerRef.current.closeConnection(peerId);
              }
            }
          });

          return updated;
        });

        for (const peerId of remotePeerIds) {
          if (!shouldCreateOffer(userId, peerId)) continue;

          const currentState = peerConnectionStateRef.current.get(peerId);
          if (currentState === 'connected') continue;

          const initiatedAt = initiatedPeerTimestampsRef.current.get(peerId) ?? 0;
          const recentlyInitiated =
            initiatedPeersRef.current.has(peerId) &&
            Date.now() - initiatedAt < 15_000; // Increased from 12s to 15s for better stability
          if (currentState === 'connecting' && recentlyInitiated) continue;

          try {
            if (!initiatedPeersRef.current.has(peerId)) {
              // Creating offer
              await createAndSendOffer(peerId);
            }
          } catch (err) {
            initiatedPeersRef.current.delete(peerId);
            initiatedPeerTimestampsRef.current.delete(peerId);
            console.warn('[useWebRTC] Failed to create peer offer:', err);
          }
        }
      } catch (err) {
        console.warn('[useWebRTC] Room roster sync error:', err);
      }

      if (active) {
        timer = setTimeout(syncRoomRoster, rosterInterval);
      }
    };

    timer = setTimeout(syncRoomRoster, 300);

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [createAndSendOffer, initialized, roomId, userId]);

  // Setup signaling - poll backend for signals (with graceful degradation)
  useEffect(() => {
    if (!initialized || !managerRef.current || !userId) return;

    const pollInterval = 1500; // Poll every 1.5 seconds (faster for better responsiveness)
    let pollTimer: NodeJS.Timeout | null = null;
    let isPolling = true;
    let consecutiveErrors = 0;

    const pollForSignals = async () => {
      if (!isPolling) return;

      try {
        const token = await getValidAccessToken();
        if (!token) {
          // Waiting for token
          consecutiveErrors++;
          if (consecutiveErrors <= 3) {
            pollTimer = setTimeout(pollForSignals, pollInterval);
          }
          return;
        }

        const response = await fetch(`${BASE_URL}/webrtc/signal/${userId}?roomId=${roomId}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.error('[useWebRTC] Authorization failed (401):');
            console.error('  - Token starts with:', token.substring(0, 30) + '...');
            console.error('  - Your token may be invalid/expired or the backend rejected it');
            console.error('  - Stopping signaling polling');
            isPolling = false;
            return;
          }
          if (response.status === 404) {
            console.log('[useWebRTC] Signaling stopped (404)');
            isPolling = false;
            return;
          }
          console.warn('[useWebRTC] Failed to fetch signals:', response.statusText);
          consecutiveErrors++;
          if (consecutiveErrors > 5) {
            console.log('[useWebRTC] Too many errors, stopping');
            isPolling = false;
            return;
          }
          pollTimer = setTimeout(pollForSignals, pollInterval);
          return;
        }

        consecutiveErrors = 0; // Reset error counter on success
        const signals = await response.json();

        for (const signal of signals) {
          const signalId = typeof signal?.id === 'string' ? signal.id : '';
          if (signalId && processedSignalIdsRef.current.has(signalId)) {
            continue;
          }
          if (signalId) {
            processedSignalIdsRef.current.add(signalId);
            if (processedSignalIdsRef.current.size > 2000) {
              const recent = Array.from(processedSignalIdsRef.current).slice(-1000);
              processedSignalIdsRef.current = new Set(recent);
            }
          }

          const { from_user_id, signal_type, payload } = signal;
          const signalPayload = normalizeSignalPayload(payload);

          if (from_user_id === userId) continue; // Ignore own messages

          try {
            switch (signal_type) {
              case 'offer':
                // Offer received
                knownPeersRef.current.add(from_user_id);
                const answer = await managerRef.current!.handleOffer(from_user_id, signalPayload);
                await sendSignal({
                  toUserId: from_user_id,
                  signalType: 'answer',
                  payload: answer,
                });
                break;

              case 'answer':
                // Answer received
                await managerRef.current!.handleAnswer(from_user_id, signalPayload);
                break;

              case 'candidate':
                // ICE candidate received
                await managerRef.current!.addICECandidate(from_user_id, signalPayload);
                break;

              default:
                console.warn('[useWebRTC] Unknown signal type:', signal_type);
            }
          } catch (err) {
            console.error('[useWebRTC] Signaling error:', err);
          }
        }
      } catch (err) {
        console.error('[useWebRTC] Poll error:', err);
        consecutiveErrors++;
      }

      if (isPolling) {
        pollTimer = setTimeout(pollForSignals, pollInterval);
      }
    };

    // Start polling
    pollTimer = setTimeout(pollForSignals, 100); // Start after 100ms

    return () => {
      isPolling = false;
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [initialized, roomId, userId, sendSignal]);

  // Connect to a peer
  const connectToPeer = useCallback(
    async (peerId: string) => {
      if (!managerRef.current || !initialized) {
        console.error('[useWebRTC] Manager not initialized');
        return;
      }

      try {
        setIsConnecting(true);
        // Connecting to peer
        await createAndSendOffer(peerId);

        setIsConnecting(false);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('[useWebRTC] Connection error:', error);
        setError(error);
        onError?.(error);
        setIsConnecting(false);
      }
    },
    [createAndSendOffer, initialized, onError]
  );

  // Disconnect from peer
  const disconnectFromPeer = useCallback((peerId: string) => {
    if (managerRef.current) {
      managerRef.current.closeConnection(peerId);
      setPeers((prev) => {
        const updated = new Map(prev);
        updated.delete(peerId);
        return updated;
      });
    }
  }, []);

  const setMediaDevices = useCallback(
    async (audioDeviceId?: string, videoDeviceId?: string) => {
      if (!managerRef.current || !initialized) {
        throw new Error('WebRTC is not initialized yet');
      }

      const stream = await managerRef.current.switchMediaDevices(
        audioDeviceId,
        videoDeviceId
      );
      setLocalStream(stream);
    },
    [initialized]
  );

  const startScreenShare = useCallback(async () => {
    if (!managerRef.current || !initialized) {
      throw new Error('WebRTC is not initialized yet');
    }

    const stream = await managerRef.current.startScreenShare();
    setLocalStream(stream);
    setIsScreenSharing(true);
  }, [initialized]);

  const stopScreenShare = useCallback(async () => {
    if (!managerRef.current || !initialized) {
      throw new Error('WebRTC is not initialized yet');
    }

    const stream = await managerRef.current.stopScreenShare();
    setLocalStream(stream);
    setIsScreenSharing(false);
  }, [initialized]);

  // Send message via data channel
  const sendMessage = useCallback(
    (peerId: string, message: any) => {
      if (managerRef.current) {
        return managerRef.current.sendMessage(peerId, message);
      }
      return false;
    },
    []
  );

  // Get diagnostics
  const getDiagnostics = useCallback(() => {
    if (managerRef.current) {
      return managerRef.current.getDiagnosticsReport();
    }
    return null;
  }, []);

  // Update diagnostics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const diags = getDiagnostics();
      if (diags) {
        setDiagnostics(diags);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [getDiagnostics]);

  // Update local stream volume control (optional)
  const toggleAudio = useCallback(
    async (enabled: boolean) => {
      if (!managerRef.current || !initialized) {
        throw new Error('WebRTC is not initialized yet');
      }
      const stream = await managerRef.current.setAudioEnabled(enabled);
      setLocalStream(stream);
    },
    [initialized]
  );

  const toggleVideo = useCallback(
    async (enabled: boolean) => {
      if (!managerRef.current || !initialized) {
        throw new Error('WebRTC is not initialized yet');
      }
      const stream = await managerRef.current.setVideoEnabled(enabled);
      setLocalStream(stream);
      if (!enabled) {
        setIsScreenSharing(false);
      } else {
        setIsScreenSharing(managerRef.current.isScreenShareActive());
      }
    },
    [initialized]
  );

  return {
    initialized,
    localStream,
    peers: Array.from(peers.values()),
    error,
    metrics,
    diagnostics,
    isConnecting,
    isScreenSharing,
    connectToPeer,
    disconnectFromPeer,
    setMediaDevices,
    startScreenShare,
    stopScreenShare,
    sendMessage,
    getDiagnostics,
    toggleAudio,
    toggleVideo,
  };
}

export default useWebRTC;
