import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logo from 'figma:asset/a20315f6c3d80f16a9b2996e0d41255eb02377ae.png';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/80' : 'bg-white/70'
        }`}
        style={{
          backdropFilter: 'blur(20px) saturate(1.8)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-[72px] max-md:h-[60px] flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="Wearless Logo" className="w-9 h-9 object-contain" />
            <span className="text-[20px] font-bold text-[#1A1A1A]">Wearless</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <button
              onClick={() => scrollToSection('home')}
              className="text-[16px] font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors relative group"
            >
              홈
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#1A1A1A] transition-all group-hover:w-full" />
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-[16px] font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors relative group"
            >
              주요 기능
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#1A1A1A] transition-all group-hover:w-full" />
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-[16px] font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors relative group"
            >
              요금제
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#1A1A1A] transition-all group-hover:w-full" />
            </button>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scrollToSection('contact')}
              className="px-6 py-2.5 rounded-full bg-[#1A1A1A] text-white text-[15px] font-semibold hover:bg-[#333333] hover:-translate-y-0.5 transition-all shadow-lg"
            >
              시작하기
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-6 py-2.5 rounded-full border-[1.5px] border-[#E5E5E5] text-[#6B6B6B] text-[15px] font-medium hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all"
            >
              문의하기
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#1A1A1A] p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#FAFAFA] md:hidden animate-fade-in">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-[24px] font-semibold text-[#1A1A1A]"
            >
              홈
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-[24px] font-semibold text-[#1A1A1A]"
            >
              주요 기능
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-[24px] font-semibold text-[#1A1A1A]"
            >
              요금제
            </button>
            <div className="flex flex-col gap-4 mt-8 w-full max-w-xs px-6">
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full px-6 py-3.5 rounded-full bg-[#1A1A1A] text-white text-[16px] font-semibold shadow-lg"
              >
                시작하기
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full px-6 py-3.5 rounded-full border-[1.5px] border-[#E5E5E5] text-[#6B6B6B] text-[16px] font-medium"
              >
                문의하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}