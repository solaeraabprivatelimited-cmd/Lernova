/**
 * ControlBar — Bottom control bar with Lucide icons
 */

import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff,
  Hand, MessageSquare, Users, Settings, PhoneOff,
} from 'lucide-react';

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
  hidden?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

interface BtnProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  pressed?: boolean;
  danger?: boolean;
  badge?: number;
}

function Btn({ icon, label, onClick, active, danger, badge, pressed }: BtnProps) {
  const isHighlighted = active || pressed;
  const bg      = danger ? '#ea4335' : isHighlighted ? '#1a73e8' : '#3c4043';
  const hoverBg = danger ? '#d93025' : isHighlighted ? '#1765cc' : '#4a4d51';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, position: 'relative' }}>
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
        onMouseDown={(e)  => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.92)'; }}
        onMouseUp={(e)    => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
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
  hidden = false,
  onMouseEnter,
  onMouseLeave,
}: ControlBarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Meeting controls"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(32,33,36,0.97)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        transform: hidden ? 'translateY(calc(100% - 18px))' : 'translateY(0)',
        opacity: hidden ? 0.72 : 1,
        transition: 'transform 0.25s ease, opacity 0.25s ease',
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
          <Btn
            icon={audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            label={audioEnabled ? 'Mute' : 'Unmute'}
            onClick={onToggleAudio}
            active={audioEnabled}
          />
          <Btn
            icon={videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            label={videoEnabled ? 'Stop video' : 'Start video'}
            onClick={onToggleVideo}
            active={videoEnabled}
          />
          <Btn
            icon={isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
            label={isScreenSharing ? 'Stop sharing' : 'Present'}
            onClick={onScreenShare}
            pressed={isScreenSharing}
          />
        </div>

        {/* Center — interactions */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <Btn
            icon={<Hand size={20} />}
            label={isHandRaised ? 'Lower hand' : 'Raise hand'}
            onClick={onRaiseHand}
            pressed={isHandRaised}
          />
          <Btn
            icon={<MessageSquare size={20} />}
            label="Chat"
            onClick={onToggleChat}
            pressed={showChat}
            badge={unreadChatCount}
          />
          <Btn
            icon={<Users size={20} />}
            label="People"
            onClick={onToggleParticipants}
            pressed={showParticipants}
          />
          <Btn
            icon={<Settings size={20} />}
            label="Settings"
            onClick={onToggleSettings}
          />
        </div>

        {/* Right — leave */}
        <Btn
          icon={<PhoneOff size={20} />}
          label="Leave"
          onClick={onLeaveCall}
          danger
        />
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
        {[['M', 'mic'], ['V', 'video'], ['C', 'chat']].map(([key, lbl]) => (
          <span key={key}>
            <kbd style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '1px 5px',
              borderRadius: 3,
              fontSize: 10,
              fontFamily: 'monospace',
            }}>{key}</kbd>{' '}{lbl}
          </span>
        ))}
      </div>
    </div>
  );
}
