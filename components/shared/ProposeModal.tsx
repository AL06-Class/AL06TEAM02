"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button, Modal, Select, Textarea, useToast } from "@/components/ui";
import { jobs } from "@/data/jobs";
import { appendStorageItem, storageKeys } from "@/lib/storage";

interface ProposeModalProps {
  open: boolean;
  onClose: () => void;
  receiverName: string;
  profileId: number;
}

interface ProposalRecord {
  id: string;
  profileId: number;
  receiverName: string;
  jobId: number;
  message: string;
  sentAt: string;
}

export function ProposeModal({ open, onClose, receiverName, profileId }: ProposeModalProps) {
  const { showToast } = useToast();
  const publishedJobs = useMemo(() => jobs.filter((job) => job.status === "게시중"), []);
  const [jobId, setJobId] = useState(String(publishedJobs[0]?.id ?? ""));
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericJobId = Number(jobId);
    appendStorageItem<ProposalRecord>(storageKeys.proposals, {
      id: `proposal-${Date.now()}`,
      profileId,
      receiverName,
      jobId: numericJobId,
      message,
      sentAt: new Date().toISOString(),
    });
    setMessage("");
    showToast("제안이 전송되었습니다.");
    onClose();
  }

  return (
    <Modal open={open} title="제안 보내기" description="내 게시중 공고를 선택해 촬영자에게 제안을 보냅니다." onClose={onClose} size="form">
      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-md bg-page p-3 text-sm">
          <span className="text-muted">받는 사람</span>
          <strong className="ml-2 text-ink">{receiverName}</strong>
        </div>
        <Select
          name="proposalJob"
          label="관련 공고"
          value={jobId}
          onChange={(event) => setJobId(event.target.value)}
          options={publishedJobs.map((job) => ({ label: `${job.companyName} · ${job.title}`, value: String(job.id) }))}
          required
        />
        <Textarea name="proposalMessage" label="메시지" requiredMark required rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="일정, 촬영 조건, 제안 내용을 입력하세요." />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" disabled={!jobId || !message.trim()}>
            제안 보내기
          </Button>
        </div>
      </form>
    </Modal>
  );
}
