'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AccordionItem {
    question: string;
    answer: string;
}

interface AccordionProps {
    items: AccordionItem[];
    className?: string;
}

const Accordion = ({ items, className = '' }: AccordionProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {items.map((item, index) => (
                <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-[#F0F0F0] bg-white transition-all"
                >
                    <button
                        onClick={() => handleToggle(index)}
                        className="flex w-full items-center justify-between px-7 py-6 text-left transition-colors hover:bg-[#FAFAFA]"
                        aria-expanded={openIndex === index}
                        aria-controls={`accordion-content-${index}`}
                        tabIndex={0}
                    >
                        <span className="pr-4 text-[16px] font-semibold text-[#1A1A1A] md:text-[18px]">
                            {item.question}
                        </span>
                        <Plus
                            size={24}
                            className={`flex-shrink-0 text-[#1A1A1A] transition-transform duration-300 ${openIndex === index ? 'rotate-45' : 'rotate-0'
                                }`}
                            aria-hidden="true"
                        />
                    </button>

                    <div
                        id={`accordion-content-${index}`}
                        role="region"
                        className={`overflow-hidden transition-all duration-300 ${openIndex === index
                                ? 'max-h-96 opacity-100'
                                : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div className="border-t border-[#F0F0F0] px-7 pb-6 pt-0">
                            <p className="mt-4 text-[16px] leading-[1.7] text-[#6B6B6B]">
                                {item.answer}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export { Accordion };
export type { AccordionProps, AccordionItem };
