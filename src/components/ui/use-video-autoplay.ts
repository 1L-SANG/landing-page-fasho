'use client';

import { useEffect, useRef } from 'react';

interface UseVideoAutoplayOptions {
    threshold?: number;
    rootMargin?: string;
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * IntersectionObserver 기반 비디오 자동재생 hook.
 * 기본값은 비디오가 viewport에 50% 이상 보이면 자동 재생, 벗어나면 일시정지.
 * 동작 줄이기(prefers-reduced-motion) 설정에서는 재생하지 않는다.
 */
const useVideoAutoplay = ({ threshold = 0.5, rootMargin = '0px' }: UseVideoAutoplayOptions = {}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
        let isInView = false;

        const play = () => {
            videoElement.play().catch(() => {
                // Autoplay was prevented, silently handle
            });
        };

        // autoPlay 속성이 먼저 재생을 시작했어도 동작 줄이기 설정이면 멈춘다. pause()는 이후 자동 재생도 막는다.
        if (motionQuery.matches) videoElement.pause();

        const observer = new IntersectionObserver(
            ([entry]) => {
                isInView = entry.isIntersecting;
                if (isInView && !motionQuery.matches) {
                    if (videoElement.paused) play();
                } else if (!isInView) {
                    // 이미 멈춰 있어도 호출한다. 버퍼링이 끝난 뒤 autoPlay 속성이 화면 밖에서 재생을 시작하지 못하게 막는다.
                    videoElement.pause();
                }
            },
            { threshold, rootMargin }
        );

        const handleMotionChange = () => {
            if (motionQuery.matches) {
                videoElement.pause();
            } else if (isInView && videoElement.paused) {
                play();
            }
        };

        observer.observe(videoElement);
        motionQuery.addEventListener('change', handleMotionChange);

        return () => {
            observer.disconnect();
            motionQuery.removeEventListener('change', handleMotionChange);
        };
    }, [rootMargin, threshold]);

    return videoRef;
};

export { useVideoAutoplay };
