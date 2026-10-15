'use client';

import { useRef, type CSSProperties } from 'react';
import { cn } from '@/components/ui/cn';
import { useScrollFade, useWallClockPhase, type ScrollFade } from '@/components/posts/luminous-orb-background';

interface Ribbon {
    color: string;
    /** 화면 끝에서의 최대 불투명도 */
    core: string;
    edge: string;
    /** 리본 중심의 세로 위치(화면 높이 %) */
    y: number;
    /** 리본 길이(vh) */
    length: number;
    /** 안쪽으로 번지는 거리(--aurora-reach 배수) */
    reach: number;
    /** 리본 중심의 가로 위치(--aurora-reach 배수, 음수면 화면 밖) */
    offset: number;
    /** 기울기(deg) */
    tilt: number;
    /** 위아래 흐름 주기(s) */
    flow: number;
    /** 밝기 숨쉬기 주기(s) */
    breathe: number;
    /** 시작 위상(s, 음수) — 리본끼리 같은 박자로 움직이지 않게 */
    delay: number;
}

// 색과 두 단 알파는 승인 시안 orb-c.css, 자리·흐름·숨은 기존 값을 유지한다.
// 맨 위 리본은 헤더 밑 마스크 구간에 덜 걸리도록 내려 둔다.
const LEFT_RIBBONS: Ribbon[] = [
    { color: '--wl-lav-rgb', core: '--wl-rb-l1-core', edge: '--wl-rb-l1-edge', y: 18, length: 50, reach: 0.9, offset: -0.08, tilt: 9, flow: 52, breathe: 19, delay: -14 },
    { color: '--wl-sky-rgb', core: '--wl-rb-l2-core', edge: '--wl-rb-l2-edge', y: 45, length: 64, reach: 1, offset: 0, tilt: -6, flow: 44, breathe: 23, delay: -31 },
    { color: '--wl-peach-rgb', core: '--wl-rb-l3-core', edge: '--wl-rb-l3-edge', y: 76, length: 46, reach: 0.85, offset: -0.12, tilt: 11, flow: 58, breathe: 17, delay: -7 },
];

const RIGHT_RIBBONS: Ribbon[] = [
    { color: '--wl-lav-rgb', core: '--wl-rb-r1-core', edge: '--wl-rb-r1-edge', y: 26, length: 44, reach: 0.85, offset: -0.06, tilt: -10, flow: 47, breathe: 21, delay: -22 },
    { color: '--wl-sky-rgb', core: '--wl-rb-r2-core', edge: '--wl-rb-r2-edge', y: 57, length: 60, reach: 1, offset: 0, tilt: 7, flow: 55, breathe: 26, delay: -40 },
    { color: '--wl-mint-rgb', core: '--wl-rb-r3-core', edge: '--wl-rb-r3-edge', y: 86, length: 48, reach: 0.9, offset: -0.06, tilt: -8, flow: 41, breathe: 16, delay: -3 },
];

const round = (value: number) => Number(value.toFixed(3));

const ribbonStyle = ({ color, core, edge, y, length, reach, offset, tilt, flow, breathe, delay }: Ribbon) => {
    return {
        top: `${y}%`,
        height: `${length}vh`,
        // 타원의 중심을 화면 끝에 두고 안쪽 절반만 보이게 한다. 흔들려도 끝에 빈틈이 생기지 않는다.
        width: `calc(var(--aurora-reach) * ${round(reach * 2)})`,
        left: `calc(var(--aurora-reach) * ${round(offset - reach)})`,
        rotate: `${tilt}deg`,
        background: `radial-gradient(closest-side, rgb(var(${color}) / var(${core})) 0%, rgb(var(${color}) / var(${edge})) 45%, transparent 100%)`,
        '--aurora-flow': `${flow}s`,
        '--aurora-breathe': `${breathe}s`,
        '--aurora-delay': `${delay}s`,
    } as CSSProperties;
};

const AuroraSide = ({ ribbons, mirrored = false }: { ribbons: Ribbon[]; mirrored?: boolean }) => (
    // 폭 0인 기준선. 오른쪽은 좌우 반전해 같은 좌표(음수 offset = 화면 밖)를 그대로 쓴다.
    // 콘텐츠 옆 여백이 좁은 xl 미만에서는 조금 더 옅게 둔다.
    <div className={cn('absolute inset-y-0 w-0 opacity-80 xl:opacity-100', mirrored ? 'right-0 [scale:-1_1]' : 'left-0')}>
        {ribbons.map((ribbon) => (
            <div key={`${ribbon.y}-${ribbon.tilt}`} className="aurora-ribbon" style={ribbonStyle(ribbon)} />
        ))}
    </div>
);

// 중앙 오브와 같은 방향으로 움직인다(히어로에서 옅게 → 한 화면 뒤 최대). 화면 끝이라 본문과 덜 겹쳐 덜 줄인다.
const AURORA_FADE: ScrollFade = { heroFloor: 0.6, tailFloor: 0.85 };

// 헤더 밑 이음매. 스크롤 전 헤더(bg-white/70 + backdrop blur·saturate)는 뒤의 오로라를 약 20%만 비춘다(1440 실측 0.21).
// 오로라가 헤더 뒤까지 그대로 이어지게 두고, 헤더 하단선(--site-nav-height + 테두리 1px) 바로 아래만 같은 20%에서
// 시작해 10vh 동안 smoothstep 으로 100%까지 올린다. 선 위아래 밝기가 같아 가로 단차가 생기지 않는다.
// 헤더 배경 투명도를 바꾸면 --wl-mask-pass 도 (1 - 배경 알파) 근처로 맞춘다. 스크롤 뒤(bg-white/95, 보이는 하단선)에는
// 위가 5%라 작은 차이가 남지만 하단선이 그 경계를 이룬다.
const HEADER_RAMP = 'var(--wl-mask-ramp)';
const SMOOTHSTEP = [0, 0.156, 0.5, 0.844, 1] as const;
const NAV_BOTTOM = 'var(--site-nav-height) + 1px';
const HEADER_MASK = `linear-gradient(to bottom, #000 calc(${NAV_BOTTOM}), ${SMOOTHSTEP.map(
    (k, i) =>
        `rgba(0, 0, 0, calc(var(--wl-mask-pass) + (1 - var(--wl-mask-pass)) * ${k})) calc(${NAV_BOTTOM} + ${HEADER_RAMP} * ${i / (SMOOTHSTEP.length - 1)})`
).join(', ')})`;

/**
 * 화면 좌우 끝에 붙은 세로 오로라 리본. 중앙 오브의 보조 광원이다.
 * 768 미만은 숨기고, 안쪽으로 부드럽게 사라지게 해 본문을 가리지 않는다.
 */
const AuroraEdges = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    useScrollFade(rootRef, AURORA_FADE);
    useWallClockPhase(rootRef);

    return (
        <div
            ref={rootRef}
            data-aurora-root
            aria-hidden="true"
            className="wl-aurora pointer-events-none fixed inset-0 z-0 hidden overflow-hidden [--aurora-reach:var(--wl-aurora-reach)] md:block"
            style={{ opacity: AURORA_FADE.heroFloor, maskImage: HEADER_MASK, WebkitMaskImage: HEADER_MASK }}
        >
            <AuroraSide ribbons={LEFT_RIBBONS} />
            <AuroraSide ribbons={RIGHT_RIBBONS} mirrored />
        </div>
    );
};

export { AuroraEdges };
