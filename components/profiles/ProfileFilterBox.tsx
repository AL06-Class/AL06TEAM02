import Link from "next/link";
import { Search } from "lucide-react";
import { Button, Checkbox, Input, Select } from "@/components/ui";
import {
  CAREER_OPTIONS,
  EQUIPMENT_OPTIONS,
  SHOOTING_CATEGORIES,
  getParamValues,
  toURLSearchParams,
  type SearchParamsInput,
} from "@/lib/filters";

interface ProfileFilterBoxProps {
  searchParams?: SearchParamsInput;
  regions?: string[];
  action?: string;
  resetHref?: string;
  categoryOptions?: readonly string[];
  equipmentOptions?: readonly string[];
  categoryLabel?: string;
  equipmentLabel?: string;
  keywordPlaceholder?: string;
}

export function ProfileFilterBox({
  searchParams = {},
  regions = [],
  action = "/profiles",
  resetHref = "/profiles",
  categoryOptions = SHOOTING_CATEGORIES,
  equipmentOptions = EQUIPMENT_OPTIONS,
  categoryLabel = "촬영 분야",
  equipmentLabel = "보유 장비",
  keywordPlaceholder = "드론, 숏폼, 서울",
}: ProfileFilterBoxProps) {
  const params = toURLSearchParams(searchParams);
  const selectedCategories = getParamValues(params, "category");
  const selectedEquipment = getParamValues(params, "equipment");

  return (
    <form action={action} className="rounded-md border border-line bg-surface p-4 shadow-card">
      <div className="grid gap-5">
        <details open>
          <summary className="cursor-pointer text-sm font-bold text-ink">{categoryLabel}</summary>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {categoryOptions.map((category) => (
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
          <summary className="cursor-pointer text-sm font-bold text-ink">{equipmentLabel}</summary>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {equipmentOptions.map((equipment) => (
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

        <div className="grid gap-3 md:grid-cols-4">
          <Select
            name="region"
            label="지역"
            defaultValue={params.get("region") ?? ""}
            options={[
              { label: "전체", value: "" },
              ...regions.map((region) => ({ label: region, value: region })),
            ]}
          />
          <Select
            name="career"
            label="경력"
            defaultValue={params.get("career") ?? ""}
            options={[
              { label: "전체", value: "" },
              ...CAREER_OPTIONS.filter((career) => career !== "경력무관").map((career) => ({ label: career, value: career })),
            ]}
          />
          <Select
            name="pay"
            label="희망단가"
            defaultValue={params.get("pay") ?? ""}
            options={[
              { label: "전체", value: "" },
              { label: "30만원 이하", value: "30" },
              { label: "50만원 이하", value: "50" },
              { label: "100만원 이하", value: "100" },
              { label: "150만원 이하", value: "150" },
            ]}
          />
          <Select
            name="gender"
            label="성별"
            defaultValue={params.get("gender") ?? ""}
            options={[
              { label: "전체", value: "" },
              { label: "남", value: "남" },
              { label: "여", value: "여" },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1">
            <Input name="q" label="키워드" search defaultValue={params.get("q") ?? ""} placeholder={keywordPlaceholder} />
          </div>
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
