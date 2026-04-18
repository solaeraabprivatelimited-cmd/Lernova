import React, { useState, useEffect } from "react";
import { roomConfig as roomConfigApi } from "@/app/lib/api";
import {
  X, Volume2, Bell, Timer, RotateCw, Eye, Zap, PenTool,
  Save, AlertCircle, Check, Loader
} from "lucide-react";

/* ── Types ── */

interface RoomConfigState {
  ambientSound?: string;
  notificationLevel?: 'silent' | 'normal' | 'active';
  timerDurationMins?: number;
  breakDurationMins?: number;
  autoStartBreak?: boolean;
  showTimer?: boolean;
  showParticipantList?: boolean;
  enableReactions?: boolean;
  enableWhiteboard?: boolean;
}

/* ── Setting Toggle ── */

function SettingToggle({
  label,
  description,
  value,
  onChange,
  icon: Icon,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between p-4 rounded-[12px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-5 h-5 text-[#0967bd] flex-shrink-0 mt-0.5">
          {Icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-[#003566] dark:text-white">
            {label}
          </p>
          <p className="text-[12px] text-slate-600 dark:text-slate-400 mt-1">
            {description}
          </p>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`flex-shrink-0 ml-4 w-12 h-6 rounded-full transition-colors duration-300 flex items-center ${
          value
            ? 'bg-green-500'
            : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
            value ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

/* ── Setting Slider ── */

function SettingSlider({
  label,
  value,
  onChange,
  min,
  max,
  unit,
  icon: Icon,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unit: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-[12px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 text-[#0967bd]">
            {Icon}
          </div>
          <p className="text-[14px] font-bold text-[#003566] dark:text-white">
            {label}
          </p>
        </div>
        <span className="text-[14px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0967bd]"
      />
      <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}

/* ── Setting Select ── */

function SettingSelect({
  label,
  value,
  onChange,
  options,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  icon: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-[12px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 text-[#0967bd]">
          {Icon}
        </div>
        <p className="text-[14px] font-bold text-[#003566] dark:text-white">
          {label}
        </p>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-[8px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-[13px] font-medium text-slate-700 dark:text-slate-300 outline-none focus:border-[#0967bd] transition-colors"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ── Main Component ── */

export function RoomConfigurationModal({
  roomId,
  isOpen,
  onClose,
  onSave,
}: {
  roomId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (config: RoomConfigState) => void;
}) {
  const [config, setConfig] = useState<RoomConfigState>({
    ambientSound: undefined,
    notificationLevel: 'normal',
    timerDurationMins: 25,
    breakDurationMins: 5,
    autoStartBreak: true,
    showTimer: true,
    showParticipantList: true,
    enableReactions: true,
    enableWhiteboard: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load current config on mount
  useEffect(() => {
    if (isOpen) {
      const loadConfig = async () => {
        try {
          setLoading(true);
          const response = await roomConfigApi.getConfig(roomId);
          if (response) {
            setConfig(response);
          }
        } catch (err) {
          console.error("Failed to load config:", err);
        } finally {
          setLoading(false);
        }
      };

      loadConfig();
    }
  }, [isOpen, roomId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      await roomConfigApi.updateConfig(roomId, config);

      setSuccess(true);
      setTimeout(() => {
        if (onSave) onSave(config);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-[20px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div>
            <h2 className="text-[20px] font-bold text-[#003566] dark:text-white">
              Room Settings
            </h2>
            <p className="text-[12px] text-slate-600 dark:text-slate-400 mt-1">
              Customize your study room experience
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-6 h-6 text-[#0967bd] animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 p-4 rounded-[12px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-bold text-red-700 dark:text-red-300">
                  Error loading settings
                </p>
                <p className="text-[12px] text-red-600 dark:text-red-400 mt-1">
                  {error}
                </p>
              </div>
            </div>
          ) : success ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-[16px] font-bold text-green-600 dark:text-green-400">
                  Settings saved!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Ambient Sound */}
              <div>
                <h3 className="text-[12px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                  Audio
                </h3>
                <SettingSelect
                  label="Ambient Sound"
                  value={config.ambientSound || ''}
                  onChange={(v) => setConfig({ ...config, ambientSound: v || undefined })}
                  options={[
                    { value: '', label: 'None' },
                    { value: 'rain', label: '🌧️ Rain' },
                    { value: 'coffee_shop', label: '☕ Coffee Shop' },
                    { value: 'forest', label: '🌲 Forest' },
                    { value: 'ocean', label: '🌊 Ocean' },
                  ]}
                  icon={<Volume2 className="w-5 h-5" />}
                />
              </div>

              {/* Notifications */}
              <div>
                <h3 className="text-[12px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                  Notifications
                </h3>
                <SettingSelect
                  label="Notification Level"
                  value={config.notificationLevel || 'normal'}
                  onChange={(v) => setConfig({ ...config, notificationLevel: v as any })}
                  options={[
                    { value: 'silent', label: '🔇 Silent' },
                    { value: 'normal', label: '🔕 Normal' },
                    { value: 'active', label: '🔔 Active' },
                  ]}
                  icon={<Bell className="w-5 h-5" />}
                />
              </div>

              {/* Timer Settings */}
              <div>
                <h3 className="text-[12px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                  Timer & Breaks
                </h3>
                <div className="space-y-4">
                  <SettingSlider
                    label="Study Duration"
                    value={config.timerDurationMins || 25}
                    onChange={(v) => setConfig({ ...config, timerDurationMins: v })}
                    min={5}
                    max={180}
                    unit="minutes"
                    icon={<Timer className="w-5 h-5" />}
                  />
                  <SettingSlider
                    label="Break Duration"
                    value={config.breakDurationMins || 5}
                    onChange={(v) => setConfig({ ...config, breakDurationMins: v })}
                    min={1}
                    max={60}
                    unit="minutes"
                    icon={<RotateCw className="w-5 h-5" />}
                  />
                  <SettingToggle
                    label="Auto-start Break"
                    description="Automatically start break after study session"
                    value={config.autoStartBreak || false}
                    onChange={(v) => setConfig({ ...config, autoStartBreak: v })}
                    icon={<RotateCw className="w-5 h-5" />}
                  />
                </div>
              </div>

              {/* Display Settings */}
              <div>
                <h3 className="text-[12px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                  Display
                </h3>
                <div className="space-y-3">
                  <SettingToggle
                    label="Show Timer"
                    description="Display timer on screen during sessions"
                    value={config.showTimer || false}
                    onChange={(v) => setConfig({ ...config, showTimer: v })}
                    icon={<Timer className="w-5 h-5" />}
                  />
                  <SettingToggle
                    label="Show Participants"
                    description="Display list of room participants"
                    value={config.showParticipantList || false}
                    onChange={(v) => setConfig({ ...config, showParticipantList: v })}
                    icon={<Eye className="w-5 h-5" />}
                  />
                </div>
              </div>

              {/* Interactive Features */}
              <div>
                <h3 className="text-[12px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                  Interactive
                </h3>
                <div className="space-y-3">
                  <SettingToggle
                    label="Reactions"
                    description="Allow emoji reactions from participants"
                    value={config.enableReactions || false}
                    onChange={(v) => setConfig({ ...config, enableReactions: v })}
                    icon={<Zap className="w-5 h-5" />}
                  />
                  <SettingToggle
                    label="Whiteboard"
                    description="Enable collaborative drawing and diagramming"
                    value={config.enableWhiteboard || false}
                    onChange={(v) => setConfig({ ...config, enableWhiteboard: v })}
                    icon={<PenTool className="w-5 h-5" />}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!success && !error && !loading && (
          <div className="sticky bottom-0 flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-[10px] border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-[13px] font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-[10px] bg-gradient-to-r from-[#0967bd] to-[#003566] text-white text-[13px] font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
