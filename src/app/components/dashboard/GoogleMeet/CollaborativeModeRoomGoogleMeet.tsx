/**
 * CollaborativeModeRoomGoogleMeet
 * Google Meet-style collaborative room — production-grade redesign
 *
 * Layout:
 *   ┌─────────────────────────────────────────────────────┐
 *   │  MeetHeader (fixed top)                             │
 *   ├──────────────────────────────┬──────────────────────┤
 *   │  VideoGrid (flex-1)          │  ChatPanel / People  │
 *   │                              │  (slide-in sidebar)  │
 *   ├──────────────────────────────┴──────────────────────┤
 *   │  ControlBar (fixed bottom)                          │
 *   └─────────────────────────────────────────────────────┘
 *   Floating self-view tile (bottom-right, draggable)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, VideoOff } from 'lucide-react';
import { useWebRTC } from '@/utils/webrtc/useWebRTC';
import { getSupabaseClient } from '../../../lib/api';
import { roomAPI, type RoomChatMessage } from '@/utils/api/roomAPI';
import { useNavigate, useLocation } from 'react-router-dom';

import { MeetHeader } from './MeetHeader';
import { VideoGrid } from './VideoGrid';
import { ControlBar } from './ControlBar';
import { ChatPanel, type ChatMessage } from './ChatPanel';
import { ParticipantsPanel } from './ParticipantsPanel';
import { SettingsModal } from './SettingsModal';

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface Props {
  roomName: string;
  roomId: string;
  roomCode?: string;
  maxParticipants?: number;
  subject: string;
  onLeaveRoom: () => void;
}

interface RemoteParticipant {
  peerId: string;
  name: string;
  stream?: MediaStream | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function hasCode(err: unknown, code: string) {
  const msg = String(err instanceof Error ? err.message : err);
  return msg.includes(code);
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function CollaborativeModeRoomGoogleMeet({
  roomName,
  roomId,
  roomCode,
  maxParticipants = 20,
  subject,
  onLeaveRoom,
}: Props) {
  /* auth */
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('You');

  /* media state */
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [backgroundBlurred, setBackgroundBlurred] = useState(false);
  const [noiseSuppression, setNoiseSuppression] = useState(false);

  /* room state */
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [hostUserId, setHostUserId] = useState<string | null>(null);
  const [participantDirectory, setParticipantDirectory] = useState<Record<string, string>>({});
  const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipant[]>([]);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
  const [pinnedParticipantId, setPinnedParticipantId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [joinError, setJoinError] = useState('');

  /* devices */
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioId, setSelectedAudioId] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [selectedOutputId, setSelectedOutputId] = useState('');

  /* panels */
  const [showChat, setShowChat] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showControlBar, setShowControlBar] = useState(true);
  const [isHoveringControls, setIsHoveringControls] = useState(false);

  /* chat */
  const [chatMessages, setChatMessages] = useState<RoomChatMessage[]>([]);
  const [chatDraft, setChatDraft] = useState('');
  const [sendingChat, setSendingChat] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastSeenMsgCount = useRef(0);

  /* self-view floating tile */
  const selfViewRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const hasLeftRoomRef = useRef(false);

  /* ── Sync browser URL to room without reloading ── */
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!roomCode) return;
    const target = `/room/${roomCode}`;
    if (location.pathname !== target) {
      navigate(target, { replace: true });
    }
    return () => {
      // Restore previous path on leave without reloading
      navigate(location.pathname === target ? -1 as any : location.pathname, { replace: true });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode]);

  /* ── Auth ── */
  useEffect(() => {
    (async () => {
      try {
        const sb = getSupabaseClient();
        const { data: { session } } = await sb.auth.getSession();
        const { data: { user } } = await sb.auth.getUser();
        if (!session || !user) return;
        setUserId(user.id);
        const m = user.user_metadata ?? {};
        setUserName(
          (typeof m.name === 'string' && m.name.trim()) ||
          (typeof m.full_name === 'string' && m.full_name.trim()) ||
          user.email?.split('@')[0] ||
          'You'
        );
      } catch {
        setJoinError('Unable to restore your session.');
      }
    })();
  }, []);

  /* ── Enumerate devices ── */
  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    navigator.mediaDevices.enumerateDevices().then((devs) => {
      const ai = devs.filter((d) => d.kind === 'audioinput');
      const vi = devs.filter((d) => d.kind === 'videoinput');
      const ao = devs.filter((d) => d.kind === 'audiooutput');
      setAudioDevices(ai);
      setVideoDevices(vi);
      setAudioOutputDevices(ao);
      setSelectedAudioId((p) => p || ai[0]?.deviceId || '');
      setSelectedVideoId((p) => p || vi[0]?.deviceId || '');
      setSelectedOutputId((p) => p || ao[0]?.deviceId || '');
    }).catch(() => {});
  }, []);

  const onWebRTCError = useCallback(() => {
    setJoinError('A connection issue occurred. Please try reconnecting.');
  }, []);

  /* ── WebRTC ── */
  const {
    initialized,
    localStream,
    peers,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    isScreenSharing,
  } = useWebRTC({
    roomId,
    userId,
    enableVideo: true,
    enableAudio: true,
    onError: onWebRTCError,
  });

  /* ── Sync remote participants ── */
  useEffect(() => {
    if (!peers) return;
    setRemoteParticipants(
      peers.map((p) => ({
        peerId: p.peerId,
        name: participantDirectory[p.peerId] || `Participant ${p.peerId.slice(0, 4)}`,
        stream: p.stream,
        audioEnabled: p.audioEnabled ?? true,
        videoEnabled: p.videoEnabled ?? true,
      }))
    );
    // Update connection status when peers are found
    if (peers.length > 0) {
      setIsConnected(true);
    }
  }, [peers, participantDirectory]);

  /* ── Join room roster ── */
  useEffect(() => {
    if (!roomId || !userId || !initialized) return;
    let cancelled = false;

    (async () => {
      try {
        const participant = await roomAPI.joinRoom(roomId);
        if (cancelled) return;
        if (participant?.id) setParticipantId(participant.id);
        setIsConnected(true);
        setParticipantDirectory((prev) => ({ ...prev, [userId]: userName }));
        setJoinError('');
      } catch (err) {
        if (cancelled) return;
        if (hasCode(err, 'ALREADY_JOINED_THIS_ROOM')) {
          // Already a member (e.g. creator auto-joined). Treat as success.
          try {
            const room = await roomAPI.getRoom(roomId);
            const existing = (room.participants ?? []).find(
              (p: any) => p.user_id === userId && p.disconnected_at == null
            );
            if (existing?.id && !cancelled) setParticipantId(existing.id);
          } catch { /* best-effort */ }
          if (!cancelled) {
            setIsConnected(true);
            setJoinError('');
          }
          return;
        }
        if (hasCode(err, 'ALREADY_IN_ANOTHER_ROOM')) {
          setJoinError('You are active in another room. Leave it first.');
          return;
        }
        setJoinError('Failed to join room. Please try again.');
      }
    })();

    return () => { cancelled = true; };
  }, [roomId, userId, initialized, userName]);

  /* ── Participant directory sync ── */
  useEffect(() => {
    if (!roomId || !userId) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;

    const sync = async () => {
      try {
        const room = await roomAPI.getRoom(roomId);
        if (!active) return;
        const dir: Record<string, string> = {};
        (room.participants ?? [])
          .filter((p: { disconnected_at: string | null }) => p.disconnected_at == null)
          .forEach((p: { user_id: string; display_name?: string }) => {
            if (p.user_id) dir[p.user_id] = p.display_name || p.user_id.slice(0, 8);
          });
        if (userId && !dir[userId]) dir[userId] = userName;
        setHostUserId(room.host_id ?? null);
        setParticipantDirectory(dir);
        setPinnedParticipantId((currentPinnedId) =>
          currentPinnedId && !Object.prototype.hasOwnProperty.call(dir, currentPinnedId)
            ? null
            : currentPinnedId
        );
      } catch { /* silent */ }
      if (active) timer = setTimeout(sync, 1500); // Increased from 4000ms for faster updates
    };

    sync();
    return () => { active = false; clearTimeout(timer); };
  }, [roomId, userId, userName]);

  /* ── Heartbeat ── */
  useEffect(() => {
    if (!participantId) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;

    const beat = async () => {
      try {
        await roomAPI.updateParticipant(participantId, {
          last_heartbeat: new Date().toISOString(),
          connection_state: 'connected',
        });
      } catch { /* silent */ }
      if (active) timer = setTimeout(beat, 10_000);
    };

    beat();
    return () => { active = false; clearTimeout(timer); };
  }, [participantId]);

  /* ── Chat polling ── */
  useEffect(() => {
    if (!roomId || !userId || !initialized) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;

    const load = async () => {
      try {
        const msgs = await roomAPI.getRoomChatMessages(roomId, 100);
        if (!active) return;
        setChatMessages(msgs);
        if (!showChat) {
          const newCount = msgs.length - lastSeenMsgCount.current;
          if (newCount > 0) setUnreadCount((c) => c + newCount);
        }
        lastSeenMsgCount.current = msgs.length;
      } catch { /* silent */ }
      if (active) timer = setTimeout(load, 2500);
    };

    load();
    return () => { active = false; clearTimeout(timer); };
  }, [roomId, userId, initialized, showChat]);

  /* ── Audio elements for peers ── */
  useEffect(() => {
    const audioContainerId = 'webrtc-audio-container';
    let container = document.getElementById(audioContainerId) as HTMLDivElement | null;
    
    // Create container if it doesn't exist
    if (!container) {
      container = document.createElement('div');
      container.id = audioContainerId;
      container.style.display = 'none';
      document.body.appendChild(container);
    }
    
    // Track which peers currently have audio elements
    const peerIds = new Set(peers.map((p) => p.peerId));
    const existingAudioIds = Array.from(container.querySelectorAll('audio')).map((el) => el.id);
    
    // Remove audio elements for peers no longer in the room
    existingAudioIds.forEach((id) => {
      const peerId = id.replace('audio-peer-', '');
      if (!peerIds.has(peerId)) {
        const el = document.getElementById(id);
        if (el) {
          el.pause();
          el.srcObject = null;
          el.remove();
        }
      }
    });
    
    // Add or update audio elements for current peers
    peers.forEach((peer) => {
      if (!peer.stream || !peer.stream.getAudioTracks().length) return;
      
      const id = `audio-peer-${peer.peerId}`;
      let el = document.getElementById(id) as HTMLAudioElement | null;
      
      if (!el) {
        el = document.createElement('audio');
        el.id = id;
        el.autoplay = true;
        el.controls = false;
        el.style.display = 'none';
        container!.appendChild(el);
      }
      
      // Only update srcObject if it has changed
      if (el.srcObject !== peer.stream) {
        el.srcObject = peer.stream;
      }
    });
  }, [peers]);

  /* ── Cleanup audio elements on unmount ── */
  useEffect(() => {
    return () => {
      const container = document.getElementById('webrtc-audio-container');
      if (container) {
        Array.from(container.querySelectorAll('audio')).forEach((el) => {
          el.pause();
          el.srcObject = null;
          el.remove();
        });
        container.remove();
      }
    };
  }, []);

  /* ── Tab close / navigation cleanup ── */
  useEffect(() => {
    const handler = () => {
      void roomAPI.leaveRoom(roomId, { keepalive: true });
    };
    window.addEventListener('beforeunload', handler);
    window.addEventListener('pagehide', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
      window.removeEventListener('pagehide', handler);
    };
  }, [roomId]);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === 'm') { e.preventDefault(); void handleToggleAudio(); }
      if (e.key.toLowerCase() === 'v') { e.preventDefault(); void handleToggleVideo(); }
      if (e.key.toLowerCase() === 'c') { e.preventDefault(); handleToggleChat(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioEnabled, videoEnabled]);

  /* Auto-hide control bar */
  useEffect(() => {
    setShowControlBar(true);
    if (showChat || showPeople || showSettings || isHoveringControls) return;
    const timeoutId = window.setTimeout(() => setShowControlBar(false), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [
    showChat,
    showPeople,
    showSettings,
    isHoveringControls,
    audioEnabled,
    videoEnabled,
    isScreenSharing,
    pinnedParticipantId,
  ]);

  useEffect(() => {
    const handlePointerMove = (event: MouseEvent) => {
      if (event.clientY >= window.innerHeight - 120) setShowControlBar(true);
    };
    const handleKeyDown = () => setShowControlBar(true);

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  /* ── Draggable self-view ── */
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    const el = selfViewRef.current;
    if (!el) return;
    isDragging.current = true;
    const rect = el.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current || !el) return;
      const x = ev.clientX - dragOffset.current.x;
      const y = ev.clientY - dragOffset.current.y;
      el.style.left = `${Math.max(0, Math.min(window.innerWidth - el.offsetWidth, x))}px`;
      el.style.top = `${Math.max(0, Math.min(window.innerHeight - el.offsetHeight, y))}px`;
      el.style.right = 'auto';
      el.style.bottom = 'auto';
    };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp, { once: true });
  }, []);

  /* ── Handlers ── */
  const handleToggleAudio = useCallback(async () => {
    const next = !audioEnabled;
    try {
      await toggleAudio(next);
      setAudioEnabled(next);
      if (participantId) {
        await roomAPI.updateParticipant(participantId, { is_muted: !next, connection_state: 'connected' });
      }
    } catch { /* silent */ }
  }, [audioEnabled, toggleAudio, participantId]);

  const handleToggleVideo = useCallback(async () => {
    const next = !videoEnabled;
    try {
      await toggleVideo(next);
      setVideoEnabled(next);
      if (participantId) {
        await roomAPI.updateParticipant(participantId, { is_video_off: !next, connection_state: 'connected' });
      }
    } catch { /* silent */ }
  }, [videoEnabled, toggleVideo, participantId]);

  const handleScreenShare = useCallback(async () => {
    try {
      if (isScreenSharing) await stopScreenShare();
      else await startScreenShare();
      setShowControlBar(true);
    } catch { /* silent */ }
  }, [isScreenSharing, startScreenShare, stopScreenShare]);

  const handleSendChat = useCallback(async (msg: string) => {
    if (!msg.trim() || !roomId || !userId) return;
    setSendingChat(true);
    try {
      const sent = await roomAPI.sendRoomChatMessage(roomId, msg.trim());
      setChatMessages((prev) => [...prev, sent]);
      setChatDraft('');
    } catch { /* silent */ }
    finally { setSendingChat(false); }
  }, [roomId, userId]);

  const leaveRoomSession = useCallback(async (options?: { keepalive?: boolean }) => {
    if (hasLeftRoomRef.current) return;
    hasLeftRoomRef.current = true;
    try {
      localStream?.getTracks().forEach((t) => t.stop());
      if (roomId) {
        await roomAPI.leaveRoom(roomId, options);
      }
    } catch {
      /* silent */
    }
  }, [localStream, roomId]);

  const handleLeave = useCallback(async () => {
    try {
      await leaveRoomSession();
    } finally {
      onLeaveRoom();
    }
  }, [leaveRoomSession, onLeaveRoom]);

  useEffect(() => {
    return () => {
      void leaveRoomSession({ keepalive: true });
    };
  }, [leaveRoomSession]);

  const handleToggleChat = useCallback(() => {
    setShowChat((v) => {
      if (!v) {
        setUnreadCount(0);
        lastSeenMsgCount.current = chatMessages.length;
      }
      return !v;
    });
    setShowPeople(false);
    setShowControlBar(true);
  }, [chatMessages.length]);

  const handleTogglePeople = useCallback(() => {
    setShowPeople((v) => !v);
    setShowChat(false);
    setShowControlBar(true);
  }, []);

  const handleTogglePinParticipant = useCallback((participantIdToPin: string) => {
    setPinnedParticipantId((currentPinnedId) =>
      currentPinnedId === participantIdToPin ? null : participantIdToPin
    );
    setShowControlBar(true);
  }, []);

  /* ── Derived ── */
  const participantCount = Object.keys(participantDirectory).length || 1;

  const chatForPanel: ChatMessage[] = chatMessages.map((m) => ({
    id: m.id,
    senderId: m.sender_user_id,
    senderName: participantDirectory[m.sender_user_id] || 'Participant',
    message: m.message,
    timestamp: new Date(m.created_at),
    isLocal: m.sender_user_id === userId,
  }));

  const participantsForPanel = [
    {
      id: userId,
      name: userName,
      audioEnabled,
      videoEnabled,
      isHost: userId === hostUserId,
      isPinned: pinnedParticipantId === userId,
    },
    ...remoteParticipants.map((p) => ({
      id: p.peerId,
      name: p.name,
      audioEnabled: p.audioEnabled,
      videoEnabled: p.videoEnabled,
      isHost: p.peerId === hostUserId,
      isPinned: pinnedParticipantId === p.peerId,
    })),
  ];

  /* ── Escape hatch: stop blocking UI after 8 s even if WebRTC never initialises ── */
  const [initTimeout, setInitTimeout] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setInitTimeout(true), 8000);
    return () => clearTimeout(id);
  }, []);

  /* ── Loading screen ── */
  if (!userId || (!initialized && !initTimeout)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#111112]">
        <div className="text-center space-y-5">
          {/* Spinner with real logo overlay */}
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/[0.06] border-t-[#1a73e8] animate-spin" />
            <div className="absolute inset-[10px] flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden="true">
                <defs>
                  <linearGradient id="loading-logo-bg" x1="8" x2="56" y1="6" y2="58" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#003566" />
                    <stop offset="1" stopColor="#001d3d" />
                  </linearGradient>
                </defs>
                <rect width="64" height="64" rx="14" fill="url(#loading-logo-bg)" />
                <path fill="#f8fbff" d="M32 13 14 22.5 32 32l14.727-7.774V35h3.273V22.5L32 13Zm0 23.273L20.182 30 32 23.727 43.818 30 32 36.273ZM14 36.545v3.273L32 49.273l18-9.455v-3.273L32 46Z" />
                <circle cx="49.5" cy="17.5" r="5.5" fill="#f77f00" />
              </svg>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-white/80 text-sm font-medium">Joining room…</p>
            <p className="text-white/35 text-xs">{userName || 'Preparing your session'}</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Render ── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', background: '#111112', overflow: 'hidden' }}>
      {/* Header */}
      <MeetHeader
        roomName={roomName}
        subject={subject}
        participantCount={participantCount}
        isConnected={isConnected}
        roomCode={roomCode}
        onGoToDashboard={() => void handleLeave()}
      />

      {/* Error banner */}
      {joinError && (
        <div
          role="alert"
          className="shrink-0 bg-[#ea4335]/15 border-b border-[#ea4335]/30 px-4 py-2 text-sm text-[#f28b82] flex items-center justify-between"
        >
          <span>{joinError}</span>
          <button
            onClick={() => setJoinError('')}
            className="text-[#f28b82]/60 hover:text-[#f28b82] ml-4 flex items-center justify-center w-6 h-6 rounded-full hover:bg-[#ea4335]/20 transition-colors"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main content — fills space between header and control bar */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          paddingBottom: showControlBar ? 80 : 28,
          transition: 'padding-bottom 0.25s ease',
        }}
      >
        {/* Video area */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <VideoGrid
            localParticipant={{
              peerId: userId,
              name: userName,
              stream: localStream,
              audioEnabled,
              videoEnabled,
            }}
            remoteParticipants={remoteParticipants}
            activeSpeakerId={activeSpeakerId}
            isScreenSharing={isScreenSharing}
            screenShareStream={isScreenSharing ? localStream : null}
            pinnedParticipantId={pinnedParticipantId}
          />
        </div>

        {/* Sidebar panels */}
        {showChat && (
          <div style={{ flexShrink: 0, height: '100%', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
            <ChatPanel
              messages={chatForPanel}
              currentUserName={userName}
              draftMessage={chatDraft}
              isSending={sendingChat}
              onDraftChange={setChatDraft}
              onSendMessage={handleSendChat}
              onClose={() => setShowChat(false)}
            />
          </div>
        )}

        {showPeople && (
          <div style={{ flexShrink: 0, height: '100%', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
            <ParticipantsPanel
              participants={participantsForPanel}
              currentUserId={userId}
              roomCode={roomCode}
              subject={subject}
              maxParticipants={maxParticipants}
              onClose={() => setShowPeople(false)}
              onTogglePinParticipant={handleTogglePinParticipant}
            />
          </div>
        )}
      </div>

      {/* Floating self-view tile */}
      <div
        ref={selfViewRef}
        onMouseDown={handleDragStart}
        className="fixed bottom-20 right-4 z-40 w-[160px] aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 cursor-grab active:cursor-grabbing select-none touch-none"
        aria-label="Your video (self-view)"
      >
        {localStream && videoEnabled ? (
          <video
            muted
            playsInline
            className="w-full h-full object-cover scale-x-[-1]"
            ref={(v) => {
              if (v && v.srcObject !== localStream) {
                v.srcObject = localStream;
                v.play().catch(() => {});
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-[#2d2e30] flex flex-col items-center justify-center gap-1">
            <VideoOff size={18} className="text-white/25" />
            <span className="text-white/30 text-[10px]">Camera off</span>
          </div>
        )}
        <div className="absolute bottom-1 left-2 text-[10px] text-white/70 font-medium drop-shadow">
          You
        </div>
      </div>

      {/* Control bar */}
      <div
        onMouseEnter={() => setShowControlBar(true)}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          height: 18,
          zIndex: 49,
          background: 'transparent',
        }}
      />
      <ControlBar
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        isScreenSharing={isScreenSharing}
        isHandRaised={isHandRaised}
        unreadChatCount={unreadCount}
        showChat={showChat}
        showParticipants={showPeople}
        onToggleAudio={() => void handleToggleAudio()}
        onToggleVideo={() => void handleToggleVideo()}
        onScreenShare={() => void handleScreenShare()}
        onRaiseHand={() => setIsHandRaised((v) => !v)}
        onToggleChat={handleToggleChat}
        onToggleParticipants={handleTogglePeople}
        onToggleSettings={() => setShowSettings(true)}
        onLeaveCall={() => void handleLeave()}
        hidden={!showControlBar}
        onMouseEnter={() => {
          setIsHoveringControls(true);
          setShowControlBar(true);
        }}
        onMouseLeave={() => setIsHoveringControls(false)}
      />

      {/* Settings modal */}
      {showSettings && (
        <SettingsModal
          audioDevices={audioDevices}
          videoDevices={videoDevices}
          audioOutputDevices={audioOutputDevices}
          selectedAudioDeviceId={selectedAudioId}
          selectedVideoDeviceId={selectedVideoId}
          selectedAudioOutputDeviceId={selectedOutputId}
          backgroundBlurred={backgroundBlurred}
          noiseSuppression={noiseSuppression}
          onAudioDeviceChange={setSelectedAudioId}
          onVideoDeviceChange={setSelectedVideoId}
          onAudioOutputChange={setSelectedOutputId}
          onBackgroundBlurToggle={setBackgroundBlurred}
          onNoiseSuppressionToggle={setNoiseSuppression}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
