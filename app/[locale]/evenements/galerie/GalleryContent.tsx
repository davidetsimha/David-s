'use client';

import { useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Camera, X } from 'lucide-react';
import type { GalleryImage } from '@/types/gallery.types';

const CATEGORY_IDS = ['all', 'wedding', 'bar_mitzvah', 'bat_mitzvah', 'brit', 'event'] as const;
type CategoryId = (typeof CATEGORY_IDS)[number];

interface GalleryContentProps {
  images: GalleryImage[];
}

export function GalleryContent({ images }: GalleryContentProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isHebrew = locale === 'he';

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = selectedCategory === 'all'
    ? images
    : images.filter(i => i.category === selectedCategory);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goToPrev = useCallback(() => {
    setLightboxIndex(i =>
      i !== null ? (i - 1 + filtered.length) % filtered.length : null
    );
  }, [filtered.length]);

  const goToNext = useCallback(() => {
    setLightboxIndex(i =>
      i !== null ? (i + 1) % filtered.length : null
    );
  }, [filtered.length]);

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
            {CATEGORY_IDS.map((id) => (
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
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Camera className="w-12 h-12 mx-auto text-stone-300 mb-4" />
              <p className="text-stone-500">{t('gallery.noResults')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => openLightbox(index)}
                  className="group relative aspect-[3/4] bg-cream-200 rounded-xl overflow-hidden
                    shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={image.image_url}
                    alt={isHebrew ? image.alt_he : image.alt_fr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={filtered}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
          isHebrew={isHebrew}
        />
      )}
    </div>
  );
}

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  isHebrew: boolean;
}

function Lightbox({ images, currentIndex, onClose, onPrev, onNext, isHebrew }: LightboxProps) {
  const current = images[currentIndex];

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10">
        <X className="w-8 h-8" />
      </button>
      <button onClick={onPrev} className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors z-10">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button onClick={onNext} className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors z-10">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className="max-w-5xl max-h-[80vh] px-16">
        <img
          src={current.image_url}
          alt={isHebrew ? current.alt_he : current.alt_fr}
          className="max-w-full max-h-[80vh] object-contain"
        />
        <div className="mt-4 text-center">
          <p className="text-white/70 text-sm">{isHebrew ? current.alt_he : current.alt_fr}</p>
          <p className="text-white/40 text-xs mt-1">{currentIndex + 1} / {images.length}</p>
        </div>
      </div>
    </div>
  );
}
