import { cn } from "./utils";

interface SkeletonProps {
  variant?: "card" | "row" | "detail";
  count?: number;
  className?: string;
}

function Bar({ className }: { className?: string }) {
  return <div className={cn("skeleton-shimmer rounded-sm bg-line", className)} />;
}

export function Skeleton({ variant = "card", count = 1, className }: SkeletonProps) {
  const items = Array.from({ length: count }, (_, index) => index);

  if (variant === "row") {
    return (
      <div className={cn("space-y-2", className)} aria-hidden>
        {items.map((item) => (
          <div key={item} className="flex h-12 items-center gap-4 rounded-md border border-line bg-surface px-4">
            <Bar className="h-4 w-24" />
            <Bar className="h-4 flex-1" />
            <Bar className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className={cn("space-y-4 rounded-md border border-line bg-surface p-4", className)} aria-hidden>
        <Bar className="h-7 w-2/3" />
        <Bar className="aspect-video w-full" />
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-5/6" />
        <Bar className="h-4 w-3/5" />
      </div>
    );
  }

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)} aria-hidden>
      {items.map((item) => (
        <div key={item} className="rounded-md border border-line bg-surface p-3 shadow-card">
          <Bar className="aspect-video w-full" />
          <Bar className="mt-3 h-4 w-2/3" />
          <Bar className="mt-2 h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

