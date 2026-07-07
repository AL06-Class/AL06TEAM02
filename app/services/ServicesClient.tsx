"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Megaphone } from "lucide-react";
import { GateModal } from "@/components/shared";
import { Badge, Button, Modal, Stepper, Table, Tabs, type TableColumn } from "@/components/ui";
import { useAuth, type UserRole } from "@/lib/auth-context";
import { priceSummary, type ServiceAudience, type ServiceProductKey } from "@/lib/service-products";

type ServiceTab = "company" | "personal";

type ServiceRow = {
  key: string;
  audience: ServiceAudience;
  placement: string;
  product: string;
  description: string;
  price: string;
  action: string;
  href: string;
  productKey?: ServiceProductKey;
};

interface ServicesClientProps {
  initialTab: ServiceTab;
}

const companyRows: ServiceRow[] = [
  {
    key: "banner",
    audience: "company",
    placement: "메인",
    product: "프리미엄 배너",
    description: "메인 최상단 프리미엄 배너 출력",
    price: priceSummary("banner"),
    action: "신청",
    href: "/services/order/banner",
    productKey: "banner",
  },
  {
    key: "review",
    audience: "company",
    placement: "리스트",
    product: "모집 심사등록",
    description: "심사 후 무료 게시",
    price: "무료",
    action: "공고 등록",
    href: "/jobs/new",
  },
  {
    key: "jump",
    audience: "company",
    placement: "리스트",
    product: "자동점프",
    description: "24시간 단위 최상단 노출",
    price: priceSummary("jump"),
    action: "구매",
    href: "/services/order/jump",
    productKey: "jump",
  },
  {
    key: "contact-pass",
    audience: "company",
    placement: "프로필",
    product: "연락처 열람권",
    description: "기간 내 열람과 제안 보내기",
    price: priceSummary("contact-pass"),
    action: "구매",
    href: "/services/order/contact-pass",
    productKey: "contact-pass",
  },
];

const personalRows: ServiceRow[] = [
  {
    key: "promotion",
    audience: "personal",
    placement: "프로필 리스트/메인",
    product: "추천 촬영자 프로필",
    description: "메인 화면과 프로필 목록에 추천 프로필 노출",
    price: priceSummary("promotion"),
    action: "신청",
    href: "/services/order/promotion",
    productKey: "promotion",
  },
];

function roleMatchesAudience(role: UserRole, audience: ServiceAudience) {
  if (role === "admin") return true;
  if (audience === "personal") return role === "personal";
  return role === "company-verified";
}

export function ServicesClient({ initialTab }: ServicesClientProps) {
  const router = useRouter();
  const { role } = useAuth();
  const [loginGateOpen, setLoginGateOpen] = useState(false);
  const [verificationGateOpen, setVerificationGateOpen] = useState(false);
  const [roleModal, setRoleModal] = useState<ServiceAudience | null>(null);
  const rows = initialTab === "company" ? companyRows : personalRows;

  function request(row: ServiceRow) {
    if (role === "guest") {
      setLoginGateOpen(true);
      return;
    }
    if (row.audience === "company" && role === "company-unverified") {
      setVerificationGateOpen(true);
      return;
    }
    if (!roleMatchesAudience(role, row.audience)) {
      setRoleModal(row.audience);
      return;
    }
    router.push(row.href);
  }

  const columns: Array<TableColumn<ServiceRow>> = [
    { key: "placement", header: "위치", render: (row) => row.placement, className: "w-[120px]" },
    {
      key: "product",
      header: "상품",
      render: (row) => (
        <div>
          <p className="font-bold text-ink">{row.product}</p>
          {row.price === "무료" ? <Badge label="무료" tone="muted" className="mt-1" /> : null}
        </div>
      ),
    },
    { key: "description", header: "내용", render: (row) => <span className="text-muted">{row.description}</span> },
    { key: "price", header: "가격", render: (row) => <span className="font-semibold text-ink">{row.price}</span>, className: "md:w-[260px]" },
    {
      key: "action",
      header: "액션",
      render: (row) => (
        <Button size="sm" onClick={() => request(row)}>
          {row.action}
        </Button>
      ),
      className: "w-[110px]",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-ink max-md:text-2xl">서비스 안내</h1>
          <p className="mt-2 text-sm text-muted">촬영몬 유료 노출과 기업 전환 상품을 확인합니다.</p>
        </div>
        <Link href="/ads" className="inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:bg-page">
          광고 문의
        </Link>
      </div>

      <Tabs
        value={initialTab}
        items={[
          { label: "기업회원 서비스", value: "company", href: "/services?tab=company" },
          { label: "개인회원 서비스", value: "personal", href: "/services?tab=personal" },
        ]}
      />

      <Table columns={columns} rows={rows} getRowKey={(row) => row.key} />

      <section className="rounded-md border border-line bg-surface p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-ink">광고 집행 프로세스</h2>
            <p className="mt-1 text-sm text-muted">신청부터 집행까지 검수 흐름을 기준으로 진행합니다.</p>
          </div>
          <Megaphone aria-hidden className="h-8 w-8 text-primary" />
        </div>
        <Stepper className="mt-5" steps={["신청", "소재 제출", "검수", "집행"]} currentStep={0} />
        <div className="mt-5">
          <Link href="/ads" className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark">
            광고 문의
          </Link>
        </div>
      </section>

      <GateModal type="login" open={loginGateOpen} onClose={() => setLoginGateOpen(false)} />
      <GateModal type="verification" open={verificationGateOpen} onClose={() => setVerificationGateOpen(false)} />
      <Modal
        open={roleModal !== null}
        title={roleModal === "personal" ? "개인회원 전용 상품입니다" : "기업회원 전용 상품입니다"}
        description={roleModal === "personal" ? "추천 프로필은 개인회원만 신청할 수 있습니다." : "기업 상품은 인증된 기업회원만 이용할 수 있습니다."}
        onClose={() => setRoleModal(null)}
      >
        <Button variant="secondary" className="w-full" onClick={() => setRoleModal(null)}>
          확인
        </Button>
      </Modal>
    </div>
  );
}
