'use client';

import { GeneratedImage } from '@/components/ui/generated-image';
import { useReveal } from '@/lib/use-reveal';

const CUTS = [
  {
    img: '/generated/cut-styling.png',
    label: '스타일링컷',
    desc: '착용 상황과 코디 분위기',
    alt: '스타일링컷 예시 이미지',
  },
  {
    img: '/generated/cut-horizon.png',
    label: '호리존컷',
    desc: '핏과 실루엣, 앞·뒤·사이드',
    alt: '호리존컷 예시 이미지',
  },
  {
    img: '/generated/cut-product.png',
    label: '제품컷',
    desc: '디테일·소재감·마감',
    alt: '제품컷 예시 이미지',
  },
];

const Showcase = () => {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <section className="relative z-10 px-6 py-[var(--sp-section)]">
      <div className="mx-auto max-w-[var(--container)]">
        <div className="mx-auto max-w-[560px] text-center">
          <p className="t-eyebrow whitespace-normal">결과물</p>
          <h2 className="t-h1 whitespace-normal mt-3">한 상품, 여러 컷</h2>
          <p className="t-lead whitespace-normal mt-4">
            상세페이지에 필요한 컷 종류를 모두 만들어냅니다.
          </p>
        </div>

        <div
          ref={ref}
          className={`reveal ${shown ? 'in' : ''} mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3`}
        >
          {CUTS.map((cut) => (
            <figure
              key={cut.label}
              className="wearless-card lift overflow-hidden p-2"
            >
              <GeneratedImage
                src={cut.img}
                alt={cut.alt}
                ratio="3 / 4"
                className="rounded-[10px]"
                sizes="(max-width: 640px) 100vw, 360px"
              />
              <figcaption className="flex items-center justify-between px-2 py-3">
                <span className="t-h3 whitespace-normal">{cut.label}</span>
                <span className="t-caption whitespace-normal text-[var(--fg-3)]">
                  {cut.desc}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Showcase };
