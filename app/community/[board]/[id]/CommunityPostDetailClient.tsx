"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Flag, Send } from "lucide-react";
import { GateModal } from "@/components/shared/GateModal";
import { ReportModal } from "@/components/shared/ReportModal";
import { Badge, Button, EmptyState, Textarea, useToast } from "@/components/ui";
import { posts } from "@/data/posts";
import { companyMembers, personalMembers } from "@/data/members";
import { useAuth } from "@/lib/auth-context";
import { readStorageJSON, storageKeys, writeStorageJSON } from "@/lib/storage";
import { boardLabels, byRecent, type BoardKey, type CommunityPost } from "../../community-data";

const staticPosts = posts as unknown as CommunityPost[];

interface CommentRecord {
  id: string;
  postKey: string;
  author: string;
  content: string;
  createdAt: string;
  parentId?: string;
}

function postKey(board: string, id: string | number) {
  return `${board}:${id}`;
}

function authorForRole(role: string) {
  if (role === "personal") return personalMembers[0].nickname;
  if (role === "company-unverified" || role === "company-verified" || role === "admin") return companyMembers[0].companyName;
  return "";
}

function toEmbed(link: string) {
  if (link.includes("youtu.be/")) return link.replace("https://youtu.be/", "https://www.youtube.com/embed/");
  if (link.includes("watch?v=")) return link.replace("watch?v=", "embed/");
  return link;
}

function defaultVideo(post: CommunityPost) {
  if (post.videoUrl) return post.videoUrl;
  if (post.board === "feedback" && post.id % 2 === 0) return "https://www.youtube.com/embed/dQw4w9WgXcQ";
  return "";
}

function defaultComments(post: CommunityPost): CommentRecord[] {
  if (post.commentsCount === 0) return [];
  const key = postKey(post.board, post.id);
  return [
    {
      id: `${key}:sample-1`,
      postKey: key,
      author: "현장노트",
      content: "조건과 참고 링크를 같이 올려주면 더 구체적으로 답변드릴 수 있습니다.",
      createdAt: post.createdAt,
    },
    {
      id: `${key}:sample-2`,
      postKey: key,
      author: "프레임체크",
      content: "저도 비슷한 상황이 있었는데 사전 체크리스트를 만들고 나서 실수가 줄었습니다.",
      createdAt: post.createdAt,
      parentId: `${key}:sample-1`,
    },
  ];
}

