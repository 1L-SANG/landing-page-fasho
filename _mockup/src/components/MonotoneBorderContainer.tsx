import { ReactNode } from 'react';

interface MonotoneBorderContainerProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}

export function MonotoneBorderContainer({ children, className = '', innerClassName = '' }: MonotoneBorderContainerProps) {
  return (
    <div
      className={`monotone-border-wrapper group ${className}`}
      style={{
        padding: '2px',
        borderRadius: '24px',
        background: 'conic-gradient(from 180deg, #1A1A1A, #4A4A4A, #6B6B6B, #9E9E9E, #6B6B6B, #4A4A4A, #1A1A1A)',
        transition: 'all 300ms ease',
      }}
    >
      <div
        className={`monotone-border-inner ${innerClassName}`}
        style={{
          borderRadius: '22px',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .monotone-border-wrapper {
            animation: monotoneShift 8s linear infinite;
          }
          .monotone-border-wrapper:hover {
            padding: 3px;
            box-shadow: 0 0 30px rgba(26, 26, 26, 0.2);
          }
          @keyframes monotoneShift {
            0% {
              filter: brightness(1);
            }
            50% {
              filter: brightness(1.2);
            }
            100% {
              filter: brightness(1);
            }
          }
        `
      }} />
    </div>
  );
}
