"use client";

import { useEffect, useState } from "react";
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

const ROLE_SWITCHER_COLLAPSED_KEY = "shootmon:role-switcher:collapsed";

export function RoleSwitcher() {
  const { role, mockState, setRole, setMockState } = useAuth();
  const [collapsed, setCollapsed] = useState(true);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(ROLE_SWITCHER_COLLAPSED_KEY);
    if (saved) setCollapsed(saved === "true");
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (storageReady) {
      window.localStorage.setItem(ROLE_SWITCHER_COLLAPSED_KEY, String(collapsed));
    }
  }, [collapsed, storageReady]);

  // 데모 전용 위젯: 실서비스 전 제거 대상.
  return (
    <section
      className={cn(
        "fixed bottom-5 left-5 z-dropdown",
        collapsed ? "h-10 w-10" : "max-w-[300px] rounded-md border border-line bg-white/95 p-3 shadow-modal backdrop-blur",
      )}
    >
      <button
        type="button"
        aria-expanded={!collapsed}
        title="데모 역할 스위처"
        className={cn(
          "flex items-center text-xs font-bold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          collapsed ? "h-10 w-10 justify-center rounded-full border border-line bg-white/95 shadow-modal backdrop-blur" : "w-full justify-between gap-3 text-left",
        )}
        onClick={() => setCollapsed((value) => !value)}
      >
        <span className={cn("inline-flex items-center gap-2", collapsed && "sr-only")}>
          <SlidersHorizontal aria-hidden className="h-4 w-4 text-primary" />
          데모 역할 스위처
        </span>
        {collapsed ? <SlidersHorizontal aria-hidden className="h-4 w-4 text-primary" /> : <ChevronDown aria-hidden className="h-4 w-4 transition" />}
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
