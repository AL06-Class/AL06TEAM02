import { Suspense } from "react";
import { StorePageClient } from "./StorePageClient";

export default function StorePage() {
  return (
    <Suspense fallback={<div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">스토어를 불러오는 중입니다.</div>}>
      <StorePageClient />
    </Suspense>
  );
}
