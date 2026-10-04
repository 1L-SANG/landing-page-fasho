'use client';

import { Star } from 'lucide-react';
import Image from 'next/image';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
import { cardStyles } from '@/components/ui/card';
import { cn } from '@/components/ui/cn';
import { useInViewOnce } from '@/components/ui/use-in-view-once';

interface Testimonial {
    quote: string;
    /** quote 안에서 굵게 보여줄 구절(quote에 그대로 들어 있어야 함) */
    highlight?: string;
    name: string;
    /** 로고 alt에 쓰는 쇼핑몰명 */
    store: string;
    logo: string;
}

// 가장 강한 근거(매출 회복)를 첫 카드에 둔다.
const TESTIMONIALS: Testimonial[] = [
    {
        quote: '적자가 심해서 쇼핑몰을 포기할까 한참 고민했었어요. Wearless 덕분에 오히려 지금은 매출이 최고점인 상태입니다.',
        highlight: '매출이 최고점인 상태입니다',
        name: '김*지 대표',
        store: 'O.A.C.',
        logo: '/oac-logo.png',
    },
    {
        // '생성되는 게' 사이는 NBSP — 의존명사 '게'가 줄 머리에 혼자 오지 않게 한다.
        quote: '제가 찍은 컷들을 바탕으로 다양하게 생성되는 게 진짜 너무 효율적이네요.',
        name: '임*현 대표',
        store: 'teenz',
        logo: '/teenz-logo.png',
    },
    {
        quote: 'AI 느낌 날까 봐 걱정했는데, 생각보다 자연스러워서 놀랐어요! 확실히 퀄리티 차이가 납니다.',
        name: '김*연 대표',
        store: 'EKO',
        logo: '/eko-logo.png',
    },
];

// 3열(lg)에서만 순차 등장. 1열에서는 카드가 각자 화면에 들어오므로 지연을 두지 않는다.
const REVEAL_DELAYS = ['', 'lg:delay-150', 'lg:delay-300'] as const;

const QuoteText = ({ quote, highlight }: Pick<Testimonial, 'quote' | 'highlight'>) => {
    if (!highlight || !quote.includes(highlight)) return <>{quote}</>;
    const [before, ...rest] = quote.split(highlight);
    return (
        <>
            {before}
            <strong className="font-semibold">{highlight}</strong>
            {rest.join(highlight)}
        </>
    );
};

const TestimonialCard = ({
    testimonial,
    index,
}: {
    testimonial: Testimonial;
    index: number;
}) => {
    const [cardRef, isVisible] = useInViewOnce<HTMLDivElement>(0.2);

    return (
        <div
            ref={cardRef}
            className={cn(
                'h-full transition-[opacity,translate] duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
                REVEAL_DELAYS[index],
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            )}
        >
            <figure className={cardStyles({ className: 'flex h-full flex-col' })}>
                <div role="img" aria-label="별점 5점 만점에 5점" className="mb-4 flex gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} size={16} className="fill-[#FFB800] text-[#FFB800]" aria-hidden="true" />
                    ))}
                </div>

                <blockquote className="mb-5 md:mb-6">
                    {/* 음수 들여쓰기로 여는 따옴표를 바깥으로 빼 글자 열을 별점·로고와 맞춘다. */}
                    <p className="indent-[-0.45em] text-[16px] font-medium leading-[1.65] text-[#1A1A1A] text-pretty whitespace-normal md:text-[17px] xl:text-[18px]">
                        &ldquo;<QuoteText quote={testimonial.quote} highlight={testimonial.highlight} />&rdquo;
                    </p>
                </blockquote>

                <figcaption className="mt-auto flex items-center gap-3">
                    <Image
                        src={testimonial.logo}
                        alt={`${testimonial.store} 로고`}
                        width={48}
                        height={48}
                        className="size-12 shrink-0 rounded-full object-cover ring-1 ring-[rgba(34,42,53,0.08)]"
                    />
                    <span className="text-[15px] font-semibold leading-[1.4] text-[#1A1A1A]">{testimonial.name}</span>
                </figcaption>
            </figure>
        </div>
    );
};

const TestimonialsSection = () => {
    return (
        <Section
            aria-labelledby="testimonials-title"
            className="border-t border-[rgba(34,42,53,0.08)] bg-[rgba(245,245,247,0.6)] backdrop-blur-[30px]"
        >
            <div className="mx-auto w-full max-w-[1200px]">
                <SectionHeader
                    label="TESTIMONIALS"
                    title="대표님들의 실제 반응"
                    subtitle={
                        // 의미 단위 두 덩어리를 모두 묶어야 모바일 balance가 '베타 테스트 / 후'로 가르지 않는다.
                        <>
                            2025년 11월,{' '}
                            <span className="inline-block">베타 테스트 후</span>{' '}
                            <span className="inline-block">남겨주신 후기 중 일부예요.</span>
                        </>
                    }
                    titleId="testimonials-title"
                />

                {/* 768~1023은 2+1로 한 장이 남지 않게 560 단일 열, lg부터 3열 */}
                <div className="mx-auto grid max-w-[560px] grid-cols-1 gap-5 md:gap-6 lg:max-w-none lg:grid-cols-3">
                    {TESTIMONIALS.map((t, i) => (
                        <TestimonialCard key={t.name} testimonial={t} index={i} />
                    ))}
                </div>
            </div>
        </Section>
    );
};

export { TestimonialsSection };
