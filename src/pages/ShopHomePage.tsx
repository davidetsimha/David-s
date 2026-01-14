import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, ShoppingBag, Truck } from 'lucide-react';
import { ProductFilters } from '../components/shabbat/ProductFilters';
import { ProductGrid } from '../components/shabbat/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useCartStore } from '../stores';

export function ShopHomePage() {
  const { t } = useTranslation();
  const [categoryId, setCategoryId] = useState<string>();
  const { totalItems } = useCartStore();

  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useProducts({
    category_id: categoryId,
    available: true,
  });

  const cartCount = totalItems();

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/images/gallery/petits-fours-1.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-bronze-500/20 backdrop-blur-sm
            border border-bronze-400/30 rounded-full mb-6">
            <Calendar className="w-4 h-4 text-bronze-300" />
            <span className="text-sm font-medium text-bronze-200">
              {t('shop.orderBefore', 'Commandez avant jeudi minuit')}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            {t('shop.title', 'Boutique Shabbat')}
          </h1>

          <p className="text-lg text-cream-100/90 max-w-xl mx-auto mb-8">
            {t('shop.subtitle', 'Challot, pâtisseries et délices artisanaux livrés chez vous à Jérusalem')}
          </p>

          {/* Features */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-cream-200/80">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              <span className="text-sm">{t('shop.freeDelivery', 'Livraison Jérusalem')}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span className="text-sm">{t('shop.freshProducts', 'Produits frais')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Banner (if items in cart) */}
      {cartCount > 0 && (
        <div className="bg-bronze-500 text-white py-3 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <span className="text-sm">
              {t('shop.cartItems', { count: cartCount }, `${cartCount} article(s) dans votre panier`)}
            </span>
            <button
              onClick={() => useCartStore.getState().openCart()}
              className="text-sm font-medium underline underline-offset-2 hover:no-underline"
            >
              {t('shop.viewCart', 'Voir le panier')}
            </button>
          </div>
        </div>
      )}

      {/* Products Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="font-display text-2xl md:text-3xl text-stone-900 mb-2">
              {t('shop.productsTitle', 'Nos Produits')}
            </h2>
            <p className="text-stone-500">
              {t('shop.productsSubtitle', 'Sélectionnez vos favoris pour ce Shabbat')}
            </p>
          </div>

          <ProductFilters
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
          />

          <div className="mt-8">
            <ProductGrid products={products} isLoading={isLoading} />
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-4 bg-cream-100/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-bronze-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-bronze-600" />
              </div>
              <h3 className="font-medium text-stone-900 mb-2">
                {t('shop.howTo.orderTitle', 'Commandez')}
              </h3>
              <p className="text-sm text-stone-500">
                {t('shop.howTo.orderDesc', 'Passez votre commande avant jeudi minuit pour une livraison vendredi')}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-bronze-100 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-bronze-600" />
              </div>
              <h3 className="font-medium text-stone-900 mb-2">
                {t('shop.howTo.prepareTitle', 'Préparation')}
              </h3>
              <p className="text-sm text-stone-500">
                {t('shop.howTo.prepareDesc', 'Nous préparons vos produits frais le jour de la livraison')}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-bronze-100 flex items-center justify-center">
                <Truck className="w-6 h-6 text-bronze-600" />
              </div>
              <h3 className="font-medium text-stone-900 mb-2">
                {t('shop.howTo.deliverTitle', 'Livraison')}
              </h3>
              <p className="text-sm text-stone-500">
                {t('shop.howTo.deliverDesc', 'Livraison le vendredi à Jérusalem, à temps pour Shabbat')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
