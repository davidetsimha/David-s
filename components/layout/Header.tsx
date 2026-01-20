'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useUIStore, useCartStore } from '@/stores';
import { ROUTES } from '@/config/routes';
import { LanguageSwitch } from './LanguageSwitch';

const navItems = [
  { key: 'home', route: ROUTES.HOME },
  { key: 'about', route: ROUTES.ABOUT },
  { key: 'receptions', route: ROUTES.RECEPTIONS },
  { key: 'shabbat', route: ROUTES.SHABBAT },
  { key: 'gallery', route: ROUTES.GALLERY },
  { key: 'faq', route: ROUTES.FAQ },
  { key: 'contact', route: ROUTES.CONTACT },
] as const;

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const { toggleMobileMenu } = useUIStore();
  const { totalItems, openCart } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const itemCount = totalItems();

  // Remove locale prefix from pathname for comparison
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-200
      ${isScrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center group">
              <img
                src="/images/logo-ds.jpg"
                alt="David's Patisserie"
                className="h-12 md:h-14 w-auto object-contain rounded-full
                  group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
            {/* Certification Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-gold-50 border border-gold-200 rounded-full">
              <svg className="w-4 h-4 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs font-medium text-gold-700 whitespace-nowrap">
                {t('footer.certification')}
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1" aria-label={t('nav.ariaMain')}>
            {navItems.map(({ key, route }) => (
              <Link
                key={key}
                href={route}
                className={`relative px-3 py-2 text-sm tracking-wide transition-colors rounded
                  focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:outline-none
                  ${pathWithoutLocale === route
                    ? 'text-gold-700 font-medium'
                    : 'text-stone-600 hover:text-gold-700'}`}
              >
                {t(`nav.${key}`)}
                {pathWithoutLocale === route && (
                  <span className="absolute bottom-0 inset-x-3 h-0.5 bg-gold-400 rounded-full" />
                )}
              </Link>
            ))}
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

function CartButton({ count, onClick }: { count: number; onClick: () => void }) {
  const t = useTranslations();
  return (
    <button onClick={onClick} className="relative p-2 text-gold-700 hover:text-gold-900
      transition-colors rounded focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:outline-none" aria-label={t('cart.title')}>
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -end-0.5 w-5 h-5 flex items-center justify-center
          bg-gold-600 text-white text-xs font-medium rounded-full">{count}</span>
      )}
    </button>
  );
}

function HamburgerButton({ onClick }: { onClick: () => void }) {
  const t = useTranslations();
  return (
    <button onClick={onClick} className="lg:hidden p-2 text-gold-700 hover:text-gold-900
      transition-colors rounded focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:outline-none" aria-label={t('common.menu')}>
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
