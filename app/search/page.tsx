import Image from "next/image";
import Link from "next/link";
import { JobCard, JobRow } from "@/components/jobs";
import { ProfileCard } from "@/components/profiles";
import { Badge, Chip, EmptyState, Tabs } from "@/components/ui";
import { jobs } from "@/data/jobs";
import { posts } from "@/data/posts";
import { products } from "@/data/products";
import { profiles } from "@/data/profiles";
import { filterJobPostings, filterShooterProfiles } from "@/lib/filters";
import { resolveImagePath } from "@/lib/images";

interface SearchPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function includes(value: string | number | undefined, query: string) {
  return String(value ?? "").toLocaleLowerCase("ko-KR").includes(query.toLocaleLowerCase("ko-KR"));
}

function sectionHeader(title: string, href: string) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <Link href={href} className="text-sm font-semibold text-muted hover:text-primary">
        더보기 →
      </Link>
    </div>
  );
}

function CommunityResults({ items }: { items: typeof posts }) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface shadow-card">
      {items.map((post) => (
        <Link key={post.id} href={`/community/${post.board}/${post.id}`} className="block border-b border-line px-4 py-3 last:border-b-0 hover:bg-page">
          <div className="flex items-center gap-2">
            {post.isNotice ? <Badge label="공지" /> : null}
            <p className="line-clamp-1 text-sm font-bold text-ink">{post.title}</p>
          </div>
          <p className="mt-1 line-clamp-1 text-sm text-muted">{post.excerpt}</p>
        </Link>
      ))}
    </div>
  );
}

function StoreResults({ items }: { items: typeof products }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((product) => (
        <Link key={product.id} href={`/store/${product.id}`} className="overflow-hidden rounded-md border border-line bg-surface shadow-card transition hover:shadow-hover">
          <div className="relative aspect-[4/3] bg-page">
            <Image src={resolveImagePath(product.image, "store")} alt={product.name} fill sizes="33vw" className="object-cover" />
          </div>
          <div className="space-y-1 p-3">
            <p className="line-clamp-2 text-sm font-bold text-ink">{product.name}</p>
            <p className="text-xs text-muted">{product.sellerName}</p>
            <p className="font-bold text-ink">{product.price.toLocaleString("ko-KR")}원</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function SearchPage({ searchParams = {} }: SearchPageProps) {
  const q = valueOf(searchParams.q).trim();
  const tab = valueOf(searchParams.tab) || "all";
  const queryParams = q ? { q } : {};
  const jobResults = q ? filterJobPostings(jobs, queryParams) : [];
  const profileResults = q ? filterShooterProfiles(profiles, queryParams) : [];
  const communityResults = q
    ? posts.filter((post) => [post.title, post.author, post.excerpt, post.board].some((value) => includes(value, q)))
    : [];
  const storeResults = q
    ? products.filter((product) => [product.name, product.category, product.sellerName, product.serviceScope].some((value) => includes(value, q)))
    : [];
  const total = jobResults.length + profileResults.length + communityResults.length + storeResults.length;

  const tabs = [
    { label: `전체(${total})`, value: "all", href: `/search?q=${encodeURIComponent(q)}` },
    { label: `모집(${jobResults.length})`, value: "jobs", href: `/search?q=${encodeURIComponent(q)}&tab=jobs` },
    { label: `프로필(${profileResults.length})`, value: "profiles", href: `/search?q=${encodeURIComponent(q)}&tab=profiles` },
    { label: `커뮤니티(${communityResults.length})`, value: "community", href: `/search?q=${encodeURIComponent(q)}&tab=community` },
    { label: `스토어(${storeResults.length})`, value: "store", href: `/search?q=${encodeURIComponent(q)}&tab=store` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink">{q ? `"${q}" 검색 결과 총 ${total}건` : "통합 검색"}</h1>
        <p className="mt-1 text-sm text-muted">모집, 프로필, 커뮤니티, 스토어 결과를 함께 확인합니다.</p>
      </div>

      <Tabs value={tab} items={tabs} variant="scroll" />

      {!q ? (
        <EmptyState title="검색어를 입력해 주세요." />
      ) : total === 0 ? (
        <EmptyState
          title="검색 결과가 없습니다. 다른 키워드로 검색해 보세요."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {["드론", "웨딩", "숏폼", "스튜디오"].map((keyword) => (
                <Link key={keyword} href={`/search?q=${encodeURIComponent(keyword)}`}>
                  <Chip label={keyword} />
                </Link>
              ))}
            </div>
          }
        />
      ) : null}

      {q && total > 0 && tab === "all" ? (
        <div className="space-y-8">
          {jobResults.length > 0 ? (
            <section>
              {sectionHeader("촬영자 모집", `/search?q=${encodeURIComponent(q)}&tab=jobs`)}
              <div className="hidden overflow-hidden rounded-md border border-line bg-surface shadow-card lg:block">
                {jobResults.slice(0, 3).map((job) => (
                  <JobRow key={job.id} job={job} />
                ))}
              </div>
              <div className="grid gap-3 lg:hidden">
                {jobResults.slice(0, 3).map((job) => (
                  <JobCard key={job.id} job={job} compact />
                ))}
              </div>
            </section>
          ) : null}
          {profileResults.length > 0 ? (
            <section>
              {sectionHeader("촬영자 프로필", `/search?q=${encodeURIComponent(q)}&tab=profiles`)}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {profileResults.slice(0, 3).map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} compact />
                ))}
              </div>
            </section>
          ) : null}
          {communityResults.length > 0 ? (
            <section>
              {sectionHeader("커뮤니티", `/search?q=${encodeURIComponent(q)}&tab=community`)}
              <CommunityResults items={communityResults.slice(0, 3)} />
            </section>
          ) : null}
          {storeResults.length > 0 ? (
            <section>
              {sectionHeader("스토어", `/search?q=${encodeURIComponent(q)}&tab=store`)}
              <StoreResults items={storeResults.slice(0, 3)} />
            </section>
          ) : null}
        </div>
      ) : null}

      {q && tab === "jobs" ? (
        <div className="space-y-3">
          {jobResults.map((job) => (
            <JobRow key={job.id} job={job} />
          ))}
        </div>
      ) : null}

      {q && tab === "profiles" ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {profileResults.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} compact />
          ))}
        </div>
      ) : null}

      {q && tab === "community" ? <CommunityResults items={communityResults} /> : null}
      {q && tab === "store" ? <StoreResults items={storeResults} /> : null}
    </div>
  );
}
