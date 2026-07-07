"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "./utils";

interface PaginationProps {
  totalPages: number;
  currentPage?: number;
  queryKey?: string;
  className?: string;
}

export function Pagination({ totalPages, currentPage, queryKey = "page", className }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageFromUrl = Number(searchParams.get(queryKey) ?? "1");
  const page = Math.min(Math.max(currentPage ?? pageFromUrl, 1), totalPages);

  function go(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(queryKey, String(Math.min(Math.max(nextPage, 1), totalPages)));
    router.push(`${pathname}?${params.toString()}`);
  }

  const pcPages = Array.from({ length: Math.min(totalPages, 10) }, (_, index) => index + 1);
  const mobilePages = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1);

  const pageButton = (pageNumber: number, size: "pc" | "mobile") => (
    <button
      key={`${size}-${pageNumber}`}
      type="button"
      aria-label={`${pageNumber}페이지로 이동`}
      aria-current={pageNumber === page ? "page" : undefined}
      onClick={() => go(pageNumber)}
      className={cn(
        "flex items-center justify-center rounded-sm border border-line text-sm font-semibold transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        size === "pc" ? "h-9 w-9" : "h-11 min-w-11 px-3",
        pageNumber === page ? "border-ink bg-ink text-white" : "bg-surface text-ink hover:bg-page",
      )}
    >
      {pageNumber}
    </button>
  );

  return (
    <nav aria-label="페이지네이션" className={cn("flex justify-center", className)}>
      <div className="hidden items-center gap-1 md:flex">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => go(page - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-surface text-muted hover:bg-page disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <ChevronLeft aria-hidden className="h-4 w-4" />
        </button>
        {pcPages.map((pageNumber) => pageButton(pageNumber, "pc"))}
        <button
          type="button"
          aria-label="다음 페이지"
          disabled={page >= totalPages}
          onClick={() => go(page + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-surface text-muted hover:bg-page disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <ChevronRight aria-hidden className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 md:hidden">
        {mobilePages.map((pageNumber) => pageButton(pageNumber, "mobile"))}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => go(page + 1)}
          className="flex h-11 items-center gap-1 rounded-sm border border-line bg-surface px-3 text-sm font-semibold text-ink hover:bg-page disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          다음
          <ChevronRight aria-hidden className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}

