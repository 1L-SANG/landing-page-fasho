'use client';

import { useState, useEffect, useRef, type MouseEvent } from 'react';
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

const MOBILE_NAV_LINKS = [
    NAV_LINKS[1],
    { label: '사용법', id: 'how-it-works' },
    NAV_LINKS[2],
    NAV_LINKS[3],
    { label: '자주 묻는 질문', id: 'faq' },
] as const;

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
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

    useEffect(() => {
        if (!mobileMenuOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMobileMenuOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);

        const animation = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? undefined
            : mobileMenuRef.current?.animate(
                [
                    { opacity: 0, transform: 'scale(0.96)' },
                    { opacity: 1, transform: 'scale(1)' },
                ],
                { duration: 150, easing: 'ease-out' },
            );

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            animation?.cancel();
        };
    }, [mobileMenuOpen]);

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
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 max-md:bg-white' : 'bg-white/70'
                    }`}
                style={{
                    backdropFilter: 'blur(20px) saturate(1.8)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                }}
            >
                <div className="mx-auto flex h-[var(--site-nav-height)] max-w-[1280px] items-center justify-between gap-6 px-8 max-lg:px-5 max-md:px-6">
                    {/* Logo */}
                    <Link
                        href="/#home"
                        onClick={(event) => handleSectionClick(event, 'home')}
                        className="flex min-h-11 shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80 max-md:gap-2"
                        aria-label="Wearless 홈, 맨 위로 이동"
                        tabIndex={0}
                    >
                        <Image
                            src="/logo.svg"
                            alt=""
                            width={31}
                            height={31}
                            className="h-[31px] w-[31px] object-contain max-lg:h-[30px] max-lg:w-[30px] max-md:h-[28px] max-md:w-[28px]"
                        />
                        <Image
                            src="/wordmark.svg"
                            alt=""
                            width={94}
                            height={20}
                            className="h-auto w-[94px] object-contain max-lg:w-[90px] max-md:w-[86px]"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden shrink-0 items-center gap-8 lg:flex">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.id}
                                href={`/#${link.id}`}
                                onClick={(event) => handleSectionClick(event, link.id)}
                                className="group relative whitespace-nowrap text-[17px] font-medium text-[#6B6B6B] transition-colors hover:text-[#1A1A1A]"
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
                                className="rounded-full border-[1.5px] border-[#1A1A1A] bg-white px-5 py-2 text-[15.5px] leading-[1.35] font-semibold text-[#1A1A1A] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                tabIndex={0}
                                aria-label="로그인 또는 회원가입"
                            >
                                로그인/회원가입
                            </button>
                        )}
                        {showEnterApp && (
                            <button
                                onClick={signOut}
                                className="rounded-full border-[1.5px] border-[#1A1A1A] bg-white px-5 py-2 text-[15.5px] leading-[1.35] font-semibold text-[#1A1A1A] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                tabIndex={0}
                                aria-label="로그아웃"
                            >
                                로그아웃
                            </button>
                        )}
                        <button
                            onClick={goToApp}
                            className="rounded-full bg-[#1A1A1A] px-5 py-2 text-[15.5px] leading-[1.35] font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#333333]"
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
                        aria-controls="mobile-menu"
                        tabIndex={0}
                    >
                        {mobileMenuOpen ? <X size={28} className="h-6 w-6 md:h-7 md:w-7" /> : <Menu size={28} className="h-6 w-6 md:h-7 md:w-7" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Popup */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-hidden="true"
                    />
                    <div
                        ref={mobileMenuRef}
                        id="mobile-menu"
                        className="fixed top-[calc(var(--site-nav-height)+8px)] right-6 z-40 max-h-[calc(100dvh-var(--site-nav-height)-24px)] w-[248px] max-w-[calc(100vw-32px)] origin-top-right overflow-y-auto rounded-2xl border border-black/[0.06] bg-white p-2 shadow-[0_12px_40px_rgba(0,0,0,0.14)] md:right-5 lg:hidden"
                    >
                        {MOBILE_NAV_LINKS.map((link) => (
                            <Link
                                key={link.id}
                                href={`/#${link.id}`}
                                onClick={(event) => handleSectionClick(event, link.id)}
                                className="flex h-12 w-full items-center rounded-xl px-4 text-[16px] font-medium text-[#1A1A1A] active:bg-[#F2F2F2] hover:bg-[#F7F7F7]"
                                tabIndex={0}
                                aria-label={`${link.label} 섹션으로 이동`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-2 flex flex-col gap-2 border-t border-black/[0.06] px-2 pt-3 pb-2">
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    goToApp();
                                }}
                                className="h-11 w-full rounded-full bg-[#1A1A1A] px-6 text-[15px] font-semibold text-white shadow-lg"
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
                                    className="h-11 w-full rounded-full border-[1.5px] border-[#1A1A1A] bg-white px-6 text-[15px] font-semibold text-[#1A1A1A] shadow-sm"
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
                                    className="h-11 w-full rounded-full border-[1.5px] border-[#1A1A1A] bg-white px-6 text-[15px] font-semibold text-[#1A1A1A] shadow-sm"
                                    tabIndex={0}
                                    aria-label="로그아웃"
                                >
                                    로그아웃
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export { Header };
