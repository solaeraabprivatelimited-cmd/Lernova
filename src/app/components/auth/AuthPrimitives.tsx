import * as React from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/app/components/ui/utils";

export function AuthCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border shadow-lg backdrop-blur-sm",
        "border-border/60 bg-card/95 shadow-black/5",
        "dark:border-border dark:bg-card dark:shadow-black/30",
        "p-6 sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AuthHeading({ title, description }: { title: React.ReactNode; description: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h1 className="font-['DM_Serif_Display'] text-[2.4rem] leading-tight text-foreground sm:text-[2.65rem]">
        {title}
      </h1>
      <p className="text-[15px] leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

export function AuthSegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <div
      role="tablist"
      className="inline-flex gap-1 rounded-xl bg-muted/60 p-1 dark:bg-muted/40"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200",
              active
                ? "bg-[#003566] text-white shadow-sm dark:bg-blue-600 dark:text-white"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

interface AuthFieldProps extends React.ComponentProps<typeof Input> {
  label: string;
  icon?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const AuthField = React.forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ label, icon, endAdornment, className, ...props }, ref) => (
    <label className={label ? "space-y-2 block" : "block"}>
      {label ? (
        <span className="text-sm font-semibold text-foreground">{label}</span>
      ) : null}
      <span className="relative flex items-center">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        ) : null}
        <Input
          ref={ref}
          className={cn(
            "h-12 rounded-xl text-sm shadow-sm",
            "border-border/70 bg-input-background text-foreground placeholder:text-muted-foreground/60",
            "focus-visible:border-[#0967bd] focus-visible:ring-[#0967bd]/20",
            "dark:border-border dark:bg-input dark:focus-visible:border-blue-500 dark:focus-visible:ring-blue-500/20",
            icon ? "pl-11" : "pl-4",
            endAdornment ? "pr-12" : "pr-4",
            className,
          )}
          {...props}
        />
        {endAdornment ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{endAdornment}</span>
        ) : null}
      </span>
    </label>
  ),
);
AuthField.displayName = "AuthField";

export function AuthAlert({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border px-4 py-3 text-sm
        border-destructive/30 bg-destructive/8 text-destructive
        dark:border-destructive/40 dark:bg-destructive/10 dark:text-red-300"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}

export function AuthSubmitButton({
  loading,
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button> & { loading?: boolean }) {
  return (
    <Button
      className={cn(
        "h-11 w-full rounded-xl text-base font-semibold shadow-md transition-all duration-200",
        "bg-[#003566] text-white hover:bg-[#0967bd] shadow-[#003566]/20",
        "dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:shadow-blue-600/30",
        "active:scale-[0.98]",
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Working...
        </span>
      ) : (
        children
      )}
    </Button>
  );
}

export function AuthOtpInput({
  value,
  onChange,
  onKeyDown,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  id: string;
}) {
  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={1}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
      className="size-12 rounded-2xl border border-border/70 bg-input-background text-center
        font-['DM_Serif_Display'] text-2xl text-foreground shadow-sm outline-none
        transition-all focus:border-[#0967bd] focus:ring-4 focus:ring-[#0967bd]/15
        dark:focus:border-blue-500 dark:focus:ring-blue-500/15 sm:size-14"
    />
  );
}
