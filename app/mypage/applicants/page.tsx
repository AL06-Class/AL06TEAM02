import { Suspense } from "react";
import { MyApplicantsPageClient } from "./MyApplicantsPageClient";

export default function MyApplicantsPage() {
  return (
    <Suspense fallback={<div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">지원자 정보를 불러오는 중입니다.</div>}>
      <MyApplicantsPageClient />
    </Suspense>
  );
}
