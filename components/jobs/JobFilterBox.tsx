import Link from "next/link";
import { Search } from "lucide-react";
import { Button, Checkbox, Input, Select } from "@/components/ui";
import {
  CAREER_OPTIONS,
  EQUIPMENT_OPTIONS,
  EDITING_TOOL_OPTIONS,
  SHOOTING_CATEGORIES,
  getParamValues,
  toURLSearchParams,
  type SearchParamsInput,
} from "@/lib/filters";

interface JobFilterBoxProps {
  searchParams?: SearchParamsInput;
  regions?: string[];
  action?: string;
  resetHref?: string;
}

export function JobFilterBox({ searchParams = {}, regions = [], action = "/jobs", resetHref = "/jobs" }: JobFilterBoxProps) {
  const params = toURLSearchParams(searchParams);
  const selectedCategories = getParamValues(params, "category");
  const selectedEquipment = getParamValues(params, "equipment");
  const selectedEditingTools = getParamValues(params, "editingTools");
  const selectedRegion = params.get("region") ?? "";
  const selectedCareer = params.get("career") ?? "";
  const selectedScope = params.get("scope") ?? "all";

  return (
    <form action={action} className="rounded-md border border-line bg-surface p-4 shadow-card">
      <div className="grid gap-5">
        <details open>
          <summary className="cursor-pointer text-sm font-bold text-ink">촬영 분야</summary>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {SHOOTING_CATEGORIES.map((category) => (
              <Checkbox
                key={category}
                name="category"
                value={category}
                label={category}
                defaultChecked={selectedCategories.includes(category)}
              />
            ))}
          </div>
        </details>

        <details>
          <summary className="cursor-pointer text-sm font-bold text-ink">장비/스킬</summary>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {EQUIPMENT_OPTIONS.map((equipment) => (
              <Checkbox
                key={equipment}
                name="equipment"
                value={equipment}
                label={equipment}
                defaultChecked={selectedEquipment.includes(equipment)}
              />
            ))}
          </div>
        </details>

        <details>
          <summary className="cursor-pointer text-sm font-bold text-ink">편집 가능 툴</summary>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {EDITING_TOOL_OPTIONS.map((tool) => (
              <Checkbox key={tool} name="editingTools" value={tool} label={tool} defaultChecked={selectedEditingTools.includes(tool)} />
            ))}
          </div>
        </details>

        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr]">
          <Select
            name="region"
            label="지역"
            defaultValue={selectedRegion}
            options={[
              { label: "전체", value: "" },
              ...regions.map((region) => ({ label: region, value: region })),
            ]}
          />
          <Select
            name="career"
            label="경력"
            defaultValue={selectedCareer}
            options={[
              { label: "전체", value: "" },
              ...CAREER_OPTIONS.map((career) => ({ label: career, value: career })),
            ]}
          />
          <Select
            name="scope"
            label="검색범위"
            defaultValue={selectedScope}
            options={[
              { label: "전체", value: "all" },
              { label: "제목", value: "title" },
              { label: "회사명", value: "company" },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1">
            <Input name="q" label="키워드" search defaultValue={params.get("q") ?? ""} placeholder="드론, 웨딩, 강남" />
          </div>
          <Checkbox
            name="includeAnyCareer"
            value="1"
            label="무관포함"
            defaultChecked={params.get("includeAnyCareer") === "1"}
            className="pb-2"
          />
          <Button type="submit" leftIcon={<Search aria-hidden className="h-4 w-4" />}>
            검색
          </Button>
          <Link
            href={resetHref}
            className="inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:bg-page"
          >
            초기화
          </Link>
        </div>
      </div>
    </form>
  );
}
