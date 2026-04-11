/**
 * CollaborativeModeRoom - Main collaborative study room component
 * Manages WebRTC connections, video/audio streams, and room interactions
 */

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, BookOpen, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWebRTC } from '@/utils/webrtc/useWebRTC';
import { getSupabaseClient } from '../../lib/api';
import { roomAPI, RoomChatMessage, RoomNoteEntry } from '@/utils/api/roomAPI';

interface CollaborativeModeRoomProps {
  roomName: string;
  roomId: string;
  roomCode?: string;
  maxParticipants?: number;
  subject: string;
  onLeaveRoom: () => void;
}

function hasErrorCode(error: unknown, code: string): boolean {
  const message = String(error instanceof Error ? error.message : error);
  return message.includes(`"${code}"`) || message.includes(code);
}

export function CollaborativeModeRoom({
  roomName,
  roomId,
  roomCode,
  maxParticipants = 20,
  subject,
  onLeaveRoom,
}: CollaborativeModeRoomProps) {
  const [userId, setUserId] = useState<string>('');
  const [currentUserName, setCurrentUserName] = useState('You');
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [codeCopyFeedback, setCodeCopyFeedback] = useState('');
  const [linkCopyFeedback, setLinkCopyFeedback] = useState('');
  const [participantCount, setParticipantCount] = useState(1);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState('');
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState('');
  const [switchingDevices, setSwitchingDevices] = useState(false);
  const [roomJoinError, setRoomJoinError] = useState('');
  const [roomNotes, setRoomNotes] = useState<RoomNoteEntry[]>([]);
  const [selectedRoomNoteId, setSelectedRoomNoteId] = useState<string | null>(null);
  const [loadingRoomNotes, setLoadingRoomNotes] = useState(false);
  const [savingRoomNote, setSavingRoomNote] = useState(false);
  const [deletingRoomNote, setDeletingRoomNote] = useState(false);
  const [noteSaveStatus, setNoteSaveStatus] = useState('');
  const [noteHeading, setNoteHeading] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [chatMessages, setChatMessages] = useState<RoomChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);
  const [chatError, setChatError] = useState('');
  const [participantDirectory, setParticipantDirectory] = useState<Record<string, string>>({});
  const [activeSideTab, setActiveSideTab] = useState<'notes' | 'chat'>('chat');
  const [isParticipantsPanelCollapsed, setIsParticipantsPanelCollapsed] = useState(false);

  // Get current user ID and verify authentication
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!session || !user) {
          console.error('[CollaborativeModeRoom] Not authenticated - no session');
          // Optionally redirect to login
          return;
        }
        
        console.log('[CollaborativeModeRoom] Authenticated as:', user.id);
        setUserId(user.id);
        const metadata = user.user_metadata ?? {};
        const resolvedName =
          (typeof metadata.name === 'string' && metadata.name.trim()) ||
          (typeof metadata.full_name === 'string' && metadata.full_name.trim()) ||
          user.email?.split('@')[0] ||
          'You';
        setCurrentUserName(resolvedName);
      } catch (err) {
        console.error('[CollaborativeModeRoom] Auth check error:', err);
      }
    };
    getCurrentUser();
  }, []);

  // Cleanup on tab close
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      // Leave room when tab is closed
      if (participantId && roomId) {
        try {
          await roomAPI.leaveRoom(roomId);
        } catch (err) {
          console.error('[CollaborativeModeRoom] Error leaving room on unload:', err);
        }
      }
      onLeaveRoom?.();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [participantId, roomId, onLeaveRoom]);

  // Memoize error handler
  const handleWebRTCError = useCallback((err: Error) => {
    console.error('[CollaborativeModeRoom] WebRTC error:', err);
  }, []);

  // Initialize WebRTC with audio enabled
  const {
    initialized,
    localStream,
    peers,
    error: webrtcError,
    toggleAudio,
    toggleVideo,
    setMediaDevices,
    isScreenSharing,
    startScreenShare,
    stopScreenShare,
  } = useWebRTC({
    roomId,
    userId,
    enableVideo: true,
    enableAudio: true,
    onError: handleWebRTCError,
  });

  // Handle audio toggle
  const handleToggleAudio = async () => {
    const nextState = !audioEnabled;
    try {
      await toggleAudio(nextState);
      setAudioEnabled(nextState);
      if (participantId) {
        await roomAPI.updateParticipant(participantId, {
          is_muted: !nextState,
          connection_state: 'connected',
        });
      }
    } catch (err) {
      console.error('[CollaborativeModeRoom] Failed to toggle audio device state:', err);
    }
  };

  // Handle video toggle
  const handleToggleVideo = async () => {
    const nextState = !videoEnabled;
    try {
      await toggleVideo(nextState);
      setVideoEnabled(nextState);
      if (participantId) {
        await roomAPI.updateParticipant(participantId, {
          is_video_off: !nextState,
          connection_state: 'connected',
        });
      }
    } catch (err) {
      console.error('[CollaborativeModeRoom] Failed to toggle video device state:', err);
    }
  };

  const handleToggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await stopScreenShare();
      } else {
        await startScreenShare();
      }
    } catch (err) {
      console.error('[CollaborativeModeRoom] Failed to toggle screen sharing:', err);
    }
  };

  const enumerateInputDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;

    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = devices.filter((device) => device.kind === 'audioinput');
    const videoInputs = devices.filter((device) => device.kind === 'videoinput');

    setAudioDevices(audioInputs);
    setVideoDevices(videoInputs);

    const currentAudioDeviceId = localStream?.getAudioTracks()[0]?.getSettings().deviceId ?? '';
    const currentVideoDeviceId = localStream?.getVideoTracks()[0]?.getSettings().deviceId ?? '';

    setSelectedAudioDeviceId((prev) => {
      if (currentAudioDeviceId && audioInputs.some((device) => device.deviceId === currentAudioDeviceId)) {
        return currentAudioDeviceId;
      }
      if (prev && audioInputs.some((device) => device.deviceId === prev)) {
        return prev;
      }
      return audioInputs[0]?.deviceId ?? '';
    });

    setSelectedVideoDeviceId((prev) => {
      if (currentVideoDeviceId && videoInputs.some((device) => device.deviceId === currentVideoDeviceId)) {
        return currentVideoDeviceId;
      }
      if (prev && videoInputs.some((device) => device.deviceId === prev)) {
        return prev;
      }
      return videoInputs[0]?.deviceId ?? '';
    });
  }, [localStream]);

  const handleCopyRoomCode = useCallback(async () => {
    if (!roomCode) return;

    try {
      await navigator.clipboard.writeText(roomCode);
      setCodeCopyFeedback('Copied');
      window.setTimeout(() => setCodeCopyFeedback(''), 1500);
    } catch (err) {
      console.error('[CollaborativeModeRoom] Failed to copy room code:', err);
      setCodeCopyFeedback('Copy failed');
      window.setTimeout(() => setCodeCopyFeedback(''), 1500);
    }
  }, [roomCode]);

  const roomShareUrl =
    roomCode && typeof window !== 'undefined'
      ? `${window.location.origin}/room/${roomCode}`
      : '';

  const handleCopyRoomLink = useCallback(async () => {
    if (!roomShareUrl) return;

    try {
      await navigator.clipboard.writeText(roomShareUrl);
      setLinkCopyFeedback('Copied');
      window.setTimeout(() => setLinkCopyFeedback(''), 1500);
    } catch (err) {
      console.error('[CollaborativeModeRoom] Failed to copy room link:', err);
      setLinkCopyFeedback('Copy failed');
      window.setTimeout(() => setLinkCopyFeedback(''), 1500);
    }
  }, [roomShareUrl]);

  useEffect(() => {
    if (!initialized) return;

    enumerateInputDevices().catch((err) => {
      console.warn('[CollaborativeModeRoom] Failed to enumerate media devices:', err);
    });

    const handleDeviceChange = () => {
      enumerateInputDevices().catch((err) => {
        console.warn('[CollaborativeModeRoom] Failed to refresh media devices:', err);
      });
    };

    if (navigator.mediaDevices?.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
      };
    }
  }, [enumerateInputDevices, initialized, localStream]);

  const handleAudioDeviceChange = useCallback(
    async (nextAudioDeviceId: string) => {
      if (!nextAudioDeviceId || nextAudioDeviceId === selectedAudioDeviceId) {
        return;
      }

      try {
        setSwitchingDevices(true);
        await setMediaDevices(nextAudioDeviceId, selectedVideoDeviceId || undefined);
        setSelectedAudioDeviceId(nextAudioDeviceId);
      } catch (err) {
        console.error('[CollaborativeModeRoom] Failed to switch audio device:', err);
      } finally {
        setSwitchingDevices(false);
      }
    },
    [selectedAudioDeviceId, selectedVideoDeviceId, setMediaDevices]
  );

  const handleVideoDeviceChange = useCallback(
    async (nextVideoDeviceId: string) => {
      if (!nextVideoDeviceId || nextVideoDeviceId === selectedVideoDeviceId) {
        return;
      }

      try {
        setSwitchingDevices(true);
        await setMediaDevices(selectedAudioDeviceId || undefined, nextVideoDeviceId);
        setSelectedVideoDeviceId(nextVideoDeviceId);
      } catch (err) {
        console.error('[CollaborativeModeRoom] Failed to switch video device:', err);
      } finally {
        setSwitchingDevices(false);
      }
    },
    [selectedAudioDeviceId, selectedVideoDeviceId, setMediaDevices]
  );

  useEffect(() => {
    if (!roomId || !userId) return;

    let cancelled = false;

    const ensureJoined = async () => {
      try {
        const participant = await roomAPI.joinRoom(roomId);
        if (!cancelled && participant?.id) {
          setParticipantId(participant.id);
        }
        if (!cancelled) {
          setRoomJoinError('');
          console.log('[CollaborativeModeRoom] Joined room roster for:', roomId);
        }
      } catch (err) {
        if (hasErrorCode(err, 'ALREADY_IN_ANOTHER_ROOM')) {
          if (!cancelled) {
            setRoomJoinError('You are already active in another room. Leave it before joining this one.');
          }
          return;
        }

        if (hasErrorCode(err, 'ALREADY_JOINED_THIS_ROOM')) {
          if (!cancelled) {
            setRoomJoinError('You already joined this room from another tab/device. Leave that session first.');
          }
          return;
        }

        if (hasErrorCode(err, 'ROOM_FULL')) {
          try {
            const room = await roomAPI.getRoom(roomId);
            const alreadyPresent = (room.participants ?? []).some(
              (participant) => participant.user_id === userId && participant.disconnected_at == null
            );

            if (alreadyPresent) {
              if (!cancelled) {
                setRoomJoinError('This room is full. You already appear in the roster but new device join is blocked.');
              }
              return;
            }
          } catch {
            // Ignore secondary lookup failures and fall through to the original error log.
          }
        }

        if (!cancelled) {
          setRoomJoinError('Unable to join this room right now. Try again in a few seconds.');
          console.error('[CollaborativeModeRoom] Failed to join room roster:', err);
        }
      }
    };

    ensureJoined();

    return () => {
      cancelled = true;
    };
  }, [roomId, userId]);

  useEffect(() => {
    if (!roomId || !userId || !initialized) return;

    let active = true;

    const loadNotes = async () => {
      setLoadingRoomNotes(true);
      try {
        const notes = await roomAPI.listRoomNotes(roomId);
        if (active) {
          setRoomNotes(notes);
          setSelectedRoomNoteId((current) => {
            if (current && notes.some((note) => note.id === current)) {
              return current;
            }
            return notes[0]?.id ?? null;
          });
          if (notes.length === 0) {
            setNoteHeading('');
            setNoteBody('');
          }
        }
      } catch (err) {
        if (active) {
          console.warn('[CollaborativeModeRoom] Failed to load room notes:', err);
        }
      } finally {
        if (active) {
          setLoadingRoomNotes(false);
        }
      }
    };

    loadNotes();

    return () => {
      active = false;
    };
  }, [initialized, roomId, userId]);

  useEffect(() => {
    const selected = roomNotes.find((note) => note.id === selectedRoomNoteId) ?? null;
    if (!selected) {
      return;
    }
    setNoteHeading(selected.heading);
    setNoteBody(selected.body);
  }, [roomNotes, selectedRoomNoteId]);

  const createRoomNote = useCallback(async () => {
    if (!roomId || !userId) return;

    try {
      setSavingRoomNote(true);
      const created = await roomAPI.createRoomNote(roomId, {
        heading: 'Untitled note',
        body: '',
      });
      setRoomNotes((prev) => [created, ...prev]);
      setSelectedRoomNoteId(created.id);
      setNoteHeading(created.heading);
      setNoteBody(created.body);
      setNoteSaveStatus('Saved');
      window.setTimeout(() => setNoteSaveStatus(''), 1500);
    } catch (err) {
      console.error('[CollaborativeModeRoom] Failed to create room note:', err);
      setNoteSaveStatus('Create failed');
      window.setTimeout(() => setNoteSaveStatus(''), 1800);
    } finally {
      setSavingRoomNote(false);
    }
  }, [roomId, userId]);

  const saveRoomNote = useCallback(async () => {
    if (!roomId || !userId || !selectedRoomNoteId) return;

    const headingToSave = noteHeading.trim() || 'Untitled note';
    const bodyToSave = noteBody;

    try {
      setSavingRoomNote(true);
      const updated = await roomAPI.updateRoomNote(roomId, selectedRoomNoteId, {
        heading: headingToSave,
        body: bodyToSave,
      });
      setRoomNotes((prev) =>
        prev
          .map((note) => (note.id === updated.id ? updated : note))
          .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
      );
      setNoteHeading(updated.heading);
      setNoteBody(updated.body);
      setNoteSaveStatus('Saved');
      window.setTimeout(() => setNoteSaveStatus(''), 1500);
    } catch (err) {
      console.error('[CollaborativeModeRoom] Failed to save room note:', err);
      setNoteSaveStatus('Save failed');
      window.setTimeout(() => setNoteSaveStatus(''), 1800);
    } finally {
      setSavingRoomNote(false);
    }
  }, [noteBody, noteHeading, roomId, selectedRoomNoteId, userId]);

  const deleteRoomNote = useCallback(async () => {
    if (!roomId || !userId || !selectedRoomNoteId) return;

    try {
      setDeletingRoomNote(true);
      await roomAPI.deleteRoomNote(roomId, selectedRoomNoteId);
      const refreshedNotes = await roomAPI.listRoomNotes(roomId);
      setRoomNotes(refreshedNotes);
      const nextSelected = refreshedNotes[0] ?? null;
      setSelectedRoomNoteId(nextSelected?.id ?? null);
      setNoteHeading(nextSelected?.heading ?? '');
      setNoteBody(nextSelected?.body ?? '');
      setNoteSaveStatus('Deleted');
      window.setTimeout(() => setNoteSaveStatus(''), 1500);
    } catch (err) {
      console.error('[CollaborativeModeRoom] Failed to delete room note:', err);
      setNoteSaveStatus('Delete failed');
      window.setTimeout(() => setNoteSaveStatus(''), 1800);
    } finally {
      setDeletingRoomNote(false);
    }
  }, [roomId, selectedRoomNoteId, userId]);

  useEffect(() => {
    if (!roomId || !userId || !initialized) return;

    let active = true;
    let timer: NodeJS.Timeout | null = null;

    const loadChat = async () => {
      try {
        const messages = await roomAPI.getRoomChatMessages(roomId, 100);
        if (active) {
          setChatMessages(messages);
          setChatError('');
        }
      } catch (err) {
        if (active) {
          console.warn('[CollaborativeModeRoom] Failed to load room chat:', err);
          setChatError('Unable to load chat right now');
        }
      }

      if (active) {
        timer = setTimeout(loadChat, 2000);
      }
    };

    loadChat();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [initialized, roomId, userId]);

  const sendChatMessage = useCallback(async () => {
    if (!roomId || !userId) return;
    const message = chatInput.trim();
    if (!message) return;

    try {
      setSendingChat(true);
      const sent = await roomAPI.sendRoomChatMessage(roomId, message);
      setChatMessages((prev) => [...prev, sent]);
      setChatInput('');
      setChatError('');
    } catch (err) {
      console.error('[CollaborativeModeRoom] Failed to send room chat message:', err);
      setChatError('Message failed to send');
    } finally {
      setSendingChat(false);
    }
  }, [chatInput, roomId, userId]);

  useEffect(() => {
    if (!participantId) return;

    let active = true;
    let timer: NodeJS.Timeout | null = null;

    const sendHeartbeat = async () => {
      try {
        await roomAPI.updateParticipant(participantId, {
          last_heartbeat: new Date().toISOString(),
          connection_state: 'connecting',
        });
      } catch (err) {
        if (active) {
          console.warn('[CollaborativeModeRoom] Failed to send participant heartbeat:', err);
        }
      }

      if (active) {
        timer = setTimeout(sendHeartbeat, 10000);
      }
    };

    sendHeartbeat();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [participantId]);

  useEffect(() => {
    if (!roomId || !userId) return;

    let active = true;
    let timer: NodeJS.Timeout | null = null;

    const syncParticipantCount = async () => {
      try {
        const room = await roomAPI.getRoom(roomId);
        const activeRoomParticipants =
          room.participants?.filter((participant) => participant.disconnected_at == null) ?? [];
        const activeParticipants = activeRoomParticipants.length;

        if (active) {
          setParticipantCount(Math.max(activeParticipants, 1));
          const directory = activeRoomParticipants.reduce<Record<string, string>>(
            (acc, participant) => {
              if (participant.user_id) {
                acc[participant.user_id] =
                  participant.display_name || participant.user_id.slice(0, 8);
              }
              return acc;
            },
            {}
          );
          if (userId && !directory[userId]) {
            directory[userId] = currentUserName;
          }
          setParticipantDirectory(directory);
        }
      } catch (err) {
        console.warn('[CollaborativeModeRoom] Failed to sync participant count:', err);
      }

      if (active) {
        timer = setTimeout(syncParticipantCount, 3000);
      }
    };

    syncParticipantCount();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [currentUserName, roomId, userId]);

  // Handle leave room
  const handleLeaveRoom = async () => {
    try {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      await roomAPI.leaveRoom(roomId);
      onLeaveRoom();
    } catch (err) {
      console.error('[CollaborativeModeRoom] Error leaving room:', err);
    }
  };

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#202124] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          <p className="text-sm text-white/80">Preparing room...</p>
        </div>
      </div>
    );
  }

  const localVideoTrack = localStream?.getVideoTracks()[0] ?? null;
  const localVideoVisible =
    !!localVideoTrack && localVideoTrack.readyState === 'live' && videoEnabled;
  const localParticipantLabel = participantDirectory[userId] || currentUserName || 'You';

  return (
    <div className="flex min-h-screen flex-col bg-[#202124] text-white">
      <div className="border-b border-white/10 bg-[#1f1f20]/95 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{roomName}</h1>
            <p className="mt-1 text-sm text-white/70">{subject}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {roomShareUrl ? (
              <div className="flex max-w-[420px] items-center gap-2 rounded-full border border-[#3c4043] bg-[#2b2c2f] px-3 py-2 text-sm text-white/80">
                <span className="shrink-0 text-xs uppercase tracking-[0.14em] text-white/55">Room URL</span>
                <span className="truncate">{roomShareUrl}</span>
                <button
                  onClick={handleCopyRoomLink}
                  className="shrink-0 rounded-full border border-[#5f6368] px-2 py-0.5 text-xs text-white/80 transition hover:bg-[#3c4043]"
                >
                  {linkCopyFeedback || 'Copy'}
                </button>
              </div>
            ) : null}
            <div className="rounded-full border border-[#3c4043] bg-[#2b2c2f] px-4 py-2 text-sm text-[#8ab4f8]">
              End-to-End encrypted
            </div>
            <div className="rounded-full border border-[#3c4043] bg-[#2b2c2f] px-4 py-2 text-sm text-white/80">
              {participantCount}/{maxParticipants} participants
            </div>
            <button
              onClick={handleLeaveRoom}
              className="rounded-full bg-[#ea4335] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#dc3527]"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4 pb-4 pt-4 sm:px-6">
        {webrtcError && (
          <div className="mb-4 rounded-xl border border-[#5f2f2f] bg-[#3b1f1f]/90 p-4">
            <p className="font-medium text-[#ffb8b8]">Error: {webrtcError.message}</p>
            <p className="mt-2 text-sm text-[#ffdede]">
              Signaling or media negotiation failed. Keep this room open on both devices and check the browser console for the first WebRTC error line.
            </p>
          </div>
        )}
        {roomJoinError ? (
          <div className="mb-4 rounded-xl border border-[#614b1f] bg-[#3e2f12]/90 p-4">
            <p className="font-medium text-[#ffd27d]">{roomJoinError}</p>
          </div>
        ) : null}

        {!initialized ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#8ab4f8]" />
              <p className="text-lg text-white">Initializing your room...</p>
              <p className="mt-2 text-sm text-white/70">Signed in as {localParticipantLabel}</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col gap-4 lg:flex-row">
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="grid flex-1 auto-rows-[minmax(220px,1fr)] grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div className="relative overflow-hidden rounded-2xl border border-[#3c4043] bg-[#2b2c2f]">
                  {localStream && localVideoVisible ? (
                    <video
                      autoPlay
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                      ref={(video) => {
                        if (!video || !localStream) return;
                        if (video.srcObject !== localStream) {
                          video.srcObject = localStream;
                        }
                        void video.play().catch(() => {});
                      }}
                    />
                  ) : (
                    <div className="flex h-full min-h-[220px] items-center justify-center bg-[#303134] text-sm text-white/70">
                      Camera is off
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-sm text-white">
                    {localParticipantLabel} (You)
                    {isScreenSharing ? ' | Sharing screen' : ''}
                    {!audioEnabled ? ' | Mic off' : ''}
                  </div>
                </div>

                {peers.map((peer) => {
                  const peerLabel =
                    participantDirectory[peer.peerId] || `Participant ${peer.peerId.slice(0, 8)}`;
                  const peerVideoTrack = peer.stream?.getVideoTracks()[0] ?? null;
                  const peerVideoVisible =
                    !!peerVideoTrack &&
                    peerVideoTrack.readyState === 'live' &&
                    peerVideoTrack.enabled;

                  return (
                    <div
                      key={peer.peerId}
                      className="relative overflow-hidden rounded-2xl border border-[#3c4043] bg-[#2b2c2f]"
                    >
                      {peer.stream && peerVideoVisible ? (
                        <video
                          autoPlay
                          playsInline
                          className="h-full w-full object-cover"
                          ref={(video) => {
                            if (!video || !peer.stream) return;
                            if (video.srcObject !== peer.stream) {
                              video.srcObject = peer.stream;
                            }
                            void video.play().catch(() => {});
                          }}
                        />
                      ) : (
                        <div className="flex h-full min-h-[220px] items-center justify-center bg-[#303134] text-sm text-white/70">
                          {peer.connectionState === 'connected'
                            ? `${peerLabel} camera is off`
                            : `Connecting to ${peerLabel}...`}
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-sm text-white">
                        {peerLabel}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-[#3c4043] bg-[#2b2c2f] p-3">
                <div className="grid gap-3 lg:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-[0.16em] text-white/60">Microphone</label>
                    <select
                      value={selectedAudioDeviceId}
                      onChange={(event) => {
                        void handleAudioDeviceChange(event.target.value);
                      }}
                      disabled={switchingDevices || audioDevices.length === 0}
                      className="w-full rounded-xl border border-[#5f6368] bg-[#202124] px-3 py-2 text-sm text-white outline-none transition focus:border-[#8ab4f8]"
                    >
                      {audioDevices.length === 0 ? (
                        <option value="">No microphone detected</option>
                      ) : (
                        audioDevices.map((device, index) => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Microphone ${index + 1}`}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-[0.16em] text-white/60">Camera</label>
                    <select
                      value={selectedVideoDeviceId}
                      onChange={(event) => {
                        void handleVideoDeviceChange(event.target.value);
                      }}
                      disabled={switchingDevices || videoDevices.length === 0}
                      className="w-full rounded-xl border border-[#5f6368] bg-[#202124] px-3 py-2 text-sm text-white outline-none transition focus:border-[#8ab4f8]"
                    >
                      {videoDevices.length === 0 ? (
                        <option value="">No camera detected</option>
                      ) : (
                        videoDevices.map((device, index) => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Camera ${index + 1}`}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => {
                    void handleToggleAudio();
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    audioEnabled ? 'bg-[#3c4043] hover:bg-[#5f6368]' : 'bg-[#ea4335] hover:bg-[#dc3527]'
                  }`}
                >
                  {audioEnabled ? 'Mute' : 'Unmute'}
                </button>
                <button
                  onClick={() => {
                    void handleToggleVideo();
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    videoEnabled ? 'bg-[#3c4043] hover:bg-[#5f6368]' : 'bg-[#ea4335] hover:bg-[#dc3527]'
                  }`}
                >
                  {videoEnabled ? 'Stop Video' : 'Start Video'}
                </button>
                <button
                  onClick={() => {
                    void handleToggleScreenShare();
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isScreenSharing ? 'bg-[#1a73e8] hover:bg-[#1767cc]' : 'bg-[#3c4043] hover:bg-[#5f6368]'
                  }`}
                >
                  {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
                </button>
              </div>
            </div>

            <div className="w-full shrink-0 lg:w-[360px] xl:w-[420px]">
              <div className="flex h-full flex-col gap-4">
                <div className="rounded-2xl border border-[#3c4043] bg-[#2b2c2f] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/60">Room Code</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="truncate text-lg font-semibold">{roomCode ?? 'Private room'}</p>
                    {roomCode ? (
                      <button
                        onClick={handleCopyRoomCode}
                        className="rounded-full border border-[#5f6368] px-3 py-1 text-xs text-white/80 transition hover:bg-[#3c4043]"
                      >
                        {codeCopyFeedback || 'Copy'}
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#3c4043] bg-[#2b2c2f] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/60">Participants</p>
                    <button
                      onClick={() => setIsParticipantsPanelCollapsed(!isParticipantsPanelCollapsed)}
                      className="rounded-full p-1 transition hover:bg-[#3c4043]"
                      title={isParticipantsPanelCollapsed ? 'Expand' : 'Collapse'}
                    >
                      {isParticipantsPanelCollapsed ? (
                        <ChevronRight className="size-4 text-white/60" />
                      ) : (
                        <ChevronLeft className="size-4 text-white/60" />
                      )}
                    </button>
                  </div>
                  {!isParticipantsPanelCollapsed && (
                    <div className="max-h-36 space-y-2 overflow-y-auto">
                      {Object.entries(participantDirectory).length === 0 ? (
                        <p className="text-sm text-white/70">No active participants yet.</p>
                      ) : (
                        Object.entries(participantDirectory).map(([id, name]) => (
                          <div
                            key={id}
                            className="flex items-center justify-between rounded-xl border border-[#3c4043] bg-[#202124] px-3 py-2 text-sm"
                          >
                            <span className="truncate text-white/90">{name}</span>
                            {id === userId ? (
                              <span className="rounded-full bg-[#1a73e8]/20 px-2 py-0.5 text-xs text-[#8ab4f8]">You</span>
                            ) : null}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-[#3c4043] bg-[#2b2c2f] p-4">
                  <div className="mb-3 flex gap-2">
                    <button
                      onClick={() => setActiveSideTab('chat')}
                      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${
                        activeSideTab === 'chat'
                          ? 'bg-[#1a73e8] text-white'
                          : 'bg-[#202124] text-white/70 hover:bg-[#3c4043]'
                      }`}
                    >
                      <MessageSquare className="size-4" />
                      Chat
                    </button>
                    <button
                      onClick={() => setActiveSideTab('notes')}
                      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${
                        activeSideTab === 'notes'
                          ? 'bg-[#1a73e8] text-white'
                          : 'bg-[#202124] text-white/70 hover:bg-[#3c4043]'
                      }`}
                    >
                      <BookOpen className="size-4" />
                      Notes
                    </button>
                  </div>

                  {activeSideTab === 'notes' ? (
                    <div className="flex min-h-0 flex-1 flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-white/70">Private notes for this room</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              void createRoomNote();
                            }}
                            disabled={savingRoomNote || loadingRoomNotes}
                            className="rounded-full border border-[#5f6368] px-3 py-1 text-xs font-medium text-white/85 transition hover:bg-[#3c4043] disabled:opacity-60"
                          >
                            Add Note
                          </button>
                          <button
                            onClick={() => {
                              void saveRoomNote();
                            }}
                            disabled={savingRoomNote || loadingRoomNotes || !selectedRoomNoteId}
                            className="rounded-full bg-[#1a73e8] px-3 py-1 text-xs font-medium text-white transition hover:bg-[#1767cc] disabled:opacity-60"
                          >
                            {savingRoomNote ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => {
                              void deleteRoomNote();
                            }}
                            disabled={deletingRoomNote || !selectedRoomNoteId}
                            className="rounded-full bg-[#ea4335] px-3 py-1 text-xs font-medium text-white transition hover:bg-[#dc3527] disabled:opacity-60"
                          >
                            {deletingRoomNote ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>

                      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 xl:grid-cols-[150px_1fr]">
                        <div className="max-h-[220px] space-y-1 overflow-y-auto rounded-xl border border-[#5f6368] bg-[#202124] p-2">
                          {loadingRoomNotes ? (
                            <p className="px-2 py-1 text-xs text-white/60">Loading notes...</p>
                          ) : roomNotes.length === 0 ? (
                            <p className="px-2 py-1 text-xs text-white/60">No notes yet</p>
                          ) : (
                            roomNotes.map((note) => (
                              <button
                                key={note.id}
                                onClick={() => setSelectedRoomNoteId(note.id)}
                                className={`w-full rounded-lg px-2 py-2 text-left text-xs transition ${
                                  selectedRoomNoteId === note.id
                                    ? 'bg-[#1a73e8]/25 text-white'
                                    : 'bg-[#303134] text-white/80 hover:bg-[#3c4043]'
                                }`}
                              >
                                <p className="truncate font-medium">{note.heading}</p>
                                <p className="mt-0.5 truncate text-[10px] text-white/60">
                                  {new Date(note.updated_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </button>
                            ))
                          )}
                        </div>

                        <div className="flex min-h-[220px] flex-1 flex-col gap-2">
                          <input
                            value={noteHeading}
                            onChange={(event) => setNoteHeading(event.target.value)}
                            placeholder="Heading"
                            disabled={!selectedRoomNoteId}
                            className="rounded-xl border border-[#5f6368] bg-[#202124] px-3 py-2 text-sm text-white outline-none transition focus:border-[#8ab4f8] disabled:opacity-60"
                          />
                          <textarea
                            value={noteBody}
                            onChange={(event) => setNoteBody(event.target.value)}
                            placeholder={
                              selectedRoomNoteId
                                ? 'Write your note body...'
                                : 'Create a note to start writing'
                            }
                            disabled={!selectedRoomNoteId}
                            className="min-h-0 flex-1 resize-none rounded-xl border border-[#5f6368] bg-[#202124] p-3 text-sm text-white outline-none transition focus:border-[#8ab4f8] disabled:opacity-60"
                          />
                        </div>
                      </div>
                      {noteSaveStatus ? <p className="text-xs text-white/70">{noteSaveStatus}</p> : null}
                    </div>
                  ) : (
                    <div className="flex min-h-0 flex-1 flex-col">
                      <div className="mb-2 text-sm text-white/70">{chatMessages.length} messages</div>
                      <div className="min-h-[220px] flex-1 space-y-2 overflow-y-auto rounded-xl border border-[#5f6368] bg-[#202124] p-3">
                        {chatMessages.length === 0 ? (
                          <p className="text-sm text-white/70">No messages yet.</p>
                        ) : (
                          chatMessages.map((message) => {
                            const isMe = message.sender_user_id === userId;
                            return (
                              <div
                                key={message.id}
                                className={`rounded-lg px-3 py-2 text-sm ${
                                  isMe ? 'bg-[#1a73e8]/30 text-white' : 'bg-[#303134] text-white'
                                }`}
                              >
                                <p className="text-xs font-semibold text-white/70">
                                  {isMe ? localParticipantLabel : message.sender?.name || 'Participant'}
                                </p>
                                <p>{message.message}</p>
                              </div>
                            );
                          })
                        )}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <input
                          value={chatInput}
                          onChange={(event) => setChatInput(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault();
                              void sendChatMessage();
                            }
                          }}
                          placeholder="Message everyone..."
                          className="flex-1 rounded-xl border border-[#5f6368] bg-[#202124] px-3 py-2 text-sm text-white outline-none transition focus:border-[#8ab4f8]"
                        />
                        <button
                          onClick={() => {
                            void sendChatMessage();
                          }}
                          disabled={sendingChat || chatInput.trim().length === 0}
                          className="rounded-xl bg-[#1a73e8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1767cc] disabled:opacity-60"
                        >
                          {sendingChat ? '...' : 'Send'}
                        </button>
                      </div>
                      {chatError ? <p className="mt-1 text-xs text-[#ffb8b8]">{chatError}</p> : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
