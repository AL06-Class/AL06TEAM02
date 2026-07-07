import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "@/data/posts";
import { PLACEHOLDER_IMAGES } from "@/lib/images";
import { CommunityPostDetailClient } from "./CommunityPostDetailClient";
import { boardLabels, isBoardKey } from "../../community-data";

interface CommunityPostDetailPageProps {
  params: { board: string; id: string };
}

function findPost(board: string, id: string) {
  return posts.find((post) => post.board === board && String(post.id) === id);
}

export function generateMetadata({ params }: CommunityPostDetailPageProps): Metadata {
  if (!isBoardKey(params.board)) return { title: "커뮤니티" };
  const post = findPost(params.board, params.id);
  if (!post) return { title: boardLabels[params.board] };
  return {
    title: `${post.title} | 커뮤니티`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | 촬영몬 커뮤니티`,
      description: post.excerpt,
      images: [PLACEHOLDER_IMAGES.review],
    },
  };
}

export default function CommunityPostDetailPage({ params }: CommunityPostDetailPageProps) {
  if (!isBoardKey(params.board)) notFound();
  return <CommunityPostDetailClient board={params.board} id={params.id} />;
}
