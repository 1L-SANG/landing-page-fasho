'use client';

import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/cn';
import { useInViewOnce } from '@/components/ui/use-in-view-once';
import { goToApp } from '@/lib/app-url';

const STEPS = [
    { title: '사진 올리고 확인하기', description: '앞뒤 사진을 올리면 AI가 상품 정보를 채워요. 틀린 부분만 고쳐주면 돼요.' },
    { title: '컷 구성 고르기', description: '상세페이지에 어떤 컷을 어떤 순서로 배치할지 정해요.' },
    // Chrome은 keep-all이어도 가운뎃점 앞뒤에서 줄을 바꿔 '핏· / 색감을'로 끊기므로 양쪽을 WORD JOINER로 묶는다
    { title: '의류 재현도 높이기', description: '의류컷을 만들기 전에 실제 옷과 다른 핏\u2060·\u2060색감을 바로잡아요.' },
    { title: '에디터로 수정하기', description: '문구와 배치를 원하는 대로 고쳐 상세페이지를 완성해요.' },
] as const;

const UPLOAD_SLOTS = ['/sections/knit-ivory.webp', '/sections/knit-pink.webp', '/sections/knit-sage.webp', null] as const;

const SHOT_COLUMNS = [
    { title: '후킹', image: '/sections/sig_women_01.webp', count: 1 },
    { title: '스타일링', image: null, count: 2 },
    { title: '스튜디오', image: '/sections/sig_women_03.webp', count: 2 },
    { title: '의류 확인', image: '/sections/mannequin-tee.webp', count: 2 },
] as const;

