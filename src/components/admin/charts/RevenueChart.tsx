import { useState, useEffect, useRef } from 'react';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useRevenueAnalytics } from '../../../hooks/useOrders';

export function RevenueChart() {
  const [days, setDays] = useState(7);
  const { data, isLoading } = useRevenueAnalytics(days);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 250 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: 250,
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const totalRevenue = data?.reduce((sum, d) => sum + d.revenue, 0) ?? 0;
  const totalOrders = data?.reduce((sum, d) => sum + d.orders, 0) ?? 0;

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

  const chartData = data?.map(d => ({
    ...d,
    name: formatDay(d.date),
  })) ?? [];

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
        <div ref={containerRef} className="w-full">
          <BarChart
            width={dimensions.width}
            height={dimensions.height}
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickFormatter={(value) => `${value >= 1000 ? `${value/1000}k` : value}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                      <p className="font-medium">{formatCurrency(d.revenue)}</p>
                      <p className="text-gray-300">{d.orders} commandes</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]} fill="#c9a962">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.revenue > 0 ? '#c9a962' : '#e5e7eb'}
                />
              ))}
            </Bar>
          </BarChart>
        </div>
      )}
    </div>
  );
}
