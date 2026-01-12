import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, Trash2, Undo2 } from 'lucide-react';
import { useCartStore } from '../../stores';
import type { Product } from '../../types';

interface CartItemProps {
  product: Product;
  quantity: number;
}

const UNDO_DELAY_MS = 3000;

export function CartItem({ product, quantity }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { t, i18n } = useTranslation();
  const [pendingRemoval, setPendingRemoval] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleRemove = () => {
    setPendingRemoval(true);
    timeoutRef.current = setTimeout(() => {
      removeItem(product.id);
    }, UNDO_DELAY_MS);
  };

  const handleUndo = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setPendingRemoval(false);
  };

  const name = i18n.language === 'fr' ? product.name_fr : product.name_he;
  const lineTotal = product.price * quantity;

  // Show pending removal state with undo option
  if (pendingRemoval) {
    return (
      <div className="flex items-center justify-between gap-4 p-4 bg-stone-100 rounded-xl
        border border-stone-200 transition-all duration-200">
        <span className="text-stone-500 text-sm">
          {t('cart.itemRemoved')}
        </span>
        <button
          onClick={handleUndo}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-gold-700
            bg-white border border-gold-300 rounded-lg font-medium text-sm
            hover:bg-gold-50 transition-colors min-h-[44px]"
          aria-label={t('common.undo')}
        >
          <Undo2 className="w-4 h-4" />
          {t('common.undo')}
        </button>
      </div>
    );
  }

  return (
    <div className="group flex gap-4 p-4 bg-cream-50/50 rounded-xl
      border border-transparent hover:border-gold-200
      transition-all duration-200">
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
            {product.price.toFixed(2)} {t('common.currency')}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 bg-white rounded-lg
            border border-stone-200 shadow-sm">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="p-2.5 text-stone-500 hover:text-gold-700
                hover:bg-gold-50 rounded-s-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={t('common.decrease')}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="p-2.5 text-stone-500 hover:text-gold-700
                hover:bg-gold-50 rounded-e-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={t('common.increase')}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-medium text-stone-800">
              {lineTotal.toFixed(2)} {t('common.currency')}
            </span>
            <button
              onClick={handleRemove}
              className="p-2.5 text-stone-400 hover:text-red-500
                hover:bg-red-50 rounded-lg transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={t('common.delete')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
