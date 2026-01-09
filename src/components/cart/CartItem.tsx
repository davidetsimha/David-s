import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore, useLanguageStore } from '../../stores';
import type { Product } from '../../types';

interface CartItemProps {
  product: Product;
  quantity: number;
}

export function CartItem({ product, quantity }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { language, t } = useLanguageStore();

  const name = language === 'fr' ? product.name_fr : product.name_he;
  const lineTotal = product.price * quantity;

  return (
    <div className="group flex gap-4 p-4 bg-cream-50/50 rounded-xl
      border border-transparent hover:border-gold-200
      transition-all duration-300">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={name}
            className="w-full h-full object-cover
              group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center
            text-gold-300 font-display text-2xl">
            D
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="font-medium text-stone-800 truncate">{name}</h4>
          <p className="text-sm text-gold-600 mt-0.5">
            {product.price.toFixed(2)} {t('CHF', 'CHF')}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 bg-white rounded-lg
            border border-gray-200 shadow-sm">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="p-1.5 text-stone-500 hover:text-gold-700
                hover:bg-gold-50 rounded-s-lg transition-colors"
              aria-label={t('Diminuer', 'הפחת')}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="p-1.5 text-stone-500 hover:text-gold-700
                hover:bg-gold-50 rounded-e-lg transition-colors"
              aria-label={t('Augmenter', 'הוסף')}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-medium text-stone-800">
              {lineTotal.toFixed(2)} {t('CHF', 'CHF')}
            </span>
            <button
              onClick={() => removeItem(product.id)}
              className="p-1.5 text-stone-400 hover:text-red-500
                hover:bg-red-50 rounded-lg transition-all"
              aria-label={t('Supprimer', 'הסר')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
