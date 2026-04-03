// @ts-nocheck
// deno-lint-ignore-file no-explicit-any
/// <reference lib="deno.window" />
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

declare const Deno: any;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface SignupVerifyBody {
  email: string;
  otp: string;
  password: string;
  type: "signup" | "password_reset";
  newPassword?: string;
}

serve(async (req: Request) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body: SignupVerifyBody = await req.json();
    const { email, otp, password, type, newPassword } = body;

    if (!email || !otp || !type) {
      return new Response(
        JSON.stringify({ error: "Missing email, otp, or type" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find and verify OTP
    const { data: otpRecord, error: otpError } = await supabase
      .from("otp_tokens")
      .select("*")
      .eq("email", email)
      .eq("otp_code", otp)
      .eq("type", type)
      .maybeSingle();

    if (otpError || !otpRecord) {
      return new Response(JSON.stringify({ error: "Invalid or expired OTP" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if OTP is expired
    if (new Date(otpRecord.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "OTP has expired" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Mark OTP as verified
    await supabase
      .from("otp_tokens")
      .update({ verified_at: new Date().toISOString() })
      .eq("id", otpRecord.id);

    if (type === "signup") {
      if (!password) {
        return new Response(JSON.stringify({ error: "Password is required for signup" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const userData = otpRecord.user_data || {};
      const name = userData.name || "User";
      const role = userData.role || "student";

      // Create user in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { name, role },
        email_confirm: true,
      });

      if (authError) {
        return new Response(
          JSON.stringify({ error: authError.message || "Failed to create account" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Create user profile in database
      const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

      const { error: profileError } = await supabase.from("users").insert([
        {
          id: authUser.user!.id,
          email,
          name,
          role,
          avatar_url: avatarUrl,
        },
      ]);

      if (profileError) {
        return new Response(
          JSON.stringify({ error: profileError.message || "Failed to create profile" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      // Create session
      const { data: session, error: sessionError } = await supabase.auth.admin.createSession(
        authUser.user!.id
      );

      if (sessionError) {
        return new Response(
          JSON.stringify({ error: "Failed to create session" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Account created successfully",
          user: authUser.user,
          session: session.session,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else if (type === "password_reset") {
      if (!newPassword) {
        return new Response(JSON.stringify({ error: "New password is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Get user by email
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (userError || !user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Update password in Supabase Auth
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        password: newPassword,
      });

      if (updateError) {
        return new Response(
          JSON.stringify({ error: updateError.message || "Failed to update password" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Password reset successfully",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
