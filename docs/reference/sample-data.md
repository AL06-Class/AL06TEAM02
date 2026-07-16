# CLIPBee 샘플 데이터 설계

문서 작성일: 2026-07-06
기준 문서: `PRD.MD`(9.3 촬영 분야 14종, 9.4 장비 13종, 10.1 게시판, 11.2 스토어 카테고리, 12장 유료상품), `AGENTS.md`(9장 이미지 프리셋, 10장 샘플 데이터 이미지 매핑)

## 1. 개요

### 1.1 데이터 원칙

- 모든 데이터는 가상 창작이다. 편집몬(editmon.com)의 회사명, 게시글 원문, 문구를 복사하지 않는다.
- 실존 기업명/실존 인물명을 사용하지 않는다. 인물명은 흔한 성+가상 이름 조합이며, 개인 촬영자는 `김O현` 형태로 마스킹한다.
- 사업자등록번호는 명백히 가짜인 순번 형식(`000-00-00001` ~ `000-00-00010`)만 사용한다.
- 이메일 도메인은 `*.example.kr` 등 가상 도메인만 사용한다.
- 날짜 기준일은 2026-07-06이다. 등록일은 2026-05 ~ 2026-07, 마감일은 2026-07-10 ~ 2026-09-30 범위에 분포한다.
- 단가는 촬영 업계 현실 수준을 따른다. 예: 유튜브 촬영 건당 30~60만, 웨딩 본식 80~150만, 드론 추가 20~40만, 기업 홍보영상 100~300만.

### 1.2 구현 시 변환 안내

- 이 문서는 설계 원본이며, 구현 단계에서 `data/jobPostings.ts`, `data/shooterProfiles.ts`, `data/storeProducts.ts`, `data/communityPosts.ts`, `data/notices.ts`, `data/members.ts` 형태의 TypeScript 모듈로 변환한다.
- 필드명과 타입은 2장의 인터페이스를 그대로 따른다.

### 1.3 이미지 경로 표기 규칙

- 표 안의 이미지 값은 `jobs/shootmon-job-brand-01`처럼 축약 표기한다.
- 실제 경로는 `/images/presets/{폴더}/{파일명}.webp`로 해석한다. 예: `jobs/shootmon-job-brand-01` → `/images/presets/jobs/shootmon-job-brand-01.webp`
- 파일명 규칙과 프리셋 사양은 `AGENTS.md` 8~9장을 따른다.

## 2. 엔티티 스키마 정의

```typescript
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
```

### 2.1 카테고리/장비 기준값

촬영 분야 14종(PRD 9.3): 브랜드/광고 촬영, 유튜브/채널 촬영, 숏폼/Reels/TikTok, 웨딩, 행사/컨퍼런스, 제품/커머스, 인터뷰/다큐, 라이브/스트리밍, 드론, 스튜디오, 부동산/공간, 뷰티/패션, 교육/강의, 스포츠/공연

장비/스킬 13종(PRD 9.4): DSLR/미러리스, 시네마 카메라, 렌즈 세트, 조명, 무선마이크/붐마이크, 짐벌, 드론, 라이브 송출 장비, 스튜디오 보유, 프롬프터, 색보정 가능, 편집 가능, 사진 촬영 가능

스토어 카테고리 9종(PRD 11.2): 촬영 서비스, 드론 촬영, 스튜디오/공간, 장비 대여, 조명/오디오, 촬영 패키지, 프리셋/LUT, 계약서/가이드 템플릿, 썸네일/홍보 이미지

커뮤니티 게시판 매핑(PRD 10.1): free=자유게시판, feedback=촬영 피드백게시판, lab=촬영랩/AI촬영랩, contest=공모전, event=이벤트, suggest=운영자에게 바란다, guide=이용안내 (공지사항은 Notice 엔티티로 분리)

## 3. 샘플 데이터

### 3.1 촬영자 모집 공고 (JobPosting) — 30건

#### 3.1.1 핵심 필드

| id | companyName | title | category | region (subwayArea) | careerLevel | employmentType | payType | payAmount | deadlineType / deadline | isPremium | status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 스튜디오 온빛 | 브랜드 필름 촬영감독(DP) 모집 | 브랜드/광고 촬영 | 서울 강남구 | 5년 이상 | 프로젝트 | 건당 | 건당 150만원 | 마감일 / 2026-07-25 | O | 게시중 |
| 2 | 크리에이티브랩 무브 | 유튜브 채널 전속 촬영 PD 모집 | 유튜브/채널 촬영 | 서울 마포구 (홍대입구역) | 3년 이상 | 정규직 | 월급 | 월 280만원 | 채용시까지 | O | 게시중 |
| 3 | 픽셀리버 미디어 | 브랜드 숏폼 릴스 촬영자 모집 | 숏폼/Reels/TikTok | 서울 성동구 (성수역) | 1년 이상 | 프리랜서 | 건당 | 건당 30만원 | 마감일 / 2026-07-18 | X | 게시중 |
| 4 | 웨딩홀 라비엔느 | 주말 웨딩 본식 촬영팀 상시 모집 | 웨딩 | 서울 서초구 | 3년 이상 | 프리랜서 | 건당 | 건당 120만원 | 상시채용 | O | 게시중 |
| 5 | 이벤트플랜 다올 | 기업 컨퍼런스 스케치 촬영자(2일) | 행사/컨퍼런스 | 서울 영등포구 (여의도역) | 경력무관 | 프로젝트 | 일당 | 일당 45만원 | 마감일 / 2026-07-15 | X | 게시중 |
| 6 | 커머스원 스튜디오 | 제품 상세페이지 촬영자 모집 | 제품/커머스 | 경기 성남시 분당구 | 1년 이상 | 계약직 | 월급 | 월 260만원 | 마감일 / 2026-08-05 | X | 게시중 |
| 7 | 다큐공방 결 | 인물 인터뷰 콘텐츠 촬영자 | 인터뷰/다큐 | 서울 종로구 | 3년 이상 | 프리랜서 | 건당 | 건당 50만원 | 마감일 / 2026-07-30 | X | 게시중 |
| 8 | 라이브온 미디어 | 라이브커머스 송출 오퍼레이터 | 라이브/스트리밍 | 서울 강서구 | 1년 이상 | 정규직 | 월급 | 월 320만원 | 채용시까지 | O | 게시중 |
| 9 | 에어샷 픽처스 | 제주 관광 콘텐츠 드론 촬영자 | 드론 | 제주 제주시 | 3년 이상 | 프리랜서 | 건당 | 건당 60만원 | 마감일 / 2026-08-20 | X | 게시중 |
| 10 | 스튜디오 흰바람 | 렌탈 스튜디오 상주 촬영자 | 스튜디오 | 서울 용산구 | 신입 | 정규직 | 월급 | 월 250만원 | 채용시까지 | X | 게시중 |
| 11 | 홈앤스페이스 | 송도 매물 공간 촬영자 상시 모집 | 부동산/공간 | 인천 연수구 | 경력무관 | 프리랜서 | 건당 | 건당 25만원 | 상시채용 | X | 게시중 |
| 12 | 뷰티브릿지 | 뷰티 브랜드 화보 영상 촬영자 | 뷰티/패션 | 서울 강남구 (압구정로데오역) | 5년 이상 | 프로젝트 | 건당 | 건당 70만원 | 마감일 / 2026-07-22 | O | 게시중 |
| 13 | 에듀클래스 온 | 인강 촬영 및 송출 보조(주 3일) | 교육/강의 | 서울 관악구 | 신입 | 파트타임 | 일당 | 일당 20만원 | 마감일 / 2026-07-12 | X | 마감 |
| 14 | 스포츠비전 | 아마추어 리그 경기 촬영 스태프 | 스포츠/공연 | 부산 해운대구 | 1년 이상 | 프리랜서 | 일당 | 일당 35만원 | 마감일 / 2026-08-10 | X | 게시중 |
| 15 | 브랜드웍스 한강 | 기업 홍보영상 촬영팀(A/B캠) 모집 | 브랜드/광고 촬영 | 서울 성동구 | 10년 이상 | 프로젝트 | 건당 | 건당 250만원 | 마감일 / 2026-08-15 | O | 게시중 |
| 16 | 채널구름 | 예능형 유튜브 촬영 스태프 모집 | 유튜브/채널 촬영 | 경기 고양시 일산동구 | 경력무관 | 프리랜서 | 건당 | 건당 35만원 | 상시채용 | X | 게시중 |
| 17 | 숏폼팩토리 | 틱톡 브랜드 계정 촬영/편집자 | 숏폼/Reels/TikTok | 서울 마포구 (합정역) | 1년 이상 | 계약직 | 월급 | 월 240만원 | 마감일 / 2026-07-20 | X | 게시중 |
| 18 | 필름로그 스튜디오 | 지역 다큐 시리즈 촬영자(3개월) | 인터뷰/다큐 | 대전 유성구 | 3년 이상 | 프로젝트 | 건당 | 건당 55만원 | 마감일 / 2026-08-01 | X | 게시중 |
| 19 | 어반프레임 | 분양 홍보영상 촬영자(드론 우대) | 부동산/공간 | 서울 송파구 (잠실역) | 5년 이상 | 프로젝트 | 건당 | 건당 90만원 | 마감일 / 2026-08-30 | O | 게시중 |
| 20 | 미식탐구 컴퍼니 | 푸드 유튜브 촬영자(주 2회 고정) | 유튜브/채널 촬영 | 서울 중구 (을지로3가역) | 1년 이상 | 프리랜서 | 건당 | 건당 40만원 | 마감일 / 2026-07-28 | X | 게시중 |
| 21 | 웨딩스냅 모먼트 | 웨딩 스냅+영상 동시 촬영자 | 웨딩 | 대구 수성구 | 3년 이상 | 프리랜서 | 건당 | 건당 80만원 | 마감일 / 2026-09-05 | X | 게시중 |
| 22 | 온스테이지 미디어 | 정기 공연 실황 송출 오퍼레이터 | 라이브/스트리밍 | 광주 서구 | 1년 이상 | 파트타임 | 건당 | 건당 18만원 | 채용시까지 | X | 게시중 |
| 23 | 그로스마켓 | 제품 촬영자(사진+영상) 단기 모집 | 제품/커머스 | 서울 금천구 (가산디지털단지역) | 1년 이상 | 프로젝트 | 건당 | 건당 30만원 | 마감일 / 2026-07-10 | X | 마감 |
| 24 | 아트홀 시연 | 공연 실황 멀티캠 촬영자 상시 모집 | 스포츠/공연 | 서울 종로구 (혜화역) | 3년 이상 | 프리랜서 | 협의 | 협의 | 상시채용 | X | 게시중 |
| 25 | 클래스메이트 에듀 | 인강 스튜디오 촬영 운영 매니저 | 교육/강의 | 경기 수원시 영통구 | 3년 이상 | 정규직 | 월급 | 월 300만원 | 마감일 / 2026-08-25 | X | 게시중 |
| 26 | 룩북 아뜰리에 | 패션 룩북 필름 촬영감독 | 뷰티/패션 | 서울 강남구 | 5년 이상 | 프로젝트 | 건당 | 건당 100만원 | 마감일 / 2026-09-10 | O | 게시중 |
| 27 | 페스타기획 | 여름 지역 축제 스케치 촬영(3일) | 행사/컨퍼런스 | 부산 수영구 | 경력무관 | 프로젝트 | 일당 | 일당 40만원 | 마감일 / 2026-07-24 | X | 게시중 |
| 28 | 스카이뷰 드론웍스 | 골프장 코스 소개 드론 촬영자 | 드론 | 경기 화성시 | 3년 이상 | 프리랜서 | 건당 | 건당 45만원 | 마감일 / 2026-09-30 | X | 게시중 |
| 29 | 스튜디오 결로 | 프로필 스튜디오 보조 촬영자(주말) | 스튜디오 | 서울 마포구 (상수역) | 신입 | 파트타임 | 일당 | 일당 11만원 | 마감일 / 2026-07-17 | X | 게시중 |
| 30 | 무브먼트 필름 | 광고 촬영 현장 B팀 오퍼레이터 | 브랜드/광고 촬영 | 서울 강남구 | 1년 이상 | 프로젝트 | 일당 | 일당 50만원 | 마감일 / 2026-08-08 | X | 게시중 |

