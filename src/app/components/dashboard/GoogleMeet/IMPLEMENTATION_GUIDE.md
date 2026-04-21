# Implementation Guide - Google Meet Style Collaborative Room

## Quick Start

### 1. Basic Setup

```tsx
import { CollaborativeModeRoomGoogleMeet } from "@/components/dashboard/GoogleMeet";

function StudyRoom() {
  return (
    <CollaborativeModeRoomGoogleMeet
      roomName="Study Session"
      roomId="room-xyz"
      subject="Mathematics"
      onLeaveRoom={() => navigate("/dashboard")}
    />
  );
}
```

### 2. With TypeScript

All components are fully typed for maximum IDE support and type safety:

```tsx
import {
  CollaborativeModeRoomGoogleMeet,
  MeetHeader,
  VideoGrid,
  ControlBar,
  ChatPanel,
} from "@/components/dashboard/GoogleMeet";

// Full TypeScript support with IntelliSense
```

---

## Customization Guide

### Changing Colors & Themes

#### Option 1: Update Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        meet: {
          primary: "#1a73e8",
          "primary-dark": "#00d4ff",
          danger: "#d33b27",
          surface: "#f5f5f5",
          "surface-dark": "#1a1a2e",
        },
      },
    },
  },
};
```

Then update component classes:

```tsx
className = "bg-meet-primary hover:bg-meet-primary/90";
```

#### Option 2: CSS Variables

```css
:root {
  --color-primary: #1a73e8;
  --color-primary-dark: #00d4ff;
  --color-danger: #d33b27;
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark {
  --color-primary: #00d4ff;
  --color-surface: #1a1a2e;
}
```

```tsx
className = "bg-[var(--color-primary)]";
```

---

### Custom Header

```tsx
// Create wrapper component
function CustomMeetHeader() {
  return (
    <header className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 px-6">
      <div className="text-white font-bold">Custom Header</div>
    </header>
  );
}

// Use in main component
<div className="w-full h-screen flex flex-col">
  <CustomMeetHeader />
  <VideoGrid {...props} />
  <ControlBar {...props} />
</div>;
```

---

### Custom Control Bar Positions

**Bottom (Default)**:

```tsx
<div className="flex-1 overflow-hidden pb-24">
  <VideoGrid {...props} />
</div>
<ControlBar {...props} />
```

**Floating Top-Right**:

```tsx
<div className="relative flex-1 overflow-hidden">
  <VideoGrid {...props} />
  <div className="absolute top-4 right-4 bg-white/80 dark:bg-black/80 rounded-lg p-2 flex gap-2">
    {/* Mini control buttons */}
  </div>
</div>
```

**Side Panel**:

```tsx
<div className="flex flex-1">
  <div className="flex-1">
    <VideoGrid {...props} />
  </div>
  <div className="w-24 border-l flex flex-col items-center gap-4 p-4">
    {/* Vertical control buttons */}
  </div>
</div>
```

---

## Integration Examples

### With Redux State Management

```tsx
import { useSelector, useDispatch } from "react-redux";

function MeetContainer() {
  const dispatch = useDispatch();
  const { roomData, settings } = useSelector((state) => state.meet);

  const handleLeaveRoom = () => {
    dispatch(leaveRoom());
  };

  return (
    <CollaborativeModeRoomGoogleMeet
      roomName={roomData.name}
      roomId={roomData.id}
      onLeaveRoom={handleLeaveRoom}
    />
  );
}
```

### With Context API

```tsx
import { useMeetContext } from "@/context/MeetContext";

function MeetWrapper() {
  const { currentRoom, exitRoom } = useMeetContext();

  return (
    <CollaborativeModeRoomGoogleMeet {...currentRoom} onLeaveRoom={exitRoom} />
  );
}
```

### With React Query

```tsx
import { useQuery, useMutation } from "@tanstack/react-query";

function MeetRoom() {
  const { data: room } = useQuery(["room", roomId], () => fetchRoom(roomId));
  const leaveMutation = useMutation(() => leaveRoom(roomId));

  return (
    <CollaborativeModeRoomGoogleMeet
      roomName={room?.name}
      roomId={roomId}
      onLeaveRoom={() => leaveMutation.mutate()}
    />
  );
}
```

---

## Component Composition Patterns

### Creating a Custom Control Panel

```tsx
import { ControlBar } from "@/components/dashboard/GoogleMeet";

function CustomControlPanel(props) {
  return (
    <div className="custom-panel">
      <ControlBar {...props} />
      <div className="mt-4 pt-4 border-t">
        {/* Additional controls */}
        <button>Recording</button>
        <button>Captions</button>
      </div>
    </div>
  );
}
```

### Creating a Custom Video Tile

```tsx
import { VideoTile } from "@/components/dashboard/GoogleMeet";

function EnhancedVideoTile(props) {
  return (
    <div className="relative">
      <VideoTile {...props} />
      {/* Overlay enhancements */}
      <div className="absolute top-2 left-2">
        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
          Speaking
        </span>
      </div>
    </div>
  );
}
```

### Creating a Custom Layout Engine

```tsx
function CustomVideoGridLayout() {
  const [layout, setLayout] = useState("grid"); // 'grid', 'spotlight', 'filmstrip'

  return (
    <div>
      {/* Layout selector */}
      <div className="flex gap-2 p-4">
        <button onClick={() => setLayout("grid")}>Grid</button>
        <button onClick={() => setLayout("spotlight")}>Spotlight</button>
      </div>

      {/* Conditional layout rendering */}
      {layout === "grid" && <VideoGrid {...props} />}
      {layout === "spotlight" && <SpotlightLayout {...props} />}
    </div>
  );
}
```

---

## Advanced Customizations

### Adding Custom Keyboard Shortcuts

```tsx
function MeetWithCustomShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Your custom shortcuts
      if (e.key === "b" && e.ctrlKey) {
        toggleBlur();
      }
      if (e.key === "r" && e.ctrlKey) {
        startRecording();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return <CollaborativeModeRoomGoogleMeet {...props} />;
}
```

### Adding Analytics Tracking

```tsx
function MeetWithAnalytics() {
  const handleToggleAudio = () => {
    trackEvent("audio_toggled", { enabled: !audioEnabled });
    // ... rest of logic
  };

  const handleSendMessage = (message) => {
    trackEvent("message_sent", { length: message.length });
    // ... rest of logic
  };

  return (
    <CollaborativeModeRoomGoogleMeet
      onToggleAudio={handleToggleAudio}
      onSendMessage={handleSendMessage}
    />
  );
}
```

### Adding Notifications

```tsx
function MeetWithNotifications() {
  const handleNewParticipant = (participant) => {
    showNotification({
      title: `${participant.name} joined`,
      duration: 3000,
    });
  };

  useEffect(() => {
    // Subscribe to participant events
    roomAPI.onParticipantJoined(handleNewParticipant);
  }, []);

  return <CollaborativeModeRoomGoogleMeet {...props} />;
}
```

---

## Performance Optimization

### Memoization Pattern

```tsx
const memoizedRemoteParticipants = useMemo(
  () => remoteParticipants.sort((a, b) => a.name.localeCompare(b.name)),
  [remoteParticipants],
);

const memoizedChatMessages = useMemo(
  () => chatMessages.slice(-50), // Keep last 50 messages
  [chatMessages],
);
```

### Virtualization for Large Participant Lists

```tsx
import { FixedSizeList } from "react-window";

function VirtualizedParticipantsList({ participants }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={participants.length}
      itemSize={60}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <ParticipantRow participant={participants[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

### Lazy Loading Panels

```tsx
const ChatPanel = lazy(() => import("./ChatPanel"));
const ParticipantsPanel = lazy(() => import("./ParticipantsPanel"));

function LazyPanels() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {showChat && <ChatPanel {...props} />}
      {showParticipants && <ParticipantsPanel {...props} />}
    </Suspense>
  );
}
```

---

## Testing Guide

### Unit Tests

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { VideoTile } from "./VideoTile";

describe("VideoTile", () => {
  it("renders participant name", () => {
    render(<VideoTile name="John Doe" peerId="123" />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("shows mic off icon when audio disabled", () => {
    render(<VideoTile name="John" peerId="123" audioEnabled={false} />);
    expect(screen.getByTitle("Audio off")).toBeInTheDocument();
  });
});
```

### Integration Tests

```tsx
describe("Collaborative Room Flow", () => {
  it("handles participant join/leave", async () => {
    render(<CollaborativeModeRoomGoogleMeet {...props} />);

    // Simulate participant joining
    fireEvent.click(screen.getByText("Join"));

    // Verify UI updates
    expect(screen.getByText(/2 participants/)).toBeInTheDocument();
  });
});
```

### E2E Tests (Cypress)

```javascript
describe("Meeting E2E", () => {
  it("allows users to join and communicate", () => {
    cy.visit("/meet/room-123");
    cy.contains("Join").click();
    cy.get('[aria-label="Mic toggle"]').click();
    cy.get('[aria-label="Send message"]').type("Hello");
    cy.get('[aria-label="Send"]').click();
  });
});
```

---

## Troubleshooting

### Issue: Components Not Rendering

**Solution**: Ensure all required props are provided:

```tsx
// ✓ Correct
<MeetHeader
  roomName="Study"
  participantCount={2}
  isConnected={true}
/>

// ✗ Missing required props
<MeetHeader roomName="Study" />
```

### Issue: Styling Not Applied

**Solution**: Check Tailwind CSS configuration:

```bash
# Verify Tailwind is scanning your files
npx tailwindcss --help

# Rebuild CSS
npm run build:css
```

### Issue: WebRTC Connection Failing

**Solution**: Check browser console and verify:

1. HTTPS is enabled (WebRTC requires secure context)
2. Permissions are granted
3. Backend signaling server is running

---

## Migration Guide (From Old Component)

### Old Implementation

```tsx
<CollaborativeModeRoom roomName={name} roomId={id} onLeaveRoom={handleLeave} />
```

### New Implementation

```tsx
<CollaborativeModeRoomGoogleMeet
  roomName={name}
  roomId={id}
  subject="Mathematics"
  onLeaveRoom={handleLeave}
/>
```

### Key Changes

- **New required props**: `subject`
- **Improved state management**: Cleaner internal structure
- **Better performance**: Memoization and optimized renders
- **Enhanced UX**: Google Meet-inspired design
- **More components**: Modular architecture allows custom compositions

---

## Best Practices

### ✅ Do

- Use TypeScript for type safety
- Memoize expensive computations
- Test accessibility (keyboard, screen readers)
- Optimize WebRTC connection setup
- Handle errors gracefully
- Use semantic HTML

### ❌ Don't

- Don't recreate functions in render
- Don't pass inline objects as props
- Don't ignore accessibility
- Don't hardcode values
- Don't forget cleanup in useEffect
- Don't over-render with animations

---

## Resources & References

- [Component Storybook](./STORYBOOK.md)
- [API Documentation](./API.md)
- [Accessibility Checklist](./ACCESSIBILITY.md)
- [Performance Benchmarks](./PERFORMANCE.md)
- [GitHub Issues](https://github.com/your-repo/issues)

---

**Last Updated**: April 21, 2026
**Version**: 1.0.0
**Maintainer**: Development Team
