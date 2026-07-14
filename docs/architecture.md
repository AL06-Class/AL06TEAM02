# 촬영몬 아키텍처

작성일: 2026-07-06
기준 문서: `PRD.MD`, `design.md`, `AGENTS.md`, `gap-analysis.md`
목적: 전체 서비스 구조, 라우팅, 권한, 데이터 흐름, 핵심 UX 플로우를 확정해 구현 기준을 만든다.

## 0. 확정된 결정

| 항목 | 결정 | 근거 |
| --- | --- | --- |
| 기술 스택 | Next.js(App Router) + TypeScript + Tailwind CSS | 사용자 확정 (2026-07-06) |
| 데이터 | 백엔드 없이 `data/*.ts` 샘플 데이터 기반, 클라이언트 필터링 | 사용자 확정 |
| 스토어 1차 범위 | 목록 + 상세 + 등록까지. 주문/결제/리뷰/찜 고도화는 2차 | 사용자 확정 |
| 모바일 전략 | 별도 `/m/` URL 없이 반응형 단일 코드베이스. "PC버전" 버튼은 뷰 강제 전환 | gap-analysis C2 해소 |
| 로그인 | 실제 인증 없음. 역할 전환 데모 스위처로 시뮬레이션 | 샘플 데이터 기반 결정의 귀결 |

## 1. 기술 스택 상세

- **Next.js 14+ App Router**: 파일 기반 라우팅, 페이지별 metadata(SEO/OG 태그 — PRD 19장 충족)
- **TypeScript**: `lib/types.ts`에 엔티티 타입 정의 (`sample-data.md` 스키마와 동일)
- **Tailwind CSS**: `tailwind.config`에 design.md 3장 색상 토큰 등록 (`primary: #1276B1` 등)
- **폰트**: Pretendard variable — CDN(jsdelivr) 링크, 대체 `Noto Sans KR, system-ui, sans-serif`
- **아이콘**: lucide-react (선 기반, design.md 14장 아이콘 목록 전부 커버)
- **상태**: 전역 상태 라이브러리 없음. 역할/뷰모드는 React Context + localStorage, 필터는 URL searchParams
- **이미지**: `next/image` + `public/images/presets/` 정적 파일 (AGENTS.md 8장 경로 규칙)
- **지도**: 1차는 정적 지도 이미지 플레이스홀더 + 주소 텍스트. Kakao Map SDK 연동은 2차

## 2. 프로젝트 구조

```
app/                  # 라우트 (아래 3장 라우팅 맵)
components/
  layout/             # Header, MobileHeader, Footer, Drawer, QuickContact
  ui/                 # Button, Badge, Card, Input, Select, Pagination, Tabs, Modal, Skeleton, EmptyState
  jobs/  profiles/  store/  community/  mypage/  admin/   # 도메인 컴포넌트
data/                 # jobs.ts, profiles.ts, products.ts, posts.ts, notices.ts, members.ts, pricing.ts
lib/
  types.ts            # 엔티티 타입
  auth-context.tsx    # 역할 시뮬레이션 (7장)
  filters.ts          # 목록 필터/정렬/페이지네이션 공통 로직
  format.ts           # 날짜/가격/마스킹 포맷터
public/images/presets/  # hero/ jobs/ profiles/ store/ community/ placeholders/ banners/
docs/                 # 설계 문서 (기존 .md는 루트 유지)
```

## 3. 라우팅 맵

### 3.1 공개 페이지

