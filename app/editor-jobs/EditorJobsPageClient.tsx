"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { EditorJobFilterBox } from "@/components/editor-jobs";
import { JobCard, JobRow } from "@/components/jobs";
import { SideBar } from "@/components/layout";
import { AppliedFilterChips, type AppliedFilterChip } from "@/components/shared/AppliedFilterChips";
import { SortSelect } from "@/components/shared/SortSelect";
import { EmptyState, Pagination } from "@/components/ui";
import { editorJobs } from "@/data/editor-jobs";
import { getParamValues, JOB_SORT_OPTIONS, queryJobPostings, toURLSearchParams, type SearchParamsInput } from "@/lib/filters";

type EditorJobListItem = (typeof editorJobs)[number];

function regionOptions(items: EditorJobListItem[]) {
  return Array.from(new Set(items.map((job) => job.region.split(" ")[0]))).sort((a, b) => a.localeCompare(b, "ko-KR"));
}

function appliedChips(searchParams: SearchParamsInput): AppliedFilterChip[] {
  const params = toURLSearchParams(searchParams);
  const chips: AppliedFilterChip[] = [];
  for (const value of getParamValues(params, "category")) chips.push({ param: "category", value, label: `편집 분야: ${value}` });
  for (const value of getParamValues(params, "equipment")) chips.push({ param: "equipment", value, label: `편집 툴: ${value}` });
  for (const value of getParamValues(params, "region")) chips.push({ param: "region", value, label: `지역: ${value}` });
  const career = params.get("career");
  const employmentType = params.get("employmentType");
  const pay = params.get("pay");
  const query = params.get("q");
  if (career) chips.push({ param: "career", value: career, label: `경력: ${career}` });
  if (employmentType) chips.push({ param: "employmentType", value: employmentType, label: `고용형태: ${employmentType}` });
  if (pay) chips.push({ param: "pay", value: pay, label: `급여형태: ${pay}` });
  if (query) chips.push({ param: "q", value: query, label: `검색: ${query}` });
  if (params.get("includeAnyCareer") === "1") chips.push({ param: "includeAnyCareer", value: "1", label: "무관포함" });
  return chips;
}

export function EditorJobsPageClient() {
  const searchParams = useSearchParams();
  const currentSearchParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const desktopPage = queryJobPostings(editorJobs, currentSearchParams, 20);
  const mobilePage = queryJobPostings(editorJobs, currentSearchParams, 10);
  const chips = appliedChips(currentSearchParams);
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
            <h1 className="text-2xl font-black text-ink">편집자 모집</h1>
            <p className="mt-1 text-sm text-muted">총 {desktopPage.totalItems}건</p>
          </div>
          <Link href="/editor-jobs/search" className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-semibold text-ink shadow-card lg:hidden">
            <Filter aria-hidden className="h-4 w-4" />
            필터
          </Link>
        </div>

        <div className="hidden lg:block">
          <EditorJobFilterBox searchParams={currentSearchParams} regions={regionOptions(editorJobs)} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <AppliedFilterChips items={chips} className="flex min-w-0 flex-1 flex-wrap gap-2" />
          <SortSelect options={JOB_SORT_OPTIONS} defaultValue="recent" />
        </div>

        <div className="hidden overflow-hidden rounded-md border border-line bg-surface shadow-card lg:block">
          <div className="grid grid-cols-[140px_minmax(0,1fr)_200px_100px_110px_90px_90px] gap-3 border-b border-line bg-page px-3 py-3 text-xs font-bold text-muted">
            <span>회사명</span>
            <span>제목</span>
            <span>편집 분야·툴</span>
            <span>지역</span>
            <span>급여</span>
            <span>경력</span>
            <span>마감</span>
          </div>
          {desktopPage.items.length > 0 ? desktopPage.items.map((job) => <JobRow key={job.id} job={job} basePath="/editor-jobs" />) : <EmptyState title="조건에 맞는 편집자 모집 공고가 없습니다." />}
        </div>

        <div className="space-y-5 lg:hidden">
          {premiumMobile.length > 0 ? (
            <section>
              <h2 className="mb-3 text-base font-bold text-ink">프리미엄 모집</h2>
              <div className="grid grid-cols-2 gap-3">
                {premiumMobile.map((job) => <JobCard key={job.id} job={job} compact basePath="/editor-jobs" />)}
              </div>
            </section>
          ) : null}
          <section>
            <h2 className="mb-3 text-base font-bold text-ink">일반 모집</h2>
            <div className="grid gap-3">
              {(normalMobile.length > 0 ? normalMobile : mobilePage.items).map((job) => <JobCard key={job.id} job={job} compact basePath="/editor-jobs" />)}
            </div>
          </section>
          {mobilePage.items.length === 0 ? <EmptyState title="조건에 맞는 편집자 모집 공고가 없습니다." /> : null}
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
