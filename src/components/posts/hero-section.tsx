'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VideoContainer } from '@/components/ui/video-container';
import { SurveyInline } from '@/components/survey/SurveyInline';
import { goToApp } from '@/lib/app-url';

const HERO_VIDEO_URL = '/video/optimized/wearless-1080.mp4';
const HERO_VIDEO_POSTER_URL = '/video/optimized/wearless-poster.jpg';

const HeroSection = () => {
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);

    const handleCloseSurvey = () => {
        setIsSurveyOpen(false);
    };

    return (
        <section
            id="home"
            className="relative z-10 flex flex-col items-center justify-center px-4 pb-12 pt-[calc(var(--site-nav-height)+20px)] sm:min-h-screen sm:px-6 sm:pt-[var(--site-nav-height)]"
        >
            {/* Stats Badge */}
            <div
                className="mb-6 mt-3 animate-fade-in"
                style={{ animationDelay: '0s', animationDuration: '0.6s' }}
            >
                <Badge variant="gradient" className="py-2.5 pr-5 pl-3.5">
                    <span className="inline-flex items-center gap-1.5">
                        <span className="sr-only">Wearless</span>
                        <Image
                            src="/logo.svg"
                            alt=""
                            width={18}
                            height={18}
                            className="max-w-none flex-none"
                        />
                        <Image
                            src="/wordmark.svg"
                            alt=""
                            width={1998}
                            height={415}
                            className="h-[11.5px] w-auto max-w-none flex-none"
                        />
                    </span>
                    <span className="h-3.5 w-px bg-[#D9D9D9]" aria-hidden="true" />
                    <span
                        className="font-bold"
                        style={{
                            background: 'linear-gradient(90deg, #1FA3DC, #3F7FD6, #8466DC)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        200+개
                    </span>
                    쇼핑몰이 함께합니다.
                </Badge>
            </div>

            {/* Headline */}
            <h1
                className="mb-6 text-center text-[32px] font-bold leading-[1.25] tracking-[0.015em] sm:text-[34px] sm:leading-[1.1] md:text-[48px] lg:text-[56px] animate-fade-in"
                style={{ animationDelay: '0.2s', animationDuration: '0.6s', wordSpacing: '0.06em' }}
            >
                <span className="text-[#1A1A1A]">
                    상세페이지에 <br className="sm:hidden" />
                    시간 쓰지 마세요.
                    <br />
                    <span className="inline-block whitespace-nowrap">
                        쇼핑몰 대표님을 위한 AI.
                    </span>
                </span>
            </h1>

            {/* Sub-headline */}
            <p
                className="mx-auto mb-10 max-w-[540px] text-balance text-center text-[15px] font-semibold tracking-[0.01em] leading-[1.6] text-[#3A3A3A] sm:whitespace-nowrap sm:text-[18px] md:text-[20px] animate-fade-in"
                style={{ animationDelay: '0.5s', animationDuration: '0.6s', wordSpacing: '0.05em' }}
            >
                상세페이지 10분이면 뚝딱. <br className="sm:hidden" />
                지금 바로 경험해보세요.
            </p>

            {/* CTA + Survey Transition */}
            <div
                className="mx-auto w-full max-w-[500px] animate-fade-in"
                style={{ animationDelay: '0.7s', animationDuration: '0.6s' }}
            >
                <div
                    className="grid transition-[grid-template-rows] duration-[650ms]"
                    style={{
                        gridTemplateRows: isSurveyOpen ? '0fr 1fr' : '1fr 0fr',
                        transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                    }}
                >
                    <div className="overflow-hidden">
                        <div
                            className="flex justify-center pb-2 transition-all duration-[650ms]"
                            style={{
                                transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                                opacity: isSurveyOpen ? 0 : 1,
                                transform: isSurveyOpen
                                    ? 'translateY(-12px) scale(0.96)'
                                    : 'translateY(0) scale(1)',
                                pointerEvents: isSurveyOpen ? 'none' : 'auto',
                            }}
                        >
                            <Button
                                id="hero-start-cta"
                                variant="cta"
                                size="lg"
                                onClick={goToApp}
                            >
                                지금 시작하기
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-hidden">
                        <div
                            className="pt-1 transition-all duration-[650ms]"
                            style={{
                                transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                                opacity: isSurveyOpen ? 1 : 0,
                                transform: isSurveyOpen
                                    ? 'translateY(0) scale(1)'
                                    : 'translateY(12px) scale(0.98)',
                            }}
                        >
                            <SurveyInline open={isSurveyOpen} onClose={handleCloseSurvey} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Demo Video */}
            <div
                className="relative z-20 mx-auto mt-4 w-full max-w-[900px] animate-fade-in"
                style={{ animationDelay: '0s', animationDuration: '0.55s' }}
            >
                <VideoContainer
                    src={HERO_VIDEO_URL}
                    poster={HERO_VIDEO_POSTER_URL}
                    aspectRatio="16/9"
                    borderType="gradient"
                    preload="auto"
                />
            </div>
        </section>
    );
};

export { HeroSection };
