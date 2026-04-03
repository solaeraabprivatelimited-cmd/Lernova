import JitsiMeetJS from 'lib-jitsi-meet';

export interface JitsiConfig {
  serverUrl: string;
  appName: string;
  domain: string;
}

export interface JitsiCallbacks {
  onLocalTrack?: (track: any) => void;
  onRemoteTrack?: (track: any) => void;
  onTrackRemoved?: (track: any) => void;
  onParticipantJoined?: (participantId: string, participant: any) => void;
  onParticipantLeft?: (participantId: string) => void;
  onConferenceJoined?: () => void;
  onConferenceFailed?: (error: any) => void;
  onConnectionEstablished?: () => void;
  onConnectionFailed?: (error: any) => void;
}

export class JitsiManager {
  private config: JitsiConfig;
  private initialized = false;
  private connection: any = null;
  private conference: any = null;
  private callbacks: JitsiCallbacks;
  private localTracks: Map<string, any> = new Map();
  private remoteTracks: Map<string, any[]> = new Map();

  constructor(config: JitsiConfig, callbacks: JitsiCallbacks = {}) {
    this.config = config;
    this.callbacks = callbacks;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('Jitsi already initialized');
      return;
    }

    try {
      // Initialize Jitsi
      JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);

      // Configure for custom server (Jitsi instance)
      const options = {
        hosts: {
          domain: this.config.domain,
          muc: `muc.${this.config.domain}`,
        },
        bosh: `${this.config.serverUrl}/http-bind`,
        clientNode: 'http://jitsi.org/jitsimeet',
      };

