'use client';

import { useEffect, useRef } from 'react';

interface UseVideoAutoplayOptions {
    threshold?: number;
    rootMargin?: string;
}

/**
 * IntersectionObserver 기반 비디오 자동재생 hook.
 * 기본값은 비디오가 viewport에 50% 이상 보이면 자동 재생, 벗어나면 일시정지.
 */
const useVideoAutoplay = ({ threshold = 0.5, rootMargin = '0px' }: UseVideoAutoplayOptions = {}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (!videoElement.paused) return;
                    videoElement.play().catch(() => {
                        // Autoplay was prevented, silently handle
                    });
                } else {
                    if (videoElement.paused) return;
                    videoElement.pause();
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(videoElement);

        return () => {
            observer.disconnect();
        };
    }, [rootMargin, threshold]);

    return videoRef;
};

export { useVideoAutoplay };
