"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, MapPin } from "lucide-react";
import { Badge, Button, Checkbox, FileUpload, Input, Modal, Radio, Select, Textarea, useToast } from "@/components/ui";
import { cn } from "@/components/ui/utils";
import { companyMembers } from "@/data/members";
import { jobs } from "@/data/jobs";
import { CAREER_OPTIONS, EDITING_TOOL_OPTIONS, EDITING_CATEGORIES, EQUIPMENT_OPTIONS, SHOOTING_CATEGORIES } from "@/lib/filters";
import { formatKrw } from "@/lib/format";
import { useAuth } from "@/lib/auth-context";
import { appendStorageItem, readStorageJSON, storageKeys, writeStorageJSON } from "@/lib/storage";

type MyJobStatus = "게시중" | "심사중" | "반려" | "마감";

interface MyJob {
  id: number;
  jobType: "shooting" | "editing";
  title: string;
  status: MyJobStatus;
  deadline: string;
  isPremium: boolean;
  jumpOn: boolean;
  rejectedReason?: string;
  updatedAt: string;
  jumpCount: number;
}

interface JobDraft {
  title: string;
  category: string;
  headcount: string;
  career: string;
  age: string;
  gender: string;
  deadlineType: "마감일" | "상시채용" | "채용시까지";
  deadline: string;
  shootType: string;
  tasks: string;
  equipment: string[];
  editingTools: string[];
  shootingCategories: string[];
  conditions: string;
  payType: "건당" | "일당" | "월급" | "협의";
  payAmount: string;
  employmentType: string;
  managerName: string;
  managerEmail: string;
  contactVisible: boolean;
  description: string;
  address: string;
  premium: boolean;
  autoJump: boolean;
}

const currentCompany = companyMembers[0];
const sectionNav = [
  ["basic", "기본 정보"],
  ["recruit", "모집 조건"],
  ["shooting", "촬영 조건"],
  ["pay", "급여·계약"],
  ["manager", "담당자"],
  ["detail", "상세 내용"],
  ["address", "주소·지도"],
  ["exposure", "노출 상품"],
  ["actions", "액션"],
] as const;

const initialDraft: JobDraft = {
  title: "",
  category: "",
  headcount: "1명",
  career: "",
  age: "무관",
  gender: "무관",
  deadlineType: "마감일",
  deadline: "",
  shootType: "프로젝트",
  tasks: "",
  equipment: [],
  editingTools: [],
  shootingCategories: [],
  conditions: "",
  payType: "건당",
  payAmount: "",
  employmentType: "",
  managerName: "김담당",
  managerEmail: currentCompany.email,
  contactVisible: true,
  description: "",
  address: "서울 강남구",
  premium: false,
  autoJump: false,
};

const linkPrimaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark";
const linkSecondaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:bg-page";

function createJobsFallback(): MyJob[] {
  return jobs
    .filter((job) => job.companyName === currentCompany.companyName)
    .map((job, index) => ({
      id: job.id,
      jobType: "shooting" as const,
      title: job.title,
      status: index === 1 ? "심사중" : index === 2 ? "반려" : job.status === "마감" ? "마감" : "게시중",
      deadline: job.deadline ?? "상시채용",
      isPremium: job.isPremium,
      jumpOn: false,
      rejectedReason: index === 2 ? "증빙 자료가 부족합니다." : undefined,
      updatedAt: job.createdAt,
      jumpCount: 0,
    }));
}

function required(value: string) {
  return value.trim().length > 0;
}

