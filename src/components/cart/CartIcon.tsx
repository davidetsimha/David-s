import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../stores';

export function CartIcon() {
  const { totalItems, openCart } = useCartStore();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const count = totalItems();

  return (
    <button
      onClick={openCart}
      className="relative p-2.5 group transition-all duration-200 rounded-full focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:outline-none"
      aria-label={t('cart.title')}
    >
      <ShoppingBag
        className="w-6 h-6 text-gold-700 group-hover:text-gold-900
          group-hover:scale-105 transition-all duration-200"
        strokeWidth={1.5}
      />
      {count > 0 && (
        <span
          className={`absolute -top-0.5 flex items-center justify-center
            min-w-5 h-5 px-1.5 text-xs font-semibold
            bg-gold-600 text-white rounded-full
            shadow-md shadow-gold-600/30
            animate-scale-in
            ${direction === 'rtl' ? '-start-0.5' : '-end-0.5'}`}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
      <span
        className="absolute inset-0 rounded-full bg-gold-100
          scale-0 group-hover:scale-100 transition-transform duration-200 -z-10"
      />
    </button>
  );
}
