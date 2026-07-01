# 데이터 가이드

더미 데이터와 DB 연결 기준을 정리하는 문서입니다.

## 목적

- 역할별 화면이 같은 데이터 기준을 사용하게 합니다.
- 더미 데이터와 실제 DB 구조가 크게 달라지지 않게 합니다.
- AI가 화면마다 임의의 데이터 구조를 만들지 않게 합니다.
- 채용 플랫폼 잔재 용어가 제품 데이터 이름으로 섞이지 않게 합니다.

## 기본값

### 핵심 전제

- 현재 선택된 유저의 `role`을 기준으로 화면을 분기합니다.
- 데이터는 역할별 화면에서 필요한 정보만 필터링해서 보여줍니다.
- 이 제품의 역할 구조는 크리에이터 수요자, 외주 파트너, 운영자입니다.

### 역할 기준

역할 값은 아래를 기본으로 합니다.

- `creator`: 제휴 수익을 키우려는 SNS 크리에이터, 수요자
- `partner`: 편집, 썸네일, 기획, 대본, 리서치 등을 수행하는 외주 파트너
- `admin`: 파트너 풀, 추천 품질, 정산 상태를 관리하는 운영자

`candidate`, `recruiter`, `interviewer`는 채용 플랫폼 잔재 역할 값으로 사용하지 않습니다.

역할 이름을 바꾸거나 새 역할을 추가하려면 먼저 팀 논의가 필요합니다.

### 데이터 작성 기준

- 필드명은 영어 `camelCase`를 사용합니다.
- 각 데이터에는 가능하면 `id`, `createdAt`, `updatedAt`을 포함합니다.
- 날짜는 문자열 또는 Firebase Timestamp 중 하나로 통일합니다.
- 상태값은 자유 텍스트가 아니라 정해진 값만 사용합니다.
- 화면별로 같은 의미의 필드를 다른 이름으로 만들지 않습니다.

### 공통 이름 사전 운영

- DB를 처음부터 완성하지 않고, 공통으로 부를 이름만 먼저 맞춥니다.
- 새 컬렉션, 필드, 상태값, 역할 값이 필요하면 구현 전에 이 문서에 먼저 추가합니다.
- 기존 이름과 의미가 같으면 새 이름을 만들지 않습니다.
- 기능별 임시 더미 데이터는 최소로 만들고, 공통 이름은 이 문서의 사전을 따릅니다.
- 아직 확정되지 않은 이름은 초안으로 표시하고, 실제 구현이 반복되면 최종 결정에 반영합니다.

### 더미 데이터

- 더미 데이터는 기능 검증에 필요한 최소만 만듭니다.
- MVP 데모에서는 추천 결과가 비지 않도록 시드 파트너 데이터를 먼저 둡니다.
- 화면만 맞추기 위한 임시 필드는 나중에 제거 여부를 표시합니다.
- Firebase 연결 전에도 더미 데이터만으로 역할별 화면을 확인할 수 있어야 합니다.

### DB 연결 기준

- DB 구조가 정해지기 전에는 화면 컴포넌트와 데이터 접근 코드를 분리합니다.
- Firebase 연결 코드는 한 곳에서 관리합니다.
- 화면 컴포넌트는 가능한 한 데이터 형태에만 의존하게 만듭니다.

## 논의할 항목

- 제품명 확정
- 문서와 코드에서 사용할 임시 코드네임 확정 여부
- 문서 id 생성 방식
- 날짜 저장 방식을 문자열로 할지 Firebase Timestamp로 할지
- 실제 Firebase 구조와 더미 데이터 구조를 언제 맞출지
- 파트너 후보 수급 방식과 약관, 법무 검토 기준
- 실제 결제, 수동 정산, 외부 PG 연동 범위

## 공통 이름 사전

아래 이름은 기능 개발 중 같은 의미를 다르게 부르지 않기 위한 출발점입니다. 실제 DB 구조 확정은 별도 논의로 진행합니다.

### 컬렉션 이름

