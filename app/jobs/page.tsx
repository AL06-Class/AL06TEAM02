import { Suspense } from "react";
import { JobsPageClient } from "./JobsPageClient";

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">모집 목록을 불러오는 중입니다.</div>}>
      <JobsPageClient />
    </Suspense>
  );
}
