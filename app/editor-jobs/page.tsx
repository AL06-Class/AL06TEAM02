import { Suspense } from "react";
import { EditorJobsPageClient } from "./EditorJobsPageClient";

export default function EditorJobsPage() {
  return (
    <Suspense fallback={<div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">편집자 모집 목록을 불러오는 중입니다.</div>}>
      <EditorJobsPageClient />
    </Suspense>
  );
}
