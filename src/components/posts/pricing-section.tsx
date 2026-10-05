'use client';

import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { buttonStyles } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/components/ui/cn';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
import { useInViewOnce } from '@/components/ui/use-in-view-once';
import { APP_PRICING_URL } from '@/lib/app-url';

interface PlanFeature {
    text: string;
    /** 플랜 간 차이를 만드는 수치·혜택. text 안의 이 부분만 진하게 보인다. */
    highlight?: string;
    /** '…의 모든 기능 제공'처럼 아래 플랜을 물려받는 줄. 한 단계 흐리게 둔다. */
    inherited?: boolean;
}

interface Plan {
    name: string;
    billing: string;
    price: string;
    /** 지급 크레딧. 증정이 있으면 baseCredits 에 취소선이 붙고 credits 가 강조된다. */
    credits: string;
    baseCredits?: string;
    bonusNote?: string;
    features: PlanFeature[];
    recommended?: boolean;
}

/**
 * 요금제 정본 — `documents/research/2026-09-07-credit-pricing-plans.md` §5 (wearless_studio).
 * 서비스 앱 `/pricing` 화면과 **같은 숫자**여야 한다. 한쪽만 고치지 마라.
 * 2026-09-11 환율 개정: 100원 = 2크레딧(1크레딧 50원). 취소선 숫자는 그 가격을 Starter 단가(49.83원/크레딧)로 환산한 값이라, 실제 지급량과의
 * 차이가 그대로 증정으로 읽힌다.
 */
const PLANS: Plan[] = [
    {
        name: 'Starter',
        billing: '정기 구독',
        price: '₩29,900',
        credits: '600',
        features: [
            { text: '기본모델 2명 무료 제공' },
            { text: '마네킹컷 1회 무료 수정 가능' },
            { text: '에디터 기능 제공' },
            { text: '무제한 다운로드 가능' },
        ],
    },
    {
        name: 'Seller',
        billing: '정기 구독',
        price: '₩69,900',
        credits: '1,600',
        baseCredits: '1,400',
        bonusNote: '200 크레딧 추가 증정',
        features: [
            { text: 'Starter의 모든 기능 제공', inherited: true },
            { text: '모든 AI 모델 50% 할인', highlight: '50% 할인' },
            { text: '매칭의류 커스텀 업로드 가능' },
            { text: '충전할 때마다 크레딧 5% 보너스', highlight: '5% 보너스' },
        ],
        recommended: true,
    },
    {
        name: 'Pro',
        billing: '정기 구독',
        price: '₩119,000',
        credits: '2,800',
        baseCredits: '2,400',
        bonusNote: '400 크레딧 추가 증정',
        features: [
            { text: 'Seller의 모든 기능 제공', inherited: true },
            { text: '마네킹컷 2회 무료 수정 가능', highlight: '2회 무료 수정' },
            { text: '모든 AI 모델 무료 제공', highlight: '무료 제공' },
            { text: '충전할 때마다 크레딧 10% 보너스', highlight: '10% 보너스' },
        ],
    },
];

// 3열(lg)에서만 순차 등장시킨다. 세로 스택에서는 카드마다 따로 관찰하므로 지연이 필요 없다.
const STAGGER = ['', 'lg:delay-100', 'lg:delay-200'] as const;

const renderFeatureText = ({ text, highlight }: PlanFeature) => {
    const start = highlight ? text.indexOf(highlight) : -1;
    if (!highlight || start < 0) return text;
    return (
        <>
            {text.slice(0, start)}
            <strong className="font-semibold text-[#1A1A1A]">{highlight}</strong>
            {text.slice(start + highlight.length)}
        </>
    );
};

