'use client';

import { useState, useEffect, useRef } from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
import { MonotoneBorderContainer } from '@/components/ui/monotone-border-container';
import { useVideoAutoplay } from '@/components/ui/use-video-autoplay';

const FEATURES_VIDEO_URL = '/video/real demo 2.mov';

const FEATURES = [
    { title: '레퍼런스 기반 생성', description: '원하는 느낌의 이미지를 구현해보세요.' },
    { title: '쇼핑몰 정체성 유지', description: '쇼핑몰에서 그동안 업로드하던 컷들의 무드를 반영해보세요.' },
    { title: '다양한 컷 종류', description: `고스트컷부터 디테일컷,일상컷,스튜디오컷까지\n원하는 컷을 생성해보세요.` },
    { title: '릴스용 템플릿', description: `인스타그램에서 인기 있는 릴스들을 선택해서\n트렌드에 맞게 AI로 생성해보세요.` },
] as const;

const NUMBER_BADGE_STYLE = {
    background: 'linear-gradient(145deg, #050505 0%, #1A1A1A 58%, #000000 100%)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28), 0 6px 14px rgba(0,0,0,0.35)',
    border: '1px solid rgba(255,255,255,0.78)',
};

const FeaturesSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const videoRef = useVideoAutoplay();

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
            id="features"
            ref={sectionRef}
            className="relative px-6 py-24 md:py-32"
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(30px)',
                borderTop: '1px solid rgba(235, 230, 220, 0.5)',
            }}
        >
            <div className="mx-auto max-w-[1400px]">
                <SectionHeader
                    label="WHY WEARLESS"
                    title="왜 Wearless인가요?"
                    subtitle="Wearless만이 가지고 있으니까요."
                />

                {/* Desktop: 3-col grid with center video */}
                <div className="mx-auto hidden max-w-[1400px] gap-6 lg:grid lg:grid-cols-3 lg:grid-rows-2 relative">
                    {/* SVG Connecting Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                        <line
                            x1="33%" y1="25%" x2="50%" y2="50%"
                            stroke="url(#feat-grad1)" strokeWidth="2" strokeDasharray="8,4"
                            className={`transition-all duration-1000 ${isVisible ? 'opacity-30' : 'opacity-0'}`}
                            style={{ transitionDelay: '500ms' }}
                        />
                        <line
                            x1="67%" y1="25%" x2="50%" y2="50%"
                            stroke="url(#feat-grad2)" strokeWidth="2" strokeDasharray="8,4"
                            className={`transition-all duration-1000 ${isVisible ? 'opacity-30' : 'opacity-0'}`}
                            style={{ transitionDelay: '600ms' }}
                        />
                        <line
                            x1="33%" y1="75%" x2="50%" y2="50%"
                            stroke="url(#feat-grad3)" strokeWidth="2" strokeDasharray="8,4"
                            className={`transition-all duration-1000 ${isVisible ? 'opacity-30' : 'opacity-0'}`}
                            style={{ transitionDelay: '700ms' }}
                        />
                        <line
                            x1="67%" y1="75%" x2="50%" y2="50%"
                            stroke="url(#feat-grad4)" strokeWidth="2" strokeDasharray="8,4"
                            className={`transition-all duration-1000 ${isVisible ? 'opacity-30' : 'opacity-0'}`}
                            style={{ transitionDelay: '800ms' }}
                        />
                        <defs>
                            <linearGradient id="feat-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#12ADE6" />
                                <stop offset="100%" stopColor="#4C63FC" />
                            </linearGradient>
                            <linearGradient id="feat-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4C63FC" />
                                <stop offset="100%" stopColor="#DC4CFC" />
                            </linearGradient>
                            <linearGradient id="feat-grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#DC4CFC" />
                                <stop offset="100%" stopColor="#FF0080" />
                            </linearGradient>
                            <linearGradient id="feat-grad4" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FF0080" />
                                <stop offset="100%" stopColor="#12B4E6" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Top Left */}
                    <div
                        className={`relative transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
                        style={{ zIndex: 2 }}
                    >
                        <GradientBorderContainer disableHover>
                            <div className="flex h-full flex-col justify-center rounded-2xl bg-white p-6 shadow-lg">
                                <div className="mb-3 flex items-center gap-3">
                                    <span
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                                        style={NUMBER_BADGE_STYLE}
                                    >
                                        1
                                    </span>
                                    <h3 className="text-[20px] font-bold text-[#1A1A1A] md:text-[22px]">{FEATURES[0].title}</h3>
                                </div>
                                <p className="text-[15px] leading-[1.7] text-[#6B6B6B] whitespace-pre-line">{FEATURES[0].description}</p>
                            </div>
                        </GradientBorderContainer>
                    </div>

                    {/* Center Video (row-span-2) */}
                    <div
                        className="row-span-2 flex items-center justify-center relative"
                        style={{
                            transition: 'all 0.8s ease-out',
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'scale(1)' : 'scale(0.95)',
                            transitionDelay: '200ms',
                            zIndex: 3,
                        }}
                    >
                        <div className="w-full px-4">
                            <MonotoneBorderContainer>
                                <div className="relative overflow-hidden bg-[#0A0A0A]" style={{ aspectRatio: '16/9' }}>
                                    <video
                                        ref={videoRef}
                                        className="video-no-controls absolute inset-0 h-full w-full object-cover"
                                        muted
                                        loop
                                        playsInline
                                    >
                                        <source src={FEATURES_VIDEO_URL} type="video/mp4" />
                                        <source src={FEATURES_VIDEO_URL} type="video/quicktime" />
                                    </video>
                                </div>
                            </MonotoneBorderContainer>
                        </div>
                    </div>

                    {/* Top Right */}
                    <div
                        className={`relative transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
                        style={{ zIndex: 2 }}
                    >
                        <GradientBorderContainer disableHover>
                            <div className="flex h-full flex-col justify-center rounded-2xl bg-white p-6 shadow-lg">
                                <div className="mb-3 flex items-center gap-3">
                                    <span
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                                        style={NUMBER_BADGE_STYLE}
                                    >
                                        2
                                    </span>
                                    <h3 className="text-[20px] font-bold text-[#1A1A1A] md:text-[22px]">{FEATURES[1].title}</h3>
                                </div>
                                <p className="text-[15px] leading-[1.7] text-[#6B6B6B]">{FEATURES[1].description}</p>
                            </div>
                        </GradientBorderContainer>
                    </div>

                    {/* Bottom Left */}
                    <div
                        className={`relative transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
                        style={{ transitionDelay: '150ms', zIndex: 2 }}
                    >
                        <GradientBorderContainer disableHover>
                            <div className="flex h-full flex-col justify-center rounded-2xl bg-white p-6 shadow-lg">
                                <div className="mb-3 flex items-center gap-3">
                                    <span
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                                        style={NUMBER_BADGE_STYLE}
                                    >
                                        3
                                    </span>
                                    <h3 className="text-[20px] font-bold text-[#1A1A1A] md:text-[22px]">{FEATURES[2].title}</h3>
                                </div>
                                <p className="text-[15px] leading-[1.7] text-[#6B6B6B]">{FEATURES[2].description}</p>
                            </div>
                        </GradientBorderContainer>
                    </div>

                    {/* Bottom Right */}
                    <div
                        className={`relative transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
                        style={{ transitionDelay: '150ms', zIndex: 2 }}
                    >
                        <GradientBorderContainer disableHover>
                            <div className="flex h-full flex-col justify-center rounded-2xl bg-white p-6 shadow-lg">
                                <div className="mb-3 flex items-center gap-3">
                                    <span
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                                        style={NUMBER_BADGE_STYLE}
                                    >
                                        4
                                    </span>
                                    <h3 className="text-[20px] font-bold text-[#1A1A1A] md:text-[22px]">{FEATURES[3].title}</h3>
                                </div>
                                <p className="text-[15px] leading-[1.7] text-[#6B6B6B]">{FEATURES[3].description}</p>
                            </div>
                        </GradientBorderContainer>
                    </div>
                </div>

                {/* Mobile: stacked layout */}
                <div className="lg:hidden">
                    {/* Mobile Video */}
                    <div
                        className={`mx-auto mb-10 w-full max-w-[900px] transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                    >
                        <MonotoneBorderContainer>
                            <div className="relative aspect-video w-full overflow-hidden bg-[#0A0A0A]">
                                <video
                                    className="video-no-controls absolute inset-0 h-full w-full object-cover"
                                    muted
                                    loop
                                    playsInline
                                    autoPlay
                                    preload="metadata"
                                >
                                    <source src={FEATURES_VIDEO_URL} type="video/mp4" />
                                    <source src={FEATURES_VIDEO_URL} type="video/quicktime" />
                                </video>
                            </div>
                        </MonotoneBorderContainer>
                    </div>

                    {/* Mobile Feature Cards */}
                    <div className="space-y-12">
                        {FEATURES.map((feature, i) => (
                            <div
                                key={i}
                                className={`text-center transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                style={{ transitionDelay: `${i * 150}ms` }}
                            >
                                <div
                                    className="mx-auto mb-4 flex h-[40px] w-[40px] items-center justify-center rounded-full text-[14px] font-bold text-white"
                                    style={NUMBER_BADGE_STYLE}
                                >
                                    {String(i + 1).padStart(2, '0')}
                                </div>
                                <div className="rounded-2xl border border-[#9A9A9A] bg-white p-6">
                                    <h3 className="mb-3 text-[22px] font-bold text-[#1A1A1A] md:text-[26px]">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[15px] leading-[1.7] text-[#6B6B6B]">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section >
    );
};

export { FeaturesSection };
