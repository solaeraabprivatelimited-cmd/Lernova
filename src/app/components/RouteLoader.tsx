import * as React from "react";

interface RouteLoaderProps {
  label?: string;
  fullscreen?: boolean;
}

export function RouteLoader({
  label = "Loading Learnova...",
  fullscreen = true,
}: RouteLoaderProps) {
  return (
    <div
      className={[
        fullscreen ? "min-h-screen" : "min-h-[240px]",
        "flex w-full items-center justify-center bg-background text-foreground",
      ].join(" ")}
    >
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-border/60 bg-card/80 px-8 py-7 text-center shadow-xl shadow-black/5 backdrop-blur">
        <div className="size-11 animate-spin rounded-full border-[3px] border-primary/30 border-t-primary" />
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
