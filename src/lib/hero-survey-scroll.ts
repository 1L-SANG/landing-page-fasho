'use client';

const SCROLL_DURATION_MS = 1200;
const AUTO_CLICK_DELAY_MS = 500;

let pendingClickTimeout: number | null = null;

const easeInOutCubic = (t: number) => {
    if (t < 0.5) return 4 * t * t * t;
    return 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const smoothScrollTo = (targetY: number, durationMs: number) =>
    new Promise<void>((resolve) => {
        const startY = window.scrollY;
        const distance = targetY - startY;
        const startAt = performance.now();

        const step = (now: number) => {
            const elapsed = now - startAt;
            const progress = Math.min(elapsed / durationMs, 1);
            const eased = easeInOutCubic(progress);

            window.scrollTo(0, startY + distance * eased);

            if (progress < 1) {
                requestAnimationFrame(step);
                return;
            }
            resolve();
        };

        requestAnimationFrame(step);
    });

const triggerHeroSurveyFromCta = async () => {
    const heroCta = document.getElementById('hero-start-cta') as HTMLButtonElement | null;
    const heroSection = document.getElementById('home');

    if (!heroCta) {
        heroSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }

    const targetY = Math.max(
        window.scrollY + heroCta.getBoundingClientRect().top - window.innerHeight * 0.32,
        0
    );

    await smoothScrollTo(targetY, SCROLL_DURATION_MS);

    if (pendingClickTimeout) {
        window.clearTimeout(pendingClickTimeout);
    }

    pendingClickTimeout = window.setTimeout(() => {
        heroCta.click();
        pendingClickTimeout = null;
    }, AUTO_CLICK_DELAY_MS);
};

export { triggerHeroSurveyFromCta };
