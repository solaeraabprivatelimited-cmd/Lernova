/**
 * INPUT VALIDATION SCHEMAS
 * Production-ready validation using Zod
 * Protects against injection attacks, malformed inputs, and data corruption
 */

import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// ============================================================================
// BASIC VALIDATION SCHEMAS
// ============================================================================

/**
 * Email validation with RFC 5322 compliance
 * Max length: 254 characters (RFC 5321)
 */
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(254, 'Email is too long')
  .toLowerCase()
  .trim();

/**
 * Strong password validation
 * Requirements:
 * - 12+ characters
 * - Uppercase letter
 * - Lowercase letter
 * - Number
 * - Special character
 */
export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[!@#$%^&*]/, 'Password must contain special character (!@#$%^&*)');

/**
 * OTP validation (6-8 digits)
 */
export const otpSchema = z
  .string()
  .regex(/^\d{6,8}$/, 'Invalid OTP format (must be 6-8 digits)');

/**
 * Name validation
 * - Alphanumeric, spaces, apostrophes, hyphens only
 * - No more than 100 characters
 */
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name is too long')
  .trim()
  .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters');

/**
 * URL validation for safe redirects
 */
export const redirectUrlSchema = z
  .string()
  .url('Invalid URL format')
  .refine(
    (url) => {
      const allowed = [
        'https://elmorbit.co.in',
        'https://www.elmorbit.co.in',
        'https://app.elmorbit.co.in',
      ];
      return allowed.some(base => url.startsWith(base));
    },
    'Redirect URL not allowed'
  );

/**
 * UUID validation
 */
export const uuidSchema = z
  .string()
  .uuid('Invalid UUID format');

/**
 * Phone number (basic validation)
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]{7,20}$/, 'Invalid phone number format');

// ============================================================================
// ENDPOINT REQUEST SCHEMAS
// ============================================================================

/**
 * OTP verification request
 */
export const verifyOtpRequestSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
  password: passwordSchema,
});

export type VerifyOtpRequest = z.infer<typeof verifyOtpRequestSchema>;

/**
 * Send OTP request
 */
export const sendOtpRequestSchema = z.object({
  email: emailSchema,
});

export type SendOtpRequest = z.infer<typeof sendOtpRequestSchema>;

/**
 * User profile update request
 */
export const profileUpdateSchema = z.object({
  name: nameSchema.optional(),
  bio: z.string().max(500, 'Bio is too long').optional(),
  avatar_url: z.string().url('Invalid avatar URL').optional(),
  role: z.enum(['student', 'mentor']).optional(),
});

export type ProfileUpdateRequest = z.infer<typeof profileUpdateSchema>;

/**
 * Create study room request
 */
export const createRoomRequestSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  capacity: z.number().min(1).max(100).optional(),
});

export type CreateRoomRequest = z.infer<typeof createRoomRequestSchema>;

/**
 * Post/comment creation
 */
export const postCreationSchema = z.object({
  title: z.string().min(1, 'Title required').max(200),
  content: z.string().min(1, 'Content required').max(5000),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export type PostCreationRequest = z.infer<typeof postCreationSchema>;

// ============================================================================
// VALIDATION HELPER FUNCTIONS
// ============================================================================

/**
 * Validate request body
 * Returns { success: boolean, data?: T, error?: string }
 */
export async function validateRequest<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  options = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const validated = await schema.parseAsync(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      const path = firstError.path.join('.');
      return {
        success: false,
        error: `${path || 'Input'}: ${firstError.message}`,
      };
    }
    return { success: false, error: 'Validation failed' };
  }
}

/**
 * Sanitize HTML in input (prevent XSS)
 */
export function sanitizeHTML(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Escape SQL string (use with parameterized queries preferably)
 */
export function escapeSQLString(input: string): string {
  return input.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

/**
 * Validate file upload
 */
export const fileUploadSchema = z.object({
  filename: z.string().max(255),
  mimetype: z.enum([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ]),
  size: z.number().max(10 * 1024 * 1024), // 10MB
});

export type FileUploadRequest = z.infer<typeof fileUploadSchema>;

/**
 * Validate and sanitize request
 */
export async function validateAndSanitize<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): Promise<{ success: boolean; data?: T; sanitized?: T; error?: string }> {
  const validation = await validateRequest(data, schema);
  
  if (!validation.success) {
    return validation;
  }

  // Sanitize string fields to prevent XSS
  const sanitized = sanitizeObjectStrings(validation.data);

  return {
    success: true,
    data: validation.data,
    sanitized: sanitized as T,
  };
}

/**
 * Recursively sanitize string fields in object
 */
function sanitizeObjectStrings(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeHTML(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObjectStrings);
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObjectStrings(value);
    }
    return sanitized;
  }

  return obj;
}

/**
 * Error response formatter
 */
export function createValidationError(message: string, field?: string) {
  return {
    error: message,
    field,
  };
}
