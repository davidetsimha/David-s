import { useState } from 'react';
import { Loader2, Package, TrendingUp } from 'lucide-react';
import { useTopProducts } from '../../../hooks/useOrders';

export function TopProductsChart() {
  const { data: products, isLoading } = useTopProducts(5);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const maxQuantity = Math.max(...(products?.map(p => p.quantity) ?? [1]));

  const colors = [
    { bar: '#c9a962', bg: 'bg-gold-50' },
    { bar: '#d4b56e', bg: 'bg-amber-50' },
    { bar: '#e5bc64', bg: 'bg-yellow-50' },
    { bar: '#f59e0b', bg: 'bg-orange-50' },
    { bar: '#fbbf24', bg: 'bg-amber-50' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Top Produits</h3>
          <p className="text-xs text-gray-400 mt-0.5">Par quantite vendue</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <Package className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
        </div>
      ) : products?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Package className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">Aucune vente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products?.map((product, index) => {
            const percentage = (product.quantity / maxQuantity) * 100;
            const color = colors[index % colors.length];
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={product.product_name_fr}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`
                      w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold
                      transition-all duration-300
                      ${isHovered ? 'bg-gray-900 text-white scale-110' : 'bg-gray-100 text-gray-500'}
                    `}>
                      {index + 1}
                    </span>
                    <span className={`
                      text-sm truncate transition-colors duration-200
                      ${isHovered ? 'text-gray-900 font-medium' : 'text-gray-600'}
                    `}>
                      {product.product_name_fr}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`
                      text-sm font-semibold transition-all duration-200
                      ${isHovered ? 'text-gold-600' : 'text-gray-900'}
                    `}>
                      {product.quantity}
                    </span>
                    <span className="text-xs text-gray-400 w-16 text-end">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 start-0 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, ${color.bar} 0%, ${color.bar}dd 100%)`,
                      transform: isHovered ? 'scaleY(1.2)' : 'scaleY(1)',
                      transformOrigin: 'center',
                      boxShadow: isHovered ? `0 0 12px ${color.bar}66` : 'none',
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Total summary */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp className="w-4 h-4" />
                <span>Total vendu</span>
              </div>
              <div className="text-end">
                <span className="text-lg font-semibold text-gray-900">
                  {products?.reduce((sum, p) => sum + p.quantity, 0)}
                </span>
                <span className="text-sm text-gray-400 ms-2">
                  ({formatCurrency(products?.reduce((sum, p) => sum + p.revenue, 0) ?? 0)})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
