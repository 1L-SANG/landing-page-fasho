'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Sliders, Sparkles, Download, ArrowRight, ArrowDown } from 'lucide-react';
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
    { icon: Download, number: '4', title: '결과물 다운로드', description: '결과물을 바로 다운로드해서 쇼핑몰에 적용하세요.' },
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
            className="relative z-20 overflow-visible px-6 py-24 md:py-32"
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

                <div className="relative overflow-visible grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={i}
                                className={`relative transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                style={{ transitionDelay: `${i * 150}ms`, zIndex: STEPS.length - i }}
                            >
                                {/* Card with subtle border */}
                                <div
                                    className="h-full rounded-[20px] p-[1px]"
                                    style={{ background: 'linear-gradient(to bottom right, #444, #333, #2A2A2A)' }}
                                >
                                    <div className="flex h-full flex-col rounded-[20px] bg-[#2A2A2A] p-8">
                                        <div className="mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-[#4A4A4A]">
                                            <Icon
                                                size={26}
                                                strokeWidth={1.8}
                                                className="text-white/90"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <h3 className="mb-3 text-[18px] font-bold text-white">{step.title}</h3>
                                        <p className="text-[14px] leading-[1.65] text-[#CCC]">{step.description}</p>
                                    </div>
                                </div>

                                {/* Arrow connector (not on last) */}
                                {i < STEPS.length - 1 && (
                                    <>
                                        <div
                                            className="absolute -bottom-[34px] left-1/2 z-40 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_10px_24px_rgba(0,0,0,0.22)] md:hidden"
                                            aria-hidden="true"
                                        >
                                            <ArrowDown size={18} className="text-[#1A1A1A]" />
                                        </div>
                                        <div
                                            className="absolute -right-[36px] top-1/2 z-40 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_12px_26px_rgba(0,0,0,0.2)] lg:flex"
                                            aria-hidden="true"
                                        >
                                            <ArrowRight size={20} className="text-[#1A1A1A]" />
                                        </div>
                                    </>
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
