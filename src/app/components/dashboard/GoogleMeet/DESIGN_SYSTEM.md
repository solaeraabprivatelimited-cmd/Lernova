# Collaborative Room - Google Meet Design System

## 📋 Overview

This document outlines the comprehensive redesign of the collaborative room interface, inspired by Google Meet's professional and minimal SaaS design standards.

---

## 🏗️ Architecture

### Component Structure

```
GoogleMeet/
├── CollaborativeModeRoomGoogleMeet.tsx  (Main container)
├── MeetHeader.tsx                      (Top header bar)
├── VideoGrid.tsx                        (Responsive video layout)
├── VideoTile.tsx                        (Individual participant video)
├── ControlBar.tsx                       (Media control buttons)
├── ChatPanel.tsx                        (Chat sidebar)
├── ParticipantsPanel.tsx               (Participants list sidebar)
├── SettingsModal.tsx                    (Settings dialog)
└── index.ts                             (Barrel export)
```

### Data Flow

```
CollaborativeModeRoomGoogleMeet (Main orchestrator)
├── useWebRTC (WebRTC management)
├── roomAPI (Backend integration)
├── useState (Local state management)
└── useCallback (Optimized event handlers)
    ├── MeetHeader (Display only)
    ├── VideoGrid
    │   ├── VideoTile (for each participant)
    │   └── VideoTile (for local user)
    ├── ControlBar (User interactions)
    │   └── Emits: audio, video, screen, chat, etc.
    ├── ChatPanel (Conditional render)
    ├── ParticipantsPanel (Conditional render)
    └── SettingsModal (Conditional render)
```

---

## 🎨 Design System

### Color Palette

#### Light Mode

- **Background**: White (`#FFFFFF`)
- **Surface**: Light Gray (`#F5F5F5`)
- **Border**: Black with 5-10% opacity
- **Text**: Black (`#000000`)
- **Accent**: Blue (`#1a73e8` for active/primary actions)
- **Success**: Green (`#1e8e3e`)
- **Error**: Red (`#d33b27`)

#### Dark Mode

- **Background**: Deep Gray (`#0f0f1e`)
- **Surface**: Gray (`#1a1a2e`)
- **Border**: White with 5-10% opacity
- **Text**: White (`#FFFFFF`)
- **Accent**: Light Blue (`#00d4ff`)
- **Success**: Light Green (`#81c995`)
- **Error**: Light Red (`#f28482`)

### Typography

- **Font Family**: `Inter` / `Roboto` (system sans-serif stack)
- **Sizes**:
  - `Header (H1)`: 24px, 600 weight
  - `Header (H2)`: 20px, 600 weight
  - `Header (H3)`: 18px, 600 weight
  - `Body`: 16px, 400 weight
  - `Label\*\*: 14px, 500 weight
  - `Caption\*\*: 12px, 400 weight

### Spacing

- **Base Unit**: 4px
- **Common**: 8px, 12px, 16px, 24px, 32px
- **Gap Scale**: `gap-1` (4px) through `gap-8` (32px)

### Border Radius

- **Buttons/Small**: 8px
- **Cards/Medium**: 12px
- **Large Elements**: 16px
- **Circles**: `rounded-full`

### Shadows

- **Subtle**: `box-shadow: 0 1px 2px rgba(0,0,0,0.05)`
- **Medium**: `box-shadow: 0 4px 6px rgba(0,0,0,0.1)`
- **Large**: `box-shadow: 0 10px 15px rgba(0,0,0,0.1)`
- **Modal**: `0 25px 50px rgba(0,0,0,0.15)`

---

## 📦 Component Reference

### 1. MeetHeader

**Purpose**: Display meeting title, timer, and connection status

**Props**:

```typescript
interface MeetHeaderProps {
  roomName: string;
  participantCount: number;
  isConnected: boolean;
}
```

**Features**:

- Real-time elapsed time counter
- Connection status indicator
- Participant count
- More options menu

**Usage**:

```tsx
<MeetHeader
  roomName="Biology Study Group"
  participantCount={4}
  isConnected={true}
/>
```

---

### 2. VideoGrid

**Purpose**: Responsive layout for participant video tiles

**Props**:

```typescript
interface VideoGridProps {
  localParticipant: ParticipantData;
  remoteParticipants: Participant[];
  activeSpeakerId?: string;
  isScreenSharing?: boolean;
}
```

**Grid Layouts** (Auto-adjusted):