export function JobNewForm({ kind = "shooting" }: { kind?: "shooting" | "editing" }) {
  const isEditing = kind === "editing";
  const routePath = isEditing ? "/editor-jobs/new" : "/jobs/new";
  const categoryOptions = isEditing ? EDITING_CATEGORIES : SHOOTING_CATEGORIES;
  const primaryConditionOptions = isEditing ? EDITING_TOOL_OPTIONS : EQUIPMENT_OPTIONS;
  const crossConditionOptions = isEditing ? SHOOTING_CATEGORIES : EDITING_TOOL_OPTIONS;
  const primaryConditionLabel = isEditing ? "편집 가능 툴" : "필요 장비/스킬";
  const crossConditionLabel = isEditing ? "촬영 분야" : "편집 가능 툴";
  const conditionTitle = isEditing ? "편집 조건" : "촬영 조건";
  const router = useRouter();
  const { role, isReady, mockState } = useAuth();
  const { showToast } = useToast();
  const [draft, setDraft] = useState<JobDraft>(initialDraft);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (isReady && role === "guest") {
      router.replace(`/login?redirect=${encodeURIComponent(routePath)}`);
    }
  }, [isReady, role, router, routePath]);

  const exposurePrice = useMemo(() => {
    const premium = draft.premium ? 69000 : 0;
    const jump = draft.autoJump ? 16500 : 0;
    return premium + jump;
  }, [draft.autoJump, draft.premium]);

  function update<K extends keyof JobDraft>(key: K, value: JobDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function toggleEquipment(item: string) {
    setDraft((current) => ({
      ...current,
      equipment: current.equipment.includes(item) ? current.equipment.filter((value) => value !== item) : [...current.equipment, item],
    }));
  }

  function toggleCondition(key: "editingTools" | "shootingCategories", item: string) {
    setDraft((current) => ({
      ...current,
      [key]: current[key].includes(item) ? current[key].filter((value) => value !== item) : [...current[key], item],
    }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!required(draft.title)) next.title = "공고 제목을 입력해 주세요.";
    if (!required(draft.category)) next.category = `${isEditing ? "편집" : "촬영"} 분야를 선택해 주세요.`;
    if (!required(draft.career)) next.career = "경력을 선택해 주세요.";
    if (draft.deadlineType === "마감일" && !required(draft.deadline)) next.deadline = "마감일을 입력해 주세요.";
    if (!required(draft.payType)) next.payType = "급여 유형을 선택해 주세요.";
    if (draft.payType !== "협의" && !required(draft.payAmount)) next.payAmount = "금액을 입력해 주세요.";
    if (!required(draft.employmentType)) next.employmentType = "고용형태를 선택해 주세요.";
    if (!required(draft.managerName)) next.managerName = "담당자명을 입력해 주세요.";
    if (!required(draft.managerEmail)) next.managerEmail = "이메일을 입력해 주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      showToast("필수 항목을 확인해 주세요.", "error");
      return;
    }

    const now = new Date().toISOString();
    const id = Date.now();
    const deadline = draft.deadlineType === "마감일" ? draft.deadline : draft.deadlineType;
    const myJob: MyJob = {
      id,
      jobType: kind,
      title: draft.title,
      status: "심사중",
      deadline,
      isPremium: draft.premium,
      jumpOn: draft.autoJump,
      updatedAt: now,
      jumpCount: 0,
    };
    const existing = readStorageJSON<MyJob[]>(storageKeys.mypageJobs, createJobsFallback());
    writeStorageJSON(storageKeys.mypageJobs, [myJob, ...existing.filter((item) => item.id !== id)]);
    appendStorageItem(storageKeys.submittedJobs, {
      id,
      jobType: kind,
      companyName: currentCompany.companyName,
      ...draft,
      editingTools: isEditing ? draft.equipment : draft.editingTools,
      shootingCategories: isEditing ? draft.shootingCategories : [],
      imageFileNames: imageFiles.map((file) => file.name),
      status: "심사중",
      createdAt: now,
    });
    setComplete(true);
    showToast("심사 요청이 접수되었습니다.");
  }

  if (!isReady || role === "guest") {
    return <div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">공고 등록 권한을 확인하는 중입니다.</div>;
  }

  if ((role === "company-unverified" || role === "company-verified") && mockState.verifyStatus !== "인증완료") {
    return <GuardCard title="기업 인증 후 등록할 수 있습니다" description="사업자 인증이 완료되면 공고 심사 요청을 보낼 수 있습니다." href="/mypage/verification" action="인증하러 가기" />;
  }

  if (complete) {
    return (
      <div className="mx-auto max-w-[640px] rounded-md border border-line bg-surface p-6 text-center shadow-card">
        <CheckCircle2 aria-hidden className="mx-auto h-12 w-12 text-success" />
        <h1 className="mt-4 text-2xl font-black text-ink">공고 심사 요청이 접수되었습니다</h1>
        <p className="mt-2 text-sm text-muted">마이페이지 공고 관리에서 심사중 상태로 확인할 수 있습니다.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/mypage/jobs" className={linkPrimaryClass}>
            공고 관리 보기
          </Link>
          <Link href={isEditing ? "/editor-jobs" : "/jobs"} className={linkSecondaryClass}>
            목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 rounded-md border border-line bg-surface p-3 shadow-card">
            {sectionNav.map(([id, label], index) => (
              <a key={id} href={`#${id}`} className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold text-muted hover:bg-page hover:text-primary">
                <span className="tabular-nums">{index + 1}</span>
                {id === "shooting" ? conditionTitle : label}
              </a>
            ))}
          </nav>
        </aside>

        <form onSubmit={submit} className="min-w-0 space-y-5">
          <div>
            <Badge label={role === "personal" ? "개인 데모 등록" : "기업 인증완료"} tone={role === "personal" ? undefined : "success"} />
            <h1 className="mt-3 text-3xl font-black text-ink max-md:text-2xl">공고 등록</h1>
            <p className="mt-2 text-sm text-muted">제출 후 관리자 검수 전까지 심사중으로 표시됩니다.</p>
          </div>

          <FormSection id="basic" title="기본 정보">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="공고 제목" requiredMark value={draft.title} onChange={(event) => update("title", event.target.value)} error={errors.title} className="md:col-span-2" />
              <Select
                label={isEditing ? "편집 분야" : "촬영 분야"}
                requiredMark
                value={draft.category}
                onChange={(event) => update("category", event.target.value)}
                error={errors.category}
                options={[{ label: "선택", value: "" }, ...categoryOptions.map((value) => ({ label: value, value }))]}
              />
              <div className="md:col-span-2">
                <FileUpload label="대표 이미지" multiple={false} onChange={setImageFiles} />
              </div>
            </div>
          </FormSection>

          <FormSection id="recruit" title="모집 조건">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="모집인원" value={draft.headcount} onChange={(event) => update("headcount", event.target.value)} />
              <Select
                label="경력"
                requiredMark
                value={draft.career}
                onChange={(event) => update("career", event.target.value)}
                error={errors.career}
                options={[{ label: "선택", value: "" }, ...CAREER_OPTIONS.map((value) => ({ label: value, value }))]}
              />
              <Input label="나이" value={draft.age} onChange={(event) => update("age", event.target.value)} />
              <Select label="성별" value={draft.gender} onChange={(event) => update("gender", event.target.value)} options={["무관", "남", "여"].map((value) => ({ label: value, value }))} />
              <div className="md:col-span-2">
                <p className="mb-2 text-sm font-medium text-ink">
                  접수기간<span className="ml-1 text-danger">*</span>
                </p>
                <div className="grid gap-2 md:grid-cols-3">
                  {(["마감일", "상시채용", "채용시까지"] as const).map((value) => (
                    <Radio key={value} card name="deadlineType" value={value} label={value} checked={draft.deadlineType === value} onChange={() => update("deadlineType", value)} />
                  ))}
                </div>
                {draft.deadlineType === "마감일" ? (
                  <Input type="date" label="마감일" requiredMark value={draft.deadline} onChange={(event) => update("deadline", event.target.value)} error={errors.deadline} className="mt-3 max-w-xs" />
                ) : null}
              </div>
            </div>
          </FormSection>

          <FormSection id="shooting" title={conditionTitle}>
            <div className="grid gap-4">
              <Select label={isEditing ? "작업 형태" : "촬영 형태"} value={draft.shootType} onChange={(event) => update("shootType", event.target.value)} options={["프로젝트", "정기 작업", "상주", "반일", "하루"].map((value) => ({ label: value, value }))} />
              <Textarea label="담당업무" rows={4} value={draft.tasks} onChange={(event) => update("tasks", event.target.value)} placeholder={`${isEditing ? "편집" : "촬영"} 범위와 산출물을 입력하세요.`} />
              <div>
                <p className="mb-2 text-sm font-medium text-ink">{primaryConditionLabel}</p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {primaryConditionOptions.map((item) => (
                    <Checkbox key={item} label={item} checked={draft.equipment.includes(item)} onChange={() => toggleEquipment(item)} />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-ink">{crossConditionLabel}</p>
                <p className="mb-2 text-xs text-muted">필요한 경우 부가 조건으로 선택하세요.</p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {crossConditionOptions.map((item) => {
                    const selected = isEditing ? draft.shootingCategories.includes(item) : draft.editingTools.includes(item);
                    return <Checkbox key={item} label={item} checked={selected} onChange={() => toggleCondition(isEditing ? "shootingCategories" : "editingTools", item)} />;
                  })}
                </div>
              </div>
              <Textarea label={`${isEditing ? "편집" : "촬영"} 조건/복리후생`} rows={4} value={draft.conditions} onChange={(event) => update("conditions", event.target.value)} />
            </div>
          </FormSection>

          <FormSection id="pay" title="급여·계약">
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="급여 유형"
                requiredMark
                value={draft.payType}
                onChange={(event) => update("payType", event.target.value as JobDraft["payType"])}
                error={errors.payType}
                options={["건당", "일당", "월급", "협의"].map((value) => ({ label: value, value }))}
              />
              <Input label="금액" requiredMark={draft.payType !== "협의"} value={draft.payAmount} onChange={(event) => update("payAmount", event.target.value)} error={errors.payAmount} placeholder="예: 800000" />
              <Select
                label="고용형태"
                requiredMark
                value={draft.employmentType}
                onChange={(event) => update("employmentType", event.target.value)}
                error={errors.employmentType}
                options={[{ label: "선택", value: "" }, ...["프리랜서", "정규직", "계약직", "파트타임", "프로젝트"].map((value) => ({ label: value, value }))]}
              />
            </div>
          </FormSection>

          <FormSection id="manager" title="담당자 정보">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="담당자명" requiredMark value={draft.managerName} onChange={(event) => update("managerName", event.target.value)} error={errors.managerName} />
              <Input label="이메일" requiredMark type="email" value={draft.managerEmail} onChange={(event) => update("managerEmail", event.target.value)} error={errors.managerEmail} />
              <Checkbox label="담당자 연락처를 공고에 노출합니다." checked={draft.contactVisible} onChange={(event) => update("contactVisible", event.target.checked)} />
            </div>
          </FormSection>

          <FormSection id="detail" title="상세 내용">
            <Textarea rows={8} value={draft.description} onChange={(event) => update("description", event.target.value)} placeholder={`${isEditing ? "편집" : "촬영"} 목적, 일정, 참고사항, 우대 조건을 입력하세요.`} />
          </FormSection>

          <FormSection id="address" title="지도/주소">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <Input label="주소" value={draft.address} onChange={(event) => update("address", event.target.value)} />
              <div className="flex min-h-[160px] items-center justify-center rounded-md border border-dashed border-line bg-page text-muted">
                <div className="text-center">
                  <MapPin aria-hidden className="mx-auto h-8 w-8" />
                  <p className="mt-2 text-sm font-semibold text-ink">지도 미리보기</p>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection id="exposure" title="노출 상품 선택">
            <div className="grid gap-3 md:grid-cols-2">
              <Checkbox label="프리미엄 노출" helperText="1개월 69,000원" checked={draft.premium} onChange={(event) => update("premium", event.target.checked)} />
              <Checkbox label="자동점프" helperText="10건 16,500원" checked={draft.autoJump} onChange={(event) => update("autoJump", event.target.checked)} />
            </div>
            <div className="mt-4 rounded-md bg-page p-3 text-sm font-bold text-ink">예상 상품 금액 {formatKrw(exposurePrice)}</div>
          </FormSection>

          <FormSection id="actions" title="제출">
            <div className="flex flex-wrap justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setPreviewOpen(true)}>
                미리보기
              </Button>
              <Button type="submit">심사 요청</Button>
            </div>
          </FormSection>
        </form>
      </div>

      <Modal open={previewOpen} title="공고 미리보기" onClose={() => setPreviewOpen(false)} size="form">
        <div className="space-y-4 text-sm">
          <div>
            <Badge label="심사중" />
            <h2 className="mt-2 text-xl font-black text-ink">{draft.title || "공고 제목"}</h2>
            <p className="mt-1 text-muted">
              {role === "personal" ? "개인 데모 회원" : currentCompany.companyName} · {draft.category || "분야 미선택"} · {draft.address}
            </p>
          </div>
          <dl className="grid gap-2 sm:grid-cols-2">
            <PreviewItem label="경력" value={draft.career || "-"} />
            <PreviewItem label="급여" value={draft.payType === "협의" ? "협의" : `${draft.payType} ${draft.payAmount || "-"}`} />
            <PreviewItem label="고용형태" value={draft.employmentType || "-"} />
            <PreviewItem label="마감" value={draft.deadlineType === "마감일" ? draft.deadline || "-" : draft.deadlineType} />
            <PreviewItem label={crossConditionLabel} value={(isEditing ? draft.shootingCategories : draft.editingTools).join(", ") || "선택 없음"} />
          </dl>
          <p className="whitespace-pre-line rounded-md bg-page p-3 text-ink">{draft.description || "상세 내용 미입력"}</p>
        </div>
      </Modal>
    </>
  );
}

function FormSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-md border border-line bg-surface p-5 shadow-card">
      <h2 className="text-lg font-black text-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm bg-page px-3 py-2">
      <dt className="text-xs font-semibold text-muted">{label}</dt>
      <dd className="mt-1 font-semibold text-ink">{value}</dd>
    </div>
  );
}

function GuardCard({ title, description, href, action }: { title: string; description: string; href: string; action: string }) {
  return (
    <div className="mx-auto max-w-[520px] rounded-md border border-line bg-surface p-6 text-center shadow-card">
      <AlertTriangle aria-hidden className="mx-auto h-10 w-10 text-warning" />
      <h1 className="mt-4 text-2xl font-black text-ink">{title}</h1>
      <p className="mt-2 text-sm text-muted">{description}</p>
      <Link href={href} className={cn(linkPrimaryClass, "mt-6")}>
        {action}
      </Link>
    </div>
  );
}
