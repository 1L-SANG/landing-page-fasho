# Wearless Landing Page — UI/UX Design Specification
## 수요조사용 프리미엄 랜딩페이지 (완성 디자인 기준)

---

## 🎯 프로젝트 개요

**Wearless**는 쇼핑몰 셀러들을 위한 버티컬 AI 서비스로, 단순 제품 촬영만으로 기존의 복잡한 촬영 프로세스를 대체할 수 있게 합니다. 이 랜딩페이지는 실제 쇼핑몰 업체의 수요를 검증하기 위한 목적으로, 서비스가 이미 출시된 것처럼 구성하되 최종적으로 문의 연결을 통해 관심도를 측정합니다.

### 핵심 전략
> 셀러가 페이지에 접속하는 순간부터 "내가 겪던 촬영 문제를 이 서비스가 해결해주겠구나"라는 확신을 점진적으로 쌓아가는 구조

**감정 흐름 설계:**
"이건 뭐지?" → "오, 촬영을 이렇게 바꿀 수 있다고?" → "진짜 이 퀄리티가 나온다고?" → "나도 써보고 싶다" → 문의하기

---

## 🌐 핵심 백그라운드 컴포넌트

### Luminous Orb Background (`LuminousOrbBackground.tsx`)
이 컴포넌트는 **페이지 전체의 배경 레이어**로 사용됩니다. 화면 중앙에 고정 배치되며, 스크롤 시에도 은은하게 비칩니다.

```
배치: fixed, z-index: 0, flex center, pointer-events: none, overflow: hidden
위치: 화면 중앙

색상 레이어:
  - Layer 1: conic-gradient(#12ADE6, #4C63FC, #12ADE6) — 회전 10.8s
    크기: 600×600px (Desktop), 300×300px (Mobile)
    blur: 60px, opacity: 0.6 (Desktop), 0.4 (Mobile)

  - Layer 2: conic-gradient(#FF0080, #EE00FF, #00A6FF, #4797FF, #FF8000, #FF00CC, #FF0080) — 역회전 16.2s
    크기: 500×500px (Desktop), 250×250px (Mobile)
    blur: 50px, opacity: 0.5 (Desktop), 0.35 (Mobile)

  - Layer 3: conic-gradient(#DC4CFC, #12B4E6, #FFFFFF, #DC4CFC) — 회전 13.5s
    크기: 400×400px (Desktop), 200×200px (Mobile)
    blur: 45px, opacity: 0.7 (Desktop), 0.45 (Mobile)

  - Center Highlight: radial-gradient(white 0% → transparent 70%)
    크기: 200×200px (Desktop), 100×100px (Mobile)
    blur: 40px

스크롤 연동:
  - scrollY < windowHeight: opacity 1 유지
  - 이후: 최대 30%만 감소 (0.7까지)
  - 마우스 parallax 없음 (제거됨)
```

---

## 🎨 디자인 시스템

### Color Palette

```
── 모노톤 베이스 ──
섹션 배경 (투명): rgba(255, 255, 255, 0.5) + backdrop-filter: blur(30px)
섹션 배경 (약간 어두움): rgba(245, 245, 247, 0.6) + backdrop-filter: blur(30px)
섹션 배경 (다크): rgba(250, 250, 250, 0.6) + backdrop-filter: blur(30px)
Card Background:      #FFFFFF
Dark Surface:         #1A1A1A (다크 섹션용 — Contact)
Dark Inner:           #222222 (다크 섹션 카드 내부)

── 텍스트 ──
Text Primary:    #1A1A1A
Text Secondary:  #6B6B6B
Text Muted:      #9E9E9E
Text Hero Sub:   #3A3A3A (서브헤드라인 전용)
Text Inverse:    #FFFFFF (다크 배경용)
Text Dark Muted: rgba(255,255,255,0.6)
Text Dark Dim:   rgba(255,255,255,0.4)

── 포인트 컬러 (Orb에서 추출) ──
Accent Blue:     #12ADE6
Accent Purple:   #4C63FC
Accent Magenta:  #DC4CFC
Accent Pink:     #FF0080
Accent Cyan:     #12B4E6
→ 그라데이션 테두리 컨테이너, Hero "Wearless" 텍스트 그라데이션, Stats Badge 텍스트,
  ResourceSavings 아이콘/수치, Feature 모바일 번호 뱃지에 사용.

── 멀티컬러 그라데이션 (테두리 컨테이너 전용) ──
Gradient Border: conic-gradient(from 180deg, #12ADE6, #4C63FC, #DC4CFC, #FF0080, #EE00FF, #12B4E6, #12ADE6)

── 모노톤 그라데이션 (모노톤 테두리 컨테이너 전용) ──
Monotone Border: conic-gradient(from 180deg, #1A1A1A, #4A4A4A, #6B6B6B, #9E9E9E, #6B6B6B, #4A4A4A, #1A1A1A)

── 모노톤 CTA & UI 컬러 ──
CTA Primary:     #1A1A1A
CTA Hover:       #333333
Star Gold:       #FFB800 (후기 별점)

── 섹션 구분선 ──
Section Divider: rgba(235, 230, 220, 0.5) — 각 섹션 상단 1px 라인
Footer Border:   rgba(107, 107, 107, 0.2) — 푸터 상단

── 유틸리티 ──
Border Default:  #E5E5E5
Border Subtle:   #F0F0F0
```

