import React, { useState } from 'react';
import { X, Settings, Volume2, Video, Users, Clock, Eye, Bell } from 'lucide-react';

interface ModeConfiguration {
  mode: 'live' | 'focus' | 'silent';
  title: string;
  description: string;
  settings: Record<string, any>;
}

interface ModeConfigurationPanelProps {
  mode: 'live' | 'focus' | 'silent';
  onClose: () => void;
  onSave?: (config: Record<string, any>) => void;
}

const defaultConfigurations: Record<string, ModeConfiguration> = {
  live: {
    mode: 'live',
    title: 'Live Mode',
    description: 'Real-time collaborative learning with video and audio',
    settings: {
      videoQuality: '1080p',
      audioQuality: 'High',
      maxParticipants: 50,
      allowScreenShare: true,
      enableReactions: true,
      enableChat: true,
      recordSession: false,
      layoutMode: 'grid',
    },
  },
  focus: {
    mode: 'focus',
    title: 'Focus Mode',
    description: 'Dedicated study time with timer and distraction blocking',
    settings: {
      focusDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      sessionsUntilLongBreak: 4,
      allowNotifications: false,
      soundEnabled: true,
      distractionAlert: true,
      pomodoroCycles: 4,
      quietMode: false,
      backgroundMusic: 'off',
    },
  },
  silent: {
    mode: 'silent',
    title: 'Silent Mode',
    description: 'Focused study environment with no audio or notifications',
    settings: {
      silentDuration: 60,
      participantVisibility: 'minimal',
      allowTextChat: false,
      showParticipantNames: true,
      allowNotices: false,
      enableVibration: false,
      displayTimerCountdown: true,
      showActivityIndicators: false,
      participantLimit: 20,
    },
  },
};

const settingsDescriptions: Record<string, Record<string, string>> = {
  live: {
    videoQuality: 'Resolution and frame rate for video streaming',
    audioQuality: 'Audio bitrate and quality settings',
    maxParticipants: 'Maximum number of participants allowed in the room',
    allowScreenShare: 'Allow participants to share their screen',
    enableReactions: 'Enable emoji reactions and expressions',
    enableChat: 'Enable text chat for participants',
    recordSession: 'Record the session for later playback',
    layoutMode: 'How to arrange participant videos (grid, spotlight, etc.)',
  },
  focus: {
    focusDuration: 'Minutes for focused study session',
    breakDuration: 'Minutes for short break',
    longBreakDuration: 'Minutes for long break after cycles',
    sessionsUntilLongBreak: 'Number of focus sessions before long break',
    allowNotifications: 'Allow notifications during session',
    soundEnabled: 'Enable timer sounds and alerts',
    distractionAlert: 'Alert user when losing focus',
    pomodoroCycles: 'Number of complete cycles in session',
    quietMode: 'Disable all sounds except alerts',
    backgroundMusic: 'Background music for focus sessions',
  },
  silent: {
    silentDuration: 'Minutes of silent study mode',
    participantVisibility: 'How much participant info is visible',
    allowTextChat: 'Allow text messaging during silent mode',
    showParticipantNames: 'Display participant names on screen',
    allowNotices: 'Show important notices/announcements',
    enableVibration: 'Vibration feedback instead of sound',
    displayTimerCountdown: 'Show timer countdown on screen',
    showActivityIndicators: 'Show who is actively typing/working',
    participantLimit: 'Maximum participants in silent room',
  },
};

