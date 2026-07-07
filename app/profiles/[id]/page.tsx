import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import { ContactLockBox, ProfileReportButton, ProfileScrapButton } from "@/components/profiles";
import { Badge, BadgeList } from "@/components/ui";
import { profiles } from "@/data/profiles";
import { resolveImagePath } from "@/lib/images";

interface ProfileDetailProps {
  params: { id: string };
}

function findProfile(id: string) {
  return profiles.find((profile) => String(profile.id) === id);
}

function contactItems(profile: NonNullable<ReturnType<typeof findProfile>>) {
  const suffix = String(profile.id).padStart(2, "0");
  return [
    { label: "전화번호", masked: "02-****-****", value: `02-6200-10${suffix}` },
    { label: "휴대폰", masked: "010-****-****", value: `010-45${suffix}-78${suffix}` },
    { label: "이메일", masked: "****@***", value: `profile${suffix}@shootmon.example.kr` },
    { label: "홈페이지", masked: "https://***", value: `https://portfolio.example.kr/shooter-${suffix}` },
    { label: "주소", masked: "상세 주소 비공개", value: `${profile.region} 활동 거점` },
  ];
}

export function generateMetadata({ params }: ProfileDetailProps): Metadata {
  const profile = findProfile(params.id);
  if (!profile) return { title: "프로필 없음 | 촬영몬" };
  return {
    title: `${profile.title} | 촬영몬`,
    description: `${profile.maskedName} · ${profile.region} · ${profile.desiredPay}`,
    openGraph: {
      title: profile.title,
      description: profile.intro,
      images: [resolveImagePath(profile.cover, "profile")],
    },
  };
}

function toEmbed(link: string) {
  if (link.includes("youtu.be/")) return link.replace("https://youtu.be/", "https://www.youtube.com/embed/");
  if (link.includes("vimeo.com/")) return link.replace("https://vimeo.com/", "https://player.vimeo.com/video/");
  return link;
}

export default function ProfileDetailPage({ params }: ProfileDetailProps) {
  const profile = findProfile(params.id);
  if (!profile) notFound();

  const age = profile.birthYear ? `${new Date().getFullYear() - profile.birthYear}세` : "팀";

  return (
    <article className="space-y-6">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-page lg:aspect-video">
        <Image src={resolveImagePath(profile.cover, "profile")} alt={profile.title} fill priority sizes="100vw" className="object-cover" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <section className="space-y-4">
            <div className="flex flex-wrap items-start gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-surface bg-page shadow-card">
                <Image src={resolveImagePath(profile.avatar, "profile")} alt={profile.maskedName} fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <Badge label={profile.status} />
                  {profile.isRecommended ? <Badge label="추천" /> : null}
                </div>
                <h1 className="text-3xl font-black leading-tight text-ink max-md:text-2xl">{profile.title}</h1>
                <p className="mt-2 text-sm text-muted">
                  {profile.maskedName} · {profile.gender ? `${profile.gender} · ` : ""}
                  {age} · {profile.region}
                </p>
                <p className="mt-2 text-lg font-black text-ink">희망 단가: {profile.desiredPay}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <ProfileScrapButton profileId={profile.id} />
              <ProfileReportButton />
            </div>
          </section>

          <ContactLockBox contacts={contactItems(profile)} />

          <section className="grid gap-4 rounded-md border border-line bg-surface p-4 shadow-card">
            <div>
              <h2 className="mb-2 text-lg font-bold text-ink">촬영 가능 분야</h2>
              <BadgeList labels={profile.categories} max={6} />
            </div>
            <div>
              <h2 className="mb-2 text-lg font-bold text-ink">보유 장비</h2>
              <BadgeList labels={profile.equipment} max={8} />
            </div>
            <p className="text-sm text-muted">
              활동 지역 {profile.region} · 출장 가능 {profile.travelAvailable ? "O" : "X"} · 스튜디오 보유 {profile.hasStudio ? "O" : "X"}
            </p>
          </section>

          <section className="rounded-md border border-line bg-surface p-5 shadow-card">
            <h2 className="text-lg font-bold text-ink">소개</h2>
            <p className="mt-3 text-sm leading-7 text-ink">{profile.intro}</p>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-md border border-line bg-surface p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink">경력사항</h2>
              <ul className="mt-3 space-y-2 text-sm text-ink">
                {profile.careerHistory.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-line bg-surface p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink">학력·교육·자격</h2>
              <p className="mt-3 text-sm text-ink">{profile.education ?? "등록된 학력 정보 없음"}</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-ink">포트폴리오</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {profile.portfolioImages.map((image, index) => (
                <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-page">
                  <Image src={resolveImagePath(image, "profile")} alt={`${profile.title} 포트폴리오 ${index + 1}`} fill sizes="33vw" className="object-cover" />
                </div>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {profile.portfolioLinks.map((link) => (
                <div key={link} className="overflow-hidden rounded-md border border-line bg-surface shadow-card">
                  <div className="relative aspect-video bg-ink">
                    <iframe
                      title={`${profile.title} 영상 포트폴리오`}
                      src={toEmbed(link)}
                      className="h-full w-full"
                      loading="lazy"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 p-2 text-white">
                      <Play aria-hidden className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="truncate p-3 text-sm font-semibold text-ink">{link}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-md border border-warning bg-warning-soft p-4 text-sm text-warning">
            연락처와 포트폴리오 정보는 의뢰 목적 외 재배포할 수 없습니다. 계약 전 본인 확인과 조건 확인을 직접 진행하세요.
          </div>

          <Link href="/profiles" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary">
            <ArrowLeft aria-hidden className="h-4 w-4" />
            목록으로
          </Link>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-md border border-line bg-surface p-4 shadow-card">
            <p className="text-sm text-muted">프로필 요약</p>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted">상태</span>
                <strong className="text-ink">{profile.status}</strong>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted">경력</span>
                <strong className="text-ink">{profile.careerYears}년</strong>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted">지역</span>
                <strong className="text-right text-ink">{profile.region}</strong>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted">단가</span>
                <strong className="text-right text-ink">{profile.desiredPay}</strong>
              </div>
              <BadgeList labels={[...profile.categories, ...profile.equipment]} max={5} />
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
