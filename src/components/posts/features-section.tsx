'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
import { useInViewOnce } from '@/components/ui/use-in-view-once';

// 사파리(WebKit)는 balance·pretty가 꺼지므로(globals.css) 의미 단위를 NBSP(U+00A0)로 묶어 한 단어만 남는 줄을 막는다.
// 묶은 단위가 길어지면 크롬의 balance·pretty가 다른 곳(가운뎃점 앞뒤, '실제와 / 가깝게' 등)을 끊으므로 그쪽도 함께 묶는다.
// '핏감·기장·색감'의 가운뎃점 앞뒤에는 WORD JOINER(U+2060)를 넣었다.
const FEATURES = [
    {
        question: '실제랑 다른 의류처럼 보이면 어떡하죠?',
        // 3열(1024+)에서 제목을 의미 단위 두 줄로 고정해 설명·프리뷰 시작선을 맞춘다.
        title: ['의류를 실제와 가깝게', '만들고 넘어가요'],
        description: '의류컷을 만들기 전에 핏감⁠·⁠기장⁠·⁠색감부터 실제 옷과 맞춰요.',
    },
    {
        question: '색상마다 따로 만들어야 하나요?',
        title: ['색상이 여러 개여도', '한 번에 만들어요'],
        description: '색상을 추가하면 색상별 컷까지 한 페이지에 담아요.',
    },
    {
        question: 'AI가 없는 말을 지어내면요?',
        title: ['확인한 정보로만', '문구를 써요'],
        description: '카피 문구는 직접 확인한 소재와 강조 특징을 근거로 써요.',
    },
] as const;

const GARMENT_CHECKS = [
    { title: '핏감', description: '실제 옷에 가깝게' },
    { title: '기장', description: '실제 길이에 맞게' },
    { title: '색감', description: '조명 왜곡까지' },
] as const;

const COLORS = [
    { image: 'knit-ivory', label: '아이보리' },
    { image: 'knit-pink', label: '핑크' },
    { image: 'knit-sky', label: '소라' },
    { image: 'knit-sage', label: '세이지' },
] as const;

// 3열에서만 카드 등장을 차례로 늦춘다(1열에서는 카드마다 따로 보일 때 바로 등장).
const STAGGER = ['', 'lg:delay-120', 'lg:delay-240'] as const;
// 프리뷰 재생 시점 계산용. 카드 래퍼의 duration-700, STAGGER의 120ms 간격과 값을 맞춘다.
const ENTER_MS = 700;
const STAGGER_MS = 120;

