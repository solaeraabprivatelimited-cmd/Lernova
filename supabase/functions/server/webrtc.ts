/**
 * WebRTC API Routes - Production-grade implementation
 * Provides room management, participant tracking, and signaling
 * 
 * These routes are registered in index.ts via registerWebRTCRoutes()
 */

// @ts-ignore - Deno module resolution
import type { Context } from "npm:hono";

const genId = () => crypto.randomUUID();
const nowIso = () => new Date().toISOString();

/**
 * Extract user ID from JWT Bearer token
 * Decodes the JWT payload to extract the 'sub' (subject/user ID) claim
 * Works with Supabase ES256-signed tokens
 */
function extractUserIdFromToken(
  authHeader: string | undefined
): string | null {
  if (!authHeader?.startsWith("Bearer ")) {
    console.log("[Token] No Bearer token found");
    return null;
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix
  
  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("[Token] Invalid token format: expected 3 parts, got", parts.length);
      return null;
    }

    // Decode payload (second part) - base64url to base64 conversion
    let payload = parts[1];
    payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    payload += "=".repeat((4 - (payload.length % 4)) % 4);
    
    const decoded = JSON.parse(atob(payload));
    console.log("[Token] Decoded payload claims:", Object.keys(decoded));

    // Supabase JWT has 'sub' claim for user ID
    const userId = decoded.sub || decoded.user_id;
    
    if (!userId) {
      console.error("[Token] No user ID found in claims. sub:", decoded.sub, "user_id:", decoded.user_id);
      console.error("[Token] Full payload:", decoded);
      return null;
    }

    console.log("[Token] Extracted user ID:", userId);
    return userId;
  } catch (error) {
    console.error("[Token] Failed to extract user ID from token:", error);
    console.error("[Token] Token preview:", authHeader?.substring(0, 50) + "...");
    return null;
  }
}

interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

function errorResponse(code: string, message: string, details?: unknown): ApiError {
  return { code, message, details };
}

