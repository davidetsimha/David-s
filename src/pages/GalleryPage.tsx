import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGalleryImages } from '../hooks/useGallery';
import { GalleryFilter, PhotoGrid, Lightbox } from '../components/gallery';
import type { FilterOption } from '../components/gallery';
import { Spinner } from '../components/ui';

export function GalleryPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: images = [], isLoading } = useGalleryImages();

  const filteredImages = useMemo(() => {
    if (activeFilter === 'all') return images;
    return images.filter((img) => img.category === activeFilter);
  }, [images, activeFilter]);

  const handlePrevious = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-cream-100 to-cream-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-gold-700 mb-4">
            {t('gallery.pageTitle')}
          </h1>
          <p className="text-gold-600/80 text-lg max-w-xl mx-auto">
            {t('gallery.pageSubtitle')}
          </p>
          <div className="mt-8 w-24 h-0.5 bg-gold-400 mx-auto" />
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <GalleryFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <PhotoGrid images={filteredImages} onImageClick={setLightboxIndex} />
        )}
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
