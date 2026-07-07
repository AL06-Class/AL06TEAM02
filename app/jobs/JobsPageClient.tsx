"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import { JobCard, JobFilterBox, JobRow } from "@/components/jobs";
import { SideBar } from "@/components/layout";
import { AppliedFilterChips, type AppliedFilterChip } from "@/components/shared/AppliedFilterChips";
import { SortSelect } from "@/components/shared/SortSelect";
import { EmptyState, Pagination } from "@/components/ui";
import { jobs } from "@/data/jobs";
import { toPublicSubmittedJobs, type AdminJobStatus, type StatusOverride } from "@/lib/admin-storage";
import { getParamValues, JOB_SORT_OPTIONS, queryJobPostings, toURLSearchParams } from "@/lib/filters";
import { readStorageJSON, storageKeys } from "@/lib/storage";

interface JobsPageClientProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

type JobListItem = (typeof jobs)[number];

function regionOptions(items: JobListItem[]) {
  return Array.from(new Set(items.map((job) => job.region.split(" ")[0]))).sort((a, b) => a.localeCompare(b, "ko-KR"));
}

function appliedChips(searchParams: Record<string, string | string[] | undefined> = {}): AppliedFilterChip[] {
  const params = toURLSearchParams(searchParams);
  const chips: AppliedFilterChip[] = [];
  for (const value of getParamValues(params, "category")) chips.push({ param: "category", value, label: `분야: ${value}` });
  for (const value of getParamValues(params, "equipment")) chips.push({ param: "equipment", value, label: `장비: ${value}` });
  for (const value of getParamValues(params, "region")) chips.push({ param: "region", value, label: `지역: ${value}` });
  for (const value of getParamValues(params, "subway")) chips.push({ param: "subway", value, label: `역세권: ${value}` });
  const career = params.get("career");
  const query = params.get("q");
  if (career) chips.push({ param: "career", value: career, label: `경력: ${career}` });
  if (query) chips.push({ param: "q", value: query, label: `검색: ${query}` });
  if (params.get("includeAnyCareer") === "1") chips.push({ param: "includeAnyCareer", value: "1", label: "무관포함" });
  return chips;
}

function visibleJobs() {
  const overrides = readStorageJSON<Record<string, StatusOverride<AdminJobStatus>>>(storageKeys.adminJobStatuses, {});
  const staticJobs = jobs
    .filter((job) => {
      const override = overrides[String(job.id)]?.status;
      return !override || override === "게시중" || override === "마감";
    })
    .map((job) => {
      const override = overrides[String(job.id)]?.status;
      return override === "마감" ? { ...job, status: "마감" as const } : job;
    });
  return [...toPublicSubmittedJobs(), ...staticJobs] as JobListItem[];
}

export function JobsPageClient({ searchParams = {} }: JobsPageClientProps) {
  const [items, setItems] = useState<JobListItem[]>(jobs);

  useEffect(() => {
    setItems(visibleJobs());
  }, []);

  const desktopPage = queryJobPostings(items, searchParams, 20);
  const mobilePage = queryJobPostings(items, searchParams, 10);
  const chips = appliedChips(searchParams);
  const premiumMobile = mobilePage.items.filter((job) => job.isPremium);
  const normalMobile = mobilePage.items.filter((job) => !job.isPremium);

  return (
    <div className="lg:flex lg:gap-6">
      <div className="hidden lg:block">
        <SideBar />
      </div>
      <div className="min-w-0 flex-1 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-ink">촬영자 모집</h1>
            <p className="mt-1 text-sm text-muted">총 {desktopPage.totalItems}건</p>
          </div>
          <Link href="/jobs/search" className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-semibold text-ink shadow-card lg:hidden">
            <Filter aria-hidden className="h-4 w-4" />
            필터
          </Link>
        </div>

        <div className="hidden lg:block">
          <JobFilterBox searchParams={searchParams} regions={regionOptions(items)} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <AppliedFilterChips items={chips} className="flex min-w-0 flex-1 flex-wrap gap-2" />
          <SortSelect options={JOB_SORT_OPTIONS} defaultValue="recent" />
        </div>

        <div className="hidden overflow-hidden rounded-md border border-line bg-surface shadow-card lg:block">
          <div className="grid grid-cols-[140px_minmax(0,1fr)_200px_100px_110px_90px_90px] gap-3 border-b border-line bg-page px-3 py-3 text-xs font-bold text-muted">
            <span>회사명</span>
            <span>제목</span>
            <span>분야·장비</span>
            <span>지역</span>
            <span>급여</span>
            <span>경력</span>
            <span>마감</span>
          </div>
          {desktopPage.items.length > 0 ? desktopPage.items.map((job) => <JobRow key={job.id} job={job} />) : <EmptyState title="조건에 맞는 모집 공고가 없습니다." />}
        </div>

        <div className="space-y-5 lg:hidden">
          {premiumMobile.length > 0 ? (
            <section>
              <h2 className="mb-3 text-base font-bold text-ink">프리미엄 모집</h2>
              <div className="grid grid-cols-2 gap-3">
                {premiumMobile.map((job) => <JobCard key={job.id} job={job} compact />)}
              </div>
            </section>
          ) : null}
          <section>
            <h2 className="mb-3 text-base font-bold text-ink">일반 모집</h2>
            <div className="grid gap-3">
              {(normalMobile.length > 0 ? normalMobile : mobilePage.items).map((job) => <JobCard key={job.id} job={job} compact />)}
            </div>
          </section>
          {mobilePage.items.length === 0 ? <EmptyState title="조건에 맞는 모집 공고가 없습니다." /> : null}
        </div>

        <div className="pt-2">
          <div className="hidden lg:block">
            <Pagination totalPages={desktopPage.totalPages} currentPage={desktopPage.page} />
          </div>
          <div className="lg:hidden">
            <Pagination totalPages={mobilePage.totalPages} currentPage={mobilePage.page} />
          </div>
        </div>
      </div>
    </div>
  );
}

