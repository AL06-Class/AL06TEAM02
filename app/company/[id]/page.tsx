import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { JobCard } from "@/components/jobs";
import { Badge, EmptyState } from "@/components/ui";
import { jobs } from "@/data/jobs";
import { companyMembers } from "@/data/members";
import { companyIdForJob, resolveCompany } from "@/lib/companies";
import { resolveImagePath } from "@/lib/images";

interface CompanyPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  const ids = new Set([
    ...companyMembers.map((company) => String(company.id)),
    ...jobs.map((job) => companyIdForJob(job)),
  ]);
  return [...ids].map((id) => ({ id }));
}

export function generateMetadata({ params }: CompanyPageProps): Metadata {
  const company = resolveCompany(params.id);
  if (!company) return { title: "기업 정보 없음" };
  const description = `${company.companyName} · ${company.industry} · ${company.location}`;
  return {
    title: `${company.companyName} 기업 정보`,
    description,
    openGraph: {
      title: `${company.companyName} 기업 정보 | CLIPBee`,
      description,
      images: [resolveImagePath(company.ogImage)],
    },
  };
}

export default function CompanyPage({ params }: CompanyPageProps) {
  const company = resolveCompany(params.id);
  if (!company) notFound();

  return (
    <div className="space-y-7">
      <section className="rounded-md border border-line bg-surface p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Building2 aria-hidden className="h-5 w-5 text-primary" />
              <Badge label="인증완료" tone="success" />
            </div>
            <h1 className="text-3xl font-black leading-tight text-ink max-md:text-2xl">{company.companyName}</h1>
            <p className="mt-2 text-sm text-muted">CLIPBee 기업 인증을 완료한 의뢰자입니다.</p>
          </div>
          <Link href="/jobs" className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink hover:bg-page">
            <ArrowLeft aria-hidden className="h-4 w-4" />
            공고 목록
          </Link>
        </div>

        <dl className="mt-6 grid gap-3 md:grid-cols-3">
          <InfoItem icon={<UserRound aria-hidden className="h-4 w-4" />} label="대표자" value={company.representativeName} />
          <InfoItem icon={<ShieldCheck aria-hidden className="h-4 w-4" />} label="업종" value={company.industry} />
          <InfoItem icon={<MapPin aria-hidden className="h-4 w-4" />} label="소재지" value={company.location} />
        </dl>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-ink">진행중 공고</h2>
          <p className="mt-1 text-sm text-muted">현재 게시중인 촬영자 모집 공고입니다.</p>
        </div>
        {company.activeJobs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {company.activeJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState title="진행중인 공고가 없습니다" className="rounded-md border border-line bg-surface shadow-card" />
        )}
      </section>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-page p-4">
      <dt className="flex items-center gap-2 text-xs font-bold text-muted">
        {icon}
        {label}
      </dt>
      <dd className="mt-2 text-sm font-black text-ink">{value}</dd>
    </div>
  );
}
