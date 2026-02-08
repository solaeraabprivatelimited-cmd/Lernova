import React, { useState, useEffect } from 'react';
import { X, Play, Trash2 } from 'lucide-react';

interface FocusTimerPanelProps {
  onClose: () => void;
  onTimerComplete?: (label: string, duration: number) => void;
}

interface SavedTimer {
  id: string;
  duration: number; // in seconds
  label: string;
}

export function FocusTimerPanel({ onClose, onTimerComplete }: FocusTimerPanelProps) {
  const [timerLabel, setTimerLabel] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // Default 1 minute
  const [currentLabel, setCurrentLabel] = useState('');
  const [savedTimers, setSavedTimers] = useState<SavedTimer[]>([
    { id: '1', duration: 60, label: 'Break' },
    { id: '2', duration: 300, label: 'Problem Solving' }
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Timer completed - trigger notification
            if (onTimerComplete) {
              onTimerComplete(currentLabel, timeLeft);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, currentLabel, onTimerComplete]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (secs === 0) return `${mins}:00`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!isRunning) {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      if (totalSeconds > 0) {
        setTimeLeft(totalSeconds);
        setIsRunning(true);
        setCurrentLabel(timerLabel || 'Timer');
      }
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handlePlaySaved = (duration: number) => {
    setTimeLeft(duration);
    setIsRunning(true);
    setCurrentLabel(timerLabel || 'Timer');
  };

  const handleDeleteSaved = (id: string) => {
    setSavedTimers(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="absolute right-8 top-[62px] bg-white/[0.2] backdrop-blur-md rounded-[20px] w-[462px] h-[722px] p-8 flex flex-col gap-5 font-['Poppins'] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-[24px] font-medium text-white">Focus Timer</h2>
        <button
          onClick={onClose}
          type="button"
          className="w-[32px] h-[32px] flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer relative z-50"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Set Timer Section */}
      <div className="flex flex-col gap-4">
        <p className="text-[16px] font-medium text-white/60">Set Timer</p>
        <div className="bg-white/10 rounded-[20px] px-6 py-4 flex items-center justify-between">
          <input
            type="text"
            value={timerLabel}
            onChange={(e) => setTimerLabel(e.target.value)}
            placeholder="Label"
            className="bg-transparent outline-none text-white text-[16px] flex-1"
          />
          <span className="text-white/60 text-[16px]">
            {timerLabel || 'Label Name'}
          </span>
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center text-white text-[60px] font-normal">
        {formatTime(timeLeft)}
      </div>

      {/* Start/Stop Buttons */}
      <div className="flex items-center justify-between w-full">
        <button
          onClick={handleStop}
          disabled={!isRunning}
          className="bg-[#ff6969]/10 rounded-[20px] px-6 py-4 text-[#ff6969] text-[16px] w-[84px] hover:bg-[#ff6969]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Stop
        </button>
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="bg-[#50fe00]/10 rounded-[20px] px-6 py-4 text-[#50fe00] text-[16px] w-[84px] hover:bg-[#50fe00]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start
        </button>
      </div>

      {/* Recents Section */}
      <div className="flex flex-col gap-2.5 flex-1">
        <p className="text-[16px] font-medium text-white">Recents</p>
        
        <div className="flex flex-col gap-2.5">
          {savedTimers.map((timer) => (
            <div
              key={timer.id}
              className="bg-white/10 rounded-[20px] px-6 py-4 flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span className="text-[24px] text-white/60">{formatDuration(timer.duration)}</span>
                <span className="text-[16px] text-white/60">{timer.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePlaySaved(timer.duration)}
                  className="bg-[#50fe00]/10 rounded-[20px] w-[32px] h-[32px] flex items-center justify-center hover:bg-[#50fe00]/20 transition-colors"
                >
                  <Play className="w-[18px] h-[18px] text-[#50fe00] fill-[#50fe00]" />
                </button>
                <button
                  onClick={() => handleDeleteSaved(timer.id)}
                  className="bg-[#ff6969]/10 rounded-[20px] w-[32px] h-[32px] flex items-center justify-center hover:bg-[#ff6969]/20 transition-colors"
                >
                  <Trash2 className="w-[18px] h-[18px] text-[#ff6969]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}