- 마감 상태 2건(id 13, 23)은 모집 인원 조기 충원으로 마감일 전 조기 마감 처리된 케이스다.

#### 3.1.2 운영/메타 필드

| id | equipment | applyMethods | managerName | managerEmail | address | image | createdAt | views | scrapCount |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 시네마 카메라, 렌즈 세트, 색보정 가능 | 온라인, 이메일 | 김도담 | recruit@onbit.example.kr | 서울 강남구 테헤란로 152 | jobs/shootmon-job-brand-01 | 2026-06-28 | 1842 | 37 |
| 2 | DSLR/미러리스, 짐벌, 편집 가능 | 온라인 | 박서진 | hire@moovlab.example.kr | 서울 마포구 양화로 45 | jobs/shootmon-job-youtube-01 | 2026-06-15 | 2315 | 54 |
| 3 | DSLR/미러리스, 짐벌 | 온라인, 이메일 | 이하람 | apply@pixelriver.example.kr | 서울 성동구 연무장길 20 | jobs/shootmon-job-shortform-01 | 2026-06-30 | 976 | 21 |
| 4 | DSLR/미러리스, 짐벌, 무선마이크/붐마이크 | 온라인 | 한유리 | crew@lavienne.example.kr | 서울 서초구 반포대로 58 | jobs/shootmon-job-wedding-01 | 2026-05-20 | 3204 | 88 |
| 5 | DSLR/미러리스, 무선마이크/붐마이크 | 이메일 | 정민재 | event@daol.example.kr | 서울 영등포구 국제금융로 10 | jobs/shootmon-job-event-01 | 2026-07-01 | 654 | 12 |
| 6 | DSLR/미러리스, 조명, 사진 촬영 가능 | 온라인 | 오세라 | hr@commerceone.example.kr | 경기 성남시 분당구 판교로 235 | jobs/shootmon-job-product-01 | 2026-06-22 | 1127 | 30 |
| 7 | 시네마 카메라, 조명, 무선마이크/붐마이크 | 온라인, 이메일 | 신가온 | docu@gyeol.example.kr | 서울 종로구 자하문로 12 | jobs/shootmon-job-interview-01 | 2026-06-25 | 889 | 19 |
| 8 | 라이브 송출 장비, 조명 | 온라인 | 장다훈 | live@liveon.example.kr | 서울 강서구 마곡중앙로 161 | jobs/shootmon-job-live-01 | 2026-06-10 | 1955 | 41 |
| 9 | 드론, DSLR/미러리스 | 이메일 | 고은채 | fly@airshot.example.kr | 제주 제주시 첨단로 213 | jobs/shootmon-job-drone-01 | 2026-06-18 | 1432 | 35 |
| 10 | 조명, 사진 촬영 가능 | 온라인 | 백지호 | studio@hwinbaram.example.kr | 서울 용산구 한강대로 92 | jobs/shootmon-job-studio-01 | 2026-06-05 | 1208 | 26 |
| 11 | DSLR/미러리스, 짐벌 | 온라인 | 문세아 | media@homenspace.example.kr | 인천 연수구 송도과학로 32 | jobs/shootmon-job-realestate-01 | 2026-05-28 | 742 | 15 |
| 12 | DSLR/미러리스, 렌즈 세트, 조명 | 온라인, 이메일 | 윤채린 | cast@beautybridge.example.kr | 서울 강남구 도산대로 318 | jobs/shootmon-job-beauty-01 | 2026-06-27 | 1689 | 44 |
| 13 | DSLR/미러리스, 프롬프터 | 온라인 | 최다임 | edu@educlasson.example.kr | 서울 관악구 남부순환로 1820 | jobs/shootmon-job-education-01 | 2026-06-02 | 1530 | 9 |
| 14 | DSLR/미러리스, 라이브 송출 장비 | 온라인 | 강병주 | staff@sportsvision.example.kr | 부산 해운대구 센텀중앙로 48 | jobs/shootmon-job-sports-01 | 2026-06-20 | 811 | 14 |
| 15 | 시네마 카메라, 렌즈 세트, 조명, 색보정 가능 | 온라인, 이메일 | 임규원 | pd@brandworks.example.kr | 서울 성동구 왕십리로 83 | jobs/shootmon-job-brand-02 | 2026-06-29 | 2077 | 61 |
| 16 | DSLR/미러리스, 무선마이크/붐마이크, 짐벌 | 온라인 | 서은우 | crew@channelgureum.example.kr | 경기 고양시 일산동구 중앙로 1275 | jobs/shootmon-job-youtube-02 | 2026-05-15 | 1344 | 28 |
| 17 | DSLR/미러리스, 짐벌, 편집 가능 | 온라인 | 노하진 | join@shortformfactory.example.kr | 서울 마포구 독막로 92 | jobs/shootmon-job-shortform-02 | 2026-07-02 | 588 | 17 |
| 18 | 시네마 카메라, 무선마이크/붐마이크 | 이메일 | 유석현 | contact@filmlog.example.kr | 대전 유성구 대학로 99 | jobs/shootmon-job-interview-02 | 2026-06-24 | 673 | 11 |
| 19 | DSLR/미러리스, 드론, 짐벌 | 온라인 | 곽민성 | space@urbanframe.example.kr | 서울 송파구 올림픽로 300 | jobs/shootmon-job-realestate-02 | 2026-07-03 | 903 | 22 |
| 20 | DSLR/미러리스, 조명 | 온라인, 이메일 | 안정빈 | food@misik.example.kr | 서울 중구 을지로 118 | jobs/shootmon-job-youtube-01 | 2026-06-26 | 1092 | 25 |
| 21 | DSLR/미러리스, 사진 촬영 가능, 짐벌 | 온라인 | 하승리 | snap@moment.example.kr | 대구 수성구 동대구로 111 | jobs/shootmon-job-wedding-02 | 2026-06-08 | 1265 | 33 |
| 22 | 라이브 송출 장비, 무선마이크/붐마이크 | 이메일 | 남주하 | stage@onstage.example.kr | 광주 서구 상무중앙로 61 | jobs/shootmon-job-live-02 | 2026-05-30 | 512 | 8 |
| 23 | DSLR/미러리스, 조명, 사진 촬영 가능 | 온라인 | 표진우 | photo@growthmarket.example.kr | 서울 금천구 가산디지털1로 168 | jobs/shootmon-job-product-02 | 2026-06-12 | 1401 | 18 |
| 24 | 시네마 카메라, 라이브 송출 장비 | 온라인, 이메일 | 성지훈 | hall@siyeon.example.kr | 서울 종로구 대학로 116 | jobs/shootmon-job-sports-02 | 2026-05-25 | 987 | 20 |
| 25 | 조명, 프롬프터, 라이브 송출 장비 | 온라인 | 민서영 | recruit@classmate-edu.example.kr | 경기 수원시 영통구 광교로 145 | jobs/shootmon-job-education-02 | 2026-07-04 | 445 | 10 |
| 26 | 시네마 카메라, 조명, 색보정 가능 | 온라인, 이메일 | 권이솔 | film@lookbook.example.kr | 서울 강남구 압구정로 424 | jobs/shootmon-job-beauty-02 | 2026-07-05 | 356 | 16 |
| 27 | DSLR/미러리스, 짐벌 | 온라인 | 도영훈 | festa@festaplan.example.kr | 부산 수영구 광안해변로 219 | jobs/shootmon-job-event-02 | 2026-07-01 | 620 | 13 |
| 28 | 드론, 색보정 가능 | 이메일 | 변주원 | drone@skyview.example.kr | 경기 화성시 동탄대로 636 | jobs/shootmon-job-drone-02 | 2026-06-16 | 534 | 9 |
| 29 | DSLR/미러리스, 조명, 사진 촬영 가능 | 온라인 | 엄소정 | studio@gyeollo.example.kr | 서울 마포구 와우산로 27 | jobs/shootmon-job-studio-02 | 2026-06-21 | 830 | 12 |
| 30 | 시네마 카메라, 짐벌 | 온라인 | 홍다연 | bteam@movementfilm.example.kr | 서울 강남구 봉은사로 429 | jobs/shootmon-job-brand-01 | 2026-07-02 | 1140 | 24 |

#### 3.1.3 상세 설명 (description)

