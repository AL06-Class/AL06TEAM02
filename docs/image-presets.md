# 촬영몬 이미지 프리셋 상세 기획

이 문서는 촬영몬 서비스에 필요한 모든 이미지 프리셋의 제작 기준이다.
이미지 제작자(생성 AI 사용자 포함)가 이 문서만 보고 바로 생성·저장·적용할 수 있도록 작성한다.

근거 문서: `AGENTS.md` 8·9·10·11장, `CLAUDE.md` 9장, `architecture.md`(프리미엄 배너 규격), `design.md` 13장.

---

## 1. 공통 규칙 요약

### 1.1 콘텐츠 규칙 (AGENTS.md 8장)

- 원본 편집몬 이미지·로고·배너·아이콘을 절대 사용하지 않는다.
- 이미지 안에 글자, 로고, 워터마크를 넣지 않는다. 상품명·가격·안내 문구는 전부 UI 텍스트로 처리한다.
- 촬영 현장, 장비, 조명, 카메라, 인물 실루엣, 스튜디오, 결과물 느낌을 중심으로 만든다.
- 사람 얼굴은 특정 실존 인물처럼 보이지 않게 한다. 뒷모습/측면/손/실루엣 위주로 구성한다.
- 너무 어둡거나 흐린 이미지를 피한다. 밝은 상업 촬영장 톤을 기본으로 한다.
- 카드 썸네일은 모바일에서 좌우가 잘려도 핵심 피사체가 중앙에 남아야 한다(중앙 안전영역 60%).

### 1.2 파일 규칙

- 포맷: **WebP 우선**, 생성/호환 문제 시 PNG 대체. 확장자만 바꾸고 파일명 규칙은 동일하게 유지한다.
- 모든 이미지는 사용하는 `<img>`에 **alt 텍스트를 반드시 지정**한다. alt는 본 문서의 프리셋별 alt를 그대로 쓴다.
- 장식용으로만 쓰는 경우(배경 데코 등)에는 `alt=""` 처리를 허용하되, 콘텐츠 이미지에는 금지.

### 1.3 품질 통과 기준 (AGENTS.md 11장)

통과:

- 피사체가 선명하다.
- 촬영 분야가 즉시 구분된다.
- 모바일 크롭에서도 핵심이 남는다.
- 텍스트/로고/워터마크가 없다.
- 손가락·장비 형태가 심하게 깨지지 않는다.
- 같은 카테고리 이미지들이 서로 너무 똑같지 않다.

불합격:

- 의미 없는 추상 배경, 과한 보라/파랑 그라데이션.
- 어두운 분위기만 있는 이미지.
- stock photo 느낌의 악수/회의 장면.
- 촬영 장비가 전혀 보이지 않는 이미지.
- 한글/영문 글자가 깨져 들어간 이미지.

### 1.4 프롬프트 공통 방향

모든 사진형 프리셋의 생성 프롬프트에 아래 요소가 반영되어 있다. 그대로 복사해 쓰면 된다.

- realistic commercial video production / Korean production studio
- camera rig, softbox lighting, professional filming crew
- clean composition, warm orange accent (Primary `#F97316` 계열 포인트)
- no text, no logo, no watermark
- 얼굴 비노출: seen from behind / side profile / silhouette, no identifiable faces

플레이스홀더·아바타·관리자용은 사진이 아니라 **플랫 일러스트/아이콘형**으로 만든다(3.5, 3.8, 3.9절 참조).

---

## 2. 저장 경로 트리와 파일명 규칙

### 2.1 경로 트리

```
public/images/presets/
├── hero/            # 메인 히어로 (PC/모바일)
├── banners/         # 프리미엄 배너 슬롯 (PC/모바일)
├── jobs/            # 촬영자 모집 카드 (14 카테고리 x 2장)
├── profiles/        # 촬영자 프로필 커버 (9종)
│   └── avatars/     # 프로필 아바타 (5종)
├── store/           # 스토어 상품 썸네일 (10종)
├── community/       # 커뮤니티/공지 썸네일 (6종)
├── placeholders/    # 플레이스홀더 (7종)
└── admin/           # 관리자용 기본 이미지 (3종) ※ AGENTS.md 8장 경로에 신규 추가
```

`profiles/avatars/`와 `admin/`은 이 문서에서 신규로 확정한 경로다. 그 외는 AGENTS.md 8장 그대로다.

### 2.2 파일명 규칙

- 패턴: `shootmon-{그룹}-{항목슬러그}-{2자리 순번}.webp`
- 소문자, 하이픈만 사용. 언더스코어·한글·공백 금지.
- 순번은 `01`부터. 같은 항목의 변형 이미지는 순번만 증가시킨다.

| 그룹 | 접두 예시 |
| --- | --- |
| 히어로 | `shootmon-hero-desktop-01.webp` |
| 배너 | `shootmon-banner-premium-desktop-01.webp` |
| 모집 카드 | `shootmon-job-brand-01.webp` |
| 프로필 커버 | `shootmon-profile-wedding-01.webp` |
| 아바타 | `shootmon-avatar-team-01.webp` |
| 스토어 | `shootmon-store-drone-01.webp` |
| 커뮤니티 | `shootmon-community-notice-01.webp` |
| 플레이스홀더 | `shootmon-placeholder-camera-01.webp` |
| 관리자 | `shootmon-admin-empty-01.webp` |

---

## 3. 프리셋 상세

모든 항목은 12필드(이름/용도/권장 크기/비율/피사체/배경/색감/금지 요소/생성 프롬프트/alt 텍스트/저장 경로/샘플 파일명)를 기재한다.

## 3.1 메인 히어로 (2종)

### 3.1.1 메인 히어로 PC

