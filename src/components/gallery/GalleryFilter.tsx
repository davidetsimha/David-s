import { useTranslation } from 'react-i18next';
import type { GalleryCategory } from '../../types';

type FilterOption = 'all' | GalleryCategory;

interface GalleryFilterProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const filterKeys: FilterOption[] = ['all', 'receptions', 'products'];

export function GalleryFilter({ activeFilter, onFilterChange }: GalleryFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
      {filterKeys.map((key) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`
            relative px-6 py-2.5 rounded-full font-medium text-sm md:text-base
            transition-all duration-200 ease-out
            focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2
            ${activeFilter === key
              ? 'bg-gold-500 text-white shadow-lg shadow-gold-300/40'
              : 'bg-cream-100 text-gold-700 hover:bg-cream-200 hover:shadow-md'
            }
          `}
        >
          <span className="relative z-10">
            {t(`gallery.${key}`)}
          </span>
          {activeFilter === key && (
            <span className="absolute inset-0 rounded-full bg-gold-400/20 animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
}

export type { FilterOption };
