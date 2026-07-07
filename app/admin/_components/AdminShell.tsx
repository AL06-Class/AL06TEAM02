"use client";

import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Bell, BriefcaseBusiness, Building2, Flag, Search, ShieldCheck, Store, UserRound } from "lucide-react";
import { Badge, Input } from "@/components/ui";
import { cn } from "@/components/ui/utils";
import { useAuth } from "@/lib/auth-context";
import { getJobRows, getProfileRows, getReports, getStorePendingCount, getVerificationRows } from "@/lib/admin-storage";

interface AdminCounts {
  verifications: number;
  jobs: number;
  profiles: number;
  store: number;
  reports: number;
}

const menu = [
  { label: "대시보드", href: "/admin", icon: ShieldCheck, key: "dashboard" },
  { label: "기업 인증", href: "/admin/verifications", icon: Building2, key: "verifications" },
  { label: "공고 심사", href: "/admin/jobs", icon: BriefcaseBusiness, key: "jobs" },
  { label: "프로필 검수", href: "/admin/profiles", icon: UserRound, key: "profiles" },
  { label: "스토어 검수", href: "/admin/store", icon: Store, key: "store" },
  { label: "신고 관리", href: "/admin/reports", icon: Flag, key: "reports" },
] as const;

function loadCounts(): AdminCounts {
  return {
    verifications: getVerificationRows().filter((item) => item.status === "검수중").length,
    jobs: getJobRows().filter((item) => item.status === "심사중").length,
    profiles: getProfileRows().filter((item) => item.status === "검수중").length,
    store: getStorePendingCount(),
    reports: getReports().filter((item) => item.status === "접수" || item.status === "검토중").length,
  };
}

function menuCount(key: string, counts: AdminCounts) {
  if (key === "verifications") return counts.verifications;
  if (key === "jobs") return counts.jobs;
  if (key === "profiles") return counts.profiles;
  if (key === "store") return counts.store;
  if (key === "reports") return counts.reports;
  return 0;
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { role, isReady } = useAuth();
  const [counts, setCounts] = useState<AdminCounts>(() => ({ verifications: 0, jobs: 0, profiles: 0, store: 0, reports: 0 }));
  const pendingTotal = useMemo(() => counts.verifications + counts.jobs + counts.profiles + counts.store + counts.reports, [counts]);

  useEffect(() => {
    if (isReady && role === "admin") setCounts(loadCounts());
  }, [isReady, role, pathname]);

  if (!isReady) {
    return <div className="min-h-svh bg-page" />;
  }

  if (role !== "admin") {
    notFound();
  }

  return (
    <div className="min-h-svh bg-page text-ink lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="bg-ink text-white lg:sticky lg:top-0 lg:h-svh">
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link href="/admin" className="text-lg font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            촬영몬 관리자
          </Link>
          <Badge label={String(pendingTotal)} tone="warning" />
        </div>
        <nav className="space-y-6 px-3 py-5">
          <div>
            <p className="px-3 text-xs font-bold text-white/45">심사</p>
            <div className="mt-2 space-y-1">
              {menu.map((item) => {
                const Icon = item.icon;
                const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                const count = menuCount(item.key, counts);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex h-10 items-center gap-2 rounded-sm px-3 text-sm font-semibold transition",
                      active ? "bg-white text-ink" : "text-white/70 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon aria-hidden className="h-4 w-4" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {count > 0 ? <Badge label={String(count)} tone="warning" /> : null}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="border-t border-white/10 pt-5">
            <p className="px-3 text-xs font-bold text-white/45">운영</p>
            <div className="mt-2 space-y-1 px-3 py-2 text-sm font-semibold text-white/40">
              회원 관리 · 게시판 · 결제 · 공지
            </div>
          </div>
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-sticky border-b border-line bg-surface/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-5">
            <div className="w-full max-w-md">
              <Input aria-label="관리자 통합검색" search placeholder="통합검색" />
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold">
              <span className="inline-flex items-center gap-1 text-muted">
                <Bell aria-hidden className="h-4 w-4 text-warning" />
                심사대기 {pendingTotal}
              </span>
              <span className="rounded-sm bg-page px-3 py-1.5 text-ink">관리자님</span>
            </div>
          </div>
        </header>
        <main className="px-5 py-6">{children}</main>
      </div>
    </div>
  );
}

