// Supabase Edge Function: cleanup-inactive-rooms
// Deploy to Supabase Functions and schedule with Cron

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    console.log("Starting room cleanup job...");

    // Call the cleanup function
    const { data, error } = await supabase.rpc("cleanup_inactive_rooms");

    if (error) {
      console.error("Cleanup error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`Deleted ${data} inactive rooms`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        deleted_rooms: data,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
