import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../stores';
import { useLanguageStore } from '../../stores';

export function CartIcon() {
  const { totalItems, openCart } = useCartStore();
  const { direction, t } = useLanguageStore();
  const count = totalItems();

  return (
    <button
      onClick={openCart}
      className="relative p-2.5 group transition-all duration-300"
      aria-label={t('Panier', 'סל קניות')}
    >
      <ShoppingBag
        className="w-6 h-6 text-gold-700 group-hover:text-gold-900
          group-hover:scale-105 transition-all duration-300"
        strokeWidth={1.5}
      />
      {count > 0 && (
        <span
          className={`absolute -top-0.5 flex items-center justify-center
            min-w-5 h-5 px-1.5 text-xs font-semibold
            bg-gold-600 text-white rounded-full
            shadow-md shadow-gold-600/30
            animate-scale-in
            ${direction === 'rtl' ? '-left-0.5' : '-right-0.5'}`}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
      <span
        className="absolute inset-0 rounded-full bg-gold-100
          scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"
      />
    </button>
  );
}
