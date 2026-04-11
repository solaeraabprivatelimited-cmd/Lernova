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
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-2xl border shadow-sm",
          light
            ? "border-white/15 bg-white/10 text-white"
            : "border-primary/10 bg-primary text-primary-foreground",
        )}
      >
        <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3Zm0 12.54L4.38 11 12 6.46 19.62 11 12 15.54ZM1 17v2l11 6 11-6v-2l-11 6L1 17Z" />
        </svg>
      </div>
      {!compact && (
        <span
          className={cn(
            "font-['Righteous'] text-xl tracking-[0.02em]",
            light ? "text-white" : "text-primary",
          )}
        >
          Learnova
        </span>
      )}
    </div>
  );
}
