import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import type { GalleryImage } from '../../types';

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function Lightbox({ images, currentIndex, onClose, onPrevious, onNext }: LightboxProps) {
  const { t } = useTranslation();
  const currentImage = images[currentIndex];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onNext(); // RTL: left = next
    if (e.key === 'ArrowRight') onPrevious(); // RTL: right = previous
  }, [onClose, onPrevious, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 end-4 z-10 p-2 rounded-full bg-white/10 text-white
          hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        aria-label={t('common.close')}
      >
        <X size={24} />
      </button>

      {/* Navigation - Previous */}
      {images.length > 1 && (
        <button
          onClick={onPrevious}
          className="absolute start-4 z-10 p-3 rounded-full bg-white/10 text-white
            hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label={t('gallery.previousImage')}
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Navigation - Next */}
      {images.length > 1 && (
        <button
          onClick={onNext}
          className="absolute end-4 z-10 p-3 rounded-full bg-white/10 text-white
            hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white
            me-16"
          aria-label={t('gallery.nextImage')}
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Image */}
      <div className="relative max-w-5xl max-h-[85vh] mx-4 animate-scale-in">
        <img
          src={currentImage.image_url}
          alt={currentImage.alt_he}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
        <p className="absolute -bottom-10 inset-x-0 text-center text-white/80 text-sm">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}
