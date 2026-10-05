'use client';

import { useState, useEffect, useRef, useSyncExternalStore, type FocusEvent, type MouseEvent } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { goToApp } from '@/lib/app-url';
import { isModifiedClick, prefersReducedMotion, scrollToSection } from '@/lib/scroll-to-section';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/cn';

// 데스크톱·모바일 메뉴가 같은 배열을 쓴다. 순서는 페이지의 섹션 순서와 같다('홈'은 로고가 맡는다).
const NAV_LINKS = [
    { label: '주요 기능', id: 'features' },
    { label: '사용법', id: 'how-it-works' },
    { label: '요금제', id: 'pricing' },
    { label: '자주 묻는 질문', id: 'faq' },
    { label: '문의하기', id: 'contact' },
] as const;

// 새로고침으로 페이지 중간에 들어와도 첫 렌더 직후 스크롤 상태가 맞도록 외부 상태로 읽는다.
const subscribeScroll = (onChange: () => void) => {
    window.addEventListener('scroll', onChange, { passive: true });
    return () => window.removeEventListener('scroll', onChange);
};
const getIsScrolled = () => window.scrollY > 20;
const getIsScrolledOnServer = () => false;

const Header = () => {
    const isScrolled = useSyncExternalStore(subscribeScroll, getIsScrolled, getIsScrolledOnServer);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const mobileMenuRef = useRef<HTMLElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const pathname = usePathname();
    const { session, loading, isConfigured, openLogin, signOut } = useAuth();
    // 로그인한 사람에게 '로그인/회원가입' 버튼은 잡음이다 — 그 자리를 스튜디오 진입으로 바꾼다.
    // 환경변수가 없으면(로그인 자체가 불가능) 버튼을 아예 내지 않는다: 눌러도 아무 일이
    // 없는 버튼보다 없는 편이 낫다.
    // 세션 확인이 끝나기 전에는 '로그인/회원가입' 을 그대로 둔다 — 방문자 대부분이 비로그인이고,
    // loading 동안 버튼을 숨기면 헤더에서 버튼 하나가 늦게 튀어나오는 게 보인다.
    const showLogin = isConfigured && !session;
    const showEnterApp = isConfigured && !loading && Boolean(session);
    // 섹션이 있는 곳은 랜딩 홈뿐이다. 다른 경로에서는 이전 값이 남아 있어도 표시하지 않는다.
    const currentId = pathname === '/' ? activeId : null;

    useEffect(() => {
        const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
            (section): section is HTMLElement => section !== null,
        );
        if (sections.length === 0) return;

        const intersecting = new Set<string>();
        // 화면 세로 가운데 1% 띠에 걸린 섹션을 지금 보고 있는 섹션으로 본다.
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) intersecting.add(entry.target.id);
                    else intersecting.delete(entry.target.id);
                });
                setActiveId(NAV_LINKS.find((link) => intersecting.has(link.id))?.id ?? null);
            },
            { rootMargin: '-50% 0px -49% 0px' },
        );
        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [pathname]);

    useEffect(() => {
        if (!mobileMenuOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            setMobileMenuOpen(false);
            menuButtonRef.current?.focus();
        };
        window.addEventListener('keydown', handleKeyDown);

        const animation = prefersReducedMotion()
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

    const closeMenuToTrigger = () => {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
    };

    const handleSectionClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
        if (isModifiedClick(event)) return;
        setMobileMenuOpen(false);
        scrollToSection(event, id);
    };

    // 포커스가 메뉴와 트리거 밖으로 나가면 닫는다. 포커스는 옮기지 않아 Tab 으로 나간 자리에 그대로 머문다.
    const handleMenuBlur = (event: FocusEvent<HTMLElement>) => {
        const next = event.relatedTarget as Node | null;
        if (next && !event.currentTarget.contains(next) && next !== menuButtonRef.current) {
            setMobileMenuOpen(false);
        }
    };

    const handleMenuButtonBlur = (event: FocusEvent<HTMLButtonElement>) => {
        if (!mobileMenuOpen) return;
        const next = event.relatedTarget as Node | null;
        if (next && !mobileMenuRef.current?.contains(next)) setMobileMenuOpen(false);
    };

    return (
        <header>
            <nav
                aria-label="주 메뉴"
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-[20px] backdrop-saturate-[1.8] transition-[background-color,border-color] duration-300',
                    isScrolled ? 'border-[rgba(34,42,53,0.08)] bg-white/95' : 'border-transparent bg-white/70',
                )}
            >
                {/* 1024 이상은 1fr/auto/1fr 그리드로 링크 묶음을 화면 중심에 고정한다(양옆 블록 폭과 무관). */}
                <div className="mx-auto flex h-[var(--site-nav-height)] max-w-[1248px] items-center justify-between gap-6 px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
                    {/* Logo */}
                    <Link
                        href="/#home"
                        onClick={(event) => handleSectionClick(event, 'home')}
                        className="flex min-h-11 shrink-0 items-center gap-2 justify-self-start rounded-md transition-opacity hover:opacity-80 lg:gap-2.5"
                        aria-label="Wearless 홈, 맨 위로 이동"
                    >
                        <Image
                            src="/logo.svg"
                            alt=""
                            width={32}
                            height={32}
                            className="h-7 w-7 object-contain lg:h-8 lg:w-8"
                        />
                        <Image
                            src="/wordmark.svg"
                            alt=""
                            width={94}
                            height={20}
                            className="h-auto w-[86px] object-contain lg:w-[98px]"
                        />
                    </Link>

                    {/* Desktop Navigation — 링크 px-2 + gap-4 로 글자 사이 32px, 히트 영역 44px */}
                    <ul className="hidden items-center gap-4 lg:flex">
                        {NAV_LINKS.map((link) => {
                            const isCurrent = currentId === link.id;
                            return (
                                <li key={link.id}>
                                    <Link
                                        href={`/#${link.id}`}
                                        onClick={(event) => handleSectionClick(event, link.id)}
                                        className={cn(
                                            'group relative inline-flex min-h-11 min-w-11 items-center justify-center whitespace-nowrap rounded-md px-2 text-[15px] font-medium leading-[1.5] transition-colors hover:text-[#1A1A1A]',
                                            isCurrent ? 'text-[#1A1A1A]' : 'text-[#4A4A4A]',
                                        )}
                                        aria-label={`${link.label} 섹션으로 이동`}
                                        aria-current={isCurrent ? 'location' : undefined}
                                    >
                                        {link.label}
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'absolute bottom-2 left-2 right-2 h-[2px] origin-left bg-[#1A1A1A] transition-transform group-hover:scale-x-100 group-focus-visible:scale-x-100',
                                                isCurrent ? 'scale-x-100' : 'scale-x-0',
                                            )}
                                        />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden items-center gap-3 justify-self-end lg:flex">
                        {showLogin && (
                            <Button variant="text" size="sm" onClick={openLogin} aria-label="로그인 또는 회원가입">
                                로그인/회원가입
                            </Button>
                        )}
                        {showEnterApp && (
                            <Button variant="text" size="sm" onClick={signOut}>
                                로그아웃
                            </Button>
                        )}
                        <Button variant="primary" size="sm" onClick={goToApp}>
                            시작하기
                        </Button>
                    </div>

                    {/* 1024 미만: 메뉴를 열지 않아도 시작 경로가 늘 보이도록 햄버거 앞에 compact CTA */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <Button variant="primary" size="compact" onClick={goToApp}>
                            시작하기
                        </Button>
                        <button
                            ref={menuButtonRef}
                            type="button"
                            onClick={() => setMobileMenuOpen((open) => !open)}
                            onBlur={handleMenuButtonBlur}
                            className="-mr-2.5 rounded-full p-2.5 text-[#1A1A1A]"
                            aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                            aria-expanded={mobileMenuOpen}
                            aria-controls={mobileMenuOpen ? 'mobile-menu' : undefined}
                        >
                            {mobileMenuOpen ? (
                                <X size={28} className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true" />
                            ) : (
                                <Menu size={28} className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Popup */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 touch-none bg-black/20 transition-opacity duration-150 starting:opacity-0 lg:hidden"
                        onClick={closeMenuToTrigger}
                        aria-hidden="true"
                    />
                    <nav
                        ref={mobileMenuRef}
                        id="mobile-menu"
                        aria-label="모바일 메뉴"
                        onBlur={handleMenuBlur}
                        className="fixed top-[calc(var(--site-nav-height)+8px)] right-6 z-40 max-h-[calc(100dvh-var(--site-nav-height)-24px)] w-[248px] max-w-[calc(100vw-48px)] origin-top-right overflow-y-auto overscroll-contain rounded-[16px] border border-[rgba(34,42,53,0.08)] bg-white p-2 shadow-[0_12px_32px_rgba(34,42,53,0.14)] lg:hidden"
                    >
                        <ul>
                            {NAV_LINKS.map((link) => {
                                const isCurrent = currentId === link.id;
                                return (
                                    <li key={link.id}>
                                        <Link
                                            href={`/#${link.id}`}
                                            onClick={(event) => handleSectionClick(event, link.id)}
                                            className={cn(
                                                'flex h-12 w-full items-center rounded-[8px] px-4 text-[16px] font-medium text-[#1A1A1A] transition-colors active:bg-[#F2F2F2]',
                                                isCurrent ? 'bg-[#F2F2F2]' : 'hover:bg-[#F5F5F5]',
                                            )}
                                            aria-label={`${link.label} 섹션으로 이동`}
                                            aria-current={isCurrent ? 'location' : undefined}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="mt-2 flex flex-col gap-2 border-t border-[rgba(34,42,53,0.08)] px-2 pt-3 pb-2">
                            <Button
                                variant="primary"
                                size="md"
                                className="w-full"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    goToApp();
                                }}
                            >
                                시작하기
                            </Button>
                            {showLogin && (
                                <Button
                                    variant="outline"
                                    size="md"
                                    className="w-full"
                                    onClick={() => {
                                        // 이 버튼은 메뉴와 함께 사라지므로, 모달이 닫힐 때 돌아올 자리로 트리거에 먼저 포커스를 둔다.
                                        closeMenuToTrigger();
                                        openLogin();
                                    }}
                                    aria-label="로그인 또는 회원가입"
                                >
                                    로그인/회원가입
                                </Button>
                            )}
                            {showEnterApp && (
                                <Button
                                    variant="outline"
                                    size="md"
                                    className="w-full"
                                    onClick={() => {
                                        closeMenuToTrigger();
                                        signOut();
                                    }}
                                >
                                    로그아웃
                                </Button>
                            )}
                        </div>
                    </nav>
                </>
            )}
        </header>
    );
};

export { Header };