- **이름**: 메인 히어로 PC
- **용도**: PC 메인 상단 대형 배너 배경. 좌측에 카피, 우측에 로그인 박스가 얹히므로 중앙~좌측은 여백 여유가 필요.
- **권장 크기**: 1440×360
- **비율**: 4:1 (초와이드)
- **피사체**: 상업 촬영 현장 전경. 시네마 카메라 리그, 소프트박스 조명 2~3개, 뒷모습의 촬영 스태프 2~3명.
- **배경**: 밝은 한국 상업 촬영 스튜디오. 흰색/밝은 회색 호리존, 조명 스탠드와 케이블이 정돈된 모습.
- **색감**: 밝고 따뜻한 화이트 톤 베이스에 오렌지(#F97316 계열) 포인트 조명. 과한 채도 금지.
- **금지 요소**: 텍스트, 로고, 워터마크, 식별 가능한 얼굴, 어두운 무드, 보라/파랑 그라데이션, 과장된 렌즈 플레어.
- **생성 프롬프트**:
  `Ultra-wide 4:1 panoramic photograph of a bright commercial video production set in a modern Korean production studio, cinema camera on a rig in the foreground, two or three crew members seen only from behind adjusting softbox lighting, white cyclorama background, tidy light stands and cables, warm orange accent lighting, clean composition with open space on the left third for UI overlay, bright realistic commercial photography, photorealistic, high detail, no text, no logo, no watermark, no identifiable faces.`
- **alt 텍스트**: 조명과 카메라 리그가 설치된 밝은 상업 촬영 스튜디오 현장
- **저장 경로**: `public/images/presets/hero/`
- **샘플 파일명**: `shootmon-hero-desktop-01.webp`

### 3.1.2 메인 히어로 모바일

- **이름**: 메인 히어로 모바일
- **용도**: 모바일 메인 상단 배너 배경. 좌우 크롭이 일어나므로 핵심 피사체를 중앙에 배치.
- **권장 크기**: 780×360
- **비율**: 약 2.17:1
- **피사체**: 중앙에 시네마 카메라와 촬영자 1명(뒷모습). 좌우는 조명 스탠드로 마무리.
- **배경**: 밝은 스튜디오. 배경 요소는 단순하게, 중앙 피사체와 분리되게.
- **색감**: PC 히어로와 동일 톤(밝은 화이트 + 오렌지 포인트)으로 세트감 유지.
- **금지 요소**: 텍스트, 로고, 워터마크, 식별 가능한 얼굴, 가장자리에 걸친 핵심 피사체, 어두운 무드.
- **생성 프롬프트**:
  `Horizontal photograph of a single camera operator seen from behind standing at a cinema camera rig in the exact center of the frame, bright modern Korean production studio, softbox lights on both sides framing the subject, white cyclorama background, warm orange accent lighting, subject fully contained in the central 60 percent of the frame so side cropping is safe, clean composition, bright realistic commercial photography, photorealistic, no text, no logo, no watermark, no identifiable faces.`
- **alt 텍스트**: 스튜디오 중앙에서 시네마 카메라를 조작하는 촬영자의 뒷모습
- **저장 경로**: `public/images/presets/hero/`
- **샘플 파일명**: `shootmon-hero-mobile-01.webp`

## 3.2 프리미엄 배너 슬롯 (2종)

`architecture.md` 확정 규격. 메인 상단 프리미엄 배너(유료 광고) 슬롯의 **기본 소재/대체 소재**로 쓴다. 광고주 소재가 없을 때와 관리자 미리보기 기본값에 사용한다.

### 3.2.1 프리미엄 배너 PC

- **이름**: 프리미엄 배너 기본 소재 PC
- **용도**: PC 메인 프리미엄 배너 슬롯(940×230)의 기본/대체 배경. 광고 카피는 UI 텍스트로 얹는다.
- **권장 크기**: 940×230
- **비율**: 약 4.09:1 (초와이드)
- **피사체**: 촬영 장비 라인업(시네마 카메라, 짐벌, 드론, 조명)을 옆으로 나열한 정물 구도.
- **배경**: 밝은 무채색 스튜디오 배경. 좌측 1/3은 텍스트 오버레이용 여백.
- **색감**: 밝은 회색/화이트 베이스, 장비 포인트에 오렌지 액센트 라이팅.
- **금지 요소**: 텍스트, 로고, 워터마크, 인물 얼굴, 특정 브랜드 로고가 보이는 장비, 과한 그라데이션.
- **생성 프롬프트**:
  `Ultra-wide banner photograph of professional filming equipment arranged in a clean row on a studio table, cinema camera, gimbal, compact drone and small LED light panel, bright neutral gray studio background, soft commercial lighting with a warm orange accent glow, generic unbranded equipment, empty negative space on the left third for UI text overlay, clean minimal composition, photorealistic product photography, no text, no logo, no watermark, no people.`
- **alt 텍스트**: 카메라와 짐벌, 드론 등 촬영 장비가 나열된 프리미엄 배너 이미지
- **저장 경로**: `public/images/presets/banners/`
- **샘플 파일명**: `shootmon-banner-premium-desktop-01.webp`

### 3.2.2 프리미엄 배너 모바일

- **이름**: 프리미엄 배너 기본 소재 모바일
- **용도**: 모바일 메인 프리미엄 배너 슬롯(720×180)의 기본/대체 배경.
- **권장 크기**: 720×180
- **비율**: 4:1
- **피사체**: 시네마 카메라 1대 중심의 단순 정물. 모바일에서 작게 보여도 형태가 읽히게 요소 수 최소화.
- **배경**: 밝은 무채색 배경, 우측에 옅은 오렌지 조명 번짐.
- **색감**: 밝은 회색/화이트 + 오렌지 포인트. PC 배너와 세트 톤.
- **금지 요소**: 텍스트, 로고, 워터마크, 인물, 3개 이상의 복잡한 소품, 어두운 배경.
- **생성 프롬프트**:
  `Ultra-wide 4:1 banner photograph of a single unbranded cinema camera placed slightly right of center on a clean studio surface, bright neutral background with a soft warm orange light glow behind the camera, generous empty space on the left for UI text overlay, minimal clean composition, photorealistic commercial product photography, no text, no logo, no watermark, no people.`
- **alt 텍스트**: 밝은 배경 위에 놓인 시네마 카메라 프리미엄 배너 이미지
- **저장 경로**: `public/images/presets/banners/`
- **샘플 파일명**: `shootmon-banner-premium-mobile-01.webp`

## 3.3 촬영자 모집 카드 (14 카테고리 × 각 2장 = 28장)

공통: 권장 크기 640×360, 비율 16:9, 저장 경로 `public/images/presets/jobs/`.
각 카테고리는 파일 2장(`-01`, `-02`)을 만들며, 프롬프트는 카테고리당 1개로 통합하고 변형 지시(variation 01/02)를 포함한다.
공통 금지 요소(전 카테고리 동일 적용): 텍스트, 로고, 워터마크, 식별 가능한 얼굴, 어두운 무드, 촬영 장비가 안 보이는 구도, 깨진 손가락/장비.

### 3.3.1 브랜드/광고 촬영

- **이름**: 모집 카드 — 브랜드/광고 촬영
- **용도**: 촬영자 모집 목록/메인의 브랜드·광고 촬영 공고 카드 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 시네마 카메라 리그와 디렉터스 모니터, 뒷모습의 촬영 스태프.
- **배경**: 대형 상업 광고 촬영 세트. 흰 호리존과 대형 소프트박스.
- **색감**: 밝은 상업 톤, 오렌지 액센트 조명.
- **금지 요소**: 공통 금지 요소와 동일.
- **생성 프롬프트**:
  `16:9 photograph of a commercial advertisement film set in a bright Korean production studio, cinema camera rig with a director's monitor, large softbox lights, crew members seen only from behind, white cyclorama background, warm orange accent lighting, main subject centered, clean composition, photorealistic, no text, no logo, no watermark, no identifiable faces. Create two variations: variation 01 is a wide shot showing the whole set, variation 02 is a closer shot focused on the camera operator's hands on the cinema camera.`
- **alt 텍스트**: 광고 촬영 세트에서 시네마 카메라를 준비하는 촬영팀
- **저장 경로**: `public/images/presets/jobs/`
- **샘플 파일명**: `shootmon-job-brand-01.webp`, `shootmon-job-brand-02.webp`

### 3.3.2 유튜브/채널 촬영

- **이름**: 모집 카드 — 유튜브/채널 촬영
- **용도**: 유튜브·채널 콘텐츠 촬영 공고 카드 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 미러리스 카메라와 삼각대, 크리에이터용 의자·데스크 셋업, 촬영자 뒷모습.
- **배경**: 아늑하고 밝은 소형 크리에이터 스튜디오(책장·조명 소품).
- **색감**: 따뜻한 실내광 + 오렌지 포인트, 밝은 톤.
- **금지 요소**: 공통 금지 요소와 동일. 모니터 화면에 글자가 보이지 않게.
- **생성 프롬프트**:
  `16:9 photograph of a cozy bright YouTube content filming setup in a small Korean creator studio, mirrorless camera on a tripod pointed at an empty interview chair and desk, ring light and small LED panels, videographer seen only from behind adjusting the camera, warm orange accent lighting, blurred screens with no readable content, main subject centered, clean composition, photorealistic, no text, no logo, no watermark, no identifiable faces. Create two variations: variation 01 shows the whole desk setup, variation 02 is a close shot of the mirrorless camera and ring light.`
- **alt 텍스트**: 유튜브 촬영을 위해 카메라와 조명을 세팅한 크리에이터 스튜디오
- **저장 경로**: `public/images/presets/jobs/`
- **샘플 파일명**: `shootmon-job-youtube-01.webp`, `shootmon-job-youtube-02.webp`

### 3.3.3 숏폼/Reels/TikTok

- **이름**: 모집 카드 — 숏폼/Reels/TikTok
- **용도**: 숏폼 촬영 공고 카드 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 스마트폰 짐벌 리그를 세로로 든 촬영자(측면/뒷모습), LED 튜브 조명.
- **배경**: 컬러 조명이 있는 밝은 실내 세트 또는 밝은 도심 거리.
- **색감**: 생동감 있는 밝은 톤, 오렌지 LED 포인트. 보라/파랑 위주 금지.
- **금지 요소**: 공통 금지 요소와 동일. 스마트폰 화면 UI가 읽히지 않게.
- **생성 프롬프트**:
  `16:9 photograph of a videographer seen from the side holding a smartphone mounted vertically on a gimbal, filming short-form video content, colorful LED tube lights with warm orange as the dominant accent, bright modern indoor set in Korea, phone screen blurred with no readable interface, main subject centered, energetic but clean composition, photorealistic, no text, no logo, no watermark, no identifiable faces. Create two variations: variation 01 shows the full body of the operator walking with the gimbal, variation 02 is a close shot of the vertical phone rig and hands.`
- **alt 텍스트**: 짐벌에 세로로 장착한 스마트폰으로 숏폼을 촬영하는 모습
- **저장 경로**: `public/images/presets/jobs/`
- **샘플 파일명**: `shootmon-job-shortform-01.webp`, `shootmon-job-shortform-02.webp`

### 3.3.4 웨딩 촬영

- **이름**: 모집 카드 — 웨딩 촬영
- **용도**: 웨딩 본식/스냅 촬영 공고 카드 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 짐벌 카메라를 든 촬영자 뒷모습. 원경에 신랑·신부 실루엣.
- **배경**: 샹들리에와 버진로드가 있는 밝은 웨딩홀.
- **색감**: 화이트·아이보리 베이스, 따뜻한 오렌지빛 조명 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 신랑·신부 얼굴 식별 금지.
- **생성 프롬프트**:
  `16:9 photograph of a wedding videographer seen from behind holding a camera on a gimbal inside a bright elegant wedding hall in Korea, chandeliers and white floral aisle, bride and groom visible only as soft distant silhouettes, warm orange-tinted ambient light, main subject centered, clean romantic but realistic composition, photorealistic, no text, no logo, no watermark, no identifiable faces. Create two variations: variation 01 shows the videographer and the aisle in a wide shot, variation 02 is a closer shot of the gimbal camera with the hall softly blurred behind.`
- **alt 텍스트**: 웨딩홀에서 짐벌 카메라로 촬영 중인 촬영자
- **저장 경로**: `public/images/presets/jobs/`
- **샘플 파일명**: `shootmon-job-wedding-01.webp`, `shootmon-job-wedding-02.webp`

### 3.3.5 행사/컨퍼런스 촬영

- **이름**: 모집 카드 — 행사/컨퍼런스 촬영
- **용도**: 기업 행사·컨퍼런스 스케치 촬영 공고 카드 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 객석 뒤 삼각대 위 캠코더/시네마 카메라와 촬영자 뒷모습.
- **배경**: 무대 조명이 켜진 밝은 컨퍼런스홀, 청중은 뒷모습 실루엣.
- **색감**: 무대 화이트 라이트 + 오렌지 무대 포인트 조명.
- **금지 요소**: 공통 금지 요소와 동일. 무대 스크린에 글자·로고 노출 금지.
- **생성 프롬프트**:
  `16:9 photograph of an event videographer seen from behind operating a camera on a tripod at the back of a bright conference hall in Korea, illuminated stage in the distance with a blank glowing screen, audience visible only as back-of-head silhouettes, warm orange stage accent lights, main subject centered, clean professional composition, photorealistic, no text, no logo, no watermark, no identifiable faces, no readable screen content. Create two variations: variation 01 shows the wide hall with stage, variation 02 is a closer shot over the operator's shoulder toward the stage.`
- **alt 텍스트**: 컨퍼런스홀 뒤편에서 무대를 촬영하는 행사 촬영자
- **저장 경로**: `public/images/presets/jobs/`
- **샘플 파일명**: `shootmon-job-event-01.webp`, `shootmon-job-event-02.webp`

### 3.3.6 제품/커머스 촬영

- **이름**: 모집 카드 — 제품/커머스 촬영
- **용도**: 제품 상세페이지·커머스 영상 촬영 공고 카드 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 테이블탑 제품 촬영 셋업. 매크로 렌즈 카메라, 무지 화장품 용기류, 조정하는 손.
- **배경**: 흰색 스윕(배경지)과 미니 소프트박스가 있는 밝은 테이블 스튜디오.
- **색감**: 클린한 화이트 베이스, 소품/조명에 오렌지 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 제품 라벨·브랜드 노출 금지.
- **생성 프롬프트**:
  `16:9 photograph of a tabletop product filming setup in a bright Korean studio, camera with macro lens on a small slider pointed at unbranded blank cosmetic bottles on a white sweep background, mini softbox lights, a hand adjusting the product placement, warm orange accent light, main subject centered, clean minimal commercial composition, photorealistic, no text, no logo, no watermark, no identifiable faces, no product labels. Create two variations: variation 01 shows the whole tabletop setup, variation 02 is a macro close shot of the lens and the product.`
- **alt 텍스트**: 흰 배경 테이블 위 제품을 촬영하는 커머스 촬영 셋업
- **저장 경로**: `public/images/presets/jobs/`
- **샘플 파일명**: `shootmon-job-product-01.webp`, `shootmon-job-product-02.webp`

### 3.3.7 인터뷰/다큐 촬영

- **이름**: 모집 카드 — 인터뷰/다큐 촬영
- **용도**: 인터뷰·다큐멘터리 촬영 공고 카드 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 2인 인터뷰 의자 셋업, 키 라이트, 붐 마이크, 카메라 2대.
- **배경**: 밝고 정돈된 인터뷰 스튜디오(어두운 다큐 무드 금지).
- **색감**: 따뜻한 키 라이트 + 오렌지 배경 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 출연자 얼굴 식별 금지(빈 의자 권장).
- **생성 프롬프트**:
  `16:9 photograph of a professional interview filming setup in a bright Korean studio, two empty chairs facing each other, two cinema cameras on tripods, a boom microphone on a stand, large key light with softbox, warm orange accent light on the backdrop, main subject centered, calm clean composition, photorealistic, no text, no logo, no watermark, no people's faces. Create two variations: variation 01 shows the full two-chair setup, variation 02 is a closer angle over one camera toward the empty interview chair.`
- **alt 텍스트**: 카메라와 조명, 붐 마이크가 세팅된 인터뷰 촬영 스튜디오
- **저장 경로**: `public/images/presets/jobs/`
- **샘플 파일명**: `shootmon-job-interview-01.webp`, `shootmon-job-interview-02.webp`

### 3.3.8 라이브/스트리밍

- **이름**: 모집 카드 — 라이브/스트리밍
- **용도**: 라이브 송출·스트리밍 촬영 공고 카드 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 영상 스위처와 멀티 모니터 컨트롤 데스크, 오퍼레이터 뒷모습과 손.
- **배경**: 밝은 중계 컨트롤룸 또는 현장 송출 부스.
- **색감**: 밝은 톤 유지, 장비 버튼·인디케이터에 오렌지 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 모니터 화면에 읽히는 자막·UI 금지.
- **생성 프롬프트**:
  `16:9 photograph of a live streaming control desk in a bright broadcast room in Korea, video switcher with glowing buttons, multiple monitors showing blurred colorful footage with no readable text, operator's hands and back visible only, tidy cables, warm orange accent lights on the equipment, main subject centered, clean technical composition, photorealistic, no text, no logo, no watermark, no identifiable faces, no readable screen content. Create two variations: variation 01 shows the whole control desk, variation 02 is a close shot of hands on the video switcher.`
- **alt 텍스트**: 스위처와 모니터가 놓인 라이브 송출 컨트롤 데스크
- **저장 경로**: `public/images/presets/jobs/`
- **샘플 파일명**: `shootmon-job-live-01.webp`, `shootmon-job-live-02.webp`

### 3.3.9 드론 촬영

- **이름**: 모집 카드 — 드론 촬영
- **용도**: 드론 항공 촬영 공고 카드 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 비행 중인 촬영용 드론(중앙), 전경에 조종기를 든 파일럿 실루엣.
- **배경**: 골든아워의 밝은 야외(도시 스카이라인 또는 해안).
- **색감**: 골든아워 오렌지빛 하늘 — 브랜드 오렌지와 자연스럽게 연결.
- **금지 요소**: 공통 금지 요소와 동일. 드론 브랜드 로고, 어두운 야간 하늘 금지.
- **생성 프롬프트**:
  `16:9 photograph of an unbranded professional camera drone hovering in the center of the frame during golden hour, warm orange sky, drone pilot visible in the lower foreground only as a silhouette holding a remote controller, bright Korean city skyline or coastline far below, main subject centered, clean cinematic but realistic composition, photorealistic, no text, no logo, no watermark, no identifiable faces. Create two variations: variation 01 shows the drone with the wide landscape, variation 02 is a closer shot of the drone with the pilot silhouette larger in frame.`
- **alt 텍스트**: 노을 하늘에서 비행 중인 촬영용 드론과 조종사 실루엣
- **저장 경로**: `public/images/presets/jobs/`
- **샘플 파일명**: `shootmon-job-drone-01.webp`, `shootmon-job-drone-02.webp`

### 3.3.10 스튜디오 촬영

- **이름**: 모집 카드 — 스튜디오 촬영
- **용도**: 스튜디오 렌탈·스튜디오 기반 촬영 공고 카드 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 흰 호리존(시클로라마) 스튜디오 전경, 조명 그리드, 삼각대 위 카메라.
- **배경**: 천장 조명 그리드와 배경지 롤이 보이는 넓고 밝은 렌탈 스튜디오.
- **색감**: 화이트 베이스, 배경지·소품 하나에 오렌지 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 사람 없이 공간·장비 중심.
- **생성 프롬프트**:
  `16:9 photograph of a spacious bright rental photography studio in Korea, white cyclorama wall, ceiling lighting grid, camera on a tripod facing the empty white space, one orange seamless paper backdrop roll adding a warm accent, tidy equipment along the walls, main subject centered, clean architectural composition, photorealistic, no text, no logo, no watermark, no people. Create two variations: variation 01 shows the wide empty studio, variation 02 is a closer shot of the camera and lighting stands near the cyclorama.`
- **alt 텍스트**: 흰 호리존과 조명 그리드가 있는 넓은 촬영 스튜디오
- **저장 경로**: `public/images/presets/jobs/`
- **샘플 파일명**: `shootmon-job-studio-01.webp`, `shootmon-job-studio-02.webp`

### 3.3.11 부동산/공간 촬영

- **이름**: 모집 카드 — 부동산/공간 촬영
- **용도**: 부동산·인테리어·공간 촬영 공고 카드 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 광각 렌즈 카메라와 삼각대, 이를 조정하는 촬영자 측면/뒷모습.
- **배경**: 자연광이 가득한 밝은 모던 아파트 거실 또는 상업 공간.
- **색감**: 밝은 주광 베이스, 인테리어 소품(쿠션·의자)에 오렌지 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 거주자·개인 물품 노출 금지.
- **생성 프롬프트**:
  `16:9 photograph of a real estate videographer seen from behind adjusting a camera with a wide-angle lens on a tripod inside a bright modern empty Korean apartment living room, large windows with natural daylight, minimal staged furniture with one orange cushion as accent, main subject centered, clean airy composition, photorealistic, no text, no logo, no watermark, no identifiable faces. Create two variations: variation 01 shows the wide living room with the tripod, variation 02 is a closer shot of the camera and the operator's hands.`
- **alt 텍스트**: 밝은 아파트 거실에서 광각 카메라로 공간을 촬영하는 모습
- **저장 경로**: `public/images/presets/jobs/`
- **샘플 파일명**: `shootmon-job-space-01.webp`, `shootmon-job-space-02.webp`

### 3.3.12 뷰티/패션 촬영

- **이름**: 모집 카드 — 뷰티/패션 촬영
- **용도**: 뷰티·패션 화보/영상 촬영 공고 카드 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 뷰티디시 조명과 카메라, 뒷모습/측면 실루엣의 모델, 촬영자 뒷모습.
- **배경**: 컬러 배경지(오렌지 계열)가 걸린 밝은 패션 스튜디오.
- **색감**: 오렌지 배경지 + 클린한 화이트 라이트. 보라/핑크 네온 금지.
- **금지 요소**: 공통 금지 요소와 동일. 모델 얼굴 식별 금지, 과한 노출 의상 금지.
- **생성 프롬프트**:
  `16:9 photograph of a fashion filming session in a bright Korean studio, model standing on an orange seamless paper backdrop seen only from behind in stylish modest clothing, photographer with camera and beauty dish light in the foreground seen from behind, clean white key lighting, main subjects centered, elegant clean composition, photorealistic, no text, no logo, no watermark, no identifiable faces. Create two variations: variation 01 shows the full studio scene with backdrop, variation 02 is a closer shot of the camera and beauty dish with the backdrop blurred.`
- **alt 텍스트**: 오렌지 배경지 앞에서 진행 중인 패션 촬영 현장
- **저장 경로**: `public/images/presets/jobs/`
- **샘플 파일명**: `shootmon-job-beauty-01.webp`, `shootmon-job-beauty-02.webp`

### 3.3.13 교육/강의 촬영

- **이름**: 모집 카드 — 교육/강의 촬영
- **용도**: 강의·교육 콘텐츠 촬영 공고 카드 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 빈 화이트보드/스크린을 향한 카메라와 삼각대, 프롬프터, 조명.
- **배경**: 밝은 강의 스튜디오 또는 정돈된 강의실.
- **색감**: 밝고 차분한 톤, 의자·소품에 오렌지 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 화이트보드에 판서·글자 금지.
- **생성 프롬프트**:
  `16:9 photograph of a lecture recording setup in a bright Korean studio classroom, camera on a tripod with a teleprompter facing a blank whiteboard and an empty lectern, softbox lights, one orange chair as accent, main subject centered, tidy educational atmosphere, clean composition, photorealistic, no text, no logo, no watermark, no people, blank whiteboard with no writing. Create two variations: variation 01 shows the whole classroom setup, variation 02 is a closer shot of the camera and teleprompter.`
- **alt 텍스트**: 강의 촬영을 위해 카메라와 프롬프터를 세팅한 스튜디오 강의실
- **저장 경로**: `public/images/presets/jobs/`
- **샘플 파일명**: `shootmon-job-education-01.webp`, `shootmon-job-education-02.webp`

### 3.3.14 스포츠/공연 촬영

- **이름**: 모집 카드 — 스포츠/공연 촬영
- **용도**: 스포츠 경기·공연 실황 촬영 공고 카드 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 망원 렌즈 시네마 카메라를 조작하는 촬영자 실루엣(측면/뒷모습).
- **배경**: 조명이 켜진 경기장 스탠드 또는 공연장 객석 뒤. 무대/필드는 원경 보케.
- **색감**: 현장 조명의 웜톤 + 오렌지 무대/경기장 라이트 포인트. 전체가 어둡지 않게.
- **금지 요소**: 공통 금지 요소와 동일. 선수/아티스트 얼굴, 팀 로고, 전광판 글자 금지.
- **생성 프롬프트**:
  `16:9 photograph of a sports and concert videographer seen from behind operating a cinema camera with a long telephoto lens from the stands of a brightly lit stadium or concert venue in Korea, stage or field visible in the distance as warm bokeh lights, warm orange venue lighting accents, main subject centered, dynamic but clean composition, photorealistic, no text, no logo, no watermark, no identifiable faces, no readable screens or scoreboards. Create two variations: variation 01 shows the operator with the wide venue behind, variation 02 is a closer shot of the telephoto camera rig.`
- **alt 텍스트**: 경기장 스탠드에서 망원 카메라로 촬영 중인 촬영자
- **저장 경로**: `public/images/presets/jobs/`
- **샘플 파일명**: `shootmon-job-sports-01.webp`, `shootmon-job-sports-02.webp`

## 3.4 촬영자 프로필 커버 (9종)

공통: 권장 크기 800×600, 비율 4:3, 저장 경로 `public/images/presets/profiles/`.
스타일: 장비와 작업 결과물이 보이는 이미지. 인물은 뒷모습/측면/손/실루엣 위주. 얼굴 초상 금지.
공통 금지 요소: 텍스트, 로고, 워터마크, 식별 가능한 얼굴, 얼굴 중심 초상 구도, 어두운 무드.

### 3.4.1 광고 촬영감독

- **이름**: 프로필 커버 — 광고 촬영감독
- **용도**: 광고/브랜드 필름 촬영감독 프로필 상단 커버.
- **권장 크기**: 800×600
- **비율**: 4:3
- **피사체**: 시네마 카메라 옆에서 디렉터스 모니터를 확인하는 감독의 뒷모습.
- **배경**: 대형 광고 촬영 세트, 소프트박스와 조명 스탠드.
- **색감**: 밝은 상업 톤, 모니터 주변 오렌지 액센트 라이팅.
- **금지 요소**: 공통 금지 요소와 동일. 모니터 화면에 읽히는 콘텐츠 금지.
- **생성 프롬프트**:
  `4:3 photograph of a commercial film director seen from behind standing next to a cinema camera and checking a director's monitor showing blurred colorful footage, bright Korean advertisement production set, softbox lights, warm orange accent lighting, professional confident atmosphere, clean composition, photorealistic, no text, no logo, no watermark, no identifiable faces, no readable screen content.`
- **alt 텍스트**: 광고 촬영 세트에서 모니터를 확인하는 촬영감독의 뒷모습
- **저장 경로**: `public/images/presets/profiles/`
- **샘플 파일명**: `shootmon-profile-ad-director-01.webp`

### 3.4.2 웨딩 촬영자

- **이름**: 프로필 커버 — 웨딩 촬영자
- **용도**: 웨딩 전문 촬영자 프로필 커버.
- **권장 크기**: 800×600
- **비율**: 4:3
- **피사체**: 짐벌 카메라를 든 촬영자 측면 실루엣, 원경의 웨딩홀 버진로드.
- **배경**: 밝은 웨딩홀, 꽃 장식과 샹들리에.
- **색감**: 화이트·아이보리 + 따뜻한 오렌지빛 조명.
- **금지 요소**: 공통 금지 요소와 동일. 신랑·신부 얼굴 식별 금지.
- **생성 프롬프트**:
  `4:3 photograph of a wedding videographer in side profile holding a gimbal-mounted camera inside a bright elegant Korean wedding hall, white floral aisle and chandeliers softly blurred in the background, warm orange-tinted ambient lighting, graceful clean composition, photorealistic, no text, no logo, no watermark, no identifiable faces.`
- **alt 텍스트**: 웨딩홀에서 짐벌 카메라를 든 웨딩 촬영자의 측면 모습
- **저장 경로**: `public/images/presets/profiles/`
- **샘플 파일명**: `shootmon-profile-wedding-01.webp`

### 3.4.3 드론 촬영자

- **이름**: 프로필 커버 — 드론 촬영자
- **용도**: 드론 항공 촬영 전문가 프로필 커버.
- **권장 크기**: 800×600
- **비율**: 4:3
- **피사체**: 조종기를 든 파일럿 뒷모습과 눈앞에 호버링 중인 드론.
- **배경**: 골든아워 야외, 밝은 하늘과 지평선.
- **색감**: 골든아워 오렌지 하늘, 밝은 노출.
- **금지 요소**: 공통 금지 요소와 동일. 드론 브랜드 로고, 야간 촬영 금지.
- **생성 프롬프트**:
  `4:3 photograph of a drone pilot seen from behind holding a remote controller, an unbranded professional camera drone hovering in front at eye level, golden hour outdoor location in Korea with a warm orange sky and open horizon, bright exposure, clean composition, photorealistic, no text, no logo, no watermark, no identifiable faces.`
- **alt 텍스트**: 노을 아래에서 드론을 조종하는 드론 촬영자의 뒷모습
- **저장 경로**: `public/images/presets/profiles/`
- **샘플 파일명**: `shootmon-profile-drone-01.webp`

### 3.4.4 제품 촬영자

- **이름**: 프로필 커버 — 제품 촬영자
- **용도**: 제품/커머스 전문 촬영자 프로필 커버.
- **권장 크기**: 800×600
- **비율**: 4:3
- **피사체**: 테이블탑 셋업에서 무지 제품을 배치하는 손과 카메라.
- **배경**: 흰 스윕과 미니 소프트박스가 있는 밝은 제품 촬영 테이블.
- **색감**: 클린 화이트 + 오렌지 소품 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 제품 라벨·브랜드 노출 금지.
- **생성 프롬프트**:
  `4:3 photograph of a product photographer's hands carefully arranging unbranded blank product bottles on a white sweep tabletop, camera with macro lens on a tripod in the foreground, mini softbox lights, one orange prop as accent, bright clean Korean studio, minimal composition, photorealistic, no text, no logo, no watermark, no faces, no product labels.`
- **alt 텍스트**: 흰 배경 테이블에서 제품을 배치하며 촬영을 준비하는 손
- **저장 경로**: `public/images/presets/profiles/`
- **샘플 파일명**: `shootmon-profile-product-01.webp`

### 3.4.5 라이브 송출팀

- **이름**: 프로필 커버 — 라이브 송출팀
- **용도**: 라이브 중계/송출 팀 프로필 커버.
- **권장 크기**: 800×600
- **비율**: 4:3
- **피사체**: 스위처와 멀티 모니터 데스크 앞의 팀원 2명 뒷모습.
- **배경**: 밝은 중계 컨트롤룸, 정돈된 케이블.
- **색감**: 밝은 톤, 장비 인디케이터의 오렌지 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 모니터에 읽히는 자막·UI 금지.
- **생성 프롬프트**:
  `4:3 photograph of two live broadcast operators seen from behind working at a control desk with a video switcher and multiple monitors showing blurred colorful footage, bright tidy control room in Korea, warm orange indicator lights on the equipment, organized cables, professional teamwork atmosphere, clean composition, photorealistic, no text, no logo, no watermark, no identifiable faces, no readable screen content.`
- **alt 텍스트**: 컨트롤룸에서 송출 장비를 운용하는 라이브 송출팀의 뒷모습
- **저장 경로**: `public/images/presets/profiles/`
- **샘플 파일명**: `shootmon-profile-live-01.webp`

### 3.4.6 인터뷰 촬영자

- **이름**: 프로필 커버 — 인터뷰 촬영자
- **용도**: 인터뷰/다큐 전문 촬영자 프로필 커버.
- **권장 크기**: 800×600
- **비율**: 4:3
- **피사체**: 인터뷰 셋업 옆에서 카메라 뷰파인더를 조정하는 촬영자 측면 모습.
- **배경**: 밝은 인터뷰 스튜디오, 빈 의자와 키 라이트.
- **색감**: 따뜻한 키 라이트 + 배경 오렌지 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 출연자 얼굴 노출 금지.
- **생성 프롬프트**:
  `4:3 photograph of an interview videographer in side profile adjusting the viewfinder of a cinema camera aimed at an empty interview chair, bright Korean studio with a large softbox key light and a boom microphone, warm orange accent light on the backdrop, calm professional atmosphere, clean composition, photorealistic, no text, no logo, no watermark, no identifiable faces.`
- **alt 텍스트**: 인터뷰 촬영 카메라를 조정하는 촬영자의 측면 모습
- **저장 경로**: `public/images/presets/profiles/`
- **샘플 파일명**: `shootmon-profile-interview-01.webp`

### 3.4.7 패션 촬영자

- **이름**: 프로필 커버 — 패션 촬영자
- **용도**: 뷰티/패션 전문 촬영자 프로필 커버.
- **권장 크기**: 800×600
- **비율**: 4:3
- **피사체**: 카메라를 든 촬영자 뒷모습, 오렌지 배경지 앞 모델 뒷모습 실루엣.
- **배경**: 밝은 패션 스튜디오, 뷰티디시와 배경지.
- **색감**: 오렌지 배경지 + 클린 화이트 라이트.
- **금지 요소**: 공통 금지 요소와 동일. 모델 얼굴 식별 금지.
- **생성 프롬프트**:
  `4:3 photograph of a fashion videographer seen from behind holding a camera toward a model who is also seen only from behind standing on an orange seamless paper backdrop, beauty dish light, bright Korean fashion studio, clean white key lighting with the orange backdrop as the dominant accent, stylish clean composition, photorealistic, no text, no logo, no watermark, no identifiable faces.`
- **alt 텍스트**: 오렌지 배경지 앞에서 모델을 촬영하는 패션 촬영자
- **저장 경로**: `public/images/presets/profiles/`
- **샘플 파일명**: `shootmon-profile-fashion-01.webp`

### 3.4.8 행사 촬영팀

- **이름**: 프로필 커버 — 행사 촬영팀
- **용도**: 행사/컨퍼런스 다중 카메라 촬영팀 프로필 커버.
- **권장 크기**: 800×600
- **비율**: 4:3
- **피사체**: 삼각대 카메라 2~3대와 팀원들 뒷모습, 원경의 밝은 무대.
- **배경**: 컨퍼런스홀 객석 뒤, 무대 조명.
- **색감**: 화이트 무대광 + 오렌지 포인트 조명.
- **금지 요소**: 공통 금지 요소와 동일. 무대 스크린 글자·청중 얼굴 금지.
- **생성 프롬프트**:
  `4:3 photograph of an event filming team of two or three crew members seen from behind operating multiple cameras on tripods at the back of a bright conference hall in Korea, illuminated stage with a blank glowing screen in the distance, warm orange stage accent lights, coordinated professional teamwork atmosphere, clean composition, photorealistic, no text, no logo, no watermark, no identifiable faces, no readable screen content.`
- **alt 텍스트**: 컨퍼런스홀에서 여러 대의 카메라를 운용하는 행사 촬영팀
- **저장 경로**: `public/images/presets/profiles/`
- **샘플 파일명**: `shootmon-profile-event-01.webp`

### 3.4.9 스튜디오 운영자

- **이름**: 프로필 커버 — 스튜디오 운영자
- **용도**: 촬영 스튜디오 운영자(대관·기업) 프로필 커버.
- **권장 크기**: 800×600
- **비율**: 4:3
- **피사체**: 조명 스탠드를 정리하는 운영자 뒷모습, 넓은 흰 호리존.
- **배경**: 조명 그리드와 배경지 롤이 갖춰진 밝은 렌탈 스튜디오.
- **색감**: 화이트 베이스, 오렌지 배경지 롤 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 좁고 어수선한 공간 금지.
- **생성 프롬프트**:
  `4:3 photograph of a studio manager seen from behind arranging a lighting stand in a spacious bright Korean rental photography studio, white cyclorama wall, ceiling lighting grid, rolls of seamless paper backdrops including one orange roll as accent, tidy well-maintained space, clean architectural composition, photorealistic, no text, no logo, no watermark, no identifiable faces.`
- **alt 텍스트**: 넓은 렌탈 스튜디오에서 조명을 정리하는 스튜디오 운영자
- **저장 경로**: `public/images/presets/profiles/`
- **샘플 파일명**: `shootmon-profile-studio-01.webp`

## 3.5 프로필 아바타 (5종)

공통: 권장 크기 256×256, 비율 1:1, 저장 경로 `public/images/presets/profiles/avatars/`.
스타일: 사진이 아니라 **플랫 미니멀 일러스트/아이콘형**. 카메라 렌즈·조리개·실루엣 모티프 기반.
공통 금지 요소: 실존 인물과 닮은 얼굴, 사실적 인물 사진, 텍스트, 로고, 워터마크, 과한 그라데이션, 어두운 배경.
공통 규칙: 원형 크롭을 전제로 중앙 원 안에 모티프를 배치한다.

### 3.5.1 개인 촬영자 기본

- **이름**: 아바타 — 개인 촬영자 기본
- **용도**: 성별 미지정 개인회원 기본 아바타. 프로필 목록·댓글·마이페이지 공용.
- **권장 크기**: 256×256
- **비율**: 1:1
- **피사체**: 카메라 렌즈 정면(조리개 블레이드가 보이는 형태)의 플랫 아이콘.
- **배경**: 아주 옅은 웜 그레이(#F8FAFC 계열) 단색 원형.
- **색감**: 오렌지(#F97316) 라인 + 잉크(#111827) 보조선, 밝은 배경.
- **금지 요소**: 공통 금지 요소와 동일. 사람 형태 미포함.
- **생성 프롬프트**:
  `Minimal flat vector-style icon of a camera lens seen from the front with visible aperture blades, centered inside a circle, soft light warm gray background, orange line accents with dark ink details, clean geometric modern illustration, simple and friendly, no text, no logo, no watermark, no human face, no gradient effects.`
- **alt 텍스트**: 카메라 렌즈 모양의 기본 프로필 아바타
- **저장 경로**: `public/images/presets/profiles/avatars/`
- **샘플 파일명**: `shootmon-avatar-default-01.webp`

### 3.5.2 여성 촬영자 기본

- **이름**: 아바타 — 여성 촬영자 기본
- **용도**: 여성 개인회원 기본 아바타.
- **권장 크기**: 256×256
- **비율**: 1:1
- **피사체**: 단발~어깨선 머리의 여성 상반신 실루엣(이목구비 없음)과 어깨에 멘 카메라 스트랩 아이콘.
- **배경**: 옅은 오렌지 틴트 단색 원형.
- **색감**: 오렌지 배경 틴트 + 잉크색 실루엣.
- **금지 요소**: 공통 금지 요소와 동일. 이목구비 묘사 금지.
- **생성 프롬프트**:
  `Minimal flat vector-style avatar of a female upper-body silhouette with shoulder-length hair and a camera strap across the shoulder, no facial features at all, centered inside a circle, soft pale orange background, dark ink silhouette with a small orange camera accent, clean geometric modern illustration, no text, no logo, no watermark, no realistic face, no gradient effects.`
- **alt 텍스트**: 카메라를 멘 여성 실루엣의 기본 프로필 아바타
- **저장 경로**: `public/images/presets/profiles/avatars/`
- **샘플 파일명**: `shootmon-avatar-female-01.webp`

### 3.5.3 남성 촬영자 기본

- **이름**: 아바타 — 남성 촬영자 기본
- **용도**: 남성 개인회원 기본 아바타.
- **권장 크기**: 256×256
- **비율**: 1:1
- **피사체**: 짧은 머리(또는 캡 모자)의 남성 상반신 실루엣(이목구비 없음)과 카메라 스트랩 아이콘.
- **배경**: 옅은 블루 그레이 단색 원형(Accent #2563EB의 저채도 틴트).
- **색감**: 블루 그레이 배경 + 잉크색 실루엣 + 오렌지 카메라 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 이목구비 묘사 금지.
- **생성 프롬프트**:
  `Minimal flat vector-style avatar of a male upper-body silhouette with short hair wearing a cap and a camera strap across the shoulder, no facial features at all, centered inside a circle, soft pale blue-gray background, dark ink silhouette with a small orange camera accent, clean geometric modern illustration, no text, no logo, no watermark, no realistic face, no gradient effects.`
- **alt 텍스트**: 카메라를 멘 남성 실루엣의 기본 프로필 아바타
- **저장 경로**: `public/images/presets/profiles/avatars/`
- **샘플 파일명**: `shootmon-avatar-male-01.webp`

### 3.5.4 촬영팀 기본

- **이름**: 아바타 — 촬영팀 기본
- **용도**: 팀 단위 프로필(2인 이상 촬영팀) 기본 아바타.
- **권장 크기**: 256×256
- **비율**: 1:1
- **피사체**: 서로 겹친 2~3개의 상반신 실루엣(이목구비 없음)과 중앙 렌즈 아이콘.
- **배경**: 옅은 웜 그레이 단색 원형.
- **색감**: 잉크·뮤트 그레이 실루엣 겹침 + 오렌지 렌즈 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 개별 얼굴 묘사 금지.
- **생성 프롬프트**:
  `Minimal flat vector-style avatar of two or three overlapping upper-body silhouettes with no facial features, a small orange camera lens icon centered in front of them, centered inside a circle, soft light warm gray background, dark ink and muted gray silhouettes, clean geometric modern illustration, no text, no logo, no watermark, no realistic faces, no gradient effects.`
- **alt 텍스트**: 여러 명의 실루엣으로 표현한 촬영팀 기본 아바타
- **저장 경로**: `public/images/presets/profiles/avatars/`
- **샘플 파일명**: `shootmon-avatar-team-01.webp`

### 3.5.5 기업회원 기본

- **이름**: 아바타 — 기업회원 기본
- **용도**: 기업회원(로고 미등록) 기본 아바타. 공고 카드의 회사 아이콘 대체 포함.
- **권장 크기**: 256×256
- **비율**: 1:1
- **피사체**: 단순한 빌딩 외곽선과 그 앞의 카메라 렌즈/조리개 아이콘 조합.
- **배경**: 옅은 웜 그레이 단색 원형.
- **색감**: 잉크색 빌딩 라인 + 오렌지 렌즈 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 실제 기업 로고와 유사한 형태 금지.
- **생성 프롬프트**:
  `Minimal flat vector-style avatar combining a simple office building outline with a small orange camera aperture icon in front of it, centered inside a circle, soft light warm gray background, dark ink line work with orange accent, clean geometric modern illustration, generic corporate symbol not resembling any real logo, no text, no logo, no watermark, no gradient effects.`
- **alt 텍스트**: 빌딩과 카메라 조리개를 결합한 기업회원 기본 아바타
- **저장 경로**: `public/images/presets/profiles/avatars/`
- **샘플 파일명**: `shootmon-avatar-company-01.webp`

## 3.6 스토어 상품 썸네일 (10종)

공통: 권장 크기 640×480, 비율 4:3, 저장 경로 `public/images/presets/store/`.
규칙: 가격·홍보 문구를 이미지에 넣지 않는다. 상품명/가격은 UI 텍스트로 표시한다. 모바일 2열 크롭 대비 중앙 안전영역 유지.
공통 금지 요소: 텍스트, 로고, 워터마크, 가격/할인 표기, 식별 가능한 얼굴, 브랜드 로고 장비.

### 3.6.1 촬영 서비스 패키지

- **이름**: 스토어 — 촬영 서비스 패키지
- **용도**: 종합 촬영 서비스 패키지 상품 썸네일.
- **권장 크기**: 640×480
- **비율**: 4:3
- **피사체**: 카메라·짐벌·조명·마이크를 한 세트로 정돈해 놓은 플랫레이 구도.
- **배경**: 밝은 회색 스튜디오 테이블.
- **색감**: 뉴트럴 베이스 + 오렌지 소품(케이블 타이·스트랩) 포인트.
- **금지 요소**: 공통 금지 요소와 동일.
- **생성 프롬프트**:
  `4:3 overhead flat lay photograph of a complete unbranded filming service kit neatly arranged on a bright gray studio table, cinema camera, gimbal, small LED light, shotgun microphone and lenses, one orange camera strap as accent, soft even lighting, clean organized composition, photorealistic commercial product photography, no text, no logo, no watermark, no people.`
- **alt 텍스트**: 카메라와 짐벌, 조명으로 구성된 촬영 서비스 패키지 장비 세트
- **저장 경로**: `public/images/presets/store/`
- **샘플 파일명**: `shootmon-store-package-01.webp`

### 3.6.2 드론 촬영

- **이름**: 스토어 — 드론 촬영
- **용도**: 드론 항공 촬영 상품 썸네일.
- **권장 크기**: 640×480
- **비율**: 4:3
- **피사체**: 케이스 위에 놓인 촬영용 드론과 조종기.
- **배경**: 밝은 야외 잔디/옥상 또는 밝은 테이블.
- **색감**: 밝은 주광 + 오렌지 액세서리 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 드론 브랜드 로고 금지.
- **생성 프롬프트**:
  `4:3 photograph of an unbranded professional camera drone and its remote controller placed on a carrying case, bright outdoor rooftop location in daylight, warm orange propeller guards or strap as accent, clean centered composition, photorealistic commercial product photography, no text, no logo, no watermark, no people.`
- **alt 텍스트**: 케이스 위에 놓인 촬영용 드론과 조종기
- **저장 경로**: `public/images/presets/store/`
- **샘플 파일명**: `shootmon-store-drone-01.webp`

### 3.6.3 스튜디오 대관

- **이름**: 스토어 — 스튜디오 대관
- **용도**: 스튜디오 시간제 대관 상품 썸네일.
- **권장 크기**: 640×480
- **비율**: 4:3
- **피사체**: 빈 흰 호리존 스튜디오 전경과 조명 스탠드.
- **배경**: 조명 그리드가 보이는 밝은 렌탈 스튜디오 공간 자체.
- **색감**: 화이트 베이스 + 오렌지 배경지 롤 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 사람 미포함.
- **생성 프롬프트**:
  `4:3 photograph of an empty bright rental photography studio in Korea, white cyclorama wall, ceiling lighting grid, a few lighting stands ready for use, one orange seamless paper backdrop roll leaning on the wall as accent, wide clean architectural composition, photorealistic, no text, no logo, no watermark, no people.`
- **alt 텍스트**: 대관 가능한 흰 호리존 촬영 스튜디오 내부
- **저장 경로**: `public/images/presets/store/`
- **샘플 파일명**: `shootmon-store-studio-rental-01.webp`

### 3.6.4 장비 대여

- **이름**: 스토어 — 장비 대여
- **용도**: 카메라/렌즈 등 장비 대여 상품 썸네일.
- **권장 크기**: 640×480
- **비율**: 4:3
- **피사체**: 하드케이스 안에 폼 커팅으로 정리된 카메라 바디와 렌즈들.
- **배경**: 밝은 대여실 선반 또는 테이블.
- **색감**: 뉴트럴 + 케이스 내부 오렌지 폼 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 브랜드 로고 금지.
- **생성 프롬프트**:
  `4:3 photograph of an open equipment hard case with unbranded camera bodies and lenses neatly organized in custom foam cutouts, bright rental room table, orange foam interior as accent color, soft even lighting, clean organized composition, photorealistic commercial product photography, no text, no logo, no watermark, no people.`
- **alt 텍스트**: 하드케이스에 정리된 대여용 카메라와 렌즈
- **저장 경로**: `public/images/presets/store/`
- **샘플 파일명**: `shootmon-store-equipment-01.webp`

### 3.6.5 조명/오디오 패키지

- **이름**: 스토어 — 조명/오디오 패키지
- **용도**: 조명·오디오 장비 패키지 상품 썸네일.
- **권장 크기**: 640×480
- **비율**: 4:3
- **피사체**: 소프트박스 조명, LED 패널, 붐 마이크, 무선 마이크 세트 구성.
- **배경**: 밝은 스튜디오 벽 앞 정렬 구도.
- **색감**: 뉴트럴 + 켜져 있는 웜(오렌지빛) LED 포인트.
- **금지 요소**: 공통 금지 요소와 동일.
- **생성 프롬프트**:
  `4:3 photograph of a lighting and audio equipment package arranged in front of a bright studio wall, softbox light on a stand, LED panel glowing with a warm orange tone, boom microphone and wireless microphone kit on a small table, unbranded gear, clean organized composition, photorealistic commercial product photography, no text, no logo, no watermark, no people.`
- **alt 텍스트**: 소프트박스 조명과 마이크로 구성된 조명 오디오 패키지
- **저장 경로**: `public/images/presets/store/`
- **샘플 파일명**: `shootmon-store-lighting-audio-01.webp`

### 3.6.6 라이브 송출

- **이름**: 스토어 — 라이브 송출
- **용도**: 라이브 스트리밍/중계 송출 서비스 상품 썸네일.
- **권장 크기**: 640×480
- **비율**: 4:3
- **피사체**: 영상 스위처와 소형 모니터, 정리된 케이블로 구성된 송출 키트.
- **배경**: 밝은 테이블 위 셋업 구도.
- **색감**: 뉴트럴 + 스위처 버튼의 오렌지 백라이트 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 모니터 화면에 읽히는 콘텐츠 금지.
- **생성 프롬프트**:
  `4:3 photograph of a compact live streaming kit on a bright table, video switcher with glowing orange backlit buttons, a small field monitor showing blurred colorful footage, neatly coiled cables, unbranded gear, clean technical composition, photorealistic commercial product photography, no text, no logo, no watermark, no people, no readable screen content.`
- **alt 텍스트**: 스위처와 모니터로 구성된 라이브 송출 장비 세트
- **저장 경로**: `public/images/presets/store/`
- **샘플 파일명**: `shootmon-store-live-01.webp`

### 3.6.7 LUT/프리셋

- **이름**: 스토어 — LUT/프리셋
- **용도**: 색보정 LUT·편집 프리셋 디지털 상품 썸네일.
- **권장 크기**: 640×480
- **비율**: 4:3
- **피사체**: 컬러 그레이딩 작업 데스크. 모니터에 좌우 색감이 다른(비포/애프터 느낌) 흐릿한 영상, 컨트롤 패널.
- **배경**: 밝은 편집실 데스크.
- **색감**: 모니터 속 웜 오렌지 톤 강조, 데스크는 뉴트럴.
- **금지 요소**: 공통 금지 요소와 동일. 화면 속 글자·타임라인 UI가 읽히지 않게.
- **생성 프롬프트**:
  `4:3 photograph of a color grading desk in a bright editing room, large monitor displaying blurred cinematic footage split into a cool half and a warm orange half suggesting before and after color grading, color control surface panel in the foreground, no readable interface elements, clean modern composition, photorealistic, no text, no logo, no watermark, no people.`
- **alt 텍스트**: 색보정 전후 화면이 보이는 컬러 그레이딩 작업 데스크
- **저장 경로**: `public/images/presets/store/`
- **샘플 파일명**: `shootmon-store-lut-01.webp`

### 3.6.8 계약서/가이드 템플릿

- **이름**: 스토어 — 계약서/가이드 템플릿
- **용도**: 촬영 계약서·견적서·가이드 문서 템플릿 디지털 상품 썸네일.
- **권장 크기**: 640×480
- **비율**: 4:3
- **피사체**: 빈 서류(백지)와 클립보드, 펜, 옆에 놓인 카메라.
- **배경**: 밝은 사무 데스크.
- **색감**: 화이트·뉴트럴 + 오렌지 펜/클립 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 서류에 읽히는 글자 금지(완전 백지 또는 흐릿한 선만).
- **생성 프롬프트**:
  `4:3 photograph of blank white documents on a clipboard with an orange pen, placed on a bright office desk next to an unbranded camera, papers completely blank with no visible writing, soft daylight, clean minimal composition suggesting contracts and templates for filming work, photorealistic, no text, no logo, no watermark, no people.`
- **alt 텍스트**: 카메라 옆에 놓인 촬영 계약서 템플릿 문서와 펜
- **저장 경로**: `public/images/presets/store/`
- **샘플 파일명**: `shootmon-store-template-01.webp`

### 3.6.9 제품 촬영

- **이름**: 스토어 — 제품 촬영
- **용도**: 제품 촬영 서비스 상품 썸네일.
- **권장 크기**: 640×480
- **비율**: 4:3
- **피사체**: 흰 스윕 위 무지 제품과 이를 겨눈 매크로 렌즈 카메라, 미니 소프트박스.
- **배경**: 밝은 테이블탑 스튜디오.
- **색감**: 클린 화이트 + 오렌지 소품 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 제품 라벨 금지.
- **생성 프롬프트**:
  `4:3 photograph of a tabletop product photography setup, unbranded blank product bottles on a white sweep background, camera with macro lens on a tripod aimed at the products, mini softbox lights, one small orange prop as accent, bright clean Korean studio, minimal commercial composition, photorealistic, no text, no logo, no watermark, no people, no product labels.`
- **alt 텍스트**: 흰 배경에서 제품을 촬영하는 테이블탑 스튜디오 셋업
- **저장 경로**: `public/images/presets/store/`
- **샘플 파일명**: `shootmon-store-product-01.webp`

### 3.6.10 웨딩 촬영

- **이름**: 스토어 — 웨딩 촬영
- **용도**: 웨딩 촬영 서비스 상품 썸네일.
- **권장 크기**: 640×480
- **비율**: 4:3
- **피사체**: 짐벌 카메라와 부케/웨딩 소품이 함께 놓인 준비 테이블 정물, 또는 웨딩홀에서 짐벌을 든 촬영자 실루엣.
- **배경**: 밝은 웨딩홀 또는 화이트 톤 준비 공간.
- **색감**: 화이트·아이보리 + 따뜻한 오렌지빛.
- **금지 요소**: 공통 금지 요소와 동일. 신랑·신부 얼굴 금지.
- **생성 프롬프트**:
  `4:3 photograph of a gimbal-mounted camera resting on a white table next to a soft bridal bouquet inside a bright elegant wedding hall, chandeliers softly blurred in the background, warm orange-tinted ambient light, romantic but realistic clean composition, photorealistic, no text, no logo, no watermark, no people.`
- **alt 텍스트**: 웨딩홀 테이블에 놓인 짐벌 카메라와 부케
- **저장 경로**: `public/images/presets/store/`
- **샘플 파일명**: `shootmon-store-wedding-01.webp`

## 3.7 커뮤니티/공지 썸네일 (6종)

공통: 권장 크기 640×360, 비율 16:9, 저장 경로 `public/images/presets/community/`.
용도 공통: 게시글에 첨부 이미지가 없을 때 목록 카드에 쓰는 게시판별 기본 썸네일.
공통 금지 요소: 텍스트, 로고, 워터마크, 식별 가능한 얼굴, 어두운 무드, 게시판 성격과 무관한 추상 배경.

### 3.7.1 자유게시판 기본

- **이름**: 커뮤니티 — 자유게시판 기본
- **용도**: 자유게시판 무이미지 글의 기본 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 카페 테이블 위의 카메라와 커피잔, 대화하는 두 사람의 손.
- **배경**: 밝은 카페 창가.
- **색감**: 따뜻한 자연광 + 오렌지 소품 포인트.
- **금지 요소**: 공통 금지 요소와 동일.
- **생성 프롬프트**:
  `16:9 photograph of a casual meetup scene at a bright cafe table by a window, an unbranded camera and two coffee cups on the table, hands of two people in relaxed conversation, warm natural daylight with an orange mug as accent, friendly community mood, clean composition, photorealistic, no text, no logo, no watermark, no identifiable faces.`
- **alt 텍스트**: 카페 테이블 위 카메라와 커피잔이 있는 자유게시판 기본 이미지
- **저장 경로**: `public/images/presets/community/`
- **샘플 파일명**: `shootmon-community-free-01.webp`

### 3.7.2 촬영 피드백 기본

- **이름**: 커뮤니티 — 촬영 피드백 기본
- **용도**: 촬영 피드백 게시판 무이미지 글의 기본 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 모니터의 흐릿한 영상 장면을 손가락으로 가리키며 리뷰하는 두 사람의 손과 뒷모습.
- **배경**: 밝은 편집실 데스크.
- **색감**: 뉴트럴 + 모니터 속 웜 오렌지 톤.
- **금지 요소**: 공통 금지 요소와 동일. 화면 속 글자·타임라인 금지.
- **생성 프롬프트**:
  `16:9 photograph of two people seen from behind reviewing blurred video footage on a monitor in a bright editing room, one hand pointing at the screen, footage showing warm orange cinematic tones with no readable interface, collaborative feedback mood, clean composition, photorealistic, no text, no logo, no watermark, no identifiable faces, no readable screen content.`
- **alt 텍스트**: 모니터 속 영상을 함께 검토하는 촬영 피드백 장면
- **저장 경로**: `public/images/presets/community/`
- **샘플 파일명**: `shootmon-community-feedback-01.webp`

### 3.7.3 공모전 기본

- **이름**: 커뮤니티 — 공모전 기본
- **용도**: 공모전 게시판 무이미지 글의 기본 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 스포트라이트를 받는 무대 위 트로피와 시네마 카메라 실루엣.
- **배경**: 밝은 시상식 무대(원경 보케).
- **색감**: 웜 골드·오렌지 조명.
- **금지 요소**: 공통 금지 요소와 동일. 트로피에 각인 글자 금지.
- **생성 프롬프트**:
  `16:9 photograph of a plain golden trophy with no engraving next to a cinema camera silhouette on a stage under a warm orange spotlight, bright award ceremony atmosphere with soft bokeh lights in the background, celebratory clean composition, photorealistic, no text, no logo, no watermark, no people.`
- **alt 텍스트**: 무대 조명 아래 놓인 트로피와 카메라 공모전 기본 이미지
- **저장 경로**: `public/images/presets/community/`
- **샘플 파일명**: `shootmon-community-contest-01.webp`

### 3.7.4 촬영랩 기본

- **이름**: 커뮤니티 — 촬영랩 기본
- **용도**: 촬영 기술 연구/정보 공유 게시판(촬영랩) 기본 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 분해된 렌즈, 조리개 링, ND 필터 등 촬영 기술 소품의 클로즈업 정물.
- **배경**: 밝은 작업 테이블.
- **색감**: 뉴트럴 + 오렌지 도구 포인트.
- **금지 요소**: 공통 금지 요소와 동일.
- **생성 프롬프트**:
  `16:9 close-up photograph of camera technology items arranged on a bright workbench, a disassembled unbranded lens showing aperture blades, ND filters and a small orange calibration tool as accent, soft even lighting, technical study mood, clean composition, photorealistic, no text, no logo, no watermark, no people.`
- **alt 텍스트**: 렌즈와 필터가 놓인 촬영 기술 연구용 작업 테이블
- **저장 경로**: `public/images/presets/community/`
- **샘플 파일명**: `shootmon-community-lab-01.webp`

### 3.7.5 공지사항 기본

- **이름**: 커뮤니티 — 공지사항 기본
- **용도**: 공지사항 목록 무이미지 글의 기본 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 확성기(메가폰)와 클랩보드(슬레이트)를 결합한 미니멀 정물. 클랩보드는 빈 상태.
- **배경**: 밝은 단색 스튜디오 배경.
- **색감**: 화이트 배경 + 오렌지 메가폰.
- **금지 요소**: 공통 금지 요소와 동일. 클랩보드에 글자·숫자 금지.
- **생성 프롬프트**:
  `16:9 minimal still life photograph of an orange megaphone and a blank film clapperboard with no writing placed on a clean bright studio background, soft even lighting, official announcement mood, simple centered composition, photorealistic, no text, no logo, no watermark, no people.`
- **alt 텍스트**: 확성기와 빈 클랩보드로 표현한 공지사항 기본 이미지
- **저장 경로**: `public/images/presets/community/`
- **샘플 파일명**: `shootmon-community-notice-01.webp`

### 3.7.6 이벤트 기본

- **이름**: 커뮤니티 — 이벤트 기본
- **용도**: 이벤트 게시글 무이미지 기본 썸네일.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 선물 상자(무지)와 카메라, 은은한 컨페티가 있는 밝은 정물.
- **배경**: 밝은 단색 스튜디오 배경.
- **색감**: 화이트 배경 + 오렌지 리본/컨페티 포인트.
- **금지 요소**: 공통 금지 요소와 동일. 과한 파티 그라데이션 금지.
- **생성 프롬프트**:
  `16:9 bright still life photograph of a plain white gift box with an orange ribbon next to an unbranded camera, a few subtle orange and white confetti pieces on a clean studio background, cheerful event mood, soft even lighting, simple centered composition, photorealistic, no text, no logo, no watermark, no people.`
- **alt 텍스트**: 오렌지 리본 선물 상자와 카메라로 표현한 이벤트 기본 이미지
- **저장 경로**: `public/images/presets/community/`
- **샘플 파일명**: `shootmon-community-event-01.webp`

## 3.8 플레이스홀더 (7종)

공통: 저장 경로 `public/images/presets/placeholders/`. 스타일은 **플랫 라인 일러스트**.
규칙(AGENTS.md 9.7): 회색 박스만 쓰지 않는다. 카메라/프레임/조리개 아이콘을 약하게 넣는다. 상태 문구("이미지 없음", "심사중" 등)는 UI 텍스트로 표시하고 이미지 자체에는 넣지 않는다.
공통 색감: Page(#F8FAFC) 배경 + Line(#E5E7EB) 라인 + 오렌지(#F97316) 미세 포인트 1곳.
공통 금지 요소: 텍스트, 로고, 워터마크, 사진 요소, 진한 회색 단색 박스, 그라데이션.

### 3.8.1 이미지 없음

- **이름**: 플레이스홀더 — 이미지 없음
- **용도**: 공고·게시글 등 콘텐츠 이미지가 없을 때의 범용 대체 이미지.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 중앙의 옅은 카메라 외곽선 아이콘과 프레임 모서리 마크.
- **배경**: 아주 옅은 웜 그레이 단색.
- **색감**: 공통 색감 규칙. 렌즈 중앙 점 하나만 오렌지.
- **금지 요소**: 공통 금지 요소와 동일.
- **생성 프롬프트**:
  `Minimal flat vector-style placeholder illustration, a faint light gray outline icon of a camera centered on a very light warm gray background, thin frame corner marks near the edges, one tiny orange dot as the lens center accent, extremely subtle and clean, no text, no logo, no watermark, no photographic elements, no gradient.`
- **alt 텍스트**: 등록된 이미지가 없음을 나타내는 카메라 아이콘 자리표시 이미지
- **저장 경로**: `public/images/presets/placeholders/`
- **샘플 파일명**: `shootmon-placeholder-camera-01.webp`

### 3.8.2 프로필 없음

- **이름**: 플레이스홀더 — 프로필 없음
- **용도**: 프로필 커버/아바타 미등록 상태의 대체 이미지.
- **권장 크기**: 800×600 (커버용). 아바타 슬롯에는 3.5.1 기본 아바타를 사용.
- **비율**: 4:3
- **피사체**: 조리개 링 안에 옅은 사람 실루엣 외곽선.
- **배경**: 아주 옅은 웜 그레이 단색.
- **색감**: 공통 색감 규칙. 조리개 블레이드 한 조각만 오렌지.
- **금지 요소**: 공통 금지 요소와 동일. 이목구비 묘사 금지.
- **생성 프롬프트**:
  `Minimal flat vector-style placeholder illustration, a faint light gray aperture ring icon centered on a very light warm gray background with a subtle person silhouette outline inside it, no facial features, one aperture blade tinted soft orange as accent, extremely subtle and clean, no text, no logo, no watermark, no photographic elements, no gradient.`
- **alt 텍스트**: 프로필 이미지가 없음을 나타내는 자리표시 이미지
- **저장 경로**: `public/images/presets/placeholders/`
- **샘플 파일명**: `shootmon-placeholder-profile-01.webp`

### 3.8.3 회사 로고 없음

- **이름**: 플레이스홀더 — 회사 로고 없음
- **용도**: 기업회원 로고 미등록 시 공고 카드·기업 정보의 로고 슬롯 대체.
- **권장 크기**: 256×256
- **비율**: 1:1
- **피사체**: 사각 프레임 안의 옅은 빌딩 외곽선 아이콘.
- **배경**: 아주 옅은 웜 그레이 단색.
- **색감**: 공통 색감 규칙. 빌딩 창 하나만 오렌지 점.
- **금지 요소**: 공통 금지 요소와 동일. 실제 로고와 유사한 심볼 금지.
- **생성 프롬프트**:
  `Minimal flat vector-style placeholder illustration, a faint light gray outline icon of a simple office building inside a thin square frame, centered on a very light warm gray background, one small window tinted soft orange as accent, generic shape not resembling any real logo, extremely subtle and clean, no text, no logo, no watermark, no gradient.`
- **alt 텍스트**: 회사 로고가 없음을 나타내는 빌딩 아이콘 자리표시 이미지
- **저장 경로**: `public/images/presets/placeholders/`
- **샘플 파일명**: `shootmon-placeholder-logo-01.webp`

### 3.8.4 스토어 이미지 없음

- **이름**: 플레이스홀더 — 스토어 이미지 없음
- **용도**: 스토어 상품 썸네일 미등록 시 대체 이미지.
- **권장 크기**: 640×480
- **비율**: 4:3
- **피사체**: 열린 상자 외곽선과 그 위의 렌즈 아이콘.
- **배경**: 아주 옅은 웜 그레이 단색.
- **색감**: 공통 색감 규칙. 상자 리본 라인만 오렌지.
- **금지 요소**: 공통 금지 요소와 동일.
- **생성 프롬프트**:
  `Minimal flat vector-style placeholder illustration, a faint light gray outline icon of an open box with a small camera lens icon floating above it, centered on a very light warm gray background, one thin orange ribbon line on the box as accent, extremely subtle and clean, no text, no logo, no watermark, no photographic elements, no gradient.`
- **alt 텍스트**: 상품 이미지가 없음을 나타내는 상자 아이콘 자리표시 이미지
- **저장 경로**: `public/images/presets/placeholders/`
- **샘플 파일명**: `shootmon-placeholder-store-01.webp`

### 3.8.5 배너 준비중

- **이름**: 플레이스홀더 — 배너 준비중
- **용도**: 프리미엄 배너 슬롯에 집행 중인 광고가 없을 때 표시. "광고 문의" 등의 문구는 UI 텍스트로 얹는다.
- **권장 크기**: 940×230 (PC 기준. 모바일 슬롯은 720×180으로 리사이즈 크롭)
- **비율**: 약 4.09:1
- **피사체**: 와이드 프레임 모서리 마크와 중앙 좌측의 옅은 조리개 아이콘.
- **배경**: 아주 옅은 웜 그레이 단색.
- **색감**: 공통 색감 규칙. 조리개 중앙만 오렌지 점.
- **금지 요소**: 공통 금지 요소와 동일.
- **생성 프롬프트**:
  `Ultra-wide minimal flat vector-style placeholder illustration, thin light gray frame corner marks near the edges of a very light warm gray banner background, a faint aperture icon placed on the left third with a tiny orange center dot as accent, large empty space for UI text overlay, extremely subtle and clean, no text, no logo, no watermark, no gradient.`
- **alt 텍스트**: 준비 중인 배너 자리임을 나타내는 자리표시 이미지
- **저장 경로**: `public/images/presets/placeholders/`
- **샘플 파일명**: `shootmon-placeholder-banner-01.webp`

### 3.8.6 심사중

- **이름**: 플레이스홀더 — 심사중
- **용도**: 관리자 심사 대기 중인 공고/프로필/포트폴리오/상품의 썸네일 대체. "심사중" 배지는 UI로 표시.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 조리개 아이콘과 겹친 시계 바늘 모티프.
- **배경**: 아주 옅은 웜 그레이 단색.
- **색감**: 공통 색감 규칙. 시계 바늘만 오렌지.
- **금지 요소**: 공통 금지 요소와 동일. 경고 느낌의 빨간색 금지.
- **생성 프롬프트**:
  `Minimal flat vector-style placeholder illustration, a faint light gray aperture ring icon centered on a very light warm gray background with thin clock hands overlapping its center, clock hands tinted soft orange as the only accent, calm waiting mood, extremely subtle and clean, no text, no logo, no watermark, no gradient.`
- **alt 텍스트**: 심사가 진행 중임을 나타내는 자리표시 이미지
- **저장 경로**: `public/images/presets/placeholders/`
- **샘플 파일명**: `shootmon-placeholder-review-01.webp`

### 3.8.7 비공개

- **이름**: 플레이스홀더 — 비공개
- **용도**: 비공개 처리된 공고/프로필/게시글의 썸네일 대체. "비공개" 배지는 UI로 표시.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 닫힌 렌즈 캡 형태의 원형 아이콘과 작은 자물쇠 외곽선.
- **배경**: 아주 옅은 웜 그레이 단색.
- **색감**: 공통 색감 규칙. 자물쇠 고리만 오렌지.
- **금지 요소**: 공통 금지 요소와 동일. 위압적인 어두운 톤 금지.
- **생성 프롬프트**:
  `Minimal flat vector-style placeholder illustration, a faint light gray circular lens cap icon centered on a very light warm gray background with a small padlock outline in front of it, padlock shackle tinted soft orange as the only accent, neutral private mood, extremely subtle and clean, no text, no logo, no watermark, no gradient.`
- **alt 텍스트**: 비공개 상태임을 나타내는 자물쇠 아이콘 자리표시 이미지
- **저장 경로**: `public/images/presets/placeholders/`
- **샘플 파일명**: `shootmon-placeholder-private-01.webp`

## 3.9 관리자용 기본 이미지 (3종)

CLAUDE.md 9장 필수 묶음이지만 AGENTS.md 9장에 누락되어 있어 이 문서에서 신규 정의한다.
저장 경로 `public/images/presets/admin/` (신규). 스타일은 플레이스홀더와 같은 플랫 라인 일러스트 계열로 통일하되, 운영 화면임을 고려해 채도를 더 낮춘다.
공통 금지 요소: 텍스트, 로고, 워터마크, 사진 요소, 화려한 색, 그라데이션.

### 3.9.1 관리자 대시보드 빈 상태

- **이름**: 관리자 — 대시보드 빈 상태
- **용도**: 관리자 대시보드/목록에서 데이터가 0건일 때의 빈 상태(empty state) 일러스트. "데이터가 없습니다" 등의 문구는 UI 텍스트로 표시.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 빈 클립보드 외곽선과 그 옆의 작은 조리개 아이콘, 점선 리스트 표시.
- **배경**: 아주 옅은 웜 그레이 단색.
- **색감**: Line(#E5E7EB) 라인 위주, 클립보드 클립만 옅은 오렌지.
- **금지 요소**: 공통 금지 요소와 동일. 클립보드 위 글자·체크표기 금지.
- **생성 프롬프트**:
  `Minimal flat vector-style empty state illustration for an admin dashboard, a faint light gray outline of a blank clipboard with three short dashed placeholder lines that are clearly not letters, a small aperture icon beside it, very light warm gray background, clipboard clip tinted soft orange as the only accent, extremely subtle calm and clean, no text, no letters, no logo, no watermark, no gradient.`
- **alt 텍스트**: 표시할 데이터가 없음을 나타내는 관리자 빈 상태 일러스트
- **저장 경로**: `public/images/presets/admin/`
- **샘플 파일명**: `shootmon-admin-empty-01.webp`

### 3.9.2 관리자 기본 썸네일

- **이름**: 관리자 — 기본 썸네일
- **용도**: 관리자 심사/관리 테이블·상세 패널에서 대상 콘텐츠(공고·프로필·상품)에 이미지가 없을 때 쓰는 관리자 전용 기본 썸네일. 사용자 화면 플레이스홀더와 구분되도록 톤을 더 차분하게.
- **권장 크기**: 640×360
- **비율**: 16:9
- **피사체**: 사각 프레임 안 필름 프레임(구멍 뚫린 필름 스트립) 외곽선 아이콘.
- **배경**: 옅은 쿨 그레이 단색(사용자용보다 반 단계 진하게).
- **색감**: 뮤트 그레이 라인, 필름 한 칸만 옅은 오렌지.
- **금지 요소**: 공통 금지 요소와 동일.
- **생성 프롬프트**:
  `Minimal flat vector-style default thumbnail illustration for an admin panel, a faint gray outline icon of a film strip with sprocket holes inside a thin rectangular frame, centered on a light cool gray background slightly deeper than white, one film frame tinted soft orange as the only accent, restrained administrative tone, extremely subtle and clean, no text, no logo, no watermark, no gradient.`
- **alt 텍스트**: 콘텐츠 이미지가 없는 항목의 관리자용 기본 썸네일
- **저장 경로**: `public/images/presets/admin/`
- **샘플 파일명**: `shootmon-admin-thumb-01.webp`

### 3.9.3 관리자 계정 아바타

- **이름**: 관리자 — 계정 아바타
- **용도**: 관리자 계정 표시(헤더·처리자 기록·메모 작성자)용 기본 아바타. 일반 회원 아바타와 즉시 구분.
- **권장 크기**: 256×256
- **비율**: 1:1
- **피사체**: 방패 외곽선 안에 조리개 아이콘을 결합한 심볼.
- **배경**: 옅은 쿨 그레이 단색 원형.
- **색감**: 잉크색 방패 라인 + 조리개 중앙 오렌지 점.
- **금지 요소**: 공통 금지 요소와 동일. 사람 형태 미포함.
- **생성 프롬프트**:
  `Minimal flat vector-style avatar icon of a simple shield outline containing a camera aperture symbol, centered inside a circle, light cool gray background, dark ink line work with a small orange dot at the aperture center as the only accent, authoritative but friendly administrative symbol, clean geometric illustration, no text, no logo, no watermark, no human face, no gradient.`
- **alt 텍스트**: 방패와 조리개로 표현한 관리자 계정 아바타
- **저장 경로**: `public/images/presets/admin/`
- **샘플 파일명**: `shootmon-admin-avatar-01.webp`

---

## 4. 화면-프리셋 매핑 표

어느 화면의 어느 슬롯에 어떤 프리셋이 들어가는지 정의한다. 슬롯에 실제 업로드 이미지가 있으면 그것이 우선이고, 없을 때 아래 기본/대체 이미지를 쓴다.

| 화면 | 슬롯 | 기본 프리셋 | 대체(이미지 없음 시) |
| --- | --- | --- | --- |
| PC 메인 | 상단 히어로 배경 | 3.1.1 히어로 PC | — (필수 상시 표시) |
| 모바일 메인 | 상단 히어로 배경 | 3.1.2 히어로 모바일 | — (필수 상시 표시) |
| PC 메인 | 프리미엄 배너 (940×230) | 광고주 업로드 소재 | 3.2.1 배너 PC → 미집행 시 3.8.5 배너 준비중 |
| 모바일 메인 | 프리미엄 배너 (720×180) | 광고주 업로드 소재 | 3.2.2 배너 모바일 → 미집행 시 3.8.5 배너 준비중 |
| 촬영자 모집 목록/메인 공고 카드 | 카드 썸네일 (640×360) | 3.3.x 공고 카테고리별 모집 카드 | 3.8.1 이미지 없음 |
| 촬영자 모집 상세 | 상단 대표 이미지 | 목록과 동일 이미지 재사용 | 3.8.1 이미지 없음 |
| 공고 카드/상세 | 회사 로고 슬롯 | 기업 업로드 로고 | 3.8.3 회사 로고 없음 (또는 3.5.5 기업 아바타) |
| 촬영자 프로필 목록 | 카드 커버 (800×600 크롭) | 3.4.x 분야별 프로필 커버 | 3.8.2 프로필 없음 |
| 촬영자 프로필 상세 | 상단 커버 + 포트폴리오 그리드 | 3.4.x 커버, 포트폴리오는 회원 업로드 | 3.8.2 프로필 없음 |
| 프로필/커뮤니티/댓글/마이페이지 | 아바타 (256×256 원형) | 3.5.1~3.5.5 회원 유형별 아바타 | 3.5.1 개인 기본 |
| 스토어 목록/상세 | 상품 썸네일 (640×480) | 3.6.x 카테고리별 스토어 썸네일 | 3.8.4 스토어 이미지 없음 |
| 커뮤니티 목록 | 카드 썸네일 (640×360) | 게시글 첨부 이미지 | 3.7.1~3.7.4 게시판별 기본 |
| 공지사항/이벤트 목록 | 카드 썸네일 (640×360) | 3.7.5 공지 기본 / 3.7.6 이벤트 기본 | 동일 |
| 심사 대기 콘텐츠 (사용자 화면) | 해당 슬롯 | 3.8.6 심사중 | — |
| 비공개 콘텐츠 (사용자 화면) | 해당 슬롯 | 3.8.7 비공개 | — |
| 관리자 대시보드/목록 0건 | 빈 상태 영역 | 3.9.1 대시보드 빈 상태 | — |
| 관리자 심사/관리 테이블 | 대상 콘텐츠 썸네일 | 대상의 실제 이미지 | 3.9.2 관리자 기본 썸네일 |
| 관리자 헤더/처리 기록 | 관리자 아바타 | 3.9.3 관리자 계정 아바타 | — |

샘플 데이터 매핑(AGENTS.md 10장)과의 연결:

| 샘플 공고 | 사용 프리셋 |
| --- | --- |
| 브랜드 홍보영상 촬영자 모집 | `shootmon-job-brand-01/02` |
| 유튜브 채널 촬영 PD 모집 | `shootmon-job-youtube-01/02` |
| 숏폼 릴스 촬영자 모집 | `shootmon-job-shortform-01/02` |
| 웨딩 본식 촬영팀 모집 | `shootmon-job-wedding-01/02` |
| 기업 행사 스케치 촬영 | `shootmon-job-event-01/02` |
| 제품 상세페이지 촬영 | `shootmon-job-product-01/02` |
| 인터뷰 콘텐츠 촬영 | `shootmon-job-interview-01/02` |
| 드론 항공 촬영 | `shootmon-job-drone-01/02` |

| 샘플 프로필 | 사용 프리셋 |
| --- | --- |
| 상업 광고 촬영감독 | `shootmon-profile-ad-director-01` |
| 웨딩 전문 촬영자 | `shootmon-profile-wedding-01` |
| 드론 촬영 가능 촬영자 | `shootmon-profile-drone-01` |
| 라이브 송출팀 | `shootmon-profile-live-01` |
| 제품 촬영 스튜디오 | `shootmon-profile-product-01` |
| 인터뷰 전문 촬영자 | `shootmon-profile-interview-01` |

| 샘플 스토어 상품 | 사용 프리셋 |
| --- | --- |
| 반나절 제품 촬영 패키지 | `shootmon-store-product-01` |
| 드론 항공 촬영 패키지 | `shootmon-store-drone-01` |
| 스튜디오 3시간 대관 | `shootmon-store-studio-rental-01` |
| 인터뷰 촬영 세팅 패키지 | `shootmon-store-package-01` |
| 조명/오디오 장비 대여 | `shootmon-store-lighting-audio-01` |
| 라이브 송출 패키지 | `shootmon-store-live-01` |

---

## 5. 생성 우선순위

### 5.1 1차 최소 세트 (1차 구현 화면 기준, 총 38장)

1차 구현 범위(AGENTS.md 6장: 메인, 모집 목록/상세, 프로필 목록/상세, 로그인, 서비스안내, 마이페이지, 기업 인증, 관리자 심사)에 필요한 최소 이미지.

| 순서 | 항목 | 수량 |
| --- | --- | --- |
| 1 | 플레이스홀더 7종 (3.8) — 모든 화면의 안전망이므로 최우선 | 7 |
| 2 | 아바타 5종 (3.5) | 5 |
| 3 | 메인 히어로 PC/모바일 (3.1) | 2 |
| 4 | 프리미엄 배너 PC/모바일 기본 소재 (3.2) | 2 |
| 5 | 모집 카드 — 샘플 매핑 8개 카테고리 × 2장 (브랜드/유튜브/숏폼/웨딩/행사/제품/인터뷰/드론) | 16 |
| 6 | 프로필 커버 — 샘플 매핑 6종 (광고감독/웨딩/드론/라이브/제품/인터뷰) | 6 |

플레이스홀더와 아바타가 준비되면 나머지 이미지가 늦어도 화면이 깨지지 않는다.

### 5.2 2차 확장 세트 (총 34장 + 선택 변형 4장, 누적 72장)

| 순서 | 항목 | 수량 |
| --- | --- | --- |
| 7 | 모집 카드 — 나머지 6개 카테고리 × 2장 (라이브/스튜디오/공간/뷰티/교육/스포츠) | 12 |
| 8 | 프로필 커버 — 나머지 3종 (패션/행사팀/스튜디오 운영자) | 3 |
| 9 | 스토어 썸네일 10종 (3.6) | 10 |
| 10 | 커뮤니티/공지 썸네일 6종 (3.7) | 6 |
| 11 | 관리자용 3종 (3.9) | 3 |
| 12 | 히어로/배너 변형 추가분 (`-02` 순번, 선택) | 4 |

### 5.3 생성 후 검수 체크리스트

- [ ] 1.3 품질 통과 기준 전 항목 충족
- [ ] 파일명이 2.2 규칙과 일치
- [ ] WebP 저장, 지정 크기와 비율 일치
- [ ] 모바일 크롭(중앙 60%) 시 핵심 피사체 유지
- [ ] 같은 카테고리 `-01`/`-02`가 서로 구분되는 구도
- [ ] alt 텍스트가 본 문서 값으로 코드에 반영
