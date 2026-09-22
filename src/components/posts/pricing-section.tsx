'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Badge } from '@/components/ui/badge';
import { goToPricing } from '@/lib/app-url';

interface Plan {
    name: string;
    billing: string;
    price: string;
    priceSuffix?: string;
    /** 지급 크레딧. 증정이 있으면 baseCredits 에 취소선이 붙고 credits 가 강조된다. */
    credits: string;
    baseCredits?: string;
    bonusNote?: string;
    features: string[];
    recommended?: boolean;
    ctaLabel: string;
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
        priceSuffix: '/ 월',
        credits: '600',
        features: [
            '기본모델 2명 무료 제공',
            '마네킹컷 1회 무료 수정 가능',
            '에디터 기능 제공',
            '무제한 다운로드 가능',
        ],
        ctaLabel: '구매하기',
    },
    {
        name: 'Seller',
        billing: '정기 구독',
        price: '₩69,900',
        priceSuffix: '/ 월',
        credits: '1,600',
        baseCredits: '1,400',
        bonusNote: '200 크레딧 추가 증정',
        features: [
            'Starter의 모든 기능 제공',
            '모든 AI 모델 50% 할인',
            '매칭의류 커스텀 업로드 가능',
            '충전할 때마다 크레딧 5% 보너스',
        ],
        recommended: true,
        ctaLabel: '구매하기',
    },
    {
        name: 'Pro',
        billing: '정기 구독',
        price: '₩119,000',
        priceSuffix: '/ 월',
        credits: '2,800',
        baseCredits: '2,400',
        bonusNote: '400 크레딧 추가 증정',
        features: [
            'Seller의 모든 기능 제공',
            '마네킹컷 2회 무료 수정 가능',
            '모든 AI 모델 무료 제공',
            '충전할 때마다 크레딧 10% 보너스',
        ],
        ctaLabel: '구매하기',
    },
];