export function CommunityPostDetailClient({ board, id }: { board: BoardKey; id: string }) {
  const { role } = useAuth();
  const { showToast } = useToast();
  const [storedPosts, setStoredPosts] = useState<CommunityPost[]>([]);
  const [storedComments, setStoredComments] = useState<CommentRecord[]>([]);
  const [comment, setComment] = useState("");
  const [loginGateOpen, setLoginGateOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    setStoredPosts(readStorageJSON<CommunityPost[]>(storageKeys.communityPosts, []));
    setStoredComments(readStorageJSON<CommentRecord[]>(storageKeys.communityComments, []));
  }, []);

  const allPosts = useMemo(() => [...staticPosts, ...storedPosts], [storedPosts]);
  const post = useMemo(() => allPosts.find((item) => item.board === board && String(item.id) === id), [allPosts, board, id]);
  const siblings = useMemo(() => byRecent(allPosts.filter((item) => item.board === board)), [allPosts, board]);
  const siblingIndex = post ? siblings.findIndex((item) => String(item.id) === String(post.id)) : -1;
  const previous = siblingIndex > 0 ? siblings[siblingIndex - 1] : null;
  const next = siblingIndex >= 0 && siblingIndex < siblings.length - 1 ? siblings[siblingIndex + 1] : null;
  const key = post ? postKey(post.board, post.id) : "";
  const comments = post ? [...defaultComments(post), ...storedComments.filter((item) => item.postKey === key)] : [];
  const rootComments = comments.filter((item) => !item.parentId);
  const video = post ? defaultVideo(post) : "";

  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (role === "guest") {
      setLoginGateOpen(true);
      return;
    }
    if (!comment.trim() || !post) return;
    const next: CommentRecord = {
      id: `comment-${Date.now()}`,
      postKey: key,
      author: authorForRole(role),
      content: comment.trim(),
      createdAt: new Date().toISOString(),
    };
    const allComments = readStorageJSON<CommentRecord[]>(storageKeys.communityComments, []);
    writeStorageJSON(storageKeys.communityComments, [...allComments, next]);
    setStoredComments((current) => [...current, next]);
    setComment("");
    showToast("댓글이 등록되었습니다.");
  }

  if (!post) {
    return (
      <EmptyState
        title="게시글을 찾을 수 없습니다"
        action={
          <Link href={`/community/${board}`} className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white">
            목록
          </Link>
        }
      />
    );
  }

  return (
    <>
      <article className="mx-auto max-w-[900px] space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge label={boardLabels[board]} tone="primary" />
            {post.isNotice ? <Badge label="공지" /> : null}
          </div>
          <h1 className="text-3xl font-black leading-tight text-ink max-md:text-2xl">{post.title}</h1>
          <p className="text-sm text-muted">
            {post.author} · {post.createdAt.slice(0, 10)} · 조회 {post.views.toLocaleString("ko-KR")}
          </p>
        </div>

        <section className="rounded-md border border-line bg-surface p-5 text-sm leading-7 text-ink shadow-card">
          <p className="whitespace-pre-line">{post.content || `${post.excerpt}\n\n촬영 현장에서 바로 적용할 수 있는 의견과 경험을 댓글로 나눠 주세요.`}</p>
        </section>

        {video ? (
          <section className="overflow-hidden rounded-md border border-line bg-ink shadow-card">
            <div className="aspect-video">
              <iframe title={`${post.title} 영상`} src={toEmbed(video)} className="h-full w-full" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </section>
        ) : null}

        <div className="flex flex-wrap justify-between gap-2">
          <Link href={`/community/${board}`} className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink hover:bg-page">
            <ArrowLeft aria-hidden className="h-4 w-4" />
            목록
          </Link>
          <Button variant="secondary" onClick={() => setReportOpen(true)} leftIcon={<Flag aria-hidden className="h-4 w-4" />}>
            신고
          </Button>
        </div>

        <section className="rounded-md border border-line bg-surface p-5 shadow-card">
          <h2 className="text-lg font-black text-ink">댓글 {comments.length}개</h2>
          <div className="mt-4 divide-y divide-line">
            {rootComments.length > 0 ? (
              rootComments.map((item) => (
                <div key={item.id} className="py-3">
                  <CommentItem comment={item} />
                  {comments.filter((reply) => reply.parentId === item.id).map((reply) => (
                    <div key={reply.id} className="ml-6 mt-3 border-l-2 border-line pl-4">
                      <CommentItem comment={reply} />
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-muted">아직 댓글이 없습니다.</p>
            )}
          </div>
          <form onSubmit={submitComment} className="mt-5 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            <Textarea
              aria-label="댓글"
              rows={3}
              value={comment}
              onFocus={() => role === "guest" && setLoginGateOpen(true)}
              onChange={(event) => setComment(event.target.value)}
              placeholder={role === "guest" ? "로그인 후 작성할 수 있습니다" : "댓글을 입력하세요."}
              disabled={role === "guest"}
            />
            <Button type="submit" leftIcon={<Send aria-hidden className="h-4 w-4" />}>
              등록
            </Button>
          </form>
        </section>

        <nav className="grid gap-2 rounded-md border border-line bg-surface p-3 text-sm shadow-card">
          {previous ? <PostNav label="이전글" post={previous} /> : <span className="px-2 py-1 text-muted">이전글이 없습니다.</span>}
          {next ? <PostNav label="다음글" post={next} /> : <span className="px-2 py-1 text-muted">다음글이 없습니다.</span>}
        </nav>
      </article>
      <GateModal type="login" open={loginGateOpen} onClose={() => setLoginGateOpen(false)} />
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
}

function CommentItem({ comment }: { comment: CommentRecord }) {
  return (
    <div className="text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <strong className="text-ink">{comment.author}</strong>
        <span className="text-xs text-muted">{comment.createdAt.slice(0, 10)}</span>
      </div>
      <p className="mt-1 leading-6 text-ink">{comment.content}</p>
    </div>
  );
}

function PostNav({ label, post }: { label: string; post: CommunityPost }) {
  return (
    <Link href={`/community/${post.board}/${post.id}`} className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-sm px-2 py-2 hover:bg-page">
      <span className="text-muted">{label}</span>
      <span className="truncate font-semibold text-ink">{post.title}</span>
    </Link>
  );
}
