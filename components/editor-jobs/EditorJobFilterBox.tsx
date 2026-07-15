import Link from "next/link";
import { Search } from "lucide-react";
import { Button, Checkbox, Input, Select } from "@/components/ui";
import {
  CAREER_OPTIONS,
  EDITING_CATEGORIES,
  EDITING_TOOL_OPTIONS,
  SHOOTING_CATEGORIES,
  getParamValues,
  toURLSearchParams,
  type SearchParamsInput,
} from "@/lib/filters";

interface EditorJobFilterBoxProps {
  searchParams?: SearchParamsInput;
  regions?: string[];
}

const employmentTypes = ["프리랜서", "정규직", "계약직", "파트타임", "프로젝트"] as const;
const payTypes = ["건당", "일당", "월급", "협의"] as const;

export function EditorJobFilterBox({ searchParams = {}, regions = [] }: EditorJobFilterBoxProps) {
  const params = toURLSearchParams(searchParams);
  const selectedCategories = getParamValues(params, "category");
  const selectedEquipment = getParamValues(params, "equipment");
  const selectedShootingCategories = getParamValues(params, "shootingCategories");

  return (
    <form action="/editor-jobs" className="rounded-md border border-line bg-surface p-4 shadow-card">
      <div className="grid gap-5">
        <details open>
          <summary className="cursor-pointer text-sm font-bold text-ink">편집 분야</summary>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {EDITING_CATEGORIES.map((category) => (
              <Checkbox key={category} name="category" value={category} label={category} defaultChecked={selectedCategories.includes(category)} />
            ))}
          </div>
        </details>

        <details>
          <summary className="cursor-pointer text-sm font-bold text-ink">편집 가능 툴</summary>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {EDITING_TOOL_OPTIONS.map((tool) => (
              <Checkbox key={tool} name="equipment" value={tool} label={tool} defaultChecked={selectedEquipment.includes(tool)} />
            ))}
          </div>
        </details>

        <details>
          <summary className="cursor-pointer text-sm font-bold text-ink">촬영 분야</summary>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {SHOOTING_CATEGORIES.map((category) => (
              <Checkbox key={category} name="shootingCategories" value={category} label={category} defaultChecked={selectedShootingCategories.includes(category)} />
            ))}
          </div>
        </details>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Select
            name="region"
            label="지역"
            defaultValue={params.get("region") ?? ""}
            options={[{ label: "전체", value: "" }, ...regions.map((region) => ({ label: region, value: region }))]}
          />
          <Select
            name="career"
            label="경력"
            defaultValue={params.get("career") ?? ""}
            options={[{ label: "전체", value: "" }, ...CAREER_OPTIONS.map((career) => ({ label: career, value: career }))]}
          />
          <Select
            name="employmentType"
            label="고용형태"
            defaultValue={params.get("employmentType") ?? ""}
            options={[{ label: "전체", value: "" }, ...employmentTypes.map((value) => ({ label: value, value }))]}
          />
          <Select
            name="pay"
            label="급여형태"
            defaultValue={params.get("pay") ?? ""}
            options={[{ label: "전체", value: "" }, ...payTypes.map((value) => ({ label: value, value }))]}
          />
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1">
            <Input name="q" label="키워드" search defaultValue={params.get("q") ?? ""} placeholder="회사명, 공고 제목, 편집 툴" />
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
          <Link href="/editor-jobs" className="inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:bg-page">
            초기화
          </Link>
        </div>
      </div>
    </form>
  );
}
