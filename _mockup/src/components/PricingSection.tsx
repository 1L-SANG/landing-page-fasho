import { useEffect, useRef, useState } from 'react';
import { GradientBorderContainer } from './GradientBorderContainer';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '무료',
    features: [
      'Wearless 1.0 (Beta) 기능',
      '월 생성횟수 10회',
    ],
    isRecommended: false,
  },
  {
    name: 'Pro',
    price: '₩29,900',
    period: '/월',
    features: [
      'Wearless 2.0 모든 기능',
      '월 생성횟수 200회',
      '2k 해상도 다운로드',
      '워터마크 없음',
    ],
    isRecommended: true,
  },
  {
    name: 'Seller',
    price: '₩49,900',
    period: '/월',
    features: [
      'Wearless 2.0 모든 기능',
      '월 생성횟수 500회',
      '4k 해상도 다운로드',
      '워터마크 없음',
    ],
    isRecommended: false,
  },
  {
    name: 'Enterprise',
    price: '맞춤 견적',
    period: '',
    features: [
      '상담 문의'
    ],
    isRecommended: false,
  },
];

export function PricingSection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => [...new Set([...prev, index])]);
          }
        },
        { threshold: 0.15 }
      );

      if (ref) observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" className="relative py-24 md:py-32 px-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(30px)' }}>
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
            PRICING
          </div>
          <h2 className="text-[32px] md:text-[36px] lg:text-[48px] font-bold text-[#1A1A1A] mb-4">
            합리적인 요금제
          </h2>
          <p className="text-[18px] text-[#6B6B6B] max-w-[560px] mx-auto">
            비즈니스 규모에 맞는 플랜을 선택하세요.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`relative transition-all duration-600 ${
                visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } ${plan.isRecommended ? 'md:scale-105' : ''}`}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {/* Recommended Badge */}
              {plan.isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1.5 bg-[#1A1A1A] rounded-full">
                    <span className="text-[12px] font-semibold text-white tracking-wide">
                      MOST POPULAR
                    </span>
                  </div>
                </div>
              )}

              {plan.isRecommended ? (
                <GradientBorderContainer innerClassName="bg-white">
                  <div className="p-10 relative">
                    {/* Plan Name */}
                    <div className="text-[16px] font-semibold text-[#1A1A1A] mb-3">{plan.name}</div>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-[36px] font-extrabold text-[#1A1A1A]">{plan.price}</span>
                      <span className="text-[16px] text-[#9E9E9E]">{plan.period}</span>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[#F0F0F0] mb-6" />

                    {/* Features */}
                    <ul className="space-y-3.5 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check size={18} className="text-[#1A1A1A] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                          <span className="text-[15px] text-[#6B6B6B]">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={scrollToContact}
                      className="w-full py-3.5 bg-[#1A1A1A] text-white text-[16px] font-semibold rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:bg-[#333333] hover:-translate-y-0.5 transition-all"
                    >
                      시작하기
                    </button>
                  </div>
                </GradientBorderContainer>
              ) : (
                <div className="bg-white border-[1.5px] border-[#E5E5E5] rounded-[20px] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:border-[#1A1A1A] transition-all">
                  {/* Plan Name */}
                  <div className="text-[16px] font-semibold text-[#6B6B6B] mb-3">{plan.name}</div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-[36px] font-extrabold text-[#1A1A1A]">{plan.price}</span>
                    <span className="text-[16px] text-[#9E9E9E]">{plan.period}</span>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#F0F0F0] mb-6" />

                  {/* Features */}
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check size={18} className="text-[#1A1A1A] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                        <span className="text-[15px] text-[#6B6B6B]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={scrollToContact}
                    className="w-full py-3.5 border-[1.5px] border-[#E5E5E5] text-[#1A1A1A] text-[16px] font-medium rounded-xl hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all"
                  >
                    {plan.name === 'Enterprise' ? '문의하기' : '시작하기'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}