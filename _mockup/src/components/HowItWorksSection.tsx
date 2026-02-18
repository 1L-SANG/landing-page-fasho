import { useEffect, useRef, useState } from 'react';
import { Upload, Sliders, Sparkles, Download } from 'lucide-react';

const steps = [
  {
    number: '1',
    title: '제품 사진 업로드',
    description: '스마트폰으로 찍은 사진으로도 충분해요.',
    icon: Upload,
  },
  {
    number: '2',
    title: '기능 선택',
    description: 'Wearless의 다양한 기능들 중, 원하는 기능을 사용해보세요.',
    icon: Sliders,
  },
  {
    number: '3',
    title: 'AI 이미지 생성',
    description: '구도, 포즈, 디테일을 직관적으로 수정하며 완성도를 높이세요.',
    icon: Sparkles,
  },
  {
    number: '4',
    title: '결과물 다운로드',
    description: '결과물을 바로 다운로드해서\n쇼핑몰에 적용하세요.',
    icon: Download,
  },
];

export function HowItWorksSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section ref={sectionRef} className="relative py-24 md:py-32 px-6" style={{ backgroundColor: 'rgba(245, 245, 247, 0.6)', backdropFilter: 'blur(30px)' }}>
      {/* Top Border */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: 'rgba(235, 230, 220, 0.5)',
        }}
      />
      
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-[13px] font-semibold text-[#9E9E9E] tracking-[0.12em] uppercase mb-4">
            HOW IT WORKS
          </div>
          <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-[#1A1A1A] mb-4">
            쉬운 사용법, 남다른 퀄리티
          </h2>
          <p className="text-[18px] text-[#6B6B6B] max-w-[560px] mx-auto">
            복잡한 설정 없이, 업로드부터 결과물까지 단 3분이면 충분합니다.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1100px] mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className={`relative group transition-all duration-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                {/* Gradient Border Container */}
                <div className="relative rounded-[20px] p-[1px] bg-gradient-to-br from-[#1A1A1A] via-[#4A4A4A] to-[#6B6B6B] group-hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
                  {/* Inner Content */}
                  <div className="relative bg-white rounded-[20px] p-8 group-hover:-translate-y-2 transition-all duration-300">
                    {/* Step Icon */}
                    <div className="mb-5">
                      <Icon size={48} className="text-[#9E9E9E] group-hover:text-[#1A1A1A] transition-colors" strokeWidth={1.5} />
                    </div>

                    {/* Step Number */}
                    <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-5">
                      <span className="text-white text-[16px] font-bold">{step.number}</span>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-[20px] font-semibold text-[#1A1A1A] mb-3">{step.title}</h3>

                    {/* Step Description */}
                    <p className="text-[15px] text-[#6B6B6B] leading-[1.6] whitespace-pre-line">{step.description}</p>

                    {/* Arrow connector (except last item on desktop) */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-[#E5E5E5] text-2xl z-10">
                        →
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}