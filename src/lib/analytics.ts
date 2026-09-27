'use client';

/* ────────────────────────────────────────────────────
 *  Type declarations for global tracking functions
 * ──────────────────────────────────────────────────── */

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

/* ────────────────────────────────────────────────────
 *  Google Analytics 4 helpers
 * ──────────────────────────────────────────────────── */

const gtag = (...args: unknown[]) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag(...args);
    }
};

/** 설문 모달 열릴 때 */
export const trackGASurveyStart = () => gtag('event', 'survey_start');

/** 설문 완료 시 (role 포함) */
export const trackGASurveyComplete = (role: string) =>
    gtag('event', 'survey_complete', { role });
