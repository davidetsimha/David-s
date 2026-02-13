'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Sparkles, Camera, FileText } from 'lucide-react';
import { VideoBackground } from '@/components/events/VideoBackground';
import { EventVideoSection } from '@/components/events/EventVideoSection';
import { FormulasSection } from '@/components/events/FormulasSection';
import { EventTypeList } from '@/components/events/EventTypeList';
import { CreationsPreview } from '@/components/events/CreationsPreview';
import type { EventType } from '@/types';

export function EventsHomeContent() {
  const t = useTranslations();
  const locale = useLocale();
  const [selectedType, setSelectedType] = useState<EventType | undefined>();
  const isHebrew = locale === 'he';

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        {/* Video Background */}
        <VideoBackground
          src="/videos/events-hero.mp4"
          poster="/images/creations/buffet-traiteur.jpg"
        />

        {/* Content */}
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 backdrop-blur-sm
            border border-gold-400/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-gold-300" />
            <span className="text-sm font-medium text-gold-200">
              {t('events.badge', { defaultValue: 'Traiteur & Réceptions' })}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl text-white mb-4">
            {t('events.title', { defaultValue: 'Créons ensemble votre événement' })}
          </h1>

          <p className="text-lg md:text-xl text-cream-100/90 max-w-2xl mx-auto mb-8">
            {t('events.subtitle', { defaultValue: "Buffet désert, Bar/Bat Mitzvah, Brit Mila et célébrations sur mesure avec une pâtisserie d'exception" })}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/evenements/devis"
              className="inline-flex items-center gap-2 px-8 py-4
                bg-gold-500 hover:bg-gold-400 text-white
                font-medium tracking-wide uppercase text-sm
                transition-all duration-300 shadow-lg shadow-gold-500/25"
            >
              <FileText className="w-4 h-4" />
              {t('events.requestQuote', { defaultValue: 'Demander un devis' })}
            </Link>

            <Link
              href="/evenements/galerie"
              className="inline-flex items-center gap-2 px-8 py-4
                border-2 border-white/80 text-white
                font-medium tracking-wide uppercase text-sm
                hover:bg-white hover:text-stone-900
                transition-all duration-300"
            >
              <Camera className="w-4 h-4" />
              {t('events.viewGallery', { defaultValue: 'Voir la galerie' })}
            </Link>
          </div>
        </div>
      </section>

      {/* Video Section - Full video presentation */}
      <EventVideoSection
        src="/videos/events-full.mp4"
        poster="/images/creations/buffet-traiteur.jpg"
      />

      {/* Formulas Section */}
      <FormulasSection />

      {/* Gallery Preview */}
      <CreationsPreview />

      {/* Event Types - Lower on page */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold-600 text-sm tracking-[0.2em] uppercase mb-3">
              {t('events.typesBadge')}
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-stone-800">
              {t('events.typesTitle')}
            </h2>
          </div>

          <EventTypeList selected={selectedType} onSelect={setSelectedType} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl text-stone-900 mb-4">
            {t('events.ctaTitle', { defaultValue: 'Prêt à créer votre événement ?' })}
          </h2>
          <p className="text-stone-600 mb-8 max-w-xl mx-auto">
            {t('events.ctaSubtitle', { defaultValue: 'Contactez-nous pour discuter de votre projet et recevoir un devis personnalisé' })}
          </p>
          <Link
            href="/evenements/devis"
            className="inline-flex items-center gap-2 px-10 py-4
              bg-transparent border-2 border-bronze-500 text-bronze-600
              hover:bg-bronze-500 hover:text-white
              font-semibold tracking-wide uppercase text-sm
              transition-all duration-300"
          >
            {t('events.requestQuote', { defaultValue: 'Demander un devis gratuit' })}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