function SettingInput({
  label,
  value,
  onChange,
  type = 'text',
  description,
  options,
}: {
  label: string;
  value: any;
  onChange: (value: any) => void;
  type?: string;
  description?: string;
  options?: string[];
}) {
  return (
    <div className="mb-5 pb-5 border-b border-white/5 last:border-b-0 last:pb-0">
      <label className="flex items-start justify-between mb-2">
        <span className="text-[13px] font-semibold text-white">{label}</span>
        <span className="text-[11px] text-white/40 max-w-[200px] text-right">{description}</span>
      </label>
      {type === 'toggle' ? (
        <button
          onClick={() => onChange(!value)}
          className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
          style={{
            background: value ? 'rgba(247,127,0,0.2)' : 'rgba(255,255,255,0.05)',
            color: value ? '#f77f00' : '#ffffff',
            border: `1px solid ${value ? 'rgba(247,127,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
          }}
        >
          {value ? 'Enabled' : 'Disabled'}
        </button>
      ) : type === 'select' && options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white outline-none hover:border-white/20 focus:border-[#f77f00]"
        >
          {options.map((opt) => (
            <option key={opt} value={opt} style={{ background: '#1a1a1a', color: '#ffffff' }}>
              {opt}
            </option>
          ))}
        </select>
      ) : type === 'range' ? (
        <div className="flex items-center gap-3">
          <input
            type="range"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1 h-2 rounded-lg appearance-none bg-white/10"
            style={{
              background: `linear-gradient(to right, #f77f00 0%, #f77f00 ${(value / 100) * 100}%, rgba(255,255,255,0.1) ${(value / 100) * 100}%, rgba(255,255,255,0.1) 100%)`,
            }}
          />
          <span className="text-[13px] font-semibold text-white min-w-[40px] text-right">{value}</span>
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value === '' ? '' : e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white outline-none hover:border-white/20 focus:border-[#f77f00]"
        />
      )}
    </div>
  );
}

export function ModeConfigurationPanel({ mode, onClose, onSave }: ModeConfigurationPanelProps) {
  const config = defaultConfigurations[mode];
  const [settings, setSettings] = useState(config.settings);

  const handleSave = () => {
    if (onSave) onSave(settings);
    onClose();
  };

  const getSettingType = (key: string): string => {
    const value = settings[key];
    if (typeof value === 'boolean') return 'toggle';
    if (typeof value === 'number') return 'range';
    if (key.includes('Mode') || key.includes('Quality') || key.includes('Music')) return 'select';
    return 'text';
  };

  const getOptions = (key: string): string[] | undefined => {
    if (key === 'videoQuality') return ['480p', '720p', '1080p', '2K'];
    if (key === 'audioQuality') return ['Low', 'Medium', 'High', 'Very High'];
    if (key === 'layoutMode') return ['grid', 'spotlight', 'presentation', 'custom'];
    if (key === 'participantVisibility') return ['minimal', 'basic', 'full'];
    if (key === 'backgroundMusic') return ['off', 'classical', 'ambient', 'lo-fi', 'nature'];
    return undefined;
  };

  const getMaxValue = (key: string): number => {
    if (key === 'focusDuration' || key === 'silentDuration') return 120;
    if (key === 'breakDuration' || key === 'longBreakDuration') return 30;
    if (key === 'maxParticipants' || key === 'participantLimit') return 100;
    if (key === 'sessionsUntilLongBreak' || key === 'pomodoroCycles') return 10;
    return 100;
  };

  const modeIcons = {
    live: Video,
    focus: Clock,
    silent: Eye,
  };

  const IconComponent = modeIcons[mode];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative pointer-events-auto w-full max-w-[480px] max-h-[85vh] mx-4 rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in scale-95 duration-300"
        style={{ background: 'rgba(0,20,50,0.9)', backdropFilter: 'blur(10px)' }}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-8 py-6 border-b border-white/10 bg-[rgba(0,10,30,0.8)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(247,127,0,0.15)' }}>
              <IconComponent className="w-5 h-5 text-[#f77f00]" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-white">{config.title} Settings</h2>
              <p className="text-[11px] text-white/40">{config.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Settings List */}
        <div className="overflow-y-auto px-8 py-6" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          {Object.entries(settings).map(([key, value]) => (
            <SettingInput
              key={key}
              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              value={value}
              onChange={(newValue) => setSettings({ ...settings, [key]: newValue })}
              type={getSettingType(key)}
              description={settingsDescriptions[mode][key]}
              options={
                getSettingType(key) === 'select'
                  ? getOptions(key)
                  : undefined
              }
            />
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex gap-3 px-8 py-4 border-t border-white/10 bg-[rgba(0,10,30,0.8)]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-[12px] text-[13px] font-semibold transition-all bg-white/5 hover:bg-white/10 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 rounded-[12px] text-[13px] font-semibold transition-all text-white"
            style={{ background: 'linear-gradient(135deg, #f77f00, #e63946)' }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
