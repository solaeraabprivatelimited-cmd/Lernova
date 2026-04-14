/**
 * Study Room Monitoring Dashboard
 * Privacy-first visualization component
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  Camera,
  Check,
  Circle,
  Eye,
  MoreVertical,
  Pause,
  Play,
  Settings,
  Users,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface MonitoringEvent {
  id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  people_count?: number;
  created_at: string;
}

interface RoomStatus {
  room: any;
  currentOccupancy: number;
  recentEvents: MonitoringEvent[];
  systemHealth: any;
}

const SeverityBadge = ({ severity }: { severity: string }) => {
  const colors = {
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    critical: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[severity as keyof typeof colors]}`}>
      {severity.toUpperCase()}
    </span>
  );
};

const SkeletonVisualization = ({ occupancy }: { occupancy: number }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-8 aspect-video flex items-center justify-center border border-slate-700">
      <div className="text-center">
        <div className="flex justify-center gap-4 mb-4">
          {Array(Math.min(occupancy, 5))
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Circle className="w-3 h-3 mx-auto text-green-400 fill-green-400 animate-pulse" />
                <div className="w-1 h-6 bg-green-400 mx-auto"></div>
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-green-400"></div>
                  <div className="w-1 h-4 bg-green-400"></div>
                </div>
              </div>
            ))}
        </div>
        <p className="text-slate-300 text-sm">
          {occupancy} person{occupancy !== 1 ? 's' : ''} detected
        </p>
      </div>
    </div>
  );
};

const EventTimeline = ({ events }: { events: MonitoringEvent[] }) => {
  return (
    <div className="space-y-3">
      {events.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <Check className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <p>No events recorded</p>
        </div>
      ) : (
        events.map((event) => (
          <div key={event.id} className="flex gap-3 pb-3 border-b border-slate-700 last:border-0">
            <div className="flex-shrink-0 mt-1">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-slate-200 truncate">{event.event_type}</h4>
                <SeverityBadge severity={event.severity} />
              </div>
              {event.description && (
                <p className="text-xs text-slate-400 mt-1">{event.description}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                {new Date(event.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const SystemHealth = ({ health }: { health: any }) => {
  const isOnline = health?.is_camera_online;
  const status = health?.status || 'unknown';

  const statusColor = {
    healthy: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    degraded: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    offline: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Camera className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase">Camera</span>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-semibold w-fit ${statusColor[status as keyof typeof statusColor]}`}>
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase">CPU</span>
        </div>
        <p className="text-lg font-bold text-slate-200">
          {health?.cpu_usage?.toFixed(1) || 0}%
        </p>
      </div>

      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase">FPS</span>
        </div>
        <p className="text-lg font-bold text-slate-200">
          {health?.processing_fps?.toFixed(1) || 0}
        </p>
      </div>

      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase">Memory</span>
        </div>
        <p className="text-lg font-bold text-slate-200">
          {health?.gpu_memory_usage?.toFixed(1) || 0}%
        </p>
      </div>
    </div>
  );
};

export function StudyRoomMonitoringDashboard({ roomId }: { roomId: string }) {
  const [roomStatus, setRoomStatus] = useState<RoomStatus | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'live' | 'events' | 'health'>('live');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // ✅ SECURE: Call Lernova_API backend directly (not frontend /api/)
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/monitoring/status/${roomId}`);
        const data = await response.json();
        setRoomStatus(data);
      } catch (error) {
        console.error('Error fetching room status:', error);
        toast.error('Failed to load monitoring data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [roomId]);

  const handleToggleMonitoring = async () => {
    try {
      // ✅ SECURE: Call Lernova_API backend directly (not frontend /api/)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      if (!isMonitoring) {
        await fetch(`${apiUrl}/monitoring/init/${roomId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ camera_rtsp: null }),
        });
        setIsMonitoring(true);
        toast.success('Monitoring started');
      } else {
        await fetch(`${apiUrl}/monitoring/stop/${roomId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        setIsMonitoring(false);
        toast.success('Monitoring paused');
      }
    } catch (error) {
      toast.error('Failed to toggle monitoring');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin">
          <Circle className="w-8 h-8 text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {roomStatus?.room?.room_name || 'Study Room'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Privacy-First Monitoring</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleToggleMonitoring}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              isMonitoring
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isMonitoring ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start
              </>
            )}
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Occupancy Visualization */}
        <div className="col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Monitoring
              </h3>
              <div className="flex items-center gap-2">
                <Circle className="w-2 h-2 bg-green-500 fill-green-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {isMonitoring ? 'ACTIVE' : 'PAUSED'}
                </span>
              </div>
            </div>
            <SkeletonVisualization occupancy={roomStatus?.currentOccupancy || 0} />
          </div>
        </div>

        {/* Right: Occupancy Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">
              Occupancy
            </span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-4xl font-bold text-slate-900 dark:text-white">
            {roomStatus?.currentOccupancy || 0}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            Max capacity: {roomStatus?.room?.capacity || 'N/A'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-4">
          {['live', 'events', 'health'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`px-4 py-2 border-b-2 font-semibold transition-colors ${
                selectedTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        {selectedTab === 'live' && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Recent Events
            </h3>
            <EventTimeline events={roomStatus?.recentEvents || []} />
          </div>
        )}

        {selectedTab === 'events' && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Event History
            </h3>
            <EventTimeline events={roomStatus?.recentEvents || []} />
          </div>
        )}

        {selectedTab === 'health' && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              System Health
            </h3>
            <SystemHealth health={roomStatus?.systemHealth} />
          </div>
        )}
      </div>
    </div>
  );
}
