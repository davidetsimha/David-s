import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { ROUTES } from '../../config/routes';
import { useProducts } from '../../hooks/useProducts';

export function ShabbatPreview() {
  const { t, i18n } = useTranslation();
  const Arrow = i18n.language === 'he' ? ArrowLeft : ArrowRight;

  const { data: products = [], isLoading } = useProducts({ available: true });

  // Take first 4 products for the preview
  const previewProducts = products.slice(0, 4);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 start-0 w-64 h-64 bg-gold-100/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 end-0 w-96 h-96 bg-cream-100/50 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <div className="w-16 h-0.5 bg-gold-500 mb-6" />
            <h2 className="font-display text-4xl md:text-5xl text-stone-900 mb-4">
              {t('home.shabbatTitle')}
            </h2>
            <p className="text-stone-600 text-lg max-w-xl">{t('home.shabbatSubtitle')}</p>
          </div>
          <Link to={ROUTES.SHABBAT} className="hidden md:inline-flex items-center gap-2 text-gold-600 font-medium group mt-6 md:mt-0">
            <span>{t('home.viewProducts')}</span>
            <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {previewProducts.map((product, i) => (
              <Link key={product.id} to={ROUTES.SHABBAT} className="group animate-fade-in-up" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                <div className="relative aspect-square mb-4 overflow-hidden bg-cream-100">
                  {product.image_url ? (
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${product.image_url})` }} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                      <span className="text-4xl">🥐</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
                  {/* Add to Cart overlay - visible on mobile, hover on desktop */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="px-6 py-2 bg-white/90 text-stone-900 text-sm font-medium tracking-wider uppercase">{t('products.addToCart')}</span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-display text-lg text-stone-900 mb-1 group-hover:text-gold-600 transition-colors">
                    {i18n.language === 'he' ? product.name_he : product.name_fr}
                  </h3>
                  <p className="text-gold-600 font-medium">{product.price} ₪</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12 md:hidden">
          <Link to={ROUTES.SHABBAT} className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 text-white font-medium tracking-wider uppercase text-sm hover:bg-gold-600">
            {t('home.viewProducts')}
            <Arrow className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
