'use client'

import { useTranslations } from 'next-intl'
import { Star } from 'lucide-react'

export function HomeTestimonials() {
  const t = useTranslations()

  const reviews = [
    {
      name: t('testimonials.name1'),
      text: t('testimonials.text1'),
      date: t('testimonials.date1'),
      stars: 5,
    },
    {
      name: t('testimonials.name2'),
      text: t('testimonials.text2'),
      date: t('testimonials.date2'),
      stars: 5,
    },
    {
      name: t('testimonials.name3'),
      text: t('testimonials.text3'),
      date: t('testimonials.date3'),
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
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.stars)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-stone-700 text-sm leading-relaxed mb-5 italic">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between border-t border-cream-200 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 font-semibold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <p className="font-medium text-stone-900 text-sm">{review.name}</p>
                </div>
                <p className="text-stone-400 text-xs">{review.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
