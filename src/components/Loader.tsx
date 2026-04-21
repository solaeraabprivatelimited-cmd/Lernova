import { cn } from '@/app/components/ui/utils';

interface LoaderProps {
  /** 'spinner' for inline use, 'skeleton' for content placeholders */
  variant?: 'spinner' | 'skeleton';
  className?: string;
  lines?: number;
}

export function Loader({ variant = 'spinner', className, lines = 3 }: LoaderProps) {
  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-3', className)} aria-busy="true" aria-label="Loading">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 animate-pulse rounded bg-muted',
              i === lines - 1 && 'w-3/4'
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn('flex items-center justify-center', className)}
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
