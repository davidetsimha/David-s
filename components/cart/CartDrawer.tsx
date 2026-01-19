'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/src/stores';
import { ROUTES } from '@/config/routes';
import { CartItem } from './CartItem';
import { EmptyCart } from './EmptyCart';

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal } = useCartStore();
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'he';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && isOpen && closeCart();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeCart]);

  // RTL: drawer a gauche, sort vers la gauche
  // LTR: drawer a droite, sort vers la droite
  const panelClass = `fixed top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl
    flex flex-col transition-transform duration-300 ease-out
    ${isRTL ? 'left-0' : 'right-0'}
    ${isOpen ? 'translate-x-0' : isRTL ? '-translate-x-full' : 'translate-x-full'}`;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm transition-opacity
          duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      />
      <div className={panelClass} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between p-5 border-b border-cream-200">
          <h2 className="font-display text-xl text-stone-800">{t('cart.yourCart')}</h2>
          <button onClick={closeCart} className="p-2 -m-2 text-stone-500 hover:text-stone-700
            hover:bg-cream-100 rounded-full transition-colors" aria-label={t('common.close')}>
            <X className="w-5 h-5" />
          </button>
        </div>
        {items.length === 0 ? <EmptyCart /> : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map(({ product, quantity }) => (
                <CartItem key={product.id} product={product} quantity={quantity} />
              ))}
            </div>
            <div className="border-t border-cream-200 p-5 bg-cream-50/50">
              <div className="flex justify-between mb-4">
                <span className="text-stone-600">{t('cart.subtotal')}</span>
                <span className="font-display text-lg text-gold-700">{subtotal().toFixed(2)} {t('common.currency')}</span>
              </div>
              <Link href={ROUTES.CHECKOUT} onClick={closeCart}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gold-500
                  text-white font-medium rounded-lg shadow-md hover:bg-gold-600 transition-all">
                {t('cart.checkout')} <Arrow className="w-4 h-4" />
              </Link>
              <button onClick={closeCart}
                className="w-full mt-3 py-2.5 text-sm text-gold-700 hover:text-gold-800 transition-colors">
                {t('cart.continueShopping')}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
