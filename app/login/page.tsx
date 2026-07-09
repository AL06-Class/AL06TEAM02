import { Suspense } from "react";
import { LoginPageClient } from "./LoginPageClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">로그인 화면을 불러오는 중입니다.</div>}>
      <LoginPageClient />
    </Suspense>
  );
}
