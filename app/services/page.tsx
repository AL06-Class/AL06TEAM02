import { Suspense } from "react";
import { ServicesPageClient } from "./ServicesPageClient";

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">서비스 안내를 불러오는 중입니다.</div>}>
      <ServicesPageClient />
    </Suspense>
  );
}
