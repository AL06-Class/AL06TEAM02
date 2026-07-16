import type { Metadata } from "next";
import { DocumentPage, type DocumentSection } from "@/app/_components/DocumentPage";

export const metadata: Metadata = {
  title: "회원약관",
  description: "CLIPBee 데모 서비스 회원약관",
};

const sections: DocumentSection[] = [
  {
    id: "purpose",
    title: "목적",
    paragraphs: [
      "이 약관은 CLIPBee 주식회사(가칭)가 제공하는 CLIPBee 데모 서비스의 이용 조건과 회원의 기본 권리·의무를 설명합니다.",
      "본 약관 문구는 시연용 표준 템플릿이며 실제 서비스 운영을 위한 확정 약관이 아닙니다.",
    ],
  },
  {
    id: "account",
    title: "회원과 계정",
    paragraphs: [
      "회원은 개인회원 또는 기업회원으로 가입할 수 있으며, 기업회원은 인증 절차를 거쳐 공고 등록과 제안 기능을 이용합니다.",
      "회원은 계정 정보를 최신 상태로 유지해야 하며, 타인의 정보나 허위 정보를 사용해서는 안 됩니다.",
    ],
  },
  {
    id: "content",
    title: "게시물과 거래",
    paragraphs: [
      "회원이 등록한 공고, 프로필, 상품, 게시글은 운영 기준에 따라 검수되거나 숨김 처리될 수 있습니다.",
      "CLIPBee는 데모 범위에서 거래 당사자가 아니며, 계약 조건과 결과물 범위는 회원 간 직접 확인해야 합니다.",
    ],
  },
  {
    id: "paid",
    title: "유료상품",
    paragraphs: [
      "연락처 열람권, 자동점프, 추천 프로필, 프리미엄 배너는 데모 결제 흐름으로 제공됩니다.",
      "실제 서비스에서는 결제수단, 청약철회, 환불 기준, 세금계산서 발행 기준을 별도 정책으로 고지합니다.",
    ],
  },
  {
    id: "restriction",
    title: "이용 제한",
    paragraphs: [
      "허위 정보 등록, 개인정보 무단 수집, 권리 침해, 스팸, 부당한 저가 조건 유도, 반복 허위 신고는 이용 제한 대상입니다.",
      "운영팀은 서비스 안전을 위해 필요한 범위에서 게시물 비공개, 계정 제한, 신고 처리 결과 안내를 진행할 수 있습니다.",
    ],
  },
];

export default function TermsPage() {
  return <DocumentPage title="회원약관" description="CLIPBee 데모 서비스 이용 조건과 회원 책임을 안내합니다." sections={sections} />;
}
