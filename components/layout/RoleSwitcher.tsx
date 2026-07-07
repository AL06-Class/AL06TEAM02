"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button, Input, Select, Toggle } from "@/components/ui";
import { ROLES, type UserRole, useAuth } from "@/lib/auth-context";
import { cn } from "@/components/ui/utils";

const roleOptions = [
  { label: "guest", value: "guest" },
  { label: "personal", value: "personal" },
  { label: "company-unverified", value: "company-unverified" },
  { label: "company-verified", value: "company-verified" },
  { label: "admin", value: "admin" },
];

export function RoleSwitcher() {
  const { role, mockState, setRole, setMockState } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // 데모 전용 위젯: 실서비스 전 제거 대상.
  return (
    <section className="fixed bottom-5 left-5 z-toast max-w-[300px] rounded-md border border-line bg-white/95 p-3 shadow-modal backdrop-blur">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left text-xs font-bold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        onClick={() => setCollapsed((value) => !value)}
      >
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal aria-hidden className="h-4 w-4 text-primary" />
          데모 역할 스위처
        </span>
        <ChevronDown aria-hidden className={cn("h-4 w-4 transition", collapsed && "rotate-180")} />
      </button>
      {collapsed ? null : (
        <div className="mt-3 space-y-3">
          <Select
            label="역할"
            value={role}
            options={roleOptions}
            onChange={(event) => {
              const nextRole = event.target.value as UserRole;
              if (ROLES.includes(nextRole)) setRole(nextRole);
            }}
          />
          <Toggle
            checked={mockState.hasContactPass}
            label="열람권"
            onChange={(checked) => setMockState({ hasContactPass: checked })}
          />
          <Toggle
            checked={mockState.hasPromotion}
            label="추천 노출"
            onChange={(checked) => setMockState({ hasPromotion: checked })}
          />
          <Input
            label="점프 크레딧"
            type="number"
            min={0}
            value={mockState.jumpCredits}
            onChange={(event) => setMockState({ jumpCredits: Number(event.target.value) })}
          />
          <Button variant="ghost" size="sm" className="w-full" onClick={() => setRole("guest")}>
            초기화
          </Button>
        </div>
      )}
    </section>
  );
}