- **1** — 신규 브랜드 필름 3편 제작에 참여할 촬영감독을 찾습니다. 콘티 기반 촬영 경험과 시네마 카메라 운용이 필수이며, 조명팀과의 협업 경험을 우대합니다. 촬영은 8월 중 서울/경기 로케이션 2일, 스튜디오 1일로 진행됩니다.
- **2** — 구독자 40만 규모 지식 채널의 전속 촬영 PD를 채용합니다. 주 2회 스튜디오 촬영과 월 1회 야외 촬영을 담당하며, 컷 편집까지 가능하면 우대합니다. 4대 보험과 장비 지원이 제공됩니다.
- **3** — 패션 브랜드 공식 계정에 업로드할 세로형 릴스 콘텐츠 촬영자를 모집합니다. 월 8건 내외의 정기 촬영이며, 트렌드 문법에 맞는 빠른 호흡의 촬영이 가능해야 합니다.
- **4** — 주말 본식 촬영을 담당할 2인 이상 촬영팀을 상시 모집합니다. 본식 영상 촬영 경력 3년 이상, 짐벌 워킹샷 가능자를 찾습니다. 홀 전속 계약으로 월 4~6건의 안정적인 일정을 보장합니다.
- **5** — 여의도 컨벤션에서 열리는 이틀간의 기업 컨퍼런스 스케치 촬영입니다. 세션 스케치, 인터뷰 스케치, 부스 스케치를 담당하며 당일 원본 전달 조건입니다.
- **6** — 자사 스튜디오에서 진행하는 제품 상세페이지 촬영 인력을 채용합니다. 의류/잡화 중심이며 사진과 짧은 영상 클립을 함께 촬영합니다. 주 5일 판교 스튜디오 출근입니다.
- **7** — 창작자 인터뷰 시리즈의 고정 촬영자를 찾습니다. 2캠 인터뷰 세팅과 조명 구성이 가능해야 하며, 월 3~4회 서울 시내 촬영입니다. 회차당 촬영 시간은 3시간 내외입니다.
- **8** — 자체 스튜디오에서 진행하는 라이브커머스 방송의 송출 오퍼레이터를 채용합니다. 스위처 운용과 송출 세팅 경험이 필요하며, 주 4회 방송을 담당합니다. 방송 장비는 전량 회사에서 제공합니다.
- **9** — 제주 관광 콘텐츠 시리즈의 드론 촬영을 맡을 분을 찾습니다. 초경량비행장치 조종자 증명 보유와 비행 승인 절차 경험이 필수입니다. 월 2~3회, 회당 반나절 촬영입니다.
- **10** — 렌탈 스튜디오 상주 촬영자를 채용합니다. 대관 고객 응대와 조명 세팅 보조, 자체 프로필 촬영 상품 운영을 담당합니다. 신입 지원 가능하며 사진 촬영 가능자를 우대합니다.
- **11** — 송도 지역 아파트/오피스텔 매물 소개 영상을 촬영할 프리랜서를 상시 모집합니다. 건당 20분 내외 촬영, 월 10건 이상 배정 가능합니다. 짐벌 워킹샷 촬영이 가능해야 합니다.
- **12** — 뷰티 브랜드 시즌 화보 영상 촬영자를 모집합니다. 클로즈업 제품 컷과 모델 컷을 모두 다뤄야 하며, 뷰티/패션 화보 포트폴리오 제출이 필수입니다. 촬영은 7월 말 이틀간 진행됩니다.
- **13** — 인터넷 강의 촬영과 실시간 송출 보조 인력을 모집했습니다. 주 3일 오후 근무 조건이며, 현재 인원이 충원되어 조기 마감되었습니다.
- **14** — 부산 지역 아마추어 축구/농구 리그 경기 촬영 스태프를 모집합니다. 주말 경기 위주이며 하이라이트 편집팀에 원본을 전달하는 역할입니다. 스포츠 팔로잉 촬영 경험을 우대합니다.
- **15** — 대기업 계열사 홍보영상 촬영에 A/B캠 촬영팀을 모집합니다. 시네마 카메라 2대 운용, DIT 경험, 색보정 협의 가능자를 찾습니다. 총 4회차 촬영이며 회당 단가는 협의 가능합니다.
- **16** — 야외 예능형 유튜브 콘텐츠의 촬영 스태프를 상시 모집합니다. 핸드헬드/짐벌 팔로잉 촬영 위주이며, 출연자 동선을 따라가는 체력이 필요합니다. 경력이 없어도 포트폴리오가 있으면 지원 가능합니다.
- **17** — 브랜드 틱톡 계정 운영을 위한 촬영/편집 겸직 인력을 채용합니다. 주간 콘텐츠 4편 촬영과 컷 편집을 담당하며, 합정 사무실 출근 기준 6개월 계약입니다.
- **18** — 대전/충청 지역 소상공인 다큐 시리즈의 촬영자를 찾습니다. 3개월간 월 4회 촬영이며, 인터뷰와 현장 스케치를 함께 다룹니다. 지역 거주자를 우대합니다.
- **19** — 신규 분양 단지 홍보영상 촬영자를 모집합니다. 지상 촬영이 기본이며 드론 항공샷 가능 시 건당 30만원을 추가 지급합니다. 견본주택과 현장 2회 촬영입니다.
- **20** — 을지로 노포를 소개하는 푸드 유튜브 채널의 고정 촬영자를 찾습니다. 주 2회 저녁 촬영이며, 음식 클로즈업과 매장 스케치 촬영 감각이 중요합니다.
- **21** — 본식 스냅 사진과 영상을 동시에 담당할 촬영자를 모집합니다. 대구/경북 지역 예식 위주이며, 사진과 영상 포트폴리오를 모두 제출해야 합니다.
- **22** — 공연장 정기 공연의 실황 라이브 송출을 담당할 오퍼레이터를 모집합니다. 월 2~4회 주말 저녁 근무이며, 송출 장비는 현장에 구축되어 있습니다.
- **23** — 오픈마켓 입점 상품의 사진/영상 촬영자를 단기 모집했습니다. 가산 스튜디오에서 일 단위로 진행하는 건이었으며, 지원자 확정으로 조기 마감되었습니다.
- **24** — 대학로 공연장의 연극/뮤지컬 실황을 멀티캠으로 기록할 촬영자를 상시 모집합니다. 3캠 운용 경험자를 우대하며, 공연 일정에 따라 회당 단가를 협의합니다.
- **25** — 인강 촬영 스튜디오의 촬영 운영 매니저를 채용합니다. 강의 촬영, 프롬프터 운용, 송출 장비 관리, 외부 촬영자 스케줄 관리를 담당합니다. 광교 사옥 주 5일 근무입니다.
- **26** — F/W 시즌 룩북 필름을 연출할 촬영감독을 모집합니다. 패션 필름 레퍼런스 기반 무드 구현이 핵심이며, 조명 디자인까지 리드할 수 있어야 합니다. 스튜디오 이틀 촬영입니다.
- **27** — 광안리 일대에서 열리는 여름 축제의 3일간 스케치 촬영자를 모집합니다. 야간 촬영 비중이 높아 저조도 촬영 경험이 필요합니다. 숙박은 주최 측에서 제공합니다.
- **28** — 골프장 코스 소개 영상의 드론 촬영자를 찾습니다. 코스별 항공샷과 시그니처 홀 연출샷을 촬영하며, 총 18홀 2회 방문 일정입니다. 색보정 가능자를 우대합니다.
- **29** — 주말 프로필/증명 사진 스튜디오의 보조 촬영자를 모집합니다. 조명 세팅과 보조 촬영, 고객 안내를 담당합니다. 신입 지원 가능하며 촬영 교육을 제공합니다.
- **30** — 광고 촬영 현장의 B팀 오퍼레이터를 모집합니다. B캠 운용과 장비 관리가 주 업무이며, 현장 경험 1년 이상이면 지원 가능합니다. 월 3~5회 현장이 배정됩니다.

### 3.2 촬영자 프로필 (ShooterProfile) — 30건

#### 3.2.1 핵심 필드

| id | maskedName | gender / birthYear | title | region | categories | desiredPay | careerYears | status | 출장 | 스튜디오 | 추천 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 김O현 | 남 / 1988 | 브랜드 필름 전문 촬영감독 | 서울 강남구 | 브랜드/광고 촬영, 제품/커머스 | 건당 150만원부터 | 12 | 활동가능 | O | X | O |
| 2 | 이O진 | 여 / 1993 | 유튜브 촬영과 편집을 한 번에 | 서울 마포구 | 유튜브/채널 촬영, 숏폼/Reels/TikTok | 건당 35만원부터 | 5 | 활동가능 | O | X | X |
| 3 | 박O수 | 남 / 1990 | 웨딩 본식 영상 8년차 | 서울 송파구 | 웨딩 | 건당 90만원부터 | 8 | 일정협의 | O | X | X |
| 4 | 팀 루멘 | — (팀) | 3인 구성 웨딩/행사 촬영팀 | 경기 성남시 분당구 | 웨딩, 행사/컨퍼런스 | 건당 130만원부터 | 7 | 활동가능 | O | X | O |
| 5 | 최O아 | 여 / 1996 | 세로형 숏폼 전문 촬영 | 서울 성동구 | 숏폼/Reels/TikTok, 뷰티/패션 | 건당 25만원부터 | 3 | 활동가능 | O | X | X |
| 6 | 정O호 | 남 / 1985 | 국가자격 보유 드론 항공촬영 | 제주 제주시 | 드론, 부동산/공간 | 건당 50만원부터 | 9 | 활동가능 | O | X | X |
| 7 | 강O림 | 여 / 1991 | 인터뷰/다큐 전문 2캠 촬영 | 서울 종로구 | 인터뷰/다큐, 교육/강의 | 건당 55만원부터 | 7 | 프로젝트중 | O | X | X |
| 8 | 윤O성 | 남 / 1994 | 제품 커머스 사진+영상 원스톱 | 서울 금천구 | 제품/커머스 | 건당 40만원부터 | 6 | 활동가능 | X | O | X |
| 9 | 팀 온에어 | — (팀) | 3캠 라이브 송출 전문팀 | 서울 영등포구 | 라이브/스트리밍, 행사/컨퍼런스 | 건당 120만원부터 | 6 | 활동가능 | O | X | O |
| 10 | 한O별 | 여 / 1997 | 뷰티 클로즈업/디테일 컷 전문 | 서울 강남구 | 뷰티/패션, 제품/커머스 | 건당 45만원부터 | 4 | 활동가능 | O | X | X |
| 11 | 조O탁 | 남 / 1989 | 행사/컨퍼런스 멀티캠 운영 | 대전 유성구 | 행사/컨퍼런스, 라이브/스트리밍 | 일당 40만원부터 | 8 | 일정협의 | O | X | X |
| 12 | 서O우 | 남 / 1998 | B캠/촬영 보조 성실히 배우겠습니다 | 서울 관악구 | 유튜브/채널 촬영 | 일당 12만원부터 | 1 | 활동가능 | O | X | X |
| 13 | 스튜디오 딥포커스 | — (기업형 팀) | 제품 전문 스튜디오, 빠른 납품 | 서울 성동구 | 제품/커머스, 스튜디오 | 건당 60만원부터 | 10 | 활동가능 | X | O | O |
| 14 | 임O경 | 여 / 1992 | 부동산/공간 영상, 드론 가능 | 인천 연수구 | 부동산/공간, 드론 | 건당 30만원부터 | 5 | 활동가능 | O | X | X |
| 15 | 오O민 | 남 / 1987 | 교육 콘텐츠 촬영, 스튜디오 보유 | 경기 수원시 영통구 | 교육/강의, 인터뷰/다큐 | 건당 35만원부터 | 9 | 활동가능 | O | O | X |
| 16 | 신O철 | 남 / 1983 | 스포츠 중계 카메라 15년 | 부산 사하구 | 스포츠/공연 | 일당 50만원부터 | 15 | 일정협의 | O | X | X |
| 17 | 문O래 | 여 / 1995 | 공연 실황 멀티캠 기록 | 서울 종로구 | 스포츠/공연, 행사/컨퍼런스 | 건당 50만원부터 | 6 | 활동가능 | O | X | X |
| 18 | 배O준 | 남 / 1991 | 기업 홍보영상 촬영+색보정 | 대구 중구 | 브랜드/광고 촬영, 인터뷰/다큐 | 건당 100만원부터 | 8 | 프로젝트중 | O | X | X |
| 19 | 황O솔 | 여 / 1999 | 릴스/틱톡 트렌드 촬영 | 서울 마포구 | 숏폼/Reels/TikTok, 유튜브/채널 촬영 | 건당 20만원부터 | 2 | 활동가능 | O | X | X |
| 20 | 팀 프레임워크 | — (팀) | 웨딩 영상+스냅 동시 4인팀 | 광주 서구 | 웨딩, 스튜디오 | 건당 110만원부터 | 9 | 활동가능 | O | O | O |
| 21 | 유O나 | 여 / 1994 | 라이브커머스 전속 촬영/송출 | 서울 강서구 | 라이브/스트리밍, 제품/커머스 | 월 300만원부터 | 5 | 일정협의 | X | X | X |
| 22 | 남O기 | 남 / 1986 | 드론+지상 촬영 원스톱 | 경기 화성시 | 드론, 브랜드/광고 촬영 | 건당 70만원부터 | 10 | 활동가능 | O | X | X |
| 23 | 도O연 | 여 / 1990 | 호리존 스튜디오 인물/프로필 촬영 | 서울 용산구 | 스튜디오, 뷰티/패션 | 건당 30만원부터 | 7 | 활동가능 | X | O | X |
| 24 | 허O담 | 남 / 1996 | 예능형 유튜브 멀티캠 촬영 | 서울 광진구 | 유튜브/채널 촬영, 행사/컨퍼런스 | 건당 40만원부터 | 4 | 활동가능 | O | X | X |
| 25 | 표O진 | 남 / 1992 | 골프/레저 전문 촬영 | 부산 기장군 | 스포츠/공연, 드론 | 건당 55만원부터 | 6 | 활동가능 | O | X | X |
| 26 | 진O서 | 여 / 1993 | 패션 필름/룩북 촬영감독 | 서울 강남구 | 뷰티/패션, 브랜드/광고 촬영 | 건당 120만원부터 | 8 | 프로젝트중 | O | X | O |
| 27 | 마O훈 | 남 / 1988 | 기업 인터뷰/사보영상 전문 | 대전 서구 | 인터뷰/다큐 | 건당 45만원부터 | 9 | 활동가능 | O | X | X |
| 28 | 구O빈 | 여 / 1998 | 온라인 클래스/강의 촬영 | 서울 노원구 | 교육/강의 | 건당 25만원부터 | 3 | 활동가능 | O | X | X |
| 29 | 방O열 | 남 / 1984 | 분양/건축 기록 촬영 11년 | 서울 송파구 | 부동산/공간, 드론 | 건당 60만원부터 | 11 | 일정협의 | O | X | X |
| 30 | 안O율 | 남 / 1995 | 웨딩 세컨캠/행사 보조 | 인천 부평구 | 웨딩, 행사/컨퍼런스 | 일당 15만원부터 | 2 | 활동가능 | O | X | X |

