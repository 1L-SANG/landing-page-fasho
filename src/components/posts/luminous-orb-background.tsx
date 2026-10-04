'use client';

import { useEffect, useRef, type RefObject } from 'react';

interface ScrollFade {
    /** 페이지 맨 위(히어로)에서의 불투명도. 한 화면 스크롤하면 1이 된다. */
    heroFloor: number;
    /** 히어로를 지난 뒤 두 화면 기울기로 줄어들어 머무는 최저 불투명도. */
    tailFloor: number;
}

const getScrollFadeOpacity = (scrollY: number, viewportHeight: number, { heroFloor, tailFloor }: ScrollFade) => {
    if (scrollY < viewportHeight) {
        return heroFloor + (scrollY / viewportHeight) * (1 - heroFloor);
    }
    return 1 - Math.min((scrollY - viewportHeight) / (viewportHeight * 2), 1 - tailFloor);
};

// 스크롤마다 리렌더하지 않도록 프레임당 한 번 DOM의 opacity만 직접 바꾼다. 사이드 오로라도 같은 곡선을 쓴다.
const useScrollFade = (ref: RefObject<HTMLElement | null>, { heroFloor, tailFloor }: ScrollFade) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let frame = 0;
        const apply = () => {
            frame = 0;
            el.style.opacity = String(
                getScrollFadeOpacity(window.scrollY, window.innerHeight, { heroFloor, tailFloor })
            );
        };
        const schedule = () => {
            if (frame === 0) frame = requestAnimationFrame(apply);
        };

        apply();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        return () => {
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            cancelAnimationFrame(frame);
        };
    }, [ref, heroFloor, tailFloor]);
};

const ORB_FADE: ScrollFade = { heroFloor: 0.32, tailFloor: 0.7 };

const LuminousOrbBackground = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    useScrollFade(rootRef, ORB_FADE);

    return (
        <div
            ref={rootRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
            // 첫 화면(히어로) 값으로 시작해 하이드레이션 전에 밝은 오브가 번쩍이지 않게 한다.
            style={{ opacity: ORB_FADE.heroFloor }}
        >
            {/* Layer 1 - Blue/Purple */}
            <div
                className="absolute h-[300px] w-[300px] rounded-full motion-safe:animate-[spin_10.8s_linear_infinite] md:h-[600px] md:w-[600px]"
                style={{
                    background: 'conic-gradient(#12ADE6, #4C63FC, #12ADE6)',
                    filter: 'blur(60px)',
                    opacity: 0.4,
                }}
            />

            {/* Layer 2 - Multi-color */}
            <div
                className="absolute h-[250px] w-[250px] rounded-full motion-safe:animate-[spin_16.2s_linear_infinite_reverse] md:h-[500px] md:w-[500px]"
                style={{
                    background:
                        'conic-gradient(#FF0080, #EE00FF, #00A6FF, #4797FF, #FF8000, #FF00CC, #FF0080)',
                    filter: 'blur(50px)',
                    opacity: 0.35,
                }}
            />

            {/* Layer 3 - Magenta/Cyan/White */}
            <div
                className="absolute h-[200px] w-[200px] rounded-full motion-safe:animate-[spin_13.5s_linear_infinite] md:h-[400px] md:w-[400px]"
                style={{
                    background: 'conic-gradient(#DC4CFC, #12B4E6, #FFFFFF, #DC4CFC)',
                    filter: 'blur(45px)',
                    opacity: 0.45,
                }}
            />

            {/* Center Highlight */}
            <div
                className="absolute h-[100px] w-[100px] rounded-full md:h-[200px] md:w-[200px]"
                style={{
                    background: 'radial-gradient(white 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
            />
        </div>
    );
};

export { LuminousOrbBackground, useScrollFade };
export type { ScrollFade };
