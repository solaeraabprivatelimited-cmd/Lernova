import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const nextLabel = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <Button
      type="button"
      variant="outline"
      size={showLabel ? "default" : "icon"}
      aria-label={nextLabel}
      title={`${nextLabel}. Light mode is the default unless you save a preference.`}
      className={cn(
        "border-border/70 bg-white dark:bg-[#1a1a2e] text-foreground dark:text-white shadow-lg shadow-black/5 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-[#1a1a2e]/70",
        showLabel && "gap-2 rounded-full px-4",
        className,
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      {showLabel ? <span>{isDark ? "Light" : "Dark"} mode</span> : null}
    </Button>
  );
}
