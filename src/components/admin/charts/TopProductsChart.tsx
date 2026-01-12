import { useEffect, useRef, useState } from 'react';
import { Loader2, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useTopProducts } from '../../../hooks/useOrders';

export function TopProductsChart() {
  const { data: products, isLoading } = useTopProducts(5);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(400);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const chartData = products?.map((p) => ({
    name: p.product_name_fr.length > 12 ? p.product_name_fr.slice(0, 12) + '...' : p.product_name_fr,
    fullName: p.product_name_fr,
    quantity: p.quantity,
    revenue: p.revenue,
  })) ?? [];

  const colors = ['#c9a962', '#d4b56e', '#dfbf7a', '#e5c98a', '#ebd39a'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-gray-900">Top Produits</h3>
        <Package className="w-5 h-5 text-gray-400" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
        </div>
      ) : products?.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Aucune vente</p>
      ) : (
        <div ref={containerRef} className="w-full">
          <BarChart
            width={width}
            height={250}
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#374151' }}
              width={90}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                      <p className="font-medium">{d.fullName}</p>
                      <p className="text-gray-300">{d.quantity} vendus</p>
                      <p className="text-gold-400">{formatCurrency(d.revenue)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="quantity" radius={[0, 4, 4, 0]} fill="#c9a962">
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </div>
      )}
    </div>
  );
}