- `users`: 유저
- `creatorProfiles`: 크리에이터 프로필
- `partnerProfiles`: 외주 파트너 프로필
- `scopeRequests`: 요청서
- `partnerRecommendations`: 파트너 추천 결과
- `matches`: 매칭
- `quotes`: 견적
- `settlements`: 정산 기록
- `partnerLeads`: 온보딩 전 파트너 후보

### 공통 필드 이름

- `id`: 문서 또는 항목 식별자
- `userId`: 유저 식별자
- `creatorId`: 크리에이터 식별자
- `partnerId`: 외주 파트너 식별자
- `adminId`: 운영자 식별자
- `scopeRequestId`: 요청서 식별자
- `recommendationId`: 추천 결과 식별자
- `matchId`: 매칭 식별자
- `quoteId`: 견적 식별자
- `settlementId`: 정산 기록 식별자
- `status`: 상태값
- `title`: 제목
- `description`: 설명
- `source`: 생성 또는 판단 근거
- `createdAt`: 생성 시각
- `updatedAt`: 수정 시각

### 요청서 필드 이름

- `taskType`: 맡길 업무 유형
- `affiliateGoal`: 제휴 목표
- `offerName`: 제휴 상품 또는 제안 이름
- `offerUrl`: 제휴 상품 또는 랜딩 URL
- `targetAudience`: 타깃 시청자
- `contentFormat`: 콘텐츠 형식
- `referenceContentUrl`: 참고 콘텐츠 URL
- `budgetMin`: 최소 예산
- `budgetMax`: 최대 예산
- `dueDate`: 희망 납기
- `conversionPath`: 전환 동선
- `conversionAction`: 사용자가 최종으로 하길 원하는 행동
- `ctaText`: CTA 문구
- `linkPlacement`: 링크 배치 위치
- `deliverables`: 산출물
- `revisionLimit`: 수정 횟수 기준
- `acceptanceCriteria`: 완료 기준

### 파트너 프로필 필드 이름

- `displayName`: 표시 이름
- `specialties`: 전문 분야
- `portfolioUrls`: 포트폴리오 URL 목록
- `affiliateExperience`: 제휴 전환 작업 경험
- `shortFormExperience`: 숏폼 작업 경험
- `averagePrice`: 평균 견적
- `availableFrom`: 작업 가능 시작일
- `responseTimeHours`: 평균 응답 시간
- `rating`: 평점
- `reviewCount`: 후기 수
- `verified`: 검증 여부

### 추천/매칭 필드 이름

- `recommendedPartnerIds`: 추천 파트너 목록
- `recommendationReason`: 추천 이유
- `fitScore`: 요청서 적합도 점수
- `fallbackReason`: 추천 부족 또는 실패 이유
- `selectedPartnerId`: 선택한 파트너
- `matchedAt`: 매칭 성사 시각

### 견적/정산 필드 이름

- `quotedAmount`: 견적 금액
- `finalAmount`: 최종 금액
- `commissionRate`: 수수료율
- `commissionAmount`: 수수료 금액
- `paymentMethod`: 결제 또는 정산 방식
- `settlementDueDate`: 정산 예정일
- `settledAt`: 정산 완료 시각

### 역할 값

- `creator`: 크리에이터 수요자
- `partner`: 외주 파트너
- `admin`: 운영자

### 상태값 초안

- `draft`: 초안
- `submitted`: 제출됨
- `recommended`: 추천 완료
- `noPartnerAvailable`: 추천 가능한 파트너 없음
- `selected`: 선택됨
- `quotePending`: 견적 대기
- `quoteReceived`: 견적 수신
- `matched`: 매칭 성사
- `inProgress`: 진행 중
- `reviewPending`: 검수 대기
- `completed`: 완료
- `cancelled`: 취소됨
- `settlementPending`: 정산 대기
- `settled`: 정산 완료
- `rejected`: 거절됨

### 파트너 후보 수급 출처 값

- `manual`: 팀이 직접 영입 또는 등록
- `referral`: 지인, 커뮤니티, 소개 기반
- `publicResearch`: 공개 정보 기반 후보 조사
- `seedDummy`: MVP 데모용 더미 데이터

