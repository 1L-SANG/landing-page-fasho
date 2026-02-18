import { useEffect, useState } from 'react';

export function LuminousOrbBackground() {
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // 첫 화면에서는 opacity 1, 스크롤해도 최소 0.5 유지
      if (scrollY < windowHeight) {
        setScrollOpacity(1);
      } else {
        // 스크롤이 진행되어도 0.5 ~ 0.7 사이 유지
        const fadeStart = windowHeight;
        const fadeDistance = windowHeight * 2;
        const fadeProgress = Math.min((scrollY - fadeStart) / fadeDistance, 1);
        setScrollOpacity(1 - (fadeProgress * 0.3)); // 최대 30%만 감소 (0.7까지)
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden"
      style={{ opacity: scrollOpacity }}
    >
      <div className="relative">
        {/* Layer 1 - Blue/Purple gradient */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[600px] md:h-[600px] max-md:w-[300px] max-md:h-[300px] rounded-full opacity-60 max-md:opacity-40"
          style={{
            background: 'conic-gradient(from 0deg, #12ADE6, #4C63FC, #12ADE6)',
            filter: 'blur(60px)',
            animation: 'spin 10.8s linear infinite',
          }}
        />

        {/* Layer 2 - Rainbow gradient */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[500px] md:h-[500px] max-md:w-[250px] max-md:h-[250px] rounded-full opacity-50 max-md:opacity-35"
          style={{
            background: 'conic-gradient(from 0deg, #FF0080, #EE00FF, #00A6FF, #4797FF, #FF8000, #FF00CC, #FF0080)',
            filter: 'blur(50px)',
            animation: 'spin-reverse 16.2s linear infinite',
          }}
        />

        {/* Layer 3 - Purple/Blue/White gradient */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[400px] md:h-[400px] max-md:w-[200px] max-md:h-[200px] rounded-full opacity-70 max-md:opacity-45"
          style={{
            background: 'conic-gradient(from 0deg, #DC4CFC, #12B4E6, #FFFFFF, #DC4CFC)',
            filter: 'blur(45px)',
            animation: 'spin 13.5s linear infinite',
          }}
        />

        {/* Center highlight */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[200px] md:h-[200px] max-md:w-[100px] max-md:h-[100px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes spin-reverse {
            from {
              transform: rotate(360deg);
            }
            to {
              transform: rotate(0deg);
            }
          }
        `
      }} />
    </div>
  );
}