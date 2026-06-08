'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { ChevronDown, ShoppingBag } from 'lucide-react'

interface SplitSectionProps {
  title: string
  subtitle: string
  description?: string
  image: string
  video?: string
  href: string
  cta: string
  secondaryHref?: string
  secondaryCta?: string
  side: 'left' | 'right'
  delay?: number
  prominent?: boolean
  badge?: string
}

function SplitSection({
  title,
  subtitle,
  description,
  image,
  video,
  href,
  cta,
  secondaryHref,
  secondaryCta,
  side,
  delay = 0,
  prominent = false,
  badge,
}: SplitSectionProps) {
  const router = useRouter()
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(e) => e.key === 'Enter' && router.push(href)}
      className={[
        'split-section relative overflow-hidden group cursor-pointer',
        prominent ? 'split-mobile-primary' : '',
        // Mobile min-heights : boutique grande, events petite
        prominent ? 'min-h-[58vh]' : 'min-h-[28vh]',
        'md:min-h-0',
        prominent ? 'flex-[1.1]' : 'flex-[0.9]',
      ].join(' ')}
    >
      {/* Background */}
      {video ? (
        <video
          autoPlay loop muted playsInline poster={image}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}

      {/* Dark overlay — boutique plus lumineuse */}
      <div className={`split-overlay absolute inset-0 transition-colors duration-300
        ${prominent ? 'bg-black/45 group-hover:bg-black/35' : 'bg-black/65 group-hover:bg-black/55'}`}
      />

      {/* Gradient latéral */}
      <div className={`absolute inset-0 pointer-events-none ${
        side === 'left'
          ? 'bg-gradient-to-r from-black/30 to-transparent'
          : 'bg-gradient-to-l from-black/30 to-transparent'
      }`} />

      {/* Contenu */}
      <div
        className={[
          'split-content relative h-full flex flex-col items-center justify-center',
          'px-6 text-center animate-split-reveal',
          prominent ? 'py-10 md:py-0' : 'py-5 md:py-0',
        ].join(' ')}
        style={{ animationDelay: `${0.3 + delay}s` }}
      >
        {/* Badge urgence — mobile : plus visible */}
        {badge && prominent && (
          <div className="mb-3 md:mb-4 px-4 py-1.5 bg-gold-500/95 backdrop-blur-sm rounded-full
            text-white text-xs font-semibold tracking-wide uppercase shadow-lg shadow-gold-500/40
            max-w-[85vw] text-center leading-snug">
            {badge}
          </div>
        )}

        {/* Ligne déco (desktop uniquement) */}
        <div className="hidden md:block w-12 h-0.5 bg-gradient-to-r from-transparent via-bronze-400 to-transparent mb-6
          opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Titre */}
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mb-2">
          {title}
        </h2>

        {/* Sous-titre */}
        <p className={`text-cream-100/90 font-light tracking-wide mb-2
          ${prominent ? 'text-base md:text-xl' : 'text-sm md:text-xl'}`}>
          {subtitle}
        </p>

        {/* Description (hover desktop uniquement) */}
        {description && (
          <p className="hidden md:block text-sm text-cream-200/70 max-w-xs mt-2 opacity-0
            group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {description}
          </p>
        )}

        {/* Ligne déco */}
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent my-4" />

        {/* CTA */}
        {prominent ? (
          /* Boutique — bouton gold solide + bouton secondaire semaine */
          <div className="flex flex-col items-center gap-3">
            <span className="inline-flex items-center gap-2
              px-7 py-3 md:px-8 md:py-3.5
              bg-gold-500 text-white font-semibold tracking-wider uppercase
              text-sm rounded-sm shadow-lg shadow-gold-500/40
              group-hover:bg-gold-400 group-hover:shadow-xl group-hover:shadow-gold-500/50
              transition-all duration-300">
              <ShoppingBag className="w-4 h-4 md:hidden" />
              {cta}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            {secondaryHref && secondaryCta && (
              <Link
                href={secondaryHref}
                onClick={(e) => { e.stopPropagation(); }}
                className="inline-flex items-center gap-2
                  px-6 py-2.5
                  border border-cream-100/60 text-cream-100/85
                  font-medium tracking-wider uppercase text-xs
                  hover:bg-white/10 hover:border-white hover:text-white
                  transition-all duration-300 rounded-sm"
              >
                {secondaryCta}
                <svg className="w-3 h-3 transition-transform duration-300 hover:translate-x-1"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}
          </div>
        ) : (
          /* Événements — outline discret */
          <span className="inline-flex items-center gap-2
            px-6 py-2.5 md:px-8 md:py-3
            border border-cream-100/60 text-cream-100/85
            font-medium tracking-wider uppercase text-xs md:text-sm
            transition-all duration-300
            group-hover:bg-white/10 group-hover:border-white group-hover:text-white">
            {cta}
            <svg className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        )}
      </div>

      {/* Coins décoratifs (desktop uniquement) */}
      <div className={`hidden md:block absolute top-6 ${side === 'left' ? 'left-6' : 'right-6'}
        w-12 h-12 border-t-2 ${side === 'left' ? 'border-l-2' : 'border-r-2'}
        ${prominent ? 'border-gold-400/50' : 'border-gold-400/30'} pointer-events-none
        opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className={`hidden md:block absolute bottom-6 ${side === 'left' ? 'left-6' : 'right-6'}
        w-12 h-12 border-b-2 ${side === 'left' ? 'border-l-2' : 'border-r-2'}
        ${prominent ? 'border-gold-400/50' : 'border-gold-400/30'} pointer-events-none
        opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    </div>
  )
}

