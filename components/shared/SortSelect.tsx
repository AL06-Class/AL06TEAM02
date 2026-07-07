"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui";

interface SortSelectProps {
  options: readonly { label: string; value: string }[];
  defaultValue?: string;
  label?: string;
}

export function SortSelect({ options, defaultValue = "recent", label = "정렬" }: SortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get("sort") ?? defaultValue;

  function change(nextValue: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextValue === defaultValue) {
      params.delete("sort");
    } else {
      params.set("sort", nextValue);
    }
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <Select
      aria-label={label}
      value={value}
      onChange={(event) => change(event.target.value)}
      options={options.map((option) => ({ label: option.label, value: option.value }))}
      className="min-w-[140px]"
    />
  );
}
