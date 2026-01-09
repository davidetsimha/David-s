import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ROUTES } from '../../config/routes';

const products = [
  { id: 1, name: 'Tarte aux Fruits', price: 85, image: '/images/products/tarte.jpg' },
  { id: 2, name: 'Paris-Brest', price: 75, image: '/images/products/paris-brest.jpg' },
  { id: 3, name: 'Opera', price: 95, image: '/images/products/opera.jpg' },
  { id: 4, name: 'Millefeuille', price: 80, image: '/images/products/millefeuille.jpg' },
];

export function ShabbatPreview() {
  const { t, i18n } = useTranslation();
  const Arrow = i18n.language === 'he' ? ArrowLeft : ArrowRight;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold-100/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cream-100/50 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <div className="w-16 h-0.5 bg-gold-500 mb-6" />
            <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-4">
              {t('home.shabbatTitle')}
            </h2>
            <p className="text-gray-600 text-lg max-w-xl">{t('home.shabbatSubtitle')}</p>
          </div>
          <Link to={ROUTES.SHABBAT} className="hidden md:inline-flex items-center gap-2 text-gold-600 font-medium group mt-6 md:mt-0">
            <span>{t('home.viewProducts')}</span>
            <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <Link key={product.id} to={ROUTES.SHABBAT} className="group animate-fade-in-up" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
              <div className="relative aspect-square mb-4 overflow-hidden bg-cream-100">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${product.image})` }} />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="px-6 py-2 bg-white/90 text-gray-900 text-sm font-medium tracking-wider uppercase">{t('products.addToCart')}</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-display text-lg text-gray-900 mb-1 group-hover:text-gold-600 transition-colors">{product.name}</h3>
                <p className="text-gold-600 font-medium">{product.price} ILS</p>
              </div>
            </Link>
          ))}
        </div>

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
