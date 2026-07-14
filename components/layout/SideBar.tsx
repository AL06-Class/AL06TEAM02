"use client";

import Link from "next/link";
import { Accordion, Badge } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { LoginBox } from "./LoginBox";

export function SideBar() {
  const { role, mockState } = useAuth();
  const loggedIn = role !== "guest";

  return (
    <aside className="w-[220px] shrink-0 space-y-4">
      {loggedIn ? (
        <div className="rounded-md border border-line bg-surface p-4 shadow-card">
          <p className="text-sm font-bold text-ink">{role === "personal" ? "내 활동 요약" : "기업 활동 요약"}</p>
          <div className="mt-3 grid gap-2 text-sm text-muted">
            <span>지원/제안 3건</span>
            <span>스크랩 8건</span>
            {role.includes("company") || role === "admin" ? <span>점프 크레딧 {mockState.jumpCredits}건</span> : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {mockState.hasContactPass ? <Badge label="열람권 보유" tone="success" /> : null}
            {mockState.hasPromotion ? <Badge label="추천" /> : null}
            {role.includes("company") ? <Badge label={mockState.verifyStatus} /> : null}
          </div>
        </div>
      ) : (
        <LoginBox />
      )}
      <Accordion
        items={[
          {
            title: "촬영자 모집",
            defaultOpen: true,
            content: (
              <div className="grid gap-2">
                <Link href="/jobs" className="hover:text-primary">
                  전체 모집
                </Link>
                <Link href="/jobs/categories/field" className="hover:text-primary">
                  촬영 분야별
                </Link>
                <Link href="/jobs/categories/region" className="hover:text-primary">
                  지역별
                </Link>
                <Link href="/jobs/search" className="hover:text-primary">
                  상세검색
                </Link>
              </div>
            ),
          },
          {
            title: "촬영자 프로필",
            content: (
              <div className="grid gap-2">
                <Link href="/profiles" className="hover:text-primary">
                  전체 프로필
                </Link>
                <Link href="/profiles/search" className="hover:text-primary">
                  상세검색
                </Link>
              </div>
            ),
          },
          {
            title: "편집자 프로필",
            content: (
              <div className="grid gap-2">
                <Link href="/editor-profiles" className="hover:text-primary">
                  전체 프로필
                </Link>
                <Link href="/editor-profiles/search" className="hover:text-primary">
                  상세검색
                </Link>
              </div>
            ),
          },
        ]}
      />
    </aside>
  );
}
