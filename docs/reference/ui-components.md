# CLIPBee UI 컴포넌트 명세

작성일: 2026-07-06
기준 문서: `design.md`(색상/타이포), `wireframe.md`(사용 위치), `architecture.md`(2장 컴포넌트 구조)
목적: 디자인 토큰의 미확정분을 확정하고, `components/ui/` 공통 컴포넌트의 변형·상태·크기를 구현 가능한 수준으로 명세한다.

## 1. 디자인 토큰 (gap-analysis D7~D9 해소)

### 1.1 색상

`design.md` 3.1 그대로 Tailwind 토큰으로 등록:
`primary #1276B1` / `primary-dark #0D5E8E` / `accent #DFFE17` / `success #10B981` / `warning #F59E0B` / `danger #EF4444` / `ink #111827` / `muted #6B7280` / `line #E5E7EB` / `surface #FFFFFF` / `page #F8FAFC`

추가 파생 토큰 (배지/알림 배경용 연한 색):

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| primary-soft | `#EDF7FB` | Primary 배지 배경, 선택 칩 배경 |
| accent-soft | `#F7FCD8` | Accent의 연한 보조 배경 |
| success-soft | `#ECFDF5` | 인증완료/상시채용 배지 배경 |
| warning-soft | `#FFFBEB` | 심사중/공지 배지 배경 |
| danger-soft | `#FEF2F2` | 마감/반려 배지 배경 |

배지는 `soft 배경 + 본색 텍스트` 조합을 기본으로 한다. 단, Accent Lime 배지는 `accent 배경 + ink 텍스트`를 사용해 명도 대비를 확보한다.

### 1.2 간격 (spacing 스케일)

4px 기반: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64`
- 카드 내부 패딩: PC 16px, 모바일 12px
- 섹션 간 간격: PC 48px, 모바일 32px
- 폼 필드 간: 16px, 폼 섹션 간: 32px

### 1.3 radius / 그림자 / z-index

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| radius-sm | 4px | 배지, 칩, 인풋 |
| radius-md | 8px | 카드, 버튼, 모달 (**최댓값** — AGENTS.md 규칙) |
| shadow-card | `0 1px 2px rgba(0,0,0,.05)` | 기본 카드 |
| shadow-hover | `0 4px 12px rgba(0,0,0,.08)` | 카드 hover |
| shadow-modal | `0 8px 30px rgba(0,0,0,.15)` | 모달/드로어 |
| z-dropdown 30 / z-sticky 40 / z-drawer 50 / z-modal 60 / z-toast 70 | | 낮→높 순서 고정 |

### 1.4 브레이크포인트와 그리드

| 구간 | 폭 | 컨테이너 | 컬럼 |
| --- | --- | --- | --- |
| Mobile | <768 | 100% − 32px | 1열 기본, 프로필/스토어 2열 (gap 12px) |
| Tablet | 768~1023 | 100% − 48px | 2열 (gap 16px), 사이드바 숨김 |
| Desktop | ≥1024 | 1180px 중앙 | 사이드 220px + 본문, 카드 grid gap 20px |

### 1.5 아이콘 / 폰트

- 아이콘: **lucide-react**, 기본 20px (헤더 24px, 인라인 16px), stroke 1.75
- 폰트: Pretendard Variable (jsdelivr CDN), fallback `Noto Sans KR, system-ui, sans-serif`
- 숫자(가격/통계)는 `font-variant-numeric: tabular-nums`

## 2. 기본 컴포넌트

### 2.1 Button

| 변형 | 배경/테두리 | 텍스트 | 사용처 |
| --- | --- | --- | --- |
| primary | primary, hover: primary-dark | 흰색 | 검색·로그인·지원·결제·등록 |
| secondary | surface + line 테두리, hover: page | ink | 목록·취소·뒤로 |
| outline | 투명 + primary 테두리 | primary | 필터 적용, 보조 행동 |
| danger | danger, hover 진하게 | 흰색 | 신고 접수·삭제 |
| kakao | `#FEE500` | `#191919` + 심볼 | 카카오 로그인 전용 |
| ghost | 투명, hover: page | muted | 아이콘 버튼, 유틸 |

- 크기: `sm` 32px(테이블 내) / `md` PC 40px / `lg` 모바일 44px(터치 최소) / 모바일 하단 고정 바 52px
- 상태: default / hover / active(눌림 시 살짝 어둡게) / **disabled**(opacity .45 + cursor 차단) / **loading**(내부 스피너, 텍스트 유지, 중복 제출 방지)
- 한 줄에 primary는 1개만 (design.md 6.3)

### 2.2 Badge (상태 배지)

`architecture.md` 9장 매핑 준수. 공통: radius-sm, 12px/600, 패딩 2×8px, 1줄 고정.

