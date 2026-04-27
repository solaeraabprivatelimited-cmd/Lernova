import { API_URL, getSupabaseClient } from '../../app/lib/api';

export interface TwoFAConfig {
  isEnabled: boolean;
  email: string;
}

/**
 * Generate cryptographically strong OTP using Web Crypto API.
 */
export function generateOTP(length: number = 8): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += String(array[i] % 10);
  }
  return otp;
}

export interface SendOTPResult {
  success: boolean;
  expiresInSeconds: number;
  message?: string;
  error?: string;
}

export async function sendOTP(email: string, userID: string): Promise<SendOTPResult> {
  try {
    const otp = generateOTP();
    const expirationMinutes = 10;

    const response = await fetch(`${API_URL}/auth/send-2fa-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        userId: userID,
        otp,
        expirationMinutes,
      }),
    });

    if (!response.ok) {
      console.error('[2FA] OTP send failed with status:', response.status);
      throw new Error('Unable to send OTP. Please try again.');
    }

    const data = await response.json();
    return {
      success: true,
      expiresInSeconds: data.expiresInSeconds || expirationMinutes * 60,
      message: data.message,
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('[2FA] Send OTP error:', error);
    return { success: false, expiresInSeconds: 0, error };
  }
}

/**
 * Verify an OTP code for a given user.
 * Table: user_2fa_otps — columns: profile_id, otp_hash, expires_at, used
 * Verification is delegated to the API backend which holds the hash algorithm.
 */
export async function verifyOTP(userId: string, otpCode: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/verify-2fa-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, otp: otpCode }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return { success: false, error: body?.error || 'Invalid or expired OTP' };
    }

    return { success: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('[2FA] Verify OTP error:', error);
    return { success: false, error };
  }
}

/**
 * Enable 2FA for the current user.
 * Table: user_2fa_settings — columns: profile_id, enabled, method
 */
export async function enable2FA(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase
      .from('user_2fa_settings')
      .upsert(
        { profile_id: user.id, enabled: true, method: 'email' },
        { onConflict: 'profile_id' }
      );

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('[2FA] Enable error:', error);
    return { success: false, error };
  }
}

/**
 * Disable 2FA for the current user.
 * Table: user_2fa_settings — columns: profile_id, enabled
 */
export async function disable2FA(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase
      .from('user_2fa_settings')
      .update({ enabled: false })
      .eq('profile_id', user.id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('[2FA] Disable error:', error);
    return { success: false, error };
  }
}

/**
 * Get 2FA settings for the current user.
 * Table: user_2fa_settings — columns: profile_id, enabled
 * Email is sourced from the auth user, not the table.
 */
export async function get2FASettings(): Promise<TwoFAConfig | null> {
  try {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from('user_2fa_settings')
      .select('enabled')
      .eq('profile_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('[2FA] Get settings error:', error.message);
      return null;
    }

    return {
      isEnabled: data?.enabled ?? false,
      email: user.email ?? '',
    };
  } catch {
    return null;
  }
}