#### 3.2.2 장비/포트폴리오/메타 필드

| id | equipment | portfolioImages | portfolioLinks | avatar | cover | updatedAt |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 시네마 카메라, 렌즈 세트, 조명, 색보정 가능 | profiles/shootmon-profile-ad-01, profiles/shootmon-profile-ad-02, profiles/shootmon-profile-product-01 | https://youtu.be/smp-p01a, https://vimeo.com/900000101 | profiles/shootmon-avatar-male-01 | profiles/shootmon-profile-ad-01 | 2026-07-01 |
| 2 | DSLR/미러리스, 짐벌, 무선마이크/붐마이크, 편집 가능 | profiles/shootmon-profile-youtube-01, profiles/shootmon-profile-shortform-01 | https://youtu.be/smp-p02a | profiles/shootmon-avatar-female-01 | profiles/shootmon-profile-youtube-01 | 2026-06-29 |
| 3 | DSLR/미러리스, 짐벌, 무선마이크/붐마이크 | profiles/shootmon-profile-wedding-01, profiles/shootmon-profile-wedding-02 | https://youtu.be/smp-p03a, https://vimeo.com/900000103 | profiles/shootmon-avatar-male-01 | profiles/shootmon-profile-wedding-01 | 2026-06-20 |
| 4 | DSLR/미러리스, 짐벌, 조명, 무선마이크/붐마이크 | profiles/shootmon-profile-wedding-02, profiles/shootmon-profile-event-01, profiles/shootmon-profile-wedding-01 | https://youtu.be/smp-p04a, https://youtu.be/smp-p04b | profiles/shootmon-avatar-team-01 | profiles/shootmon-profile-wedding-02 | 2026-07-03 |
| 5 | DSLR/미러리스, 짐벌, 조명, 편집 가능 | profiles/shootmon-profile-shortform-01, profiles/shootmon-profile-fashion-01 | https://youtu.be/smp-p05a | profiles/shootmon-avatar-female-01 | profiles/shootmon-profile-shortform-01 | 2026-07-02 |
| 6 | 드론, DSLR/미러리스, 색보정 가능 | profiles/shootmon-profile-drone-01, profiles/shootmon-profile-drone-02, profiles/shootmon-profile-realestate-01 | https://youtu.be/smp-p06a, https://vimeo.com/900000106 | profiles/shootmon-avatar-male-01 | profiles/shootmon-profile-drone-01 | 2026-06-25 |
| 7 | 시네마 카메라, 조명, 무선마이크/붐마이크, 프롬프터 | profiles/shootmon-profile-interview-01, profiles/shootmon-profile-interview-02 | https://vimeo.com/900000107 | profiles/shootmon-avatar-female-01 | profiles/shootmon-profile-interview-01 | 2026-06-18 |
| 8 | DSLR/미러리스, 조명, 사진 촬영 가능, 스튜디오 보유 | profiles/shootmon-profile-product-01, profiles/shootmon-profile-product-02, profiles/shootmon-profile-studio-01 | https://youtu.be/smp-p08a | profiles/shootmon-avatar-male-01 | profiles/shootmon-profile-product-01 | 2026-07-04 |
| 9 | 라이브 송출 장비, 시네마 카메라, 무선마이크/붐마이크 | profiles/shootmon-profile-live-01, profiles/shootmon-profile-event-01 | https://youtu.be/smp-p09a, https://youtu.be/smp-p09b | profiles/shootmon-avatar-team-01 | profiles/shootmon-profile-live-01 | 2026-06-30 |
| 10 | DSLR/미러리스, 렌즈 세트, 조명 | profiles/shootmon-profile-fashion-01, profiles/shootmon-profile-product-02 | https://youtu.be/smp-p10a | profiles/shootmon-avatar-female-01 | profiles/shootmon-profile-fashion-01 | 2026-06-27 |
| 11 | DSLR/미러리스, 라이브 송출 장비, 무선마이크/붐마이크 | profiles/shootmon-profile-event-01, profiles/shootmon-profile-event-02 | https://vimeo.com/900000111 | profiles/shootmon-avatar-male-01 | profiles/shootmon-profile-event-01 | 2026-06-10 |
| 12 | DSLR/미러리스, 짐벌 | profiles/shootmon-profile-youtube-02, profiles/shootmon-profile-youtube-01 | https://youtu.be/smp-p12a | profiles/shootmon-avatar-male-01 | profiles/shootmon-profile-youtube-02 | 2026-07-05 |
| 13 | 스튜디오 보유, 조명, 시네마 카메라, 사진 촬영 가능 | profiles/shootmon-profile-product-02, profiles/shootmon-profile-studio-01, profiles/shootmon-profile-studio-02 | https://youtu.be/smp-p13a, https://vimeo.com/900000113 | profiles/shootmon-avatar-company-01 | profiles/shootmon-profile-studio-01 | 2026-07-02 |
| 14 | DSLR/미러리스, 드론, 짐벌 | profiles/shootmon-profile-realestate-01, profiles/shootmon-profile-drone-02 | https://youtu.be/smp-p14a | profiles/shootmon-avatar-female-01 | profiles/shootmon-profile-realestate-01 | 2026-06-22 |
| 15 | DSLR/미러리스, 프롬프터, 무선마이크/붐마이크, 스튜디오 보유 | profiles/shootmon-profile-education-01, profiles/shootmon-profile-interview-02 | https://youtu.be/smp-p15a | profiles/shootmon-avatar-male-01 | profiles/shootmon-profile-education-01 | 2026-06-15 |
| 16 | 시네마 카메라, 렌즈 세트, 라이브 송출 장비 | profiles/shootmon-profile-sports-01, profiles/shootmon-profile-sports-02 | https://youtu.be/smp-p16a, https://vimeo.com/900000116 | profiles/shootmon-avatar-male-01 | profiles/shootmon-profile-sports-01 | 2026-06-08 |
| 17 | DSLR/미러리스, 짐벌, 색보정 가능 | profiles/shootmon-profile-sports-02, profiles/shootmon-profile-event-02 | https://youtu.be/smp-p17a | profiles/shootmon-avatar-female-01 | profiles/shootmon-profile-sports-02 | 2026-06-28 |
| 18 | 시네마 카메라, 조명, 색보정 가능 | profiles/shootmon-profile-ad-02, profiles/shootmon-profile-interview-01 | https://vimeo.com/900000118 | profiles/shootmon-avatar-male-01 | profiles/shootmon-profile-ad-02 | 2026-06-19 |
| 19 | DSLR/미러리스, 짐벌, 편집 가능 | profiles/shootmon-profile-shortform-02, profiles/shootmon-profile-youtube-02 | https://youtu.be/smp-p19a, https://youtu.be/smp-p19b | profiles/shootmon-avatar-female-01 | profiles/shootmon-profile-shortform-02 | 2026-07-04 |
| 20 | DSLR/미러리스, 조명, 사진 촬영 가능, 스튜디오 보유 | profiles/shootmon-profile-wedding-01, profiles/shootmon-profile-studio-02, profiles/shootmon-profile-wedding-02 | https://youtu.be/smp-p20a | profiles/shootmon-avatar-team-01 | profiles/shootmon-profile-wedding-01 | 2026-06-26 |
| 21 | 라이브 송출 장비, 조명, DSLR/미러리스 | profiles/shootmon-profile-live-02, profiles/shootmon-profile-product-01 | https://youtu.be/smp-p21a | profiles/shootmon-avatar-female-01 | profiles/shootmon-profile-live-02 | 2026-06-13 |
| 22 | 드론, 시네마 카메라, 짐벌 | profiles/shootmon-profile-drone-02, profiles/shootmon-profile-ad-01 | https://youtu.be/smp-p22a, https://vimeo.com/900000122 | profiles/shootmon-avatar-male-01 | profiles/shootmon-profile-drone-02 | 2026-07-01 |
| 23 | 스튜디오 보유, 조명, 사진 촬영 가능 | profiles/shootmon-profile-studio-02, profiles/shootmon-profile-fashion-02 | https://youtu.be/smp-p23a | profiles/shootmon-avatar-female-01 | profiles/shootmon-profile-studio-02 | 2026-06-24 |
| 24 | DSLR/미러리스, 무선마이크/붐마이크, 짐벌 | profiles/shootmon-profile-youtube-01, profiles/shootmon-profile-event-02 | https://youtu.be/smp-p24a | profiles/shootmon-avatar-male-01 | profiles/shootmon-profile-youtube-01 | 2026-06-30 |
| 25 | 드론, DSLR/미러리스, 짐벌 | profiles/shootmon-profile-sports-01, profiles/shootmon-profile-drone-01 | https://youtu.be/smp-p25a | profiles/shootmon-avatar-male-01 | profiles/shootmon-profile-sports-01 | 2026-06-21 |
| 26 | 시네마 카메라, 조명, 색보정 가능 | profiles/shootmon-profile-fashion-01, profiles/shootmon-profile-fashion-02, profiles/shootmon-profile-ad-02 | https://vimeo.com/900000126, https://youtu.be/smp-p26a | profiles/shootmon-avatar-female-01 | profiles/shootmon-profile-fashion-02 | 2026-07-03 |
| 27 | DSLR/미러리스, 조명, 무선마이크/붐마이크, 프롬프터 | profiles/shootmon-profile-interview-02, profiles/shootmon-profile-interview-01 | https://youtu.be/smp-p27a | profiles/shootmon-avatar-male-01 | profiles/shootmon-profile-interview-02 | 2026-06-17 |
| 28 | DSLR/미러리스, 프롬프터, 편집 가능 | profiles/shootmon-profile-education-01, profiles/shootmon-profile-education-02 | https://youtu.be/smp-p28a | profiles/shootmon-avatar-female-01 | profiles/shootmon-profile-education-02 | 2026-07-05 |
| 29 | 드론, DSLR/미러리스, 색보정 가능 | profiles/shootmon-profile-realestate-02, profiles/shootmon-profile-drone-01 | https://vimeo.com/900000129 | profiles/shootmon-avatar-male-01 | profiles/shootmon-profile-realestate-02 | 2026-06-11 |
| 30 | DSLR/미러리스, 짐벌 | profiles/shootmon-profile-wedding-02, profiles/shootmon-profile-event-01 | https://youtu.be/smp-p30a | profiles/shootmon-avatar-male-01 | profiles/shootmon-profile-event-01 | 2026-06-23 |

