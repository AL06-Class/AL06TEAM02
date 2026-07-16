"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge, Button, Checkbox, Modal, Radio, Stepper, useToast } from "@/components/ui";
import { useAuth, type UserRole } from "@/lib/auth-context";
import { CONTACT_PASS_VALIDITY_HOURS } from "@/lib/policy";
import { formatDate, formatKrw } from "@/lib/format";
import { appendStorageItem, storageKeys } from "@/lib/storage";
import { getServiceProduct, quantityFromLabel, type ServiceAudience, type ServiceProductKey } from "@/lib/service-products";

interface OrderFlowProps {
  productKey: ServiceProductKey;
}

interface PaymentRecord {
  id: string;
  productKey: ServiceProductKey;
  productName: string;
  optionLabel: string;
  amount: number;
  paidAt: string;
}

const linkPrimaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark";
const linkSecondaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:bg-page";

function roleMatchesAudience(role: UserRole, audience: ServiceAudience) {
  if (role === "admin") return true;
  if (audience === "personal") return role === "personal";
  return role === "company-verified";
}

function contactPassExpiry(label: string) {
  const quantity = quantityFromLabel(label);
  const days = label.includes("개월") ? quantity * 30 : label.includes("주") ? quantity * 7 : quantity;
  return new Date(Date.now() + days * CONTACT_PASS_VALIDITY_HOURS * 60 * 60 * 1000).toISOString();
}

function completionAction(productKey: ServiceProductKey) {
  if (productKey === "contact-pass") {
    return { href: "/profiles", label: "프로필 보러가기", note: "" };
  }
  if (productKey === "jump") {
    return { href: "/mypage/jump", label: "점프 설정하기", note: "마이페이지에서 활성화가 필요합니다." };
  }
  if (productKey === "banner") {
    return { href: "/mypage/banners", label: "소재 등록하기", note: "배너 상태는 검수중으로 표시됩니다." };
  }
  return { href: "/mypage/profile", label: "내 프로필 확인", note: "" };
}

