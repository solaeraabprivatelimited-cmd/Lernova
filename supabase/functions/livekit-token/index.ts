import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Max-Age": "86400",
};

// Get LiveKit credentials from environment at startup
const LIVEKIT_URL = Deno.env.get("LIVEKIT_URL") || "wss://lernova-eu1uw0m2.livekit.cloud";
const LIVEKIT_API_KEY = Deno.env.get("LIVEKIT_API_KEY");
const LIVEKIT_API_SECRET = Deno.env.get("LIVEKIT_API_SECRET");

console.log("🔵 LiveKit Token Function initialized");
console.log("LIVEKIT_URL:", LIVEKIT_URL);
console.log("Has API Key:", !!LIVEKIT_API_KEY);
console.log("Has API Secret:", !!LIVEKIT_API_SECRET);

serve(async (req) => {
  // Handle CORS preflight FIRST, before any other processing
  if (req.method === "OPTIONS") {
    console.log("✅ Handling CORS preflight request");
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { 
          status: 405, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders,
          } 
        }
      );
    }

    // Parse request body
    let roomId, userId, userName;
    try {
      const body = await req.json();
      roomId = body.roomId;
      userId = body.userId;
      userName = body.userName;
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders,
          } 
        }
      );
    }

    // Validate required fields
    if (!roomId || !userId || !userName) {
      console.error("Missing required fields:", { roomId: !!roomId, userId: !!userId, userName: !!userName });
      return new Response(
        JSON.stringify({ error: "Missing required fields: roomId, userId, userName" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders,
          } 
        }
      );
    }

    console.log("🔵 Generating token for room:", roomId, "user:", userId);

    // Validate LiveKit credentials
    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      console.error("Missing LiveKit credentials");
      return new Response(
        JSON.stringify({ error: "Server misconfigured: missing LiveKit credentials" }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders,
          } 
        }
      );
    }

    // Create JWT token with proper LiveKit grants
    const header = {
      alg: "HS256",
      typ: "JWT",
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      sub: userId,
      iss: "livekit",
      nbf: now,
      exp: now + 3600, // 1 hour expiration
      grants: {
        canPublish: true,
        canPublishData: true,
        canSubscribe: true,
        room: roomId,
        roomJoin: true,
        canPubSubAdmin: false,
      },
      name: userName,
      metadata: JSON.stringify({
        userId,
        roomId,
      }),
    };

    console.log("🔵 Token payload:", { roomId, userId, exp: payload.exp });

    // Manually create JWT (Deno Web Crypto API)
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const message = `${encodedHeader}.${encodedPayload}`;

    // Sign with HMAC-SHA256
    const encoder = new TextEncoder();
    const keyData = encoder.encode(LIVEKIT_API_SECRET);
    const messageData = encoder.encode(message);

    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", key, messageData);
    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));

    const token = `${message}.${encodedSignature}`;

    console.log("✅ Token generated successfully");

    return new Response(
      JSON.stringify({
        token,
        url: LIVEKIT_URL,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("❌ Token generation error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