export function SplitScreenHero() {
  const t = useTranslations()
  const locale = useLocale()

  const dayOfWeek = new Date().getDay()
  const daysUntilFriday = ((5 - dayOfWeek + 7) % 7) || 7
  const urgencyBadge =
    dayOfWeek === 4 && new Date().getHours() >= 18
      ? t('home.urgency.lastNight')
      : daysUntilFriday <= 3
        ? t('home.urgency.daysLeft', { days: daysUntilFriday })
        : t('home.urgency.orderNow')

  const scrollToTeaser = () => {
    document.getElementById('boutique-teaser')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative h-screen min-h-[600px] flex flex-col md:flex-row overflow-hidden">
      {/* Gauche — Événements (secondaire) */}
      <SplitSection
        side="left"
        prominent={false}
        title={t('home.splitEvents') || 'Événements'}
        subtitle={t('home.splitEventsSubtitle') || 'Traiteur & Réceptions'}
        description={t('home.splitEventsDesc') || 'Mariages, Bar Mitzvah & célébrations sur mesure'}
        video="/videos/events-hero.mp4"
        image="/images/creations/buffet-traiteur.jpg"
        href={`/${locale}/evenements`}
        cta={t('home.discoverBtn') || 'Découvrir nos créations'}
        delay={0}
      />

      {/* Droite — Boutique (primaire, passe en haut sur mobile) */}
      <SplitSection
        side="right"
        prominent={true}
        badge={urgencyBadge}
        title={t('home.splitShop') || 'Boutique'}
        subtitle={t('home.splitShopSubtitle') || 'Commandez pour Chabbat'}
        description={t('home.splitShopDesc') || 'Pâtisserie française sur Jérusalem'}
        image="/images/boutique-hero.jpg"
        href={`/${locale}/boutique`}
        cta={t('home.orderBtn') || 'Commander pour Chabbat'}
        secondaryHref={`/${locale}/boutique?tab=semaine`}
        secondaryCta={t('home.teaser.ctaWeek') || 'Boutique de la Semaine'}
        delay={0.15}
      />

      {/* Logo central — masqué sur mobile (il obscurcissait le contenu) */}
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        z-20 pointer-events-none">
        <div
          className="absolute inset-0 -m-8 rounded-full blur-xl opacity-60"
          style={{ background: 'radial-gradient(circle, var(--color-cream-50) 0%, transparent 70%)' }}
        />
        <div className="relative animate-split-reveal" style={{ animationDelay: '0.6s' }}>
          <div className="absolute inset-0 -m-3 rounded-full border-2 border-gold-400/40 animate-pulse-glow" />
          <div className="absolute inset-0 -m-1.5 rounded-full border border-bronze-400/30" />
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

      {/* Séparateur vertical (desktop uniquement) */}
      <div className="hidden md:block absolute top-0 bottom-0 left-[45%] -translate-x-1/2 w-1
        bg-gradient-to-b from-transparent via-gold-400/80 to-transparent z-10 shadow-lg shadow-gold-400/50" />

      {/* Scroll indicator — cliquable */}
      <button
        onClick={scrollToTeaser}
        className="absolute bottom-4 md:bottom-6 inset-x-0 flex justify-center z-20
          animate-split-reveal group"
        style={{ animationDelay: '1s' }}
        aria-label={t('home.scrollDown') || 'Voir la boutique'}
      >
        <div className="flex flex-col items-center gap-1 text-cream-100/70
          group-hover:text-gold-300 transition-colors duration-300">
          <span className="text-xs tracking-widest uppercase hidden md:block">
            {t('home.scrollDown') || 'Voir la boutique'}
          </span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>
      </button>
    </section>
  )
}