const PricingCard = ({ plan, index }: { plan: Plan; index: number }) => {
    const [cardRef, isVisible] = useInViewOnce<HTMLDivElement>(0.2);
    const planSlug = plan.name.toLowerCase();
    const titleId = `plan-${planSlug}`;
    const ctaHref = `${APP_PRICING_URL}?plan=${planSlug}`;
    const ctaLabel = `${plan.name}로 시작하기`;

    return (
        <div
            ref={cardRef}
            className={cn(
                'h-full transition-[opacity,translate] duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
                STAGGER[index],
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            )}
        >
            <Card
                as="article"
                variant={plan.recommended ? 'featured' : 'default'}
                aria-labelledby={titleId}
                className="flex h-full flex-col"
            >
                {/* 카드 윗선에 걸치는 배지. 같은 뜻을 h3 안 sr-only로 읽히므로 중복 낭독을 막는다. */}
                {plan.recommended && (
                    <Badge
                        variant="dark"
                        size="md"
                        aria-hidden="true"
                        className="absolute -top-4 left-1/2 z-10 -translate-x-1/2"
                    >
                        가장 많이 선택
                    </Badge>
                )}

                {/* Billing kicker — 추천 카드는 배지 아래 16px 이상을 띄운다. */}
                <p
                    className={cn(
                        'mb-1 text-[14px] leading-[1.4] font-medium text-[#6B6B6B]',
                        // lg 이상은 mt-2가 카드의 8px 리프트를 상쇄해 세 카드의 행이 맞는다(xl 포함).
                        plan.recommended && 'mt-3 lg:mt-2'
                    )}
                >
                    {plan.billing}
                </p>

                <h3
                    id={titleId}
                    className="mb-3 text-[22px] leading-[1.25] font-bold tracking-[-0.01em] text-[#1A1A1A] md:mb-4 md:text-[24px]"
                >
                    {plan.name}
                    {plan.recommended && <span className="sr-only"> (추천 요금제)</span>}
                </h3>

                <p className="leading-[1.15]">
                    <span className="text-[32px] font-bold tracking-[-0.02em] tabular-nums text-[#1A1A1A] md:text-[36px]">
                        {plan.price}
                    </span>
                    <span aria-hidden="true" className="text-[16px] text-[#6B6B6B]"> / 월</span>
                    <span className="sr-only">, 매월 결제</span>
                </p>

                {/* 증정 카드는 숫자 위 태그 자리(태그 28 + 간격 8)를 비워 두고, 3열에서는 Starter도 같은 높이로 맞춘다. */}
                <div
                    className={cn(
                        'my-5 border-y border-[rgba(34,42,53,0.08)] pb-5 lg:my-6 lg:pb-6',
                        plan.bonusNote ? 'pt-[52px]' : 'pt-5 lg:pt-[52px]'
                    )}
                >
                    <div className="flex items-baseline gap-2 whitespace-nowrap text-[20px] leading-[1.4] font-bold tracking-[-0.02em] text-[#1A1A1A]">
                        {plan.baseCredits && (
                            <>
                                <s className="text-[16px] leading-[24px] font-semibold tracking-normal text-[#6B6B6B] decoration-[1.5px]">
                                    <span className="sr-only">기존 </span>
                                    {plan.baseCredits}
                                </s>
                                <span aria-hidden="true" className="text-[16px] font-medium tracking-normal text-[#B5B5B5]">
                                    →
                                </span>
                            </>
                        )}
                        {/* 태그를 새 숫자 왼쪽 위에 붙여 꼬리가 항상 그 숫자를 가리키게 한다(단위 뒤에 두어 '1,600 크레딧'이 이어 읽힘). */}
                        <span className="relative inline-flex items-baseline gap-2">
                            <span>
                                {plan.baseCredits && <span className="sr-only">증정 포함 </span>}
                                {plan.credits}
                            </span>
                            <span className="text-[14px] font-medium tracking-normal text-[#6B6B6B]">크레딧</span>
                            {plan.bonusNote && (
                                <em className="absolute bottom-full left-0 mb-2 inline-flex min-h-7 items-center whitespace-nowrap rounded-[12px_12px_12px_4px] border border-(--pricing-bonus-border) bg-(--pricing-bonus-bg) px-2.5 py-1 text-[13px] leading-[18px] font-semibold not-italic tracking-[-0.01em] text-(--pricing-bonus-fg) shadow-[0_3px_4px_-3px_color-mix(in_srgb,var(--pricing-bonus-fg)_24%,transparent)]">
                                    {plan.bonusNote}
                                </em>
                            )}
                        </span>
                    </div>
                </div>

                <ul className="mb-6 flex-1 space-y-3 md:mb-8">
                    {plan.features.map((feature) => (
                        <li key={feature.text} className="flex items-start gap-2.5">
                            <span
                                className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-[#2F80ED] xl:mt-0.5"
                                aria-hidden="true"
                            >
                                <Check size={12} strokeWidth={3} className="text-white" />
                            </span>
                            <span
                                className={cn(
                                    'text-[15px] leading-[1.5] xl:text-[16px]',
                                    feature.inherited ? 'text-[#6B6B6B]' : 'text-[#4A4A4A]'
                                )}
                            >
                                {renderFeatureText(feature)}
                            </span>
                        </li>
                    ))}
                </ul>

                {plan.recommended ? (
                    // 움직이는 강조는 추천 CTA 링 하나만 남긴다(체계 Animated accent budget).
                    <div className="mt-auto rounded-full p-0.5 [background:conic-gradient(from_var(--pricing-ring-angle),var(--pricing-glow-sky),var(--pricing-glow-sage),var(--pricing-glow-sun),var(--pricing-glow-mauve),var(--pricing-glow-sky))] motion-safe:animate-[pricingRingRotate_9s_linear_infinite]">
                        <a href={ctaHref} className={buttonStyles({ variant: 'primary', size: 'md', className: 'flex w-full' })}>
                            {ctaLabel}
                        </a>
                    </div>
                ) : (
                    <a href={ctaHref} className={buttonStyles({ variant: 'outline', size: 'md', className: 'mt-auto flex w-full' })}>
                        {ctaLabel}
                    </a>
                )}
            </Card>
        </div>
    );
};

const PricingSection = () => {
    return (
        <Section
            id="pricing"
            aria-labelledby="pricing-title"
            className="border-t border-[rgba(34,42,53,0.08)] bg-[rgba(255,255,255,0.5)] backdrop-blur-[30px]"
        >
            <div className="mx-auto w-full max-w-[1200px]">
                <SectionHeader
                    label="PRICING"
                    title="합리적인 요금제"
                    titleId="pricing-title"
                    subtitle={<>월간 정기결제 상품으로,<br className="md:hidden" /> 결제 즉시 1개월 동안 이용할 수 있어요.</>}
                />

                <div className="mx-auto grid max-w-[560px] grid-cols-1 items-stretch gap-8 lg:max-w-none lg:grid-cols-3 lg:gap-6">
                    {PLANS.map((plan, i) => (
                        <PricingCard key={plan.name} plan={plan} index={i} />
                    ))}
                </div>

            </div>
        </Section>
    );
};

export { PricingSection };
