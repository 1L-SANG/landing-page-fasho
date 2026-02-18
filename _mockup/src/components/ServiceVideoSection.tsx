import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { GradientBorderContainer } from './GradientBorderContainer';
import { useVideoAutoplay } from './useVideoAutoplay';

export function ServiceVideoSection() {
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
    <section ref={sectionRef} className="relative py-24 md:py-32 px-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(30px)' }}>
      {/* Top Border */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: 'rgba(235, 230, 220, 0.5)',
        }}
      />
      
      <div className="max-w-[1200px] mx-auto">
        {/* Video Container */}
        <div
          className={`max-w-[960px] mx-auto transition-all duration-600 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
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
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              </video>
            </div>
          </GradientBorderContainer>
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