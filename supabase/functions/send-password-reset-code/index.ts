// @ts-nocheck
// deno-lint-ignore-file no-explicit-any
/// <reference lib="deno.window" />
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

declare const Deno: any;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") || "";

interface RequestBody {
  email: string;
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendCodeViaBrevo(email: string, code: string): Promise<void> {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "Lernova",
        email: "solaeraab@gmail.com",
      },
      to: [{ email }],
      subject: "Reset Your Password - Lernova",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Use this code to reset your password:</p>
          <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center;">
            <h1 style="letter-spacing: 4px; color: #003566;">${code}</h1>
          </div>
          <p>This code expires in <strong>15 minutes</strong>.</p>
          <p>If you didn't request a password reset, ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo API error: ${response.status} - ${error}`);
  }
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

    const body: RequestBody = await req.json();
    const { email } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate reset code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store reset code in database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if email exists
    const { data: user } = await supabase
      .from("users")
      .select("id, name")
      .eq("email", email)
      .maybeSingle();

    if (!user) {
      // Don't reveal if email exists
      return new Response(
        JSON.stringify({
          success: true,
          message: "If this email exists, a reset code will be sent",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Store reset code token
    const { error: insertError } = await supabase.from("otp_tokens").insert([
      {
        email,
        otp_code: code,
        type: "password_reset",
        expires_at: expiresAt.toISOString(),
      },
    ]);

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Send code via Brevo
    await sendCodeViaBrevo(email, code);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Reset code sent to your email",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
