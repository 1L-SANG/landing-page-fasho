import { useEffect, useRef, useState } from 'react';
import { TrendingDown, Zap, Star, Plus } from 'lucide-react';
import { GradientBorderContainer } from './GradientBorderContainer';

export function ResourceSavingsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: TrendingDown,
      value: '90%',
      label: '비용 절감',
      description: '기존 대비 의류컷 제작 비용',
      color: 'from-[#12ADE6] to-[#4C63FC]',
    },
    {
      icon: Zap,
      value: '10배',
      label: '속도 향상',
      description: '압도적으로 빨라지는 제작 속도',
      color: 'from-[#4C63FC] to-[#DC4CFC]',
    },
    {
      icon: Star,
      value: '4.9',
      label: '고객 만족도',
      description: '5점 만점 (베타테스터 기준)',
      color: 'from-[#DC4CFC] to-[#FF0080]',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6"
      style={{
        backgroundColor: 'rgba(250, 250, 250, 0.6)',
        backdropFilter: 'blur(30px)',
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Plus Icon */}
        <div
          className={`flex justify-center mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        >
          <div className="relative">
            <Plus 
              size={80} 
              className="text-[#1A1A1A]" 
              strokeWidth={2.5}
            />
            <div 
              className="absolute inset-0 blur-xl opacity-30"
              style={{
                background: 'linear-gradient(135deg, #12ADE6, #4C63FC, #DC4CFC, #FF0080)',
              }}
            />
          </div>
        </div>

        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <h2 className="text-[32px] md:text-[42px] font-bold text-[#1A1A1A] mb-4">
            리소스 대폭 절감
          </h2>
          <p className="text-[18px] text-[#6B6B6B] max-w-[600px] mx-auto">
            Wearless로 촬영 리소스를 획기적으로 줄이고,
            <br />
            비즈니스 성장에 집중하세요.
          </p>
        </div>

        {/* Stats Grid */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <GradientBorderContainer>
            <div className="grid md:grid-cols-3 gap-0 bg-white overflow-hidden">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className={`relative p-10 md:p-12 text-center group hover:bg-gradient-to-br hover:from-[#FAFAFA] hover:to-white transition-all duration-300 ${
                      index !== stats.length - 1 ? 'md:border-r border-[#E5E5E5]' : ''
                    }`}
                    style={{
                      transitionDelay: `${300 + index * 100}ms`,
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    }}
                  >
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${
                              stat.color.includes('12ADE6') ? '#12ADE6' : 
                              stat.color.includes('4C63FC') ? '#4C63FC' : '#DC4CFC'
                            }, ${
                              stat.color.includes('4C63FC') && stat.color.includes('DC4CFC') ? '#DC4CFC' : 
                              stat.color.includes('DC4CFC') ? '#FF0080' : '#4C63FC'
                            })`,
                          }}
                        >
                          <Icon size={32} className="text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>

                    {/* Value */}
                    <div className="mb-3">
                      <div
                        className="text-[48px] md:text-[56px] font-bold bg-gradient-to-r bg-clip-text text-transparent leading-none"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${
                            stat.color.includes('12ADE6') ? '#12ADE6' : 
                            stat.color.includes('4C63FC') ? '#4C63FC' : '#DC4CFC'
                          }, ${
                            stat.color.includes('4C63FC') && stat.color.includes('DC4CFC') ? '#DC4CFC' : 
                            stat.color.includes('DC4CFC') ? '#FF0080' : '#4C63FC'
                          })`,
                        }}
                      >
                        {stat.value}
                      </div>
                    </div>

                    {/* Label */}
                    <h3 className="text-[20px] md:text-[22px] font-bold text-[#1A1A1A] mb-2">
                      {stat.label}
                    </h3>

                    {/* Description */}
                    <p className="text-[15px] text-[#6B6B6B]">
                      {stat.description}
                    </p>

                    {/* Hover Effect Line */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                      style={{
                        backgroundImage: `linear-gradient(90deg, ${
                          stat.color.includes('12ADE6') ? '#12ADE6' : 
                          stat.color.includes('4C63FC') ? '#4C63FC' : '#DC4CFC'
                        }, ${
                          stat.color.includes('4C63FC') && stat.color.includes('DC4CFC') ? '#DC4CFC' : 
                          stat.color.includes('DC4CFC') ? '#FF0080' : '#4C63FC'
                        })`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </GradientBorderContainer>
        </div>
      </div>
    </section>
  );
}