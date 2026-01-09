import { useState } from 'react';
import { Plus, Minus, ShoppingBag, ImageOff } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useLanguageStore } from '../../stores/languageStore';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguageStore();
  const { addItem, getItemQuantity, updateQuantity } = useCartStore();
  const [imgError, setImgError] = useState(false);

  const quantity = getItemQuantity(product.id);
  const name = t(product.name_fr, product.name_he);
  const price = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
  }).format(product.price);

  const handleAdd = () => addItem(product, 1);
  const handleInc = () => updateQuantity(product.id, quantity + 1);
  const handleDec = () => updateQuantity(product.id, quantity - 1);

  return (
    <article className="group bg-white rounded-2xl border border-cream-200 overflow-hidden hover:shadow-lg hover:border-gold-200 transition-all duration-300">
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

        {!product.available && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {t('Indisponible', 'לא זמין')}
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-display text-lg text-gray-900 mb-1 truncate">
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
              {t('Ajouter', 'הוסף')}
            </button>
          ) : (
            <div className="flex items-center justify-between bg-cream-100 rounded-xl p-1">
              <button
                onClick={handleDec}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-cream-200 transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="font-semibold text-gray-900">{quantity}</span>
              <button
                onClick={handleInc}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-cream-200 transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )
        )}
      </div>
    </article>
  );
}
