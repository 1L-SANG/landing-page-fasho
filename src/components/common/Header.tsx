'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const NAV_LINKS = [
    { label: '홈', id: 'home' },
    { label: '주요 기능', id: 'features' },
    { label: '요금제', id: 'pricing' },
] as const;

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80' : 'bg-white/70'
                    }`}
                style={{
                    backdropFilter: 'blur(20px) saturate(1.8)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                }}
            >
                <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-6 max-md:h-[60px]">
                    {/* Logo */}
                    <button
                        onClick={handleScrollToTop}
                        className="flex items-center gap-2 transition-opacity hover:opacity-80"
                        aria-label="맨 위로 이동"
                        tabIndex={0}
                    >
                        <Image
                            src="/logo.png"
                            alt="Wearless Logo"
                            width={36}
                            height={36}
                            className="object-contain"
                        />
                        <span className="text-[20px] font-bold text-[#1A1A1A]">
                            Wearless
                        </span>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-10 md:flex">
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleScrollToSection(link.id)}
                                className="group relative text-[16px] font-medium text-[#6B6B6B] transition-colors hover:text-[#1A1A1A]"
                                tabIndex={0}
                                aria-label={`${link.label} 섹션으로 이동`}
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#1A1A1A] transition-all group-hover:w-full" />
                            </button>
                        ))}
                    </div>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden items-center gap-3 md:flex">
                        <button
                            onClick={() => handleScrollToSection('contact')}
                            className="rounded-full bg-[#1A1A1A] px-6 py-2.5 text-[15px] font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#333333]"
                            tabIndex={0}
                            aria-label="시작하기"
                        >
                            시작하기
                        </button>
                        <button
                            onClick={() => handleScrollToSection('contact')}
                            className="rounded-full border-[1.5px] border-[#E5E5E5] px-6 py-2.5 text-[15px] font-medium text-[#6B6B6B] transition-all hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                            tabIndex={0}
                            aria-label="문의하기"
                        >
                            문의하기
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-[#1A1A1A] md:hidden"
                        aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                        aria-expanded={mobileMenuOpen}
                        tabIndex={0}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-[#FAFAFA] md:hidden animate-fade-in">
                    <div className="flex h-full flex-col items-center justify-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleScrollToSection(link.id)}
                                className="text-[24px] font-semibold text-[#1A1A1A]"
                                tabIndex={0}
                                aria-label={`${link.label} 섹션으로 이동`}
                            >
                                {link.label}
                            </button>
                        ))}
                        <div className="mt-8 flex w-full max-w-xs flex-col gap-4 px-6">
                            <button
                                onClick={() => handleScrollToSection('contact')}
                                className="w-full rounded-full bg-[#1A1A1A] px-6 py-3.5 text-[16px] font-semibold text-white shadow-lg"
                                tabIndex={0}
                                aria-label="시작하기"
                            >
                                시작하기
                            </button>
                            <button
                                onClick={() => handleScrollToSection('contact')}
                                className="w-full rounded-full border-[1.5px] border-[#E5E5E5] px-6 py-3.5 text-[16px] font-medium text-[#6B6B6B]"
                                tabIndex={0}
                                aria-label="문의하기"
                            >
                                문의하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export { Header };
