import { useCartStore, useLanguageStore } from '../../stores';
import type { DeliveryMethod } from './DeliveryOptions';

interface OrderSummaryProps {
  deliveryMethod: DeliveryMethod;
}

const DELIVERY_FEE = 15;

export function OrderSummary({ deliveryMethod }: OrderSummaryProps) {
  const { items, subtotal } = useCartStore();
  const { language, t } = useLanguageStore();

  const subTotal = subtotal();
  const deliveryFee = deliveryMethod === 'delivery' ? DELIVERY_FEE : 0;
  const total = subTotal + deliveryFee;

  return (
    <div className="bg-cream-50 rounded-xl border border-cream-200 overflow-hidden">
      <div className="p-5 border-b border-cream-200">
        <h3 className="font-display text-lg text-stone-800">
          {t('Votre commande', 'ההזמנה שלך')}
        </h3>
      </div>

      <div className="p-5 space-y-3 max-h-64 overflow-y-auto">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex gap-3">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={language === 'fr' ? product.name_fr : product.name_he}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center
                  text-gold-300 font-display">D</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-800 truncate">
                {language === 'fr' ? product.name_fr : product.name_he}
              </p>
              <p className="text-xs text-stone-500">
                {t('Qté', 'כמות')}: {quantity}
              </p>
            </div>
            <p className="text-sm font-medium text-stone-700">
              {(product.price * quantity).toFixed(2)} CHF
            </p>
          </div>
        ))}
      </div>

      <div className="p-5 bg-white border-t border-cream-200 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">{t('Sous-total', 'סכום ביניים')}</span>
          <span className="text-stone-700">{subTotal.toFixed(2)} CHF</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">{t('Livraison', 'משלוח')}</span>
          <span className="text-stone-700">
            {deliveryFee === 0 ? t('Gratuit', 'חינם') : `${deliveryFee.toFixed(2)} CHF`}
          </span>
        </div>
        <div className="flex justify-between pt-3 border-t border-cream-200">
          <span className="font-medium text-stone-800">{t('Total', 'סה"כ')}</span>
          <span className="font-display text-xl text-gold-700">
            {total.toFixed(2)} CHF
          </span>
        </div>
      </div>
    </div>
  );
}
