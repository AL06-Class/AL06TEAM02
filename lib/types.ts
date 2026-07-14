// 촬영자 모집 공고
interface JobPosting {
  id: number;
  companyName: string;        // 가상 회사/의뢰자명
  title: string;              // 모집 제목 (모바일 2~3줄 이내 길이)
  category: string;           // 촬영 분야 14종 중 1개 (PRD 9.3)
  region: string;             // 예: "서울 마포구"
  subwayArea?: string;        // 예: "홍대입구역" (일부만)
  careerLevel: '신입' | '1년 이상' | '3년 이상' | '5년 이상' | '10년 이상' | '경력무관';
  equipment: string[];        // PRD 9.4 장비 13종에서 1~4개
  employmentType: '프리랜서' | '정규직' | '계약직' | '파트타임' | '프로젝트';
  payType: '건당' | '일당' | '월급' | '협의';
  payAmount: string;          // 예: "건당 80만원", "월 300만원", "협의"
  deadlineType: '마감일' | '상시채용' | '채용시까지';
  deadline?: string;          // deadlineType이 마감일일 때, 2026-07-10 ~ 2026-09-30 분포
  isPremium: boolean;
  status: '게시중' | '마감';
  applyMethods: ('온라인' | '이메일')[];
  managerName: string;        // 예: "김담당"
  managerEmail: string;       // 가상 도메인 예: contact@example-studio.kr
  address: string;
  description: string;        // 상세 설명 2~4문장
  image: string;              // AGENTS.md 파일명 규칙 예: /images/presets/jobs/shootmon-job-brand-01.webp
  createdAt: string;          // 2026-05 ~ 2026-07 분포
  views: number;
  scrapCount: number;
}

// 촬영자 프로필
interface ShooterProfile {
  id: number;
  maskedName: string;         // 예: "김O민", 팀이면 "팀 루멘"
  gender?: '남' | '여';       // 팀/기업형은 생략
  birthYear?: number;
  title: string;              // 프로필 제목
  region: string;
  categories: string[];       // 촬영 분야 1~3개
  equipment: string[];        // 1~5개
  desiredPay: string;         // 예: "건당 50만원부터"
  careerYears: number;
  careerHistory: string[];    // 경력 2~4줄
  education?: string;
  status: '활동가능' | '일정협의' | '프로젝트중';
  travelAvailable: boolean;   // 출장 가능
  hasStudio: boolean;         // 스튜디오 보유
  portfolioImages: string[];  // 프리셋 경로 2~4개
  portfolioLinks: string[];   // 가상 YouTube/Vimeo URL 형식 1~3개
  isRecommended: boolean;     // 추천(유료) 프로필 여부
  avatar: string;             // 프리셋 경로
  cover: string;              // 프리셋 경로
  intro: string;              // 소개글 2~3문장
  updatedAt: string;
}

// 편집자 프로필 — 목록 구조는 ShooterProfile과 동일하고 categories/equipment의 의미만 편집 분야/사용 툴로 구분
interface EditorProfile extends Omit<ShooterProfile, 'travelAvailable' | 'hasStudio'> {
  travelAvailable: boolean;   // 원격 작업 가능
  hasStudio: false;           // 공통 프로필 카드 호환용 고정값
}

// 스토어 상품
interface StoreProduct {
  id: number;
  name: string;
  category: string;           // PRD 11.2 카테고리 9종 중 1개
  sellerName: string;         // 프로필 샘플과 일부 연결 (같은 maskedName 재사용)
  price: number;              // 원 단위
  rating: number;             // 0.0~5.0
  likes: number;
  serviceScope: string;       // 서비스 범위 1~2문장
  process: string;            // 작업 과정 1~2문장
  delivery: string;           // 납기 예: "촬영 후 7일"
  revisions: string;          // 수정 횟수 예: "2회 무료"
  commercialUse: boolean;
  refundPolicy: string;       // 1~2문장
  image: string;              // 프리셋 경로
  createdAt: string;
}

// 커뮤니티 게시글
interface CommunityPost {
  id: number;
  board: 'free' | 'feedback' | 'lab' | 'contest' | 'event' | 'suggest' | 'guide'; // 자유/촬영피드백/촬영랩/공모전/이벤트/운영자에게바란다/이용안내
  title: string;
  author: string;             // 닉네임
  createdAt: string;
  views: number;
  commentsCount: number;
  isNotice: boolean;          // 게시판 내 공지 고정
  excerpt: string;            // 본문 요약 1~2문장
}

// 공지사항
interface Notice {
  id: number;
  title: string;
  createdAt: string;
  views: number;
  isPinned: boolean;
}

// 기업회원
interface CompanyMember {
  id: number;
  companyName: string;        // JobPosting의 companyName과 연결
  ceoName: string;            // 가상 이름
  bizNumber: string;          // 000-00-000XX 가짜 형식
  verifyStatus: '미인증' | '검수중' | '인증완료' | '반려';
  email: string;
  joinedAt: string;
}

// 개인회원
interface PersonalMember {
  id: number;
  maskedName: string;
  nickname: string;           // 커뮤니티 author와 일부 연결
  email: string;
  joinedAt: string;
  hasProfile: boolean;        // ShooterProfile 보유 여부
}
