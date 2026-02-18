interface SectionHeaderProps {
    label?: string;
    title: string;
    subtitle?: string;
    dark?: boolean;
    className?: string;
}

const SectionHeader = ({
    label,
    title,
    subtitle,
    dark = false,
    className = '',
}: SectionHeaderProps) => {
    return (
        <div className={`text-center mb-16 ${className}`}>
            {label && (
                <div
                    className={`text-[13px] font-semibold tracking-[0.18em] uppercase mb-4 ${dark ? 'text-white/40' : 'text-[#9E9E9E]'
                        }`}
                    style={{ wordSpacing: '0.06em' }}
                >
                    {label}
                </div>
            )}
            <h2
                className={`text-[32px] md:text-[40px] lg:text-[48px] font-bold tracking-[0.015em] mb-4 ${dark ? 'text-white' : 'text-[#1A1A1A]'
                    }`}
                style={{ wordSpacing: '0.06em' }}
            >
                {title}
            </h2>
            {subtitle && (
                <p
                    className={`text-[18px] tracking-[0.01em] max-w-[560px] mx-auto ${dark ? 'text-white/60' : 'text-[#6B6B6B]'
                        }`}
                    style={{ wordSpacing: '0.05em' }}
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export { SectionHeader };
export type { SectionHeaderProps };
