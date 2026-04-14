/**
 * Study Room Monitoring API
 * Next.js API routes for privacy-first surveillance system
 */

import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// ============ POST: Initiate Room Monitoring Session ============
export const startMonitoringSession = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { roomId, sessionName } = req.body;

    if (!roomId) {
      return res.status(400).json({ error: 'roomId required' });
    }

    // Create monitoring session
    const { data, error } = await supabase
      .from('monitoring_sessions')
      .insert([
        {
          room_id: roomId,
          session_start: new Date().toISOString(),
          status: 'active',
          total_people_peak: 0,
          total_events: 0,
          anomalies_detected: 0,
        },
      ])
      .select();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      session: data?.[0],
      message: 'Monitoring session started',
    });
  } catch (error) {
    console.error('Error starting monitoring:', error);
    return res.status(500).json({ error: 'Failed to start monitoring session' });
  }
};

// ============ POST: Log Monitoring Event ============
export const logMonitoringEvent = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { roomId, eventType, severity, description, peopleCount, anomalyScore, eventData } =
      req.body;

    if (!roomId || !eventType || !severity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('monitoring_events')
      .insert([
        {
          room_id: roomId,
          event_type: eventType,
          severity: severity,
          description: description || null,
          people_count: peopleCount || 0,
          anomaly_score: anomalyScore || 0.0,
          event_data: eventData || {},
          processed: false,
        },
      ])
      .select();

    if (error) throw error;

    // Trigger alert if severity is high/critical
    if (severity === 'high' || severity === 'critical') {
      await triggerAlert(roomId, eventType, severity);
    }

    return res.status(200).json({
      success: true,
      event: data?.[0],
    });
  } catch (error) {
    console.error('Error logging event:', error);
    return res.status(500).json({ error: 'Failed to log event' });
  }
};

// ============ POST: Store Skeleton Data ============
export const storeSkeletonData = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { roomId, personIndex, keypoints, poseAngle, velocity, isStanding, isIdle } = req.body;

    if (!roomId || !keypoints) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('room_skeleton_snapshots')
      .insert([
        {
          room_id: roomId,
          person_index: personIndex || 0,
          keypoints: keypoints,
          pose_angle: poseAngle || 0.0,
          velocity: velocity || 0.0,
          is_standing: isStanding || true,
          is_idle: isIdle || false,
          frame_timestamp: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      snapshot: data?.[0],
    });
  } catch (error) {
    console.error('Error storing skeleton:', error);
    return res.status(500).json({ error: 'Failed to store skeleton data' });
  }
};

// ============ POST: Update Occupancy ============
export const updateOccupancy = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { roomId, occupancyCount, confidenceScore } = req.body;

    if (!roomId || occupancyCount === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('room_occupancy_history')
      .insert([
        {
          room_id: roomId,
          timestamp: new Date().toISOString(),
          occupancy_count: occupancyCount,
          confidence_score: confidenceScore || 0.9,
        },
      ])
      .select();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      occupancy: data?.[0],
    });
  } catch (error) {
    console.error('Error updating occupancy:', error);
    return res.status(500).json({ error: 'Failed to update occupancy' });
  }
};

// ============ GET: Room Monitoring Status ============
export const getRoomStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { roomId } = req.query;

    if (!roomId) {
      return res.status(400).json({ error: 'roomId required' });
    }

    // Get room info
    const { data: room, error: roomError } = await supabase
      .from('study_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (roomError) throw roomError;

    // Get latest events (last 10)
    const { data: events, error: eventsError } = await supabase
      .from('monitoring_events')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (eventsError) throw eventsError;

    // Get latest occupancy
    const { data: occupancy, error: occupancyError } = await supabase
      .from('room_occupancy_history')
      .select('occupancy_count')
      .eq('room_id', roomId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (occupancyError && occupancyError.code !== 'PGRST116') {
      throw occupancyError;
    }

    // Get system health
    const { data: health, error: healthError } = await supabase
      .from('monitoring_system_status')
      .select('*')
      .eq('room_id', roomId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (healthError && healthError.code !== 'PGRST116') {
      throw healthError;
    }

    return res.status(200).json({
      success: true,
      room: room,
      currentOccupancy: occupancy?.occupancy_count || 0,
      recentEvents: events || [],
      systemHealth: health || {},
    });
  } catch (error) {
    console.error('Error getting room status:', error);
    return res.status(500).json({ error: 'Failed to get room status' });
  }
};

// ============ GET: Event History (Analytics) ============
export const getEventHistory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { roomId, days = 7, severity } = req.query;

    if (!roomId) {
      return res.status(400).json({ error: 'roomId required' });
    }

    let query = supabase
      .from('monitoring_events')
      .select('*')
      .eq('room_id', roomId)
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

    if (severity) {
      query = query.eq('severity', severity);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // Aggregate statistics
    const stats = {
      totalEvents: data?.length || 0,
      criticalEvents: data?.filter((e) => e.severity === 'critical').length || 0,
      highSeverity: data?.filter((e) => e.severity === 'high').length || 0,
      behaviorBreakdown: aggregateBehaviors(data),
      hourlyDistribution: getHourlyDistribution(data),
    };

    return res.status(200).json({
      success: true,
      events: data,
      statistics: stats,
    });
  } catch (error) {
    console.error('Error getting event history:', error);
    return res.status(500).json({ error: 'Failed to fetch event history' });
  }
};

