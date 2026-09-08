'use client';

import { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
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
 * 취소선 숫자는 그 가격을 Starter 단가(4.98원/크레딧)로 환산한 값이라, 실제 지급량과의
 * 차이가 그대로 증정으로 읽힌다.
 */
const PLANS: Plan[] = [
    {
        name: 'Starter',
        billing: '정기 구독',
        price: '₩29,900',
        priceSuffix: '/ 월',
        credits: '6,000',
        features: [
            '기본모델 2명 무료 제공',
            '마네킹컷 1회 무료 수정 가능',
            '에디터 기능 제공',
            '무제한 다운로드 가능',
        ],
        ctaLabel: '시작하기',
    },
    {
        name: 'Seller',
        billing: '정기 구독',
        price: '₩79,900',
        priceSuffix: '/ 월',
        credits: '18,000',
        baseCredits: '16,000',
        bonusNote: '2,000 크레딧 추가 증정',
        features: [
            'Starter의 모든 기능 제공',
            '모든 AI 모델 50% 할인',
            '매칭의류 커스텀 업로드 가능',
            '충전할 때마다 크레딧 5% 보너스',
        ],
        recommended: true,
        ctaLabel: '시작하기',
    },
    {
        name: 'Pro',
        billing: '정기 구독',
        price: '₩159,000',
        priceSuffix: '/ 월',
        credits: '38,000',
        baseCredits: '32,000',
        bonusNote: '6,000 크레딧 추가 증정',
        features: [
            'Seller의 모든 기능 제공',
            '마네킹컷 2회 무료 수정 가능',
            '모든 AI 모델 무료 제공',
            '충전할 때마다 크레딧 10% 보너스',
        ],
        ctaLabel: '시작하기',
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

            <div className="flex h-full flex-col rounded-[20px] border-[1.5px] border-[#E5E5E5] bg-white p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
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

                {/* Divider */}
                <div className="my-6 h-px bg-[#F0F0F0]" />

                {/* Credits — 증정이 있으면 환산값에 취소선, 지급량에 밑줄, 그 아래 가운데 증정 문구 */}
                <div className="flex items-baseline gap-2 text-[24px] font-extrabold tracking-[-0.02em] text-[#1A1A1A]">
                    {plan.baseCredits && (
                        <>
                            <s className="text-[18px] font-semibold text-[#B5B5B5] decoration-2">{plan.baseCredits}</s>
                            <span className="text-[18px] font-medium text-[#B5B5B5]">→</span>
                        </>
                    )}
                    <span className="relative inline-block">
                        <span className={plan.bonusNote ? 'underline decoration-[#1A1A1A] decoration-[3px] underline-offset-[5px]' : ''}>
                            {plan.credits}
                        </span>
                        {plan.bonusNote && (
                            <em className="absolute left-1/2 top-full mt-2.5 -translate-x-1/2 whitespace-nowrap text-[13.5px] font-bold italic text-[#1A1A1A]">
                                {plan.bonusNote}
                            </em>
                        )}
                    </span>
                    <span className="text-[14px] font-medium text-[#6B6B6B]">크레딧</span>
                </div>

                {/* Divider — 증정 문구 자리를 항상 비워 세 카드의 항목 시작 높이를 맞춘다 */}
                <div className="mt-12 mb-6 h-px bg-[#F0F0F0]" />

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

                {/* CTA — 세 카드 모두 검정 바탕에 무지개 테두리 링 */}
                <GradientBorderContainer className="mt-auto !rounded-[13px] !p-[2px]" innerClassName="!rounded-[11px]">
                    <button
                        type="button"
                        onClick={goToPricing}
                        className="w-full cursor-pointer bg-[#1A1A1A] px-8 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-[#333333]"
                        aria-label={`${plan.name} 요금제 선택하기`}
                        tabIndex={0}
                    >
                        {plan.ctaLabel}
                    </button>
                </GradientBorderContainer>
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
            <div className="mx-auto max-w-[1000px]">
                <SectionHeader
                    label="PRICING"
                    title="합리적인 요금제"
                    subtitle="상세페이지 한 개에 13,000원. 사진 10장 기준이에요."
                />

                <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
                    {PLANS.map((plan, i) => (
                        <PricingCard key={plan.name} plan={plan} delay={i * 100} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export { PricingSection };
