'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GradientBorderContainer } from './gradient-border-container';
import { MonotoneBorderContainer } from './monotone-border-container';
import { useVideoAutoplay } from './use-video-autoplay';

type BorderType = 'gradient' | 'monotone' | 'none';

interface VideoContainerProps {
    src: string;
    poster?: string;
    aspectRatio?: string;
    borderType?: BorderType;
    preload?: 'none' | 'metadata' | 'auto';
    className?: string;
}

const VideoContainer = ({
    src,
    poster,
    aspectRatio = '16/9',
    borderType = 'gradient',
    preload = 'metadata',
    className = '',
}: VideoContainerProps) => {
    const videoRef = useVideoAutoplay({ threshold: 0.2, rootMargin: '120px 0px' });
    const [readySrc, setReadySrc] = useState<string | null>(null);

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

    const videoContent = (
        <div
            className={`relative overflow-hidden bg-[#0A0A0A]`}
            style={{ aspectRatio }}
        >
            <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover video-no-controls"
                muted
                loop
                autoPlay
                playsInline
                preload={preload}
                poster={resolvedPoster}
                onLoadedData={() => setReadySrc(src)}
                onCanPlay={() => setReadySrc(src)}
            >
                {isMov ? (
                    <>
                        <source src={src} type="video/mp4" />
                        <source src={src} type="video/quicktime" />
                    </>
                ) : (
                    <source src={src} type={getVideoType(src)} />
                )}
            </video>
            {poster && !isVideoReady && (
                <Image
                    src={resolvedPoster}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 1024px) 900px, 100vw"
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                />
            )}
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
