"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Badge, Button, EmptyState, Modal, Tabs } from "@/components/ui";
import { jobs } from "@/data/jobs";
import { profiles } from "@/data/profiles";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/format";
import { readStorageJSON, storageKeys } from "@/lib/storage";

interface ApplicationRecord {
  id: string;
  jobId: number;
  jobTitle: string;
  companyName: string;
  profileId: number | null;
  title: string;
  message: string;
  appliedAt: string;
  status?: string;
}

interface ProposalRecord {
  id: string;
  profileId: number;
  receiverName: string;
  jobId: number;
  message: string;
  sentAt: string;
}

const currentProfile = profiles[0];
const linkPrimaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark";

export default function AlertsPage() {
  const router = useRouter();
  const { role, isReady } = useAuth();
  const [tab, setTab] = useState("applications");
  const [selectedProposal, setSelectedProposal] = useState<ProposalRecord | null>(null);
  const applications = readStorageJSON<ApplicationRecord[]>(storageKeys.applications, []);
  const proposals = readStorageJSON<ProposalRecord[]>(storageKeys.proposals, []).filter((item) => item.profileId === currentProfile.id);

  useEffect(() => {
    if (isReady && role === "guest") {
      router.replace(`/login?redirect=${encodeURIComponent("/alerts")}`);
    }
  }, [isReady, role, router]);

  if (!isReady || role === "guest") {
    return <div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">알림 접근 권한을 확인하는 중입니다.</div>;
  }

  return (
    <div className="mx-auto max-w-[920px] space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink">알림함</h1>
        <p className="mt-1 text-sm text-muted">지원과 제안 알림을 확인합니다.</p>
      </div>
      <Tabs
        items={[
          { label: "지원", value: "applications" },
          { label: "제안", value: "proposals" },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === "applications" ? (
        applications.length > 0 ? (
          <div className="divide-y divide-line rounded-md border border-line bg-surface shadow-card">
            {applications.map((item) => (
              <Link key={item.id} href="/mypage/applications" className="flex items-center justify-between gap-3 p-4 text-sm transition hover:bg-page">
                <span>
                  <strong className="text-ink">{item.companyName}</strong>
                  <span className="ml-2 text-muted">{item.jobTitle}</span>
                </span>
                <Badge label={item.status ?? "지원완료"} />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="지원 알림이 없습니다"
            icon={<Bell aria-hidden className="h-6 w-6" />}
            action={
              <Link href="/jobs" className={linkPrimaryClass}>
                공고 탐색하기
              </Link>
            }
            className="rounded-md border border-line bg-surface shadow-card"
          />
        )
      ) : proposals.length > 0 ? (
        <div className="divide-y divide-line rounded-md border border-line bg-surface shadow-card">
          {proposals.map((item) => {
            const job = jobs.find((target) => target.id === item.jobId);
            return (
              <button key={item.id} type="button" onClick={() => setSelectedProposal(item)} className="flex w-full items-center justify-between gap-3 p-4 text-left text-sm transition hover:bg-page">
                <span>
                  <strong className="text-ink">{job?.companyName ?? "기업회원"}</strong>
                  <span className="ml-2 text-muted">{job?.title ?? "관련 공고"}</span>
                </span>
                <span className="shrink-0 text-xs text-muted">{formatDate(item.sentAt)}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyState title="받은 제안이 없습니다" icon={<Bell aria-hidden className="h-6 w-6" />} className="rounded-md border border-line bg-surface shadow-card" />
      )}
      <ProposalDetail proposal={selectedProposal} onClose={() => setSelectedProposal(null)} />
    </div>
  );
}

function ProposalDetail({ proposal, onClose }: { proposal: ProposalRecord | null; onClose: () => void }) {
  const job = proposal ? jobs.find((item) => item.id === proposal.jobId) : null;

  return (
    <Modal open={Boolean(proposal)} title="제안 상세" onClose={onClose} size="form">
      {proposal ? (
        <div className="space-y-4 text-sm">
          <div className="rounded-md bg-page p-3">
            <p className="font-bold text-ink">{job?.companyName ?? "기업회원"}</p>
            <p className="mt-1 text-muted">{job?.title ?? "관련 공고 없음"}</p>
          </div>
          <p className="whitespace-pre-line leading-6 text-ink">{proposal.message}</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              닫기
            </Button>
            {job ? (
              <Link href={`/jobs/${job.id}`} className={linkPrimaryClass}>
                공고 보기
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
