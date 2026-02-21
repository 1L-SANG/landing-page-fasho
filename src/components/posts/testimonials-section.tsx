'use client';

import { useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { SectionHeader } from '@/components/ui/section-header';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';

const TESTIMONIALS = [
    {
        quote: '적자가 심해서 쇼핑몰을 포기할까 한참 고민했었어요. wearless 덕분에 오히려 지금은 매출이 최고점인 상태입니다.',
        name: '임*현 대표',
        logo: '/teenz-logo.png',
    },
    {
        quote: 'AI 느낌 날까 봐 걱정했는데, 생각보다 자연스러워서 놀랐어요..! 확실히 퀄리티 차이가 납니다.',
        name: '김*연 대표',
        logo: '/eko-logo.png',
    },
    {
        quote: '제가 찍은 컷들을 바탕으로 다양하게 생성되는게 진짜 너무 효율적이네요.',
        name: '김*지 대표',
        logo: '/oac-logo.png',
    },
] as const;

const TestimonialCard = ({
    testimonial,
    delay,
}: {
    testimonial: (typeof TESTIMONIALS)[number];
    delay: number;
}) => {
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
            className={`transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <GradientBorderContainer innerClassName="bg-white w-full h-full flex">
                <div className="flex h-full flex-col p-8 transition-transform hover:-translate-y-1">
                    {/* Stars */}
                    <div className="mb-5 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} className="fill-[#FFB800] text-[#FFB800]" aria-hidden="true" />
                        ))}
                    </div>

                    {/* Quote */}
                    <p className="mb-6 flex-1 measure-28ch typo-body-lead wrap-pretty text-kor-safe text-[#1A1A1A]">
                        &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    {/* Profile */}
                    <div className="mt-auto flex items-center gap-3">
                        <Image
                            src={testimonial.logo}
                            alt={`${testimonial.name} 로고`}
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                        />
                        <span className="text-[16px] font-semibold text-[#1A1A1A]">{testimonial.name}</span>
                    </div>
                </div>
            </GradientBorderContainer>
        </div>
    );
};

const TestimonialsSection = () => {
    return (
        <section
            className="px-6 py-24 md:py-32"
            style={{
                backgroundColor: 'rgba(245, 245, 247, 0.6)',
                backdropFilter: 'blur(30px)',
                borderTop: '1px solid rgba(235, 230, 220, 0.5)',
            }}
        >
            <div className="mx-auto max-w-[1100px]">
                <SectionHeader
                    label="TESTIMONIALS"
                    title="셀러들의 실제 반응"
                    subtitle="베타테스터 이후 일부 대표님들이 남겨주신 후기입니다. (25.11)"
                />

                <div className="grid grid-cols-1 items-stretch gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {TESTIMONIALS.map((t, i) => (
                        <TestimonialCard key={i} testimonial={t} delay={i * 150} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export { TestimonialsSection };
