'use client';

import { GradientBorderContainer } from './gradient-border-container';
import { MonotoneBorderContainer } from './monotone-border-container';
import { useVideoAutoplay } from './use-video-autoplay';

type BorderType = 'gradient' | 'monotone' | 'none';

interface VideoContainerProps {
    src: string;
    poster?: string;
    aspectRatio?: string;
    borderType?: BorderType;
    className?: string;
}

const VideoContainer = ({
    src,
    poster,
    aspectRatio = '16/9',
    borderType = 'gradient',
    className = '',
}: VideoContainerProps) => {
    const videoRef = useVideoAutoplay();

    const getVideoType = (url: string): string => {
        const ext = url.split('.').pop()?.toLowerCase();
        if (ext === 'webm') return 'video/webm';
        return 'video/mp4';
    };

    const isMov = src.toLowerCase().endsWith('.mov');

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
                playsInline
                poster={
                    poster ??
                    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'%3E%3Crect fill='%23F5F5F7' width='1600' height='900'/%3E%3C/svg%3E`
                }
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
