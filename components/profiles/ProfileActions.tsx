"use client";

import { useEffect, useState } from "react";
import { Bookmark, Flag } from "lucide-react";
import { Button, useToast } from "@/components/ui";
import { GateModal } from "@/components/shared/GateModal";
import { ReportModal } from "@/components/shared/ReportModal";
import { useAuth } from "@/lib/auth-context";

const SCRAP_KEY = "shootmon.scrap.profiles";

function readScraps() {
  try {
    return JSON.parse(window.localStorage.getItem(SCRAP_KEY) ?? "[]") as number[];
  } catch {
    return [];
  }
}

export function ProfileScrapButton({ profileId }: { profileId: number }) {
  const { role } = useAuth();
  const { showToast } = useToast();
  const [scrapped, setScrapped] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);

  useEffect(() => {
    setScrapped(readScraps().includes(profileId));
  }, [profileId]);

  function toggle() {
    if (role === "guest") {
      setGateOpen(true);
      return;
    }
    const current = readScraps();
    const next = current.includes(profileId) ? current.filter((id) => id !== profileId) : [...current, profileId];
    window.localStorage.setItem(SCRAP_KEY, JSON.stringify(next));
    setScrapped(next.includes(profileId));
    showToast(next.includes(profileId) ? "프로필을 스크랩했습니다." : "스크랩을 해제했습니다.");
  }

  return (
    <>
      <Button variant={scrapped ? "primary" : "secondary"} onClick={toggle} leftIcon={<Bookmark aria-hidden className="h-4 w-4" />}>
        {scrapped ? "스크랩됨" : "스크랩"}
      </Button>
      <GateModal type="login" open={gateOpen} onClose={() => setGateOpen(false)} />
    </>
  );
}

export function ProfileReportButton() {
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
