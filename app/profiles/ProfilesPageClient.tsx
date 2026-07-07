"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import { ProfileCard, ProfileFilterBox } from "@/components/profiles";
import { SideBar } from "@/components/layout";
import { AppliedFilterChips, type AppliedFilterChip } from "@/components/shared/AppliedFilterChips";
import { SortSelect } from "@/components/shared/SortSelect";
import { EmptyState, Pagination } from "@/components/ui";
import { profiles } from "@/data/profiles";
import { toPublicSubmittedProfiles, type AdminProfileStatus, type StatusOverride } from "@/lib/admin-storage";
import { getParamValues, PROFILE_SORT_OPTIONS, queryShooterProfiles, toURLSearchParams } from "@/lib/filters";
import { readStorageJSON, storageKeys } from "@/lib/storage";

interface ProfilesPageClientProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

type ProfileListItem = (typeof profiles)[number];

function regionOptions(items: ProfileListItem[]) {
  return Array.from(new Set(items.map((profile) => profile.region.split(" ")[0]))).sort((a, b) => a.localeCompare(b, "ko-KR"));
}

function appliedChips(searchParams: Record<string, string | string[] | undefined> = {}): AppliedFilterChip[] {
  const params = toURLSearchParams(searchParams);
  const chips: AppliedFilterChip[] = [];
  for (const value of getParamValues(params, "category")) chips.push({ param: "category", value, label: `분야: ${value}` });
  for (const value of getParamValues(params, "equipment")) chips.push({ param: "equipment", value, label: `장비: ${value}` });
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

function visibleProfiles() {
  const overrides = readStorageJSON<Record<string, StatusOverride<AdminProfileStatus>>>(storageKeys.adminProfileStatuses, {});
  const staticProfiles = profiles.filter((profile) => {
    const override = overrides[String(profile.id)]?.status;
    return !override || override === "공개";
  });
  return [...toPublicSubmittedProfiles(), ...staticProfiles] as ProfileListItem[];
}

export function ProfilesPageClient({ searchParams = {} }: ProfilesPageClientProps) {
  const [items, setItems] = useState<ProfileListItem[]>(profiles);

  useEffect(() => {
    setItems(visibleProfiles());
  }, []);

  const desktopPage = queryShooterProfiles(items, searchParams, 12);
  const mobilePage = queryShooterProfiles(items, searchParams, 10);
  const chips = appliedChips(searchParams);

  return (
    <div className="lg:flex lg:gap-6">
      <div className="hidden lg:block">
        <SideBar />
      </div>
      <div className="min-w-0 flex-1 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-ink">촬영자 프로필</h1>
            <p className="mt-1 text-sm text-muted">총 {desktopPage.totalItems}건</p>
          </div>
          <Link href="/profiles/search" className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-semibold text-ink shadow-card lg:hidden">
            <Filter aria-hidden className="h-4 w-4" />
            필터
          </Link>
        </div>

        <div className="hidden lg:block">
          <ProfileFilterBox searchParams={searchParams} regions={regionOptions(items)} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <AppliedFilterChips items={chips} className="flex min-w-0 flex-1 flex-wrap gap-2" />
          <SortSelect options={PROFILE_SORT_OPTIONS} defaultValue="recent" />
        </div>

        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
          {desktopPage.items.map((profile) => <ProfileCard key={profile.id} profile={profile} />)}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:hidden">
          {mobilePage.items.map((profile) => <ProfileCard key={profile.id} profile={profile} compact />)}
        </div>

        {desktopPage.items.length === 0 ? <EmptyState title="조건에 맞는 프로필이 없습니다." /> : null}

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

