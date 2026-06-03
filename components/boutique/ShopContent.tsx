'use client';

import { useTranslations } from 'next-intl';
import { Calendar, ShoppingBag, Truck, Clock } from 'lucide-react';
import { ProductSection } from './ProductSection';
import { useCartStore } from '@/stores/cartStore';
import type { Product, Category } from '@/types';

interface ShopContentProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ShopContent({ initialProducts, categories }: ShopContentProps) {
  const t = useTranslations();
  const { totalItems, openCart } = useCartStore();

  const cartCount = totalItems();

  const shabbatProducts = initialProducts.filter((p) => p.product_type === 'individual');
  const semaineProducts = initialProducts.filter((p) => p.product_type === 'plateau');

  // Urgence Chabbat
  const dayOfWeek = new Date().getDay();
  const daysUntilFriday = ((5 - dayOfWeek + 7) % 7) || 7;
  const isLastNight = dayOfWeek === 4 && new Date().getHours() >= 18;
  const showUrgency = daysUntilFriday <= 3 || isLastNight;

  return (
    <>
      {/* Cart Banner (if items in cart) */}
      {cartCount > 0 && (
        <div className="sticky top-0 z-30 bg-gold-500 text-white py-3 px-4 shadow-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <span className="text-sm flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 animate-bounce" />
              <strong>{cartCount}</strong> {t('shop.cartItems')}
            </span>
            <button
              onClick={() => openCart()}
              className="text-sm font-semibold bg-white/20 px-4 py-1.5
                rounded-full hover:bg-white/30 transition-colors"
            >
              {t('shop.viewCart')} →
            </button>
          </div>
        </div>
      )}

      {/* Urgency Banner */}
      {showUrgency && (
        <div className={`px-4 py-3 ${isLastNight ? 'bg-red-50 border-b border-red-200' : 'bg-amber-50 border-b border-amber-200'}`}>
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <Clock className={`w-5 h-5 flex-shrink-0 ${isLastNight ? 'text-red-500' : 'text-amber-600'}`} />
            <p className={`text-sm font-medium ${isLastNight ? 'text-red-800' : 'text-amber-800'}`}>
              {isLastNight
                ? t('shop.urgency.lastChance')
                : t('shop.urgency.daysLeft', { days: daysUntilFriday })}
            </p>
          </div>
        </div>
      )}

      {/* Shabbat Section */}
      <ProductSection
        variant="shabbat"
        products={shabbatProducts}
        categories={categories}
      />

      {/* Separator */}
      {shabbatProducts.length > 0 && semaineProducts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
        </div>
      )}

      {/* Semaine Section */}
      <ProductSection
        variant="semaine"
        products={semaineProducts}
        categories={categories}
      />

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
