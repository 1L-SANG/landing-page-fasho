'use client';

import { Mail } from 'lucide-react';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/cn';
import { Section } from '@/components/ui/section';
import { useInViewOnce } from '@/components/ui/use-in-view-once';
import { goToApp } from '@/lib/app-url';

const ContactSection = () => {
    const [sectionRef, isVisible] = useInViewOnce<HTMLElement>(0.2);

    return (
        <Section id="contact" ref={sectionRef} aria-labelledby="contact-title" className="bg-[#1A1A1A]">
            <div
                className={cn(
                    'mx-auto w-full max-w-[1200px] transition-[opacity,translate] duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                )}
            >
                <GradientBorderContainer innerClassName="bg-[#222222]">
                    <div className="grid md:grid-cols-2">
                        {/* Left - Contact Info */}
                        <div className="border-b border-white/10 p-7 sm:p-10 md:flex md:flex-col md:justify-center md:border-b-0 md:border-r lg:p-14">
                            <h2
                                id="contact-title"
                                className="mb-3 text-[22px] leading-[1.25] font-bold tracking-[-0.01em] text-white md:text-[24px]"
                            >
                                문의하기
                            </h2>
                            {/* 360에서만 넘치는 줄을 '언제든 연락주세요.' 단위로 넘긴다(사파리는 balance가 꺼져 있음). */}
                            <p className="mb-8 text-[16px] leading-[1.7] text-white/60">
                                궁금한 점이 있으시면 <span className="inline-block">언제든 연락주세요.</span>
                            </p>

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/5">
                                    <Mail size={20} className="text-white/70" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="mb-1 text-[13px] leading-[1.5] font-medium text-white/60">이메일</p>
                                    {/* 탭 영역(44px 이상)은 위아래로 늘린 after 로 채운다. 링크 상자 자체를 키우면
                                        포커스 링이 바로 위 '이메일' 라벨 글자를 가로지른다. */}
                                    <a
                                        href="mailto:contact@wearless.kr"
                                        className="relative inline-block text-[17px] font-medium text-white transition-opacity after:absolute after:inset-x-0 after:-inset-y-2.5 hover:opacity-80"
                                    >
                                        contact@wearless.kr
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right - CTA: 1단(768 미만)에서는 위 문의 블록처럼 왼쪽 정렬, 2단부터 가운데 정렬 */}
                        <div className="flex flex-col items-start p-7 text-left sm:p-10 md:items-center md:justify-center md:text-center lg:p-14">
                            <h2 className="mb-3 text-[28px] leading-[1.3] font-bold tracking-[-0.02em] text-white md:mb-4 md:text-[32px] md:leading-[1.25] lg:text-[40px] lg:leading-[1.2]">
                                지금 바로 시작하세요
                            </h2>
                            <p className="mb-6 text-[16px] leading-[1.7] text-white/60 md:mb-8">
                                사진 몇 장이면 첫 상세페이지가 나와요.
                                <br />
                                지금 무료로 만들어보세요.
                            </p>
                            <Button variant="inverse" size="lg" onClick={goToApp}>
                                무료로 시작하기
                            </Button>
                        </div>
                    </div>
                </GradientBorderContainer>
            </div>
        </Section>
    );
};

export { ContactSection };
