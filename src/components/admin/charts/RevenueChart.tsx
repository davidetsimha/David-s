import { useState } from 'react';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { useRevenueAnalytics } from '../../../hooks/useOrders';

export function RevenueChart() {
  const [days, setDays] = useState(7);
  const { data, isLoading } = useRevenueAnalytics(days);

  const maxRevenue = Math.max(1, ...(data?.map((d) => d.revenue) ?? []));
  const totalRevenue = data?.reduce((sum, d) => sum + d.revenue, 0) ?? 0;
  const totalOrders = data?.reduce((sum, d) => sum + d.orders, 0) ?? 0;

  // Compare first half vs second half for trend
  const midpoint = Math.floor((data?.length ?? 0) / 2);
  const firstHalfRevenue = data?.slice(0, midpoint).reduce((sum, d) => sum + d.revenue, 0) ?? 0;
  const secondHalfRevenue = data?.slice(midpoint).reduce((sum, d) => sum + d.revenue, 0) ?? 0;
  const trend = firstHalfRevenue > 0 ? Math.round(((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100) : 0;

  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-medium text-gray-900">Chiffre d'affaires</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-semibold text-gold-600">{formatCurrency(totalRevenue)}</span>
            {trend !== 0 && (
              <span className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{totalOrders} commandes</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 text-sm rounded-md transition-all ${
                days === d ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {d}j
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
        </div>
      ) : (
        <div className="relative">
          {/* Bar Chart */}
          <div className="flex items-end gap-1 h-40">
            {data?.map((point) => {
              const height = maxRevenue > 0 ? (point.revenue / maxRevenue) * 100 : 0;
              return (
                <div
                  key={point.date}
                  className="flex-1 group relative"
                >
                  <div
                    className="w-full bg-gradient-to-t from-gold-500 to-gold-400 rounded-t transition-all hover:from-gold-600 hover:to-gold-500"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {formatCurrency(point.revenue)}
                    <br />
                    {point.orders} cmd
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="flex gap-1 mt-2">
            {data?.map((point, index) => (
              <div
                key={point.date}
                className="flex-1 text-center text-xs text-gray-400 truncate"
              >
                {days <= 7 || index % 2 === 0 ? formatDay(point.date) : ''}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
