'use client';

import { useEffect, useState } from 'react';

/**
 * Fixed full-bleed background: one center orb + side aurora wash, built
 * entirely from the 4 glow tokens. `--glow-a` dims the whole field as the
 * user scrolls past the hero so lower sections read on clean white.
 */
const WearlessBackground = () => {
  const [glowA, setGlowA] = useState(0.72);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight || 1;
      const progress = Math.min(y / vh, 1);
      // Full strength in the hero, fading to a faint wash below the fold.
      const next = 0.72 - progress * 0.5;
      setGlowA(Math.max(0.18, next));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="wearless-bg"
      aria-hidden="true"
      style={{ ['--glow-a' as string]: glowA }}
    >
      <div className="edge" />
      <div className="orb-bg">
        <div className="l1" />
        <div className="l2" />
        <div className="l3" />
        <div className="hi" />
      </div>
    </div>
  );
};

export { WearlessBackground };
