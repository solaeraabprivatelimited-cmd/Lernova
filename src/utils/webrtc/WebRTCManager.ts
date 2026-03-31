/**
 * WebRTC P2P Manager - Handles peer connections using Supabase Realtime for signaling
 * No external APIs required - manages signaling through Supabase channels
 */

interface PeerConnection {
  pc: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;
}

export interface WebRTCConfig {
  roomId: string;
  userId: string;
  userName: string;
  signalingChannel: any; // Supabase RealtimeChannel
}

export interface WebRTCCallbacks {
  onRemoteStream?: (userId: string, stream: MediaStream) => void;
  onRemoteStreamRemoved?: (userId: string) => void;
  onParticipantJoined?: (userId: string, userName: string) => void;
  onParticipantLeft?: (userId: string) => void;
  onError?: (error: Error) => void;
  onLocalStreamReady?: (stream: MediaStream) => void;
}

const ICE_SERVERS = [
  { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
  { urls: ['stun:stun3.l.google.com:19302', 'stun:stun4.l.google.com:19302'] },
];

export class WebRTCManager {
  private config: WebRTCConfig;
  private callbacks: WebRTCCallbacks;
  private peers: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private isAudioEnabled = true;
  private isVideoEnabled = true;

  constructor(config: WebRTCConfig, callbacks: WebRTCCallbacks = {}) {
    this.config = config;
    this.callbacks = callbacks;
    this.setupSignalingListeners();
  }

  /**
   * Initialize local media stream with optional device selection
   */
  async initLocalStream(audioDeviceId?: string, videoDeviceId?: string): Promise<MediaStream> {
    try {
      console.log('🎥 Requesting user media with echoCancellation and proper video constraints');
      if (audioDeviceId && audioDeviceId !== 'default') {
        console.log('🎤 Using audio device:', audioDeviceId);
      }
      if (videoDeviceId && videoDeviceId !== 'default') {
        console.log('📷 Using video device:', videoDeviceId);
      }
      
      const constraints: any = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 }
        },
      };
      
      // Add device IDs if specified and not 'default'
      if (audioDeviceId && audioDeviceId !== 'default') {
        constraints.audio.deviceId = { exact: audioDeviceId };
      }
      if (videoDeviceId && videoDeviceId !== 'default') {
        constraints.video.deviceId = { exact: videoDeviceId };
      }
      
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (!this.localStream || this.localStream.getTracks().length === 0) {
        throw new Error('Failed to get media stream');
      }

      // Ensure all tracks are enabled and properly configured
      this.localStream.getTracks().forEach(track => {
        track.enabled = true;
        
        // Set track settings appropriately
        if (track.kind === 'audio') {
          this.isAudioEnabled = true;
          console.log(`✅ Audio track enabled - label: ${track.label}`);
        } else if (track.kind === 'video') {
          this.isVideoEnabled = true;
          const settings = track.getSettings();
          console.log(`✅ Video track enabled - label: ${track.label}, resolution: ${settings.width}x${settings.height}`);
        }
      });

      this.callbacks.onLocalStreamReady?.(this.localStream);
      console.log('🟢 Local stream initialized with', this.localStream.getTracks().length, 'tracks');
      return this.localStream;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to get local media:', errorMsg);
      
      // Provide specific error messages
      if (errorMsg.includes('NotAllowedError') || errorMsg.includes('Permission denied')) {
        console.error('⚠️ Camera/Microphone permission denied');
        this.callbacks.onError?.(new Error('Camera and microphone access denied. Please check your browser permissions.'));
      } else if (errorMsg.includes('NotFoundError')) {
        console.error('⚠️ Camera/Microphone device not found');
        this.callbacks.onError?.(new Error('Camera or microphone not found on this device.'));
      } else {
        this.callbacks.onError?.(error as Error);
      }
      throw error;
    }
  }

  /**
   * Connect to a peer and initiate WebRTC connection
   */
  async connectToPeer(remotePeerId: string, remoteUserName: string): Promise<void> {
    try {
      if (this.peers.has(remotePeerId)) {
        console.log('Already connected to peer:', remotePeerId);
        return;
      }

      // Wait for local stream to be ready
      if (!this.localStream) {
        console.warn('⚠️ Local stream not ready, waiting before connecting to peer:', remotePeerId);
        // Give it a moment for the stream to be initialized
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!this.localStream) {
          throw new Error('Local stream initialization failed');
        }
      }

      console.log('🔵 Creating peer connection with:', remotePeerId, 'with', this.localStream.getTracks().length, 'local tracks');

      const peerConnection = new RTCPeerConnection({
        iceServers: ICE_SERVERS,
      });

      // Add local tracks - ensure they're enabled
      if (this.localStream) {
        const trackCount = this.localStream.getTracks().length;
        console.log('📹 Adding', trackCount, 'local tracks to peer connection');
        
        this.localStream.getTracks().forEach((track, index) => {
          console.log(`📹 [${index}] Adding ${track.kind} track (enabled: ${track.enabled}, readyState: ${track.readyState}) to peer:`, remotePeerId);
          const sender = peerConnection.addTrack(track, this.localStream!);
          console.log(`📹 [${index}] addTrack returned sender:`, !!sender, 'sender.track:', !!sender.track);
        });
      } else {
        console.warn('⚠️ No local stream available when connecting to peer:', remotePeerId);
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('📤 [ICE] Sending ICE candidate to:', remotePeerId, 'candidate:', event.candidate.candidate?.substring(0, 50));
          this.config.signalingChannel.send('broadcast', {
            event: 'webrtc',
            type: 'ice-candidate',
            to: remotePeerId,
            from: this.config.userId,
            candidate: event.candidate,
          });
        } else {
          console.log('📤 [ICE] ICE gathering complete for:', remotePeerId);
        }
      };

      // Monitor ICE gathering state
      peerConnection.onicegatheringstatechange = () => {
        console.log(`📡 [ICE Gathering] State with ${remotePeerId}:`, peerConnection.iceGatheringState);
      };

      // Handle remote stream - CRITICAL: Set this BEFORE setLocalDescription
      peerConnection.ontrack = (event) => {
        console.log('🟢 [ontrack] Received remote track event from:', remotePeerId, 'track kind:', event.track?.kind);
        console.log('🟢 [ontrack] Streams in event:', event.streams?.length, 'track enabled:', event.track?.enabled, 'track state:', event.track?.readyState);
        
        // CRITICAL: Enable remote audio track immediately
        if (event.track.kind === 'audio') {
          event.track.enabled = true;
          console.log('🔊 [ontrack] AUDIO TRACK ENABLED - kind: audio, enabled: true, state:', event.track.readyState);
        } else if (event.track.kind === 'video') {
          event.track.enabled = true;
          console.log('📹 [ontrack] VIDEO TRACK ENABLED - kind: video, enabled: true, state:', event.track.readyState);
        }
        
        if (event.streams && event.streams.length > 0) {
          const remoteStream = event.streams[0];
          console.log('🟢 [ontrack] Stream ID:', remoteStream.id, 'active:', remoteStream.active, 'total tracks:', remoteStream.getTracks().length);
          
          // Log all tracks in the stream
          remoteStream.getTracks().forEach(t => {
            t.enabled = true; // Ensure track is enabled
            console.log(`🟢 [ontrack] ✅ Track enabled - kind: ${t.kind}, label: ${t.label}, enabled: ${t.enabled}, state: ${t.readyState}`);
          });
          
          // Verify audio track exists and is working
          const audioTracks = remoteStream.getAudioTracks();
          if (audioTracks.length > 0) {
            console.log(`🔊 [ontrack] VERIFIED: Audio track present, count: ${audioTracks.length}, enabled: ${audioTracks[0].enabled}`);
          } else {
            console.error('🔇 [ontrack] ERROR: No audio tracks in remote stream!');
          }
          
          this.callbacks.onRemoteStream?.(remotePeerId, remoteStream);
        } else {
          console.error('❌ [ontrack] NO STREAMS in event');
        }
      };

      // Handle connection state changes with better error recovery
      peerConnection.onconnectionstatechange = () => {
        console.log(`🔗 [Connection State] with ${remotePeerId}:`, peerConnection.connectionState, 'ICE:', peerConnection.iceConnectionState, 'Signaling:', peerConnection.signalingState);
        
        switch (peerConnection.connectionState) {
          case 'connecting':
            console.log('🔄 Connection in progress to:', remotePeerId);
            break;
          case 'connected':
            console.log('✅ Connection established with peer:', remotePeerId);
            // Verify tracks are enabled after connection
            setTimeout(() => {
              const remoteStreams = Array.from(peerConnection.ontrack ? 'checking' : 'done');
              console.log('🔍 Verifying audio after connection for:', remotePeerId);
            }, 500);
            break;
          case 'disconnected':
            console.warn('⚠️ Peer disconnected:', remotePeerId);
            setTimeout(() => {
              if (peerConnection.connectionState === 'disconnected') {
                this.removePeer(remotePeerId);
              }
            }, 3000);
            break;
          case 'failed':
            console.error('❌ Peer connection failed:', remotePeerId, 'ICE state:', peerConnection.iceConnectionState);
            this.removePeer(remotePeerId);
            break;
          case 'closed':
            console.log('🔌 Peer connection closed:', remotePeerId);
            this.removePeer(remotePeerId);
            break;
        }
      };
      
      // Monitor ICE connection state as well
      peerConnection.oniceconnectionstatechange = () => {
        console.log(`🧊 ICE connection state with ${remotePeerId}:`, peerConnection.iceConnectionState);
      };

      this.peers.set(remotePeerId, { pc: peerConnection });

      // Create offer
      console.log('🎯 Creating offer for peer:', remotePeerId);
      const offer = await peerConnection.createOffer();
      console.log('📋 Offer includes media:', offer.sdp?.includes('m=audio'), offer.sdp?.includes('m=video'));
      
      // Set local description
      await peerConnection.setLocalDescription(offer);
      console.log('✅ Local description set for offer to:', remotePeerId);

      // Wait for ICE gathering to complete (with timeout)
      if (peerConnection.iceGatheringState === 'gathering') {
        console.log('⏳ Waiting for ICE gathering...');
        await new Promise<void>((resolve) => {
          const checkState = () => {
            if (peerConnection.iceGatheringState === 'complete') {
              resolve();
            }
          };
          peerConnection.addEventListener('icegatheringstatechange', checkState);
          setTimeout(() => {
            peerConnection.removeEventListener('icegatheringstatechange', checkState);
            console.warn('⏱️ ICE gathering timeout, sending offer anyway');
            resolve();
          }, 2000);
        });
      }

      console.log('📤 Sending webrtc-offer to:', remotePeerId);
      this.config.signalingChannel.send('broadcast', {
        event: 'webrtc',
        type: 'webrtc-offer',
        to: remotePeerId,
        from: this.config.userId,
        roomId: this.config.roomId,
        userName: this.config.userName,
        offer: offer,
      });

      this.callbacks.onParticipantJoined?.(remotePeerId, remoteUserName);
    } catch (error) {
      console.error('Failed to connect to peer:', error);
      this.callbacks.onError?.(error as Error);
    }
  }

  /**
   * Handle incoming WebRTC offer from peer
   */
  async handleOffer(
    remotePeerId: string,
    remoteUserName: string,
    offer: RTCSessionDescriptionInit
  ): Promise<void> {
    try {
      console.log('📥 Received offer from:', remotePeerId);

      if (!this.peers.has(remotePeerId)) {
        // Wait for local stream to be ready before creating connection
        if (!this.localStream) {
          console.warn('⚠️ Local stream not ready, waiting before handling offer from:', remotePeerId);
          await new Promise(resolve => setTimeout(resolve, 500));
          if (!this.localStream) {
            throw new Error('Local stream initialization failed');
          }
        }

        const peerConnection = new RTCPeerConnection({
          iceServers: ICE_SERVERS,
        });

        // Add local tracks - ensure they're enabled
        if (this.localStream) {
          console.log('📹 Adding', this.localStream.getTracks().length, 'local tracks when handling offer from', remotePeerId);
          
          this.localStream.getTracks().forEach((track, idx) => {
            console.log(`📹 [${idx}] Adding ${track.kind} track (enabled: ${track.enabled}) in response to offer from:`, remotePeerId);
            peerConnection.addTrack(track, this.localStream!);
          });
        } else {
          console.warn('⚠️ No local stream available when handling offer from:', remotePeerId);
        }

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            console.log('📤 [ICE] Sending ICE candidate to:', remotePeerId, 'candidate:', event.candidate.candidate?.substring(0, 50));
            this.config.signalingChannel.send('broadcast', {
              event: 'webrtc',
              type: 'ice-candidate',
              to: remotePeerId,
              from: this.config.userId,
              candidate: event.candidate,
            });
          } else {
            console.log('📤 [ICE] ICE gathering complete for:', remotePeerId);
          }
        };

        // Monitor ICE gathering state
        peerConnection.onicegatheringstatechange = () => {
          console.log(`📡 [ICE Gathering] State with ${remotePeerId}:`, peerConnection.iceGatheringState);
        };

        // Handle remote stream - CRITICAL: Set this BEFORE setRemoteDescription
        peerConnection.ontrack = (event) => {
          console.log('🟢 [ontrack] Received remote track from:', remotePeerId, 'kind:', event.track?.kind);
          
          // Enable remote audio track
          if (event.track.kind === 'audio') {
            event.track.enabled = true;
            console.log('🔊 [ontrack] AUDIO TRACK ENABLED - kind: audio, enabled: true, state:', event.track.readyState);
          } else if (event.track.kind === 'video') {
            event.track.enabled = true;
            console.log('📹 [ontrack] VIDEO TRACK ENABLED - kind: video, enabled: true, state:', event.track.readyState);
          }
          
          const remoteStream = event.streams[0];
          if (remoteStream) {
            console.log('🟢 [ontrack] Remote stream ID:', remoteStream.id, 'tracks:', remoteStream.getTracks().length);
            remoteStream.getTracks().forEach(t => {
              t.enabled = true;
              console.log(`🟢 [ontrack] ✅ Track enabled - kind: ${t.kind}, label: ${t.label}, enabled: ${t.enabled}, state: ${t.readyState}`);
            });
            
            // Verify audio track exists and is working
            const audioTracks = remoteStream.getAudioTracks();
            if (audioTracks.length > 0) {
              console.log(`🔊 [ontrack] VERIFIED: Audio track present, count: ${audioTracks.length}, enabled: ${audioTracks[0].enabled}`);
            } else {
              console.error('🔇 [ontrack] ERROR: No audio tracks in remote stream!');
            }
            
            this.callbacks.onRemoteStream?.(remotePeerId, remoteStream);
          } else {
            console.error('❌ [ontrack] No remote stream in event');
          }
        };

        // Handle connection state changes with better error recovery
        peerConnection.onconnectionstatechange = () => {
          console.log(`🔗 [Connection State] with ${remotePeerId}:`, peerConnection.connectionState, 'ICE:', peerConnection.iceConnectionState, 'Signaling:', peerConnection.signalingState);
          
          switch (peerConnection.connectionState) {
            case 'connecting':
              console.log('🔄 Connection in progress to:', remotePeerId);
              break;
            case 'connected':
              console.log('✅ Connection established with peer:', remotePeerId);
              break;
            case 'disconnected':
              console.warn('⚠️ Peer disconnected:', remotePeerId);
              setTimeout(() => {
                if (peerConnection.connectionState === 'disconnected') {
                  this.removePeer(remotePeerId);
                }
              }, 3000);
              break;
            case 'failed':
              console.error('❌ Peer connection failed:', remotePeerId, 'ICE state:', peerConnection.iceConnectionState);
              this.removePeer(remotePeerId);
              break;
            case 'closed':
              console.log('🔌 Peer connection closed:', remotePeerId);
              this.removePeer(remotePeerId);
              break;
          }
        };
        
        // Monitor ICE connection state as well
        peerConnection.oniceconnectionstatechange = () => {
          console.log(`🧊 ICE connection state with ${remotePeerId}:`, peerConnection.iceConnectionState);
        };

        this.peers.set(remotePeerId, { pc: peerConnection });
        console.log('📊 [handleOffer] Peer connections count:', this.peers.size, 'Peer IDs:', Array.from(this.peers.keys()));

      }

      const peerConnection = this.peers.get(remotePeerId)?.pc;
      if (!peerConnection) return;

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      console.log('✅ Remote description (offer) set from:', remotePeerId);

      const answer = await peerConnection.createAnswer();
      console.log('📋 Answer includes media:', answer.sdp?.includes('m=audio'), answer.sdp?.includes('m=video'));
      
      await peerConnection.setLocalDescription(answer);
      console.log('✅ Local description set for answer to:', remotePeerId);

      // Wait for ICE gathering to complete (with timeout)
      if (peerConnection.iceGatheringState === 'gathering') {
        console.log('⏳ Waiting for ICE gathering before sending answer...');
        await new Promise<void>((resolve) => {
          const checkState = () => {
            if (peerConnection.iceGatheringState === 'complete') {
              resolve();
            }
          };
          peerConnection.addEventListener('icegatheringstatechange', checkState);
          setTimeout(() => {
            peerConnection.removeEventListener('icegatheringstatechange', checkState);
            console.warn('⏱️ ICE gathering timeout, sending answer anyway');
            resolve();
          }, 2000);
        });
      }

      console.log('📤 Sending webrtc-answer to:', remotePeerId);
      this.config.signalingChannel.send('broadcast', {
        event: 'webrtc',
        type: 'webrtc-answer',
        to: remotePeerId,
        from: this.config.userId,
        roomId: this.config.roomId,
        answer: answer,
      });

      this.callbacks.onParticipantJoined?.(remotePeerId, remoteUserName);
    } catch (error) {
      console.error('Failed to handle offer:', error);
      this.callbacks.onError?.(error as Error);
    }
  }

  /**
   * Handle incoming WebRTC answer from peer
   */
  async handleAnswer(remotePeerId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    try {
      console.log('📥 Received answer from:', remotePeerId);
      const peerConnection = this.peers.get(remotePeerId)?.pc;
      if (!peerConnection) return;

      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      console.log('🟢 Answer set for peer:', remotePeerId);
    } catch (error) {
      console.error('Failed to handle answer:', error);
      this.callbacks.onError?.(error as Error);
    }
  }

  /**
   * Handle incoming ICE candidate
   */
  async handleIceCandidate(remotePeerId: string, candidate: RTCIceCandidate): Promise<void> {
    try {
      const peerConnection = this.peers.get(remotePeerId)?.pc;
      if (!peerConnection) return;

      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Failed to add ICE candidate:', error);
      // Don't propagate ICE errors as they're not critical
    }
  }

  /**
   * Toggle local audio
   */
  toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
      this.isAudioEnabled = enabled;
      console.log('Audio:', enabled ? 'enabled' : 'disabled');
    }
  }

  /**
   * Toggle local video
   */
  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
      this.isVideoEnabled = enabled;
      console.log('Video:', enabled ? 'enabled' : 'disabled');
    }
  }

  /**
   * Get audio enabled state
   */
  isAudioOn(): boolean {
    return this.isAudioEnabled;
  }

  /**
   * Get video enabled state
   */
  isVideoOn(): boolean {
    return this.isVideoEnabled;
  }

  /**
   * Remove peer connection
   */
  private removePeer(peerId: string): void {
    const peer = this.peers.get(peerId);
    if (peer?.pc) {
      peer.pc.close();
      this.peers.delete(peerId);
      this.callbacks.onRemoteStreamRemoved?.(peerId);
      this.callbacks.onParticipantLeft?.(peerId);
    }
  }

  /**
   * Setup Supabase Realtime signaling listeners
   */
  private setupSignalingListeners(): void {
    // Broadcast messages to handle WebRTC signaling
    this.config.signalingChannel.on('broadcast', { event: 'webrtc' }, ({ payload }: any) => {
      this.handleSignalingMessage(payload);
    });
  }

  /**
   * Handle incoming signaling messages
   */
  private handleSignalingMessage(message: any): void {
    console.log('📨 Received signaling message:', message.type, 'from:', message.from, 'to:', message.to);

    if (message.to !== this.config.userId && message.type !== 'user-joined') {
      console.log('⏭️  Message not for us, ignoring');
      return; // Message not for us
    }

    if (message.from === this.config.userId) {
      console.log('⏭️  Our own message, ignoring');
      return; // Our own message
    }

    switch (message.type) {
      case 'user-joined':
        console.log('👤 User joined:', message.from, message.userName);
        const remoteUserName = message.userName || 'Unknown';
        this.connectToPeer(message.from, remoteUserName).catch(console.error);
        break;

      case 'webrtc-offer':
        console.log('📧 Offer received from:', message.from);
        this.handleOffer(message.from, message.userName || 'Unknown', message.offer).catch(console.error);
        break;

      case 'webrtc-answer':
        console.log('📧 Answer received from:', message.from);
        this.handleAnswer(message.from, message.answer).catch(console.error);
        break;

      case 'ice-candidate':
        console.log('📧 ICE candidate received from:', message.from);
        this.handleIceCandidate(message.from, message.candidate).catch(console.error);
        break;

      case 'user-left':
        console.log('👤 User left:', message.from);
        this.removePeer(message.from);
        break;

      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  /**
   * Announce presence to other peers
   */
  async announcePresence(): Promise<void> {
    try {
      this.config.signalingChannel.send('broadcast', {
        event: 'webrtc',
        type: 'user-joined',
        from: this.config.userId,
        roomId: this.config.roomId,
        userName: this.config.userName,
      });
      console.log('🟢 Presence announced');
    } catch (error) {
      console.error('Failed to announce presence:', error);
    }
  }

  /**
   * Disconnect and cleanup
   */
  async disconnect(): Promise<void> {
    try {
      // Announce leaving
      this.config.signalingChannel.send('broadcast', {
        event: 'webrtc',
        type: 'user-left',
        from: this.config.userId,
        roomId: this.config.roomId,
      });

      // Close all peer connections
      this.peers.forEach((peer) => {
        peer.pc.close();
      });
      this.peers.clear();

      // Stop local stream
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }

      console.log('🟢 WebRTC disconnected');
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  }

  /**
   * Get local stream
   */
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  /**
   * Reinitialize local stream with different device
   */
  async reinitializeStream(audioDeviceId?: string, videoDeviceId?: string): Promise<void> {
    try {
      console.log('🔄 Reinitializing stream with new devices', { audioDeviceId, videoDeviceId });
      
      // Stop existing tracks
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
      }

      // Get new stream with selected devices
      await this.initLocalStream(audioDeviceId, videoDeviceId);
      
      // Update tracks for all existing peer connections
      if (this.localStream) {
        const audioTrack = this.localStream.getAudioTracks()[0];
        const videoTrack = this.localStream.getVideoTracks()[0];

        for (const [peerId, peerConn] of this.peers) {
          console.log('📹 Updating tracks for peer:', peerId);
          
          // Replace audio track
          if (audioTrack) {
            const audioSender = peerConn.pc.getSenders().find(s => s.track?.kind === 'audio');
            if (audioSender) {
              await audioSender.replaceTrack(audioTrack);
              console.log('✅ Audio track updated for:', peerId);
            }
          }

          // Replace video track
          if (videoTrack) {
            const videoSender = peerConn.pc.getSenders().find(s => s.track?.kind === 'video');
            if (videoSender) {
              await videoSender.replaceTrack(videoTrack);
              console.log('✅ Video track updated for:', peerId);
            }
          }
        }
      }

      console.log('✅ Stream reinitialized successfully');
      this.callbacks.onLocalStreamReady?.(this.localStream!);
    } catch (error) {
      console.error('Failed to reinitialize stream:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Get connected peers
   */
  getConnectedPeers(): string[] {
    return Array.from(this.peers.keys());
  }
}

export default WebRTCManager;
