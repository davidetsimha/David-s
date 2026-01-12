import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { EventTypeList } from '../components/receptions/EventTypeList';
import { QuoteRequestForm } from '../components/receptions/QuoteRequestForm';
import type { EventType } from '../types';

export function ReceptionsPage() {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<EventType | undefined>();

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 px-4 bg-gradient-to-b from-cream-100 to-cream-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <span className="text-sm font-medium text-gold-700">
              {t('receptions.customEvents')}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-stone-900 mb-4">
            {t('receptions.title')}
          </h1>

          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            {t('receptions.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <EventTypeList selected={selectedType} onSelect={setSelectedType} />

        {/* Gallery Preview */}
        <section className="py-8">
          <h2 className="font-display text-2xl text-stone-900 mb-6">
            {t('receptions.ourCreations')}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square bg-cream-200 rounded-xl overflow-hidden"
              >
                <div className="w-full h-full bg-gradient-to-br from-cream-100 to-cream-300" />
              </div>
            ))}
          </div>
        </section>

        {/* Quote Form */}
        <section className="py-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-cream-200">
            <h2 className="font-display text-2xl text-stone-900 mb-2">
              {t('receptions.quoteTitle')}
            </h2>
            <p className="text-stone-500 mb-6">
              {t('receptions.quoteSubtitle')}
            </p>
            <QuoteRequestForm preselectedType={selectedType} />
          </div>
        </section>
      </div>
    </div>
  );
}