| 배지 | 스타일 |
| --- | --- |
| 프리미엄 / 추천 | accent-soft + accent |
| 채용시 / 상시채용 / 인증완료 / 활동가능 | success-soft + success |
| 심사중 / 검수중 / 공지 / 만료예정 | warning-soft + warning |
| 마감 / 반려 | danger-soft + danger |
| 경력·지역·장비 등 정보 배지 | page 배경 + muted 텍스트 |
| 신규 (등록 3일 이내) | primary-soft + primary |

카드당 최대 4개, 초과분은 `+n`으로 축약.

### 2.3 Input / Select / Textarea

- 높이: Button과 동일 (PC 40 / 모바일 44), radius-sm, line 테두리
- focus: primary 테두리 + 연한 ring / error: danger 테두리 + 아래 12px 도움말 / disabled: page 배경
- 라벨 위 배치, 필수는 라벨 우측 `*`(danger)
- Select: 네이티브 우선(모바일 UX), PC 커스텀은 2차
- 검색 인풋: 좌측 🔍 아이콘 내장, 클리어 × 버튼

### 2.4 Checkbox / Radio / Toggle

- 체크박스: 필터(분야 14종·장비 13종)에서 다중 선택 — 6개 초과 시 "더보기" 접기
- 라디오: 회원 유형, 마감 유형, 결제 옵션 — 카드형 라디오(선택 시 primary 테두리) 병용
- 토글: 출장 가능/스튜디오 보유(검색), 자동점프 ON/OFF, 연락처 공개 설정 — ON일 때 primary

### 2.5 Chip (필터 칩)

적용된 필터 표시: `분야: 웨딩 ×`. page 배경 + ink, × 클릭 시 해당 쿼리 제거. 목록 상단 가로 스크롤 1줄.

## 3. 복합 컴포넌트

### 3.1 Card 3종

| 종류 | 구조 | 비율 |
| --- | --- | --- |
| JobCard | ■16:9 → 회사명(muted 13px) → 제목(16px/700, PC 2줄·모바일 3줄) → 배지 행 | 16:9 |
| ProfileCard | ■4:3 커버(추천 배지 오버레이) → ◯아바타+이름 → 제목 2줄 → 지역·경력 → 분야/장비 배지 → 단가(볼드) | 4:3 |
| ProductCard | ■4:3 → 제목 2줄 → 판매자 → 가격(볼드 16px) → ★평점·♥좋아요, 우상단 찜 | 4:3 |

공통: surface + line + radius-md + shadow-card, hover 시 shadow-hover(전환 150ms). 마감/만료는 이미지 40% dim + 〈마감〉.

### 3.2 JobRow (PC 공고 목록 행)

컬럼 폭: 회사명 140 | 제목 flex | 분야·장비 배지 200 | 지역 100 | 급여 110 | 경력 90 | 마감 90. 높이 56px, hover 배경 page. 프리미엄은 배지 + 회사명 700.

### 3.3 Tabs

- 라인 탭 (기본): 하단 2px primary 인디케이터 — GNB, 상세검색, 서비스 안내, 통합 검색
- 스크롤 탭 (모바일): 가로 스크롤 + 좌우 페이드, 스토어 카테고리·모바일 상단 탭

### 3.4 Pagination

PC: `◀ 1 … 10 ▶`, 현재 페이지 ink 배경+흰 텍스트, 36px 정사각. 모바일: 1~5 + [다음], 터치 44px. URL `?page=` 동기화.

### 3.5 Modal / BottomSheet

- PC: 중앙 480px(폼형 560px), dim `rgba(0,0,0,.5)`, ESC/외부 클릭 닫기(제출형은 외부 클릭 무시)
- 모바일: 같은 컴포넌트가 바텀시트로 전환 (하단 슬라이드업, 상단 핸들, radius 상단만)
- 종류: 게이트 3종 / 신고 / 제안 보내기 / 확인(삭제·마감 등 2버튼)

### 3.6 Drawer (모바일 메뉴)

좌측 슬라이드, 폭 280px, z-drawer. 아코디언 2단 메뉴(wireframe 1.2). 로그인 영역 상단 고정.

### 3.7 Toast

하단 중앙(모바일)/우하단(PC), 3초 자동 소멸. success/error 2종. 스크랩·신고 접수·복사 등 짧은 피드백 전용 — 페이지 이동이 따르는 완료는 완료 화면 사용.

### 3.8 Table (커뮤니티/마이페이지/관리자 공용)

헤더 page 배경 13px/600 muted, 행 높이 48px, 행 hover page, 모바일에서는 카드 리스트로 전환(열 라벨: 값 세로 나열).

### 3.9 EmptyState / Skeleton

- EmptyState: 중앙 아이콘(48px, line 색) + 문구 1줄 + 행동 버튼 최대 1개
- Skeleton: 카드형(이미지 박스+텍스트 2줄) / 행형 / 상세형. shimmer 애니메이션, 최소 노출 300ms(깜빡임 방지)

