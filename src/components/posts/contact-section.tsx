'use client';

import { useState, useEffect, useRef } from 'react';
import { User, Mail } from 'lucide-react';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
import { Button } from '@/components/ui/button';
import { triggerHeroSurveyFromCta } from '@/lib/hero-survey-scroll';

const ContactSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="contact"
            ref={sectionRef}
            className="bg-[#1A1A1A] px-6 py-24 md:py-32"
        >
            <div
                className={`mx-auto max-w-[1200px] transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
                <GradientBorderContainer innerClassName="bg-[#222222]">
                    <div className="grid md:grid-cols-2">
                        {/* Left - Contact Info */}
                        <div className="border-b border-white/10 p-10 md:border-b-0 md:border-r md:p-14">
                            <h2 className="mb-4 typo-heading-section wrap-balance text-kor-safe text-white">
                                문의하기
                            </h2>
                            <p className="mb-12 measure-28ch typo-body wrap-pretty text-kor-safe text-white/60">
                                궁금한 점이 있으시다면 언제든 연락주세요.
                            </p>

                            <div className="flex flex-col gap-8 md:flex-row">
                                {/* Person */}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/5">
                                        <User size={20} className="text-white/70" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="mb-1 text-[13px] text-white/40">담당자</p>
                                        <p className="text-[17px] font-medium text-white">정일상 대표</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/5">
                                        <Mail size={20} className="text-white/70" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="mb-1 text-[13px] text-white/40">이메일</p>
                                        <a
                                            href="mailto:ilsang@wearless.kr"
                                            className="text-[17px] font-medium text-white transition-opacity hover:opacity-80 break-all"
                                            tabIndex={0}
                                            aria-label="이메일 보내기"
                                        >
                                            ilsang@wearless.kr
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right - CTA */}
                        <div className="flex flex-col items-center justify-center p-10 text-center md:p-14">
                            <h2 className="mb-4 typo-heading-section wrap-balance text-kor-safe text-white">
                                지금 바로 시작하세요
                            </h2>
                            <p className="mb-10 measure-28ch typo-body wrap-pretty text-kor-safe text-white/60">
                                Wearless Pro plan을 무료로 만날 수 있는 처음이자 마지막 이벤트에요.
                            </p>
                            <Button
                                variant="ghost"
                                size="lg"
                                className="mt-8 rounded-xl border-0 bg-white px-12 py-3 typo-button font-bold text-[#1A1A1A] shadow-lg hover:scale-105 hover:bg-white/90 hover:text-[#1A1A1A]"
                                onClick={triggerHeroSurveyFromCta}
                            >
                                할인혜택 받으러가기
                            </Button>
                        </div>
                    </div>
                </GradientBorderContainer>
            </div>
        </section>
    );
};

export { ContactSection };
