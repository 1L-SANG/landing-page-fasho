'use client';

import type { ReactNode } from 'react';
import { cn } from './cn';

interface MonotoneBorderContainerProps {
    children: ReactNode;
    className?: string;
    innerClassName?: string;
}

const MonotoneBorderContainer = ({ children, className, innerClassName }: MonotoneBorderContainerProps) => {
    return (
        <div
            className={cn('rounded-[24px] p-[2px] motion-safe:animate-[monotoneShift_8s_linear_infinite]', className)}
            style={{
                background:
                    'conic-gradient(from 180deg, #1A1A1A, #4A4A4A, #6B6B6B, #9E9E9E, #6B6B6B, #4A4A4A, #1A1A1A)',
            }}
        >
            <div className={cn('overflow-hidden rounded-[22px]', innerClassName)}>{children}</div>
        </div>
    );
};

export { MonotoneBorderContainer };
export type { MonotoneBorderContainerProps };
