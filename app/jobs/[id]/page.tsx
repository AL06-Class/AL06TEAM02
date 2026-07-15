import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, MapPin } from "lucide-react";
import { JobApplyButton, JobPrintButton, JobReportButton, JobScrapButton, formatJobDeadline } from "@/components/jobs";
import { StickyActionBar } from "@/components/layout";
import { Badge, BadgeList, SmartImage } from "@/components/ui";
import { jobs } from "@/data/jobs";
import { companyIdForJob } from "@/lib/companies";
import { resolveImagePath } from "@/lib/images";

interface JobDetailProps {
  params: { id: string };
}

function findJob(id: string) {
  return jobs.find((job) => String(job.id) === id);
}

export function generateStaticParams() {
  return jobs.map((job) => ({ id: String(job.id) }));
}

export function generateMetadata({ params }: JobDetailProps): Metadata {
  const job = findJob(params.id);
  if (!job) return { title: "모집 공고 없음" };
  return {
    title: job.title,
    description: `${job.companyName} · ${job.region} · ${job.payAmount}`,
    openGraph: {
      title: `${job.title} | 촬영몬`,
      description: job.description,
      images: [resolveImagePath(job.image)],
    },
  };
}

function InfoTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[112px_minmax(0,1fr)] border-b border-line last:border-b-0">
          <div className="bg-page px-3 py-3 text-sm font-bold text-muted">{label}</div>
          <div className="px-3 py-3 text-sm text-ink">{value}</div>
        </div>
      ))}
    </div>
  );
}

export default function JobDetailPage({ params }: JobDetailProps) {
  const job = findJob(params.id);
  if (!job) notFound();

  const closed = job.status === "마감";

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <span>{job.companyName}</span>
              <Link href={`/company/${companyIdForJob(job)}`} className="inline-flex items-center gap-1 font-semibold text-primary">
                <Building2 aria-hidden className="h-4 w-4" />
                기업 정보보기
              </Link>
            </div>
            <h1 className="text-3xl font-black leading-tight text-ink max-md:text-2xl">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-2">
              {job.isPremium ? <Badge label="프리미엄" /> : null}
              {closed ? <Badge label="마감" /> : <Badge label={formatJobDeadline(job)} />}
              <span className="text-sm text-muted">최종수정일 {job.createdAt} · 조회수 {job.views.toLocaleString("ko-KR")}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <JobScrapButton jobId={job.id} />
              <JobPrintButton />
              <JobReportButton />
            </div>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-md border border-line bg-page">
            <SmartImage src={job.image} fallback="default" alt={job.title} fill priority sizes="(max-width: 1024px) 100vw, 820px" className="object-cover" />
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-ink">모집정보</h2>
            <InfoTable
              rows={[
                ["접수기간", job.deadlineType === "마감일" && job.deadline ? `~ ${job.deadline}` : job.deadlineType],
                ["모집인원", "1명 또는 1팀"],
                ["나이", "무관"],
                ["경력", job.careerLevel],
                ["접수방법", job.applyMethods.join(", ")],
              ]}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-ink">촬영조건</h2>
            <InfoTable
              rows={[
                ["급여", job.payAmount],
                ["촬영형태", job.employmentType],
                ["담당업무", job.category],
                ["필요 장비", job.equipment.join(", ")],
                ["편집 가능 툴", job.editingTools.length > 0 ? job.editingTools.join(", ") : "선택 없음"],
                ["촬영조건", `${job.region} · ${job.address}`],
              ]}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-ink">상세모집 내용</h2>
            <div className="rounded-md border border-line bg-surface p-5 text-sm leading-7 text-ink shadow-card">{job.description}</div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-ink">근무지역</h2>
            <div className="flex min-h-[180px] items-center justify-center rounded-md border border-line bg-page text-muted">
              <div className="text-center">
                <MapPin aria-hidden className="mx-auto h-8 w-8" />
                <p className="mt-2 text-sm font-semibold text-ink">{job.address}</p>
              </div>
            </div>
          </section>

          <section className="rounded-md border border-line bg-surface p-4 shadow-card">
            <h2 className="text-lg font-bold text-ink">담당자 정보</h2>
            <p className="mt-3 text-sm text-muted">
              {job.managerName} · {job.managerEmail} · {job.address}
            </p>
          </section>

          <div className="rounded-md border border-warning bg-warning-soft p-4 text-sm text-warning">
            촬영몬은 공고 정보의 사실 여부와 계약 조건을 보증하지 않습니다. 계약 전 조건과 안전을 직접 확인하세요.
          </div>

          <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary">
            <ArrowLeft aria-hidden className="h-4 w-4" />
            목록으로
          </Link>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-md border border-line bg-surface p-4 shadow-card">
            <p className="text-sm text-muted">요약</p>
            <div className="mt-3 space-y-3">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted">급여</span>
                <strong className="text-right text-ink">{job.payAmount}</strong>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted">경력</span>
                <strong className="text-ink">{job.careerLevel}</strong>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted">지역</span>
                <strong className="text-right text-ink">{job.region}</strong>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted">마감</span>
                <strong className="text-ink">{closed ? "마감" : formatJobDeadline(job)}</strong>
              </div>
              <BadgeList labels={[job.category, ...job.equipment, ...job.editingTools]} max={4} />
              <JobApplyButton jobId={job.id} />
              <a
                href={`mailto:${job.managerEmail}`}
                className="inline-flex h-10 w-full items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:bg-page"
              >
                이메일 지원
              </a>
            </div>
          </div>
        </aside>
      </div>

      <StickyActionBar iconAction={<JobScrapButton jobId={job.id} iconOnly />} primaryAction={<JobApplyButton jobId={job.id} className="h-[52px]" />} />
    </>
  );
}
