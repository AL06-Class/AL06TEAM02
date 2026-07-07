"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Button, FileUpload, Input, Modal, Select, Textarea, Toggle, useToast } from "@/components/ui";
import { cn } from "@/components/ui/utils";
import { EQUIPMENT_OPTIONS, SHOOTING_CATEGORIES } from "@/lib/filters";
import { useAuth } from "@/lib/auth-context";
import { appendStorageItem, storageKeys, writeStorageJSON } from "@/lib/storage";

interface CareerRow {
  id: string;
  period: string;
  title: string;
}

interface LinkRow {
  id: string;
  type: string;
  url: string;
}

interface ProfileDraft {
  title: string;
  visibility: string;
  categories: string[];
  equipment: string[];
  desiredPay: string;
  region: string;
  travelAvailable: boolean;
  hasStudio: boolean;
  careers: CareerRow[];
  portfolioLinks: LinkRow[];
  showPhone: boolean;
  showEmail: boolean;
  showAddress: boolean;
}

const profilePlaceholder = "/images/presets/placeholders/shootmon-placeholder-profile-01.svg";
const linkPrimaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark";
const linkSecondaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:bg-page";

const initialDraft: ProfileDraft = {
  title: "",
  visibility: "전체 공개",
  categories: [],
  equipment: [],
  desiredPay: "",
  region: "",
  travelAvailable: true,
  hasStudio: false,
  careers: [{ id: "career-1", period: "", title: "" }],
  portfolioLinks: [{ id: "link-1", type: "YouTube", url: "" }],
  showPhone: false,
  showEmail: true,
  showAddress: false,
};

function required(value: string) {
  return value.trim().length > 0;
}

