/**
 * LERNOVA - Input Validation Schemas (Zod)
 * 
 * Purpose: Client-side validation before sending data to backend
 * Benefits:
 * - Instant feedback to users
 * - Prevents bad data from reaching API
 * - Reduces server load
 * - Improves user experience
 */

import { z } from 'zod';

// ═════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION SCHEMAS
// ═════════════════════════════════════════════════════════════════════════════

export const LoginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password too long'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const SignUpSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  confirmPassword: z
    .string()
    .min(8, 'Password confirmation required'),
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  role: z
    .enum(['student', 'mentor'])
    .default('student'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignUpFormData = z.infer<typeof SignUpSchema>;

export const GoogleOAuthSchema = z.object({
  idToken: z
    .string()
    .min(1, 'Token required')
    .refine((token) => {
      const parts = token.split('.');
      return parts.length === 3;
    }, 'Invalid token format'),
  role: z
    .enum(['student', 'mentor'])
    .default('student'),
});

export type GoogleOAuthFormData = z.infer<typeof GoogleOAuthSchema>;

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
});

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

// ═════════════════════════════════════════════════════════════════════════════
// STUDY ROOMS SCHEMAS
// ═════════════════════════════════════════════════════════════════════════════

export const CreateRoomSchema = z.object({
  roomName: z
    .string()
    .min(3, 'Room name must be at least 3 characters')
    .max(100, 'Room name too long')
    .regex(/^[a-zA-Z0-9\s\-_()]+$/, 'Room name contains invalid characters'),
  topic: z
    .string()
    .min(1, 'Topic is required')
    .max(50, 'Topic too long')
    .optional(),
  maxParticipants: z
    .number()
    .min(2, 'Minimum 2 participants')
    .max(50, 'Maximum 50 participants')
    .default(10),
  description: z
    .string()
    .max(500, 'Description too long')
    .optional(),
  roomMode: z
    .enum(['focus', 'collaborative', 'silent', 'live'])
    .default('collaborative'),
});

export type CreateRoomFormData = z.infer<typeof CreateRoomSchema>;

export const JoinRoomSchema = z.object({
  roomId: z
    .string()
    .min(1, 'Room ID required')
    .uuid('Invalid room ID format'),
});

export type JoinRoomFormData = z.infer<typeof JoinRoomSchema>;

export const RoomSettingsSchema = z.object({
  roomName: z
    .string()
    .min(3, 'Room name must be at least 3 characters')
    .max(100, 'Room name too long'),
  topic: z
    .string()
    .max(50, 'Topic too long'),
  maxParticipants: z
    .number()
    .min(2, 'Minimum 2 participants')
    .max(50, 'Maximum 50 participants'),
});

export type RoomSettingsFormData = z.infer<typeof RoomSettingsSchema>;

// ═════════════════════════════════════════════════════════════════════════════
// CHAT SCHEMAS
// ═════════════════════════════════════════════════════════════════════════════

export const SendMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message too long')
    .refine(
      (msg) => msg.trim().length > 0,
      'Message cannot be only whitespace'
    ),
  roomId: z
    .string()
    .uuid('Invalid room ID'),
  type: z
    .enum(['text', 'system', 'notification'])
    .default('text')
    .optional(),
});

export type SendMessageFormData = z.infer<typeof SendMessageSchema>;

// ═════════════════════════════════════════════════════════════════════════════
// PROFILE SCHEMAS
// ═════════════════════════════════════════════════════════════════════════════

export const UpdateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  bio: z
    .string()
    .max(500, 'Bio too long')
    .optional(),
  avatar: z
    .string()
    .url('Invalid URL')
    .optional(),
  role: z
    .enum(['student', 'mentor'])
    .optional(),
});

export type UpdateProfileFormData = z.infer<typeof UpdateProfileSchema>;

// ═════════════════════════════════════════════════════════════════════════════
// FRIEND SYSTEM SCHEMAS
// ═════════════════════════════════════════════════════════════════════════════

export const SendFriendRequestSchema = z.object({
  userId: z
    .string()
    .uuid('Invalid user ID'),
  message: z
    .string()
    .max(200, 'Message too long')
    .optional(),
});

export type SendFriendRequestFormData = z.infer<typeof SendFriendRequestSchema>;

export const RespondFriendRequestSchema = z.object({
  requestId: z
    .string()
    .uuid('Invalid request ID'),
  action: z
    .enum(['accept', 'reject']),
});

export type RespondFriendRequestFormData = z.infer<typeof RespondFriendRequestSchema>;

// ═════════════════════════════════════════════════════════════════════════════
// NOTES SCHEMAS
// ═════════════════════════════════════════════════════════════════════════════

export const CreateNoteSchema = z.object({
  roomId: z
    .string()
    .uuid('Invalid room ID'),
  content: z
    .string()
    .min(1, 'Note cannot be empty')
    .max(5000, 'Note too long'),
});

export type CreateNoteFormData = z.infer<typeof CreateNoteSchema>;

// ═════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Validate and return errors in user-friendly format
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns { valid: boolean, data?: T, errors?: Record<string, string> }
 */
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { valid: boolean; data?: T; errors?: Record<string, string> } {
  try {
    const validData = schema.parse(data);
    return { valid: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { valid: false, errors };
    }
    return { valid: false, errors: { _form: 'Validation failed' } };
  }
}

/**
 * Validate and throw error if invalid
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated data
 */
export function validateFormStrict<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  return schema.parse(data);
}

/**
 * Sanitize user input to prevent XSS
 * @param input - User input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

/**
 * Validate email format (simple regex)
 * @param email - Email to validate
 * @returns true if valid
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Check password strength
 * @param password - Password to check
 * @returns { score: 0-4, feedback: string[] }
 */
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) {
    score++;
  } else {
    feedback.push('At least 8 characters');
  }

  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('Include uppercase letter');
  }

  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push('Include lowercase letter');
  }

  if (/[0-9]/.test(password)) {
    score++;
  } else {
    feedback.push('Include number');
  }

  return { score, feedback };
}

export default {
  LoginSchema,
  SignUpSchema,
  GoogleOAuthSchema,
  ForgotPasswordSchema,
  CreateRoomSchema,
  JoinRoomSchema,
  RoomSettingsSchema,
  SendMessageSchema,
  UpdateProfileSchema,
  SendFriendRequestSchema,
  RespondFriendRequestSchema,
  CreateNoteSchema,
  validateForm,
  validateFormStrict,
  sanitizeInput,
  isValidEmail,
  checkPasswordStrength,
};
