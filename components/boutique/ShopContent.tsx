'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, ShoppingBag, Truck } from 'lucide-react';
import { ProductFilters } from './ProductFilters';
import { ProductGrid } from './ProductGrid';
import { useCartStore } from '@/src/stores/cartStore';
import type { Product, Category } from '@/src/types';

interface ShopContentProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ShopContent({ initialProducts, categories }: ShopContentProps) {
  const t = useTranslations();
  const [categoryId, setCategoryId] = useState<string>();
  const { totalItems, openCart } = useCartStore();

  const cartCount = totalItems();

  // Filter products client-side based on selected category
  const filteredProducts = categoryId
    ? initialProducts.filter((p) => p.category_id === categoryId)
    : initialProducts;

  return (
    <>
      {/* Cart Banner (if items in cart) */}
      {cartCount > 0 && (
        <div className="bg-bronze-500 text-white py-3 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <span className="text-sm">
              {cartCount} {t('shop.cartItems')}
            </span>
            <button
              onClick={() => openCart()}
              className="text-sm font-medium underline underline-offset-2 hover:no-underline"
            >
              {t('shop.viewCart')}
            </button>
          </div>
        </div>
      )}

      {/* Products Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="font-display text-2xl md:text-3xl text-stone-900 mb-2">
              {t('shop.productsTitle')}
            </h2>
            <p className="text-stone-500">
              {t('shop.productsSubtitle')}
            </p>
          </div>

          <ProductFilters
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
          />

          <div className="mt-8">
            <ProductGrid products={filteredProducts} isLoading={false} />
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-4 bg-cream-100/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-bronze-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-bronze-600" />
              </div>
              <h3 className="font-medium text-stone-900 mb-2">
                {t('shop.howTo.orderTitle')}
              </h3>
              <p className="text-sm text-stone-500">
                {t('shop.howTo.orderDesc')}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-bronze-100 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-bronze-600" />
              </div>
              <h3 className="font-medium text-stone-900 mb-2">
                {t('shop.howTo.prepareTitle')}
              </h3>
              <p className="text-sm text-stone-500">
                {t('shop.howTo.prepareDesc')}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-bronze-100 flex items-center justify-center">
                <Truck className="w-6 h-6 text-bronze-600" />
              </div>
              <h3 className="font-medium text-stone-900 mb-2">
                {t('shop.howTo.deliverTitle')}
              </h3>
              <p className="text-sm text-stone-500">
                {t('shop.howTo.deliverDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
