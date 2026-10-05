'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VideoContainer } from '@/components/ui/video-container';
import { goToApp } from '@/lib/app-url';
import { scrollToSection } from '@/lib/scroll-to-section';

const HERO_VIDEO_URL = '/video/optimized/wearless-desktop.mp4';
const HERO_VIDEO_POSTER_URL = '/video/optimized/wearless-desktop-poster.jpg';
// 가운데는 마크가 작은 teenz를 두고 양옆 로고 아래에 깐다. 글자가 원 끝까지 차는 EKO·O.A.C.는 가려지지 않는다.
const PROOF_LOGOS = ['/eko-logo.png', '/teenz-logo.png', '/oac-logo.png'];

// split:(1180px, globals.css @theme) 이상은 왼쪽 문구(42%)·오른쪽 영상(58%)으로 나눠 첫 화면에 데모 영상 전체가 보이게 하고,
// min-[87.5rem]:(1400px) 이상에서는 영상을 오른쪽으로 64px 더 낸다. 그보다 좁으면 영상 칸이 너무 작아져서
// 문구 아래에 영상을 두는 가운데 정렬을 그대로 쓴다.
// [@media(min-width:1024px)_and_(max-width:1179px)_and_(max-height:820px)]: 접두사는 그 가운데 정렬 구간 중
// 높이 820px 이하 화면(1024×768 등)에서 영상이 첫 화면에 더 보이도록 위쪽 여백·제목·영상 폭을 줄인다.
// Tailwind가 정적으로 찾도록 클래스마다 그대로 적는다.
const HeroSection = () => {
    return (
        <section
            id="home"
            className="relative z-10 px-6 pb-12 pt-[calc(var(--site-nav-height)+32px)] md:pt-[calc(var(--site-nav-height)+40px)] lg:pb-16 lg:pt-[calc(var(--site-nav-height)+48px)] [@media(min-width:1024px)_and_(max-width:1179px)_and_(max-height:820px)]:pt-[calc(var(--site-nav-height)+32px)] split:pb-24 split:pt-[calc(var(--site-nav-height)+72px)]"
        >
            {/* 1180px 이상: 왼쪽 문구 | 오른쪽 영상. 그보다 좁으면 문구 아래 영상 */}
            <div className="mx-auto w-full max-w-[1200px] split:grid split:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] split:items-center split:gap-x-14">
                <div className="flex w-full flex-col items-center split:items-start">
                    {/* Stats Badge */}
                    <div
                        className="mb-6 animate-fade-in [@media(min-width:1024px)_and_(max-width:1179px)_and_(max-height:820px)]:mb-5"
                        style={{ animationDelay: '0s', animationDuration: '0.5s' }}
                    >
                        <Badge variant="glass">
                            <Image src="/logo.svg" alt="" width={16} height={16} className="size-4 flex-none" />
                            <span className="sr-only">Wearless</span>
                            {/* 숫자와 문장을 한 span으로 묶어 flex gap 대신 일반 공백으로 잇는다. */}
                            <span>
                                <span className="font-bold text-[#2F5FBF]">200+개</span> 쇼핑몰이 함께합니다.
                            </span>
                        </Badge>
                    </div>

                    {/* Headline */}
                    <h1
                        className="mb-4 text-center text-[clamp(30px,8.6vw,34px)] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A1A] animate-fade-in sm:text-[40px] sm:leading-[1.15] md:mb-5 md:text-[48px] md:leading-[1.12] lg:text-[56px] lg:leading-[1.1] [@media(min-width:1024px)_and_(max-width:1179px)_and_(max-height:820px)]:text-[48px] split:text-left split:text-[44px] split:leading-[1.16]"
                        style={{ animationDelay: '0.05s', animationDuration: '0.5s' }}
                    >
                        좋은 옷만 가져오세요.
                        <br />
                        나머지는 Wearless에서.
                    </h1>

                    {/* Sub-headline */}
                    <p
                        className="mx-auto mb-8 max-w-[560px] text-balance text-center text-[17px] font-medium leading-[1.5] text-[#4A4A4A] animate-fade-in sm:text-[18px] md:mb-10 md:text-[20px] split:mx-0 split:mb-8 split:max-w-[23em] split:text-pretty split:text-left split:text-[18px] split:leading-[1.6]"
                        style={{ animationDelay: '0.12s', animationDuration: '0.5s' }}
                    >
                        옷 사진만 올리면 AI가 모델컷부터 상세페이지까지,<br className="hidden sm:block split:hidden" /> 10분이면 완성해요.
                    </p>

                    {/* CTA + Rating */}
                    <div
                        className="mx-auto flex w-full max-w-[500px] flex-col items-center animate-fade-in split:mx-0 split:items-start"
                        style={{ animationDelay: '0.2s', animationDuration: '0.5s' }}
                    >
                        <div className="flex w-full flex-col items-center split:w-auto split:flex-row split:gap-6">
                            <Button id="hero-start-cta" variant="primary" size="lg" onClick={goToApp}>
                                무료로 시작하기
                            </Button>
                            {/* 좌우 분할에서만 버튼 옆에 둔다. 가운데 정렬에서는 바로 아래가 영상이라 링크가 없어도 된다. */}
                            <a
                                href="#how-it-works"
                                onClick={(event) => scrollToSection(event, 'how-it-works')}
                                className="group hidden min-h-11 items-center gap-1.5 rounded-md text-[16px] font-semibold leading-[1.5] text-[#1A1A1A] split:inline-flex"
                            >
                                <span className="underline decoration-[rgba(26,26,26,0.25)] underline-offset-[5px] transition-colors group-hover:decoration-[#1A1A1A]">
                                    사용법 보기
                                </span>
                                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                                    →
                                </span>
                            </a>
                        </div>
                        <p className="mt-3 text-[14px] leading-[1.6] text-[#5C5C5C]">가입하면 무료 크레딧을 드려요.</p>
                        <div className="mt-3 text-center md:flex md:items-center md:justify-center md:gap-3 split:mt-7 split:w-full split:max-w-[400px] split:justify-start split:border-t split:border-[rgba(34,42,53,0.08)] split:pt-[22px]">
                            <span className="sr-only">베타테스터 평균 만족도 5점 만점에 4.9점</span>
                            <div className="flex items-center justify-center gap-2" aria-hidden="true">
                                {/* 로고를 겹쳐 한 줄로 잇는다. 흰 링이 마디를 나누고, 가운데 로고만 양옆 아래로 들어간다. */}
                                <div className="flex items-center">
                                    {PROOF_LOGOS.map((logo, i) => (
                                        <Image
                                            key={logo}
                                            src={logo}
                                            alt=""
                                            width={32}
                                            height={32}
                                            className={`relative size-8 rounded-full bg-white object-cover ring-2 ring-white shadow-[0_2px_8px_-2px_rgba(17,24,39,0.22)] ${i > 0 ? '-ml-1.5' : ''} ${i === 1 ? 'z-0' : 'z-10'}`}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center gap-0.5">
                                    {[0, 1, 2, 3].map((star) => (
                                        <Star key={star} size={16} className="fill-[#FFB800] text-[#FFB800]" />
                                    ))}
                                    <span className="relative h-4 w-4">
                                        <Star size={16} className="fill-[#E3E3E3] text-[#E3E3E3]" />
                                        <span className="absolute inset-y-0 left-0 w-[90%] overflow-hidden">
                                            <Star size={16} className="max-w-none fill-[#FFB800] text-[#FFB800]" />
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <p className="mt-1.5 text-[14px] leading-[1.6] text-[#5C5C5C] md:mt-0" aria-hidden="true">
                                베타테스터 평균 만족도 <span className="font-bold text-[#1A1A1A]">4.9</span>/5
                            </p>
                        </div>
                    </div>
                </div>

                {/* Demo Video — 가장 큰 첫 화면 이미지(포스터)라 지연 없이 바로 나타나게 둔다. */}
                <div
                    className="relative z-20 mx-auto mt-10 w-full max-w-[560px] animate-fade-in md:mt-12 md:max-w-[640px] lg:max-w-[900px] [@media(min-width:1024px)_and_(max-width:1179px)_and_(max-height:820px)]:max-w-[760px] split:mx-0 split:mt-0 split:w-auto split:max-w-none min-[87.5rem]:-mr-16"
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
                        borderTone="blue"
                        preload="auto"
                        label="옷 사진 업로드부터 상세페이지 완성까지 Wearless 제작 과정 시연 영상"
                    />
                </div>
            </div>
        </section>
    );
};

export { HeroSection };
