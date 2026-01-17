import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useEventFormulas } from '../../hooks/useFormulas';
import type { TimeSlot, EventFormula } from '../../types';

export function FormulasSection() {
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const [activeSlot, setActiveSlot] = useState<TimeSlot>('morning');

  const { data: allFormulas, isLoading } = useEventFormulas();

  const formulas = allFormulas?.filter((f) => f.time_slot === activeSlot) || [];

  const whatsappNumber = '972587495876';
  const getWhatsappLink = (formula: EventFormula) => {
    const formulaName = isHebrew ? formula.name_he : formula.name_fr;
    const message = encodeURIComponent(
      t('formulas.whatsappMessage', { formula: formulaName })
    );
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  return (
    <section className="py-20 bg-cream-50">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 text-center mb-12">
        <p className="text-gold-600 text-sm tracking-[0.3em] uppercase mb-3">
          {t('formulas.title')}
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-stone-800 mb-4">
          {t('formulas.subtitle')}
        </h2>
        <p className="text-stone-500 max-w-lg mx-auto">
          {t('formulas.description')}
        </p>
      </div>

      {/* Time Toggle */}
      <div className="flex justify-center mb-16">
        <div className="inline-flex border-b border-stone-200">
          <button
            onClick={() => setActiveSlot('morning')}
            className={`px-8 py-3 text-sm tracking-widest uppercase transition-all duration-300 relative
              ${activeSlot === 'morning'
                ? 'text-gold-600'
                : 'text-stone-400 hover:text-stone-600'}`}
          >
            {t('formulas.morning')}
            {activeSlot === 'morning' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500" />
            )}
          </button>
          <button
            onClick={() => setActiveSlot('afternoon')}
            className={`px-8 py-3 text-sm tracking-widest uppercase transition-all duration-300 relative
              ${activeSlot === 'afternoon'
                ? 'text-gold-600'
                : 'text-stone-400 hover:text-stone-600'}`}
          >
            {t('formulas.afternoon')}
            {activeSlot === 'afternoon' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500" />
            )}
          </button>
        </div>
      </div>

      {/* Formulas Grid */}
      <div className="max-w-6xl mx-auto px-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
          </div>
        ) : formulas.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            {t('formulas.noFormulas', 'Aucune formule disponible')}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formulas.map((formula, index) => (
              <article
                key={formula.id}
                className="group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500"
              >
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={formula.image_url || '/images/placeholder.jpg'}
                    alt={isHebrew ? formula.name_he : formula.name_fr}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Price overlay */}
                  <div className="absolute bottom-4 start-4">
                    <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-sm">
                      <span className="text-2xl font-light text-stone-800">{formula.price}</span>
                      <span className="text-stone-500 text-sm ms-1">₪ / {isHebrew ? 'אדם' : 'pers'}</span>
                    </div>
                  </div>

                  {/* Index badge */}
                  <div className="absolute top-4 end-4">
                    <span className="text-white/80 text-xs tracking-widest">
                      0{index + 1}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-display text-2xl text-stone-800 mb-1">
                      {isHebrew ? formula.name_he : formula.name_fr}
                    </h3>
                    <p className="text-gold-600 text-sm">
                      {isHebrew ? formula.tagline_he : formula.tagline_fr}
                    </p>
                  </div>

                  <p className="text-stone-400 text-xs uppercase tracking-wider mb-3">
                    {t('formulas.minGuests', { count: formula.min_guests })}
                  </p>

                  {/* Includes list */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-6">
                    {(isHebrew ? formula.includes_he : formula.includes_fr).map((item, i) => (
                      <p key={i} className="text-stone-600 text-sm flex items-center gap-2">
                        <span className="w-1 h-1 bg-gold-400 rounded-full shrink-0" />
                        {item}
                      </p>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href={getWhatsappLink(formula)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-stone-600 hover:text-gold-600
                      text-sm tracking-wide transition-colors group/link"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t('formulas.cta')}</span>
                    <span className="transition-transform group-hover/link:translate-x-1">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-stone-400 text-sm mt-12">
          * {t('formulas.note')}
        </p>
      </div>
    </section>
  );
}
