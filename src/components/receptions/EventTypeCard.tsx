import type { LucideIcon } from 'lucide-react';
import { useLanguageStore } from '../../stores/languageStore';

interface EventTypeCardProps {
  icon: LucideIcon;
  titleFr: string;
  titleHe: string;
  descFr: string;
  descHe: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function EventTypeCard({
  icon: Icon,
  titleFr,
  titleHe,
  descFr,
  descHe,
  isSelected,
  onClick,
}: EventTypeCardProps) {
  const { t } = useLanguageStore();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative w-44 flex-shrink-0 p-5 rounded-2xl
        border-2 transition-all duration-300 ease-out text-start
        ${isSelected
          ? 'border-gold-500 bg-gold-50 shadow-lg shadow-gold-200/50'
          : 'border-cream-300 bg-white hover:border-gold-300 hover:shadow-md'
        }
      `}
    >
      <div
        className={`
          mb-3 w-12 h-12 rounded-xl flex items-center justify-center
          transition-all duration-300
          ${isSelected
            ? 'bg-gold-500 text-white'
            : 'bg-cream-100 text-gold-600 group-hover:bg-gold-100'
          }
        `}
      >
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="font-display text-lg text-gray-900 mb-1">
        {t(titleFr, titleHe)}
      </h3>
      <p className="text-xs text-gray-500 leading-relaxed">
        {t(descFr, descHe)}
      </p>

      {isSelected && (
        <div className="absolute top-3 end-3 w-2.5 h-2.5 bg-gold-500 rounded-full" />
      )}
    </button>
  );
}
