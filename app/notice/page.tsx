import { Suspense } from "react";
import { NoticePageClient } from "./NoticePageClient";

export default function NoticePage() {
  return (
    <Suspense fallback={<div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">공지사항을 불러오는 중입니다.</div>}>
      <NoticePageClient />
    </Suspense>
  );
}
