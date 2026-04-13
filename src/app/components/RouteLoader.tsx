import * as React from "react";
import { cn } from "@/app/components/ui/utils";

interface RouteLoaderProps {
  label?: string;
  fullscreen?: boolean;
}

export function RouteLoader({
  label = "Loading Elm Orbit...",
  fullscreen = true,
}: RouteLoaderProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center bg-background text-foreground",
        fullscreen ? "min-h-screen" : "min-h-[240px]",
      )}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Branded spinner */}
        <div className="relative size-12">
          <div className="absolute inset-0 rounded-full border-[3px] border-border/40" />
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-primary" />
          {/* Inner dot */}
          <div className="absolute inset-[14px] rounded-full bg-primary/20 animate-pulse" />
        </div>

        {/* Skeleton shimmer bars */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-2.5 w-32 animate-pulse rounded-full bg-muted" />
          <div className="h-2 w-20 animate-pulse rounded-full bg-muted/60" />
        </div>

        {label && (
          <p className="text-xs font-medium text-muted-foreground tracking-wide">{label}</p>
        )}
      </div>
    </div>
  );
}
