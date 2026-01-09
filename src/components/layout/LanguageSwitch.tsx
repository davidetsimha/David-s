import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../../stores';

export function LanguageSwitch() {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  const toggleLanguage = () => {
    const newLang = language === 'fr' ? 'he' : 'fr';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <button
      onClick={toggleLanguage}
      className="group relative px-3 py-1.5 text-sm font-medium tracking-wide
        text-gold-700 hover:text-gold-900 transition-colors duration-300"
      aria-label={language === 'fr' ? 'Switch to Hebrew' : 'Passer en Francais'}
    >
      <span className="relative z-10 flex items-center gap-1.5">
        <span className={`transition-opacity duration-200 ${language === 'fr' ? 'opacity-100' : 'opacity-50'}`}>
          FR
        </span>
        <span className="w-px h-3 bg-gold-300" />
        <span className={`transition-opacity duration-200 ${language === 'he' ? 'opacity-100' : 'opacity-50'}`}>
          HE
        </span>
      </span>
      <span className="absolute inset-0 rounded-full border border-gold-200
        group-hover:border-gold-400 group-hover:bg-gold-50/50
        transition-all duration-300" />
    </button>
  );
}
