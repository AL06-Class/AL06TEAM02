"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Edit3, Search } from "lucide-react";
import { GateModal } from "@/components/shared/GateModal";
import { Badge, Button, EmptyState, Input, Pagination, Select } from "@/components/ui";
import { posts } from "@/data/posts";
import { useAuth } from "@/lib/auth-context";
import { readStorageJSON, storageKeys } from "@/lib/storage";
import { boardLabels, byRecent, type BoardKey, type CommunityPost } from "../community-data";

const staticPosts = posts as unknown as CommunityPost[];

function pageItems<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(Math.ceil(items.length / pageSize), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  return {
    totalPages,
    page: safePage,
    items: items.slice((safePage - 1) * pageSize, safePage * pageSize),
  };
}

function includes(value: string | number | undefined, query: string) {
  return String(value ?? "").toLocaleLowerCase("ko-KR").includes(query.toLocaleLowerCase("ko-KR"));
}

export function BoardPageClient({ board }: { board: BoardKey }) {
  const { role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [storedPosts, setStoredPosts] = useState<CommunityPost[]>([]);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [loginGateOpen, setLoginGateOpen] = useState(false);
  const sort = searchParams.get("sort") ?? "recent";
  const page = Number(searchParams.get("page") ?? "1") || 1;

  useEffect(() => {
    setStoredPosts(readStorageJSON<CommunityPost[]>(storageKeys.communityPosts, []));
  }, []);

  const boardPosts = useMemo(() => {
    const current = [...staticPosts, ...storedPosts].filter((post) => post.board === board);
    const keyword = (searchParams.get("q") ?? "").trim();
    const filtered = keyword ? current.filter((post) => [post.title, post.author, post.excerpt].some((value) => includes(value, keyword))) : current;
    const sorted = sort === "views" ? [...filtered].sort((left, right) => right.views - left.views) : byRecent(filtered);
    return sorted;
  }, [board, searchParams, sort, storedPosts]);

  const noticeRows = boardPosts.filter((post) => post.isNotice);
  const normalRows = boardPosts.filter((post) => !post.isNotice);
  const currentPage = pageItems(normalRows, page, 12);
  const rows = [...noticeRows, ...currentPage.items];

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || (key === "sort" && value === "recent")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    const next = params.toString();
    router.push(next ? `${pathname}?${next}` : pathname);
  }

  function search() {
    updateParam("q", query.trim());
  }

  function write() {
    if (role === "guest") {
      setLoginGateOpen(true);
      return;
    }
    router.push(`/community/write?board=${board}`);
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-ink">{boardLabels[board]}</h1>
            <p className="mt-1 text-sm text-muted">총 {boardPosts.length}건</p>
          </div>
          <Button onClick={write} leftIcon={<Edit3 aria-hidden className="h-4 w-4" />}>
            글쓰기
          </Button>
        </div>

        <div className="grid gap-2 rounded-md border border-line bg-surface p-3 shadow-card md:grid-cols-[160px_minmax(0,1fr)_auto] md:items-end">
          <Select aria-label="정렬" value={sort} onChange={(event) => updateParam("sort", event.target.value)} options={[{ label: "최신순", value: "recent" }, { label: "조회순", value: "views" }]} />
          <Input label="검색" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && search()} leftIcon={<Search aria-hidden className="h-4 w-4" />} />
          <Button variant="secondary" onClick={search}>
            검색
          </Button>
        </div>

        {rows.length > 0 ? (
          <>
            <div className="hidden overflow-hidden rounded-md border border-line bg-surface shadow-card md:block">
              <div className="grid grid-cols-[90px_minmax(0,1fr)_120px_90px_120px] gap-3 border-b border-line bg-page px-4 py-3 text-xs font-bold text-muted">
                <span>번호</span>
                <span>제목</span>
                <span>작성자</span>
                <span>조회</span>
                <span>등록일</span>
              </div>
              {rows.map((post, index) => (
                <Link key={`${post.board}-${post.id}`} href={`/community/${post.board}/${post.id}`} className="grid min-h-12 grid-cols-[90px_minmax(0,1fr)_120px_90px_120px] items-center gap-3 border-b border-line px-4 py-3 text-sm last:border-b-0 hover:bg-page">
                  <span>{post.isNotice ? <Badge label="공지" /> : currentPage.totalPages === 1 ? normalRows.length - index : post.id}</span>
                  <span className="min-w-0 font-semibold text-ink">
                    <span className="line-clamp-1">
                      {post.title} <span className="text-primary">[{post.commentsCount}]</span>
                    </span>
                  </span>
                  <span className="truncate text-muted">{post.author}</span>
                  <span className="tabular-nums text-muted">{post.views.toLocaleString("ko-KR")}</span>
                  <span className="text-muted">{post.createdAt.slice(0, 10)}</span>
                </Link>
              ))}
            </div>

            <div className="space-y-3 md:hidden">
              {rows.map((post) => (
                <Link key={`${post.board}-${post.id}`} href={`/community/${post.board}/${post.id}`} className="block rounded-md border border-line bg-surface p-4 shadow-card">
                  <div className="flex gap-2">
                    {post.isNotice ? <Badge label="공지" /> : null}
                    <h2 className="line-clamp-2 text-sm font-bold text-ink">{post.title}</h2>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {post.author} · {post.createdAt.slice(0, 10)} · 조회 {post.views.toLocaleString("ko-KR")} · 댓글 {post.commentsCount}
                  </p>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <EmptyState title="게시글이 없습니다." />
        )}

        <Pagination totalPages={currentPage.totalPages} currentPage={currentPage.page} />
      </div>
      <GateModal type="login" open={loginGateOpen} onClose={() => setLoginGateOpen(false)} />
    </>
  );
}