#### 3.2.3 경력/학력/소개 (careerHistory / education / intro)

careerHistory는 배열 원소를 ` · ` 구분으로 표기한다.

- **1 김O현** — 경력: 광고 프로덕션 촬영팀 10년 · 브랜드 필름 60여 편 촬영 · 대기업 채용 홍보영상 시리즈 촬영감독 | 학력: 4년제 영상학 전공 졸업 | 소개: 콘티 단계부터 참여해 촬영 설계를 함께 잡는 촬영감독입니다. 조명과 색보정까지 일관된 톤으로 마무리합니다.
- **2 이O진** — 경력: 유튜브 전문 프로덕션 3년 · 구독자 10만 이상 채널 4곳 고정 촬영 | 소개: 촬영과 컷 편집을 함께 처리해 제작 흐름을 단순하게 만듭니다. 소규모 채널의 반복 촬영에 강합니다.
- **3 박O수** — 경력: 웨딩 영상 업체 5년 근속 · 프리랜서 본식 촬영 300회 이상 | 소개: 본식 동선과 홀 조명 상황을 미리 파악하고 들어갑니다. 짐벌 워킹샷 중심의 안정적인 본식 영상을 만듭니다.
- **4 팀 루멘** — 경력: 3인 팀 결성 7년차 · 연간 웨딩 80건, 기업 행사 30건 수행 · 수도권 전 지역 출장 | 소개: 메인/서브/스케치 3인 분업으로 놓치는 장면 없이 기록합니다. 웨딩과 기업 행사 모두 고정 단가표를 운영합니다.
- **5 최O아** — 경력: 뷰티 브랜드 인하우스 촬영 2년 · 프리랜서 숏폼 촬영 1년 | 소개: 세로형 화면 문법에 맞춘 구도와 빠른 호흡의 촬영이 강점입니다. 촬영 당일 가편본까지 전달합니다.
- **6 정O호** — 경력: 항공촬영 전문 업체 6년 · 프리랜서 드론 촬영 3년 · 초경량비행장치 조종자 증명 보유 | 소개: 비행 승인과 안전 관리까지 직접 처리하는 드론 촬영자입니다. 제주 전역과 도서 지역 촬영 경험이 많습니다.
- **7 강O림** — 경력: 방송 외주 제작사 촬영팀 4년 · 인터뷰 콘텐츠 전문 프리랜서 3년 | 학력: 방송영상학 전공 졸업 | 소개: 2캠 인터뷰 세팅과 조명 구성을 혼자서 완결합니다. 출연자가 편안해지는 현장 분위기를 만드는 데 신경 씁니다.
- **8 윤O성** — 경력: 커머스 스튜디오 3년 근무 · 자체 스튜디오 운영 3년차 | 소개: 제품 사진과 영상 클립을 한 번의 세팅으로 함께 촬영합니다. 금천구 스튜디오에서 상시 촬영이 가능합니다.
- **9 팀 온에어** — 경력: 라이브 송출 전문팀 6년차 · 컨퍼런스/공연/커머스 라이브 200회 이상 송출 · 3캠+스위처 자체 장비 보유 | 소개: 현장 답사부터 회선 점검까지 송출 리스크를 미리 제거합니다. 행사 규모에 맞는 패키지 견적을 제시합니다.
- **10 한O별** — 경력: 화장품 브랜드 콘텐츠팀 2년 · 프리랜서 뷰티 촬영 2년 | 소개: 제품 질감과 발색이 살아나는 클로즈업 촬영이 전문입니다. 매크로 렌즈와 소형 조명 세트를 보유하고 있습니다.
- **11 조O탁** — 경력: 행사 대행사 협력 촬영자 8년 · 컨퍼런스 멀티캠 운영 100회 이상 | 소개: 행사 큐시트를 기준으로 멀티캠 운영 계획을 세웁니다. 실시간 송출 병행 요청에도 대응합니다.
- **12 서O우** — 경력: 유튜브 채널 촬영 보조 1년 · 촬영 아카데미 수료 | 학력: 전문대 사진영상과 졸업 | 소개: B캠 운용과 장비 관리 위주로 현장 경험을 쌓고 있습니다. 일정 조율이 빠르고 성실함이 강점입니다.
- **13 스튜디오 딥포커스** — 경력: 제품 촬영 스튜디오 운영 10년 · 오픈마켓/브랜드몰 상세 촬영 누적 1,200건 · 상주 인력 4명 | 소개: 접수부터 납품까지 표준화된 프로세스로 운영합니다. 급한 일정은 당일 촬영, 익일 납품까지 협의 가능합니다.
- **14 임O경** — 경력: 부동산 플랫폼 협력 촬영자 3년 · 드론 촬영 병행 2년 | 소개: 매물의 공간감이 드러나는 동선 촬영을 설계합니다. 항공샷이 필요한 단지 전경 촬영도 함께 처리합니다.
- **15 오O민** — 경력: 교육 기업 영상팀 5년 · 인강 스튜디오 운영 4년차 | 소개: 강의 촬영에 최적화된 자체 스튜디오를 운영합니다. 프롬프터 운용과 강사 디렉팅 경험이 풍부합니다.
- **16 신O철** — 경력: 스포츠 중계 대행사 카메라 감독 12년 · 프리랜서 경기 촬영 3년 | 소개: 경기 흐름을 읽는 팔로잉 촬영이 전문입니다. 중계형 멀티캠 현장의 카메라 리드가 가능합니다.
- **17 문O래** — 경력: 공연 기획사 기록 촬영 4년 · 프리랜서 실황 촬영 2년 | 소개: 무대 조명 환경에서의 노출 관리에 익숙합니다. 연극, 무용, 콘서트 실황 기록 경험이 고르게 있습니다.
- **18 배O준** — 경력: 지역 방송국 협력 프로덕션 5년 · 기업 홍보영상 프리랜서 3년 | 소개: 촬영과 색보정을 함께 맡아 결과물 톤을 책임집니다. 대구/경북 기업 홍보영상 레퍼런스를 보유하고 있습니다.
- **19 황O솔** — 경력: MCN 소속 숏폼 촬영자 1년 · 프리랜서 릴스/틱톡 촬영 1년 | 소개: 최근 유행하는 숏폼 문법을 빠르게 반영합니다. 기획 단계에서 레퍼런스 정리부터 함께합니다.
- **20 팀 프레임워크** — 경력: 4인 팀 운영 9년차 · 웨딩 영상+스냅 동시 진행 연 100건 · 광주 자체 스튜디오 보유 | 소개: 영상팀과 스냅팀이 한 팀으로 움직여 신랑신부의 동선 부담을 줄입니다. 호남 전 지역 출장이 가능합니다.
- **21 유O나** — 경력: 라이브커머스 대행사 3년 · 브랜드 전속 송출 오퍼레이터 2년 | 소개: 방송 세팅과 송출, 카메라 운용까지 원스톱으로 담당합니다. 월 단위 전속 계약을 선호합니다.
- **22 남O기** — 경력: 항공촬영 프리랜서 10년 · 광고/뮤직비디오 드론 파트 참여 다수 | 소개: 드론과 지상 짐벌 촬영을 하나의 콘티로 설계합니다. 촬영 허가 절차 대행 경험이 많습니다.
- **23 도O연** — 경력: 인물 사진 스튜디오 운영 7년차 · 배우/아나운서 프로필 촬영 다수 | 소개: 용산 호리존 스튜디오에서 인물 중심 촬영을 진행합니다. 프로필 영상과 사진을 한 세션에 촬영할 수 있습니다.
- **24 허O담** — 경력: 예능형 유튜브 채널 촬영 3년 · 행사 스케치 촬영 병행 | 소개: 출연자 리액션을 놓치지 않는 멀티캠 배치가 강점입니다. 소규모 행사 스케치도 함께 진행합니다.
- **25 표O진** — 경력: 골프 전문 채널 촬영 4년 · 레저 콘텐츠 프리랜서 2년 | 소개: 골프 스윙과 코스 공략 촬영에 특화되어 있습니다. 드론 항공샷으로 코스 전경까지 담습니다.
- **26 진O서** — 경력: 패션 필름 프로덕션 6년 · 프리랜서 룩북/화보 촬영감독 2년 | 학력: 패션미디어 전공 졸업 | 소개: 브랜드 무드보드를 영상 톤으로 옮기는 작업에 강합니다. 룩북, 캠페인 필름, 백스테이지 기록까지 다룹니다.
- **27 마O훈** — 경력: 기업 사보/홍보 영상 촬영 9년 · 공공기관 인터뷰 시리즈 다수 수행 | 소개: 임원 인터뷰처럼 격식이 필요한 현장 경험이 많습니다. 촬영 전 질문지 검토와 리허설 진행을 함께합니다.
- **28 구O빈** — 경력: 온라인 클래스 플랫폼 협력 촬영자 2년 · 강의 촬영 100편 이상 | 소개: 강사의 판서와 시연이 잘 보이는 화면 구성을 설계합니다. 간단한 컷 편집까지 함께 납품합니다.
- **29 방O열** — 경력: 건설사 협력 기록 촬영 8년 · 분양 홍보영상 프리랜서 3년 | 소개: 착공부터 준공까지 장기 기록 촬영 경험이 있습니다. 드론 항공샷과 타임랩스 촬영을 함께 제공합니다.
- **30 안O율** — 경력: 웨딩 영상팀 세컨캠 2년 · 행사 촬영 보조 다수 | 소개: 메인 촬영자의 동선에 맞춰 서브 컷을 안정적으로 채웁니다. 주말 일정 위주로 활동합니다.

