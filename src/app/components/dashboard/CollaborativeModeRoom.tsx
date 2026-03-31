import { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, Mic, MicOff, Video, VideoOff, Users, Smile, MessageSquare, Timer, StickyNote, BellOff, Settings } from 'lucide-react';
import '@/styles/collaborative-mode-room.css';
import { FocusTimerPanel } from "./FocusTimerPanel";
import { FocusTimerNotification } from "./FocusTimerNotification";
import { BlockNotificationsPanel } from "./BlockNotificationsPanel";
import { NotesPanel } from "./NotesPanel";
import { ScreenShareMenu } from "./ScreenShareMenu";
import { PeoplePanel } from "./PeoplePanel";
import { ReactionPicker } from "./ReactionPicker";
import { ReactionBurst } from "./ReactionBurst";
import { MessagesPanel } from "./MessagesPanel";
import { getCurrentUser } from '@/app/lib/api';
import { useStudyRoom } from '@/utils/supabase/useStudyRoom';
import { useWebRTC } from '@/utils/webrtc/useWebRTC';

interface CollaborativeModeRoomProps {
  roomId?: string;
  onLeaveRoom: () => void;
}

interface Participant {
  id: string;
  user_id: string;
  name: string;
  image: string;
  isMuted: boolean;
  isVideoOff: boolean;
  is_pinned?: boolean;
  permissions?: string;
}

interface TimerNotification {
  id: string;
  timerName: string;
  duration: string;
}

