'use client';

import { useEffect, useState } from 'react';

const LuminousOrbBackground = () => {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            if (scrollY < windowHeight) {
                setOpacity(1);
            } else {
                const fadeAmount = Math.min((scrollY - windowHeight) / (windowHeight * 2), 0.3);
                setOpacity(1 - fadeAmount);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
            style={{ opacity }}
        >
            {/* Layer 1 - Blue/Purple */}
            <div
                className="absolute h-[300px] w-[300px] rounded-full md:h-[600px] md:w-[600px]"
                style={{
                    background: 'conic-gradient(#12ADE6, #4C63FC, #12ADE6)',
                    filter: 'blur(60px)',
                    opacity: 0.4,
                    animation: 'spin 10.8s linear infinite',
                }}
            />

            {/* Layer 2 - Multi-color */}
            <div
                className="absolute h-[250px] w-[250px] rounded-full md:h-[500px] md:w-[500px]"
                style={{
                    background:
                        'conic-gradient(#FF0080, #EE00FF, #00A6FF, #4797FF, #FF8000, #FF00CC, #FF0080)',
                    filter: 'blur(50px)',
                    opacity: 0.35,
                    animation: 'spin 16.2s linear infinite reverse',
                }}
            />

            {/* Layer 3 - Magenta/Cyan/White */}
            <div
                className="absolute h-[200px] w-[200px] rounded-full md:h-[400px] md:w-[400px]"
                style={{
                    background: 'conic-gradient(#DC4CFC, #12B4E6, #FFFFFF, #DC4CFC)',
                    filter: 'blur(45px)',
                    opacity: 0.45,
                    animation: 'spin 13.5s linear infinite',
                }}
            />

            {/* Center Highlight */}
            <div
                className="absolute h-[100px] w-[100px] rounded-full md:h-[200px] md:w-[200px]"
                style={{
                    background: 'radial-gradient(white 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
            />
        </div>
    );
};

export { LuminousOrbBackground };
