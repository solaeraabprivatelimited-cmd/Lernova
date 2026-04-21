/**
 * CollaborativeModeRoomGoogleMeet - Google Meet-style collaborative room
 * Refactored to use modular components with clean, minimal SaaS design
 */

import { useState, useEffect, useCallback } from 'react';
import { useWebRTC } from '@/utils/webrtc/useWebRTC';
import { getSupabaseClient } from '../../../lib/api';
import { roomAPI, RoomChatMessage } from '@/utils/api/roomAPI';
import { MeetHeader } from './MeetHeader';
import { VideoGrid } from './VideoGrid';
import { ControlBar } from './ControlBar';
import { ChatPanel } from './ChatPanel';
import { ParticipantsPanel } from './ParticipantsPanel';
import { SettingsModal } from './SettingsModal';

interface CollaborativeModeRoomGoogleMeetProps {
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
  stream?: MediaStream;
  audioEnabled: boolean;
  videoEnabled: boolean;
  isActiveSpeaker?: boolean;
}

export function CollaborativeModeRoomGoogleMeet({
  roomName,
  roomId,
  roomCode,
  maxParticipants = 20,
  subject,
  onLeaveRoom,
}: CollaborativeModeRoomGoogleMeetProps) {
  const [userId, setUserId] = useState<string>('');
  const [currentUserName, setCurrentUserName] = useState('You');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [backgroundBlurred, setBackgroundBlurred] = useState(false);
  const [noiseSuppression, setNoiseSuppression] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
  const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipant[]>([]);
  const [participantDirectory, setParticipantDirectory] = useState<Record<string, string>>({});
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState('');
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState('');
  const [selectedAudioOutputDeviceId, setSelectedAudioOutputDeviceId] = useState('');
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [showParticipantsPanel, setShowParticipantsPanel] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<RoomChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);
  const [roomJoinError, setRoomJoinError] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        const { data: { user } } = await supabase.auth.getUser();

        if (!session || !user) {
          return;
        }

        setUserId(user.id);
        const metadata = user.user_metadata ?? {};
        const resolvedName =
          (typeof metadata.name === 'string' && metadata.name.trim()) ||
          (typeof metadata.full_name === 'string' && metadata.full_name.trim()) ||
          user.email?.split('@')[0] ||
          'You';
        setCurrentUserName(resolvedName);
      } catch {
        setRoomJoinError('Unable to restore your session for this room.');
      }
    };

    void getCurrentUser();
  }, []);

  useEffect(() => {
    const loadMediaDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const nextAudioInputs = devices.filter((device) => device.kind === 'audioinput');
        const nextVideoInputs = devices.filter((device) => device.kind === 'videoinput');
        const nextAudioOutputs = devices.filter((device) => device.kind === 'audiooutput');

        setAudioDevices(nextAudioInputs);
        setVideoDevices(nextVideoInputs);
        setAudioOutputDevices(nextAudioOutputs);
        setSelectedAudioDeviceId((current) => current || nextAudioInputs[0]?.deviceId || '');
        setSelectedVideoDeviceId((current) => current || nextVideoInputs[0]?.deviceId || '');
        setSelectedAudioOutputDeviceId((current) => current || nextAudioOutputs[0]?.deviceId || '');
      } catch {
        setAudioDevices([]);
        setVideoDevices([]);
        setAudioOutputDevices([]);
      }
    };

    if (!navigator.mediaDevices?.enumerateDevices) {
      return;
    }

    void loadMediaDevices();
  }, []);

  const {
    initialized,
    localStream,
    peers,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
  } = useWebRTC({
    roomId,
    userId,
    enableVideo: true,
    enableAudio: true,
    onError: () => {
      setRoomJoinError('A WebRTC connection issue occurred. Please try reconnecting.');
    },
  });

  useEffect(() => {
    if (!peers) return;

    const updated: RemoteParticipant[] = peers.map((peer) => ({
      peerId: peer.peerId,
      name: participantDirectory[peer.peerId] || `Participant ${peer.peerId.slice(0, 4)}`,
      stream: peer.stream,
      audioEnabled: peer.audioEnabled ?? true,
      videoEnabled: peer.videoEnabled ?? true,
    }));

    setRemoteParticipants(updated);
    setParticipantCount(updated.length + 1);
  }, [peers, participantDirectory]);

  useEffect(() => {
    if (!roomId || !userId || !initialized) return;

    let cancelled = false;

    const joinRoom = async () => {
      try {
        const { participant } = await roomAPI.joinRoom(roomId, {
          name: currentUserName,
          userId,
        });

        if (!cancelled) {
          setParticipantId(participant.id);
          setIsConnected(true);
          setParticipantDirectory((prev) => ({
            ...prev,
            [userId]: currentUserName,
          }));
        }
      } catch {
        if (!cancelled) {
          setRoomJoinError('Failed to join room. Please try again.');
        }
      }
    };

    void joinRoom();

    return () => {
      cancelled = true;
    };
  }, [roomId, userId, initialized, currentUserName]);

  useEffect(() => {
    if (!roomId || !userId) return;

    const loadMessages = async () => {
      try {
        const messages = await roomAPI.listRoomChat(roomId);
        setChatMessages(messages);
      } catch {
        if (!showChatPanel) {
          setUnreadChatCount((count) => count);
        }
      }
    };

    void loadMessages();

    const interval = setInterval(() => {
      void loadMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [roomId, userId, showChatPanel]);

  const handleToggleAudio = useCallback(async () => {
    try {
      const nextEnabled = !audioEnabled;
      await toggleAudio(nextEnabled);
      setAudioEnabled(nextEnabled);
    } catch {
      setRoomJoinError('Unable to update microphone state right now.');
    }
  }, [audioEnabled, toggleAudio]);

  const handleToggleVideo = useCallback(async () => {
    try {
      const nextEnabled = !videoEnabled;
      await toggleVideo(nextEnabled);
      setVideoEnabled(nextEnabled);
    } catch {
      setRoomJoinError('Unable to update camera state right now.');
    }
  }, [videoEnabled, toggleVideo]);

  const handleScreenShare = useCallback(async () => {
    try {
      if (isScreenSharing) {
        await stopScreenShare();
        setIsScreenSharing(false);
      } else {
        await startScreenShare();
        setIsScreenSharing(true);
      }
    } catch {
      setRoomJoinError('Screen sharing is unavailable on this device.');
    }
  }, [isScreenSharing, startScreenShare, stopScreenShare]);

  const handleSendChat = useCallback(
    async (message: string) => {
      if (!message.trim() || !roomId || !userId) return;

      setSendingChat(true);
      try {
        await roomAPI.sendRoomChat(roomId, {
          message: message.trim(),
        });
        setChatInput('');
        setUnreadChatCount(0);

        const messages = await roomAPI.listRoomChat(roomId);
        setChatMessages(messages);
      } catch {
        setRoomJoinError('Message not sent. Please try again.');
      } finally {
        setSendingChat(false);
      }
    },
    [roomId, userId]
  );

  const handleLeaveCall = useCallback(async () => {
    try {
      if (participantId && roomId) {
        await roomAPI.leaveRoom(roomId);
      }
    } finally {
      onLeaveRoom();
    }
  }, [participantId, roomId, onLeaveRoom]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'm' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        void handleToggleAudio();
      }

      if (event.key.toLowerCase() === 'v' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        void handleToggleVideo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleAudio, handleToggleVideo]);

  if (!initialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-blue-500" />
          <p className="text-lg text-white">Initializing your meeting...</p>
          <p className="mt-2 text-sm text-white/70">Preparing your video and audio</p>
        </div>
      </div>
    );
  }

  const chatMessagesForPanel = (chatMessages || []).map((message) => ({
    id: message.id,
    senderId: message.sender_user_id,
    senderName: participantDirectory[message.sender_user_id] || 'Unknown',
    message: message.message,
    timestamp: new Date(message.created_at),
    isLocal: message.sender_user_id === userId,
  }));

  const participantsForPanel = [
    {
      id: userId,
      name: currentUserName,
      audioEnabled,
      videoEnabled,
      isHost: true,
    },
    ...remoteParticipants.map((participant) => ({
      id: participant.peerId,
      name: participant.name,
      audioEnabled: participant.audioEnabled,
      videoEnabled: participant.videoEnabled,
    })),
  ];

  return (
    <div className="flex h-screen w-full flex-col bg-black">
      <MeetHeader
        roomName={roomName}
        participantCount={participantCount}
        isConnected={isConnected}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          {roomJoinError ? (
            <div className="border border-red-600 bg-red-600/20 px-4 py-2 text-red-200">
              {roomJoinError}
            </div>
          ) : null}

          <div className="flex-1 overflow-hidden pb-24">
            <VideoGrid
              localParticipant={{
                peerId: userId,
                name: currentUserName,
                stream: localStream,
                audioEnabled,
                videoEnabled,
              }}
              remoteParticipants={remoteParticipants}
              activeSpeakerId={activeSpeakerId}
              isScreenSharing={isScreenSharing}
            />
          </div>
        </div>

        {showChatPanel ? (
          <ChatPanel
            messages={chatMessagesForPanel}
            currentUserName={currentUserName}
            draftMessage={chatInput}
            isSending={sendingChat}
            onDraftChange={setChatInput}
            onSendMessage={handleSendChat}
            onClose={() => {
              setUnreadChatCount(0);
              setShowChatPanel(false);
            }}
          />
        ) : null}

        {showParticipantsPanel ? (
          <ParticipantsPanel
            participants={participantsForPanel}
            currentUserId={userId}
            roomCode={roomCode}
            subject={subject}
            maxParticipants={maxParticipants}
            onClose={() => setShowParticipantsPanel(false)}
          />
        ) : null}
      </div>

      <ControlBar
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        isScreenSharing={isScreenSharing}
        isHandRaised={isHandRaised}
        unreadChatCount={unreadChatCount}
        onToggleAudio={handleToggleAudio}
        onToggleVideo={handleToggleVideo}
        onScreenShare={handleScreenShare}
        onRaiseHand={() => setIsHandRaised((raised) => !raised)}
        onToggleChat={() => {
          setUnreadChatCount(0);
          setShowChatPanel((open) => !open);
        }}
        onToggleParticipants={() => setShowParticipantsPanel((open) => !open)}
        onToggleSettings={() => setShowSettingsModal(true)}
        onLeaveCall={handleLeaveCall}
      />

      {showSettingsModal ? (
        <SettingsModal
          audioDevices={audioDevices}
          videoDevices={videoDevices}
          audioOutputDevices={audioOutputDevices}
          selectedAudioDeviceId={selectedAudioDeviceId}
          selectedVideoDeviceId={selectedVideoDeviceId}
          selectedAudioOutputDeviceId={selectedAudioOutputDeviceId}
          backgroundBlurred={backgroundBlurred}
          noiseSuppression={noiseSuppression}
          onAudioDeviceChange={setSelectedAudioDeviceId}
          onVideoDeviceChange={setSelectedVideoDeviceId}
          onAudioOutputChange={setSelectedAudioOutputDeviceId}
          onBackgroundBlurToggle={setBackgroundBlurred}
          onNoiseSuppressionToggle={setNoiseSuppression}
          onClose={() => setShowSettingsModal(false)}
        />
      ) : null}
    </div>
  );
}
