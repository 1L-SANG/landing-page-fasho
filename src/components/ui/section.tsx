import type { ComponentPropsWithRef } from 'react';
import { cn } from './cn';

type SectionSize = 'default' | 'compact';

interface SectionProps extends ComponentPropsWithRef<'section'> {
    size?: SectionSize;
}

// 섹션 상하 패딩은 여기서만 정한다. 호출부 className에는 px-*/py-* 를 넣지 않는다.
const sectionSizeStyles: Record<SectionSize, string> = {
    default: 'px-6 py-16 md:py-20 lg:py-24 xl:py-28',
    compact: 'px-6 py-12 md:py-16 lg:py-20',
};

const Section = ({ size = 'default', className, children, ...props }: SectionProps) => {
    return (
        <section className={cn(sectionSizeStyles[size], className)} {...props}>
            {children}
        </section>
    );
};

export { Section, sectionSizeStyles };
export type { SectionProps, SectionSize };
