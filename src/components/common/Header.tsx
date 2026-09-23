'use client';

import { useState, useEffect, type MouseEvent } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { goToApp } from '@/lib/app-url';
import { useAuth } from '@/components/auth/auth-provider';

const NAV_LINKS = [
    { label: '홈', id: 'home' },
    { label: '주요 기능', id: 'features' },
    { label: '요금제', id: 'pricing' },
    { label: '문의하기', id: 'contact' },
] as const;

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { session, loading, isConfigured, openLogin, signOut } = useAuth();
    // 로그인한 사람에게 '로그인/회원가입' 버튼은 잡음이다 — 그 자리를 스튜디오 진입으로 바꾼다.
    // 환경변수가 없으면(로그인 자체가 불가능) 버튼을 아예 내지 않는다: 눌러도 아무 일이
    // 없는 버튼보다 없는 편이 낫다.
    // 세션 확인이 끝나기 전에는 '로그인/회원가입' 을 그대로 둔다 — 방문자 대부분이 비로그인이고,
    // loading 동안 버튼을 숨기면 헤더에서 버튼 하나가 늦게 튀어나오는 게 보인다.
    const showLogin = isConfigured && !session;
    const showEnterApp = isConfigured && !loading && Boolean(session);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSectionClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (window.location.pathname === '/' && element) {
            event.preventDefault();
            element.scrollIntoView({ behavior: 'smooth' });
        }
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
                <div className="mx-auto flex h-[var(--site-nav-height)] max-w-[1280px] items-center justify-between gap-6 px-8 max-lg:px-5">
                    {/* Logo */}
                    <Link
                        href="/#home"
                        onClick={(event) => handleSectionClick(event, 'home')}
                        className="flex shrink-0 items-center gap-3.5 transition-opacity hover:opacity-80 max-lg:gap-2.5"
                        aria-label="Wearless 홈, 맨 위로 이동"
                        tabIndex={0}
                    >
                        <Image
                            src="/logo.svg"
                            alt=""
                            width={60}
                            height={60}
                            className="h-[60px] w-[60px] object-contain max-lg:h-[42px] max-lg:w-[42px]"
                        />
                        <Image
                            src="/wordmark.svg"
                            alt=""
                            width={206}
                            height={43}
                            className="h-auto w-[206px] object-contain max-lg:w-[146px]"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden shrink-0 items-center gap-8 lg:flex">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.id}
                                href={`/#${link.id}`}
                                onClick={(event) => handleSectionClick(event, link.id)}
                                className="group relative whitespace-nowrap text-[18px] font-medium text-[#6B6B6B] transition-colors hover:text-[#1A1A1A]"
                                tabIndex={0}
                                aria-label={`${link.label} 섹션으로 이동`}
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#1A1A1A] transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden shrink-0 items-center gap-3 lg:flex">
                        {showLogin && (
                            <button
                                onClick={openLogin}
                                className="rounded-full border-[1.5px] border-[#1A1A1A] bg-white px-6 py-3 text-[16px] font-semibold text-[#1A1A1A] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                tabIndex={0}
                                aria-label="로그인 또는 회원가입"
                            >
                                로그인/회원가입
                            </button>
                        )}
                        {showEnterApp && (
                            <button
                                onClick={signOut}
                                className="rounded-full border-[1.5px] border-[#1A1A1A] bg-white px-6 py-3 text-[16px] font-semibold text-[#1A1A1A] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                tabIndex={0}
                                aria-label="로그아웃"
                            >
                                로그아웃
                            </button>
                        )}
                        <button
                            onClick={goToApp}
                            className="rounded-full bg-[#1A1A1A] px-6 py-3 text-[16px] font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#333333]"
                            tabIndex={0}
                            aria-label="시작하기"
                        >
                            시작하기
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2.5 text-[#1A1A1A] lg:hidden"
                        aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                        aria-expanded={mobileMenuOpen}
                        tabIndex={0}
                    >
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-[#FAFAFA] lg:hidden animate-fade-in">
                    <div className="flex h-full flex-col items-center justify-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.id}
                                href={`/#${link.id}`}
                                onClick={(event) => handleSectionClick(event, link.id)}
                                className="text-[24px] font-semibold text-[#1A1A1A]"
                                tabIndex={0}
                                aria-label={`${link.label} 섹션으로 이동`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-8 flex w-full max-w-xs flex-col gap-4 px-6">
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    goToApp();
                                }}
                                className="w-full rounded-full bg-[#1A1A1A] px-6 py-3.5 text-[16px] font-semibold text-white shadow-lg"
                                tabIndex={0}
                                aria-label="시작하기"
                            >
                                시작하기
                            </button>
                            {showLogin && (
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        openLogin();
                                    }}
                                    className="w-full rounded-full border-[1.5px] border-[#1A1A1A] bg-white px-6 py-3.5 text-[16px] font-semibold text-[#1A1A1A] shadow-sm"
                                    tabIndex={0}
                                    aria-label="로그인 또는 회원가입"
                                >
                                    로그인/회원가입
                                </button>
                            )}
                            {showEnterApp && (
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        signOut();
                                    }}
                                    className="w-full rounded-full border-[1.5px] border-[#1A1A1A] bg-white px-6 py-3.5 text-[16px] font-semibold text-[#1A1A1A] shadow-sm"
                                    tabIndex={0}
                                    aria-label="로그아웃"
                                >
                                    로그아웃
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export { Header };
