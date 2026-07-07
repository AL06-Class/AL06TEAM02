"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, ClipboardCheck, ExternalLink, FileText, ShieldAlert } from "lucide-react";
import { Badge, Button, Checkbox, EmptyState, Input, Select, Table, Textarea, useToast } from "@/components/ui";
import { cn } from "@/components/ui/utils";
import { companyMembers, personalMembers } from "@/data/members";
import { jobs as jobSamples } from "@/data/jobs";
import {
  type AdminJobRecord,
  type AdminJobStatus,
  type AdminPaymentRecord,
  type AdminProfileRecord,
  type AdminProfileStatus,
  type AdminReportRecord,
  type AdminVerificationRecord,
  type ReportStatus,
  type VerifyStatus,
  getJobRows,
  getProfileRows,
  getRecentPayments,
  getReports,
  getStorePendingCount,
  getVerificationRows,
  updateJobStatus,
  updateProfileStatus,
  updateReportStatus,
  updateVerificationStatus,
} from "@/lib/admin-storage";
import { formatDate, formatKrw } from "@/lib/format";
import { readStorageJSON, storageKeys } from "@/lib/storage";

type ChipTone = "primary" | "success" | "warning" | "danger" | "muted";

interface SummaryChip {
  label: string;
  value: string | number;
  tone?: ChipTone;
}

const rejectPresets = ["서류 기한 초과", "정보 불일치", "판독 불가", "기타"];
const reportActions = ["숨김", "삭제", "경고", "회원 정지"];
const profilePlaceholder = "/images/presets/placeholders/shootmon-placeholder-profile-01.svg";

function chipClass(tone: ChipTone = "primary") {
  return {
    primary: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-danger",
    muted: "bg-surface text-muted",
  }[tone];
}

function AdminPageFrame({
  title,
  chips,
  filters,
  children,
  detail,
}: {
  title: string;
  chips: SummaryChip[];
  filters: ReactNode;
  children: ReactNode;
  detail: ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-ink">{title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span key={chip.label} className={cn("rounded-sm px-3 py-1.5 text-sm font-bold", chipClass(chip.tone))}>
                {chip.label} {chip.value}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_480px]">
        <section className="min-w-0 space-y-4">
          <div className="rounded-md border border-line bg-surface p-4 shadow-card">{filters}</div>
          {children}
        </section>
        <aside className="min-w-0 xl:sticky xl:top-24 xl:h-[calc(100svh-120px)]">
          <div className="h-full overflow-y-auto rounded-md border border-line bg-surface shadow-modal">{detail}</div>
        </aside>
      </div>
    </div>
  );
}

function DetailShell({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-line px-5 py-4">
        <p className="text-xs font-bold text-muted">상세 패널</p>
        <h2 className="mt-1 text-xl font-black text-ink">{title}</h2>
      </div>
      <div className="flex-1 space-y-5 p-5">{children}</div>
      {actions ? <div className="sticky bottom-0 border-t border-line bg-surface p-4">{actions}</div> : null}
    </div>
  );
}

function EmptyDetail() {
  return <EmptyState title="목록에서 항목을 선택하세요" className="min-h-full border-0" icon={<FileText aria-hidden className="h-6 w-6" />} />;
}

function InfoGrid({ rows }: { rows: Array<[string, ReactNode]> }) {
  return (
    <dl className="grid gap-2 text-sm">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[112px_minmax(0,1fr)] gap-3 rounded-sm bg-page px-3 py-2">
          <dt className="font-semibold text-muted">{label}</dt>
          <dd className="min-w-0 font-semibold text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ReasonBox({
  preset,
  setPreset,
  reason,
  setReason,
  presets = rejectPresets,
}: {
  preset: string;
  setPreset: (value: string) => void;
  reason: string;
  setReason: (value: string) => void;
  presets?: string[];
}) {
  return (
    <div className="grid gap-3">
      <Select
        label="사유 프리셋"
        value={preset}
        onChange={(event) => setPreset(event.target.value)}
        options={[{ label: "선택", value: "" }, ...presets.map((item) => ({ label: item, value: item }))]}
      />
      <Textarea label="상세 사유" requiredMark rows={3} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="반려 또는 보완요청 사유를 입력하세요." />
    </div>
  );
}

function composedReason(preset: string, reason: string) {
  return [preset, reason.trim()].filter(Boolean).join(" · ");
}

