"use client";

import Link from "next/link";
import { cn } from "./utils";

export interface TabItem {
  label: string;
  value: string;
  href?: string;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange?: (value: string) => void;
  variant?: "line" | "scroll";
  ariaLabel?: string;
  className?: string;
}

export function Tabs({ items, value, onChange, variant = "line", ariaLabel = "탭", className }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "flex border-b border-line",
        variant === "scroll" && "no-scrollbar -mx-4 overflow-x-auto px-4",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.value === value;
        const commonClass = cn(
          "relative flex h-11 shrink-0 items-center px-3 text-sm font-semibold transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          active ? "text-primary" : "text-muted hover:text-ink",
        );
        const indicator = active ? <span className="absolute inset-x-3 bottom-0 h-0.5 bg-primary" /> : null;

        if (item.href) {
          return (
            <Link key={item.value} href={item.href} role="tab" aria-selected={active} className={commonClass}>
              {item.label}
              {indicator}
            </Link>
          );
        }

        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(item.value)}
            className={commonClass}
          >
            {item.label}
            {indicator}
          </button>
        );
      })}
    </div>
  );
}

