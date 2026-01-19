'use client';

import { useTranslations, useLocale } from 'next-intl';
import {
  Star,
  Baby,
  PartyPopper,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type { EventType } from '@/types';

const EVENT_TYPES: Array<{
  type: EventType;
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
}> = [
  {
    type: 'bar_mitzvah',
    icon: Star,
    titleKey: 'receptions.eventTypes.bar_mitzvah',
    descKey: 'receptions.eventDesc.bar_mitzvah',
  },
  {
    type: 'bat_mitzvah',
    icon: Sparkles,
    titleKey: 'receptions.eventTypes.bat_mitzvah',
    descKey: 'receptions.eventDesc.bat_mitzvah',
  },
  {
    type: 'brit',
    icon: Baby,
    titleKey: 'receptions.eventTypes.brit',
    descKey: 'receptions.eventDesc.brit',
  },
  {
    type: 'private_party',
    icon: PartyPopper,
    titleKey: 'receptions.eventTypes.private_party',
    descKey: 'receptions.eventDesc.private_party',
  },
];

interface EventTypeListProps {
  selected?: EventType;
  onSelect: (type: EventType) => void;
}

export function EventTypeList({ selected, onSelect }: EventTypeListProps) {
  const t = useTranslations();
  const locale = useLocale();
  const direction = locale === 'he' ? 'rtl' : 'ltr';

  return (
    <section className="py-8">
      <h2 className="font-display text-2xl text-stone-900 mb-6">
        {t('receptions.quoteForm.eventType')}
      </h2>

      <div
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ direction }}
      >
        {EVENT_TYPES.map((event) => (
          <EventTypeCard
            key={event.type}
            icon={event.icon}
            titleKey={event.titleKey}
            descKey={event.descKey}
            isSelected={selected === event.type}
            onClick={() => onSelect(event.type)}
          />
        ))}
      </div>
    </section>
  );
}

interface EventTypeCardProps {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  isSelected?: boolean;
  onClick?: () => void;
}

function EventTypeCard({
  icon: Icon,
  titleKey,
  descKey,
  isSelected,
  onClick,
}: EventTypeCardProps) {
  const t = useTranslations();

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
