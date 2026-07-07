import type { InputHTMLAttributes, ReactNode } from "react";
import { Search, X } from "lucide-react";
import { cn } from "./utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  requiredMark?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  search?: boolean;
  onClear?: () => void;
}

export function Input({
  label,
  requiredMark,
  error,
  helperText,
  leftIcon,
  search,
  onClear,
  className,
  id,
  disabled,
  value,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;
  const helpId = inputId ? `${inputId}-help` : undefined;
  const hasValue = value !== undefined && String(value).length > 0;

  return (
    <label className="block text-sm font-medium text-ink">
      {label ? (
        <span className="mb-1.5 block">
          {label}
          {requiredMark ? <span className="ml-1 text-danger">*</span> : null}
        </span>
      ) : null}
      <span className="relative block">
        {search || leftIcon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {search ? <Search aria-hidden className="h-4 w-4" /> : leftIcon}
          </span>
        ) : null}
        <input
          id={inputId}
          disabled={disabled}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error || helperText ? helpId : undefined}
          className={cn(
            "h-10 w-full rounded-sm border border-line bg-surface px-3 text-sm text-ink transition placeholder:text-muted",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
            "disabled:cursor-not-allowed disabled:bg-page disabled:text-muted",
            "md:h-10 max-md:h-11",
            (search || leftIcon) && "pl-9",
            onClear && hasValue && "pr-9",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className,
          )}
          {...props}
        />
        {onClear && hasValue ? (
          <button
            type="button"
            aria-label="검색어 지우기"
            onClick={onClear}
            className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-sm text-muted hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        ) : null}
      </span>
      {error || helperText ? (
        <span id={helpId} className={cn("mt-1.5 block text-xs", error ? "text-danger" : "text-muted")}>
          {error ?? helperText}
        </span>
      ) : null}
    </label>
  );
}

