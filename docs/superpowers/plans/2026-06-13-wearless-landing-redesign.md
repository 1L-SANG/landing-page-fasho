# Wearless Landing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the `wearless.kr` Next.js landing page as a studio-walkthrough (approach A): white monochrome system + 4-color glow tokens, CTA → `ai.wearless.kr`, Gemini build-time images, tasteful motion.

**Architecture:** Port `src3/styles/tokens.css` design tokens + orb/aurora/glass/glow CSS into `src/app/globals.css`. Build a fixed CSS-only background and a set of focused section components assembled in `page.tsx`. All "시작하기" CTAs link to `APP_URL` env. Images are generated once by a Node script into `public/generated/` (placeholders committed first so build never breaks).

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4, lucide-react, `@google/genai` (build-time only), Cal Sans (Google Fonts) + Pretendard (self-host).

**Verification model:** No unit-test runner exists and the work is visual. Each task verifies with `npx next build` (or `next dev` smoke) + `npx eslint` and a described visual check. Commit after each task.

---

### Task 1: Design tokens + globals.css foundation

**Files:**
- Modify: `src/app/globals.css`
- Verify: `public/fonts/PretendardVariable.woff2` exists (copy from `src3/fonts/` if missing)

- [ ] Ensure `public/fonts/PretendardVariable.woff2` exists (copy `src3/fonts/PretendardVariable.woff2` if absent).
- [ ] Into `globals.css` (keeping `@import "tailwindcss"`), add `:root` Wearless tokens from `src3/styles/tokens.css` §3: `--font-display/body/mono`, `--fg-1/2/3`, `--bg-1/2`, `--ink-overlay`, `--link`, `--cta-*`, `--ring/--ring-strong/--focus`, `--glow-sky/sage/sun/mauve`, `--glass-bg/blur`, `--elev-*`, `--sp-*`, `--r-*`, `--container`, plus `--glow-a:1`.
- [ ] Add `@font-face` for Cal Sans? No — load via Google Fonts `<link>` in layout. Keep Pretendard `@font-face` pointing to `/fonts/PretendardVariable.woff2`.
- [ ] Add semantic type utility classes `.display-hero/.h1/.h2/.h3/.lead/.body/.caption/.ui-label/.eyebrow` from tokens.css §"SEMANTIC TYPE" (Korean headlines use `--font-body`/Pretendard; only `.display-hero`/wordmark may use `--font-display`).
- [ ] Keep existing `body { white-space: pre-line }` behavior intact (existing copy relies on it). Set body font to Pretendard.
- [ ] Verify: `npx next build` passes.
- [ ] Commit: `feat(landing): port Wearless design tokens into globals.css`

---

### Task 2: Orb + aurora background utilities (CSS) + motion keyframes

**Files:**
- Modify: `src/app/globals.css`

- [ ] Add `@property --gen-ang`, `@property --sp-ang` (`<angle>`, initial 0deg).
- [ ] Add orb/aurora CSS from transfer doc §5: `.wearless-bg`, `.orb-bg` (+ `.l1/.l2/.l3/.hi`), `.edge`, `@keyframes orbA/orbB`, the `@media (min-width…)` orb-scale steps, and the `prefers-reduced-motion` rule that disables `.l1/.l2/.l3` animation. Use the 4 glow tokens (no vivid colors).
- [ ] Add glow component CSS from transfer doc §6: `.wearless-glow-chip`, `.wearless-glow-cta` (+ hover), `@keyframes spChipSpin/genRingSpin`, reduced-motion disable.
- [ ] Add glass plate CSS from §7: `.wearless-glass`.
- [ ] Add reusable motion keyframes: keep `fadeInUp`/`.animate-fade-in` (already present), add `.reveal`/`.reveal.in` (opacity/translateY transition) for scroll reveal, and a `marquee` keyframes for the logo strip.
- [ ] Verify: `npx next build` passes.
- [ ] Commit: `feat(landing): add orb/aurora/glass/glow + motion CSS`

---

### Task 3: App config (APP_URL)

**Files:**
- Create: `src/lib/config.ts`

- [ ] `export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ai.wearless.kr';`
- [ ] Verify: import compiles in build.
- [ ] Commit: `feat(landing): add APP_URL config`

---

### Task 4: Background component

**Files:**
- Create: `src/components/background/WearlessBackground.tsx`

- [ ] Client component. Renders `<div className="wearless-bg" aria-hidden><div className="edge"/><div className="orb-bg"><div className="l1"/>…<div className="hi"/></div></div>`.
- [ ] Reuse scroll→opacity logic from `luminous-orb-background.tsx` but apply to the wrapper's `--glow-a` (default ~0.72), clamped. Passive scroll listener, cleanup on unmount.
- [ ] Verify: `next dev`, orb is soft 4-color pastel (no vivid blue/purple/magenta), fixed behind content.
- [ ] Commit: `feat(landing): WearlessBackground orb/aurora component`

---

### Task 5: UI primitives

**Files:**
- Modify: `src/components/ui/button.tsx`
- Create: `src/components/ui/glow-cta.tsx`, `src/components/ui/glow-chip.tsx`, `src/components/ui/glass-card.tsx`, `src/components/ui/generated-image.tsx`

