# 촬영몬 (Shootmon)

촬영 의뢰자와 촬영자/촬영팀을 연결하는 구인구직 플랫폼 데모.
Next.js(App Router) + TypeScript + Tailwind, **백엔드 없이 샘플 데이터 + localStorage**로 전 기능을 시연한다.

## 팀원 온보딩 (Mac · Windows 공통)

Docker를 쓰면 OS 상관없이 동일하게 동작한다. **개발만 할 사람은 1~2단계까지만 하면 된다.**

### 1. 준비 (처음 한 번)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 설치 후 실행
- 레포 클론 → `develop` 브랜치 체크아웃

### 2. 개발 서버 (firebase 로그인 불필요)
```bash
docker compose up          # http://localhost:5173
docker compose down        # 종료
```
- 코드를 고치면 자동 반영(HMR). Mac/Windows 완전 동일.
- **좌하단 주황 원형 버튼 = 데모 역할 스위처** (아래 참고)

### 3. 배포 (Firebase Hosting에 올릴 사람만)
배포 대상: **https://al06team2.web.app**

전제: 본인 Google 계정이 `al06team2` Firebase 프로젝트에 **멤버로 초대**되어 있어야 한다(팀장이 [콘솔](https://console.firebase.google.com/project/al06team2/settings/iam)에서 초대).

```bash
# (1) firebase 로그인 — 처음 한 번만. 브라우저 인증이라 자동화 불가.
docker compose exec web npx firebase login --no-localhost
#     → 출력된 URL을 브라우저로 열어 로그인 → 인증 코드를 터미널에 붙여넣기
#     로그인은 컨테이너에 유지됨(docker compose down 해도 보존)

# (2) 배포 — 이후로는 이 한 줄
docker compose exec web npm run deploy
#     Mac:     sh scripts/deploy.sh
#     Windows: powershell scripts/deploy.ps1   (또는 위 명령 그대로)
```

> 개발용 로컬 서버가 필요 없이 npm만 쓰고 싶으면: `npm install && npm run dev`(→ localhost:3000).

## 시연 포인트

- **좌하단 주황 원형 버튼 = 데모 역할 스위처**: 비회원 / 개인 / 기업(미인증) / 기업(인증) / 관리자를 즉시 전환. 열람권·자동점프 크레딧 mock 토글 포함
- 역할별 시연 포인트:
  - 기업(인증) + 열람권 ON → 프로필 상세에서 연락처 열림 + 제안 보내기
  - 관리자 → `/admin` 진입 가능 (다른 역할은 404), 공고/인증 승인·반려가 사용자 화면에 즉시 반영
  - 공고 등록(`/jobs/new`) → 심사중 → 관리자 승인 → 목록 노출까지 전 플로우 동작

## 협업 규칙 (요약)

전체 규칙은 **[AGENTS.md](AGENTS.md)** — 작업 전 반드시 읽는 유일한 필수 문서.

- 브랜치 3단 구조: `이름/작업명` → `develop`(통합 테스트) → `main`(안정판)
- 작업 PR은 **develop**으로. main은 develop 승격 PR로만 갱신 (팀장 전담, 주 1회 이상)
- 커밋: `feat:` `fix:` `docs:` 컨벤션
- PR: 1기능 1PR, UI 변경 시 스크린샷(PC 1280/모바일 390) 필수, 사용한 AI 에이전트 표기
- **공유 파일**(`components/ui`, `lib/types.ts`, `data/*` 등) 수정은 팀 채널 사전 공지
- 새 데이터 필드/라우트/토큰은 코드보다 **문서 먼저 수정** (아래 표의 기준 문서)
- 각자 다른 AI 에이전트 사용 OK — Codex/Cursor는 AGENTS.md 자동 인식, Claude Code는 CLAUDE.md가 연결, Gemini는 GEMINI.md에 `@AGENTS.md` 추가

## 문서 안내 — 전부 읽지 마세요

모든 작업에서 아래 문서를 전부 읽는 것이 아니라, 먼저 작업 성격을 판단한 뒤 필요한 문서만 추가로 확인합니다.

| 등급 | 문서 | 언제 보나 |
| --- | --- | --- |
| **필수** | [AGENTS.md](AGENTS.md) | AI가 작업 중 반드시 지킬 실행 규칙 (문서 라우팅 포함) |
| **기준** | [docs/project-rules.md](docs/project-rules.md) | 협업, 브랜치, PR, 승인, 병합 기준 |
| **기준** | [docs/data-guide.md](docs/data-guide.md) | 역할, 데이터 이름, 상태값 기준 — 새 이름은 여기 먼저 추가 |
| **기준** | [docs/design-system.md](docs/design-system.md) | 모든 화면이 따라야 할 최소 디자인 기준 |
| **기준** | [docs/deploy-guide.md](docs/deploy-guide.md) | 실행, 검증, 터널 공유, 배포 기준 |
| 참조 | [docs/architecture.md](docs/architecture.md) | 라우트/권한/플로우 추가·변경 시 — 코드보다 먼저 수정 |
| 참조 | [docs/PRD.MD](docs/PRD.MD) | 기능 요구가 애매할 때 (최우선 기준) |
| 참조 | [docs/reference/sample-data.md](docs/reference/sample-data.md) | 샘플 데이터 상세 명세 (사전은 data-guide) |
| 참조 | [docs/reference/ui-components.md](docs/reference/ui-components.md) · [docs/reference/design.md](docs/reference/design.md) | 컴포넌트/토큰 상세 명세 |
| 참조 | [docs/reference/wireframe.md](docs/reference/wireframe.md) · [docs/reference/mypage-design.md](docs/reference/mypage-design.md) · [docs/reference/admin-design.md](docs/reference/admin-design.md) | 2차 화면 구현 시 |
| 참조 | [docs/reference/image-presets.md](docs/reference/image-presets.md) | 이미지 생성 담당자만 (72장 프롬프트/경로/alt 완비) |
| 보관 | docs/archive/ | 구현 완료로 은퇴한 문서 (handoff, 기획 지침) |

규칙: **코드를 바꿔서 문서와 어긋나면, 그 PR에서 문서도 같이 고친다.**

## 남은 백로그 (분담 제안)

| # | 작업 | 참조 문서 |
| --- | --- | --- |
| 1 | 이미지 72장 생성 → `public/images/presets/`에 배치 (넣으면 자동 표시됨) | image-presets.md |
| 2 | 스토어 2차: 주문/결제/리뷰/찜 고도화 | PRD 11장, admin-design 3.5 |
| 3 | 관리자 2차: 회원/결제·가격/배너 슬롯/카테고리 관리 | admin-design 4장 |
| 4 | Kakao Map 실연동, 알림 고도화, Vercel 배포 | architecture 1장 |
| 5 | 모바일 1px 가로 오버플로 미세 수정, 접근성 점검 | ui-components 5장 |

## 폴더 구조

```
app/            라우트 (57개 화면)
components/     ui(공용 킷) · layout · shared · 도메인별
data/           샘플 데이터 160건 (jobs/profiles/products/posts/notices/members/pricing)
lib/            types · auth-context(역할 스위처) · policy(정책 상수) · filters · format
docs/           설계 문서 (위 표 참조)
public/images/  이미지 프리셋 (현재 플레이스홀더 SVG)
output/         검증 스크린샷
```