### Typography

```
Font Family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

── Desktop ──
Hero Display:    48-56px, bold (font-bold), leading-[1.1], tracking-tight
Section Title:   40-48px, bold
Heading 2:       28-32px, bold
Heading 3:       20-22px, bold
Body Large:      18-20px, font-medium, leading-[1.7]
Body:            16px, normal
Caption:         14-15px
Small:           12-13px, font-semibold
Button Large:    17-18px, font-semibold
Button:          15-16px, font-semibold/font-medium

── Mobile (< 768px) ──
Hero Display:    34px, bold
Section Title:   32px, bold
```

### Spacing & Layout

```
Container Max Width: 1200px (일반), 1400px (Features 섹션)
Section Vertical Padding: py-24 md:py-32 (약 96px ~ 128px)
Content Max Width: 1100px (카드 그리드 기준)

Border Radius:
  Small:  12px (rounded-xl)
  Medium: 16px (rounded-2xl)
  Large:  20px (rounded-[20px])
  XL:     24px (rounded-[24px]) — GradientBorderContainer wrapper
  Inner:  22px — GradientBorderContainer inner
  Pill:   9999px (rounded-full)
```

---

## ✨ 멀티컬러 그라데이션 테두리 컨테이너

### GradientBorderContainer (`GradientBorderContainer.tsx`)
크기가 큰 주요 컴포넌트에 적용되는 **시그니처 테두리 스타일**입니다.

```
구조: 바깥 wrapper div + 안쪽 content div
Props: children, className, innerClassName

Wrapper:
  - padding: 2px (테두리 두께)
  - border-radius: 24px
  - background: conic-gradient(from 180deg, #12ADE6, #4C63FC, #DC4CFC, #FF0080, #EE00FF, #12B4E6, #12ADE6)
  - animation: gradientShift 8s linear infinite (hue-rotate 0→360deg)
  - transition: all 300ms ease

Inner Content:
  - border-radius: 22px (wrapper보다 2px 작게)
  - overflow: hidden
  - innerClassName prop으로 배경색 지정 (기본 없음)

Hover 상태:
  - padding: 2px → 3px (테두리 살짝 두꺼워짐)
  - box-shadow: 0 0 30px rgba(76, 99, 252, 0.2) 추가
```

### MonotoneBorderContainer (`MonotoneBorderContainer.tsx`)
Features 섹션 중앙 비디오에 사용되는 **모노톤 테두리 스타일**입니다.

```
Wrapper:
  - padding: 2px
  - border-radius: 24px
  - background: conic-gradient(from 180deg, #1A1A1A, #4A4A4A, #6B6B6B, #9E9E9E, #6B6B6B, #4A4A4A, #1A1A1A)
  - animation: monotoneShift 8s linear infinite (brightness 1→1.2→1)

Hover:
  - padding: 3px
  - box-shadow: 0 0 30px rgba(26, 26, 26, 0.2)
```

### 적용 대상
```
✅ GradientBorder: Hero 데모 영상, 핵심 기능 카드 4개, ResourceSavings 통계, 후기 카드, 추천 요금제, Contact 컨테이너
✅ MonotoneBorder: Features 섹션 중앙 비디오
❌ 미적용: 네비게이션 바, How It Works 카드(모노톤 border 별도), FAQ 아코디언, 푸터, 일반 요금제 카드
```

---

## ✨ 글로벌 애니메이션 시스템

### Scroll Reveal (IntersectionObserver 기반)
```
모든 섹션의 주요 콘텐츠에 적용:
  - 초기 상태: opacity: 0, translateY(10-40px) 또는 translateX(±10px)
  - 트리거: viewport 진입 시 (threshold: 0.15~0.2)
  - 실행: opacity: 1, translate(0)
  - 속도: 600-700ms
  - 순차 딜레이: 자식 요소마다 100-150ms씩 stagger
```

### Hover Micro-interactions
```
카드: translateY(-4~-6px) + shadow 변경, 300ms
버튼: translateY(-0.5~-1px) + glow, transition-all
이미지: scale(1.03~1.05), 300ms
```

### Video Autoplay (`useVideoAutoplay.tsx`)
```
IntersectionObserver 기반 비디오 자동 재생/일시정지:
  - threshold: 0.5 (50% 이상 보일 때 재생)
  - 화면 밖으로 나가면 자동 일시정지
  - autoplay 실패 시 silent catch
  - 모든 비디오: muted, loop, playsInline
  - 재생 버튼 없음 (컨트롤 숨김 처리)
```

### Hero 입장 애니메이션 (Framer Motion)
```
motion/react 라이브러리 사용
Stats Badge: fadeIn y(-10→0), 0.6s
Headline: fadeIn y(20→0), 0.6s, delay 0.2s
Sub-headline: fadeIn y(20→0), 0.6s, delay 0.5s
CTA: fadeIn y(20→0), 0.6s, delay 0.7s
Demo Video: fadeIn scale(0.95→1), 0.8s, delay 1.1s
```

---

## 📱 반응형 브레이크포인트

