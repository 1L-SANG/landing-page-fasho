'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VideoContainer } from '@/components/ui/video-container';
import { SurveyInline } from '@/components/survey/SurveyInline';

const HERO_VIDEO_URL = '/video/demo.mov';

const HeroSection = () => {
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);

    const handleOpenSurvey = () => {
        setIsSurveyOpen(true);
    };

    const handleCloseSurvey = () => {
        setIsSurveyOpen(false);
    };

    return (
        <section
            id="home"
            className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-12 pt-[72px]"
        >
            {/* Stats Badge */}
            <div
                className="mb-6 mt-3 animate-fade-in"
                style={{ animationDelay: '0s', animationDuration: '0.6s' }}
            >
                <Badge variant="gradient" className="px-5 py-2.5">
                    <span
                        className="font-bold"
                        style={{
                            background: 'linear-gradient(to right, #12ADE6, #4C63FC, #DC4CFC)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        200+개
                    </span>
                    쇼핑몰들이 Wearless와 함께합니다.
                </Badge>
            </div>

            {/* Headline */}
            <h1
                className="mb-6 text-center text-[34px] font-bold leading-[1.1] tracking-[0.015em] md:text-[48px] lg:text-[56px] animate-fade-in"
                style={{ animationDelay: '0.2s', animationDuration: '0.6s', wordSpacing: '0.06em' }}
            >
                <span className="text-[#1A1A1A]">
                    촬영에 힘 쏟지 마세요.
                    <br />
                    쇼핑몰 대표님만을 위한 AI,
                </span>
                <br />
                <span
                    className="relative inline-block"
                    style={{
                        background: 'linear-gradient(135deg, #12ADE6, #4C63FC, #DC4CFC)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Wearless
                </span>
            </h1>

            {/* Sub-headline */}
            <p
                className="mx-auto mb-10 max-w-[540px] text-center text-[18px] font-medium tracking-[0.01em] leading-[1.7] text-[#3A3A3A] md:text-[20px] animate-fade-in"
                style={{ animationDelay: '0.5s', animationDuration: '0.6s', wordSpacing: '0.05em' }}
            >
                스튜디오, 모델, 조명 없이. 제품 사진만 찍으세요.
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
                            <Button id="hero-start-cta" variant="cta" size="lg" onClick={handleOpenSurvey}>
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
                style={{ animationDelay: '1.1s', animationDuration: '0.8s' }}
            >
                <VideoContainer
                    src={HERO_VIDEO_URL}
                    aspectRatio="16/9"
                    borderType="none"
                />
            </div>
        </section>
    );
};

export { HeroSection };