- [ ] `button.tsx`: retoken variants — `primary`/`cta` = near-black pill via `--cta-bg`/hover `--cta-bg-hover`, `--cta-radius`, double focus ring; `ghost` = transparent + `box-shadow:0 0 0 1px var(--ring)` hairline. Remove hardcoded `#1A1A1A`. Keep `size` API.
- [ ] `glow-cta.tsx`: `<a>` (or button) with class `wearless-glow-cta` + label; accepts `href`, opens new tab when external.
- [ ] `glow-chip.tsx`: `<span className="wearless-glow-chip">` for the hero eyebrow.
- [ ] `glass-card.tsx`: wrapper with `wearless-glass` + padding; accepts `className`/children.
- [ ] `generated-image.tsx`: wraps `next/image`; takes `src` under `/generated/...`, `alt`, sizes; renders a token-colored glass skeleton (CSS) underneath so a placeholder file or slow load looks intentional.
- [ ] Verify: `npx next build` + `npx eslint`.
- [ ] Commit: `feat(landing): token-based UI primitives (button, glow-cta/chip, glass-card, generated-image)`

---

### Task 6: Header + Footer restyle

**Files:**
- Modify: `src/components/common/Header.tsx`, `src/components/common/Footer.tsx`

- [ ] Header: wordmark `Wearless` (keep logo.png), nav `기능`/`작동 방식` (anchors to section ids `features`/`how`), CTA "시작하기" as `<a href={APP_URL} target="_blank" rel="noopener noreferrer">` styled near-black pill (token). Remove `문의하기`/contact-scroll CTA and `요금제` nav. Keep mobile menu, retoken colors to `--fg-*`/`--ring`. Keep blur backdrop.
- [ ] Footer: retoken text colors to `--fg-2/3`, hairline top via `--ring`, keep 대표자/이메일/copyright. Replace `#contact` link with `mailto:contact@wearless.kr` (no contact section anymore).
- [ ] Verify: `next dev` header/footer render, CTA opens APP_URL new tab.
- [ ] Commit: `feat(landing): retoken Header and Footer, CTA → APP_URL`

---

### Task 7: useReveal hook (scroll reveal)

**Files:**
- Create: `src/lib/use-reveal.ts`

- [ ] `useReveal()` returns a `ref` and toggles `.in` (or returns boolean) when the element enters viewport via `IntersectionObserver` (once, ~12% threshold). SSR-safe (guard `window`). Respects reduced-motion by revealing immediately.
- [ ] Verify: compiles.
- [ ] Commit: `feat(landing): useReveal scroll-reveal hook`

---

### Task 8: Hero section

**Files:**
- Create: `src/components/sections/Hero.tsx`

- [ ] `id="home"`, centered. Order: `GlowChip("AI 상세페이지 스튜디오")` → H1 "제품 사진만 올리세요.\n상세페이지는 AI가." → sub → CTA row (`GlowCTA href={APP_URL}` "무료로 시작하기" + ghost anchor "작동 방식 보기" → `#how`) → hero visual (`GlassCard` containing `GeneratedImage src="/generated/hero-studio.webp"`).
- [ ] Entrance: stagger via `.animate-fade-in` with incremental `animationDelay`.
- [ ] No survey. Remove `SurveyInline` usage entirely.
- [ ] Verify: `next dev`, hero renders over single orb glow zone, CTA → APP_URL.
- [ ] Commit: `feat(landing): Hero section (studio walkthrough)`

---

### Task 9: TrustStrip section

**Files:**
- Create: `src/components/sections/TrustStrip.tsx`

- [ ] Light band: short label ("함께하는 쇼핑몰" or similar) + partner logos `eko-logo.png`, `oac-logo.png`, `teenz-logo.png` from `/public` via `next/image` (grayscale, low opacity, hover full). Optional slow marquee on mobile, static grid desktop; reduced-motion = static.
- [ ] One or two product-grounded stat items (e.g., "한 번에 6–26컷", "4단계 자동화"). No fabricated numbers.
- [ ] Verify: logos load, no layout shift.
- [ ] Commit: `feat(landing): TrustStrip (partner logos + product stats)`

---

### Task 10: StudioFlow (how it works, 4 steps)

**Files:**
- Create: `src/components/sections/StudioFlow.tsx`

- [ ] `id="how"`. Section header (eyebrow + h2 "촬영 없이, 상세페이지까지"). 4 steps array: `{n, title, desc, img}`:
  1. 업로드 & AI 분석 — `/generated/step-1-analyze.webp`
  2. 마네킹컷으로 핏 확정 — `/generated/step-2-mannequin.webp`
  3. 콘티보드로 구성 (6–26컷) — `/generated/step-3-storyboard.webp`
  4. 에디터에서 완성·다운로드 (긴 PNG/ZIP) — `/generated/step-4-editor.webp`
- [ ] Each step = white `Card`/glass with `GeneratedImage` + number badge + title + desc. Scroll-reveal via `useReveal`, hover lift on desktop. Left progress indicator with 4-color ring accent on active step (desktop).
- [ ] Verify: `next dev`, steps reveal on scroll.
- [ ] Commit: `feat(landing): StudioFlow 4-step section`

