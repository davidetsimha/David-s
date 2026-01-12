import { Loader2, Package } from 'lucide-react';
import { useTopProducts } from '../../../hooks/useOrders';

export function TopProductsChart() {
  const { data: products, isLoading } = useTopProducts(5);

  const maxQuantity = Math.max(...(products?.map((p) => p.quantity) ?? [1]));

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
        <div className="space-y-4">
          {products?.map((product, index) => {
            const width = (product.quantity / maxQuantity) * 100;
            return (
              <div key={product.product_name_fr}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 truncate flex-1 pr-4">
                    {index + 1}. {product.product_name_fr}
                  </span>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {product.quantity} vendus
                  </span>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatCurrency(product.revenue)} de CA
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
