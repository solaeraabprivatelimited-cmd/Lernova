import * as React from "react";

import { cn } from "@/app/components/ui/utils";

interface BrandMarkProps {
  light?: boolean;
  className?: string;
  compact?: boolean;
}

export function BrandMark({ light = false, className, compact = false }: BrandMarkProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      {/* Logo icon — Blue Png on light bg, brightness-invert on dark bg */}
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-2xl border shadow-sm overflow-hidden",
          light
            ? "border-white/15 bg-white/10"
            : "border-primary/10 bg-white",
        )}
      >
        <img
          src="/Blue Png.png"
          alt="Elm Origin"
          className={cn(
            "size-7 object-contain",
            light && "brightness-0 invert",
          )}
          draggable={false}
        />
      </div>
      {!compact && (
        <span
          className={cn(
            "font-['Righteous'] text-xl tracking-[0.02em]",
            light ? "text-white" : "text-primary",
          )}
        >
          Elm Origin
        </span>
      )}
    </div>
  );
}