```
Desktop Large: lg (1024px+) — 기본 레이아웃
Desktop:       md (768px+)
Mobile:        < 768px (max-md)

모바일 특별 규칙:
  - 좌우 패딩: px-6 (24px)
  - Orb 크기 50% 축소, opacity 대폭 감소
  - 그리드 단일 열 전환
```

---

## 🧭 Section 1: Navigation Bar (`Navigation.tsx`)

### 레이아웃
```
위치: fixed top, z-index: 50
높이: 72px (Desktop), 60px (Mobile)
배경: bg-white/70 (기본) → bg-white/80 (스크롤 시)
스타일: backdrop-filter: blur(20px) saturate(1.8)
하단 보더: 1px solid rgba(0, 0, 0, 0.06)
전환: scrollY > 20px 시 배경 변경
내부: max-width 1200px, 가운데 정렬, px-6
```

### 구성 (3단 배치)
```
왼쪽 — 브랜드:
  - Wearless 로고 (Figma 에셋 이미지 36×36px + 워드마크)
  - 워드마크: "Wearless" — 20px, bold, #1A1A1A
  - 클릭 시 최상단 smooth scroll
  - hover: opacity 0.8

가운데 — 내비게이션 링크 (Desktop only):
  - "홈" | "주요 기능" | "요금제"
  - 16px, font-medium, #6B6B6B
  - Hover: text #1A1A1A, 밑줄 slide-in (w-0 → w-full, h-2px, bg-[#1A1A1A])
  - 클릭 시 해당 섹션으로 smooth scroll (id: home, features, pricing)
  - 각 링크 간격: gap-10 (40px)

오른쪽 — CTA 버튼 (Desktop only):
  - "시작하기" — Primary Button
    Background: #1A1A1A, Text: white, 15px, font-semibold
    Padding: px-6 py-2.5, rounded-full
    Hover: bg-[#333333], -translate-y-0.5
    shadow-lg
    → contact 섹션으로 smooth scroll

  - "문의하기" — Ghost Button
    Background: transparent, Border: 1.5px solid #E5E5E5
    Text: #6B6B6B, 15px, font-medium
    Padding: px-6 py-2.5, rounded-full
    Hover: border-[#1A1A1A], text-[#1A1A1A]
    간격: gap-3
    → contact 섹션으로 smooth scroll
```

### 모바일 (< 768px)
```
왼쪽: 로고 + 워드마크 유지
가운데: 숨김 (hidden md:flex)
오른쪽: 햄버거/X 토글 아이콘 (lucide Menu/X, 24px, #1A1A1A, p-2)

모바일 메뉴 (mobileMenuOpen 시):
  - fixed inset-0, z-40, bg-[#FAFAFA]
  - flex column 중앙 정렬, gap-8
  - 각 링크: 24px, font-semibold, #1A1A1A
  - 하단 버튼 (flex-col gap-4, max-w-xs, px-6):
    "시작하기" full-width, py-3.5, bg-[#1A1A1A], rounded-full, shadow-lg
    "문의하기" full-width, py-3.5, border-[1.5px] #E5E5E5, rounded-full
  - 진입 애니메이션: animate-fade-in
```

---

## 🎬 Section 2: Hero + Demo Video (`HeroSection.tsx`)

### Hero Area
```
높이: min-h-screen
배경: Luminous Orb Background (z-index: 0)
콘텐츠: z-index: 10, flex column, 수직·수평 중앙 정렬
패딩: pt-[72px] (네비게이션 높이), pb-12, px-6
```

### Hero 텍스트
```
Stats Badge (제목 위):
  - "200+개 쇼핑몰들이 Wearless와 함께합니다."
  - "200+개" 부분: font-bold, gradient text (from-[#12ADE6] via-[#4C63FC] to-[#DC4CFC])
  - 나머지: 13px, font-medium, text-[#4A4A4A], tracking-tight
  - 컨테이너: bg-white/80, backdrop-blur-sm, rounded-full, border #E5E5E5, shadow-sm
  - 패딩: px-5 py-2.5, mb-6

Main Headline (2줄 + 브랜드명):
  줄 1: "촬영에 힘 쏟지 마세요."
  줄 2: "쇼핑몰 대표님만을 위한 AI"
  → 34px (Mobile) / 48px (md) / 56px (lg), font-bold, #1A1A1A, leading-[1.1], tracking-tight

  줄 3: "Wearless"
  → gradient text: linear-gradient(135deg, #12ADE6, #4C63FC, #DC4CFC)
  → text-shadow + drop-shadow overlay, mixBlendMode: multiply, opacity: 0.7
  → mb-6

Sub-headline:
  "스튜디오, 모델, 조명 없이. 제품 사진만 찍으세요."
  — 18px (Mobile) / 20px (md), font-medium, #3A3A3A, leading-[1.7]
  — max-width: 540px, mb-10

CTA 영역:
  Primary 버튼만 (Secondary "서비스 소개 보기 ↓" 제거):
  "지금 시작하기"
    — bg-[#1A1A1A], white, 17px, font-semibold
    — px-10 py-4, rounded-full
    — shadow: 0 4px 24px rgba(0,0,0,0.15)
    — hover: bg-[#333333], -translate-y-1, shadow 0 8px 32px rgba(0,0,0,0.2)
    → contact 섹션으로 smooth scroll

Trust Indicator: 제거됨 (Stats Badge로 대체)
```

