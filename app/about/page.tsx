import type { Metadata } from "next";
import { DocumentPage, type DocumentSection } from "@/app/_components/DocumentPage";

export const metadata: Metadata = {
  title: "회사소개",
  description: "촬영몬 서비스와 운영 원칙 소개",
};

const sections: DocumentSection[] = [
  {
    id: "mission",
    title: "서비스 소개",
    paragraphs: [
      "촬영몬은 촬영 의뢰자와 촬영자를 연결하는 데모 플랫폼입니다. 공고, 프로필, 스토어, 커뮤니티를 한곳에서 탐색할 수 있도록 설계했습니다.",
      "운영 주체 표기는 촬영몬랩 주식회사(가칭)이며, 본 페이지의 회사 정보는 프로젝트 시연을 위한 가상 정보입니다.",
    ],
  },
  {
    id: "principle",
    title: "운영 원칙",
    paragraphs: [
      "기업 인증, 공고 검수, 프로필 검수, 신고 처리를 통해 최소한의 거래 안전 장치를 제공합니다.",
      "사업자번호, 상세 서류, 개인 연락처 같은 민감 정보는 공개 화면에 노출하지 않는 것을 기본 원칙으로 합니다.",
    ],
  },
  {
    id: "scope",
    title: "데모 범위",
    paragraphs: [
      "현재 구현은 백엔드 없이 샘플 데이터와 localStorage 기반으로 동작합니다. 실제 결제, 정산, 본인확인, 외부 알림 발송은 포함하지 않습니다.",
      "정식 서비스 전환 시 실제 약관, 개인정보 처리방침, 결제 정책은 별도 법무 검토 후 확정해야 합니다.",
    ],
  },
  {
    id: "contact",
    title: "문의",
    paragraphs: [
      "고객 문의는 고객센터의 1:1 문의 폼 또는 카카오 채널 안내를 통해 접수하는 흐름으로 구성되어 있습니다.",
      "가상 운영 정보: 촬영몬랩 주식회사(가칭), 서울시 내 가상 업무공간, support@shootmon.example.kr",
    ],
  },
];

export default function AboutPage() {
  return <DocumentPage title="회사소개" description="촬영몬의 목적, 운영 원칙, 데모 범위를 안내합니다." sections={sections} />;
}
