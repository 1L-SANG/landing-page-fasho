'use client';

import type { ReactNode } from 'react';

interface GradientBorderContainerProps {
    children: ReactNode;
    className?: string;
    innerClassName?: string;
    disableHover?: boolean;
}

const GradientBorderContainer = ({
    children,
    className = '',
    innerClassName = '',
    disableHover = false,
}: GradientBorderContainerProps) => {
    return (
        <div
            className={`group rounded-[24px] p-[2px] transition-all duration-300 ${disableHover ? '' : 'hover:p-[3px] hover:shadow-[0_0_30px_rgba(76,99,252,0.2)]'} ${className}`}
            style={{
                background:
                    'conic-gradient(from 180deg, #12ADE6, #4C63FC, #DC4CFC, #FF0080, #EE00FF, #12B4E6, #12ADE6)',
                animation: 'gradientShift 8s linear infinite',
            }}
        >
            <div
                className={`overflow-hidden rounded-[22px] ${innerClassName}`}
            >
                {children}
            </div>
        </div>
    );
};

export { GradientBorderContainer };
export type { GradientBorderContainerProps };
