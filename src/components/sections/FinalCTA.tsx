'use client';

import { ArrowRight } from 'lucide-react';
import { GlowCTA } from '@/components/ui/glow-cta';
import { useReveal } from '@/lib/use-reveal';
import { APP_URL } from '@/lib/config';

const FinalCTA = () => {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <section className="relative z-10 px-6 pb-[var(--sp-section)] pt-6">
      <div
        ref={ref}
        className={`reveal ${shown ? 'in' : ''} wearless-glass mx-auto flex max-w-[920px] flex-col items-center px-6 py-16 text-center`}
      >
        <h2 className="display-hero whitespace-normal max-w-[640px]">
          촬영은 그만.
          <br />
          상세페이지는 지금 시작하세요.
        </h2>
        <p className="t-lead whitespace-normal mt-5 max-w-[440px]">
          제품 사진을 올리는 것부터 시작입니다.
        </p>
        <div className="mt-9">
          <GlowCTA href={APP_URL} className="px-8 text-[17px]">
            시작하기
            <ArrowRight size={18} strokeWidth={2.2} />
          </GlowCTA>
        </div>
      </div>
    </section>
  );
};

export { FinalCTA };
