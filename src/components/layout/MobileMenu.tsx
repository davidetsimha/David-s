import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUIStore, useLanguageStore } from '../../stores';
import { ROUTES } from '../../config/routes';
import { LanguageSwitch } from './LanguageSwitch';

const navItems = [
  { key: 'home', route: ROUTES.HOME },
  { key: 'receptions', route: ROUTES.RECEPTIONS },
  { key: 'shabbat', route: ROUTES.SHABBAT },
  { key: 'gallery', route: ROUTES.GALLERY },
  { key: 'faq', route: ROUTES.FAQ },
  { key: 'contact', route: ROUTES.CONTACT },
] as const;

export function MobileMenu() {
  const { t } = useTranslation();
  const location = useLocation();
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const { direction } = useLanguageStore();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobileMenu}
      />
      <nav
        className={`fixed top-0 ${direction === 'rtl' ? 'left-0' : 'right-0'}
          h-full w-[280px] max-w-[85vw] bg-cream-50 z-50 shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isMobileMenuOpen
            ? 'translate-x-0'
            : direction === 'rtl' ? '-translate-x-full' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full pt-20 pb-8 px-6">
          <ul className="flex-1 space-y-1">
            {navItems.map(({ key, route }, i) => (
              <li key={key} style={{ animationDelay: `${i * 50}ms` }}
                className={isMobileMenuOpen ? 'animate-fade-in-up' : ''}>
                <Link
                  to={route}
                  className={`block py-3 px-4 font-display text-lg tracking-wide rounded-lg
                    transition-colors duration-200
                    ${location.pathname === route
                      ? 'text-gold-700 bg-gold-50'
                      : 'text-stone-700 hover:text-gold-700 hover:bg-cream-100'}`}
                >
                  {t(`nav.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="pt-6 border-t border-gold-100">
            <LanguageSwitch />
          </div>
        </div>
      </nav>
    </>
  );
}
