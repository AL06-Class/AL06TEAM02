import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  helperText?: string;
  card?: boolean;
}

export function Radio({ label, helperText, card = false, className, id, checked, ...props }: RadioProps) {
  const radioId = id ?? `${props.name}-${props.value}`;

  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-2 text-sm text-ink",
        card && "rounded-md border border-line bg-surface p-3 shadow-card transition hover:border-primary",
        card && checked && "border-primary bg-primary-soft",
        className,
      )}
    >
      <input
        id={radioId}
        type="radio"
        checked={checked}
        className="mt-0.5 h-4 w-4 border-line text-primary focus:ring-2 focus:ring-primary/25 focus:ring-offset-2"
        {...props}
      />
      <span>
        <span className="block font-medium">{label}</span>
        {helperText ? <span className="mt-0.5 block text-xs text-muted">{helperText}</span> : null}
      </span>
    </label>
  );
}

