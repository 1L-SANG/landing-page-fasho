'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VideoContainer } from '@/components/ui/video-container';
import { SurveyInline } from '@/components/survey/SurveyInline';
import { goToApp } from '@/lib/app-url';

const HERO_VIDEO_URL = '/video/optimized/wearless-desktop.mp4';
const HERO_VIDEO_POSTER_URL = '/video/optimized/wearless-desktop-poster.jpg';
const STATS_BADGE_RESTORE_AT = new Date('2026-09-27T16:00:00Z').getTime();

const HeroSection = () => {
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);
    const [isStatsBadgeVisible, setIsStatsBadgeVisible] = useState(false);

    useEffect(() => {
        const delay = Math.max(0, STATS_BADGE_RESTORE_AT - Date.now());
        const timeout = window.setTimeout(() => setIsStatsBadgeVisible(true), delay);
        return () => window.clearTimeout(timeout);
    }, []);

    const handleCloseSurvey = () => {
        setIsSurveyOpen(false);
    };

    return (
        <section
            id="home"
            className="relative z-10 flex flex-col items-center justify-center px-4 pb-12 pt-[calc(var(--site-nav-height)+20px)] sm:min-h-screen sm:px-6 sm:pt-[var(--site-nav-height)]"
        >
            {/* Stats Badge */}
            {isStatsBadgeVisible && (
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
            )}

            {/* Headline */}
            <h1
                className="mb-6 text-center text-[clamp(26px,8vw,32px)] font-bold leading-[1.25] tracking-[0.015em] sm:text-[34px] sm:leading-[1.1] md:text-[48px] lg:text-[56px] animate-fade-in"
                style={{ animationDelay: '0.2s', animationDuration: '0.6s', wordSpacing: '0.06em' }}
            >
                <span className="text-[#1A1A1A]">
                    좋은 옷만 가져오세요.
                    <br />
                    나머지는 Wearless에서.
                </span>
            </h1>

            {/* Sub-headline */}
            <p
                className="mx-auto mb-10 max-w-[540px] text-balance text-center text-[15px] font-semibold tracking-[0.01em] leading-[1.6] text-[#3A3A3A] sm:whitespace-nowrap sm:text-[18px] md:text-[20px] animate-fade-in"
                style={{ animationDelay: '0.5s', animationDuration: '0.6s', wordSpacing: '0.05em' }}
            >
                상세페이지 전 과정, 10분이면 뚝딱.
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
                            className="flex flex-col items-center justify-center pb-2 transition-all duration-[650ms]"
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
                            <div className="mt-4 text-center">
                                <span className="sr-only">의류 쇼핑몰 대표님들 평균 만족도 5점 만점에 4.9점</span>
                                <div className="flex items-center justify-center gap-2" aria-hidden="true">
                                    <div className="flex items-center">
                                        {['/teenz-logo.png', '/eko-logo.png', '/oac-logo.png'].map((logo) => (
                                            <Image
                                                key={logo}
                                                src={logo}
                                                alt=""
                                                width={24}
                                                height={24}
                                                className="-ml-1.5 h-6 w-6 rounded-full object-cover ring-2 ring-white first:ml-0"
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-px">
                                        {[0, 1, 2, 3].map((star) => (
                                            <Star key={star} size={15} className="fill-[#FFB800] text-[#FFB800]" />
                                        ))}
                                        <span className="relative h-[15px] w-[15px]">
                                            <Star size={15} className="fill-[#E3E3E3] text-[#E3E3E3]" />
                                            <span className="absolute inset-y-0 left-0 w-[90%] overflow-hidden">
                                                <Star size={15} className="max-w-none fill-[#FFB800] text-[#FFB800]" />
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-1.5 whitespace-nowrap text-[13px] text-[#6B6B6B] md:text-[14px]" aria-hidden="true">
                                    의류 쇼핑몰 대표님들 평균 만족도 <span className="font-bold text-[#1A1A1A]">4.9</span>
                                </p>
                            </div>
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
                    mobileSrc="/video/optimized/wearless-mobile.mp4"
                    mobilePoster="/video/optimized/wearless-mobile-poster.jpg"
                    mobileAspectRatio="4/3"
                    aspectRatio="16/9"
                    borderType="gradient"
                    preload="auto"
                />
            </div>
        </section>
    );
};

export { HeroSection };
