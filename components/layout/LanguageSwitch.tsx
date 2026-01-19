'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/config';

interface LanguageSwitchProps {
  onLanguageChange?: () => void;
}

export function LanguageSwitch({ onLanguageChange }: LanguageSwitchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;

  const toggleLanguage = () => {
    // Close mobile menu FIRST to prevent slide animation during direction change
    onLanguageChange?.();

    const newLocale: Locale = currentLocale === 'fr' ? 'he' : 'fr';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="group relative px-3 py-1.5 text-sm font-medium tracking-wide
        text-gold-700 hover:text-gold-900 transition-colors duration-200"
      aria-label={currentLocale === 'fr' ? 'Switch to Hebrew' : 'Passer en Francais'}
    >
      <span className="relative z-10 flex items-center gap-1.5">
        <span className={`transition-opacity duration-200 ${currentLocale === 'fr' ? 'opacity-100' : 'opacity-50'}`}>
          FR
        </span>
        <span className="w-px h-3 bg-gold-300" />
        <span className={`transition-opacity duration-200 ${currentLocale === 'he' ? 'opacity-100' : 'opacity-50'}`}>
          HE
        </span>
      </span>
      <span className="absolute inset-0 rounded-full border border-gold-200
        group-hover:border-gold-400 group-hover:bg-gold-50/50
        transition-all duration-200" />
    </button>
  );
}
