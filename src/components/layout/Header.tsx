import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUIStore, useCartStore } from '../../stores';
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

export function Header() {
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
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300
      ${isScrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
            <span className="font-display text-xl md:text-2xl text-gold-700 tracking-wide
              group-hover:text-gold-800 transition-colors">
              David's
            </span>
            <span className="hidden sm:block text-xs text-gold-500 tracking-widest uppercase">
              Patisserie
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(({ key, route }) => (
              <Link
                key={key}
                to={route}
                className={`relative px-3 py-2 text-sm tracking-wide transition-colors
                  ${location.pathname === route
                    ? 'text-gold-700 font-medium'
                    : 'text-stone-600 hover:text-gold-700'}`}
              >
                {t(`nav.${key}`)}
                {location.pathname === route && (
                  <span className="absolute bottom-0 inset-x-3 h-0.5 bg-gold-400 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block"><LanguageSwitch /></div>
            <CartButton count={itemCount} onClick={openCart} />
            <HamburgerButton onClick={toggleMobileMenu} />
          </div>
        </div>
      </div>
    </header>
  );
}

function CartButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative p-2 text-gold-700 hover:text-gold-900
      transition-colors" aria-label="Cart">
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center
          bg-gold-600 text-white text-xs font-medium rounded-full">{count}</span>
      )}
    </button>
  );
}

function HamburgerButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="lg:hidden p-2 text-gold-700 hover:text-gold-900
      transition-colors" aria-label="Menu">
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
