'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { ShoppingBag, Calendar } from 'lucide-react'

export function SplitScreenHero() {
  const locale = useLocale()
  const isRTL = locale === 'he'

  const content = {
    fr: {
      boutique: {
        title: 'Boutique',
        subtitle: 'Commandes pour Shabbat',
        description: 'Patisseries artisanales francaises',
        cta: 'Commander',
      },
      events: {
        title: 'Evenements',
        subtitle: 'Receptions & Traiteur',
        description: 'Mariages, Bar Mitzvah, Brit Mila',
        cta: 'Demander un devis',
      },
    },
    he: {
      boutique: {
        title: 'בוטיק',
        subtitle: 'הזמנות לשבת',
        description: 'מאפים צרפתיים בעבודת יד',
        cta: 'להזמין',
      },
      events: {
        title: 'אירועים',
        subtitle: 'קייטרינג ואירועים',
        description: 'חתונות, בר מצווה, ברית מילה',
        cta: 'לבקש הצעת מחיר',
      },
    },
  }

  const t = content[locale as keyof typeof content] || content.fr

  return (
    <div className={`flex h-full ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Boutique Side */}
      <Link
        href={`/${locale}/boutique`}
        className="group relative flex-1 flex items-center justify-center overflow-hidden"
      >
        <Image
          src="/images/boutique-hero.jpg"
          alt="Boutique"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className={`relative z-10 text-center text-white p-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="inline-flex items-center gap-2 mb-4 text-amber-300">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider">{t.boutique.subtitle}</span>
          </div>
          <h2 className="font-serif text-5xl md:text-6xl mb-4">{t.boutique.title}</h2>
          <p className="text-lg text-white/80 mb-6">{t.boutique.description}</p>
          <span className="inline-block px-6 py-3 bg-amber-500 text-white rounded-lg font-medium transition-all group-hover:bg-amber-400">
            {t.boutique.cta}
          </span>
        </div>
      </Link>

      {/* Events Side */}
      <Link
        href={`/${locale}/events`}
        className="group relative flex-1 flex items-center justify-center overflow-hidden"
      >
        <Image
          src="/images/events-hero.jpg"
          alt="Events"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className={`relative z-10 text-center text-white p-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="inline-flex items-center gap-2 mb-4 text-amber-300">
            <Calendar className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider">{t.events.subtitle}</span>
          </div>
          <h2 className="font-serif text-5xl md:text-6xl mb-4">{t.events.title}</h2>
          <p className="text-lg text-white/80 mb-6">{t.events.description}</p>
          <span className="inline-block px-6 py-3 bg-amber-500 text-white rounded-lg font-medium transition-all group-hover:bg-amber-400">
            {t.events.cta}
          </span>
        </div>
      </Link>
    </div>
  )
}
