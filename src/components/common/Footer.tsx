import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import documents from '../../../content/legal/manifest.json';
import company from '../../../content/legal/company-info.json';

const Footer = () => {
    return (
        <footer
            className="relative px-6 py-12"
            style={{
                backgroundColor: 'rgba(250, 250, 250, 0.6)',
                backdropFilter: 'blur(30px)',
                borderTop: '1px solid rgba(107, 107, 107, 0.2)',
            }}
        >
            <div className="mx-auto max-w-[1200px]">
                {/* Brand and contact */}
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    {/* Left - Logo & Tagline */}
                    <div className="text-center md:text-left">
                        <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
                            <Image
                                src="/logo.svg"
                                alt=""
                                width={20}
                                height={20}
                                className="object-contain"
                            />
                            <Image
                                src="/wordmark.svg"
                                alt="Wearless"
                                width={71}
                                height={13}
                                className="object-contain"
                            />
                        </div>
                        <p className="text-[14px] text-[#9E9E9E]">
                            쇼핑몰 촬영의 새로운 기준
                        </p>
                    </div>

                    {/* Right - Links */}
                    <div className="flex items-center justify-center gap-2 text-[14px] text-[#6B6B6B] md:justify-end">
                        <Link
                            href="/#contact"
                            className="-my-3 py-3 transition-colors hover:text-[#1A1A1A]"
                            tabIndex={0}
                            aria-label="문의하기"
                        >
                            문의하기
                        </Link>
                    </div>
                </div>
                <div className="mt-8 border-t border-border pt-3 md:pt-6">
                    <nav aria-label="법적 고지" className="mb-2 flex flex-wrap justify-center gap-x-6 gap-y-0 text-[14px] text-foreground md:mb-5 md:justify-start md:gap-y-3">
                        {documents.map((document) => (
                            <Link
                                key={document.slug}
                                href={document.path}
                                // 개인정보 처리방침은 다른 고지와 구별되게 표시해야 한다(개인정보보호법 시행령 제31조 제3항).
                                className={`py-3 md:py-0 underline-offset-4 hover:underline ${document.slug === 'privacy-seller' ? ' font-semibold text-[#1A1A1A]' : ''}`}
                            >
                                {document.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="space-y-1 text-center text-[13px] leading-relaxed text-muted-foreground md:text-left">
                        <p>Copyright © 2026 {company.name}. All rights reserved.</p>
                        <p>사업자등록번호: {company.businessRegistrationNumber}</p>
                        <p>통신판매업번호: {company.mailOrderRegistration}</p>
                        <p>대표자: {company.representative}</p>
                        <p>
                            연락처: <a href={`tel:${company.phone}`} className="underline underline-offset-2 max-md:inline-block max-md:py-2">{company.phone}</a>
                        </p>
                        <p>
                            이메일: <a href={`mailto:${company.email}`} className="underline underline-offset-2 max-md:inline-block max-md:py-2">{company.email}</a>
                        </p>
                        {/* 번지와 호수(98-2, A-4호)가 하이픈에서 끊기지 않게 하이픈 낀 덩어리는 한 줄로 묶는다. */}
                        <p>
                            사업자주소:{' '}
                            {company.address.split(' ').map((part, i) => (
                                <Fragment key={i}>
                                    {i > 0 && ' '}
                                    {part.includes('-') ? <span className="whitespace-nowrap">{part}</span> : part}
                                </Fragment>
                            ))}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export { Footer };