export function OrderFlow({ productKey }: OrderFlowProps) {
  const product = useMemo(() => getServiceProduct(productKey), [productKey]);
  const { role, isReady, mockState, setMockState } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const selected = product.prices[selectedIndex];
  const action = completionAction(productKey);

  function completePayment() {
    if (!agreed) {
      showToast("약관 동의가 필요합니다.", "error");
      return;
    }

    const paidAt = new Date().toISOString();
    const quantity = quantityFromLabel(selected.label);
    const nextState =
      productKey === "contact-pass"
        ? { hasContactPass: true, contactPassExpiry: contactPassExpiry(selected.label) }
        : productKey === "jump"
          ? { jumpCredits: mockState.jumpCredits + quantity }
          : productKey === "promotion"
            ? { hasPromotion: true }
            : { hasBanner: true, bannerStatus: "검수중" as const };

    setMockState(nextState);
    appendStorageItem<PaymentRecord>(storageKeys.payments, {
      id: `pay-${Date.now()}`,
      productKey,
      productName: product.name,
      optionLabel: selected.label,
      amount: selected.amount,
      paidAt,
    });
    setStep(2);
    showToast("테스트 결제가 완료되었습니다.");
  }

  if (!isReady) {
    return <div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">주문 정보를 확인하는 중입니다.</div>;
  }

  if (role === "guest") {
    return (
      <GuardCard
        title="로그인이 필요합니다"
        description="유료상품 주문은 로그인 후 이용할 수 있습니다."
        href={`/login?redirect=${encodeURIComponent(`/services/order/${productKey}`)}`}
        action="로그인"
      />
    );
  }

  if (product.audience === "company" && role === "company-unverified") {
    return <GuardCard title="기업 인증 후 구매할 수 있습니다" description="기업 인증을 완료하면 유료 상품을 이용할 수 있습니다." href="/mypage/verification" action="인증하러 가기" />;
  }

  if (!roleMatchesAudience(role, product.audience)) {
    return (
      <>
        <GuardCard
          title={product.audience === "personal" ? "개인회원 전용 상품입니다" : "기업회원 전용 상품입니다"}
          description={product.audience === "personal" ? "추천 프로필은 개인회원만 신청할 수 있습니다." : "기업 상품은 인증된 기업회원만 이용할 수 있습니다."}
          href="/services"
          action="서비스 안내로"
          onClick={() => setRoleModalOpen(true)}
        />
        <Modal open={roleModalOpen} title="역할을 확인해 주세요" description="데모 역할 스위처 또는 로그인에서 역할을 바꾼 뒤 다시 시도할 수 있습니다." onClose={() => setRoleModalOpen(false)}>
          <Button variant="secondary" className="w-full" onClick={() => setRoleModalOpen(false)}>
            확인
          </Button>
        </Modal>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-[860px] space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ink max-md:text-2xl">{product.name} 주문</h1>
        <p className="mt-2 text-sm text-muted">{product.description}</p>
      </div>

      <div className="rounded-md border border-line bg-surface p-5 shadow-card">
        <Stepper steps={["옵션 선택", "주문 확인", "완료"]} currentStep={step} />
      </div>

      {step === 0 ? (
        <section className="rounded-md border border-line bg-surface p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-ink">옵션 선택</h2>
              <p className="mt-1 text-sm text-muted">{product.placement}</p>
            </div>
            <Badge label={product.audience === "company" ? "기업회원" : "개인회원"} tone="primary" />
          </div>
          <div className="mt-5 grid gap-3">
            {product.prices.map((price, index) => (
              <Radio
                key={price.label}
                card
                name="orderOption"
                value={price.label}
                checked={selectedIndex === index}
                onChange={() => setSelectedIndex(index)}
                label={
                  <span className="flex w-full items-center justify-between gap-3">
                    <span>{price.label}</span>
                    <strong>{formatKrw(price.amount)}</strong>
                  </span>
                }
              />
            ))}
          </div>
          <div className="mt-5 flex justify-end">
            <Button onClick={() => setStep(1)}>다음</Button>
          </div>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="rounded-md border border-line bg-surface p-5 shadow-card">
          <h2 className="text-lg font-bold text-ink">주문 확인</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <InfoBox label="구매자" value={role === "personal" ? "홍O민 개인회원" : "CLIPBee 스튜디오 기업회원"} />
            <InfoBox label="결제수단" value="테스트 결제" />
          </div>
          <div className="mt-5 overflow-hidden rounded-md border border-line">
            <div className="grid grid-cols-[1fr_120px_140px] bg-page px-4 py-3 text-sm font-bold text-muted max-md:grid-cols-1 max-md:gap-1">
              <span>상품</span>
              <span>옵션</span>
              <span className="text-right max-md:text-left">금액</span>
            </div>
            <div className="grid grid-cols-[1fr_120px_140px] px-4 py-4 text-sm text-ink max-md:grid-cols-1 max-md:gap-1">
              <span className="font-semibold">{product.name}</span>
              <span>{selected.label}</span>
              <strong className="text-right max-md:text-left">{formatKrw(selected.amount)}</strong>
            </div>
          </div>
          <Checkbox className="mt-5" label="테스트 결제 및 유료상품 이용 조건에 동의합니다." checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={() => setStep(0)}>
              이전
            </Button>
            <Button onClick={completePayment}>테스트 결제</Button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="rounded-md border border-line bg-surface p-6 text-center shadow-card">
          <CheckCircle2 aria-hidden className="mx-auto h-12 w-12 text-success" />
          <h2 className="mt-4 text-2xl font-black text-ink">결제가 완료되었습니다</h2>
          <p className="mt-2 text-sm text-muted">
            {product.name} · {selected.label} · {formatKrw(selected.amount)}
          </p>
          {productKey === "contact-pass" ? <p className="mt-2 text-sm font-semibold text-success">만료일: {formatDate(mockState.contactPassExpiry ?? new Date())}</p> : null}
          {action.note ? (
            <div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 rounded-md border border-warning bg-warning-soft px-4 py-3 text-sm font-semibold text-warning">
              <AlertTriangle aria-hidden className="h-4 w-4" />
              {action.note}
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={action.href} className={linkPrimaryClass}>
              {action.label}
            </Link>
            <Link href="/services" className={linkSecondaryClass}>
              서비스 안내로
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-page p-4">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-1 text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

function GuardCard({ title, description, href, action, onClick }: { title: string; description: string; href: string; action: string; onClick?: () => void }) {
  return (
    <div className="mx-auto max-w-[520px] rounded-md border border-line bg-surface p-6 text-center shadow-card">
      <AlertTriangle aria-hidden className="mx-auto h-10 w-10 text-warning" />
      <h1 className="mt-4 text-2xl font-black text-ink">{title}</h1>
      <p className="mt-2 text-sm text-muted">{description}</p>
      <Link href={href} onClick={onClick} className="mt-6 inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark">
        {action}
      </Link>
    </div>
  );
}
