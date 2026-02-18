import Image from 'next/image';

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
                {/* Single Row Layout */}
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    {/* Left - Logo & Tagline */}
                    <div className="text-center md:text-left">
                        <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
                            <Image
                                src="/logo.png"
                                alt="Wearless Logo"
                                width={28}
                                height={28}
                                className="object-contain"
                            />
                            <span className="text-[20px] font-bold text-[#1A1A1A]">
                                Wearless
                            </span>
                        </div>
                        <p className="text-[14px] text-[#9E9E9E]">
                            쇼핑몰 촬영의 새로운 기준
                        </p>
                    </div>

                    {/* Center - Company Info */}
                    <div className="space-y-1 text-center text-[13px] text-[#6B6B6B]">
                        <p>대표자: 정일상</p>
                        <p>이메일: <a href="mailto:contact@wearless.ai" className="underline hover:text-[#1A1A1A] transition-colors">contact@wearless.ai</a></p>
                    </div>

                    {/* Right - Links & Copyright */}
                    <div className="space-y-2 text-center md:text-right">
                        <div className="flex items-center justify-center gap-2 text-[14px] text-[#6B6B6B] md:justify-end">
                            <a
                                href="#contact"
                                className="transition-colors hover:text-[#1A1A1A]"
                                tabIndex={0}
                                aria-label="문의하기"
                            >
                                문의하기
                            </a>
                        </div>
                        <p className="text-[13px] text-[#9E9E9E]">
                            © 2026 Wearless. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export { Footer };