      JitsiMeetJS.init(options);
      this.initialized = true;
      console.log('Jitsi initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Jitsi:', error);
      throw error;
    }
  }

  async connect(): Promise<void> {
    if (!this.initialized) {
      throw new Error('Jitsi not initialized');
    }

    try {
      this.connection = new JitsiMeetJS.JitsiConnection(null, null, {
        serviceUrl: this.config.serverUrl,
      });

      // Connection event handlers
      this.connection.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
        () => {
          console.log('Connection established');
          this.callbacks.onConnectionEstablished?.();
        }
      );

      this.connection.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_FAILED,
        (error: any) => {
          console.error('Connection failed:', error);
          this.callbacks.onConnectionFailed?.(error);
        }
      );

      this.connection.connect();
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  }

  async joinConference(
    roomName: string,
    userId: string
  ): Promise<void> {
    if (!this.connection || !this.connection.isConnected()) {
      throw new Error('Not connected to Jitsi server');
    }

    try {
      const conferenceOptions = {
        openBridgeChannel: true,
      };

      this.conference = this.connection.initJitsiConference(
        roomName,
        conferenceOptions
      );

      // Add conference event listeners
      this.setupConferenceListeners();

      // Join with user display name
      this.conference.join(userId);
    } catch (error) {
      console.error('Failed to join conference:', error);
      this.callbacks.onConferenceFailed?.(error);
      throw error;
    }
  }

  private setupConferenceListeners(): void {
    // Local track added
    this.conference.addEventListener(
      JitsiMeetJS.events.conference.LOCAL_TRACK_ADDED,
      (track: any) => {
        console.log('Local track added:', track.getType());
        this.localTracks.set(track.getType(), track);
        this.callbacks.onLocalTrack?.(track);
      }
    );

    // Remote track added
    this.conference.addEventListener(
      JitsiMeetJS.events.conference.REMOTE_TRACK_ADDED,
      (track: any) => {
        console.log('Remote track added:', track.getParticipantId(), track.getType());
        const participantId = track.getParticipantId();
        if (!this.remoteTracks.has(participantId)) {
          this.remoteTracks.set(participantId, []);
        }
        this.remoteTracks.get(participantId)?.push(track);
        this.callbacks.onRemoteTrack?.(track);
      }
    );

    // Remote track removed
    this.conference.addEventListener(
      JitsiMeetJS.events.conference.REMOTE_TRACK_REMOVED,
      (track: any) => {
        console.log('Remote track removed:', track.getParticipantId());
        const participantId = track.getParticipantId();
        const tracks = this.remoteTracks.get(participantId) || [];
        const index = tracks.indexOf(track);
        if (index > -1) {
          tracks.splice(index, 1);
        }
        this.callbacks.onTrackRemoved?.(track);
      }
    );

    // Participant joined
    this.conference.addEventListener(
      JitsiMeetJS.events.conference.USER_JOINED,
      (participantId: string) => {
        console.log('Participant joined:', participantId);
        const participant = this.conference.getParticipantById(participantId);
        this.callbacks.onParticipantJoined?.(participantId, participant);
      }
    );

    // Participant left
    this.conference.addEventListener(
      JitsiMeetJS.events.conference.USER_LEFT,
      (participantId: string) => {
        console.log('Participant left:', participantId);
        this.remoteTracks.delete(participantId);
        this.callbacks.onParticipantLeft?.(participantId);
      }
    );

    // Conference joined
    this.conference.addEventListener(
      JitsiMeetJS.events.conference.CONFERENCE_JOINED,
      () => {
        console.log('Joined conference');
        this.callbacks.onConferenceJoined?.();
      }
    );

    // Conference failed
    this.conference.addEventListener(
      JitsiMeetJS.events.conference.CONFERENCE_FAILED,
      (error: any) => {
        console.error('Conference failed:', error);
        this.callbacks.onConferenceFailed?.(error);
      }
    );
  }

  async addTrack(
    type: 'audio' | 'video',
    constraints?: MediaStreamConstraints
  ): Promise<any> {
    if (!this.conference) {
      throw new Error('Not in conference');
    }

    try {
      const tracks = await JitsiMeetJS.createLocalTracks({
        devices: [type],
        constraints: constraints,
      });

      if (tracks.length > 0) {
        const track = tracks[0];
        this.conference.addTrack(track);
        this.localTracks.set(type, track);
        return track;
      }

      return null;
    } catch (error) {
      console.error(`Failed to add ${type} track:`, error);
      throw error;
    }
  }

  async removeTrack(type: 'audio' | 'video'): Promise<void> {
    const track = this.localTracks.get(type);
    if (!track) {
      console.warn(`No ${type} track to remove`);
      return;
    }

    try {
      this.conference.removeTrack(track);
      track.dispose();
      this.localTracks.delete(type);
    } catch (error) {
      console.error(`Failed to remove ${type} track:`, error);
      throw error;
    }
  }

  toggleAudio(enabled: boolean): void {
    const audioTrack = this.localTracks.get('audio');
    if (audioTrack) {
      audioTrack.setEnabled(enabled);
    }
  }

  toggleVideo(enabled: boolean): void {
    const videoTrack = this.localTracks.get('video');
    if (videoTrack) {
      videoTrack.setEnabled(enabled);
    }
  }

  getConference(): any {
    return this.conference;
  }

  getParticipants(): string[] {
    if (!this.conference) {
      return [];
    }
    return this.conference.getParticipants();
  }

  getRemoteTracks(participantId: string): any[] {
    return this.remoteTracks.get(participantId) || [];
  }

  getLocalTracks(): Map<string, any> {
    return this.localTracks;
  }

  async leave(): Promise<void> {
    try {
      // Dispose all tracks
      this.localTracks.forEach((track) => {
        try {
          track.dispose();
        } catch (error) {
          console.error('Error disposing track:', error);
        }
      });
      this.localTracks.clear();
      this.remoteTracks.clear();

      // Leave conference
      if (this.conference) {
        await this.conference.leave();
        this.conference = null;
      }

      // Disconnect
      if (this.connection && this.connection.isConnected()) {
        this.connection.disconnect();
        this.connection = null;
      }

      console.log('Left Jitsi conference');
    } catch (error) {
      console.error('Error leaving conference:', error);
      throw error;
    }
  }

  dispose(): void {
    this.initialized = false;
    this.connection = null;
    this.conference = null;
    this.localTracks.clear();
    this.remoteTracks.clear();
  }
}

export default JitsiManager;
