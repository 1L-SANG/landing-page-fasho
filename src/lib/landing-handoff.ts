import type { KeyboardEvent, MouseEvent } from 'react';

let busy = false;
let navigationTimer: number | undefined;
let resetFrame: number | undefined;
let pressed: HTMLElement | undefined;

const resetHandoff = () => {
    window.clearTimeout(navigationTimer);
    window.cancelAnimationFrame(resetFrame ?? 0);
    navigationTimer = undefined;
    resetFrame = undefined;
    busy = false;
    const root = document.documentElement;
    root.setAttribute('data-handoff', 'resetting');
    pressed?.removeAttribute('data-handoff-pressed');
    pressed = undefined;
    window.dispatchEvent(new Event('wl-handoff-reset'));
    // bfcache 복귀 때 퇴장 규칙을 뺀 자세를 확정해 역방향 전환을 막는다.
    void document.body.offsetHeight;
    root.removeAttribute('data-handoff');
};

export const startAppHandoff = (href: string, cta?: HTMLElement) => {
    if (busy || cta?.matches(':disabled')) return;
    busy = true;
    window.cancelAnimationFrame(resetFrame ?? 0);
    const navigate = () => {
        window.clearTimeout(navigationTimer);
        navigationTimer = undefined;
        try {
            window.location.assign(href);
        } catch {
            resetHandoff();
        }
    };

    try {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !document.querySelector('[data-orb-root]')) {
            navigate();
            return;
        }
        // 시각 효과 설정 전에 예약한다. 연출이 실패해도 이동은 반드시 실행한다.
        navigationTimer = window.setTimeout(navigate, 420);
        pressed = cta;
        pressed?.setAttribute('data-handoff-pressed', '');
        document.documentElement.setAttribute('data-handoff', 'leaving');
    } catch {
        navigate();
    }
};

type ActivationEvent = Pick<MouseEvent, 'defaultPrevented' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey'>;

const isModified = (event: ActivationEvent) =>
    event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

const isNativeLinkAction = (event: MouseEvent<HTMLAnchorElement> | KeyboardEvent<HTMLAnchorElement>) => {
    const link = event.currentTarget;
    return isModified(event) || (link.target !== '' && link.target.toLowerCase() !== '_self') || link.hasAttribute('download');
};

export const handleAppLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || isNativeLinkAction(event)) return;
    event.preventDefault();
    startAppHandoff(event.currentTarget.href, event.currentTarget);
};

export const handleAppLinkKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    // 버튼 Enter/Space와 링크 Enter는 브라우저의 click을 그대로 쓴다.
    if (event.key !== ' ' || isNativeLinkAction(event)) return;
    event.preventDefault();
    if (!event.repeat) event.currentTarget.click();
};

export const installHandoffLifecycle = () => {
    const handlePageHide = () => {
        window.clearTimeout(navigationTimer);
        window.cancelAnimationFrame(resetFrame ?? 0);
    };
    const handlePageShow = (event: PageTransitionEvent) => {
        if (!event.persisted) return;
        resetHandoff();
        // 브라우저의 스크롤 복원이 pageshow보다 늦는 경우에도 세기를 복원한다.
        resetFrame = window.requestAnimationFrame(() => {
            resetFrame = undefined;
            if (!busy) window.dispatchEvent(new Event('wl-handoff-reset'));
        });
    };
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);
    return () => {
        window.removeEventListener('pagehide', handlePageHide);
        window.removeEventListener('pageshow', handlePageShow);
        resetHandoff();
    };
};