- 1 participant: 1 column
- 2 participants: 2 columns
- 3 participants: 3 columns
- 4 participants: 2x2 grid
- 5-6 participants: 3 columns, 2 rows
- 7-8 participants: 4 columns, 2 rows
- 9+ participants: 3x3 grid (fallback)

**Features**:

- Automatic reordering (active speaker first)
- Screen share filmstrip mode
- Smooth transitions
- Aspect ratio maintenance

---

### 3. VideoTile

**Purpose**: Individual participant video container

**Props**:

```typescript
interface VideoTileProps {
  peerId: string;
  name: string;
  stream?: MediaStream;
  isLocal?: boolean;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  isActiveSpeaker?: boolean;
  isMirrored?: boolean;
}
```

**Features**:

- Auto-play video stream
- Placeholder with user initials (if no video)
- Name label with media status indicators
- Active speaker highlight (blue ring)
- Mirror effect for local user

---

### 4. ControlBar

**Purpose**: Primary media control interface

**Props**:

```typescript
interface ControlBarProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  unreadChatCount?: number;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onScreenShare: () => void;
  onRaiseHand: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onToggleSettings: () => void;
  onLeaveCall: () => void;
}
```

**Controls**:

- Microphone toggle
- Camera toggle
- Screen share
- Raise hand
- Chat toggle (with unread badge)
- Participants list
- Settings
- Leave call (danger action)

**Features**:

- Center-aligned layout
- Circular icon buttons (48px)
- Hover effects with state feedback
- Badge for unread chat count
- Keyboard shortcuts (M for mic, V for video)
- Tooltips on hover

---

### 5. ChatPanel

**Purpose**: Real-time messaging interface

**Props**:

```typescript
interface ChatPanelProps {
  messages: ChatMessage[];
  currentUserName: string;
  isLoading?: boolean;
  onSendMessage: (message: string) => Promise<void>;
  onClose: () => void;
}
```

**Features**:

- Message bubbles (left/right aligned)
- Sender name and timestamp
- Auto-scroll to latest message
- Loading state
- Empty state
- Textarea with shift+enter for newline
- Emoji and attachment buttons
- Send button with loading state

---

### 6. ParticipantsPanel

**Purpose**: List of all meeting participants with status

**Props**:

```typescript
interface ParticipantsPanelProps {
  participants: Participant[];
  currentUserId?: string;
  onClose: () => void;
  onMuteParticipant?: (id: string) => void;
  onRemoveParticipant?: (id: string) => void;
}
```

**Features**:

- Avatar with user initials
- Name display
- Audio/video status indicators
- Host badge (crown icon)
- Hover actions (mute, remove)
- Participant count footer
- Auto-sorted (host first, current user second)

---

### 7. SettingsModal

**Purpose**: Device selection and preference configuration

**Props**:

```typescript
interface SettingsModalProps {
  audioDevices: MediaDeviceInfo[];
  videoDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  selectedAudioDeviceId: string;
  selectedVideoDeviceId: string;
  selectedAudioOutputDeviceId: string;
  backgroundBlurred: boolean;
  noiseSuppression: boolean;
  onAudioDeviceChange: (id: string) => void;
  onVideoDeviceChange: (id: string) => void;
  onAudioOutputChange: (id: string) => void;
  onBackgroundBlurToggle: (enabled: boolean) => void;
  onNoiseSuppressionToggle: (enabled: boolean) => void;
  onClose: () => void;
}
```

**Sections**:

- Microphone device selection
- Speaker device selection
- Camera device selection
- Noise suppression toggle
- Background blur toggle

**Features**:

- Modal dialog with overlay
- Organized sections with icons
- Device dropdown selects
- Toggle switches
- Done button

---

## 🎯 Key UX Features

### Responsive Design

- **Mobile**: Single video, bottom controls, full-width panels
- **Tablet**: 2-4 participant grid, sidebar panels
- **Desktop**: Full responsive grid, floating panels

### Accessibility

- ARIA labels on all interactive elements
- Focus states for keyboard navigation
- High contrast support (light/dark mode)
- Semantic HTML
- Keyboard shortcuts (M, V, Esc)

### Performance Optimizations

- Memoized participants list (prevent unnecessary re-renders)
- useCallback for event handlers
- Lazy render of panels
- Video lazy loading with placeholder
- Smooth transitions (200-300ms)

### Real-time Updates

