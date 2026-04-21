/**
 * MeetHeader - Top header bar for collaborative room
 * Displays: meeting title, timer, connection status
 */

import React, { useState, useEffect } from 'react';
import { Clock, Wifi, WifiOff, MoreVertical } from 'lucide-react';

interface MeetHeaderProps {
  roomName: string;
  participantCount: number;
  isConnected: boolean;
}

export function MeetHeader({ roomName, participantCount, isConnected }: MeetHeaderProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <header className="h-16 bg-white dark:bg-[#202124] border-b border-black/5 dark:border-white/5 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Room Info */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-medium text-black dark:text-white truncate">
            {roomName}
          </h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            {participantCount} {participantCount === 1 ? 'participant' : 'participants'}
          </p>
        </div>
      </div>

      {/* Center: Timer & Status */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-black/70 dark:text-white/70">
          <Clock className="w-4 h-4" />
          <span className="font-medium">{formatTime(elapsedTime)}</span>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <Wifi className="w-4 h-4" />
              <span className="text-xs font-medium">Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <WifiOff className="w-4 h-4" />
              <span className="text-xs font-medium">Connecting...</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Menu */}
      <button className="ml-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
        <MoreVertical className="w-5 h-5 text-black/60 dark:text-white/60" />
      </button>
    </header>
  );
}
