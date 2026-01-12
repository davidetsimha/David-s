import { Loader2, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useEventTypeDistribution } from '../../../hooks/useQuotes';

const EVENT_LABELS: Record<string, string> = {
  bar_mitzvah: 'Bar Mitzvah',
  bat_mitzvah: 'Bat Mitzvah',
  brit: 'Brit Mila',
  private_party: 'Fete privee',
};

const COLORS = ['#c9a962', '#d4b56e', '#e5bc64', '#f59e0b'];

export function EventTypeChart() {
  const { data: events, isLoading } = useEventTypeDistribution();

  const total = events?.reduce((sum, e) => sum + e.count, 0) ?? 0;

  const chartData = events?.map(e => ({
    name: EVENT_LABELS[e.event_type] || e.event_type,
    value: e.count,
    avgGuests: e.avg_guests,
  })) ?? [];

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
        <div className="flex items-center gap-6">
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-gray-300">{data.value} devis</p>
                          <p className="text-gray-300">~{data.avgGuests} invites</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2">
            {chartData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600 flex-1">{item.name}</span>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-sm font-semibold text-gray-900">{total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
