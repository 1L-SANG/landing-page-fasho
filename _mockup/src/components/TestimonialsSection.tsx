import { useEffect, useRef, useState } from 'react';
import { GradientBorderContainer } from './GradientBorderContainer';
import { Star, TrendingUp, Zap, RefreshCw, DollarSign } from 'lucide-react';
import teenzLogo from 'figma:asset/077ec9fc387acf5d82be7f6a2c50665e563a1493.png';
import ekoLogo from 'figma:asset/778ce433bc4b6ee46f014cc8fb8cedb0cac3d6e5.png';
import oacLogo from 'figma:asset/1d48ae2561f1f9a815579a2e0b18eacd0e94f154.png';

const testimonials = [
  {
    rating: 5,
    quote: '적자가 심해서 쇼핑몰을 포기할까 한참 고민했었어요.\nwearless 덕분에 오히려 지금은 매출이 최고점인 상태입니다.',
    name: '임가현 대표',
    logo: teenzLogo,
  },
  {
    rating: 5,
    quote: 'AI 느낌 날까 봐 걱정했는데, 생각보다 자연스러워서 놀랐어요..!\n확실히 퀄리티 차이가 납니다.',
    name: '김태린 대표',
    logo: ekoLogo,
  },
  {
    rating: 5,
    quote: '제가 찍은 컷들을 바탕으로 다양하게\n생성되는게 진짜 미친 기능인거 같아요.',
    name: '강민지 대표',
    logo: oacLogo,
  },
];

export function TestimonialsSection() {
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

  return (
    <section className="relative py-24 md:py-32 px-6" style={{ backgroundColor: 'rgba(245, 245, 247, 0.6)', backdropFilter: 'blur(30px)' }}>
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
            TESTIMONIALS
          </div>
          <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-[#1A1A1A] mb-4">
            셀러들의 실제 반응
          </h2>
          <p className="text-[18px] text-[#6B6B6B] max-w-[560px] mx-auto">
            베타테스터 이후 일부 대표님들이 남겨주신 후기입니다. (25.11)
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 max-w-[1100px] mx-auto items-stretch">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`transition-all duration-600 flex ${
                visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              <GradientBorderContainer innerClassName="bg-white w-full h-full flex">
                <div className="p-8 hover:-translate-y-1 transition-transform duration-300 flex flex-col w-full">
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} size={18} className="text-[#FFB800] fill-[#FFB800]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-[18px] font-medium text-[#1A1A1A] leading-[1.7] mb-6 whitespace-pre-line flex-1">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Profile */}
                  <div className="flex items-center gap-3">
                    <img 
                      src={testimonial.logo} 
                      alt={`${testimonial.name} logo`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-[16px] font-semibold text-[#1A1A1A]">{testimonial.name}</div>
                    </div>
                  </div>
                </div>
              </GradientBorderContainer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}