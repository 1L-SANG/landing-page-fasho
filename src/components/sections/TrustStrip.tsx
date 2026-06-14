'use client';

import Image from 'next/image';
import { useReveal } from '@/lib/use-reveal';

const LOGOS = [
  { src: '/eko-logo.png', alt: 'EKO' },
  { src: '/oac-logo.png', alt: 'OAC' },
  { src: '/teenz-logo.png', alt: 'TEENZ' },
];

const STATS = [
  { value: '4단계', label: '업로드 → 분석 → 콘티 → 에디터' },
  { value: '6–26컷', label: '구성 방식별 자동 생성' },
  { value: '0', label: '스튜디오 · 모델 · 조명' },
];

const TrustStrip = () => {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <section className="section pb-4 pt-6">
      <div
        ref={ref}
        className={`reveal ${shown ? 'in' : ''} section-inner`}
      >
        <p className="t-mono text-center">Trusted by</p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
          {LOGOS.map((logo) => (
            <Image
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              width={120}
              height={40}
              className="h-9 w-auto object-contain opacity-60 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0"
            />
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 divide-y divide-[var(--ring)] overflow-hidden rounded-[var(--r-6)] bg-white shadow-[var(--elev-card)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((stat) => (
            <div
              key={stat.value}
              className="flex flex-col items-center justify-center px-6 py-8 text-center"
            >
              <span className="font-display text-[34px] leading-none text-[var(--fg-1)]">
                {stat.value}
              </span>
              <span className="t-caption whitespace-normal mt-2.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { TrustStrip };
