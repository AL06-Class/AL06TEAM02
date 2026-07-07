"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, Flag, Printer } from "lucide-react";
import { Button, Modal, useToast } from "@/components/ui";
import { GateModal } from "@/components/shared/GateModal";
import { ReportModal } from "@/components/shared/ReportModal";
import { useAuth } from "@/lib/auth-context";
import { readStorageJSON, storageKeys, writeStorageJSON } from "@/lib/storage";
import { cn } from "@/components/ui/utils";

const linkButtonClass =
  "inline-flex h-10 w-full items-center justify-center rounded-md border border-primary bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

function readScraps() {
  return readStorageJSON<number[]>(storageKeys.jobScraps, []);
}

export function JobScrapButton({ jobId, iconOnly = false }: { jobId: number; iconOnly?: boolean }) {
  const { role } = useAuth();
  const { showToast } = useToast();
  const [scrapped, setScrapped] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);

  useEffect(() => {
    setScrapped(readScraps().includes(jobId));
  }, [jobId]);

  function toggle() {
    if (role === "guest") {
      setGateOpen(true);
      return;
    }
    const current = readScraps();
    const next = current.includes(jobId) ? current.filter((id) => id !== jobId) : [...current, jobId];
    writeStorageJSON(storageKeys.jobScraps, next);
    setScrapped(next.includes(jobId));
    showToast(next.includes(jobId) ? "공고를 스크랩했습니다." : "스크랩을 해제했습니다.");
  }

  return (
    <>
      <Button
        variant={scrapped ? "primary" : "secondary"}
        size={iconOnly ? "bar" : "md"}
        onClick={toggle}
        className={cn(iconOnly && "w-[56px] px-0")}
        leftIcon={<Bookmark aria-hidden className="h-4 w-4" />}
      >
        {iconOnly ? <span className="sr-only">스크랩</span> : scrapped ? "스크랩됨" : "스크랩"}
      </Button>
      <GateModal type="login" open={gateOpen} onClose={() => setGateOpen(false)} />
    </>
  );
}

export function JobReportButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)} leftIcon={<Flag aria-hidden className="h-4 w-4" />}>
        신고
      </Button>
      <ReportModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function JobPrintButton() {
  return (
    <Button variant="secondary" onClick={() => window.print()} leftIcon={<Printer aria-hidden className="h-4 w-4" />}>
      인쇄
    </Button>
  );
}

export function JobApplyButton({ jobId, className }: { jobId: number; className?: string }) {
  const { role } = useAuth();
  const [loginGateOpen, setLoginGateOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  if (role === "personal") {
    return (
      <Link href={`/jobs/${jobId}/apply`} className={cn(linkButtonClass, className)}>
        온라인 지원
      </Link>
    );
  }

  return (
    <>
      <Button className={cn("w-full", className)} onClick={() => (role === "guest" ? setLoginGateOpen(true) : setRoleModalOpen(true))}>
        온라인 지원
      </Button>
      <GateModal type="login" open={loginGateOpen} onClose={() => setLoginGateOpen(false)} />
      <Modal open={roleModalOpen} title="개인회원 전용 기능입니다" description="온라인 지원은 개인회원으로 로그인한 경우에만 이용할 수 있습니다." onClose={() => setRoleModalOpen(false)}>
        <Button variant="secondary" className="w-full" onClick={() => setRoleModalOpen(false)}>
          확인
        </Button>
      </Modal>
    </>
  );
}
