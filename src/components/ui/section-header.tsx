import type { ReactNode } from 'react';
import { cn } from './cn';

interface SectionHeaderProps {
    label?: string;
    title: ReactNode;
    subtitle?: ReactNode;
    dark?: boolean;
    className?: string;
    /** h2 id. 섹션에 aria-labelledby 를 걸 때 쓴다. */
    titleId?: string;
}

const HANGUL = /[ᄀ-ᇿ㄰-㆏가-힯]/;

const SectionHeader = ({
    label,
    title,
    subtitle,
    dark = false,
    className,
    titleId,
}: SectionHeaderProps) => {
    const hasSubtitle = subtitle !== undefined && subtitle !== null && subtitle !== false && subtitle !== '';

    return (
        <div className={cn('mb-10 text-center md:mb-12', className)}>
            {label && (
                <p
                    className={cn(
                        'mb-3 text-[13px] font-semibold uppercase leading-[1.5]',
                        // 자간은 라틴 대문자 라벨에만 준다. 한국어 라벨은 0.
                        HANGUL.test(label) ? 'tracking-normal' : 'tracking-[0.12em]',
                        dark ? 'text-white/60' : 'text-[#5C5C5C]'
                    )}
                >
                    {label}
                </p>
            )}
            <h2
                id={titleId}
                className={cn(
                    'text-[28px] font-bold leading-[1.3] tracking-[-0.02em] md:text-[36px] md:leading-[1.25] lg:text-[40px] lg:leading-[1.2]',
                    // 부제가 없으면 h2 아래 여백을 없애 헤더→본문 간격을 래퍼 mb(40/48)로만 맞춘다.
                    hasSubtitle && 'mb-3 md:mb-4',
                    dark ? 'text-white' : 'text-[#1A1A1A]'
                )}
            >
                {title}
            </h2>
            {hasSubtitle && (
                <p
                    className={cn(
                        'mx-auto max-w-[560px] text-[16px] leading-[1.6] max-md:text-balance md:text-[18px] md:leading-[1.5]',
                        dark ? 'text-white/60' : 'text-[#5C5C5C]'
                    )}
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export { SectionHeader };
export type { SectionHeaderProps };
