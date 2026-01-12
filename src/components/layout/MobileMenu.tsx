import { useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores';
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
  const menuRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      return;
    }

    if (e.key !== 'Tab' || !menuRef.current) return;

    const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement?.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement?.focus();
    }
  }, [closeMobileMenu]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus first focusable element in menu
      setTimeout(() => {
        const firstFocusable = menuRef.current?.querySelector<HTMLElement>(
          'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }, 100);

      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      // Return focus to hamburger button
      previousActiveElement.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen, handleKeyDown]);

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  return (
    <>
      <div
        className={`lg:hidden fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />
      <nav
        ref={menuRef}
        aria-label="Mobile navigation"
        className={`lg:hidden fixed top-0 end-0
          h-full w-[280px] max-w-[85vw] bg-cream-50 z-50 shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full'}`}
      >
        <div className="flex flex-col h-full pt-20 pb-8 px-6">
          <ul className="flex-1 space-y-1">
            {navItems.map(({ key, route }, i) => (
              <li key={key} style={{ animationDelay: `${i * 50}ms` }}
                className={isMobileMenuOpen ? 'animate-fade-in-up' : ''}>
                <Link
                  to={route}
                  className={`block py-3 px-4 font-display text-lg tracking-wide rounded-lg
                    transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:outline-none
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
