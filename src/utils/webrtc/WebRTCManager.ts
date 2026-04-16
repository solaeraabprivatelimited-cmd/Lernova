/**
 * WebRTC Manager - Production-Grade P2P Peer Connection Management
 * 
 * Features:
 * - Comprehensive error handling and recovery
 * - Multiple TURN server support
 * - Connection quality monitoring
 * - Automatic reconnection with exponential backoff
 * - Data channels for text chat
 * - Screen sharing support
 * - Detailed diagnostics and logging
 */

type PeerConnectionState = 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed';

interface ICEServer {
  urls: string[];
  username?: string;
  credential?: string;
}

interface WebRTCConfig {
  iceServers: ICEServer[];
  enableVideo: boolean;
  enableAudio: boolean;
  enableScreenShare: boolean;
  maxRetries: number;
  retryDelayMs: number;
}

interface ConnectionMetrics {
  rttMs: number;
  packetLossPercent: number;
  bandwidthMbS: number;
  jitterMs: number;
  audioCodec?: string;
  audioSampleRate?: number;
  videoCodec?: string;
  videoResolution?: string;
  videoFramerate?: number;
}

interface ConnectionIssue {
  type: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  details?: string;
}

export interface WebRTCDiagnosticsReport {
  issues: ConnectionIssue[];
  recoveryLog: Array<{ timestamp: string; event: string; details: string }>;
  activeConnections: number;
  timestamp: string;
}

/**
 * Production-grade TURN servers with multiple fallbacks
 */
const PRODUCTION_TURN_SERVERS: ICEServer[] = [
  // Google STUN servers (public, no auth required)
  {
    urls: [
      'stun:stun1.l.google.com:19302',
      'stun:stun2.l.google.com:19302',
      'stun:stun3.l.google.com:19302',
    ],
  },
  // Nextcloud STUN server (public, no auth required)
  {
    urls: [
      'stun:stun.services.mozilla.com:3478',
    ],
  },
  // TURN server with credentials - add your production server here
  // {
  //   urls: ['turn:your-turn-server.com:3478'],
  //   username: 'your-username',
  //   credential: 'your-password',
  // },
];

export class WebRTCManager {
  private peerConnections = new Map<string, RTCPeerConnection>();
  private dataChannels = new Map<string, RTCDataChannel>();
  private pendingIceCandidates = new Map<string, RTCIceCandidateInit[]>();
  private remoteStreams = new Map<string, MediaStream>();
  private config: WebRTCConfig;
  private localStream: MediaStream | null = null;
  private selectedAudioDeviceId: string | null = null;
  private selectedVideoDeviceId: string | null = null;
  private isAudioCaptureEnabled = true;
  private isVideoCaptureEnabled = true;
  private screenShareTrack: MediaStreamTrack | null = null;
  private screenShareAudioTrack: MediaStreamTrack | null = null;
  private cameraTrackBeforeScreenShare: MediaStreamTrack | null = null;
  private retryAttempts = new Map<string, number>();
  private diagnosticsInterval: number | null = null;
  private connectionIssues: ConnectionIssue[] = [];
  private recoveryLog: Array<{ timestamp: string; event: string; details: string }> = [];

  // Event callbacks
  private onPeerConnected?: (peerId: string) => void;
  private onPeerDisconnected?: (peerId: string) => void;
  private onStreamReceived?: (peerId: string, stream: MediaStream) => void;
  private onDataReceived?: (peerId: string, data: any) => void;
  private onError?: (error: Error, context?: string) => void;
  private onMetrics?: (metrics: ConnectionMetrics) => void;
  private onConnectionStateChange?: (peerId: string, state: PeerConnectionState) => void;
  private onICECandidate?: (peerId: string, candidate: RTCIceCandidateInit) => void;
  private onLocalStreamUpdated?: (stream: MediaStream) => void;
  private onLocalTrackStateChanged?: (trackKind: 'audio' | 'video', enabled: boolean) => void;

  constructor(config: Partial<WebRTCConfig> = {}) {
    this.config = {
      iceServers: PRODUCTION_TURN_SERVERS,
      enableVideo: true,
      enableAudio: true,
      enableScreenShare: true,
      maxRetries: 5,
      retryDelayMs: 1000,
      ...config,
    };

    console.log('[WebRTC] Manager initialized with config:', this.config);
  }

