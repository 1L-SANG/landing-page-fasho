import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from './cn';

type BadgeVariant = 'default' | 'neutral' | 'dark' | 'glass' | 'info' | 'inverse';

type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends ComponentPropsWithRef<'span'> {
    variant?: BadgeVariant;
    /** 생략하면 variant 기본값: glass → lg, dark → md, 나머지 → sm */
    size?: BadgeSize;
}

const neutralStyles = 'bg-[#F4F5F7] text-[#3A3A3A]';

const variantStyles: Record<BadgeVariant, string> = {
    default: neutralStyles,
    neutral: neutralStyles,
    dark: 'bg-[#1A1A1A] text-white',
    glass: 'border border-[rgba(34,42,53,0.08)] bg-white/80 text-[#4A4A4A] shadow-[0_1px_2px_rgba(34,42,53,0.06)] backdrop-blur-sm',
    info: 'border border-[#dce7f6] bg-[#eef5ff] text-[#3068b4]',
    inverse: 'bg-white/10 text-white',
};

const defaultSizeByVariant: Record<BadgeVariant, BadgeSize> = {
    default: 'sm',
    neutral: 'sm',
    dark: 'md',
    glass: 'lg',
    info: 'sm',
    inverse: 'sm',
};

const sizeStyles: Record<BadgeSize, string> = {
    sm: 'h-6 px-2.5 text-[12px] font-semibold',
    md: 'h-8 px-3.5 text-[13px] font-semibold',
    lg: 'h-10 px-4 text-[13px] font-medium md:text-[14px]',
};

const HANGUL = /[ᄀ-ᇿ㄰-㆏가-힯]/;

const isPrimitiveText = (node: ReactNode): node is string | number =>
    typeof node === 'string' || typeof node === 'number';

// `STEP {n}`처럼 문자열·숫자만 이어 붙인 children도 글자로 읽는다. 요소가 섞이면 null.
const getPlainText = (children: ReactNode): string | null => {
    if (isPrimitiveText(children)) return String(children);
    if (Array.isArray(children) && children.every(isPrimitiveText)) return children.join('');
    return null;
};

const Badge = ({ children, variant = 'default', size, className, ...props }: BadgeProps) => {
    const resolvedSize = size ?? defaultSizeByVariant[variant];
    const plainText = getPlainText(children);
    // 라틴 문자열 배지(STEP 1 등)만 자간 0.04em, 한글·복합 내용은 0.
    const isLatinLabel = plainText !== null && !HANGUL.test(plainText) && resolvedSize !== 'lg';

    return (
        <span
            className={cn(
                'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full leading-none',
                variantStyles[variant],
                sizeStyles[resolvedSize],
                isLatinLabel ? 'tracking-[0.04em]' : 'tracking-normal',
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export { Badge };
export type { BadgeProps, BadgeVariant, BadgeSize };
