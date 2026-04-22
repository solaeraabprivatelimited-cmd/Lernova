import * as React from "react";
import { ArrowLeft } from "lucide-react";

import { BrandMark } from "@/app/components/BrandMark";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";

interface AuthShellProps {
  onBack: () => void;
  visual: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}

export function AuthShell({ onBack, visual, children, contentClassName }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.07),transparent_35%)] bg-[radial-gradient(circle_at_top,rgba(0,53,102,0.04),transparent_35%)]" />

      <div className="relative flex min-h-screen flex-col lg:flex-row">
        {/* ── Left panel (desktop only) ── */}
        <aside className="hidden lg:flex lg:w-[46%] lg:min-w-[420px] xl:min-w-[480px]">
          <div className="relative flex w-full flex-col overflow-hidden px-10 py-9 text-white
            bg-[linear-gradient(160deg,#001d3d_0%,#003566_45%,#0967bd_100%)]
            dark:bg-[linear-gradient(160deg,#0a0f1e_0%,#0d1424_50%,#111827_100%)]">

            {/* Grid pattern overlay */}
            <div className="auth-grid-overlay" />
            {/* Radial glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(9,103,189,0.25),transparent_40%)]" />

            <div className="relative z-10 flex h-full flex-col">
              <BrandMark light />
              <div className="my-auto py-10">{visual}</div>
              <p className="text-xs text-white/50 leading-relaxed">
                Built for focused study, mentor support, and calmer progress.
              </p>
            </div>
          </div>
        </aside>

        {/* ── Right panel (form) ── */}
        <main className="flex min-h-screen flex-1 flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium transition-all
                text-muted-foreground hover:text-foreground hover:bg-muted/60"
            >
              <BrandMark compact />
            </button>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-lg gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={onBack}
              >
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </div>
          </div>

          {/* Form area */}
          <div className="flex flex-1 items-center justify-center px-4 pb-10 pt-2 sm:px-6 lg:px-10">
            <div className={cn("w-full max-w-[520px]", contentClassName)}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