### 3.10 Accordion / Stepper

- Accordion: FAQ, 드로어 메뉴, 필터 더보기. chevron 회전 180°
- Stepper: 주문 3단계, 광고 프로세스 4단계. 완료 primary / 현재 ink / 미래 muted

### 3.11 FileUpload

드래그&드롭 + 클릭 선택. 이미지: 미리보기 썸네일 그리드 + 삭제 ×, 대표 지정 라디오. 문서(인증 서류): 파일명 행 + 용량. 제한 표기: 이미지 10MB/장, jpg·png·webp (포트폴리오 용량 정책 미확정 — PRD 27장 → 확정 전 10MB 가정 명시)

### 3.12 ImageGallery / VideoEmbed

- 갤러리: 대표 16:9 + 하단 썸네일 스트립, 클릭 교체, 모바일 스와이프
- VideoEmbed: YouTube/Shorts URL → 썸네일 카드(재생 아이콘) → 클릭 시 iframe 로드(성능), Shorts는 9:16 세로 프레임

### 3.13 ContactLockBox (연락처 잠금 박스)

프로필 상세 전용. 항목 행: 라벨 + 마스킹 값 + [확인하기](outline sm). 상태 3종:
1. 잠김(기본) — 클릭 시 역할별 게이트 모달
2. 열림 — 실제 값 + 복사 버튼, 상단에 "열람권 만료: 2026-08-05" 안내
3. 열람권 만료 임박(3일 이내) — warning 배너 추가

### 3.14 QuickContact (빠른 문의 플로팅)

PC 우측 하단 고정 56px 원형(채팅 아이콘) → 클릭 시 카카오 채널/문의 링크 패널. 모바일은 하단 고정 바와 겹치는 상세 페이지에서 숨김.

### 3.15 RoleSwitcher (데모 전용)

좌하단 반투명 위젯. 역할 5종 셀렉트 + 열람권/점프 크레딧/추천 상태 mock 토글. `NODE_ENV` 무관 항상 표시하되 시연 시 접기 가능. 실서비스 전 제거 대상임을 코드 주석으로 명시.

## 4. 레이아웃 컴포넌트

| 컴포넌트 | 요점 |
| --- | --- |
| Header (PC) | 유틸 바 36px 좌측 CLIPBee 워드마크 + GNB 52px + primary 라인. sticky 아님, 검색만 GNB 우측 |
| MobileHeader | 56px 중앙 CLIPBee 워드마크(sticky) + 검색 44px + 탭 44px. 스크롤 시 탭까지 고정 |
| SideBar | 220px. 로그인 박스(비로그인) 또는 활동 요약(로그인) + 카테고리 아코디언 |
| LoginBox | 사이드/메인 공용. 개인·기업 라디오 + 아이디/비번 + 로그인 + 카카오 + 링크 3개 |
| Footer | PC 2단(링크 행 + 사업자 정보), 모바일 축약 1단 + [PC버전] 버튼 위 배치 |
| StickyActionBar | 모바일 상세 하단 고정 52px: 아이콘 버튼(스크랩) + 주 행동 풀폭 |
| SectionHeader | 섹션 제목(22px/700) + 우측 [더보기 →] 패턴 통일 |

## 5. 접근성 체크 (design.md 12장 구현 기준)

- 모든 인터랙티브 요소: `focus-visible` ring (primary, 2px offset)
- 아이콘 단독 버튼: `aria-label` 필수 (스크랩·찜·검색·햄버거·닫기)
- 배지: 색+텍스트 병행이므로 추가 조치 불요, 단 dim 처리된 마감 카드는 `aria-disabled` 명시
- 모달: focus trap + ESC + `role="dialog"`, 드로어 동일
- 폼 오류: `aria-describedby`로 도움말 연결, 제출 실패 시 첫 오류 필드로 focus 이동
- 이미지: alt 필수 (`image-presets.md`의 alt 규칙 참조), 장식 이미지는 `alt=""`

## 6. 파일 구성 (components/ 매핑)

```
components/ui/        Button, Badge, Input, Select, Checkbox, Radio, Toggle, Chip,
                      Tabs, Pagination, Modal, Drawer, Toast, Table, EmptyState,
                      Skeleton, Accordion, Stepper, FileUpload, Avatar
components/layout/    Header, MobileHeader, SideBar, LoginBox, Footer,
                      StickyActionBar, SectionHeader, QuickContact, RoleSwitcher
components/jobs/      JobCard, JobRow, JobFilterBox, JobDetailSummary
components/profiles/  ProfileCard, ContactLockBox, PortfolioGallery(=ImageGallery+VideoEmbed)
components/store/     ProductCard, ProductInfoCard
components/community/ PostTable, PostCard, CommentList, CommentForm
components/shared/    GateModal(3종), ReportModal, ProposeModal, SearchResultSection
```