| 경로 | 화면 | 쿼리 파라미터 |
| --- | --- | --- |
| `/` | 메인 | — |
| `/jobs` | 촬영자 모집 목록 | `category, region, subway, career, equipment, sort, page, q` |
| `/jobs/[id]` | 모집 상세 | — |
| `/jobs/categories/[type]` | 모바일 카테고리 (`field`\|`region`\|`subway`) | — |
| `/jobs/search` | 모바일 상세검색 폼 | — |
| `/profiles` | 촬영자 프로필 목록 | `category, region, equipment, career, pay, gender, sort, page, q` |
| `/profiles/[id]` | 프로필 상세 | — |
| `/profiles/search` | 모바일 프로필 상세검색 | — |
| `/community` | 커뮤니티 홈 (이번주 베스트 + 게시판별 최신) | — |
| `/community/[board]` | 게시판 목록 (`free\|feedback\|lab\|contest\|event\|suggest\|guide`) | `page, q` |
| `/community/[board]/[id]` | 게시글 상세 | — |
| `/notice` | 공지사항 목록 | `page` |
| `/notice/[id]` | 공지 상세 | — |
| `/store` | 스토어 목록 | `category, sort, page, q` |
| `/store/[id]` | 상품 상세 | — |
| `/services` | 서비스 안내 | `tab=company\|personal` |
| `/search` | 통합 검색 결과 (공고/프로필/커뮤니티/스토어 탭) | `q, tab` |
| `/company/[id]` | 기업 정보보기 | — |
| `/support` | 고객센터 (FAQ + 1:1 문의 폼) | — |
| `/ads` | 광고배너 안내 | — |
| `/about`, `/terms`, `/privacy` | 회사소개/약관/개인정보처리방침 | — |
| `/login`, `/signup`, `/signup/personal`, `/signup/company`, `/account/find` | 인증 | `redirect` |

### 3.2 로그인 필요 페이지

| 경로 | 화면 | 요구 역할 |
| --- | --- | --- |
| `/jobs/new` | 공고 등록 | 기업(인증완료) |
| `/jobs/[id]/apply` | 온라인 지원 | 개인 |
| `/profiles/new` | 프로필 등록 | 개인 |
| `/store/new` | 상품 등록 | 개인 또는 기업 |
| `/community/write` | 글쓰기 | 개인 또는 기업 (`?board=` 프리셀렉트) |
| `/services/order/[productKey]` | 유료상품 주문/모의결제 (`banner\|jump\|contact-pass\|promotion`) | 상품별 상이 |
| `/alerts` | 알림함 | 로그인 회원 |

### 3.3 마이페이지 (역할별 렌더링, 공통 프리픽스 `/mypage`)

| 경로 | 개인회원 | 기업회원 |
| --- | --- | --- |
| `/mypage` | 요약 대시보드 | 요약 대시보드 |
| `/mypage/profile` | 내 촬영자 프로필 관리 | — |
| `/mypage/portfolio` | 포트폴리오 관리 | — |
| `/mypage/applications` | 지원한 공고 | — |
| `/mypage/scraps` | 스크랩 공고 | 스크랩 프로필 |
| `/mypage/products` | 내 스토어 상품 | 내 스토어 상품 |
| `/mypage/promotion` | 추천 프로필 결제/노출 현황 | — |
| `/mypage/company` | — | 기업정보 관리 |
| `/mypage/verification` | — | 기업 인증 (서류 업로드/상태) |
| `/mypage/jobs` | — | 내 공고 관리 (등록/수정/마감) |
| `/mypage/applicants` | — | 지원자 관리 (`?jobId=`) |
| `/mypage/contact-pass` | — | 연락처 열람권 (잔여기간/열람 로그) |
| `/mypage/jump` | — | 자동점프 (크레딧/활성화/수동점프) |
| `/mypage/banners` | — | 프리미엄 배너 (소재/기간/상태) |
| `/mypage/payments` | 결제 내역 | 결제 내역 |
| `/mypage/account` | 회원정보 수정/탈퇴 | 회원정보 수정/탈퇴 |

### 3.4 관리자 (`/admin`)

| 경로 | 화면 |
| --- | --- |
| `/admin` | 대시보드 (오늘 심사 대기, 신고, 매출 요약, 최근 가입) |
| `/admin/members` | 회원 관리 (개인/기업 탭) |
| `/admin/verifications` | 기업 인증 심사 |
| `/admin/jobs` | 공고 심사/관리 |
| `/admin/profiles` | 프로필 검수 |
| `/admin/portfolios` | 포트폴리오 링크 검수 |
| `/admin/boards` | 게시판/댓글 관리 |
| `/admin/reports` | 신고 처리 |
| `/admin/store` | 스토어 상품 검수 |
| `/admin/payments` | 결제/환불, 상품 가격 관리 |
| `/admin/banners` | 배너/추천 슬롯 관리 |
| `/admin/categories` | 카테고리/지역/역세권 관리 |
| `/admin/notices` | 공지사항 작성 |

