import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 focus-visible:outline-none';

const variantStyles: Record<ButtonVariant, string> = {
  // Warm near-black pill. Ring-shadow border, not a CSS border.
  primary:
    'bg-[var(--cta-bg)] text-[var(--cta-fg)] shadow-[var(--elev-btn-hi),var(--elev-soft)] hover:bg-[var(--cta-bg-hover)] hover:-translate-y-px focus-visible:shadow-[var(--cta-focus-ring)]',
  // Quiet hairline button on white.
  ghost:
    'bg-white text-[var(--fg-1)] shadow-[0_0_0_1px_var(--ring)] hover:shadow-[0_0_0_1px_var(--ring-strong)] hover:-translate-y-px',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-5 text-[14px]',
  md: 'h-11 px-6 text-[15px]',
  lg: 'h-12 px-7 text-[16px]',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
