"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "./utils";

interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label, className, disabled, ...props }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium text-ink",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-45",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "relative h-6 w-11 rounded-full border transition",
          checked ? "border-primary bg-primary" : "border-line bg-line",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-card transition",
            checked ? "left-5" : "left-0.5",
          )}
        />
      </span>
      {label ? <span>{label}</span> : null}
    </button>
  );
}

