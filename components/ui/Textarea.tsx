import type { TextareaHTMLAttributes } from "react";
import { cn } from "./utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  requiredMark?: boolean;
  error?: string;
  helperText?: string;
}

export function Textarea({
  label,
  requiredMark,
  error,
  helperText,
  className,
  id,
  disabled,
  rows = 5,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;
  const helpId = textareaId ? `${textareaId}-help` : undefined;

  return (
    <label className="block text-sm font-medium text-ink">
      {label ? (
        <span className="mb-1.5 block">
          {label}
          {requiredMark ? <span className="ml-1 text-danger">*</span> : null}
        </span>
      ) : null}
      <textarea
        id={textareaId}
        disabled={disabled}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error || helperText ? helpId : undefined}
        className={cn(
          "w-full resize-y rounded-sm border border-line bg-surface px-3 py-2 text-sm text-ink transition placeholder:text-muted",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          "disabled:cursor-not-allowed disabled:bg-page disabled:text-muted",
          error && "border-danger focus:border-danger focus:ring-danger/20",
          className,
        )}
        {...props}
      />
      {error || helperText ? (
        <span id={helpId} className={cn("mt-1.5 block text-xs", error ? "text-danger" : "text-muted")}>
          {error ?? helperText}
        </span>
      ) : null}
    </label>
  );
}

