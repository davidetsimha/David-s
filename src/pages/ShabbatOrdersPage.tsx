import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { ProductFilters } from '../components/shabbat/ProductFilters';
import { ProductGrid } from '../components/shabbat/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useLanguageStore } from '../stores/languageStore';

export function ShabbatOrdersPage() {
  const { t } = useLanguageStore();
  const [categoryId, setCategoryId] = useState<string>();

  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useProducts({
    category_id: categoryId,
    available: true,
  });

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="py-12 px-4 bg-gradient-to-b from-gold-50 to-cream-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 rounded-full mb-4">
            <Calendar className="w-4 h-4 text-gold-600" />
            <span className="text-sm font-medium text-gold-700">
              {t('Commande avant jeudi', 'הזמנה עד יום חמישי')}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-gray-900 mb-3">
            {t('Commandes Shabbat', 'הזמנות שבת')}
          </h1>

          <p className="text-gray-600 max-w-xl mx-auto">
            {t(
              'Patisseries fraiches preparees pour votre Shabbat',
              'מאפים טריים מוכנים לשבת שלכם'
            )}
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ProductFilters
          categories={categories}
          selectedId={categoryId}
          onSelect={setCategoryId}
        />

        <div className="mt-8">
          <ProductGrid products={products} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
