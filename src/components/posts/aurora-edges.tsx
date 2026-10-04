'use client';

import { useRef, type CSSProperties } from 'react';
import { cn } from '@/components/ui/cn';
import { useScrollFade, type ScrollFade } from '@/components/posts/luminous-orb-background';

type Rgb = readonly [number, number, number];

interface Ribbon {
    color: Rgb;
    /** 화면 끝에서의 최대 불투명도 */
    alpha: number;
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

// 중앙 오브와 같은 계열의 색
const SKY: Rgb = [18, 173, 230]; // #12ADE6
const INDIGO: Rgb = [76, 99, 252]; // #4C63FC
const ORCHID: Rgb = [220, 76, 252]; // #DC4CFC
const LAVENDER: Rgb = [187, 166, 255]; // #BBA6FF

// 왼쪽은 차가운 톤(라벤더→하늘→남색), 오른쪽은 따뜻한 톤(자홍→하늘→라벤더)으로 높이·기울기를 어긋나게 둔다.
// 알파는 가장 짙어지는 순간(화면 끝, 모든 리본이 겹친 최대치)에도 #5C5C5C 글자 대비가 5.3:1 이상 남는 값이다.
// 맨 위 리본(왼쪽 18%, 오른쪽 26%)은 헤더 밑 마스크(HEADER_MASK) 구간에 덜 걸리도록 조금 내려 둔다.
const LEFT_RIBBONS: Ribbon[] = [
    { color: LAVENDER, alpha: 0.28, y: 18, length: 50, reach: 0.9, offset: -0.08, tilt: 9, flow: 52, breathe: 19, delay: -14 },
    { color: SKY, alpha: 0.24, y: 45, length: 64, reach: 1, offset: 0, tilt: -6, flow: 44, breathe: 23, delay: -31 },
    { color: INDIGO, alpha: 0.15, y: 76, length: 46, reach: 0.85, offset: -0.12, tilt: 11, flow: 58, breathe: 17, delay: -7 },
];

const RIGHT_RIBBONS: Ribbon[] = [
    { color: ORCHID, alpha: 0.16, y: 26, length: 44, reach: 0.85, offset: -0.06, tilt: -10, flow: 47, breathe: 21, delay: -22 },
    { color: SKY, alpha: 0.22, y: 57, length: 60, reach: 1, offset: 0, tilt: 7, flow: 55, breathe: 26, delay: -40 },
    { color: LAVENDER, alpha: 0.28, y: 86, length: 48, reach: 0.9, offset: -0.06, tilt: -8, flow: 41, breathe: 16, delay: -3 },
];

// 가우시안에 가까운 감쇠. filter blur 없이 그라데이션 끝만으로 번지게 한다.
const FALLOFF = [
    [0, 1],
    [32, 0.62],
    [60, 0.24],
    [82, 0.06],
    [100, 0],
] as const;

const round = (value: number) => Number(value.toFixed(3));

const ribbonStyle = ({ color, alpha, y, length, reach, offset, tilt, flow, breathe, delay }: Ribbon) => {
    const [r, g, b] = color;
    const stops = FALLOFF.map(([at, k]) => `rgba(${r}, ${g}, ${b}, ${round(alpha * k)}) ${at}%`).join(', ');

    return {
        top: `${y}%`,
        height: `${length}vh`,
        // 타원의 중심을 화면 끝에 두고 안쪽 절반만 보이게 한다. 흔들려도 끝에 빈틈이 생기지 않는다.
        width: `calc(var(--aurora-reach) * ${round(reach * 2)})`,
        left: `calc(var(--aurora-reach) * ${round(offset - reach)})`,
        rotate: `${tilt}deg`,
        background: `radial-gradient(closest-side, ${stops})`,
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
// 헤더 배경 투명도를 바꾸면 HEADER_PASS 도 (1 - 배경 알파) 근처로 맞춘다. 스크롤 뒤(bg-white/95, 보이는 하단선)에는
// 위가 5%라 작은 차이가 남지만 하단선이 그 경계를 이룬다.
const HEADER_PASS = 0.2;
const HEADER_RAMP = '10vh';
const SMOOTHSTEP = [0, 0.156, 0.5, 0.844, 1] as const;
const NAV_BOTTOM = 'var(--site-nav-height) + 1px';
const HEADER_MASK = `linear-gradient(to bottom, #000 calc(${NAV_BOTTOM}), ${SMOOTHSTEP.map(
    (k, i) =>
        `rgba(0, 0, 0, ${round(HEADER_PASS + (1 - HEADER_PASS) * k)}) calc(${NAV_BOTTOM} + ${HEADER_RAMP} * ${i / (SMOOTHSTEP.length - 1)})`
).join(', ')})`;

/**
 * 화면 좌우 끝에 붙은 세로 오로라 리본. 중앙 오브의 보조 광원이다.
 * 768 미만은 숨기고, 1440 기준 좌우 여백(120px) 안에서 거의 사라진다(약 9vw에서 2% 미만).
 */
const AuroraEdges = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    useScrollFade(rootRef, AURORA_FADE);

    return (
        <div
            ref={rootRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden [--aurora-reach:clamp(80px,11vw,232px)] md:block"
            style={{ opacity: AURORA_FADE.heroFloor, maskImage: HEADER_MASK, WebkitMaskImage: HEADER_MASK }}
        >
            <AuroraSide ribbons={LEFT_RIBBONS} />
            <AuroraSide ribbons={RIGHT_RIBBONS} mirrored />
        </div>
    );
};

export { AuroraEdges };
