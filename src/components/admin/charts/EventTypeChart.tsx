import { useState, useEffect } from 'react';
import { Loader2, Calendar, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useEventTypeDistribution } from '../../../hooks/useQuotes';

const EVENT_LABELS: Record<string, string> = {
  bar_mitzvah: 'Bar Mitzvah',
  bat_mitzvah: 'Bat Mitzvah',
  brit: 'Brit Mila',
  private_party: 'Fete privee',
};

const COLORS = [
  { main: '#c9a962', light: '#fdfaf3' },
  { main: '#22c55e', light: '#f0fdf4' },
  { main: '#3b82f6', light: '#eff6ff' },
  { main: '#f59e0b', light: '#fffbeb' },
  { main: '#ec4899', light: '#fdf2f8' },
];

export function EventTypeChart() {
  const { data: events, isLoading } = useEventTypeDistribution();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (events && !isAnimated) {
      setTimeout(() => setIsAnimated(true), 100);
    }
  }, [events, isAnimated]);

  const total = events?.reduce((sum, e) => sum + e.count, 0) ?? 0;

  const chartData = events?.map(e => ({
    name: EVENT_LABELS[e.event_type] || e.event_type,
    value: e.count,
    avgGuests: e.avg_guests,
  })) ?? [];

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Types d'evenements</h3>
          <p className="text-xs text-gray-400 mt-0.5">Repartition des devis</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
        </div>
      ) : events?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">Aucun devis</p>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          {/* Donut Chart */}
          <div className="w-44 h-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length].main}
                      stroke={activeIndex === index ? COLORS[index % COLORS.length].main : 'transparent'}
                      strokeWidth={activeIndex === index ? 4 : 0}
                      style={{
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        filter: activeIndex === index ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
                        transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: 'center',
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2.5">
            {chartData.map((item, index) => {
              const color = COLORS[index % COLORS.length];
              const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
              const isActive = activeIndex === index;

              return (
                <div
                  key={item.name}
                  className={`
                    flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200
                    ${isActive ? color.light : 'hover:bg-gray-50'}
                  `}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(undefined)}
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0 transition-transform duration-200"
                    style={{
                      backgroundColor: color.main,
                      transform: isActive ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm truncate ${isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                        {item.name}
                      </span>
                      <span className={`text-sm font-semibold ms-2 ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                        {item.value}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: color.main,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8">{percentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Total */}
            <div className="pt-3 mt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>Total devis</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
