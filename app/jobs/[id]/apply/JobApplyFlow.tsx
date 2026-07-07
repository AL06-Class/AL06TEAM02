"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, FileText } from "lucide-react";
import { Button, Checkbox, EmptyState, Input, Radio, Textarea, useToast } from "@/components/ui";
import { profiles } from "@/data/profiles";
import { useAuth } from "@/lib/auth-context";
import { appendStorageItem, storageKeys } from "@/lib/storage";

type Job = typeof import("@/data/jobs").jobs[number];

interface JobApplyFlowProps {
  job: Job;
}

interface ApplicationRecord {
  id: string;
  jobId: number;
  jobTitle: string;
  companyName: string;
  profileId: number | null;
  title: string;
  message: string;
  includePortfolio: boolean;
  extraLink: string;
  appliedAt: string;
}

const linkPrimaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark";
const linkSecondaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:bg-page";

export function JobApplyFlow({ job }: JobApplyFlowProps) {
  const { role, isReady } = useAuth();
  const { showToast } = useToast();
  const profileOptions = useMemo(() => (role === "personal" ? profiles.slice(0, 2) : []), [role]);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(profileOptions[0]?.id ?? null);
  const [includePortfolio, setIncludePortfolio] = useState(true);
  const [extraLink, setExtraLink] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!selectedProfileId && profileOptions[0]) {
      setSelectedProfileId(profileOptions[0].id);
    }
  }, [profileOptions, selectedProfileId]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (!selectedProfileId) {
      showToast("지원할 프로필을 선택해 주세요.", "error");
      return;
    }
    appendStorageItem<ApplicationRecord>(storageKeys.applications, {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      profileId: selectedProfileId,
      title: String(formData.get("applyTitle") ?? ""),
      message: String(formData.get("message") ?? ""),
      includePortfolio,
      extraLink,
      appliedAt: new Date().toISOString(),
    });
    setComplete(true);
    showToast("지원이 접수되었습니다.");
  }

  if (!isReady) {
    return <div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">지원 권한을 확인하는 중입니다.</div>;
  }

  if (role === "guest") {
    return <GuardCard title="로그인이 필요합니다" description="온라인 지원은 개인회원으로 로그인한 뒤 이용할 수 있습니다." href={`/login?redirect=${encodeURIComponent(`/jobs/${job.id}/apply`)}`} action="로그인" />;
  }

  if (role !== "personal") {
    return <GuardCard title="개인회원 전용 기능입니다" description="기업회원은 공고 지원을 할 수 없습니다. 개인회원으로 전환한 뒤 이용하세요." href={`/jobs/${job.id}`} action="공고로 돌아가기" />;
  }

  if (complete) {
    return (
      <div className="mx-auto max-w-[620px] rounded-md border border-line bg-surface p-6 text-center shadow-card">
        <CheckCircle2 aria-hidden className="mx-auto h-12 w-12 text-success" />
        <h1 className="mt-4 text-2xl font-black text-ink">지원이 접수되었습니다</h1>
        <p className="mt-2 text-sm text-muted">{job.companyName} 담당자에게 지원 내용이 전달된 데모 상태입니다.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/mypage/applications" className={linkPrimaryClass}>
            지원 내역 보기
          </Link>
          <Link href="/jobs" className={linkSecondaryClass}>
            계속 탐색
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-[760px] space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ink max-md:text-2xl">온라인 지원</h1>
        <p className="mt-2 text-sm text-muted">등록된 촬영자 프로필로 공고에 지원합니다.</p>
      </div>

      <details className="rounded-md border border-line bg-surface p-4 shadow-card" open>
        <summary className="cursor-pointer text-sm font-bold text-ink">공고 요약</summary>
        <div className="mt-4 grid gap-2 text-sm text-muted">
          <p>
            <strong className="text-ink">{job.companyName}</strong> · {job.title}
          </p>
          <p>
            {job.region} · {job.payAmount} · {job.careerLevel}
          </p>
        </div>
      </details>

      <section className="rounded-md border border-line bg-surface p-5 shadow-card">
        <h2 className="text-lg font-bold text-ink">지원 정보</h2>
        <p className="mt-3 text-sm text-muted">
          받는 사람: <strong className="text-ink">{job.managerName}</strong> ({job.companyName})
        </p>

        <div className="mt-5">
          <p className="mb-3 text-sm font-bold text-ink">내 프로필 선택</p>
          {profileOptions.length > 0 ? (
            <div className="grid gap-3">
              {profileOptions.map((profile) => (
                <Radio
                  key={profile.id}
                  card
                  name="profile"
                  value={profile.id}
                  checked={selectedProfileId === profile.id}
                  onChange={() => setSelectedProfileId(profile.id)}
                  label={
                    <span>
                      <span className="block font-bold">{profile.title}</span>
                      <span className="mt-1 block text-xs text-muted">
                        {profile.maskedName} · {profile.region} · {profile.desiredPay}
                      </span>
                    </span>
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="등록된 촬영자 프로필이 없습니다"
              icon={<FileText aria-hidden className="h-6 w-6" />}
              action={
                <Link href="/profiles/new" className={linkPrimaryClass}>
                  프로필 등록
                </Link>
              }
              className="rounded-md border border-line bg-page"
            />
          )}
        </div>
      </section>

      <section className="rounded-md border border-line bg-surface p-5 shadow-card">
        <h2 className="text-lg font-bold text-ink">지원 내용</h2>
        <div className="mt-4 space-y-4">
          <Input name="applyTitle" label="지원 제목" requiredMark required defaultValue={`${job.title} 지원합니다`} />
          <Textarea name="message" label="지원 내용" requiredMark required rows={6} placeholder="경력, 장비, 가능 일정 등을 입력하세요." />
          <Checkbox label="프로필의 포트폴리오를 자동 첨부합니다." checked={includePortfolio} onChange={(event) => setIncludePortfolio(event.target.checked)} />
          <Input name="extraLink" label="추가 링크" placeholder="https://" value={extraLink} onChange={(event) => setExtraLink(event.target.value)} />
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-2">
        <Link href={`/jobs/${job.id}`} className={linkSecondaryClass}>
          취소
        </Link>
        <Button type="submit">지원하기</Button>
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
      <Link href={href} className="mt-6 inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark">
        {action}
      </Link>
    </div>
  );
}