// ============ POST: Create Behavior Rule ============
export const createBehaviorRule = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { roomId, ruleName, ruleType, conditionJson, alertTriggerLevel } = req.body;

    if (!roomId || !ruleName || !ruleType || !conditionJson) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('behavior_rules')
      .insert([
        {
          room_id: roomId,
          rule_name: ruleName,
          rule_type: ruleType,
          condition_json: conditionJson,
          alert_trigger_level: alertTriggerLevel || 'medium',
          is_active: true,
        },
      ])
      .select();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      rule: data?.[0],
    });
  } catch (error) {
    console.error('Error creating rule:', error);
    return res.status(500).json({ error: 'Failed to create behavior rule' });
  }
};

// ============ POST: Update System Health ============
export const updateSystemHealth = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { roomId, isCameraOnline, processingFps, gpuMemory, cpuUsage, errorMessage } = req.body;

    if (!roomId) {
      return res.status(400).json({ error: 'roomId required' });
    }

    const status = isCameraOnline ? (cpuUsage > 80 ? 'degraded' : 'healthy') : 'offline';

    const { data, error } = await supabase
      .from('monitoring_system_status')
      .upsert(
        [
          {
            room_id: roomId,
            is_camera_online: isCameraOnline,
            last_frame_received_at: isCameraOnline ? new Date().toISOString() : null,
            processing_fps: processingFps || 0,
            gpu_memory_usage: gpuMemory || 0,
            cpu_usage: cpuUsage || 0,
            error_message: errorMessage || null,
            status: status,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: 'room_id' }
      )
      .select();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      health: data?.[0],
    });
  } catch (error) {
    console.error('Error updating system health:', error);
    return res.status(500).json({ error: 'Failed to update system health' });
  }
};

// ============ INTERNAL: Trigger Alert ============
async function triggerAlert(roomId: string, eventType: string, severity: string) {
  try {
    const { data: config, error } = await supabase
      .from('alert_configurations')
      .select('*')
      .eq('room_id', roomId)
      .eq('enabled', true)
      .single();

    if (error || !config) return;

    // Send notification (implement based on notification_channel)
    console.log(`🚨 ALERT - Room: ${roomId}, Event: ${eventType}, Severity: ${severity}`);

    // TODO: Integrate with email/SMS/webhooks
  } catch (error) {
    console.error('Error triggering alert:', error);
  }
}

// ============ INTERNAL: Helper Functions ============
function aggregateBehaviors(events: any[]) {
  const breakdown: Record<string, number> = {};
  events?.forEach((e) => {
    breakdown[e.event_type] = (breakdown[e.event_type] || 0) + 1;
  });
  return breakdown;
}

function getHourlyDistribution(events: any[]) {
  const distribution: Record<number, number> = {};
  events?.forEach((e) => {
    const hour = new Date(e.created_at).getHours();
    distribution[hour] = (distribution[hour] || 0) + 1;
  });
  return distribution;
}

// Export all functions
export default {
  startMonitoringSession,
  logMonitoringEvent,
  storeSkeletonData,
  updateOccupancy,
  getRoomStatus,
  getEventHistory,
  createBehaviorRule,
  updateSystemHealth,
};