// Default fallback participants (used when realtime data not available)
const defaultParticipants: Participant[] = [
  { id: '1', user_id: 'user1', name: "You", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", isMuted: false, isVideoOff: false },
  { id: '2', user_id: 'user2', name: "John", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", isMuted: true, isVideoOff: false },
  { id: '3', user_id: 'user3', name: "Franklin", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop", isMuted: false, isVideoOff: false },
];

export function CollaborativeModeRoom({ 
  roomId = '2458', 
  onLeaveRoom 
}: CollaborativeModeRoomProps) {
  const currentUser = getCurrentUser();
  const userId = currentUser?.id || 'guest';
  
  // Use real-time hook for Supabase data
  const {
    room,
    participants: realtimeParticipants,
    messages,
    reactions,
    loading,
    error,
    sendMessage,
    addReaction,
  } = useStudyRoom({ roomId, userId });

  // Use real participants from realtime, fallback to defaults
  const participants: Participant[] = Array.isArray(realtimeParticipants) 
    ? realtimeParticipants.map((p: any) => ({
        id: p.id,
        user_id: p.user_id,
        name: p.user?.name || 'Unknown',
        image: p.user?.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        isMuted: p.is_muted || false,
        isVideoOff: p.is_video_off || false,
        is_pinned: p.is_pinned,
        permissions: p.permissions, 
      }))
    : defaultParticipants;

  const isAdmin = currentUser?.role === 'mentor' || false;
  const currentUserId = userId;
  
  // Get current user's real name from participants (database) instead of currentUser object
  const currentUserFromParticipants = participants.find(p => p.user_id === userId);
  const currentUserDisplayName = currentUserFromParticipants?.name || currentUser?.user_metadata?.full_name || currentUser?.name || 'Guest';
  console.log('🔍 Current user display name:', { 
    fromParticipants: currentUserFromParticipants?.name, 
    fromUserMeta: currentUser?.user_metadata?.full_name,
    fromUser: currentUser?.name,
    final: currentUserDisplayName,
    userId 
  });
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const [timerNotification, setTimerNotification] = useState<TimerNotification | null>(null);
  const [showBlockNotifications, setShowBlockNotifications] = useState(false);
  const [isNotificationsBlocked, setIsNotificationsBlocked] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactionBursts, setReactionBursts] = useState<Array<{ id: string; emoji: string }>>([]);
  const [showMessages, setShowMessages] = useState(false);
  const [otherUsersReactionsToShow, setOtherUsersReactionsToShow] = useState<Array<{ id: string; emoji: string; timestamp: number }>>([] as Array<{ id: string; emoji: string; timestamp: number }>);
  const [pinnedParticipantId, setPinnedParticipantId] = useState<string | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  
  // Device selection state
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>('default');
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string>('default');
  
  // Enumerate available media devices
  const enumerateDevices = useCallback(async () => {
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.warn('⚠️ mediaDevices not available - may not be in secure context (HTTPS/localhost)');
        return;
      }
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      const videoInputs = devices.filter(device => device.kind === 'videoinput');
      
      console.log('🎤 Available audio devices:', audioInputs.map(d => ({ deviceId: d.deviceId, label: d.label })));
      console.log('🎥 Available video devices:', videoInputs.map(d => ({ deviceId: d.deviceId, label: d.label })));
      
      setAudioDevices(audioInputs);
      setVideoDevices(videoInputs);
    } catch (error) {
      console.error('Failed to enumerate devices:', error);
    }
  }, []);
  
  // Enumerate devices on mount and when permissions granted
  useEffect(() => {
    enumerateDevices();
    
    // Check if mediaDevices is available before adding listener
    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', enumerateDevices);
      
      return () => {
        if (navigator.mediaDevices) {
          navigator.mediaDevices.removeEventListener('devicechange', enumerateDevices);
        }
      };
    }
  }, [enumerateDevices]);
  
  // WebRTC state
  const webrtcResult = useWebRTC({
    roomId: roomId || '2458',
    userId: userId,
    userName: currentUserDisplayName,
    enabled: !!roomId,
  });
  
  console.log('📡 WebRTC Name being sent:', currentUserDisplayName);
  
  // Ensure remoteStreams is always an array
  const localStream = webrtcResult?.localStream || null;
  // Filter out any streams that belong to the current user (shouldn't happen but safety check)
  const remoteStreams = Array.isArray(webrtcResult?.remoteStreams) 
    ? webrtcResult.remoteStreams.filter((rs: any) => rs.userId !== userId)
    : [];
  const isAudioOn = webrtcResult?.isAudioOn ?? true;
  const isVideoOn = webrtcResult?.isVideoOn ?? true;
  const toggleAudio = webrtcResult?.toggleAudio || (() => {});
  const toggleVideo = webrtcResult?.toggleVideo || (() => {});
  const disconnect = webrtcResult?.disconnect || (() => {});
  const reinitializeStream = webrtcResult?.reinitializeStream || (async () => {});
  const webrtcError = webrtcResult?.error || null;

  // Log remote streams on every change
  useEffect(() => {
    console.log('📊 [RENDER] Remote streams count:', remoteStreams.length);
    remoteStreams.forEach((rs, index) => {
      console.log(`📊 [RENDER] Remote stream [${index}]: userId=${rs.userId}, userName=${rs.userName}, tracks=${rs.stream?.getTracks().length || 0}`);
    });
  }, [remoteStreams]);

  // Handle device change
  const handleAudioDeviceChange = async (deviceId: string) => {
    setSelectedAudioDeviceId(deviceId);
    await reinitializeStream(deviceId, selectedVideoDeviceId);
  };

  const handleVideoDeviceChange = async (deviceId: string) => {
    setSelectedVideoDeviceId(deviceId);
    await reinitializeStream(selectedAudioDeviceId, deviceId);
  };

  // Refs for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefsRef = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Store video element in map when mounted
  const setRemoteVideoRef = useCallback((userId: string, element: HTMLVideoElement | null) => {
    if (element) {
      remoteVideoRefsRef.current.set(userId, element);
      console.log('📹 Video ref registered for:', userId);
    } else {
      remoteVideoRefsRef.current.delete(userId);
      console.log('📹 Video ref removed for:', userId);
    }
  }, []);

  // Attach local stream to video element with retry logic
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 5;

    const attachStream = () => {
      if (!isMounted) return;
      
      if (localStream && localVideoRef.current) {
        const tracks = localStream.getTracks();
        console.log('🎬 Attaching local stream to video element with', tracks.length, 'tracks');
        console.log('🎬 Track details:', tracks.map(t => ({ kind: t.kind, enabled: t.enabled, readyState: t.readyState })));
        
        localVideoRef.current.srcObject = localStream;
        
        // Force play on next tick
        setTimeout(() => {
          if (localVideoRef.current && isMounted) {
            localVideoRef.current.play().catch(err => {
              console.error('⚠️ Failed to play local video:', err);
            });
          }
        }, 100);
      } else if (retryCount < maxRetries) {
        console.warn(`⚠️ Retry ${retryCount + 1}/${maxRetries} - Cannot attach local stream - stream:`, !!localStream, 'ref:', !!localVideoRef.current);
        retryCount++;
        // Retry after 200ms
        setTimeout(attachStream, 200);
      } else {
        console.error('❌ Failed to attach local stream after', maxRetries, 'retries');
      }
    };

    // Start with a small delay to ensure DOM is ready
    const timeout = setTimeout(attachStream, 50);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [localStream]);

  // Attach remote streams to video elements with retry logic
  useEffect(() => {
    console.log('🎬 Remote streams updated:', remoteStreams.length);
    let isMounted = true;

    remoteStreams.forEach(({ userId, stream }: { userId: string; stream: MediaStream }) => {
      const tracks = stream.getTracks();
      console.log(`🎬 Processing remote stream for ${userId} with ${tracks.length} tracks`);
      console.log(`🎬 Track details for ${userId}:`, tracks.map(t => ({ kind: t.kind, enabled: t.enabled, readyState: t.readyState })));
      
      let retryCount = 0;
      const maxRetries = 5;
      
      const attachRemoteStream = () => {
        if (!isMounted) return;
        
        const videoElement = remoteVideoRefsRef.current.get(userId);
        console.log(`🎬 [Attempt ${retryCount + 1}/${maxRetries + 1}] Looking for video element for ${userId}, found:`, !!videoElement);
        
        if (videoElement) {
          console.log(`✅ Found video element for ${userId}, attaching stream...`);
          videoElement.srcObject = null; // Clear first
          setTimeout(() => {
            if (videoElement && isMounted) {
              videoElement.srcObject = stream;
              console.log(`✅ Remote stream attached to ${userId}`);
              // Force play on next tick
              videoElement.play().catch(err => {
                console.error(`⚠️ Failed to play remote video for ${userId}:`, err);
              });
            }
          }, 50);
        } else if (retryCount < maxRetries) {
          console.warn(`⚠️ Retry ${retryCount + 1}/${maxRetries} - Video element not found for ${userId}. Available refs:`, Array.from(remoteVideoRefsRef.current.keys()));
          retryCount++;
          // Retry after 200ms
          setTimeout(attachRemoteStream, 200);
        } else {
          console.error(`❌ Failed to find video element for ${userId} after ${maxRetries} retries. Available refs:`, Array.from(remoteVideoRefsRef.current.keys()));
        }
      };

      // Start with a small delay to ensure DOM is ready
      setTimeout(attachRemoteStream, 50);
    });

    return () => {
      isMounted = false;
    };
  }, [remoteStreams]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);



  // Cleanup WebRTC on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Watch for new reactions from other users
  useEffect(() => {
    if (!reactions || reactions.length === 0) {
      console.log('No reactions available');
      return;
    }

    console.log('All reactions:', reactions);
    
    // Show all other users' reactions (no time limit for existing reactions)
    const recentOtherReactions = reactions.filter((r: any) => {
      const isOtherUser = r.user_id !== userId;
      console.log('Filtering reaction:', { emoji: r.emoji, userId: r.user_id, currentUserId: userId, isOtherUser });
      return isOtherUser;
    });

    console.log('Recent other reactions:', recentOtherReactions);
    
    if (recentOtherReactions.length > 0) {
      const newReactionsToShow = recentOtherReactions.map((r: any) => ({
        id: r.id,
        emoji: r.emoji,
        timestamp: new Date(r.created_at).getTime()
      }));
      console.log('Setting reactions to show:', newReactionsToShow);
      setOtherUsersReactionsToShow(newReactionsToShow);
    } else {
      console.log('No reactions from other users found');
      setOtherUsersReactionsToShow([]);
    }
  }, [reactions, userId]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLeaveRoom = async () => {
    console.log('👋 [LEAVE] User initiated leave room');
    // Explicitly disconnect WebRTC and untrack presence
    await disconnect();
    console.log('👋 [LEAVE] Disconnected successfully, calling onLeaveRoom');
    onLeaveRoom();
  };

  const handlePinParticipant = (participantId: string) => {
    setPinnedParticipantId(pinnedParticipantId === participantId ? null : participantId);
  };

  const handleTimerComplete = (label: string, duration: number) => {
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    const formattedDuration = secs === 0 ? `${mins.toString().padStart(2, '0')}:00 min` : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} min`;
    
    setTimerNotification({
      id: Date.now().toString(),
      timerName: label,
      duration: formattedDuration
    });

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      setTimerNotification(null);
    }, 10000);
  };

  const handleReactionSelect = (emoji: string) => {
    // Create a unique ID for this burst
    const burstId = Date.now().toString();
    
    console.log('Sending reaction:', { emoji, userId, roomId });
    
    // Send emoji reaction to real-time database
    addReaction(emoji)
      .then(() => {
        console.log('Reaction sent successfully:', emoji);
      })
      .catch((err: any) => {
        console.error('Failed to send reaction:', err);
        console.error('Error details:', { message: err.message, code: err.code });
      });
    
    // Close the reaction picker
    setShowReactionPicker(false);
    
    // Add a reaction burst for visual feedback
    setReactionBursts(prev => [...prev, { id: burstId, emoji }]);
    
    // Remove the burst after 3.5 seconds (max animation duration)
    setTimeout(() => {
      setReactionBursts(prev => prev.filter(burst => burst.id !== burstId));
    }, 3500);
  };


  if (loading) {
    return (
      <div className="bg-black h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading study room...</p>
        </div>
      </div>
    );
  }

  // Check for WebRTC errors first
  if (webrtcError) {
    return (
      <div className="bg-black h-screen w-full flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-4">📹</div>
          <h3 className="text-2xl font-bold mb-2">Camera/Microphone Error</h3>
          <p className="text-gray-300 mb-6 text-sm">{webrtcError}</p>
          <p className="text-gray-400 text-xs mb-4">
            Make sure your browser has permission to access camera and microphone
          </p>
          <button
            onClick={onLeaveRoom}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !room) {
    const errorMessage = error 
      ? (typeof error === 'string' ? error : error?.message || 'Unknown error occurred')
      : 'Room not found or is inactive';
    
    // Check for specific WebRTC errors
    const isWebRTCError = errorMessage.includes('media') || 
                          errorMessage.includes('camera') || 
                          errorMessage.includes('microphone') || 
                          errorMessage.includes('Permission');
    
    return (
      <div className="bg-black h-screen w-full flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-4">{isWebRTCError ? '📹' : '⚠️'}</div>
          <h3 className="text-2xl font-bold mb-2">
            {isWebRTCError ? 'Camera/Microphone Error' : 'Failed to Load Room'}
          </h3>
          <p className="text-gray-300 mb-6 text-sm">{errorMessage}</p>
          {isWebRTCError && (
            <p className="text-gray-400 text-xs mb-4">
              Make sure your browser has permission to access camera and microphone
            </p>
          )}
          <button
            onClick={onLeaveRoom}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Calculate grid columns based on participant count
  const allParticipants = [
    { 
      id: 'local', 
      user_id: userId, 
      name: 'You', 
      isLocal: true, 
      ...(participants && participants[0] ? participants[0] : {}) 
    },
    ...(Array.isArray(remoteStreams) ? remoteStreams.map(rs => ({ id: rs.userId, user_id: rs.userId, name: rs.userName, isLocal: false })) : []),
  ];
  
  // Calculate grid columns based on number of remote streams (1 local + remote streams)
  const totalParticipants = 1 + remoteStreams.length;
  const gridCols = totalParticipants === 1 ? 'grid-cols-1' : 
                   totalParticipants <= 4 ? 'grid-cols-2' : 
                   'grid-cols-3';
  
  console.log('📊 Grid Layout - Total participants:', totalParticipants, 'Remote streams:', remoteStreams.length, 'Grid:', gridCols);

  return (
    <div className="bg-[#1a1a1a] h-screen w-full flex flex-col font-['Poppins'] overflow-hidden">
      {/* Main Content Area - Responsive Video Grid */}
      <div className={`flex-1 grid ${gridCols} gap-4 p-6 auto-rows-fr overflow-y-auto`}>
        {/* LOCAL VIDEO - Always shown */}
        <div className="relative bg-[#2a2a2a] rounded-[20px] overflow-hidden h-full">
          {/* Video element always rendered for ref attachment */}
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            crossOrigin="anonymous"
            className="w-full h-full object-cover local-video-flipped"
            style={{ display: localStream && isVideoOn ? 'block' : 'none' }}
          />
          
          {/* Placeholder when video is off */}
          {!isVideoOn && (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3a3a3a] to-[#1a1a1a]">
              <span className="text-white text-center">
                <div className="text-4xl mb-2">📷</div>
                <div className="text-sm">Camera Off</div>
              </span>
            </div>
          )}
          {/* Name Badge */}
          <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
            <span className="text-[12px] text-white font-medium">You</span>
          </div>
          {/* Status Icons */}
          <div className="absolute top-3 right-3 flex gap-2">
            {!isVideoOn && (
              <div className="bg-red-600/80 backdrop-blur-sm rounded-full p-2">
                <VideoOff className="w-3 h-3 text-white" />
              </div>
            )}
            {!isAudioOn && (
              <div className="bg-red-600/80 backdrop-blur-sm rounded-full p-2">
                <MicOff className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* REMOTE VIDEOS */}
        {Array.isArray(remoteStreams) && remoteStreams.length > 0 && (
          <>
            {remoteStreams.map(({ userId, userName, stream }) => {
              // Use WebRTC userName directly - this is what was announced by the remote peer
              // This is the source of truth for the remote participant's name
              const participantName = userName || 'Unknown';
              const audioTracks = stream?.getAudioTracks() || [];
              const videoTracks = stream?.getVideoTracks() || [];
              console.log(`🎥 Rendering remote video - userId: ${userId}, name: ${participantName}, audioTracks: ${audioTracks.length}, videoTracks: ${videoTracks.length}`);
              if (audioTracks.length > 0) {
                console.log(`🔊 Audio track found for ${userId}: enabled=${audioTracks[0].enabled}, state=${audioTracks[0].readyState}`);
              } else {
                console.warn(`🔇 NO audio track in stream for ${userId}!`);
              }
              return (
              <div key={userId} className="relative bg-[#2a2a2a] rounded-[20px] overflow-hidden h-full">
                {/* Audio playback element - CRITICAL for hearing remote audio */}
                <audio
                  autoPlay
                  playsInline
                  crossOrigin="anonymous"
                  style={{ display: 'none' }}
                  onLoadedMetadata={() => {
                    console.log(`🔊 Audio metadata loaded for ${userId}`);
                  }}
                  onPlay={() => {
                    console.log(`▶️ Audio playing for ${userId}`);
                  }}
                  onError={(e) => {
                    console.error(`❌ Audio error for ${userId}:`, e);
                  }}
                  ref={(el) => {
                    if (el && stream) {
                      el.srcObject = stream;
                      console.log(`🎧 Audio element connected to stream for ${userId}`);
                    }
                  }}
                />
                
                {/* Video playback element */}
                <video
                  ref={(el) => {
                    console.log(`📹 Ref callback for ${userId}:`, !!el);
                    if (el && stream) {
                      el.srcObject = stream;
                    }
                    setRemoteVideoRef(userId, el);
                  }}
                  autoPlay
                  playsInline
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                  style={{ display: 'block' }}
                  onLoadedMetadata={() => {
                    console.log(`📹 Video metadata loaded for ${userId}`);
                  }}
                  onPlay={() => {
                    console.log(`▶️ Video playing for ${userId}`);
                  }}
                  onError={(e) => {
                    console.error(`❌ Video error for ${userId}:`, e);
                  }}
                />
                {/* Name Badge */}
                <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
                  <span className="text-[12px] text-white font-medium">{participantName}</span>
                </div>
              </div>
            );
            })}
          </>
        )}

        {/* FALLBACK PARTICIPANT AVATARS (when no streams) */}
        {Array.isArray(remoteStreams) && remoteStreams.length === 0 && Array.isArray(participants) && participants.slice(1, 10).map((participant) => (
          <div key={participant.id} className="relative bg-[#2a2a2a] rounded-[20px] overflow-hidden">
            <img
              src={participant.image}
              alt={participant.name}
              className="w-full h-full object-cover"
            />
            {/* Name Badge */}
            <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
              <span className="text-[12px] text-white font-medium">{participant.name}</span>
            </div>
            {/* Status Icons */}
            <div className="absolute top-3 right-3 flex gap-2">
              {participant.isVideoOff && (
                <div className="bg-red-600/80 backdrop-blur-sm rounded-full p-2">
                  <VideoOff className="w-3 h-3 text-white" />
                </div>
              )}
              {participant.isMuted && (
                <div className="bg-red-600/80 backdrop-blur-sm rounded-full p-2">
                  <MicOff className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE - Show only when no remote streams */} 
      {remoteStreams.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <div className="text-center">
            <div className="text-6xl mb-4">👥</div>
            <div className="text-white text-xl">Waiting for other participants...</div>
            <div className="text-white/60 text-sm mt-2">Room Code: {room?.code || roomId}</div>
          </div>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div className="bg-[#2a2a2a] px-8 py-4 flex items-center justify-between">
        {/* Left Side - Timer and Room Info */}
        <div className="flex items-center gap-6 text-white">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            <span className="text-[14px]">Time Elapsed: {formatTime(elapsedTime)}</span>
          </div>
          <div className="text-[14px]">
            Room Code: {room?.code || roomId}
          </div>
        </div>

        {/* Center - Controls */}
        <div className="flex items-center gap-4">
          {/* Timer Button */}
          <button 
            onClick={() => setShowFocusTimer(!showFocusTimer)}
            className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-full p-3 transition-colors"
          >
            <Timer className="w-6 h-6 text-white" />
          </button>

          {/* Bell Button */}
          <button 
            onClick={() => setShowBlockNotifications(!showBlockNotifications)}
            className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-full p-3 transition-colors"
          >
            {showBlockNotifications ? (
              <BellOff className="w-6 h-6 text-white" />
            ) : (
              <Bell className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Notes Button */}
          <button 
            onClick={() => setShowNotes(!showNotes)}
            className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-full p-3 transition-colors"
          >
            <StickyNote className="w-6 h-6 text-white" />
          </button>

          {/* Video Button */}
          <button 
            onClick={() => toggleVideo(!isVideoOn)}
            className={`${
              isVideoOn ? 'bg-[#3a3a3a] hover:bg-[#4a4a4a]' : 'bg-red-600 hover:bg-red-700'
            } rounded-full p-3 transition-colors`}
          >
            {isVideoOn ? (
              <Video className="w-6 h-6 text-white" />
            ) : (
              <VideoOff className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Mic Button */}
          <button 
            onClick={() => toggleAudio(!isAudioOn)}
            className={`${
              isAudioOn ? 'bg-[#3a3a3a] hover:bg-[#4a4a4a]' : 'bg-red-600 hover:bg-red-700'
            } rounded-full p-3 transition-colors`}
          >
            {isAudioOn ? (
              <Mic className="w-6 h-6 text-white" />
            ) : (
              <MicOff className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Screen Share Button */}
          <ScreenShareMenu 
            isSharing={isScreenSharing}
            onScreenShareStart={() => setIsScreenSharing(true)}
            onScreenShareStop={() => setIsScreenSharing(false)}
          />

          {/* People Button */}
          <button 
            onClick={() => setShowPeople(!showPeople)}
            className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-full p-3 transition-colors"
          >
            <Users className="w-6 h-6 text-white" />
          </button>

          {/* Emoji Button */}
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-full p-3 transition-colors"
          >
            <Smile className="w-6 h-6 text-white" />
          </button>

          {/* Chat Button */}
          <button
            onClick={() => setShowMessages(!showMessages)}
            className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-full p-3 transition-colors"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setShowDeviceSettings(!showDeviceSettings)}
            className="bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-full p-3 transition-colors"
          >
            <Settings className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Right Side - Leave Room */}
        <button
          onClick={handleLeaveRoom}
          className="bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-[20px] px-6 h-[42px] text-[14px] font-medium transition-colors"
        >
          Leave Room
        </button>
      </div>

      {/* Focus Timer Panel */}
      {showFocusTimer && (
        <FocusTimerPanel
          onClose={() => setShowFocusTimer(false)}
          onTimerComplete={handleTimerComplete}
        />
      )}

      {/* Focus Timer Notification */}
      {timerNotification && (
        <FocusTimerNotification
          timerName={timerNotification.timerName}
          duration={timerNotification.duration}
          onDismiss={() => setTimerNotification(null)}
        />
      )}

      {/* Block Notifications Panel */}
      {showBlockNotifications && (
        <BlockNotificationsPanel
          onClose={() => setShowBlockNotifications(false)}
          isBlocked={isNotificationsBlocked}
          onToggle={() => setIsNotificationsBlocked(!isNotificationsBlocked)}
        />
      )}

      {/* Notes Panel */}
      {showNotes && (
        <NotesPanel
          onClose={() => setShowNotes(false)}
          isOpen={showNotes}
          roomId={roomId}
          userId={userId}
        />
      )}

      {/* People Panel */}
      {showPeople && (
        <PeoplePanel
          onClose={() => setShowPeople(false)}
          participants={participants as any}
          onPinParticipant={handlePinParticipant as any}
          pinnedParticipantId={pinnedParticipantId as any}
          isAdmin={isAdmin}
          currentUserId={currentUserId as any}
        />
      )}

      {/* Reaction Picker */}
      {showReactionPicker && (
        <ReactionPicker
          onClose={() => setShowReactionPicker(false)}
          onReactionSelect={handleReactionSelect}
        />
      )}

      {/* Reaction Bursts */}
      {reactionBursts.map(burst => (
        <ReactionBurst
          key={burst.id}
          emoji={burst.emoji}
        />
      ))}

      {/* Other Users' Reactions */}
      {otherUsersReactionsToShow.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[35] overflow-hidden">
          {otherUsersReactionsToShow.map((reaction: { id: string; emoji: string; timestamp: number }, idx: number) => {
            const positionClasses = [
              'left-[20%] top-[30%]',
              'left-[35%] top-[38%]',
              'left-[50%] top-[30%]',
              'left-[65%] top-[38%]',
              'left-[40%] top-[50%]',
            ];
            const posClass = positionClasses[idx % positionClasses.length];
            return (
              <div
                key={`${reaction.id}-${idx}`}
                className={`absolute text-5xl drop-shadow-lg animate-float-up-fade ${posClass}`}
              >
                {reaction.emoji}
              </div>
            );
          })}
        </div>
      )}

      {/* Messages Panel */}
      {showMessages && (
        <MessagesPanel
          onClose={() => setShowMessages(false)}
          currentUserId={currentUserId}
          currentUserName={currentUser?.name || 'You'}
          currentUserAvatar={participants.find(p => p.user_id === currentUserId)?.image || currentUser?.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"}
          realtimeMessages={messages}
          onSendMessage={sendMessage}
        />
      )}

      {/* Device Settings Panel */}
      {showDeviceSettings && (
        <div className="fixed right-6 bottom-24 bg-[#2a2a2a] rounded-[16px] border border-[#3a3a3a] p-5 w-72 shadow-2xl z-40">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#3a3a3a]">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Device Settings
              </h3>
              <button
                onClick={() => setShowDeviceSettings(false)}
                className="text-gray-400 hover:text-white text-xl font-light"
              >
                ×
              </button>
            </div>

            {/* Microphone Selection */}
            <div>
              <label className="text-gray-300 text-sm font-medium block mb-2">Microphone</label>
              <select
                value={selectedAudioDeviceId}
                onChange={(e) => handleAudioDeviceChange(e.target.value)}
                className="w-full bg-[#3a3a3a] text-white rounded-lg px-3 py-2 text-sm border border-[#4a4a4a] hover:border-[#5a5a5a] focus:outline-none focus:border-blue-500"
              >
                <option value="default">Default Microphone</option>
                {audioDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${device.deviceId.slice(0, 5)}...`}
                  </option>
                ))}
              </select>
            </div>

            {/* Camera Selection */}
            <div>
              <label className="text-gray-300 text-sm font-medium block mb-2">Camera</label>
              <select
                value={selectedVideoDeviceId}
                onChange={(e) => handleVideoDeviceChange(e.target.value)}
                className="w-full bg-[#3a3a3a] text-white rounded-lg px-3 py-2 text-sm border border-[#4a4a4a] hover:border-[#5a5a5a] focus:outline-none focus:border-blue-500"
              >
                <option value="default">Default Camera</option>
                {videoDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId.slice(0, 5)}...`}
                  </option>
                ))}
              </select>
            </div>

            {/* Device Info */}
            {(audioDevices.length === 0 || videoDevices.length === 0) && (
              <div className="bg-[#3a3a3a]/50 border border-[#4a4a4a] rounded-lg p-3 text-xs text-gray-400">
                <p className="mb-1">💡 Tip: Grant camera/microphone permissions to see available devices</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
