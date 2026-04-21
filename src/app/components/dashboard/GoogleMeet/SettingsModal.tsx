/**
 * SettingsModal - Settings panel for device selection and preferences
 */

import React from 'react';
import { X, Volume2, Mic, Video, Eye, Wind } from 'lucide-react';

interface SettingsModalProps {
  audioDevices: MediaDeviceInfo[];
  videoDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  selectedAudioDeviceId: string;
  selectedVideoDeviceId: string;
  selectedAudioOutputDeviceId: string;
  backgroundBlurred: boolean;
  noiseSuppression: boolean;
  onAudioDeviceChange: (deviceId: string) => void;
  onVideoDeviceChange: (deviceId: string) => void;
  onAudioOutputChange: (deviceId: string) => void;
  onBackgroundBlurToggle: (enabled: boolean) => void;
  onNoiseSuppressionToggle: (enabled: boolean) => void;
  onClose: () => void;
}

/**
 * Settings Section Component
 */
function SettingsSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/5 dark:border-white/10 px-6 py-4 last:border-b-0">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-black dark:text-white">{title}</h3>
      </div>
      <div className="ml-7 space-y-2">{children}</div>
    </div>
  );
}

/**
 * Device Select Component
 */
function DeviceSelect({
  label,
  devices,
  selectedDeviceId,
  onChange,
}: {
  label: string;
  devices: MediaDeviceInfo[];
  selectedDeviceId: string;
  onChange: (deviceId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-black/70 dark:text-white/70">{label}</label>
      <select
        value={selectedDeviceId}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-gray-900 text-black dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Device ${device.deviceId.slice(0, 5)}`}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Toggle Switch Component
 */
function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-black/70 dark:text-white/70">{label}</label>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          } mt-0.5`}
        />
      </button>
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
    <div className="fixed inset-0 bg-black/30 dark:bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-black/5 dark:border-white/10 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-black dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5 text-black/60 dark:text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Audio Devices */}
          {audioDevices.length > 0 && (
            <SettingsSection icon={Mic} title="Microphone">
              <DeviceSelect
                label="Input Device"
                devices={audioDevices}
                selectedDeviceId={selectedAudioDeviceId}
                onChange={onAudioDeviceChange}
              />
            </SettingsSection>
          )}

          {/* Audio Output */}
          {audioOutputDevices.length > 0 && (
            <SettingsSection icon={Volume2} title="Speaker">
              <DeviceSelect
                label="Output Device"
                devices={audioOutputDevices}
                selectedDeviceId={selectedAudioOutputDeviceId}
                onChange={onAudioOutputChange}
              />
            </SettingsSection>
          )}

          {/* Video Devices */}
          {videoDevices.length > 0 && (
            <SettingsSection icon={Video} title="Camera">
              <DeviceSelect
                label="Camera Device"
                devices={videoDevices}
                selectedDeviceId={selectedVideoDeviceId}
                onChange={onVideoDeviceChange}
              />
            </SettingsSection>
          )}

          {/* Audio Enhancements */}
          <SettingsSection icon={Wind} title="Audio Enhancements">
            <ToggleSwitch
              label="Noise Suppression"
              checked={noiseSuppression}
              onChange={onNoiseSuppressionToggle}
            />
          </SettingsSection>

          {/* Video Enhancements */}
          <SettingsSection icon={Eye} title="Video Enhancements">
            <ToggleSwitch
              label="Blur Background"
              checked={backgroundBlurred}
              onChange={onBackgroundBlurToggle}
            />
          </SettingsSection>
        </div>

        {/* Footer */}
        <div className="border-t border-black/5 dark:border-white/10 px-6 py-4 flex justify-end gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-black/5 dark:bg-white/10 text-black dark:text-white font-medium hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
