# 디자인 시스템

모든 화면이 따라야 할 최소 디자인 기준입니다. 상세 명세는 `docs/reference/ui-components.md`(컴포넌트/토큰)와 `docs/reference/design.md`(배경 원칙)에 있고, **실제 컴포넌트 코드(`components/ui`, `components/layout`)가 1차 참조**입니다.

## 목적

- 화면마다 다른 디자인 톤이 생기지 않게 합니다.
- AI가 새 색상, 새 간격, 새 버튼 스타일을 임의로 만들지 않게 합니다.

## 기본값

### 토큰 (tailwind.config.ts에 등록됨 — 임의 추가 금지)

- 색상: `primary #1276B1` / `primary-dark #0D5E8E` / `accent #DFFE17` / `success` / `warning` / `danger` / `ink` / `muted` / `line` / `surface` / `page` + soft 5종
- Primary는 주요 액션용 블루, Accent는 추천·프리미엄 강조 배경용 라임으로 사용합니다. Accent 위 텍스트는 가독성을 위해 `ink`를 사용합니다.
- radius: sm 4px / md 8px (**최댓값 8px** — 더 둥글게 금지)
- 그림자: card / hover / modal 3단계만
- 새 토큰이 필요하면 `docs/reference/ui-components.md` 1장 수정 PR을 먼저 냅니다.

### 컴포넌트 재사용

- 새 UI가 필요하면 먼저 `components/ui`(20종)와 `components/layout`(11종)에서 찾습니다.
- 있으면 재사용, 변형이 필요하면 variant 추가, 정말 없을 때만 신규 생성 후 `components/ui`에 배치합니다.
- 배지 색은 `architecture.md` 9장 상태 매핑을 따릅니다 (프리미엄/추천=accent, 심사중=warning, 마감/반려=danger 등).

### 레이아웃 최소 기준

- PC 본문 최대폭 1180px, 모바일 좌우 패딩 16px.
- 반응형: <768 모바일 / 768~1023 태블릿 / ≥1024 PC. 상세 페이지는 모바일에서 하단 고정 액션 바.
- 버튼 높이: PC 40px / 모바일 44px (터치 최소). 한 줄에 primary 버튼은 1개만.
- 카드 안에 카드 중첩 금지, 카드 전체 배경색 강조 금지 (프리미엄도 배지로만 구분).
- 제목 줄임: 공고 카드 PC 2줄·모바일 3줄, 프로필 카드 2줄.

### 이미지

- 이미지는 `SmartImage` 컴포넌트로만 표시합니다 (누락 시 플레이스홀더 자동 폴백).
- 새 이미지는 `docs/reference/image-presets.md` 프리셋 기준으로 생성, 이미지 안에 글자/로고 금지.

### 접근성 최소 기준

- 아이콘 단독 버튼에 `aria-label` 필수.
- 색상만으로 상태를 구분하지 않습니다 (배지 = soft 배경 + 텍스트).
- 모달에 focus trap과 ESC 닫기 유지.

## 논의할 항목

- 다크 모드 지원 여부
- 태블릿 전용 레이아웃 고도화 여부

## 최종 결정

- 토큰 임의 추가 금지, 변경은 문서 수정 PR 선행 (2026-07-06)
- 이미지는 SmartImage 경유 (2026-07-07)
- radius 최댓값 8px, 카드 중첩 금지 (2026-07-06)
- 브랜드 색상은 Primary Blue `#1276B1` + Accent Lime `#DFFE17` 조합 사용 (2026-07-15)
- 공통 헤더 로고는 `public/images/brand/clipbee-logo.png`의 CLIPBee 워드마크 사용 (2026-07-15)
- 브라우저 파비콘은 `app/icon.png`의 CLIPBee 캐릭터 원본 사용 (2026-07-16)

## 변경 이력

- 2026-07-07: 최초 작성 — ui-components.md/design.md의 최소 기준 요약본, team2 design-system 형식 준용
- 2026-07-14: 메인 컬러를 오렌지에서 블루·라임 조합으로 변경하고 접근성 대비 규칙 추가
- 2026-07-15: Accent Lime을 `#DFFE17`로 변경하고 PC·모바일 헤더에 CLIPBee 로고 적용
- 2026-07-16: CLIPBee 캐릭터 이미지를 브라우저 파비콘으로 적용
