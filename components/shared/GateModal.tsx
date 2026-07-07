"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge, Button, Modal } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/components/ui/utils";

export type GateModalType = "login" | "contact-pass" | "verification";

interface GateModalProps {
  type: GateModalType;
  open: boolean;
  onClose: () => void;
}

const linkButtonClass =
  "inline-flex h-10 w-full items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

export function GateModal({ type, open, onClose }: GateModalProps) {
  const pathname = usePathname();
  const { mockState } = useAuth();
  const redirect = encodeURIComponent(pathname);
  const content = {
    login: {
      title: "로그인이 필요합니다",
      description: "현재 페이지를 유지한 뒤 로그인 화면으로 이동합니다.",
      href: `/login?redirect=${redirect}`,
      action: "로그인",
    },
    "contact-pass": {
      title: "연락처 열람권이 필요합니다",
      description: "기업회원 열람권으로 촬영자 연락처를 확인할 수 있습니다.",
      href: "/services/order/contact-pass",
      action: "열람권 구매",
    },
    verification: {
      title: "기업 인증 후 이용할 수 있습니다",
      description: "기업 인증을 완료하면 공고 등록과 유료 상품을 이용할 수 있습니다.",
      href: "/mypage/verification",
      action: "인증하러 가기",
    },
  }[type];

  return (
    <Modal open={open} title={content.title} description={content.description} onClose={onClose}>
      {type === "contact-pass" ? (
        <div className="mb-5 grid grid-cols-3 gap-2 text-center text-xs text-muted">
          {[
            ["1일", "6,900원"],
            ["1주", "27,000원"],
            ["3개월", "169,000원"],
          ].map(([period, price]) => (
            <div key={period} className="rounded-md border border-line bg-page p-3">
              <p className="font-bold text-ink">{period}</p>
              <p className="mt-1 tabular-nums">{price}</p>
            </div>
          ))}
        </div>
      ) : null}

      {type === "verification" ? (
        <div className="mb-5 flex items-center justify-between rounded-md border border-line bg-page p-3 text-sm">
          <span className="font-semibold text-ink">현재 상태</span>
          <Badge label={mockState.verifyStatus} />
        </div>
      ) : null}

      <div className="grid gap-3">
        <Link href={content.href} onClick={onClose} className={linkButtonClass}>
          {content.action}
        </Link>
        {type === "login" ? (
          <Link href={`/signup?redirect=${redirect}`} onClick={onClose} className="text-center text-sm font-semibold text-muted hover:text-primary">
            회원가입
          </Link>
        ) : null}
        <Button variant="secondary" onClick={onClose} className={cn(type === "login" && "mt-0")}>
          닫기
        </Button>
      </div>
    </Modal>
  );
}

