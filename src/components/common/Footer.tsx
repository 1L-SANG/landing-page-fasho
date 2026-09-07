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

                    {/* Right - Links & Copyright */}
                    <div className="space-y-2 text-center md:text-right">
                        <div className="flex items-center justify-center gap-2 text-[14px] text-[#6B6B6B] md:justify-end">
                            <Link
                                href="/#contact"
                                className="transition-colors hover:text-[#1A1A1A]"
                                tabIndex={0}
                                aria-label="문의하기"
                            >
                                문의하기
                            </Link>
                        </div>
                        <p className="text-[13px] text-[#9E9E9E]">
                            © 2026 Wearless. All rights reserved.
                        </p>
                    </div>
                </div>
                <div className="mt-8 border-t border-border pt-6">
                    <nav aria-label="법적 고지" className="mb-5 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[14px] text-foreground md:justify-start">
                        {documents.map((document) => (
                            <Link key={document.slug} href={document.path} className="underline-offset-4 hover:underline">
                                {document.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="space-y-1 text-center text-[13px] leading-relaxed text-muted-foreground md:text-left">
                        <p>{company.name} · 대표: {company.representative} · 사업자등록번호: {company.businessRegistrationNumber}</p>
                        <p>주소: {company.address}</p>
                        <p>
                            전화: <a href={`tel:${company.phone}`} className="underline underline-offset-2">{company.phone}</a>
                            {' · 이메일: '}<a href={`mailto:${company.email}`} className="underline underline-offset-2">{company.email}</a>
                        </p>
                        <p>통신판매업 신고: {company.mailOrderRegistration}</p>
                        <p>개인정보 보호책임자: {company.privacyOfficer} ({company.email})</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export { Footer };
