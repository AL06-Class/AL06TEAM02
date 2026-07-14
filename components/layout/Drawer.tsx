"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Accordion } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/components/ui/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

type DrawerLink = {
  label: string;
  href: string;
};

type DrawerAccordion = {
  label: string;
  children: DrawerLink[];
};

type DrawerMenuItem = DrawerLink | DrawerAccordion;

const drawerMenu: DrawerMenuItem[] = [
  { label: "공지사항", href: "/notice" },
  {
    label: "촬영자 모집",
    children: ["직종별", "지역별", "역세권별", "상세검색"].map((label) => ({
      label,
      href: label === "상세검색" ? "/jobs/search" : `/jobs/categories/${label === "직종별" ? "field" : label === "지역별" ? "region" : "subway"}`,
    })),
  },
  {
    label: "편집자 모집",
    children: ["편집 분야별", "지역별", "역세권별", "상세검색"].map((label) => ({
      label,
      href: label === "상세검색" ? "/editor-jobs/search" : `/editor-jobs/categories/${label === "편집 분야별" ? "field" : label === "지역별" ? "region" : "subway"}`,
    })),
  },
  {
    label: "촬영자 프로필",
    children: [
      { label: "직종별", href: "/profiles" },
      { label: "지역별", href: "/profiles" },
      { label: "상세검색", href: "/profiles/search" },
    ],
  },
  {
    label: "커뮤니티",
    children: [
      { label: "자유게시판", href: "/community/free" },
      { label: "피드백게시판", href: "/community/feedback" },
      { label: "공모전", href: "/community/contest" },
      { label: "운영자에게 바란다", href: "/community/suggest" },
    ],
  },
  { label: "스토어", href: "/store" },
  { label: "서비스안내", href: "/services" },
  { label: "고객센터", href: "/support" },
];

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function Drawer({ open, onClose }: DrawerProps) {
  const { role } = useAuth();
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      const focusable = panel ? Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)) : [];
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previousFocus?.focus();
    };
  }, [open, onClose]);

  return (
    <div className={cn("fixed inset-0 z-drawer transition", open ? "pointer-events-auto" : "pointer-events-none")}>
      <button
        type="button"
        aria-label="메뉴 닫기"
        onClick={onClose}
        className={cn("absolute inset-0 bg-black/50 transition", open ? "opacity-100" : "opacity-0")}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="모바일 메뉴"
        className={cn(
          "absolute left-0 top-0 h-full w-[280px] overflow-y-auto bg-surface shadow-modal transition-transform",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface p-4">
          {role === "guest" ? (
            <Link href="/login" onClick={onClose} className="text-sm font-bold text-ink">
              로그인/회원가입
            </Link>
          ) : (
            <Link href="/mypage" onClick={onClose} className="text-sm font-bold text-ink">
              홍O민님 · 마이페이지
            </Link>
          )}
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-muted hover:bg-page hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4" aria-label="드로어 메뉴">
          <div className="space-y-2">
            {drawerMenu.map((item) =>
              "children" in item ? (
                <Accordion
                  key={item.label}
                  items={[
                    {
                      title: item.label,
                      content: (
                        <div className="grid gap-2">
                          {item.children.map((child) => (
                            <Link key={child.href} href={child.href} onClick={onClose} className="text-sm text-ink hover:text-primary">
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ),
                    },
                  ]}
                />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="block rounded-md border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink hover:bg-page"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </nav>
      </aside>
    </div>
  );
}
