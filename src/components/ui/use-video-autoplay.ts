'use client';

import { useEffect, useRef } from 'react';

/**
 * IntersectionObserver 기반 비디오 자동재생 hook.
 * 비디오가 viewport에 50% 이상 보이면 자동 재생, 벗어나면 일시정지.
 */
const useVideoAutoplay = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoElement.play().catch(() => {
                        // Autoplay was prevented, silently handle
                    });
                } else {
                    videoElement.pause();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(videoElement);

        return () => {
            observer.disconnect();
        };
    }, []);

    return videoRef;
};

export { useVideoAutoplay };
