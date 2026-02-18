'use client';

import type { ReactNode } from 'react';

interface MonotoneBorderContainerProps {
    children: ReactNode;
    className?: string;
    innerClassName?: string;
}

const MonotoneBorderContainer = ({
    children,
    className = '',
    innerClassName = '',
}: MonotoneBorderContainerProps) => {
    return (
        <div
            className={`group rounded-[24px] p-[2px] transition-all duration-300 hover:p-[3px] hover:shadow-[0_0_30px_rgba(26,26,26,0.2)] ${className}`}
            style={{
                background:
                    'conic-gradient(from 180deg, #1A1A1A, #4A4A4A, #6B6B6B, #9E9E9E, #6B6B6B, #4A4A4A, #1A1A1A)',
                animation: 'monotoneShift 8s linear infinite',
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

export { MonotoneBorderContainer };
export type { MonotoneBorderContainerProps };
