import { WearlessBackground } from '@/components/background/WearlessBackground';
import { Hero } from '@/components/sections/Hero';
import { TrustStrip } from '@/components/sections/TrustStrip';
import { StudioFlow } from '@/components/sections/StudioFlow';
import { Features } from '@/components/sections/Features';
import { Showcase } from '@/components/sections/Showcase';
import { FinalCTA } from '@/components/sections/FinalCTA';

const HomePage = () => {
  return (
    <div className="relative min-h-screen">
      <WearlessBackground />

      <Hero />
      <TrustStrip />
      <StudioFlow />
      <Features />
      <Showcase />
      <FinalCTA />
    </div>
  );
};

export default HomePage;
