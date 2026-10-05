'use client';

import { LuminousOrbBackground } from '@/components/posts/luminous-orb-background';
import { AuroraEdges } from '@/components/posts/aurora-edges';
import { HeroSection } from '@/components/posts/hero-section';
import { FeaturesSection } from '@/components/posts/features-section';
import { ResourceSavingsSection } from '@/components/posts/resource-savings-section';
import { HowItWorksSection } from '@/components/posts/how-it-works-section';
import { TestimonialsSection } from '@/components/posts/testimonials-section';
import { PricingSection } from '@/components/posts/pricing-section';
import { ContactSection } from '@/components/posts/contact-section';
import { FAQSection } from '@/components/posts/faq-section';

const HomePage = () => {
  return (
    <div className="relative min-h-screen">
      <LuminousOrbBackground />
      <AuroraEdges />

      {/* 밝은 섹션은 배경 A rgba(255,255,255,0.5) / B rgba(245,245,247,0.6)를 번갈아 쓴다(Features A부터, 푸터 A). 상단선은 모두 line-soft. */}
      <HeroSection />
      <FeaturesSection />
      <ResourceSavingsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      {/* FAQ가 남은 의문을 푼 직후 최종 CTA(Contact)로 페이지를 끝낸다. */}
      <FAQSection />
      <ContactSection />
    </div>
  );
};

export default HomePage;
