"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button, FileUpload, Input, Select, Textarea, useToast } from "@/components/ui";
import { cn } from "@/components/ui/utils";
import { companyMembers, personalMembers } from "@/data/members";
import { products } from "@/data/products";
import { profiles } from "@/data/profiles";
import { formatKrw } from "@/lib/format";
import { useAuth } from "@/lib/auth-context";
import { appendStorageItem, readStorageJSON, storageKeys, writeStorageJSON } from "@/lib/storage";

type Product = (typeof products)[number] & { status?: string };

const refundTemplate = "작업 착수 전 전액 환불, 착수 후에는 진행률에 따라 부분 환불됩니다. 디지털 산출물 납품 후 단순 변심 환불은 제한됩니다.";
const storePlaceholder = "/images/presets/placeholders/shootmon-placeholder-store-01.svg";
const linkPrimaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark";
const linkSecondaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:bg-page";

const categories = Array.from(new Set(products.map((product) => product.category)));

export function StoreNewForm() {
  const router = useRouter();
  const { role, isReady } = useAuth();
  const { showToast } = useToast();
  const sellerName = useMemo(() => (role === "personal" ? profiles.find((profile) => profile.maskedName === personalMembers[0].maskedName)?.maskedName ?? personalMembers[0].maskedName : companyMembers[0].companyName), [role]);
  const [files, setFiles] = useState<File[]>([]);
  const [draft, setDraft] = useState({
    category: "",
    name: "",
    price: "",
    serviceScope: "",
    process: "",
    delivery: "",
    revisions: "",
    commercialUse: "가능",
    refundPolicy: refundTemplate,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (isReady && role === "guest") {
      router.replace(`/login?redirect=${encodeURIComponent("/store/new")}`);
    }
  }, [isReady, role, router]);

  function update(key: keyof typeof draft, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!draft.category) next.category = "카테고리를 선택해 주세요.";
    if (!draft.name.trim()) next.name = "상품명을 입력해 주세요.";
    if (files.length === 0) next.image = "대표 이미지를 업로드해 주세요.";
    if (!draft.price.trim() || Number(draft.price) <= 0) next.price = "가격을 입력해 주세요.";
    if (!draft.serviceScope.trim()) next.serviceScope = "서비스 내용을 입력해 주세요.";
    if (!draft.delivery.trim()) next.delivery = "납기를 입력해 주세요.";
    if (!draft.revisions.trim()) next.revisions = "수정 횟수를 입력해 주세요.";
    if (!draft.commercialUse) next.commercialUse = "상업적 이용 가능 여부를 선택해 주세요.";
    if (!draft.refundPolicy.trim()) next.refundPolicy = "환불 규정을 입력해 주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      showToast("필수 항목을 확인해 주세요.", "error");
      return;
    }

    const id = Date.now();
    const product: Product = {
      id,
      name: draft.name.trim(),
      category: draft.category,
      sellerName,
      price: Number(draft.price),
      rating: 0,
      likes: 0,
      serviceScope: draft.serviceScope.trim(),
      process: draft.process.trim() || "주문 확인 → 세부 조건 협의 → 작업 진행 → 납품",
      delivery: draft.delivery.trim(),
      revisions: draft.revisions.trim(),
      commercialUse: draft.commercialUse === "가능",
      refundPolicy: draft.refundPolicy.trim(),
      image: storePlaceholder,
      createdAt: new Date().toISOString(),
      status: "검수중",
    };
    appendStorageItem<Product>(storageKeys.storeProducts, product);
    const statuses = readStorageJSON<Record<string, string>>(storageKeys.mypageProductStatuses, {});
    writeStorageJSON(storageKeys.mypageProductStatuses, { ...statuses, [id]: "검수중" });
    setComplete(true);
    showToast("상품 검수 요청이 접수되었습니다.");
  }

  if (!isReady || role === "guest") {
    return <div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">상품 등록 권한을 확인하는 중입니다.</div>;
  }

  if (complete) {
    return (
      <div className="mx-auto max-w-[640px] rounded-md border border-line bg-surface p-6 text-center shadow-card">
        <CheckCircle2 aria-hidden className="mx-auto h-12 w-12 text-success" />
        <h1 className="mt-4 text-2xl font-black text-ink">상품 등록 요청이 접수되었습니다</h1>
        <p className="mt-2 text-sm text-muted">검수 후 공개됩니다. 마이페이지 내 상품에서 상태를 확인하세요.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/mypage/products" className={linkPrimaryClass}>
            내 상품 보기
          </Link>
          <Link href="/store" className={linkSecondaryClass}>
            스토어로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-[820px] space-y-5">
      <div>
        <h1 className="text-3xl font-black text-ink max-md:text-2xl">스토어 상품 등록</h1>
        <p className="mt-2 text-sm text-muted">판매자는 {sellerName}으로 저장되며 검수 후 공개됩니다.</p>
      </div>

      <section className="rounded-md border border-line bg-surface p-5 shadow-card">
        <div className="grid gap-4 md:grid-cols-2">
          <Select label="카테고리" requiredMark value={draft.category} onChange={(event) => update("category", event.target.value)} error={errors.category} options={[{ label: "선택", value: "" }, ...categories.map((value) => ({ label: value, value }))]} />
          <Input label="상품명" requiredMark value={draft.name} onChange={(event) => update("name", event.target.value)} error={errors.name} />
          <Input label="가격" requiredMark type="number" min={0} value={draft.price} onChange={(event) => update("price", event.target.value)} error={errors.price} helperText={draft.price ? formatKrw(Number(draft.price)) : undefined} />
          <Select label="상업적 이용" requiredMark value={draft.commercialUse} onChange={(event) => update("commercialUse", event.target.value)} error={errors.commercialUse} options={["가능", "불가"].map((value) => ({ label: value, value }))} />
          <div className="md:col-span-2">
            <FileUpload label="대표 이미지" multiple={false} onChange={setFiles} />
            {errors.image ? <p className="mt-1.5 text-xs text-danger">{errors.image}</p> : null}
          </div>
        </div>
      </section>

      <section className="rounded-md border border-line bg-surface p-5 shadow-card">
        <div className="grid gap-4">
          <Textarea label="서비스 내용" requiredMark rows={5} value={draft.serviceScope} onChange={(event) => update("serviceScope", event.target.value)} error={errors.serviceScope} />
          <Textarea label="작업 과정" rows={4} value={draft.process} onChange={(event) => update("process", event.target.value)} placeholder="주문 확인 → 세부 협의 → 작업 → 납품" />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="납기" requiredMark value={draft.delivery} onChange={(event) => update("delivery", event.target.value)} error={errors.delivery} placeholder="예: 주문 후 7일" />
            <Input label="수정 횟수" requiredMark value={draft.revisions} onChange={(event) => update("revisions", event.target.value)} error={errors.revisions} placeholder="예: 2회 무료" />
          </div>
          <Textarea label="환불 규정" requiredMark rows={5} value={draft.refundPolicy} onChange={(event) => update("refundPolicy", event.target.value)} error={errors.refundPolicy} />
        </div>
      </section>

      <div className="flex justify-end gap-2 rounded-md border border-line bg-surface p-5 shadow-card">
        <Button type="submit">등록(검수 요청)</Button>
      </div>
    </form>
  );
}

function GuardCard({ title, description, href, action }: { title: string; description: string; href: string; action: string }) {
  return (
    <div className="mx-auto max-w-[520px] rounded-md border border-line bg-surface p-6 text-center shadow-card">
      <AlertTriangle aria-hidden className="mx-auto h-10 w-10 text-warning" />
      <h1 className="mt-4 text-2xl font-black text-ink">{title}</h1>
      <p className="mt-2 text-sm text-muted">{description}</p>
      <Link href={href} className={cn(linkPrimaryClass, "mt-6")}>
        {action}
      </Link>
    </div>
  );
}
