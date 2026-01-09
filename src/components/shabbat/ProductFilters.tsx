import { useLanguageStore } from '../../stores/languageStore';
import type { Category } from '../../types';

interface ProductFiltersProps {
  categories: Category[];
  selectedId?: string;
  onSelect: (id?: string) => void;
}

export function ProductFilters({
  categories,
  selectedId,
  onSelect,
}: ProductFiltersProps) {
  const { t, direction } = useLanguageStore();

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      style={{ direction }}
    >
      <button
        onClick={() => onSelect(undefined)}
        className={`
          flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium
          transition-all duration-200
          ${!selectedId
            ? 'bg-gold-500 text-white shadow-md'
            : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
          }
        `}
      >
        {t('Tout', 'הכל')}
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`
            flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium
            transition-all duration-200
            ${selectedId === cat.id
              ? 'bg-gold-500 text-white shadow-md'
              : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
            }
          `}
        >
          {t(cat.name_fr, cat.name_he)}
        </button>
      ))}
    </div>
  );
}
