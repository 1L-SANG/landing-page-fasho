'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';

const FEATURES = [
    {
        question: '실제랑 다른 의류처럼 보이면 어떡하죠?',
        title: '의류를 실제와 가깝게 만들고 넘어가요',
        description: '의류컷을 만들기 전에, 핏감, 색감 등을 확실하게 맞추고 넘어갈 수 있어요.',
    },
    {
        question: '색상마다 따로 만들어야 하나요?',
        title: '색상이 여러 개여도 한 번에 만들어요',
        description: '색상을 추가하면 색상별 컷까지 한 페이지에 담아요.',
    },
    {
        question: 'AI가 없는 말을 지어내면요?',
        title: '확인한 정보로만 문구를 써요',
        description: '카피 문구는 직접 확인한 소재와 강조 특징을 근거로 써요.',
    },
] as const;

const GARMENT_CHECKS = [
    { title: '핏감', description: '실제 옷에 가깝게' },
    { title: '기장', description: '실제 길이에 맞게' },
    { title: '색감', description: '조명에 틀어진 색까지' },
] as const;

const COLORS = [
    { image: 'knit-ivory', label: '아이보리', color: '#EFE8D8' },
    { image: 'knit-pink', label: '핑크', color: '#E8AAB8' },
    { image: 'knit-sky', label: '소라', color: '#A0C4E4' },
    { image: 'knit-sage', label: '세이지', color: '#ACBEA0' },
] as const;

