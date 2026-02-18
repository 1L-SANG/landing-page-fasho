'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Sliders, Sparkles, Download } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import type { LucideIcon } from 'lucide-react';

interface Step {
    icon: LucideIcon;
    number: string;
    title: string;
    description: string;
}

const STEPS: Step[] = [
    { icon: Upload, number: '1', title: '제품 사진 업로드', description: '스마트폰으로 찍은 사진으로도 충분해요.' },
    { icon: Sliders, number: '2', title: '기능 선택', description: 'Wearless의 다양한 기능들 중, 원하는 기능을 사용해보세요.' },
    { icon: Sparkles, number: '3', title: 'AI 이미지 생성', description: '구도, 포즈, 디테일을 직관적으로 수정하며 완성도를 높이세요.' },
    { icon: Download, number: '4', title: '결과물 다운로드', description: '결과물을 바로 다운로드해서\n쇼핑몰에 적용하세요.' },
];

const HowItWorksSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            className="px-6 py-24 md:py-32"
            ref={sectionRef}
            style={{
                backgroundColor: 'rgba(245, 245, 247, 0.6)',
                backdropFilter: 'blur(30px)',
                borderTop: '1px solid rgba(235, 230, 220, 0.5)',
            }}
        >
            <div className="mx-auto max-w-[1100px]">
                <SectionHeader
                    label="HOW IT WORKS"
                    title="쉬운 사용법, 남다른 퀄리티"
                    subtitle="복잡한 설정 없이, 업로드부터 결과물까지 단 3분이면 충분합니다."
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={i}
                                className={`relative transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                style={{ transitionDelay: `${i * 150}ms` }}
                            >
                                {/* Card with monotone gradient border */}
                                <div
                                    className="h-full rounded-[20px] p-[1px]"
                                    style={{ background: 'linear-gradient(to bottom right, #1A1A1A, #4A4A4A, #6B6B6B)' }}
                                >
                                    <div className="flex h-full flex-col rounded-[20px] bg-white p-8">
                                        <Icon
                                            size={48}
                                            strokeWidth={1.5}
                                            className="mb-5 text-[#9E9E9E]"
                                            aria-hidden="true"
                                        />
                                        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A] text-[16px] font-bold text-white">
                                            {step.number}
                                        </div>
                                        <h3 className="mb-3 text-[20px] font-semibold text-[#1A1A1A]">{step.title}</h3>
                                        <p className="whitespace-pre-line text-[15px] leading-[1.6] text-[#6B6B6B]">{step.description}</p>
                                    </div>
                                </div>

                                {/* Arrow connector (desktop only, not on last) */}
                                {i < STEPS.length - 1 && (
                                    <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-[#E5E5E5] lg:block" aria-hidden="true">→</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export { HowItWorksSection };
