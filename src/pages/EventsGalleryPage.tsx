import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, X } from 'lucide-react';
import { useCreations } from '../hooks/useCreations';

const categoryIds = ['all', 'wedding', 'bar_mitzvah', 'bat_mitzvah', 'brit', 'event'] as const;

export function EventsGalleryPage() {
  const { t, i18n } = useTranslation();
  const { data: creations = [], isLoading } = useCreations();
  const isHebrew = i18n.language === 'he';

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // For now, show all creations (event_type filtering can be added when the field exists)
  const filteredCreations = creations;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-cream-100 to-cream-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 rounded-full mb-6">
            <Camera className="w-4 h-4 text-gold-600" />
            <span className="text-sm font-medium text-gold-700">
              {t('gallery.badge')}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-stone-900 mb-4">
            {t('gallery.title')}
          </h1>

          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 py-6 border-b border-cream-200 sticky top-16 md:top-20 bg-cream-50/95 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categoryIds.map((id) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${selectedCategory === id
                    ? 'bg-gold-500 text-white'
                    : 'bg-cream-100 text-stone-600 hover:bg-gold-100 hover:text-gold-700'}`}
              >
                {t(`gallery.filter.${id}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-cream-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredCreations.length === 0 ? (
            <div className="text-center py-16">
              <Camera className="w-12 h-12 mx-auto text-stone-300 mb-4" />
              <p className="text-stone-500">
                {t('gallery.noResults')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCreations.map((creation, index) => (
                <button
                  key={creation.id}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative aspect-[3/4] bg-cream-200 rounded-xl overflow-hidden
                    shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={creation.image_url}
                    alt={isHebrew ? creation.title_he : creation.title_fr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 group-hover:translate-y-0
                    opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="text-white font-medium">
                      {isHebrew ? creation.title_he : creation.title_fr}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredCreations}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(i => i !== null ? (i - 1 + filteredCreations.length) % filteredCreations.length : null)}
          onNext={() => setLightboxIndex(i => i !== null ? (i + 1) % filteredCreations.length : null)}
          isHebrew={isHebrew}
        />
      )}
    </div>
  );
}

interface LightboxProps {
  images: Array<{ id: string; image_url: string; title_fr: string; title_he: string }>;
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  isHebrew: boolean;
}

function Lightbox({ images, currentIndex, onClose, onPrev, onNext, isHebrew }: LightboxProps) {
  const current = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation */}
      <button
        onClick={onPrev}
        className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Image */}
      <div className="max-w-5xl max-h-[80vh] px-16">
        <img
          src={current.image_url}
          alt={isHebrew ? current.title_he : current.title_fr}
          className="max-w-full max-h-[80vh] object-contain"
        />
        <div className="mt-4 text-center">
          <h3 className="text-white text-lg font-medium">
            {isHebrew ? current.title_he : current.title_fr}
          </h3>
          <p className="text-white/50 text-sm mt-1">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      </div>
    </div>
  );
}
