import { useCallback } from 'react';
import { toast } from 'sonner';
import { parseError, isAuthError, AppError } from '@/errors/errorHandler';
import { ErrorCode } from '@/errors/errorCodes';

interface UseErrorHandlerOptions {
  showToast?: boolean;
  onAuthError?: () => void;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { showToast = true, onAuthError } = options;

  const handleError = useCallback(
    (err: unknown): AppError => {
      const parsed = parseError(err);

      if (showToast) {
        if (parsed.code === ErrorCode.OFFLINE) {
          toast.error('You are offline', { description: parsed.message });
        } else if (parsed.code === ErrorCode.RATE_LIMIT) {
          toast.warning('Slow down', { description: parsed.message });
        } else if (parsed.code === ErrorCode.AUTH_EXPIRED || parsed.code === ErrorCode.AUTH_REQUIRED) {
          toast.error('Session expired', { description: parsed.message });
        } else {
          toast.error('Error', { description: parsed.message });
        }
      }

      if (isAuthError(parsed) && onAuthError) {
        onAuthError();
      }

      return parsed;
    },
    [showToast, onAuthError]
  );

  return { handleError };
}
