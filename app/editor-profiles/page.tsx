import { Suspense } from "react";
import { EditorProfilesPageClient } from "./EditorProfilesPageClient";

export default function EditorProfilesPage() {
  return (
    <Suspense fallback={<div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">편집자 프로필을 불러오는 중입니다.</div>}>
      <EditorProfilesPageClient />
    </Suspense>
  );
}
