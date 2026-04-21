/**
 * SettingsModal — Device selection + enhancements
 * Dark-themed, clean modal with toggle switches
 */

import { type ComponentType } from 'react';
import { X, Volume2, Mic, Video, Wind, Eye } from 'lucide-react';

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
  onBackgroundBlurToggle: (v: boolean) => void;
  onNoiseSuppressionToggle: (v: boolean) => void;
  onClose: () => void;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-white/70">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative w-10 h-5 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]',
          checked ? 'bg-[#1a73e8]' : 'bg-white/20',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          ].join(' ')}
        />
      </button>
    </div>
  );
}

function DeviceSelect({
  devices,
  value,
  onChange,
  placeholder,
}: {
  devices: MediaDeviceInfo[];
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1.5 px-3 py-2 rounded-lg bg-[#2d2e30] border border-white/10 text-sm text-white/80 outline-none focus:border-[#1a73e8] transition-colors"
    >
      {devices.length === 0 ? (
        <option value="">{placeholder}</option>
      ) : (
        devices.map((d, i) => (
          <option key={d.deviceId} value={d.deviceId}>
            {d.label || `Device ${i + 1}`}
          </option>
        ))
      )}
    </select>
  );
}

function Section({ icon: Icon, title, children }: { icon: ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-4 border-b border-white/[0.06] last:border-0">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-[#1a73e8]" />
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function SettingsModal({
  audioDevices,
  videoDevices,
  audioOutputDevices,
  selectedAudioDeviceId,
  selectedVideoDeviceId,
  selectedAudioOutputDeviceId,
  backgroundBlurred,
  noiseSuppression,
  onAudioDeviceChange,
  onVideoDeviceChange,
  onAudioOutputChange,
  onBackgroundBlurToggle,
  onNoiseSuppressionToggle,
  onClose,
}: SettingsModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-[#1e1f20] rounded-2xl shadow-2xl border border-white/[0.08] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
          <h2 className="text-[15px] font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <Section icon={Mic} title="Microphone">
            <DeviceSelect
              devices={audioDevices}
              value={selectedAudioDeviceId}
              onChange={onAudioDeviceChange}
              placeholder="No microphone found"
            />
          </Section>

          <Section icon={Volume2} title="Speaker">
            <DeviceSelect
              devices={audioOutputDevices}
              value={selectedAudioOutputDeviceId}
              onChange={onAudioOutputChange}
              placeholder="No speaker found"
            />
          </Section>

          <Section icon={Video} title="Camera">
            <DeviceSelect
              devices={videoDevices}
              value={selectedVideoDeviceId}
              onChange={onVideoDeviceChange}
              placeholder="No camera found"
            />
          </Section>

          <Section icon={Wind} title="Audio">
            <Toggle
              label="Noise suppression"
              checked={noiseSuppression}
              onChange={onNoiseSuppressionToggle}
            />
          </Section>

          <Section icon={Eye} title="Video">
            <Toggle
              label="Blur background"
              checked={backgroundBlurred}
              onChange={onBackgroundBlurToggle}
            />
          </Section>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 py-4 border-t border-white/[0.06]">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-[#1a73e8] hover:bg-[#1765cc] text-white text-sm font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
