'use client';

import { ArrowRight, ArrowDown } from 'lucide-react';
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
      className="section flex min-h-screen flex-col justify-center pb-16 pt-[112px]"
    >
      <div className="section-inner w-full">
        {/* masthead meta */}
        <div
          className="animate-fade-in flex items-center justify-between border-b border-[var(--ring)] pb-3"
          style={fade(0)}
        >
          <span className="t-mono">Wearless — AI Detail-page Studio</span>
          <span className="t-mono hidden sm:inline">Vol.01 / Seoul / 2026</span>
        </div>

        {/* headline block */}
        <div className="mt-10 grid items-end gap-x-10 gap-y-8 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <p className="t-eyebrow animate-fade-in" style={fade(0.06)}>
              Photograph less, sell more.
            </p>
            <h1
              className="display-hero whitespace-normal mt-4 animate-fade-in"
              style={fade(0.12)}
            >
              제품 사진만 올리세요.
              <br />
              상세페이지는{' '}
              <em className="font-[family-name:var(--font-serif)] italic font-normal tracking-tight">
                AI
              </em>
              가.
            </h1>
          </div>

          <div className="lg:pb-3">
            <p
              className="t-lead whitespace-normal max-w-[42ch] animate-fade-in"
              style={fade(0.2)}
            >
              분석 · 마네킹컷 · 콘티 · 에디터까지, 촬영 없이 한 번에.
              제품 사진 몇 장이면 충분합니다.
            </p>
            <div
              className="mt-7 flex flex-wrap items-center gap-3 animate-fade-in"
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
                작동 방식
                <ArrowDown size={16} strokeWidth={2.2} />
              </a>
            </div>
          </div>
        </div>

        {/* wide product plate */}
        <div
          className="relative mt-14 w-full animate-fade-in"
          style={fade(0.18)}
        >
          <div className="wearless-glass overflow-hidden p-0">
            <div className="flex items-center gap-2 border-b border-[var(--ring)] px-4 py-3">
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--fg-3)]/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--fg-3)]/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--fg-3)]/60" />
              </span>
              <span className="mx-auto inline-flex items-center rounded-md bg-[var(--bg-2)] px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-2)]">
                ai.wearless.kr
              </span>
            </div>
            <GeneratedImage
              src="/generated/hero-studio.png"
              alt="제품 사진을 올리면 완성되는 Wearless 상세페이지 스튜디오 화면"
              ratio="16 / 8"
              priority
              sizes="100vw"
            />
          </div>

          {/* floating in-use chips */}
          <div
            className="pointer-events-none absolute -left-3 top-[24%] hidden animate-fade-in md:block"
            style={fade(0.55)}
          >
            <span className="wearless-glass flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-[var(--fg-1)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-success)]" />
              AI 분석 완료
            </span>
          </div>
          <div
            className="pointer-events-none absolute -right-3 bottom-[18%] hidden animate-fade-in md:block"
            style={fade(0.65)}
          >
            <span className="wearless-glass flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-[var(--fg-1)]">
              <span className="font-[family-name:var(--font-mono)] text-[var(--fg-2)]">
                12
              </span>
              컷 생성됨
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
