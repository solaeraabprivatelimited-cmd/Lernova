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
  name: string;
  role: "student" | "mentor";
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpViaBrevo(email: string, otp: string, name: string): Promise<void> {
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
      to: [{ email, name }],
      subject: "Verify Your Email - Lernova",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Welcome to Lernova, ${name}!</h2>
          <p>Use this code to verify your email:</p>
          <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center;">
            <h1 style="letter-spacing: 4px; color: #003566;">${otp}</h1>
          </div>
          <p>This code expires in <strong>10 minutes</strong>.</p>
          <p>If you didn't sign up, ignore this email.</p>
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
    const { email, name, role } = body;

    if (!email || !name || !role) {
      return new Response(
        JSON.stringify({ error: "Missing email, name, or role" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if email already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ error: "Email already registered" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Store OTP token
    const { error: insertError } = await supabase.from("otp_tokens").insert([
      {
        email,
        otp_code: otp,
        type: "signup",
        user_data: { name, role },
        expires_at: expiresAt.toISOString(),
      },
    ]);

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Send OTP via Brevo
    await sendOtpViaBrevo(email, otp, name);

    return new Response(
      JSON.stringify({
        success: true,
        message: "OTP sent to your email",
        email,
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
