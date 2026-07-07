"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui";
import { posts } from "@/data/posts";
import { readStorageJSON, storageKeys } from "@/lib/storage";
import { boardKeys, boardLabels, byRecent, type CommunityPost, postScore } from "./community-data";

const staticPosts = posts as unknown as CommunityPost[];

function PostLink({ post }: { post: CommunityPost }) {
  return (
    <Link href={`/community/${post.board}/${post.id}`} className="block rounded-sm px-2 py-2 text-sm transition hover:bg-page">
      <span className="flex items-center gap-2">
        {post.isNotice ? <Badge label="공지" /> : null}
        <span className="line-clamp-1 font-semibold text-ink">{post.title}</span>
      </span>
      <span className="mt-1 block text-xs text-muted">
        {post.author} · 조회 {post.views.toLocaleString("ko-KR")} · 댓글 {post.commentsCount}
      </span>
    </Link>
  );
}

export function CommunityHomeClient() {
  const [storedPosts, setStoredPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    setStoredPosts(readStorageJSON<CommunityPost[]>(storageKeys.communityPosts, []));
  }, []);

  const allPosts = useMemo(() => [...staticPosts, ...storedPosts], [storedPosts]);
  const bestPosts = useMemo(() => [...allPosts].filter((post) => !post.isNotice).sort((left, right) => postScore(right) - postScore(left)).slice(0, 5), [allPosts]);

  return (
    <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
      <aside className="hidden lg:block">
        <nav className="sticky top-24 rounded-md border border-line bg-surface p-3 shadow-card">
          <Link href="/community" className="mb-2 flex rounded-sm bg-primary-soft px-3 py-2 text-sm font-bold text-primary">
            커뮤니티 홈
          </Link>
          {boardKeys.map((board) => (
            <Link key={board} href={`/community/${board}`} className="flex rounded-sm px-3 py-2 text-sm font-semibold text-muted hover:bg-page hover:text-ink">
              {boardLabels[board]}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-ink">커뮤니티</h1>
          <p className="mt-1 text-sm text-muted">현장 경험, 피드백, 공모전 정보를 모아봅니다.</p>
        </div>

        <section className="rounded-md border border-line bg-surface p-4 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-black text-ink">이번주 베스트</h2>
            <Link href="/community/free" className="text-sm font-semibold text-muted hover:text-primary">
              더보기
            </Link>
          </div>
          <div className="grid gap-1">
            {bestPosts.map((post, index) => (
              <Link key={`${post.board}-${post.id}`} href={`/community/${post.board}/${post.id}`} className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-2 rounded-sm px-2 py-2 text-sm hover:bg-page">
                <span className="text-center font-black text-primary">{index + 1}</span>
                <span className="line-clamp-1 font-semibold text-ink">{post.title}</span>
                <ChevronRight aria-hidden className="h-4 w-4 text-muted" />
              </Link>
            ))}
          </div>
        </section>

        <section className="hidden grid-cols-3 gap-4 lg:grid">
          {(["free", "feedback", "lab"] as const).map((board) => (
            <div key={board} className="rounded-md border border-line bg-surface p-4 shadow-card">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-black text-ink">{boardLabels[board]}</h2>
                <Link href={`/community/${board}`} className="text-xs font-semibold text-muted hover:text-primary">
                  더보기
                </Link>
              </div>
              <div className="space-y-1">
                {byRecent(allPosts.filter((post) => post.board === board && !post.isNotice)).slice(0, 5).map((post) => (
                  <PostLink key={`${post.board}-${post.id}`} post={post} />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="hidden grid-cols-2 gap-4 lg:grid">
          {(["contest", "event"] as const).map((board) => {
            const latest = byRecent(allPosts.filter((post) => post.board === board && !post.isNotice)).slice(0, 3);
            return (
              <Link key={board} href={`/community/${board}`} className="rounded-md border border-line bg-surface p-5 shadow-card transition hover:shadow-hover">
                <Badge label={boardLabels[board]} tone="primary" />
                <h2 className="mt-3 text-lg font-black text-ink">{latest[0]?.title ?? boardLabels[board]}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{latest[0]?.excerpt ?? "최신 소식을 확인하세요."}</p>
              </Link>
            );
          })}
        </section>

        <section className="space-y-4 lg:hidden">
          {boardKeys.map((board) => (
            <div key={board} className="rounded-md border border-line bg-surface p-4 shadow-card">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-black text-ink">{boardLabels[board]}</h2>
                <Link href={`/community/${board}`} className="text-xs font-semibold text-muted hover:text-primary">
                  더보기
                </Link>
              </div>
              {byRecent(allPosts.filter((post) => post.board === board && !post.isNotice)).slice(0, 3).map((post) => (
                <PostLink key={`${post.board}-${post.id}`} post={post} />
              ))}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