### Demo Video 영역
```
위치: Hero 텍스트 아래 mt-4, z-10
컨테이너:
  - GradientBorderContainer 적용 ✅
  - max-width: 900px, 중앙 정렬
  - aspect-ratio: 16/9

내부:
  - 비디오 자동 재생 (useVideoAutoplay hook)
  - muted, loop, playsInline
  - object-cover, 컨트롤 숨김 (video-no-controls 클래스)
  - 재생 버튼 없음 (자동 재생으로 대체)
  - pointer-events: none (사용자 인터랙션 차단)

입장 애니메이션: motion fadeIn + scale(0.95→1), 0.8s, delay 1.1s
```

---

## 🔑 Section 3: 핵심 기능 소개 (`FeaturesSection.tsx`)

### 섹션 헤더
```
배경: rgba(255, 255, 255, 0.5) + backdrop-filter: blur(30px)
상단 1px 구분선: rgba(235, 230, 220, 0.5)
패딩: py-24 md:py-32

Section Label: "WHY WEARLESS" — 13px, font-semibold, #9E9E9E, tracking-[0.12em], uppercase
Section Title: "왜 Wearless인가요?" — 32px/40px/48px, font-bold, #1A1A1A
Section Subtitle: "쇼핑몰 대표님만을 위해 만들어진 서비스니까." — 18px, #6B6B6B, max-w-560px
모두 중앙 정렬, mb-16 md:mb-20
```

### 기능 카드 레이아웃 — Desktop (3×2 그리드 + 중앙 비디오)
```
구조: lg:grid-cols-3, grid-rows-2, gap-6, max-w-[1400px]

  ┌─────────┐  ┌─────────┐  ┌─────────┐
  │ Card 1  │  │  Video  │  │ Card 2  │
  │(top-left)│  │(center, │  │(top-rt) │
  ├─────────┤  │row-span │  ├─────────┤
  │ Card 3  │  │   2)    │  │ Card 4  │
  │(bot-left)│  │         │  │(bot-rt) │
  └─────────┘  └─────────┘  └─────────┘

중앙 비디오:
  - MonotoneBorderContainer 적용 (모노톤 테두리)
  - aspect-ratio: 16/9, 자동 재생

연결 점선:
  - SVG dashed lines (strokeDasharray: 8,4)
  - 각 카드 → 중앙 비디오 방향
  - 각기 다른 그라데이션 색상 (gradient1~4)
  - viewport 진입 시 opacity 0→0.3, delay 500-800ms

각 Feature 카드:
  - GradientBorderContainer 적용 ✅
  - 내부: bg-white, backdrop-blur-sm, rounded-2xl, p-6
  - shadow-lg, hover: shadow-[0_8px_32px], -translate-y-1
  - 입장: 좌측 카드는 -translate-x-10에서, 우측은 translate-x-10에서 slide-in
```

### 기능 4가지 내용
```
Feature 01: "레퍼런스 기반 생성"
  설명: "원하는 느낌의 이미지를 구현해보세요."

Feature 02: "쇼핑몰 정체성 유지"
  설명: "쇼핑몰에서 그동안 업로드하던 컷들의 무드를 반영해보세요."

Feature 03: "다양한 컷 종류"
  설명: "고스트컷부터 디테일컷, 일상컷, 스튜디오컷까지 원하는 컷을 선택하세요."

Feature 04: "릴스용 템플릿"
  설명: "인스타그램에서 인기 있는 릴스들을 선택해서 트렌드에 맞게 AI로 생성해보세요."
```

### 모바일 (< lg)
```
- 비디오가 먼저 (GradientBorderContainer 적용, aspect-ratio: 9/16, max-h-500px)
- 이후 Feature 카드 4개 세로 나열 (space-y-12)
- 각 카드: bg-white/80, border-2 #E5E5E5, rounded-2xl, p-6
- 그라데이션 번호 뱃지 (원형, 40px, 각각 다른 그라데이션 색상, "01"~"04")
- 텍스트 중앙 정렬, 22px/26px
- 입장: fade-up, 150ms stagger
```

---

## 📊 Section 4: 리소스 절감 (`ResourceSavingsSection.tsx`)

> ⚠️ 원래 PRD에 없던 **새로운 섹션**입니다. Features와 How It Works 사이에 배치됩니다.

### 섹션 구성
```
배경: rgba(250, 250, 250, 0.6) + backdrop-filter: blur(30px)
패딩: py-24 md:py-32

상단 아이콘: Plus (lucide, 80px, #1A1A1A, strokeWidth 2.5)
  - 뒤에 그라데이션 blur glow 효과
  - viewport 진입 시 scale(0.5→1) 애니메이션

헤더:
  Title: "리소스 대폭 절감" — 32px/42px, font-bold, #1A1A1A
  Subtitle: "Wearless로 촬영 리소스를 획기적으로 줄이고, 비즈니스 성장에 집중하세요." — 18px, #6B6B6B
```

