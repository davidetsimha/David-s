import { useTranslation } from 'react-i18next';
import type { GalleryImage as GalleryImageType } from '../../types';
import { GalleryImage } from './GalleryImage';

interface PhotoGridProps {
  images: GalleryImageType[];
  onImageClick: (index: number) => void;
}

export function PhotoGrid({ images, onImageClick }: PhotoGridProps) {
  const { t } = useTranslation();

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 opacity-30">🍰</div>
        <p className="text-gold-600 text-lg">{t('gallery.noImages')}</p>
      </div>
    );
  }

  return (
    <div className="
      grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6
      auto-rows-fr
    ">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <GalleryImage
            image={image}
            onClick={() => onImageClick(index)}
          />
        </div>
      ))}
    </div>
  );
}