### 3.5 URL 규칙

- 목록 필터/정렬/페이지는 전부 searchParams로 유지 → 뒤로가기·공유·새로고침에서 상태 보존 (PRD 19장)
- 상세 페이지는 `generateMetadata`로 title/description/OG 이미지 출력
- 존재하지 않는 id는 `not-found` 렌더링

## 4. 권한 매트릭스

| 액션 | 비회원 | 개인 | 기업(미인증) | 기업(인증) | 관리자 |
| --- | :-: | :-: | :-: | :-: | :-: |
| 목록/상세 공개 정보 열람 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 프로필 연락처 열람 | ❌ | ❌ | ❌ | 열람권 보유 시 ✅ | ✅ |
| 공고 온라인 지원 | ❌ | ✅ | ❌ | ❌ | — |
| 공고 등록 | ❌ | ❌ | ❌ | ✅(심사 후 게시) | ✅ |
| 프로필 등록 | ❌ | ✅(검수 후 노출) | ❌ | ❌ | — |
| 스크랩 | ❌ | 공고 | 프로필 | 프로필 | — |
| 커뮤니티 글/댓글 | ❌ | ✅ | ✅ | ✅ | ✅ |
| 스토어 상품 등록 | ❌ | ✅(검수 후 공개) | ✅ | ✅ | ✅ |
| 촬영자에게 제안 | ❌ | ❌ | ❌ | 열람권 보유 시 ✅ | — |
| 유료상품 구매 | ❌ | 추천 프로필 | ❌(인증 유도) | 배너/점프/열람권 | — |
| 관리자 화면 | ❌ | ❌ | ❌ | ❌ | ✅ |

## 5. 게이트 맵 (비회원/권한 부족 시 동작)

| 트리거 지점 | 비회원 | 권한 부족 회원 |
| --- | --- | --- |
| 프로필 상세 "연락처 확인하기" | 로그인 유도 모달 → `/login?redirect=` | 기업(열람권 없음): 열람권 구매 유도 모달 → `/services/order/contact-pass`. 개인: "기업회원 전용" 안내 |
| 모집 상세 "온라인 지원" | 로그인 유도 모달 | 기업: "개인회원 전용" 안내 |
| 스크랩 버튼 | 로그인 유도 모달 | — |
| 글쓰기/댓글 | 로그인 유도 모달 | — |
| `/jobs/new` 진입 | `/login?redirect=/jobs/new` | 개인: 안내 후 메인. 기업(미인증): 인증 유도 화면 → `/mypage/verification` |
| `/profiles/new` 진입 | `/login?redirect=` | 기업: "개인회원 전용" 안내 |
| `/store/new` 진입 | `/login?redirect=` | — |
| `/mypage`, `/alerts` | `/login?redirect=` | — |
| `/admin` | 404 처리 (존재 은닉) | 404 처리 |
| 유료상품 "신청하기" | 로그인 유도 모달 | 기업(미인증): 인증 유도 |

공통 규칙: 로그인 유도는 **모달 우선**(현재 페이지 유지), 페이지 단위 진입 차단은 **리다이렉트**. 로그인 성공 시 `redirect` 파라미터로 복귀.

## 6. 핵심 UX 플로우

### F1. 기업회원: 가입 → 공고 게시

```
/signup → /signup/company (폼 제출)
→ 가입 완료 (상태: 미인증)
→ /mypage/verification 서류 업로드 (사업자등록증명 3개월 이내 / 개인 의뢰자는 통장 사본)
→ 상태: 검수중 → [관리자 승인] → 인증완료   (반려 시: 반려 사유 표시 + 재제출)
→ /jobs/new 공고 작성 (섹션: design.md 9.1) → 제출
→ 공고 상태: 심사중 → [관리자 승인] → 게시중  (반려 시: 사유 + 수정 후 재제출)
→ /mypage/applicants 에서 지원자 확인
```

### F2. 개인회원: 가입 → 프로필 노출 → 지원

