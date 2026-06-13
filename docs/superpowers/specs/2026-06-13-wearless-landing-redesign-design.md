# Wearless 랜딩페이지 재설계 — 설계 문서 (Design Spec)

- 작성일: 2026-06-13
- 브랜치: `redesign/landing-studio`
- 대상: `wearless.kr` 랜딩페이지 (Next.js 16 / React 19 / Tailwind v4, `src/app` · `src/components`)
- 비대상: 제품 앱(`ai.wearless.kr`, `src3/` Vite SPA)은 이번 작업에서 코드 변경하지 않는다. 디자인 언어의 **참조 소스**로만 사용한다.

---

## 1. 배경과 목표

Wearless는 "단순 의류컷 제작"에서 **AI 상세페이지 제작 스튜디오**로 피봇했다(업로드 → AI 분석 → 마네킹컷 → 콘티보드 → 에디터 → 다운로드). 현재 랜딩은 옛 포지셔닝 + 비비드한 블루/퍼플/마젠타 그라데이션 오브 + "시작하기 → 설문(SurveyInline)" 구조다.

이 작업의 목표:

1. **재설계**: 기존 섹션 구조를 그대로 답습하지 않고, 스튜디오 포지셔닝에 맞게 정보 구조를 다시 짠다(접근법 A — "스튜디오 워크스루").
2. **디자인 전환**: Cal.com 계열 화이트 모노크롬 시스템 + 4색 glow 토큰(sky/sage/sun/mauve)을 **배경 오브·오로라와 미세 accent ring에만** 쓰는 시스템으로 교체한다.
3. **CTA 동작 변경**: "시작하기"가 설문을 열지 않고 `ai.wearless.kr`로 바로 이동한다.
4. **이미지**: 필요한 비주얼을 Gemini로 빌드타임 생성해 정적 자산으로 커밋한다.
5. **모션**: 절제된 스크롤·호버·entrance 애니메이션을 토큰화된 방식으로 넣는다.

비목표(YAGNI): 다국어, 다크모드, 실제 결제/요금제 표(크레딧 단가 미확정), 블로그/CMS, A/B 테스트 인프라.

---

## 2. 디자인 원칙 (반드시 지킬 규칙)

`wearless-design-transfer.md` · `src3/styles/tokens.css` 기준:

- 한 화면에 **glow zone은 최대 1개**. (히어로 = 오브 1존, 그 외 섹션은 흰 캔버스.)
- `--glow-*` 4색은 **배경 오브/오로라**와 **일부 생성/강조 ring**(glow-chip, glow-cta, 단계 progress)에만. 일반 버튼 fill·텍스트·아이콘·카드 배경·일반 border에는 쓰지 않는다.
- **CTA는 검정 계열**(warm near-black pill `#2C2C2C` → hover `#1B1B1B`). 컬러 fill 버튼을 만들지 않는다.
- 경계선은 CSS `border`보다 `box-shadow: 0 0 0 1px var(--ring)` 계열(= `--elev-*`)을 우선.
- glow 위에 텍스트를 직접 올리지 않고, 흰 카드 또는 glass plate 위에서 읽히게 한다.
- 한글 헤드라인은 **Pretendard**(무거운 weight). Cal Sans는 라틴 전용이므로 `Wearless` 워드마크·영문 라벨에만.

---

## 3. 정보 구조 (섹션 순서)

```
[Header]   wearless 로고 · 기능 · 작동 방식 · [시작하기 → app]
[Hero]     glow-chip "AI 상세페이지 스튜디오"
           H1   제품 사진만 올리세요. 상세페이지는 AI가.
           sub  분석 · 마네킹컷 · 콘티 · 에디터까지 한 번에.
           [무료로 시작하기 → app]   [작동 방식 보기 ↓]
           히어로 비주얼(glass plate 위 스튜디오 캔버스 / before→after)
           배경: 오브 glow 1존
[Trust]    파트너 로고 스트립(public의 eko/oac/teenz 실제 로고) + 핵심 수치 1~2개
[Flow]     작동 방식 — 실제 4단계
           1 업로드 & AI 분석     2 마네킹컷 핏 확정
           3 콘티보드 구성(6~26컷) 4 에디터 편집 & 다운로드(긴 PNG/ZIP)
[Features] 왜 Wearless — 화이트 글래스 카드 그리드(6개)
[Showcase] 컷 종류 예시(스타일링컷/호리존컷/제품컷) 가로 스트립
[FinalCTA] 큰 한 줄 + [시작하기 → app] (subtle glow/glass)
[Footer]   wearless · 대표자/이메일 · copyright
```