- Polling for chat messages (2s interval)
- WebRTC peer connection management
- Active speaker detection
- Media state synchronization

---

## 🔌 Integration Points

### WebRTC (`useWebRTC`)

```typescript
const {
  initialized,
  localStream,
  peers,
  error,
  toggleAudio,
  toggleVideo,
  startScreenShare,
  stopScreenShare,
} = useWebRTC({
  roomId,
  userId,
  enableVideo: true,
  enableAudio: true,
  onError: handleError,
});
```

### Backend API (`roomAPI`)

```typescript
// Join room
await roomAPI.joinRoom(roomId, { name, userId });

// Send chat message
await roomAPI.sendRoomChat(roomId, { message });

// List chat messages
const messages = await roomAPI.listRoomChat(roomId);

// Leave room
await roomAPI.leaveRoom(roomId);
```

---

## 🎪 State Management

### Main Component State

```typescript
// Auth & User
const [userId, setUserId] = useState<string>("");
const [currentUserName, setCurrentUserName] = useState("You");

// Media
const [audioEnabled, setAudioEnabled] = useState(true);
const [videoEnabled, setVideoEnabled] = useState(true);
const [isScreenSharing, setIsScreenSharing] = useState(false);

// Participants
const [participantCount, setParticipantCount] = useState(1);
const [remoteParticipants, setRemoteParticipants] = useState([]);

// UI
const [showChatPanel, setShowChatPanel] = useState(false);
const [showParticipantsPanel, setShowParticipantsPanel] = useState(false);
const [showSettingsModal, setShowSettingsModal] = useState(false);

// Data
const [chatMessages, setChatMessages] = useState([]);
```

---

## 🚀 Usage Example

```tsx
import { CollaborativeModeRoomGoogleMeet } from "@/components/dashboard/GoogleMeet";

export function MyMeeting() {
  const handleLeave = () => {
    // Navigate away or handle cleanup
  };

  return (
    <CollaborativeModeRoomGoogleMeet
      roomName="Biology 101 Study Group"
      roomId="room-123"
      roomCode="BIO-ABC123"
      maxParticipants={20}
      subject="Cell Biology"
      onLeaveRoom={handleLeave}
    />
  );
}
```

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (xs)
- **Tablet**: 640px - 1024px (sm)
- **Desktop**: > 1024px (lg)

Tailwind CSS classes used for responsive design:

- `xs:`, `sm:`, `lg:` prefixes
- `hidden sm:block` pattern
- Grid auto-adjustment

---

## ✨ Animation & Transitions

- **Duration**: 200ms (default), 300ms (longer transitions)
- **Timing**: `ease` (default), `ease-in-out` (smooth)
- **Active States**: Fill color changes
- **Hover States**: Background color/opacity changes

---

## 🔄 Future Enhancements

- [ ] Recording functionality
- [ ] Caption generation
- [ ] Virtual backgrounds (expanded blur options)
- [ ] Speaker notes / presentation mode
- [ ] Breakout rooms
- [ ] Polls and Q&A
- [ ] Whiteboard / annotation tools
- [ ] File sharing / screen annotation
- [ ] End-to-end encryption indicator
- [ ] Network quality indicator

---

## 📚 Dependencies

- `react` (UI framework)
- `lucide-react` (Icons)
- `tailwindcss` (Styling)
- Custom `useWebRTC` hook (WebRTC management)
- Backend `roomAPI` (API integration)

---

## 🛠️ Development Notes

### Testing Scenarios

1. **Single participant**: Verify header, controls, video placeholder
2. **Multiple participants**: Test grid layout responsiveness
3. **Screen share**: Verify filmstrip layout
4. **Chat**: Test message sending/receiving
5. **Device switching**: Verify device selector works
6. **Mobile**: Test responsive layout on 375px width

### Performance Considerations

- Keep video grid renders efficient (consider virtualization if 50+ participants)
- Throttle chat polling to avoid excessive API calls
- Lazy-load non-critical UI (panels)
- Memoize heavy computations

### Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support (may require config for H.264)
- Safari: Supported (some WebRTC limitations)
- Mobile browsers: Responsive but limitations apply

---

## 📖 References

- Google Meet Design: https://meet.google.com
- WebRTC Best Practices: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
- Accessible UI: https://www.w3.org/WAI/WCAG21/quickref/
- Material Design: https://material.io/design

---

**Last Updated**: April 21, 2026
**Version**: 1.0.0
**Status**: Production Ready
