import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'cta';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        'bg-[#1A1A1A] text-white rounded-full shadow-lg hover:bg-[#333333] hover:-translate-y-0.5 transition-all',
    ghost:
        'bg-transparent border-[1.5px] border-[#E5E5E5] text-[#6B6B6B] rounded-full hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all',
    cta:
        'bg-[#1A1A1A] text-white rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:bg-[#333333] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-6 py-2.5 text-[15px] font-medium',
    md: 'px-8 py-3 text-[16px] font-semibold',
    lg: 'px-10 py-4 text-[17px] font-semibold',
};

const Button = ({
    variant = 'primary',
    size = 'sm',
    children,
    className = '',
    ...props
}: ButtonProps) => {
    return (
        <button
            className={`${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
