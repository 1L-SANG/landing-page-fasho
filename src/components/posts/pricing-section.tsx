'use client';

import { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Plan {
    name: string;
    price: string;
    priceSuffix?: string;
    features: string[];
    recommended?: boolean;
    ctaLabel: string;
}

const PLANS: Plan[] = [
    {
        name: 'Free',
        price: '무료',
        features: ['Wearless 1.0 (Beta) 기능', '월 생성횟수 10회'],
        ctaLabel: '시작하기',
    },
    {
        name: 'Pro',
        price: '₩29,900',
        priceSuffix: '/월',
        features: ['Wearless 2.0 모든 기능', '월 생성횟수 200회', '2k 해상도 다운로드', '워터마크 없음'],
        recommended: true,
        ctaLabel: '시작하기',
    },
    {
        name: 'Seller',
        price: '₩49,900',
        priceSuffix: '/월',
        features: ['Wearless 2.0 모든 기능', '월 생성횟수 500회', '4k 해상도 다운로드', '워터마크 없음'],
        ctaLabel: '시작하기',
    },
    {
        name: 'Enterprise',
        price: '맞춤 견적',
        features: ['상담 문의'],
        ctaLabel: '문의하기',
    },
];

const PricingCard = ({ plan, delay, onCtaClick }: { plan: Plan; delay: number; onCtaClick?: () => void }) => {
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
        <div className={`flex h-full flex-col p-10 ${plan.recommended ? '' : 'border-[1.5px] border-[#E5E5E5] rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:border-[#1A1A1A] transition-all'}`}>
            {/* Plan Name */}
            <p className={`mb-2 text-[16px] font-semibold ${plan.recommended ? 'text-[#1A1A1A]' : 'text-[#6B6B6B]'}`}>
                {plan.name}
            </p>

            {/* Price */}
            <div className="mb-6">
                <span className="text-[36px] font-extrabold text-[#1A1A1A]">{plan.price}</span>
                {plan.priceSuffix && (
                    <span className="text-[16px] text-[#9E9E9E]">{plan.priceSuffix}</span>
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
                className={`w-full rounded-xl ${plan.recommended ? 'shadow-[0_4px_16px_rgba(0,0,0,0.15)]' : ''}`}
                onClick={onCtaClick}
                aria-label={plan.ctaLabel}
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

interface PricingSectionProps {
    onCtaClick?: () => void;
}

const PricingSection = ({ onCtaClick }: PricingSectionProps) => {
    const handleScrollToContact = () => {
        const element = document.getElementById('contact');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCtaClick = onCtaClick ?? handleScrollToContact;

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
            <div className="mx-auto max-w-[1200px]">
                <SectionHeader
                    label="PRICING"
                    title="합리적인 요금제"
                    subtitle="비즈니스 규모에 맞는 플랜을 선택하세요."
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {PLANS.map((plan, i) => (
                        <PricingCard key={plan.name} plan={plan} delay={i * 100} onCtaClick={handleCtaClick} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export { PricingSection };