빼는 것: 무거운 후기 섹션, 하드 요금제 표. (요금제는 생략하거나 "곧 공개" 한 줄로만.)

### 섹션별 의도

- **Hero**: 변환(제품 사진 → 완성 상세페이지)을 한눈에. 메인 CTA는 4색 conic ring을 두른 `glow-cta`로 포인트.
- **Trust**: `public/`에 실재하는 파트너 로고(eko/oac/teenz)로 가벼운 사회적 증거. 수치는 제품 근거가 있는 것만(예: 한 번에 6~26컷, 4단계 자동화). 과장 금지.
- **Flow**: 랜딩의 중심. PRD의 실제 플로우를 4스텝 글래스 카드로. 각 카드에 생성 이미지 + 캡션.
- **Features**: 의류 동일성 보존 · 색상별 컷 · 자동 카피라이팅 · 크레딧 사전 예고 · 캔버스 에디터 · 마네킹 핏 조정. Lucide 라인 아이콘, 흰 카드, `--elev-card`.
- **Showcase**: 컷 종류 3종 생성 이미지로 결과물 퀄리티 어필(접근법 B 흡수).
- **FinalCTA**: 전환 마무리.

---

## 4. 비주얼 시스템

### 4.1 토큰
`src3/styles/tokens.css`의 토큰을 `src/app/globals.css`로 포팅한다(중복/충돌 없는 네임스페이스):
`--font-display/body/mono`, `--fg-1/2/3`, `--bg-1/2`, `--glow-sky/sage/sun/mauve`, `--glass-bg/blur`, `--elev-*`, `--ring/--ring-strong`, `--cta-*`, `--r-*`, `--sp-*`, `--container`. 기존 Tailwind v4 설정은 유지하되 색은 토큰을 단일 출처로 한다.

### 4.2 배경(오브 + 오로라)
`wearless-design-transfer.md` §5의 CSS를 그대로 사용한다. 고정 `.wearless-bg`(z-0) 안에 `.edge`(side aurora wash) + `.orb-bg`(center orb, `l1~l3` + `hi`). `--glow-a ≈ 0.7`. 스크롤에 따라 opacity 조절(기존 `luminous-orb-background`의 스크롤 로직 재사용, 색만 4색 토큰으로 교체). `prefers-reduced-motion`에서 회전 애니메이션 정지.

### 4.3 타이포그래피
- Display(라틴/워드마크): **Cal Sans** — Google Fonts, `<head>` preconnect + link. 24px+ 에서만, 단일 weight.
- Body/UI/한글: **Pretendard Variable** — self-host `public/fonts/PretendardVariable.woff2`(없으면 `src3/fonts`에서 복사). weight 300–600.
- Mono: Roboto Mono(선택적).
- 시맨틱 클래스 `.display-hero/.h1/.h2/.h3/.lead/.body/.caption/.ui-label`를 토큰 기반으로 제공.

### 4.4 컴포넌트
- `Button`(리토큰): primary = near-black pill, ghost = hairline ring, 둘 다 토큰 사용. focus는 double ring(`--cta-focus-ring`).
- `GlowCTA`: near-black fill + 4색 conic ring(`@property --gen-ang` 회전). 히어로/FinalCTA 메인 CTA에만.
- `GlowChip`: 흰 배경 + 4색 conic ring. 히어로 eyebrow에.
- `GlassCard`: `--glass-bg` + `--glass-blur` + `--elev-lift`. glow 위 콘텐츠에.
- `Card`(일반): 흰 surface + `--elev-card`(ring/diffuse/contact), CSS border 없음.

---

## 5. CTA / 라우팅

- `src/lib/config.ts`: `export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ai.wearless.kr';`
- 모든 "시작하기/무료로 시작하기" CTA는 `<a href={APP_URL} target="_blank" rel="noopener noreferrer">`.
- Header CTA, Hero 메인 CTA, FinalCTA가 동일 `APP_URL` 사용.
- `SurveyInline`/`SurveyModal`은 더 이상 import하지 않는다(파일은 계획 단계에서 제거 여부 결정).

