import type { ComponentPropsWithRef } from 'react';
import { cn } from './cn';

type ButtonVariant = 'primary' | 'outline' | 'inverse' | 'text';

type ButtonSize = 'sm' | 'md' | 'lg' | 'compact';

interface ButtonStyleOptions {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
}

interface ButtonProps extends ComponentPropsWithRef<'button'>, ButtonStyleOptions {}

const baseStyles =
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold leading-none transition-colors disabled:pointer-events-none disabled:opacity-50';

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-[#1A1A1A] text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:bg-[#333333]',
    // 1px 선을 border 대신 inset-ring 으로 그린다. border 는 after 가상요소의 기준(padding box)을 2px 줄여 탭 영역이 42px 가 된다.
    outline: 'bg-white text-[#1A1A1A] inset-ring inset-ring-[#1A1A1A] hover:bg-[#F5F5F5]',
    inverse: 'bg-white text-[#1A1A1A] hover:bg-white/90 focus-visible:outline-white',
    text: 'bg-transparent text-[#1A1A1A] hover:bg-black/[0.05]',
};

// 보이는 높이는 고정하고, sm·compact는 after 가상요소로 탭 영역만 44px 이상으로 넓힌다.
const sizeStyles: Record<ButtonSize, string> = {
    sm: 'relative h-10 px-5 text-[15px] after:absolute after:inset-x-0 after:-inset-y-0.5',
    md: 'h-12 px-6 text-[16px]',
    lg: 'h-14 w-full max-w-[320px] px-8 text-[17px] sm:w-auto sm:min-w-[200px] md:px-10',
    compact:
        'relative h-9 px-4 text-[14px] after:absolute after:inset-x-0 after:-inset-y-1 md:h-10 md:px-5 md:text-[15px]',
};

/** <a>·<Link>에 버튼 모양을 입힐 때 쓰는 클래스 문자열. */
const buttonStyles = ({ variant = 'primary', size = 'sm', className }: ButtonStyleOptions = {}) =>
    cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

const Button = ({
    variant = 'primary',
    size = 'sm',
    type = 'button',
    className,
    children,
    ...props
}: ButtonProps) => {
    return (
        <button type={type} className={buttonStyles({ variant, size, className })} {...props}>
            {children}
        </button>
    );
};

export { Button, buttonStyles };
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonStyleOptions };
