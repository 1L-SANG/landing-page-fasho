'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { APP_URL } from '@/lib/config';

const NAV_LINKS = [
    { label: '기능', id: 'features' },
    { label: '작동 방식', id: 'how' },
] as const;

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <>
            <nav
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
                style={{
                    backgroundColor: isScrolled
                        ? 'rgba(255,255,255,0.82)'
                        : 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(20px) saturate(1.6)',
                    WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
                    boxShadow: isScrolled ? '0 1px 0 0 var(--ring)' : 'none',
                }}
            >
                <div className="mx-auto flex h-[68px] max-w-[var(--container)] items-center justify-between px-6 max-md:h-[58px]">
                    {/* Logo */}
                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 transition-opacity hover:opacity-70"
                        aria-label="맨 위로 이동"
                    >
                        <Image
                            src="/logo.png"
                            alt="Wearless"
                            width={26}
                            height={26}
                            className="object-contain"
                        />
                        <span className="font-display text-[20px] text-[var(--fg-1)] whitespace-normal">
                            Wearless
                        </span>
                    </button>

                    {/* Desktop nav */}
                    <div className="hidden items-center gap-9 md:flex">
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => scrollToSection(link.id)}
                                className="group relative text-[15px] font-medium text-[var(--fg-2)] transition-colors hover:text-[var(--fg-1)]"
                                aria-label={`${link.label} 섹션으로 이동`}
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--fg-1)] transition-all duration-200 group-hover:w-full" />
                            </button>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex">
                        <a
                            href={APP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-10 items-center rounded-full bg-[var(--cta-bg)] px-5 text-[14px] font-medium text-white shadow-[var(--elev-btn-hi),var(--elev-soft)] transition-all duration-150 hover:-translate-y-px hover:bg-[var(--cta-bg-hover)]"
                            aria-label="시작하기"
                        >
                            시작하기
                        </a>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-[var(--fg-1)] md:hidden"
                        aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl md:hidden animate-fade-in">
                    <div className="flex h-full flex-col items-center justify-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => scrollToSection(link.id)}
                                className="text-[22px] font-semibold text-[var(--fg-1)]"
                                aria-label={`${link.label} 섹션으로 이동`}
                            >
                                {link.label}
                            </button>
                        ))}
                        <a
                            href={APP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex h-12 items-center rounded-full bg-[var(--cta-bg)] px-8 text-[16px] font-medium text-white"
                            aria-label="시작하기"
                        >
                            시작하기
                        </a>
                    </div>
                </div>
            )}
        </>
    );
};

export { Header };