### 통계 카드 (GradientBorderContainer 내부 3등분)
```
GradientBorderContainer로 전체 감싸기 ✅
내부: grid md:grid-cols-3, bg-white, 카드 간 md:border-r #E5E5E5

각 통계 항목:
  아이콘: 64px 정사각형, rounded-2xl, 그라데이션 배경, 아이콘 32px white
    - 비용 절감: TrendingDown, #12ADE6→#4C63FC
    - 속도 향상: Zap, #4C63FC→#DC4CFC
    - 고객 만족도: Star, #DC4CFC→#FF0080
  hover: scale(1.1)

  수치: 48px/56px, font-bold, gradient text (각 항목별 그라데이션)
    - "90%" / "10배" / "4.9"

  라벨: 20px/22px, font-bold, #1A1A1A
    - "비용 절감" / "속도 향상" / "고객 만족도"

  설명: 15px, #6B6B6B
    - "기존 대비 의류컷 제작 비용" / "압도적으로 빨라지는 제작 속도" / "5점 만점 (베타테스터 기준)"

  패딩: p-10 md:p-12, text-center
  hover: bg-gradient from-[#FAFAFA] to-white
  하단: 그라데이션 라인 (scale-x-0 → 1 on hover)

입장 애니메이션: 순차 fade-up, 100ms stagger
```

---

## 🔄 Section 5: 서비스 이용 과정 (`HowItWorksSection.tsx`)

### 섹션 헤더
```
배경: rgba(245, 245, 247, 0.6) + backdrop-filter: blur(30px)
상단 1px 구분선

Section Label: "HOW IT WORKS"
Section Title: "쉬운 사용법, 남다른 퀄리티"
Section Subtitle: "복잡한 설정 없이, 업로드부터 결과물까지 단 3분이면 충분합니다."
중앙 정렬
```

### 스텝 카드 레이아웃
```
구조: grid 1열(Mobile) / 2열(md) / 4열(lg), gap-6, max-w-[1100px]

각 카드 테두리:
  - 모노톤 그라데이션 border (rounded-[20px], p-[1px])
  - background: linear-gradient to-br from-[#1A1A1A] via-[#4A4A4A] to-[#6B6B6B]
  - hover: shadow-[0_8px_40px_rgba(0,0,0,0.12)]

내부:
  - bg-white, rounded-[20px], p-8
  - hover: -translate-y-2

  Step Icon: lucide 아이콘, 48px, #9E9E9E → hover시 #1A1A1A, strokeWidth 1.5, mb-5
  Step Number: 원형 40px, bg-[#1A1A1A], white text 16px bold, mb-5
  Step Title: 20px, font-semibold, #1A1A1A, mb-3
  Step Description: 15px, #6B6B6B, leading-[1.6], whitespace-pre-line

  Arrow연결 (Desktop lg only): 마지막 제외, absolute -right-3, 중앙, text #E5E5E5, "→"

입장 애니메이션: 순차 fade-up, 150ms stagger
```

### 4단계 내용
```
Step 1: "제품 사진 업로드" (Upload icon)
  설명: "스마트폰으로 찍은 사진으로도 충분해요."

Step 2: "기능 선택" (Sliders icon)
  설명: "Wearless의 다양한 기능들 중, 원하는 기능을 사용해보세요."

Step 3: "AI 이미지 생성" (Sparkles icon)
  설명: "구도, 포즈, 디테일을 직관적으로 수정하며 완성도를 높이세요."

Step 4: "결과물 다운로드" (Download icon)
  설명: "결과물을 바로 다운로드해서\n쇼핑몰에 적용하세요."
```

---

## 💬 Section 6: 사용자 후기 (`TestimonialsSection.tsx`)

### 섹션 헤더
```
배경: rgba(245, 245, 247, 0.6) + backdrop-filter: blur(30px)
상단 1px 구분선

Section Label: "TESTIMONIALS"
Section Title: "셀러들의 실제 반응"
Section Subtitle: "베타테스터 이후 일부 대표님들이 남겨주신 후기입니다. (25.11)"
중앙 정렬
```

### 후기 카드 레이아웃
```
구조: grid 1열/2열(md)/3열(lg), gap-7, max-w-[1100px], items-stretch
각 카드 개별 IntersectionObserver로 순차 표시
```

### 각 후기 카드
```
- GradientBorderContainer 적용 ✅ (innerClassName: "bg-white w-full h-full flex")
- 내부: p-8, hover: -translate-y-1, flex column

상단: ★★★★★ (Star lucide, 18px, #FFB800 fill, gap-1, mb-5)

인용문:
  "텍스트" — 18px, font-medium, #1A1A1A, leading-[1.7], whitespace-pre-line, flex-1
  큰따옴표로 감싸기

프로필:
  - Figma 에셋 로고 이미지 (48px 원형, object-cover) + 이름 가로 배치
  - 이름: 16px, font-semibold, #1A1A1A
  - 직함/회사명 제거 (이름만 표시)
  - gap-3

입장 애니메이션: 각 카드 개별 IntersectionObserver, 150ms stagger
```

