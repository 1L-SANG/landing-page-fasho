'use client';

import { GeneratedImage } from '@/components/ui/generated-image';
import { SectionHeader } from '@/components/ui/section-header';
import { useReveal } from '@/lib/use-reveal';

interface Step {
  n: string;
  kicker: string;
  title: string;
  desc: string;
  img: string;
  alt: string;
}

const STEPS: Step[] = [
  {
    n: '01',
    kicker: 'UPLOAD · ANALYZE',
    title: '업로드 & AI 분석',
    desc: '상품 사진 몇 장만 올리면 의류 종류·소재·핏·강조 특징을 AI가 자동으로 정리합니다. 실측은 직접 확인해 채웁니다.',
    img: '/generated/step-1-analyze.png',
    alt: 'AI가 상품 이미지를 분석해 정보를 정리하는 화면',
  },
  {
    n: '02',
    kicker: 'MANNEQUIN',
    title: '마네킹컷으로 핏 확정',
    desc: 'A/B 후보를 보고 총기장과 핏을 조정해, 실제 이미지 생성 전에 실루엣 기준을 먼저 잡습니다.',
    img: '/generated/step-2-mannequin.png',
    alt: '마네킹컷 A/B 후보와 핏 조정 패널',
  },
  {
    n: '03',
    kicker: 'STORYBOARD',
    title: '콘티보드로 구성',
    desc: '간단형 6–9컷, 기본형 11–15컷, 확장형 18–26컷. 컷 종류·방향·샷·색상을 카드로 배치하고 카피라이팅을 켜둡니다.',
    img: '/generated/step-3-storyboard.png',
    alt: '상세페이지 콘티보드 카드 구성 화면',
  },
  {
    n: '04',
    kicker: 'EDITOR · EXPORT',
    title: '에디터에서 완성 · 다운로드',
    desc: '블록 단위 캔버스 에디터에서 이미지·텍스트를 직접 다듬고, 긴 PNG 한 장 또는 블록별 ZIP으로 내보냅니다.',
    img: '/generated/step-4-editor.png',
    alt: '캔버스형 상세페이지 에디터 화면',
  },
];

const StepRow = ({ step, index }: { step: Step; index: number }) => {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const flip = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? 'in' : ''} grid items-center gap-10 md:grid-cols-[1fr_1.05fr] md:gap-16`}
    >
      {/* text */}
      <div className={flip ? 'md:order-2 md:pl-6' : 'md:pr-6'}>
        <div className="flex items-baseline gap-4">
          <span className="t-num text-[64px] opacity-[0.2]">{step.n}</span>
          <span className="t-mono pb-1.5">{step.kicker}</span>
        </div>
        <h3 className="t-h2 whitespace-normal mt-4">{step.title}</h3>
        <p className="t-body whitespace-normal mt-3 max-w-[420px]">{step.desc}</p>
      </div>

      {/* image */}
      <div className={flip ? 'md:order-1' : ''}>
        <figure className="wearless-card lift overflow-hidden">
          <GeneratedImage
            src={step.img}
            alt={step.alt}
            ratio="4 / 3"
            sizes="(max-width: 768px) 100vw, 520px"
          />
          <figcaption className="flex items-center justify-between border-t border-[var(--ring)] px-5 py-3">
            <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--fg-3)]">
              STEP {step.n}
            </span>
            <span className="t-caption text-[var(--fg-2)]">{step.title}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
};

const StudioFlow = () => {
  return (
    <section id="how" className="section py-[var(--sp-section-lg)]">
      <div className="section-inner">
        <SectionHeader
          eyebrow="How it works"
          title="촬영 없이, 상세페이지까지"
          sub="실제 스튜디오의 흐름 그대로. 네 단계면 완성됩니다."
        />

        <div className="mt-20 flex flex-col gap-20 md:gap-28">
          {STEPS.map((step, i) => (
            <StepRow key={step.n} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export { StudioFlow };
