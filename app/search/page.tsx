import { Suspense } from "react";
import { SearchPageClient } from "./SearchPageClient";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">검색 결과를 불러오는 중입니다.</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
