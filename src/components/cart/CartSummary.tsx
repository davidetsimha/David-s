import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../stores';

interface CartSummaryProps {
  showItems?: boolean;
}

export function CartSummary({ showItems = false }: CartSummaryProps) {
  const { items, subtotal } = useCartStore();
  const { t, i18n } = useTranslation();

  const total = subtotal();

  return (
    <div className="bg-cream-50 rounded-xl p-5 border border-cream-200">
      <h3 className="font-display text-lg text-stone-800 mb-4">
        {t('cart.orderSummary')}
      </h3>

      {showItems && items.length > 0 && (
        <div className="space-y-3 mb-4 pb-4 border-b border-cream-200">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between text-sm">
              <span className="text-stone-600">
                {i18n.language === 'fr' ? product.name_fr : product.name_he}
                <span className="text-stone-400 ms-1">x{quantity}</span>
              </span>
              <span className="font-medium text-stone-700">
                {(product.price * quantity).toFixed(2)} ₪
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">{t('cart.subtotal')}</span>
          <span className="text-stone-700">{total.toFixed(2)} ₪</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">{t('cart.delivery')}</span>
          <span className="text-stone-500 italic">
            {t('cart.deliveryCalculated')}
          </span>
        </div>
      </div>

      <div className="flex justify-between mt-4 pt-4 border-t border-cream-200">
        <span className="font-medium text-stone-800">{t('cart.total')}</span>
        <span className="font-display text-xl text-gold-700">
          {total.toFixed(2)} ₪
        </span>
      </div>
    </div>
  );
}
