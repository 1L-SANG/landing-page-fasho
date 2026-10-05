import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { cn } from '@/components/ui/cn';
import documents from '../../../content/legal/manifest.json';
import company from '../../../content/legal/company-info.json';

const CONTACT_CHIP_CLASS =
    'inline-flex h-11 items-center gap-1.5 rounded-full border border-[rgba(34,42,53,0.12)] bg-white px-4 text-[13px] text-[#4A4A4A] transition-colors hover:bg-[#F5F5F5] hover:text-[#1A1A1A]';

const Footer = () => {
    return (
        // relative: 고정 배경 레이어(z-0)보다 위에 그려지게 한다. 반투명 배경이라 빛은 은은하게 비친다.
        <footer className="relative border-t border-[rgba(34,42,53,0.08)] bg-[rgba(255,255,255,0.5)] px-6 py-10 backdrop-blur-[30px] md:py-12">
            <div className="mx-auto w-full max-w-[1200px]">
                {/* Brand and contact */}
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    {/* Left - Logo & Tagline */}
                    <div>
                        {/* 법적 페이지에서도 같은 푸터가 보이므로 로고로 홈에 돌아갈 수 있게 한다. after 는 히트 영역만 48px로 넓힌다. */}
                        <Link
                            href="/"
                            aria-label="Wearless 홈"
                            className="relative mb-2 flex w-fit items-center gap-2 rounded-md transition-opacity after:absolute after:-inset-3 hover:opacity-80"
                        >
                            <Image
                                src="/logo.svg"
                                alt=""
                                width={24}
                                height={24}
                                className="h-6 w-6 object-contain"
                            />
                            <Image
                                src="/wordmark.svg"
                                alt=""
                                width={74}
                                height={15}
                                className="h-auto w-[74px] object-contain"
                            />
                        </Link>
                        <p className="text-[14px] leading-[1.6] text-[#5C5C5C]">
                            쇼핑몰 촬영의 새로운 기준
                        </p>
                    </div>

                    {/* Right - Links */}
                    <div className="flex items-center justify-start gap-2 text-[14px] leading-[1.6] text-[#4A4A4A] md:justify-end">
                        <Link
                            href="/#contact"
                            className="-my-3 inline-block py-3 transition-colors hover:text-[#1A1A1A]"
                        >
                            문의하기
                        </Link>
                    </div>
                </div>
                <div className="mt-8 border-t border-[rgba(34,42,53,0.08)] pt-3 lg:pt-6">
                    {/* 1024 미만은 행 자체를 44px로, 이상은 줄 높이를 그대로 두고 히트 영역만 넓힌다. */}
                    <nav
                        aria-label="법적 고지"
                        className="mb-2 grid grid-cols-2 justify-items-start gap-x-4 text-[14px] leading-[1.6] text-[#4A4A4A] md:flex md:flex-wrap md:gap-x-6 lg:mb-5"
                    >
                        {documents.map((document) => (
                            <Link
                                key={document.slug}
                                href={document.path}
                                // 개인정보 처리방침은 다른 고지와 구별되게 표시해야 한다(개인정보보호법 시행령 제31조 제3항).
                                // hover 때 생기는 밑줄·글자색을 키보드 포커스에도 같이 준다.
                                className={cn(
                                    'inline-flex min-h-11 items-center underline-offset-4 transition-colors hover:text-[#1A1A1A] hover:underline focus-visible:text-[#1A1A1A] focus-visible:underline lg:-my-3 lg:min-h-0 lg:py-3',
                                    document.slug === 'privacy-seller' && 'font-semibold text-[#1A1A1A]',
                                )}
                            >
                                {document.label}
                            </Link>
                        ))}
                    </nav>
                    <address className="not-italic">
                        <div className="space-y-1.5 text-[13px] leading-[1.5] text-[#5C5C5C]">
                            <p>상호: {company.name}</p>
                            <p>대표자: {company.representative}</p>
                            <p>사업자등록번호: {company.businessRegistrationNumber}</p>
                            <p>통신판매업 신고: {company.mailOrderRegistration}</p>
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
                        <div className="mt-3 flex flex-wrap justify-start gap-2">
                            <a href={`tel:${company.phone}`} className={CONTACT_CHIP_CLASS}>
                                <Phone className="size-3.5" aria-hidden="true" />
                                <span className="sr-only">연락처 </span>
                                {company.phone}
                            </a>
                            <a href={`mailto:${company.email}`} className={CONTACT_CHIP_CLASS}>
                                <Mail className="size-3.5" aria-hidden="true" />
                                <span className="sr-only">이메일 </span>
                                {company.email}
                            </a>
                        </div>
                    </address>
                    <p className="mt-3 text-[13px] leading-[1.5] text-[#5C5C5C]">
                        © {new Date().getFullYear()} {company.name}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export { Footer };
