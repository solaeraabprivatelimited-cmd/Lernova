import { cn } from "./utils";

interface SkeletonCardProps {
  lines?: number;
  className?: string;
  hasAvatar?: boolean;
}

export function SkeletonCard({ lines = 3, className, hasAvatar = false }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-5 shadow-sm",
        className,
      )}
      aria-busy="true"
      aria-label="Loading content"
    >
      {hasAvatar && (
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-full bg-muted animate-pulse" />
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-3 w-28 rounded-full bg-muted animate-pulse" />
            <div className="h-2.5 w-20 rounded-full bg-muted/60 animate-pulse" />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-2.5 rounded-full bg-muted animate-pulse"
            style={{ width: `${100 - i * 12}%`, animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
