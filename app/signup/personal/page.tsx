"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Send } from "lucide-react";
import { Button, Checkbox, Input, useToast } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";

const linkPrimaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark";
const linkSecondaryClass =
  "inline-flex h-10 items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:bg-page";

export default function PersonalSignupPage() {
  const { setRole } = useAuth();
  const { showToast } = useToast();
  const [terms, setTerms] = useState({ service: false, privacy: false, marketing: false });
  const [phoneVerified, setPhoneVerified] = useState(false);
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
    if (!phoneVerified) {
      showToast("휴대폰 인증을 완료해 주세요.", "error");
      return;
    }
    setRole("personal");
    setComplete(true);
  }

  if (complete) {
    return (
      <div className="mx-auto max-w-[560px] rounded-md border border-line bg-surface p-6 text-center shadow-card">
        <CheckCircle2 aria-hidden className="mx-auto h-12 w-12 text-success" />
        <h1 className="mt-4 text-2xl font-black text-ink">개인회원 가입이 완료되었습니다</h1>
        <p className="mt-2 text-sm text-muted">프로필을 등록하면 제안을 받을 수 있습니다.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/profiles/new" className={linkPrimaryClass}>
            프로필 등록
          </Link>
          <Link href="/" className={linkSecondaryClass}>
            나중에
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-[720px] space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ink max-md:text-2xl">개인회원 가입</h1>
        <p className="mt-2 text-sm text-muted">촬영자 활동에 필요한 기본 정보를 입력합니다.</p>
      </div>

      <section className="rounded-md border border-line bg-surface p-5 shadow-card">
        <h2 className="text-lg font-bold text-ink">약관 동의</h2>
        <div className="mt-4 space-y-3">
          <Checkbox label="전체 동의" checked={allChecked} onChange={(event) => setAll(event.target.checked)} />
          <div className="grid gap-3 rounded-md bg-page p-4">
            <Checkbox label="서비스 이용약관 동의 (필수)" checked={terms.service} onChange={(event) => setTerms((current) => ({ ...current, service: event.target.checked }))} />
            <Checkbox label="개인정보 처리방침 동의 (필수)" checked={terms.privacy} onChange={(event) => setTerms((current) => ({ ...current, privacy: event.target.checked }))} />
            <Checkbox label="마케팅 정보 수신 동의 (선택)" checked={terms.marketing} onChange={(event) => setTerms((current) => ({ ...current, marketing: event.target.checked }))} />
          </div>
        </div>
      </section>

      <section className="rounded-md border border-line bg-surface p-5 shadow-card">
        <h2 className="text-lg font-bold text-ink">계정 정보</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input name="userId" label="아이디" requiredMark required />
          <Input name="name" label="이름" requiredMark required />
          <Input name="password" label="비밀번호" type="password" requiredMark required />
          <Input name="passwordConfirm" label="비밀번호 확인" type="password" requiredMark required />
          <Input name="nickname" label="닉네임" requiredMark required />
          <Input name="email" label="이메일" type="email" requiredMark required />
          <div className="md:col-span-2">
            <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_120px]">
              <Input name="phone" label="휴대폰" requiredMark required helperText={phoneVerified ? "인증 완료" : undefined} />
              <Button type="button" className="self-end" variant={phoneVerified ? "secondary" : "primary"} onClick={() => setPhoneVerified(true)} leftIcon={<Send aria-hidden className="h-4 w-4" />}>
                인증요청
              </Button>
            </div>
          </div>
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
