import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "dark:bg-input dark:border-muted/60 dark:text-foreground dark:placeholder:text-muted-foreground/60",
        "light:bg-input-background light:border-border light:text-foreground light:placeholder:text-muted-foreground/70",
        "flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-all duration-200 outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-primary/50 focus-visible:ring-primary/30 focus-visible:ring-[3px]",
        "dark:focus-visible:shadow-primary/20 light:focus-visible:shadow-black/10 focus-visible:shadow-md",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
