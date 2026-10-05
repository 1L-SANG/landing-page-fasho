'use client';

import { useEffect, useRef, useState } from 'react';

/** 요소가 처음 화면에 들어오면 true가 되고 관찰을 멈춘다. 섹션·카드 등장(reveal)에 쓴다. */
const useInViewOnce = <T extends Element>(threshold: number, rootMargin = '0px') => {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold, rootMargin }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return [ref, inView] as const;
};

export { useInViewOnce };