const GarmentPreview = ({ play }: { play: boolean }) => (
    <div className="grid grid-cols-[34%_minmax(0,1fr)] items-center gap-3">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[8px] bg-[#EDEDED]">
            <Image
                src="/sections/mannequin-tee.webp"
                alt=""
                fill
                // scale-[1.55] 확대분까지 반영한 표시 폭
                sizes="(min-width: 1280px) 146px, (min-width: 1024px) 124px, (min-width: 768px) 135px, (min-width: 640px) 258px, 44vw"
                className="origin-[50%_12%] scale-[1.55] object-cover object-[50%_0]"
            />
        </div>
        <ul className="flex flex-col gap-[7px] xl:gap-2">
            {GARMENT_CHECKS.map((item, i) => (
                <li key={item.title} className="flex items-start gap-[9px] rounded-[8px] bg-white px-3 py-2.5">
                    <span
                        className={`mt-px inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#2F80ED] [transition:scale_.38s_cubic-bezier(.34,1.56,.64,1),opacity_.2s] motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none ${play ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                        style={{ transitionDelay: `${300 + i * 250}ms` }}
                    >
                        <Check size={11} strokeWidth={3} className="text-white" />
                    </span>
                    <div>
                        <b className="block text-[14px] xl:text-[15px] leading-[1.4] font-bold text-[#1A1A1A]">{item.title}</b>
                        <small className="mt-px block text-[12px] xl:text-[13px] leading-[1.4] text-[#6B6B6B]">{item.description}</small>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

const ColorPreview = () => (
    <>
        <div className="grid grid-cols-4 gap-2">
            {COLORS.map((color) => (
                <figure key={color.image}>
                    <div className="relative aspect-square overflow-hidden rounded-[8px] bg-[#F6F5F8]">
                        <Image
                            src={`/sections/${color.image}.webp`}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 63px, (min-width: 768px) 58px, (min-width: 640px) 118px, 20vw"
                            className="object-cover"
                        />
                    </div>
                    <figcaption className="mt-[6px] text-center text-[12px] xl:text-[13px] leading-[1.4] font-medium whitespace-nowrap text-[#6B6B6B]">
                        {color.label}
                    </figcaption>
                </figure>
            ))}
        </div>
        <p className="mt-3 text-center text-[14px] leading-[1.4] font-bold text-[#1A1A1A]">색상 4개 → 상세페이지 1개</p>
    </>
);

const CopyPreview = ({ play }: { play: boolean }) => (
    <>
        <div className="mb-[14px] flex flex-wrap gap-[6px] text-[12px] xl:text-[13px] font-semibold text-[#1A1A1A]">
            <span className="basis-full pb-0.5 text-[#6B6B6B]">확인한 정보</span>
            <span className="rounded-full bg-white px-[10px] py-1 xl:px-3 xl:py-[5px]">소재 면 100%</span>
            <span className="rounded-full bg-white px-[10px] py-1 xl:px-3 xl:py-[5px]">라운드넥</span>
        </div>
        <div className="rounded-[8px] bg-white px-3 py-[10px] xl:px-[14px] xl:py-3 text-[14px] xl:text-[15px] leading-[1.45] text-[#6B6B6B]">
            {/* 문장을 relative span으로 감싸 취소선이 박스가 아니라 글자 폭만큼만 그어지게 한다. */}
            <span className="relative">
                비 오는 날에도 끄떡없는 방수 소재
                <span
                    className={`absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-[#E0527A] transition-[width] duration-[600ms] ease-[ease] motion-reduce:w-full motion-reduce:transition-none ${play ? 'w-full' : 'w-0'}`}
                    style={{ transitionDelay: '400ms' }}
                />
            </span>
        </div>
        <div
            className={`mt-2 rounded-[8px] bg-white px-3 py-[10px] xl:px-[14px] xl:py-3 text-[14px] xl:text-[15px] leading-[1.45] font-semibold text-[#1A1A1A] transition-[opacity,translate] duration-[400ms] ease-[ease] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${play ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}
            style={{ transitionDelay: '1000ms' }}
        >
            면 100%라 피부에 부드럽게 닿아요
        </div>
    </>
);

const FeatureCard = ({ feature, index }: { feature: (typeof FEATURES)[number]; index: number }) => {
    const [cardRef, isShown] = useInViewOnce<HTMLDivElement>(0.15);
    const [previewRef, isPreviewInView] = useInViewOnce<HTMLDivElement>(0.5, '0px 0px -10% 0px');
    const [hasEntered, setHasEntered] = useState(false);
    // 카드 등장이 끝난 뒤, 프리뷰가 실제로 보일 때만 마이크로 애니메이션을 재생한다.
    // 등장 끝은 transitionend가 아니라 시간으로 잡는다. 동작 줄이기(transition-none)에서는 그 이벤트가 오지 않아,
    // 나중에 설정을 끄면 체크·교정 문장이 숨은 채 남는다. 동작 줄이기에서는 기다리지 않는다(각 요소가 최종 상태로 보임).
    useEffect(() => {
        if (!isShown) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const stagger = window.matchMedia('(min-width: 1024px)').matches ? index * STAGGER_MS : 0;
        const timer = window.setTimeout(() => setHasEntered(true), reduce ? 0 : ENTER_MS + stagger);
        return () => window.clearTimeout(timer);
    }, [isShown, index]);
    const play = hasEntered && isPreviewInView;

    return (
        <div
            ref={cardRef}
            className={`flex transition-[opacity,translate] duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${STAGGER[index]} ${isShown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
            {/* 768~1023은 텍스트와 프리뷰를 가로로 놓는다(1열이 늘어난 채 쓰이던 구간). */}
            <Card
                as="article"
                className="flex min-w-0 flex-1 flex-col md:max-lg:grid md:max-lg:grid-cols-[minmax(0,1fr)_280px] md:max-lg:items-center md:max-lg:gap-x-6"
            >
                <div className="flex min-w-0 flex-col">
                    <span className="relative mb-[22px] xl:mb-6 self-start rounded-[14px_14px_14px_0] bg-[#F0F0F0] px-3 py-[7px] xl:px-[14px] xl:py-2 text-[14px] leading-[1.45] font-medium text-[#6B6B6B] after:absolute after:top-full after:left-0 after:border-t-[6px] after:border-r-[9px] xl:after:border-t-[7px] xl:after:border-r-[10px] after:border-t-[#F0F0F0] after:border-r-transparent after:content-['']">
                        {feature.question}
                    </span>
                    <h3 className="mb-3 flex items-start gap-[10px] text-[18px] md:text-[20px] leading-[1.4] font-bold tracking-[-0.01em] text-balance text-[#1A1A1A]">
                        <span aria-hidden="true" className="mt-0.5 inline-flex size-[22px] md:size-6 shrink-0 items-center justify-center rounded-full bg-[#2F80ED]">
                            <Check size={13} strokeWidth={3} className="text-white md:size-[14px]" />
                        </span>
                        {/* br은 h3(flex) 직속이면 flex item이 되므로 span 안에 둔다. */}
                        <span className="min-w-0">
                            {feature.title[0]}
                            <br className="hidden lg:inline" />{' '}
                            {feature.title[1]}
                        </span>
                    </h3>
                    <p className="mb-5 md:mb-6 md:max-lg:mb-0 text-[15px] xl:text-[16px] leading-[1.65] text-pretty text-[#6B6B6B]">{feature.description}</p>
                </div>
                <div
                    ref={previewRef}
                    aria-hidden="true"
                    className="mt-auto flex flex-col justify-center rounded-[12px] bg-[#F5F5F7] p-3 xl:p-[22px] leading-[normal] md:max-lg:mt-0 lg:min-h-[212px] xl:min-h-[244px]"
                >
                    {index === 0 ? <GarmentPreview play={play} /> : index === 1 ? <ColorPreview /> : <CopyPreview play={play} />}
                </div>
            </Card>
        </div>
    );
};

const FeaturesSection = () => (
    <Section
        id="features"
        aria-labelledby="features-title"
        className="relative border-t border-[rgba(34,42,53,0.08)] bg-[rgba(255,255,255,0.5)] backdrop-blur-[30px]"
    >
        <div className="mx-auto w-full max-w-[1200px]">
            <SectionHeader
                label="MADE FOR FASHION"
                title="의류 쇼핑몰에 최적화된 이유"
                titleId="features-title"
                subtitle="옷은 실제처럼, 색상은 한 번에, 문구는 사실대로."
            />
            <div className="mx-auto grid max-w-[560px] grid-cols-1 gap-5 md:max-w-[720px] md:gap-6 lg:max-w-none lg:grid-cols-3">
                {FEATURES.map((feature, i) => (
                    <FeatureCard key={feature.title[0]} feature={feature} index={i} />
                ))}
            </div>
        </div>
    </Section>
);

export { FeaturesSection };
