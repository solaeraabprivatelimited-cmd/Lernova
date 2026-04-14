import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/app/components/ui/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border transition-all duration-300",
        "border-border/60 bg-background/80 text-foreground shadow-sm backdrop-blur",
        "hover:border-border hover:bg-muted hover:shadow-md active:scale-95",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/60 focus-visible:outline-offset-2",
        showLabel ? "h-9 px-4 text-sm font-medium" : "size-9",
        className,
      )}
    >
      <span
        className="relative flex items-center justify-center"
        style={{ width: 16, height: 16 }}
      >
        <Sun
          className={cn(
            "absolute size-4 transition-all duration-300",
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
          )}
        />
        <Moon
          className={cn(
            "absolute size-4 transition-all duration-300",
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
          )}
        />
      </span>
      {showLabel && <span>{isDark ? "Light" : "Dark"} mode</span>}
    </button>
  );
}
