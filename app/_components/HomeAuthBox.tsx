"use client";

import { Badge } from "@/components/ui";
import { LoginBox } from "@/components/layout";
import { useAuth } from "@/lib/auth-context";

export function HomeAuthBox() {
  const { role, mockState } = useAuth();

  if (role === "guest") return <LoginBox />;

  const isCompany = role.includes("company") || role === "admin";

  return (
    <div className="rounded-md border border-line bg-surface p-4 shadow-card">
      <p className="text-base font-bold text-ink">{isCompany ? "기업 활동 요약" : "내 활동 요약"}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-md bg-page p-3">
          <p className="text-xs text-muted">{isCompany ? "진행 공고" : "지원"}</p>
          <p className="mt-1 text-xl font-black text-ink">{isCompany ? 6 : 3}건</p>
        </div>
        <div className="rounded-md bg-page p-3">
          <p className="text-xs text-muted">{isCompany ? "지원자" : "스크랩"}</p>
          <p className="mt-1 text-xl font-black text-ink">{isCompany ? 28 : 8}건</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {mockState.hasContactPass ? <Badge label="열람권 보유" tone="success" /> : null}
        {mockState.hasPromotion ? <Badge label="추천" /> : null}
        {isCompany ? <Badge label={mockState.verifyStatus} /> : null}
      </div>
    </div>
  );
}
