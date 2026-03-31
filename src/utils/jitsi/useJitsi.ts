import { useEffect, useRef, useState, useCallback } from 'react';
import JitsiManager, { JitsiConfig, JitsiCallbacks } from './JitsiManager';

export interface TrackHandlers {
  onLocalTrack?: (track: any) => void;
  onRemoteTrack?: (track: any) => void;
  onTrackRemoved?: (track: any) => void;
}

export const useJitsi = (
  config: JitsiConfig,
  enabled: boolean = true,
  trackHandlers?: TrackHandlers
) => {
  const managerRef = useRef<JitsiManager | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [connected, setConnected] = useState(false);
  const [inConference, setInConference] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize manager
  useEffect(() => {
    if (!enabled || initialized) return;

    const callbacks: JitsiCallbacks = {
      onConnectionEstablished: () => {
        setConnected(true);
        console.log('Connected to Jitsi server');
      },
      onConnectionFailed: (error: any) => {
        setError(`Connection failed: ${error}`);
        setConnected(false);
      },
      onConferenceJoined: () => {
        setInConference(true);
      },
      onConferenceFailed: (error: any) => {
        setError(`Conference failed: ${error}`);
        setInConference(false);
      },
      onLocalTrack: (track: any) => {
        console.log('Local track received:', track.getType());
        trackHandlers?.onLocalTrack?.(track);
      },
      onRemoteTrack: (track: any) => {
        console.log('Remote track received:', track.getParticipantId(), track.getType());
        trackHandlers?.onRemoteTrack?.(track);
      },
      onTrackRemoved: (track: any) => {
        console.log('Track removed:', track.getParticipantId());
        trackHandlers?.onTrackRemoved?.(track);
      },
      onParticipantJoined: (participantId: string) => {
        setParticipants((prev) => [...new Set([...prev, participantId])]);
      },
      onParticipantLeft: (participantId: string) => {
        setParticipants((prev) => prev.filter((id) => id !== participantId));
      },
    };

    const manager = new JitsiManager(config, callbacks);
    managerRef.current = manager;

    (async () => {
      try {
        await manager.initialize();
        setInitialized(true);
      } catch (err) {
        setError(`Initialization failed: ${err}`);
      }
    })();

    return () => {
      if (managerRef.current) {
        managerRef.current.dispose();
      }
    };
  }, [config, enabled, initialized, trackHandlers]);

  const connect = useCallback(async () => {
    if (!managerRef.current || !initialized) {
      setError('Jitsi not initialized');
      return;
    }

    try {
      await managerRef.current.connect();
    } catch (err) {
      setError(`Connection error: ${err}`);
    }
  }, [initialized]);

  const joinConference = useCallback(
    async (roomName: string, userId: string) => {
      if (!managerRef.current || !connected) {
        setError('Not connected to server');
        return;
      }

      try {
        await managerRef.current.joinConference(roomName, userId);
      } catch (err) {
        setError(`Join error: ${err}`);
      }
    },
    [connected]
  );

  const addAudio = useCallback(async () => {
    if (!managerRef.current || !inConference) {
      setError('Not in conference');
      return;
    }

    try {
      const track = await managerRef.current.addTrack('audio', {
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      return track;
    } catch (err) {
      setError(`Audio error: ${err}`);
    }
  }, [inConference]);

  const addVideo = useCallback(async () => {
    if (!managerRef.current || !inConference) {
      setError('Not in conference');
      return;
    }

    try {
      const track = await managerRef.current.addTrack('video', {
        video: { width: 640, height: 480 },
      });
      return track;
    } catch (err) {
      setError(`Video error: ${err}`);
    }
  }, [inConference]);

  const removeAudio = useCallback(async () => {
    if (!managerRef.current) return;

    try {
      await managerRef.current.removeTrack('audio');
    } catch (err) {
      setError(`Remove audio error: ${err}`);
    }
  }, []);

  const removeVideo = useCallback(async () => {
    if (!managerRef.current) return;

    try {
      await managerRef.current.removeTrack('video');
    } catch (err) {
      setError(`Remove video error: ${err}`);
    }
  }, []);

  const toggleAudio = useCallback((enabled: boolean) => {
    if (!managerRef.current) return;
    managerRef.current.toggleAudio(enabled);
  }, []);

  const toggleVideo = useCallback((enabled: boolean) => {
    if (!managerRef.current) return;
    managerRef.current.toggleVideo(enabled);
  }, []);

  const getRemoteTracks = useCallback((participantId: string) => {
    if (!managerRef.current) return [];
    return managerRef.current.getRemoteTracks(participantId);
  }, []);

  const leave = useCallback(async () => {
    if (!managerRef.current) return;

    try {
      await managerRef.current.leave();
      setInConference(false);
      setConnected(false);
      setParticipants([]);
    } catch (err) {
      setError(`Leave error: ${err}`);
    }
  }, []);

  return {
    initialized,
    connected,
    inConference,
    participants,
    error,
    connect,
    joinConference,
    addAudio,
    addVideo,
    removeAudio,
    removeVideo,
    toggleAudio,
    toggleVideo,
    getRemoteTracks,
    leave,
    manager: managerRef.current,
  };
};
