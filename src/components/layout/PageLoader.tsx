import { useState, useEffect } from 'react';

interface PageLoaderProps {
  onComplete?: () => void;
  minDuration?: number;
}

export function PageLoader({ onComplete, minDuration = 1800 }: PageLoaderProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (hasVisited) {
      setIsVisible(false);
      onComplete?.();
      return;
    }

    // Mark as visited for this session
    sessionStorage.setItem('hasVisited', 'true');

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, minDuration);

    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, minDuration + 600); // 600ms for exit animation

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [minDuration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[100] flex items-center justify-center
        bg-gradient-to-br from-cream-50 via-cream-100 to-gold-50
        ${isExiting ? 'animate-loader-exit' : ''}
      `}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--color-gold-500) 1px, transparent 1px),
              linear-gradient(to bottom, var(--color-gold-500) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Radial gradient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, var(--color-bronze-200) 0%, transparent 70%)'
          }}
        />

        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-gold-300/40" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-gold-300/40" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-gold-300/40" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-gold-300/40" />
      </div>

      {/* Logo container */}
      <div className="relative flex flex-col items-center">
        {/* Logo with glow effect */}
        <div className="relative">
          {/* Glow ring behind logo */}
          <div
            className="absolute inset-0 -m-4 rounded-full animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, var(--color-bronze-300) 0%, transparent 70%)'
            }}
          />

          {/* Logo image */}
          <img
            src="/images/logo-ds.jpg"
            alt="David's Pâtisserie"
            className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover
              animate-logo-reveal shadow-2xl
              ring-4 ring-gold-400/50 ring-offset-4 ring-offset-cream-50"
          />
        </div>

        {/* Brand name */}
        <div
          className="mt-8 text-center animate-split-reveal"
          style={{ animationDelay: '0.8s' }}
        >
          <h1 className="font-display text-2xl md:text-3xl text-gold-800 tracking-wide">
            David's Pâtisserie
          </h1>
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-bronze-400" />
            <span className="text-sm text-bronze-600 font-light tracking-widest uppercase">
              Excellence Artisanale
            </span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-bronze-400" />
          </div>
        </div>

        {/* Loading indicator */}
        <div
          className="mt-10 animate-split-reveal"
          style={{ animationDelay: '1.2s' }}
        >
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-bronze-400"
                style={{
                  animation: 'pulse 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.15}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
