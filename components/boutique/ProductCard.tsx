'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Plus, Minus, ShoppingBag, ImageOff, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/src/stores/cartStore';
import { Modal } from '@/src/components/ui/Modal';
import type { Product } from '@/src/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { addItem, getItemQuantity, updateQuantity, lastValidationError, clearValidationError } = useCartStore();
  const [imgError, setImgError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const quantity = getItemQuantity(product.id);
  const name = locale === 'fr' ? product.name_fr : product.name_he;
  const description = locale === 'fr' ? product.description_fr : product.description_he;
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

      {/* Image - Clickable to open modal */}
      <div
        className="relative aspect-square bg-cream-100 overflow-hidden cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {product.image_url && !imgError ? (
          <Image
            src={product.image_url}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgError(true)}
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
              {t('products.fridayPickup')}
            </span>
          )}
          {isPlateau && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
              <Clock className="w-3 h-3" />
              {minDays > 0 ? t('products.minDays', { days: minDays }) : t('products.onOrder')}
            </span>
          )}
          {requiresConfirmation && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
              {t('products.confirmationRequired')}
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

      {/* Product Detail Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="md:w-1/2 relative aspect-square">
            {product.image_url && !imgError ? (
              <Image
                src={product.image_url}
                alt={name}
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full bg-cream-100 rounded-xl flex items-center justify-center">
                <ImageOff className="w-16 h-16 text-cream-400" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:w-1/2 flex flex-col">
            {/* Name & Price */}
            <h2 className="font-display text-2xl text-stone-900 mb-2">{name}</h2>
            <p className="text-2xl text-gold-600 font-semibold mb-4">{price}</p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {isIndividual && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500/90 text-white text-sm font-medium rounded-full">
                  <Calendar className="w-4 h-4" />
                  {t('products.fridayPickup')}
                </span>
              )}
              {isPlateau && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/90 text-white text-sm font-medium rounded-full">
                  <Clock className="w-4 h-4" />
                  {minDays > 0 ? t('products.minDays', { days: minDays }) : t('products.onOrder')}
                </span>
              )}
              {requiresConfirmation && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-500/90 text-white text-sm font-medium rounded-full">
                  {t('products.confirmationRequired')}
                </span>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="text-stone-600 leading-relaxed mb-6 flex-1">
                {description}
              </p>
            )}

            {/* Cart Controls */}
            {product.available ? (
              <div className="mt-auto">
                {quantity === 0 ? (
                  <button
                    onClick={handleAdd}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gold-500 text-white font-medium hover:bg-gold-600 transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {t('products.addToCart')}
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-cream-100 rounded-xl p-2">
                    <button
                      onClick={handleDec}
                      className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-cream-200 transition-colors"
                    >
                      <Minus className="w-5 h-5 text-stone-600" />
                    </button>
                    <span className="font-semibold text-lg text-stone-900">{quantity}</span>
                    <button
                      onClick={handleInc}
                      className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-cream-200 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-stone-600" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-auto py-3 text-center bg-stone-100 rounded-xl text-stone-500 font-medium">
                {t('common.unavailable')}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </article>
  );
}