function ToggleSelection({
  id,
  selected,
  setSelected,
}: {
  id: number | string;
  selected: Set<string>;
  setSelected: (updater: (current: Set<string>) => Set<string>) => void;
}) {
  const key = String(id);
  return (
    <Checkbox
      aria-label="선택"
      label=""
      checked={selected.has(key)}
      onChange={(event) => {
        setSelected((current) => {
          const next = new Set(current);
          if (event.target.checked) next.add(key);
          else next.delete(key);
          return next;
        });
      }}
    />
  );
}

export function AdminDashboard() {
  const [verifications, setVerifications] = useState<AdminVerificationRecord[]>([]);
  const [jobs, setJobs] = useState<AdminJobRecord[]>([]);
  const [profiles, setProfiles] = useState<AdminProfileRecord[]>([]);
  const [reports, setReports] = useState<AdminReportRecord[]>([]);
  const [payments, setPayments] = useState<AdminPaymentRecord[]>([]);
  const [storePending, setStorePending] = useState(0);

  useEffect(() => {
    setVerifications(getVerificationRows());
    setJobs(getJobRows());
    setProfiles(getProfileRows());
    setReports(getReports());
    setPayments(getRecentPayments());
    setStorePending(getStorePendingCount());
  }, []);

  const applications = readStorageJSON<unknown[]>(storageKeys.applications, []);
  const today = new Date().toISOString().slice(0, 10);
  const todayPayments = payments.filter((payment) => payment.paidAt.slice(0, 10) === today);
  const cards = [
    { label: "기업 인증", value: verifications.filter((item) => item.status === "검수중").length, href: "/admin/verifications", icon: BuildingIcon },
    { label: "공고 심사", value: jobs.filter((item) => item.status === "심사중").length, href: "/admin/jobs", icon: BriefcaseIcon },
    { label: "프로필 검수", value: profiles.filter((item) => item.status === "검수중").length, href: "/admin/profiles", icon: UserIcon },
    { label: "스토어 검수", value: storePending, href: "/admin/store", icon: StoreIcon },
    { label: "신고", value: reports.filter((item) => item.status === "접수" || item.status === "검토중").length, href: "/admin/reports", icon: ReportIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink">관리자 대시보드</h1>
        <p className="mt-1 text-sm text-muted">오늘 처리해야 할 심사와 운영 항목입니다.</p>
      </div>
      <section className="grid gap-3 md:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href} className="rounded-md border border-line bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-hover">
              <div className="flex items-center justify-between gap-3">
                <Icon />
                <ArrowRight aria-hidden className="h-4 w-4 text-muted" />
              </div>
              <p className="mt-4 text-sm font-bold text-muted">{card.label}</p>
              <p className="mt-1 text-3xl font-black text-ink">{card.value}</p>
            </Link>
          );
        })}
      </section>
      <section className="grid gap-3 md:grid-cols-4">
        <TodayChip label="신규 가입" value={[...companyMembers, ...personalMembers].filter((item) => item.joinedAt === today).length} />
        <TodayChip label="신규 공고" value={jobSamples.filter((item) => item.createdAt === today).length} />
        <TodayChip label="신규 지원" value={applications.length} />
        <TodayChip label="매출" value={formatKrw(todayPayments.reduce((sum, payment) => sum + payment.amount, 0))} />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <RecentPanel title="최근 신고 5건">
          {reports.slice(0, 5).map((report) => (
            <Link key={report.id} href="/admin/reports" className="block rounded-sm bg-page px-3 py-2 text-sm hover:bg-primary-soft">
              <div className="flex items-center gap-2">
                <Badge label={report.status} />
                <span className="truncate font-bold text-ink">{report.targetTitle}</span>
              </div>
              <p className="mt-1 truncate text-muted">{report.reason} · {report.reporter}</p>
            </Link>
          ))}
        </RecentPanel>
        <RecentPanel title="최근 결제 5건">
          {payments.slice(0, 5).map((payment) => (
            <div key={payment.id} className="rounded-sm bg-page px-3 py-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate font-bold text-ink">{payment.productName}</span>
                <strong>{formatKrw(payment.amount)}</strong>
              </div>
              <p className="mt-1 truncate text-muted">{payment.member} · {formatDate(payment.paidAt)}</p>
            </div>
          ))}
        </RecentPanel>
      </section>
    </div>
  );
}

function TodayChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-line bg-surface px-4 py-3 shadow-card">
      <p className="text-xs font-bold text-muted">{label}</p>
      <p className="mt-1 text-lg font-black text-ink">{value}</p>
    </div>
  );
}

function RecentPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-md border border-line bg-surface p-4 shadow-card">
      <h2 className="text-lg font-black text-ink">{title}</h2>
      <div className="mt-4 grid gap-2">{children}</div>
    </div>
  );
}

function BuildingIcon() {
  return <ClipboardCheck aria-hidden className="h-6 w-6 text-primary" />;
}

function BriefcaseIcon() {
  return <FileText aria-hidden className="h-6 w-6 text-primary" />;
}

function UserIcon() {
  return <CheckCircle2 aria-hidden className="h-6 w-6 text-primary" />;
}

function StoreIcon() {
  return <ShieldAlert aria-hidden className="h-6 w-6 text-primary" />;
}

function ReportIcon() {
  return <ShieldAlert aria-hidden className="h-6 w-6 text-danger" />;
}

export function AdminVerificationsPage() {
  const { showToast } = useToast();
  const [rows, setRows] = useState<AdminVerificationRecord[]>([]);
  const [status, setStatus] = useState("전체");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [preset, setPreset] = useState("");
  const [reason, setReason] = useState("");

  function reload(nextSelectedId = selectedId) {
    const nextRows = getVerificationRows();
    setRows(nextRows);
    if (nextSelectedId && !nextRows.some((item) => item.id === nextSelectedId)) setSelectedId(null);
  }

  useEffect(() => {
    const nextRows = getVerificationRows();
    setRows(nextRows);
    setSelectedId(nextRows[0]?.id ?? null);
  }, []);

  const filtered = rows.filter((row) => (status === "전체" || row.status === status) && [row.companyName, row.email, row.bizNumber].some((value) => value.includes(query.trim())));
  const selected = rows.find((row) => row.id === selectedId) ?? filtered[0] ?? null;
  const chips = [
    { label: "검수중", value: rows.filter((row) => row.status === "검수중").length, tone: "warning" as const },
    { label: "인증완료", value: rows.filter((row) => row.status === "인증완료").length, tone: "success" as const },
    { label: "반려", value: rows.filter((row) => row.status === "반려").length, tone: "danger" as const },
  ];

  function setVerification(row: AdminVerificationRecord, nextStatus: VerifyStatus, nextReason?: string) {
    updateVerificationStatus(row.id, nextStatus, nextReason);
    reload(row.id);
    setReason("");
    setPreset("");
    showToast(`${row.companyName} 상태가 ${nextStatus}(으)로 변경되었습니다.`);
  }

  function bulkApprove() {
    rows.filter((row) => selectedRows.has(String(row.id))).forEach((row) => updateVerificationStatus(row.id, "인증완료"));
    setSelectedRows(new Set());
    reload();
    showToast("선택한 기업 인증을 승인했습니다.");
  }

  return (
    <AdminPageFrame
      title="기업 인증 심사"
      chips={chips}
      filters={
        <div className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)_auto]">
          <Select value={status} onChange={(event) => setStatus(event.target.value)} options={["전체", "미인증", "검수중", "인증완료", "반려"].map((item) => ({ label: item, value: item }))} />
          <Input search placeholder="회사명, 이메일, 사업자번호 검색" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery("")} />
          <Button variant="outline" disabled={selectedRows.size === 0} onClick={bulkApprove}>
            선택 승인
          </Button>
        </div>
      }
      detail={
        selected ? (
          <DetailShell
            title={selected.companyName}
            actions={
              <div className="space-y-3">
                <ReasonBox preset={preset} setPreset={setPreset} reason={reason} setReason={setReason} />
                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={() => setVerification(selected, "인증완료")}>승인</Button>
                  <Button variant="danger" disabled={!reason.trim()} onClick={() => setVerification(selected, "반려", composedReason(preset, reason))}>
                    반려
                  </Button>
                  <Button variant="secondary" disabled={!reason.trim()} onClick={() => setVerification(selected, "검수중", composedReason(preset, reason))}>
                    보완요청
                  </Button>
                </div>
              </div>
            }
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
              <section className="rounded-md border border-line p-4">
                <h3 className="font-black text-ink">가입 정보</h3>
                <InfoGrid rows={[["회사명", selected.companyName], ["대표자", selected.ceoName], ["사업자번호", selected.bizNumber], ["이메일", selected.email]]} />
              </section>
              <section className="rounded-md border border-line p-4">
                <h3 className="font-black text-ink">제출 서류</h3>
                <div className="mt-3 flex min-h-40 items-center justify-center rounded-md border border-dashed border-line bg-page text-sm font-bold text-muted">서류 미리보기</div>
              </section>
            </div>
            <section>
              <h3 className="font-black text-ink">체크리스트</h3>
              <div className="mt-3 grid gap-2">
                {["3개월 이내 발급", "회사명 일치", "대표자 일치", "사업자번호 일치"].map((item) => <Checkbox key={item} label={item} />)}
              </div>
            </section>
          </DetailShell>
        ) : (
          <EmptyDetail />
        )
      }
    >
      <Table
        rows={filtered}
        getRowKey={(row) => String(row.id)}
        columns={[
          { key: "select", header: "선택", render: (row) => <ToggleSelection id={row.id} selected={selectedRows} setSelected={setSelectedRows} /> },
          { key: "status", header: "상태", render: (row) => <Badge label={row.status} /> },
          { key: "target", header: "대상", render: (row) => <button className="font-bold text-ink hover:text-primary" onClick={() => setSelectedId(row.id)}>{row.companyName}</button> },
          { key: "actor", header: "신청자", render: (row) => row.email },
          { key: "date", header: "접수일", render: (row) => formatDate(row.requestedAt) },
          { key: "action", header: "액션", render: (row) => <Button size="sm" variant="outline" onClick={() => setSelectedId(row.id)}>상세</Button> },
        ]}
      />
    </AdminPageFrame>
  );
}

