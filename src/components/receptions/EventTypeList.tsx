import { useTranslation } from 'react-i18next';
import {
  Star,
  Baby,
  PartyPopper,
  Sparkles,
} from 'lucide-react';
import { EventTypeCard } from './EventTypeCard';
import type { EventType } from '../../types';

const EVENT_TYPES = [
  {
    type: 'bar_mitzvah' as EventType,
    icon: Star,
    titleKey: 'receptions.eventTypes.bar_mitzvah',
    descKey: 'receptions.eventDesc.bar_mitzvah',
  },
  {
    type: 'bat_mitzvah' as EventType,
    icon: Sparkles,
    titleKey: 'receptions.eventTypes.bat_mitzvah',
    descKey: 'receptions.eventDesc.bat_mitzvah',
  },
  {
    type: 'brit' as EventType,
    icon: Baby,
    titleKey: 'receptions.eventTypes.brit',
    descKey: 'receptions.eventDesc.brit',
  },
  {
    type: 'private_party' as EventType,
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
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

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
