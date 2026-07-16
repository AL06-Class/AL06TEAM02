import type { Metadata } from "next";
import { DocumentPage, type DocumentSection } from "@/app/_components/DocumentPage";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "CLIPBee 데모 서비스 개인정보 처리 기준",
};

const sections: DocumentSection[] = [
  {
    id: "intro",
    title: "기본 원칙",
    paragraphs: [
      "촬영몬랩 주식회사(가칭)는 서비스 제공에 필요한 최소한의 개인정보만 처리하는 것을 원칙으로 합니다.",
      "본 개인정보처리방침은 데모용 표준 템플릿이며, 실제 서비스 출시 전 처리 항목과 보관 기간은 다시 확정해야 합니다.",
    ],
  },
  {
    id: "items",
    title: "처리 항목",
    paragraphs: [
      "회원가입과 문의 처리를 위해 이메일, 이름 또는 닉네임, 회원 유형, 문의 내용 같은 기본 정보를 처리할 수 있습니다.",
      "기업 인증 과정의 사업자 서류와 개인 연락처는 공개 페이지에 노출하지 않으며, 검수 목적 범위에서만 사용합니다.",
    ],
  },
  {
    id: "purpose",
    title: "이용 목적",
    paragraphs: [
      "개인정보는 회원 식별, 공고·프로필·스토어 운영, 신고 처리, 고객 문의 답변, 유료상품 이용 내역 확인에 사용됩니다.",
      "마케팅 알림이나 외부 제공이 필요한 경우 별도 동의를 받는 흐름이 필요합니다.",
    ],
  },
  {
    id: "period",
    title: "보관 기간",
    paragraphs: [
      "회원 탈퇴 시 공개 프로필과 게시 정보는 비공개 또는 삭제 처리하고, 법령상 보관이 필요한 결제·분쟁 기록은 정해진 기간 동안 분리 보관합니다.",
      "데모 환경에서는 브라우저 localStorage에 저장된 활동 데이터가 사용자의 브라우저에 남을 수 있습니다.",
    ],
  },
  {
    id: "rights",
    title: "정보주체 권리",
    paragraphs: [
      "회원은 본인 정보 조회, 수정, 삭제, 처리 정지를 요청할 수 있습니다.",
      "문의는 고객센터 또는 support@shootmon.example.kr로 접수하는 시연 흐름을 기준으로 합니다.",
    ],
  },
];

export default function PrivacyPage() {
  return <DocumentPage title="개인정보처리방침" description="촬영몬 데모 서비스의 개인정보 처리 기준을 안내합니다." sections={sections} />;
}
