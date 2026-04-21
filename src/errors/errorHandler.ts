import { ErrorCode, HTTP_STATUS_TO_CODE, USER_MESSAGES, RETRYABLE_CODES } from './errorCodes';

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  retryable: boolean;
  status?: number;
}

/** Standard API error response shape from backend */
interface ApiErrorBody {
  success?: false;
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
    timestamp?: string;
  };
  detail?: string | { msg: string }[];
  message?: string;
}

export function parseError(err: unknown, status?: number): AppError {
  const timestamp = new Date().toISOString();

  // Offline
  if (!navigator.onLine) {
    return { code: ErrorCode.OFFLINE, message: USER_MESSAGES.OFFLINE, timestamp, retryable: true };
  }

  // Network-level (fetch threw)
  if (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) {
    return { code: ErrorCode.NETWORK_ERROR, message: USER_MESSAGES.NETWORK_ERROR, timestamp, retryable: true };
  }

  // AbortError
  if (err instanceof DOMException && err.name === 'AbortError') {
    return { code: ErrorCode.TIMEOUT, message: USER_MESSAGES.TIMEOUT, timestamp, retryable: true };
  }

  // AppError passthrough
  if (isAppError(err)) return err;

  // HTTP status-based
  if (status) {
    const code = HTTP_STATUS_TO_CODE[status] ?? ErrorCode.SERVER_ERROR;
    const rawMessage = extractRawMessage(err);
    return {
      code,
      message: USER_MESSAGES[code],
      details: rawMessage ? { raw: rawMessage } : undefined,
      timestamp,
      retryable: RETRYABLE_CODES.has(code),
      status,
    };
  }

  // Generic Error
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes('expired') || msg.includes('session')) {
      return { code: ErrorCode.AUTH_EXPIRED, message: USER_MESSAGES.AUTH_EXPIRED, timestamp, retryable: false };
    }
    if (msg.includes('unauthorized') || msg.includes('401')) {
      return { code: ErrorCode.AUTH_REQUIRED, message: USER_MESSAGES.AUTH_REQUIRED, timestamp, retryable: false };
    }
    if (msg.includes('forbidden') || msg.includes('403')) {
      return { code: ErrorCode.PERMISSION_DENIED, message: USER_MESSAGES.PERMISSION_DENIED, timestamp, retryable: false };
    }
    if (msg.includes('not found') || msg.includes('404')) {
      return { code: ErrorCode.NOT_FOUND, message: USER_MESSAGES.NOT_FOUND, timestamp, retryable: false };
    }
    if (msg.includes('network') || msg.includes('failed to fetch')) {
      return { code: ErrorCode.NETWORK_ERROR, message: USER_MESSAGES.NETWORK_ERROR, timestamp, retryable: true };
    }
  }

  return { code: ErrorCode.UNKNOWN, message: USER_MESSAGES.UNKNOWN, timestamp, retryable: true };
}

function extractRawMessage(err: unknown): string | undefined {
  if (!err || typeof err !== 'object') return undefined;
  const body = err as ApiErrorBody;
  if (body.error?.message) return body.error.message;
  if (typeof body.detail === 'string') return body.detail;
  if (Array.isArray(body.detail)) return body.detail.map((d) => d.msg).join(', ');
  if (body.message) return body.message;
  return undefined;
}

export function isAppError(err: unknown): err is AppError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    'message' in err &&
    'retryable' in err
  );
}

export function isAuthError(err: AppError): boolean {
  return err.code === ErrorCode.AUTH_EXPIRED || err.code === ErrorCode.AUTH_REQUIRED;
}

/** Build a standardized error response for logging/display */
export function toErrorResponse(err: unknown, status?: number) {
  const parsed = parseError(err, status);
  return {
    success: false as const,
    error: {
      code: parsed.code,
      message: parsed.message,
      details: parsed.details ?? {},
      timestamp: parsed.timestamp,
    },
  };
}
