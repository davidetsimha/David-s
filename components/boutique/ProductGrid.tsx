'use client';

import { useTranslations } from 'next-intl';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/src/components/ui/Skeleton';
import type { Product } from '@/src/types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  const t = useTranslations();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
            <Skeleton variant="rectangular" className="aspect-square" />
            <div className="p-4 space-y-2">
              <Skeleton width="70%" />
              <Skeleton width="40%" />
              <Skeleton variant="rectangular" height={44} className="mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-stone-500">
          {t('common.noProductsFound')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
