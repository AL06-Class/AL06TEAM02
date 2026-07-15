# 데이터 가이드

역할, 데이터 이름, 상태값, 샘플 데이터 기준을 정리하는 문서입니다. 이 문서는 **공통 이름 사전**입니다 — 새 이름은 코드보다 먼저 여기에 추가합니다.

## 목적

- 4명이 각자 다른 AI로 작업해도 같은 데이터 이름을 쓰게 합니다.
- AI가 화면마다 임의의 데이터 구조를 만들지 않게 합니다.
- 같은 의미의 필드가 두 이름으로 생기지 않게 합니다 (예: `isPremium`이 있는데 `premium` 추가 금지).

## 기본값

### 핵심 전제

- 백엔드/DB 없음. 원천 데이터는 `data/*.ts`(읽기), 사용자 활동은 localStorage(쓰기)입니다.
- 화면은 `lib/auth-context.tsx`의 `role` 값으로 분기합니다.
- 타입의 진실의 원천은 `lib/types.ts`이며, 이 문서와 항상 일치해야 합니다. 어긋나면 문서를 먼저 고칩니다.

### 역할 값 (변경 금지 — 팀 합의 필요)

- `guest`: 비회원
- `personal`: 개인회원 (촬영자)
- `company-unverified`: 기업회원 · 미인증
- `company-verified`: 기업회원 · 인증완료
- `admin`: 관리자

### 데이터 작성 기준

- 필드명은 영어 `camelCase`.
- 각 엔티티에 `id`, 날짜 필드(`createdAt` 또는 `updatedAt`)를 포함합니다.
- 날짜는 `YYYY-MM-DD` 문자열로 통일합니다.
- 상태값은 자유 텍스트가 아니라 아래 사전의 값만 사용합니다.

### 샘플 데이터

- `data/` 7개 파일, 총 160건: jobs 30 / profiles 30 / products 20 / posts 40 / notices 10 / members 30.
- 새 샘플은 가상 창작만 허용 — 편집몬 원문, 실존 기업/인물, 실제 사업자번호 금지.
- 상세 스키마 정의와 데이터 간 연결 규칙은 `docs/reference/sample-data.md` 참조 (이 문서는 이름 사전, 그쪽은 상세 명세).

## 공통 이름 사전

### 엔티티 (lib/types.ts)

- `JobPosting`: 촬영자·편집자 모집 공통 공고 (`data/jobs.ts`, `data/editor-jobs.ts`)
- `ShooterProfile`: 촬영자 프로필 (`data/profiles.ts`)
- `EditorProfile`: 편집자 프로필 (`data/editor-profiles.ts`), `ShooterProfile`과 동일한 목록 구조를 재사용
- `StoreProduct`: 스토어 상품 (`data/products.ts`)
- `CommunityPost`: 커뮤니티 게시글 (`data/posts.ts`)
- `Notice`: 공지사항 (`data/notices.ts`)
- `CompanyMember` / `PersonalMember`: 회원 (`data/members.ts`)

### 핵심 필드 (전체 필드는 lib/types.ts)

- `category`: 기본 모집 분야 (촬영 분야 14종 또는 편집 분야 8종 중 1개)
- `equipment`: 작업 조건 배열 (촬영 장비/스킬 13종 또는 편집 가능 툴 10종)
- `editingTools`: 촬영자 모집에서 추가로 선택하는 편집 가능 툴 배열 (편집 가능 툴 10종)
- `shootingCategories`: 편집자 모집에서 추가로 선택하는 촬영 분야 배열 (촬영 분야 14종)
- `isPremium`: 프리미엄 공고 여부
- `isRecommended`: 추천(유료) 프로필 여부
- `careerLevel`: 경력 조건 / `careerYears`: 경력 연차
- `payType` + `payAmount`: 급여 (건당/일당/월급/협의)
- `desiredPay`: 프로필 희망 단가
- `deadlineType` + `deadline`: 마감 (마감일/상시채용/채용시까지)
- `maskedName`: 마스킹 이름 (예: 김O민)
- `travelAvailable`: 출장 가능 / `hasStudio`: 스튜디오 보유
- 편집자 프로필의 `categories`: 편집자 모집과 동일한 편집 분야 8종 / `equipment`: 동일한 편집 가능 툴 10종 / `travelAvailable`: 원격 작업 가능
- 촬영자 모집의 `editingTools`와 편집자 모집의 `shootingCategories`는 교차 역량 검색용 선택 배열이며, 기존 `category`·`equipment`와 구분한다.

### 상태값

- 공고 `status`: `게시중` `마감` + 등록 플로우의 `심사중` `반려`
- 프로필 현재상태: `활동가능` `일정협의` `프로젝트중`
- 기업 인증 `verifyStatus`: `미인증` `검수중` `인증완료` `반려`
- 신고: `접수` `검토중` `조치완료` `반려`
- 결제: `결제완료` `사용중` `만료` `환불요청` `환불완료`

### localStorage 키

- 프리픽스 `shootmon:` 통일 (예: `shootmon:scraps`, `shootmon:applications`)
- 새 키가 필요하면 이 문서에 먼저 추가하고, 기존 헬퍼(lib의 storage 유틸)를 통해서만 접근합니다.

### 정책 상수 (lib/policy.ts)

- 열람권 1일 = 24시간, 자동점프 주기 24시간, 업로드 10MB, 인증 반려 사유 4종 — 하드코딩 금지, 상수만 사용.

## 논의할 항목

- 실제 DB 전환 시점과 구조 (Firebase/Supabase 등)
- 날짜를 Timestamp로 바꿀 시점
- 미확정 정책 값 확정 (열람권 시간 기준, 점프 중복 제한 등)

## 최종 결정

- 역할 5종 고정, 변경은 팀 합의 필요 (2026-07-06)
- 필드명 camelCase, 날짜 문자열, 상태값 사전 준수 (2026-07-07)
- 새 이름은 구현 전 이 문서에 먼저 추가 (2026-07-07)
- localStorage 키는 `shootmon:` 프리픽스 + 헬퍼 경유 (2026-07-07)
- 편집자 프로필은 촬영자 프로필 목록 구조를 재사용하고 별도 샘플 데이터로 관리 (2026-07-14)
- 편집자 모집은 `JobPosting` 공통 구조를 재사용하고 `category`와 `equipment`에 편집 분야·편집 툴 값을 사용 (2026-07-14)
- 편집자 프로필과 편집자 모집은 편집 분야 8종과 편집 가능 툴 10종 사전을 공유 (2026-07-14)

## 변경 이력

- 2026-07-07: 최초 작성 — sample-data.md에서 이름 사전 역할 분리, team2 data-guide 형식 준용
- 2026-07-14: 편집자 프로필 엔티티와 필드 의미 추가
- 2026-07-14: 편집자 모집 데이터와 편집 분야·편집 툴 이름 기준 추가
- 2026-07-14: 편집자 프로필의 분야·툴 값을 편집자 모집 사전과 통일
- 2026-07-15: 촬영자 모집의 편집 가능 툴과 편집자 모집의 촬영 분야를 교차 선택 배열로 추가