자동 크롤링으로 후보를 수집하는 방식은 약관, 개인정보, 저작권 검토 전에는 구현하지 않습니다.

## 데이터 모델 초안

아래는 논의 출발점입니다. 실제 서비스 기획에 맞게 수정합니다.

### users

- `id`
- `name`
- `role`
- `createdAt`
- `updatedAt`

### creatorProfiles

- `id`
- `userId`
- `channelUrl`
- `mainPlatform`
- `targetAudience`
- `affiliateCategory`
- `createdAt`
- `updatedAt`

### partnerProfiles

- `id`
- `userId`
- `displayName`
- `specialties`
- `portfolioUrls`
- `affiliateExperience`
- `shortFormExperience`
- `averagePrice`
- `availableFrom`
- `verified`
- `createdAt`
- `updatedAt`

### scopeRequests

- `id`
- `creatorId`
- `taskType`
- `affiliateGoal`
- `offerName`
- `offerUrl`
- `targetAudience`
- `contentFormat`
- `budgetMin`
- `budgetMax`
- `dueDate`
- `conversionPath`
- `conversionAction`
- `ctaText`
- `linkPlacement`
- `deliverables`
- `revisionLimit`
- `acceptanceCriteria`
- `status`
- `createdAt`
- `updatedAt`

### partnerRecommendations

- `id`
- `scopeRequestId`
- `recommendedPartnerIds`
- `recommendationReason`
- `fitScore`
- `fallbackReason`
- `status`
- `createdAt`
- `updatedAt`

### matches

- `id`
- `scopeRequestId`
- `creatorId`
- `partnerId`
- `quoteId`
- `status`
- `matchedAt`
- `createdAt`
- `updatedAt`

### quotes

- `id`
- `scopeRequestId`
- `partnerId`
- `quotedAmount`
- `finalAmount`
- `status`
- `createdAt`
- `updatedAt`

### settlements

- `id`
- `matchId`
- `creatorId`
- `partnerId`
- `finalAmount`
- `commissionRate`
- `commissionAmount`
- `paymentMethod`
- `status`
- `settlementDueDate`
- `settledAt`
- `createdAt`
- `updatedAt`

### partnerLeads

- `id`
- `displayName`
- `source`
- `sourceUrl`
- `specialties`
- `status`
- `createdAt`
- `updatedAt`

## 최종 결정

- 주요 컬렉션: `users`, `creatorProfiles`, `partnerProfiles`, `scopeRequests`, `partnerRecommendations`, `matches`, `quotes`, `settlements`, `partnerLeads`
- 역할 기준: `creator`, `partner`, `admin`
- 채용 플랫폼 잔재 역할 값: `candidate`, `recruiter`, `interviewer`는 사용하지 않음
- 필드명 규칙: 영어 `camelCase`
- 날짜 저장 방식: 문자열 또는 Firebase Timestamp 중 하나로 통일
- 상태값 기준: 자유 텍스트가 아니라 정해진 값만 사용
- 더미 데이터 기준: 기능 검증에 필요한 최소만 작성하되, MVP 데모에서는 시드 파트너 데이터를 둠
- DB 연결 기준: 화면 컴포넌트와 데이터 접근 코드를 분리하고 Firebase 연결 코드는 한 곳에서 관리
- 공통 이름 사전 기준: 새 컬렉션, 필드, 상태값, 역할 값은 구현 전에 이 문서에 먼저 추가
- 자동 크롤링 기준: 약관, 개인정보, 저작권 검토 전에는 구현하지 않음

## 변경 이력

- 2026-05-29: SPA와 역할 기반 데이터 기준 반영
- 2026-05-29: 기본 데이터 기준을 최종 결정에 반영
- 2026-05-29: 공통 이름 사전과 데이터 이름 추가 절차 반영
- 2026-05-29: 일정 조율, 면접 질문 생성, 평가 과업에 필요한 공통 이름 보강
- 2026-06-30: 채용 플랫폼 잔재 역할 값을 제거하고 크리에이터 외주 매칭 제품 기준의 역할, 컬렉션, 요청서, 파트너, 견적, 정산 데이터 초안으로 재정리
