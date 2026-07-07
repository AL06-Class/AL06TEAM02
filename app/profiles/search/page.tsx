import Link from "next/link";
import { Search } from "lucide-react";
import { Button, Checkbox, Input, Select } from "@/components/ui";
import { CAREER_OPTIONS, EQUIPMENT_OPTIONS, SHOOTING_CATEGORIES } from "@/lib/filters";

const regions = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "제주"];

export default function ProfilesSearchPage() {
  return (
    <form action="/profiles" className="mx-auto max-w-2xl pb-20">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-ink">프로필 상세검색</h1>
          <p className="mt-1 text-sm text-muted">촬영자 조건을 세밀하게 선택하세요.</p>
        </div>

        <section className="rounded-md border border-line bg-surface p-4 shadow-card">
          <h2 className="mb-3 text-base font-bold text-ink">촬영 분야</h2>
          <div className="grid gap-2">
            {SHOOTING_CATEGORIES.map((category) => (
              <Checkbox key={category} name="category" value={category} label={category} />
            ))}
          </div>
        </section>

        <section className="grid gap-3 rounded-md border border-line bg-surface p-4 shadow-card">
          <Select name="region" label="지역" options={[{ label: "전체", value: "" }, ...regions.map((region) => ({ label: region, value: region }))]} />
          <Select name="gender" label="성별" options={[{ label: "전체", value: "" }, { label: "남", value: "남" }, { label: "여", value: "여" }]} />
          <Select name="education" label="학력" options={[{ label: "무관", value: "" }, { label: "전문대 이상", value: "전문대" }, { label: "4년제 이상", value: "4년제" }]} />
          <Select name="career" label="경력" options={[{ label: "전체", value: "" }, ...CAREER_OPTIONS.filter((career) => career !== "경력무관").map((career) => ({ label: career, value: career }))]} />
          <Select name="pay" label="희망단가" options={[{ label: "전체", value: "" }, { label: "30만원 이하", value: "30" }, { label: "50만원 이하", value: "50" }, { label: "100만원 이하", value: "100" }, { label: "150만원 이하", value: "150" }]} />
          <Select name="employmentType" label="계약형태" options={[{ label: "전체", value: "" }, { label: "프리랜서", value: "프리랜서" }, { label: "정규직", value: "정규직" }, { label: "프로젝트", value: "프로젝트" }]} />
          <Select name="age" label="나이" options={[{ label: "무관", value: "" }, { label: "20대", value: "20" }, { label: "30대", value: "30" }, { label: "40대 이상", value: "40" }]} />
          <Select name="portfolioType" label="포트폴리오 유형" options={[{ label: "전체", value: "" }, { label: "이미지", value: "image" }, { label: "YouTube", value: "youtube" }, { label: "Vimeo", value: "vimeo" }]} />
        </section>

        <section className="rounded-md border border-line bg-surface p-4 shadow-card">
          <h2 className="mb-3 text-base font-bold text-ink">보유 장비</h2>
          <div className="grid gap-2">
            {EQUIPMENT_OPTIONS.map((equipment) => (
              <Checkbox key={equipment} name="equipment" value={equipment} label={equipment} />
            ))}
          </div>
        </section>

        <Input name="q" label="키워드" search placeholder="이름, 지역, 장비, 소개" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-sticky grid grid-cols-[120px_minmax(0,1fr)] gap-2 border-t border-line bg-surface p-2 lg:static lg:mt-6 lg:border-0 lg:bg-transparent lg:p-0">
        <Link
          href="/profiles"
          className="inline-flex h-[52px] items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink"
        >
          초기화
        </Link>
        <Button type="submit" size="bar" leftIcon={<Search aria-hidden className="h-4 w-4" />}>
          검색
        </Button>
      </div>
    </form>
  );
}
