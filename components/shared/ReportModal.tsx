"use client";

import { FormEvent, useState } from "react";
import { Button, Modal, Radio, Textarea, useToast } from "@/components/ui";

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
  const [reason, setReason] = useState(reasons[0]);
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (reason === "기타" && !detail.trim()) {
      setError("기타 사유를 입력해 주세요.");
      return;
    }
    setError("");
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
              onChange={() => setReason(item)}
            />
          ))}
        </div>
        <div className="mt-4">
          <Textarea
            label="상세 내용"
            requiredMark={reason === "기타"}
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            error={error}
            placeholder="신고 내용을 입력해 주세요."
          />
        </div>
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

