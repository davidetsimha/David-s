'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Star } from 'lucide-react'

/**
 * Calcule "il y a X" / "לפני X" à partir d'une date ISO stockée dans le JSON.
 * La date est identique dans fr.json et he.json — seul l'affichage change.
 */
function getRelativeDate(isoDate: string, locale: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (locale === 'fr') {
    if (diffDays < 1)  return "Aujourd'hui"
    if (diffDays === 1) return 'Il y a 1 jour'
    if (diffDays < 7)  return `Il y a ${diffDays} jours`
    if (diffDays < 14) return 'Il y a 1 semaine'
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
    if (diffDays < 60) return 'Il y a 1 mois'
    const months = Math.floor(diffDays / 30)
    return `Il y a ${months} mois`
  }

  // Hébreu
  if (diffDays < 1)  return 'היום'
  if (diffDays === 1) return 'אתמול'
  if (diffDays < 7)  return `לפני ${diffDays} ימים`
  if (diffDays < 14) return 'לפני שבוע'
  if (diffDays < 30) return `לפני ${Math.floor(diffDays / 7)} שבועות`
  if (diffDays < 60) return 'לפני חודש'
  const months = Math.floor(diffDays / 30)
  return `לפני ${months} חודשים`
}

export function HomeTestimonials() {
  const t = useTranslations()
  const locale = useLocale()

  const reviews = [
    {
      name: t('testimonials.name1'),
      text: t('testimonials.text1'),
      isoDate: t('testimonials.date1'),
      stars: 5,
    },
    {
      name: t('testimonials.name2'),
      text: t('testimonials.text2'),
      isoDate: t('testimonials.date2'),
      stars: 5,
    },
    {
      name: t('testimonials.name3'),
      text: t('testimonials.text3'),
      isoDate: t('testimonials.date3'),
      stars: 5,
    },
  ]

  return (
    <section className="py-20 px-4 bg-cream-50">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gold-600 text-sm font-semibold tracking-widest uppercase mb-3">
            {t('testimonials.badge')}
          </p>
          <h2 className="font-display text-4xl text-stone-900 mb-4">
            {t('testimonials.title')}
          </h2>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />
            ))}
            <span className="ml-2 text-stone-500 text-sm">5/5 · Google</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200
                hover:shadow-md hover:border-gold-200 transition-all duration-200"
            >
              {/* Étoiles */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.stars)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>

              {/* Texte */}
              <p className="text-stone-700 text-sm leading-relaxed mb-5 italic">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Auteur + date calculée */}
              <div className="flex items-center justify-between border-t border-cream-200 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center
                    text-gold-700 font-semibold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <p className="font-medium text-stone-900 text-sm">{review.name}</p>
                </div>
                <p className="text-stone-400 text-xs">
                  {getRelativeDate(review.isoDate, locale)}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
