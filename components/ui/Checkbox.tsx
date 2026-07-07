import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  helperText?: string;
}

export function Checkbox({ label, helperText, className, id, ...props }: CheckboxProps) {
  const checkboxId = id ?? props.name;

  return (
    <label className={cn("flex cursor-pointer items-start gap-2 text-sm text-ink", className)}>
      <input
        id={checkboxId}
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded-sm border-line text-primary focus:ring-2 focus:ring-primary/25 focus:ring-offset-2"
        {...props}
      />
      <span>
        <span className="block">{label}</span>
        {helperText ? <span className="mt-0.5 block text-xs text-muted">{helperText}</span> : null}
      </span>
    </label>
  );
}

