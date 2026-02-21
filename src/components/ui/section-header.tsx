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
        <div className={`mb-16 text-center ${className}`}>
            {label && (
                <div className={`mb-4 typo-caption uppercase ${dark ? 'text-white/40' : 'text-[#9E9E9E]'}`}>
                    {label}
                </div>
            )}
            <h2
                className={`mb-4 typo-heading-section wrap-balance text-kor-safe ${dark ? 'text-white' : 'text-[#1A1A1A]'
                    }`}
            >
                {title}
            </h2>
            {subtitle && (
                <p
                    className={`mx-auto measure-32ch typo-body-lead wrap-pretty text-kor-safe ${dark ? 'text-white/60' : 'text-[#6B6B6B]'
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
