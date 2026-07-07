"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Flag, ShieldCheck } from "lucide-react";
import { ReportModal } from "@/components/shared/ReportModal";
import { StoreFavoriteButton } from "@/components/store";
import { Badge, Button, EmptyState, SmartImage } from "@/components/ui";
import { products } from "@/data/products";
import { formatDate, formatKrw } from "@/lib/format";
import { readStorageJSON, storageKeys } from "@/lib/storage";

type Product = (typeof products)[number] & { status?: string };

const commonRefund = "공통 환불 기준: 플랫폼 수수료와 이미 제공된 산출물 범위를 제외하고 판매자 규정에 따라 처리됩니다.";
const staticProducts = products as unknown as Product[];

export function StoreDetailClient({ id }: { id: string }) {
  const [storedProducts, setStoredProducts] = useState<Product[]>([]);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    setStoredProducts(readStorageJSON<Product[]>(storageKeys.storeProducts, []));
  }, []);

  const product = useMemo(() => [...staticProducts, ...storedProducts].find((item) => String(item.id) === id), [id, storedProducts]);

  if (!product) {
    return (
      <EmptyState
        title="상품을 찾을 수 없습니다"
        action={
          <Link href="/store" className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white">
            스토어로
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-page">
            <SmartImage src={product.image} fallback="store" alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 760px" className="object-cover" />
          </div>

          <Section title="서비스 내용">
            <p>{product.serviceScope}</p>
          </Section>
          <Section title="작업 과정">
            <p>{product.process}</p>
          </Section>
          <Section title="환불 규정">
            <p>{product.refundPolicy}</p>
            <p className="mt-3 text-muted">{commonRefund}</p>
          </Section>
          <div className="rounded-md border border-warning bg-warning-soft p-4 text-sm font-semibold text-warning">
            촬영몬은 거래 당사자가 아니며, 서비스 결과물·권리 범위·계약 조건은 판매자와 직접 확인해야 합니다.
          </div>
          <Link href="/store" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary">
            <ArrowLeft aria-hidden className="h-4 w-4" />
            목록
          </Link>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-md border border-line bg-surface p-5 shadow-card">
            <div className="flex flex-wrap gap-2">
              <Badge label={product.category} tone="primary" />
              <Badge label={product.commercialUse ? "상업적 이용 가능" : "상업적 이용 불가"} tone={product.commercialUse ? "success" : "muted"} />
              {product.status ? <Badge label={product.status} /> : null}
            </div>
            <h1 className="mt-4 text-2xl font-black leading-tight text-ink">{product.name}</h1>
            <Link href={`/profiles?q=${encodeURIComponent(product.sellerName)}`} className="mt-2 inline-flex text-sm font-semibold text-primary">
              판매자 {product.sellerName}
            </Link>
            <p className="mt-5 text-3xl font-black text-ink">{formatKrw(product.price)}</p>
            <dl className="mt-5 grid gap-3 text-sm">
              <InfoRow label="납기" value={product.delivery} />
              <InfoRow label="수정" value={product.revisions} />
              <InfoRow label="평점" value={product.rating > 0 ? `${product.rating.toFixed(1)} / 5.0` : "검수중"} />
              <InfoRow label="최종수정일" value={formatDate(product.createdAt)} />
            </dl>
            <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
              <StoreFavoriteButton productId={product.id} className="h-10 w-full" />
              <Button variant="secondary" onClick={() => setReportOpen(true)} leftIcon={<Flag aria-hidden className="h-4 w-4" />}>
                신고
              </Button>
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-md bg-page p-3 text-xs text-muted">
              <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              검수 공개 상품은 기본 정보 형식만 확인된 상태입니다.
            </div>
          </div>
        </aside>
      </div>
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-line bg-surface p-5 text-sm leading-7 text-ink shadow-card">
      <h2 className="mb-3 text-lg font-black text-ink">{title}</h2>
      {children}
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line pb-2 last:border-b-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-bold text-ink">{value}</dd>
    </div>
  );
}
