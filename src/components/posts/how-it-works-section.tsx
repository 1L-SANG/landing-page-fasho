'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { goToApp } from '@/lib/app-url';

const STEPS = [
    { title: '사진 올리고 확인하기', description: '앞뒤 사진을 올리면 AI가 상품 정보를 채워요. 틀린 부분만 고쳐주면 돼요.' },
    { title: '컷 구성 고르기', description: '상세페이지에 어떤 컷을 어떤 순서로 배치할지 정해요.' },
    { title: '의류 재현도 높이기', description: '의류컷을 만들기 전, 실제 옷과 다른 핏, 색감\u00A0등을 바로잡아요.' },
    { title: '에디터로 수정하기', description: '문구와 배치를 원하는 대로 고치면서 상세페이지를 완성시켜요.' },
] as const;

const SHOT_COLUMNS = [
    { title: '후킹', image: '/sections/sig_women_01.webp', count: 1 },
    { title: '스타일링', image: null, count: 2 },
    { title: '스튜디오', image: '/sections/sig_women_03.webp', count: 2 },
    { title: '의류 확인', image: null, count: 2 },
] as const;

const UploadPreview = () => (
    <>
        <span className="text-[11px] lg:text-[9px] xl:text-[11px] font-bold text-[#1A1A1A]">의류 이미지를 올려주세요</span>
        <div className="grid grid-cols-4 gap-[5px]">
            {[0, 1, 2, 3].map((slot) => (
                <div key={slot} className={`flex aspect-square items-center justify-center rounded-[5px] border border-[#E6E6EA] ${slot < 3 ? 'bg-[#EEF0F4]' : 'border-dashed bg-white'}`}>
                    {slot < 3 && <span className="size-[9px] rounded-full bg-[#2F80ED] shadow-[0_0_0_2px_#fff]" />}
                </div>
            ))}
        </div>
        <span className="text-[11px] lg:text-[9px] xl:text-[11px] font-bold text-[#1A1A1A]">AI가 분석한 정보예요</span>
        <div className="flex flex-wrap gap-1">
            {['니트', '레귤러 핏', '면 100%', '라운드넥'].map((chip) => (
                <span key={chip} className="rounded-full border border-[#E3E3E8] bg-white px-[6px] py-0.5 text-[10.5px] lg:text-[8.5px] xl:text-[10.5px] font-semibold text-[#1A1A1A]">{chip}</span>
            ))}
        </div>
        <div className="flex items-center gap-1 text-[10.5px] lg:text-[8.5px] xl:text-[10.5px] text-[#6B6B6B]">
            <span className="size-[14px] shrink-0 rounded-full bg-[#DADAE0] shadow-[0_0_0_1.5px_#1A1A1A]" />
            <span className="size-[14px] shrink-0 rounded-full bg-[#DADAE0]" />
            <span>기본 AI 모델</span>
        </div>
    </>
);

