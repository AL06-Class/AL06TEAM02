export type BoardKey = "free" | "feedback" | "lab" | "contest" | "event" | "suggest" | "guide";

export interface CommunityPost {
  id: number;
  board: BoardKey;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  commentsCount: number;
  isNotice: boolean;
  excerpt: string;
  content?: string;
  videoUrl?: string;
}

export const boardLabels: Record<BoardKey, string> = {
  free: "자유게시판",
  feedback: "촬영 피드백",
  lab: "촬영랩",
  contest: "공모전",
  event: "이벤트",
  suggest: "운영자에게 바란다",
  guide: "이용안내",
};

export const boardKeys = Object.keys(boardLabels) as BoardKey[];

export function isBoardKey(value: string): value is BoardKey {
  return boardKeys.includes(value as BoardKey);
}

export function byRecent<T extends { createdAt: string }>(items: T[]) {
  return [...items].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

export function postScore(post: Pick<CommunityPost, "views" | "commentsCount">) {
  return post.views + post.commentsCount * 20;
}
