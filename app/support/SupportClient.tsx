"use client";

import { FormEvent, useState } from "react";
import type { ReactNode } from "react";
import { Clock3, MessageCircle } from "lucide-react";
import { Accordion, Button, Input, Select, Tabs, Textarea, useToast } from "@/components/ui";

const faqGroups = {
  member: {
    label: "회원",
    items: [
      ["개인회원과 기업회원은 무엇이 다른가요?", "개인회원은 촬영자 프로필 등록과 공고 지원을 이용하고, 기업회원은 기업 인증 후 공고 등록과 촬영자 제안을 이용합니다."],
      ["기업 인증은 얼마나 걸리나요?", "영업일 기준 1~2일 내 검수하며, 서류가 흐리거나 정보가 맞지 않으면 보완 요청이 표시됩니다."],
      ["역할을 잘못 선택했을 때 바꿀 수 있나요?", "데모에서는 역할 스위처로 전환할 수 있고, 실제 서비스에서는 고객센터 확인 후 계정 유형 변경을 지원합니다."],
      ["회원 탈퇴 후 데이터는 어떻게 처리되나요?", "법정 보관 대상 결제·계약 기록을 제외한 공개 프로필과 지원 정보는 비공개 처리됩니다."],
    ],
  },
  jobs: {
    label: "공고",
    items: [
      ["공고는 바로 공개되나요?", "기업 인증 완료 회원이 등록한 공고도 운영 검수 후 게시중 상태가 됩니다."],
      ["지원자는 어디에서 확인하나요?", "기업회원 마이페이지의 지원자 관리에서 공고별 지원 내역과 메시지를 확인합니다."],
      ["마감된 공고를 다시 열 수 있나요?", "마이페이지 공고 관리에서 수정 후 재검수 요청하는 방식으로 재게시할 수 있습니다."],
      ["부당한 공고는 어떻게 신고하나요?", "공고 상세의 신고 버튼으로 접수하면 운영팀이 조건과 내용 위반 여부를 확인합니다."],
    ],
  },
  payment: {
    label: "결제",
    items: [
      ["연락처 열람권은 언제부터 적용되나요?", "테스트 결제 완료 즉시 권한이 적용되며, 상품별 이용 기간 동안 프로필 연락처를 확인할 수 있습니다."],
      ["자동점프는 결제하면 바로 켜지나요?", "아닙니다. 결제 후 크레딧이 충전되고 마이페이지에서 대상 공고를 선택해 ON 해야 합니다."],
      ["추천 프로필은 어디에 노출되나요?", "메인 추천 영역과 프로필 목록 상단에 노출되며, 검수 상태와 기간은 마이페이지에서 확인합니다."],
      ["환불은 어떻게 진행되나요?", "데모 단계에서는 실제 결제가 없고, 실제 서비스에서는 미사용 기간과 상품 정책에 따라 검토합니다."],
    ],
  },
  store: {
    label: "스토어",
    items: [
      ["스토어 상품 등록은 누가 할 수 있나요?", "개인회원과 기업회원 모두 등록할 수 있으며, 운영 검수 후 공개됩니다."],
      ["디지털 상품도 판매할 수 있나요?", "프리셋, 계약서 템플릿, 가이드 문서처럼 촬영 업무와 직접 관련된 상품만 허용합니다."],
      ["상품 신고는 어떻게 처리되나요?", "상품 상세 신고가 접수되면 허위 설명, 권리 침해, 거래 위험 여부를 운영팀이 확인합니다."],
      ["거래는 CLIPBee가 직접 중개하나요?", "1차 데모 범위에서는 상품 정보 게시와 문의 흐름 중심이며 실제 정산 기능은 포함하지 않습니다."],
    ],
  },
  report: {
    label: "신고",
    items: [
      ["어떤 내용을 신고할 수 있나요?", "허위 공고, 부당 페이, 권리 침해, 스팸, 개인정보 노출, 부적절한 게시글을 신고할 수 있습니다."],
      ["신고하면 바로 숨김 처리되나요?", "명백한 위험 정보는 우선 숨김 처리하고, 일반 신고는 운영 검토 후 조치합니다."],
      ["신고 결과를 받을 수 있나요?", "로그인 회원은 알림함 또는 고객센터 답변으로 처리 결과를 확인할 수 있습니다."],
      ["허위 신고는 제재되나요?", "반복적인 허위 신고나 경쟁자 방해 목적의 신고는 서비스 이용 제한 대상입니다."],
    ],
  },
};

type FaqKey = keyof typeof faqGroups;

export function SupportClient() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<FaqKey>("member");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    showToast("문의가 접수되었습니다.");
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-ink max-md:text-2xl">고객센터</h1>
        <p className="mt-2 text-sm text-muted">자주 묻는 질문을 확인하고 필요한 문의를 접수합니다.</p>
      </div>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 rounded-md border border-line bg-surface p-5 shadow-card">
          <Tabs
            value={tab}
            onChange={(value) => setTab(value as FaqKey)}
            items={Object.entries(faqGroups).map(([value, group]) => ({ value, label: group.label }))}
            ariaLabel="FAQ 카테고리"
          />
          <Accordion
            className="mt-5"
            items={faqGroups[tab].items.map(([title, content], index) => ({
              title,
              content: <p className="leading-6">{content}</p>,
              defaultOpen: index === 0,
            }))}
          />
        </div>

        <aside className="space-y-3">
          <InfoPanel icon={<Clock3 aria-hidden className="h-5 w-5" />} title="운영시간" lines={["평일 10:00~18:00", "점심 12:30~13:30", "주말·공휴일 휴무"]} />
          <InfoPanel icon={<MessageCircle aria-hidden className="h-5 w-5" />} title="카카오 채널" lines={["카카오톡에서 CLIPBee 검색", "긴급 신고는 1:1 문의와 함께 접수"]} />
        </aside>
      </section>

      <section className="rounded-md border border-line bg-surface p-5 shadow-card">
        <h2 className="text-xl font-black text-ink">1:1 문의</h2>
        <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
          <Select name="type" label="문의유형" required options={["회원", "공고", "결제", "스토어", "신고", "기타"].map((item) => ({ label: item, value: item }))} />
          <Input name="email" label="이메일" type="email" required placeholder="reply@example.kr" />
          <Input name="title" label="제목" required className="md:col-span-2" placeholder="문의 제목을 입력하세요" />
          <Textarea name="content" label="내용" required rows={6} className="md:col-span-2" placeholder="상황과 확인이 필요한 내용을 입력하세요" />
          <div className="md:col-span-2 md:text-right">
            <Button type="submit" size="lg">
              접수
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

function InfoPanel({ icon, title, lines }: { icon: ReactNode; title: string; lines: string[] }) {
  return (
    <section className="rounded-md border border-line bg-surface p-4 shadow-card">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <h2 className="text-base font-black text-ink">{title}</h2>
      </div>
      <div className="mt-3 space-y-1 text-sm text-muted">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </section>
  );
}
