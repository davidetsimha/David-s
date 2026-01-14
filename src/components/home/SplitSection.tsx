import { Link } from 'react-router-dom';

interface SplitSectionProps {
  title: string;
  subtitle: string;
  description?: string;
  image: string;
  href: string;
  cta: string;
  side: 'left' | 'right';
  delay?: number;
}

export function SplitSection({
  title,
  subtitle,
  description,
  image,
  href,
  cta,
  side,
  delay = 0,
}: SplitSectionProps) {
  return (
    <Link
      to={href}
      className="split-section relative flex-1 overflow-hidden group cursor-pointer
        min-h-[50vh] md:min-h-0"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700
          group-hover:scale-105"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Dark Overlay - lighter on hover */}
      <div className="split-overlay absolute inset-0 bg-black/60 group-hover:bg-black/50" />

      {/* Gradient overlay for depth */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          side === 'left'
            ? 'bg-gradient-to-r from-black/30 to-transparent'
            : 'bg-gradient-to-l from-black/30 to-transparent'
        }`}
      />

      {/* Content */}
      <div
        className="split-content relative h-full flex flex-col items-center justify-center
          px-8 py-16 md:py-0 text-center animate-split-reveal"
        style={{ animationDelay: `${0.3 + delay}s` }}
      >
        {/* Decorative line above */}
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-bronze-400 to-transparent mb-6
          opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Title */}
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white
          tracking-wide mb-3">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-cream-100/90 font-light tracking-wide mb-2">
          {subtitle}
        </p>

        {/* Description (optional) */}
        {description && (
          <p className="text-sm text-cream-200/70 max-w-xs mt-2 opacity-0
            group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {description}
          </p>
        )}

        {/* Decorative line below */}
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent my-6" />

        {/* CTA Button - Bronze outline style */}
        <span
          className="inline-flex items-center px-8 py-3
            border-2 border-bronze-400 text-bronze-300
            font-medium tracking-wider uppercase text-sm
            transition-all duration-300
            group-hover:bg-bronze-500 group-hover:border-bronze-500 group-hover:text-white
            group-hover:shadow-lg group-hover:shadow-bronze-500/25"
        >
          {cta}
          <svg
            className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </span>
      </div>

      {/* Corner decorations */}
      <div className={`absolute top-6 ${side === 'left' ? 'left-6' : 'right-6'}
        w-12 h-12 border-t-2 ${side === 'left' ? 'border-l-2' : 'border-r-2'}
        border-gold-400/30 pointer-events-none
        opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
      <div className={`absolute bottom-6 ${side === 'left' ? 'left-6' : 'right-6'}
        w-12 h-12 border-b-2 ${side === 'left' ? 'border-l-2' : 'border-r-2'}
        border-gold-400/30 pointer-events-none
        opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
    </Link>
  );
}
