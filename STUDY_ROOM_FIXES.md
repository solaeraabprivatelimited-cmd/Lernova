# Study Room Issues - Fix Report

## Completed Fixes ✅

### 1. Participants Panel Collapse Toggle ✅

**Status**: COMPLETED

- Added collapse/expand button to participants panel
- Icon toggles between `ChevronLeft` and `ChevronRight`
- State managed with `isParticipantsPanelCollapsed`
- **File**: `src/app/components/dashboard/CollaborativeModeRoom.tsx`

### 2. Icons Added to Tabs ✅

**Status**: COMPLETED

- Added `lucide-react` icons to Chat and Notes tabs
- Chat tab: `MessageSquare` icon
- Notes tab: `BookOpen` icon
- Participants panel: Uses `Users` icon concept (ready for future use)
- **File**: `src/app/components/dashboard/CollaborativeModeRoom.tsx`

### 3. Tab Cleanup on Close ✅

**Status**: COMPLETED

- Added `beforeunload` event listener to cleanup room on tab close
- Calls `roomAPI.leaveRoom()` when user closes tab
- Prevents "ghost" participants in room roster
- **File**: `src/app/components/dashboard/CollaborativeModeRoom.tsx`

---

## Remaining Issues & Fixes Required

### Issue #2: Camera Being Off Not Showing to Other Participants

**Status**: NEEDS FIX
**Priority**: HIGH
**Problem**:

- When user disables video, others don't see visual indication
- Only shows locally but not in peer views

**Solution**:

1. Implement real-time video state broadcasting via WebRTC data channels
2. Send video state updates in peer messages:

```typescript
// In WebRTCManager.ts
sendVideoStateUpdate(peerId: string, videoEnabled: boolean) {
  this.sendMessage(peerId, {
    type: 'video-state',
    enabled: videoEnabled,
    timestamp: Date.now()
  });
}
```

3. Update `CollaborativeModeRoom.tsx` to display video off indicator:

```typescript
// Add state for peer video states
const [peerVideoStates, setPeerVideoStates] = useState<Record<string, boolean>>(
  {},
);

// Listen for video state messages and update UI
```

---

### Issue #4: Layout Responsive Single-Page Viewpoint

**Status**: NEEDS FIX
**Priority**: HIGH
**Problem**:

- Screen has unwanted scroll
- Needs to display all content on single viewpoint
- Layout not responsive to different screen sizes

**Solution**:

1. Remove all `overflow-y-auto` and `overflow-y-auto` from main container
2. Update grid layout in `CollaborativeModeRoom.tsx`:

```tsx
// Current: Uses fixed lg:w-[360px] xl:w-[420px]
// Fix: Use responsive grid with auto columns
<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
  {/* Videos */}
  {/* Side panel */}
</div>
```

3. Implement viewport scaling:

```css
/* Add to CollaborativeModeRoom */
.study-room-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  height: 100vh;
  gap: 1rem;
  overflow: hidden;
}
```

---

### Issue #5: Audio Issues with 3+ Participants

**Status**: NEEDS FIX
**Priority**: CRITICAL
**Problem**:

- Audio mixing issues when 3+ devices join
- Echo feedback loops
- One-directional audio (hearer is usually admin)

**Solution**:

1. **Implement audio prioritization** in WebRTCManager:

```typescript
// Stop backward audio echo on admin
if (isAdmin) {
  localAudioTrack.enabled = false; // Don't feed back own audio
}

// Set audio constraints
const constraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    maxAudioBitrate: 128000, // Limit bitrate for stability
  },
};
```

2. **Implement audio prioritization queue**:

- Only allow 1 speaker at a time in collaborative mode
- Mute lower-priority participants automatically
- Implement voice activity detection (VAD)

3. **Test with 3+ participants**:

```bash
npm run dev
# Open in 3+ browser windows/tabs
# Test audio clarity and mixing
```

---

### Issue #6+7: Room Link Joining & Dynamic Rendering

**Status**: NEEDS INVESTIGATION
**Priority**: MEDIUM
**Problem**:

- Room links don't work as expected
- Dynamic component rendering issues

**Debug Steps**:

```typescript
// Add console logging to RoomLinkEntry.tsx
console.log("Room link params:", roomCode);
console.log("Loaded room:", room);
console.log("Room ID:", room?.id);

// Verify route is correct
// Should be: /room/:roomCode
// Check App.tsx route definition
```

**Fix**:

