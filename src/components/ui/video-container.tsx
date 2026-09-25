'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Image, { getImageProps } from 'next/image';
import { GradientBorderContainer } from './gradient-border-container';
import { MonotoneBorderContainer } from './monotone-border-container';
import { useVideoAutoplay } from './use-video-autoplay';

type BorderType = 'gradient' | 'monotone' | 'none';

interface VideoContainerProps {
    src: string;
    poster?: string;
    aspectRatio?: string;
    mobileSrc?: string;
    mobilePoster?: string;
    mobileAspectRatio?: string;
    borderType?: BorderType;
    preload?: 'none' | 'metadata' | 'auto';
    className?: string;
}

const VideoContainer = ({
    src,
    poster,
    aspectRatio = '16/9',
    mobileSrc,
    mobilePoster,
    mobileAspectRatio,
    borderType = 'gradient',
    preload = 'metadata',
    className = '',
}: VideoContainerProps) => {
    const videoRef = useVideoAutoplay({ threshold: 0.2, rootMargin: '120px 0px' });
    const [readySrc, setReadySrc] = useState<string | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        // 하이드레이션 전에 준비 이벤트가 발생한 경우 현재 상태로 보완한다.
        if (video && video.readyState >= 2) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- 이미 로드된 DOM 영상 상태를 React 상태에 반영한다.
            setReadySrc(src);
        }
    }, [src, videoRef]);

    useEffect(() => {
        if (!mobileSrc) return;
        const breakpoint = window.matchMedia('(min-width: 768px)');
        const reloadForViewport = () => {
            setReadySrc(null);
            videoRef.current?.load();
        };
        breakpoint.addEventListener('change', reloadForViewport);
        return () => breakpoint.removeEventListener('change', reloadForViewport);
    }, [mobileSrc, videoRef]);

    const getVideoType = (url: string): string => {
        const ext = url.split('.').pop()?.toLowerCase();
        if (ext === 'webm') return 'video/webm';
        return 'video/mp4';
    };

    const isMov = src.toLowerCase().endsWith('.mov');
    const resolvedPoster =
        poster ??
        `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'%3E%3Crect fill='%230A0A0A' width='1600' height='900'/%3E%3C/svg%3E`;
    const isVideoReady = readySrc === src;
    const posterImageProps = {
        alt: '',
        fill: true,
        loading: 'eager' as const,
        fetchPriority: 'high' as const,
        sizes: '(min-width: 1024px) 900px, 100vw',
        className: 'pointer-events-none absolute inset-0 h-full w-full object-cover',
    };
    const desktopImage = mobilePoster
        ? getImageProps({ ...posterImageProps, src: resolvedPoster }).props
        : null;
    const mobileImage = mobilePoster
        ? getImageProps({ ...posterImageProps, src: mobilePoster }).props
        : null;

    const videoContent = (
        <div
            className="relative overflow-hidden bg-[#0A0A0A] aspect-(--video-ar-mobile) md:aspect-(--video-ar)"
            style={{
                '--video-ar': aspectRatio,
                '--video-ar-mobile': mobileAspectRatio ?? aspectRatio,
            } as CSSProperties}
        >
            <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover video-no-controls"
                muted
                loop
                autoPlay
                playsInline
                preload={preload}
                poster={mobileSrc || mobilePoster ? undefined : resolvedPoster}
                onLoadedData={() => setReadySrc(src)}
                onCanPlay={() => setReadySrc(src)}
            >
                {isMov ? (
                    <>
                        <source src={src} type="video/mp4" />
                        <source src={src} type="video/quicktime" />
                    </>
                ) : mobileSrc ? (
                    <>
                        <source src={src} type="video/mp4" media="(min-width: 768px)" />
                        <source src={mobileSrc} type="video/mp4" />
                    </>
                ) : (
                    <source src={src} type={getVideoType(src)} />
                )}
            </video>
            {(poster || mobilePoster) && !isVideoReady && (desktopImage && mobileImage ? (
                <picture>
                    <source
                        media="(min-width: 768px)"
                        srcSet={desktopImage.srcSet ?? desktopImage.src}
                        sizes={desktopImage.sizes}
                    />
                    {/* getImageProps로 최적화한 이미지 한 장만 우선 로딩한다. */}
                    <img {...mobileImage} alt="" />
                </picture>
            ) : (
                <Image
                    src={resolvedPoster}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 1024px) 900px, 100vw"
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                />
            ))}
        </div>
    );

    if (borderType === 'gradient') {
        return (
            <GradientBorderContainer className={className}>
                {videoContent}
            </GradientBorderContainer>
        );
    }

    if (borderType === 'monotone') {
        return (
            <MonotoneBorderContainer className={className}>
                {videoContent}
            </MonotoneBorderContainer>
        );
    }

    return <div className={`overflow-hidden rounded-[24px] ${className}`}>{videoContent}</div>;
};

export { VideoContainer };
export type { VideoContainerProps, BorderType };
