'use client';

import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';

interface ScrollFade {
    /** 페이지 맨 위(히어로)에서의 불투명도. */
    heroFloor: number;
    /** 히어로를 지난 뒤 두 화면 기울기로 줄어들어 머무는 최저 불투명도. */
    tailFloor: number;
    /** 한 화면 뒤 최고 세기. 오로라는 기본값 1을 쓴다. */
    peakProperty?: string;
}

export const getScrollFadeOpacity = (scrollY: number, viewportHeight: number, { heroFloor, tailFloor }: ScrollFade, peak = 1) => {
    const y = Math.max(0, scrollY);
    const h = Math.max(1, viewportHeight);
    if (y < h) return heroFloor + (y / h) * (peak - heroFloor);
    return Math.max(tailFloor, peak - (y - h) / (2 * h));
};

// 스크롤마다 리렌더하지 않도록 프레임당 한 번 DOM의 opacity만 직접 바꾼다. 사이드 오로라도 같은 곡선을 쓴다.
const useScrollFade = (ref: RefObject<HTMLElement | null>, { heroFloor, tailFloor, peakProperty }: ScrollFade) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const configuredPeak = peakProperty
            ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue(peakProperty))
            : 1;
        const peak = Number.isFinite(configuredPeak) ? configuredPeak : 1;
        let frame = 0;
        const apply = () => {
            frame = 0;
            if (document.documentElement.getAttribute('data-handoff') === 'leaving') return;
            const y = Math.max(0, window.scrollY);
            const h = Math.max(1, window.innerHeight);
            el.style.opacity = String(getScrollFadeOpacity(y, h, { heroFloor, tailFloor }, peak));
            // 분할 히어로의 자리(globals.css .orb-hero-shift)가 읽는다.
            el.style.setProperty('--hero-progress', String(Math.min(y / h, 1)));
        };
        const schedule = () => {
            if (frame === 0) frame = requestAnimationFrame(apply);
        };

        apply();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        window.addEventListener('wl-handoff-reset', apply);
        return () => {
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            window.removeEventListener('wl-handoff-reset', apply);
            cancelAnimationFrame(frame);
        };
    }, [ref, heroFloor, tailFloor, peakProperty]);
};

const useWallClockPhase = (ref: RefObject<HTMLElement | null>) => {
    useLayoutEffect(() => {
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const desktop = window.matchMedia('(min-width: 768px)');
        let frame = 0;
        const syncPhase = () => {
            if (motion.matches) return;
            const origin = performance.timeOrigin || (Date.now() - performance.now());
            const elapsed = Date.now() - origin;
            ref.current?.querySelectorAll<HTMLElement>('.wl-orb > i, .aurora-ribbon').forEach((layer) => {
                // 애니메이션 API를 지원하지 않아도 배경과 이동은 계속 동작한다.
                try {
                    layer.getAnimations?.().forEach((animation) => { animation.currentTime = elapsed; });
                } catch { /* CSS의 벽시계 delay를 그대로 쓴다. */ }
            });
        };
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) syncPhase();
        };
        const handlePhaseChange = () => {
            cancelAnimationFrame(frame);
            // display:none 해제·동작 재개로 새 CSS 애니메이션이 생긴 다음 보정한다.
            frame = requestAnimationFrame(syncPhase);
        };
        syncPhase();
        window.addEventListener('pageshow', handlePageShow);
        desktop.addEventListener('change', handlePhaseChange);
        motion.addEventListener('change', handlePhaseChange);
        return () => {
            window.removeEventListener('pageshow', handlePageShow);
            desktop.removeEventListener('change', handlePhaseChange);
            motion.removeEventListener('change', handlePhaseChange);
            cancelAnimationFrame(frame);
        };
    }, [ref]);
};

const ORB_FADE: ScrollFade = { heroFloor: 0.4, tailFloor: 0.7, peakProperty: '--wl-landing-orb-peak' };

const LuminousOrbBackground = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    useScrollFade(rootRef, ORB_FADE);
    useWallClockPhase(rootRef);

    return (
        <div
            ref={rootRef}
            data-orb-root
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
            // 하이드레이션 전에도 첫 화면 세기로 그린다.
            style={{ opacity: ORB_FADE.heroFloor }}
        >
            {/* 1180px 이상 분할 히어로에서는 첫 화면 동안 왼쪽 제목 뒤에 머문다. */}
            <div className="orb-hero-shift absolute inset-0 flex items-center justify-center">
                <div className="wl-orb">
                    <i className="wl-orb__l1" />
                    <i className="wl-orb__l2" />
                    <i className="wl-orb__l3" />
                    <i className="wl-orb__hi" />
                </div>
            </div>
        </div>
    );
};

export { LuminousOrbBackground, useScrollFade, useWallClockPhase };
export type { ScrollFade };
