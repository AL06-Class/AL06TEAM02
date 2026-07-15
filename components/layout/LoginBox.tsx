"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Button, Input, Radio, useToast } from "@/components/ui";
import { type UserRole, useAuth } from "@/lib/auth-context";

interface LoginBoxProps {
  companyRole?: Extract<UserRole, "company-unverified" | "company-verified">;
  redirectTo?: string;
  defaultMemberType?: "personal" | "company";
}

function safeRedirect(value?: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export function LoginBox({ companyRole = "company-unverified", redirectTo, defaultMemberType = "personal" }: LoginBoxProps = {}) {
  const router = useRouter();
  const { setRole } = useAuth();
  const { showToast } = useToast();
  const [memberType, setMemberType] = useState<"personal" | "company">(defaultMemberType);

  function completeLogin(message: string) {
    setRole(memberType === "personal" ? "personal" : companyRole);
    showToast(message);
    const nextPath = safeRedirect(redirectTo);
    if (nextPath) router.push(nextPath);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    completeLogin("데모 로그인 상태로 전환되었습니다.");
  }

  function kakaoLogin() {
    completeLogin("카카오 데모 로그인 상태로 전환되었습니다.");
  }

  return (
    <form onSubmit={submit} className="rounded-md border border-line bg-surface p-4 shadow-card">
      <div className="grid grid-cols-2 gap-2">
        <Radio
          card
          name="memberType"
          value="personal"
          label="개인"
          checked={memberType === "personal"}
          onChange={() => setMemberType("personal")}
        />
        <Radio
          card
          name="memberType"
          value="company"
          label="기업"
          checked={memberType === "company"}
          onChange={() => setMemberType("company")}
        />
      </div>
      <div className="mt-4 space-y-3">
        <Input name="login-id" label="아이디" placeholder="아이디" />
        <Input name="login-password" label="비밀번호" type="password" placeholder="비밀번호" />
        <Button type="submit" className="w-full">
          로그인
        </Button>
        <Button type="button" variant="kakao" className="w-full" leftIcon={<MessageCircle aria-hidden className="h-4 w-4" />} onClick={kakaoLogin}>
          카카오로 시작하기
        </Button>
      </div>
      <div className="mt-3 flex justify-center gap-2 text-xs text-muted">
        <Link href="/account/find" className="hover:text-primary">
          아이디/비번찾기
        </Link>
        <span>·</span>
        <Link href="/signup" className="hover:text-primary">
          회원가입
        </Link>
      </div>
    </form>
  );
}
