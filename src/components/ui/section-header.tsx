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
                    className={`text-[13px] font-semibold tracking-[0.12em] uppercase mb-4 ${dark ? 'text-white/40' : 'text-[#9E9E9E]'
                        }`}
                >
                    {label}
                </div>
            )}
            <h2
                className={`text-[32px] md:text-[40px] lg:text-[48px] font-bold mb-4 ${dark ? 'text-white' : 'text-[#1A1A1A]'
                    }`}
            >
                {title}
            </h2>
            {subtitle && (
                <p
                    className={`text-[18px] max-w-[560px] mx-auto ${dark ? 'text-white/60' : 'text-[#6B6B6B]'
                        }`}
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export { SectionHeader };
export type { SectionHeaderProps };
