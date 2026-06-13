'use client';

import Image from 'next/image';
import { useState } from 'react';

interface GeneratedImageProps {
  src: string;
  alt: string;
  /** CSS aspect-ratio, e.g. "16 / 10". */
  ratio?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Wraps next/image for the Gemini-generated assets in /public/generated.
 * Renders a token-colored glass skeleton underneath, so a not-yet-generated
 * placeholder (or a slow load) still looks intentional rather than broken.
 */
const GeneratedImage = ({
  src,
  alt,
  ratio = '16 / 10',
  className = '',
  sizes = '(max-width: 768px) 100vw, 900px',
  priority = false,
}: GeneratedImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(120deg, var(--bg-2), #fff 40%, var(--glow-sky) 140%)',
          opacity: loaded ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className="object-cover"
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />
    </div>
  );
};

export { GeneratedImage };
