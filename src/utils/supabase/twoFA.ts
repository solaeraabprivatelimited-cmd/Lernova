import { API_URL, getSupabaseClient } from '../../app/lib/api';

export interface TwoFAConfig {
  isEnabled: boolean;
  email: string;
}

/**
 * ✅ SECURE: Generate cryptographically strong OTP
 * Uses Web Crypto API for random number generation
 * New length: 8 digits instead of 6 (more secure)
 * @param length Number of digits in OTP (default: 8)
 * @returns Cryptographically secure OTP digit string
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
      // ✅ SECURE: Don't expose internal error details in user-facing messages
      const errorBody = await response.json().catch(() => ({}));
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
    return {
      success: false,
      expiresInSeconds: 0,
      error,
    };
  }
}

export async function verifyOTP(userId: string, otpCode: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();

  try {
    const { data: otpRecord, error: fetchError } = await supabase
      .from('user_2fa_otps')
      .select('*')
      .eq('user_id', userId)
      .eq('otp_code', otpCode)
      .is('verified_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpRecord) {
      const { data: latestOtp, error: latestOtpError } = await supabase
        .from('user_2fa_otps')
        .select('id, attempts')
        .eq('user_id', userId)
        .is('verified_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (latestOtp && !latestOtpError) {
        await supabase
          .from('user_2fa_otps')
          .update({ attempts: (latestOtp.attempts || 0) + 1 })
          .eq('id', latestOtp.id);
      }
      return { success: false, error: 'Invalid or expired OTP' };
    }

    if (otpRecord.attempts >= 5) {
      return { success: false, error: 'Too many attempts. Please request a new OTP.' };
    }

    const { error: updateError } = await supabase
      .from('user_2fa_otps')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', otpRecord.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('[2FA] Verify OTP error:', error);
    return { success: false, error };
  }
}

export async function enable2FA(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('user_2fa_settings')
      .upsert({
        user_id: user.id,
        is_enabled: true,
        email,
      }, { onConflict: 'user_id' });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('[2FA] Enable error:', error);
    return { success: false, error };
  }
}

export async function disable2FA(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('user_2fa_settings')
      .update({ is_enabled: false })
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('[2FA] Disable error:', error);
    return { success: false, error };
  }
}

export async function get2FASettings(): Promise<TwoFAConfig | null> {
  try {
    const supabase = getSupabaseClient();
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) return null;

    const { data } = await supabase
      .from('user_2fa_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!data) return null;

    return {
      isEnabled: data.is_enabled,
      email: data.email,
    };
  } catch {
    return null;
  }
}
