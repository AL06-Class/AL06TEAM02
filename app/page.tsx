import { Badge, BadgeList, Button, Chip, EmptyState, Input, Skeleton, Stepper, Table, Tabs } from "@/components/ui";
import { SectionHeader } from "@/components/layout";

const rows = [
  { id: "1", company: "촬영몬스튜디오", title: "브랜드 광고 촬영 보조 모집", status: "프리미엄" },
  { id: "2", company: "라이트필름", title: "유튜브 채널 촬영자 모집", status: "상시채용" },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-md border border-line bg-surface p-4 shadow-card md:p-6">
        <SectionHeader title="촬영몬 Phase 1 UI 킷 확인" />
        <p className="text-sm text-muted">Phase 2에서 메인 화면으로 교체될 임시 확인 영역입니다.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="kakao">카카오</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge label="프리미엄" />
          <Badge label="추천" />
          <Badge label="상시채용" />
          <Badge label="심사중" />
          <Badge label="마감" />
          <Badge label="신규" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-md border border-line bg-surface p-4 shadow-card md:p-6">
          <SectionHeader title="테이블 / 탭 / 페이지 요소" />
          <Tabs
            value="/jobs"
            items={[
              { label: "촬영자 모집", value: "/jobs", href: "/jobs" },
              { label: "촬영자 프로필", value: "/profiles", href: "/profiles" },
              { label: "커뮤니티", value: "/community", href: "/community" },
            ]}
          />
          <div className="mt-4">
            <Table
              rows={rows}
              getRowKey={(row) => row.id}
              columns={[
                { key: "company", header: "회사명", render: (row) => row.company },
                { key: "title", header: "제목", render: (row) => row.title },
                { key: "status", header: "상태", render: (row) => <Badge label={row.status} /> },
              ]}
            />
          </div>
        </div>
        <div className="rounded-md border border-line bg-surface p-4 shadow-card md:p-6">
          <SectionHeader title="폼 / 상태" />
          <div className="space-y-4">
            <Input label="검색" search placeholder="드론 촬영" />
            <BadgeList labels={["프리미엄", "신규", "경력무관", "상시채용", "서울"]} />
            <div className="flex gap-2 overflow-x-auto">
              <Chip label="분야: 웨딩" />
              <Chip label="장비: 드론" />
            </div>
            <Stepper steps={["옵션 선택", "주문 확인", "완료"]} currentStep={1} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <EmptyState title="등록된 촬영자 모집이 없습니다." action={<Button variant="outline">공고 등록하기</Button>} />
        <Skeleton variant="card" count={2} />
      </section>
    </div>
  );
}
