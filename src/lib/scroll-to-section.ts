import type { MouseEvent } from 'react';

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** 새 탭·새 창 열기 같은 보조 키 클릭이나 왼쪽 버튼이 아닌 클릭은 브라우저 기본 동작에 맡긴다. */
export const isModifiedClick = (event: MouseEvent<HTMLAnchorElement>) =>
    event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;

/**
 * 홈의 섹션 링크를 누르면 그 섹션으로 부드럽게 이동하고(동작 줄이기면 바로), 키보드 사용자가 이어서
 * 탐색하도록 포커스도 옮긴다(링은 globals.css 에서 숨김). 홈이 아니거나 섹션이 없으면 링크의 기본 이동에 맡긴다.
 */
export const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (isModifiedClick(event)) return;
    const element = document.getElementById(id);
    if (window.location.pathname !== '/' || !element) return;
    event.preventDefault();
    element.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
    element.focus({ preventScroll: true });
};
