import type { ReactNode } from 'react';

interface GlowChipProps {
  children: ReactNode;
  className?: string;
}

/** Eyebrow pill with a rotating 4-color conic ring on white. */
const GlowChip = ({ children, className = '' }: GlowChipProps) => {
  return <span className={`wearless-glow-chip ${className}`}>{children}</span>;
};

export { GlowChip };
