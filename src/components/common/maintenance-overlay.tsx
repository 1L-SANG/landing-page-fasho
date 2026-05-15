'use client';

import { useEffect, useState, type FormEvent } from 'react';

const MaintenanceOverlay = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = original;
        };
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (status === 'loading') return;

        setStatus('loading');
        setErrorMsg('');

        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const data: { error?: string } = await res.json().catch(() => ({}));
                throw new Error(data.error || '신청 중 오류가 발생했습니다.');
            }

            setStatus('success');
            setEmail('');
        } catch (err) {
            setStatus('error');
            setErrorMsg(err instanceof Error ? err.message : '오류가 발생했습니다.');
        }
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center px-6"
            style={{
                backdropFilter: 'blur(10px) saturate(1.1)',
                WebkitBackdropFilter: 'blur(10px) saturate(1.1)',
                background: 'rgba(250, 250, 250, 0.25)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="서비스 업데이트 안내"
        >
            <div
                className="w-full max-w-[560px] text-center animate-fade-in rounded-3xl border border-white/60 px-8 py-10 md:px-12 md:py-12"
                style={{
                    background: 'rgba(255, 255, 255, 0.72)',
                    backdropFilter: 'blur(24px) saturate(1.6)',
                    WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
                    boxShadow: '0 20px 60px -20px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.4) inset',
                }}
            >
                <h1 className="text-[26px] md:text-[34px] font-bold leading-[1.3] text-[#1A1A1A]">
                    더 나은 서비스로 찾아뵙기 위해{'\n'}업데이트중입니다.
                </h1>
                <p className="mt-5 text-[15px] md:text-[17px] text-[#6B6B6B] leading-relaxed">
                    6월 중 새로운 wearless로 찾아올 예정입니다.
                </p>

                <div className="mt-8">
                    {status === 'success' ? (
                        <div
                            className="rounded-2xl border border-[#E5E5E5] bg-white/85 px-6 py-5 whitespace-normal"
                            style={{ backdropFilter: 'blur(12px)' }}
                        >
                            <p className="text-[15px] font-medium text-[#1A1A1A]">
                                waitlist에 등록되었습니다.
                            </p>
                            <p className="mt-1 text-[13px] text-[#6B6B6B]">
                                새로운 소식이 준비되면 가장 먼저 알려드릴게요.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <p className="text-[13px] text-[#6B6B6B]">
                                새 소식을 가장 먼저 받아보세요
                            </p>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                    placeholder="이메일 주소"
                                    disabled={status === 'loading'}
                                    aria-label="이메일 주소"
                                    className="flex-1 rounded-full border border-[#E5E5E5] bg-white/90 px-5 py-3 text-[15px] text-[#1A1A1A] placeholder:text-[#9E9E9E] outline-none transition-colors focus:border-[#1A1A1A] disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="rounded-full bg-[#1A1A1A] px-6 py-3 text-[15px] font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                                >
                                    {status === 'loading' ? '등록 중...' : 'Waitlist 등록'}
                                </button>
                            </div>
                            {status === 'error' && errorMsg && (
                                <p className="mt-1 text-[13px] text-[#D4183D]">{errorMsg}</p>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export { MaintenanceOverlay };