```
/signup → /signup/personal → 가입 완료
→ /profiles/new 프로필 작성 (검수중 → 공개)
→ /jobs 탐색 → /jobs/[id] → "온라인 지원" → /jobs/[id]/apply
   (등록된 프로필 선택 + 지원 내용 + 첨부 → 제출)
→ /mypage/applications 에 저장, 기업 측 /mypage/applicants 에 노출
```

### F3. 연락처 열람권

```
기업(인증) 로그인 → /profiles/[id] "확인하기" 클릭
→ 열람권 없음: 구매 유도 모달 (상품 3종: 1일 6,900 / 1주 27,000 / 3개월 169,000)
→ /services/order/contact-pass → 모의결제 완료 → 즉시 발급
→ 프로필 상세에서 연락처 항목 열림 + "제안 보내기" 활성화
→ 열람 로그 기록(마이페이지 표시), 만료 3일 전 알림, 만료 시 재잠금
```

### F4. 자동점프

```
기업(인증) → /services → 자동점프 상품 (10건 16,500 / 30건 33,000 / 100건 66,000)
→ 모의결제 → 크레딧 충전 (⚠ 결제만으로 활성화되지 않음 — PRD 12.1)
→ /mypage/jump 에서 대상 공고 선택 + 자동점프 ON
→ 24시간 주기 점프 1회당 크레딧 1건 차감, 수동점프 버튼 병행 제공
→ 크레딧 소진 시 알림 + 자동 OFF
```

### F5. 추천 프로필 (개인)

```
개인 → /services?tab=personal → 추천 프로필 (25,000원/1개월)
→ 모의결제 → 즉시 노출 (메인 추천 영역 + 프로필 목록 상단, 추천 배지)
→ /mypage/promotion 에서 남은 기간 확인, 만료 시 일반 프로필로 자동 전환
```

### F6. 프리미엄 배너 (광고 집행)

```
기업 → /ads 또는 /services → 프리미엄 배너 (1개월 69,000 / 3개월 155,000 / 1년 550,000)
→ 신청 폼 + 소재 업로드 → 모의결제 → 상태: 검수중
→ [관리자 승인] → 집행 (메인 상단 노출, 기간/클릭 URL 설정)
→ /mypage/banners 에서 소재/기간/상태 관리
```

### F7. 신고

```
공고/프로필/게시글/상품 상세 "신고하기" → 신고 모달 (사유 선택 + 내용)
→ 접수 → /admin/reports 에서 검토중 → 조치완료/반려
→ 신고자에게 알림으로 결과 통지
```

### F8. 제안 (기업 → 촬영자)

```
기업(열람권 보유) → 프로필 상세 "제안 보내기" → 제안 작성 모달 (공고 선택 + 메시지)
→ 개인회원 /alerts 수신 + 이메일(정책상) → 수락 시 지원 플로우 연결
```

## 7. 인증 시뮬레이션 (데모용)

- `lib/auth-context.tsx`: `role` = `guest | personal | company-unverified | company-verified | admin`
- 화면 우하단 **데모 역할 스위처** 플로팅 위젯 (개발/시연용, 5개 역할 즉시 전환)
- localStorage 저장으로 새로고침 유지
- 열람권/크레딧/추천 상태도 같은 컨텍스트에서 mock 플래그로 관리 (예: `hasContactPass: true`)
- 게이트(5장)와 마이페이지 렌더링은 전부 이 컨텍스트를 조회

## 8. 데이터 흐름

- 원천: `data/*.ts` (스키마와 샘플은 `sample-data.md` 기준)
- 목록 페이지: searchParams → `lib/filters.ts`에서 필터·정렬·페이지 슬라이스 → 렌더
- 쓰기 동작(지원/스크랩/등록/결제)은 **낙관적 UI + localStorage** 저장 (데모 세션 내 일관성 유지)
- 관리자 승인/반려도 localStorage 상태 변경으로 시연 가능하게 처리
- 정렬 기본값: 공고 `등록일순`, 프로필 `수정일순`, 스토어 `등록일순`, 커뮤니티 `최신순`
- 페이지 크기: PC 공고 20행 / 프로필 12카드(3열×4) / 스토어 16카드(4열×4), 모바일 10

## 9. 상태값 → UI 배지 매핑 (PRD 17장 기준)

