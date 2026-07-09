import { Suspense } from "react";
import { SignupPageClient } from "./SignupPageClient";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">회원가입 화면을 불러오는 중입니다.</div>}>
      <SignupPageClient />
    </Suspense>
  );
}
