"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { ProfileCard, ProfileFilterBox } from "@/components/profiles";
import { SideBar } from "@/components/layout";
import { AppliedFilterChips, type AppliedFilterChip } from "@/components/shared/AppliedFilterChips";
import { SortSelect } from "@/components/shared/SortSelect";
import { EmptyState, Pagination } from "@/components/ui";
import { editorProfiles } from "@/data/editor-profiles";
import {
  EDITOR_PROFILE_CATEGORIES,
  EDITOR_PROFILE_TOOLS,
  getParamValues,
  PROFILE_SORT_OPTIONS,
  queryShooterProfiles,
  toURLSearchParams,
  type SearchParamsInput,
} from "@/lib/filters";

type EditorProfileListItem = (typeof editorProfiles)[number];

function regionOptions(items: EditorProfileListItem[]) {
  return Array.from(new Set(items.map((profile) => profile.region.split(" ")[0]))).sort((a, b) => a.localeCompare(b, "ko-KR"));
}

function appliedChips(searchParams: SearchParamsInput): AppliedFilterChip[] {
  const params = toURLSearchParams(searchParams);
  const chips: AppliedFilterChip[] = [];
  for (const value of getParamValues(params, "category")) chips.push({ param: "category", value, label: `분야: ${value}` });
  for (const value of getParamValues(params, "equipment")) chips.push({ param: "equipment", value, label: `툴: ${value}` });
  for (const value of getParamValues(params, "region")) chips.push({ param: "region", value, label: `지역: ${value}` });
  const career = params.get("career");
  const pay = params.get("pay");
  const gender = params.get("gender");
  const query = params.get("q");
  if (career) chips.push({ param: "career", value: career, label: `경력: ${career}` });
  if (pay) chips.push({ param: "pay", value: pay, label: `단가: ${pay}만원 이하` });
  if (gender) chips.push({ param: "gender", value: gender, label: `성별: ${gender}` });
  if (query) chips.push({ param: "q", value: query, label: `검색: ${query}` });
  return chips;
}

export function EditorProfilesPageClient() {
  const searchParams = useSearchParams();
  const currentSearchParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const desktopPage = queryShooterProfiles(editorProfiles, currentSearchParams, 12);
  const mobilePage = queryShooterProfiles(editorProfiles, currentSearchParams, 10);
  const chips = appliedChips(currentSearchParams);

  return (
    <div className="lg:flex lg:gap-6">
      <div className="hidden lg:block">
        <SideBar />
      </div>
      <div className="min-w-0 flex-1 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-ink">편집자 프로필</h1>
            <p className="mt-1 text-sm text-muted">검증된 편집 분야와 사용 툴을 확인하세요 · 총 {desktopPage.totalItems}건</p>
          </div>
          <Link href="/editor-profiles/search" className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-semibold text-ink shadow-card lg:hidden">
            <Filter aria-hidden className="h-4 w-4" />
            필터
          </Link>
        </div>

        <div className="hidden lg:block">
          <ProfileFilterBox
            searchParams={currentSearchParams}
            regions={regionOptions(editorProfiles)}
            action="/editor-profiles"
            resetHref="/editor-profiles"
            categoryOptions={EDITOR_PROFILE_CATEGORIES}
            equipmentOptions={EDITOR_PROFILE_TOOLS}
            categoryLabel="편집 분야"
            equipmentLabel="사용 툴"
            keywordPlaceholder="유튜브, 모션그래픽, Premiere Pro"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <AppliedFilterChips items={chips} className="flex min-w-0 flex-1 flex-wrap gap-2" />
          <SortSelect options={PROFILE_SORT_OPTIONS} defaultValue="recent" />
        </div>

        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
          {desktopPage.items.map((profile) => <ProfileCard key={profile.id} profile={profile} hrefBase="/editor-profiles" />)}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:hidden">
          {mobilePage.items.map((profile) => <ProfileCard key={profile.id} profile={profile} compact hrefBase="/editor-profiles" />)}
        </div>

        {desktopPage.items.length === 0 ? <EmptyState title="조건에 맞는 편집자 프로필이 없습니다." /> : null}

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
