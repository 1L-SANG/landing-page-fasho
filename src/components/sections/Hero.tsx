'use client';

import { ArrowRight, ArrowDown, Sparkles } from 'lucide-react';
import { GlowCTA } from '@/components/ui/glow-cta';
import { GeneratedImage } from '@/components/ui/generated-image';
import { APP_URL } from '@/lib/config';

const fade = (delay: number) => ({
  animationDelay: `${delay}s`,
  animationDuration: '0.7s',
});

const Hero = () => {
  return (
    <section
      id="home"
      className="section flex min-h-screen flex-col items-center justify-center pb-20 pt-[128px] text-center"
    >
      {/* eyebrow */}
      <div className="animate-fade-in" style={fade(0)}>
        <span className="wearless-glow-chip">
          <Sparkles size={14} strokeWidth={2.2} />
          <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.18em] uppercase">
            AI Detail-page Studio
          </span>
        </span>
      </div>

      {/* headline */}
      <h1
        className="display-hero whitespace-normal mt-8 max-w-[18ch] animate-fade-in"
        style={fade(0.08)}
      >
        제품 사진만 올리세요.
        <br />
        상세페이지는&nbsp;
        <span className="font-display align-baseline">AI</span>가.
      </h1>

      <p
        className="t-lead whitespace-normal mx-auto mt-6 max-w-[34ch] animate-fade-in"
        style={fade(0.2)}
      >
        분석 · 마네킹컷 · 콘티 · 에디터까지, 촬영 없이 한 번에.
        제품 사진 몇 장이면 충분합니다.
      </p>

      {/* CTAs */}
      <div
        className="mt-9 flex flex-wrap items-center justify-center gap-3 animate-fade-in"
        style={fade(0.3)}
      >
        <GlowCTA href={APP_URL} className="h-12 px-7 text-[16px]">
          무료로 시작하기
          <ArrowRight size={18} strokeWidth={2.2} />
        </GlowCTA>
        <a
          href="#how"
          className="inline-flex h-12 items-center gap-1.5 rounded-full bg-white/70 px-6 text-[15px] font-medium text-[var(--fg-1)] shadow-[0_0_0_1px_var(--ring)] backdrop-blur transition-all duration-150 hover:-translate-y-px hover:bg-white hover:shadow-[0_0_0_1px_var(--ring-strong)]"
        >
          작동 방식 보기
          <ArrowDown size={16} strokeWidth={2.2} />
        </a>
      </div>

      {/* product window */}
      <div
        className="relative mt-16 w-full max-w-[980px] animate-fade-in"
        style={fade(0.16)}
      >
        <div className="wearless-glass overflow-hidden p-0">
          {/* window chrome */}
          <div className="flex items-center gap-2 border-b border-[var(--ring)] px-4 py-3">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--fg-3)]/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--fg-3)]/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--fg-3)]/50" />
            </span>
            <span className="mx-auto inline-flex items-center rounded-md bg-[var(--bg-2)] px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-2)]">
              ai.wearless.kr
            </span>
          </div>
          <GeneratedImage
            src="/generated/hero-studio.png"
            alt="제품 사진을 올리면 완성되는 Wearless 상세페이지 스튜디오 화면"
            ratio="16 / 9"
            priority
            sizes="(max-width: 980px) 100vw, 980px"
          />
        </div>

        {/* floating in-use chips */}
        <div className="pointer-events-none absolute -left-4 top-[26%] hidden animate-fade-in sm:block" style={fade(0.5)}>
          <span className="wearless-glass flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-[var(--fg-1)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-success)]" />
            AI 분석 완료
          </span>
        </div>
        <div className="pointer-events-none absolute -right-4 bottom-[16%] hidden animate-fade-in sm:block" style={fade(0.6)}>
          <span className="wearless-glass flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-[var(--fg-1)]">
            <span className="font-[family-name:var(--font-mono)] text-[var(--fg-2)]">12</span>
            컷 생성됨
          </span>
        </div>
      </div>
    </section>
  );
};

export { Hero };
