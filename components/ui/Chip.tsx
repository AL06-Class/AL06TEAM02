import type { HTMLAttributes } from "react";
import { X } from "lucide-react";
import { cn } from "./utils";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  onRemove?: () => void;
}

export function Chip({ label, onRemove, className, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex h-8 max-w-full items-center gap-1 rounded-sm bg-page px-3 text-sm font-medium text-ink",
        className,
      )}
      {...props}
    >
      <span className="truncate">{label}</span>
      {onRemove ? (
        <button
          type="button"
          aria-label={`${label} 제거`}
          onClick={onRemove}
          className="-mr-1 flex h-6 w-6 items-center justify-center rounded-sm text-muted hover:bg-line hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <X aria-hidden className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </span>
  );
}

