'use client';

import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
                    src="/logo.svg"
                    alt="Wearless 로고"
                    width={32}
                    height={32}
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
                <Button variant="outline" size="md" onClick={handleGoBack}>
                    <ArrowLeft size={18} aria-hidden="true" />
                    뒤로 가기
                </Button>
                <Button variant="primary" size="md" onClick={handleGoHome}>
                    홈으로 이동
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
