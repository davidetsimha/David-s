import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus, ShoppingBag, ImageOff, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const { addItem, getItemQuantity, updateQuantity, lastValidationError, clearValidationError } = useCartStore();
  const [imgError, setImgError] = useState(false);
  const [showError, setShowError] = useState(false);

  const quantity = getItemQuantity(product.id);
  const name = i18n.language === 'fr' ? product.name_fr : product.name_he;
  const price = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
  }).format(product.price);

  // Product type badges
  const isIndividual = product.product_type === 'individual';
  const isPlateau = product.product_type === 'plateau';
  const requiresConfirmation = product.requires_confirmation;
  const minDays = product.min_days_advance || 0;

  const handleAdd = () => {
    const result = addItem(product, 1);
    if (!result.valid) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        clearValidationError();
      }, 4000);
    }
  };
  const handleInc = () => updateQuantity(product.id, quantity + 1);
  const handleDec = () => updateQuantity(product.id, quantity - 1);

  return (
    <article className="group bg-white rounded-2xl border border-cream-200 overflow-hidden hover:shadow-lg hover:border-gold-200 transition-all duration-200 relative">
      {/* Mixed cart error toast */}
      {showError && lastValidationError?.message && (
        <div className="absolute top-2 left-2 right-2 z-20 p-3 bg-red-50 border border-red-200 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{lastValidationError.message}</p>
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square bg-cream-100 overflow-hidden">
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-12 h-12 text-cream-400" />
          </div>
        )}

        {/* Product type badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isIndividual && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
              <Calendar className="w-3 h-3" />
              {i18n.language === 'fr' ? 'Retrait vendredi' : 'איסוף יום שישי'}
            </span>
          )}
          {isPlateau && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
              <Clock className="w-3 h-3" />
              {minDays > 0
                ? i18n.language === 'fr'
                  ? `${minDays}j min.`
                  : `${minDays} ימים מינ.`
                : i18n.language === 'fr'
                  ? 'Sur commande'
                  : 'בהזמנה'}
            </span>
          )}
          {requiresConfirmation && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
              {i18n.language === 'fr' ? 'Confirmation requise' : 'דורש אישור'}
            </span>
          )}
        </div>

        {!product.available && (
          <div className="absolute inset-0 bg-stone-900/50 flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {t('common.unavailable')}
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-display text-lg text-stone-900 mb-1 truncate">
          {name}
        </h3>
        <p className="text-gold-600 font-semibold mb-4">{price}</p>

        {/* Cart Controls */}
        {product.available && (
          quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gold-500 text-white font-medium hover:bg-gold-600 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              {t('common.add')}
            </button>
          ) : (
            <div className="flex items-center justify-between bg-cream-100 rounded-xl p-1">
              <button
                onClick={handleDec}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-cream-200 transition-colors"
              >
                <Minus className="w-4 h-4 text-stone-600" />
              </button>
              <span className="font-semibold text-stone-900">{quantity}</span>
              <button
                onClick={handleInc}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-cream-200 transition-colors"
              >
                <Plus className="w-4 h-4 text-stone-600" />
              </button>
            </div>
          )
        )}
      </div>
    </article>
  );
}
