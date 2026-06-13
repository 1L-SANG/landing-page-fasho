'use client';

import {
  Fingerprint,
  Palette,
  PenLine,
  Coins,
  PencilRuler,
  SlidersHorizontal,
} from 'lucide-react';
import { useReveal } from '@/lib/use-reveal';
import type { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  {
    icon: Fingerprint,
    title: '의류 동일성 보존',
    desc: '생성된 컷에서도 원본 상품의 디테일과 형태를 그대로 유지합니다.',
  },
  {
    icon: Palette,
    title: '색상별 컷',
    desc: '추가 색상을 등록하면 컬러 옵션별 이미지를 한 번에 만들어냅니다.',
  },
  {
    icon: PenLine,
    title: '자동 카피라이팅',
    desc: '소재·핏·강조 특징을 바탕으로 과장 없는 상세페이지 카피를 채웁니다.',
  },
  {
    icon: Coins,
    title: '크레딧 사전 예고',
    desc: '생성·조정 등 비용이 드는 행동은 실행 전에 예상 크레딧을 보여줍니다.',
  },
  {
    icon: PencilRuler,
    title: '캔버스 에디터',
    desc: '블록·이미지·텍스트·도형을 직접 편집하고 긴 PNG / ZIP으로 내보냅니다.',
  },
  {
    icon: SlidersHorizontal,
    title: '마네킹 핏 조정',
    desc: '총기장과 핏을 단계로 조정해 실루엣 기준을 먼저 확정합니다.',
  },
];

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const Icon = feature.icon;
  return (
    <div
      ref={ref}
      className={`reveal ${shown ? 'in' : ''} wearless-card lift p-6`}
      style={{ transitionDelay: `${(index % 3) * 70}ms` }}
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--bg-2)] text-[var(--fg-1)]">
        <Icon size={20} strokeWidth={1.9} />
      </span>
      <h3 className="t-h3 whitespace-normal mt-4">{feature.title}</h3>
      <p className="t-caption whitespace-normal mt-2">{feature.desc}</p>
    </div>
  );
};

const Features = () => {
  return (
    <section id="features" className="relative z-10 px-6 py-[var(--sp-section)]">
      <div className="mx-auto max-w-[var(--container)]">
        <div className="mx-auto max-w-[560px] text-center">
          <p className="t-eyebrow whitespace-normal">왜 Wearless</p>
          <h2 className="t-h1 whitespace-normal mt-3">
            셀러가 필요한 것만, 정확하게
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export { Features };
