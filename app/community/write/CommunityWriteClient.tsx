"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button, Input, Select, Textarea, useToast } from "@/components/ui";
import { cn } from "@/components/ui/utils";
import { personalMembers, companyMembers } from "@/data/members";
import { useAuth } from "@/lib/auth-context";
import { appendStorageItem, storageKeys } from "@/lib/storage";
import { boardKeys, boardLabels, isBoardKey, type BoardKey, type CommunityPost } from "../community-data";

const linkPrimaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark";

function authorForRole(role: string) {
  if (role === "personal") return personalMembers[0].nickname;
  if (role === "company-unverified" || role === "company-verified" || role === "admin") return companyMembers[0].companyName;
  return "게스트";
}

export function CommunityWriteClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { role, isReady } = useAuth();
  const { showToast } = useToast();
  const initialBoard = useMemo<BoardKey>(() => {
    const value = searchParams.get("board") ?? "free";
    return isBoardKey(value) ? value : "free";
  }, [searchParams]);
  const [board, setBoard] = useState<BoardKey>(initialBoard);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isReady && role === "guest") {
      router.replace(`/login?redirect=${encodeURIComponent(`/community/write?board=${board}`)}`);
    }
  }, [board, isReady, role, router]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }
    const post: CommunityPost = {
      id: Date.now(),
      board,
      title: title.trim(),
      author: authorForRole(role),
      createdAt: new Date().toISOString(),
      views: 0,
      commentsCount: 0,
      isNotice: false,
      excerpt: content.trim().slice(0, 90) || "내용 미입력",
      content: content.trim(),
      videoUrl: videoUrl.trim(),
    };
    appendStorageItem<CommunityPost>(storageKeys.communityPosts, post);
    showToast("게시글이 등록되었습니다.");
    router.push(`/community/${board}`);
  }

  if (!isReady || role === "guest") {
    return <div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">글쓰기 권한을 확인하는 중입니다.</div>;
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-[820px] space-y-5">
      <div>
        <h1 className="text-3xl font-black text-ink max-md:text-2xl">커뮤니티 글쓰기</h1>
        <p className="mt-2 text-sm text-muted">공지 게시판은 운영자 전용이므로 선택할 수 없습니다.</p>
      </div>

      <section className="rounded-md border border-line bg-surface p-5 shadow-card">
        <div className="grid gap-4">
          <Select label="게시판" value={board} onChange={(event) => setBoard(event.target.value as BoardKey)} options={boardKeys.map((key) => ({ label: boardLabels[key], value: key }))} />
          <Input label="제목" requiredMark value={title} onChange={(event) => { setTitle(event.target.value); setError(""); }} error={error} />
          <Textarea label="본문" rows={10} value={content} onChange={(event) => setContent(event.target.value)} />
          <Input label="영상 URL" value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} placeholder="https://youtu.be/..." />
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <Link href={`/community/${board}`} className="inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink">
          취소
        </Link>
        <Button type="submit">등록</Button>
      </div>
    </form>
  );
}

function GuardCard({ title, description, href, action }: { title: string; description: string; href: string; action: string }) {
  return (
    <div className="mx-auto max-w-[520px] rounded-md border border-line bg-surface p-6 text-center shadow-card">
      <AlertTriangle aria-hidden className="mx-auto h-10 w-10 text-warning" />
      <h1 className="mt-4 text-2xl font-black text-ink">{title}</h1>
      <p className="mt-2 text-sm text-muted">{description}</p>
      <Link href={href} className={cn(linkPrimaryClass, "mt-6")}>
        {action}
      </Link>
    </div>
  );
}
