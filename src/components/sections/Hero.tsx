'use client';

import { ArrowRight, ArrowDown } from 'lucide-react';
import { GlowChip } from '@/components/ui/glow-chip';
import { GlowCTA } from '@/components/ui/glow-cta';
import { GlassCard } from '@/components/ui/glass-card';
import { GeneratedImage } from '@/components/ui/generated-image';
import { APP_URL } from '@/lib/config';

const fade = (delay: number) => ({
  animationDelay: `${delay}s`,
  animationDuration: '0.6s',
});

const Hero = () => {
  return (
    <section
      id="home"
      className="relative z-10 flex min-h-screen flex-col items-center px-6 pb-16 pt-[120px] text-center"
    >
      <div className="animate-fade-in" style={fade(0)}>
        <GlowChip>AI 상세페이지 스튜디오</GlowChip>
      </div>

      <h1
        className="display-hero whitespace-normal mt-7 max-w-[760px] animate-fade-in"
        style={fade(0.1)}
      >
        제품 사진만 올리세요.
        <br />
        상세페이지는 AI가.
      </h1>

      <p
        className="t-lead whitespace-normal mt-5 max-w-[520px] animate-fade-in"
        style={fade(0.22)}
      >
        분석부터 마네킹컷, 콘티, 에디터까지 — 제품 사진 몇 장이면 충분합니다.
      </p>

      <div
        className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-in"
        style={fade(0.34)}
      >
        <GlowCTA href={APP_URL}>
          무료로 시작하기
          <ArrowRight size={17} strokeWidth={2.2} />
        </GlowCTA>
        <a
          href="#how"
          className="inline-flex h-11 items-center gap-1.5 rounded-full bg-white px-5 text-[15px] font-medium text-[var(--fg-1)] shadow-[0_0_0_1px_var(--ring)] transition-all duration-150 hover:-translate-y-px hover:shadow-[0_0_0_1px_var(--ring-strong)]"
        >
          작동 방식 보기
          <ArrowDown size={16} strokeWidth={2.2} />
        </a>
      </div>

      <div
        className="relative z-10 mt-14 w-full max-w-[940px] animate-fade-in"
        style={fade(0.12)}
      >
        <GlassCard className="overflow-hidden p-2 sm:p-3">
          <GeneratedImage
            src="/generated/hero-studio.png"
            alt="제품 사진을 올리면 완성되는 Wearless 상세페이지 스튜디오 화면"
            ratio="16 / 10"
            priority
            sizes="(max-width: 940px) 100vw, 940px"
            className="rounded-[12px]"
          />
        </GlassCard>
      </div>
    </section>
  );
};

export { Hero };
