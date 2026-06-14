'use client';

import { GeneratedImage } from '@/components/ui/generated-image';
import { SectionHeader } from '@/components/ui/section-header';
import { useReveal } from '@/lib/use-reveal';

const CUTS = [
  {
    img: '/generated/cut-styling.png',
    n: 'A',
    label: '스타일링컷',
    desc: '착용 상황과 코디 분위기',
    alt: '스타일링컷 예시 이미지',
  },
  {
    img: '/generated/cut-horizon.png',
    n: 'B',
    label: '호리존컷',
    desc: '핏과 실루엣, 앞·뒤·사이드',
    alt: '호리존컷 예시 이미지',
  },
  {
    img: '/generated/cut-product.png',
    n: 'C',
    label: '제품컷',
    desc: '디테일 · 소재감 · 마감',
    alt: '제품컷 예시 이미지',
  },
];

const Showcase = () => {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <section className="section py-[var(--sp-section-lg)]">
      <div className="section-inner">
        <SectionHeader
          eyebrow="Output"
          title="한 상품, 여러 컷"
          sub="상세페이지에 필요한 컷 종류를 모두 만들어냅니다."
        />

        <div
          ref={ref}
          className={`reveal ${shown ? 'in' : ''} mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3`}
        >
          {CUTS.map((cut, i) => (
            <figure
              key={cut.label}
              className="wearless-card lift overflow-hidden"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <GeneratedImage
                src={cut.img}
                alt={cut.alt}
                ratio="3 / 4"
                sizes="(max-width: 640px) 100vw, 380px"
              />
              <figcaption className="flex items-center justify-between border-t border-[var(--ring)] px-5 py-4">
                <span className="flex items-center gap-2.5">
                  <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--fg-3)]">
                    {cut.n}
                  </span>
                  <span className="t-h3">{cut.label}</span>
                </span>
                <span className="t-caption text-[var(--fg-3)]">{cut.desc}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Showcase };
