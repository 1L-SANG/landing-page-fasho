'use client';

import { useState } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { SurveyInline } from '@/components/survey/SurveyInline';
import { Button } from '@/components/ui/button';
import { VideoContainer } from '@/components/ui/video-container';

const HERO_BADGES = [
    '모델/스튜디오 없이 제작',
    '쇼핑몰 셀러 전용 AI',
    '1분 설문 참여 혜택',
] as const;

const HERO_VIDEO_SRC = '/video/optimized/hero-1080.mp4';
const HERO_VIDEO_POSTER = '/video/optimized/hero-poster.jpg';

const HeroSection = () => {
    const [surveyOpen, setSurveyOpen] = useState(false);

    const handleOpenSurvey = () => {
        setSurveyOpen(true);
    };

    const handleCloseSurvey = () => {
        setSurveyOpen(false);
    };

    const handleScrollToPricing = () => {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <section
            id="home"
            className="relative z-10 px-6 pb-20 pt-[108px] md:pb-24 md:pt-[132px]"
            aria-label="Wearless 소개"
        >
            <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 md:gap-12">
                <div className="max-w-[820px] text-center">
                    <div className="mb-6 flex flex-wrap items-center justify-center gap-2.5">
                        {HERO_BADGES.map((badge) => (
                            <span
                                key={badge}
                                className="rounded-full border border-black/[0.08] bg-white/75 px-4 py-2 text-[12px] font-semibold tracking-[0.02em] text-[#4A4A4A] shadow-[0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur-md md:text-[13px]"
                            >
                                {badge}
                            </span>
                        ))}
                    </div>

                    <h1 className="mb-5 text-[36px] font-black leading-[1.05] tracking-[-0.04em] text-[#111] md:text-[60px]">
                        촬영 셋업 없이,
                        <br />
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #12ADE6 0%, #4C63FC 45%, #DC4CFC 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            쇼핑몰용 의류컷을 바로 생성하세요
                        </span>
                    </h1>

                    <p className="mx-auto mb-8 max-w-[680px] text-[17px] leading-[1.7] text-[#4F4F4F] md:text-[20px]">
                        제품 사진만 있으면 됩니다. Wearless가 상세페이지용 컷과 광고용 비주얼을 더 빠르고
                        일관되게 만들어줍니다.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button
                            id="hero-start-cta"
                            type="button"
                            variant="cta"
                            size="lg"
                            className="min-w-[190px] bg-[#111] text-[17px]"
                            onClick={handleOpenSurvey}
                        >
                            시작하기
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="lg"
                            className="min-w-[190px] border-black/[0.1] bg-white/60 text-[#3F3F3F] backdrop-blur-sm hover:border-black/[0.2] hover:bg-white/80 hover:text-[#111]"
                            onClick={handleScrollToPricing}
                        >
                            요금 보기
                        </Button>
                    </div>

                    <p className="mt-4 text-[13px] font-medium text-[#767676]">
                        시작하기를 누르면 1분 설문이 열리고, 이벤트 신청 흐름으로 이어집니다.
                    </p>
                </div>

                <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,500px)] lg:items-center">
                    <VideoContainer
                        src={HERO_VIDEO_SRC}
                        poster={HERO_VIDEO_POSTER}
                        className="shadow-[0_24px_60px_rgba(0,0,0,0.14)]"
                    />

                    <div className="rounded-[28px] border border-black/[0.08] bg-white/[0.72] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-7">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-black/[0.04] px-3 py-1.5 text-[12px] font-semibold text-[#555]">
                            EVENT FLOW
                        </div>
                        <div className="space-y-4">
                            {[
                                '시작하기 버튼 클릭 후 설문 열림',
                                '이메일 제출 시 신청 의사 전환 이벤트 기록',
                                '전체 설문 완료 시 최종 전환 이벤트 기록',
                            ].map((item, index) => (
                                <div
                                    key={item}
                                    className="flex items-start gap-3 rounded-2xl border border-black/[0.06] bg-white/70 px-4 py-3.5"
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#111] text-[13px] font-bold text-white">
                                        {index + 1}
                                    </span>
                                    <p className="pt-1 text-[15px] font-semibold leading-[1.5] text-[#222]">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 flex items-center gap-2 text-[13px] font-semibold text-[#4C63FC]">
                            <ArrowDownRight size={16} />
                            Meta Pixel Helper에서 순서대로 확인할 수 있습니다.
                        </div>
                    </div>
                </div>

                <SurveyInline open={surveyOpen} onClose={handleCloseSurvey} />
            </div>
        </section>
    );
};

export { HeroSection };
