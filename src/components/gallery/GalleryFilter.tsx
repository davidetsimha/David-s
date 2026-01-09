import type { GalleryCategory } from '../../types';

type FilterOption = 'all' | GalleryCategory;

interface GalleryFilterProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const filters: { key: FilterOption; labelHe: string; labelFr: string }[] = [
  { key: 'all', labelHe: 'הכל', labelFr: 'Tout' },
  { key: 'receptions', labelHe: 'קבלות פנים', labelFr: 'Receptions' },
  { key: 'products', labelHe: 'מוצרים', labelFr: 'Produits' },
];

export function GalleryFilter({ activeFilter, onFilterChange }: GalleryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`
            relative px-6 py-2.5 rounded-full font-medium text-sm md:text-base
            transition-all duration-300 ease-out
            focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2
            ${activeFilter === filter.key
              ? 'bg-gold-500 text-white shadow-lg shadow-gold-300/40'
              : 'bg-cream-100 text-gold-700 hover:bg-cream-200 hover:shadow-md'
            }
          `}
        >
          <span className="relative z-10">{filter.labelHe}</span>
          {activeFilter === filter.key && (
            <span className="absolute inset-0 rounded-full bg-gold-400/20 animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
}

export type { FilterOption };