export function AdminJobsPage() {
  const { showToast } = useToast();
  const [rows, setRows] = useState<AdminJobRecord[]>([]);
  const [status, setStatus] = useState("전체");
  const [premium, setPremium] = useState("전체");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState("");

  function reload(nextSelectedId = selectedId) {
    const nextRows = getJobRows();
    setRows(nextRows);
    if (nextSelectedId && !nextRows.some((item) => item.id === nextSelectedId)) setSelectedId(null);
  }

  useEffect(() => {
    const nextRows = getJobRows();
    setRows(nextRows);
    setSelectedId(nextRows[0]?.id ?? null);
  }, []);

  const filtered = rows.filter((row) => {
    const statusMatch = status === "전체" || row.status === status;
    const premiumMatch = premium === "전체" || (premium === "프리미엄" ? row.isPremium : !row.isPremium);
    const queryMatch = [row.title, row.companyName, row.category].some((value) => value.includes(query.trim()));
    return statusMatch && premiumMatch && queryMatch;
  });
  const selected = rows.find((row) => row.id === selectedId) ?? filtered[0] ?? null;

  function setJob(row: AdminJobRecord, nextStatus: AdminJobStatus, nextReason?: string) {
    updateJobStatus(row.id, nextStatus, nextReason);
    reload(row.id);
    setReason("");
    showToast(`${row.title} 상태가 ${nextStatus}(으)로 변경되었습니다.`);
  }

  function bulkApprove() {
    rows.filter((row) => selectedRows.has(String(row.id))).forEach((row) => updateJobStatus(row.id, "게시중"));
    setSelectedRows(new Set());
    reload();
    showToast("선택한 공고를 승인했습니다.");
  }

  return (
    <AdminPageFrame
      title="공고 심사"
      chips={[
        { label: "심사중", value: rows.filter((row) => row.status === "심사중").length, tone: "warning" },
        { label: "게시중", value: rows.filter((row) => row.status === "게시중").length, tone: "success" },
        { label: "반려", value: rows.filter((row) => row.status === "반려").length, tone: "danger" },
      ]}
      filters={
        <div className="grid gap-3 md:grid-cols-[160px_160px_minmax(0,1fr)_auto]">
          <Select value={status} onChange={(event) => setStatus(event.target.value)} options={["전체", "심사중", "게시중", "반려", "마감", "비공개"].map((item) => ({ label: item, value: item }))} />
          <Select value={premium} onChange={(event) => setPremium(event.target.value)} options={["전체", "프리미엄", "일반"].map((item) => ({ label: item, value: item }))} />
          <Input search placeholder="공고명, 기업명, 분야 검색" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery("")} />
          <Button variant="outline" disabled={selectedRows.size === 0} onClick={bulkApprove}>선택 승인</Button>
        </div>
      }
      detail={
        selected ? (
          <DetailShell
            title={selected.title}
            actions={
              <div className="space-y-3">
                <Textarea label="반려 사유" requiredMark rows={3} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="반려 사유를 입력하세요." />
                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={() => setJob(selected, "게시중")}>승인</Button>
                  <Button variant="danger" disabled={!reason.trim()} onClick={() => setJob(selected, "반려", reason)}>반려</Button>
                  <Button variant="secondary" onClick={() => setJob(selected, "비공개")}>비공개</Button>
                </div>
              </div>
            }
          >
            <InfoGrid rows={[["기업", selected.companyName], ["인증 상태", companyMembers.find((company) => company.companyName === selected.companyName)?.verifyStatus ?? "인증완료"], ["분야", selected.category], ["급여", selected.payAmount], ["마감", selected.deadline ?? selected.deadlineType]]} />
            <section>
              <h3 className="font-black text-ink">공고 전문 미리보기</h3>
              <div className="mt-3 rounded-md border border-line bg-page p-4 text-sm leading-7 text-ink">
                <p className="font-bold">{selected.title}</p>
                <p className="mt-2">{selected.description}</p>
                <p className="mt-2 text-muted">{selected.address} · {selected.managerName} · {selected.managerEmail}</p>
              </div>
            </section>
            <section>
              <h3 className="font-black text-ink">점검 포인트</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {["불건전", "저단가", "연락처 오기재", "광고성"].map((item) => <Badge key={item} label={item} tone="muted" />)}
              </div>
            </section>
          </DetailShell>
        ) : (
          <EmptyDetail />
        )
      }
    >
      <Table
        rows={filtered}
        getRowKey={(row) => String(row.id)}
        columns={[
          { key: "select", header: "선택", render: (row) => <ToggleSelection id={row.id} selected={selectedRows} setSelected={setSelectedRows} /> },
          { key: "status", header: "상태", render: (row) => <Badge label={row.status} /> },
          { key: "target", header: "대상", render: (row) => <button className="font-bold text-ink hover:text-primary" onClick={() => setSelectedId(row.id)}>{row.title}</button> },
          { key: "actor", header: "작성자", render: (row) => row.companyName },
          { key: "date", header: "접수일", render: (row) => formatDate(row.createdAt) },
          { key: "premium", header: "프리미엄", render: (row) => row.isPremium ? <Badge label="프리미엄" /> : <span className="text-muted">일반</span> },
          { key: "action", header: "액션", render: (row) => <Button size="sm" variant="outline" onClick={() => setSelectedId(row.id)}>상세</Button> },
        ]}
      />
    </AdminPageFrame>
  );
}

