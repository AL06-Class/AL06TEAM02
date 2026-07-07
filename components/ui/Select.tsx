import type { SelectHTMLAttributes } from "react";
import { cn } from "./utils";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  requiredMark?: boolean;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

export function Select({
  label,
  requiredMark,
  error,
  helperText,
  options,
  children,
  className,
  id,
  disabled,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;
  const helpId = selectId ? `${selectId}-help` : undefined;

  return (
    <label className="block text-sm font-medium text-ink">
      {label ? (
        <span className="mb-1.5 block">
          {label}
          {requiredMark ? <span className="ml-1 text-danger">*</span> : null}
        </span>
      ) : null}
      <select
        id={selectId}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error || helperText ? helpId : undefined}
        className={cn(
          "h-10 w-full rounded-sm border border-line bg-surface px-3 text-sm text-ink transition",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          "disabled:cursor-not-allowed disabled:bg-page disabled:text-muted",
          "md:h-10 max-md:h-11",
          error && "border-danger focus:border-danger focus:ring-danger/20",
          className,
        )}
        {...props}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      {error || helperText ? (
        <span id={helpId} className={cn("mt-1.5 block text-xs", error ? "text-danger" : "text-muted")}>
          {error ?? helperText}
        </span>
      ) : null}
    </label>
  );
}

