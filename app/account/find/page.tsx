"use client";

import { FormEvent, useState } from "react";
import { Button, Input, Tabs, useToast } from "@/components/ui";

type FindMode = "id" | "password";

export default function AccountFindPage() {
  const { showToast } = useToast();
  const [mode, setMode] = useState<FindMode>("id");
  const [result, setResult] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "id") {
      setResult("가입된 아이디: sh****23");
      showToast("마스킹된 아이디를 확인했습니다.");
      return;
    }
    setResult("비밀번호 재설정 링크가 de**@sample-mail.example.kr 로 발송되었습니다.");
    showToast("재설정 안내가 발송되었습니다.");
  }

  return (
    <div className="mx-auto max-w-[520px] space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ink max-md:text-2xl">계정 찾기</h1>
        <p className="mt-2 text-sm text-muted">데모에서는 마스킹 결과만 표시합니다.</p>
      </div>

      <div className="rounded-md border border-line bg-surface p-5 shadow-card">
        <Tabs
          value={mode}
          onChange={(value) => {
            setMode(value as FindMode);
            setResult("");
          }}
          items={[
            { label: "아이디 찾기", value: "id" },
            { label: "비밀번호 재설정", value: "password" },
          ]}
        />
        <form onSubmit={submit} className="mt-5 space-y-4">
          {mode === "id" ? (
            <>
              <Input name="name" label="이름" requiredMark required />
              <Input name="email" label="이메일" type="email" requiredMark required />
            </>
          ) : (
            <>
              <Input name="accountId" label="아이디" requiredMark required />
              <Input name="resetEmail" label="이메일" type="email" requiredMark required />
            </>
          )}
          <Button type="submit" className="w-full">
            확인
          </Button>
        </form>
        {result ? <div className="mt-5 rounded-md border border-success-soft bg-success-soft px-4 py-3 text-sm font-semibold text-ink">{result}</div> : null}
      </div>
    </div>
  );
}
