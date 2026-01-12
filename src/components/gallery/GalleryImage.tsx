import type { GalleryImage as GalleryImageType } from '../../types';

interface GalleryImageProps {
  image: GalleryImageType;
  onClick: () => void;
}

export function GalleryImage({ image, onClick }: GalleryImageProps) {
  return (
    <button
      onClick={onClick}
      className="
        group relative w-full overflow-hidden rounded-xl
        bg-cream-100 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-4
        transition-shadow duration-300
      "
      aria-label={`פתח תמונה: ${image.alt_he}`}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image.image_url}
          alt={image.alt_he}
          loading="lazy"
          className="
            w-full h-full object-cover
            transition-transform duration-500 ease-out
            group-hover:scale-110
          "
        />

        {/* Elegant overlay - visible on mobile, hover on desktop */}
        <div className="
          absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent
          opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300
        ">
          <div className="absolute bottom-4 inset-x-4 text-white text-start">
            <p className="text-sm font-medium truncate">{image.alt_he}</p>
          </div>
        </div>

        {/* Corner accent - visible on mobile, hover on desktop */}
        <div className="
          absolute top-3 end-3 w-8 h-8
          border-t-2 border-e-2 border-gold-400/80
          opacity-100 md:opacity-0 group-hover:opacity-100
          transition-all duration-300 group-hover:translate-x-0 group-hover:-translate-y-0
          md:translate-x-2 md:-translate-y-2
        " />
      </div>
    </button>
  );
}
