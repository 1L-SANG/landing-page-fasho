import { useEffect, useRef, useState } from 'react';
import { GradientBorderContainer } from './GradientBorderContainer';
import { MonotoneBorderContainer } from './MonotoneBorderContainer';
import { useVideoAutoplay } from './useVideoAutoplay';

const features = [
  {
    position: 'top-left',
    title: '레퍼런스 기반 생성',
    description: '원하는 느낌의 이미지를 구현해보세요.',
  },
  {
    position: 'top-right',
    title: '쇼핑몰 정체성 유지',
    description: '쇼핑몰에서 그동안 업로드하던 컷들의 무드를 반영해보세요.',
  },
  {
    position: 'bottom-left',
    title: '다양한 컷 종류',
    description: '고스트컷부터 디테일컷, 일상컷, 스튜디오컷까지 원하는 컷을 선택하세요.',
  },
  {
    position: 'bottom-right',
    title: '릴스용 템플릿',
    description: '인스타그램에서 인기 있는 릴스들을 선택해서 트렌드에 맞게 AI로 생성해보세요. ',
  },
];

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useVideoAutoplay();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="features" 
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6" 
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(30px)' }}
    >
      {/* Top Border */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: 'rgba(235, 230, 220, 0.5)',
        }}
      />
      
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="text-[13px] font-semibold text-[#9E9E9E] tracking-[0.12em] uppercase mb-4">
            WHY WEARLESS
          </div>
          <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-[#1A1A1A] mb-4">
            왜 Wearless인가요?
          </h2>
          <p className="text-[18px] text-[#6B6B6B] max-w-[560px] mx-auto">
            쇼핑몰 대표님만을 위해 만들어진 서비스니까.
          </p>
        </div>

        {/* Grid Layout: Desktop */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:grid-rows-2 gap-6 max-w-[1400px] mx-auto relative">
          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {/* Top-left to center */}
            <line 
              x1="33%" y1="25%" x2="50%" y2="50%" 
              stroke="url(#gradient1)" 
              strokeWidth="2" 
              strokeDasharray="8,4"
              className={`transition-all duration-1000 ${isVisible ? 'opacity-30' : 'opacity-0'}`}
              style={{ transitionDelay: '500ms' }}
            />
            {/* Top-right to center */}
            <line 
              x1="67%" y1="25%" x2="50%" y2="50%" 
              stroke="url(#gradient2)" 
              strokeWidth="2" 
              strokeDasharray="8,4"
              className={`transition-all duration-1000 ${isVisible ? 'opacity-30' : 'opacity-0'}`}
              style={{ transitionDelay: '600ms' }}
            />
            {/* Bottom-left to center */}
            <line 
              x1="33%" y1="75%" x2="50%" y2="50%" 
              stroke="url(#gradient3)" 
              strokeWidth="2" 
              strokeDasharray="8,4"
              className={`transition-all duration-1000 ${isVisible ? 'opacity-30' : 'opacity-0'}`}
              style={{ transitionDelay: '700ms' }}
            />
            {/* Bottom-right to center */}
            <line 
              x1="67%" y1="75%" x2="50%" y2="50%" 
              stroke="url(#gradient4)" 
              strokeWidth="2" 
              strokeDasharray="8,4"
              className={`transition-all duration-1000 ${isVisible ? 'opacity-30' : 'opacity-0'}`}
              style={{ transitionDelay: '800ms' }}
            />
            
            {/* Gradients */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#12ADE6" />
                <stop offset="100%" stopColor="#4C63FC" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4C63FC" />
                <stop offset="100%" stopColor="#DC4CFC" />
              </linearGradient>
              <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DC4CFC" />
                <stop offset="100%" stopColor="#FF0080" />
              </linearGradient>
              <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF0080" />
                <stop offset="100%" stopColor="#12B4E6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Top Left */}
          <div 
            className={`relative transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
            style={{ transitionDelay: '0ms', zIndex: 2 }}
          >
            <GradientBorderContainer>
              <div className="h-full flex flex-col justify-center bg-white backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-[20px] md:text-[22px] font-bold text-[#1A1A1A] mb-3">
                  {features[0].title}
                </h3>
                <p className="text-[15px] text-[#6B6B6B] leading-[1.7]">
                  {features[0].description}
                </p>
              </div>
            </GradientBorderContainer>
          </div>

          {/* Center Video (spans 2 rows) */}
          <div 
            className="row-span-2 flex items-center justify-center relative"
            style={{
              transition: 'all 0.8s ease-out',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1)' : 'scale(0.95)',
              transitionDelay: '200ms',
              zIndex: 3,
            }}
          >
            <div className="w-full px-4">
              <MonotoneBorderContainer>
                <div className="relative aspect-[16/9] bg-gradient-to-br from-[#F5F5F7] to-[#E5E5E5] overflow-hidden">
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover video-no-controls"
                    muted
                    loop
                    playsInline
                    poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'%3E%3Crect fill='%23F5F5F7' width='1600' height='900'/%3E%3C/svg%3E"
                  >
                    <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
                  </video>
                </div>
              </MonotoneBorderContainer>
            </div>
          </div>

          {/* Top Right */}
          <div 
            className={`relative transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
            style={{ transitionDelay: '100ms', zIndex: 2 }}
          >
            <GradientBorderContainer>
              <div className="h-full flex flex-col justify-center bg-white backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-[20px] md:text-[22px] font-bold text-[#1A1A1A] mb-3">
                  {features[1].title}
                </h3>
                <p className="text-[15px] text-[#6B6B6B] leading-[1.7]">
                  {features[1].description}
                </p>
              </div>
            </GradientBorderContainer>
          </div>

          {/* Bottom Left */}
          <div 
            className={`relative transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
            style={{ transitionDelay: '300ms', zIndex: 2 }}
          >
            <GradientBorderContainer>
              <div className="h-full flex flex-col justify-center bg-white backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-[20px] md:text-[22px] font-bold text-[#1A1A1A] mb-3">
                  {features[2].title}
                </h3>
                <p className="text-[15px] text-[#6B6B6B] leading-[1.7]">
                  {features[2].description}
                </p>
              </div>
            </GradientBorderContainer>
          </div>

          {/* Bottom Right */}
          <div 
            className={`relative transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
            style={{ transitionDelay: '400ms', zIndex: 2 }}
          >
            <GradientBorderContainer>
              <div className="h-full flex flex-col justify-center bg-white backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-[20px] md:text-[22px] font-bold text-[#1A1A1A] mb-3">
                  {features[3].title}
                </h3>
                <p className="text-[15px] text-[#6B6B6B] leading-[1.7]">
                  {features[3].description}
                </p>
              </div>
            </GradientBorderContainer>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-12 max-w-[600px] mx-auto">
          {/* Video First on Mobile */}
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <GradientBorderContainer>
              <div className="relative aspect-[9/16] bg-gradient-to-br from-[#F5F5F7] to-[#E5E5E5] overflow-hidden max-h-[500px] mx-auto">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover video-no-controls"
                  muted
                  loop
                  playsInline
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='1600'%3E%3Crect fill='%23F5F5F7' width='900' height='1600'/%3E%3C/svg%3E"
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
                </video>
              </div>
            </GradientBorderContainer>
          </div>

          {/* Features List */}
          {features.map((feature, index) => {
            const gradients = [
              'from-[#12ADE6] to-[#4C63FC]',
              'from-[#4C63FC] to-[#DC4CFC]',
              'from-[#DC4CFC] to-[#FF0080]',
              'from-[#FF0080] to-[#12B4E6]',
            ];
            
            return (
              <div 
                key={index}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                <div className="bg-white/80 backdrop-blur-sm border-2 border-[#E5E5E5] rounded-2xl p-6 shadow-lg">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${gradients[index]} mb-4 mx-auto`}>
                    <span className="text-white font-bold text-sm">{`0${index + 1}`}</span>
                  </div>
                  <h3 className="text-[22px] md:text-[26px] font-bold text-[#1A1A1A] mb-3 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-[16px] text-[#6B6B6B] leading-[1.7] text-center">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .video-no-controls::-webkit-media-controls {
          display: none !important;
        }
        .video-no-controls::-webkit-media-controls-enclosure {
          display: none !important;
        }
        .video-no-controls::-webkit-media-controls-panel {
          display: none !important;
        }
        .video-no-controls::-webkit-media-controls-play-button {
          display: none !important;
        }
        .video-no-controls::-webkit-media-controls-start-playback-button {
          display: none !important;
        }
        .video-no-controls {
          pointer-events: none;
        }
      `}</style>
    </section>
  );
}