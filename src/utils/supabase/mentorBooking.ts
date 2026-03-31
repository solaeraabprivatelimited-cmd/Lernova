/**
 * Mentor Booking API
 */

import { getSupabaseClient } from '../../app/lib/api';
import { toast } from 'sonner';

export interface MentorBookingData {
  availability_session_id?: string;
  availability_session_duration_mins?: number;
  mentor_id?: string;
  mentor_name: string;
  mentor_subject: string;
  selected_date_time: string;
  duration: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  payment_method: 'UPI' | 'Bank';
  payment_app?: string;
  upi_id?: string;
  bank_account_holder?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_ifsc_code?: string;
  booking_price?: number;
}

/**
 * Save a mentor booking to the database
 */
export async function saveMentorBooking(
  studentId: string,
  bookingData: MentorBookingData
): Promise<{ success: boolean; bookingId?: string; error?: string }> {
  try {
    const supabase = getSupabaseClient();

    if (bookingData.availability_session_id) {
      const bookedDurationMins = Math.max(
        60,
        bookingData.availability_session_duration_mins || 60,
      );

      const { data: bookedRow, error: bookingRpcError } = await supabase.rpc(
        'book_mentor_availability_slot',
        {
          p_session_id: bookingData.availability_session_id,
          p_duration_mins: bookedDurationMins,
          p_payment_method: bookingData.payment_method,
          p_booking_price: bookingData.booking_price || 500.0,
          p_mentor_subject: bookingData.mentor_subject,
          p_payment_app: bookingData.payment_app || null,
          p_upi_id: bookingData.upi_id || null,
          p_bank_account_holder: bookingData.bank_account_holder || null,
          p_bank_name: bookingData.bank_name || null,
          p_bank_account_number: bookingData.bank_account_number || null,
          p_bank_ifsc_code: bookingData.bank_ifsc_code || null,
        },
      );

      if (!bookingRpcError && bookedRow?.id) {
        console.log('[mentorBooking] Booking saved via availability RPC:', bookedRow);
        return { success: true, bookingId: bookedRow.id };
      }

      if (bookingRpcError && !/book_mentor_availability_slot/i.test(bookingRpcError.message)) {
        console.error('[mentorBooking] Availability RPC error:', bookingRpcError);
        return { success: false, error: bookingRpcError.message };
      }
    }

    const payload = {
      student_id: studentId,
      mentor_id: bookingData.mentor_id || null,
      mentor_name: bookingData.mentor_name,
      mentor_subject: bookingData.mentor_subject,
      selected_date_time: bookingData.selected_date_time,
      duration: bookingData.duration,
      payment_method: bookingData.payment_method,
      payment_app: bookingData.payment_app || null,
      upi_id: bookingData.upi_id || null,
      bank_account_holder: bookingData.bank_account_holder || null,
      bank_name: bookingData.bank_name || null,
      bank_account_number: bookingData.bank_account_number || null,
      bank_ifsc_code: bookingData.bank_ifsc_code || null,
      booking_price: bookingData.booking_price || 500.00,
      status: bookingData.status || 'pending'
    };

    let { data, error: insertError } = await supabase
      .from('mentor_bookings')
      .insert(payload)
      .select()
      .single();

    // Temporary compatibility fallback while mentor_id migration rolls out.
    if (insertError && /mentor_id/i.test(insertError.message)) {
      const { mentor_id: _ignored, ...legacyPayload } = payload;
      const retry = await supabase
        .from('mentor_bookings')
        .insert(legacyPayload)
        .select()
        .single();
      data = retry.data;
      insertError = retry.error;
    }

    if (insertError) {
      console.error('[mentorBooking] Insert error:', insertError);
      return { success: false, error: insertError.message };
    }

    console.log('[mentorBooking] Booking saved:', data);
    return { success: true, bookingId: data.id };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[mentorBooking] Save error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get booking by ID
 */
export async function getMentorBooking(bookingId: string) {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('mentor_bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[mentorBooking] Get error:', err);
    return null;
  }
}

/**
 * Get user's bookings
 */
export async function getUserMentorBookings(studentId: string) {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('mentor_bookings')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[mentorBooking] Get user bookings error:', err);
    return [];
  }
}

/**
 * Send booking confirmation notification
 * In a real app, this would trigger an email/SMS via Edge Function
 */
export async function sendBookingConfirmation(
  studentId: string,
  bookingData: MentorBookingData,
  studentName: string,
  studentEmail: string
): Promise<{ success: boolean; message?: string }> {
  try {
    // In production, call an Edge Function that sends email/SMS
    // For now, just log and show toast
    console.log('[mentorBooking] Confirmation notification:', {
      studentId,
      studentName,
      studentEmail,
      mentorName: bookingData.mentor_name,
      dateTime: bookingData.selected_date_time,
      duration: bookingData.duration,
    });

    // You can call an Edge Function here:
    // const { data: emailResult, error: emailError } = await supabase.functions
    //   .invoke('send-booking-confirmation', {
    //     body: {
    //       studentId,
    //       studentName,
    //       studentEmail,
    //       mentorName: bookingData.mentor_name,
    //       dateTime: bookingData.selected_date_time,
    //       duration: bookingData.duration,
    //     }
    //   });

    return { success: true, message: 'Confirmation notification sent!' };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[mentorBooking] Confirmation error:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Cancel a booking
 */
export async function cancelMentorBooking(bookingId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();

    const { error: updateError } = await supabase
      .from('mentor_bookings')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', bookingId);

    if (updateError) {
      console.error('[mentorBooking] Cancel error:', updateError);
      return { success: false, error: updateError.message };
    }

    console.log('[mentorBooking] Booking cancelled:', bookingId);
    return { success: true };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[mentorBooking] Cancel error:', error);
    return { success: false, error: error.message };
  }
}
