import type { HTMLAttributes, ReactNode } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** White glass plate that floats over the glow zone (hero / final CTA). */
const GlassCard = ({ children, className = '', ...props }: GlassCardProps) => {
  return (
    <div className={`wearless-glass ${className}`} {...props}>
      {children}
    </div>
  );
};

export { GlassCard };