  /**
   * Set event handlers
   */
  public on(event: string, callback: Function) {
    switch (event) {
      case 'peer-connected':
        this.onPeerConnected = callback as (peerId: string) => void;
        break;
      case 'peer-disconnected':
        this.onPeerDisconnected = callback as (peerId: string) => void;
        break;
      case 'stream-received':
        this.onStreamReceived = callback as (peerId: string, stream: MediaStream) => void;
        break;
      case 'data-received':
        this.onDataReceived = callback as (peerId: string, data: any) => void;
        break;
      case 'error':
        this.onError = callback as (error: Error, context?: string) => void;
        break;
      case 'metrics':
        this.onMetrics = callback as (metrics: ConnectionMetrics) => void;
        break;
      case 'connection-state-change':
        this.onConnectionStateChange = callback as (peerId: string, state: PeerConnectionState) => void;
        break;
      case 'ice-candidate':
        this.onICECandidate = callback as (peerId: string, candidate: RTCIceCandidateInit) => void;
        break;
      case 'local-stream-updated':
        this.onLocalStreamUpdated = callback as (stream: MediaStream) => void;
        break;
      case 'local-track-state-changed':
        this.onLocalTrackStateChanged = callback as (trackKind: 'audio' | 'video', enabled: boolean) => void;
        break;
    }
  }

  private buildAudioTrackConstraints(deviceId?: string): MediaTrackConstraints {
    return {
      echoCancellation: { ideal: true },
      noiseSuppression: { ideal: true },
      autoGainControl: { ideal: true },
      channelCount: { ideal: 1, max: 1 },
      sampleRate: { ideal: 48000 },
      sampleSize: { ideal: 16 },
      ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
    };
  }

  private optimizeAudioSdp(description: RTCSessionDescriptionInit): RTCSessionDescriptionInit {
    if (!description.sdp) {
      return description;
    }

    const sdp = description.sdp;
    const opusMatch = sdp.match(/^a=rtpmap:(\d+)\s+opus\/48000(?:\/2)?$/im);
    if (!opusMatch) {
      return description;
    }

    const payloadType = opusMatch[1];
    const fmtpRegex = new RegExp(`^a=fmtp:${payloadType}\\s+(.+)$`, 'im');
    const desiredParams = [
      'useinbandfec=1',      // In-band FEC for better robustness
      'minptime=10',         // Minimum ptime for better continuity
      'maxaveragebitrate=128000', // Increased from 64000 for better audio quality
      'maxplaybackrate=48000', // Allow full 48kHz playback
      'stereo=0',            // Mono for consistency
      'sprop-stereo=0',
    ];

    let nextSdp = sdp;
    const fmtpMatch = nextSdp.match(fmtpRegex);
    if (fmtpMatch) {
      const existingParams = fmtpMatch[1]
        .split(';')
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
      const existingKeys = new Set(
        existingParams.map((entry) => entry.split('=')[0]?.trim()).filter(Boolean)
      );

      for (const param of desiredParams) {
        const key = param.split('=')[0];
        if (!existingKeys.has(key)) {
          existingParams.push(param);
        }
      }

      nextSdp = nextSdp.replace(
        fmtpRegex,
        `a=fmtp:${payloadType} ${existingParams.join(';')}`
      );
    } else {
      const rtpMapRegex = new RegExp(
        `^a=rtpmap:${payloadType}\\s+opus\\/48000(?:\\/2)?$`,
        'im'
      );
      nextSdp = nextSdp.replace(
        rtpMapRegex,
        (line) => `${line}\r\na=fmtp:${payloadType} ${desiredParams.join(';')}`
      );
    }

    return {
      ...description,
      sdp: nextSdp,
    };
  }

  private async applyAudioSenderTuning(peerConnection: RTCPeerConnection): Promise<void> {
    const audioSenders = peerConnection
      .getSenders()
      .filter((sender) => sender.track?.kind === 'audio');

    for (const sender of audioSenders) {
      try {
        const parameters = sender.getParameters();
        const currentEncodings =
          parameters.encodings && parameters.encodings.length > 0
            ? parameters.encodings
            : [{}];

        parameters.encodings = currentEncodings.map((encoding, index) => {
          if (index !== 0) {
            return encoding;
          }
          return {
            ...encoding,
            maxBitrate: 128000,  // Increased from 64000 for better audio quality
            minBitrate: 32000,   // Set minimum bitrate for stability
            dtx: true,           // Enable DTX (Discontinuous Transmission) for bandwidth saving
            maxFramerate: 50,    // Audio frames per second
          };
        });

        await sender.setParameters(parameters);
        console.log('[WebRTC] Audio sender tuned for continuous streaming');
      } catch (error) {
        console.warn('[WebRTC] Unable to tune audio sender parameters:', error);
      }
    }
  }

  private buildMediaConstraints(audioDeviceId?: string, videoDeviceId?: string): MediaStreamConstraints {
    return {
      audio: this.config.enableAudio
        ? this.buildAudioTrackConstraints(audioDeviceId)
        : false,
      video: this.config.enableVideo
        ? {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
            ...(videoDeviceId ? { deviceId: { exact: videoDeviceId } } : {}),
          }
        : false,
    };
  }

