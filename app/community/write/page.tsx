import { Suspense } from "react";
import { CommunityWriteClient } from "./CommunityWriteClient";

export default function CommunityWritePage() {
  return (
    <Suspense fallback={<div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">글쓰기 화면을 불러오는 중입니다.</div>}>
      <CommunityWriteClient />
    </Suspense>
  );
}
