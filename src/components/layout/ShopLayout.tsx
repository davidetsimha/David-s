import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguageStore, useUIStore, useCartStore } from '../../stores';
import { ROUTES } from '../../config/routes';
import { LanguageSwitch } from './LanguageSwitch';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import { CartDrawer } from '../cart/CartDrawer';

const shopNavItems = [
  { key: 'shopHome', route: ROUTES.SHOP, label: 'Produits' },
  { key: 'myOrders', route: ROUTES.ORDER_HISTORY, label: 'Mes commandes' },
  { key: 'about', route: '/boutique/about', label: 'Notre Histoire' },
  { key: 'faq', route: '/boutique/faq', label: 'FAQ' },
  { key: 'contact', route: '/boutique/contact', label: 'Contact' },
] as const;

export function ShopLayout() {
  const { direction, language } = useLanguageStore();

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <ShopHeader />
      <ShopMobileMenu />

      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>

      <Footer />
      <WhatsAppButton />
      <CartDrawer />
    </div>
  );
}

function ShopHeader() {
  const { t } = useTranslation();
  const location = useLocation();
  const { toggleMobileMenu } = useUIStore();
  const { totalItems, openCart } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const itemCount = totalItems();

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-200
      ${isScrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-sm' : 'bg-cream-50/80 backdrop-blur-sm'}`}>

      {/* Space indicator bar - Bronze for Shop */}
      <div className="h-1 bg-gradient-to-r from-bronze-400 via-bronze-500 to-bronze-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - returns to home */}
          <Link to={ROUTES.HOME} className="flex items-center group">
            <img
              src="/images/logo-ds.jpg"
              alt="David's Patisserie"
              className="h-12 md:h-14 w-auto object-contain rounded-full
                group-hover:scale-105 transition-transform duration-200
                ring-2 ring-bronze-300/50"
            />
          </Link>

          {/* Shop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label={t('nav.ariaShopNav')}>
            {shopNavItems.map(({ key, route, label }) => (
              <Link
                key={key}
                to={route}
                className={`relative px-3 py-2 text-sm tracking-wide transition-colors rounded
                  focus-visible:ring-2 focus-visible:ring-bronze-500 focus-visible:ring-offset-2 focus-visible:outline-none
                  ${location.pathname === route
                    ? 'text-bronze-700 font-medium'
                    : 'text-stone-600 hover:text-bronze-700'}`}
              >
                {t(`nav.${key}`, label)}
                {location.pathname === route && (
                  <span className="absolute bottom-0 inset-x-3 h-0.5 bg-bronze-400 rounded-full" />
                )}
              </Link>
            ))}

            {/* Switch to Events */}
            <Link
              to={ROUTES.EVENTS}
              className="ml-4 px-4 py-2 text-sm text-gold-600 hover:text-gold-700
                border border-gold-300 hover:border-gold-400 rounded-lg
                transition-all duration-200 flex items-center gap-2"
            >
              <span>→</span>
              <span>{t('nav.goToEvents', 'Événements')}</span>
            </Link>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitch />
            <CartButton count={itemCount} onClick={openCart} />
            <HamburgerButton onClick={toggleMobileMenu} />
          </div>
        </div>
      </div>
    </header>
  );
}

function ShopMobileMenu() {
  const { t } = useTranslation();
  const location = useLocation();
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const { totalItems, openCart } = useCartStore();

  if (!isMobileMenuOpen) return null;

  const itemCount = totalItems();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
        onClick={closeMobileMenu}
      />

      {/* Menu */}
      <div className="fixed top-0 end-0 z-40 w-80 max-w-full h-full bg-cream-50 shadow-xl">
        {/* Bronze bar */}
        <div className="h-1 bg-gradient-to-r from-bronze-400 via-bronze-500 to-bronze-400" />

        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="text-lg font-display text-bronze-700">{t('nav.boutique')}</span>
            <button
              onClick={closeMobileMenu}
              className="p-2 text-stone-500 hover:text-stone-700"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart button */}
          <button
            onClick={() => {
              closeMobileMenu();
              openCart();
            }}
            className="w-full flex items-center justify-between px-4 py-3 mb-4
              bg-bronze-50 border border-bronze-200 rounded-lg
              text-bronze-700 hover:bg-bronze-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>{t('nav.myCart')}</span>
            </span>
            {itemCount > 0 && (
              <span className="px-2 py-0.5 bg-bronze-500 text-white text-sm rounded-full">
                {itemCount}
              </span>
            )}
          </button>

          <nav className="space-y-2">
            {shopNavItems.map(({ key, route, label }) => (
              <Link
                key={key}
                to={route}
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg transition-colors
                  ${location.pathname === route
                    ? 'bg-bronze-100 text-bronze-700 font-medium'
                    : 'text-stone-600 hover:bg-bronze-50 hover:text-bronze-700'}`}
              >
                {t(`nav.${key}`, label)}
              </Link>
            ))}
          </nav>

          {/* Switch to Events */}
          <div className="mt-8 pt-6 border-t border-stone-200">
            <Link
              to={ROUTES.EVENTS}
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-2 px-4 py-3
                bg-gold-500 text-white rounded-lg hover:bg-gold-600
                transition-colors"
            >
              <span>→</span>
              <span>{t('nav.goToEvents', 'Voir les Événements')}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function CartButton({ count, onClick }: { count: number; onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-bronze-700 hover:text-bronze-900
        transition-colors rounded focus-visible:ring-2 focus-visible:ring-bronze-500"
      aria-label={t('cart.title', 'Panier')}
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -end-0.5 w-5 h-5 flex items-center justify-center
          bg-bronze-600 text-white text-xs font-medium rounded-full">{count}</span>
      )}
    </button>
  );
}

function HamburgerButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 text-bronze-700 hover:text-bronze-900
        transition-colors rounded focus-visible:ring-2 focus-visible:ring-bronze-500"
      aria-label={t('common.menu', 'Menu')}
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
