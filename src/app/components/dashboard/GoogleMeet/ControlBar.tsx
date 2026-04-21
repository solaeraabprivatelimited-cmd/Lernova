/**
 * ControlBar — Bottom control bar with inline SVG icons (no Lucide dependency issues)
 */

interface ControlBarProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  unreadChatCount?: number;
  showChat?: boolean;
  showParticipants?: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onScreenShare: () => void;
  onRaiseHand: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onToggleSettings: () => void;
  onLeaveCall: () => void;
}

/* ── Inline SVG icons — guaranteed to render regardless of Tailwind/CSS issues ── */

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function MicOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="2" x2="22" y2="22" />
      <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
      <path d="M5 10v2a7 7 0 0 0 12 5" />
      <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 8-6 4 6 4V8Z" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  );
}

function VideoOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.66 6H14a2 2 0 0 1 2 2v2.34l1 1L22 8v8" />
      <path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l10 10Z" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function MonitorOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 17H4a2 2 0 0 1-2-2V5c0-.53.19-1 .5-1.4" />
      <path d="M22 15V5a2 2 0 0 0-2-2H9" />
      <path d="M8 21h8M12 17v4" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

function HandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PhoneOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07" />
      <path d="M14.5 9.5 9 4" />
      <path d="M4 4a16 16 0 0 0 2.92 3.95" />
      <path d="M6.68 7.68A16 16 0 0 0 3.07 15.37 2 2 0 0 0 5 17.18h.09a12.84 12.84 0 0 0 2.81-.7 2 2 0 0 1 2.11.45l1.27 1.27" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

interface BtnProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  badge?: number;
  pressed?: boolean;
}

function Btn({ icon, label, onClick, active, danger, badge, pressed }: BtnProps) {
  const bg = danger
    ? '#ea4335'
    : active || pressed
      ? '#1a73e8'
      : '#3c4043';

  const hoverBg = danger ? '#d93025' : active || pressed ? '#1765cc' : '#4a4d51';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}>
      <button
        onClick={onClick}
        aria-label={label}
        title={label}
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: bg,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          position: 'relative',
          transition: 'background 0.15s, transform 0.1s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = bg; }}
        onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.93)'; }}
        onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
      >
        {icon}
        {badge !== undefined && badge > 0 && (
          <span style={{
            position: 'absolute',
            top: -2,
            right: -2,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            background: '#ea4335',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </button>
      <span style={{
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'Inter, system-ui, sans-serif',
        whiteSpace: 'nowrap',
        lineHeight: 1,
      }}>
        {label}
      </span>
    </div>
  );
}

export function ControlBar({
  audioEnabled,
  videoEnabled,
  isScreenSharing,
  isHandRaised,
  unreadChatCount = 0,
  showChat,
  showParticipants,
  onToggleAudio,
  onToggleVideo,
  onScreenShare,
  onRaiseHand,
  onToggleChat,
  onToggleParticipants,
  onToggleSettings,
  onLeaveCall,
}: ControlBarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Meeting controls"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(32,33,36,0.97)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        {/* Left — media */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <Btn icon={audioEnabled ? <MicIcon /> : <MicOffIcon />} label={audioEnabled ? 'Mute' : 'Unmute'} onClick={onToggleAudio} active={audioEnabled} />
          <Btn icon={videoEnabled ? <VideoIcon /> : <VideoOffIcon />} label={videoEnabled ? 'Stop video' : 'Start video'} onClick={onToggleVideo} active={videoEnabled} />
          <Btn icon={isScreenSharing ? <MonitorOffIcon /> : <MonitorIcon />} label={isScreenSharing ? 'Stop sharing' : 'Present'} onClick={onScreenShare} pressed={isScreenSharing} />
        </div>

        {/* Center — interactions */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <Btn icon={<HandIcon />} label={isHandRaised ? 'Lower hand' : 'Raise hand'} onClick={onRaiseHand} pressed={isHandRaised} />
          <Btn icon={<ChatIcon />} label="Chat" onClick={onToggleChat} pressed={showChat} badge={unreadChatCount} />
          <Btn icon={<PeopleIcon />} label="People" onClick={onToggleParticipants} pressed={showParticipants} />
          <Btn icon={<SettingsIcon />} label="Settings" onClick={onToggleSettings} />
        </div>

        {/* Right — leave */}
        <Btn icon={<PhoneOffIcon />} label="Leave" onClick={onLeaveCall} danger />
      </div>

      {/* Keyboard hints */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: 8,
        gap: 16,
        fontSize: 10,
        color: 'rgba(255,255,255,0.2)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        {[['M', 'mic'], ['V', 'video'], ['C', 'chat']].map(([key, label]) => (
          <span key={key}>
            <kbd style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '1px 5px',
              borderRadius: 3,
              fontSize: 10,
              fontFamily: 'monospace',
            }}>{key}</kbd> {label}
          </span>
        ))}
      </div>
    </div>
  );
}
