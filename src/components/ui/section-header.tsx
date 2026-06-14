import type { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
}

/** Editorial section header: big title left, serif-italic label right, hairline under. */
const SectionHeader = ({ eyebrow, title, sub }: SectionHeaderProps) => {
  return (
    <div className="flex items-end justify-between gap-8 border-b border-[var(--ring-strong)] pb-7">
      <div>
        <h2 className="t-h1 whitespace-normal max-w-[18ch]">{title}</h2>
        {sub && <p className="t-lead whitespace-normal mt-4 max-w-[42ch]">{sub}</p>}
      </div>
      <p className="t-eyebrow shrink-0 whitespace-nowrap pb-1.5">{eyebrow}</p>
    </div>
  );
};

export { SectionHeader };
