import { useEffect, useRef, useState } from 'react';
import { GradientBorderContainer } from './GradientBorderContainer';
import { Lock, Mail, Phone, User } from 'lucide-react';

export function ContactSection() {
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

  const handleStartClick = () => {
    const heroSection = document.getElementById('home');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-[#1A1A1A] py-24 md:py-32 px-6"
    >
      <div className="max-w-[1200px] mx-auto">
        <div
          className={`transition-all duration-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <GradientBorderContainer innerClassName="bg-[#222222]">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left Side - Contact Info */}
              <div className="p-10 md:p-14 border-r border-white/10">
                <h3 className="text-[28px] md:text-[32px] font-bold text-white mb-3">
                  문의하기
                </h3>
                <p className="text-[16px] text-white/60 mb-12">
                  궁금한 점이 있으시다면
                  <br />
                  언제든 연락주세요.
                </p>

                {/* Contact Info - Horizontal Layout */}
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Name */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-white/70" />
                    </div>
                    <div>
                      <div className="text-[13px] text-white/40 font-medium mb-1">
                        담당자
                      </div>
                      <div className="text-[17px] text-white font-medium">
                        정일상 대표
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-white/70" />
                    </div>
                    <div>
                      <div className="text-[13px] text-white/40 font-medium mb-1">
                        이메일
                      </div>
                      <a
                        href="mailto:ilsang@wearless.ai"
                        className="text-[17px] text-white font-medium hover:text-white/80 transition-colors"
                      >
                        ilsang@wearless.ai
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - CTA */}
              <div className="p-10 md:p-14 flex flex-col items-center justify-center text-center">
                <h2 className="text-[28px] md:text-[32px] font-bold text-white mb-3">
                  지금 바로 시작하세요
                </h2>

                <p className="text-[16px] text-white/60 mb-10">
                  Wearless의 혜택을 지금 전부 받아가세요.
                </p>

                <button
                  onClick={handleStartClick}
                  className="mt-8 px-12 py-3 bg-white text-[#1A1A1A] text-[18px] font-semibold rounded-xl hover:bg-white/90 hover:scale-105 transition-all shadow-lg"
                >
                  지금 시작하기
                </button>
              </div>
            </div>
          </GradientBorderContainer>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </section>
  );
}