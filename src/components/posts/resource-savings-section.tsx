'use client';

import { useState, useEffect, useRef } from 'react';
import { TrendingDown, Zap, Star, Plus } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';

const STATS = [
    {
        icon: TrendingDown,
        value: '90%',
        label: '비용 절감',
        description: `상세페이지 제작 비용\n(기존 대비)`,
        gradient: 'linear-gradient(135deg, #12ADE6, #4C63FC)',
        iconBg: 'linear-gradient(135deg, #12ADE6, #4C63FC)',
    },
    {
        icon: Zap,
        value: '10배',
        label: '속도 향상',
        description: '압도적으로 빨라진 제작 속도',
        gradient: 'linear-gradient(135deg, #4C63FC, #DC4CFC)',
        iconBg: 'linear-gradient(135deg, #4C63FC, #DC4CFC)',
    },
    {
        icon: Star,
        value: '4.9',
        label: '고객 만족도',
        description: `5점 만점\n(베타테스터 기준)`,
        gradient: 'linear-gradient(135deg, #DC4CFC, #FF0080)',
        iconBg: 'linear-gradient(135deg, #DC4CFC, #FF0080)',
    },
] as const;

const ResourceSavingsSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="px-6 py-16 sm:py-24 md:py-32"
            style={{
                backgroundColor: 'rgba(250, 250, 250, 0.6)',
                backdropFilter: 'blur(30px)',
            }}
        >
            <div className="mx-auto max-w-[1200px]">
                {/* Plus Icon */}
                <div className="mb-6 flex justify-center sm:mb-10">
                    <div
                        className={`relative transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
                    >
                        <div className="absolute inset-0 rounded-full opacity-30 blur-2xl"
                            style={{ background: 'linear-gradient(135deg, #12ADE6, #4C63FC, #DC4CFC)' }}
                        />
                        <Plus size={80} strokeWidth={2.5} className="relative h-14 w-14 text-[#1A1A1A] sm:h-20 sm:w-20" aria-hidden="true" />
                    </div>
                </div>

                <SectionHeader
                    title="리소스 대폭 절감"
                    subtitle="촬영과 편집에 쓰던 시간을 줄이고, 파는 데 집중하세요."
                />

                {/* Stats Grid */}
                <GradientBorderContainer innerClassName="bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-3">
                        {STATS.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={i}
                                    className={`group flex items-center gap-4 px-5 py-4 text-left transition-all duration-700 hover:bg-gradient-to-b hover:from-[#FAFAFA] hover:to-white sm:block sm:p-5 sm:text-center md:p-12 ${i < STATS.length - 1 ? 'border-b border-[#E5E5E5] sm:border-b-0 sm:border-r' : ''
                                        } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                    style={{ transitionDelay: `${i * 100}ms` }}
                                >
                                    {/* Icon */}
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform hover:scale-110 sm:mx-auto sm:mb-4 sm:h-12 sm:w-12 sm:rounded-2xl md:mb-5 md:h-16 md:w-16"
                                        style={{ background: stat.iconBg }}
                                    >
                                        <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6 md:h-8 md:w-8" aria-hidden="true" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-baseline gap-2 sm:block">
                                            {/* Value */}
                                            <div
                                                className="text-[28px] font-bold sm:mb-2 sm:text-[38px] md:mb-3 md:text-[58px]"
                                                style={{
                                                    background: stat.gradient,
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                }}
                                            >
                                                {stat.value}
                                            </div>

                                            {/* Label */}
                                            <h3 className="mb-1 text-[16px] font-bold text-[#1A1A1A] sm:text-[19px] md:mb-2 md:text-[24px]">
                                                {stat.label}
                                            </h3>
                                        </div>

                                        {/* Description */}
                                        <p className="text-[14px] leading-[1.6] text-[#6B6B6B] sm:text-[13px] md:whitespace-normal md:text-[15px]">
                                            {stat.description}
                                        </p>
                                    </div>

                                    {/* Bottom gradient line */}
                                    <div className="mx-auto mt-2 hidden h-[2px] w-8 scale-x-0 transition-transform group-hover:scale-x-100 sm:mt-4 sm:block sm:w-14 md:mt-6 md:w-24"
                                        style={{ background: stat.gradient }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </GradientBorderContainer>
            </div>
        </section>
    );
};

export { ResourceSavingsSection };
