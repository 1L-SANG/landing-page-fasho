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
        description: '기존 대비 의류컷 제작 비용',
        gradient: 'linear-gradient(135deg, #12ADE6, #4C63FC)',
        iconBg: 'linear-gradient(135deg, #12ADE6, #4C63FC)',
    },
    {
        icon: Zap,
        value: '10배',
        label: '속도 향상',
        description: '압도적으로 빨라지는 제작 속도',
        gradient: 'linear-gradient(135deg, #4C63FC, #DC4CFC)',
        iconBg: 'linear-gradient(135deg, #4C63FC, #DC4CFC)',
    },
    {
        icon: Star,
        value: '4.9',
        label: '고객 만족도',
        description: '5점 만점 (베타테스터 기준)',
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
            className="px-6 py-24 md:py-32"
            style={{
                backgroundColor: 'rgba(250, 250, 250, 0.6)',
                backdropFilter: 'blur(30px)',
            }}
        >
            <div className="mx-auto max-w-[1200px]">
                {/* Plus Icon */}
                <div className="mb-10 flex justify-center">
                    <div
                        className={`relative transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
                    >
                        <div className="absolute inset-0 rounded-full opacity-30 blur-2xl"
                            style={{ background: 'linear-gradient(135deg, #12ADE6, #4C63FC, #DC4CFC)' }}
                        />
                        <Plus size={80} strokeWidth={2.5} className="relative text-[#1A1A1A]" aria-hidden="true" />
                    </div>
                </div>

                <SectionHeader
                    title="리소스 대폭 절감"
                    subtitle="Wearless로 촬영 리소스를 획기적으로 줄이고, 비즈니스 성장에 집중하세요."
                />

                {/* Stats Grid */}
                <GradientBorderContainer innerClassName="bg-white">
                    <div className="grid md:grid-cols-3">
                        {STATS.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={i}
                                    className={`group p-10 text-center transition-all duration-700 hover:bg-gradient-to-b hover:from-[#FAFAFA] hover:to-white md:p-12 ${i < STATS.length - 1 ? 'border-b md:border-b-0 md:border-r border-[#E5E5E5]' : ''
                                        } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                    style={{ transitionDelay: `${i * 100}ms` }}
                                >
                                    {/* Icon */}
                                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform hover:scale-110"
                                        style={{ background: stat.iconBg }}
                                    >
                                        <Icon size={32} className="text-white" aria-hidden="true" />
                                    </div>

                                    {/* Value */}
                                    <div
                                        className="mb-3 text-[48px] font-bold md:text-[56px]"
                                        style={{
                                            background: stat.gradient,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        {stat.value}
                                    </div>

                                    {/* Label */}
                                    <h3 className="mb-2 text-[20px] font-bold text-[#1A1A1A] md:text-[22px]">
                                        {stat.label}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-[15px] text-[#6B6B6B]">{stat.description}</p>

                                    {/* Bottom gradient line */}
                                    <div className="mx-auto mt-6 h-[2px] w-24 scale-x-0 transition-transform group-hover:scale-x-100"
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
