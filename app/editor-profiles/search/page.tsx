import Link from "next/link";
import { Search } from "lucide-react";
import { Button, Checkbox, Input, Select } from "@/components/ui";
import { CAREER_OPTIONS, EDITOR_PROFILE_CATEGORIES, EDITOR_PROFILE_TOOLS } from "@/lib/filters";

const regions = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "제주"];

export default function EditorProfilesSearchPage() {
  return (
    <form action="/editor-profiles" className="mx-auto max-w-2xl pb-20">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-ink">편집자 프로필 상세검색</h1>
          <p className="mt-1 text-sm text-muted">편집 분야, 사용 툴, 경력과 희망 단가를 선택하세요.</p>
        </div>

        <section className="rounded-md border border-line bg-surface p-4 shadow-card">
          <h2 className="mb-3 text-base font-bold text-ink">편집 분야</h2>
          <div className="grid gap-2">
            {EDITOR_PROFILE_CATEGORIES.map((category) => <Checkbox key={category} name="category" value={category} label={category} />)}
          </div>
        </section>

        <section className="grid gap-3 rounded-md border border-line bg-surface p-4 shadow-card">
          <Select name="region" label="활동 지역" options={[{ label: "전체", value: "" }, ...regions.map((region) => ({ label: region, value: region }))]} />
          <Select name="gender" label="성별" options={[{ label: "전체", value: "" }, { label: "남", value: "남" }, { label: "여", value: "여" }]} />
          <Select name="career" label="경력" options={[{ label: "전체", value: "" }, ...CAREER_OPTIONS.filter((career) => career !== "경력무관").map((career) => ({ label: career, value: career }))]} />
          <Select name="pay" label="희망단가" options={[{ label: "전체", value: "" }, { label: "30만원 이하", value: "30" }, { label: "50만원 이하", value: "50" }, { label: "100만원 이하", value: "100" }, { label: "150만원 이하", value: "150" }]} />
        </section>

        <section className="rounded-md border border-line bg-surface p-4 shadow-card">
          <h2 className="mb-3 text-base font-bold text-ink">사용 툴</h2>
          <div className="grid gap-2">
            {EDITOR_PROFILE_TOOLS.map((tool) => <Checkbox key={tool} name="equipment" value={tool} label={tool} />)}
          </div>
        </section>

        <Input name="q" label="키워드" search placeholder="이름, 분야, 사용 툴, 소개" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-sticky grid grid-cols-[120px_minmax(0,1fr)] gap-2 border-t border-line bg-surface p-2 lg:static lg:mt-6 lg:border-0 lg:bg-transparent lg:p-0">
        <Link href="/editor-profiles" className="inline-flex h-[52px] items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink">
          초기화
        </Link>
        <Button type="submit" size="bar" leftIcon={<Search aria-hidden className="h-4 w-4" />}>
          검색
        </Button>
      </div>
    </form>
  );
}
