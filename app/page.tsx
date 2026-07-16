import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JobCard } from "@/components/jobs";
import { ProfileCard } from "@/components/profiles";
import { Badge } from "@/components/ui";
import { SectionHeader } from "@/components/layout";
import { jobs } from "@/data/jobs";
import { notices } from "@/data/notices";
import { posts } from "@/data/posts";
import { profiles } from "@/data/profiles";
import { resolveImagePath } from "@/lib/images";
import { HomeAuthBox } from "./_components/HomeAuthBox";

const boardLabels: Record<string, string> = {
  free: "자유게시판",
  feedback: "촬영 피드백",
  lab: "촬영랩",
  contest: "공모전",
};

function byRecent<T extends { createdAt?: string; updatedAt?: string }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftDate = left.createdAt ?? left.updatedAt ?? "";
    const rightDate = right.createdAt ?? right.updatedAt ?? "";
    return new Date(rightDate).getTime() - new Date(leftDate).getTime();
  });
}

function CommunityColumn({ board }: { board: string }) {
  const boardPosts = byRecent(posts.filter((post) => post.board === board && !post.isNotice)).slice(0, 5);

  return (
    <div className="rounded-md border border-line bg-surface p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold text-ink">{boardLabels[board]}</h3>
        <Link href={`/community/${board}`} className="text-xs font-semibold text-muted hover:text-primary">
          더보기
        </Link>
      </div>
      <ul className="space-y-2">
        {boardPosts.map((post) => (
          <li key={post.id}>
            <Link href={`/community/${post.board}/${post.id}`} className="line-clamp-1 text-sm text-ink hover:text-primary">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  const premiumJobs = jobs.filter((job) => job.isPremium).slice(0, 8);
  const mobilePremiumJobs = premiumJobs.slice(0, 4);
  const mobileLatestJobs = byRecent(jobs.filter((job) => !job.isPremium)).slice(0, 4);
  const recommendedProfiles = profiles.filter((profile) => profile.isRecommended).slice(0, 6);
  const latestNotices = byRecent(notices).slice(0, 3);
  const bestPosts = [...posts].sort((left, right) => right.views + right.commentsCount * 20 - (left.views + left.commentsCount * 20)).slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="relative min-h-[180px] overflow-hidden rounded-md bg-ink lg:min-h-[230px]">
          <Image
            src={resolveImagePath("https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "banner")}
            alt="CLIPBee 프리미엄 배너"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 880px"
            className="object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
          <div className="relative flex h-full min-h-[180px] max-w-[520px] flex-col justify-center p-6 text-white lg:min-h-[230px] lg:p-8">
            <Badge label="프리미엄" className="mb-3 w-fit" />
            <h1 className="text-3xl font-black leading-tight lg:text-4xl">촬영자와 현장을 빠르게 연결합니다</h1>
            <p className="mt-3 text-sm text-white/80">검증된 모집 공고와 포트폴리오를 한 화면에서 확인하세요.</p>
            <div className="mt-5 flex gap-2">
              {[0, 1, 2].map((index) => (
                <span key={index} className={`h-2 w-2 rounded-full ${index === 0 ? "bg-white" : "bg-white/40"}`} />
              ))}
            </div>
          </div>
        </div>
        <HomeAuthBox />
      </section>

      <section className="hidden lg:block">
        <SectionHeader title="프리미엄 촬영자 모집" href="/jobs" />
        <div className="grid grid-cols-4 gap-4">
          {premiumJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      <section className="lg:hidden">
        <SectionHeader title="촬영자 모집" href="/jobs" />
        <div className="grid grid-cols-2 gap-3">
          {mobilePremiumJobs.map((job) => (
            <JobCard key={job.id} job={job} compact />
          ))}
        </div>
        <div className="mt-4 grid gap-3">
          {mobileLatestJobs.map((job) => (
            <JobCard key={job.id} job={job} compact />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="추천 촬영자 프로필" href="/profiles" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
          {recommendedProfiles.slice(0, 4).map((profile) => (
            <ProfileCard key={profile.id} profile={profile} compact />
          ))}
          {recommendedProfiles.slice(4, 6).map((profile) => (
            <div key={profile.id} className="hidden lg:block">
              <ProfileCard profile={profile} />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-line bg-surface p-4 shadow-card">
        <SectionHeader title="공지사항" href="/notice" />
        <ul className="divide-y divide-line">
          {latestNotices.map((notice) => (
            <li key={notice.id}>
              <Link href={`/notice/${notice.id}`} className="flex items-center justify-between gap-4 py-3 text-sm hover:text-primary">
                <span className="line-clamp-1 font-semibold text-ink">{notice.title}</span>
                <span className="shrink-0 text-muted">{notice.createdAt}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="hidden grid-cols-3 gap-4 lg:grid">
        {["free", "feedback", "lab"].map((board) => (
          <CommunityColumn key={board} board={board} />
        ))}
      </section>

      <section className="lg:hidden">
        <SectionHeader title="커뮤니티" href="/community" />
        <div className="rounded-md border border-line bg-surface p-4 shadow-card">
          <p className="mb-3 text-sm font-bold text-ink">이번주 베스트</p>
          <div className="space-y-3">
            {bestPosts.map((post) => (
              <Link key={post.id} href={`/community/${post.board}/${post.id}`} className="flex items-center justify-between gap-3 text-sm">
                <span className="line-clamp-1 text-ink">{post.title}</span>
                <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-muted" />
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-3 grid gap-3">
          {["free", "feedback", "contest", "lab"].map((board) => (
            <CommunityColumn key={board} board={board} />
          ))}
        </div>
      </section>
    </div>
  );
}
