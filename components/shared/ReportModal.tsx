"use client";

import { FormEvent, useState } from "react";
import { Button, Modal, Radio, Textarea, useToast } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { appendStorageItem, storageKeys } from "@/lib/storage";
import type { AdminReportRecord, ReportTargetType } from "@/lib/admin-storage";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
}

const reasons = [
  "불건전 업소/위험 촬영",
  "다단계/피라미드성 영업",
  "낮은 임금/부당 페이",
  "광고 글",
  "잘못 기재된 연락처",
  "저작권/초상권 침해 우려",
  "기타",
];

export function ReportModal({ open, onClose }: ReportModalProps) {
  const { showToast } = useToast();
  const { role } = useAuth();
  const [reason, setReason] = useState(reasons[0]);
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");

  function selectReason(nextReason: string) {
    setReason(nextReason);
    setError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (reason === "기타" && !detail.trim()) {
      setError("기타 사유를 입력해 주세요.");
      return;
    }
    setError("");
    appendStorageItem<AdminReportRecord>(storageKeys.reports, {
      id: `report-${Date.now()}`,
      status: "접수",
      targetType: inferTargetType(),
      targetUrl: typeof window === "undefined" ? "/" : window.location.pathname,
      targetTitle: typeof document === "undefined" ? "신고 대상" : document.title.replace(" | CLIPBee", "") || "신고 대상",
      reason,
      detail: detail.trim(),
      reporter: reporterName(role),
      receivedAt: new Date().toISOString(),
    });
    showToast("신고가 접수되었습니다. 처리 결과는 알림으로 안내됩니다.");
    onClose();
  }

  return (
    <Modal open={open} title="신고하기" onClose={onClose} size="form" closeOnOverlay={false}>
      <form onSubmit={submit}>
        <div className="grid gap-3 md:grid-cols-2">
          {reasons.map((item) => (
            <Radio
              key={item}
              name="reportReason"
              value={item}
              label={item}
              checked={reason === item}
              onChange={() => selectReason(item)}
            />
          ))}
        </div>
        {reason === "기타" ? (
          <div className="mt-4">
            <Textarea
              label="상세 내용"
              requiredMark
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
              error={error}
              placeholder="신고 내용을 입력해 주세요."
            />
          </div>
        ) : null}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" variant="danger">
            신고 접수
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function inferTargetType(): ReportTargetType {
  if (typeof window === "undefined") return "게시글";
  const pathname = window.location.pathname;
  if (pathname.startsWith("/jobs") || pathname.startsWith("/editor-jobs")) return "공고";
  if (pathname.startsWith("/profiles")) return "프로필";
  if (pathname.startsWith("/store")) return "상품";
  if (pathname.startsWith("/community")) return "게시글";
  return "게시글";
}

function reporterName(role: string) {
  if (role === "personal") return "홍O민";
  if (role.startsWith("company")) return "CLIPBee 스튜디오";
  if (role === "admin") return "관리자";
  return "비회원";
}
