'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Timer } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';

const RatingStar = ({ className }: { className: string }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path fill="currentColor" d="M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95z" />
    </svg>
);

const STATS = [
    {
        value: '90%',
        label: '비용 절감',
        description: '상세페이지 제작 비용 (기존 대비)',
        chip: (
            <>
                <svg width={16} height={16} viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" fill="#F5C542" />
                    <circle cx="12" cy="12" r="5.5" fill="none" stroke="#C99A1B" strokeWidth="1.6" />
                </svg>
                상세페이지 한 장에 6,000원부터
            </>
        ),
    },
    {
        value: '10배',
        label: '속도 향상',
        description: '압도적으로 빨라진 제작 속도',
        chip: (
            <>
                <Timer size={16} strokeWidth={2} className="shrink-0" aria-hidden="true" />
                전 과정 약 10분
            </>
        ),
    },
    {
        value: '4.9',
        label: '고객 만족도',
        description: '5점 만점 (베타테스터 기준)',
        chip: (
            <>
                <span className="flex" aria-hidden="true">
                    {['/teenz-logo.png', '/eko-logo.png', '/oac-logo.png'].map((logo) => (
                        <Image
                            key={logo}
                            src={logo}
                            alt=""
                            width={20}
                            height={20}
                            className="-ml-1.5 h-5 w-5 shrink-0 rounded-full border-[1.5px] border-white object-cover first:ml-0"
                        />
                    ))}
                </span>
                <span className="flex items-center gap-px" aria-hidden="true">
                    {[0, 1, 2, 3].map((star) => (
                        <RatingStar key={star} className="text-[#FFB800]" />
                    ))}
                    <span className="relative h-[14px] w-[14px]">
                        <RatingStar className="text-[#E3E3E3]" />
                        <span className="absolute inset-y-0 left-0 w-[90%] overflow-hidden">
                            <RatingStar className="max-w-none text-[#FFB800]" />
                        </span>
                    </span>
                </span>
                <span className="sr-only">쇼핑몰 대표님들이 준 별점</span>
            </>
        ),
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
                <SectionHeader
                    title="리소스 대폭 절감"
                    subtitle="촬영과 편집에 쓰던 시간을 줄이고, 파는 데 집중하세요."
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-[24px] border border-[#ECECEC] bg-white whitespace-normal break-keep leading-[normal] md:grid-cols-3">
                    {STATS.map((stat, i) => (
                        <div
                            key={stat.label}
                            className={`px-[22px] py-6 text-left transition-all duration-700 md:px-4 md:pt-11 md:pb-10 md:text-center lg:px-9 ${i > 0 ? 'border-t border-[#F0F0F0] md:border-t-0 md:border-l' : ''} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            <div className="mb-2 text-[40px] font-bold leading-none tracking-[-0.035em] text-[#1A1A1A] md:mb-4 md:text-[64px]">
                                {stat.value}
                            </div>
                            <h3 className="mb-1.5 text-[17px] font-bold leading-[normal] text-[#1A1A1A] md:text-[19px]">
                                {stat.label}
                            </h3>
                            <p className="mb-3.5 text-balance text-[14px] text-[#6B6B6B] md:mb-[22px] lg:text-[15px]">
                                {stat.description}
                            </p>
                            <span className="inline-flex h-[34px] items-center gap-[7px] whitespace-nowrap rounded-[99px] bg-[#F4F5F7] px-3.5 text-[13px] font-semibold md:max-lg:gap-1.5 md:max-lg:px-3 md:max-lg:text-[12px] text-[#3A3A3A]">
                                {stat.chip}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export { ResourceSavingsSection };