const PricingCard = ({ plan, delay }: { plan: Plan; delay: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={cardRef}
            className={`relative h-full transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {/* Recommended Badge */}
            {plan.recommended && (
                <Badge variant="dark" className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                    MOST POPULAR
                </Badge>
            )}

            <div className="flex h-full flex-col rounded-[20px] border-[1.5px] border-[rgba(34,42,53,0.12)] bg-white p-5 min-[381px]:p-7 min-[1001px]:p-[clamp(20px,2.8vw,40px)] shadow-[0_4px_8px_rgba(34,42,53,0.05)]">
                {/* Billing kicker */}
                <p className="mb-1 text-[13px] font-medium text-[#9E9E9E]">{plan.billing}</p>

                {/* Plan Name */}
                <p className="mb-4 text-[26px] font-extrabold tracking-[-0.02em] text-[#1A1A1A]">
                    {plan.name}
                </p>

                {/* Price */}
                <div>
                    <span className="text-[36px] font-extrabold text-[#1A1A1A]">{plan.price}</span>
                    {plan.priceSuffix && (
                        <span className="text-[16px] text-[#9E9E9E]"> {plan.priceSuffix}</span>
                    )}
                </div>

                {/* 스튜디오와 동일하게 총 크레딧 오른쪽 위에 증정 태그를 표시한다. */}
                <div className="relative my-6 border-y border-[rgba(34,42,53,0.08)] pb-6 pt-[52px]">
                  <div className="flex items-baseline gap-2 whitespace-nowrap text-[24px] font-extrabold tracking-[-0.02em] text-[#1A1A1A]">
                    {plan.baseCredits && (
                        <>
                            <s className="text-[18px] font-semibold text-[#B5B5B5] decoration-2">{plan.baseCredits}</s>
                            <span className="text-[18px] font-medium text-[#B5B5B5]">→</span>
                        </>
                    )}
                    <span className="inline-block">
                        {plan.credits}
                        {plan.bonusNote && (
                            <em className="absolute right-0 top-4 inline-flex min-h-7 items-center whitespace-nowrap rounded-[12px_12px_12px_4px] border border-(--pricing-bonus-border) bg-(--pricing-bonus-bg) px-2.5 py-1 text-[12px] leading-[18px] font-semibold not-italic tracking-[-0.01em] text-(--pricing-bonus-fg) shadow-[0_3px_4px_-3px_color-mix(in_srgb,var(--pricing-bonus-fg)_24%,transparent)]">
                                {plan.bonusNote}
                            </em>
                        )}
                    </span>
                    <span className="text-[14px] font-medium text-[#6B6B6B]">크레딧</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="mb-8 flex-1 space-y-3.5">
                    {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span
                                className="mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-[#2F80ED]"
                                aria-hidden="true"
                            >
                                <Check size={12} strokeWidth={3} className="text-white" />
                            </span>
                            <span className="text-[15px] text-[#6B6B6B]">{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* 분석 특징 칩과 같은 색상·9초 회전. 다른 섹션의 공용 테두리는 유지한다. */}
                <div className="mt-auto rounded-[13px] p-0.5 [background:conic-gradient(from_var(--pricing-ring-angle),var(--pricing-glow-sky),var(--pricing-glow-sage),var(--pricing-glow-sun),var(--pricing-glow-mauve),var(--pricing-glow-sky))] motion-safe:animate-[pricingRingRotate_9s_linear_infinite]">
                    <button
                        type="button"
                        onClick={goToPricing}
                        className="min-h-11 w-full cursor-pointer rounded-[11px] bg-[#2C2C2C] px-8 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-[#1B1B1B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7fd0f0] motion-reduce:transition-none"
                        aria-label={`${plan.name} 요금제 선택하기`}
                        tabIndex={0}
                    >
                        {plan.ctaLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PricingSection = () => {
    return (
        <section
            id="pricing"
            className="px-6 py-24 md:py-32"
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(30px)',
                borderTop: '1px solid rgba(235, 230, 220, 0.5)',
            }}
        >
            <div className="mx-auto max-w-[1180px]">
                <SectionHeader
                    label="PRICING"
                    title="합리적인 요금제"
                    subtitle="월간 정기결제 상품으로, 결제 완료 즉시 1개월 동안 이용할 수 있어요."
                />

                <div className="grid grid-cols-1 items-stretch gap-6 min-[1001px]:grid-cols-3">
                    {PLANS.map((plan, i) => (
                        <PricingCard key={plan.name} plan={plan} delay={i * 100} />
                    ))}
                </div>
                <p className="mt-6 text-[14px] leading-7 text-[#6B6B6B]">
                    해지하지 않으면 매월 자동 갱신 및 결제됩니다. 스튜디오의 구독 관리에서 해지하면
                    다음 갱신부터 결제되지 않으며, 이미 결제한 기간의 종료일까지 이용할 수 있습니다.
                    표시 금액은 부가가치세를 포함합니다.{' '}
                    <Link href="/refund" className="underline underline-offset-4">환불 및 크레딧 이용조건</Link>을 확인해 주세요.
                </p>
                <p className="mt-2 text-[14px] leading-7 text-[#6B6B6B]">
                    미사용 구독 크레딧은 구독 유지 중 다음 달로 이월됩니다. 해지 후 이미 결제한 이용기간이 끝나면
                    이월분을 포함해 모두 소멸합니다. 갱신 결제 실패 시 3일의 유예기간이 있으며,
                    그 안에 결제가 완료되지 않으면 구독이 종료되고 구독 크레딧이 소멸합니다.
                </p>
                <p className="mt-2 text-[14px] leading-7 text-[#6B6B6B]">
                    결제일부터 7일 이내에 해당 결제로 지급된 크레딧을 사용하지 않았다면 전액 환불을 신청할 수 있습니다.
                    사용한 부분의 청약철회는 제한될 수 있지만, 미제공 부분의 법령상 환불 권리는 제한하지 않습니다.
                    환불 및 중도해지는 <a href="mailto:contact@wearless.kr" className="underline underline-offset-4">contact@wearless.kr</a>로 신청해 주세요.
                </p>
            </div>
        </section>
    );
};

export { PricingSection };
