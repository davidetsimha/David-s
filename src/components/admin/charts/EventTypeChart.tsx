import { Loader2, Calendar } from 'lucide-react';
import { useEventTypeDistribution } from '../../../hooks/useQuotes';

const EVENT_LABELS: Record<string, string> = {
  bar_mitzvah: 'Bar Mitzvah',
  bat_mitzvah: 'Bat Mitzvah',
  brit: 'Brit Mila',
  private_party: 'Fete privee',
};

const EVENT_COLORS = [
  'from-gold-400 to-gold-500',
  'from-amber-400 to-amber-500',
  'from-yellow-400 to-yellow-500',
  'from-orange-400 to-orange-500',
];

export function EventTypeChart() {
  const { data: events, isLoading } = useEventTypeDistribution();

  const total = events?.reduce((sum, e) => sum + e.count, 0) ?? 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-gray-900">Types d'evenements</h3>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
        </div>
      ) : events?.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Aucun devis</p>
      ) : (
        <div className="space-y-4">
          {events?.map((event, index) => {
            const percentage = total > 0 ? Math.round((event.count / total) * 100) : 0;
            const colorClass = EVENT_COLORS[index % EVENT_COLORS.length];
            return (
              <div key={event.event_type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {EVENT_LABELS[event.event_type] || event.event_type}
                  </span>
                  <span className="text-sm text-gray-500">
                    {event.count} ({percentage}%)
                  </span>
                </div>
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full bg-gradient-to-r ${colorClass} rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  ~{event.avg_guests} invites en moyenne
                </div>
              </div>
            );
          })}

          {/* Total */}
          <div className="pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{total}</span> devis au total
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
