import Link from "next/link";
import { Badge, EmptyState, Pagination } from "@/components/ui";
import { notices } from "@/data/notices";

interface NoticePageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

function pageSlice<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(Math.ceil(items.length / pageSize), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  return {
    page: safePage,
    totalPages,
    items: items.slice((safePage - 1) * pageSize, safePage * pageSize),
  };
}

export default function NoticePage({ searchParams = {} }: NoticePageProps) {
  const pinned = notices.filter((notice) => notice.isPinned);
  const normal = notices.filter((notice) => !notice.isPinned).sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  const page = Number(Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page ?? "1") || 1;
  const current = pageSlice(normal, page, 8);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink">공지사항</h1>
        <p className="mt-1 text-sm text-muted">촬영몬 운영 공지와 서비스 변경 사항입니다.</p>
      </div>

      {pinned.length > 0 ? (
        <section className="grid gap-2">
          {pinned.map((notice) => (
            <Link key={notice.id} href={`/notice/${notice.id}`} className="flex items-center justify-between gap-4 rounded-md border border-warning bg-warning-soft px-4 py-3 text-sm shadow-card hover:bg-warning-soft/70">
              <span className="flex min-w-0 items-center gap-2">
                <Badge label="고정" tone="warning" />
                <span className="line-clamp-1 font-bold text-ink">{notice.title}</span>
              </span>
              <span className="shrink-0 text-muted">{notice.createdAt}</span>
            </Link>
          ))}
        </section>
      ) : null}

      {current.items.length > 0 ? (
        <>
          <div className="hidden overflow-hidden rounded-md border border-line bg-surface shadow-card md:block">
            <div className="grid grid-cols-[90px_minmax(0,1fr)_120px_100px] gap-3 border-b border-line bg-page px-4 py-3 text-xs font-bold text-muted">
              <span>번호</span>
              <span>제목</span>
              <span>날짜</span>
              <span>조회</span>
            </div>
            {current.items.map((notice) => (
              <Link key={notice.id} href={`/notice/${notice.id}`} className="grid min-h-12 grid-cols-[90px_minmax(0,1fr)_120px_100px] items-center gap-3 border-b border-line px-4 py-3 text-sm last:border-b-0 hover:bg-page">
                <span className="text-muted">{notice.id}</span>
                <span className="truncate font-semibold text-ink">{notice.title}</span>
                <span className="text-muted">{notice.createdAt}</span>
                <span className="text-muted">{notice.views.toLocaleString("ko-KR")}</span>
              </Link>
            ))}
          </div>

          <div className="space-y-3 md:hidden">
            {current.items.map((notice) => (
              <Link key={notice.id} href={`/notice/${notice.id}`} className="block rounded-md border border-line bg-surface p-4 shadow-card">
                <h2 className="line-clamp-2 text-sm font-bold text-ink">{notice.title}</h2>
                <p className="mt-2 text-xs text-muted">
                  {notice.createdAt} · 조회 {notice.views.toLocaleString("ko-KR")}
                </p>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <EmptyState title="공지사항이 없습니다." />
      )}

      <Pagination totalPages={current.totalPages} currentPage={current.page} />
    </div>
  );
}
