'use client';

import { LuminousOrbBackground } from '@/components/posts/luminous-orb-background';
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

      <HeroSection />
      <FeaturesSection />
      <ResourceSavingsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <ContactSection />
      <FAQSection />
    </div>
  );
};

export default HomePage;
