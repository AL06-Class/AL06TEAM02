import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BoardPageClient } from "./BoardPageClient";
import { boardKeys, isBoardKey } from "../community-data";

interface BoardPageProps {
  params: { board: string };
}

export function generateStaticParams() {
  return boardKeys.map((board) => ({ board }));
}

export default function BoardPage({ params }: BoardPageProps) {
  if (!isBoardKey(params.board)) notFound();
  return (
    <Suspense fallback={<div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">게시판을 불러오는 중입니다.</div>}>
      <BoardPageClient board={params.board} />
    </Suspense>
  );
}
