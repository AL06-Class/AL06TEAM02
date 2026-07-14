import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Tabs } from "@/components/ui";
import { editorJobs } from "@/data/editor-jobs";
import { EDITING_CATEGORIES } from "@/lib/filters";

interface EditorJobCategoryPageProps {
  params: { type: string };
}

const tabs = [
  { label: "편집 분야별", value: "field", href: "/editor-jobs/categories/field" },
  { label: "지역별", value: "region", href: "/editor-jobs/categories/region" },
  { label: "역세권별", value: "subway", href: "/editor-jobs/categories/subway" },
];

export function generateStaticParams() {
  return [{ type: "field" }, { type: "region" }, { type: "subway" }];
}

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

export default function EditorJobCategoryPage({ params }: EditorJobCategoryPageProps) {
  if (!["field", "region", "subway"].includes(params.type)) notFound();

  const config = {
    field: {
      title: "편집 분야별 모집",
      param: "category",
      counts: countBy(editorJobs.map((job) => job.category)),
      items: [...EDITING_CATEGORIES],
    },
    region: {
      title: "지역별 모집",
      param: "region",
      counts: countBy(editorJobs.map((job) => job.region.split(" ")[0])),
      items: Array.from(new Set(editorJobs.map((job) => job.region.split(" ")[0]))).sort((a, b) => a.localeCompare(b, "ko-KR")),
    },
    subway: {
      title: "역세권별 모집",
      param: "subway",
      counts: countBy(editorJobs.map((job) => job.subwayArea).filter((value): value is string => Boolean(value))),
      items: Array.from(new Set(editorJobs.map((job) => job.subwayArea).filter((value): value is string => Boolean(value)))).sort((a, b) => a.localeCompare(b, "ko-KR")),
    },
  }[params.type as "field" | "region" | "subway"];

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink">{config.title}</h1>
        <p className="mt-1 text-sm text-muted">항목을 선택하면 편집자 모집 목록에 필터가 적용됩니다.</p>
      </div>
      <Tabs value={params.type} items={tabs} variant="scroll" />
      <div className="overflow-hidden rounded-md border border-line bg-surface shadow-card">
        {config.items.map((item) => (
          <Link key={item} href={`/editor-jobs?${config.param}=${encodeURIComponent(item)}`} className="flex items-center justify-between gap-4 border-b border-line px-4 py-4 last:border-b-0 hover:bg-page">
            <span className="font-semibold text-ink">{item}</span>
            <span className="flex items-center gap-2 text-sm text-muted">
              {config.counts[item] ?? 0}
              <ChevronRight aria-hidden className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-sticky border-t border-line bg-surface p-2 lg:static lg:border-0 lg:bg-transparent lg:p-0">
        <Link href="/editor-jobs/search" className="inline-flex h-[52px] w-full items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white">
          상세검색으로
        </Link>
      </div>
    </div>
  );
}
