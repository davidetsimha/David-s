import { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguageStore, useUIStore } from '../../stores';
import { ROUTES } from '../../config/routes';
import { LanguageSwitch } from './LanguageSwitch';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import { useState } from 'react';

const eventsNavItems = [
  { key: 'eventsHome', route: ROUTES.EVENTS, label: 'Réceptions' },
  { key: 'eventsGallery', route: ROUTES.EVENTS_GALLERY, label: 'Galerie' },
  { key: 'eventsQuote', route: ROUTES.EVENTS_QUOTE, label: 'Demander un devis' },
  { key: 'about', route: '/evenements/about', label: 'Notre Histoire' },
  { key: 'faq', route: '/evenements/faq', label: 'FAQ' },
  { key: 'contact', route: '/evenements/contact', label: 'Contact' },
] as const;

export function EventsLayout() {
  const { direction, language } = useLanguageStore();
  const { t } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <EventsHeader />
      <EventsMobileMenu />

      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function EventsHeader() {
  const { t } = useTranslation();
  const location = useLocation();
  const { toggleMobileMenu } = useUIStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-200
      ${isScrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-sm' : 'bg-cream-50/80 backdrop-blur-sm'}`}>

      {/* Space indicator bar */}
      <div className="h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - returns to home */}
          <Link to={ROUTES.HOME} className="flex items-center group">
            <img
              src="/images/logo-ds.jpg"
              alt="David's Patisserie"
              className="h-12 md:h-14 w-auto object-contain rounded-full
                group-hover:scale-105 transition-transform duration-200
                ring-2 ring-gold-300/50"
            />
          </Link>

          {/* Events Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation Événements">
            {eventsNavItems.map(({ key, route, label }) => (
              <Link
                key={key}
                to={route}
                className={`relative px-3 py-2 text-sm tracking-wide transition-colors rounded
                  focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:outline-none
                  ${location.pathname === route
                    ? 'text-gold-700 font-medium'
                    : 'text-stone-600 hover:text-gold-700'}`}
              >
                {t(`nav.${key}`, label)}
                {location.pathname === route && (
                  <span className="absolute bottom-0 inset-x-3 h-0.5 bg-gold-400 rounded-full" />
                )}
              </Link>
            ))}

            {/* Switch to Shop */}
            <Link
              to={ROUTES.SHOP}
              className="ml-4 px-4 py-2 text-sm text-bronze-600 hover:text-bronze-700
                border border-bronze-300 hover:border-bronze-400 rounded-lg
                transition-all duration-200 flex items-center gap-2"
            >
              <span>→</span>
              <span>{t('nav.goToShop', 'Boutique')}</span>
            </Link>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitch />
            <HamburgerButton onClick={toggleMobileMenu} />
          </div>
        </div>
      </div>
    </header>
  );
}

function EventsMobileMenu() {
  const { t } = useTranslation();
  const location = useLocation();
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();

  if (!isMobileMenuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
        onClick={closeMobileMenu}
      />

      {/* Menu */}
      <div className="fixed top-0 end-0 z-40 w-80 max-w-full h-full bg-cream-50 shadow-xl">
        {/* Gold bar */}
        <div className="h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />

        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="text-lg font-display text-gold-700">Événements</span>
            <button
              onClick={closeMobileMenu}
              className="p-2 text-stone-500 hover:text-stone-700"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-2">
            {eventsNavItems.map(({ key, route, label }) => (
              <Link
                key={key}
                to={route}
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg transition-colors
                  ${location.pathname === route
                    ? 'bg-gold-100 text-gold-700 font-medium'
                    : 'text-stone-600 hover:bg-gold-50 hover:text-gold-700'}`}
              >
                {t(`nav.${key}`, label)}
              </Link>
            ))}
          </nav>

          {/* Switch to Shop */}
          <div className="mt-8 pt-6 border-t border-stone-200">
            <Link
              to={ROUTES.SHOP}
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-2 px-4 py-3
                bg-bronze-500 text-white rounded-lg hover:bg-bronze-600
                transition-colors"
            >
              <span>→</span>
              <span>{t('nav.goToShop', 'Aller à la Boutique')}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function HamburgerButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 text-gold-700 hover:text-gold-900
        transition-colors rounded focus-visible:ring-2 focus-visible:ring-gold-500"
      aria-label={t('common.menu', 'Menu')}
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
