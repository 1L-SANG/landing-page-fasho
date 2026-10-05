'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { cn } from './cn';

interface AccordionLink {
    href: string;
    label: string;
}

interface AccordionItem {
    question: string;
    /** 배열이면 문단마다 <p>로 나눈다. 문자열 안의 '\n'은 줄바꿈으로 보이고, 이메일 주소는 mailto 링크가 된다. */
    answer: string | string[];
    /** 답변 아래 별도 행에 놓는 문서 링크. http(s)로 시작하면 새 창으로 연다. */
    links?: AccordionLink[];
}

interface AccordionProps {
    items: AccordionItem[];
    className?: string;
    /** 여러 항목을 동시에 열 수 있게 한다. 하나만 열리면 위 답변이 닫히며 누른 질문이 위로 밀린다. */
    multiple?: boolean;
}

// hover 때 바뀌는 글자색·밑줄색을 키보드 포커스에도 같이 준다.
const inlineLinkClassName =
    'underline decoration-black/20 underline-offset-4 transition-colors hover:text-[#1A1A1A] hover:decoration-current focus-visible:text-[#1A1A1A] focus-visible:decoration-current';

const linkClassName = cn('inline-flex min-h-11 items-center gap-1', inlineLinkClassName);

const isExternalHref = (href: string) => /^https?:\/\//.test(href);

// 캡처 그룹으로 나누면 홀수 번째 조각이 이메일 주소다.
const EMAIL_PATTERN = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/;

const renderParagraph = (text: string) =>
    text.split(EMAIL_PATTERN).map((part, partIndex) =>
        partIndex % 2 === 1 ? (
            <a key={partIndex} href={`mailto:${part}`} className={inlineLinkClassName}>
                {part}
            </a>
        ) : (
            part
        )
    );

// WAI-ARIA APG: 동시에 펼칠 수 있는 패널이 6개를 넘으면 region 랜드마크가 목록을 덮으므로 role을 뺀다.
const MAX_REGION_PANELS = 6;

const Accordion = ({ items, className, multiple = true }: AccordionProps) => {
    const baseId = useId();
    const [openIndexes, setOpenIndexes] = useState<number[]>([]);
    const panelsAreRegions = !multiple || items.length <= MAX_REGION_PANELS;

    const handleToggle = (index: number) => {
        setOpenIndexes((prev) => {
            if (prev.includes(index)) return prev.filter((i) => i !== index);
            return multiple ? [...prev, index] : [index];
        });
    };

    return (
        <div className={cn('space-y-3', className)}>
            {items.map((item, index) => {
                const isOpen = openIndexes.includes(index);
                const triggerId = `${baseId}-trigger-${index}`;
                const panelId = `${baseId}-panel-${index}`;
                const paragraphs = Array.isArray(item.answer) ? item.answer : [item.answer];

                return (
                    <div
                        key={index}
                        className="overflow-hidden rounded-[16px] border border-[rgba(34,42,53,0.08)] bg-white"
                    >
                        <h3>
                            <button
                                type="button"
                                id={triggerId}
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => handleToggle(index)}
                                className={cn(
                                    'flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#F5F5F5] focus-visible:-outline-offset-2 md:px-6 md:py-5',
                                    // 카드가 overflow-hidden 이라 안쪽 포커스 링이 모서리에서 잘리지 않게 같은 반경을 준다.
                                    isOpen ? 'rounded-t-[15px]' : 'rounded-[15px]'
                                )}
                            >
                                <span className="text-[16px] font-semibold leading-[1.5] text-[#1A1A1A] max-md:text-balance md:text-[18px]">
                                    {item.question}
                                </span>
                                <Plus
                                    size={20}
                                    aria-hidden="true"
                                    className={cn(
                                        'shrink-0 text-[#1A1A1A] transition-transform duration-300 motion-reduce:transition-none',
                                        isOpen ? 'rotate-45' : 'rotate-0'
                                    )}
                                />
                            </button>
                        </h3>

                        {/* 높이 상한 없이 펼치려고 grid-rows 0fr↔1fr 로 전환하고, 닫힌 답변은 inert 로 보조기술·포커스에서 뺀다. */}
                        <div
                            id={panelId}
                            role={panelsAreRegions ? 'region' : undefined}
                            aria-labelledby={panelsAreRegions ? triggerId : undefined}
                            inert={!isOpen}
                            className={cn(
                                'grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none',
                                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                            )}
                        >
                            <div className="min-h-0 overflow-hidden">
                                <div className="border-t border-[rgba(34,42,53,0.08)] px-5 pb-4 pt-0 md:px-6 md:pb-5">
                                    <div className="mt-4 space-y-3 text-[16px] leading-[1.7] text-[#6B6B6B] md:max-w-[36em]">
                                        {paragraphs.map((paragraph, paragraphIndex) => (
                                            <p key={paragraphIndex} className="whitespace-pre-line text-pretty">
                                                {renderParagraph(paragraph)}
                                            </p>
                                        ))}
                                        {item.links && item.links.length > 0 && (
                                            <p className="flex flex-wrap gap-x-5">
                                                {item.links.map((link) =>
                                                    isExternalHref(link.href) ? (
                                                        <a
                                                            key={link.href}
                                                            href={link.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={linkClassName}
                                                        >
                                                            {link.label}
                                                            <ArrowUpRight size={14} aria-hidden="true" />
                                                            <span className="sr-only"> (새 창에서 열림)</span>
                                                        </a>
                                                    ) : (
                                                        <Link key={link.href} href={link.href} className={linkClassName}>
                                                            {link.label}
                                                        </Link>
                                                    )
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export { Accordion };
export type { AccordionProps, AccordionItem, AccordionLink };
