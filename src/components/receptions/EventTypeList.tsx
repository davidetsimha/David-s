import {
  Star,
  Baby,
  PartyPopper,
  Sparkles,
} from 'lucide-react';
import { EventTypeCard } from './EventTypeCard';
import { useLanguageStore } from '../../stores/languageStore';
import type { EventType } from '../../types';

const EVENT_TYPES = [
  {
    type: 'bar_mitzvah' as EventType,
    icon: Star,
    titleFr: 'Bar Mitzvah',
    titleHe: 'בר מצווה',
    descFr: 'Celebrer ce moment',
    descHe: 'חגיגת הרגע',
  },
  {
    type: 'bat_mitzvah' as EventType,
    icon: Sparkles,
    titleFr: 'Bat Mitzvah',
    titleHe: 'בת מצווה',
    descFr: 'Un jour special',
    descHe: 'יום מיוחד',
  },
  {
    type: 'brit' as EventType,
    icon: Baby,
    titleFr: 'Brit Mila',
    titleHe: 'ברית מילה',
    descFr: 'Accueillir la vie',
    descHe: 'קבלת פני החיים',
  },
  {
    type: 'private_party' as EventType,
    icon: PartyPopper,
    titleFr: 'Fete Privee',
    titleHe: 'מסיבה פרטית',
    descFr: 'Vos evenements',
    descHe: 'האירועים שלכם',
  },
];

interface EventTypeListProps {
  selected?: EventType;
  onSelect: (type: EventType) => void;
}

export function EventTypeList({ selected, onSelect }: EventTypeListProps) {
  const { t, direction } = useLanguageStore();

  return (
    <section className="py-8">
      <h2 className="font-display text-2xl text-gray-900 mb-6">
        {t('Type d\'evenement', 'סוג האירוע')}
      </h2>

      <div
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ direction }}
      >
        {EVENT_TYPES.map((event) => (
          <EventTypeCard
            key={event.type}
            icon={event.icon}
            titleFr={event.titleFr}
            titleHe={event.titleHe}
            descFr={event.descFr}
            descHe={event.descHe}
            isSelected={selected === event.type}
            onClick={() => onSelect(event.type)}
          />
        ))}
      </div>
    </section>
  );
}
