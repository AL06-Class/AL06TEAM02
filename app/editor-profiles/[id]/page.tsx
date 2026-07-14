import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MonitorPlay } from "lucide-react";
import { ContactLockBox, ProfileReportButton } from "@/components/profiles";
import { Badge, BadgeList, SmartImage } from "@/components/ui";
import { editorProfiles } from "@/data/editor-profiles";
import { resolveImagePath } from "@/lib/images";

interface EditorProfileDetailProps {
  params: { id: string };
}

function findEditorProfile(id: string) {
  return editorProfiles.find((profile) => String(profile.id) === id);
}

export function generateStaticParams() {
  return editorProfiles.map((profile) => ({ id: String(profile.id) }));
}

function contactItems(profile: NonNullable<ReturnType<typeof findEditorProfile>>) {
  const suffix = String(profile.id).padStart(2, "0");
  return [
    { label: "휴대폰", masked: "010-****-****", value: `010-62${suffix}-84${suffix}` },
    { label: "이메일", masked: "****@***", value: `editor${suffix}@shootmon.example.kr` },
    { label: "포트폴리오", masked: "https://***", value: `https://portfolio.example.kr/editor-${suffix}` },
    { label: "활동 지역", masked: "상세 위치 비공개", value: `${profile.region} · 원격 협업 ${profile.travelAvailable ? "가능" : "협의"}` },
  ];
}

export function generateMetadata({ params }: EditorProfileDetailProps): Metadata {
  const profile = findEditorProfile(params.id);
  if (!profile) return { title: "편집자 프로필 없음" };
  return {
    title: `${profile.title} | 편집자 프로필`,
    description: `${profile.maskedName} · ${profile.region} · ${profile.desiredPay}`,
    openGraph: {
      title: `${profile.title} | 촬영몬`,
      description: profile.intro,
      images: [resolveImagePath(profile.cover, "profile")],
    },
  };
}

export default function EditorProfileDetailPage({ params }: EditorProfileDetailProps) {
  const profile = findEditorProfile(params.id);
  if (!profile) notFound();

  const age = profile.birthYear ? `${new Date().getFullYear() - profile.birthYear}세` : "팀";

  return (
    <article className="space-y-6">
      <div className="relative aspect-[4/3] max-h-[340px] overflow-hidden rounded-md border border-line bg-page lg:aspect-video">
        <SmartImage src={profile.cover} fallback="profile" alt={profile.title} fill priority sizes="100vw" className="object-cover" fallbackClassName="p-8 md:p-10" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <section className="space-y-4">
            <div className="flex flex-wrap items-start gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-surface bg-page shadow-card">
                <SmartImage src={profile.avatar} fallback="profile" alt={profile.maskedName} fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <Badge label={profile.status} />
                  {profile.isRecommended ? <Badge label="추천" /> : null}
                </div>
                <h1 className="text-3xl font-black leading-tight text-ink max-md:text-2xl">{profile.title}</h1>
                <p className="mt-2 text-sm text-muted">
                  {profile.maskedName} · {profile.gender ? `${profile.gender} · ` : ""}{age} · {profile.region}
                </p>
                <p className="mt-2 text-lg font-black text-ink">희망 단가: {profile.desiredPay}</p>
              </div>
            </div>
            <ProfileReportButton />
          </section>

          <ContactLockBox contacts={contactItems(profile)} profileId={profile.id} receiverName={profile.maskedName} />

          <section className="grid gap-4 rounded-md border border-line bg-surface p-4 shadow-card">
            <div>
              <h2 className="mb-2 text-lg font-bold text-ink">편집 분야</h2>
              <BadgeList labels={profile.categories} max={6} />
            </div>
            <div>
              <h2 className="mb-2 text-lg font-bold text-ink">사용 툴</h2>
              <BadgeList labels={profile.equipment} max={8} />
            </div>
            <p className="text-sm text-muted">
              활동 지역 {profile.region} · 원격 작업 {profile.travelAvailable ? "가능" : "협의"}
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
                {profile.careerHistory.map((item) => <li key={item}>· {item}</li>)}
              </ul>
            </div>
            <div className="rounded-md border border-line bg-surface p-5 shadow-card">
              <h2 className="text-lg font-bold text-ink">학력·교육</h2>
              <p className="mt-3 text-sm text-ink">{profile.education ?? "등록된 학력 정보 없음"}</p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <MonitorPlay aria-hidden className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-ink">포트폴리오</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {profile.portfolioImages.map((image, index) => (
                <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-page">
                  <SmartImage src={image} fallback="profile" alt={`${profile.title} 포트폴리오 ${index + 1}`} fill sizes="33vw" className="object-cover" />
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-md border border-warning bg-warning-soft p-4 text-sm text-warning">
            연락처와 포트폴리오 정보는 의뢰 목적 외 재배포할 수 없습니다. 계약 전 원본 파일 범위와 수정 횟수를 직접 확인하세요.
          </div>

          <Link href="/editor-profiles" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary">
            <ArrowLeft aria-hidden className="h-4 w-4" />
            편집자 프로필 목록으로
          </Link>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-md border border-line bg-surface p-4 shadow-card">
            <p className="text-sm text-muted">편집자 요약</p>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between gap-3"><span className="text-muted">상태</span><strong className="text-ink">{profile.status}</strong></div>
              <div className="flex justify-between gap-3"><span className="text-muted">경력</span><strong className="text-ink">{profile.careerYears}년</strong></div>
              <div className="flex justify-between gap-3"><span className="text-muted">원격</span><strong className="text-ink">{profile.travelAvailable ? "가능" : "협의"}</strong></div>
              <div className="flex justify-between gap-3"><span className="text-muted">단가</span><strong className="text-right text-ink">{profile.desiredPay}</strong></div>
              <BadgeList labels={[...profile.categories, ...profile.equipment]} max={5} />
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