### 3.3 스토어 상품 (StoreProduct) — 20건

#### 3.3.1 핵심 필드

| id | name | category | sellerName | price(원) | rating | likes | delivery | revisions | 상업적 이용 | image | createdAt |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 반나절 제품 촬영 패키지 | 촬영 서비스 | 스튜디오 딥포커스 | 450000 | 4.8 | 96 | 촬영 후 5일 | 2회 무료 | O | store/shootmon-store-product-01 | 2026-05-18 |
| 2 | 드론 항공 촬영 기본 패키지 | 드론 촬영 | 정O호 | 350000 | 4.9 | 74 | 촬영 후 7일 | 1회 무료 | O | store/shootmon-store-drone-01 | 2026-05-22 |
| 3 | 스튜디오 3시간 대관(조명 포함) | 스튜디오/공간 | 도O연 | 90000 | 4.7 | 58 | 예약 당일 이용 | 해당 없음 | O | store/shootmon-store-studio-01 | 2026-05-25 |
| 4 | 인터뷰 촬영 세팅 패키지(2캠+조명+오디오) | 촬영 패키지 | 강O림 | 550000 | 4.9 | 63 | 촬영 후 7일 | 2회 무료 | O | store/shootmon-store-interview-01 | 2026-06-01 |
| 5 | 조명/오디오 장비 1일 대여 세트 | 조명/오디오 | 스튜디오 딥포커스 | 80000 | 4.6 | 41 | 예약일 수령 | 해당 없음 | O | store/shootmon-store-lighting-01 | 2026-06-03 |
| 6 | 라이브 송출 3캠 패키지 | 촬영 패키지 | 팀 온에어 | 1200000 | 5.0 | 112 | 행사 당일 송출 | 리허설 1회 포함 | O | store/shootmon-store-live-01 | 2026-06-05 |
| 7 | 시네마틱 웨딩 LUT 20종 | 프리셋/LUT | 박O수 | 33000 | 4.5 | 87 | 결제 즉시 다운로드 | 해당 없음 | O | store/shootmon-store-lut-01 | 2026-06-08 |
| 8 | 촬영 표준 계약서+견적서 템플릿 | 계약서/가이드 템플릿 | 김O현 | 30000 | 4.8 | 105 | 결제 즉시 다운로드 | 해당 없음 | X | store/shootmon-store-template-01 | 2026-06-10 |
| 9 | 유튜브 채널 촬영 대행(월 4회) | 촬영 서비스 | 이O진 | 1400000 | 4.7 | 52 | 회차별 촬영 후 3일 | 회차당 1회 무료 | O | store/shootmon-store-package-01 | 2026-06-12 |
| 10 | 미러리스+짐벌 1일 대여 | 장비 대여 | 남O기 | 60000 | 4.4 | 29 | 예약일 수령 | 해당 없음 | O | store/shootmon-store-equipment-01 | 2026-06-14 |
| 11 | 웨딩 본식 영상 기본 상품 | 촬영 서비스 | 팀 프레임워크 | 990000 | 4.9 | 118 | 촬영 후 30일 | 1회 무료 | X | store/shootmon-store-wedding-01 | 2026-06-16 |
| 12 | 제품 누끼 사진 30컷+영상 1편 | 촬영 서비스 | 윤O성 | 380000 | 4.6 | 66 | 촬영 후 5일 | 2회 무료 | O | store/shootmon-store-product-02 | 2026-06-18 |
| 13 | 부동산 매물 촬영+드론 항공샷 | 드론 촬영 | 남O기 | 480000 | 4.7 | 38 | 촬영 후 5일 | 1회 무료 | O | store/shootmon-store-drone-02 | 2026-06-20 |
| 14 | 호리존 스튜디오 반일 대관 | 스튜디오/공간 | 스튜디오 딥포커스 | 250000 | 4.8 | 47 | 예약 당일 이용 | 해당 없음 | O | store/shootmon-store-studio-02 | 2026-06-22 |
| 15 | 시네마 카메라 1일 대여(오퍼레이터 포함) | 장비 대여 | 김O현 | 700000 | 4.9 | 55 | 예약일 현장 진행 | 해당 없음 | O | store/shootmon-store-equipment-02 | 2026-06-24 |
| 16 | 무선마이크 4채널 세트 대여 | 조명/오디오 | 팀 온에어 | 50000 | 4.5 | 23 | 예약일 수령 | 해당 없음 | O | store/shootmon-store-lighting-02 | 2026-06-26 |
| 17 | 숏폼 색보정 LUT 팩 | 프리셋/LUT | 최O아 | 33000 | 4.3 | 71 | 결제 즉시 다운로드 | 해당 없음 | O | store/shootmon-store-lut-02 | 2026-06-28 |
| 18 | 유튜브 썸네일 디자인 10종 | 썸네일/홍보 이미지 | 황O솔 | 150000 | 4.6 | 44 | 주문 후 7일 | 3회 무료 | O | store/shootmon-store-thumbnail-01 | 2026-06-30 |
| 19 | 행사 스케치 촬영 반일 패키지 | 촬영 패키지 | 조O탁 | 400000 | 4.7 | 35 | 촬영 후 7일 | 1회 무료 | O | store/shootmon-store-package-02 | 2026-07-02 |
| 20 | 프롬프터 장비 대여(운영 보조 포함) | 장비 대여 | 오O민 | 120000 | 4.4 | 18 | 예약일 현장 진행 | 해당 없음 | O | store/shootmon-store-equipment-01 | 2026-07-04 |

#### 3.3.2 서비스 범위/작업 과정/환불 규정

- **1** — 범위: 제품 20종 이내, 컷당 3안 촬영과 기본 보정본 제공. | 과정: 제품 수령 → 촬영 구성안 확정 → 촬영/보정 → 납품. | 환불: 촬영 시작 전 100% 환불, 촬영 후에는 보정 미진행분에 한해 부분 환불.
- **2** — 범위: 반나절 비행 기준 항공 영상 원본과 편집용 셀렉본 제공. | 과정: 비행 승인 확인 → 현장 답사 → 촬영 → 셀렉본 전달. | 환불: 기상 악화로 촬영 불가 시 전액 환불 또는 일정 변경.
- **3** — 범위: 호리존 스튜디오 3시간 대관, 기본 조명 2세트 포함. | 과정: 예약 → 이용 안내 → 현장 이용. | 환불: 이용 3일 전 취소 시 전액, 전일 취소 시 50% 환불.
- **4** — 범위: 2캠 인터뷰 촬영, 조명/오디오 세팅, 자막용 스크립트 타임코드 제공. | 과정: 사전 질문지 공유 → 현장 세팅 → 촬영 → 원본/셀렉본 납품. | 환불: 촬영일 7일 전 취소 시 전액, 이후 계약금 제외 환불.
- **5** — 범위: LED 조명 2대, 무선마이크 2채널, 스탠드 일체 1일 대여. | 과정: 예약 → 수령/검수 → 반납 확인. | 환불: 수령 전 취소 시 전액 환불, 수령 후 환불 불가.
- **6** — 범위: 3캠 촬영, 스위칭, 플랫폼 동시 송출, 현장 오디오 믹싱 포함. | 과정: 사전 답사와 회선 점검 → 리허설 → 본 송출 → 녹화본 전달. | 환불: 행사 14일 전 취소 시 전액, 이후 준비 비용 공제 후 환불.
- **7** — 범위: 본식/야외 웨딩 영상용 LUT 20종과 적용 가이드 문서. | 과정: 결제 후 즉시 다운로드. | 환불: 디지털 상품 특성상 다운로드 후 환불 불가, 파일 오류 시 교환.
- **8** — 범위: 촬영 용역 표준 계약서, 견적서, 촬영 동의서 템플릿 일체. | 과정: 결제 후 즉시 다운로드, 사용 가이드 포함. | 환불: 다운로드 후 환불 불가. 상업적 재판매는 금지.
- **9** — 범위: 월 4회 정기 촬영, 회당 3시간, 컷 편집본 1편씩 포함. | 과정: 월간 촬영 일정 확정 → 회차 촬영 → 회차별 납품. | 환불: 미진행 회차에 대해 일할 계산 환불.
- **10** — 범위: 풀프레임 미러리스 바디+표준 줌 렌즈+짐벌 1일 대여. | 과정: 신분 확인 → 수령/검수 → 반납 확인. | 환불: 수령 전 취소 시 전액 환불, 수령 후 환불 불가.
- **11** — 범위: 본식 2캠 촬영, 하이라이트 1편과 풀버전 1편 납품. | 과정: 사전 미팅 → 본식 촬영 → 가편 확인 → 최종 납품. | 환불: 예식 30일 전 취소 시 계약금 제외 환불, 이후 50% 공제.
- **12** — 범위: 단일 제품 기준 누끼 사진 30컷과 15초 영상 1편. | 과정: 제품 수령 → 촬영 → 보정/편집 → 납품. | 환불: 촬영 전 전액 환불, 납품 후 환불 불가.
- **13** — 범위: 매물 내부 영상 촬영과 단지 전경 드론 항공샷 1회. | 과정: 일정 협의 → 비행 가능 여부 확인 → 촬영 → 납품. | 환불: 비행 불가 지역 판정 시 드론 비용 차감 환불.
- **14** — 범위: 호리존 스튜디오 4시간 대관, 조명 세트와 스태프 1인 지원. | 과정: 예약 → 사전 협의 → 현장 이용. | 환불: 이용 7일 전 전액, 3일 전 50% 환불, 이후 환불 불가.
- **15** — 범위: 시네마 카메라 1대와 운용 오퍼레이터 1인 1일 현장 지원. | 과정: 촬영 개요 공유 → 현장 운용 → 원본 인계. | 환불: 촬영일 7일 전 취소 시 전액, 이후 50% 공제.
- **16** — 범위: 무선마이크 4채널 수신기 세트 1일 대여. | 과정: 예약 → 수령/검수 → 반납 확인. | 환불: 수령 전 취소 시 전액 환불, 수령 후 환불 불가.
- **17** — 범위: 숏폼 톤에 맞춘 색보정 LUT 12종과 모바일 적용 가이드. | 과정: 결제 후 즉시 다운로드. | 환불: 디지털 상품 특성상 다운로드 후 환불 불가.
- **18** — 범위: 채널 무드에 맞춘 썸네일 디자인 10종 납품(원본 포함). | 과정: 채널 분석 → 시안 2종 → 확정 후 10종 제작. | 환불: 시안 확정 전 70% 환불, 확정 후 환불 불가.
- **19** — 범위: 행사 반일(4시간) 스케치 촬영과 3분 하이라이트 1편. | 과정: 큐시트 확인 → 현장 촬영 → 하이라이트 편집 → 납품. | 환불: 행사 7일 전 취소 시 전액 환불.
- **20** — 범위: 프롬프터 장비 1식과 운영 보조 인력 반일 지원. | 과정: 원고 수령 → 현장 세팅 → 운영 지원. | 환불: 이용일 3일 전 취소 시 전액 환불, 이후 50% 공제.

