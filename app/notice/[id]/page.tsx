import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui";
import { notices } from "@/data/notices";
import { PLACEHOLDER_IMAGES } from "@/lib/images";

interface NoticeDetailPageProps {
  params: { id: string };
}

function findNotice(id: string) {
  return notices.find((notice) => String(notice.id) === id);
}

export function generateStaticParams() {
  return notices.map((notice) => ({ id: String(notice.id) }));
}

function noticeBody(title: string) {
  return [
    `${title}에 대해 안내드립니다.`,
    "서비스 이용에 필요한 주요 변경 사항과 적용 일정을 확인해 주세요. 관련 기능을 이용 중인 회원은 공지 내용을 기준으로 준비해 주시면 됩니다.",
    "추가 문의가 필요한 경우 고객센터를 통해 접수해 주세요.",
  ];
}

export function generateMetadata({ params }: NoticeDetailPageProps): Metadata {
  const notice = findNotice(params.id);
  if (!notice) return { title: "공지사항 없음" };
  return {
    title: `${notice.title} | 공지사항`,
    description: `${notice.createdAt} 공지사항`,
    openGraph: {
      title: `${notice.title} | CLIPBee 공지사항`,
      description: `${notice.createdAt} 공지사항`,
      images: [PLACEHOLDER_IMAGES.default],
    },
  };
}

export default function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const notice = findNotice(params.id);
  if (!notice) notFound();

  const sorted = [...notices].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  const index = sorted.findIndex((item) => item.id === notice.id);
  const previous = index > 0 ? sorted[index - 1] : null;
  const next = index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null;

  return (
    <article className="mx-auto max-w-[860px] space-y-6">
      <div className="space-y-3">
        {notice.isPinned ? <Badge label="고정" tone="warning" /> : null}
        <h1 className="text-3xl font-black leading-tight text-ink max-md:text-2xl">{notice.title}</h1>
        <p className="text-sm text-muted">
          {notice.createdAt} · 조회 {notice.views.toLocaleString("ko-KR")}
        </p>
      </div>

      <section className="rounded-md border border-line bg-surface p-6 text-sm leading-7 text-ink shadow-card">
        {noticeBody(notice.title).map((paragraph) => (
          <p key={paragraph} className="mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </section>

      <Link href="/notice" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary">
        <ArrowLeft aria-hidden className="h-4 w-4" />
        목록
      </Link>

      <nav className="grid gap-2 rounded-md border border-line bg-surface p-3 text-sm shadow-card">
        {previous ? <NoticeNav label="이전글" notice={previous} /> : <span className="px-2 py-1 text-muted">이전글이 없습니다.</span>}
        {next ? <NoticeNav label="다음글" notice={next} /> : <span className="px-2 py-1 text-muted">다음글이 없습니다.</span>}
      </nav>
    </article>
  );
}

function NoticeNav({ label, notice }: { label: string; notice: (typeof notices)[number] }) {
  return (
    <Link href={`/notice/${notice.id}`} className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-sm px-2 py-2 hover:bg-page">
      <span className="text-muted">{label}</span>
      <span className="truncate font-semibold text-ink">{notice.title}</span>
    </Link>
  );
}
