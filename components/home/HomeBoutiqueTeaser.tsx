'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ShoppingBag, Clock, Shield, Truck } from 'lucide-react'

export function HomeBoutiqueTeaser() {
  const t = useTranslations()
  const locale = useLocale()

  const dayOfWeek = new Date().getDay()
  const daysUntilFriday = ((5 - dayOfWeek + 7) % 7) || 7
  const isLastNight = dayOfWeek === 4 && new Date().getHours() >= 18
  const showUrgency = daysUntilFriday <= 3 || isLastNight

  return (
    <section
      id="boutique-teaser"
      className="py-20 px-4 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge certification */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 border border-gold-400/40 rounded-full mb-8">
          <Shield className="w-4 h-4 text-gold-400" />
          <span className="text-sm text-gold-300 tracking-wide font-medium">
            Badatz Beit Yossef - {t('home.teaser.kosher')}
          </span>
        </div>

        {/* Urgency Banner */}
        {showUrgency && (
          <div className={`rounded-xl p-4 mb-8 flex items-center justify-center gap-3
            ${isLastNight
              ? 'bg-red-500/20 border border-red-400/40'
              : 'bg-amber-500/20 border border-amber-400/40'}`}
          >
            <Clock className={`w-5 h-5 flex-shrink-0 ${isLastNight ? 'text-red-300' : 'text-amber-300'}`} />
            <p className={`text-sm font-semibold ${isLastNight ? 'text-red-200' : 'text-amber-200'}`}>
              {isLastNight
                ? t('home.urgency.lastNight')
                : t('home.urgency.daysLeft', { days: daysUntilFriday })}
            </p>
          </div>
        )}

        {/* Title */}
        <h2 className="font-display text-4xl md:text-5xl text-white mb-4 leading-tight">
          {t('home.teaser.title')}
        </h2>
        <p className="text-cream-200/75 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          {t('home.teaser.subtitle')}
        </p>

        {/* Features */}
        <div className="flex justify-center gap-8 md:gap-16 mb-12">
          {[
            { icon: <Clock className="w-6 h-6 text-gold-400" />, label: t('home.teaser.feature1') },
            { icon: <Truck className="w-6 h-6 text-gold-400" />, label: t('home.teaser.feature2') },
            { icon: <Shield className="w-6 h-6 text-gold-400" />, label: t('home.teaser.feature3') },
          ].map((f, i) => (
            <div key={i} className="text-center">
              <div className="flex justify-center mb-2">{f.icon}</div>
              <p className="text-xs text-cream-300/70 leading-tight max-w-[80px]">{f.label}</p>
            </div>
          ))}
        </div>

        {/* Main CTA */}
        <Link
          href={`/${locale}/boutique`}
          className="inline-flex items-center gap-3 px-10 py-4
            bg-gold-500 text-white font-semibold text-lg rounded-xl
            shadow-xl shadow-gold-500/30
            hover:bg-gold-400 hover:shadow-2xl hover:shadow-gold-500/40
            hover:-translate-y-0.5
            transition-all duration-300"
        >
          <ShoppingBag className="w-5 h-5" />
          {t('home.teaser.cta')}
        </Link>

        <p className="mt-4 text-stone-500 text-xs">
          {t('home.teaser.deadline')}
        </p>
      </div>
    </section>
  )
}
