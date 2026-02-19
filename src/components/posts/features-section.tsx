'use client';

import { useState, useEffect, useRef } from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
import { MonotoneBorderContainer } from '@/components/ui/monotone-border-container';
import { useVideoAutoplay } from '@/components/ui/use-video-autoplay';

const FEATURES_VIDEO_URL = '/video/demo.2.mp4';

const FEATURES = [
    { title: '레퍼런스 기반 생성', description: '원하는 느낌의 이미지를 구현해보세요.' },
    { title: '쇼핑몰 정체성 유지', description: '쇼핑몰에서 그동안 업로드하던 컷들의 무드를 반영해보세요.' },
    { title: '다양한 컷 종류', description: '고스트컷부터 디테일컷, 일상컷, 스튜디오컷까지 원하는 컷을 \n생성해보세요.' },
    { title: '릴스용 템플릿', description: '인스타그램에서 인기 있는 릴스들을 선택해서 트렌드에 맞게 AI로 \n생성해보세요.' },
] as const;

const MOBILE_GRADIENTS = [
    'linear-gradient(135deg, #12ADE6, #4C63FC)',
    'linear-gradient(135deg, #4C63FC, #DC4CFC)',
    'linear-gradient(135deg, #DC4CFC, #FF0080)',
    'linear-gradient(135deg, #FF0080, #12ADE6)',
];

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
                    subtitle="쇼핑몰 대표님만을 위해 만들어진 서비스니까."
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
                                <h3 className="mb-3 text-[20px] font-bold text-[#1A1A1A] md:text-[22px]">{FEATURES[0].title}</h3>
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
                            <h3 className="mb-3 text-[20px] font-bold text-[#1A1A1A] md:text-[22px]">{FEATURES[1].title}</h3>
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
                            <h3 className="mb-3 text-[20px] font-bold text-[#1A1A1A] md:text-[22px]">{FEATURES[2].title}</h3>
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
                            <h3 className="mb-3 text-[20px] font-bold text-[#1A1A1A] md:text-[22px]">{FEATURES[3].title}</h3>
                            <p className="text-[15px] leading-[1.7] text-[#6B6B6B]">{FEATURES[3].description}</p>
                        </div>
                    </GradientBorderContainer>
                </div>
            </div>

            {/* Mobile: stacked layout */}
            <div className="lg:hidden">
                {/* Mobile Video */}
                <div
                    className={`mx-auto mb-12 max-h-[500px] transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                >
                    <GradientBorderContainer>
                        <div className="relative overflow-hidden bg-[#0A0A0A]" style={{ aspectRatio: '9/16', maxHeight: '500px' }}>
                            <video
                                className="video-no-controls absolute inset-0 h-full w-full object-cover"
                                muted
                                loop
                                playsInline
                                autoPlay
                            >
                                <source src={FEATURES_VIDEO_URL} type="video/mp4" />
                            </video>
                        </div>
                    </GradientBorderContainer>
                </div>

                {/* Mobile Feature Cards */}
                <div className="space-y-12">
                    {FEATURES.map((feature, i) => (
                        <div
                            key={i}
                            className={`text-center transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                            style={{ transitionDelay: `${i * 150}ms` }}
                        >
                            <div className="mx-auto mb-4 flex h-[40px] w-[40px] items-center justify-center rounded-full text-[14px] font-bold text-white"
                                style={{ background: MOBILE_GRADIENTS[i] }}
                            >
                                {String(i + 1).padStart(2, '0')}
                            </div>
                            <div className="rounded-2xl border-2 border-[#E5E5E5] bg-white/80 p-6">
                                <h3 className="mb-3 text-[22px] font-bold text-[#1A1A1A] md:text-[26px]">{feature.title}</h3>
                                <p className="text-[15px] leading-[1.7] text-[#6B6B6B]">{feature.description}</p>
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
