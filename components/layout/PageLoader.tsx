'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface PageLoaderProps {
  onComplete: () => void;
}

export function PageLoader({ onComplete }: PageLoaderProps) {
  const t = useTranslations();
  const [isExiting, setIsExiting] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    // Check if this is the first visit in this session
    const hasVisited = sessionStorage.getItem('davidPatisserie_hasVisited');

    if (hasVisited) {
      setShouldShow(false);
      onComplete();
      return;
    }

    // Mark as visited
    sessionStorage.setItem('davidPatisserie_hasVisited', 'true');

    // Minimum display time: 1.8s, then exit animation: 0.6s
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1800);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!shouldShow) {
    return null;
  }

  const brandName = "David's";
  const brandSubtitle = "Patisserie";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden
        ${isExiting ? 'animate-loader-exit' : ''}`}
      style={{
        background: 'linear-gradient(135deg, var(--color-cream-50) 0%, var(--color-gold-100) 50%, var(--color-cream-100) 100%)',
      }}
    >
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-gold-500) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-gold-500) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-gold-300/40" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-gold-300/40" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-gold-300/40" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-gold-300/40" />

      {/* Main content */}
      <div className="relative flex flex-col items-center">
        {/* Logo container with glow effect */}
        <div className="relative mb-8">
          {/* Animated ring */}
          <div
            className="absolute inset-0 rounded-full animate-pulse-glow"
            style={{
              transform: 'scale(1.3)',
              background: 'radial-gradient(circle, transparent 40%, var(--color-gold-200) 70%, transparent 100%)',
            }}
          />

          {/* Logo */}
          <div className="relative animate-logo-reveal">
            <img
              src="/images/logo-ds.jpg"
              alt="David's Patisserie"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-xl
                ring-4 ring-white/80 animate-float-logo"
            />
          </div>
        </div>

        {/* Brand name with staggered reveal */}
        <div className="text-center">
          <h1 className="font-display text-3xl sm:text-4xl text-gold-800 tracking-wide mb-1">
            {brandName.split('').map((char, index) => (
              <span
                key={index}
                className="inline-block animate-split-reveal"
                style={{ animationDelay: `${0.8 + index * 0.05}s` }}
              >
                {char}
              </span>
            ))}
          </h1>
          <p className="font-display text-xl sm:text-2xl text-gold-600/80 tracking-widest uppercase">
            {brandSubtitle.split('').map((char, index) => (
              <span
                key={index}
                className="inline-block animate-split-reveal"
                style={{ animationDelay: `${1.1 + index * 0.04}s` }}
              >
                {char}
              </span>
            ))}
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gold-400"
              style={{
                animation: 'pulseGlow 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        {/* Tagline */}
        <a
          href="/images/hashgaha.png"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 text-sm text-gold-600/70 tracking-wider animate-split-reveal hover:text-gold-600 transition-colors cursor-pointer"
          style={{ animationDelay: '1.4s' }}
          aria-label={t('gallery.openImage', { name: t('footer.certification') })}
        >
          {t('footer.certification')}
        </a>
      </div>
    </div>
  );
}
