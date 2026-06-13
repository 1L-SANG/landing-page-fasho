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
    <section className="relative z-10 px-6 py-14">
      <div
        ref={ref}
        className={`reveal ${shown ? 'in' : ''} mx-auto max-w-[var(--container)]`}
      >
        <p className="t-eyebrow whitespace-normal text-center">
          이미 함께하고 있는 브랜드
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {LOGOS.map((logo) => (
            <Image
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              width={104}
              height={36}
              className="h-8 w-auto object-contain opacity-45 grayscale transition-all duration-200 hover:opacity-90 hover:grayscale-0"
            />
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--r-6)] bg-[var(--ring)] sm:grid-cols-3 wearless-card">
          {STATS.map((stat) => (
            <div
              key={stat.value}
              className="flex flex-col items-center justify-center bg-white px-6 py-7 text-center"
            >
              <span className="font-display text-[30px] leading-none text-[var(--fg-1)]">
                {stat.value}
              </span>
              <span className="t-caption whitespace-normal mt-2">
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
