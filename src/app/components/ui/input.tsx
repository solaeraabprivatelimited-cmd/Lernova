import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-lg border px-3 py-1 text-base outline-none transition-all duration-200",
        "border-border/70 bg-input-background text-foreground placeholder:text-muted-foreground/60",
        "dark:border-border dark:bg-input dark:text-foreground dark:placeholder:text-muted-foreground/50",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[#0967bd] focus-visible:ring-2 focus-visible:ring-[#0967bd]/20",
        "dark:focus-visible:border-blue-500 dark:focus-visible:ring-blue-500/20",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
