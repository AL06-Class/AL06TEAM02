"use client";

import { FormEvent, useState } from "react";
import { Megaphone, MonitorSmartphone } from "lucide-react";
import { Button, FileUpload, Input, Stepper, Table, type TableColumn, useToast } from "@/components/ui";

type SpecRow = {
  placement: string;
  size: string;
  price: string;
  note: string;
};

const specs: SpecRow[] = [
  { placement: "PC 메인 상단", size: "940 x 230", price: "1개월 69,000원", note: "메인 첫 화면 배너 슬롯" },
  { placement: "모바일 메인 상단", size: "720 x 180", price: "1개월 69,000원", note: "PC/모바일 세트 집행" },
];

const columns: Array<TableColumn<SpecRow>> = [
  { key: "placement", header: "노출 위치", render: (row) => row.placement },
  { key: "size", header: "규격", render: (row) => row.size },
  { key: "price", header: "가격", render: (row) => <strong className="text-ink">{row.price}</strong> },
  { key: "note", header: "비고", render: (row) => <span className="text-muted">{row.note}</span> },
];

export function AdsClient() {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    showToast("검수 후 연락드립니다.");
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-ink max-md:text-2xl">광고배너 안내</h1>
          <p className="mt-2 text-sm text-muted">촬영 의뢰자와 촬영자가 가장 먼저 보는 메인 상단 영역에 노출합니다.</p>
        </div>
        <Megaphone aria-hidden className="h-9 w-9 text-primary" />
      </div>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-md border border-line bg-surface p-5 shadow-card">
          <h2 className="text-xl font-black text-ink">노출 위치</h2>
          <div className="mt-5 rounded-md border border-line bg-page p-4">
            <div className="rounded-sm bg-ink px-4 py-3 text-sm font-black text-white">촬영몬 메인</div>
            <div className="mt-3 rounded-sm border-2 border-primary bg-primary-soft px-4 py-8 text-center">
              <MonitorSmartphone aria-hidden className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-2 text-sm font-black text-primary">프리미엄 배너 영역</p>
              <p className="mt-1 text-xs text-muted">PC 940 x 230 · 모바일 720 x 180</p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {["공고", "프로필", "스토어"].map((item) => (
                <div key={item} className="rounded-sm border border-line bg-surface py-5 text-center text-xs font-bold text-muted">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-md border border-line bg-surface p-5 shadow-card">
          <h2 className="text-xl font-black text-ink">집행 프로세스</h2>
          <Stepper className="mt-5" steps={["신청", "소재 제출", "검수", "집행"]} currentStep={0} />
          <p className="mt-5 rounded-md bg-warning-soft p-3 text-sm font-semibold text-warning">소재 내 텍스트, 로고, 권리 침해 여부를 검수한 뒤 집행합니다.</p>
        </aside>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-ink">규격과 가격</h2>
        <Table rows={specs} columns={columns} getRowKey={(row) => row.placement} />
      </section>

      <section className="rounded-md border border-line bg-surface p-5 shadow-card">
        <h2 className="text-xl font-black text-ink">광고 신청</h2>
        <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
          <Input name="company" label="회사명" required placeholder="회사명을 입력하세요" />
          <Input name="manager" label="담당자" required placeholder="담당자명" />
          <Input name="contact" label="연락처" required placeholder="010-0000-0000" />
          <Input name="period" label="희망 기간" required placeholder="예: 2026-08-01 ~ 2026-08-31" />
          <div className="md:col-span-2">
            <FileUpload label="소재 파일 업로드" multiple={false} helperText="PC 940x230, 모바일 720x180 권장 · jpg/png/webp" />
          </div>
          {submitted ? <p className="rounded-md bg-success-soft p-3 text-sm font-semibold text-success md:col-span-2">신청이 접수되었습니다. 검수 후 연락드립니다.</p> : null}
          <div className="md:col-span-2 md:text-right">
            <Button type="submit" size="lg">
              신청
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
