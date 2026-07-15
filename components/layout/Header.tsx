"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LogOut, Search } from "lucide-react";
import { Button, Input, SmartImage } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { isActivePath, mainNavItems, utilityItems } from "./navigation";

const roleName = {
  guest: "비회원",
  personal: "홍O민님",
  "company-unverified": "촬영몬스튜디오님",
  "company-verified": "촬영몬스튜디오님",
  admin: "관리자님",
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, resetAuth } = useAuth();
  const [query, setQuery] = useState("");

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <header className="border-b border-line bg-surface">
      <div className="border-b border-line">
        <div className="mx-auto flex h-9 max-w-[1180px] items-center justify-between px-4 text-xs text-muted">
          <Link
            href="/"
            aria-label="CLIPBee 홈"
            className="inline-flex h-full items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <SmartImage src="/images/brand/clipbee-logo.png" alt="CLIPBee" width={231} height={53} priority className="h-7 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            {utilityItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-primary">
                {item.label}
              </Link>
            ))}
            {role === "admin" ? (
              <Link href="/admin" className="font-bold text-primary hover:text-primary-dark">
                관리자 화면
              </Link>
            ) : null}
            <span className="text-line">|</span>
            {role === "guest" ? (
              <Link href="/login" className="font-semibold text-ink hover:text-primary">
                로그인
              </Link>
            ) : (
              <button
                type="button"
                onClick={resetAuth}
                className="inline-flex items-center gap-1 font-semibold text-ink hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {roleName[role]}
                <LogOut aria-hidden className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-[52px] max-w-[1180px] items-center justify-between gap-5 px-4">
        <nav aria-label="주 메뉴" className="flex h-full items-center gap-1">
          {mainNavItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex h-full items-center px-3 text-sm font-bold text-ink transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <span className={active ? "text-primary" : undefined}>{item.label}</span>
                {active ? <span className="absolute inset-x-3 bottom-0 h-0.5 bg-primary" /> : null}
              </Link>
            );
          })}
        </nav>
        <form onSubmit={submitSearch} className="flex w-[230px] items-center gap-2">
          <Input
            aria-label="통합 검색"
            search
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            placeholder="검색"
          />
          <Button aria-label="검색" size="md" className="h-10 w-10 px-0" leftIcon={<Search aria-hidden className="h-4 w-4" />}>
            <span className="sr-only">검색</span>
          </Button>
        </form>
      </div>
      <div className="h-1 bg-primary" />
    </header>
  );
}