1. Ensure route pattern matches in `App.tsx`:

```tsx
<Route path="/room/:roomCode" element={<RoomLinkEntry .../>} />
```

2. Add error boundary around RoomLinkEntry
3. Add retry logic for failed requests

---

### Issue #8: Random Room Ordering & Placeholder Removal

**Status**: NEEDS FIX
**Priority**: LOW
**Problem**:

- Rooms should display in random/shuffled order
- Remove placeholder UI elements
- Improve room discovery UX

**Solution**:

```typescript
// In roomAPI.ts
listRooms: async (): Promise<Room[]> => {
  const rooms = await apiFetch(API_BASE);

  // Shuffle array
  return rooms.sort(() => Math.random() - 0.5);
};

// Remove placeholder divs from room list components
// Delete any Lorem Ipsum dummy content
```

---

### Issue #9: Audio Routing for Multiple Participants

**Status**: NEEDS FIX
**Priority**: CRITICAL
**Related To**: Issue #5

**Problem**:

- Sound only heard by one participant
- Voice not transmitted to others
- Admin hears everyone but others don't hear admin clearly

**Solution**:

1. **Check audio output routing**:

```typescript
// WebRTCManager.ts
async setupAudioOutput(remoteStream: MediaStream) {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(remoteStream);
  const gainNode = audioContext.createGain();

  gainNode.gain.value = 1.0;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
}
```

2. **Verify audio tracks are enabled**:

```typescript
remoteStream.getAudioTracks().forEach((track) => {
  console.log("Remote audio track:", track.enabled, track.readyState);
  track.enabled = true;
});
```

3. **Test audio with WebRTC stats**:

```typescript
// Get audio stats to diagnose issues
const stats = await peerConnection.getStats();
stats.forEach((report) => {
  if (report.type === "inbound-rtp" && report.kind === "audio") {
    console.log("Audio packets received:", report.packetsReceived);
    console.log("Audio bytes received:", report.bytesReceived);
  }
});
```

---

## Implementation Checklist

- [ ] **Phase 1** - UI/UX (COMPLETED)
  - [x] Add collapse toggle for participants
  - [x] Add icons to tabs
  - [x] Tab cleanup on close

- [ ] **Phase 2** - Audio/Video State Sync (URGENT)
  - [ ] Implement video state broadcasting
  - [ ] Fix audio issues for 3+ participants
  - [ ] Implement VAD (Voice Activity Detection)
  - [ ] Test with multiple devices

- [ ] **Phase 3** - Layout & Responsiveness
  - [ ] Fix responsive layout
  - [ ] Remove scroll issues
  - [ ] Test on mobile/tablet

- [ ] **Phase 4** - Room Discovery
  - [ ] Fix room link joining
  - [ ] Add random room ordering
  - [ ] Remove placeholders
  - [ ] Add error handling

---

## Testing Instructions

### Test Participants Collapse

```
1. Open study room
2. Click chevron button next to "Participants"
3. Panel should collapse/expand
✓ Should see participants list hide/show
```

### Test Audio Issues (3+ participants)

```
1. Open 3 browser tabs
2. Join same room from each tab
3. Enable audio on all
✓ Should hear clear audio mixing
✓ No echo feedback
✓ All voices should be audible
```

### Test Room Link Joining

```
1. Create room with link
2. Copy link
3. Paste in new browser tab
✓ Room should load correctly
✓ Should join without errors
```

---

## Notes for Developer

- **WebRTC Manager**: Located at `src/utils/webrtc/WebRTCManager.ts`
- **Hooks**: Located at `src/utils/webrtc/useWebRTC.ts`
- **Room Comp**: Located at `src/app/components/dashboard/CollaborativeModeRoom.tsx`
- **API**: Located at `src/utils/api/roomAPI.ts`
- **Supabase Functions**: Located at `supabase/functions/server/webrtc.ts`

### Key Files to Modify

1. WebRTCManager → Audio/video state broadcasting
2. CollaborativeModeRoom → UI layout fixes
3. useWebRTC → Peer state management
4. webrtc.ts (Supabase) → Server-side audio routing

### Browser Constraints

- Chrome/Chromium: Full WebRTC support
- Firefox: Full WebRTC support
- Safari: Limited screen sharing support
- Mobile: Audio/video constraints needed

---

## Related Issues

- CORS policies may affect room creation
- Database schema may need updates for audio stats
- Supabase Edge Functions timeout on large payloads
