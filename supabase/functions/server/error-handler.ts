/**
 * ERROR HANDLING & MESSAGE SANITIZATION
 * Production-ready error handling that prevents information disclosure
 * Maps internal errors to generic user-facing messages
 */

/**
 * Generated unique error ID for tracking
 */
export function generateErrorId(): string {
  return `ERR_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`.toUpperCase();
}

/**
 * Map of internal error patterns to safe user-facing messages
 */
const ERROR_MAPPING: Record<string, string> = {
  // Authentication errors
  "invalid or expired token": "Authentication failed. Please log in again.",
  "missing auth token": "Authentication required. Please log in.",
  "no user found": "User not found. Please check your credentials.",
  "invalid password": "Invalid credentials. Please try again.",
  "email already exists": "This email is already registered. Please log in instead.",
  "user already exists": "This email is already registered. Please log in instead.",
  "account locked": "Your account has been locked. Please try again later.",
  
  // Database errors
  "duplicate key": "This record already exists.",
  "constraint violation": "Invalid data provided.",
  "foreign key": "Referenced item does not exist.",
  "permission denied": "You don't have permission to perform this action.",
  
  // Validation errors
  "invalid email": "Please provide a valid email address.",
  "invalid phone": "Please provide a valid phone number.",
  "password too weak": "Password does not meet security requirements.",
  "field required": "All required fields must be filled.",
  
  // Rate limiting (custom)
  "rate limit exceeded": "Too many requests. Please try again later.",
  "too many attempts": "Too many failed attempts. Please try again later.",
  
  // Network/server errors
  "connection refused": "Server is temporarily unavailable. Please try again.",
  "timeout": "Request timed out. Please try again.",
  "network error": "Network connection error. Please check your connection.",
  
  // File operations
  "file too large": "File size exceeds maximum allowed size.",
  "unsupported format": "This file format is not supported.",
  
  // Generic fallback
  "database error": "A data error occurred. Please try again.",
  "server error": "An internal error occurred. Please try again.",
};

/**
 * ✅ SECURE: Sanitize error messages to prevent information disclosure
 * 
 * Maps internal error details to generic, user-safe messages
 * Logs full error details server-side only (not sent to client)
 * 
 * @param errorMessage Full error message from system/database
 * @param context Additional context for logging
 * @returns Safe message to send to client
 */
export function sanitizeError(
  errorMessage: string,
  context?: { action?: string; userId?: string; ip?: string }
): string {
  const lowerMessage = errorMessage.toLowerCase();
  
  // Check for matches in mapping
  for (const [pattern, safeMessage] of Object.entries(ERROR_MAPPING)) {
    if (lowerMessage.includes(pattern)) {
      return safeMessage;
    }
  }
  
  // ✅ SECURE: Default to generic message if no match found
  return "An error occurred. If the problem persists, please contact support.";
}

/**
 * ✅ SECURE: Create structured error response with error ID for tracking
 */
export function createErrorResponse(
  originalError: string | Error,
  statusCode: number = 400,
  context?: { action?: string; userId?: string; ip?: string }
): { error: string; errorId: string; details?: Record<string, any> } {
  
  const errorId = generateErrorId();
  const errorMessage = typeof originalError === "string" ? originalError : originalError.message;
  
  // Log full error server-side only
  const logEntry = {
    errorId,
    timestamp: new Date().toISOString(),
    statusCode,
    originalError: errorMessage,
    context,
    stack: originalError instanceof Error ? originalError.stack : undefined,
  };
  
  console.error("[ERROR]", JSON.stringify(logEntry));
  
  // Return generic message to client
  const safeMessage = sanitizeError(errorMessage, context);
  
  return {
    error: safeMessage,
    errorId, // Client can use this to reference the error in support requests
  };
}

/**
 * ✅ SECURE: Validate request body size
 * Prevents payload-based DoS attacks
 */
export function validateRequestSize(
  body: unknown,
  maxSizeKb: number = 100
): boolean {
  try {
    // Estimate size of JSON stringified body
    const jsonString = JSON.stringify(body);
    const sizeKb = new Blob([jsonString]).size / 1024;
    
    if (sizeKb > maxSizeKb) {
      console.warn(`Request body exceeds limit: ${sizeKb}KB > ${maxSizeKb}KB`);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Common error responses
 */
export const ErrorResponses = {
  MISSING_AUTH: (c: any, errorId?: string) => ({
    error: "Authentication required. Please log in.",
    errorId: errorId || generateErrorId(),
    statusCode: 401,
  }),
  
  FORBIDDEN: (c: any, errorId?: string) => ({
    error: "You don't have permission to perform this action.",
    errorId: errorId || generateErrorId(),
    statusCode: 403,
  }),
  
  NOT_FOUND: (errorId?: string) => ({
    error: "The requested resource was not found.",
    errorId: errorId || generateErrorId(),
    statusCode: 404,
  }),
  
  RATE_LIMITED: (retryAfterSeconds: number, errorId?: string) => ({
    error: `Too many requests. Please try again in ${retryAfterSeconds} seconds.`,
    errorId: errorId || generateErrorId(),
    statusCode: 429,
    retryAfter: retryAfterSeconds,
  }),
  
  INVALID_INPUT: (field?: string, errorId?: string) => ({
    error: field ? `Invalid ${field}. Please check your input.` : "Invalid input provided.",
    errorId: errorId || generateErrorId(),
    statusCode: 400,
  }),
  
  INTERNAL_ERROR: (errorId?: string) => ({
    error: "An internal error occurred. Please try again later.",
    errorId: errorId || generateErrorId(),
    statusCode: 500,
  }),
};