| 상태 | 배지 색 (design.md 토큰) | 노출 위치 |
| --- | --- | --- |
| 프리미엄 | Accent `#DBF15F` + Ink 텍스트 | 공고 카드/행 |
| 추천 | Accent | 프로필 카드 |
| 채용시까지 | Success `#10B981` | 공고 |
| 상시채용 | Success | 공고 |
| 마감 | Danger `#EF4444` + 카드 dim | 공고 |
| 경력무관 | Muted `#6B7280` | 공고 |
| 심사중/검수중 | Warning `#F59E0B` | 마이페이지/관리자 |
| 인증완료 | Success | 기업 정보/관리자 |
| 반려 | Danger | 마이페이지/관리자 |
| 공지 | Warning | 커뮤니티/공지 |
| 신규(등록 3일 이내) | Primary `#1276B1` | 공고/프로필 |

## 10. 불일치 해소 결정 (gap-analysis C항목)

| # | 결정 |
| --- | --- |
| C1 | 모바일 메인 순서: 검색 → 모집 → 추천 프로필 → **공지사항** → 커뮤니티/공모전/피드백/촬영랩 → 푸터 (PRD 5.2 우선) |
| C2·C3 | 스토어는 PC/모바일 모두 1차에 목록+상세+**등록** 포함 (사용자 확정). 주문/결제/리뷰/찜은 2차 |
| C4 | 프로필 카드에 분야 배지(최대 2) + 장비 배지(최대 2) + 추천 배지 포함 |
| C5 | PC 공고 목록 행에 지역·급여 컬럼 추가 (회사명/제목/분야·장비/지역/급여/경력/마감) |
| C6 | 모바일 상세검색에 "출장 가능", "스튜디오 보유" 토글 추가 |
| C7 | 게시판 8종 전부 구현. 모바일 드로어에는 자유/피드백/공모전/운영자에게 바란다 4종 노출(원본 답습), 나머지는 커뮤니티 홈에서 접근 |
| C8 | 역세권 필터는 모바일 모집 카테고리에만 제공(원본 구조 유지). PC는 지역 필터로 커버 — 의도된 차이로 확정 |
| C9 | 관리자용 기본 이미지 프리셋 추가 (`image-presets.md`에서 정의) |
| C10·C11 | `image-presets.md`에서 프리셋별 12필드 + 배너 슬롯 규격(메인 프리미엄 배너 PC 940×230 / 모바일 720×180) 정의 |
| C12 | PC 메인 로그인 박스는 배너 우측 사이드 배치 (원본 답습, 와이어프레임에 반영) |

## 11. 구현 순서 (화면 단위)

1차 (AGENTS.md 6장 + 스토어 범위 확장 반영):

1. 레이아웃 공통 (헤더 PC/모바일, 푸터, 드로어, 빠른 문의)
2. 메인 PC/모바일
3. 촬영자 모집 목록/상세 + 모바일 카테고리/상세검색
4. 촬영자 프로필 목록/상세 + 연락처 잠금
5. 로그인/회원가입(개인/기업) + 역할 스위처
6. 서비스 안내 + 유료상품 주문(모의결제)
7. 마이페이지 개인/기업 (인증, 공고 관리, 지원자, 열람권, 점프)
8. 공고 등록/프로필 등록/온라인 지원 폼
9. **스토어 목록/상세/등록**
10. 커뮤니티/공지사항
11. 관리자 심사 화면
12. 통합 검색, 고객센터, 광고 안내, 정책 페이지

2차: 스토어 주문/결제/리뷰, 커뮤니티 고도화(베스트 알고리즘), 광고 성과 통계, 촬영몬핏, Kakao Map 실연동, 채팅/제안 고도화

## 12. 후속 문서와의 관계

- `sample-data.md`: 8장 데이터 흐름의 원천 스키마/데이터 (병행 작성 중)
- `wireframe.md`: 3장 라우팅 맵의 모든 화면 + 10장 결정 반영
- `ui-components.md`: 2장 `components/ui/` 목록의 명세 + 토큰 확정
- `mypage-design.md` / `admin-design.md`: 3.3, 3.4 라우트의 화면 상세
- `image-presets.md`: C9~C11 해소
- `handoff.md`: 11장 구현 순서의 체크리스트화
