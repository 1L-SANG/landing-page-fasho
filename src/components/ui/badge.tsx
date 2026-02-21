import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'gradient' | 'dark';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    default:
        'bg-[#F0F0F0] text-[#1A1A1A] typo-caption',
    gradient:
        'bg-white/80 backdrop-blur-sm border border-[#E5E5E5] text-[#4A4A4A] typo-body shadow-sm',
    dark:
        'bg-[#1A1A1A] text-white typo-caption',
};

const Badge = ({
    children,
    variant = 'default',
    className = '',
}: BadgeProps) => {
    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 ${variantStyles[variant]} ${className}`}
        >
            {children}
        </span>
    );
};

export { Badge };
export type { BadgeProps, BadgeVariant };
