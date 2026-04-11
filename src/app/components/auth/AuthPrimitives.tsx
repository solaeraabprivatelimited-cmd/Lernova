import * as React from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/app/components/ui/utils";

export function AuthCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border shadow-xl backdrop-blur-sm sm:p-8 p-6",
        "dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-black/50",
        "light:border-slate-200 light:bg-white light:shadow-slate-100",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AuthHeading({
  title,
  description,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h1 className="font-['DM_Serif_Display'] text-4xl leading-tight dark:text-slate-50 light:text-slate-900 sm:text-[2.65rem]">
        {title}
      </h1>
      <p className="text-base leading-6 dark:text-slate-400 light:text-slate-600 sm:text-[15px]">{description}</p>
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
    <div className="inline-flex gap-1.5 rounded-xl dark:bg-slate-700/40 light:bg-slate-100 p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-200",
              active
                ? "!bg-blue-600 !text-white dark:!bg-blue-600 dark:!text-white dark:!shadow-lg dark:!shadow-blue-600/40 light:!bg-blue-600 light:!text-white light:!shadow-md light:!shadow-blue-600/30"
                : "dark:text-slate-300 dark:hover:text-slate-100 light:text-slate-700 light:hover:text-slate-900",
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
    <label className={label ? "space-y-2" : "space-y-0"}>
      {label ? <span className="text-sm font-semibold dark:text-slate-200 light:text-slate-900">{label}</span> : null}
      <span className="relative flex items-center">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 dark:text-slate-500 light:text-slate-400">
            {icon}
          </span>
        ) : null}
        <Input
          ref={ref}
          className={cn(
            "h-12 rounded-lg text-sm shadow-sm transition-all duration-200",
            "dark:border-slate-600/60 dark:bg-slate-700/30 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/30",
            "light:border-slate-300 light:bg-slate-50 light:text-slate-900 light:placeholder:text-slate-500 light:focus:border-blue-500 light:focus:ring-blue-500/20",
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
    <div className="flex items-start gap-3 rounded-lg border px-4 py-3 text-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200 light:border-red-200 light:bg-red-50 light:text-red-800">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <p className="leading-6">{children}</p>
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
        "h-11 w-full rounded-lg text-base font-semibold shadow-lg transition-all duration-200",
        "!bg-blue-600 !text-white dark:!bg-blue-600 dark:!text-white dark:hover:!bg-blue-700 dark:!shadow-blue-600/50",
        "light:!bg-blue-600 light:!text-white light:hover:!bg-blue-700 light:!shadow-blue-600/30",
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
      className="size-12 rounded-2xl border border-border/70 bg-background text-center font-['DM_Serif_Display'] text-2xl text-foreground shadow-sm shadow-black/5 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/12 sm:size-14"
    />
  );
}
