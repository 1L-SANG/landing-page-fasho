import logo from 'figma:asset/a20315f6c3d80f16a9b2996e0d41255eb02377ae.png';

export function Footer() {
  return (
    <footer 
      className="relative px-6 py-12" 
      style={{ 
        backgroundColor: 'rgba(250, 250, 250, 0.6)', 
        backdropFilter: 'blur(30px)',
        borderTop: '1px solid rgba(107, 107, 107, 0.2)'
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Single Row Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left - Logo & Tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <img src={logo} alt="Wearless Logo" className="w-7 h-7 object-contain" />
              <span className="text-[20px] font-bold text-[#1A1A1A]">Wearless</span>
            </div>
            <p className="text-[14px] text-[#9E9E9E]">쇼핑몰 촬영의 새로운 기준</p>
          </div>

          {/* Center - Company Info */}
          <div className="text-center text-[13px] text-[#6B6B6B] space-y-1">
            <p>대표자: 정일상</p>
            <p>이메일: contact@wearless.ai</p>
          </div>

          {/* Right - Links & Copyright */}
          <div className="text-center md:text-right space-y-2">
            <div className="flex items-center gap-2 text-[14px] text-[#6B6B6B] justify-center md:justify-end">
              <a href="#contact" className="hover:text-[#1A1A1A] transition-colors">
                문의하기
              </a>
            </div>
            <p className="text-[13px] text-[#9E9E9E]">
              © 2026 Wearless. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}