"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Chip } from "@/components/ui";

export interface AppliedFilterChip {
  param: string;
  value: string;
  label: string;
}

interface AppliedFilterChipsProps {
  items: AppliedFilterChip[];
  className?: string;
}

export function AppliedFilterChips({ items, className }: AppliedFilterChipsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function remove(item: AppliedFilterChip) {
    const params = new URLSearchParams(searchParams.toString());
    const values = params.getAll(item.param).flatMap((value) => value.split(",")).filter(Boolean);
    params.delete(item.param);
    for (const value of values.filter((value) => value !== item.value)) {
      params.append(item.param, value);
    }
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  if (items.length === 0) return null;

  return (
    <div className={className ?? "flex flex-wrap gap-2"}>
      {items.map((item) => (
        <Chip key={`${item.param}-${item.value}`} label={item.label} onRemove={() => remove(item)} />
      ))}
    </div>
  );
}
