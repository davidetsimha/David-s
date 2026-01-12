import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EventTypeCardProps {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function EventTypeCard({
  icon: Icon,
  titleKey,
  descKey,
  isSelected,
  onClick,
}: EventTypeCardProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative w-44 flex-shrink-0 p-5 rounded-2xl
        border-2 transition-all duration-200 ease-out text-start
        ${isSelected
          ? 'border-gold-500 bg-gold-50 shadow-lg shadow-gold-200/50'
          : 'border-cream-300 bg-white hover:border-gold-300 hover:shadow-md'
        }
      `}
    >
      <div
        className={`
          mb-3 w-12 h-12 rounded-xl flex items-center justify-center
          transition-all duration-200
          ${isSelected
            ? 'bg-gold-500 text-white'
            : 'bg-cream-100 text-gold-600 group-hover:bg-gold-100'
          }
        `}
      >
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="font-display text-lg text-stone-900 mb-1">
        {t(titleKey)}
      </h3>
      <p className="text-xs text-stone-500 leading-relaxed">
        {t(descKey)}
      </p>

      {isSelected && (
        <div className="absolute top-3 end-3 w-2.5 h-2.5 bg-gold-500 rounded-full" />
      )}
    </button>
  );
}