### 후기 내용 (실제 3개)
```
후기 1:
  "적자가 심해서 쇼핑몰을 포기할까 한참 고민했었어요.
   wearless 덕분에 오히려 지금은 매출이 최고점인 상태입니다."
  — 임가현 대표 (teenz 로고)

후기 2:
  "AI 느낌 날까 봐 걱정했는데, 생각보다 자연스러워서 놀랐어요..!
   확실히 퀄리티 차이가 납니다."
  — 김태린 대표 (eko 로고)

후기 3:
  "제가 찍은 컷들을 바탕으로 다양하게
   생성되는게 진짜 미친 기능인거 같아요."
  — 강민지 대표 (oac 로고)
```

---

## 💰 Section 7: 요금제 (`PricingSection.tsx`)

### 섹션 헤더
```
배경: rgba(255, 255, 255, 0.5) + backdrop-filter: blur(30px)
상단 1px 구분선

Section Label: "PRICING"
Section Title: "합리적인 요금제" — 32px/36px/48px
Section Subtitle: "비즈니스 규모에 맞는 플랜을 선택하세요."
중앙 정렬
```

### 요금제 카드 레이아웃
```
구조: grid 1열/2열(md)/4열(lg), gap-6, max-w-[1200px]
4개 플랜 (3-tier에서 4-tier로 변경)
각 카드 개별 IntersectionObserver로 순차 표시
```

### Free 플랜 카드
```
컨테이너: bg-white, border-[1.5px] #E5E5E5, rounded-[20px], p-10
  shadow: 0 4px 24px rgba(0,0,0,0.06)
  hover: border-[#1A1A1A]

플랜명: "Free" — 16px, font-semibold, #6B6B6B
가격: "무료" — 36px, font-extrabold, #1A1A1A
구분선: h-px bg-[#F0F0F0] mb-6

기능 리스트 (Check 아이콘 + 텍스트):
  ✓ Wearless 1.0 (Beta) 기능
  ✓ 월 생성횟수 10회
  — Check: 18px, #1A1A1A, strokeWidth 2.5
  — 텍스트: 15px, #6B6B6B, space-y-3.5

CTA: "시작하기" — Ghost (border #E5E5E5, text #1A1A1A)
  full-width, py-3.5, rounded-xl
  hover: border #1A1A1A, bg #1A1A1A, text white
```

### Pro 플랜 카드 (추천)
```
GradientBorderContainer 적용 ✅ (innerClassName: "bg-white")
md:scale-105

"MOST POPULAR" 뱃지:
  pill, bg-[#1A1A1A], text white, 12px, font-semibold
  absolute -top-3, 중앙

플랜명: "Pro" — 16px, font-semibold, #1A1A1A
가격: "₩29,900/월" — 36px + 16px #9E9E9E

기능 리스트:
  ✓ Wearless 2.0 모든 기능
  ✓ 월 생성횟수 200회
  ✓ 2k 해상도 다운로드
  ✓ 워터마크 없음

CTA: "시작하기" — Primary (bg #1A1A1A, text white)
  shadow: 0 4px 16px rgba(0,0,0,0.15)
  hover: bg #333333, -translate-y-0.5
```

### Seller 플랜 카드
```
기본 플랜과 동일 스타일
플랜명: "Seller"
가격: "₩49,900/월"

기능 리스트:
  ✓ Wearless 2.0 모든 기능
  ✓ 월 생성횟수 500회
  ✓ 4k 해상도 다운로드
  ✓ 워터마크 없음

CTA: "시작하기" — Ghost
```

### Enterprise 플랜 카드
```
기본 플랜과 동일 스타일
플랜명: "Enterprise"
가격: "맞춤 견적"

기능 리스트:
  ✓ 상담 문의

CTA: "문의하기" — Ghost
```

---

## 📩 Section 8: 문의란 + CTA (`ContactSection.tsx`)

> ⚠️ 기존 이메일 수집 폼에서 **2-column 문의 + CTA 레이아웃**으로 완전 변경되었습니다.

### 섹션 구성
```
배경: bg-[#1A1A1A]
패딩: py-24 md:py-32, px-6
```

### 레이아웃
```
max-width: 1200px
GradientBorderContainer 적용 ✅ (innerClassName: "bg-[#222222]")
내부: grid md:grid-cols-2

왼쪽 — 문의 정보:
  p-10 md:p-14, border-r border-white/10

  Title: "문의하기" — 28px/32px, font-bold, white
  Subtitle: "궁금한 점이 있으시다면\n언제든 연락주세요." — 16px, white/60, mb-12

  연락처 카드 (flex-col md:flex-row, gap-8):
    담당자:
      아이콘: User (20px, white/70) in 48px rounded-xl bg-white/5 box
      라벨: "담당자" — 13px, white/40
      값: "정일상 대표" — 17px, white, font-medium

    이메일:
      아이콘: Mail (20px, white/70) in 48px rounded-xl bg-white/5 box
      라벨: "이메일" — 13px, white/40
      값: "ilsang@wearless.ai" — 17px, white, font-medium, mailto 링크
      hover: white/80

오른쪽 — CTA:
  p-10 md:p-14, flex column center, text-center

  Title: "지금 바로 시작하세요" — 28px/32px, font-bold, white
  Subtitle: "Wearless의 혜택을 지금 전부 받아가세요." — 16px, white/60, mb-10

  CTA 버튼: "지금 시작하기"
    mt-8, px-12 py-3
    bg-white, text-[#1A1A1A], 18px, font-semibold
    rounded-xl, shadow-lg
    hover: bg-white/90, scale(1.05)
    → 클릭 시 Hero(#home) 섹션으로 smooth scroll

입장 애니메이션: fade-up, 600ms
```

