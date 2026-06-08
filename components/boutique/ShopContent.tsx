'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Calendar, ShoppingBag, Truck, Clock } from 'lucide-react';
import { ProductSection } from './ProductSection';
import { useCartStore } from '@/stores/cartStore';
import type { Product, Category } from '@/types';

interface ShopContentProps {
  initialProducts: Product[];
  categories: Category[];
}

type ActiveTab = 'shabbat' | 'semaine';

export function ShopContent({ initialProducts, categories }: ShopContentProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const { totalItems, openCart } = useCartStore();
  const initialTab: ActiveTab = searchParams.get('tab') === 'semaine' ? 'semaine' : 'shabbat';
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevTab = useRef<ActiveTab>(initialTab);

  // Pattern identique au Header : 0 côté serveur pour éviter le mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const cartCount = mounted ? totalItems() : 0;

  const shabbatProducts = initialProducts.filter((p) => p.product_type === 'individual');
  const semaineProducts = initialProducts.filter((p) => p.product_type === 'plateau');

  const dayOfWeek = mounted ? new Date().getDay() : 0;
  const daysUntilFriday = ((5 - dayOfWeek + 7) % 7) || 7;
  const isLastNight = mounted && dayOfWeek === 4 && new Date().getHours() >= 18;
  const showUrgency = mounted && (daysUntilFriday <= 3 || isLastNight);

  const handleTabChange = (tab: ActiveTab) => {
    if (tab === activeTab || isAnimating) return;
    prevTab.current = activeTab;
    setIsAnimating(true);
    setActiveTab(tab);
    setTimeout(() => setIsAnimating(false), 400);
  };

  return (
    <>
      {/* Cart Banner */}
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

      {/* Tab Navigation */}
      <div className="sticky top-0 z-20 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex relative">
            {/* Sliding underline indicator */}
            <div
              className="absolute bottom-0 h-0.5 w-1/2 bg-gold-500 transition-transform duration-400 ease-in-out"
              style={{ transform: activeTab === 'semaine' ? 'translateX(100%)' : 'translateX(0%)' }}
            />

            <button
              onClick={() => handleTabChange('shabbat')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors duration-200
                ${activeTab === 'shabbat' ? 'text-gold-600' : 'text-stone-400 hover:text-stone-600'}`}
            >
              <Calendar className="w-4 h-4" />
              Commandes Chabbat
            </button>

            <button
              onClick={() => handleTabChange('semaine')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors duration-200
                ${activeTab === 'semaine' ? 'text-gold-600' : 'text-stone-400 hover:text-stone-600'}`}
            >
              <Clock className="w-4 h-4" />
              Commandes Semaine
            </button>
          </div>
        </div>
      </div>

      {/* Sliding content */}
      <div className="overflow-hidden">
        <div
          className="flex w-[200%] transition-transform duration-400 ease-in-out"
          style={{
            transform: activeTab === 'semaine' ? 'translateX(-50%)' : 'translateX(0%)',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Shabbat panel */}
          <div className="w-1/2">
            <ProductSection
              variant="shabbat"
              products={shabbatProducts}
              categories={categories}
            />
          </div>

          {/* Semaine panel */}
          <div className="w-1/2">
            <ProductSection
              variant="semaine"
              products={semaineProducts}
              categories={categories}
            />
          </div>
        </div>
      </div>

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