function generateRoomCode(): string {
  return `STUDY-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function resolveRoomRecord(supabase: any, identifier: string) {
  const normalized = identifier.trim();
  const isCode = /^(?:STUDY|WEBRTC)-[A-Z0-9]+$/i.test(normalized);

  const query = supabase
    .from("webrtc_rooms")
    .select("id, code, is_active, max_participants, host_id")
    [isCode ? "eq" : "eq"](isCode ? "code" : "id", isCode ? normalized.toUpperCase() : normalized)
    .maybeSingle();

  const { data, error } = await query;
  return { data, error };
}

interface StoredSignal {
  id: string;
  room_id: string;
  from_user_id: string;
  to_user_id: string;
  signal_type: string;
  payload: unknown;
  created_at: string;
}

async function ensureActiveRoomParticipant(
  supabase: any,
  roomId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from("webrtc_participants")
    .select("id")
    .eq("room_id", roomId)
    .eq("user_id", userId)
    .is("disconnected_at", null)
    .limit(1);

  if (error) {
    return { ok: false, error };
  }

  return { ok: !!(data && data.length > 0), error: null };
}

/**
 * Register WebRTC routes on a Hono app instance
 * Called from index.ts with the initialized app and adminClient factory
 */
export function registerWebRTCRoutes(app: any, adminClient: () => any) {
  // ─────────────────────────────────────────────────────────────
  // Debug Endpoint
  // ─────────────────────────────────────────────────────────────

  /** Debug endpoint - no auth required */
  app.get("/webrtc/debug", async (c: Context) => {
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.slice(7) || "";
    const parts = token.split(".");
    
    return c.json({
      status: "debug",
      auth_header_received: !!authHeader,
      auth_header_starts_with_bearer: authHeader?.startsWith("Bearer ") || false,
      token_parts_count: parts.length,
      timestamp: nowIso(),
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Room Management
  // ─────────────────────────────────────────────────────────────

  /** Create a new WebRTC study room */
  app.post("/webrtc/rooms", async (c: Context) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return c.json(
          errorResponse("MISSING_AUTH", "Authorization header required"),
          401
        );
      }

      const supabase = adminClient();
      const { name, mode = "collaborative", subject, description, maxParticipants = 6 } =
        await c.req.json();

      // Validation
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return c.json(
          errorResponse("INVALID_NAME", "Room name is required"),
          400
        );
      }

      const validModes = ["focus", "silent", "collaborative", "live"];
      if (!validModes.includes(mode)) {
        return c.json(
          errorResponse(
            "INVALID_MODE",
            `Mode must be one of: ${validModes.join(", ")}`
          ),
          400
        );
      }

      if (maxParticipants < 2 || maxParticipants > 20) {
        return c.json(
          errorResponse(
            "INVALID_PARTICIPANTS",
            "Max participants must be between 2 and 20"
          ),
          400
        );
      }

      // Extract user ID from JWT token
      const userId = extractUserIdFromToken(authHeader);
      if (!userId) {
        return c.json(
          errorResponse("INVALID_TOKEN", "Could not extract user ID from token"),
          401
        );
      }

      // Generate unique room code
      const roomCode = generateRoomCode();

      const { data: room, error: createError } = await supabase
        .from("webrtc_rooms")
        .insert({
          code: roomCode,
          name: name.trim(),
          mode,
          host_id: userId,
          subject: subject || null,
          description: description || null,
          max_participants: maxParticipants,
          is_active: true,
          created_by: userId,
          updated_by: userId,
        })
        .select()
        .single();

      if (createError) {
        console.error("Room creation error:", createError);
        return c.json(
          errorResponse(
            "ROOM_CREATE_FAILED",
            "Failed to create room",
            createError.message
          ),
          500
        );
      }

      // Add host as initial participant
      const { error: participantError } = await supabase
        .from("webrtc_participants")
        .insert({
          room_id: room.id,
          user_id: userId,
          permissions: "host",
          connection_state: "connecting",
        });

      if (participantError) {
        console.error("Participant add error:", participantError);
        // Continue - room is created, participant registration failed
      }

      return c.json(room, 201);
    } catch (error: any) {
      console.error("POST /webrtc/rooms error:", error);
      return c.json(
        errorResponse("INTERNAL_ERROR", "Failed to create room", error.message),
        500
      );
    }
  });

  /** Get room details with participant list */
  app.get("/webrtc/rooms/:roomId", async (c: Context) => {
    try {
      const { roomId } = c.req.param();
      const supabase = adminClient();

      const { data: roomMatch, error: roomMatchError } = await resolveRoomRecord(
        supabase,
        roomId
      );

      if (roomMatchError || !roomMatch?.id) {
        return c.json(
          errorResponse("ROOM_NOT_FOUND", "Room does not exist"),
          404
        );
      }

      const { data: room, error: roomError } = await supabase
        .from("webrtc_rooms")
        .select(
          `
          *,
          participants:webrtc_participants(
            id, user_id, connection_state, is_audio_enabled, is_video_enabled,
            is_screen_sharing, is_muted, permissions, joined_at, last_heartbeat,
            disconnected_at
          )
        `
        )
        .eq("id", roomMatch.id)
        .maybeSingle();

      if (roomError) {
        console.error("Room fetch error:", roomError);
        return c.json(
          errorResponse("ROOM_FETCH_FAILED", "Failed to fetch room"),
          500
        );
      }

      if (!room) {
        return c.json(
          errorResponse("ROOM_NOT_FOUND", "Room does not exist"),
          404
        );
      }
      const participants = Array.isArray(room.participants) ? room.participants : [];
      const participantUserIds = Array.from(
        new Set(
          participants
            .map((participant: { user_id?: string }) => participant.user_id)
            .filter((id: string | undefined): id is string => !!id)
        )
      );

      let userMap = new Map<string, { name: string; avatar_url: string | null }>();
      if (participantUserIds.length > 0) {
        const { data: users, error: usersError } = await supabase
          .from("users")
          .select("id, name, avatar_url")
          .in("id", participantUserIds);

        if (!usersError && users) {
          userMap = new Map(
            users.map((user: { id: string; name?: string; avatar_url?: string | null }) => [
              user.id,
              {
                name: user.name || "Participant",
                avatar_url: user.avatar_url ?? null,
              },
            ])
          );
        }
      }

      const enrichedParticipants = participants.map((participant: any) => {
        const user = userMap.get(participant.user_id);
        const fallbackName =
          typeof participant.user_id === "string" && participant.user_id.length > 0
            ? participant.user_id.slice(0, 8)
            : "Participant";
        return {
          ...participant,
          display_name: user?.name || fallbackName,
          avatar_url: user?.avatar_url ?? null,
        };
      });

      return c.json({
        ...room,
        participants: enrichedParticipants,
      });
    } catch (error: any) {
      console.error("GET /webrtc/rooms/:roomId error:", error);
      return c.json(
        errorResponse("INTERNAL_ERROR", "Failed to fetch room"),
        500
      );
    }
  });

  /** List active rooms */
  app.get("/webrtc/rooms", async (c: Context) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return c.json(
          errorResponse("MISSING_AUTH", "Authorization header required"),
          401
        );
      }

      const supabase = adminClient();

      const userId = extractUserIdFromToken(authHeader);
      if (!userId) {
        return c.json(
          errorResponse("INVALID_TOKEN", "Could not extract user ID from token"),
          401
        );
      }

      const { data: rooms, error } = await supabase
        .from("webrtc_rooms")
        .select(
          `
          id, code, name, mode, subject, host_id, max_participants,
          is_active, created_at, updated_at,
          participants:webrtc_participants(id, connection_state)
        `
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Rooms list error:", error);
        return c.json(
          errorResponse("ROOMS_FETCH_FAILED", "Failed to fetch rooms"),
          500
        );
      }

      return c.json(rooms || []);
    } catch (error: any) {
      console.error("GET /webrtc/rooms error:", error);
      return c.json(
        errorResponse("INTERNAL_ERROR", "Failed to fetch rooms"),
        500
      );
    }
  });

  // ─────────────────────────────────────────────────────────────
  // Participant Management
  // ─────────────────────────────────────────────────────────────

  /** Join a room */
  app.post("/webrtc/rooms/:roomId/join", async (c: Context) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return c.json(
          errorResponse("MISSING_AUTH", "Authorization required"),
          401
        );
      }

      const { roomId } = c.req.param();
      const supabase = adminClient();

      // Check room exists and is active
      const { data: room, error: roomError } = await resolveRoomRecord(
        supabase,
        roomId
      );

      if (roomError || !room) {
        return c.json(
          errorResponse("ROOM_NOT_FOUND", "Room does not exist"),
          404
        );
      }

      if (!room.is_active) {
        return c.json(
          errorResponse("ROOM_CLOSED", "Room is no longer active"),
          410
        );
      }

      // Extract user ID from JWT token
      const userId = extractUserIdFromToken(authHeader);
      if (!userId) {
        return c.json(
          errorResponse("INVALID_TOKEN", "Could not extract user ID from token"),
          401
        );
      }

      const nowMs = Date.now();
      const freshnessWindowMs = 40_000;
      const now = nowIso();

      const { data: userActiveRows, error: userActiveError } = await supabase
        .from("webrtc_participants")
        .select("id, room_id, last_heartbeat, joined_at")
        .eq("user_id", userId)
        .is("disconnected_at", null);

      if (userActiveError) {
        return c.json(
          errorResponse("JOIN_FAILED", "Failed to inspect existing active sessions", userActiveError.message),
          500
        );
      }

      const staleUserParticipantIds: string[] = [];
      const freshUserRows = (userActiveRows ?? []).filter(
        (participant: { id: string; room_id: string; last_heartbeat?: string | null; joined_at?: string | null }) => {
          const heartbeatMs = participant.last_heartbeat ? Date.parse(participant.last_heartbeat) : 0;
          const joinedMs = participant.joined_at ? Date.parse(participant.joined_at) : 0;
          const latestActivityMs = Math.max(heartbeatMs, joinedMs);
          const isFresh = latestActivityMs > nowMs - freshnessWindowMs;
          if (!isFresh) {
            staleUserParticipantIds.push(participant.id);
          }
          return isFresh;
        }
      );

      if (staleUserParticipantIds.length > 0) {
        const { error: staleCleanupError } = await supabase
          .from("webrtc_participants")
          .update({
            disconnected_at: now,
            connection_state: "disconnected",
          })
          .in("id", staleUserParticipantIds);
        if (staleCleanupError) {
          console.warn("Stale user participant cleanup error:", staleCleanupError.message);
        }
      }

      const activeSameRoomSession = freshUserRows.find(
        (participant: { room_id: string }) => participant.room_id === room.id
      );
      if (activeSameRoomSession) {
        return c.json(
          errorResponse("ALREADY_JOINED_THIS_ROOM", "You are already active in this room"),
          409
        );
      }

      const activeOtherRoomSession = freshUserRows.find(
        (participant: { room_id: string }) => participant.room_id !== room.id
      );
      if (activeOtherRoomSession) {
        const { data: activeRoom } = await supabase
          .from("webrtc_rooms")
          .select("id, code, name")
          .eq("id", activeOtherRoomSession.room_id)
          .maybeSingle();

        return c.json(
          errorResponse(
            "ALREADY_IN_ANOTHER_ROOM",
            "Leave your current room before joining another room",
            {
              room_id: activeRoom?.id ?? activeOtherRoomSession.room_id,
              room_code: activeRoom?.code ?? null,
              room_name: activeRoom?.name ?? null,
            }
          ),
          409
        );
      }

      const { data: participantRows, error: existingError } = await supabase
        .from("webrtc_participants")
        .select("*")
        .eq("room_id", room.id)
        .eq("user_id", userId)
        .order("joined_at", { ascending: false })
        .limit(1);

      if (existingError) {
        return c.json(
          errorResponse("JOIN_FAILED", "Failed to inspect existing participant", existingError.message),
          500
        );
      }

      const existingParticipant = participantRows?.[0];
      if (existingParticipant) {
        if (existingParticipant.disconnected_at !== null) {
          const { data: rejoinedParticipant, error: rejoinError } = await supabase
            .from("webrtc_participants")
            .update({
              disconnected_at: null,
              left_at: null,
              connection_state: "connecting",
              last_heartbeat: nowIso(),
            })
            .eq("id", existingParticipant.id)
            .select("*")
            .single();

          if (rejoinError) {
            return c.json(
              errorResponse("JOIN_FAILED", "Failed to reactivate participant", rejoinError.message),
              500
            );
          }

          return c.json(rejoinedParticipant, 200);
        }

        return c.json(
          errorResponse("ALREADY_JOINED_THIS_ROOM", "You are already active in this room"),
          409
        );
      }

      // Check participant count only for genuinely new joins
      const { data: activeParticipants, error: countError } = await supabase
        .from("webrtc_participants")
        .select("id, user_id, last_heartbeat, joined_at")
        .eq("room_id", room.id)
        .is("disconnected_at", null);

      if (countError) {
        console.error("Count error:", countError);
        return c.json(
          errorResponse("COUNT_FAILED", "Failed to check room capacity"),
          500
        );
      }

      const staleParticipantIds: string[] = [];
      const freshParticipants = (activeParticipants ?? []).filter(
        (participant: { id: string; user_id: string; last_heartbeat?: string | null; joined_at?: string | null }) => {
          const heartbeatMs = participant.last_heartbeat ? Date.parse(participant.last_heartbeat) : 0;
          const joinedMs = participant.joined_at ? Date.parse(participant.joined_at) : 0;
          const latestActivityMs = Math.max(heartbeatMs, joinedMs);
          const isFresh = latestActivityMs > nowMs - freshnessWindowMs;
          if (!isFresh) {
            staleParticipantIds.push(participant.id);
          }
          return isFresh;
        }
      );

      if (staleParticipantIds.length > 0) {
        const { error: staleCleanupError } = await supabase
          .from("webrtc_participants")
          .update({
            disconnected_at: now,
            connection_state: "disconnected",
          })
          .in("id", staleParticipantIds);
        if (staleCleanupError) {
          console.warn("Stale participant cleanup error:", staleCleanupError.message);
        }
      }

      const participantCount = new Set(
        freshParticipants.map((participant: { user_id: string }) => participant.user_id)
      ).size;

      if (participantCount && participantCount >= room.max_participants) {
        return c.json(
          errorResponse("ROOM_FULL", "Room is at maximum capacity"),
          429
        );
      }

      const { data: participant, error: joinError } = await supabase
        .from("webrtc_participants")
        .insert({
          room_id: room.id,
          user_id: userId,
          permissions: "member",
          connection_state: "connecting",
        })
        .select()
        .single();

      if (joinError) {
        console.error("Join error:", joinError);

        if (joinError.code === "23505") {
          return c.json(
            errorResponse(
              "ALREADY_IN_ANOTHER_ROOM",
              "You are already active in another room. Leave it before joining this room."
            ),
            409
          );
        }

        // Handle insert races by re-reading existing participant.
        const { data: racedRows } = await supabase
          .from("webrtc_participants")
          .select("*")
          .eq("room_id", room.id)
          .eq("user_id", userId)
          .is("disconnected_at", null)
          .order("joined_at", { ascending: false })
          .limit(1);

        if (racedRows?.[0]) {
          return c.json(racedRows[0], 200);
        }

        return c.json(
          errorResponse("JOIN_FAILED", "Failed to join room", joinError.message),
          500
        );
      }

      return c.json(participant, 201);
    } catch (error: any) {
      console.error("POST /webrtc/rooms/:roomId/join error:", error);
      return c.json(
        errorResponse("INTERNAL_ERROR", "Failed to join room"),
        500
      );
    }
  });

  /** Update participant connection state */
  app.put("/webrtc/participants/:participantId", async (c: Context) => {
    try {
      const { participantId } = c.req.param();
      const updates = await c.req.json();
      const supabase = adminClient();

      // Validate updates
      const allowedFields = [
        "connection_state",
        "signaling_state",
        "ice_connection_state",
        "is_audio_enabled",
        "is_video_enabled",
        "is_screen_sharing",
        "is_muted",
        "reported_connection_quality",
        "last_heartbeat",
      ];

      const filteredUpdates: Record<string, any> = {};
      Object.keys(updates).forEach((key) => {
        if (allowedFields.includes(key)) {
          filteredUpdates[key] = updates[key];
        }
      });

      if (Object.keys(filteredUpdates).length === 0) {
        return c.json(
          errorResponse("NO_UPDATES", "No valid fields to update"),
          400
        );
      }

      const { error } = await supabase
        .from("webrtc_participants")
        .update(filteredUpdates)
        .eq("id", participantId);

      if (error) {
        console.error("Update error:", error);
        return c.json(
          errorResponse("UPDATE_FAILED", "Failed to update participant"),
          500
        );
      }

      return c.json({ success: true, message: "Participant updated" });
    } catch (error: any) {
      console.error("PUT /webrtc/participants/:participantId error:", error);
      return c.json(
        errorResponse("INTERNAL_ERROR", "Failed to update participant"),
        500
      );
    }
  });

  /** Leave a room */
  app.post("/webrtc/rooms/:roomId/leave", async (c: Context) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return c.json(
          errorResponse("MISSING_AUTH", "Authorization required"),
          401
        );
      }

      const { roomId } = c.req.param();
      const supabase = adminClient();

      const userId = extractUserIdFromToken(authHeader);
      if (!userId) {
        return c.json(
          errorResponse("INVALID_TOKEN", "Could not extract user ID from token"),
          401
        );
      }

      const now = nowIso();

      const { data: updatedParticipants, error } = await supabase
        .from("webrtc_participants")
        .update({ disconnected_at: now, connection_state: "disconnected" })
        .eq("room_id", roomId)
        .eq("user_id", userId)
        .is("disconnected_at", null)
        .select("id");

      if (error) {
        console.error("Leave error:", error);
        return c.json(
          errorResponse("LEAVE_FAILED", "Failed to leave room"),
          500
        );
      }

      if (!updatedParticipants || updatedParticipants.length === 0) {
        return c.json(
          errorResponse("PARTICIPANT_NOT_FOUND", "No active participant found for user in this room"),
          404
        );
      }

      return c.json({ success: true, message: "Left room successfully" });
    } catch (error: any) {
      console.error("POST /webrtc/rooms/:roomId/leave error:", error);
      return c.json(
        errorResponse("INTERNAL_ERROR", "Failed to leave room"),
        500
      );
    }
  });

  // ─────────────────────────────────────────────────────────────
  // Signaling (SDP & ICE Candidates)
  // ─────────────────────────────────────────────────────────────

  /** Send WebRTC signaling message */
  app.post("/webrtc/signal", async (c: Context) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return c.json(
          errorResponse("MISSING_AUTH", "Authorization header required"),
          401
        );
      }

      const userId = extractUserIdFromToken(authHeader);
      if (!userId) {
        return c.json(
          errorResponse("INVALID_TOKEN", "Could not extract user ID from token"),
          401
        );
      }

      const body = await c.req.json();
      const roomId =
        typeof body?.roomId === "string" ? body.roomId.trim() : "";
      const requestedFromUserId =
        typeof body?.fromUserId === "string" ? body.fromUserId.trim() : "";
      const fromUserId = requestedFromUserId || userId;
      const toUserId =
        typeof body?.toUserId === "string" ? body.toUserId.trim() : "";
      const signalType =
        typeof body?.signalType === "string" ? body.signalType.trim() : "";
      const payload = body?.payload;

      if (!roomId || !toUserId || !signalType || typeof payload === "undefined") {
        return c.json(
          errorResponse("MISSING_FIELDS", "Missing required signaling fields", {
            roomId: !!roomId,
            fromUserId: !!fromUserId,
            toUserId: !!toUserId,
            signalType: !!signalType,
            payloadPresent: typeof payload !== "undefined",
          }),
          400
        );
      }

      if (fromUserId !== userId) {
        return c.json(
          errorResponse("INVALID_SENDER", "Authenticated user does not match fromUserId"),
          403
        );
      }

      const validSignalTypes = [
        "offer",
        "answer",
        "ice-candidate",
        "renegotiate",
        "reconnect",
      ];
      if (!validSignalTypes.includes(signalType)) {
        return c.json(
          errorResponse(
            "INVALID_SIGNAL_TYPE",
            `Signal type must be one of: ${validSignalTypes.join(", ")}`
          ),
          400
        );
      }

      console.log(`[POST /webrtc/signal] Storing signal: ${fromUserId} -> ${toUserId} (${signalType})`);

      const supabase = adminClient();
      const createdAt = nowIso();
      const { error: insertError } = await supabase
        .from("webrtc_signaling")
        .insert({
          id: genId(),
          room_id: roomId,
          from_user_id: fromUserId,
          to_user_id: toUserId,
          signal_type: signalType,
          payload,
          created_at: createdAt,
          was_processed: false,
        });

      if (insertError) {
        console.error("[POST /webrtc/signal] Insert error:", insertError);
        return c.json(
          errorResponse("SIGNAL_STORE_FAILED", "Failed to store signal", insertError.message),
          500
        );
      }

      return c.json({
        success: true,
        message: "Signal stored",
      }, 201);
    } catch (error: any) {
      console.error(`[POST /webrtc/signal] Error:`, error.message);
      return c.json(
        errorResponse("INTERNAL_ERROR", "Failed to send signal"),
        500
      );
    }
  });

  /** Get pending signaling messages */
  app.get("/webrtc/signal/:toUserId", async (c: Context) => {
    try {
      const { toUserId } = c.req.param();
      const roomId = c.req.query("roomId")?.trim();
      const authHeader = c.req.header("Authorization");

      if (!authHeader?.startsWith("Bearer ")) {
        return c.json(
          errorResponse("MISSING_AUTH", "Authorization header required"),
          401
        );
      }

      const authUserId = extractUserIdFromToken(authHeader);
      if (!authUserId) {
        return c.json(
          errorResponse("INVALID_TOKEN", "Could not extract user ID from token"),
          401
        );
      }

      if (authUserId !== toUserId) {
        return c.json(
          errorResponse("INVALID_RECIPIENT", "Authenticated user does not match requested signal inbox"),
          403
        );
      }

      const supabase = adminClient();

      console.log(`[GET /webrtc/signal] toUserId: ${toUserId}, roomId: ${roomId}`);

      let query = supabase
        .from("webrtc_signaling")
        .select("id, room_id, from_user_id, to_user_id, signal_type, payload, created_at")
        .eq("to_user_id", toUserId)
        .eq("was_processed", false)
        .order("created_at", { ascending: true })
        .limit(100);

      if (roomId) {
        query = query.eq("room_id", roomId);
      }

      const { data: signals, error: fetchError } = await query;
      if (fetchError) {
        console.error("[GET /webrtc/signal] Fetch error:", fetchError);
        return c.json([], 200);
      }

      console.log(`[GET /webrtc/signal] Returning ${signals?.length ?? 0} signals`);

      if (signals && signals.length > 0) {
        const signalIds = signals.map((signal: StoredSignal) => signal.id);
        const { error: updateError } = await supabase
          .from("webrtc_signaling")
          .update({
            was_processed: true,
            processed_at: nowIso(),
          })
          .in("id", signalIds);

        if (updateError) {
          console.error("[GET /webrtc/signal] Failed to mark signals processed:", updateError);
        }
      }

      return c.json(signals ?? [], 200);
    } catch (error: any) {
      console.error(`[GET /webrtc/signal] Error: ${error.message}`);
      return c.json([], 200);
    }
  });

  /** Get all active users in a room for peer discovery */
  app.get("/webrtc/room/:roomId/users", async (c: Context) => {
    try {
      const { roomId } = c.req.param();
      console.log("[GET /webrtc/room/users] roomId:", roomId);
      
      // For MVP: Return a hardcoded list of users who have recently accessed this room
      // In production, this would query the database for active participants
      // For now, we'll return empty array and let clients discover each other via polling
      
      return c.json({
        roomId,
        users: [],
        timestamp: nowIso(),
      }, 200);
    } catch (error: any) {
      console.error("[GET /webrtc/room/users] Error:", error.message);
      return c.json({ error: error.message }, 500);
    }
  });

  /** Announce user's presence in a room */
  app.post("/webrtc/room/:roomId/join", async (c: Context) => {
    try {
      const { roomId } = c.req.param();
      const authHeader = c.req.header("Authorization");

      if (!authHeader?.startsWith("Bearer ")) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const userId = extractUserIdFromToken(authHeader);
      if (!userId) {
        return c.json({ error: "Invalid token" }, 401);
      }

      console.log(`[POST /webrtc/room/join] User ${userId} joining room ${roomId}`);

      // For MVP: Just acknowledge the join
      // In production, store in a room_members table with expiry
      return c.json({
        success: true,
        roomId,
        userId,
        timestamp: nowIso(),
      }, 200);
    } catch (error: any) {
      console.error("[POST /webrtc/room/join] Error:", error.message);
      return c.json({ error: error.message }, 500);
    }
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Room-Specific Notes (private per user in room)
  // ─────────────────────────────────────────────────────────────────────────────
  app.get("/webrtc/rooms/:roomId/notes/me", async (c: Context) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return c.json(
          errorResponse("MISSING_AUTH", "Authorization required"),
          401
        );
      }

      const userId = extractUserIdFromToken(authHeader);
      if (!userId) {
        return c.json(
          errorResponse("INVALID_TOKEN", "Could not extract user ID from token"),
          401
        );
      }

      const { roomId } = c.req.param();
      const supabase = adminClient();

      const { data: roomMatch, error: roomMatchError } = await resolveRoomRecord(
        supabase,
        roomId
      );
      if (roomMatchError || !roomMatch?.id) {
        return c.json(
          errorResponse("ROOM_NOT_FOUND", "Room does not exist"),
          404
        );
      }

      const membership = await ensureActiveRoomParticipant(
        supabase,
        roomMatch.id,
        userId
      );
      if (membership.error) {
        return c.json(
          errorResponse("ACCESS_CHECK_FAILED", "Failed to verify room access", membership.error.message),
          500
        );
      }
      if (!membership.ok) {
        return c.json(
          errorResponse("ROOM_ACCESS_DENIED", "Join the room before accessing notes"),
          403
        );
      }

      const { data: note, error: fetchError } = await supabase
        .from("webrtc_room_notes")
        .select("id, room_id, user_id, content, created_at, updated_at")
        .eq("room_id", roomMatch.id)
        .eq("user_id", userId)
        .maybeSingle();

      if (fetchError) {
        return c.json(
          errorResponse("NOTES_FETCH_FAILED", "Failed to fetch notes", fetchError.message),
          500
        );
      }

      return c.json(
        note ?? {
          id: null,
          room_id: roomMatch.id,
          user_id: userId,
          content: "",
          created_at: null,
          updated_at: null,
        },
        200
      );
    } catch (error: any) {
      console.error("GET /webrtc/rooms/:roomId/notes/me error:", error);
      return c.json(
        errorResponse("INTERNAL_ERROR", "Failed to fetch room note"),
        500
      );
    }
  });

  app.put("/webrtc/rooms/:roomId/notes/me", async (c: Context) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return c.json(
          errorResponse("MISSING_AUTH", "Authorization required"),
          401
        );
      }

      const userId = extractUserIdFromToken(authHeader);
      if (!userId) {
        return c.json(
          errorResponse("INVALID_TOKEN", "Could not extract user ID from token"),
          401
        );
      }

      const { roomId } = c.req.param();
      const body = await c.req.json();
      const content = typeof body?.content === "string" ? body.content : "";

      if (content.length > 20000) {
        return c.json(
          errorResponse("NOTE_TOO_LONG", "Notes are limited to 20000 characters"),
          400
        );
      }

      const supabase = adminClient();
      const { data: roomMatch, error: roomMatchError } = await resolveRoomRecord(
        supabase,
        roomId
      );
      if (roomMatchError || !roomMatch?.id) {
        return c.json(
          errorResponse("ROOM_NOT_FOUND", "Room does not exist"),
          404
        );
      }

      const membership = await ensureActiveRoomParticipant(
        supabase,
        roomMatch.id,
        userId
      );
      if (membership.error) {
        return c.json(
          errorResponse("ACCESS_CHECK_FAILED", "Failed to verify room access", membership.error.message),
          500
        );
      }
      if (!membership.ok) {
        return c.json(
          errorResponse("ROOM_ACCESS_DENIED", "Join the room before updating notes"),
          403
        );
      }

      const timestamp = nowIso();
      const { data: savedNote, error: saveError } = await supabase
        .from("webrtc_room_notes")
        .upsert(
          {
            room_id: roomMatch.id,
            user_id: userId,
            content,
            updated_at: timestamp,
          },
          { onConflict: "room_id,user_id" }
        )
        .select("id, room_id, user_id, content, created_at, updated_at")
        .single();

      if (saveError) {
        return c.json(
          errorResponse("NOTES_SAVE_FAILED", "Failed to save note", saveError.message),
          500
        );
      }

      return c.json(savedNote, 200);
    } catch (error: any) {
      console.error("PUT /webrtc/rooms/:roomId/notes/me error:", error);
      return c.json(
        errorResponse("INTERNAL_ERROR", "Failed to save room note"),
        500
      );
    }
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Room-Specific Chat
  // ─────────────────────────────────────────────────────────────────────────────
  app.get("/webrtc/rooms/:roomId/notes", async (c: Context) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return c.json(
          errorResponse("MISSING_AUTH", "Authorization required"),
          401
        );
      }

      const userId = extractUserIdFromToken(authHeader);
      if (!userId) {
        return c.json(
          errorResponse("INVALID_TOKEN", "Could not extract user ID from token"),
          401
        );
      }

      const { roomId } = c.req.param();
      const supabase = adminClient();

      const { data: roomMatch, error: roomMatchError } = await resolveRoomRecord(
        supabase,
        roomId
      );
      if (roomMatchError || !roomMatch?.id) {
        return c.json(
          errorResponse("ROOM_NOT_FOUND", "Room does not exist"),
          404
        );
      }

      const membership = await ensureActiveRoomParticipant(
        supabase,
        roomMatch.id,
        userId
      );
      if (membership.error) {
        return c.json(
          errorResponse("ACCESS_CHECK_FAILED", "Failed to verify room access", membership.error.message),
          500
        );
      }
      if (!membership.ok) {
        return c.json(
          errorResponse("ROOM_ACCESS_DENIED", "Join the room before accessing notes"),
          403
        );
      }

      const { data: notes, error: fetchError } = await supabase
        .from("webrtc_room_note_entries")
        .select("id, room_id, user_id, heading, body, created_at, updated_at")
        .eq("room_id", roomMatch.id)
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(200);

      if (fetchError) {
        return c.json(
          errorResponse("NOTES_FETCH_FAILED", "Failed to fetch notes", fetchError.message),
          500
        );
      }

      return c.json(notes ?? [], 200);
    } catch (error: any) {
      console.error("GET /webrtc/rooms/:roomId/notes error:", error);
      return c.json(
        errorResponse("INTERNAL_ERROR", "Failed to fetch room notes"),
        500
      );
    }
  });

  app.post("/webrtc/rooms/:roomId/notes", async (c: Context) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return c.json(
          errorResponse("MISSING_AUTH", "Authorization required"),
          401
        );
      }

      const userId = extractUserIdFromToken(authHeader);
      if (!userId) {
        return c.json(
          errorResponse("INVALID_TOKEN", "Could not extract user ID from token"),
          401
        );
      }

      const { roomId } = c.req.param();
      const body = await c.req.json();
      const heading =
        typeof body?.heading === "string" && body.heading.trim().length > 0
          ? body.heading.trim()
          : "Untitled note";
      const noteBody = typeof body?.body === "string" ? body.body : "";

      if (heading.length > 160) {
        return c.json(
          errorResponse("NOTE_HEADING_TOO_LONG", "Heading is limited to 160 characters"),
          400
        );
      }
      if (noteBody.length > 20000) {
        return c.json(
          errorResponse("NOTE_BODY_TOO_LONG", "Body is limited to 20000 characters"),
          400
        );
      }

      const supabase = adminClient();
      const { data: roomMatch, error: roomMatchError } = await resolveRoomRecord(
        supabase,
        roomId
      );
      if (roomMatchError || !roomMatch?.id) {
        return c.json(
          errorResponse("ROOM_NOT_FOUND", "Room does not exist"),
          404
        );
      }

      const membership = await ensureActiveRoomParticipant(
        supabase,
        roomMatch.id,
        userId
      );
      if (membership.error) {
        return c.json(
          errorResponse("ACCESS_CHECK_FAILED", "Failed to verify room access", membership.error.message),
          500
        );
      }
      if (!membership.ok) {
        return c.json(
          errorResponse("ROOM_ACCESS_DENIED", "Join the room before creating notes"),
          403
        );
      }

      const timestamp = nowIso();
      const { data: createdNote, error: createError } = await supabase
        .from("webrtc_room_note_entries")
        .insert({
          id: genId(),
          room_id: roomMatch.id,
          user_id: userId,
          heading,
          body: noteBody,
          created_at: timestamp,
          updated_at: timestamp,
        })
        .select("id, room_id, user_id, heading, body, created_at, updated_at")
        .single();

      if (createError) {
        return c.json(
          errorResponse("NOTES_CREATE_FAILED", "Failed to create note", createError.message),
          500
        );
      }

      return c.json(createdNote, 201);
    } catch (error: any) {
      console.error("POST /webrtc/rooms/:roomId/notes error:", error);
      return c.json(
        errorResponse("INTERNAL_ERROR", "Failed to create room note"),
        500
      );
    }
  });

  app.put("/webrtc/rooms/:roomId/notes/:noteId", async (c: Context) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return c.json(
          errorResponse("MISSING_AUTH", "Authorization required"),
          401
        );
      }

      const userId = extractUserIdFromToken(authHeader);
      if (!userId) {
        return c.json(
          errorResponse("INVALID_TOKEN", "Could not extract user ID from token"),
          401
        );
      }

      const { roomId, noteId } = c.req.param();
      const body = await c.req.json();
      const heading =
        typeof body?.heading === "string" && body.heading.trim().length > 0
          ? body.heading.trim()
          : "Untitled note";
      const noteBody = typeof body?.body === "string" ? body.body : "";

      if (heading.length > 160) {
        return c.json(
          errorResponse("NOTE_HEADING_TOO_LONG", "Heading is limited to 160 characters"),
          400
        );
      }
      if (noteBody.length > 20000) {
        return c.json(
          errorResponse("NOTE_BODY_TOO_LONG", "Body is limited to 20000 characters"),
          400
        );
      }

      const supabase = adminClient();
      const { data: roomMatch, error: roomMatchError } = await resolveRoomRecord(
        supabase,
        roomId
      );
      if (roomMatchError || !roomMatch?.id) {
        return c.json(
          errorResponse("ROOM_NOT_FOUND", "Room does not exist"),
          404
        );
      }

      const membership = await ensureActiveRoomParticipant(
        supabase,
        roomMatch.id,
        userId
      );
      if (membership.error) {
        return c.json(
          errorResponse("ACCESS_CHECK_FAILED", "Failed to verify room access", membership.error.message),
          500
        );
      }
      if (!membership.ok) {
        return c.json(
          errorResponse("ROOM_ACCESS_DENIED", "Join the room before updating notes"),
          403
        );
      }

      const timestamp = nowIso();
      const { data: updatedNote, error: updateError } = await supabase
        .from("webrtc_room_note_entries")
        .update({
          heading,
          body: noteBody,
          updated_at: timestamp,
        })
        .eq("id", noteId)
        .eq("room_id", roomMatch.id)
        .eq("user_id", userId)
        .select("id, room_id, user_id, heading, body, created_at, updated_at")
        .maybeSingle();

      if (updateError) {
        return c.json(
          errorResponse("NOTES_UPDATE_FAILED", "Failed to update note", updateError.message),
          500
        );
      }
      if (!updatedNote) {
        return c.json(
          errorResponse("NOTE_NOT_FOUND", "Note not found"),
          404
        );
      }

      return c.json(updatedNote, 200);
    } catch (error: any) {
      console.error("PUT /webrtc/rooms/:roomId/notes/:noteId error:", error);
      return c.json(
        errorResponse("INTERNAL_ERROR", "Failed to update room note"),
        500
      );
    }
  });

  app.delete("/webrtc/rooms/:roomId/notes/:noteId", async (c: Context) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return c.json(
          errorResponse("MISSING_AUTH", "Authorization required"),
          401
        );
      }

      const userId = extractUserIdFromToken(authHeader);
      if (!userId) {
        return c.json(
          errorResponse("INVALID_TOKEN", "Could not extract user ID from token"),
          401
        );
      }

      const { roomId, noteId } = c.req.param();
      const supabase = adminClient();

      const { data: roomMatch, error: roomMatchError } = await resolveRoomRecord(
        supabase,
        roomId
      );
      if (roomMatchError || !roomMatch?.id) {
        return c.json(
          errorResponse("ROOM_NOT_FOUND", "Room does not exist"),
          404
        );
      }

      const membership = await ensureActiveRoomParticipant(
        supabase,
        roomMatch.id,
        userId
      );
      if (membership.error) {
        return c.json(
          errorResponse("ACCESS_CHECK_FAILED", "Failed to verify room access", membership.error.message),
          500
        );
      }
      if (!membership.ok) {
        return c.json(
          errorResponse("ROOM_ACCESS_DENIED", "Join the room before deleting notes"),
          403
        );
      }

      const { data: deletedRows, error: deleteError } = await supabase
        .from("webrtc_room_note_entries")
        .delete()
        .eq("id", noteId)
        .eq("room_id", roomMatch.id)
        .eq("user_id", userId)
        .select("id");

      if (deleteError) {
        return c.json(
          errorResponse("NOTES_DELETE_FAILED", "Failed to delete note", deleteError.message),
          500
        );
      }
      if (!deletedRows || deletedRows.length === 0) {
        return c.json(
          errorResponse("NOTE_NOT_FOUND", "Note not found"),
          404
        );
      }

      return c.json({ success: true, deleted_note_id: noteId }, 200);
    } catch (error: any) {
      console.error("DELETE /webrtc/rooms/:roomId/notes/:noteId error:", error);
      return c.json(
        errorResponse("INTERNAL_ERROR", "Failed to delete room note"),
        500
      );
    }
  });

  app.get("/webrtc/rooms/:roomId/chat", async (c: Context) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return c.json(
          errorResponse("MISSING_AUTH", "Authorization required"),
          401
        );
      }

      const userId = extractUserIdFromToken(authHeader);
      if (!userId) {
        return c.json(
          errorResponse("INVALID_TOKEN", "Could not extract user ID from token"),
          401
        );
      }

      const { roomId } = c.req.param();
      const requestedLimit = Number.parseInt(c.req.query("limit") ?? "50", 10);
      const limit = Number.isFinite(requestedLimit)
        ? Math.max(1, Math.min(requestedLimit, 200))
        : 50;

      const supabase = adminClient();
      const { data: roomMatch, error: roomMatchError } = await resolveRoomRecord(
        supabase,
        roomId
      );
      if (roomMatchError || !roomMatch?.id) {
        return c.json(
          errorResponse("ROOM_NOT_FOUND", "Room does not exist"),
          404
        );
      }

      const membership = await ensureActiveRoomParticipant(
        supabase,
        roomMatch.id,
        userId
      );
      if (membership.error) {
        return c.json(
          errorResponse("ACCESS_CHECK_FAILED", "Failed to verify room access", membership.error.message),
          500
        );
      }
      if (!membership.ok) {
        return c.json(
          errorResponse("ROOM_ACCESS_DENIED", "Join the room before reading chat"),
          403
        );
      }

      const { data: rows, error: chatError } = await supabase
        .from("webrtc_room_messages")
        .select("id, room_id, sender_user_id, message, created_at")
        .eq("room_id", roomMatch.id)
        .order("created_at", { ascending: true })
        .limit(limit);

      if (chatError) {
        return c.json(
          errorResponse("CHAT_FETCH_FAILED", "Failed to load room chat", chatError.message),
          500
        );
      }

      const senderIds = Array.from(
        new Set((rows ?? []).map((row: { sender_user_id: string }) => row.sender_user_id))
      );

      let senderMap = new Map<string, { id: string; name: string; avatar_url: string | null }>();
      if (senderIds.length > 0) {
        const { data: senders, error: sendersError } = await supabase
          .from("users")
          .select("id, name, avatar_url")
          .in("id", senderIds);

        if (!sendersError && senders) {
          senderMap = new Map(
            senders.map((sender: { id: string; name?: string; avatar_url?: string | null }) => [
              sender.id,
              {
                id: sender.id,
                name: sender.name || "Participant",
                avatar_url: sender.avatar_url ?? null,
              },
            ])
          );
        }
      }

      const messages = (rows ?? []).map((row: any) => ({
        ...row,
        sender: senderMap.get(row.sender_user_id) ?? {
          id: row.sender_user_id,
          name: "Participant",
          avatar_url: null,
        },
      }));

      return c.json(messages, 200);
    } catch (error: any) {
      console.error("GET /webrtc/rooms/:roomId/chat error:", error);
      return c.json(
        errorResponse("INTERNAL_ERROR", "Failed to fetch room chat"),
        500
      );
    }
  });

  app.post("/webrtc/rooms/:roomId/chat", async (c: Context) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return c.json(
          errorResponse("MISSING_AUTH", "Authorization required"),
          401
        );
      }

      const userId = extractUserIdFromToken(authHeader);
      if (!userId) {
        return c.json(
          errorResponse("INVALID_TOKEN", "Could not extract user ID from token"),
          401
        );
      }

      const { roomId } = c.req.param();
      const body = await c.req.json();
      const message = typeof body?.message === "string" ? body.message.trim() : "";

      if (!message) {
        return c.json(
          errorResponse("EMPTY_MESSAGE", "Message cannot be empty"),
          400
        );
      }
      if (message.length > 2000) {
        return c.json(
          errorResponse("MESSAGE_TOO_LONG", "Message is limited to 2000 characters"),
          400
        );
      }

      const supabase = adminClient();
      const { data: roomMatch, error: roomMatchError } = await resolveRoomRecord(
        supabase,
        roomId
      );
      if (roomMatchError || !roomMatch?.id) {
        return c.json(
          errorResponse("ROOM_NOT_FOUND", "Room does not exist"),
          404
        );
      }

      const membership = await ensureActiveRoomParticipant(
        supabase,
        roomMatch.id,
        userId
      );
      if (membership.error) {
        return c.json(
          errorResponse("ACCESS_CHECK_FAILED", "Failed to verify room access", membership.error.message),
          500
        );
      }
      if (!membership.ok) {
        return c.json(
          errorResponse("ROOM_ACCESS_DENIED", "Join the room before sending chat messages"),
          403
        );
      }

      const { data: inserted, error: insertError } = await supabase
        .from("webrtc_room_messages")
        .insert({
          id: genId(),
          room_id: roomMatch.id,
          sender_user_id: userId,
          message,
          created_at: nowIso(),
        })
        .select("id, room_id, sender_user_id, message, created_at")
        .single();

      if (insertError) {
        return c.json(
          errorResponse("CHAT_SEND_FAILED", "Failed to send message", insertError.message),
          500
        );
      }

      const { data: senderInfo } = await supabase
        .from("users")
        .select("id, name, avatar_url")
        .eq("id", userId)
        .maybeSingle();

      return c.json(
        {
          ...inserted,
          sender: senderInfo
            ? {
                id: senderInfo.id,
                name: senderInfo.name || "Participant",
                avatar_url: senderInfo.avatar_url ?? null,
              }
            : {
                id: userId,
                name: "Participant",
                avatar_url: null,
              },
        },
        201
      );
    } catch (error: any) {
      console.error("POST /webrtc/rooms/:roomId/chat error:", error);
      return c.json(
        errorResponse("INTERNAL_ERROR", "Failed to send room chat message"),
        500
      );
    }
  });
}