---

### Task 11: Features grid

**Files:**
- Create: `src/components/sections/Features.tsx`

- [ ] `id="features"`. 6 white cards (`--elev-card`), each lucide icon + title + one-line desc: 의류 동일성 보존 · 색상별 컷 · 자동 카피라이팅 · 크레딧 사전 예고 · 캔버스 에디터 · 마네킹 핏 조정. Icons are monochrome (`--fg-1`), not glow-colored.
- [ ] Scroll-reveal stagger, hover lift.
- [ ] Verify: build + visual.
- [ ] Commit: `feat(landing): Features grid`

---

### Task 12: Showcase (cut-type gallery)

**Files:**
- Create: `src/components/sections/Showcase.tsx`

- [ ] Horizontal strip of 3 generated cut examples (`/generated/cut-styling.webp`, `cut-horizon.webp`, `cut-product.webp`) each labeled (스타일링컷 / 호리존컷 / 제품컷) in a white caption. Snap scroll on mobile, grid on desktop. Subtle hover scale.
- [ ] Verify: build + visual.
- [ ] Commit: `feat(landing): Showcase cut-type gallery`

---

### Task 13: FinalCTA + page assembly + layout metadata

**Files:**
- Create: `src/components/sections/FinalCTA.tsx`
- Modify: `src/app/page.tsx`, `src/app/layout.tsx`

- [ ] `FinalCTA.tsx`: centered big line "촬영은 그만.\n상세페이지는 지금 시작하세요." + `GlowCTA href={APP_URL}` "시작하기", over a subtle glass plate.
- [ ] `page.tsx`: render `<WearlessBackground/>` then `Hero/TrustStrip/StudioFlow/Features/Showcase/FinalCTA`. Remove all `posts/*` + `luminous-orb-background` imports.
- [ ] `layout.tsx`: add Cal Sans `<link>` (preconnect + `family=Cal+Sans`); update metadata title/description to studio positioning ("AI 상세페이지 제작 스튜디오"). Keep GA/Header/Footer.
- [ ] Verify: `npx next build` passes; `/` renders full new page.
- [ ] Commit: `feat(landing): FinalCTA + assemble new landing page`

---

### Task 14: Gemini image generation script + placeholders

**Files:**
- Create: `scripts/generate-images.mjs`, `public/generated/*` (placeholders), `scripts/README.md`
- Modify: `package.json` (add `"generate:images": "node scripts/generate-images.mjs"`; add `@google/genai` dep)

- [ ] Commit lightweight placeholder assets for all 8 `/generated/*.webp` paths (token-colored solid or glass-skeleton SVG renamed/encoded) so build works without the key.
- [ ] `generate-images.mjs`: load `.env.local` (`GEMINI_API_KEY`), use `@google/genai`, model `process.env.MODEL_ROUTING_IMAGE_HIGH ?? 'gemini-3-pro-image'`. For each asset def `{file, prompt, aspect}` generate an image and write to `public/generated/`. **Verify exact model id + image-output call against current Gemini docs at implementation; fall back to a known image model and log clearly on failure.** Idempotent, logs each file.
- [ ] Add prompts per §6 (white bg, soft pastel glow accents, fashion e-commerce, no face close-ups).
- [ ] Verify: `node scripts/generate-images.mjs` (if key present) writes real images; otherwise script exits with a clear "set GEMINI_API_KEY" message and placeholders remain.
- [ ] Commit: `feat(landing): Gemini image generation script + placeholder assets`

---

### Task 15: Cleanup + final verification

**Files:**
- Delete (if confirmed unused): `src/components/posts/*`, `src/components/survey/*`, `src/components/posts/luminous-orb-background.tsx`
- Modify: any lingering imports

- [ ] Remove now-unused old section/survey components and their imports. Keep `ui/*` still in use.
- [ ] `npx next build` clean (no errors/warnings). `npx eslint` clean.
- [ ] `next dev` smoke: all CTAs → APP_URL new tab; reduced-motion stops animations; mobile + desktop layouts intact.
- [ ] Commit: `chore(landing): remove legacy sections/survey, final cleanup`

---

## Self-Review

- **Spec coverage:** §3 IA → Tasks 6–13; §4 visual system → Tasks 1,2,5; §5 CTA/routing → Tasks 3,6,8,13; §6 images → Task 14; §7 file structure → all; §8 copy → Tasks 8,10,13; §9 motion → Tasks 2,7,8,10,11; §10 a11y/responsive → woven into each section task; §12 acceptance → Task 15 final verify. No gaps.
- **Placeholder scan:** Image "placeholders" are intentional assets, not plan gaps. The one deferred unknown (Gemini model id/SDK) is explicitly a verify-at-implementation step, not a vague TODO.
- **Type consistency:** `APP_URL` (Task 3) used identically in 6/8/13. `useReveal` (Task 7) used in 10/11. Generated image paths consistent between Task 14 (creates) and Tasks 8/10/12 (consume).
