'use client';

import type { ReactNode } from 'react';
import { cn } from './cn';

type GradientTone = 'brand' | 'blue';

interface GradientBorderContainerProps {
    children: ReactNode;
    className?: string;
    innerClassName?: string;
    /** brand = 자홍·청록 브랜드 그라데이션(Contact 패널), blue = 채도를 낮춘 파랑(히어로 영상) */
    tone?: GradientTone;
    /** @deprecated hover 변화는 없앴다(패널이 1px 흔들리던 원인). 넘겨도 무시된다. */
    disableHover?: boolean;
}

// 움직이는 강조는 히어로 영상·Contact 패널·추천 요금제 링 3곳만 쓴다. 다른 카드에는 쓰지 않는다.
// 멈춘 상태(동작 줄이기)의 위치는 50% 50%: conic 중심이 요소 가운데에 와서 테두리가 한 바퀴 끊김 없이 이어진다.
// 0% 50%면 중심이 오른쪽 변 가운데에 놓여 그 자리에서 #FF0080 → #12ADE6 으로 뚝 끊긴다.
// 애니메이션(motion-safe)의 keyframes 값이 인라인 값보다 우선하므로 움직임은 그대로다.
// 시작색과 끝색을 같게 둬야 conic 이음매가 보이지 않는다.
const TONE_GRADIENTS: Record<GradientTone, string> = {
    brand: 'conic-gradient(from 180deg, #12ADE6, #4C63FC, #DC4CFC, #FF0080, #EE00FF, #12B4E6, #12ADE6)',
    // 남색·하늘·인디고가 한 바퀴 도는 파랑에서 채도를 45% 낮춰 형광 느낌을 뺀 더스티 블루(시안 C).
    blue: 'conic-gradient(from 180deg, #2E4985, #4762AE, #4297B6, #658CCC, #7480D4, #3F518E, #2E4985)',
};

const GradientBorderContainer = ({ children, className, innerClassName, tone = 'brand' }: GradientBorderContainerProps) => {
    return (
        <div
            className={cn(
                'rounded-[24px] p-[2px] motion-safe:animate-[gradientShift_8s_linear_infinite]',
                // 파란 테두리는 3px로 색 흐름이 보이게 하고, 같은 색의 옅은 그림자로 프레임에 깊이를 준다.
                tone === 'blue' && 'p-[3px] shadow-[0_24px_64px_-30px_rgba(71,98,174,0.30)]',
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
