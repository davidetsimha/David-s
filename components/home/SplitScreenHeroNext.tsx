'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'

interface SplitSectionProps {
  title: string
  subtitle: string
  description?: string
  image: string
  video?: string
  href: string
  cta: string
  side: 'left' | 'right'
  delay?: number
}

function SplitSection({
  title,
  subtitle,
  description,
  image,
  video,
  href,
  cta,
  side,
  delay = 0,
}: SplitSectionProps) {
  return (
    <Link
      href={href}
      className="split-section relative flex-1 overflow-hidden group cursor-pointer
        min-h-[50vh] md:min-h-0"
    >
      {/* Background Video or Image */}
      {video ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={image}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700
            group-hover:scale-105"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700
            group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}

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
  )
}

export function SplitScreenHero() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <section className="relative h-screen min-h-[600px] flex flex-col md:flex-row overflow-hidden">
      {/* Left Section - Événements */}
      <SplitSection
        side="left"
        title={t('home.splitEvents') || 'Événements'}
        subtitle={t('home.splitEventsSubtitle') || 'Traiteur & Réceptions'}
        description={t('home.splitEventsDesc') || 'Mariages, Bar Mitzvah & célébrations sur mesure'}
        video="/videos/events-hero.mp4"
        image="/images/creations/buffet-traiteur.jpg"
        href={`/${locale}/evenements`}
        cta={t('home.discoverBtn') || 'Découvrir nos créations'}
        delay={0}
      />

      {/* Right Section - Boutique */}
      <SplitSection
        side="right"
        title={t('home.splitShop') || 'Boutique'}
        subtitle={t('home.splitShopSubtitle') || 'Commandez pour Shabbat'}
        description={t('home.splitShopDesc') || 'Challot, pâtisseries & délices livrés chez vous'}
        image="/images/boutique-hero.jpg"
        href={`/${locale}/boutique`}
        cta={t('home.orderBtn') || 'Commander pour Shabbat'}
        delay={0.15}
      />

      {/* Central Logo - Overlaid on both sections */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        z-20 pointer-events-none">
        {/* Glow effect behind logo */}
        <div
          className="absolute inset-0 -m-8 rounded-full blur-xl opacity-60"
          style={{
            background: 'radial-gradient(circle, var(--color-cream-50) 0%, transparent 70%)'
          }}
        />

        {/* Logo container with decorative ring */}
        <div className="relative animate-split-reveal" style={{ animationDelay: '0.6s' }}>
          {/* Outer decorative ring */}
          <div className="absolute inset-0 -m-3 rounded-full border-2 border-gold-400/40
            animate-pulse-glow" />

          {/* Inner ring */}
          <div className="absolute inset-0 -m-1.5 rounded-full border border-bronze-400/30" />

          {/* Logo image */}
          <Image
            src="/images/logo-ds.jpg"
            alt="David's Pâtisserie"
            width={224}
            height={224}
            className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full object-cover
              shadow-2xl ring-4 ring-cream-50/90 animate-float-logo"
            priority
          />
        </div>
      </div>

      {/* Vertical divider line (desktop only) */}
      <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1
        bg-gradient-to-b from-transparent via-gold-400/80 to-transparent z-10 shadow-lg shadow-gold-400/50" />

      {/* Horizontal divider line (mobile only) */}
      <div className="md:hidden absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1
        bg-gradient-to-r from-transparent via-gold-400/80 to-transparent z-10 shadow-lg shadow-gold-400/50" />

      {/* Scroll indicator */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center z-20
        animate-split-reveal" style={{ animationDelay: '1s' }}>
        <div className="flex flex-col items-center gap-2 text-cream-100/60">
          <span className="text-xs tracking-widest uppercase">
            {t('home.scrollDown') || 'Défiler'}
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-gold-400/60 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  )
}
