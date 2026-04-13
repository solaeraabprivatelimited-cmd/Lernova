"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-['Plus_Jakarta_Sans'] rounded-2xl border shadow-lg text-sm",
          title: "font-semibold",
          description: "text-muted-foreground text-xs",
          actionButton: "bg-[#003566] text-white dark:bg-blue-600 rounded-lg text-xs font-semibold",
          cancelButton: "bg-muted text-muted-foreground rounded-lg text-xs",
          closeButton: "rounded-full border-border/60",
        },
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--card-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--card)",
          "--success-text": "var(--card-foreground)",
          "--error-bg": "var(--card)",
          "--error-text": "var(--card-foreground)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