const GarmentPreview = ({ isVisible }: { isVisible: boolean }) => (
    <div className="grid grid-cols-[34%_minmax(0,1fr)] items-center gap-3">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[10px] bg-[#EDEDED]">
            <Image
                src="/sections/mannequin-tee.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 90px, (min-width: 640px) 160px, 30vw"
                className="origin-[50%_12%] scale-[1.55] object-cover object-[50%_0]"
            />
        </div>
        <ul className="flex flex-col gap-[7px]">
            {GARMENT_CHECKS.map((item, i) => (
                <li key={item.title} className="flex items-start gap-[9px] rounded-[10px] bg-white px-[10px] py-2">
                    <span
                        className={`mt-px inline-flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[#2F80ED] [transition:scale_.38s_cubic-bezier(.34,1.56,.64,1),opacity_.2s] motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                        style={{ transitionDelay: `${900 + i * 250}ms` }}
                    >
                        <Check size={11} strokeWidth={3} className="text-white" />
                    </span>
                    <div>
                        <b className="block text-[12.5px] leading-[1.35] font-bold text-[#1A1A1A]">{item.title}</b>
                        <small className="mt-px block text-[11px] leading-[1.35] text-[#9E9E9E]">{item.description}</small>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

const ColorPreview = () => (
    <>
        <div className="grid grid-cols-4 gap-[6px]">
            {COLORS.map((color) => (
                <figure key={color.image}>
                    <div className="relative aspect-square overflow-hidden rounded-[8px] bg-[#F6F5F8]">
                        <Image
                            src={`/sections/${color.image}.webp`}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 60px, (min-width: 640px) 112px, 20vw"
                            className="object-cover"
                        />
                    </div>
                    <figcaption className="mt-[6px] flex items-center justify-center gap-1 text-[10.5px] font-semibold whitespace-nowrap text-[#6B6B6B]">
                        <span className="size-2 shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]" style={{ backgroundColor: color.color }} />
                        {color.label}
                    </figcaption>
                </figure>
            ))}
        </div>
        <div className="mt-[10px] text-center text-[12px] font-semibold text-[#3A3A3A]">색상 4개, 상세페이지 1개</div>
    </>
);

const CopyPreview = ({ isVisible }: { isVisible: boolean }) => (
    <>
        <div className="mb-[14px] flex flex-wrap gap-[6px] text-[11.5px] font-semibold text-[#1A1A1A]">
            <span className="py-1 pr-[10px] text-[#9E9E9E]">확인한 정보</span>
            <span className="rounded-full bg-white px-[10px] py-1">소재 면 100%</span>
            <span className="rounded-full bg-white px-[10px] py-1">라운드넥</span>
        </div>
        <div className="relative rounded-[10px] bg-white px-3 py-[10px] text-[13.5px] leading-[1.45] text-[#9E9E9E]">
            비 오는 날에도 끄떡없는 방수 소재
            <span className={`absolute top-1/2 left-3 h-[1.5px] bg-[#E0527A] transition-[width] duration-[600ms] ease-[ease] motion-reduce:w-[calc(100%-24px)] motion-reduce:transition-none ${isVisible ? 'w-[calc(100%-24px)]' : 'w-0'}`} style={{ transitionDelay: '1140ms' }} />
        </div>
        <div className={`mt-2 rounded-[10px] bg-white px-3 py-[10px] text-[13.5px] leading-[1.45] font-semibold text-[#1A1A1A] transition-[opacity,translate] duration-[400ms] ease-[ease] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`} style={{ transitionDelay: '1840ms' }}>
            면 100%라 피부에 부드럽게 닿아요
        </div>
    </>
);

const FeaturesSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="features"
            ref={sectionRef}
            className="relative border-t border-[rgba(235,230,220,0.5)] bg-[rgba(255,255,255,0.5)] px-6 py-24 break-keep [overflow-wrap:break-word] backdrop-blur-[30px] md:py-32"
        >
            <div className="mx-auto max-w-[1100px]">
                <SectionHeader
                    label="MADE FOR FASHION"
                    title="의류 쇼핑몰에 최적화된 이유"
                    subtitle="옷은 실제처럼, 색상은 한 번에, 문구는 사실대로."
                    className="[&>h2]:leading-[1.25] [&>p]:leading-[1.6] max-[640px]:[&>p]:text-[16px]"
                />
                <div className="mx-auto grid max-w-[560px] grid-cols-1 gap-5 lg:max-w-none lg:grid-cols-3 lg:gap-6">
                    {FEATURES.map((feature, i) => (
                        <div
                            key={feature.title}
                            className={`flex transition-[opacity,translate] duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                            style={{ transitionDelay: `${i * 120}ms` }}
                        >
                            <article className="flex min-w-0 flex-1 flex-col rounded-[20px] border-[1.5px] border-[rgba(34,42,53,0.12)] bg-white p-7 shadow-[0_4px_8px_rgba(34,42,53,0.05)] transition-[translate,border-color] duration-[250ms] ease-[ease] hover:border-[rgba(34,42,53,0.2)] motion-safe:hover:-translate-y-[2px] motion-reduce:transition-none max-[640px]:p-6">
                                <span className="relative mb-[22px] self-start rounded-[14px_14px_14px_0] bg-[#F0F0F0] px-3 py-[7px] text-[13px] leading-[1.45] font-medium text-[#6B6B6B] after:absolute after:top-full after:left-0 after:border-t-[6px] after:border-r-[9px] after:border-t-[#F0F0F0] after:border-r-transparent after:content-['']">
                                    {feature.question}
                                </span>
                                <h3 className="mb-[10px] flex items-start gap-[10px] text-[19px] leading-[1.4] font-bold text-[#1A1A1A] max-[640px]:text-[18px]">
                                    <span aria-hidden="true" className="mt-0.5 inline-flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#2F80ED]">
                                        <Check size={13} strokeWidth={3} className="text-white" />
                                    </span>
                                    {feature.title}
                                </h3>
                                <p className="mb-[22px] text-[15px] leading-[1.65] text-[#6B6B6B]">{feature.description}</p>
                                <div aria-hidden="true" className="relative mt-auto flex min-h-[176px] flex-col justify-center rounded-[14px] bg-[#F5F5F7] p-4 leading-[normal]">
                                    {i === 0 ? <GarmentPreview isVisible={isVisible} /> : i === 1 ? <ColorPreview /> : <CopyPreview isVisible={isVisible} />}
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
                <div className="mx-auto mt-7 flex max-w-[560px] items-center justify-between gap-4 rounded-[16px] border-[1.5px] border-[rgba(34,42,53,0.12)] bg-white px-[22px] py-4 shadow-[0_4px_8px_rgba(34,42,53,0.05)] max-[640px]:flex-col max-[640px]:items-start lg:max-w-none">
                    <p className="text-[14.5px] leading-[1.55] text-[#6B6B6B]">
                        <b className="font-bold text-[#1A1A1A]">사람 모델이 필요하면,</b>{' '}사용에 동의하고 라이선스를 받은 실제 모델도 고를 수 있어요. 별도 라이선스 요금이 있어요.
                    </p>
                    <a href="https://facemarket.wearless.kr" target="_blank" rel="noopener noreferrer" className="shrink-0 text-[14px] font-semibold text-[#1A1A1A] underline underline-offset-4">
                        FaceMarket 알아보기
                    </a>
                </div>
            </div>
        </section>
    );
};

export { FeaturesSection };
