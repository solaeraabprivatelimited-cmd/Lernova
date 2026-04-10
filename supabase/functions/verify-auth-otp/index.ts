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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { email, otp, password } = await req.json();

    if (!email || !otp || !password) {
      return new Response(JSON.stringify({ error: "Email, OTP, and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase
      .from("otp_tokens")
      .select("*")
      .eq("email", email)
      .eq("otp_code", otp)
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (error || !data) {
      return new Response(JSON.stringify({ error: "Invalid or expired OTP" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const now = new Date();
    const expiresAt = new Date(data.expires_at);

    if (now > expiresAt) {
      return new Response(JSON.stringify({ error: "OTP has expired" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // OTP is valid, delete it
    await supabase.from("otp_tokens").delete().eq("id", data.id);

    // Create user
    const { name, role } = data.user_data;
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role },
    });

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify(authData), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