const ShotPreview = () => (
    <>
        <div className="grid flex-1 grid-cols-4 gap-[5px]">
            {SHOT_COLUMNS.map((column) => (
                <div key={column.title} className="flex flex-col gap-1">
                    <b className="text-[10.5px] lg:text-[8.5px] xl:text-[10.5px] font-bold text-[#1A1A1A]">{column.title}</b>
                    {Array.from({ length: column.count }, (_, i) => (
                        <div key={i} className="relative min-h-[18px] flex-1 overflow-hidden rounded-[4px] bg-[#E5E5EA]">
                            {i === 0 && column.image && (
                                <Image src={column.image} alt="" fill sizes="(min-width: 1024px) 40px, (min-width: 768px) 80px, 20vw" className="object-cover" />
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
        <div className="flex justify-between rounded-[5px] bg-white px-[6px] py-1 text-[10.5px] lg:text-[8.5px] xl:text-[10.5px] text-[#6B6B6B]">
            <span>13컷</span><span>카피라이팅 켜짐</span>
        </div>
    </>
);

const GarmentPreview = () => (
    <>
        <div className="relative w-[44%] overflow-hidden rounded-[6px] bg-[#EDEDED]">
            <Image src="/sections/mannequin-tee.webp" alt="" fill sizes="(min-width: 1024px) 75px, (min-width: 768px) 140px, 40vw" className="object-cover object-[center_20%]" />
            <span className="absolute top-[34%] left-[62%] size-[11px] rounded-full bg-white shadow-[0_0_0_3px_rgba(47,128,237,0.35)]" />
            <span className="absolute top-[62%] left-[40%] size-[11px] rounded-full bg-white shadow-[0_0_0_3px_rgba(47,128,237,0.35)]" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-[5px]">
            <b className="text-[11px] lg:text-[9px] xl:text-[11px] font-bold text-[#1A1A1A]">핏</b>
            <div className="flex gap-[3px]">
                {['슬림', '레귤러', '오버'].map((fit) => (
                    <span key={fit} className={`flex-1 rounded-[4px] border bg-white py-[3px] text-center text-[10px] lg:text-[8px] xl:text-[10px] ${fit === '레귤러' ? 'border-[#1A1A1A] font-bold text-[#1A1A1A]' : 'border-[#E3E3E8] text-[#6B6B6B]'}`}>{fit}</span>
                ))}
            </div>
            <b className="text-[11px] lg:text-[9px] xl:text-[11px] font-bold text-[#1A1A1A]">색감</b>
            <div className="relative mx-0.5 mt-1 mb-[6px] h-[3px] rounded-[3px] bg-[#DCDCE2]">
                <span className="absolute top-1/2 left-[38%] size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />
            </div>
            <div className="mt-[3px] rounded-full bg-[#1A1A1A] py-1 text-center text-[10.5px] lg:text-[8.5px] xl:text-[10.5px] font-bold text-white">이대로 진행</div>
        </div>
    </>
);

const EditorPreview = () => (
    <>
        <div className="flex justify-end gap-1 text-[10.5px] lg:text-[8.5px] xl:text-[10.5px] font-bold">
            <span className="rounded-full border border-[#E3E3E8] bg-white px-2 py-[3px] text-[#1A1A1A]">미리보기</span>
            <span className="rounded-full bg-[#1A1A1A] px-2 py-[3px] text-white">다운로드</span>
        </div>
        <div className="rounded-[5px] border border-[#dce7f6] bg-[#eef5ff] px-[6px] py-1 text-[10.5px] lg:text-[8.5px] xl:text-[10.5px] leading-[1.4] text-[#3068b4]">지금도 문구와 배치를 고칠 수 있어요. 창을 닫아도 계속 만들어져요.</div>
        <div className="grid flex-1 grid-cols-2 gap-1">
            <div className="rounded-[4px] bg-[#E5E5EA]" />
            <div className="rounded-[4px] border border-dashed border-[#B9C9E6] bg-white" />
            <div className="rounded-[4px] border border-dashed border-[#B9C9E6] bg-white" />
            <div className="rounded-[4px] bg-[#E5E5EA]" />
        </div>
    </>
);

const StepPreview = ({ index }: { index: number }) => (
    <div aria-hidden="true" className="relative mb-5 xl:mb-6 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[12px] border border-[rgba(255,255,255,0.1)] bg-[#1F1F1F] px-3 pt-3 pb-4 lg:min-h-[192px]">
        <div className={`flex h-full w-full overflow-hidden rounded-[8px] bg-[#F7F7F8] p-[10px] leading-[normal] opacity-[0.94] ${index === 2 ? 'flex-row items-stretch gap-2' : 'flex-col gap-[7px]'}`}>
            {index === 0 ? <UploadPreview /> : index === 1 ? <ShotPreview /> : index === 2 ? <GarmentPreview /> : <EditorPreview />}
        </div>
    </div>
);

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
            id="how-it-works"
            className="relative z-20 overflow-visible px-6 py-16 sm:py-24 break-keep [overflow-wrap:break-word] md:py-32"
            ref={sectionRef}
            style={{
                backgroundColor: 'rgba(245, 245, 247, 0.6)',
                backdropFilter: 'blur(30px)',
                borderTop: '1px solid rgba(235, 230, 220, 0.5)',
            }}
        >
            <div className="mx-auto max-w-[1100px] xl:max-w-[1280px]">
                <SectionHeader
                    label="HOW IT WORKS"
                    title={"쉬운 사용법, 네\u00A0단계로 만들어요"}
                    subtitle="AI가 먼저 만들어 두면, 대표님은 고르고 확인하면 돼요."
                />

                <div className="relative overflow-visible grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map((step, i) => {
                        return (
                            <div
                                key={i}
                                className={`relative transition-all duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                style={{ transitionDelay: `${i * 150}ms`, zIndex: STEPS.length - i }}
                            >
                                {/* Card with subtle border */}
                                <div
                                    className="h-full rounded-[20px] p-[1px]"
                                    style={{ background: 'linear-gradient(to bottom right, #444, #333, #2A2A2A)' }}
                                >
                                    <div className="flex h-full flex-col rounded-[20px] bg-[#2A2A2A] px-4 pt-4 pb-7 xl:px-5 xl:pt-5 xl:pb-8">
                                        <StepPreview index={i} />
                                        <div className="px-3">
                                            <h3 className="mb-3 text-[18px] xl:text-[20px] leading-[1.4] font-bold text-white">{step.title}</h3>
                                            <p className="lg:max-w-[17em] xl:max-w-none text-[15px] lg:text-[14.5px] xl:text-[16px] leading-[1.65] text-[#CCC]">
                                                {step.description}
                                            </p>
                                        </div>
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
                <div className="mt-12 flex justify-center md:mt-16 lg:hidden">
                    <Button id="howto-start-cta" variant="cta" size="lg" onClick={goToApp}>
                        지금 시작하기
                    </Button>
                </div>
            </div>
        </section>
    );
};

export { HowItWorksSection };