### 3.4 커뮤니티 게시글 (CommunityPost) — 40건

board 값: free(자유) 12 / feedback(촬영 피드백) 8 / lab(촬영랩) 6 / contest(공모전) 5 / event(이벤트) 3 / suggest(운영자에게 바란다) 3 / guide(이용안내) 3. 게시판별 첫 글은 운영팀 공지(isNotice=true)다.

| id | board | title | author | createdAt | views | comments | 공지 | excerpt |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | free | [공지] 자유게시판 이용 규칙 안내 | CLIPBee 운영팀 | 2026-05-02 | 3120 | 4 | O | 자유게시판에서 지켜야 할 기본 규칙과 금지 행위를 안내합니다. |
| 2 | free | 첫 단독 촬영 다녀왔습니다 | 비캠지망생 | 2026-06-02 | 842 | 17 | X | 보조만 하다가 처음으로 단독 현장을 다녀온 후기와 배운 점을 공유합니다. |
| 3 | free | 여름철 야외 촬영 장비 관리 어떻게 하세요? | 드론아저씨 | 2026-06-05 | 1105 | 23 | X | 폭염에 배터리와 바디 발열 관리하는 노하우를 묻는 글입니다. |
| 4 | free | 견적서 쓸 때 항목 어디까지 나누시나요 | 렌즈수집가 | 2026-06-09 | 976 | 19 | X | 촬영비, 장비비, 인건비, 출장비 항목 구분 기준에 대한 토론 글입니다. |
| 5 | free | 웨딩 성수기 일정 다들 어떠신가요 | 본식장인 | 2026-06-12 | 654 | 12 | X | 가을 성수기 예약 상황과 세컨캠 구인 이야기를 나누는 글입니다. |
| 6 | free | 짐벌 캘리브레이션 팁 공유 | 무빙샷 | 2026-06-15 | 1230 | 15 | X | 워킹샷 수평이 자꾸 틀어질 때 점검하는 순서를 정리했습니다. |
| 7 | free | 클라이언트가 원본을 다 달라고 할 때 | 인터뷰어K | 2026-06-18 | 1877 | 41 | X | 원본 전체 제공 요구에 어떻게 대응하는지 경험을 나누는 글입니다. |
| 8 | free | 촬영 단가 후려치기, 다들 어디까지 참으세요 | 조명맨 | 2026-06-21 | 2455 | 58 | X | 최근 받은 저단가 제안 사례와 거절 기준에 대한 이야기입니다. |
| 9 | free | 스튜디오 겸 사무실 구하는 분 계신가요 | 호리존 | 2026-06-24 | 512 | 9 | X | 공유 스튜디오 임대 정보와 관리비 수준을 공유하는 글입니다. |
| 10 | free | 현장에서 만난 최악의 날씨 썰 | 야간촬영러 | 2026-06-27 | 933 | 26 | X | 우천 행사 촬영에서 장비를 지켜낸 경험담입니다. |
| 11 | free | 미러리스 세컨바디 뭐 쓰세요? | 화이트밸런스 | 2026-07-01 | 1342 | 33 | X | 메인 바디와 색 매칭이 편한 세컨바디 추천을 묻는 글입니다. |
| 12 | free | 7월 첫째 주 현장 인증 | 컷둘셋 | 2026-07-04 | 421 | 8 | X | 이번 주 다녀온 행사 현장 사진과 짧은 후기를 남깁니다. |
| 13 | feedback | [공지] 피드백 요청 글 작성 가이드 | CLIPBee 운영팀 | 2026-05-04 | 1980 | 2 | O | 영상 링크, 촬영 조건, 원하는 피드백 범위를 함께 적어 주세요. |
| 14 | feedback | 제품 영상 조명 피드백 부탁드립니다 | 누끼장인 | 2026-06-03 | 745 | 14 | X | 화장품 병 반사가 계속 잡히는데 조명 배치 조언을 구합니다. |
| 15 | feedback | 인터뷰 영상 톤 봐주실 분 | 인터뷰어K | 2026-06-08 | 689 | 11 | X | 2캠 인터뷰의 색 매칭과 스킨톤 보정 방향 피드백을 요청합니다. |
| 16 | feedback | 첫 웨딩 하이라이트 편집본 피드백 요청 | 비캠지망생 | 2026-06-14 | 903 | 21 | X | 첫 단독 본식 하이라이트인데 컷 호흡이 어색한지 봐주세요. |
| 17 | feedback | 릴스 세로 구도 이게 맞나요 | 세로영상러 | 2026-06-19 | 1156 | 18 | X | 헤드룸과 자막 영역을 고려한 세로 구도 피드백을 구합니다. |
| 18 | feedback | 드론 시네마틱 무브 피드백 부탁드려요 | 드론아저씨 | 2026-06-23 | 834 | 13 | X | 오비탈 샷 속도감이 밋밋한 것 같아 조언을 구합니다. |
| 19 | feedback | 저조도 공연 촬영 노이즈 잡는 법 | 야간촬영러 | 2026-06-29 | 1421 | 27 | X | ISO를 낮추면 어둡고 올리면 노이즈가 심한데 세팅 조언 부탁드립니다. |
| 20 | feedback | 강의 영상 프레이밍 점검 부탁드립니다 | 판서캠 | 2026-07-03 | 387 | 7 | X | 판서가 잘리는 문제를 해결할 카메라 위치를 고민 중입니다. |
| 21 | lab | [공지] 촬영랩 게시판 소개와 주제 제안 | CLIPBee 운영팀 | 2026-05-06 | 1543 | 3 | O | 촬영 기법, 장비 실험, AI 활용 사례를 다루는 게시판입니다. |
| 22 | lab | AI 프리비주얼로 콘티 만들어 본 후기 | 렌즈수집가 | 2026-06-06 | 1987 | 35 | X | 촬영 전 AI 이미지로 콘티를 만들어 클라이언트 컨펌에 활용한 사례입니다. |
| 23 | lab | 스마트폰 vs 미러리스 숏폼 화질 비교 실험 | 세로영상러 | 2026-06-11 | 2210 | 42 | X | 동일 조건에서 촬영한 결과를 프레임 단위로 비교해 봤습니다. |
| 24 | lab | LUT 적용 전 로그 촬영 세팅 정리 | 필름감성 | 2026-06-17 | 1120 | 16 | X | 로그 프로파일별 노출 오버 정도를 실험한 결과를 공유합니다. |
| 25 | lab | 무선마이크 4종 실외 간섭 테스트 | 붐오퍼 | 2026-06-25 | 876 | 12 | X | 도심 실외에서 무선마이크 간섭 빈도를 비교한 기록입니다. |
| 26 | lab | AI 자동 컷 편집 툴 촬영 워크플로 적용기 | 무빙샷 | 2026-07-02 | 1345 | 24 | X | 멀티캠 소스를 AI 툴로 1차 컷 정리한 뒤 수작업으로 마무리한 흐름입니다. |
| 27 | contest | [공지] 2026 여름 촬영 공모전 접수 안내 | CLIPBee 운영팀 | 2026-06-25 | 4230 | 31 | O | 주제 '여름의 현장', 8월 31일까지 접수. 상금과 심사 기준을 확인하세요. |
| 28 | contest | 공모전 출품작 규격 질문 | 컷둘셋 | 2026-06-27 | 512 | 6 | X | 세로 영상도 출품 가능한지, 러닝타임 제한이 있는지 문의합니다. |
| 29 | contest | 작년 수상작 다시 볼 수 있나요 | 필름감성 | 2026-06-30 | 388 | 4 | X | 지난 공모전 수상작 링크를 찾는 글입니다. |
| 30 | contest | 공모전 준비 스터디 모집 | 로케이션헌터 | 2026-07-02 | 645 | 15 | X | 주말에 함께 촬영 나갈 공모전 준비 팀원을 모집합니다. |
| 31 | contest | 출품 전 색보정 수준 어디까지 허용인가요 | 클로즈업 | 2026-07-04 | 430 | 9 | X | 공모전 규정상 후반작업 허용 범위가 궁금합니다. |
| 32 | event | [공지] 신규 가입 이벤트 안내 | CLIPBee 운영팀 | 2026-05-08 | 3560 | 12 | O | 7월 말까지 가입 후 프로필 등록 시 추천 프로필 1주 노출권을 드립니다. |
| 33 | event | 프로필 등록 이벤트 참여 후기 | 판서캠 | 2026-06-20 | 720 | 8 | X | 이벤트로 받은 추천 노출 기간 동안 문의가 늘었는지 공유합니다. |
| 34 | event | 출석 이벤트 경품 받으신 분? | 삼각대수리공 | 2026-07-01 | 655 | 11 | X | 6월 출석 이벤트 경품 발송 일정이 궁금합니다. |
| 35 | suggest | [공지] 건의 게시판 운영 원칙 | CLIPBee 운영팀 | 2026-05-10 | 1220 | 1 | O | 서비스 개선 건의는 이곳에 남겨 주세요. 순차적으로 답변드립니다. |
| 36 | suggest | 지역 필터에 세종/강원도 세분화 요청 | 로케이션헌터 | 2026-06-16 | 489 | 5 | X | 강원 영동/영서 구분과 세종 지역 추가를 건의합니다. |
| 37 | suggest | 스크랩 폴더 기능이 있으면 좋겠습니다 | 클로즈업 | 2026-06-28 | 534 | 7 | X | 공고 스크랩을 분야별 폴더로 정리하는 기능을 제안합니다. |
| 38 | guide | [공지] CLIPBee 처음 오신 분을 위한 안내 | CLIPBee 운영팀 | 2026-05-02 | 5120 | 6 | O | 회원 유형별 기능, 프로필 등록, 공고 지원 방법을 한눈에 정리했습니다. |
| 39 | guide | 기업 인증 절차와 필요 서류 정리 | CLIPBee 운영팀 | 2026-05-12 | 2870 | 9 | X | 사업자등록증명 기준과 개인 의뢰자 대체 증빙 절차를 안내합니다. |
| 40 | guide | 연락처 열람권/자동점프 사용 방법 | CLIPBee 운영팀 | 2026-05-15 | 2440 | 5 | X | 열람권 결제 후 이용 기간 계산과 자동점프 활성화 방법을 설명합니다. |

### 3.5 공지사항 (Notice) — 10건

| id | title | createdAt | views | isPinned |
| --- | --- | --- | --- | --- |
| 1 | CLIPBee 정식 오픈 안내 | 2026-05-02 | 8420 | O |
| 2 | 기업 인증 서류 제출 가이드 (사업자등록증명 기준) | 2026-05-10 | 4310 | O |
| 3 | 연락처 열람권 이용 정책 안내 | 2026-05-21 | 2980 | X |
| 4 | 자동점프 상품 사용 방법 안내 | 2026-05-28 | 2140 | X |
| 5 | 추천 프로필 노출 기준 및 슬롯 운영 안내 | 2026-06-03 | 1890 | X |
| 6 | 6월 정기 서버 점검 안내 (6/18 02:00~06:00) | 2026-06-15 | 1560 | X |
| 7 | 2026 여름 촬영 공모전 개최 안내 | 2026-06-25 | 3720 | X |
| 8 | 일부 결제 오류 관련 안내 및 조치 완료 | 2026-06-29 | 1230 | X |
| 9 | 커뮤니티 운영 원칙 개정 안내 (7/15 시행) | 2026-07-01 | 980 | X |
| 10 | 7월 서비스 개선 사항 안내 | 2026-07-05 | 640 | X |

