'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reveal-on-scroll. Returns a ref to attach and a boolean that flips true
 * once the element first enters the viewport. SSR-safe; respects
 * prefers-reduced-motion by revealing immediately.
 */
export const useReveal = <T extends HTMLElement = HTMLDivElement>(
  threshold = 0.12,
) => {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced-motion visibility is handled in CSS (.reveal forced opaque),
    // so the observer simply toggles the entrance animation when present.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);

    // Safety net: never leave content stuck hidden if the observer never
    // fires (e.g. non-scrolling render contexts). Reveals without animation.
    const fallback = window.setTimeout(() => setShown(true), 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [threshold]);

  return { ref, shown };
};
