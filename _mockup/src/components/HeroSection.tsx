import { Play, ChevronDown } from 'lucide-react';
import { GradientBorderContainer } from './GradientBorderContainer';
import { motion } from 'motion/react';
import { useVideoAutoplay } from './useVideoAutoplay';

export function HeroSection() {
  const videoRef = useVideoAutoplay();

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-[72px] pb-12">
      {/* Hero Text */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-[720px] mb-8">
        {/* Stats Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full mb-6 border border-[#E5E5E5] shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[13px] font-medium text-[#4A4A4A] tracking-tight">
            <span className="font-bold bg-gradient-to-r from-[#12ADE6] via-[#4C63FC] to-[#DC4CFC] bg-clip-text text-transparent">
              200+개
            </span>
            {' '}쇼핑몰들이 Wearless와 함께합니다.
          </span>
        </motion.div>

        <motion.h1
          className="text-[34px] md:text-[48px] lg:text-[56px] font-bold leading-[1.1] tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-[#1A1A1A]">
            촬영에 힘 쏟지 마세요.
            <br />
            쇼핑몰 대표님만을 위한 AI
          </span>
          <br />
          <span 
            className="relative inline-block"
            style={{
              background: 'linear-gradient(135deg, rgba(18, 173, 230, 0.15), rgba(76, 99, 252, 0.15), rgba(220, 76, 252, 0.15))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 40px rgba(76, 99, 252, 0.3)',
              filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2))',
            }}
          >
            Wearless
            {/* Strong outline for readability */}
            <span 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #12ADE6, #4C63FC, #DC4CFC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mixBlendMode: 'multiply',
                opacity: 0.7,
              }}
            >
              Wearless
            </span>
          </span>
        </motion.h1>

        <motion.p
          className="text-[18px] md:text-[20px] text-[#3A3A3A] leading-[1.7] max-w-[540px] mb-10 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          스튜디오, 모델, 조명 없이. 제품 사진만 찍으세요.
        </motion.p>

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <button
            onClick={scrollToContact}
            className="px-10 py-4 bg-[#1A1A1A] text-white text-[17px] font-semibold rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:bg-[#333333] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all"
          >
            지금 시작하기
          </button>
        </motion.div>
      </div>

      {/* Demo Video */}
      <motion.div
        className="relative z-10 w-full max-w-[900px] mt-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <GradientBorderContainer>
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
        </GradientBorderContainer>
      </motion.div>

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