import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Sparkles, Camera, FileText } from 'lucide-react';
import { EventTypeList } from '../components/receptions/EventTypeList';
import { FormulasSection } from '../components/events/FormulasSection';
import { useCreations } from '../hooks/useCreations';
import { ROUTES } from '../config/routes';
import type { EventType } from '../types';

export function EventsHomePage() {
  const { t, i18n } = useTranslation();
  const [selectedType, setSelectedType] = useState<EventType | undefined>();
  const { data: creations = [] } = useCreations();
  const isHebrew = i18n.language === 'he';

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/images/creations/buffet-traiteur.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 backdrop-blur-sm
            border border-gold-400/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-gold-300" />
            <span className="text-sm font-medium text-gold-200">
              {t('events.badge', 'Traiteur & Réceptions')}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl text-white mb-4">
            {t('events.title', 'Créons ensemble votre événement')}
          </h1>

          <p className="text-lg md:text-xl text-cream-100/90 max-w-2xl mx-auto mb-8">
            {t('events.subtitle', 'Mariages, Bar/Bat Mitzvah, Brit Mila et célébrations sur mesure avec une pâtisserie d\'exception')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={ROUTES.EVENTS_QUOTE}
              className="inline-flex items-center gap-2 px-8 py-4
                bg-gold-500 hover:bg-gold-400 text-white
                font-medium tracking-wide uppercase text-sm
                transition-all duration-300 shadow-lg shadow-gold-500/25"
            >
              <FileText className="w-4 h-4" />
              {t('events.requestQuote', 'Demander un devis')}
            </Link>

            <Link
              to={ROUTES.EVENTS_GALLERY}
              className="inline-flex items-center gap-2 px-8 py-4
                border-2 border-white/80 text-white
                font-medium tracking-wide uppercase text-sm
                hover:bg-white hover:text-stone-900
                transition-all duration-300"
            >
              <Camera className="w-4 h-4" />
              {t('events.viewGallery', 'Voir la galerie')}
            </Link>
          </div>
        </div>
      </section>

      {/* Formulas Section - First thing after hero */}
      <FormulasSection />

      {/* Gallery Preview */}
      {creations.length > 0 && (
        <section className="py-16 px-4 bg-cream-100/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-2xl md:text-3xl text-stone-900 mb-2">
                  {t('events.creationsTitle', 'Nos Créations')}
                </h2>
                <p className="text-stone-500">
                  {t('events.creationsSubtitle', 'Un aperçu de notre savoir-faire')}
                </p>
              </div>
              <Link
                to={ROUTES.EVENTS_GALLERY}
                className="hidden sm:inline-flex items-center gap-2 text-gold-600 hover:text-gold-700
                  font-medium transition-colors"
              >
                {t('common.viewAll', 'Voir tout')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {creations.slice(0, 8).map((creation) => (
                <div
                  key={creation.id}
                  className="group relative aspect-[3/4] bg-cream-200 rounded-xl overflow-hidden shadow-sm"
                >
                  <img
                    src={creation.image_url}
                    alt={isHebrew ? creation.title_he : creation.title_fr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white font-medium text-sm">
                      {isHebrew ? creation.title_he : creation.title_fr}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link
                to={ROUTES.EVENTS_GALLERY}
                className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700
                  font-medium transition-colors"
              >
                {t('common.viewAll', 'Voir toute la galerie')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Event Types - Lower on page */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold-600 text-sm tracking-[0.2em] uppercase mb-3">
              {isHebrew ? 'סוגי אירועים' : 'Vos Célébrations'}
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-stone-800">
              {t('events.typesTitle', 'Nous accompagnons tous vos événements')}
            </h2>
          </div>

          <EventTypeList selected={selectedType} onSelect={setSelectedType} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl text-stone-900 mb-4">
            {t('events.ctaTitle', 'Prêt à créer votre événement ?')}
          </h2>
          <p className="text-stone-600 mb-8 max-w-xl mx-auto">
            {t('events.ctaSubtitle', 'Contactez-nous pour discuter de votre projet et recevoir un devis personnalisé')}
          </p>
          <Link
            to={ROUTES.EVENTS_QUOTE}
            className="inline-flex items-center gap-2 px-10 py-4
              bg-transparent border-2 border-bronze-500 text-bronze-600
              hover:bg-bronze-500 hover:text-white
              font-semibold tracking-wide uppercase text-sm
              transition-all duration-300"
          >
            {t('events.requestQuote', 'Demander un devis gratuit')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
