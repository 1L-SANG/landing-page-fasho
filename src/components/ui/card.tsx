import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    hover?: boolean;
}

const Card = ({
    children,
    hover = true,
    className = '',
    ...props
}: CardProps) => {
    return (
        <div
            className={`bg-white rounded-[20px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] ${hover
                    ? 'hover:-translate-y-1.5 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300'
                    : ''
                } ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

/* --- Card sub-components --- */

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
    return <div className={`mb-6 ${className}`}>{children}</div>;
};

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

const CardContent = ({ children, className = '' }: CardContentProps) => {
    return <div className={className}>{children}</div>;
};

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

const CardFooter = ({ children, className = '' }: CardFooterProps) => {
    return <div className={`mt-8 ${className}`}>{children}</div>;
};

export { Card, CardHeader, CardContent, CardFooter };
export type { CardProps, CardHeaderProps, CardContentProps, CardFooterProps };
