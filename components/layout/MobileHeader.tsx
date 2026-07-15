"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Menu, Search, User } from "lucide-react";
import { Button, Input, SmartImage, Tabs } from "@/components/ui";
import { isActivePath, mobileTabItems } from "./navigation";
import { Drawer } from "./Drawer";

export function MobileHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const currentTab = mobileTabItems.find((item) => isActivePath(pathname, item.href))?.href ?? mobileTabItems[0].href;

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-sticky border-b border-line bg-surface">
        <div className="grid h-14 grid-cols-[44px_1fr_44px] items-center px-3">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setDrawerOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-sm text-ink hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Menu aria-hidden className="h-6 w-6" />
          </button>
          <Link href="/" aria-label="CLIPBee 홈" className="inline-flex min-w-0 items-center justify-center">
            <SmartImage src="/images/brand/clipbee-logo.png" alt="CLIPBee" width={231} height={53} priority className="h-7 w-auto object-contain" />
          </Link>
          <Link
            href="/mypage"
            aria-label="마이페이지"
            className="flex h-11 w-11 items-center justify-center rounded-sm text-ink hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <User aria-hidden className="h-5 w-5" />
          </Link>
        </div>
        <form onSubmit={submitSearch} className="flex gap-2 px-4 pb-2">
          <Input
            aria-label="통합 검색"
            search
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            placeholder="검색"
          />
          <Button aria-label="검색" className="h-11 w-11 px-0" leftIcon={<Search aria-hidden className="h-4 w-4" />}>
            <span className="sr-only">검색</span>
          </Button>
        </form>
        <Tabs
          ariaLabel="모바일 주 메뉴"
          variant="scroll"
          value={currentTab}
          items={mobileTabItems.map((item) => ({ label: item.label, value: item.href, href: item.href }))}
        />
      </header>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

