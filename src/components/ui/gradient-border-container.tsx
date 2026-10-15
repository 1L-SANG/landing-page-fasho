'use client';

import type { ReactNode } from 'react';
import { cn } from './cn';

type GradientTone = 'brand' | 'blue';

interface GradientBorderContainerProps {
    children: ReactNode;
    className?: string;
    innerClassName?: string;
    /** brand = Contact 패널, blue = 히어로 영상. 두 톤 모두 팔레트 C를 쓴다. */
    tone?: GradientTone;
    /** @deprecated hover 변화는 없앴다(패널이 1px 흔들리던 원인). 넘겨도 무시된다. */
    disableHover?: boolean;
}

// 움직이는 강조는 히어로 영상·Contact 패널·추천 요금제 링 3곳만 쓴다. 다른 카드에는 쓰지 않는다.
// 멈춘 상태(동작 줄이기)의 위치는 50% 50%: conic 중심이 요소 가운데에 와서 테두리가 한 바퀴 끊김 없이 이어진다.
// 시작색과 끝색을 같게 둬야 conic 이음매가 보이지 않는다.
const PALETTE_C = 'conic-gradient(from 180deg, var(--wl-sky), var(--wl-lav), var(--wl-peach), var(--wl-mint), var(--wl-peri), var(--wl-sky))';
const TONE_GRADIENTS: Record<GradientTone, string> = { brand: PALETTE_C, blue: PALETTE_C };

const GradientBorderContainer = ({ children, className, innerClassName, tone = 'brand' }: GradientBorderContainerProps) => {
    return (
        <div
            className={cn(
                'rounded-[24px] p-[2px] motion-safe:animate-[gradientShift_8s_linear_infinite]',
                // 영상 프레임은 3px를 유지하고, C 하늘색의 낮은 알파로 깊이를 준다.
                tone === 'blue' && 'p-[3px] shadow-[0_24px_64px_-30px_rgba(143,198,246,0.24)]',
                className
            )}
            style={{
                background: TONE_GRADIENTS[tone],
                backgroundSize: '200% 200%',
                backgroundPosition: '50% 50%',
            }}
        >
            <div className={cn('overflow-hidden', tone === 'blue' ? 'rounded-[21px]' : 'rounded-[22px]', innerClassName)}>{children}</div>
        </div>
    );
};

export { GradientBorderContainer };
export type { GradientBorderContainerProps, GradientTone };