### 3.6 기업회원 (CompanyMember) — 10건

| id | companyName | ceoName | bizNumber | verifyStatus | email | joinedAt |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 스튜디오 온빛 | 김도담 | 000-00-00001 | 인증완료 | biz@onbit.example.kr | 2026-05-03 |
| 2 | 크리에이티브랩 무브 | 박서진 | 000-00-00002 | 인증완료 | biz@moovlab.example.kr | 2026-05-05 |
| 3 | 웨딩홀 라비엔느 | 한유리 | 000-00-00003 | 인증완료 | biz@lavienne.example.kr | 2026-05-08 |
| 4 | 라이브온 미디어 | 장다훈 | 000-00-00004 | 인증완료 | biz@liveon.example.kr | 2026-05-12 |
| 5 | 브랜드웍스 한강 | 임규원 | 000-00-00005 | 인증완료 | biz@brandworks.example.kr | 2026-05-20 |
| 6 | 뷰티브릿지 | 윤채린 | 000-00-00006 | 인증완료 | biz@beautybridge.example.kr | 2026-05-27 |
| 7 | 에어샷 픽처스 | 고은채 | 000-00-00007 | 인증완료 | biz@airshot.example.kr | 2026-06-02 |
| 8 | 그로스마켓 | 표진우 | 000-00-00008 | 검수중 | biz@growthmarket.example.kr | 2026-06-10 |
| 9 | 에듀클래스 온 | 최다임 | 000-00-00009 | 검수중 | biz@educlasson.example.kr | 2026-05-30 |
| 10 | 페스타기획 | 도영훈 | 000-00-00010 | 반려 | biz@festaplan.example.kr | 2026-06-20 |

- 검수중 2건(그로스마켓, 에듀클래스 온)은 인증 유효기간 만료 후 재인증 서류를 제출한 상태로, 기존 공고는 마감 처리되어 있다(공고 13, 23).
- 반려 1건(페스타기획)은 사업자등록증명의 대표자명 불일치로 반려된 케이스다. 게시 중 공고(27)와 함께 관리자 심사 화면의 엣지 케이스 테스트용으로 사용한다.

### 3.7 개인회원 (PersonalMember) — 20건

| id | maskedName | nickname | email | joinedAt | hasProfile |
| --- | --- | --- | --- | --- | --- |
| 1 | 김O현 | 렌즈수집가 | user01@sample-mail.example.kr | 2026-05-02 | O |
| 2 | 이O진 | 무빙샷 | user02@sample-mail.example.kr | 2026-05-04 | O |
| 3 | 박O수 | 본식장인 | user03@sample-mail.example.kr | 2026-05-06 | O |
| 4 | 최O아 | 세로영상러 | user04@sample-mail.example.kr | 2026-05-09 | O |
| 5 | 정O호 | 드론아저씨 | user05@sample-mail.example.kr | 2026-05-11 | O |
| 6 | 강O림 | 인터뷰어K | user06@sample-mail.example.kr | 2026-05-14 | O |
| 7 | 윤O성 | 누끼장인 | user07@sample-mail.example.kr | 2026-05-17 | O |
| 8 | 한O별 | 클로즈업 | user08@sample-mail.example.kr | 2026-05-19 | O |
| 9 | 서O우 | 비캠지망생 | user09@sample-mail.example.kr | 2026-05-23 | O |
| 10 | 황O솔 | 릴스메이커 | user10@sample-mail.example.kr | 2026-05-26 | O |
| 11 | 도O연 | 호리존 | user11@sample-mail.example.kr | 2026-05-29 | O |
| 12 | 구O빈 | 판서캠 | user12@sample-mail.example.kr | 2026-06-01 | O |
| 13 | 장O민 | 삼각대수리공 | user13@sample-mail.example.kr | 2026-06-04 | X |
| 14 | 배O은 | 화이트밸런스 | user14@sample-mail.example.kr | 2026-06-07 | X |
| 15 | 송O재 | 야간촬영러 | user15@sample-mail.example.kr | 2026-06-10 | X |
| 16 | 홍O영 | 조명맨 | user16@sample-mail.example.kr | 2026-06-13 | X |
| 17 | 전O규 | 붐오퍼 | user17@sample-mail.example.kr | 2026-06-16 | X |
| 18 | 심O주 | 필름감성 | user18@sample-mail.example.kr | 2026-06-19 | X |
| 19 | 나O혁 | 로케이션헌터 | user19@sample-mail.example.kr | 2026-06-22 | X |
| 20 | 위O선 | 컷둘셋 | user20@sample-mail.example.kr | 2026-06-25 | X |

## 4. 데이터 간 연결 규칙

### 4.1 기업회원 ↔ 촬영자 모집 공고

| CompanyMember | verifyStatus | 연결 공고 id |
| --- | --- | --- |
| 스튜디오 온빛 | 인증완료 | 1 |
| 크리에이티브랩 무브 | 인증완료 | 2 |
| 웨딩홀 라비엔느 | 인증완료 | 4 |
| 라이브온 미디어 | 인증완료 | 8 |
| 브랜드웍스 한강 | 인증완료 | 15 |
| 뷰티브릿지 | 인증완료 | 12 |
| 에어샷 픽처스 | 인증완료 | 9 |
| 그로스마켓 | 검수중 | 23 (마감) |
| 에듀클래스 온 | 검수중 | 13 (마감) |
| 페스타기획 | 반려 | 27 |

기업회원 표에 없는 나머지 공고 회사(픽셀리버 미디어 등 20곳)는 회원 상세 데이터 없이 공고 표시용으로만 사용한다.

### 4.2 촬영자 프로필 ↔ 스토어 판매자

| ShooterProfile (maskedName) | 프로필 id | 판매 상품 id |
| --- | --- | --- |
| 김O현 | 1 | 8, 15 |
| 이O진 | 2 | 9 |
| 박O수 | 3 | 7 |
| 최O아 | 5 | 17 |
| 정O호 | 6 | 2 |
| 강O림 | 7 | 4 |
| 윤O성 | 8 | 12 |
| 팀 온에어 | 9 | 6, 16 |
| 조O탁 | 11 | 19 |
| 스튜디오 딥포커스 | 13 | 1, 5, 14 |
| 오O민 | 15 | 20 |
| 황O솔 | 19 | 18 |
| 팀 프레임워크 | 20 | 11 |
| 남O기 | 22 | 10, 13 |
| 도O연 | 23 | 3 |

### 4.3 개인회원 닉네임 ↔ 커뮤니티 게시글

| nickname | 회원 id | 작성 게시글 id |
| --- | --- | --- |
| 렌즈수집가 | 1 | 4, 22 |
| 무빙샷 | 2 | 6, 26 |
| 본식장인 | 3 | 5 |
| 세로영상러 | 4 | 17, 23 |
| 드론아저씨 | 5 | 3, 18 |
| 인터뷰어K | 6 | 7, 15 |
| 누끼장인 | 7 | 14 |
| 클로즈업 | 8 | 31, 37 |
| 비캠지망생 | 9 | 2, 16 |
| 릴스메이커 | 10 | — (열람 위주 회원) |
| 호리존 | 11 | 9 |
| 판서캠 | 12 | 20, 33 |
| 삼각대수리공 | 13 | 34 |
| 화이트밸런스 | 14 | 11 |
| 야간촬영러 | 15 | 10, 19 |
| 조명맨 | 16 | 8 |
| 붐오퍼 | 17 | 25 |
| 필름감성 | 18 | 24, 29 |
| 로케이션헌터 | 19 | 30, 36 |
| 컷둘셋 | 20 | 12, 28 |

게시판 공지(게시글 1, 13, 21, 27, 32, 35, 38)와 이용안내 글(39, 40)의 작성자 `CLIPBee 운영팀`은 관리자 계정이며 개인회원 표에 포함하지 않는다.

### 4.4 개인회원 ↔ 촬영자 프로필

hasProfile=O인 회원 12명은 프로필 id와 다음과 같이 연결된다: 회원 1→프로필 1, 2→2, 3→3, 4→5, 5→6, 6→7, 7→8, 8→10, 9→12, 10→19, 11→23, 12→28. 팀형 프로필(4, 9, 13, 20)은 팀 대표 계정이 별도로 존재한다고 가정하며 개인회원 표와 연결하지 않는다.

## 5. 분포 검증 요약

| 항목 | 요구 | 실제 |
| --- | --- | --- |
| JobPosting 수 | 30 | 30 |
| JobPosting 분야 커버 | 14종 전부 ≥1 | 14종 전부 (브랜드/유튜브 3건, 나머지 12종 각 2건) |
| JobPosting 프리미엄 | 8 | 8 (id 1, 2, 4, 8, 12, 15, 19, 26) |
| JobPosting 상시채용 | 4 | 4 (id 4, 11, 16, 24) |
| JobPosting 채용시까지 | 4 | 4 (id 2, 8, 10, 22) |
| JobPosting 마감 상태 | 2 | 2 (id 13, 23) |
| JobPosting 지역 분산 | 서울 과반 + 7개 지역 | 서울 19 / 경기 4 / 부산 2 / 인천·대구·대전·광주·제주 각 1 |
| ShooterProfile 수 | 30 | 30 |
| ShooterProfile 분야 커버 | 14종 전부 | 14종 전부 |
| ShooterProfile 추천 | 6 | 6 (id 1, 4, 9, 13, 20, 26) |
| ShooterProfile 팀형 | 4 | 4 (id 4, 9, 13, 20) |
| ShooterProfile 스튜디오 보유 | ≥5 | 5 (id 8, 13, 15, 20, 23) |
| StoreProduct 수 | 20 | 20 |
| StoreProduct 카테고리 커버 | 9종 전부 ≥1 | 9종 전부 (촬영 서비스 4, 장비 대여 3, 촬영 패키지 3, 그 외 6종 각 2/1) |
| StoreProduct 가격대 | 3만~150만원 | 30,000 ~ 1,400,000원 |
| CommunityPost 수/분포 | 40 (12/8/6/5/3/3/3) | 40 (free 12, feedback 8, lab 6, contest 5, event 3, suggest 3, guide 3) |
| CommunityPost 게시판별 공지 | 각 ≥1 | 각 1 (id 1, 13, 21, 27, 32, 35, 38) |
| Notice 수 | 10 (고정 2) | 10 (고정 id 1, 2) |
| CompanyMember | 10 (완료 7/검수 2/반려 1) | 10 (인증완료 7, 검수중 2, 반려 1) |
| PersonalMember | 20 (프로필 보유 12) | 20 (hasProfile=O 12명) |