export function ProfileNewForm() {
  const router = useRouter();
  const { role, isReady } = useAuth();
  const { showToast } = useToast();
  const [draft, setDraft] = useState<ProfileDraft>(initialDraft);
  const [profileImages, setProfileImages] = useState<File[]>([]);
  const [coverImages, setCoverImages] = useState<File[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (isReady && role === "guest") {
      router.replace(`/login?redirect=${encodeURIComponent("/profiles/new")}`);
    }
  }, [isReady, role, router]);

  function update<K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function toggleList(key: "categories" | "equipment", value: string) {
    setDraft((current) => {
      const values = current[key];
      return { ...current, [key]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value] };
    });
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function updateCareer(id: string, key: "period" | "title", value: string) {
    setDraft((current) => ({ ...current, careers: current.careers.map((item) => (item.id === id ? { ...item, [key]: value } : item)) }));
  }

  function updateLink(id: string, key: "type" | "url", value: string) {
    setDraft((current) => ({ ...current, portfolioLinks: current.portfolioLinks.map((item) => (item.id === id ? { ...item, [key]: value } : item)) }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!required(draft.title)) next.title = "프로필 제목을 입력해 주세요.";
    if (draft.categories.length === 0) next.categories = "촬영 가능 분야를 하나 이상 선택해 주세요.";
    if (!required(draft.desiredPay)) next.desiredPay = "희망 단가를 입력해 주세요.";
    if (!required(draft.region)) next.region = "활동 지역을 입력해 주세요.";
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
    const links = draft.portfolioLinks.filter((item) => item.url.trim());
    writeStorageJSON(storageKeys.mypageProfile, {
      hasProfile: true,
      isPublic: draft.visibility !== "비공개",
      workStatus: "활동가능",
      reviewStatus: "검수중",
      rejectedReason: "",
    });
    writeStorageJSON(storageKeys.mypagePortfolio, {
      images: (portfolioImages.length > 0 ? portfolioImages : profileImages).map((file, index) => ({
        id: `image-${now}-${index}`,
        src: profilePlaceholder,
        featured: index === 0,
        fileName: file.name,
      })),
      links: links.map((item, index) => ({
        id: item.id,
        type: item.type,
        url: item.url.trim(),
        featured: index === 0,
      })),
    });
    appendStorageItem(storageKeys.submittedProfiles, {
      id: Date.now(),
      ...draft,
      profileImageFileNames: profileImages.map((file) => file.name),
      coverImageFileNames: coverImages.map((file) => file.name),
      portfolioImageFileNames: portfolioImages.map((file) => file.name),
      status: "검수중",
      submittedAt: now,
    });
    setComplete(true);
    showToast("프로필 검수 요청이 접수되었습니다.");
  }

  if (!isReady || role === "guest") {
    return <div className="rounded-md border border-line bg-surface p-6 text-sm text-muted shadow-card">프로필 등록 권한을 확인하는 중입니다.</div>;
  }

  if (role !== "personal") {
    return <GuardCard title="개인회원 전용 화면입니다" description="촬영자 프로필 등록은 개인회원만 이용할 수 있습니다." href="/profiles" action="프로필 목록으로" />;
  }

  if (complete) {
    return (
      <div className="mx-auto max-w-[640px] rounded-md border border-line bg-surface p-6 text-center shadow-card">
        <CheckCircle2 aria-hidden className="mx-auto h-12 w-12 text-success" />
        <h1 className="mt-4 text-2xl font-black text-ink">프로필 검수 요청이 접수되었습니다</h1>
        <p className="mt-2 text-sm text-muted">마이페이지에서 검수중 상태로 확인할 수 있습니다.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/mypage/profile" className={linkPrimaryClass}>
            내 프로필 보기
          </Link>
          <Link href="/profiles" className={linkSecondaryClass}>
            목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={submit} className="mx-auto max-w-[920px] space-y-5">
        <div>
          <h1 className="text-3xl font-black text-ink max-md:text-2xl">프로필 등록</h1>
          <p className="mt-2 text-sm text-muted">등록 후 검수중 상태로 저장됩니다.</p>
        </div>

        <FormSection title="기본 정보">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="프로필 제목" requiredMark value={draft.title} onChange={(event) => update("title", event.target.value)} error={errors.title} className="md:col-span-2" />
            <Select label="공개 범위" value={draft.visibility} onChange={(event) => update("visibility", event.target.value)} options={["전체 공개", "로그인 회원", "비공개"].map((value) => ({ label: value, value }))} />
          </div>
        </FormSection>

        <FormSection title="프로필/커버 이미지">
          <div className="grid gap-4 md:grid-cols-2">
            <FileUpload label="프로필 이미지" multiple={false} onChange={setProfileImages} />
            <FileUpload label="커버 이미지" multiple={false} onChange={setCoverImages} />
          </div>
        </FormSection>

        <FormSection title="분야·장비">
          <ChipPicker title="촬영 가능 분야" required error={errors.categories} values={SHOOTING_CATEGORIES} selected={draft.categories} onToggle={(value) => toggleList("categories", value)} />
          <div className="mt-5">
            <ChipPicker title="보유 장비" values={EQUIPMENT_OPTIONS} selected={draft.equipment} onToggle={(value) => toggleList("equipment", value)} />
          </div>
        </FormSection>

        <FormSection title="단가·지역">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="희망 단가" requiredMark value={draft.desiredPay} onChange={(event) => update("desiredPay", event.target.value)} error={errors.desiredPay} placeholder="예: 건당 50만원부터" />
            <Input label="활동 지역" requiredMark value={draft.region} onChange={(event) => update("region", event.target.value)} error={errors.region} placeholder="예: 서울 마포구" />
            <Toggle checked={draft.travelAvailable} label="출장 가능" onChange={(checked) => update("travelAvailable", checked)} />
            <Toggle checked={draft.hasStudio} label="스튜디오 보유" onChange={(checked) => update("hasStudio", checked)} />
          </div>
        </FormSection>

        <FormSection title="경력">
          <div className="space-y-3">
            {draft.careers.map((row) => (
              <div key={row.id} className="grid gap-2 md:grid-cols-[180px_minmax(0,1fr)_auto]">
                <Input aria-label="기간" value={row.period} onChange={(event) => updateCareer(row.id, "period", event.target.value)} placeholder="2024.01~2026.06" />
                <Input aria-label="경력 내용" value={row.title} onChange={(event) => updateCareer(row.id, "title", event.target.value)} placeholder="브랜드 캠페인 촬영" />
                <Button
                  variant="ghost"
                  leftIcon={<Trash2 aria-hidden className="h-4 w-4" />}
                  onClick={() => setDraft((current) => ({ ...current, careers: current.careers.filter((item) => item.id !== row.id) }))}
                  disabled={draft.careers.length === 1}
                >
                  삭제
                </Button>
              </div>
            ))}
          </div>
          <Button className="mt-3" variant="outline" leftIcon={<Plus aria-hidden className="h-4 w-4" />} onClick={() => setDraft((current) => ({ ...current, careers: [...current.careers, { id: `career-${Date.now()}`, period: "", title: "" }] }))}>
            경력 행 추가
          </Button>
        </FormSection>

        <FormSection title="포트폴리오">
          <FileUpload label="포트폴리오 이미지" multiple onChange={setPortfolioImages} />
          <div className="mt-5 space-y-3">
            {draft.portfolioLinks.map((row) => (
              <div key={row.id} className="grid gap-2 md:grid-cols-[160px_minmax(0,1fr)_auto]">
                <Select aria-label="링크 유형" value={row.type} onChange={(event) => updateLink(row.id, "type", event.target.value)} options={["YouTube", "Shorts", "외부 링크"].map((value) => ({ label: value, value }))} />
                <Input aria-label="포트폴리오 링크" value={row.url} onChange={(event) => updateLink(row.id, "url", event.target.value)} placeholder="https://" />
                <Button
                  variant="ghost"
                  leftIcon={<Trash2 aria-hidden className="h-4 w-4" />}
                  onClick={() => setDraft((current) => ({ ...current, portfolioLinks: current.portfolioLinks.filter((item) => item.id !== row.id) }))}
                  disabled={draft.portfolioLinks.length === 1}
                >
                  삭제
                </Button>
              </div>
            ))}
          </div>
          <Button className="mt-3" variant="outline" leftIcon={<Plus aria-hidden className="h-4 w-4" />} onClick={() => setDraft((current) => ({ ...current, portfolioLinks: [...current.portfolioLinks, { id: `link-${Date.now()}`, type: "외부 링크", url: "" }] }))}>
            링크 행 추가
          </Button>
        </FormSection>

        <FormSection title="연락처 공개 설정">
          <div className="grid gap-3 sm:grid-cols-3">
            <Toggle checked={draft.showPhone} label="전화 공개" onChange={(checked) => update("showPhone", checked)} />
            <Toggle checked={draft.showEmail} label="이메일 공개" onChange={(checked) => update("showEmail", checked)} />
            <Toggle checked={draft.showAddress} label="주소 공개" onChange={(checked) => update("showAddress", checked)} />
          </div>
        </FormSection>

        <div className="flex flex-wrap justify-end gap-2 rounded-md border border-line bg-surface p-5 shadow-card">
          <Button type="button" variant="secondary" onClick={() => setPreviewOpen(true)}>
            미리보기
          </Button>
          <Button type="submit">등록(검수 요청)</Button>
        </div>
      </form>

      <Modal open={previewOpen} title="프로필 미리보기" onClose={() => setPreviewOpen(false)} size="form">
        <div className="space-y-4 text-sm">
          <div>
            <h2 className="text-xl font-black text-ink">{draft.title || "프로필 제목"}</h2>
            <p className="mt-1 text-muted">
              {draft.region || "지역 미입력"} · {draft.desiredPay || "단가 미입력"}
            </p>
          </div>
          <PreviewBlock label="분야" value={draft.categories.join(", ") || "-"} />
          <PreviewBlock label="장비" value={draft.equipment.join(", ") || "-"} />
          <PreviewBlock label="경력" value={draft.careers.map((item) => [item.period, item.title].filter(Boolean).join(" ")).filter(Boolean).join("\n") || "-"} />
        </div>
      </Modal>
    </>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-md border border-line bg-surface p-5 shadow-card">
      <h2 className="text-lg font-black text-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ChipPicker({
  title,
  required,
  error,
  values,
  selected,
  onToggle,
}: {
  title: string;
  required?: boolean;
  error?: string;
  values: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink">
        {title}
        {required ? <span className="ml-1 text-danger">*</span> : null}
      </p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => {
          const active = selected.includes(value);
          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(value)}
              className={cn(
                "rounded-sm border px-3 py-1.5 text-sm font-semibold transition",
                active ? "border-primary bg-primary-soft text-primary" : "border-line bg-page text-muted hover:border-primary hover:text-ink",
              )}
            >
              {value}
            </button>
          );
        })}
      </div>
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : null}
    </div>
  );
}

function PreviewBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-page p-3">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-1 whitespace-pre-line font-semibold text-ink">{value}</p>
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
