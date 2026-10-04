import type { ElementType, HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from './cn';

type CardVariant = 'default' | 'featured' | 'dark';
type CardPadding = 'default' | 'none';
type CardElement = 'div' | 'article' | 'section' | 'li';

interface CardStyleOptions {
    variant?: CardVariant;
    padding?: CardPadding;
    className?: string;
}

interface CardProps extends HTMLAttributes<HTMLElement>, CardStyleOptions {
    as?: CardElement;
    ref?: Ref<HTMLElement>;
    children?: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
    default:
        'rounded-[20px] border border-[rgba(34,42,53,0.12)] bg-white shadow-[0_4px_8px_rgba(34,42,53,0.05)]',
    featured:
        'relative rounded-[20px] border-2 border-[#1A1A1A] bg-white shadow-[0_12px_32px_rgba(34,42,53,0.12)] lg:-translate-y-2',
    dark: 'rounded-[20px] bg-[#2A2A2A] ring-1 ring-white/10',
};

const paddingStyles: Record<CardVariant, string> = {
    default: 'p-5 md:p-6 xl:p-8',
    featured: 'p-5 md:p-6 xl:p-8',
    dark: 'p-4 xl:p-5',
};

/** <Card>를 쓰기 어려운 자리(직접 만든 요소, 조건부 래퍼)에 같은 카드 클래스를 입힐 때 쓴다. */
const cardStyles = ({ variant = 'default', padding = 'default', className }: CardStyleOptions = {}) =>
    cn(variantStyles[variant], padding === 'default' && paddingStyles[variant], className);

const Card = ({
    as = 'div',
    variant = 'default',
    padding = 'default',
    className,
    children,
    ...props
}: CardProps) => {
    // div·article·section·li 가 받는 ref 타입이 달라 다형 요소로 넓힌다.
    const Component = as as ElementType;

    return (
        <Component className={cardStyles({ variant, padding, className })} {...props}>
            {children}
        </Component>
    );
};

/* --- Card sub-components --- */

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

const CardHeader = ({ children, className }: CardHeaderProps) => {
    return <div className={cn('mb-6', className)}>{children}</div>;
};

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

const CardContent = ({ children, className }: CardContentProps) => {
    return <div className={className}>{children}</div>;
};

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

const CardFooter = ({ children, className }: CardFooterProps) => {
    return <div className={cn('mt-8', className)}>{children}</div>;
};

export { Card, CardHeader, CardContent, CardFooter, cardStyles };
export type {
    CardProps,
    CardVariant,
    CardPadding,
    CardElement,
    CardStyleOptions,
    CardHeaderProps,
    CardContentProps,
    CardFooterProps,
};
