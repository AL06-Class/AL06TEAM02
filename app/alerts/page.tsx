"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Bell, BriefcaseBusiness, CheckCircle2, CreditCard, Megaphone } from "lucide-react";
import { Badge, Button, EmptyState, Tabs } from "@/components/ui";
import { jobs } from "@/data/jobs";
import { useAuth } from "@/lib/auth-context";
import { formatDate, formatKrw } from "@/lib/format";
import { readStorageJSON, storageKeys, writeStorageJSON } from "@/lib/storage";

type AlertTab = "all" | "activity" | "payment" | "notice";
type AlertCategory = Exclude<AlertTab, "all">;

interface ApplicationRecord {
  id: string;
  jobId: number;
  jobTitle: string;
  companyName: string;
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

interface PaymentRecord {
  id: string;
  productKey?: string;
  productName: string;
  optionLabel?: string;
  amount: number;
  paidAt: string;
  status?: string;
}

interface StatusOverride {
  status: string;
  reason?: string;
  updatedAt: string;
}

interface AlertItem {
  id: string;
  category: AlertCategory;
  title: string;
  message: string;
  time: string;
  href: string;
  icon: "activity" | "payment" | "notice" | "ad";
}

interface AlertSources {
  applications: ApplicationRecord[];
  proposals: ProposalRecord[];
  payments: PaymentRecord[];
  verificationStatuses: Record<string, StatusOverride>;
  jobStatuses: Record<string, StatusOverride>;
  profileStatuses: Record<string, StatusOverride>;
}

const defaultSources: AlertSources = {
  applications: [],
  proposals: [],
  payments: [],
  verificationStatuses: {},
  jobStatuses: {},
  profileStatuses: {},
};

const demoAlerts: AlertItem[] = [
  {
    id: "demo-notice-10",
    category: "notice",
    title: "7월 서비스 개선 사항이 등록되었습니다",
    message: "필터 유지, 신고 처리, 모바일 탐색 흐름이 개선되었습니다.",
    time: "2026-07-05T09:00:00.000Z",
    href: "/notice/10",
    icon: "notice",
  },
  {
    id: "demo-payment-contact-pass",
    category: "payment",
    title: "연락처 열람권 만료 예정",
    message: "이용권 만료 3일 전부터 갱신 안내가 표시됩니다.",
    time: "2026-07-06T08:30:00.000Z",
    href: "/mypage/contact-pass",
    icon: "payment",
  },
  {
    id: "demo-activity-proposal",
    category: "activity",
    title: "새 제안이 도착했습니다",
    message: "게시중 공고와 연결된 제안은 상세 공고에서 확인할 수 있습니다.",
    time: "2026-07-06T11:20:00.000Z",
    href: "/alerts",
    icon: "activity",
  },
];

function paymentHref(payment: PaymentRecord) {
  if (payment.productKey === "contact-pass") return "/mypage/contact-pass";
  if (payment.productKey === "jump") return "/mypage/jump";
  if (payment.productKey === "banner") return "/mypage/banners";
  if (payment.productKey === "promotion") return "/mypage/promotion";
  return "/mypage/payments";
}

function iconFor(item: AlertItem) {
  if (item.icon === "payment") return <CreditCard aria-hidden className="h-5 w-5" />;
  if (item.icon === "ad") return <Megaphone aria-hidden className="h-5 w-5" />;
  if (item.icon === "notice") return <Bell aria-hidden className="h-5 w-5" />;
  return <BriefcaseBusiness aria-hidden className="h-5 w-5" />;
}

function buildAlerts(sources: AlertSources) {
  const applicationAlerts = sources.applications.map<AlertItem>((item) => ({
    id: `application-${item.id}`,
    category: "activity",
    title: item.status ? `지원 상태가 ${item.status}(으)로 변경되었습니다` : "지원이 접수되었습니다",
    message: `${item.companyName} · ${item.jobTitle}`,
    time: item.appliedAt,
    href: `/jobs/${item.jobId}`,
    icon: "activity",
  }));

  const proposalAlerts = sources.proposals.map<AlertItem>((item) => {
    const job = jobs.find((target) => target.id === item.jobId);
    return {
      id: `proposal-${item.id}`,
      category: "activity",
      title: "촬영 제안이 도착했습니다",
      message: `${job?.companyName ?? "기업회원"} · ${job?.title ?? "관련 공고"}`,
      time: item.sentAt,
      href: job ? `/jobs/${job.id}` : "/alerts",
      icon: "activity",
    };
  });

  const paymentAlerts = sources.payments.map<AlertItem>((item) => ({
    id: `payment-${item.id}`,
    category: "payment",
    title: `${item.productName} ${item.status ?? "결제완료"}`,
    message: `${item.optionLabel ?? "기본 옵션"} · ${formatKrw(item.amount)}`,
    time: item.paidAt,
    href: paymentHref(item),
    icon: item.productKey === "banner" ? "ad" : "payment",
  }));

  const verificationAlerts = Object.entries(sources.verificationStatuses).map<AlertItem>(([id, item]) => ({
    id: `verification-${id}-${item.updatedAt}`,
    category: "notice",
    title: `기업 인증 상태가 ${item.status}(으)로 변경되었습니다`,
    message: item.reason ?? "마이페이지에서 심사 결과를 확인해 주세요.",
    time: item.updatedAt,
    href: "/mypage/verification",
    icon: "notice",
  }));

  const jobReviewAlerts = Object.entries(sources.jobStatuses).map<AlertItem>(([id, item]) => ({
    id: `job-review-${id}-${item.updatedAt}`,
    category: "notice",
    title: `공고 심사 결과: ${item.status}`,
    message: item.reason ?? "공고 관리에서 상태와 조치 내용을 확인해 주세요.",
    time: item.updatedAt,
    href: "/mypage/jobs",
    icon: "notice",
  }));

  const profileReviewAlerts = Object.entries(sources.profileStatuses).map<AlertItem>(([id, item]) => ({
    id: `profile-review-${id}-${item.updatedAt}`,
    category: "notice",
    title: `프로필 검수 결과: ${item.status}`,
    message: item.reason ?? "내 프로필 관리에서 공개 상태를 확인해 주세요.",
    time: item.updatedAt,
    href: "/mypage/profile",
    icon: "notice",
  }));

  return [...applicationAlerts, ...proposalAlerts, ...paymentAlerts, ...verificationAlerts, ...jobReviewAlerts, ...profileReviewAlerts, ...demoAlerts].sort(
    (left, right) => new Date(right.time).getTime() - new Date(left.time).getTime(),
  );
}

export default function AlertsPage() {
  const router = useRouter();
  const { role, isReady } = useAuth();
  const [tab, setTab] = useState<AlertTab>("all");
  const [sources, setSources] = useState<AlertSources>(defaultSources);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    if (isReady && role === "guest") {
      router.replace(`/login?redirect=${encodeURIComponent("/alerts")}`);
    }
  }, [isReady, role, router]);

  useEffect(() => {
    if (!isReady || role === "guest") return;
    setSources({
      applications: readStorageJSON<ApplicationRecord[]>(storageKeys.applications, []),
      proposals: readStorageJSON<ProposalRecord[]>(storageKeys.proposals, []),
      payments: readStorageJSON<PaymentRecord[]>(storageKeys.payments, []),
      verificationStatuses: readStorageJSON<Record<string, StatusOverride>>(storageKeys.adminVerificationStatuses, {}),
      jobStatuses: readStorageJSON<Record<string, StatusOverride>>(storageKeys.adminJobStatuses, {}),
      profileStatuses: readStorageJSON<Record<string, StatusOverride>>(storageKeys.adminProfileStatuses, {}),
    });
    setReadIds(readStorageJSON<string[]>(storageKeys.alertsRead, []));
  }, [isReady, role]);

  const alerts = useMemo(() => buildAlerts(sources), [sources]);
  const visibleAlerts = tab === "all" ? alerts : alerts.filter((item) => item.category === tab);
  const unreadCount = alerts.filter((item) => !readIds.includes(item.id)).length;

  function markAllRead() {
    const next = alerts.map((item) => item.id);
    setReadIds(next);
    writeStorageJSON(storageKeys.alertsRead, next);
  }

  if (!isReady || role === "guest") {
    return <div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">알림 접근 권한을 확인하는 중입니다.</div>;
  }

  return (
    <div className="mx-auto max-w-[920px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-ink">알림함</h1>
          <p className="mt-1 text-sm text-muted">지원, 제안, 결제, 심사 결과와 공지를 확인합니다.</p>
        </div>
        <Button variant="secondary" onClick={markAllRead} leftIcon={<CheckCircle2 aria-hidden className="h-4 w-4" />}>
          모두 읽음
        </Button>
      </div>

      <Tabs
        value={tab}
        onChange={(value) => setTab(value as AlertTab)}
        items={[
          { label: `전체 ${alerts.length}`, value: "all" },
          { label: "지원·제안", value: "activity" },
          { label: "결제·이용권", value: "payment" },
          { label: "공지", value: "notice" },
        ]}
      />

      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-ink">미읽음 {unreadCount}개</span>
        <Badge label={tab === "all" ? "전체" : tab === "activity" ? "지원·제안" : tab === "payment" ? "결제·이용권" : "공지"} />
      </div>

      {visibleAlerts.length > 0 ? (
        <div className="divide-y divide-line rounded-md border border-line bg-surface shadow-card">
          {visibleAlerts.map((item) => {
            const unread = !readIds.includes(item.id);
            return (
              <Link key={item.id} href={item.href} className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 p-4 text-sm transition hover:bg-page">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-soft text-primary">{iconFor(item)}</span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    {unread ? <span className="h-2 w-2 rounded-full bg-primary" aria-label="미읽음" /> : null}
                    <strong className="truncate text-ink">{item.title}</strong>
                  </span>
                  <span className="mt-1 block truncate text-muted">{item.message}</span>
                </span>
                <span className="shrink-0 text-xs text-muted">{formatDate(item.time)}</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState title="표시할 알림이 없습니다" icon={<Bell aria-hidden className="h-6 w-6" />} className="rounded-md border border-line bg-surface shadow-card" />
      )}
    </div>
  );
}
