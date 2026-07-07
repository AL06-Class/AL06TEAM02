import type { ReactNode } from "react";
import { Camera } from "lucide-react";
import { cn } from "./utils";

interface EmptyStateProps {
  title: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({ title, action, icon, className }: EmptyStateProps) {
  return (
    <div className={cn("flex min-h-60 flex-col items-center justify-center px-4 py-12 text-center", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-md border border-line bg-page text-muted">
        {icon ?? <Camera aria-hidden className="h-6 w-6" />}
      </div>
      <p className="mt-4 text-sm font-semibold text-ink">{title}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

