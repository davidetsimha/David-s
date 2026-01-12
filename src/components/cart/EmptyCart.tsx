import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../stores';
import { ROUTES } from '../../config/routes';

export function EmptyCart() {
  const { t } = useTranslation();
  const { closeCart } = useCartStore();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cream-100 to-cream-200
          flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-gold-400" strokeWidth={1.5} />
        </div>
        {/* Subtle pulse animation - finite, not infinite ping */}
        <div className="absolute inset-0 rounded-full bg-gold-200/30 animate-pulse" />
      </div>

      <h3 className="font-display text-xl text-stone-800 mb-2">
        {t('cart.empty')}
      </h3>
      <p className="text-stone-500 text-sm mb-6 max-w-xs">
        {t('cart.emptyMessage')}
      </p>

      <Link
        to={ROUTES.RECEPTIONS}
        onClick={closeCart}
        className="inline-flex items-center gap-2 px-6 py-3
          bg-gold-500 text-white font-medium rounded-lg
          shadow-md shadow-gold-500/20
          hover:bg-gold-600 hover:shadow-lg hover:shadow-gold-500/30
          active:shadow-sm active:translate-y-0.5
          transition-all duration-200"
      >
        {t('cart.discoverProducts')}
      </Link>
    </div>
  );
}