---

## 6. 이미지 생성 (Gemini)

- 스크립트: `scripts/generate-images.mjs` (Node, ESM). `@google/genai` SDK 사용, `.env.local`의 `GEMINI_API_KEY` 로드.
- 모델: `process.env.MODEL_ROUTING_IMAGE_HIGH ?? 'gemini-3-pro-image'` (docs의 "Nano Banana Pro"). **구현 시 Gemini 공식 문서로 모델 id·이미지 출력 호출 방식 재확인 후 고정**, 실패 시 알려진 이미지 모델로 폴백.
- 런타임 호출 없음. 빌드타임/수동 1회 실행 → `public/generated/`에 저장 → 정적 커밋.
- 프롬프트 공통 가이드: 순백 배경, soft 파스텔 glow(sky/sage/sun/mauve) accent, 패션 이커머스, 사람 얼굴 클로즈업 회피, 깔끔한 스튜디오 톤.

생성 에셋 목록:

| 파일 | 용도 | 비율(가이드) |
|---|---|---|
| `public/generated/hero-studio.webp` | 히어로 비주얼(제품 사진 → 완성 상세페이지/캔버스) | ~16:10 |
| `public/generated/step-1-analyze.webp` | 업로드 & AI 분석 | 4:3 |
| `public/generated/step-2-mannequin.webp` | 마네킹컷 핏 | 4:3 |
| `public/generated/step-3-storyboard.webp` | 콘티보드 구성 | 4:3 |
| `public/generated/step-4-editor.webp` | 에디터 & 다운로드 | 4:3 |
| `public/generated/cut-styling.webp` | 스타일링컷 예시 | 3:4 |
| `public/generated/cut-horizon.webp` | 호리존컷 예시 | 3:4 |
| `public/generated/cut-product.webp` | 제품컷 예시 | 3:4 |

**Placeholder 전략**: 키가 들어오기 전에도 빌드/레이아웃이 깨지지 않도록, 각 경로에 가벼운 placeholder 자산(토큰색 단색 또는 glass 스켈레톤 svg/webp)을 먼저 커밋한다. `GeneratedImage` 래퍼가 자산을 렌더하고, 스크립트가 실제 이미지로 덮어쓴다. 로딩 시 미세 shimmer.

---

## 7. 파일/컴포넌트 구조

신규/변경:

- `src/app/page.tsx` — 새 섹션 조립.
- `src/app/layout.tsx` — Cal Sans 링크, 메타데이터 카피(스튜디오 포지셔닝), Header/Footer 유지.
- `src/app/globals.css` — 토큰 + 오브/오로라/글래스/glow 유틸 + 모션 keyframes.
- `src/lib/config.ts` — `APP_URL`.
- `src/components/background/WearlessBackground.tsx` — 오브+오로라(스크롤 opacity). `luminous-orb-background` 대체.
- `src/components/sections/{Hero,TrustStrip,StudioFlow,Features,Showcase,FinalCTA}.tsx` — 신규.
- `src/components/ui/{Button(리토큰),GlowCTA,GlowChip,GlassCard,GeneratedImage}.tsx`.
- `src/components/common/Header.tsx`, `Footer.tsx` — 토큰 리스타일 + CTA를 `APP_URL` 링크로.
- `scripts/generate-images.mjs` + `public/generated/*` (placeholder 포함).

미사용 처리(계획 단계에서 삭제 여부 결정): `src/components/posts/*`(기존 섹션), `src/components/survey/*`, `luminous-orb-background.tsx`.

---

## 8. 카피 초안 (수정 가능)

- Hero H1: "제품 사진만 올리세요. 상세페이지는 AI가."
- Hero sub: "분석부터 마네킹컷, 콘티, 에디터까지 — 제품 사진 몇 장이면 충분합니다."
- Hero chip: "AI 상세페이지 스튜디오"
- 메인 CTA: "무료로 시작하기" / 보조: "작동 방식 보기"
- Flow 스텝 제목: ① 업로드 & AI 분석 ② 마네킹컷으로 핏 확정 ③ 콘티보드로 구성 ④ 에디터에서 완성·다운로드
- FinalCTA: "촬영은 그만. 상세페이지는 지금 시작하세요." + "시작하기"

