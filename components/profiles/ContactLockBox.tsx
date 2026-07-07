"use client";

import { useMemo, useState } from "react";
import { Copy, Send } from "lucide-react";
import { Badge, Button, Modal, useToast } from "@/components/ui";
import { GateModal } from "@/components/shared/GateModal";
import { ProposeModal } from "@/components/shared/ProposeModal";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/components/ui/utils";

export interface ContactItem {
  label: string;
  masked: string;
  value: string;
}

interface ContactLockBoxProps {
  contacts: ContactItem[];
  profileId: number;
  receiverName: string;
}

function formatExpiry(value: string | null) {
  if (!value) return "제한 없음";
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(new Date(value));
}

function isExpiringSoon(value: string | null) {
  if (!value) return false;
  const diff = new Date(value).getTime() - Date.now();
  return diff <= 1000 * 60 * 60 * 24 * 3;
}

export function ContactLockBox({ contacts, profileId, receiverName }: ContactLockBoxProps) {
  const { role, mockState } = useAuth();
  const { showToast } = useToast();
  const [loginGateOpen, setLoginGateOpen] = useState(false);
  const [passGateOpen, setPassGateOpen] = useState(false);
  const [verificationGateOpen, setVerificationGateOpen] = useState(false);
  const [personalModalOpen, setPersonalModalOpen] = useState(false);
  const [proposeOpen, setProposeOpen] = useState(false);
  const canView = role === "admin" || (role === "company-verified" && mockState.hasContactPass);
  const canPropose = role === "company-verified" && mockState.hasContactPass;
  const expiringSoon = canView && isExpiringSoon(mockState.contactPassExpiry);
  const expiryText = useMemo(() => formatExpiry(mockState.contactPassExpiry), [mockState.contactPassExpiry]);

  function requestOpen() {
    if (role === "guest") {
      setLoginGateOpen(true);
    } else if (role === "personal") {
      setPersonalModalOpen(true);
    } else if (role === "company-unverified") {
      setVerificationGateOpen(true);
    } else {
      setPassGateOpen(true);
    }
  }

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    showToast("연락처를 복사했습니다.");
  }

  return (
    <div className={cn("rounded-md border border-line bg-surface p-4 shadow-card", expiringSoon && "border-warning bg-warning-soft/40")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-base font-bold text-ink">연락처</p>
          <p className="mt-1 text-sm text-muted">
            {canView ? `열람권 만료: ${expiryText}` : "기업회원 열람권으로 확인할 수 있습니다."}
          </p>
        </div>
        {expiringSoon ? <Badge label="만료예정" /> : canView ? <Badge label="열림" tone="success" /> : <Badge label="잠김" tone="muted" />}
      </div>

      {expiringSoon ? <div className="mt-3 rounded-sm bg-warning-soft px-3 py-2 text-sm font-semibold text-warning">열람권 만료가 임박했습니다.</div> : null}

      <div className="mt-4 divide-y divide-line">
        {contacts.map((item) => (
          <div key={item.label} className="grid grid-cols-[86px_minmax(0,1fr)_auto] items-center gap-3 py-3 text-sm">
            <span className="font-semibold text-ink">{item.label}</span>
            <span className="truncate text-muted">{canView ? item.value : item.masked}</span>
            {canView ? (
              <Button size="sm" variant="outline" onClick={() => copy(item.value)} leftIcon={<Copy aria-hidden className="h-3.5 w-3.5" />}>
                복사
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={requestOpen}>
                확인하기
              </Button>
            )}
          </div>
        ))}
      </div>

      {canPropose ? (
        <Button
          className="mt-4 w-full"
          leftIcon={<Send aria-hidden className="h-4 w-4" />}
          onClick={() => setProposeOpen(true)}
        >
          제안 보내기
        </Button>
      ) : null}

      <ProposeModal open={proposeOpen} onClose={() => setProposeOpen(false)} profileId={profileId} receiverName={receiverName} />
      <GateModal type="login" open={loginGateOpen} onClose={() => setLoginGateOpen(false)} />
      <GateModal type="contact-pass" open={passGateOpen} onClose={() => setPassGateOpen(false)} />
      <GateModal type="verification" open={verificationGateOpen} onClose={() => setVerificationGateOpen(false)} />
      <Modal open={personalModalOpen} title="기업회원 전용 기능입니다" description="촬영자 연락처 열람과 제안은 기업회원 기능입니다." onClose={() => setPersonalModalOpen(false)}>
        <Button variant="secondary" className="w-full" onClick={() => setPersonalModalOpen(false)}>
          확인
        </Button>
      </Modal>
    </div>
  );
}
