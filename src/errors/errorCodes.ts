export const ErrorCode = {
  // Auth
  AUTH_EXPIRED: 'AUTH_EXPIRED',
  AUTH_INVALID: 'AUTH_INVALID',
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  // Permissions
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  // Network
  NETWORK_ERROR: 'NETWORK_ERROR',
  OFFLINE: 'OFFLINE',
  TIMEOUT: 'TIMEOUT',
  // Rate limiting
  RATE_LIMIT: 'RATE_LIMIT',
  // Third-party
  THIRD_PARTY_ERROR: 'THIRD_PARTY_ERROR',
  WEBRTC_ERROR: 'WEBRTC_ERROR',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  // Server
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export const HTTP_STATUS_TO_CODE: Record<number, ErrorCode> = {
  400: ErrorCode.VALIDATION_ERROR,
  401: ErrorCode.AUTH_REQUIRED,
  403: ErrorCode.PERMISSION_DENIED,
  404: ErrorCode.NOT_FOUND,
  409: ErrorCode.CONFLICT,
  429: ErrorCode.RATE_LIMIT,
  500: ErrorCode.SERVER_ERROR,
  502: ErrorCode.SERVER_ERROR,
  503: ErrorCode.SERVER_ERROR,
  504: ErrorCode.TIMEOUT,
};

export const USER_MESSAGES: Record<ErrorCode, string> = {
  AUTH_EXPIRED: 'Your session has expired. Please log in again.',
  AUTH_INVALID: 'Invalid credentials. Please try again.',
  AUTH_REQUIRED: 'Please log in to continue.',
  PERMISSION_DENIED: "You don't have permission to do that.",
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  CONFLICT: 'This action conflicts with existing data.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  OFFLINE: 'You are offline. Please check your internet connection.',
  TIMEOUT: 'The request timed out. Please try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment.',
  THIRD_PARTY_ERROR: 'An external service is unavailable. Please try again.',
  WEBRTC_ERROR: 'Video/audio connection failed. Please refresh.',
  PAYMENT_ERROR: 'Payment processing failed. Please try again.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
};

export const RETRYABLE_CODES = new Set<ErrorCode>([
  ErrorCode.NETWORK_ERROR,
  ErrorCode.TIMEOUT,
  ErrorCode.SERVER_ERROR,
  ErrorCode.RATE_LIMIT,
]);