const UploadPreview = () => (
    <>
        <span className="text-[11px] font-bold text-[#1A1A1A]">의류 이미지를 올려주세요</span>
        <div className="grid grid-cols-4 gap-[5px]">
            {UPLOAD_SLOTS.map((image, slot) => (
                <div key={slot} className={`relative aspect-square overflow-hidden rounded-[5px] border border-[#E6E6EA] ${image ? 'bg-[#EEF0F4]' : 'border-dashed bg-white'}`}>
                    {image && (
                        <>
                            <Image src={image} alt="" fill sizes="(min-width: 1280px) 52px, (min-width: 768px) 11vw, 18vw" className="object-cover" />
                            <span className="absolute top-1 right-1 size-[9px] rounded-full bg-[#2F80ED] shadow-[0_0_0_2px_#fff]" />
                        </>
                    )}
                </div>
            ))}
        </div>
        <span className="text-[11px] font-bold text-[#1A1A1A]">AI가 분석한 정보예요</span>
        <div className="flex flex-wrap gap-1">
            {['니트', '레귤러 핏', '면 100%', '라운드넥'].map((chip) => (
                <span key={chip} className="whitespace-nowrap rounded-full border border-[#E3E3E8] bg-white px-[6px] py-0.5 text-[11px] font-semibold text-[#1A1A1A]">{chip}</span>
            ))}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#6B6B6B]">
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
                    <b className="text-[11px] font-bold text-[#1A1A1A]">{column.title}</b>
                    {Array.from({ length: column.count }, (_, i) => (
                        <div key={i} className="relative min-h-[18px] flex-1 overflow-hidden rounded-[4px] bg-[#E5E5EA]">
                            {i === 0 && column.image && (
                                <Image src={column.image} alt="" fill sizes="(min-width: 1280px) 52px, (min-width: 768px) 11vw, 20vw" className="object-cover" />
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
        <div className="flex justify-between rounded-[5px] bg-white px-[6px] py-1 text-[11px] text-[#6B6B6B]">
            <span>7컷</span><span>카피라이팅 켜짐</span>
        </div>
    </>
);

const GarmentPreview = () => (
    <>
        <div className="relative w-[44%] overflow-hidden rounded-[6px] bg-[#EDEDED]">
            <Image src="/sections/mannequin-tee.webp" alt="" fill sizes="(min-width: 1280px) 100px, (min-width: 768px) 19vw, 40vw" className="object-cover object-[center_20%]" />
            <span className="absolute top-[34%] left-[62%] size-[11px] rounded-full bg-white shadow-[0_0_0_3px_rgba(47,128,237,0.35)]" />
            <span className="absolute top-[62%] left-[40%] size-[11px] rounded-full bg-white shadow-[0_0_0_3px_rgba(47,128,237,0.35)]" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-[5px]">
            <b className="text-[11px] font-bold text-[#1A1A1A]">핏</b>
            <div className="flex gap-[3px]">
                {['슬림', '레귤러', '오버'].map((fit) => (
                    <span key={fit} className={`flex-1 whitespace-nowrap rounded-[4px] border bg-white py-[3px] text-center text-[11px] ${fit === '레귤러' ? 'border-[#1A1A1A] font-bold text-[#1A1A1A]' : 'border-[#E3E3E8] text-[#6B6B6B]'}`}>{fit}</span>
                ))}
            </div>
            <b className="text-[11px] font-bold text-[#1A1A1A]">색감</b>
            <div className="relative mx-0.5 mt-1 mb-[6px] h-[3px] rounded-[3px] bg-[#DCDCE2]">
                <span className="absolute top-1/2 left-[38%] size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />
            </div>
            <div className="mt-[3px] rounded-full bg-[#1A1A1A] py-1 text-center text-[11px] font-bold text-white">이대로 진행</div>
        </div>
    </>
);

const EditorPreview = () => (
    <>
        <div className="flex justify-end gap-1 text-[11px] font-bold">
            <span className="rounded-full border border-[#E3E3E8] bg-white px-2 py-[3px] text-[#1A1A1A]">미리보기</span>
            <span className="rounded-full bg-[#1A1A1A] px-2 py-[3px] text-white">다운로드</span>
        </div>
        <div className="rounded-[5px] border border-[#dce7f6] bg-[#eef5ff] px-[6px] py-1 text-[11px] leading-[1.4] text-[#3068b4]">
            {'지금도 문구와 배치를 고칠 수 있어요. 창을 닫아도 계속 만들어져요.'}
        </div>
        <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-1">
            <div className="relative overflow-hidden rounded-[4px] bg-[#E5E5EA]">
                <Image src="/sections/sig_women_01.webp" alt="" fill sizes="(min-width: 1280px) 110px, (min-width: 768px) 21vw, 36vw" className="object-cover object-[center_30%]" />
            </div>
            {/* 지금 고치고 있는 문구 블록 */}
            <div className="flex flex-col justify-center gap-1 rounded-[4px] bg-white px-2 ring-2 ring-[#2F80ED]">
                <span className="h-[3px] w-3/4 rounded-full bg-[#DCDCE2]" />
                <span className="h-[3px] w-1/2 rounded-full bg-[#DCDCE2]" />
            </div>
            <div className="rounded-[4px] border border-dashed border-[#B9C9E6] bg-white" />
            <div className="relative overflow-hidden rounded-[4px] bg-[#E5E5EA]">
                <Image src="/sections/sig_women_03.webp" alt="" fill sizes="(min-width: 1280px) 110px, (min-width: 768px) 21vw, 36vw" className="object-cover object-[center_30%]" />
            </div>
        </div>
    </>
);

const StepPreview = ({ index }: { index: number }) => (
    <div aria-hidden="true" className="relative mb-5 md:mb-6">
        <div
            className={cn(
                'flex aspect-[16/11] overflow-hidden rounded-[12px] bg-[#F2F2F4] p-3 leading-[1.3] ring-1 ring-white/10 xl:aspect-[4/3]',
                index === 2 ? 'flex-row items-stretch gap-2' : 'flex-col gap-[7px]',
                // 넓은 2열 패널에서 업로드 목업이 위로 몰리지 않게 가운데 두되, 넘치면 위부터 보이게 safe 정렬
                index === 0 && 'justify-center-safe'
            )}
        >
            {index === 0 ? <UploadPreview /> : index === 1 ? <ShotPreview /> : index === 2 ? <GarmentPreview /> : <EditorPreview />}
        </div>
        {index < STEPS.length - 1 && (
            // 4열(xl)에서만 다음 카드로 잇는다. -right-12 = 카드 패딩 20 + 간격 절반 12 + 칩 절반 16
            <div className="absolute top-1/2 -right-12 z-40 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_12px_32px_rgba(34,42,53,0.14)] xl:flex">
                <ArrowRight size={16} className="text-[#1A1A1A]" />
            </div>
        )}
    </div>
);

const StepItem = ({ index, children }: { index: number; children: ReactNode }) => {
    // 섹션 전체가 아니라 카드마다 관찰해야 모바일 세로 스택에서도 카드가 화면에 들어올 때 나타난다.
    const [ref, isVisible] = useInViewOnce<HTMLLIElement>(0, '0px 0px -12% 0px');

    return (
        <li
            ref={ref}
            className={cn(
                'relative transition-[opacity,translate] duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none md:[transition-delay:var(--step-delay-md)] xl:[transition-delay:var(--step-delay-xl)]',
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            )}
            style={
                {
                    zIndex: STEPS.length - index,
                    '--step-delay-md': `${(index % 2) * 120}ms`,
                    '--step-delay-xl': `${index * 120}ms`,
                } as CSSProperties
            }
        >
            {children}
        </li>
    );
};

const HowItWorksSection = () => {
    return (
        <Section
            id="how-it-works"
            aria-labelledby="how-it-works-title"
            className="relative z-20 border-t border-[rgba(34,42,53,0.08)] bg-[rgba(255,255,255,0.5)] backdrop-blur-[30px]"
        >
            <div className="mx-auto w-full max-w-[1200px]">
                <SectionHeader
                    label="HOW IT WORKS"
                    titleId="how-it-works-title"
                    title={<>쉬운 사용법,<br className="md:hidden" />{' 네 단계로 만들어요'}</>}
                    subtitle={<>AI가 먼저 만들어 두면,<br className="md:hidden" /> 대표님은 고르고 확인하면 돼요.</>}
                />

                {/* Tailwind preflight가 list-style을 지워 Safari가 목록으로 읽지 않으므로 role="list"를 명시.
                    768 미만 단일 열은 다른 섹션의 카드 묶음처럼 560으로 제한해 640~767에서 카드가 늘어나지 않게 한다 */}
                <ol role="list" className="relative grid grid-cols-1 gap-8 max-md:mx-auto max-md:max-w-[560px] md:grid-cols-2 md:gap-6 xl:grid-cols-4">
                    {STEPS.map((step, i) => (
                        <StepItem key={step.title} index={i}>
                            <Card variant="dark" className="flex h-full flex-col pb-6 md:pb-7 xl:pb-8">
                                <StepPreview index={i} />
                                <Badge variant="inverse" size="sm" aria-hidden="true" className="mb-2 flex w-fit text-white/70">
                                    STEP {i + 1}
                                </Badge>
                                <h3 className="mb-3 text-[18px] leading-[1.4] font-bold tracking-[-0.01em] text-balance text-white md:text-[20px]">
                                    <span className="sr-only">{`${i + 1}단계: `}</span>
                                    {step.title}
                                </h3>
                                <p className="text-[15px] leading-[1.65] text-pretty text-white/70 xl:text-[16px]">
                                    {step.description}
                                </p>
                            </Card>

                            {/* 세로 스택(768 미만)에서 다음 카드로 잇는다. gap-8(32) 사이를 정확히 채운다 */}
                            {i < STEPS.length - 1 && (
                                <div
                                    className="absolute -bottom-8 left-1/2 z-40 flex size-8 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_12px_32px_rgba(34,42,53,0.14)] md:hidden"
                                    aria-hidden="true"
                                >
                                    <ArrowDown size={16} className="text-[#1A1A1A]" />
                                </div>
                            )}
                        </StepItem>
                    ))}
                </ol>
                <div className="mt-10 flex justify-center md:mt-12 xl:hidden">
                    <Button id="howto-start-cta" variant="primary" size="lg" onClick={goToApp}>
                        지금 시작하기
                    </Button>
                </div>
            </div>
        </Section>
    );
};

export { HowItWorksSection };
