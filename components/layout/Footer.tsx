"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button, useToast } from "@/components/ui";
import { readStorageString, storageKeys, writeStorageString } from "@/lib/storage";

const footerLinks = [
  { label: "회사소개", href: "/about" },
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "회원약관", href: "/terms" },
  { label: "고객센터", href: "/support" },
  { label: "제휴·광고문의", href: "/ads" },
];

export function Footer() {
  const { showToast } = useToast();

  useEffect(() => {
    const mode = readStorageString(storageKeys.viewMode);
    if (mode === "desktop") {
      document.documentElement.dataset.viewMode = "desktop";
    }
  }, []);

  function showPcVersion() {
    writeStorageString(storageKeys.viewMode, "desktop");
    document.documentElement.dataset.viewMode = "desktop";
    showToast("PC버전 보기 모드가 적용되었습니다.");
  }

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1180px] px-4 py-8">
        <div className="mb-5 flex justify-center md:hidden">
          <Button variant="secondary" size="lg" onClick={showPcVersion}>
            PC버전 보기
          </Button>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-ink">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-4 space-y-1 text-xs leading-5 text-muted">
          <p>CLIPBee 주식회사(가칭) · 사업자 정보 및 계좌 안내는 시연용입니다.</p>
          <p>Copyright CLIPBee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
