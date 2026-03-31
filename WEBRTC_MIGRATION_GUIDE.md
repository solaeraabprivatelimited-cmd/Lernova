# LiveKit to WebRTC P2P Migration Guide

## Overview

Migrated from **LiveKit Cloud** (API-based SFU) to **Supabase Realtime + WebRTC P2P** (self-hosted signaling).

### What Changed

✅ **Removed**

- `livekit-client` npm package
- LiveKit edge function (`supabase/functions/livekit-token/`)
- LiveKit API credentials from `.env`
- All external API dependencies for real-time communication

✅ **Added**

- WebRTC P2P Manager (`src/utils/webrtc/WebRTCManager.ts`)
- WebRTC React Hook (`src/utils/webrtc/useWebRTC.ts`)
- Supabase Realtime signaling for WebRTC offer/answer/ICE candidates

## Architecture

### Old Architecture (LiveKit)

```
Frontend (React)
    ↓
Supabase Edge Function (Token Gen)
    ↓
LiveKit Cloud Server (SFU)
```

### New Architecture (WebRTC P2P)

```
Frontend A (React)
    ↓
Supabase Realtime Channel (Signaling)
    ↑
Frontend B (React) ← Direct WebRTC Connection
```

## Key Features

### Supported

- ✅ Video streaming (P2P)
- ✅ Audio streaming (P2P)
- ✅ Mute/Unmute (local only)
- ✅ Camera on/off (local only)
- ✅ Multi-user in same room (browser <-> browser)
- ✅ Real-time presence tracking
- ✅ No API keys required

### Limitations

- ⚠️ Small groups only (firewall/NAT limitations without TURN server)
- ⚠️ Screen sharing not yet implemented
- ⚠️ Data channels are available but unused currently
- ⚠️ High latency connections may have quality issues

## File Structure

```
src/
├── utils/webrtc/
│   ├── WebRTCManager.ts        # Core WebRTC P2P manager
│   ├── useWebRTC.ts            # React hook for WebRTC
│   └── index.ts                # Module exports
└── app/components/dashboard/
    └── CollaborativeModeRoom.tsx # Updated to use WebRTC
```

## Configuration

### Environment Variables

**Removed** from `.env`:

```
VITE_LIVEKIT_URL
LIVEKIT_API_KEY
LIVEKIT_API_SECRET
LIVEKIT_URL
```

**Required** (already in place):

```
VITE_SUPABASE_URL          # Supabase project URL
VITE_SUPABASE_ANON_KEY     # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY  # Supabase service role (optional)
```

## Component Integration

### Before (LiveKit)

```tsx
import { useLiveKit } from "@/utils/livekit";

const livekit = useLiveKit(
  { url: "wss://...", token: "..." },
  enabled,
  callbacks,
);
```

### After (WebRTC)

```tsx
import { useWebRTC } from "@/utils/webrtc";

const {
  localStream,
  remoteStreams,
  isAudioOn,
  isVideoOn,
  toggleAudio,
  toggleVideo,
} = useWebRTC({
  roomId,
  userName,
  enabled: true,
});
```

## Usage Example

```tsx
export function CollaborativeModeRoom({ roomId }: Props) {
  const {
    localStream,
    remoteStreams,
    isAudioOn,
    isVideoOn,
    toggleAudio,
    toggleVideo,
  } = useWebRTC({
    roomId: roomId || "default-room",
    userName: "Jane Doe",
    enabled: true,
  });

  // Local video
  useEffect(() => {
    if (localStream && videoRef.current) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Remote videos
  return (
    <div>
      <video ref={videoRef} autoPlay muted />
      {remoteStreams.map(({ userId, stream }) => (
        <video
          key={userId}
          ref={(ref) => {
            if (ref) ref.srcObject = stream;
          }}
          autoPlay
        />
      ))}
      <button onClick={() => toggleVideo(!isVideoOn)}>
        {isVideoOn ? "Stop Video" : "Start Video"}
      </button>
      <button onClick={() => toggleAudio(!isAudioOn)}>
        {isAudioOn ? "Mute" : "Unmute"}
      </button>
    </div>
  );
}
```

## Testing Checklist

- [ ] Install dependencies: `npm install`
- [ ] No TypeScript errors: `npm run build`
- [ ] Vite dev server starts: `npm run dev`
- [ ] Open room in 2 browser tabs
- [ ] Both see local video streams appear
- [ ] Local mic toggles work
- [ ] Local video toggles work
- [ ] Participant count updates correctly
- [ ] Disconnecting/reconnecting works
- [ ] Firewall/NAT issues appear (expected, see "Limitations")

## Troubleshooting

### "Cannot get local media"

**Cause**: Browser doesn't have camera/mic permissions  
**Fix**: Check browser permissions, allow access, reload page

### "WebRTC connection fails to establish"

**Cause**: Firewall/NAT blocking P2P connections  
**Fix**: Add TURN server configuration (see "Future Improvements")

### "Participant appears but no video"

**Cause**: ICE candidates not exchanged properly  
**Fix**: Check browser console for errors, verify Supabase Realtime is connected

## Future Improvements

### TURN Server (for closed networks)

```typescript
const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  {
    urls: "turn:your-turn-server.com:3478",
    username: "user",
    credential: "pass",
  },
];
```

### Screen Sharing

```typescript
const screenStream = await navigator.mediaDevices.getDisplayMedia({
  video: true,
  audio: false,
});
// Add screen stream tracks to peer connection
```

### Data Channel (text chat)

```typescript
const dataChannel = peerConnection.createDataChannel("chat");
dataChannel.onmessage = (event) => {
  console.log("Message received:", event.data);
};
```

### Recording

Use `MediaRecorder` API with local stream

## Performance Characteristics

| Metric          | LiveKit                | WebRTC P2P                              |
| --------------- | ---------------------- | --------------------------------------- |
| Setup Time      | 2-3s (token gen)       | 500ms-2s (depends on network)           |
| Latency         | 100-500ms              | 20-100ms (direct)                       |
| Bandwidth Usage | ~500kb/s per user      | ~300kb/s peer (depends on codec)        |
| Server Load     | Handled by LiveKit     | Minimal (signaling only)                |
| Cost            | Pay-per-minute         | Supabase realtimeonly                   |
| Scalability     | Unlimited participants | Limited by network/client CPU           |
| Firewall Issues | Handled by LiveKit     | Requires TURN server in closed networks |

## Rollback Instructions

If you need to revert to LiveKit:

1. Restore `package.json` (add back `livekit-client`)
2. Restore `.env` (add back LiveKit variables)
3. Restore `supabase/functions/livekit-token/` folder
4. Revert `CollaborativeModeRoom.tsx` to use `useLiveKit` hook
5. Run `npm install`

## References

- [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [STUN/TURN Servers](https://webrtc.org/getting-started/peer-connections#signaling)
- [ICE Candidates](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate)
