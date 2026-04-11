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

export function AuthShell({
  onBack,
  visual,
  children,
  contentClassName,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden dark:bg-slate-950 light:bg-white text-foreground">
      {/* Base gradient overlay */}
      <div className="pointer-events-none absolute inset-0 dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.06),transparent_30%),linear-gradient(to_bottom,transparent,rgba(59,130,246,0.02))] light:bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.04),transparent_30%),linear-gradient(to_bottom,transparent,rgba(37,99,235,0.02))]" />
      
      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-30 dark:bg-[linear-gradient(to_right,rgba(71,85,105,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(71,85,105,0.08)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgba(71,85,105,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(71,85,105,0.06)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]\" />
      
      <div className="relative flex min-h-screen flex-col lg:flex-row">
        <aside className="hidden lg:flex lg:w-[46%] lg:min-w-[420px]">
          <div 
            className="relative flex w-full flex-col overflow-hidden border-r dark:border-slate-700/50 light:border-blue-700 px-10 py-9 dark:text-slate-50 light:text-white"
            style={{
              backgroundImage: window.matchMedia('(prefers-color-scheme: light)').matches 
                ? 'linear-gradient(180deg, #2563eb 0%, #1e40af 100%)'
                : 'linear-gradient(180deg, #0f1419 0%, #1a1f3a 50%, #0f1419 100%)',
            }}
          >
            <div className="pointer-events-none absolute inset-0 dark:bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_30%)] light:bg-transparent" />
            <div className="pointer-events-none absolute inset-0 dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] light:bg-transparent bg-[size:56px_56px] opacity-60" />
            <div className="relative z-10 flex h-full flex-col">
              <BrandMark light={false} />
              <div className="my-auto">{visual}</div>
              <p className="text-xs dark:text-slate-500 light:text-white/70">Built for focused study, mentor support, and calmer progress.</p>
            </div>
          </div>
        </aside>

        <main className="flex min-h-screen flex-1 flex-col">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-3 rounded-lg px-2 py-1 text-sm font-medium transition-all duration-200 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100"
            >
              <BrandMark compact />
            </button>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                type="button"
                variant="ghost"
                className="rounded-lg px-3 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100"
                onClick={onBack}
              >
                <ArrowLeft className="size-4" />
                Home
              </Button>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 pb-8 pt-2 sm:px-6 lg:px-10 lg:pb-10">
            <div className={cn("w-full max-w-[520px]", contentClassName)}>{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