Footer 회사 정보(대표자 정일상 / contact@wearless.kr / © 2026 Wearless)는 유지한다.

---

## 9. 모션 / 애니메이션

토큰화된 절제된 모션. 모두 `prefers-reduced-motion: reduce`에서 비활성/정지.

- **배경 오브**: `orbA/orbB` 느린 회전(12–17s), 스크롤 연동 opacity.
- **Hero entrance**: chip → H1 → sub → CTA → 비주얼 순 stagger fade-up(`fadeInUp`, 60–120ms 간격, `cubic-bezier(0.16,1,0.3,1)`).
- **glow-cta / glow-chip**: conic ring 천천히 회전(9s).
- **스크롤 reveal**: 각 섹션 진입 시 `IntersectionObserver` 기반 fade-up(once). 라이브러리 없이 작은 훅(`useReveal`).
- **Flow 4스텝**: 스크롤에 따라 순차 reveal + 좌측 진행 인디케이터(현재 단계 4색 ring 강조). 데스크톱에서 스텝 카드 hover 시 미세 lift.
- **Trust 로고**: 느린 marquee(또는 정적 그리드) — reduced-motion에서 정적.
- **카드 hover**: `translateY(-2~4px)` + shadow 강화(`--elev-lift`), 150ms.
- **Showcase**: 가로 스크롤/스냅 또는 hover 확대(미세).
- 성능: 변형은 `transform`/`opacity`만, `will-change` 최소.

---

## 10. 접근성 / 반응형 / 성능

- 배경 `.wearless-bg`는 `aria-hidden`, `pointer-events:none`.
- 텍스트는 항상 흰 surface 위(glow 위 직접 X) → 대비 확보. 본문/2차 텍스트 색은 `--fg-1/2`.
- 모든 CTA 키보드 포커스 링(double ring). 이미지 `alt` 필수. 링크 `rel="noopener"`.
- 모바일 우선, `--container 1200px`, 섹션은 모바일에서 stack. 헤더는 모바일 메뉴 유지.
- Pretendard self-host, Cal Sans preconnect. 이미지 webp + `next/image`. 오브는 CSS-only.

---

## 11. 가정 / 오픈 이슈

- `GEMINI_API_KEY`는 사용자가 `.env.local`에 추가한다(현재 부재). 추가 전까지 placeholder로 동작.
- `ai.wearless.kr`은 아직 미연결 — 링크는 바로 연결(연결 시 자동 동작). `NEXT_PUBLIC_APP_URL`로 오버라이드 가능.
- Gemini 이미지 모델 id/SDK 호출 방식은 구현 시 공식 문서로 재확인.
- 파트너 로고(eko/oac/teenz)는 실재 자산으로 가정하고 사용. 사용 권리 문제 있으면 Trust 스트립 축소.
- 수치는 제품 근거 있는 것만(컷 수, 단계 수). 검증 불가한 "200+" 류는 과장 없이 쓰거나 생략.

---

## 12. 수용 기준 (Acceptance)

1. `/` 가 새 섹션 구조(Header/Hero/Trust/Flow/Features/Showcase/FinalCTA/Footer)로 렌더된다.
2. 배경이 4색 glow 오브/오로라이고, 화면당 glow zone 1개 원칙을 지킨다(비비드 블루/퍼플/마젠타 오브 제거).
3. 모든 "시작하기" CTA가 `APP_URL`(기본 `https://ai.wearless.kr`) 새 탭으로 이동하고, 설문 모달이 더 이상 열리지 않는다.
4. CTA·칩·카드가 토큰 시스템(near-black pill, hairline ring, glass)으로 렌더되고, 컬러 fill 버튼이 없다.
5. 이미지 경로가 `public/generated/*`를 참조하고, 키 없이도 placeholder로 레이아웃이 깨지지 않으며, `scripts/generate-images.mjs`로 생성 시 실제 이미지로 대체된다.
6. 스크롤 reveal·hero stagger·오브 회전 등 모션이 동작하고 `prefers-reduced-motion`에서 정지한다.
7. `next build`(또는 `next dev`)가 에러 없이 통과하고 콘솔 경고가 없다.
8. 모바일/데스크톱 반응형이 깨지지 않는다.
