import { Suspense } from "react";
import { ProfilesPageClient } from "./ProfilesPageClient";

export default function ProfilesPage() {
  return (
    <Suspense fallback={<div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">프로필 목록을 불러오는 중입니다.</div>}>
      <ProfilesPageClient />
    </Suspense>
  );
}
