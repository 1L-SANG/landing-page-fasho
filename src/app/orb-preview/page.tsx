'use client';

import { useEffect } from 'react';
import { WearlessBackground } from '@/components/background/WearlessBackground';

export default function OrbPreviewPage() {
  useEffect(() => {
    document.body.classList.add('orb-preview-mode');
    return () => document.body.classList.remove('orb-preview-mode');
  }, []);

  return (
    <>
      <style jsx global>{`
        body.orb-preview-mode nav,
        body.orb-preview-mode footer {
          display: none !important;
        }
      `}</style>
      <div className="relative min-h-screen overflow-hidden">
        <WearlessBackground />
      </div>
    </>
  );
}
