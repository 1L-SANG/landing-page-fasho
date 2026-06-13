import Image from 'next/image';

const Footer = () => {
    return (
        <footer
            className="relative z-10 px-6 py-12"
            style={{
                backgroundColor: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 -1px 0 0 var(--ring)',
            }}
        >
            <div className="mx-auto max-w-[var(--container)]">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    {/* Logo & tagline */}
                    <div className="text-center md:text-left">
                        <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
                            <Image
                                src="/logo.png"
                                alt="Wearless"
                                width={20}
                                height={20}
                                className="object-contain"
                            />
                            <span className="font-display text-[18px] text-[var(--fg-1)] whitespace-normal">
                                Wearless
                            </span>
                        </div>
                        <p className="text-[13px] text-[var(--fg-3)]">
                            AI 상세페이지 제작 스튜디오
                        </p>
                    </div>

                    {/* Company info */}
                    <div className="space-y-1 text-center text-[13px] text-[var(--fg-2)]">
                        <p>대표자: 정일상</p>
                        <p>
                            이메일:{' '}
                            <a
                                href="mailto:contact@wearless.kr"
                                className="underline underline-offset-2 transition-colors hover:text-[var(--fg-1)]"
                            >
                                contact@wearless.kr
                            </a>
                        </p>
                    </div>

                    {/* Copyright */}
                    <div className="text-center md:text-right">
                        <p className="text-[12px] text-[var(--fg-3)]">
                            © 2026 Wearless. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export { Footer };
