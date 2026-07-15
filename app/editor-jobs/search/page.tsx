import Link from "next/link";
import { Search } from "lucide-react";
import { Button, Checkbox, Input, Select } from "@/components/ui";
import { CAREER_OPTIONS, EDITING_CATEGORIES, EDITING_TOOL_OPTIONS, SHOOTING_CATEGORIES } from "@/lib/filters";

const regions = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "제주"];
const employmentTypes = ["프리랜서", "정규직", "계약직", "파트타임", "프로젝트"];
const payTypes = ["건당", "일당", "월급", "협의"];

export default function EditorJobsSearchPage() {
  return (
    <form action="/editor-jobs" className="mx-auto max-w-2xl pb-20">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-ink">편집자 모집 상세검색</h1>
          <p className="mt-1 text-sm text-muted">편집 분야와 사용 가능한 툴을 선택해 공고를 좁혀보세요.</p>
        </div>

        <section className="rounded-md border border-line bg-surface p-4 shadow-card">
          <h2 className="mb-3 text-base font-bold text-ink">편집 분야</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {EDITING_CATEGORIES.map((category) => (
              <Checkbox key={category} name="category" value={category} label={category} />
            ))}
          </div>
        </section>

        <section className="rounded-md border border-line bg-surface p-4 shadow-card">
          <h2 className="mb-3 text-base font-bold text-ink">편집 가능 툴</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {EDITING_TOOL_OPTIONS.map((tool) => (
              <Checkbox key={tool} name="equipment" value={tool} label={tool} />
            ))}
          </div>
        </section>

        <section className="rounded-md border border-line bg-surface p-4 shadow-card">
          <h2 className="mb-3 text-base font-bold text-ink">촬영 분야</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {SHOOTING_CATEGORIES.map((category) => (
              <Checkbox key={category} name="shootingCategories" value={category} label={category} />
            ))}
          </div>
        </section>

        <section className="grid gap-3 rounded-md border border-line bg-surface p-4 shadow-card sm:grid-cols-2">
          <Select name="region" label="지역" options={[{ label: "전체", value: "" }, ...regions.map((value) => ({ label: value, value }))]} />
          <Select name="career" label="경력" options={[{ label: "전체", value: "" }, ...CAREER_OPTIONS.map((value) => ({ label: value, value }))]} />
          <Select name="employmentType" label="고용형태" options={[{ label: "전체", value: "" }, ...employmentTypes.map((value) => ({ label: value, value }))]} />
          <Select name="pay" label="급여형태" options={[{ label: "전체", value: "" }, ...payTypes.map((value) => ({ label: value, value }))]} />
        </section>

        <Input name="q" label="키워드" search placeholder="회사명, 공고 제목, 편집 툴" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-sticky grid grid-cols-[120px_minmax(0,1fr)] gap-2 border-t border-line bg-surface p-2 lg:static lg:mt-6 lg:border-0 lg:bg-transparent lg:p-0">
        <Link href="/editor-jobs" className="inline-flex h-[52px] items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink">
          초기화
        </Link>
        <Button type="submit" size="bar" leftIcon={<Search aria-hidden className="h-4 w-4" />}>
          검색
        </Button>
      </div>
    </form>
  );
}
