import { AppError } from '@/errors/errorHandler';
import { RETRYABLE_CODES } from '@/errors/errorCodes';

interface ErrorFallbackProps {
  error: AppError | null;
  onRetry?: () => void;
  title?: string;
}

export function ErrorFallback({ error, onRetry, title = 'Something went wrong' }: ErrorFallbackProps) {
  if (!error) return null;
  const canRetry = RETRYABLE_CODES.has(error.code) && !!onRetry;

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      {canRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      )}
    </div>
  );
}
