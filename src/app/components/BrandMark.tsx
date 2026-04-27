import * as React from "react";
import { cn } from "@/app/components/ui/utils";
import { ElmOriginLogo } from "./ElmOriginLogo";

interface BrandMarkProps {
  light?: boolean;
  className?: string;
  compact?: boolean;
}

export function BrandMark({ light = false, className, compact = false }: BrandMarkProps) {
  return (
    <ElmOriginLogo
      light={light}
      showWordmark={!compact}
      size={36}
      wordmarkSize={20}
      className={cn(className)}
    />
  );
}
