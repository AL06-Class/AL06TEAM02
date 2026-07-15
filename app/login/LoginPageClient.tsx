"use client";

import { useSearchParams } from "next/navigation";
import { LoginBox } from "@/components/layout";

export function LoginPageClient() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? undefined;
  const companyEntry = redirectTo?.startsWith("/mypage/jobs") || redirectTo?.startsWith("/jobs/new") || redirectTo?.startsWith("/editor-jobs/new");

  return (
    <div className="mx-auto flex min-h-[560px] w-full max-w-[400px] flex-col justify-center">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-black text-ink">로그인</h1>
        <p className="mt-2 text-sm text-muted">촬영몬 데모 계정으로 역할을 선택해 시작합니다.</p>
      </div>
      <LoginBox companyRole="company-verified" redirectTo={redirectTo} defaultMemberType={companyEntry ? "company" : "personal"} />
    </div>
  );
}
