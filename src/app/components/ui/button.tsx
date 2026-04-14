import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-[#003566] text-white shadow-sm hover:bg-[#0967bd] dark:bg-blue-600 dark:hover:bg-blue-700 dark:shadow-blue-600/20",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 dark:bg-destructive/80 dark:hover:bg-destructive/70",
        outline:
          "border border-border/70 bg-background text-foreground shadow-sm hover:bg-muted hover:border-border dark:border-border dark:bg-card dark:hover:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 dark:bg-secondary dark:hover:bg-secondary/70",
        ghost:
          "text-foreground hover:bg-muted dark:hover:bg-muted/60",
        link:
          "text-[#0967bd] underline-offset-4 hover:underline dark:text-blue-400 shadow-none",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-11 rounded-xl px-6 text-base has-[>svg]:px-4",
        icon: "size-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
