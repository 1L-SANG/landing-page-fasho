'use client';

import { ArrowRight } from 'lucide-react';
import { GlowCTA } from '@/components/ui/glow-cta';
import { useReveal } from '@/lib/use-reveal';
import { APP_URL } from '@/lib/config';

const FinalCTA = () => {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <section className="section pb-[var(--sp-section-lg)] pt-4">
      <div
        ref={ref}
        className={`reveal ${shown ? 'in' : ''} wearless-glass mx-auto flex max-w-[900px] flex-col items-center overflow-hidden px-6 py-20 text-center`}
      >
        <p className="t-eyebrow">Start now</p>
        <h2 className="display-hero whitespace-normal mt-5 max-w-[16ch] text-[clamp(30px,5vw,56px)]">
          촬영은 그만.
          <br />
          상세페이지는 지금 시작하세요.
        </h2>
        <p className="t-lead whitespace-normal mt-5 max-w-[40ch]">
          제품 사진을 올리는 것부터 시작입니다. 설치도, 카드 등록도 필요 없어요.
        </p>
        <div className="mt-10">
          <GlowCTA href={APP_URL} className="h-[52px] px-9 text-[17px]">
            무료로 시작하기
            <ArrowRight size={18} strokeWidth={2.2} />
          </GlowCTA>
        </div>
      </div>
    </section>
  );
};

export { FinalCTA };
