"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./utils";

export interface AccordionItem {
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openItems, setOpenItems] = useState(() => items.map((item) => Boolean(item.defaultOpen)));

  return (
    <div className={cn("divide-y divide-line rounded-md border border-line bg-surface", className)}>
      {items.map((item, index) => {
        const open = openItems[index];
        return (
          <div key={item.title}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() =>
                setOpenItems((current) => current.map((value, itemIndex) => (itemIndex === index ? !value : value)))
              }
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-ink hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
            >
              {item.title}
              <ChevronDown aria-hidden className={cn("h-4 w-4 text-muted transition", open && "rotate-180")} />
            </button>
            {open ? <div className="px-4 pb-4 text-sm text-muted">{item.content}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

