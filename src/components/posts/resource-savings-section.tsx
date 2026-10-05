'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { Coins, Timer } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/components/ui/cn';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
import { useInViewOnce } from '@/components/ui/use-in-view-once';

interface Stat {
    value: string;
    /** 숫자 뒤 단위('%', '배'). Figure 토큰대로 0.6em으로 줄인다. */
    unit?: string;
    label: string;
    description: string;
    chip: ReactNode;
}

const REVIEW_LOGOS = ['/teenz-logo.png', '/eko-logo.png', '/oac-logo.png'];

const STATS: Stat[] = [
    {
        value: '90',
        unit: '%',
        label: '비용 절감',
        // 360 이하에서 비교 기준('기존 촬영·편집 대비')과 '제작 비용'이 각각 한 덩어리로 남게 묶는다.
        // 가운뎃점 양쪽은 WORD JOINER, '편집 대비'·'제작 비용' 사이는 NBSP(WebKit은 balance가 꺼짐).
        description: '기존 촬영\u2060·\u2060편집 대비 제작 비용',
        chip: (
            <>
                <Coins size={16} strokeWidth={2} className="shrink-0" aria-hidden="true" />
                상세페이지 6,000원부터
            </>
        ),
    },
    {
        value: '10',
        unit: '배',
        label: '속도 향상',
        description: '기존 촬영\u2060·\u2060편집 대비 제작 시간',
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
                    {REVIEW_LOGOS.map((logo) => (
                        <Image
                            key={logo}
                            src={logo}
                            alt=""
                            width={24}
                            height={24}
                            className="-ml-2 h-6 w-6 shrink-0 rounded-full bg-white object-cover ring-2 ring-white first:ml-0"
                        />
                    ))}
                </span>
                베타 쇼핑몰 후기
            </>
        ),
    },
];

const ResourceSavingsSection = () => {
    // 섹션 전체가 아니라 스탯 밴드가 보일 때 등장시켜, 빈 영역에서 애니메이션이 끝나지 않게 한다.
    const [gridRef, isVisible] = useInViewOnce<HTMLDivElement>(0.3);

    return (
        <Section
            id="savings"
            size="compact"
            aria-labelledby="savings-title"
            className="border-t border-[rgba(34,42,53,0.08)] bg-[rgba(245,245,247,0.6)] backdrop-blur-[30px]"
        >
            <div className="mx-auto w-full max-w-[1200px]">
                <SectionHeader
                    label="BY THE NUMBERS"
                    title="리소스 대폭 절감"
                    titleId="savings-title"
                    subtitle={
                        <>
                            <span className="inline-block">촬영과 편집에 쓰던 시간을 줄이고,</span>{' '}
                            <span className="inline-block">파는 데 집중하세요.</span>
                        </>
                    }
                />

                {/* Stats band — 바깥 밴드도 함께 페이드해 빈 박스가 먼저 보이지 않게 한다 */}
                <Card
                    ref={gridRef}
                    padding="none"
                    className={cn(
                        'grid grid-cols-1 overflow-hidden rounded-[24px] max-md:mx-auto max-md:max-w-[480px] md:grid-cols-3',
                        'transition-opacity duration-700 motion-reduce:opacity-100 motion-reduce:transition-none',
                        isVisible ? 'opacity-100' : 'opacity-0'
                    )}
                >
                    {STATS.map((stat, i) => (
                        <div
                            key={stat.label}
                            className={cn(
                                // 768 미만: 숫자(왼쪽 88px)와 라벨·설명을 나란히 두고 칩만 아래 줄로 내려 행 높이를 줄인다.
                                'p-5 text-left max-md:grid max-md:grid-cols-[88px_1fr] max-md:items-center max-md:gap-x-4 md:px-5 md:py-10 md:text-center lg:px-8',
                                'transition-[opacity,translate] duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
                                i > 0 && 'border-t border-[rgba(34,42,53,0.08)] md:border-t-0 md:border-l',
                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                            )}
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            {/* 숫자는 h3 안 sr-only로 함께 읽히게 하고, 보이는 숫자는 중복 낭독을 막는다 */}
                            <div
                                aria-hidden="true"
                                className="text-[40px] font-bold leading-none tracking-[-0.03em] text-[#1A1A1A] max-md:row-span-2 md:mb-3 md:text-[48px] lg:mb-4 lg:text-[52px]"
                            >
                                {stat.value}
                                {stat.unit && (
                                    <span className="ml-0.5 text-[0.6em] tracking-[-0.02em]">{stat.unit}</span>
                                )}
                            </div>
                            <h3 className="mb-1 text-balance text-[18px] font-bold leading-[1.4] tracking-[-0.01em] text-[#1A1A1A] max-md:col-start-2 md:text-[20px]">
                                <span className="sr-only">{`${stat.value}${stat.unit ?? ''} `}</span>
                                {stat.label}
                            </h3>
                            <p className="text-balance text-[15px] leading-[1.5] text-[#6B6B6B] max-md:col-start-2 md:mb-6 xl:text-[16px]">
                                {stat.description}
                            </p>
                            <span className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full bg-[#F4F5F7] px-4 text-[13px] font-semibold leading-[1.4] text-[#3A3A3A] max-md:col-span-2 max-md:mt-4 max-md:justify-self-start">
                                {stat.chip}
                            </span>
                        </div>
                    ))}
                </Card>
            </div>
        </Section>
    );
};

export { ResourceSavingsSection };
