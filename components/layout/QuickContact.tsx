"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui";

export function QuickContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-sticky hidden lg:block">
      {open ? (
        <div className="mb-3 w-64 rounded-md border border-line bg-surface p-4 shadow-modal">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-ink">빠른 문의</p>
            <button
              type="button"
              aria-label="빠른 문의 닫기"
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-sm text-muted hover:bg-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-sm text-muted">카카오 채널과 고객센터로 연결합니다.</p>
          <div className="mt-4 grid gap-2">
            <Button variant="kakao" size="sm">
              카카오 채널
            </Button>
            <Button variant="secondary" size="sm">
              고객센터
            </Button>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        aria-label="빠른 문의 열기"
        onClick={() => setOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-modal transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <MessageCircle aria-hidden className="h-6 w-6" />
      </button>
    </div>
  );
}

