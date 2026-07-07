import type { ReactNode } from "react";

interface StickyActionBarProps {
  iconAction?: ReactNode;
  primaryAction: ReactNode;
}

export function StickyActionBar({ iconAction, primaryAction }: StickyActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-sticky flex min-h-[52px] gap-2 border-t border-line bg-surface p-2 lg:hidden">
      {iconAction}
      <div className="min-w-0 flex-1">{primaryAction}</div>
    </div>
  );
}

