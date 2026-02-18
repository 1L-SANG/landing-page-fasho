'use client';

import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
    const handleGoBack = () => {
        window.history.back();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="flex min-h-[calc(100vh-132px)] flex-col items-center justify-center px-6 py-24">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-2">
                <Image
                    src="/logo.png"
                    alt="Wearless Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                />
            </div>

            {/* 404 Text */}
            <h1 className="mb-3 text-[72px] font-bold text-[#1A1A1A] leading-none">
                404
            </h1>
            <h2 className="mb-2 text-[24px] font-semibold text-[#1A1A1A]">
                페이지를 찾을 수 없습니다
            </h2>
            <p className="mb-10 max-w-[400px] text-center text-[16px] text-[#6B6B6B] leading-[1.6]">
                요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    onClick={handleGoBack}
                    className="flex items-center justify-center gap-2 rounded-full border-[1.5px] border-[#E5E5E5] px-8 py-3 text-[16px] font-medium text-[#6B6B6B] transition-all hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                    aria-label="이전 페이지로 돌아가기"
                    tabIndex={0}
                >
                    <ArrowLeft size={18} aria-hidden="true" />
                    뒤로 가기
                </button>
                <button
                    onClick={handleGoHome}
                    className="rounded-full bg-[#1A1A1A] px-8 py-3 text-[16px] font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#333333]"
                    aria-label="홈으로 이동"
                    tabIndex={0}
                >
                    홈으로 이동
                </button>
            </div>
        </div>
    );
};

export default NotFound;
