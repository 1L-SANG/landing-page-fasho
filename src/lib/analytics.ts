'use client';

/* ────────────────────────────────────────────────────
 *  Type declarations for global tracking functions
 * ──────────────────────────────────────────────────── */

declare global {
    interface Window {
        fbq?: (...args: unknown[]) => void;
        gtag?: (...args: unknown[]) => void;
    }
}

/* ────────────────────────────────────────────────────
 *  Meta Pixel helpers
 * ──────────────────────────────────────────────────── */

const fbq = (...args: unknown[]) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq(...args);
    }
};

/** 설문 모달 열릴 때 */
export const trackMetaLead = () => fbq('track', 'Lead');

/** 이메일 입력 완료 시 */
export const trackMetaSubmitApplication = () => fbq('track', 'SubmitApplication');

/** 설문 최종 완료 시 */
export const trackMetaCompleteRegistration = () => fbq('track', 'CompleteRegistration');

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
