import type { AnchorHTMLAttributes, ReactNode } from 'react';

interface GlowCTAProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  /** External links open in a new tab with safe rel. Defaults to true. */
  external?: boolean;
}

/**
 * Primary CTA: near-black pill wrapped in a slowly rotating 4-color conic
 * ring — the one place glow tokens touch an interactive element.
 */
const GlowCTA = ({
  href,
  children,
  external = true,
  className = '',
  ...props
}: GlowCTAProps) => {
  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};
  return (
    <a
      href={href}
      className={`wearless-glow-cta ${className}`}
      {...externalProps}
      {...props}
    >
      {children}
    </a>
  );
};

export { GlowCTA };