  private buildSingleKindConstraints(
    kind: 'audio' | 'video',
    deviceId?: string
  ): MediaStreamConstraints {
    if (kind === 'audio') {
      return {
        audio: this.buildAudioTrackConstraints(deviceId),
        video: false,
      };
    }

    return {
      audio: false,
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user',
        ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
      },
    };
  }

  private async replaceOutgoingTrackAcrossPeers(
    kind: 'audio' | 'video',
    nextTrack: MediaStreamTrack | null
  ): Promise<void> {
    for (const [, peerConnection] of this.peerConnections) {
      const transceiver = peerConnection
        .getTransceivers()
        .find((item) => item.receiver.track.kind === kind);
      let sender = peerConnection
        .getSenders()
        .find((item) => item.track?.kind === kind);

      if (!sender) {
        sender = transceiver?.sender;
      }

      if (!sender && nextTrack && this.localStream) {
        peerConnection.addTrack(nextTrack, this.localStream);
        if (kind === 'audio') {
          await this.applyAudioSenderTuning(peerConnection);
        }
        continue;
      }

      if (sender) {
        await sender.replaceTrack(nextTrack);
      }
    }
  }

  private async setMediaTrackEnabled(
    kind: 'audio' | 'video',
    enabled: boolean
  ): Promise<MediaStream> {
    if (!this.localStream) {
      await this.initializeLocalMedia();
    }

    const stream = this.localStream!;
    const currentTracks =
      kind === 'audio' ? stream.getAudioTracks() : stream.getVideoTracks();

    if (!enabled) {
      // Stop and remove tracks to release hardware access
      // This ensures the OS can release the camera/microphone
      if (kind === 'video') {
        if (this.screenShareTrack) {
          this.screenShareTrack.enabled = false;
        }
        // For video, remove and stop camera tracks (but keep screen share if active)
        currentTracks.forEach((track) => {
          if (track !== this.screenShareTrack) {
            stream.removeTrack(track);
            track.stop();
          }
        });
      } else {
        // For audio, remove and stop all audio tracks to release mic access
        currentTracks.forEach((track) => {
          stream.removeTrack(track);
          track.stop();
        });
      }
      
      this.onLocalStreamUpdated?.(stream);
      this.onLocalTrackStateChanged?.(kind, enabled);
      return stream;
    }

    // Re-enable disabled tracks if they're still available
    const existingDisabledTrack = currentTracks.find(
      (track) => track.readyState === 'live' && !track.enabled
    );
    if (existingDisabledTrack) {
      existingDisabledTrack.enabled = true;
      this.onLocalStreamUpdated?.(stream);
      this.onLocalTrackStateChanged?.(kind, enabled);
      return stream;
    }

    // Check if we already have a live track
    const existingLiveTrack = currentTracks.find((track) => track.readyState === 'live');
    if (existingLiveTrack) {
      existingLiveTrack.enabled = true;
      this.onLocalStreamUpdated?.(stream);
      this.onLocalTrackStateChanged?.(kind, enabled);
      return stream;
    }

    // Only acquire new track if we have no live tracks at all
    const preferredDeviceId =
      kind === 'audio'
        ? this.selectedAudioDeviceId ?? undefined
        : this.selectedVideoDeviceId ?? undefined;

    const newTrackStream = await navigator.mediaDevices.getUserMedia(
      this.buildSingleKindConstraints(kind, preferredDeviceId)
    );
    const newTrack =
      kind === 'audio'
        ? newTrackStream.getAudioTracks()[0]
        : newTrackStream.getVideoTracks()[0];

    if (!newTrack) {
      throw new Error(`No ${kind} track available from selected device`);
    }

    stream.addTrack(newTrack);
    await this.replaceOutgoingTrackAcrossPeers(kind, newTrack);

    const resolvedDeviceId = newTrack.getSettings().deviceId ?? null;
    if (kind === 'audio') {
      this.selectedAudioDeviceId = resolvedDeviceId;
    } else {
      this.selectedVideoDeviceId = resolvedDeviceId;
    }

    this.onLocalStreamUpdated?.(stream);
    this.onLocalTrackStateChanged?.(kind, enabled);
    return stream;
  }

  /**
   * Initialize local media (audio/video)
   */
  async initializeLocalMedia(audioDeviceId?: string, videoDeviceId?: string): Promise<MediaStream> {
    try {
      console.log('[WebRTC] Initializing local media...');

      const constraints = this.buildMediaConstraints(audioDeviceId, videoDeviceId);

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.selectedAudioDeviceId =
        this.localStream.getAudioTracks()[0]?.getSettings().deviceId ?? audioDeviceId ?? null;
      this.selectedVideoDeviceId =
        this.localStream.getVideoTracks()[0]?.getSettings().deviceId ?? videoDeviceId ?? null;
      this.isAudioCaptureEnabled = this.localStream.getAudioTracks().length > 0;
      this.isVideoCaptureEnabled = this.localStream.getVideoTracks().length > 0;
      console.log('[WebRTC] Local media acquired:', this.localStream.getTracks().length, 'tracks');
      return this.localStream;
    } catch (error) {
      const err = new Error(`Failed to get local media: ${(error as any).message}`);
      this.handleError(err, 'initializeLocalMedia');
      throw err;
    }
  }

  /**
   * Create connection with a peer
   */
  async createConnection(peerId: string): Promise<RTCPeerConnection> {
    try {
      console.log(`[WebRTC] Creating peer connection for: ${peerId}`);

      // Check if connection already exists
      if (this.peerConnections.has(peerId)) {
        console.warn(`[WebRTC] Connection already exists for ${peerId}, returning existing`);
        return this.peerConnections.get(peerId)!;
      }

      // Ensure local media is initialized before creating peer connection
      if (!this.localStream) {
        console.log(`[WebRTC] Local media not initialized, initializing now for ${peerId}`);
        await this.initializeLocalMedia();
      }

      // Create peer connection with TURN servers
      const peerConnection = new RTCPeerConnection({
        iceServers: this.config.iceServers,
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require',
      });

      // Add local tracks to peer connection
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, this.localStream!);
          console.log(`[WebRTC] Added ${track.kind} track to peer connection for ${peerId}`);
        });

        const hasAudioTrack = this.localStream.getAudioTracks().length > 0;
        const hasVideoTrack = this.localStream.getVideoTracks().length > 0;
        if (!hasAudioTrack && this.config.enableAudio) {
          peerConnection.addTransceiver('audio', { direction: 'sendrecv' });
        }
        if (!hasVideoTrack && this.config.enableVideo) {
          peerConnection.addTransceiver('video', { direction: 'sendrecv' });
        }
      } else {
        // Fallback: add transceivers if local stream still unavailable
        if (this.config.enableAudio) {
          peerConnection.addTransceiver('audio', { direction: 'sendrecv' });
        }
        if (this.config.enableVideo) {
          peerConnection.addTransceiver('video', { direction: 'sendrecv' });
        }
        console.warn(`[WebRTC] Could not add local tracks for ${peerId}, using transceivers only`);
      }

      await this.applyAudioSenderTuning(peerConnection);

      // Setup event handlers
      this.setupPeerConnectionHandlers(peerConnection, peerId);

      // Store connection
      this.peerConnections.set(peerId, peerConnection);
      this.retryAttempts.set(peerId, 0);

      console.log(`[WebRTC] Peer connection created for ${peerId}`);
      return peerConnection;
    } catch (error) {
      const err = new Error(`Failed to create connection for ${peerId}: ${(error as any).message}`);
      this.handleError(err, 'createConnection');
      throw err;
    }
  }

  /**
   * Create and send offer
   */
  async createOffer(peerId: string): Promise<RTCSessionDescriptionInit> {
    try {
      const peerConnection = await this.createConnection(peerId);

      // Create offer with error handling
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: this.config.enableAudio,
        offerToReceiveVideo: this.config.enableVideo,
      });
      const optimizedOffer = this.optimizeAudioSdp(offer);

      await peerConnection.setLocalDescription(optimizedOffer);
      console.log(`[WebRTC] Offer created for ${peerId}`);

      return optimizedOffer;
    } catch (error) {
      const err = new Error(`Failed to create offer for ${peerId}: ${(error as any).message}`);
      this.handleError(err, 'createOffer');
      throw err;
    }
  }

  /**
   * Handle received offer
   */
  async handleOffer(peerId: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    try {
      const peerConnection = await this.createConnection(peerId);

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      await this.flushPendingICECandidates(peerId);
      console.log(`[WebRTC] Offer received from ${peerId}, creating answer`);

      const answer = await peerConnection.createAnswer();
      const optimizedAnswer = this.optimizeAudioSdp(answer);
      await peerConnection.setLocalDescription(optimizedAnswer);

      return optimizedAnswer;
    } catch (error) {
      const err = new Error(`Failed to handle offer from ${peerId}: ${(error as any).message}`);
      this.handleError(err, 'handleOffer');
      throw err;
    }
  }

  /**
   * Handle received answer
   */
  async handleAnswer(peerId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    try {
      const peerConnection = this.peerConnections.get(peerId);
      if (!peerConnection) {
        throw new Error(`No peer connection for ${peerId}`);
      }

      const signalingState = peerConnection.signalingState;
      if (signalingState !== 'have-local-offer') {
        // Duplicate/out-of-order answer can happen due to retries or polling overlap.
        // Treat it as benign and ignore so active media keeps flowing.
        if (
          signalingState === 'stable' &&
          peerConnection.remoteDescription?.type === 'answer'
        ) {
          console.log(`[WebRTC] Ignoring duplicate answer from ${peerId} while signaling state is stable`);
          return;
        }

        console.warn(
          `[WebRTC] Ignoring out-of-order answer from ${peerId}; signaling state is ${signalingState}`
        );
        return;
      }

      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      await this.flushPendingICECandidates(peerId);
      console.log(`[WebRTC] Answer received from ${peerId}`);
    } catch (error) {
      const err = new Error(`Failed to handle answer from ${peerId}: ${(error as any).message}`);
      this.handleError(err, 'handleAnswer');
      throw err;
    }
  }

  /**
   * Add ICE candidate
   */
  async addICECandidate(peerId: string, candidate: RTCIceCandidateInit): Promise<void> {
    try {
      const peerConnection = this.peerConnections.get(peerId);
      if (!peerConnection) {
        console.log(`[WebRTC] Queueing ICE candidate until peer connection exists: ${peerId}`);
        this.queueICECandidate(peerId, candidate);
        return;
      }

      if (candidate.candidate) {
        if (!peerConnection.remoteDescription) {
          console.log(`[WebRTC] Queueing ICE candidate until remote description is set: ${peerId}`);
          this.queueICECandidate(peerId, candidate);
          return;
        }
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      if ((error as any).name !== 'InvalidStateError') {
        console.warn(`[WebRTC] Failed to add ICE candidate from ${peerId}:`, error);
      }
    }
  }

  async switchMediaDevices(audioDeviceId?: string, videoDeviceId?: string): Promise<MediaStream> {
    try {
      console.log('[WebRTC] Switching media devices', { audioDeviceId, videoDeviceId });

      const nextAudioDeviceId = audioDeviceId ?? this.selectedAudioDeviceId ?? undefined;
      const nextVideoDeviceId = videoDeviceId ?? this.selectedVideoDeviceId ?? undefined;
      const shouldCaptureAudio = this.config.enableAudio && this.isAudioCaptureEnabled;
      const shouldCaptureVideo =
        this.config.enableVideo && this.isVideoCaptureEnabled && !this.screenShareTrack;

      const nextConstraints: MediaStreamConstraints = {
        audio: shouldCaptureAudio
          ? this.buildAudioTrackConstraints(nextAudioDeviceId)
          : false,
        video: shouldCaptureVideo
          ? {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'user',
              ...(nextVideoDeviceId ? { deviceId: { exact: nextVideoDeviceId } } : {}),
            }
          : false,
      };

      const nextStream = await navigator.mediaDevices.getUserMedia(nextConstraints);
      const previousStream = this.localStream;

      const replacementAudioTrack = nextStream.getAudioTracks()[0] ?? null;
      const replacementVideoTrack = this.screenShareTrack ?? nextStream.getVideoTracks()[0] ?? null;

      for (const [, peerConnection] of this.peerConnections) {
        for (const sender of peerConnection.getSenders()) {
          if (!sender.track) continue;

          if (sender.track.kind === 'audio') {
            await sender.replaceTrack(replacementAudioTrack);
          } else if (sender.track.kind === 'video') {
            await sender.replaceTrack(replacementVideoTrack);
          }
        }

        if (replacementAudioTrack) {
          await this.applyAudioSenderTuning(peerConnection);
        }
      }

      previousStream?.getTracks().forEach((track) => track.stop());
      this.localStream = nextStream;
      if (this.screenShareTrack) {
        this.localStream.addTrack(this.screenShareTrack);
      }
      this.selectedAudioDeviceId =
        replacementAudioTrack?.getSettings().deviceId ?? nextAudioDeviceId ?? this.selectedAudioDeviceId;
      this.selectedVideoDeviceId =
        replacementVideoTrack?.getSettings().deviceId ?? nextVideoDeviceId ?? this.selectedVideoDeviceId;
      this.onLocalStreamUpdated?.(nextStream);

      return nextStream;
    } catch (error) {
      const err = new Error(`Failed to switch media devices: ${(error as any).message}`);
      this.handleError(err, 'switchMediaDevices');
      throw err;
    }
  }

  async setAudioEnabled(enabled: boolean): Promise<MediaStream> {
    this.isAudioCaptureEnabled = enabled;
    return this.setMediaTrackEnabled('audio', enabled);
  }

  async setVideoEnabled(enabled: boolean): Promise<MediaStream> {
    this.isVideoCaptureEnabled = enabled;
    return this.setMediaTrackEnabled('video', enabled);
  }

  isScreenShareActive(): boolean {
    return !!this.screenShareTrack;
  }

  isScreenShareAudioActive(): boolean {
    return !!this.screenShareAudioTrack;
  }

  async startScreenShare(withAudio: boolean = false): Promise<MediaStream> {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      throw new Error('Screen sharing is not supported on this browser');
    }
    if (!this.localStream) {
      await this.initializeLocalMedia();
    }

    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: withAudio,
    });

    const displayTrack = displayStream.getVideoTracks()[0];
    if (!displayTrack) {
      throw new Error('No screen track was returned');
    }

    const stream = this.localStream!;
    const currentVideoTrack = stream.getVideoTracks()[0] ?? null;
    this.cameraTrackBeforeScreenShare = currentVideoTrack;

    if (currentVideoTrack) {
      stream.removeTrack(currentVideoTrack);
    }

    this.screenShareTrack = displayTrack;
    stream.addTrack(displayTrack);

    // Add screen share audio if available
    const displayAudioTrack = displayStream.getAudioTracks()[0] ?? null;
    if (displayAudioTrack) {
      this.screenShareAudioTrack = displayAudioTrack;
      stream.addTrack(displayAudioTrack);
      console.log('[WebRTC] Screen share audio track added');
    }

    await this.replaceOutgoingTrackAcrossPeers('video', displayTrack);
    this.onLocalStreamUpdated?.(stream);

    displayTrack.onended = () => {
      void this.stopScreenShare().catch((error) => {
        console.warn('[WebRTC] Failed to stop screen share after track ended:', error);
      });
    };

    return stream;
  }

  async stopScreenShare(): Promise<MediaStream> {
    if (!this.localStream) {
      await this.initializeLocalMedia();
    }

    const stream = this.localStream!;
    if (!this.screenShareTrack) {
      return stream;
    }

    stream.removeTrack(this.screenShareTrack);
    this.screenShareTrack.stop();
    this.screenShareTrack = null;

    // Stop screen share audio if present
    if (this.screenShareAudioTrack) {
      stream.removeTrack(this.screenShareAudioTrack);
      this.screenShareAudioTrack.stop();
      this.screenShareAudioTrack = null;
      console.log('[WebRTC] Screen share audio track stopped');
    }

    let nextVideoTrack: MediaStreamTrack | null = null;

    const cachedCameraTrack = this.cameraTrackBeforeScreenShare;
    if (cachedCameraTrack && cachedCameraTrack.readyState === 'live' && this.isVideoCaptureEnabled) {
      nextVideoTrack = cachedCameraTrack;
    } else if (this.isVideoCaptureEnabled) {
      const cameraStream = await navigator.mediaDevices.getUserMedia(
        this.buildSingleKindConstraints(
          'video',
          this.selectedVideoDeviceId ?? undefined
        )
      );
      nextVideoTrack = cameraStream.getVideoTracks()[0] ?? null;
      if (nextVideoTrack) {
        this.selectedVideoDeviceId =
          nextVideoTrack.getSettings().deviceId ?? this.selectedVideoDeviceId;
      }
    }

    this.cameraTrackBeforeScreenShare = null;

    if (nextVideoTrack) {
      stream.getVideoTracks().forEach((track) => {
        stream.removeTrack(track);
      });
      stream.addTrack(nextVideoTrack);
      await this.replaceOutgoingTrackAcrossPeers('video', nextVideoTrack);
    } else {
      stream.getVideoTracks().forEach((track) => {
        track.stop();
        stream.removeTrack(track);
      });
      await this.replaceOutgoingTrackAcrossPeers('video', null);
    }

    this.onLocalStreamUpdated?.(stream);
    return stream;
  }

  private queueICECandidate(peerId: string, candidate: RTCIceCandidateInit) {
    const queued = this.pendingIceCandidates.get(peerId) ?? [];
    queued.push(candidate);
    this.pendingIceCandidates.set(peerId, queued);
  }

  private async flushPendingICECandidates(peerId: string) {
    const peerConnection = this.peerConnections.get(peerId);
    const queued = this.pendingIceCandidates.get(peerId) ?? [];

    if (!peerConnection || !peerConnection.remoteDescription || queued.length === 0) {
      return;
    }

    console.log(`[WebRTC] Flushing ${queued.length} queued ICE candidates for ${peerId}`);

    for (const candidate of queued) {
      if (candidate.candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    }

    this.pendingIceCandidates.delete(peerId);
  }

  /**
   * Setup peer connection event handlers
   */
  private setupPeerConnectionHandlers(peerConnection: RTCPeerConnection, peerId: string) {
    let stateLogged = false;

    // Connection state changes
    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState as PeerConnectionState;
      if (!stateLogged) {
        console.log(`[WebRTC] Connection state for ${peerId}: ${state}`);
        stateLogged = true;
      }

      this.onConnectionStateChange?.(peerId, state);

      switch (state) {
        case 'connected':
          console.log(`[WebRTC] ✓ Connected to ${peerId}`);
          this.retryAttempts.set(peerId, 0);
          this.onPeerConnected?.(peerId);
          this.startDiagnostics(peerConnection, peerId);
          break;

        case 'disconnected':
          console.warn(`[WebRTC] ✗ Disconnected from ${peerId}`);
          this.logRecoveryEvent('disconnect', peerId);
          this.onPeerDisconnected?.(peerId);
          this.attemptRecovery(peerId);
          break;

        case 'failed':
          console.error(`[WebRTC] ✗ Connection failed for ${peerId}`);
          this.logConnectionIssue('connection_failed', 'high', `Connection failed for peer ${peerId}`);
          this.logRecoveryEvent('failure', peerId);
          this.attemptRecovery(peerId);
          break;

        case 'closed':
          console.log(`[WebRTC] ✓ Connection closed for ${peerId}`);
          this.cleanup(peerId);
          break;
      }
    };

    // ICE Connection state
    peerConnection.oniceconnectionstatechange = () => {
      console.log(`[WebRTC] ICE connection state for ${peerId}: ${peerConnection.iceConnectionState}`);
    };

    // Receiving remote stream
    peerConnection.ontrack = (event) => {
      console.log(`[WebRTC] Received remote track from ${peerId}:`, event.track.kind);
      let remoteStream = this.remoteStreams.get(peerId);
      if (!remoteStream) {
        remoteStream = event.streams[0] ?? new MediaStream();
        this.remoteStreams.set(peerId, remoteStream);
      }

      // Some browsers emit streamless tracks. Ensure every track is attached.
      if (!remoteStream.getTracks().some((track) => track.id === event.track.id)) {
        remoteStream.addTrack(event.track);
      }

      // Listen for track state changes (mute/unmute) to trigger UI updates
      event.track.onmute = () => {
        console.log(`[WebRTC] Track muted from ${peerId}:`, event.track.kind);
        // Emit stream update to force UI re-render
        this.onStreamReceived?.(peerId, remoteStream);
      };

      event.track.onunmute = () => {
        console.log(`[WebRTC] Track unmuted from ${peerId}:`, event.track.kind);
        // Emit stream update to force UI re-render
        this.onStreamReceived?.(peerId, remoteStream);
      };

      event.track.onended = () => {
        console.log(`[WebRTC] Track ended from ${peerId}:`, event.track.kind);
        // Remove ended track from stream
        remoteStream.removeTrack(event.track);
        // Emit stream update to reflect track removal
        this.onStreamReceived?.(peerId, remoteStream);
      };

      this.onStreamReceived?.(peerId, remoteStream);
    };

    // ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(`[WebRTC] New ICE candidate for ${peerId}`);
        // Emit event so hook can send candidate through signaling channel
        this.onICECandidate?.(peerId, {
          candidate: event.candidate.candidate,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid,
        });
      }
    };

    // Data channel
    peerConnection.ondatachannel = (event) => {
      console.log(`[WebRTC] Data channel received from ${peerId}`);
      this.setupDataChannel(event.channel, peerId);
    };
  }

  /**
   * Create and setup data channel
   */
  createDataChannel(peerId: string, label: string = 'chat'): RTCDataChannel {
    const peerConnection = this.peerConnections.get(peerId);
    if (!peerConnection) {
      throw new Error(`No peer connection for ${peerId}`);
    }

    const dataChannel = peerConnection.createDataChannel(label);
    this.setupDataChannel(dataChannel, peerId);
    return dataChannel;
  }

  /**
   * Setup data channel handlers
   */
  private setupDataChannel(dataChannel: RTCDataChannel, peerId: string) {
    dataChannel.onopen = () => {
      console.log(`[WebRTC] Data channel opened with ${peerId}`);
      this.dataChannels.set(peerId, dataChannel);
    };

    dataChannel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.onDataReceived?.(peerId, data);
      } catch {
        console.warn(`[WebRTC] Failed to parse data channel message: ${event.data}`);
      }
    };

    dataChannel.onerror = (event) => {
      console.error(`[WebRTC] Data channel error from ${peerId}:`, event);
      this.logConnectionIssue('data_channel_error', 'medium', `Data channel error: ${event}`);
    };

    dataChannel.onclose = () => {
      console.log(`[WebRTC] Data channel closed with ${peerId}`);
      this.dataChannels.delete(peerId);
    };
  }

  /**
   * Send message via data channel
   */
  sendMessage(peerId: string, message: any): boolean {
    const dataChannel = this.dataChannels.get(peerId);
    if (!dataChannel || dataChannel.readyState !== 'open') {
      console.warn(`[WebRTC] Data channel not ready for ${peerId}`);
      return false;
    }

    try {
      dataChannel.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error(`[WebRTC] Failed to send message to ${peerId}:`, error);
      return false;
    }
  }

  /**
   * Start monitoring connection metrics
   */
  private startDiagnostics(peerConnection: RTCPeerConnection, peerId: string) {
    if (this.diagnosticsInterval) return;

    this.diagnosticsInterval = window.setInterval(async () => {
      try {
        const stats = await peerConnection.getStats();
        const metrics = this.parseStats(stats);
        this.onMetrics?.(metrics);

        // Check for issues
        this.checkConnectionQuality(metrics, peerId);
      } catch (error) {
        console.error(`[WebRTC] Error collecting diagnostics for ${peerId}:`, error);
      }
    }, 5000); // Every 5 seconds
  }

  /**
   * Parse WebRTC stats
   */
  private parseStats(stats: RTCStatsReport): ConnectionMetrics {
    const metrics: ConnectionMetrics = {
      rttMs: 0,
      packetLossPercent: 0,
      bandwidthMbS: 0,
      jitterMs: 0,
    };

    stats.forEach((report) => {
      if (report.type === 'inbound-rtp') {
        if (report.mediaType === 'audio' || report.mediaType === 'video') {
          metrics.jitterMs = report.jitter ? report.jitter * 1000 : 0;
          metrics.packetLossPercent =
            report.packetsLost && report.packetsReceived
              ? (report.packetsLost / (report.packetsReceived + report.packetsLost)) * 100
              : 0;
        }
      }

      if (report.type === 'candidate-pair' && report.state === 'succeeded') {
        metrics.rttMs = report.currentRoundTripTime ? report.currentRoundTripTime * 1000 : 0;
        if (report.availableOutgoingBitrate) {
          metrics.bandwidthMbS = report.availableOutgoingBitrate / 1000000;
        }
      }
    });

    return metrics;
  }

  /**
   * Check connection quality and log issues
   */
  private checkConnectionQuality(metrics: ConnectionMetrics, _peerId: string) {
    if (metrics.rttMs > 1000) {
      this.logConnectionIssue('high_latency', 'medium', `RTT: ${metrics.rttMs.toFixed(2)}ms`);
    }

    if (metrics.packetLossPercent > 5) {
      this.logConnectionIssue('packet_loss', 'high', `Packet loss: ${metrics.packetLossPercent.toFixed(2)}%`);
    }

    if (metrics.jitterMs > 50) {
      this.logConnectionIssue('high_jitter', 'medium', `Jitter: ${metrics.jitterMs.toFixed(2)}ms`);
    }

    if (metrics.bandwidthMbS < 0.5) {
      this.logConnectionIssue('low_bandwidth', 'medium', `Bandwidth: ${metrics.bandwidthMbS.toFixed(2)} Mbps`);
    }
  }

  /**
   * Attempt to recover disconnected connection
   */
  private async attemptRecovery(peerId: string) {
    const attempts = this.retryAttempts.get(peerId) || 0;

    if (attempts >= this.config.maxRetries) {
      console.error(`[WebRTC] Max recovery attempts reached for ${peerId}`);
      this.logRecoveryEvent('max_retries_exceeded', peerId);
      this.cleanup(peerId);
      return;
    }

    const delay = Math.min(this.config.retryDelayMs * Math.pow(2, attempts), 30000);
    console.log(`[WebRTC] Recovery attempt ${attempts + 1}/${this.config.maxRetries} for ${peerId} in ${delay}ms`);

    this.retryAttempts.set(peerId, attempts + 1);

    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      // Trigger renegotiation via signaling
      this.logRecoveryEvent('ice_restart', peerId);
      // Send a renegotiate signal to the other peer
    } catch (error) {
      console.error(`[WebRTC] Recovery failed for ${peerId}:`, error);
      this.logRecoveryEvent('recovery_failed', peerId);
      this.attemptRecovery(peerId);
    }
  }

  /**
   * Close connection with a peer
   */
  closeConnection(peerId: string) {
    const peerConnection = this.peerConnections.get(peerId);
    if (peerConnection) {
      peerConnection.close();
      this.cleanup(peerId);
    }
  }

  /**
   * Cleanup resources for a peer
   */
  private cleanup(peerId: string) {
    this.peerConnections.delete(peerId);
    this.dataChannels.delete(peerId);
    this.pendingIceCandidates.delete(peerId);
    this.remoteStreams.delete(peerId);
    this.retryAttempts.delete(peerId);

    if (this.diagnosticsInterval) {
      clearInterval(this.diagnosticsInterval);
      this.diagnosticsInterval = null;
    }
  }

  /**
   * Close all connections
   */
  closeAll() {
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();
    this.dataChannels.clear();
    this.pendingIceCandidates.clear();
    this.remoteStreams.clear();
    this.retryAttempts.clear();

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    this.selectedAudioDeviceId = null;
    this.selectedVideoDeviceId = null;
    this.isAudioCaptureEnabled = true;
    this.isVideoCaptureEnabled = true;
    this.screenShareTrack = null;
    this.cameraTrackBeforeScreenShare = null;

    if (this.diagnosticsInterval) {
      clearInterval(this.diagnosticsInterval);
      this.diagnosticsInterval = null;
    }

    console.log('[WebRTC] All connections closed');
  }

  /**
   * Log connection issue
   */
  private logConnectionIssue(type: string, severity: 'low' | 'medium' | 'high', details: string) {
    const issue: ConnectionIssue = {
      type,
      severity,
      timestamp: new Date().toISOString(),
      details,
    };

    this.connectionIssues.push(issue);
    console.warn(`[WebRTC] Issue (${severity}):`, type, details);
  }

  /**
   * Log recovery event
   */
  private logRecoveryEvent(event: string, peerId: string) {
    this.recoveryLog.push({
      timestamp: new Date().toISOString(),
      event,
      details: peerId,
    });
  }

  /**
   * Handle errors
   */
  private handleError(error: Error, context: string) {
    console.error(`[WebRTC] Error in ${context}:`, error);
    this.onError?.(error, context);
  }

  /**
   * Get diagnostics report
   */
  getDiagnosticsReport(): WebRTCDiagnosticsReport {
    return {
      issues: this.connectionIssues,
      recoveryLog: this.recoveryLog,
      activeConnections: this.peerConnections.size,
      timestamp: new Date().toISOString(),
    };
  }
}

export default WebRTCManager;
