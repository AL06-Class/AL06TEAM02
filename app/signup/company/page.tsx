"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge, Button, Checkbox, Input, useToast } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";

const linkPrimaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark";
const linkSecondaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:bg-page";

export default function CompanySignupPage() {
  const { setRole, setMockState } = useAuth();
  const { showToast } = useToast();
  const [terms, setTerms] = useState({ service: false, privacy: false, marketing: false });
  const [complete, setComplete] = useState(false);
  const requiredChecked = terms.service && terms.privacy;
  const allChecked = useMemo(() => terms.service && terms.privacy && terms.marketing, [terms]);

  function setAll(checked: boolean) {
    setTerms({ service: checked, privacy: checked, marketing: checked });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!requiredChecked) {
      showToast("필수 약관에 동의해 주세요.", "error");
      return;
    }
    setRole("company-unverified");
    setMockState({ verifyStatus: "미인증" });
    setComplete(true);
  }

  if (complete) {
    return (
      <div className="mx-auto max-w-[620px] rounded-md border border-line bg-surface p-6 text-center shadow-card">
        <CheckCircle2 aria-hidden className="mx-auto h-12 w-12 text-success" />
        <div className="mt-4 flex justify-center">
          <Badge label="미인증" tone="warning" />
        </div>
        <h1 className="mt-3 text-2xl font-black text-ink">기업회원 가입이 완료되었습니다</h1>
        <p className="mt-2 text-sm text-muted">공고 등록과 유료 상품 이용에는 기업 인증이 필요합니다.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/mypage/verification" className={linkPrimaryClass}>
            지금 인증하기
          </Link>
          <Link href="/" className={linkSecondaryClass}>
            나중에
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-[760px] space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ink max-md:text-2xl">기업회원 가입</h1>
        <p className="mt-2 text-sm text-muted">공고 등록과 지원자 관리를 위한 정보를 입력합니다.</p>
      </div>

      <section className="rounded-md border border-line bg-surface p-5 shadow-card">
        <h2 className="text-lg font-bold text-ink">약관 동의</h2>
        <div className="mt-4 space-y-3">
          <Checkbox label="전체 동의" checked={allChecked} onChange={(event) => setAll(event.target.checked)} />
          <div className="grid gap-3 rounded-md bg-page p-4">
            <Checkbox label="서비스 이용약관 동의 (필수)" checked={terms.service} onChange={(event) => setTerms((current) => ({ ...current, service: event.target.checked }))} />
            <Checkbox label="개인정보 처리방침 동의 (필수)" checked={terms.privacy} onChange={(event) => setTerms((current) => ({ ...current, privacy: event.target.checked }))} />
            <Checkbox label="광고/운영 안내 수신 동의 (선택)" checked={terms.marketing} onChange={(event) => setTerms((current) => ({ ...current, marketing: event.target.checked }))} />
          </div>
        </div>
      </section>

      <section className="rounded-md border border-line bg-surface p-5 shadow-card">
        <h2 className="text-lg font-bold text-ink">계정 정보</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input name="companyUserId" label="아이디" requiredMark required />
          <Input name="companyEmail" label="이메일" type="email" requiredMark required />
          <Input name="companyPassword" label="비밀번호" type="password" requiredMark required />
          <Input name="companyPasswordConfirm" label="비밀번호 확인" type="password" requiredMark required />
        </div>
      </section>

      <section className="rounded-md border border-line bg-surface p-5 shadow-card">
        <h2 className="text-lg font-bold text-ink">기업 정보</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input name="companyName" label="회사명" requiredMark required />
          <Input name="ceoName" label="대표자명" requiredMark required />
          <Input name="bizNumber" label="사업자등록번호" requiredMark required />
          <Input name="industry" label="업종" />
          <Input name="managerName" label="담당자명" requiredMark required />
          <Input name="managerPhone" label="담당자 연락처" requiredMark required />
        </div>
        <div className="mt-4 flex gap-2 rounded-md border border-warning bg-warning-soft p-3 text-sm text-warning">
          <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          <p>공고 등록에는 기업 인증이 필요합니다. 사업자등록증명은 3개월 이내 서류를 기준으로 하며, 사업자가 없는 개인 의뢰자는 본인 명의 통장 사본으로 대체할 수 있습니다.</p>
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <Link href="/signup" className={linkSecondaryClass}>
          이전
        </Link>
        <Button type="submit">가입하기</Button>
      </div>
    </form>
  );
}