---

## ❓ Section 9: FAQ (`FAQSection.tsx`)

### 섹션 헤더
```
배경: rgba(250, 250, 250, 0.6) + backdrop-filter: blur(30px)

Section Label: "FAQ"
Section Title: "자주 묻는 질문"
Subtitle 없음
중앙 정렬
```

### 아코디언 레이아웃
```
max-width: 760px, 중앙 정렬, space-y-3

아코디언 아이템:
  - bg-white, border border-[#F0F0F0], rounded-2xl, overflow-hidden

  질문 (접힌 상태):
    - px-7 py-6, flex between
    - 16px/18px, font-semibold, #1A1A1A, pr-4
    - 오른쪽: Plus 아이콘 (24px, #1A1A1A)
    - hover: bg-[#FAFAFA]

  답변 (펼친 상태):
    - Plus → 45deg rotate (rotate-45, 300ms)
    - max-h-0→max-h-96, opacity 0→1 (300ms)
    - px-7 pb-6 pt-0, border-t border-[#F0F0F0]
    - 16px, #6B6B6B, leading-[1.7], mt-4

  한 번에 하나만 열림 (openIndex state)
```

### FAQ 내용 (4개)
```
Q1: "어떤 종류의 제품 사진을 업로드할 수 있나요?"
A1: "의류라면 다 가능합니다. 바닥컷, 행거컷, 마네킹컷 등 어떤 형태든 괜찮습니다. 스마트폰으로 촬영한 사진도 충분합니다."

Q2: "한 번에 여러 장을 처리할 수 있나요?"
A2: "네, 대량 업로드 기능을 제공합니다. Pro plan 이상에서 병렬처리가 가능하며, 10장까지 한 번에 처리가 가능합니다."

Q3: "기존 쇼핑몰 플랫폼과 연동되나요?"
A3: "무신사, 지그재그, 에이블리 등 주요 플랫폼과의 연동을 지원하며, API를 통한 커스텀 연동도 지원합니다."

Q4: "AI로 생성한 이미지의 저작권은 어떻게 되나요?"
A4: "pro plan 이상이신분들이라면 생성하신 분께 귀속됩니다. 다만 타인의 저작물을 침해했거나 불법적인 용도로 쓰였다면 책임 또한 사용자에게 귀속됩니다."
```

---

## 🔻 Section 10: Footer (`Footer.tsx`)

### 레이아웃
```
배경: rgba(250, 250, 250, 0.6) + backdrop-filter: blur(30px)
  → 기존 #111111 다크에서 라이트 톤으로 변경
border-top: 1px solid rgba(107, 107, 107, 0.2)
패딩: px-6 py-12
```

### 구성 (3단 가로 배치)
```
max-width: 1200px, flex row(md) / column(mobile), justify-between, gap-6

왼쪽 — 브랜드:
  - Wearless 로고 (28px 이미지 + 20px bold 워드마크, #1A1A1A)
  - "쇼핑몰 촬영의 새로운 기준" — 14px, #9E9E9E

가운데 — 회사 정보:
  - "대표자: 정일상" — 13px, #6B6B6B
  - "이메일: contact@wearless.ai"

오른쪽 — 링크 & 저작권:
  - "문의하기" 링크 → #contact, hover: #1A1A1A — 14px, #6B6B6B
  - "© 2026 Wearless. All rights reserved." — 13px, #9E9E9E
```

### 모바일 (< md)
```
- flex-col, 모든 요소 중앙 정렬 (text-center)
```

---

## 🧩 공통 재사용 컴포넌트

### 1. GradientBorderContainer (시그니처 컴포넌트)
→ 위 "멀티컬러 그라데이션 테두리 컨테이너" 섹션 참조

### 2. MonotoneBorderContainer (추가된 컴포넌트)
→ 위 "모노톤 테두리 컨테이너" 섹션 참조

### 3. useVideoAutoplay Hook
```
IntersectionObserver 기반 비디오 자동 재생 관리
threshold: 0.5
Viewport 진입 시 play(), 이탈 시 pause()
```

### 4. Primary CTA Button
```
Background: #1A1A1A
Text: #FFFFFF, 15-17px, font-semibold
Padding: px-6~10 py-2.5~4
Border-radius: 9999px (rounded-full)
Shadow: 0 4px 24px rgba(0, 0, 0, 0.15)
Hover: bg-[#333333], -translate-y-0.5~1, shadow 강화
Transition: transition-all
```

### 5. Ghost Button
```
Background: transparent
Border: 1.5px solid #E5E5E5
Text: #6B6B6B, 15-16px, font-medium
Padding: px-6 py-2.5
Border-radius: 9999px (rounded-full)
Hover: border-[#1A1A1A], text-[#1A1A1A]
```