export function AdminProfilesPage() {
  const { showToast } = useToast();
  const [rows, setRows] = useState<AdminProfileRecord[]>([]);
  const [status, setStatus] = useState("전체");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState("");

  function reload(nextSelectedId = selectedId) {
    const nextRows = getProfileRows();
    setRows(nextRows);
    if (nextSelectedId && !nextRows.some((item) => item.id === nextSelectedId)) setSelectedId(null);
  }

  useEffect(() => {
    const nextRows = getProfileRows();
    setRows(nextRows);
    setSelectedId(nextRows[0]?.id ?? null);
  }, []);

  const filtered = rows.filter((row) => (status === "전체" || row.status === status) && [row.title, row.maskedName, row.region].some((value) => value.includes(query.trim())));
  const selected = rows.find((row) => row.id === selectedId) ?? filtered[0] ?? null;

  function setProfile(row: AdminProfileRecord, nextStatus: AdminProfileStatus, nextReason?: string) {
    updateProfileStatus(row.id, nextStatus, nextReason);
    reload(row.id);
    setReason("");
    showToast(`${row.title} 상태가 ${nextStatus}(으)로 변경되었습니다.`);
  }

  function bulkApprove() {
    rows.filter((row) => selectedRows.has(String(row.id))).forEach((row) => updateProfileStatus(row.id, "공개"));
    setSelectedRows(new Set());
    reload();
    showToast("선택한 프로필을 승인했습니다.");
  }

  return (
    <AdminPageFrame
      title="프로필 검수"
      chips={[
        { label: "검수중", value: rows.filter((row) => row.status === "검수중").length, tone: "warning" },
        { label: "공개", value: rows.filter((row) => row.status === "공개").length, tone: "success" },
        { label: "반려", value: rows.filter((row) => row.status === "반려").length, tone: "danger" },
      ]}
      filters={
        <div className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)_auto]">
          <Select value={status} onChange={(event) => setStatus(event.target.value)} options={["전체", "검수중", "공개", "비공개", "반려"].map((item) => ({ label: item, value: item }))} />
          <Input search placeholder="프로필명, 이름, 지역 검색" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery("")} />
          <Button variant="outline" disabled={selectedRows.size === 0} onClick={bulkApprove}>선택 승인</Button>
        </div>
      }
      detail={
        selected ? (
          <DetailShell
            title={selected.title}
            actions={
              <div className="space-y-3">
                <Textarea label="반려 사유" requiredMark rows={3} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="반려 사유를 입력하세요." />
                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={() => setProfile(selected, "공개")}>승인</Button>
                  <Button variant="danger" disabled={!reason.trim()} onClick={() => setProfile(selected, "반려", reason)}>반려</Button>
                  <Button variant="secondary" onClick={() => setProfile(selected, "비공개")}>비공개</Button>
                </div>
              </div>
            }
          >
            <InfoGrid rows={[["촬영자", selected.maskedName], ["연락처", selected.phone], ["이메일", selected.email], ["지역", selected.region], ["단가", selected.desiredPay]]} />
            <section>
              <h3 className="font-black text-ink">프로필 전문</h3>
              <div className="mt-3 rounded-md border border-line bg-page p-4 text-sm leading-7 text-ink">
                <p>{selected.careerHistory.join(" / ")}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[...selected.categories, ...selected.equipment].map((item) => <Badge key={item} label={item} />)}
                </div>
              </div>
            </section>
            <section>
              <h3 className="font-black text-ink">포트폴리오 썸네일</h3>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {selected.portfolioImages.slice(0, 6).map((src, index) => (
                  <div key={`${src}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-sm bg-page">
                    <Image src={src || profilePlaceholder} alt="포트폴리오 썸네일" fill sizes="140px" className="object-cover" />
                  </div>
                ))}
              </div>
            </section>
          </DetailShell>
        ) : (
          <EmptyDetail />
        )
      }
    >
      <Table
        rows={filtered}
        getRowKey={(row) => String(row.id)}
        columns={[
          { key: "select", header: "선택", render: (row) => <ToggleSelection id={row.id} selected={selectedRows} setSelected={setSelectedRows} /> },
          { key: "status", header: "상태", render: (row) => <Badge label={row.status} /> },
          { key: "target", header: "대상", render: (row) => <button className="font-bold text-ink hover:text-primary" onClick={() => setSelectedId(row.id)}>{row.title}</button> },
          { key: "actor", header: "작성자", render: (row) => row.maskedName },
          { key: "date", header: "접수일", render: (row) => formatDate(row.submittedAt) },
          { key: "action", header: "액션", render: (row) => <Button size="sm" variant="outline" onClick={() => setSelectedId(row.id)}>상세</Button> },
        ]}
      />
    </AdminPageFrame>
  );
}

export function AdminReportsPage() {
  const { showToast } = useToast();
  const [rows, setRows] = useState<AdminReportRecord[]>([]);
  const [status, setStatus] = useState("전체");
  const [targetType, setTargetType] = useState("전체");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [action, setAction] = useState(reportActions[0]);

  function reload(nextSelectedId = selectedId) {
    const nextRows = getReports();
    setRows(nextRows);
    if (nextSelectedId && !nextRows.some((item) => item.id === nextSelectedId)) setSelectedId(null);
  }

  useEffect(() => {
    const nextRows = getReports();
    setRows(nextRows);
    setSelectedId(nextRows[0]?.id ?? null);
  }, []);

  const filtered = rows.filter((row) => {
    const statusMatch = status === "전체" || row.status === status;
    const typeMatch = targetType === "전체" || row.targetType === targetType;
    const queryMatch = [row.targetTitle, row.reason, row.reporter].some((value) => value.includes(query.trim()));
    return statusMatch && typeMatch && queryMatch;
  });
  const selected = rows.find((row) => row.id === selectedId) ?? filtered[0] ?? null;

  function setReport(row: AdminReportRecord, nextStatus: ReportStatus, nextReason?: string, nextAction?: string) {
    updateReportStatus(row.id, nextStatus, nextReason, nextAction);
    reload(row.id);
    setReason("");
    showToast(`신고 상태가 ${nextStatus}(으)로 변경되었습니다.`);
  }

  const cumulative = selected ? rows.filter((row) => row.targetUrl === selected.targetUrl).length : 0;

  return (
    <AdminPageFrame
      title="신고 처리"
      chips={[
        { label: "접수", value: rows.filter((row) => row.status === "접수").length, tone: "warning" },
        { label: "검토중", value: rows.filter((row) => row.status === "검토중").length, tone: "primary" },
        { label: "완료", value: rows.filter((row) => row.status === "조치완료").length, tone: "success" },
      ]}
      filters={
        <div className="grid gap-3 md:grid-cols-[160px_160px_minmax(0,1fr)]">
          <Select value={status} onChange={(event) => setStatus(event.target.value)} options={["전체", "접수", "검토중", "조치완료", "반려"].map((item) => ({ label: item, value: item }))} />
          <Select value={targetType} onChange={(event) => setTargetType(event.target.value)} options={["전체", "공고", "프로필", "게시글", "댓글", "상품"].map((item) => ({ label: item, value: item }))} />
          <Input search placeholder="대상, 사유, 신고자 검색" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery("")} />
        </div>
      }
      detail={
        selected ? (
          <DetailShell
            title={selected.targetTitle}
            actions={
              <div className="space-y-3">
                {selected.status === "접수" ? (
                  <Button className="w-full" onClick={() => setReport(selected, "검토중")}>검토 시작</Button>
                ) : (
                  <>
                    <Select label="조치 내용" value={action} onChange={(event) => setAction(event.target.value)} options={reportActions.map((item) => ({ label: item, value: item }))} />
                    <Textarea label="반려 사유" requiredMark rows={3} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="반려 시 사유를 입력하세요." />
                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={() => setReport(selected, "조치완료", undefined, action)}>조치완료</Button>
                      <Button variant="danger" disabled={!reason.trim()} onClick={() => setReport(selected, "반려", reason)}>반려</Button>
                    </div>
                  </>
                )}
              </div>
            }
          >
            <InfoGrid rows={[["상태", <Badge key="badge" label={selected.status} />], ["대상 유형", selected.targetType], ["신고자", selected.reporter], ["접수일", formatDate(selected.receivedAt)], ["누적 신고", `${cumulative}건`]]} />
            <section>
              <h3 className="font-black text-ink">신고 전문</h3>
              <div className="mt-3 rounded-md border border-line bg-page p-4 text-sm leading-7 text-ink">
                <p className="font-bold">{selected.reason}</p>
                <p className="mt-2">{selected.detail || "상세 내용 없음"}</p>
              </div>
            </section>
            <section>
              <h3 className="font-black text-ink">대상 미리보기</h3>
              <Link href={selected.targetUrl} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary">
                {selected.targetTitle}
                <ExternalLink aria-hidden className="h-4 w-4" />
              </Link>
            </section>
          </DetailShell>
        ) : (
          <EmptyDetail />
        )
      }
    >
      <Table
        rows={filtered}
        getRowKey={(row) => row.id}
        columns={[
          { key: "status", header: "상태", render: (row) => <Badge label={row.status} /> },
          { key: "type", header: "유형", render: (row) => row.targetType },
          { key: "target", header: "대상 링크", render: (row) => <button className="font-bold text-ink hover:text-primary" onClick={() => setSelectedId(row.id)}>{row.targetTitle}</button> },
          { key: "reason", header: "사유", render: (row) => row.reason },
          { key: "reporter", header: "신고자", render: (row) => row.reporter },
          { key: "date", header: "접수일", render: (row) => formatDate(row.receivedAt) },
        ]}
      />
    </AdminPageFrame>
  );
}

export function AdminStorePlaceholder() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-ink">스토어 검수</h1>
        <p className="mt-1 text-sm text-muted">admin-design.md 6장 기준 2차 범위입니다.</p>
      </div>
      <EmptyState title="스토어 검수 화면은 2차 오픈 예정입니다" className="rounded-md border border-line bg-surface shadow-card" />
    </div>
  );
}
