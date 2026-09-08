'use client';

import { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { goToPricing } from '@/lib/app-url';

interface Plan {
    name: string;
    billing: string;
    price: string;
    priceSuffix?: string;
    features: string[];
    recommended?: boolean;
    ctaLabel: string;
}

const PLANS: Plan[] = [
    {
        name: 'Basic',
        billing: '정기 구독',
        price: '₩19,900',
        priceSuffix: '/ 월',
        features: ['크레딧 200 매달 충전', '2k 해상도 다운로드'],
        ctaLabel: '선택',
    },
    {
        name: 'Plus',
        billing: '정기 구독',
        price: '₩49,900',
        priceSuffix: '/ 월',
        features: ['크레딧 600 매달 충전', '4k 해상도 다운로드', '워터마크 없음'],
        recommended: true,
        ctaLabel: '선택',
    },
    {
        name: 'Seller',
        billing: '정기 구독',
        price: '₩99,900',
        priceSuffix: '/ 월',
        features: ['크레딧 1,400 매달 충전', '4k 해상도 다운로드', '워터마크 없음', '우선 생성 처리'],
        ctaLabel: '선택',
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

    const content = (
        <div className={`flex h-full flex-col p-10 ${plan.recommended ? '' : 'rounded-[20px] border-[1.5px] border-[#E5E5E5] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]'}`}>
            {/* Billing kicker */}
            <p className="mb-1 text-[13px] font-medium text-[#9E9E9E]">{plan.billing}</p>

            {/* Plan Name */}
            <p className={`mb-2 text-[16px] font-semibold ${plan.recommended ? 'text-[#1A1A1A]' : 'text-[#6B6B6B]'}`}>
                {plan.name}
            </p>

            {/* Price */}
            <div className="mb-6">
                <span className="text-[36px] font-extrabold text-[#1A1A1A]">{plan.price}</span>
                {plan.priceSuffix && (
                    <span className="text-[16px] text-[#9E9E9E]"> {plan.priceSuffix}</span>
                )}
            </div>

            {/* Divider */}
            <div className="mb-6 h-px bg-[#F0F0F0]" />

            {/* Features */}
            <ul className="mb-8 flex-1 space-y-3.5">
                {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <Check size={18} strokeWidth={2.5} className="mt-0.5 flex-shrink-0 text-[#1A1A1A]" aria-hidden="true" />
                        <span className="text-[15px] text-[#6B6B6B]">{feature}</span>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <Button
                variant={plan.recommended ? 'primary' : 'ghost'}
                size="md"
                onClick={goToPricing}
                className={`w-full rounded-xl ${plan.recommended ? 'shadow-[0_4px_16px_rgba(0,0,0,0.15)]' : ''}`}
                aria-label={`${plan.name} 요금제 선택하기`}
                tabIndex={0}
            >
                {plan.ctaLabel}
            </Button>
        </div>
    );

    return (
        <div
            ref={cardRef}
            className={`relative transition-all duration-700 ${plan.recommended ? 'md:scale-105' : ''} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {/* Recommended Badge */}
            {plan.recommended && (
                <Badge variant="dark" className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                    MOST POPULAR
                </Badge>
            )}

            {plan.recommended ? (
                <GradientBorderContainer innerClassName="bg-white">
                    {content}
                </GradientBorderContainer>
            ) : (
                content
            )}
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
                    subtitle="필요한 만큼 골라 쓰세요. 크레딧은 매달 다시 채워져요."
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {PLANS.map((plan, i) => (
                        <PricingCard key={plan.name} plan={plan} delay={i * 100} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export { PricingSection };