### 6. Section Header Pattern
```
Label: 13px, font-semibold, uppercase, tracking-[0.12em], #9E9E9E, mb-4
Title: 32-48px (반응형), font-bold, #1A1A1A, mb-4
Subtitle: 18px, #6B6B6B, max-w-560px, mx-auto
간격: Label → Title mb-4, Title → Subtitle mb-4
모두 중앙 정렬 (text-center)
```

### 7. Section Background Pattern
```
Two alternating styles:
  Light: rgba(255, 255, 255, 0.5) + backdrop-filter: blur(30px)
  Tinted: rgba(245, 245, 247, 0.6) + backdrop-filter: blur(30px)
  또는: rgba(250, 250, 250, 0.6) + backdrop-filter: blur(30px)
상단 구분선: 1px solid rgba(235, 230, 220, 0.5)
→ Orb 배경이 모든 섹션에 은은하게 비치도록 반투명 처리
```

---

## 📐 전체 페이지 흐름 요약

```
┌─────────────────────────────────┐
│ Navigation Bar (fixed)          │ — 로고, 링크, CTA
├─────────────────────────────────┤
│ Hero + Demo Video (min-h-screen)│ — Orb 배경, 메인 카피, 자동재생 영상
├─────────────────────────────────┤
│ Core Features (2×2 그리드+비디오)│ — 4개 카드 + 중앙 비디오
├─────────────────────────────────┤
│ Resource Savings (NEW)          │ — 3개 통계 (90%, 10배, 4.9)
├─────────────────────────────────┤
│ How It Works (4 Steps)          │ — 4단계 카드 가로 배치
├─────────────────────────────────┤
│ Testimonials                    │ — 후기 카드 3개 (실제 브랜드)
├─────────────────────────────────┤
│ Pricing                         │ — 4-tier 요금제 (Free~Enterprise)
├─────────────────────────────────┤
│ Contact (Dark)                  │ — 문의 정보 + CTA (이메일 폼 → 제거)
├─────────────────────────────────┤
│ FAQ                             │ — 아코디언 4개
├─────────────────────────────────┤
│ Footer (Light)                  │ — 간결한 정보
└─────────────────────────────────┘
```

### 기존 PRD 대비 주요 변경사항
```
1. ServiceVideoSection: 컴포넌트 파일은 존재하나 App.tsx에서 미사용 (삭제 대상)
2. ResourceSavingsSection: 신규 추가 (Features ↔ HowItWorks 사이)
3. FeaturesSection: 좌우 교차 → 2×2 그리드 + 중앙 비디오 레이아웃
4. 기능 카피: 완전 변경 (배경 제거/모델 피팅 → 레퍼런스/정체성/컷종류/릴스)
5. Pricing: 3-tier → 4-tier (Free/Pro/Seller/Enterprise), 가격 변경
6. ContactSection: 이메일 수집 폼 → 2-column 문의 정보 + CTA
7. Testimonials: 실제 브랜드 로고, 후기 내용 변경, 직함 제거
8. FAQ: 6개 → 4개, 내용 업데이트
9. Footer: 다크(#111111) → 라이트(반투명), 이용약관/개인정보 링크 제거
10. Hero: Trust Indicator → Stats Badge, CTA Secondary 제거, "Wearless" 그라데이션 텍스트
11. 전체: 모든 비디오 자동 재생 (재생 버튼 컨트롤 제거)
12. 전체: 섹션 배경 불투명 → 반투명 (Orb 비침 효과)
13. MonotoneBorderContainer: 신규 공통 컴포넌트 추가
14. Framer Motion (motion/react): Hero 섹션 입장 애니메이션에 사용
```

---

## 🎯 디자인 원칙 (꼭 지켜야 할 것)

1. **모노톤 UI 기조 유지**: 버튼, 뱃지, 아이콘, 텍스트 등 대부분 UI 요소는 블랙/그레이/화이트 모노톤. 단, Stats Badge 숫자 및 "Wearless" 브랜드명, ResourceSavings 수치에는 예외적으로 그라데이션 텍스트 활용.
2. **Orb 컬러 테두리 & 포인트**: 멀티컬러 그라데이션은 GradientBorderContainer 시그니처 테두리 + 일부 포인트 텍스트에 활용.
3. **반투명 섹션 배경**: 모든 섹션이 반투명 + backdrop-blur 처리되어 Orb 배경이 페이지 전체에 자연스럽게 비침.
4. **반응형 필수**: Desktop(lg 1024px+), Tablet(md 768px+), Mobile(< 768px) 세 단계로 대응.
5. **애니메이션**: IntersectionObserver 기반 scroll reveal + hover 인터랙션. Hero는 Framer Motion 사용.
6. **비디오 자동 재생**: 모든 영상은 muted + autoplay + loop. 재생 버튼 없음. useVideoAutoplay hook 활용.
7. **셀러 관점 카피**: 실제 셀러 용어 사용 — "고스트컷", "바닥컷", "행거컷", "릴스" 등.
8. **전환 최적화**: 모든 "시작하기" 버튼은 Contact 섹션으로, Contact의 "지금 시작하기"는 Hero로 순환 스크롤.
9. **실제 브랜드 에셋**: Figma에서 추출한 실제 로고/아바타 이미지 사용 (figma:asset 경로).
10. **고급진 여백**: 섹션 간 py-24 md:py-32로 충분한 breathing room 확보.
